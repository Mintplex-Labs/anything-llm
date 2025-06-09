import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace adexchangebuyer2_v2beta1 {
    export interface Options extends GlobalOptions {
        version: 'v2beta1';
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
     * Ad Exchange Buyer API II
     *
     * Accesses the latest features for managing Authorized Buyers accounts, Real-Time Bidding configurations and auction metrics, and Marketplace programmatic deals.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const adexchangebuyer2 = google.adexchangebuyer2('v2beta1');
     * ```
     */
    export class Adexchangebuyer2 {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        bidders: Resource$Bidders;
        buyers: Resource$Buyers;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An absolute date range, specified by its start date and end date. The supported range of dates begins 30 days before today and ends today. Validity checked upon filter set creation. If a filter set with an absolute date range is run at a later date more than 30 days after start_date, it will fail.
     */
    export interface Schema$AbsoluteDateRange {
        /**
         * The end date of the range (inclusive). Must be within the 30 days leading up to current date, and must be equal to or after start_date.
         */
        endDate?: Schema$Date;
        /**
         * The start date of the range (inclusive). Must be within the 30 days leading up to current date, and must be equal to or before end_date.
         */
        startDate?: Schema$Date;
    }
    /**
     * Request to accept a proposal.
     */
    export interface Schema$AcceptProposalRequest {
        /**
         * The last known client revision number of the proposal.
         */
        proposalRevision?: string | null;
    }
    /**
     * A request for associating a deal and a creative.
     */
    export interface Schema$AddDealAssociationRequest {
        /**
         * The association between a creative and a deal that should be added.
         */
        association?: Schema$CreativeDealAssociation;
    }
    /**
     * Request message for adding a note to a given proposal.
     */
    export interface Schema$AddNoteRequest {
        /**
         * Details of the note to add.
         */
        note?: Schema$Note;
    }
    /**
     * Represents size of a single ad slot, or a creative.
     */
    export interface Schema$AdSize {
        /**
         * The height of the ad slot in pixels. This field will be present only when size type is `PIXEL`.
         */
        height?: string | null;
        /**
         * The size type of the ad slot.
         */
        sizeType?: string | null;
        /**
         * The width of the ad slot in pixels. This field will be present only when size type is `PIXEL`.
         */
        width?: string | null;
    }
    /**
     * Detected ad technology provider information.
     */
    export interface Schema$AdTechnologyProviders {
        /**
         * The detected ad technology provider IDs for this creative. See https://storage.googleapis.com/adx-rtb-dictionaries/providers.csv for mapping of provider ID to provided name, a privacy policy URL, and a list of domains which can be attributed to the provider. If the creative contains provider IDs that are outside of those listed in the `BidRequest.adslot.consented_providers_settings.consented_providers` field on the (Google bid protocol)[https://developers.google.com/authorized-buyers/rtb/downloads/realtime-bidding-proto] and the `BidRequest.user.ext.consented_providers_settings.consented_providers` field on the (OpenRTB protocol)[https://developers.google.com/authorized-buyers/rtb/downloads/openrtb-adx-proto], and a bid is submitted with that creative for an impression that will serve to an EEA user, the bid will be filtered before the auction.
         */
        detectedProviderIds?: string[] | null;
        /**
         * Whether the creative contains an unidentified ad technology provider. If true for a given creative, any bid submitted with that creative for an impression that will serve to an EEA user will be filtered before the auction.
         */
        hasUnidentifiedProvider?: boolean | null;
    }
    /**
     * Output only. The app type the restriction applies to for mobile device.
     */
    export interface Schema$AppContext {
        /**
         * The app types this restriction applies to.
         */
        appTypes?: string[] | null;
    }
    /**
     * Output only. The auction type the restriction applies to.
     */
    export interface Schema$AuctionContext {
        /**
         * The auction types this restriction applies to.
         */
        auctionTypes?: string[] | null;
    }
    /**
     * The set of metrics that are measured in numbers of bids, representing how many bids with the specified dimension values were considered eligible at each stage of the bidding funnel;
     */
    export interface Schema$BidMetricsRow {
        /**
         * The number of bids that Ad Exchange received from the buyer.
         */
        bids?: Schema$MetricValue;
        /**
         * The number of bids that were permitted to compete in the auction.
         */
        bidsInAuction?: Schema$MetricValue;
        /**
         * The number of bids for which the buyer was billed. Also called valid impressions as invalid impressions are not billed.
         */
        billedImpressions?: Schema$MetricValue;
        /**
         * The number of bids that won the auction.
         */
        impressionsWon?: Schema$MetricValue;
        /**
         * The number of bids for which the corresponding impression was measurable for viewability (as defined by Active View).
         */
        measurableImpressions?: Schema$MetricValue;
        /**
         * The number of bids that won the auction and also won the mediation waterfall (if any).
         */
        reachedQueries?: Schema$MetricValue;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
        /**
         * The number of bids for which the corresponding impression was viewable (as defined by Active View).
         */
        viewableImpressions?: Schema$MetricValue;
    }
    /**
     * The number of impressions with the specified dimension values that were considered to have no applicable bids, as described by the specified status.
     */
    export interface Schema$BidResponseWithoutBidsStatusRow {
        /**
         * The number of impressions for which there was a bid response with the specified status.
         */
        impressionCount?: Schema$MetricValue;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
        /**
         * The status specifying why the bid responses were considered to have no applicable bids.
         */
        status?: string | null;
    }
    /**
     * Represents a buyer of inventory. Each buyer is identified by a unique Authorized Buyers account ID.
     */
    export interface Schema$Buyer {
        /**
         * Authorized Buyers account ID of the buyer.
         */
        accountId?: string | null;
    }
    /**
     * The number of impressions with the specified dimension values where the corresponding bid request or bid response was not successful, as described by the specified callout status.
     */
    export interface Schema$CalloutStatusRow {
        /**
         * The ID of the callout status. See [callout-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/callout-status-codes).
         */
        calloutStatusId?: number | null;
        /**
         * The number of impressions for which there was a bid request or bid response with the specified callout status.
         */
        impressionCount?: Schema$MetricValue;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
    }
    /**
     * Request to cancel an ongoing negotiation.
     */
    export interface Schema$CancelNegotiationRequest {
    }
    /**
     * A client resource represents a client buyer—an agency, a brand, or an advertiser customer of the sponsor buyer. Users associated with the client buyer have restricted access to the Marketplace and certain other sections of the Authorized Buyers UI based on the role granted to the client buyer. All fields are required unless otherwise specified.
     */
    export interface Schema$Client {
        /**
         * The globally-unique numerical ID of the client. The value of this field is ignored in create and update operations.
         */
        clientAccountId?: string | null;
        /**
         * Name used to represent this client to publishers. You may have multiple clients that map to the same entity, but for each client the combination of `clientName` and entity must be unique. You can specify this field as empty. Maximum length of 255 characters is allowed.
         */
        clientName?: string | null;
        /**
         * Numerical identifier of the client entity. The entity can be an advertiser, a brand, or an agency. This identifier is unique among all the entities with the same type. The value of this field is ignored if the entity type is not provided. A list of all known advertisers with their identifiers is available in the [advertisers.txt](https://storage.googleapis.com/adx-rtb-dictionaries/advertisers.txt) file. A list of all known brands with their identifiers is available in the [brands.txt](https://storage.googleapis.com/adx-rtb-dictionaries/brands.txt) file. A list of all known agencies with their identifiers is available in the [agencies.txt](https://storage.googleapis.com/adx-rtb-dictionaries/agencies.txt) file.
         */
        entityId?: string | null;
        /**
         * The name of the entity. This field is automatically fetched based on the type and ID. The value of this field is ignored in create and update operations.
         */
        entityName?: string | null;
        /**
         * An optional field for specifying the type of the client entity: `ADVERTISER`, `BRAND`, or `AGENCY`.
         */
        entityType?: string | null;
        /**
         * Optional arbitrary unique identifier of this client buyer from the standpoint of its Ad Exchange sponsor buyer. This field can be used to associate a client buyer with the identifier in the namespace of its sponsor buyer, lookup client buyers by that identifier and verify whether an Ad Exchange counterpart of a given client buyer already exists. If present, must be unique among all the client buyers for its Ad Exchange sponsor buyer.
         */
        partnerClientId?: string | null;
        /**
         * The role which is assigned to the client buyer. Each role implies a set of permissions granted to the client. Must be one of `CLIENT_DEAL_VIEWER`, `CLIENT_DEAL_NEGOTIATOR` or `CLIENT_DEAL_APPROVER`.
         */
        role?: string | null;
        /**
         * The status of the client buyer.
         */
        status?: string | null;
        /**
         * Whether the client buyer will be visible to sellers.
         */
        visibleToSeller?: boolean | null;
    }
    /**
     * A client user is created under a client buyer and has restricted access to the Marketplace and certain other sections of the Authorized Buyers UI based on the role granted to the associated client buyer. The only way a new client user can be created is through accepting an email invitation (see the accounts.clients.invitations.create method). All fields are required unless otherwise specified.
     */
    export interface Schema$ClientUser {
        /**
         * Numerical account ID of the client buyer with which the user is associated; the buyer must be a client of the current sponsor buyer. The value of this field is ignored in an update operation.
         */
        clientAccountId?: string | null;
        /**
         * User's email address. The value of this field is ignored in an update operation.
         */
        email?: string | null;
        /**
         * The status of the client user.
         */
        status?: string | null;
        /**
         * The unique numerical ID of the client user that has accepted an invitation. The value of this field is ignored in an update operation.
         */
        userId?: string | null;
    }
    /**
     * An invitation for a new client user to get access to the Authorized Buyers UI. All fields are required unless otherwise specified.
     */
    export interface Schema$ClientUserInvitation {
        /**
         * Numerical account ID of the client buyer that the invited user is associated with. The value of this field is ignored in create operations.
         */
        clientAccountId?: string | null;
        /**
         * The email address to which the invitation is sent. Email addresses should be unique among all client users under each sponsor buyer.
         */
        email?: string | null;
        /**
         * The unique numerical ID of the invitation that is sent to the user. The value of this field is ignored in create operations.
         */
        invitationId?: string | null;
    }
    /**
     * Request message for indicating that the proposal's setup step is complete.
     */
    export interface Schema$CompleteSetupRequest {
    }
    /**
     * Contains information on how a buyer or seller can be reached.
     */
    export interface Schema$ContactInformation {
        /**
         * Email address for the contact.
         */
        email?: string | null;
        /**
         * The name of the contact.
         */
        name?: string | null;
    }
    /**
     * Output only. Shows any corrections that were applied to this creative.
     */
    export interface Schema$Correction {
        /**
         * The contexts for the correction.
         */
        contexts?: Schema$ServingContext[];
        /**
         * Additional details about what was corrected.
         */
        details?: string[] | null;
        /**
         * The type of correction that was applied to the creative.
         */
        type?: string | null;
    }
    /**
     * A creative and its classification data.
     */
    export interface Schema$Creative {
        /**
         * The account that this creative belongs to. Can be used to filter the response of the creatives.list method.
         */
        accountId?: string | null;
        /**
         * The link to AdChoices destination page.
         */
        adChoicesDestinationUrl?: string | null;
        /**
         * Output only. The detected ad technology providers.
         */
        adTechnologyProviders?: Schema$AdTechnologyProviders;
        /**
         * The name of the company being advertised in the creative.
         */
        advertiserName?: string | null;
        /**
         * The agency ID for this creative.
         */
        agencyId?: string | null;
        /**
         * Output only. The last update timestamp of the creative through the API.
         */
        apiUpdateTime?: string | null;
        /**
         * All attributes for the ads that may be shown from this creative. Can be used to filter the response of the creatives.list method.
         */
        attributes?: string[] | null;
        /**
         * The set of destination URLs for the creative.
         */
        clickThroughUrls?: string[] | null;
        /**
         * Output only. Shows any corrections that were applied to this creative.
         */
        corrections?: Schema$Correction[];
        /**
         * The buyer-defined creative ID of this creative. Can be used to filter the response of the creatives.list method.
         */
        creativeId?: string | null;
        /**
         * Output only. The top-level deals status of this creative. If disapproved, an entry for 'auctionType=DIRECT_DEALS' (or 'ALL') in serving_restrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case, it may be preferable to read from serving_restrictions directly. Can be used to filter the response of the creatives.list method.
         */
        dealsStatus?: string | null;
        /**
         * The set of declared destination URLs for the creative.
         */
        declaredClickThroughUrls?: string[] | null;
        /**
         * Output only. Detected advertiser IDs, if any.
         */
        detectedAdvertiserIds?: string[] | null;
        /**
         * Output only. The detected domains for this creative.
         */
        detectedDomains?: string[] | null;
        /**
         * Output only. The detected languages for this creative. The order is arbitrary. The codes are 2 or 5 characters and are documented at https://developers.google.com/adwords/api/docs/appendix/languagecodes.
         */
        detectedLanguages?: string[] | null;
        /**
         * Output only. Detected product categories, if any. See the ad-product-categories.txt file in the technical documentation for a list of IDs.
         */
        detectedProductCategories?: number[] | null;
        /**
         * Output only. Detected sensitive categories, if any. See the ad-sensitive-categories.txt file in the technical documentation for a list of IDs. You should use these IDs along with the excluded-sensitive-category field in the bid request to filter your bids.
         */
        detectedSensitiveCategories?: number[] | null;
        /**
         * An HTML creative.
         */
        html?: Schema$HtmlContent;
        /**
         * The set of URLs to be called to record an impression.
         */
        impressionTrackingUrls?: string[] | null;
        /**
         * A native creative.
         */
        native?: Schema$NativeContent;
        /**
         * Output only. The top-level open auction status of this creative. If disapproved, an entry for 'auctionType = OPEN_AUCTION' (or 'ALL') in serving_restrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case, it may be preferable to read from serving_restrictions directly. Can be used to filter the response of the creatives.list method.
         */
        openAuctionStatus?: string | null;
        /**
         * All restricted categories for the ads that may be shown from this creative.
         */
        restrictedCategories?: string[] | null;
        /**
         * Output only. The granular status of this ad in specific contexts. A context here relates to where something ultimately serves (for example, a physical location, a platform, an HTTPS versus HTTP request, or the type of auction).
         */
        servingRestrictions?: Schema$ServingRestriction[];
        /**
         * All vendor IDs for the ads that may be shown from this creative. See https://storage.googleapis.com/adx-rtb-dictionaries/vendors.txt for possible values.
         */
        vendorIds?: number[] | null;
        /**
         * Output only. The version of this creative.
         */
        version?: number | null;
        /**
         * A video creative.
         */
        video?: Schema$VideoContent;
    }
    /**
     * The association between a creative and a deal.
     */
    export interface Schema$CreativeDealAssociation {
        /**
         * The account the creative belongs to.
         */
        accountId?: string | null;
        /**
         * The ID of the creative associated with the deal.
         */
        creativeId?: string | null;
        /**
         * The externalDealId for the deal associated with the creative.
         */
        dealsId?: string | null;
    }
    /**
     * Represents creative restrictions associated to Programmatic Guaranteed/ Preferred Deal in Ad Manager. This doesn't apply to Private Auction and AdX Preferred Deals.
     */
    export interface Schema$CreativeRestrictions {
        /**
         * The format of the environment that the creatives will be displayed in.
         */
        creativeFormat?: string | null;
        creativeSpecifications?: Schema$CreativeSpecification[];
        /**
         * Skippable video ads allow viewers to skip ads after 5 seconds.
         */
        skippableAdType?: string | null;
    }
    /**
     * Specifies the size of the creative.
     */
    export interface Schema$CreativeSize {
        /**
         * What formats are allowed by the publisher. If this repeated field is empty then all formats are allowed. For example, if this field contains AllowedFormatType.AUDIO then the publisher only allows an audio ad (without any video).
         */
        allowedFormats?: string[] | null;
        /**
         * For video creatives specifies the sizes of companion ads (if present). Companion sizes may be filled in only when creative_size_type = VIDEO
         */
        companionSizes?: Schema$Size[];
        /**
         * The creative size type.
         */
        creativeSizeType?: string | null;
        /**
         * Output only. The native template for this creative. It will have a value only if creative_size_type = CreativeSizeType.NATIVE.
         */
        nativeTemplate?: string | null;
        /**
         * For regular or video creative size type, specifies the size of the creative
         */
        size?: Schema$Size;
        /**
         * The type of skippable ad for this creative. It will have a value only if creative_size_type = CreativeSizeType.VIDEO.
         */
        skippableAdType?: string | null;
    }
    /**
     * Represents information for a creative that is associated with a Programmatic Guaranteed/Preferred Deal in Ad Manager.
     */
    export interface Schema$CreativeSpecification {
        /**
         * Companion sizes may be filled in only when this is a video creative.
         */
        creativeCompanionSizes?: Schema$AdSize[];
        /**
         * The size of the creative.
         */
        creativeSize?: Schema$AdSize;
    }
    /**
     * The number of bids with the specified dimension values that did not win the auction (either were filtered pre-auction or lost the auction), as described by the specified creative status.
     */
    export interface Schema$CreativeStatusRow {
        /**
         * The number of bids with the specified status.
         */
        bidCount?: Schema$MetricValue;
        /**
         * The ID of the creative status. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes).
         */
        creativeStatusId?: number | null;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
    }
    /**
     * Generic targeting used for targeting dimensions that contains a list of included and excluded numeric IDs.
     */
    export interface Schema$CriteriaTargeting {
        /**
         * A list of numeric IDs to be excluded.
         */
        excludedCriteriaIds?: string[] | null;
        /**
         * A list of numeric IDs to be included.
         */
        targetedCriteriaIds?: string[] | null;
    }
    /**
     * Represents a whole or partial calendar date, such as a birthday. The time of day and time zone are either specified elsewhere or are insignificant. The date is relative to the Gregorian Calendar. This can represent one of the following: * A full date, with non-zero year, month, and day values. * A month and day, with a zero year (for example, an anniversary). * A year on its own, with a zero month and a zero day. * A year and month, with a zero day (for example, a credit card expiration date). Related types: * google.type.TimeOfDay * google.type.DateTime * google.protobuf.Timestamp
     */
    export interface Schema$Date {
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
     * Daypart targeting message that specifies if the ad can be shown only during certain parts of a day/week.
     */
    export interface Schema$DayPart {
        /**
         * The day of the week to target. If unspecified, applicable to all days.
         */
        dayOfWeek?: string | null;
        /**
         * The ending time of the day for the ad to show (minute level granularity). The end time is exclusive. This field is not available for filtering in PQL queries.
         */
        endTime?: Schema$TimeOfDay;
        /**
         * The starting time of day for the ad to show (minute level granularity). The start time is inclusive. This field is not available for filtering in PQL queries.
         */
        startTime?: Schema$TimeOfDay;
    }
    /**
     * Specifies the day part targeting criteria.
     */
    export interface Schema$DayPartTargeting {
        /**
         * A list of day part targeting criterion.
         */
        dayParts?: Schema$DayPart[];
        /**
         * The timezone to use for interpreting the day part targeting.
         */
        timeZoneType?: string | null;
    }
    /**
     * A deal represents a segment of inventory for displaying ads on. A proposal can contain multiple deals. A deal contains the terms and targeting information that is used for serving.
     */
    export interface Schema$Deal {
        /**
         * Proposed flight end time of the deal. This will generally be stored in a granularity of a second. A value is not required for Private Auction deals or Preferred Deals.
         */
        availableEndTime?: string | null;
        /**
         * Optional. Proposed flight start time of the deal. This will generally be stored in the granularity of one second since deal serving starts at seconds boundary. Any time specified with more granularity (for example, in milliseconds) will be truncated towards the start of time in seconds.
         */
        availableStartTime?: string | null;
        /**
         * Buyer private data (hidden from seller).
         */
        buyerPrivateData?: Schema$PrivateData;
        /**
         * The product ID from which this deal was created. Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        createProductId?: string | null;
        /**
         * Optional. Revision number of the product that the deal was created from. If present on create, and the server `product_revision` has advanced since the passed-in `create_product_revision`, an `ABORTED` error will be returned. Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        createProductRevision?: string | null;
        /**
         * Output only. The time of the deal creation.
         */
        createTime?: string | null;
        /**
         * Output only. Specifies the creative pre-approval policy.
         */
        creativePreApprovalPolicy?: string | null;
        /**
         * Output only. Restricitions about the creatives associated with the deal (for example, size) This is available for Programmatic Guaranteed/Preferred Deals in Ad Manager.
         */
        creativeRestrictions?: Schema$CreativeRestrictions;
        /**
         * Output only. Specifies whether the creative is safeFrame compatible.
         */
        creativeSafeFrameCompatibility?: string | null;
        /**
         * Output only. A unique deal ID for the deal (server-assigned).
         */
        dealId?: string | null;
        /**
         * Output only. Metadata about the serving status of this deal.
         */
        dealServingMetadata?: Schema$DealServingMetadata;
        /**
         * The negotiable terms of the deal.
         */
        dealTerms?: Schema$DealTerms;
        /**
         * The set of fields around delivery control that are interesting for a buyer to see but are non-negotiable. These are set by the publisher.
         */
        deliveryControl?: Schema$DeliveryControl;
        /**
         * Description for the deal terms.
         */
        description?: string | null;
        /**
         * The name of the deal.
         */
        displayName?: string | null;
        /**
         * Output only. The external deal ID assigned to this deal once the deal is finalized. This is the deal ID that shows up in serving/reporting etc.
         */
        externalDealId?: string | null;
        /**
         * Output only. True, if the buyside inventory setup is complete for this deal.
         */
        isSetupComplete?: boolean | null;
        /**
         * Output only. Specifies the creative source for programmatic deals. PUBLISHER means creative is provided by seller and ADVERTISER means creative is provided by buyer.
         */
        programmaticCreativeSource?: string | null;
        /**
         * Output only. ID of the proposal that this deal is part of.
         */
        proposalId?: string | null;
        /**
         * Output only. Seller contact information for the deal.
         */
        sellerContacts?: Schema$ContactInformation[];
        /**
         * The syndication product associated with the deal. Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        syndicationProduct?: string | null;
        /**
         * Output only. Specifies the subset of inventory targeted by the deal.
         */
        targeting?: Schema$MarketplaceTargeting;
        /**
         * The shared targeting visible to buyers and sellers. Each shared targeting entity is AND'd together.
         */
        targetingCriterion?: Schema$TargetingCriteria[];
        /**
         * Output only. The time when the deal was last updated.
         */
        updateTime?: string | null;
        /**
         * The web property code for the seller copied over from the product.
         */
        webPropertyCode?: string | null;
    }
    /**
     * Tracks which parties (if any) have paused a deal. The deal is considered paused if either hasBuyerPaused or hasSellPaused is true.
     */
    export interface Schema$DealPauseStatus {
        /**
         * The buyer's reason for pausing, if the buyer paused the deal.
         */
        buyerPauseReason?: string | null;
        /**
         * The role of the person who first paused this deal.
         */
        firstPausedBy?: string | null;
        /**
         * True, if the buyer has paused the deal unilaterally.
         */
        hasBuyerPaused?: boolean | null;
        /**
         * True, if the seller has paused the deal unilaterally.
         */
        hasSellerPaused?: boolean | null;
        /**
         * The seller's reason for pausing, if the seller paused the deal.
         */
        sellerPauseReason?: string | null;
    }
    /**
     * Message captures metadata about the serving status of a deal.
     */
    export interface Schema$DealServingMetadata {
        /**
         * Output only. Tracks which parties (if any) have paused a deal.
         */
        dealPauseStatus?: Schema$DealPauseStatus;
    }
    /**
     * The deal terms specify the details of a Product/deal. They specify things like price per buyer, the type of pricing model (for example, fixed price, auction) and expected impressions from the publisher.
     */
    export interface Schema$DealTerms {
        /**
         * Visibility of the URL in bid requests. (default: BRANDED)
         */
        brandingType?: string | null;
        /**
         * Publisher provided description for the terms.
         */
        description?: string | null;
        /**
         * Non-binding estimate of the estimated gross spend for this deal. Can be set by buyer or seller.
         */
        estimatedGrossSpend?: Schema$Price;
        /**
         * Non-binding estimate of the impressions served per day. Can be set by buyer or seller.
         */
        estimatedImpressionsPerDay?: string | null;
        /**
         * The terms for guaranteed fixed price deals.
         */
        guaranteedFixedPriceTerms?: Schema$GuaranteedFixedPriceTerms;
        /**
         * The terms for non-guaranteed auction deals.
         */
        nonGuaranteedAuctionTerms?: Schema$NonGuaranteedAuctionTerms;
        /**
         * The terms for non-guaranteed fixed price deals.
         */
        nonGuaranteedFixedPriceTerms?: Schema$NonGuaranteedFixedPriceTerms;
        /**
         * The time zone name. For deals with Cost Per Day billing, defines the time zone used to mark the boundaries of a day. It should be an IANA TZ name, such as "America/Los_Angeles". For more information, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
         */
        sellerTimeZone?: string | null;
    }
    /**
     * Message contains details about how the deals will be paced.
     */
    export interface Schema$DeliveryControl {
        /**
         * Output only. Specified the creative blocking levels to be applied.
         */
        creativeBlockingLevel?: string | null;
        /**
         * Output only. Specifies how the impression delivery will be paced.
         */
        deliveryRateType?: string | null;
        /**
         * Output only. Specifies any frequency caps.
         */
        frequencyCaps?: Schema$FrequencyCap[];
    }
    /**
     * Output only. The reason and details for a disapproval.
     */
    export interface Schema$Disapproval {
        /**
         * Additional details about the reason for disapproval.
         */
        details?: string[] | null;
        /**
         * The categorized reason for disapproval.
         */
        reason?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The number of filtered bids with the specified dimension values that have the specified creative.
     */
    export interface Schema$FilteredBidCreativeRow {
        /**
         * The number of bids with the specified creative.
         */
        bidCount?: Schema$MetricValue;
        /**
         * The ID of the creative.
         */
        creativeId?: string | null;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
    }
    /**
     * The number of filtered bids with the specified dimension values, among those filtered due to the requested filtering reason (for example, creative status), that have the specified detail.
     */
    export interface Schema$FilteredBidDetailRow {
        /**
         * The number of bids with the specified detail.
         */
        bidCount?: Schema$MetricValue;
        /**
         * The ID of the detail, can be numeric or text. The associated value can be looked up in the dictionary file corresponding to the DetailType in the response message.
         */
        detail?: string | null;
        /**
         * Note: this field will be deprecated, use "detail" field instead. When "detail" field represents an integer value, this field is populated as the same integer value "detail" field represents, otherwise this field will be 0. The ID of the detail. The associated value can be looked up in the dictionary file corresponding to the DetailType in the response message.
         */
        detailId?: number | null;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
    }
    /**
     * A set of filters that is applied to a request for data. Within a filter set, an AND operation is performed across the filters represented by each field. An OR operation is performed across the filters represented by the multiple values of a repeated field, for example, "format=VIDEO AND deal_id=12 AND (seller_network_id=34 OR seller_network_id=56)".
     */
    export interface Schema$FilterSet {
        /**
         * An absolute date range, defined by a start date and an end date. Interpreted relative to Pacific time zone.
         */
        absoluteDateRange?: Schema$AbsoluteDateRange;
        /**
         * The set of dimensions along which to break down the response; may be empty. If multiple dimensions are requested, the breakdown is along the Cartesian product of the requested dimensions.
         */
        breakdownDimensions?: string[] | null;
        /**
         * The ID of the creative on which to filter; optional. This field may be set only for a filter set that accesses account-level troubleshooting data, for example, one whose name matches the `bidders/x/accounts/x/filterSets/x` pattern.
         */
        creativeId?: string | null;
        /**
         * The ID of the deal on which to filter; optional. This field may be set only for a filter set that accesses account-level troubleshooting data, for example, one whose name matches the `bidders/x/accounts/x/filterSets/x` pattern.
         */
        dealId?: string | null;
        /**
         * The environment on which to filter; optional.
         */
        environment?: string | null;
        /**
         * Creative format bidded on or allowed to bid on, can be empty.
         */
        format?: string | null;
        /**
         * Creative formats bidded on or allowed to bid on, can be empty. Although this field is a list, it can only be populated with a single item. A HTTP 400 bad request error will be returned in the response if you specify multiple items.
         */
        formats?: string[] | null;
        /**
         * A user-defined name of the filter set. Filter set names must be unique globally and match one of the patterns: - `bidders/x/filterSets/x` (for accessing bidder-level troubleshooting data) - `bidders/x/accounts/x/filterSets/x` (for accessing account-level troubleshooting data) This field is required in create operations.
         */
        name?: string | null;
        /**
         * The list of platforms on which to filter; may be empty. The filters represented by multiple platforms are ORed together (for example, if non-empty, results must match any one of the platforms).
         */
        platforms?: string[] | null;
        /**
         * For Open Bidding partners only. The list of publisher identifiers on which to filter; may be empty. The filters represented by multiple publisher identifiers are ORed together.
         */
        publisherIdentifiers?: string[] | null;
        /**
         * An open-ended realtime time range, defined by the aggregation start timestamp.
         */
        realtimeTimeRange?: Schema$RealtimeTimeRange;
        /**
         * A relative date range, defined by an offset from today and a duration. Interpreted relative to Pacific time zone.
         */
        relativeDateRange?: Schema$RelativeDateRange;
        /**
         * For Authorized Buyers only. The list of IDs of the seller (publisher) networks on which to filter; may be empty. The filters represented by multiple seller network IDs are ORed together (for example, if non-empty, results must match any one of the publisher networks). See [seller-network-ids](https://developers.google.com/authorized-buyers/rtb/downloads/seller-network-ids) file for the set of existing seller network IDs.
         */
        sellerNetworkIds?: number[] | null;
        /**
         * The granularity of time intervals if a time series breakdown is preferred; optional.
         */
        timeSeriesGranularity?: string | null;
    }
    /**
     * Represents a list of targeted and excluded mobile application IDs that publishers own. Mobile application IDs are from App Store and Google Play Store. Android App ID, for example, com.google.android.apps.maps, can be found in Google Play Store URL. iOS App ID (which is a number) can be found at the end of iTunes store URL. First party mobile applications is either included or excluded.
     */
    export interface Schema$FirstPartyMobileApplicationTargeting {
        /**
         * A list of application IDs to be excluded.
         */
        excludedAppIds?: string[] | null;
        /**
         * A list of application IDs to be included.
         */
        targetedAppIds?: string[] | null;
    }
    /**
     * Frequency cap.
     */
    export interface Schema$FrequencyCap {
        /**
         * The maximum number of impressions that can be served to a user within the specified time period.
         */
        maxImpressions?: number | null;
        /**
         * The amount of time, in the units specified by time_unit_type. Defines the amount of time over which impressions per user are counted and capped.
         */
        numTimeUnits?: number | null;
        /**
         * The time unit. Along with num_time_units defines the amount of time over which impressions per user are counted and capped.
         */
        timeUnitType?: string | null;
    }
    /**
     * Terms for Programmatic Guaranteed Deals.
     */
    export interface Schema$GuaranteedFixedPriceTerms {
        /**
         * Fixed price for the specified buyer.
         */
        fixedPrices?: Schema$PricePerBuyer[];
        /**
         * Guaranteed impressions as a percentage. This is the percentage of guaranteed looks that the buyer is guaranteeing to buy.
         */
        guaranteedImpressions?: string | null;
        /**
         * Count of guaranteed looks. Required for deal, optional for product. For CPD deals, buyer changes to guaranteed_looks will be ignored.
         */
        guaranteedLooks?: string | null;
        /**
         * The lifetime impression cap for CPM sponsorship deals. The deal will stop serving when the cap is reached.
         */
        impressionCap?: string | null;
        /**
         * Daily minimum looks for CPD deal types. For CPD deals, buyer should negotiate on this field instead of guaranteed_looks.
         */
        minimumDailyLooks?: string | null;
        /**
         * For sponsorship deals, this is the percentage of the seller's eligible impressions that the deal will serve until the cap is reached.
         */
        percentShareOfVoice?: string | null;
        /**
         * The reservation type for a Programmatic Guaranteed deal. This indicates whether the number of impressions is fixed, or a percent of available impressions. If not specified, the default reservation type is STANDARD.
         */
        reservationType?: string | null;
    }
    /**
     * HTML content for a creative.
     */
    export interface Schema$HtmlContent {
        /**
         * The height of the HTML snippet in pixels.
         */
        height?: number | null;
        /**
         * The HTML snippet that displays the ad when inserted in the web page.
         */
        snippet?: string | null;
        /**
         * The width of the HTML snippet in pixels.
         */
        width?: number | null;
    }
    /**
     * An image resource. You may provide a larger image than was requested, so long as the aspect ratio is preserved.
     */
    export interface Schema$Image {
        /**
         * Image height in pixels.
         */
        height?: number | null;
        /**
         * The URL of the image.
         */
        url?: string | null;
        /**
         * Image width in pixels.
         */
        width?: number | null;
    }
    /**
     * The set of metrics that are measured in numbers of impressions, representing how many impressions with the specified dimension values were considered eligible at each stage of the bidding funnel.
     */
    export interface Schema$ImpressionMetricsRow {
        /**
         * The number of impressions available to the buyer on Ad Exchange. In some cases this value may be unavailable.
         */
        availableImpressions?: Schema$MetricValue;
        /**
         * The number of impressions for which Ad Exchange sent the buyer a bid request.
         */
        bidRequests?: Schema$MetricValue;
        /**
         * The number of impressions that match the buyer's inventory pretargeting.
         */
        inventoryMatches?: Schema$MetricValue;
        /**
         * The number of impressions for which Ad Exchange received a response from the buyer that contained at least one applicable bid.
         */
        responsesWithBids?: Schema$MetricValue;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
        /**
         * The number of impressions for which the buyer successfully sent a response to Ad Exchange.
         */
        successfulResponses?: Schema$MetricValue;
    }
    /**
     * Represents the size of an ad unit that can be targeted on an ad request. It only applies to Private Auction, AdX Preferred Deals and Auction Packages. This targeting does not apply to Programmatic Guaranteed and Preferred Deals in Ad Manager.
     */
    export interface Schema$InventorySizeTargeting {
        /**
         * A list of inventory sizes to be excluded.
         */
        excludedInventorySizes?: Schema$AdSize[];
        /**
         * A list of inventory sizes to be included.
         */
        targetedInventorySizes?: Schema$AdSize[];
    }
    /**
     * Response message for listing the metrics that are measured in number of bids.
     */
    export interface Schema$ListBidMetricsResponse {
        /**
         * List of rows, each containing a set of bid metrics.
         */
        bidMetricsRows?: Schema$BidMetricsRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListBidMetricsRequest.pageToken field in the subsequent call to the bidMetrics.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons that bid responses resulted in an error.
     */
    export interface Schema$ListBidResponseErrorsResponse {
        /**
         * List of rows, with counts of bid responses aggregated by callout status.
         */
        calloutStatusRows?: Schema$CalloutStatusRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListBidResponseErrorsRequest.pageToken field in the subsequent call to the bidResponseErrors.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons that bid responses were considered to have no applicable bids.
     */
    export interface Schema$ListBidResponsesWithoutBidsResponse {
        /**
         * List of rows, with counts of bid responses without bids aggregated by status.
         */
        bidResponseWithoutBidsStatusRows?: Schema$BidResponseWithoutBidsStatusRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListBidResponsesWithoutBidsRequest.pageToken field in the subsequent call to the bidResponsesWithoutBids.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListClientsResponse {
        /**
         * The returned list of clients.
         */
        clients?: Schema$Client[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListClientsRequest.pageToken field in the subsequent call to the accounts.clients.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListClientUserInvitationsResponse {
        /**
         * The returned list of client users.
         */
        invitations?: Schema$ClientUserInvitation[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListClientUserInvitationsRequest.pageToken field in the subsequent call to the clients.invitations.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListClientUsersResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the ListClientUsersRequest.pageToken field in the subsequent call to the clients.invitations.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The returned list of client users.
         */
        users?: Schema$ClientUser[];
    }
    /**
     * A response for listing creatives.
     */
    export interface Schema$ListCreativesResponse {
        /**
         * The list of creatives.
         */
        creatives?: Schema$Creative[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListCreativesRequest.page_token field in the subsequent call to `ListCreatives` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all creatives associated with a given filtered bid reason.
     */
    export interface Schema$ListCreativeStatusBreakdownByCreativeResponse {
        /**
         * List of rows, with counts of bids with a given creative status aggregated by creative.
         */
        filteredBidCreativeRows?: Schema$FilteredBidCreativeRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListCreativeStatusBreakdownByCreativeRequest.pageToken field in the subsequent call to the filteredBids.creatives.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all details associated with a given filtered bid reason.
     */
    export interface Schema$ListCreativeStatusBreakdownByDetailResponse {
        /**
         * The type of detail that the detail IDs represent.
         */
        detailType?: string | null;
        /**
         * List of rows, with counts of bids with a given creative status aggregated by detail.
         */
        filteredBidDetailRows?: Schema$FilteredBidDetailRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListCreativeStatusBreakdownByDetailRequest.pageToken field in the subsequent call to the filteredBids.details.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * A response for listing creative and deal associations
     */
    export interface Schema$ListDealAssociationsResponse {
        /**
         * The list of associations.
         */
        associations?: Schema$CreativeDealAssociation[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListDealAssociationsRequest.page_token field in the subsequent call to 'ListDealAssociation' method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons that bid requests were filtered and not sent to the buyer.
     */
    export interface Schema$ListFilteredBidRequestsResponse {
        /**
         * List of rows, with counts of filtered bid requests aggregated by callout status.
         */
        calloutStatusRows?: Schema$CalloutStatusRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListFilteredBidRequestsRequest.pageToken field in the subsequent call to the filteredBidRequests.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons that bids were filtered from the auction.
     */
    export interface Schema$ListFilteredBidsResponse {
        /**
         * List of rows, with counts of filtered bids aggregated by filtering reason (for example, creative status).
         */
        creativeStatusRows?: Schema$CreativeStatusRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListFilteredBidsRequest.pageToken field in the subsequent call to the filteredBids.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing filter sets.
     */
    export interface Schema$ListFilterSetsResponse {
        /**
         * The filter sets belonging to the buyer.
         */
        filterSets?: Schema$FilterSet[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListFilterSetsRequest.pageToken field in the subsequent call to the accounts.filterSets.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing the metrics that are measured in number of impressions.
     */
    export interface Schema$ListImpressionMetricsResponse {
        /**
         * List of rows, each containing a set of impression metrics.
         */
        impressionMetricsRows?: Schema$ImpressionMetricsRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListImpressionMetricsRequest.pageToken field in the subsequent call to the impressionMetrics.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons that bids lost in the auction.
     */
    export interface Schema$ListLosingBidsResponse {
        /**
         * List of rows, with counts of losing bids aggregated by loss reason (for example, creative status).
         */
        creativeStatusRows?: Schema$CreativeStatusRow[];
        /**
         * A token to retrieve the next page of results. Pass this value in the ListLosingBidsRequest.pageToken field in the subsequent call to the losingBids.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for listing all reasons for which a buyer was not billed for a winning bid.
     */
    export interface Schema$ListNonBillableWinningBidsResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the ListNonBillableWinningBidsRequest.pageToken field in the subsequent call to the nonBillableWinningBids.list method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * List of rows, with counts of bids not billed aggregated by reason.
         */
        nonBillableWinningBidStatusRows?: Schema$NonBillableWinningBidStatusRow[];
    }
    /**
     * Response message for listing products visible to the buyer.
     */
    export interface Schema$ListProductsResponse {
        /**
         * List pagination support.
         */
        nextPageToken?: string | null;
        /**
         * The list of matching products at their head revision number.
         */
        products?: Schema$Product[];
    }
    /**
     * Response message for listing proposals.
     */
    export interface Schema$ListProposalsResponse {
        /**
         * Continuation token for fetching the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of proposals.
         */
        proposals?: Schema$Proposal[];
    }
    /**
     * Response message for profiles visible to the buyer.
     */
    export interface Schema$ListPublisherProfilesResponse {
        /**
         * List pagination support
         */
        nextPageToken?: string | null;
        /**
         * The list of matching publisher profiles.
         */
        publisherProfiles?: Schema$PublisherProfile[];
    }
    /**
     * Output only. The Geo criteria the restriction applies to.
     */
    export interface Schema$LocationContext {
        /**
         * IDs representing the geo location for this context. Refer to the [geo-table.csv](https://storage.googleapis.com/adx-rtb-dictionaries/geo-table.csv) file for different geo criteria IDs.
         */
        geoCriteriaIds?: number[] | null;
    }
    /**
     * Targeting represents different criteria that can be used by advertisers to target ad inventory. For example, they can choose to target ad requests only if the user is in the US. Multiple types of targeting are always applied as a logical AND, unless noted otherwise.
     */
    export interface Schema$MarketplaceTargeting {
        /**
         * Geo criteria IDs to be included/excluded.
         */
        geoTargeting?: Schema$CriteriaTargeting;
        /**
         * Inventory sizes to be included/excluded.
         */
        inventorySizeTargeting?: Schema$InventorySizeTargeting;
        /**
         * Placement targeting information, for example, URL, mobile applications.
         */
        placementTargeting?: Schema$PlacementTargeting;
        /**
         * Technology targeting information, for example, operating system, device category.
         */
        technologyTargeting?: Schema$TechnologyTargeting;
        /**
         * Video targeting information.
         */
        videoTargeting?: Schema$VideoTargeting;
    }
    /**
     * A metric value, with an expected value and a variance; represents a count that may be either exact or estimated (for example, when sampled).
     */
    export interface Schema$MetricValue {
        /**
         * The expected value of the metric.
         */
        value?: string | null;
        /**
         * The variance (for example, square of the standard deviation) of the metric value. If value is exact, variance is 0. Can be used to calculate margin of error as a percentage of value, using the following formula, where Z is the standard constant that depends on the preferred size of the confidence interval (for example, for 90% confidence interval, use Z = 1.645): marginOfError = 100 * Z * sqrt(variance) / value
         */
        variance?: string | null;
    }
    /**
     * Mobile application targeting settings.
     */
    export interface Schema$MobileApplicationTargeting {
        /**
         * Publisher owned apps to be targeted or excluded by the publisher to display the ads in.
         */
        firstPartyTargeting?: Schema$FirstPartyMobileApplicationTargeting;
    }
    /**
     * Represents an amount of money with its currency type.
     */
    export interface Schema$Money {
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
     * Native content for a creative.
     */
    export interface Schema$NativeContent {
        /**
         * The name of the advertiser or sponsor, to be displayed in the ad creative.
         */
        advertiserName?: string | null;
        /**
         * The app icon, for app download ads.
         */
        appIcon?: Schema$Image;
        /**
         * A long description of the ad.
         */
        body?: string | null;
        /**
         * A label for the button that the user is supposed to click.
         */
        callToAction?: string | null;
        /**
         * The URL that the browser/SDK will load when the user clicks the ad.
         */
        clickLinkUrl?: string | null;
        /**
         * The URL to use for click tracking.
         */
        clickTrackingUrl?: string | null;
        /**
         * A short title for the ad.
         */
        headline?: string | null;
        /**
         * A large image.
         */
        image?: Schema$Image;
        /**
         * A smaller image, for the advertiser's logo.
         */
        logo?: Schema$Image;
        /**
         * The price of the promoted app including currency info.
         */
        priceDisplayText?: string | null;
        /**
         * The app rating in the app store. Must be in the range [0-5].
         */
        starRating?: number | null;
        /**
         * The URL to the app store to purchase/download the promoted app.
         */
        storeUrl?: string | null;
        /**
         * The URL to fetch a native video ad.
         */
        videoUrl?: string | null;
    }
    /**
     * The number of winning bids with the specified dimension values for which the buyer was not billed, as described by the specified status.
     */
    export interface Schema$NonBillableWinningBidStatusRow {
        /**
         * The number of bids with the specified status.
         */
        bidCount?: Schema$MetricValue;
        /**
         * The values of all dimensions associated with metric values in this row.
         */
        rowDimensions?: Schema$RowDimensions;
        /**
         * The status specifying why the winning bids were not billed.
         */
        status?: string | null;
    }
    /**
     * Terms for Private Auctions. Note that Private Auctions can be created only by the seller, but they can be returned in a get or list request.
     */
    export interface Schema$NonGuaranteedAuctionTerms {
        /**
         * True if open auction buyers are allowed to compete with invited buyers in this private auction.
         */
        autoOptimizePrivateAuction?: boolean | null;
        /**
         * Reserve price for the specified buyer.
         */
        reservePricesPerBuyer?: Schema$PricePerBuyer[];
    }
    /**
     * Terms for Preferred Deals.
     */
    export interface Schema$NonGuaranteedFixedPriceTerms {
        /**
         * Fixed price for the specified buyer.
         */
        fixedPrices?: Schema$PricePerBuyer[];
    }
    /**
     * A proposal may be associated to several notes.
     */
    export interface Schema$Note {
        /**
         * Output only. The timestamp for when this note was created.
         */
        createTime?: string | null;
        /**
         * Output only. The role of the person (buyer/seller) creating the note.
         */
        creatorRole?: string | null;
        /**
         * The actual note to attach. (max-length: 1024 unicode code units) Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        note?: string | null;
        /**
         * Output only. The unique ID for the note.
         */
        noteId?: string | null;
        /**
         * Output only. The revision number of the proposal when the note is created.
         */
        proposalRevision?: string | null;
    }
    /**
     * Represents targeting information for operating systems.
     */
    export interface Schema$OperatingSystemTargeting {
        /**
         * IDs of operating systems to be included/excluded.
         */
        operatingSystemCriteria?: Schema$CriteriaTargeting;
        /**
         * IDs of operating system versions to be included/excluded.
         */
        operatingSystemVersionCriteria?: Schema$CriteriaTargeting;
    }
    /**
     * Request message to pause serving for finalized deals.
     */
    export interface Schema$PauseProposalDealsRequest {
        /**
         * The external_deal_id's of the deals to be paused. If empty, all the deals in the proposal will be paused.
         */
        externalDealIds?: string[] | null;
        /**
         * The reason why the deals are being paused. This human readable message will be displayed in the seller's UI. (Max length: 1000 unicode code units.)
         */
        reason?: string | null;
    }
    /**
     * Request message to pause serving for an already-finalized proposal.
     */
    export interface Schema$PauseProposalRequest {
        /**
         * The reason why the proposal is being paused. This human readable message will be displayed in the seller's UI. (Max length: 1000 unicode code units.)
         */
        reason?: string | null;
    }
    /**
     * Represents targeting about where the ads can appear, for example, certain sites or mobile applications. Different placement targeting types will be logically OR'ed.
     */
    export interface Schema$PlacementTargeting {
        /**
         * Mobile application targeting information in a deal. This doesn't apply to Auction Packages.
         */
        mobileApplicationTargeting?: Schema$MobileApplicationTargeting;
        /**
         * URLs to be included/excluded.
         */
        urlTargeting?: Schema$UrlTargeting;
    }
    /**
     * Output only. The type of platform the restriction applies to.
     */
    export interface Schema$PlatformContext {
        /**
         * The platforms this restriction applies to.
         */
        platforms?: string[] | null;
    }
    /**
     * Represents a price and a pricing type for a product / deal.
     */
    export interface Schema$Price {
        /**
         * The actual price with currency specified.
         */
        amount?: Schema$Money;
        /**
         * The pricing type for the deal/product. (default: CPM)
         */
        pricingType?: string | null;
    }
    /**
     * Used to specify pricing rules for buyers/advertisers. Each PricePerBuyer in a product can become 0 or 1 deals. To check if there is a PricePerBuyer for a particular buyer or buyer/advertiser pair, we look for the most specific matching rule - we first look for a rule matching the buyer and advertiser, next a rule with the buyer but an empty advertiser list, and otherwise look for a matching rule where no buyer is set.
     */
    export interface Schema$PricePerBuyer {
        /**
         * The list of advertisers for this price when associated with this buyer. If empty, all advertisers with this buyer pay this price.
         */
        advertiserIds?: string[] | null;
        /**
         * The buyer who will pay this price. If unset, all buyers can pay this price (if the advertisers match, and there's no more specific rule matching the buyer).
         */
        buyer?: Schema$Buyer;
        /**
         * The specified price.
         */
        price?: Schema$Price;
    }
    /**
     * Buyers are allowed to store certain types of private data in a proposal/deal.
     */
    export interface Schema$PrivateData {
        /**
         * A buyer or seller specified reference ID. This can be queried in the list operations (max-length: 1024 unicode code units).
         */
        referenceId?: string | null;
    }
    /**
     * A product is a segment of inventory that a seller wants to sell. It is associated with certain terms and targeting information which helps the buyer know more about the inventory.
     */
    export interface Schema$Product {
        /**
         * The proposed end time for the deal. The field will be truncated to the order of seconds during serving.
         */
        availableEndTime?: string | null;
        /**
         * Inventory availability dates. The start time will be truncated to seconds during serving. Thus, a field specified as 3:23:34.456 (HH:mm:ss.SSS) will be truncated to 3:23:34 when serving.
         */
        availableStartTime?: string | null;
        /**
         * Creation time.
         */
        createTime?: string | null;
        /**
         * Optional contact information for the creator of this product.
         */
        creatorContacts?: Schema$ContactInformation[];
        /**
         * The display name for this product as set by the seller.
         */
        displayName?: string | null;
        /**
         * If the creator has already signed off on the product, then the buyer can finalize the deal by accepting the product as is. When copying to a proposal, if any of the terms are changed, then auto_finalize is automatically set to false.
         */
        hasCreatorSignedOff?: boolean | null;
        /**
         * The unique ID for the product.
         */
        productId?: string | null;
        /**
         * The revision number of the product (auto-assigned by Marketplace).
         */
        productRevision?: string | null;
        /**
         * An ID which can be used by the Publisher Profile API to get more information about the seller that created this product.
         */
        publisherProfileId?: string | null;
        /**
         * Information about the seller that created this product.
         */
        seller?: Schema$Seller;
        /**
         * The syndication product associated with the deal.
         */
        syndicationProduct?: string | null;
        /**
         * Targeting that is shared between the buyer and the seller. Each targeting criterion has a specified key and for each key there is a list of inclusion value or exclusion values.
         */
        targetingCriterion?: Schema$TargetingCriteria[];
        /**
         * The negotiable terms of the deal.
         */
        terms?: Schema$DealTerms;
        /**
         * Time of last update.
         */
        updateTime?: string | null;
        /**
         * The web-property code for the seller. This needs to be copied as is when adding a new deal to a proposal.
         */
        webPropertyCode?: string | null;
    }
    /**
     * Represents a proposal in the Marketplace. A proposal is the unit of negotiation between a seller and a buyer and contains deals which are served. Note: You can't update, create, or otherwise modify Private Auction deals through the API. Fields are updatable unless noted otherwise.
     */
    export interface Schema$Proposal {
        /**
         * Output only. Reference to the buyer that will get billed for this proposal.
         */
        billedBuyer?: Schema$Buyer;
        /**
         * Reference to the buyer on the proposal. Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        buyer?: Schema$Buyer;
        /**
         * Contact information for the buyer.
         */
        buyerContacts?: Schema$ContactInformation[];
        /**
         * Private data for buyer. (hidden from seller).
         */
        buyerPrivateData?: Schema$PrivateData;
        /**
         * The deals associated with this proposal. For Private Auction proposals (whose deals have NonGuaranteedAuctionTerms), there will only be one deal.
         */
        deals?: Schema$Deal[];
        /**
         * The name for the proposal.
         */
        displayName?: string | null;
        /**
         * Output only. True if the proposal is being renegotiated.
         */
        isRenegotiating?: boolean | null;
        /**
         * Output only. True, if the buyside inventory setup is complete for this proposal.
         */
        isSetupComplete?: boolean | null;
        /**
         * Output only. The role of the last user that either updated the proposal or left a comment.
         */
        lastUpdaterOrCommentorRole?: string | null;
        /**
         * Output only. The notes associated with this proposal.
         */
        notes?: Schema$Note[];
        /**
         * Output only. Indicates whether the buyer/seller created the proposal.
         */
        originatorRole?: string | null;
        /**
         * Output only. Private auction ID if this proposal is a private auction proposal.
         */
        privateAuctionId?: string | null;
        /**
         * Output only. The unique ID of the proposal.
         */
        proposalId?: string | null;
        /**
         * Output only. The revision number for the proposal. Each update to the proposal or the deal causes the proposal revision number to auto-increment. The buyer keeps track of the last revision number they know of and pass it in when making an update. If the head revision number on the server has since incremented, then an ABORTED error is returned during the update operation to let the buyer know that a subsequent update was made.
         */
        proposalRevision?: string | null;
        /**
         * Output only. The current state of the proposal.
         */
        proposalState?: string | null;
        /**
         * Reference to the seller on the proposal. Note: This field may be set only when creating the resource. Modifying this field while updating the resource will result in an error.
         */
        seller?: Schema$Seller;
        /**
         * Output only. Contact information for the seller.
         */
        sellerContacts?: Schema$ContactInformation[];
        /**
         * Output only. The terms and conditions set by the publisher for this proposal.
         */
        termsAndConditions?: string | null;
        /**
         * Output only. The time when the proposal was last revised.
         */
        updateTime?: string | null;
    }
    /**
     * Represents a publisher profile (https://support.google.com/admanager/answer/6035806) in Marketplace. All fields are read only. All string fields are free-form text entered by the publisher unless noted otherwise.
     */
    export interface Schema$PublisherProfile {
        /**
         * Description on the publisher's audience.
         */
        audienceDescription?: string | null;
        /**
         * Statement explaining what's unique about publisher's business, and why buyers should partner with the publisher.
         */
        buyerPitchStatement?: string | null;
        /**
         * Contact information for direct reservation deals. This is free text entered by the publisher and may include information like names, phone numbers and email addresses.
         */
        directDealsContact?: string | null;
        /**
         * Name of the publisher profile.
         */
        displayName?: string | null;
        /**
         * The list of domains represented in this publisher profile. Empty if this is a parent profile. These are top private domains, meaning that these will not contain a string like "photos.google.co.uk/123", but will instead contain "google.co.uk".
         */
        domains?: string[] | null;
        /**
         * URL to publisher's Google+ page.
         */
        googlePlusUrl?: string | null;
        /**
         * Indicates if this profile is the parent profile of the seller. A parent profile represents all the inventory from the seller, as opposed to child profile that is created to brand a portion of inventory. One seller should have only one parent publisher profile, and can have multiple child profiles. Publisher profiles for the same seller will have same value of field google.ads.adexchange.buyer.v2beta1.PublisherProfile.seller. See https://support.google.com/admanager/answer/6035806 for details.
         */
        isParent?: boolean | null;
        /**
         * A Google public URL to the logo for this publisher profile. The logo is stored as a PNG, JPG, or GIF image.
         */
        logoUrl?: string | null;
        /**
         * URL to additional marketing and sales materials.
         */
        mediaKitUrl?: string | null;
        /**
         * The list of apps represented in this publisher profile. Empty if this is a parent profile.
         */
        mobileApps?: Schema$PublisherProfileMobileApplication[];
        /**
         * Overview of the publisher.
         */
        overview?: string | null;
        /**
         * Contact information for programmatic deals. This is free text entered by the publisher and may include information like names, phone numbers and email addresses.
         */
        programmaticDealsContact?: string | null;
        /**
         * Unique ID for publisher profile.
         */
        publisherProfileId?: string | null;
        /**
         * URL to a publisher rate card.
         */
        rateCardInfoUrl?: string | null;
        /**
         * URL to a sample content page.
         */
        samplePageUrl?: string | null;
        /**
         * Seller of the publisher profile.
         */
        seller?: Schema$Seller;
        /**
         * Up to three key metrics and rankings. Max 100 characters each. For example "#1 Mobile News Site for 20 Straight Months".
         */
        topHeadlines?: string[] | null;
    }
    /**
     * A mobile application that contains a external app ID, name, and app store.
     */
    export interface Schema$PublisherProfileMobileApplication {
        /**
         * The app store the app belongs to.
         */
        appStore?: string | null;
        /**
         * The external ID for the app from its app store.
         */
        externalAppId?: string | null;
        /**
         * The name of the app.
         */
        name?: string | null;
    }
    /**
     * An open-ended realtime time range specified by the start timestamp. For filter sets that specify a realtime time range RTB metrics continue to be aggregated throughout the lifetime of the filter set.
     */
    export interface Schema$RealtimeTimeRange {
        /**
         * The start timestamp of the real-time RTB metrics aggregation.
         */
        startTimestamp?: string | null;
    }
    /**
     * A relative date range, specified by an offset and a duration. The supported range of dates begins 30 days before today and ends today, for example, the limits for these values are: offset_days \>= 0 duration_days \>= 1 offset_days + duration_days <= 30
     */
    export interface Schema$RelativeDateRange {
        /**
         * The number of days in the requested date range, for example, for a range spanning today: 1. For a range spanning the last 7 days: 7.
         */
        durationDays?: number | null;
        /**
         * The end date of the filter set, specified as the number of days before today, for example, for a range where the last date is today: 0.
         */
        offsetDays?: number | null;
    }
    /**
     * A request for removing the association between a deal and a creative.
     */
    export interface Schema$RemoveDealAssociationRequest {
        /**
         * The association between a creative and a deal that should be removed.
         */
        association?: Schema$CreativeDealAssociation;
    }
    /**
     * Request message to resume (unpause) serving for already-finalized deals.
     */
    export interface Schema$ResumeProposalDealsRequest {
        /**
         * The external_deal_id's of the deals to resume. If empty, all the deals in the proposal will be resumed.
         */
        externalDealIds?: string[] | null;
    }
    /**
     * Request message to resume (unpause) serving for an already-finalized proposal.
     */
    export interface Schema$ResumeProposalRequest {
    }
    /**
     * A response may include multiple rows, breaking down along various dimensions. Encapsulates the values of all dimensions for a given row.
     */
    export interface Schema$RowDimensions {
        /**
         * The publisher identifier for this row, if a breakdown by [BreakdownDimension.PUBLISHER_IDENTIFIER](https://developers.google.com/authorized-buyers/apis/reference/rest/v2beta1/bidders.accounts.filterSets#FilterSet.BreakdownDimension) was requested.
         */
        publisherIdentifier?: string | null;
        /**
         * The time interval that this row represents.
         */
        timeInterval?: Schema$TimeInterval;
    }
    /**
     * Output only. A security context.
     */
    export interface Schema$SecurityContext {
        /**
         * The security types in this context.
         */
        securities?: string[] | null;
    }
    /**
     * Represents a seller of inventory. Each seller is identified by a unique Ad Manager account ID.
     */
    export interface Schema$Seller {
        /**
         * The unique ID for the seller. The seller fills in this field. The seller account ID is then available to buyer in the product.
         */
        accountId?: string | null;
        /**
         * Output only. Ad manager network code for the seller.
         */
        subAccountId?: string | null;
    }
    /**
     * The serving context for this restriction.
     */
    export interface Schema$ServingContext {
        /**
         * Matches all contexts.
         */
        all?: string | null;
        /**
         * Matches impressions for a particular app type.
         */
        appType?: Schema$AppContext;
        /**
         * Matches impressions for a particular auction type.
         */
        auctionType?: Schema$AuctionContext;
        /**
         * Matches impressions coming from users *or* publishers in a specific location.
         */
        location?: Schema$LocationContext;
        /**
         * Matches impressions coming from a particular platform.
         */
        platform?: Schema$PlatformContext;
        /**
         * Matches impressions for a particular security type.
         */
        securityType?: Schema$SecurityContext;
    }
    /**
     * Output only. A representation of the status of an ad in a specific context. A context here relates to where something ultimately serves (for example, a user or publisher geo, a platform, an HTTPS versus HTTP request, or the type of auction).
     */
    export interface Schema$ServingRestriction {
        /**
         * The contexts for the restriction.
         */
        contexts?: Schema$ServingContext[];
        /**
         * Disapproval bound to this restriction. Only present if status=DISAPPROVED. Can be used to filter the response of the creatives.list method.
         */
        disapproval?: Schema$Disapproval;
        /**
         * Any disapprovals bound to this restriction. Only present if status=DISAPPROVED. Can be used to filter the response of the creatives.list method. Deprecated; use disapproval field instead.
         */
        disapprovalReasons?: Schema$Disapproval[];
        /**
         * The status of the creative in this context (for example, it has been explicitly disapproved or is pending review).
         */
        status?: string | null;
    }
    /**
     * Message depicting the size of the creative. The units of width and height depend on the type of the targeting.
     */
    export interface Schema$Size {
        /**
         * The height of the creative.
         */
        height?: number | null;
        /**
         * The width of the creative
         */
        width?: number | null;
    }
    /**
     * A request for stopping notifications for changes to creative Status.
     */
    export interface Schema$StopWatchingCreativeRequest {
    }
    /**
     * Advertisers can target different attributes of an ad slot. For example, they can choose to show ads only if the user is in the U.S. Such targeting criteria can be specified as part of Shared Targeting.
     */
    export interface Schema$TargetingCriteria {
        /**
         * The list of values to exclude from targeting. Each value is AND'd together.
         */
        exclusions?: Schema$TargetingValue[];
        /**
         * The list of value to include as part of the targeting. Each value is OR'd together.
         */
        inclusions?: Schema$TargetingValue[];
        /**
         * The key representing the shared targeting criterion. Targeting criteria defined by Google ad servers will begin with GOOG_. Third parties may define their own keys. A list of permissible keys along with the acceptable values will be provided as part of the external documentation.
         */
        key?: string | null;
    }
    /**
     * A polymorphic targeting value used as part of Shared Targeting.
     */
    export interface Schema$TargetingValue {
        /**
         * The creative size value to include/exclude. Filled in when key = GOOG_CREATIVE_SIZE
         */
        creativeSizeValue?: Schema$CreativeSize;
        /**
         * The daypart targeting to include / exclude. Filled in when the key is GOOG_DAYPART_TARGETING. The definition of this targeting is derived from the structure used by Ad Manager.
         */
        dayPartTargetingValue?: Schema$DayPartTargeting;
        /**
         * The long value to include/exclude.
         */
        longValue?: string | null;
        /**
         * The string value to include/exclude.
         */
        stringValue?: string | null;
    }
    /**
     * Represents targeting about various types of technology.
     */
    export interface Schema$TechnologyTargeting {
        /**
         * IDs of device capabilities to be included/excluded.
         */
        deviceCapabilityTargeting?: Schema$CriteriaTargeting;
        /**
         * IDs of device categories to be included/excluded.
         */
        deviceCategoryTargeting?: Schema$CriteriaTargeting;
        /**
         * Operating system related targeting information.
         */
        operatingSystemTargeting?: Schema$OperatingSystemTargeting;
    }
    /**
     * An interval of time, with an absolute start and end.
     */
    export interface Schema$TimeInterval {
        /**
         * The timestamp marking the end of the range (exclusive) for which data is included.
         */
        endTime?: string | null;
        /**
         * The timestamp marking the start of the range (inclusive) for which data is included.
         */
        startTime?: string | null;
    }
    /**
     * Represents a time of day. The date and time zone are either not significant or are specified elsewhere. An API may choose to allow leap seconds. Related types are google.type.Date and `google.protobuf.Timestamp`.
     */
    export interface Schema$TimeOfDay {
        /**
         * Hours of a day in 24 hour format. Must be greater than or equal to 0 and typically must be less than or equal to 23. An API may choose to allow the value "24:00:00" for scenarios like business closing time.
         */
        hours?: number | null;
        /**
         * Minutes of an hour. Must be greater than or equal to 0 and less than or equal to 59.
         */
        minutes?: number | null;
        /**
         * Fractions of seconds, in nanoseconds. Must be greater than or equal to 0 and less than or equal to 999,999,999.
         */
        nanos?: number | null;
        /**
         * Seconds of a minute. Must be greater than or equal to 0 and typically must be less than or equal to 59. An API may allow the value 60 if it allows leap-seconds.
         */
        seconds?: number | null;
    }
    /**
     * Represents a list of targeted and excluded URLs (for example, google.com). For Private Auction and AdX Preferred Deals, URLs are either included or excluded. For Programmatic Guaranteed and Preferred Deals, this doesn't apply.
     */
    export interface Schema$UrlTargeting {
        /**
         * A list of URLs to be excluded.
         */
        excludedUrls?: string[] | null;
        /**
         * A list of URLs to be included.
         */
        targetedUrls?: string[] | null;
    }
    /**
     * Video content for a creative.
     */
    export interface Schema$VideoContent {
        /**
         * The URL to fetch a video ad.
         */
        videoUrl?: string | null;
        /**
         * The contents of a VAST document for a video ad. This document should conform to the VAST 2.0 or 3.0 standard.
         */
        videoVastXml?: string | null;
    }
    /**
     * Represents targeting information about video.
     */
    export interface Schema$VideoTargeting {
        /**
         * A list of video positions to be excluded. Position types can either be included or excluded (XOR).
         */
        excludedPositionTypes?: string[] | null;
        /**
         * A list of video positions to be included. When the included list is present, the excluded list must be empty. When the excluded list is present, the included list must be empty.
         */
        targetedPositionTypes?: string[] | null;
    }
    /**
     * A request for watching changes to creative Status.
     */
    export interface Schema$WatchCreativeRequest {
        /**
         * The Pub/Sub topic to publish notifications to. This topic must already exist and must give permission to ad-exchange-buyside-reports@google.com to write to the topic. This should be the full resource name in "projects/{project_id\}/topics/{topic_id\}" format.
         */
        topic?: string | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        clients: Resource$Accounts$Clients;
        creatives: Resource$Accounts$Creatives;
        finalizedProposals: Resource$Accounts$Finalizedproposals;
        products: Resource$Accounts$Products;
        proposals: Resource$Accounts$Proposals;
        publisherProfiles: Resource$Accounts$Publisherprofiles;
        constructor(context: APIRequestContext);
    }
    export class Resource$Accounts$Clients {
        context: APIRequestContext;
        invitations: Resource$Accounts$Clients$Invitations;
        users: Resource$Accounts$Clients$Users;
        constructor(context: APIRequestContext);
        /**
         * Creates a new client buyer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Clients$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Clients$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Client>>;
        create(params: Params$Resource$Accounts$Clients$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Clients$Create, options: MethodOptions | BodyResponseCallback<Schema$Client>, callback: BodyResponseCallback<Schema$Client>): void;
        create(params: Params$Resource$Accounts$Clients$Create, callback: BodyResponseCallback<Schema$Client>): void;
        create(callback: BodyResponseCallback<Schema$Client>): void;
        /**
         * Gets a client buyer with a given client account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Clients$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Clients$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Client>>;
        get(params: Params$Resource$Accounts$Clients$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Clients$Get, options: MethodOptions | BodyResponseCallback<Schema$Client>, callback: BodyResponseCallback<Schema$Client>): void;
        get(params: Params$Resource$Accounts$Clients$Get, callback: BodyResponseCallback<Schema$Client>): void;
        get(callback: BodyResponseCallback<Schema$Client>): void;
        /**
         * Lists all the clients for the current sponsor buyer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Clients$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Clients$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClientsResponse>>;
        list(params: Params$Resource$Accounts$Clients$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Clients$List, options: MethodOptions | BodyResponseCallback<Schema$ListClientsResponse>, callback: BodyResponseCallback<Schema$ListClientsResponse>): void;
        list(params: Params$Resource$Accounts$Clients$List, callback: BodyResponseCallback<Schema$ListClientsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClientsResponse>): void;
        /**
         * Updates an existing client buyer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Clients$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Clients$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Client>>;
        update(params: Params$Resource$Accounts$Clients$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Clients$Update, options: MethodOptions | BodyResponseCallback<Schema$Client>, callback: BodyResponseCallback<Schema$Client>): void;
        update(params: Params$Resource$Accounts$Clients$Update, callback: BodyResponseCallback<Schema$Client>): void;
        update(callback: BodyResponseCallback<Schema$Client>): void;
    }
    export interface Params$Resource$Accounts$Clients$Create extends StandardParameters {
        /**
         * Unique numerical account ID for the buyer of which the client buyer is a customer; the sponsor buyer to create a client for. (required)
         */
        accountId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Client;
    }
    export interface Params$Resource$Accounts$Clients$Get extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer to retrieve. (required)
         */
        clientAccountId?: string;
    }
    export interface Params$Resource$Accounts$Clients$List extends StandardParameters {
        /**
         * Unique numerical account ID of the sponsor buyer to list the clients for.
         */
        accountId?: string;
        /**
         * Requested page size. The server may return fewer clients than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListClientsResponse.nextPageToken returned from the previous call to the accounts.clients.list method.
         */
        pageToken?: string;
        /**
         * Optional unique identifier (from the standpoint of an Ad Exchange sponsor buyer partner) of the client to return. If specified, at most one client will be returned in the response.
         */
        partnerClientId?: string;
    }
    export interface Params$Resource$Accounts$Clients$Update extends StandardParameters {
        /**
         * Unique numerical account ID for the buyer of which the client buyer is a customer; the sponsor buyer to update a client for. (required)
         */
        accountId?: string;
        /**
         * Unique numerical account ID of the client to update. (required)
         */
        clientAccountId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Client;
    }
    export class Resource$Accounts$Clients$Invitations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates and sends out an email invitation to access an Ad Exchange client buyer account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Clients$Invitations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Clients$Invitations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClientUserInvitation>>;
        create(params: Params$Resource$Accounts$Clients$Invitations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Clients$Invitations$Create, options: MethodOptions | BodyResponseCallback<Schema$ClientUserInvitation>, callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        create(params: Params$Resource$Accounts$Clients$Invitations$Create, callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        create(callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        /**
         * Retrieves an existing client user invitation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Clients$Invitations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Clients$Invitations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClientUserInvitation>>;
        get(params: Params$Resource$Accounts$Clients$Invitations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Clients$Invitations$Get, options: MethodOptions | BodyResponseCallback<Schema$ClientUserInvitation>, callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        get(params: Params$Resource$Accounts$Clients$Invitations$Get, callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        get(callback: BodyResponseCallback<Schema$ClientUserInvitation>): void;
        /**
         * Lists all the client users invitations for a client with a given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Clients$Invitations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Clients$Invitations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClientUserInvitationsResponse>>;
        list(params: Params$Resource$Accounts$Clients$Invitations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Clients$Invitations$List, options: MethodOptions | BodyResponseCallback<Schema$ListClientUserInvitationsResponse>, callback: BodyResponseCallback<Schema$ListClientUserInvitationsResponse>): void;
        list(params: Params$Resource$Accounts$Clients$Invitations$List, callback: BodyResponseCallback<Schema$ListClientUserInvitationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClientUserInvitationsResponse>): void;
    }
    export interface Params$Resource$Accounts$Clients$Invitations$Create extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer that the user should be associated with. (required)
         */
        clientAccountId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ClientUserInvitation;
    }
    export interface Params$Resource$Accounts$Clients$Invitations$Get extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer that the user invitation to be retrieved is associated with. (required)
         */
        clientAccountId?: string;
        /**
         * Numerical identifier of the user invitation to retrieve. (required)
         */
        invitationId?: string;
    }
    export interface Params$Resource$Accounts$Clients$Invitations$List extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer to list invitations for. (required) You must either specify a string representation of a numerical account identifier or the `-` character to list all the invitations for all the clients of a given sponsor buyer.
         */
        clientAccountId?: string;
        /**
         * Requested page size. Server may return fewer clients than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListClientUserInvitationsResponse.nextPageToken returned from the previous call to the clients.invitations.list method.
         */
        pageToken?: string;
    }
    export class Resource$Accounts$Clients$Users {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves an existing client user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Clients$Users$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Clients$Users$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClientUser>>;
        get(params: Params$Resource$Accounts$Clients$Users$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Clients$Users$Get, options: MethodOptions | BodyResponseCallback<Schema$ClientUser>, callback: BodyResponseCallback<Schema$ClientUser>): void;
        get(params: Params$Resource$Accounts$Clients$Users$Get, callback: BodyResponseCallback<Schema$ClientUser>): void;
        get(callback: BodyResponseCallback<Schema$ClientUser>): void;
        /**
         * Lists all the known client users for a specified sponsor buyer account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Clients$Users$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Clients$Users$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListClientUsersResponse>>;
        list(params: Params$Resource$Accounts$Clients$Users$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Clients$Users$List, options: MethodOptions | BodyResponseCallback<Schema$ListClientUsersResponse>, callback: BodyResponseCallback<Schema$ListClientUsersResponse>): void;
        list(params: Params$Resource$Accounts$Clients$Users$List, callback: BodyResponseCallback<Schema$ListClientUsersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListClientUsersResponse>): void;
        /**
         * Updates an existing client user. Only the user status can be changed on update.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Clients$Users$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Clients$Users$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ClientUser>>;
        update(params: Params$Resource$Accounts$Clients$Users$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Clients$Users$Update, options: MethodOptions | BodyResponseCallback<Schema$ClientUser>, callback: BodyResponseCallback<Schema$ClientUser>): void;
        update(params: Params$Resource$Accounts$Clients$Users$Update, callback: BodyResponseCallback<Schema$ClientUser>): void;
        update(callback: BodyResponseCallback<Schema$ClientUser>): void;
    }
    export interface Params$Resource$Accounts$Clients$Users$Get extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer that the user to be retrieved is associated with. (required)
         */
        clientAccountId?: string;
        /**
         * Numerical identifier of the user to retrieve. (required)
         */
        userId?: string;
    }
    export interface Params$Resource$Accounts$Clients$Users$List extends StandardParameters {
        /**
         * Numerical account ID of the sponsor buyer of the client to list users for. (required)
         */
        accountId?: string;
        /**
         * The account ID of the client buyer to list users for. (required) You must specify either a string representation of a numerical account identifier or the `-` character to list all the client users for all the clients of a given sponsor buyer.
         */
        clientAccountId?: string;
        /**
         * Requested page size. The server may return fewer clients than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListClientUsersResponse.nextPageToken returned from the previous call to the accounts.clients.users.list method.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Clients$Users$Update extends StandardParameters {
        /**
         * Numerical account ID of the client's sponsor buyer. (required)
         */
        accountId?: string;
        /**
         * Numerical account ID of the client buyer that the user to be retrieved is associated with. (required)
         */
        clientAccountId?: string;
        /**
         * Numerical identifier of the user to retrieve. (required)
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ClientUser;
    }
    export class Resource$Accounts$Creatives {
        context: APIRequestContext;
        dealAssociations: Resource$Accounts$Creatives$Dealassociations;
        constructor(context: APIRequestContext);
        /**
         * Creates a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Creatives$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Creatives$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        create(params: Params$Resource$Accounts$Creatives$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Creatives$Create, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        create(params: Params$Resource$Accounts$Creatives$Create, callback: BodyResponseCallback<Schema$Creative>): void;
        create(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Gets a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Creatives$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Creatives$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        get(params: Params$Resource$Accounts$Creatives$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Creatives$Get, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        get(params: Params$Resource$Accounts$Creatives$Get, callback: BodyResponseCallback<Schema$Creative>): void;
        get(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Lists creatives.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativesResponse>>;
        list(params: Params$Resource$Accounts$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativesResponse>, callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        list(params: Params$Resource$Accounts$Creatives$List, callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        /**
         * Stops watching a creative. Will stop push notifications being sent to the topics when the creative changes status.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        stopWatching(params: Params$Resource$Accounts$Creatives$Stopwatching, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stopWatching(params?: Params$Resource$Accounts$Creatives$Stopwatching, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        stopWatching(params: Params$Resource$Accounts$Creatives$Stopwatching, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stopWatching(params: Params$Resource$Accounts$Creatives$Stopwatching, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        stopWatching(params: Params$Resource$Accounts$Creatives$Stopwatching, callback: BodyResponseCallback<Schema$Empty>): void;
        stopWatching(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Updates a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Creatives$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Creatives$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        update(params: Params$Resource$Accounts$Creatives$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Creatives$Update, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        update(params: Params$Resource$Accounts$Creatives$Update, callback: BodyResponseCallback<Schema$Creative>): void;
        update(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Watches a creative. Will result in push notifications being sent to the topic when the creative changes status.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        watch(params: Params$Resource$Accounts$Creatives$Watch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        watch(params?: Params$Resource$Accounts$Creatives$Watch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        watch(params: Params$Resource$Accounts$Creatives$Watch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        watch(params: Params$Resource$Accounts$Creatives$Watch, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        watch(params: Params$Resource$Accounts$Creatives$Watch, callback: BodyResponseCallback<Schema$Empty>): void;
        watch(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Accounts$Creatives$Create extends StandardParameters {
        /**
         * The account that this creative belongs to. Can be used to filter the response of the creatives.list method.
         */
        accountId?: string;
        /**
         * Indicates if multiple creatives can share an ID or not. Default is NO_DUPLICATES (one ID per creative).
         */
        duplicateIdMode?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Creative;
    }
    export interface Params$Resource$Accounts$Creatives$Get extends StandardParameters {
        /**
         * The account the creative belongs to.
         */
        accountId?: string;
        /**
         * The ID of the creative to retrieve.
         */
        creativeId?: string;
    }
    export interface Params$Resource$Accounts$Creatives$List extends StandardParameters {
        /**
         * The account to list the creatives from. Specify "-" to list all creatives the current user has access to.
         */
        accountId?: string;
        /**
         * Requested page size. The server may return fewer creatives than requested (due to timeout constraint) even if more are available through another call. If unspecified, server will pick an appropriate default. Acceptable values are 1 to 1000, inclusive.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativesResponse.next_page_token returned from the previous call to 'ListCreatives' method.
         */
        pageToken?: string;
        /**
         * An optional query string to filter creatives. If no filter is specified, all active creatives will be returned. Supported queries are: - accountId=*account_id_string* - creativeId=*creative_id_string* - dealsStatus: {approved, conditionally_approved, disapproved, not_checked\} - openAuctionStatus: {approved, conditionally_approved, disapproved, not_checked\} - attribute: {a numeric attribute from the list of attributes\} - disapprovalReason: {a reason from DisapprovalReason\} Example: 'accountId=12345 AND (dealsStatus:disapproved AND disapprovalReason:unacceptable_content) OR attribute:47'
         */
        query?: string;
    }
    export interface Params$Resource$Accounts$Creatives$Stopwatching extends StandardParameters {
        /**
         * The account of the creative to stop notifications for.
         */
        accountId?: string;
        /**
         * The creative ID of the creative to stop notifications for. Specify "-" to specify stopping account level notifications.
         */
        creativeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StopWatchingCreativeRequest;
    }
    export interface Params$Resource$Accounts$Creatives$Update extends StandardParameters {
        /**
         * The account that this creative belongs to. Can be used to filter the response of the creatives.list method.
         */
        accountId?: string;
        /**
         * The buyer-defined creative ID of this creative. Can be used to filter the response of the creatives.list method.
         */
        creativeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Creative;
    }
    export interface Params$Resource$Accounts$Creatives$Watch extends StandardParameters {
        /**
         * The account of the creative to watch.
         */
        accountId?: string;
        /**
         * The creative ID to watch for status changes. Specify "-" to watch all creatives under the above account. If both creative-level and account-level notifications are sent, only a single notification will be sent to the creative-level notification topic.
         */
        creativeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WatchCreativeRequest;
    }
    export class Resource$Accounts$Creatives$Dealassociations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Associate an existing deal with a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        add(params: Params$Resource$Accounts$Creatives$Dealassociations$Add, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        add(params?: Params$Resource$Accounts$Creatives$Dealassociations$Add, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        add(params: Params$Resource$Accounts$Creatives$Dealassociations$Add, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        add(params: Params$Resource$Accounts$Creatives$Dealassociations$Add, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        add(params: Params$Resource$Accounts$Creatives$Dealassociations$Add, callback: BodyResponseCallback<Schema$Empty>): void;
        add(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * List all creative-deal associations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Creatives$Dealassociations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Creatives$Dealassociations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDealAssociationsResponse>>;
        list(params: Params$Resource$Accounts$Creatives$Dealassociations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Creatives$Dealassociations$List, options: MethodOptions | BodyResponseCallback<Schema$ListDealAssociationsResponse>, callback: BodyResponseCallback<Schema$ListDealAssociationsResponse>): void;
        list(params: Params$Resource$Accounts$Creatives$Dealassociations$List, callback: BodyResponseCallback<Schema$ListDealAssociationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDealAssociationsResponse>): void;
        /**
         * Remove the association between a deal and a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        remove(params: Params$Resource$Accounts$Creatives$Dealassociations$Remove, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        remove(params?: Params$Resource$Accounts$Creatives$Dealassociations$Remove, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        remove(params: Params$Resource$Accounts$Creatives$Dealassociations$Remove, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        remove(params: Params$Resource$Accounts$Creatives$Dealassociations$Remove, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        remove(params: Params$Resource$Accounts$Creatives$Dealassociations$Remove, callback: BodyResponseCallback<Schema$Empty>): void;
        remove(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Accounts$Creatives$Dealassociations$Add extends StandardParameters {
        /**
         * The account the creative belongs to.
         */
        accountId?: string;
        /**
         * The ID of the creative associated with the deal.
         */
        creativeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddDealAssociationRequest;
    }
    export interface Params$Resource$Accounts$Creatives$Dealassociations$List extends StandardParameters {
        /**
         * The account to list the associations from. Specify "-" to list all creatives the current user has access to.
         */
        accountId?: string;
        /**
         * The creative ID to list the associations from. Specify "-" to list all creatives under the above account.
         */
        creativeId?: string;
        /**
         * Requested page size. Server may return fewer associations than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListDealAssociationsResponse.next_page_token returned from the previous call to 'ListDealAssociations' method.
         */
        pageToken?: string;
        /**
         * An optional query string to filter deal associations. If no filter is specified, all associations will be returned. Supported queries are: - accountId=*account_id_string* - creativeId=*creative_id_string* - dealsId=*deals_id_string* - dealsStatus:{approved, conditionally_approved, disapproved, not_checked\} - openAuctionStatus:{approved, conditionally_approved, disapproved, not_checked\} Example: 'dealsId=12345 AND dealsStatus:disapproved'
         */
        query?: string;
    }
    export interface Params$Resource$Accounts$Creatives$Dealassociations$Remove extends StandardParameters {
        /**
         * The account the creative belongs to.
         */
        accountId?: string;
        /**
         * The ID of the creative associated with the deal.
         */
        creativeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RemoveDealAssociationRequest;
    }
    export class Resource$Accounts$Finalizedproposals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List finalized proposals, regardless if a proposal is being renegotiated. A filter expression (PQL query) may be specified to filter the results. The notes will not be returned.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Finalizedproposals$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Finalizedproposals$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProposalsResponse>>;
        list(params: Params$Resource$Accounts$Finalizedproposals$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Finalizedproposals$List, options: MethodOptions | BodyResponseCallback<Schema$ListProposalsResponse>, callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        list(params: Params$Resource$Accounts$Finalizedproposals$List, callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        /**
         * Update given deals to pause serving. This method will set the `DealServingMetadata.DealPauseStatus.has_buyer_paused` bit to true for all listed deals in the request. Currently, this method only applies to PG and PD deals. For PA deals, call accounts.proposals.pause endpoint. It is a no-op to pause already-paused deals. It is an error to call PauseProposalDeals for deals which are not part of the proposal of proposal_id or which are not finalized or renegotiating.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        pause(params: Params$Resource$Accounts$Finalizedproposals$Pause, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        pause(params?: Params$Resource$Accounts$Finalizedproposals$Pause, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        pause(params: Params$Resource$Accounts$Finalizedproposals$Pause, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        pause(params: Params$Resource$Accounts$Finalizedproposals$Pause, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        pause(params: Params$Resource$Accounts$Finalizedproposals$Pause, callback: BodyResponseCallback<Schema$Proposal>): void;
        pause(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Update given deals to resume serving. This method will set the `DealServingMetadata.DealPauseStatus.has_buyer_paused` bit to false for all listed deals in the request. Currently, this method only applies to PG and PD deals. For PA deals, call accounts.proposals.resume endpoint. It is a no-op to resume running deals or deals paused by the other party. It is an error to call ResumeProposalDeals for deals which are not part of the proposal of proposal_id or which are not finalized or renegotiating.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resume(params: Params$Resource$Accounts$Finalizedproposals$Resume, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resume(params?: Params$Resource$Accounts$Finalizedproposals$Resume, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        resume(params: Params$Resource$Accounts$Finalizedproposals$Resume, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resume(params: Params$Resource$Accounts$Finalizedproposals$Resume, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        resume(params: Params$Resource$Accounts$Finalizedproposals$Resume, callback: BodyResponseCallback<Schema$Proposal>): void;
        resume(callback: BodyResponseCallback<Schema$Proposal>): void;
    }
    export interface Params$Resource$Accounts$Finalizedproposals$List extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * An optional PQL filter query used to query for proposals. Nested repeated fields, such as proposal.deals.targetingCriterion, cannot be filtered.
         */
        filter?: string;
        /**
         * Syntax the filter is written in. Current implementation defaults to PQL but in the future it will be LIST_FILTER.
         */
        filterSyntax?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * The page token as returned from ListProposalsResponse.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Finalizedproposals$Pause extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The proposal_id of the proposal containing the deals.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PauseProposalDealsRequest;
    }
    export interface Params$Resource$Accounts$Finalizedproposals$Resume extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The proposal_id of the proposal containing the deals.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResumeProposalDealsRequest;
    }
    export class Resource$Accounts$Products {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the requested product by ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Products$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Products$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Product>>;
        get(params: Params$Resource$Accounts$Products$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Products$Get, options: MethodOptions | BodyResponseCallback<Schema$Product>, callback: BodyResponseCallback<Schema$Product>): void;
        get(params: Params$Resource$Accounts$Products$Get, callback: BodyResponseCallback<Schema$Product>): void;
        get(callback: BodyResponseCallback<Schema$Product>): void;
        /**
         * List all products visible to the buyer (optionally filtered by the specified PQL query).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Products$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Products$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProductsResponse>>;
        list(params: Params$Resource$Accounts$Products$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Products$List, options: MethodOptions | BodyResponseCallback<Schema$ListProductsResponse>, callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
        list(params: Params$Resource$Accounts$Products$List, callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProductsResponse>): void;
    }
    export interface Params$Resource$Accounts$Products$Get extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID for the product to get the head revision for.
         */
        productId?: string;
    }
    export interface Params$Resource$Accounts$Products$List extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * An optional PQL query used to query for products. See https://developers.google.com/ad-manager/docs/pqlreference for documentation about PQL and examples. Nested repeated fields, such as product.targetingCriterion.inclusions, cannot be filtered.
         */
        filter?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * The page token as returned from ListProductsResponse.
         */
        pageToken?: string;
    }
    export class Resource$Accounts$Proposals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Mark the proposal as accepted at the given revision number. If the number does not match the server's revision number an `ABORTED` error message will be returned. This call updates the proposal_state from `PROPOSED` to `BUYER_ACCEPTED`, or from `SELLER_ACCEPTED` to `FINALIZED`. Upon calling this endpoint, the buyer implicitly agrees to the terms and conditions optionally set within the proposal by the publisher.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        accept(params: Params$Resource$Accounts$Proposals$Accept, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        accept(params?: Params$Resource$Accounts$Proposals$Accept, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        accept(params: Params$Resource$Accounts$Proposals$Accept, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        accept(params: Params$Resource$Accounts$Proposals$Accept, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        accept(params: Params$Resource$Accounts$Proposals$Accept, callback: BodyResponseCallback<Schema$Proposal>): void;
        accept(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Create a new note and attach it to the proposal. The note is assigned a unique ID by the server. The proposal revision number will not increase when associated with a new note.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        addNote(params: Params$Resource$Accounts$Proposals$Addnote, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addNote(params?: Params$Resource$Accounts$Proposals$Addnote, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Note>>;
        addNote(params: Params$Resource$Accounts$Proposals$Addnote, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addNote(params: Params$Resource$Accounts$Proposals$Addnote, options: MethodOptions | BodyResponseCallback<Schema$Note>, callback: BodyResponseCallback<Schema$Note>): void;
        addNote(params: Params$Resource$Accounts$Proposals$Addnote, callback: BodyResponseCallback<Schema$Note>): void;
        addNote(callback: BodyResponseCallback<Schema$Note>): void;
        /**
         * Cancel an ongoing negotiation on a proposal. This does not cancel or end serving for the deals if the proposal has been finalized, but only cancels a negotiation unilaterally.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancelNegotiation(params: Params$Resource$Accounts$Proposals$Cancelnegotiation, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancelNegotiation(params?: Params$Resource$Accounts$Proposals$Cancelnegotiation, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        cancelNegotiation(params: Params$Resource$Accounts$Proposals$Cancelnegotiation, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancelNegotiation(params: Params$Resource$Accounts$Proposals$Cancelnegotiation, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        cancelNegotiation(params: Params$Resource$Accounts$Proposals$Cancelnegotiation, callback: BodyResponseCallback<Schema$Proposal>): void;
        cancelNegotiation(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * You can opt-in to manually update proposals to indicate that setup is complete. By default, proposal setup is automatically completed after their deals are finalized. Contact your Technical Account Manager to opt in. Buyers can call this method when the proposal has been finalized, and all the required creatives have been uploaded using the Creatives API. This call updates the `is_setup_completed` field on the deals in the proposal, and notifies the seller. The server then advances the revision number of the most recent proposal. To mark an individual deal as ready to serve, call `buyers.finalizedDeals.setReadyToServe` in the Marketplace API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeSetup(params: Params$Resource$Accounts$Proposals$Completesetup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeSetup(params?: Params$Resource$Accounts$Proposals$Completesetup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        completeSetup(params: Params$Resource$Accounts$Proposals$Completesetup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeSetup(params: Params$Resource$Accounts$Proposals$Completesetup, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        completeSetup(params: Params$Resource$Accounts$Proposals$Completesetup, callback: BodyResponseCallback<Schema$Proposal>): void;
        completeSetup(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Create the given proposal. Each created proposal and any deals it contains are assigned a unique ID by the server.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Accounts$Proposals$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Accounts$Proposals$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        create(params: Params$Resource$Accounts$Proposals$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Accounts$Proposals$Create, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        create(params: Params$Resource$Accounts$Proposals$Create, callback: BodyResponseCallback<Schema$Proposal>): void;
        create(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Gets a proposal given its ID. The proposal is returned at its head revision.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Proposals$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Proposals$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        get(params: Params$Resource$Accounts$Proposals$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Proposals$Get, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        get(params: Params$Resource$Accounts$Proposals$Get, callback: BodyResponseCallback<Schema$Proposal>): void;
        get(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * List proposals. A filter expression (PQL query) may be specified to filter the results. To retrieve all finalized proposals, regardless if a proposal is being renegotiated, see the FinalizedProposals resource. Note that Bidder/ChildSeat relationships differ from the usual behavior. A Bidder account can only see its child seats' proposals by specifying the ChildSeat's accountId in the request path.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Proposals$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Proposals$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProposalsResponse>>;
        list(params: Params$Resource$Accounts$Proposals$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Proposals$List, options: MethodOptions | BodyResponseCallback<Schema$ListProposalsResponse>, callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        list(params: Params$Resource$Accounts$Proposals$List, callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProposalsResponse>): void;
        /**
         * Update the given proposal to pause serving. This method will set the `DealServingMetadata.DealPauseStatus.has_buyer_paused` bit to true for all deals in the proposal. It is a no-op to pause an already-paused proposal. It is an error to call PauseProposal for a proposal that is not finalized or renegotiating.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        pause(params: Params$Resource$Accounts$Proposals$Pause, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        pause(params?: Params$Resource$Accounts$Proposals$Pause, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        pause(params: Params$Resource$Accounts$Proposals$Pause, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        pause(params: Params$Resource$Accounts$Proposals$Pause, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        pause(params: Params$Resource$Accounts$Proposals$Pause, callback: BodyResponseCallback<Schema$Proposal>): void;
        pause(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Update the given proposal to resume serving. This method will set the `DealServingMetadata.DealPauseStatus.has_buyer_paused` bit to false for all deals in the proposal. Note that if the `has_seller_paused` bit is also set, serving will not resume until the seller also resumes. It is a no-op to resume an already-running proposal. It is an error to call ResumeProposal for a proposal that is not finalized or renegotiating.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resume(params: Params$Resource$Accounts$Proposals$Resume, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resume(params?: Params$Resource$Accounts$Proposals$Resume, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        resume(params: Params$Resource$Accounts$Proposals$Resume, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resume(params: Params$Resource$Accounts$Proposals$Resume, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        resume(params: Params$Resource$Accounts$Proposals$Resume, callback: BodyResponseCallback<Schema$Proposal>): void;
        resume(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Update the given proposal at the client known revision number. If the server revision has advanced since the passed-in `proposal.proposal_revision`, an `ABORTED` error message will be returned. Only the buyer-modifiable fields of the proposal will be updated. Note that the deals in the proposal will be updated to match the passed-in copy. If a passed-in deal does not have a `deal_id`, the server will assign a new unique ID and create the deal. If passed-in deal has a `deal_id`, it will be updated to match the passed-in copy. Any existing deals not present in the passed-in proposal will be deleted. It is an error to pass in a deal with a `deal_id` not present at head.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Accounts$Proposals$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Accounts$Proposals$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        update(params: Params$Resource$Accounts$Proposals$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Accounts$Proposals$Update, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        update(params: Params$Resource$Accounts$Proposals$Update, callback: BodyResponseCallback<Schema$Proposal>): void;
        update(callback: BodyResponseCallback<Schema$Proposal>): void;
    }
    export interface Params$Resource$Accounts$Proposals$Accept extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to accept.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AcceptProposalRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Addnote extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to attach the note to.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddNoteRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Cancelnegotiation extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to cancel negotiation for.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelNegotiationRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Completesetup extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to mark as setup completed.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CompleteSetupRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Create extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Proposal;
    }
    export interface Params$Resource$Accounts$Proposals$Get extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The unique ID of the proposal
         */
        proposalId?: string;
    }
    export interface Params$Resource$Accounts$Proposals$List extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * An optional PQL filter query used to query for proposals. Nested repeated fields, such as proposal.deals.targetingCriterion, cannot be filtered.
         */
        filter?: string;
        /**
         * Syntax the filter is written in. Current implementation defaults to PQL but in the future it will be LIST_FILTER.
         */
        filterSyntax?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * The page token as returned from ListProposalsResponse.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Accounts$Proposals$Pause extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to pause.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PauseProposalRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Resume extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The ID of the proposal to resume.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResumeProposalRequest;
    }
    export interface Params$Resource$Accounts$Proposals$Update extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The unique ID of the proposal.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Proposal;
    }
    export class Resource$Accounts$Publisherprofiles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the requested publisher profile by id.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Publisherprofiles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Publisherprofiles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PublisherProfile>>;
        get(params: Params$Resource$Accounts$Publisherprofiles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Publisherprofiles$Get, options: MethodOptions | BodyResponseCallback<Schema$PublisherProfile>, callback: BodyResponseCallback<Schema$PublisherProfile>): void;
        get(params: Params$Resource$Accounts$Publisherprofiles$Get, callback: BodyResponseCallback<Schema$PublisherProfile>): void;
        get(callback: BodyResponseCallback<Schema$PublisherProfile>): void;
        /**
         * List all publisher profiles visible to the buyer
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Publisherprofiles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Publisherprofiles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPublisherProfilesResponse>>;
        list(params: Params$Resource$Accounts$Publisherprofiles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Publisherprofiles$List, options: MethodOptions | BodyResponseCallback<Schema$ListPublisherProfilesResponse>, callback: BodyResponseCallback<Schema$ListPublisherProfilesResponse>): void;
        list(params: Params$Resource$Accounts$Publisherprofiles$List, callback: BodyResponseCallback<Schema$ListPublisherProfilesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPublisherProfilesResponse>): void;
    }
    export interface Params$Resource$Accounts$Publisherprofiles$Get extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * The id for the publisher profile to get.
         */
        publisherProfileId?: string;
    }
    export interface Params$Resource$Accounts$Publisherprofiles$List extends StandardParameters {
        /**
         * Account ID of the buyer.
         */
        accountId?: string;
        /**
         * Specify the number of results to include per page.
         */
        pageSize?: number;
        /**
         * The page token as return from ListPublisherProfilesResponse.
         */
        pageToken?: string;
    }
    export class Resource$Bidders {
        context: APIRequestContext;
        accounts: Resource$Bidders$Accounts;
        filterSets: Resource$Bidders$Filtersets;
        constructor(context: APIRequestContext);
    }
    export class Resource$Bidders$Accounts {
        context: APIRequestContext;
        filterSets: Resource$Bidders$Accounts$Filtersets;
        constructor(context: APIRequestContext);
    }
    export class Resource$Bidders$Accounts$Filtersets {
        context: APIRequestContext;
        bidMetrics: Resource$Bidders$Accounts$Filtersets$Bidmetrics;
        bidResponseErrors: Resource$Bidders$Accounts$Filtersets$Bidresponseerrors;
        bidResponsesWithoutBids: Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids;
        filteredBidRequests: Resource$Bidders$Accounts$Filtersets$Filteredbidrequests;
        filteredBids: Resource$Bidders$Accounts$Filtersets$Filteredbids;
        impressionMetrics: Resource$Bidders$Accounts$Filtersets$Impressionmetrics;
        losingBids: Resource$Bidders$Accounts$Filtersets$Losingbids;
        nonBillableWinningBids: Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids;
        constructor(context: APIRequestContext);
        /**
         * Creates the specified filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Bidders$Accounts$Filtersets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Bidders$Accounts$Filtersets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        create(params: Params$Resource$Bidders$Accounts$Filtersets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Bidders$Accounts$Filtersets$Create, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(params: Params$Resource$Bidders$Accounts$Filtersets$Create, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Deletes the requested filter set from the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Bidders$Accounts$Filtersets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Bidders$Accounts$Filtersets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Bidders$Accounts$Filtersets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Bidders$Accounts$Filtersets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Bidders$Accounts$Filtersets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the requested filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Bidders$Accounts$Filtersets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Bidders$Accounts$Filtersets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        get(params: Params$Resource$Bidders$Accounts$Filtersets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Bidders$Accounts$Filtersets$Get, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(params: Params$Resource$Bidders$Accounts$Filtersets$Get, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Lists all filter sets for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilterSetsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilterSetsResponse>, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$List, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Create extends StandardParameters {
        /**
         * Whether the filter set is transient, or should be persisted indefinitely. By default, filter sets are not transient. If transient, it will be available for at least 1 hour after creation.
         */
        isTransient?: boolean;
        /**
         * Name of the owner (bidder or account) of the filter set to be created. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FilterSet;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Delete extends StandardParameters {
        /**
         * Full name of the resource to delete. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Get extends StandardParameters {
        /**
         * Full name of the resource being requested. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$List extends StandardParameters {
        /**
         * Name of the owner (bidder or account) of the filter sets to be listed. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilterSetsResponse.nextPageToken returned from the previous call to the accounts.filterSets.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Bidmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of bids.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidMetricsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidMetricsResponse>, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Bidmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidMetricsResponse.nextPageToken returned from the previous call to the bidMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Bidresponseerrors {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all errors that occurred in bid responses, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponseErrorsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponseErrorsResponse>, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Bidresponseerrors$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponseErrorsResponse.nextPageToken returned from the previous call to the bidResponseErrors.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bid responses were considered to have no applicable bids, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponsesWithoutBidsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponsesWithoutBidsResponse.nextPageToken returned from the previous call to the bidResponsesWithoutBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Filteredbidrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons that caused a bid request not to be sent for an impression, with the number of bid requests not sent for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidRequestsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Filteredbidrequests$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidRequestsResponse.nextPageToken returned from the previous call to the filteredBidRequests.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Filteredbids {
        context: APIRequestContext;
        creatives: Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives;
        details: Resource$Bidders$Accounts$Filtersets$Filteredbids$Details;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids were filtered, with the number of bids filtered for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidsResponse.nextPageToken returned from the previous call to the filteredBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all creatives associated with a specific reason for which bids were filtered, with the number of bids filtered for each creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByCreativeResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by creative. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes).
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByCreativeResponse.nextPageToken returned from the previous call to the filteredBids.creatives.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Filteredbids$Details {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all details associated with a specific reason for which bids were filtered, with the number of bids filtered for each detail.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByDetailResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Filteredbids$Details$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by detail. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes). Details are only available for statuses 10, 14, 15, 17, 18, 19, 86, and 87.
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByDetailResponse.nextPageToken returned from the previous call to the filteredBids.details.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Impressionmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of impressions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListImpressionMetricsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListImpressionMetricsResponse>, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Impressionmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListImpressionMetricsResponse.nextPageToken returned from the previous call to the impressionMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Losingbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids lost in the auction, with the number of bids that lost for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLosingBidsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListLosingBidsResponse>, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Losingbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListLosingBidsResponse.nextPageToken returned from the previous call to the losingBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which winning bids were not billable, with the number of bids not billed for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNonBillableWinningBidsResponse>>;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(params: Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListNonBillableWinningBidsResponse.nextPageToken returned from the previous call to the nonBillableWinningBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets {
        context: APIRequestContext;
        bidMetrics: Resource$Bidders$Filtersets$Bidmetrics;
        bidResponseErrors: Resource$Bidders$Filtersets$Bidresponseerrors;
        bidResponsesWithoutBids: Resource$Bidders$Filtersets$Bidresponseswithoutbids;
        filteredBidRequests: Resource$Bidders$Filtersets$Filteredbidrequests;
        filteredBids: Resource$Bidders$Filtersets$Filteredbids;
        impressionMetrics: Resource$Bidders$Filtersets$Impressionmetrics;
        losingBids: Resource$Bidders$Filtersets$Losingbids;
        nonBillableWinningBids: Resource$Bidders$Filtersets$Nonbillablewinningbids;
        constructor(context: APIRequestContext);
        /**
         * Creates the specified filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Bidders$Filtersets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Bidders$Filtersets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        create(params: Params$Resource$Bidders$Filtersets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Bidders$Filtersets$Create, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(params: Params$Resource$Bidders$Filtersets$Create, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Deletes the requested filter set from the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Bidders$Filtersets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Bidders$Filtersets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Bidders$Filtersets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Bidders$Filtersets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Bidders$Filtersets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the requested filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Bidders$Filtersets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Bidders$Filtersets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        get(params: Params$Resource$Bidders$Filtersets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Bidders$Filtersets$Get, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(params: Params$Resource$Bidders$Filtersets$Get, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Lists all filter sets for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilterSetsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilterSetsResponse>, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$List, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Create extends StandardParameters {
        /**
         * Whether the filter set is transient, or should be persisted indefinitely. By default, filter sets are not transient. If transient, it will be available for at least 1 hour after creation.
         */
        isTransient?: boolean;
        /**
         * Name of the owner (bidder or account) of the filter set to be created. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FilterSet;
    }
    export interface Params$Resource$Bidders$Filtersets$Delete extends StandardParameters {
        /**
         * Full name of the resource to delete. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Bidders$Filtersets$Get extends StandardParameters {
        /**
         * Full name of the resource being requested. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Bidders$Filtersets$List extends StandardParameters {
        /**
         * Name of the owner (bidder or account) of the filter sets to be listed. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilterSetsResponse.nextPageToken returned from the previous call to the accounts.filterSets.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Bidmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of bids.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Bidmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Bidmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidMetricsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Bidmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidMetricsResponse>, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidmetrics$List, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Bidmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidMetricsResponse.nextPageToken returned from the previous call to the bidMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Bidresponseerrors {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all errors that occurred in bid responses, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Bidresponseerrors$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponseErrorsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseerrors$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponseErrorsResponse>, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseerrors$List, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Bidresponseerrors$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponseErrorsResponse.nextPageToken returned from the previous call to the bidResponseErrors.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Bidresponseswithoutbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bid responses were considered to have no applicable bids, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponsesWithoutBidsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Bidresponseswithoutbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponsesWithoutBidsResponse.nextPageToken returned from the previous call to the bidResponsesWithoutBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Filteredbidrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons that caused a bid request not to be sent for an impression, with the number of bid requests not sent for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Filteredbidrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidRequestsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbidrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbidrequests$List, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Filteredbidrequests$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidRequestsResponse.nextPageToken returned from the previous call to the filteredBidRequests.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Filteredbids {
        context: APIRequestContext;
        creatives: Resource$Bidders$Filtersets$Filteredbids$Creatives;
        details: Resource$Bidders$Filtersets$Filteredbids$Details;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids were filtered, with the number of bids filtered for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Filteredbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$List, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Filteredbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidsResponse.nextPageToken returned from the previous call to the filteredBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Filteredbids$Creatives {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all creatives associated with a specific reason for which bids were filtered, with the number of bids filtered for each creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByCreativeResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Filteredbids$Creatives$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by creative. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes).
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByCreativeResponse.nextPageToken returned from the previous call to the filteredBids.creatives.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Filteredbids$Details {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all details associated with a specific reason for which bids were filtered, with the number of bids filtered for each detail.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Filteredbids$Details$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByDetailResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Details$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Filteredbids$Details$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Filteredbids$Details$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by detail. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes). Details are only available for statuses 10, 14, 15, 17, 18, 19, 86, and 87.
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByDetailResponse.nextPageToken returned from the previous call to the filteredBids.details.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Impressionmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of impressions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Impressionmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Impressionmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListImpressionMetricsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Impressionmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Impressionmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListImpressionMetricsResponse>, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Impressionmetrics$List, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Impressionmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListImpressionMetricsResponse.nextPageToken returned from the previous call to the impressionMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Losingbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids lost in the auction, with the number of bids that lost for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Losingbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Losingbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLosingBidsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Losingbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Losingbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListLosingBidsResponse>, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Losingbids$List, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Losingbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListLosingBidsResponse.nextPageToken returned from the previous call to the losingBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Bidders$Filtersets$Nonbillablewinningbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which winning bids were not billable, with the number of bids not billed for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNonBillableWinningBidsResponse>>;
        list(params: Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(params: Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
    }
    export interface Params$Resource$Bidders$Filtersets$Nonbillablewinningbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListNonBillableWinningBidsResponse.nextPageToken returned from the previous call to the nonBillableWinningBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers {
        context: APIRequestContext;
        filterSets: Resource$Buyers$Filtersets;
        constructor(context: APIRequestContext);
    }
    export class Resource$Buyers$Filtersets {
        context: APIRequestContext;
        bidMetrics: Resource$Buyers$Filtersets$Bidmetrics;
        bidResponseErrors: Resource$Buyers$Filtersets$Bidresponseerrors;
        bidResponsesWithoutBids: Resource$Buyers$Filtersets$Bidresponseswithoutbids;
        filteredBidRequests: Resource$Buyers$Filtersets$Filteredbidrequests;
        filteredBids: Resource$Buyers$Filtersets$Filteredbids;
        impressionMetrics: Resource$Buyers$Filtersets$Impressionmetrics;
        losingBids: Resource$Buyers$Filtersets$Losingbids;
        nonBillableWinningBids: Resource$Buyers$Filtersets$Nonbillablewinningbids;
        constructor(context: APIRequestContext);
        /**
         * Creates the specified filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Buyers$Filtersets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Buyers$Filtersets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        create(params: Params$Resource$Buyers$Filtersets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Buyers$Filtersets$Create, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(params: Params$Resource$Buyers$Filtersets$Create, callback: BodyResponseCallback<Schema$FilterSet>): void;
        create(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Deletes the requested filter set from the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Buyers$Filtersets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Buyers$Filtersets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Buyers$Filtersets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Buyers$Filtersets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Buyers$Filtersets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves the requested filter set for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Buyers$Filtersets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Buyers$Filtersets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FilterSet>>;
        get(params: Params$Resource$Buyers$Filtersets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Buyers$Filtersets$Get, options: MethodOptions | BodyResponseCallback<Schema$FilterSet>, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(params: Params$Resource$Buyers$Filtersets$Get, callback: BodyResponseCallback<Schema$FilterSet>): void;
        get(callback: BodyResponseCallback<Schema$FilterSet>): void;
        /**
         * Lists all filter sets for the account with the given account ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilterSetsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilterSetsResponse>, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$List, callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilterSetsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Create extends StandardParameters {
        /**
         * Whether the filter set is transient, or should be persisted indefinitely. By default, filter sets are not transient. If transient, it will be available for at least 1 hour after creation.
         */
        isTransient?: boolean;
        /**
         * Name of the owner (bidder or account) of the filter set to be created. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FilterSet;
    }
    export interface Params$Resource$Buyers$Filtersets$Delete extends StandardParameters {
        /**
         * Full name of the resource to delete. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Buyers$Filtersets$Get extends StandardParameters {
        /**
         * Full name of the resource being requested. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        name?: string;
    }
    export interface Params$Resource$Buyers$Filtersets$List extends StandardParameters {
        /**
         * Name of the owner (bidder or account) of the filter sets to be listed. For example: - For a bidder-level filter set for bidder 123: `bidders/123` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456`
         */
        ownerName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilterSetsResponse.nextPageToken returned from the previous call to the accounts.filterSets.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Bidmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of bids.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Bidmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Bidmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidMetricsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Bidmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidMetricsResponse>, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidmetrics$List, callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidMetricsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Bidmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidMetricsResponse.nextPageToken returned from the previous call to the bidMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Bidresponseerrors {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all errors that occurred in bid responses, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Bidresponseerrors$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponseErrorsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseerrors$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseerrors$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponseErrorsResponse>, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseerrors$List, callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponseErrorsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Bidresponseerrors$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponseErrorsResponse.nextPageToken returned from the previous call to the bidResponseErrors.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Bidresponseswithoutbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bid responses were considered to have no applicable bids, with the number of bid responses affected for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBidResponsesWithoutBidsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List, callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBidResponsesWithoutBidsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Bidresponseswithoutbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListBidResponsesWithoutBidsResponse.nextPageToken returned from the previous call to the bidResponsesWithoutBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Filteredbidrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons that caused a bid request not to be sent for an impression, with the number of bid requests not sent for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Filteredbidrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidRequestsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbidrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbidrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbidrequests$List, callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidRequestsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Filteredbidrequests$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidRequestsResponse.nextPageToken returned from the previous call to the filteredBidRequests.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Filteredbids {
        context: APIRequestContext;
        creatives: Resource$Buyers$Filtersets$Filteredbids$Creatives;
        details: Resource$Buyers$Filtersets$Filteredbids$Details;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids were filtered, with the number of bids filtered for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Filteredbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFilteredBidsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListFilteredBidsResponse>, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$List, callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFilteredBidsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Filteredbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListFilteredBidsResponse.nextPageToken returned from the previous call to the filteredBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Filteredbids$Creatives {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all creatives associated with a specific reason for which bids were filtered, with the number of bids filtered for each creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByCreativeResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByCreativeResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Filteredbids$Creatives$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by creative. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes).
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByCreativeResponse.nextPageToken returned from the previous call to the filteredBids.creatives.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Filteredbids$Details {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all details associated with a specific reason for which bids were filtered, with the number of bids filtered for each detail.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Filteredbids$Details$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativeStatusBreakdownByDetailResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Details$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Details$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Filteredbids$Details$List, callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativeStatusBreakdownByDetailResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Filteredbids$Details$List extends StandardParameters {
        /**
         * The ID of the creative status for which to retrieve a breakdown by detail. See [creative-status-codes](https://developers.google.com/authorized-buyers/rtb/downloads/creative-status-codes). Details are only available for statuses 10, 14, 15, 17, 18, 19, 86, and 87.
         */
        creativeStatusId?: number;
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListCreativeStatusBreakdownByDetailResponse.nextPageToken returned from the previous call to the filteredBids.details.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Impressionmetrics {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all metrics that are measured in terms of number of impressions.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Impressionmetrics$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Impressionmetrics$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListImpressionMetricsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Impressionmetrics$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Impressionmetrics$List, options: MethodOptions | BodyResponseCallback<Schema$ListImpressionMetricsResponse>, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Impressionmetrics$List, callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListImpressionMetricsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Impressionmetrics$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListImpressionMetricsResponse.nextPageToken returned from the previous call to the impressionMetrics.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Losingbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which bids lost in the auction, with the number of bids that lost for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Losingbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Losingbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLosingBidsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Losingbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Losingbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListLosingBidsResponse>, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Losingbids$List, callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLosingBidsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Losingbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListLosingBidsResponse.nextPageToken returned from the previous call to the losingBids.list method.
         */
        pageToken?: string;
    }
    export class Resource$Buyers$Filtersets$Nonbillablewinningbids {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List all reasons for which winning bids were not billable, with the number of bids not billed for each reason.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNonBillableWinningBidsResponse>>;
        list(params: Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List, options: MethodOptions | BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(params: Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List, callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNonBillableWinningBidsResponse>): void;
    }
    export interface Params$Resource$Buyers$Filtersets$Nonbillablewinningbids$List extends StandardParameters {
        /**
         * Name of the filter set that should be applied to the requested metrics. For example: - For a bidder-level filter set for bidder 123: `bidders/123/filterSets/abc` - For an account-level filter set for the buyer account representing bidder 123: `bidders/123/accounts/123/filterSets/abc` - For an account-level filter set for the child seat buyer account 456 whose bidder is 123: `bidders/123/accounts/456/filterSets/abc`
         */
        filterSetName?: string;
        /**
         * Requested page size. The server may return fewer results than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of ListNonBillableWinningBidsResponse.nextPageToken returned from the previous call to the nonBillableWinningBids.list method.
         */
        pageToken?: string;
    }
    export {};
}
