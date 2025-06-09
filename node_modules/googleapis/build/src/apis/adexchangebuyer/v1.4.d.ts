import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace adexchangebuyer_v1_4 {
    export interface Options extends GlobalOptions {
        version: 'v1.4';
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
     * const adexchangebuyer = google.adexchangebuyer('v1.4');
     * ```
     */
    export class Adexchangebuyer {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        billingInfo: Resource$Billinginfo;
        budget: Resource$Budget;
        creatives: Resource$Creatives;
        marketplacedeals: Resource$Marketplacedeals;
        marketplacenotes: Resource$Marketplacenotes;
        marketplaceprivateauction: Resource$Marketplaceprivateauction;
        performanceReport: Resource$Performancereport;
        pretargetingConfig: Resource$Pretargetingconfig;
        products: Resource$Products;
        proposals: Resource$Proposals;
        pubprofiles: Resource$Pubprofiles;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Configuration data for an Ad Exchange buyer account.
     */
    export interface Schema$Account {
        /**
         * When this is false, bid requests that include a deal ID for a private auction or preferred deal are always sent to your bidder. When true, all active pretargeting configs will be applied to private auctions and preferred deals. Programmatic Guaranteed deals (when enabled) are always sent to your bidder.
         */
        applyPretargetingToNonGuaranteedDeals?: boolean | null;
        /**
         * Your bidder locations that have distinct URLs.
         */
        bidderLocation?: Array<{
            bidProtocol?: string;
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
    export interface Schema$AddOrderDealsRequest {
        /**
         * The list of deals to add
         */
        deals?: Schema$MarketplaceDeal[];
        /**
         * The last known proposal revision number.
         */
        proposalRevisionNumber?: string | null;
        /**
         * Indicates an optional action to take on the proposal
         */
        updateAction?: string | null;
    }
    export interface Schema$AddOrderDealsResponse {
        /**
         * List of deals added (in the same proposal as passed in the request)
         */
        deals?: Schema$MarketplaceDeal[];
        /**
         * The updated revision number for the proposal.
         */
        proposalRevisionNumber?: string | null;
    }
    export interface Schema$AddOrderNotesRequest {
        /**
         * The list of notes to add.
         */
        notes?: Schema$MarketplaceNote[];
    }
    export interface Schema$AddOrderNotesResponse {
        notes?: Schema$MarketplaceNote[];
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
    export interface Schema$Buyer {
        /**
         * Adx account id of the buyer.
         */
        accountId?: string | null;
    }
    export interface Schema$ContactInformation {
        /**
         * Email address of the contact.
         */
        email?: string | null;
        /**
         * The name of the contact.
         */
        name?: string | null;
    }
    export interface Schema$CreateOrdersRequest {
        /**
         * The list of proposals to create.
         */
        proposals?: Schema$Proposal[];
        /**
         * Web property id of the seller creating these orders
         */
        webPropertyCode?: string | null;
    }
    export interface Schema$CreateOrdersResponse {
        /**
         * The list of proposals successfully created.
         */
        proposals?: Schema$Proposal[];
    }
    /**
     * A creative and its classification data.
     */
    export interface Schema$Creative {
        /**
         * Account id.
         */
        accountId?: number | null;
        /**
         * The link to the Ad Preferences page. This is only supported for native ads.
         */
        adChoicesDestinationUrl?: string | null;
        adTechnologyProviders?: {
            detectedProviderIds?: string[];
            hasUnidentifiedProvider?: boolean;
        } | null;
        /**
         * Detected advertiser id, if any. Read-only. This field should not be set in requests.
         */
        advertiserId?: string[] | null;
        /**
         * The name of the company being advertised in the creative. A list of advertisers is provided in the advertisers.txt file.
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
         * List of buyer selectable attributes for the ads that may be shown from this snippet. Each attribute is represented by an integer as defined in  buyer-declarable-creative-attributes.txt.
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
            contexts?: Array<{
                auctionType?: string[];
                contextType?: string;
                geoCriteriaId?: number[];
                platform?: string[];
            }>;
            details?: string[];
            reason?: string;
        }> | null;
        /**
         * Creative status identity type that the creative item applies to. Ad Exchange real-time bidding is migrating to the sizeless creative verification. Originally, Ad Exchange assigned creative verification status to a unique combination of a buyer creative ID and creative dimensions. Post-migration, a single verification status will be assigned at the buyer creative ID level. This field allows to distinguish whether a given creative status applies to a unique combination of a buyer creative ID and creative dimensions, or to a buyer creative ID as a whole.
         */
        creativeStatusIdentityType?: string | null;
        /**
         * Top-level deals status. Read-only. This field should not be set in requests. If disapproved, an entry for auctionType=DIRECT_DEALS (or ALL) in servingRestrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case it may be preferable to read from servingRestrictions directly.
         */
        dealsStatus?: string | null;
        /**
         * Detected domains for this creative. Read-only. This field should not be set in requests.
         */
        detectedDomains?: string[] | null;
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
         * The HTML snippet that displays the ad when inserted in the web page. If set, videoURL, videoVastXML, and nativeAd should not be set.
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
         * Detected languages for this creative. Read-only. This field should not be set in requests.
         */
        languages?: string[] | null;
        /**
         * If nativeAd is set, HTMLSnippet, videoVastXML, and the videoURL outside of nativeAd should not be set. (The videoURL inside nativeAd can be set.)
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
            clickLinkUrl?: string;
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
            videoURL?: string;
        } | null;
        /**
         * Top-level open auction status. Read-only. This field should not be set in requests. If disapproved, an entry for auctionType=OPEN_AUCTION (or ALL) in servingRestrictions will also exist. Note that this may be nuanced with other contextual restrictions, in which case it may be preferable to read from ServingRestrictions directly.
         */
        openAuctionStatus?: string | null;
        /**
         * Detected product categories, if any. Each category is represented by an integer as defined in  ad-product-categories.txt. Read-only. This field should not be set in requests.
         */
        productCategories?: number[] | null;
        /**
         * All restricted categories for the ads that may be shown from this snippet. Each category is represented by an integer as defined in the  ad-restricted-categories.txt.
         */
        restrictedCategories?: number[] | null;
        /**
         * Detected sensitive categories, if any. Each category is represented by an integer as defined in  ad-sensitive-categories.txt. Read-only. This field should not be set in requests.
         */
        sensitiveCategories?: number[] | null;
        /**
         * The granular status of this ad in specific contexts. A context here relates to where something ultimately serves (for example, a physical location, a platform, an HTTPS vs HTTP request, or the type of auction). Read-only. This field should not be set in requests. See the examples in the Creatives guide for more details.
         */
        servingRestrictions?: Array<{
            contexts?: Array<{
                auctionType?: string[];
                contextType?: string;
                geoCriteriaId?: number[];
                platform?: string[];
            }>;
            disapprovalReasons?: Array<{
                details?: string[];
                reason?: string;
            }>;
            reason?: string;
        }> | null;
        /**
         * List of vendor types for the ads that may be shown from this snippet. Each vendor type is represented by an integer as defined in vendors.txt.
         */
        vendorType?: number[] | null;
        /**
         * The version for this creative. Read-only. This field should not be set in requests.
         */
        version?: number | null;
        /**
         * The URL to fetch a video ad. If set, HTMLSnippet, videoVastXML, and nativeAd should not be set. Note, this is different from resource.native_ad.video_url above.
         */
        videoURL?: string | null;
        /**
         * The contents of a VAST document for a video ad. This document should conform to the VAST 2.0 or 3.0 standard. If set, HTMLSnippet, videoURL, and nativeAd and should not be set.
         */
        videoVastXML?: string | null;
        /**
         * Ad width.
         */
        width?: number | null;
    }
    /**
     * The external deal ids associated with a creative.
     */
    export interface Schema$CreativeDealIds {
        /**
         * A list of external deal ids and ARC approval status.
         */
        dealStatuses?: Array<{
            arcStatus?: string;
            dealId?: string;
            webPropertyId?: number;
        }> | null;
        /**
         * Resource type.
         */
        kind?: string | null;
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
    export interface Schema$DealServingMetadata {
        /**
         * True if alcohol ads are allowed for this deal (read-only). This field is only populated when querying for finalized orders using the method GetFinalizedOrderDeals
         */
        alcoholAdsAllowed?: boolean | null;
        /**
         * Tracks which parties (if any) have paused a deal. (readonly, except via PauseResumeOrderDeals action)
         */
        dealPauseStatus?: Schema$DealServingMetadataDealPauseStatus;
    }
    /**
     * Tracks which parties (if any) have paused a deal. The deal is considered paused if has_buyer_paused || has_seller_paused. Each of the has_buyer_paused or the has_seller_paused bits can be set independently.
     */
    export interface Schema$DealServingMetadataDealPauseStatus {
        buyerPauseReason?: string | null;
        /**
         * If the deal is paused, records which party paused the deal first.
         */
        firstPausedBy?: string | null;
        hasBuyerPaused?: boolean | null;
        hasSellerPaused?: boolean | null;
        sellerPauseReason?: string | null;
    }
    export interface Schema$DealTerms {
        /**
         * Visibility of the URL in bid requests.
         */
        brandingType?: string | null;
        /**
         * Indicates that this ExternalDealId exists under at least two different AdxInventoryDeals. Currently, the only case that the same ExternalDealId will exist is programmatic cross sell case.
         */
        crossListedExternalDealIdType?: string | null;
        /**
         * Description for the proposed terms of the deal.
         */
        description?: string | null;
        /**
         * Non-binding estimate of the estimated gross spend for this deal Can be set by buyer or seller.
         */
        estimatedGrossSpend?: Schema$Price;
        /**
         * Non-binding estimate of the impressions served per day Can be set by buyer or seller.
         */
        estimatedImpressionsPerDay?: string | null;
        /**
         * The terms for guaranteed fixed price deals.
         */
        guaranteedFixedPriceTerms?: Schema$DealTermsGuaranteedFixedPriceTerms;
        /**
         * The terms for non-guaranteed auction deals.
         */
        nonGuaranteedAuctionTerms?: Schema$DealTermsNonGuaranteedAuctionTerms;
        /**
         * The terms for non-guaranteed fixed price deals.
         */
        nonGuaranteedFixedPriceTerms?: Schema$DealTermsNonGuaranteedFixedPriceTerms;
        /**
         * The terms for rubicon non-guaranteed deals.
         */
        rubiconNonGuaranteedTerms?: Schema$DealTermsRubiconNonGuaranteedTerms;
        /**
         * For deals with Cost Per Day billing, defines the timezone used to mark the boundaries of a day (buyer-readonly)
         */
        sellerTimeZone?: string | null;
    }
    export interface Schema$DealTermsGuaranteedFixedPriceTerms {
        /**
         * External billing info for this Deal. This field is relevant when external billing info such as price has a different currency code than DFP/AdX.
         */
        billingInfo?: Schema$DealTermsGuaranteedFixedPriceTermsBillingInfo;
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
         * Count of minimum daily looks for a CPD deal. For CPD deals, buyer should negotiate on this field instead of guaranteed_looks.
         */
        minimumDailyLooks?: string | null;
    }
    export interface Schema$DealTermsGuaranteedFixedPriceTermsBillingInfo {
        /**
         * The timestamp (in ms since epoch) when the original reservation price for the deal was first converted to DFP currency. This is used to convert the contracted price into buyer's currency without discrepancy.
         */
        currencyConversionTimeMs?: string | null;
        /**
         * The DFP line item id associated with this deal. For features like CPD, buyers can retrieve the DFP line item for billing reconciliation.
         */
        dfpLineItemId?: string | null;
        /**
         * The original contracted quantity (# impressions) for this deal. To ensure delivery, sometimes the publisher will book the deal with a impression buffer, such that guaranteed_looks is greater than the contracted quantity. However clients are billed using the original contracted quantity.
         */
        originalContractedQuantity?: string | null;
        /**
         * The original reservation price for the deal, if the currency code is different from the one used in negotiation.
         */
        price?: Schema$Price;
    }
    export interface Schema$DealTermsNonGuaranteedAuctionTerms {
        /**
         * True if open auction buyers are allowed to compete with invited buyers in this private auction (buyer-readonly).
         */
        autoOptimizePrivateAuction?: boolean | null;
        /**
         * Reserve price for the specified buyer.
         */
        reservePricePerBuyers?: Schema$PricePerBuyer[];
    }
    export interface Schema$DealTermsNonGuaranteedFixedPriceTerms {
        /**
         * Fixed price for the specified buyer.
         */
        fixedPrices?: Schema$PricePerBuyer[];
    }
    export interface Schema$DealTermsRubiconNonGuaranteedTerms {
        /**
         * Optional price for Rubicon priority access in the auction.
         */
        priorityPrice?: Schema$Price;
        /**
         * Optional price for Rubicon standard access in the auction.
         */
        standardPrice?: Schema$Price;
    }
    export interface Schema$DeleteOrderDealsRequest {
        /**
         * List of deals to delete for a given proposal
         */
        dealIds?: string[] | null;
        /**
         * The last known proposal revision number.
         */
        proposalRevisionNumber?: string | null;
        /**
         * Indicates an optional action to take on the proposal
         */
        updateAction?: string | null;
    }
    export interface Schema$DeleteOrderDealsResponse {
        /**
         * List of deals deleted (in the same proposal as passed in the request)
         */
        deals?: Schema$MarketplaceDeal[];
        /**
         * The updated revision number for the proposal.
         */
        proposalRevisionNumber?: string | null;
    }
    export interface Schema$DeliveryControl {
        creativeBlockingLevel?: string | null;
        deliveryRateType?: string | null;
        frequencyCaps?: Schema$DeliveryControlFrequencyCap[];
    }
    export interface Schema$DeliveryControlFrequencyCap {
        maxImpressions?: number | null;
        numTimeUnits?: number | null;
        timeUnitType?: string | null;
    }
    /**
     * This message carries publisher provided breakdown. E.g. {dimension_type: 'COUNTRY', [{dimension_value: {id: 1, name: 'US'\}\}, {dimension_value: {id: 2, name: 'UK'\}\}]\}
     */
    export interface Schema$Dimension {
        dimensionType?: string | null;
        dimensionValues?: Schema$DimensionDimensionValue[];
    }
    /**
     * Value of the dimension.
     */
    export interface Schema$DimensionDimensionValue {
        /**
         * Id of the dimension.
         */
        id?: number | null;
        /**
         * Name of the dimension mainly for debugging purposes, except for the case of CREATIVE_SIZE. For CREATIVE_SIZE, strings are used instead of ids.
         */
        name?: string | null;
        /**
         * Percent of total impressions for a dimension type. e.g. {dimension_type: 'GENDER', [{dimension_value: {id: 1, name: 'MALE', percentage: 60\}\}]\} Gender MALE is 60% of all impressions which have gender.
         */
        percentage?: number | null;
    }
    export interface Schema$EditAllOrderDealsRequest {
        /**
         * List of deals to edit. Service may perform 3 different operations based on comparison of deals in this list vs deals already persisted in database: 1. Add new deal to proposal If a deal in this list does not exist in the proposal, the service will create a new deal and add it to the proposal. Validation will follow AddOrderDealsRequest. 2. Update existing deal in the proposal If a deal in this list already exist in the proposal, the service will update that existing deal to this new deal in the request. Validation will follow UpdateOrderDealsRequest. 3. Delete deals from the proposal (just need the id) If a existing deal in the proposal is not present in this list, the service will delete that deal from the proposal. Validation will follow DeleteOrderDealsRequest.
         */
        deals?: Schema$MarketplaceDeal[];
        /**
         * If specified, also updates the proposal in the batch transaction. This is useful when the proposal and the deals need to be updated in one transaction.
         */
        proposal?: Schema$Proposal;
        /**
         * The last known revision number for the proposal.
         */
        proposalRevisionNumber?: string | null;
        /**
         * Indicates an optional action to take on the proposal
         */
        updateAction?: string | null;
    }
    export interface Schema$EditAllOrderDealsResponse {
        /**
         * List of all deals in the proposal after edit.
         */
        deals?: Schema$MarketplaceDeal[];
        /**
         * The latest revision number after the update has been applied.
         */
        orderRevisionNumber?: string | null;
    }
    export interface Schema$GetOffersResponse {
        /**
         * The returned list of products.
         */
        products?: Schema$Product[];
    }
    export interface Schema$GetOrderDealsResponse {
        /**
         * List of deals for the proposal
         */
        deals?: Schema$MarketplaceDeal[];
    }
    export interface Schema$GetOrderNotesResponse {
        /**
         * The list of matching notes. The notes for a proposal are ordered from oldest to newest. If the notes span multiple proposals, they will be grouped by proposal, with the notes for the most recently modified proposal appearing first.
         */
        notes?: Schema$MarketplaceNote[];
    }
    export interface Schema$GetOrdersResponse {
        /**
         * The list of matching proposals.
         */
        proposals?: Schema$Proposal[];
    }
    export interface Schema$GetPublisherProfilesByAccountIdResponse {
        /**
         * Profiles for the requested publisher
         */
        profiles?: Schema$PublisherProfileApiProto[];
    }
    /**
     * A proposal can contain multiple deals. A deal contains the terms and targeting information that is used for serving.
     */
    export interface Schema$MarketplaceDeal {
        /**
         * Buyer private data (hidden from seller).
         */
        buyerPrivateData?: Schema$PrivateData;
        /**
         * The time (ms since epoch) of the deal creation. (readonly)
         */
        creationTimeMs?: string | null;
        /**
         * Specifies the creative pre-approval policy (buyer-readonly)
         */
        creativePreApprovalPolicy?: string | null;
        /**
         * Specifies whether the creative is safeFrame compatible (buyer-readonly)
         */
        creativeSafeFrameCompatibility?: string | null;
        /**
         * A unique deal-id for the deal (readonly).
         */
        dealId?: string | null;
        /**
         * Metadata about the serving status of this deal (readonly, writes via custom actions)
         */
        dealServingMetadata?: Schema$DealServingMetadata;
        /**
         * The set of fields around delivery control that are interesting for a buyer to see but are non-negotiable. These are set by the publisher. This message is assigned an id of 100 since some day we would want to model this as a protobuf extension.
         */
        deliveryControl?: Schema$DeliveryControl;
        /**
         * The external deal id assigned to this deal once the deal is finalized. This is the deal-id that shows up in serving/reporting etc. (readonly)
         */
        externalDealId?: string | null;
        /**
         * Proposed flight end time of the deal (ms since epoch) This will generally be stored in a granularity of a second. (updatable)
         */
        flightEndTimeMs?: string | null;
        /**
         * Proposed flight start time of the deal (ms since epoch) This will generally be stored in a granularity of a second. (updatable)
         */
        flightStartTimeMs?: string | null;
        /**
         * Description for the deal terms. (buyer-readonly)
         */
        inventoryDescription?: string | null;
        /**
         * Indicates whether the current deal is a RFP template. RFP template is created by buyer and not based on seller created products.
         */
        isRfpTemplate?: boolean | null;
        /**
         * True, if the buyside inventory setup is complete for this deal. (readonly, except via OrderSetupCompleted action)
         */
        isSetupComplete?: boolean | null;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "adexchangebuyer#marketplaceDeal".
         */
        kind?: string | null;
        /**
         * The time (ms since epoch) when the deal was last updated. (readonly)
         */
        lastUpdateTimeMs?: string | null;
        makegoodRequestedReason?: string | null;
        /**
         * The name of the deal. (updatable)
         */
        name?: string | null;
        /**
         * The product-id from which this deal was created. (readonly, except on create)
         */
        productId?: string | null;
        /**
         * The revision number of the product that the deal was created from (readonly, except on create)
         */
        productRevisionNumber?: string | null;
        /**
         * Specifies the creative source for programmatic deals, PUBLISHER means creative is provided by seller and ADVERTISR means creative is provided by buyer. (buyer-readonly)
         */
        programmaticCreativeSource?: string | null;
        proposalId?: string | null;
        /**
         * Optional Seller contact information for the deal (buyer-readonly)
         */
        sellerContacts?: Schema$ContactInformation[];
        /**
         * The shared targeting visible to buyers and sellers. Each shared targeting entity is AND'd together. (updatable)
         */
        sharedTargetings?: Schema$SharedTargeting[];
        /**
         * The syndication product associated with the deal. (readonly, except on create)
         */
        syndicationProduct?: string | null;
        /**
         * The negotiable terms of the deal. (updatable)
         */
        terms?: Schema$DealTerms;
        webPropertyCode?: string | null;
    }
    export interface Schema$MarketplaceDealParty {
        /**
         * The buyer/seller associated with the deal. One of buyer/seller is specified for a deal-party.
         */
        buyer?: Schema$Buyer;
        /**
         * The buyer/seller associated with the deal. One of buyer/seller is specified for a deal party.
         */
        seller?: Schema$Seller;
    }
    export interface Schema$MarketplaceLabel {
        /**
         * The accountId of the party that created the label.
         */
        accountId?: string | null;
        /**
         * The creation time (in ms since epoch) for the label.
         */
        createTimeMs?: string | null;
        /**
         * Information about the party that created the label.
         */
        deprecatedMarketplaceDealParty?: Schema$MarketplaceDealParty;
        /**
         * The label to use.
         */
        label?: string | null;
    }
    /**
     * A proposal is associated with a bunch of notes which may optionally be associated with a deal and/or revision number.
     */
    export interface Schema$MarketplaceNote {
        /**
         * The role of the person (buyer/seller) creating the note. (readonly)
         */
        creatorRole?: string | null;
        /**
         * Notes can optionally be associated with a deal. (readonly, except on create)
         */
        dealId?: string | null;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "adexchangebuyer#marketplaceNote".
         */
        kind?: string | null;
        /**
         * The actual note to attach. (readonly, except on create)
         */
        note?: string | null;
        /**
         * The unique id for the note. (readonly)
         */
        noteId?: string | null;
        /**
         * The proposalId that a note is attached to. (readonly)
         */
        proposalId?: string | null;
        /**
         * If the note is associated with a proposal revision number, then store that here. (readonly, except on create)
         */
        proposalRevisionNumber?: string | null;
        /**
         * The timestamp (ms since epoch) that this note was created. (readonly)
         */
        timestampMs?: string | null;
    }
    export interface Schema$MobileApplication {
        appStore?: string | null;
        externalAppId?: string | null;
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
         * Requests where the predicted viewability is below the specified decile will not match. E.g. if the buyer sets this value to 5, requests from slots where the predicted viewability is below 50% will not match. If the predicted viewability is unknown this field will be ignored.
         */
        minimumViewabilityDecile?: number | null;
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
         * Requests containing the specified type of user data will match. Possible values are HOSTED_MATCH_DATA, which means the request is cookie-targetable and has a match in the buyer's hosted match table, and COOKIE_OR_IDFA, which means the request has either a targetable cookie or an iOS IDFA.
         */
        userIdentifierDataRequired?: string[] | null;
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
        /**
         * Video requests satisfying any of these player size constraints will match.
         */
        videoPlayerSizes?: Array<{
            aspectRatio?: string;
            minHeight?: string;
            minWidth?: string;
        }> | null;
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
    export interface Schema$Price {
        /**
         * The price value in micros.
         */
        amountMicros?: number | null;
        /**
         * The currency code for the price.
         */
        currencyCode?: string | null;
        /**
         * In case of CPD deals, the expected CPM in micros.
         */
        expectedCpmMicros?: number | null;
        /**
         * The pricing type for the deal/product.
         */
        pricingType?: string | null;
    }
    /**
     * Used to specify pricing rules for buyers. Each PricePerBuyer in a product can become [0,1] deals. To check if there is a PricePerBuyer for a particular buyer we look for the most specific matching rule - we first look for a rule matching the buyer and otherwise look for a matching rule where no buyer is set.
     */
    export interface Schema$PricePerBuyer {
        /**
         * Optional access type for this buyer.
         */
        auctionTier?: string | null;
        /**
         * Reference to the buyer that will get billed.
         */
        billedBuyer?: Schema$Buyer;
        /**
         * The buyer who will pay this price. If unset, all buyers can pay this price (if the advertisers match, and there's no more specific rule matching the buyer).
         */
        buyer?: Schema$Buyer;
        /**
         * The specified price
         */
        price?: Schema$Price;
    }
    export interface Schema$PrivateData {
        referenceId?: string | null;
        referencePayload?: string | null;
    }
    /**
     * A product is segment of inventory that a seller wishes to sell. It is associated with certain terms and targeting information which helps buyer know more about the inventory. Each field in a product can have one of the following setting:
     *
     * (readonly) - It is an error to try and set this field. (buyer-readonly) - Only the seller can set this field. (seller-readonly) - Only the buyer can set this field. (updatable) - The field is updatable at all times by either buyer or the seller.
     */
    export interface Schema$Product {
        /**
         * The billed buyer corresponding to the buyer that created the offer. (readonly, except on create)
         */
        billedBuyer?: Schema$Buyer;
        /**
         * The buyer that created the offer if this is a buyer initiated offer (readonly, except on create)
         */
        buyer?: Schema$Buyer;
        /**
         * Creation time in ms. since epoch (readonly)
         */
        creationTimeMs?: string | null;
        /**
         * Optional contact information for the creator of this product. (buyer-readonly)
         */
        creatorContacts?: Schema$ContactInformation[];
        /**
         * The role that created the offer. Set to BUYER for buyer initiated offers.
         */
        creatorRole?: string | null;
        /**
         * The set of fields around delivery control that are interesting for a buyer to see but are non-negotiable. These are set by the publisher. This message is assigned an id of 100 since some day we would want to model this as a protobuf extension.
         */
        deliveryControl?: Schema$DeliveryControl;
        /**
         * The proposed end time for the deal (ms since epoch) (buyer-readonly)
         */
        flightEndTimeMs?: string | null;
        /**
         * Inventory availability dates. (times are in ms since epoch) The granularity is generally in the order of seconds. (buyer-readonly)
         */
        flightStartTimeMs?: string | null;
        /**
         * If the creator has already signed off on the product, then the buyer can finalize the deal by accepting the product as is. When copying to a proposal, if any of the terms are changed, then auto_finalize is automatically set to false.
         */
        hasCreatorSignedOff?: boolean | null;
        /**
         * What exchange will provide this inventory (readonly, except on create).
         */
        inventorySource?: string | null;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "adexchangebuyer#product".
         */
        kind?: string | null;
        /**
         * Optional List of labels for the product (optional, buyer-readonly).
         */
        labels?: Schema$MarketplaceLabel[];
        /**
         * Time of last update in ms. since epoch (readonly)
         */
        lastUpdateTimeMs?: string | null;
        /**
         * Optional legacy offer id if this offer is a preferred deal offer.
         */
        legacyOfferId?: string | null;
        /**
         * Marketplace publisher profile Id. This Id differs from the regular publisher_profile_id in that 1. This is a new id, the old Id will be deprecated in 2017. 2. This id uniquely identifies a publisher profile by itself.
         */
        marketplacePublisherProfileId?: string | null;
        /**
         * The name for this product as set by the seller. (buyer-readonly)
         */
        name?: string | null;
        /**
         * Optional private auction id if this offer is a private auction offer.
         */
        privateAuctionId?: string | null;
        /**
         * The unique id for the product (readonly)
         */
        productId?: string | null;
        /**
         * Id of the publisher profile for a given seller. A (seller.account_id, publisher_profile_id) pair uniquely identifies a publisher profile. Buyers can call the PublisherProfiles::List endpoint to get a list of publisher profiles for a given seller.
         */
        publisherProfileId?: string | null;
        /**
         * Publisher self-provided forecast information.
         */
        publisherProvidedForecast?: Schema$PublisherProvidedForecast;
        /**
         * The revision number of the product. (readonly)
         */
        revisionNumber?: string | null;
        /**
         * Information about the seller that created this product (readonly, except on create)
         */
        seller?: Schema$Seller;
        /**
         * Targeting that is shared between the buyer and the seller. Each targeting criteria has a specified key and for each key there is a list of inclusion value or exclusion values. (buyer-readonly)
         */
        sharedTargetings?: Schema$SharedTargeting[];
        /**
         * The state of the product. (buyer-readonly)
         */
        state?: string | null;
        /**
         * The syndication product associated with the deal. (readonly, except on create)
         */
        syndicationProduct?: string | null;
        /**
         * The negotiable terms of the deal (buyer-readonly)
         */
        terms?: Schema$DealTerms;
        /**
         * The web property code for the seller. This field is meant to be copied over as is when creating deals.
         */
        webPropertyCode?: string | null;
    }
    /**
     * Represents a proposal in the marketplace. A proposal is the unit of negotiation between a seller and a buyer and contains deals which are served. Each field in a proposal can have one of the following setting:
     *
     * (readonly) - It is an error to try and set this field. (buyer-readonly) - Only the seller can set this field. (seller-readonly) - Only the buyer can set this field. (updatable) - The field is updatable at all times by either buyer or the seller.
     */
    export interface Schema$Proposal {
        /**
         * Reference to the buyer that will get billed for this proposal. (readonly)
         */
        billedBuyer?: Schema$Buyer;
        /**
         * Reference to the buyer on the proposal. (readonly, except on create)
         */
        buyer?: Schema$Buyer;
        /**
         * Optional contact information of the buyer. (seller-readonly)
         */
        buyerContacts?: Schema$ContactInformation[];
        /**
         * Private data for buyer. (hidden from seller).
         */
        buyerPrivateData?: Schema$PrivateData;
        /**
         * IDs of DBM advertisers permission to this proposal.
         */
        dbmAdvertiserIds?: string[] | null;
        /**
         * When an proposal is in an accepted state, indicates whether the buyer has signed off. Once both sides have signed off on a deal, the proposal can be finalized by the seller. (seller-readonly)
         */
        hasBuyerSignedOff?: boolean | null;
        /**
         * When an proposal is in an accepted state, indicates whether the buyer has signed off Once both sides have signed off on a deal, the proposal can be finalized by the seller. (buyer-readonly)
         */
        hasSellerSignedOff?: boolean | null;
        /**
         * What exchange will provide this inventory (readonly, except on create).
         */
        inventorySource?: string | null;
        /**
         * True if the proposal is being renegotiated (readonly).
         */
        isRenegotiating?: boolean | null;
        /**
         * True, if the buyside inventory setup is complete for this proposal. (readonly, except via OrderSetupCompleted action) Deprecated in favor of deal level setup complete flag.
         */
        isSetupComplete?: boolean | null;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "adexchangebuyer#proposal".
         */
        kind?: string | null;
        /**
         * List of labels associated with the proposal. (readonly)
         */
        labels?: Schema$MarketplaceLabel[];
        /**
         * The role of the last user that either updated the proposal or left a comment. (readonly)
         */
        lastUpdaterOrCommentorRole?: string | null;
        /**
         * The name for the proposal (updatable)
         */
        name?: string | null;
        /**
         * Optional negotiation id if this proposal is a preferred deal proposal.
         */
        negotiationId?: string | null;
        /**
         * Indicates whether the buyer/seller created the proposal.(readonly)
         */
        originatorRole?: string | null;
        /**
         * Optional private auction id if this proposal is a private auction proposal.
         */
        privateAuctionId?: string | null;
        /**
         * The unique id of the proposal. (readonly).
         */
        proposalId?: string | null;
        /**
         * The current state of the proposal. (readonly)
         */
        proposalState?: string | null;
        /**
         * The revision number for the proposal (readonly).
         */
        revisionNumber?: string | null;
        /**
         * The time (ms since epoch) when the proposal was last revised (readonly).
         */
        revisionTimeMs?: string | null;
        /**
         * Reference to the seller on the proposal. (readonly, except on create)
         */
        seller?: Schema$Seller;
        /**
         * Optional contact information of the seller (buyer-readonly).
         */
        sellerContacts?: Schema$ContactInformation[];
    }
    export interface Schema$PublisherProfileApiProto {
        /**
         * Publisher provided info on its audience.
         */
        audience?: string | null;
        /**
         * A pitch statement for the buyer
         */
        buyerPitchStatement?: string | null;
        /**
         * Direct contact for the publisher profile.
         */
        directContact?: string | null;
        /**
         * Exchange where this publisher profile is from. E.g. AdX, Rubicon etc...
         */
        exchange?: string | null;
        forecastInventory?: string | null;
        /**
         * Link to publisher's Google+ page.
         */
        googlePlusLink?: string | null;
        /**
         * True, if this is the parent profile, which represents all domains owned by the publisher.
         */
        isParent?: boolean | null;
        /**
         * True, if this profile is published. Deprecated for state.
         */
        isPublished?: boolean | null;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "adexchangebuyer#publisherProfileApiProto".
         */
        kind?: string | null;
        /**
         * The url to the logo for the publisher.
         */
        logoUrl?: string | null;
        /**
         * The url for additional marketing and sales materials.
         */
        mediaKitLink?: string | null;
        name?: string | null;
        /**
         * Publisher provided overview.
         */
        overview?: string | null;
        /**
         * The pair of (seller.account_id, profile_id) uniquely identifies a publisher profile for a given publisher.
         */
        profileId?: number | null;
        /**
         * Programmatic contact for the publisher profile.
         */
        programmaticContact?: string | null;
        /**
         * The list of app IDs represented in this publisher profile. Empty if this is a parent profile. Deprecated in favor of publisher_app.
         */
        publisherAppIds?: string[] | null;
        /**
         * The list of apps represented in this publisher profile. Empty if this is a parent profile.
         */
        publisherApps?: Schema$MobileApplication[];
        /**
         * The list of domains represented in this publisher profile. Empty if this is a parent profile.
         */
        publisherDomains?: string[] | null;
        /**
         * Unique Id for publisher profile.
         */
        publisherProfileId?: string | null;
        /**
         * Publisher provided forecasting information.
         */
        publisherProvidedForecast?: Schema$PublisherProvidedForecast;
        /**
         * Link to publisher rate card
         */
        rateCardInfoLink?: string | null;
        /**
         * Link for a sample content page.
         */
        samplePageLink?: string | null;
        /**
         * Seller of the publisher profile.
         */
        seller?: Schema$Seller;
        /**
         * State of the publisher profile.
         */
        state?: string | null;
        /**
         * Publisher provided key metrics and rankings.
         */
        topHeadlines?: string[] | null;
    }
    /**
     * This message carries publisher provided forecasting information.
     */
    export interface Schema$PublisherProvidedForecast {
        /**
         * Publisher provided dimensions. E.g. geo, sizes etc...
         */
        dimensions?: Schema$Dimension[];
        /**
         * Publisher provided weekly impressions.
         */
        weeklyImpressions?: string | null;
        /**
         * Publisher provided weekly uniques.
         */
        weeklyUniques?: string | null;
    }
    export interface Schema$Seller {
        /**
         * The unique id for the seller. The seller fills in this field. The seller account id is then available to buyer in the product.
         */
        accountId?: string | null;
        /**
         * Optional sub-account id for the seller.
         */
        subAccountId?: string | null;
    }
    export interface Schema$SharedTargeting {
        /**
         * The list of values to exclude from targeting. Each value is AND'd together.
         */
        exclusions?: Schema$TargetingValue[];
        /**
         * The list of value to include as part of the targeting. Each value is OR'd together.
         */
        inclusions?: Schema$TargetingValue[];
        /**
         * The key representing the shared targeting criterion.
         */
        key?: string | null;
    }
    export interface Schema$TargetingValue {
        /**
         * The creative size value to exclude/include.
         */
        creativeSizeValue?: Schema$TargetingValueCreativeSize;
        /**
         * The daypart targeting to include / exclude. Filled in when the key is GOOG_DAYPART_TARGETING.
         */
        dayPartTargetingValue?: Schema$TargetingValueDayPartTargeting;
        demogAgeCriteriaValue?: Schema$TargetingValueDemogAgeCriteria;
        demogGenderCriteriaValue?: Schema$TargetingValueDemogGenderCriteria;
        /**
         * The long value to exclude/include.
         */
        longValue?: string | null;
        requestPlatformTargetingValue?: Schema$TargetingValueRequestPlatformTargeting;
        /**
         * The string value to exclude/include.
         */
        stringValue?: string | null;
    }
    /**
     * Next Id: 7
     */
    export interface Schema$TargetingValueCreativeSize {
        /**
         * The formats allowed by the publisher.
         */
        allowedFormats?: string[] | null;
        /**
         * For video size type, the list of companion sizes.
         */
        companionSizes?: Schema$TargetingValueSize[];
        /**
         * The Creative size type.
         */
        creativeSizeType?: string | null;
        /**
         * The native template for native ad.
         */
        nativeTemplate?: string | null;
        /**
         * For regular or video creative size type, specifies the size of the creative.
         */
        size?: Schema$TargetingValueSize;
        /**
         * The skippable ad type for video size.
         */
        skippableAdType?: string | null;
    }
    export interface Schema$TargetingValueDayPartTargeting {
        dayParts?: Schema$TargetingValueDayPartTargetingDayPart[];
        timeZoneType?: string | null;
    }
    export interface Schema$TargetingValueDayPartTargetingDayPart {
        dayOfWeek?: string | null;
        endHour?: number | null;
        endMinute?: number | null;
        startHour?: number | null;
        startMinute?: number | null;
    }
    export interface Schema$TargetingValueDemogAgeCriteria {
        demogAgeCriteriaIds?: string[] | null;
    }
    export interface Schema$TargetingValueDemogGenderCriteria {
        demogGenderCriteriaIds?: string[] | null;
    }
    export interface Schema$TargetingValueRequestPlatformTargeting {
        requestPlatforms?: string[] | null;
    }
    export interface Schema$TargetingValueSize {
        /**
         * The height of the creative.
         */
        height?: number | null;
        /**
         * The width of the creative.
         */
        width?: number | null;
    }
    export interface Schema$UpdatePrivateAuctionProposalRequest {
        /**
         * The externalDealId of the deal to be updated.
         */
        externalDealId?: string | null;
        /**
         * Optional note to be added.
         */
        note?: Schema$MarketplaceNote;
        /**
         * The current revision number of the proposal to be updated.
         */
        proposalRevisionNumber?: string | null;
        /**
         * The proposed action on the private auction proposal.
         */
        updateAction?: string | null;
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   //   "applyPretargetingToNonGuaranteedDeals": false,
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *     // Confirmation for erasing bidder and cookie matching urls.
         *     confirmUnsafeAccountChange: 'placeholder-value',
         *     // The account id
         *     id: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "applyPretargetingToNonGuaranteedDeals": false,
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
         *   //   "applyPretargetingToNonGuaranteedDeals": false,
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *     // Confirmation for erasing bidder and cookie matching urls.
         *     confirmUnsafeAccountChange: 'placeholder-value',
         *     // The account id
         *     id: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "applyPretargetingToNonGuaranteedDeals": false,
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
         *   //   "applyPretargetingToNonGuaranteedDeals": false,
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
         * Confirmation for erasing bidder and cookie matching urls.
         */
        confirmUnsafeAccountChange?: boolean;
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
         * Confirmation for erasing bidder and cookie matching urls.
         */
        confirmUnsafeAccountChange?: boolean;
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * Add a deal id association for the creative.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.creatives.addDeal({
         *     // The id for the account that will serve this creative.
         *     accountId: 'placeholder-value',
         *     // The buyer-specific id for this creative.
         *     buyerCreativeId: 'placeholder-value',
         *     // The id of the deal id to associate with this creative.
         *     dealId: 'placeholder-value',
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
        addDeal(params: Params$Resource$Creatives$Adddeal, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        addDeal(params?: Params$Resource$Creatives$Adddeal, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        addDeal(params: Params$Resource$Creatives$Adddeal, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        addDeal(params: Params$Resource$Creatives$Adddeal, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        addDeal(params: Params$Resource$Creatives$Adddeal, callback: BodyResponseCallback<void>): void;
        addDeal(callback: BodyResponseCallback<void>): void;
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   //   "adChoicesDestinationUrl": "my_adChoicesDestinationUrl",
         *   //   "adTechnologyProviders": {},
         *   //   "advertiserId": [],
         *   //   "advertiserName": "my_advertiserName",
         *   //   "agencyId": "my_agencyId",
         *   //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *   //   "attribute": [],
         *   //   "buyerCreativeId": "my_buyerCreativeId",
         *   //   "clickThroughUrl": [],
         *   //   "corrections": [],
         *   //   "creativeStatusIdentityType": "my_creativeStatusIdentityType",
         *   //   "dealsStatus": "my_dealsStatus",
         *   //   "detectedDomains": [],
         *   //   "filteringReasons": {},
         *   //   "height": 0,
         *   //   "impressionTrackingUrl": [],
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "nativeAd": {},
         *   //   "openAuctionStatus": "my_openAuctionStatus",
         *   //   "productCategories": [],
         *   //   "restrictedCategories": [],
         *   //   "sensitiveCategories": [],
         *   //   "servingRestrictions": [],
         *   //   "vendorType": [],
         *   //   "version": 0,
         *   //   "videoURL": "my_videoURL",
         *   //   "videoVastXML": "my_videoVastXML",
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *       //   "adChoicesDestinationUrl": "my_adChoicesDestinationUrl",
         *       //   "adTechnologyProviders": {},
         *       //   "advertiserId": [],
         *       //   "advertiserName": "my_advertiserName",
         *       //   "agencyId": "my_agencyId",
         *       //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *       //   "attribute": [],
         *       //   "buyerCreativeId": "my_buyerCreativeId",
         *       //   "clickThroughUrl": [],
         *       //   "corrections": [],
         *       //   "creativeStatusIdentityType": "my_creativeStatusIdentityType",
         *       //   "dealsStatus": "my_dealsStatus",
         *       //   "detectedDomains": [],
         *       //   "filteringReasons": {},
         *       //   "height": 0,
         *       //   "impressionTrackingUrl": [],
         *       //   "kind": "my_kind",
         *       //   "languages": [],
         *       //   "nativeAd": {},
         *       //   "openAuctionStatus": "my_openAuctionStatus",
         *       //   "productCategories": [],
         *       //   "restrictedCategories": [],
         *       //   "sensitiveCategories": [],
         *       //   "servingRestrictions": [],
         *       //   "vendorType": [],
         *       //   "version": 0,
         *       //   "videoURL": "my_videoURL",
         *       //   "videoVastXML": "my_videoVastXML",
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
         *   //   "adChoicesDestinationUrl": "my_adChoicesDestinationUrl",
         *   //   "adTechnologyProviders": {},
         *   //   "advertiserId": [],
         *   //   "advertiserName": "my_advertiserName",
         *   //   "agencyId": "my_agencyId",
         *   //   "apiUploadTimestamp": "my_apiUploadTimestamp",
         *   //   "attribute": [],
         *   //   "buyerCreativeId": "my_buyerCreativeId",
         *   //   "clickThroughUrl": [],
         *   //   "corrections": [],
         *   //   "creativeStatusIdentityType": "my_creativeStatusIdentityType",
         *   //   "dealsStatus": "my_dealsStatus",
         *   //   "detectedDomains": [],
         *   //   "filteringReasons": {},
         *   //   "height": 0,
         *   //   "impressionTrackingUrl": [],
         *   //   "kind": "my_kind",
         *   //   "languages": [],
         *   //   "nativeAd": {},
         *   //   "openAuctionStatus": "my_openAuctionStatus",
         *   //   "productCategories": [],
         *   //   "restrictedCategories": [],
         *   //   "sensitiveCategories": [],
         *   //   "servingRestrictions": [],
         *   //   "vendorType": [],
         *   //   "version": 0,
         *   //   "videoURL": "my_videoURL",
         *   //   "videoVastXML": "my_videoVastXML",
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *     // When specified, only creatives having the given deals status are returned.
         *     dealsStatusFilter: 'placeholder-value',
         *     // Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         *     maxResults: 'placeholder-value',
         *     // When specified, only creatives having the given open auction status are returned.
         *     openAuctionStatusFilter: 'placeholder-value',
         *     // A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         *     pageToken: 'placeholder-value',
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
        /**
         * Lists the external deal ids associated with the creative.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.creatives.listDeals({
         *     // The id for the account that will serve this creative.
         *     accountId: 'placeholder-value',
         *     // The buyer-specific id for this creative.
         *     buyerCreativeId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dealStatuses": [],
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
        listDeals(params: Params$Resource$Creatives$Listdeals, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listDeals(params?: Params$Resource$Creatives$Listdeals, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CreativeDealIds>>;
        listDeals(params: Params$Resource$Creatives$Listdeals, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listDeals(params: Params$Resource$Creatives$Listdeals, options: MethodOptions | BodyResponseCallback<Schema$CreativeDealIds>, callback: BodyResponseCallback<Schema$CreativeDealIds>): void;
        listDeals(params: Params$Resource$Creatives$Listdeals, callback: BodyResponseCallback<Schema$CreativeDealIds>): void;
        listDeals(callback: BodyResponseCallback<Schema$CreativeDealIds>): void;
        /**
         * Remove a deal id associated with the creative.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.creatives.removeDeal({
         *     // The id for the account that will serve this creative.
         *     accountId: 'placeholder-value',
         *     // The buyer-specific id for this creative.
         *     buyerCreativeId: 'placeholder-value',
         *     // The id of the deal id to disassociate with this creative.
         *     dealId: 'placeholder-value',
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
        removeDeal(params: Params$Resource$Creatives$Removedeal, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        removeDeal(params?: Params$Resource$Creatives$Removedeal, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        removeDeal(params: Params$Resource$Creatives$Removedeal, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        removeDeal(params: Params$Resource$Creatives$Removedeal, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        removeDeal(params: Params$Resource$Creatives$Removedeal, callback: BodyResponseCallback<void>): void;
        removeDeal(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Creatives$Adddeal extends StandardParameters {
        /**
         * The id for the account that will serve this creative.
         */
        accountId?: number;
        /**
         * The buyer-specific id for this creative.
         */
        buyerCreativeId?: string;
        /**
         * The id of the deal id to associate with this creative.
         */
        dealId?: string;
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
         * When specified, only creatives having the given deals status are returned.
         */
        dealsStatusFilter?: string;
        /**
         * Maximum number of entries returned on one result page. If not set, the default is 100. Optional.
         */
        maxResults?: number;
        /**
         * When specified, only creatives having the given open auction status are returned.
         */
        openAuctionStatusFilter?: string;
        /**
         * A continuation token, used to page through ad clients. To retrieve the next page, set this parameter to the value of "nextPageToken" from the previous response. Optional.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Creatives$Listdeals extends StandardParameters {
        /**
         * The id for the account that will serve this creative.
         */
        accountId?: number;
        /**
         * The buyer-specific id for this creative.
         */
        buyerCreativeId?: string;
    }
    export interface Params$Resource$Creatives$Removedeal extends StandardParameters {
        /**
         * The id for the account that will serve this creative.
         */
        accountId?: number;
        /**
         * The buyer-specific id for this creative.
         */
        buyerCreativeId?: string;
        /**
         * The id of the deal id to disassociate with this creative.
         */
        dealId?: string;
    }
    export class Resource$Marketplacedeals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Delete the specified deals from the proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacedeals.delete({
         *     // The proposalId to delete deals from.
         *     proposalId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dealIds": [],
         *       //   "proposalRevisionNumber": "my_proposalRevisionNumber",
         *       //   "updateAction": "my_updateAction"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deals": [],
         *   //   "proposalRevisionNumber": "my_proposalRevisionNumber"
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
        delete(params: Params$Resource$Marketplacedeals$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Marketplacedeals$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeleteOrderDealsResponse>>;
        delete(params: Params$Resource$Marketplacedeals$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Marketplacedeals$Delete, options: MethodOptions | BodyResponseCallback<Schema$DeleteOrderDealsResponse>, callback: BodyResponseCallback<Schema$DeleteOrderDealsResponse>): void;
        delete(params: Params$Resource$Marketplacedeals$Delete, callback: BodyResponseCallback<Schema$DeleteOrderDealsResponse>): void;
        delete(callback: BodyResponseCallback<Schema$DeleteOrderDealsResponse>): void;
        /**
         * Add new deals for the specified proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacedeals.insert({
         *     // proposalId for which deals need to be added.
         *     proposalId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "deals": [],
         *       //   "proposalRevisionNumber": "my_proposalRevisionNumber",
         *       //   "updateAction": "my_updateAction"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deals": [],
         *   //   "proposalRevisionNumber": "my_proposalRevisionNumber"
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
        insert(params: Params$Resource$Marketplacedeals$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Marketplacedeals$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AddOrderDealsResponse>>;
        insert(params: Params$Resource$Marketplacedeals$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Marketplacedeals$Insert, options: MethodOptions | BodyResponseCallback<Schema$AddOrderDealsResponse>, callback: BodyResponseCallback<Schema$AddOrderDealsResponse>): void;
        insert(params: Params$Resource$Marketplacedeals$Insert, callback: BodyResponseCallback<Schema$AddOrderDealsResponse>): void;
        insert(callback: BodyResponseCallback<Schema$AddOrderDealsResponse>): void;
        /**
         * List all the deals for a given proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacedeals.list({
         *     // Query string to retrieve specific deals.
         *     pqlQuery: 'placeholder-value',
         *     // The proposalId to get deals for. To search across all proposals specify order_id = '-' as part of the URL.
         *     proposalId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deals": []
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
        list(params: Params$Resource$Marketplacedeals$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Marketplacedeals$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetOrderDealsResponse>>;
        list(params: Params$Resource$Marketplacedeals$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Marketplacedeals$List, options: MethodOptions | BodyResponseCallback<Schema$GetOrderDealsResponse>, callback: BodyResponseCallback<Schema$GetOrderDealsResponse>): void;
        list(params: Params$Resource$Marketplacedeals$List, callback: BodyResponseCallback<Schema$GetOrderDealsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GetOrderDealsResponse>): void;
        /**
         * Replaces all the deals in the proposal with the passed in deals
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacedeals.update({
         *     // The proposalId to edit deals on.
         *     proposalId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "deals": [],
         *       //   "proposal": {},
         *       //   "proposalRevisionNumber": "my_proposalRevisionNumber",
         *       //   "updateAction": "my_updateAction"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deals": [],
         *   //   "orderRevisionNumber": "my_orderRevisionNumber"
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
        update(params: Params$Resource$Marketplacedeals$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Marketplacedeals$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EditAllOrderDealsResponse>>;
        update(params: Params$Resource$Marketplacedeals$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Marketplacedeals$Update, options: MethodOptions | BodyResponseCallback<Schema$EditAllOrderDealsResponse>, callback: BodyResponseCallback<Schema$EditAllOrderDealsResponse>): void;
        update(params: Params$Resource$Marketplacedeals$Update, callback: BodyResponseCallback<Schema$EditAllOrderDealsResponse>): void;
        update(callback: BodyResponseCallback<Schema$EditAllOrderDealsResponse>): void;
    }
    export interface Params$Resource$Marketplacedeals$Delete extends StandardParameters {
        /**
         * The proposalId to delete deals from.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeleteOrderDealsRequest;
    }
    export interface Params$Resource$Marketplacedeals$Insert extends StandardParameters {
        /**
         * proposalId for which deals need to be added.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddOrderDealsRequest;
    }
    export interface Params$Resource$Marketplacedeals$List extends StandardParameters {
        /**
         * Query string to retrieve specific deals.
         */
        pqlQuery?: string;
        /**
         * The proposalId to get deals for. To search across all proposals specify order_id = '-' as part of the URL.
         */
        proposalId?: string;
    }
    export interface Params$Resource$Marketplacedeals$Update extends StandardParameters {
        /**
         * The proposalId to edit deals on.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EditAllOrderDealsRequest;
    }
    export class Resource$Marketplacenotes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Add notes to the proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacenotes.insert({
         *     // The proposalId to add notes for.
         *     proposalId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "notes": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "notes": []
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
        insert(params: Params$Resource$Marketplacenotes$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Marketplacenotes$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AddOrderNotesResponse>>;
        insert(params: Params$Resource$Marketplacenotes$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Marketplacenotes$Insert, options: MethodOptions | BodyResponseCallback<Schema$AddOrderNotesResponse>, callback: BodyResponseCallback<Schema$AddOrderNotesResponse>): void;
        insert(params: Params$Resource$Marketplacenotes$Insert, callback: BodyResponseCallback<Schema$AddOrderNotesResponse>): void;
        insert(callback: BodyResponseCallback<Schema$AddOrderNotesResponse>): void;
        /**
         * Get all the notes associated with a proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplacenotes.list({
         *     // Query string to retrieve specific notes. To search the text contents of notes, please use syntax like "WHERE note.note = "foo" or "WHERE note.note LIKE "%bar%"
         *     pqlQuery: 'placeholder-value',
         *     // The proposalId to get notes for. To search across all proposals specify order_id = '-' as part of the URL.
         *     proposalId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "notes": []
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
        list(params: Params$Resource$Marketplacenotes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Marketplacenotes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetOrderNotesResponse>>;
        list(params: Params$Resource$Marketplacenotes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Marketplacenotes$List, options: MethodOptions | BodyResponseCallback<Schema$GetOrderNotesResponse>, callback: BodyResponseCallback<Schema$GetOrderNotesResponse>): void;
        list(params: Params$Resource$Marketplacenotes$List, callback: BodyResponseCallback<Schema$GetOrderNotesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GetOrderNotesResponse>): void;
    }
    export interface Params$Resource$Marketplacenotes$Insert extends StandardParameters {
        /**
         * The proposalId to add notes for.
         */
        proposalId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddOrderNotesRequest;
    }
    export interface Params$Resource$Marketplacenotes$List extends StandardParameters {
        /**
         * Query string to retrieve specific notes. To search the text contents of notes, please use syntax like "WHERE note.note = "foo" or "WHERE note.note LIKE "%bar%"
         */
        pqlQuery?: string;
        /**
         * The proposalId to get notes for. To search across all proposals specify order_id = '-' as part of the URL.
         */
        proposalId?: string;
    }
    export class Resource$Marketplaceprivateauction {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Update a given private auction proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.marketplaceprivateauction.updateproposal({
         *     // The private auction id to be updated.
         *     privateAuctionId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "externalDealId": "my_externalDealId",
         *       //   "note": {},
         *       //   "proposalRevisionNumber": "my_proposalRevisionNumber",
         *       //   "updateAction": "my_updateAction"
         *       // }
         *     },
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
        updateproposal(params: Params$Resource$Marketplaceprivateauction$Updateproposal, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateproposal(params?: Params$Resource$Marketplaceprivateauction$Updateproposal, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        updateproposal(params: Params$Resource$Marketplaceprivateauction$Updateproposal, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateproposal(params: Params$Resource$Marketplaceprivateauction$Updateproposal, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        updateproposal(params: Params$Resource$Marketplaceprivateauction$Updateproposal, callback: BodyResponseCallback<void>): void;
        updateproposal(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Marketplaceprivateauction$Updateproposal extends StandardParameters {
        /**
         * The private auction id to be updated.
         */
        privateAuctionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdatePrivateAuctionProposalRequest;
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   //   "minimumViewabilityDecile": 0,
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userIdentifierDataRequired": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": [],
         *   //   "videoPlayerSizes": []
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *       //   "minimumViewabilityDecile": 0,
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userIdentifierDataRequired": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": [],
         *       //   "videoPlayerSizes": []
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
         *   //   "minimumViewabilityDecile": 0,
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userIdentifierDataRequired": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": [],
         *   //   "videoPlayerSizes": []
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *       //   "minimumViewabilityDecile": 0,
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userIdentifierDataRequired": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": [],
         *       //   "videoPlayerSizes": []
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
         *   //   "minimumViewabilityDecile": 0,
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userIdentifierDataRequired": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": [],
         *   //   "videoPlayerSizes": []
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *       //   "minimumViewabilityDecile": 0,
         *       //   "mobileCarriers": [],
         *       //   "mobileDevices": [],
         *       //   "mobileOperatingSystemVersions": [],
         *       //   "placements": [],
         *       //   "platforms": [],
         *       //   "supportedCreativeAttributes": [],
         *       //   "userIdentifierDataRequired": [],
         *       //   "userLists": [],
         *       //   "vendorTypes": [],
         *       //   "verticals": [],
         *       //   "videoPlayerSizes": []
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
         *   //   "minimumViewabilityDecile": 0,
         *   //   "mobileCarriers": [],
         *   //   "mobileDevices": [],
         *   //   "mobileOperatingSystemVersions": [],
         *   //   "placements": [],
         *   //   "platforms": [],
         *   //   "supportedCreativeAttributes": [],
         *   //   "userIdentifierDataRequired": [],
         *   //   "userLists": [],
         *   //   "vendorTypes": [],
         *   //   "verticals": [],
         *   //   "videoPlayerSizes": []
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
    export class Resource$Products {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the requested product by id.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.products.get({
         *     // The id for the product to get the head revision for.
         *     productId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billedBuyer": {},
         *   //   "buyer": {},
         *   //   "creationTimeMs": "my_creationTimeMs",
         *   //   "creatorContacts": [],
         *   //   "creatorRole": "my_creatorRole",
         *   //   "deliveryControl": {},
         *   //   "flightEndTimeMs": "my_flightEndTimeMs",
         *   //   "flightStartTimeMs": "my_flightStartTimeMs",
         *   //   "hasCreatorSignedOff": false,
         *   //   "inventorySource": "my_inventorySource",
         *   //   "kind": "my_kind",
         *   //   "labels": [],
         *   //   "lastUpdateTimeMs": "my_lastUpdateTimeMs",
         *   //   "legacyOfferId": "my_legacyOfferId",
         *   //   "marketplacePublisherProfileId": "my_marketplacePublisherProfileId",
         *   //   "name": "my_name",
         *   //   "privateAuctionId": "my_privateAuctionId",
         *   //   "productId": "my_productId",
         *   //   "publisherProfileId": "my_publisherProfileId",
         *   //   "publisherProvidedForecast": {},
         *   //   "revisionNumber": "my_revisionNumber",
         *   //   "seller": {},
         *   //   "sharedTargetings": [],
         *   //   "state": "my_state",
         *   //   "syndicationProduct": "my_syndicationProduct",
         *   //   "terms": {},
         *   //   "webPropertyCode": "my_webPropertyCode"
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
        get(params: Params$Resource$Products$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Products$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Product>>;
        get(params: Params$Resource$Products$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Products$Get, options: MethodOptions | BodyResponseCallback<Schema$Product>, callback: BodyResponseCallback<Schema$Product>): void;
        get(params: Params$Resource$Products$Get, callback: BodyResponseCallback<Schema$Product>): void;
        get(callback: BodyResponseCallback<Schema$Product>): void;
        /**
         * Gets the requested product.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.products.search({
         *     // The pql query used to query for products.
         *     pqlQuery: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "products": []
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
        search(params: Params$Resource$Products$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Products$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetOffersResponse>>;
        search(params: Params$Resource$Products$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Products$Search, options: MethodOptions | BodyResponseCallback<Schema$GetOffersResponse>, callback: BodyResponseCallback<Schema$GetOffersResponse>): void;
        search(params: Params$Resource$Products$Search, callback: BodyResponseCallback<Schema$GetOffersResponse>): void;
        search(callback: BodyResponseCallback<Schema$GetOffersResponse>): void;
    }
    export interface Params$Resource$Products$Get extends StandardParameters {
        /**
         * The id for the product to get the head revision for.
         */
        productId?: string;
    }
    export interface Params$Resource$Products$Search extends StandardParameters {
        /**
         * The pql query used to query for products.
         */
        pqlQuery?: string;
    }
    export class Resource$Proposals {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get a proposal given its id
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.get({
         *     // Id of the proposal to retrieve.
         *     proposalId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billedBuyer": {},
         *   //   "buyer": {},
         *   //   "buyerContacts": [],
         *   //   "buyerPrivateData": {},
         *   //   "dbmAdvertiserIds": [],
         *   //   "hasBuyerSignedOff": false,
         *   //   "hasSellerSignedOff": false,
         *   //   "inventorySource": "my_inventorySource",
         *   //   "isRenegotiating": false,
         *   //   "isSetupComplete": false,
         *   //   "kind": "my_kind",
         *   //   "labels": [],
         *   //   "lastUpdaterOrCommentorRole": "my_lastUpdaterOrCommentorRole",
         *   //   "name": "my_name",
         *   //   "negotiationId": "my_negotiationId",
         *   //   "originatorRole": "my_originatorRole",
         *   //   "privateAuctionId": "my_privateAuctionId",
         *   //   "proposalId": "my_proposalId",
         *   //   "proposalState": "my_proposalState",
         *   //   "revisionNumber": "my_revisionNumber",
         *   //   "revisionTimeMs": "my_revisionTimeMs",
         *   //   "seller": {},
         *   //   "sellerContacts": []
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
        get(params: Params$Resource$Proposals$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Proposals$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        get(params: Params$Resource$Proposals$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Proposals$Get, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        get(params: Params$Resource$Proposals$Get, callback: BodyResponseCallback<Schema$Proposal>): void;
        get(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Create the given list of proposals
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.insert({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "proposals": [],
         *       //   "webPropertyCode": "my_webPropertyCode"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "proposals": []
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
        insert(params: Params$Resource$Proposals$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Proposals$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CreateOrdersResponse>>;
        insert(params: Params$Resource$Proposals$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Proposals$Insert, options: MethodOptions | BodyResponseCallback<Schema$CreateOrdersResponse>, callback: BodyResponseCallback<Schema$CreateOrdersResponse>): void;
        insert(params: Params$Resource$Proposals$Insert, callback: BodyResponseCallback<Schema$CreateOrdersResponse>): void;
        insert(callback: BodyResponseCallback<Schema$CreateOrdersResponse>): void;
        /**
         * Update the given proposal. This method supports patch semantics.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.patch({
         *     // The proposal id to update.
         *     proposalId: 'placeholder-value',
         *     // The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
         *     revisionNumber: 'placeholder-value',
         *     // The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
         *     updateAction: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "billedBuyer": {},
         *       //   "buyer": {},
         *       //   "buyerContacts": [],
         *       //   "buyerPrivateData": {},
         *       //   "dbmAdvertiserIds": [],
         *       //   "hasBuyerSignedOff": false,
         *       //   "hasSellerSignedOff": false,
         *       //   "inventorySource": "my_inventorySource",
         *       //   "isRenegotiating": false,
         *       //   "isSetupComplete": false,
         *       //   "kind": "my_kind",
         *       //   "labels": [],
         *       //   "lastUpdaterOrCommentorRole": "my_lastUpdaterOrCommentorRole",
         *       //   "name": "my_name",
         *       //   "negotiationId": "my_negotiationId",
         *       //   "originatorRole": "my_originatorRole",
         *       //   "privateAuctionId": "my_privateAuctionId",
         *       //   "proposalId": "my_proposalId",
         *       //   "proposalState": "my_proposalState",
         *       //   "revisionNumber": "my_revisionNumber",
         *       //   "revisionTimeMs": "my_revisionTimeMs",
         *       //   "seller": {},
         *       //   "sellerContacts": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billedBuyer": {},
         *   //   "buyer": {},
         *   //   "buyerContacts": [],
         *   //   "buyerPrivateData": {},
         *   //   "dbmAdvertiserIds": [],
         *   //   "hasBuyerSignedOff": false,
         *   //   "hasSellerSignedOff": false,
         *   //   "inventorySource": "my_inventorySource",
         *   //   "isRenegotiating": false,
         *   //   "isSetupComplete": false,
         *   //   "kind": "my_kind",
         *   //   "labels": [],
         *   //   "lastUpdaterOrCommentorRole": "my_lastUpdaterOrCommentorRole",
         *   //   "name": "my_name",
         *   //   "negotiationId": "my_negotiationId",
         *   //   "originatorRole": "my_originatorRole",
         *   //   "privateAuctionId": "my_privateAuctionId",
         *   //   "proposalId": "my_proposalId",
         *   //   "proposalState": "my_proposalState",
         *   //   "revisionNumber": "my_revisionNumber",
         *   //   "revisionTimeMs": "my_revisionTimeMs",
         *   //   "seller": {},
         *   //   "sellerContacts": []
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
        patch(params: Params$Resource$Proposals$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Proposals$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        patch(params: Params$Resource$Proposals$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Proposals$Patch, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        patch(params: Params$Resource$Proposals$Patch, callback: BodyResponseCallback<Schema$Proposal>): void;
        patch(callback: BodyResponseCallback<Schema$Proposal>): void;
        /**
         * Search for proposals using pql query
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.search({
         *     // Query string to retrieve specific proposals.
         *     pqlQuery: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "proposals": []
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
        search(params: Params$Resource$Proposals$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Proposals$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetOrdersResponse>>;
        search(params: Params$Resource$Proposals$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Proposals$Search, options: MethodOptions | BodyResponseCallback<Schema$GetOrdersResponse>, callback: BodyResponseCallback<Schema$GetOrdersResponse>): void;
        search(params: Params$Resource$Proposals$Search, callback: BodyResponseCallback<Schema$GetOrdersResponse>): void;
        search(callback: BodyResponseCallback<Schema$GetOrdersResponse>): void;
        /**
         * Update the given proposal to indicate that setup has been completed.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.setupcomplete({
         *     // The proposal id for which the setup is complete
         *     proposalId: 'placeholder-value',
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
        setupcomplete(params: Params$Resource$Proposals$Setupcomplete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setupcomplete(params?: Params$Resource$Proposals$Setupcomplete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        setupcomplete(params: Params$Resource$Proposals$Setupcomplete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setupcomplete(params: Params$Resource$Proposals$Setupcomplete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        setupcomplete(params: Params$Resource$Proposals$Setupcomplete, callback: BodyResponseCallback<void>): void;
        setupcomplete(callback: BodyResponseCallback<void>): void;
        /**
         * Update the given proposal
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.proposals.update({
         *     // The proposal id to update.
         *     proposalId: 'placeholder-value',
         *     // The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
         *     revisionNumber: 'placeholder-value',
         *     // The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
         *     updateAction: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "billedBuyer": {},
         *       //   "buyer": {},
         *       //   "buyerContacts": [],
         *       //   "buyerPrivateData": {},
         *       //   "dbmAdvertiserIds": [],
         *       //   "hasBuyerSignedOff": false,
         *       //   "hasSellerSignedOff": false,
         *       //   "inventorySource": "my_inventorySource",
         *       //   "isRenegotiating": false,
         *       //   "isSetupComplete": false,
         *       //   "kind": "my_kind",
         *       //   "labels": [],
         *       //   "lastUpdaterOrCommentorRole": "my_lastUpdaterOrCommentorRole",
         *       //   "name": "my_name",
         *       //   "negotiationId": "my_negotiationId",
         *       //   "originatorRole": "my_originatorRole",
         *       //   "privateAuctionId": "my_privateAuctionId",
         *       //   "proposalId": "my_proposalId",
         *       //   "proposalState": "my_proposalState",
         *       //   "revisionNumber": "my_revisionNumber",
         *       //   "revisionTimeMs": "my_revisionTimeMs",
         *       //   "seller": {},
         *       //   "sellerContacts": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "billedBuyer": {},
         *   //   "buyer": {},
         *   //   "buyerContacts": [],
         *   //   "buyerPrivateData": {},
         *   //   "dbmAdvertiserIds": [],
         *   //   "hasBuyerSignedOff": false,
         *   //   "hasSellerSignedOff": false,
         *   //   "inventorySource": "my_inventorySource",
         *   //   "isRenegotiating": false,
         *   //   "isSetupComplete": false,
         *   //   "kind": "my_kind",
         *   //   "labels": [],
         *   //   "lastUpdaterOrCommentorRole": "my_lastUpdaterOrCommentorRole",
         *   //   "name": "my_name",
         *   //   "negotiationId": "my_negotiationId",
         *   //   "originatorRole": "my_originatorRole",
         *   //   "privateAuctionId": "my_privateAuctionId",
         *   //   "proposalId": "my_proposalId",
         *   //   "proposalState": "my_proposalState",
         *   //   "revisionNumber": "my_revisionNumber",
         *   //   "revisionTimeMs": "my_revisionTimeMs",
         *   //   "seller": {},
         *   //   "sellerContacts": []
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
        update(params: Params$Resource$Proposals$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Proposals$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Proposal>>;
        update(params: Params$Resource$Proposals$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Proposals$Update, options: MethodOptions | BodyResponseCallback<Schema$Proposal>, callback: BodyResponseCallback<Schema$Proposal>): void;
        update(params: Params$Resource$Proposals$Update, callback: BodyResponseCallback<Schema$Proposal>): void;
        update(callback: BodyResponseCallback<Schema$Proposal>): void;
    }
    export interface Params$Resource$Proposals$Get extends StandardParameters {
        /**
         * Id of the proposal to retrieve.
         */
        proposalId?: string;
    }
    export interface Params$Resource$Proposals$Insert extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateOrdersRequest;
    }
    export interface Params$Resource$Proposals$Patch extends StandardParameters {
        /**
         * The proposal id to update.
         */
        proposalId?: string;
        /**
         * The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
         */
        revisionNumber?: string;
        /**
         * The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
         */
        updateAction?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Proposal;
    }
    export interface Params$Resource$Proposals$Search extends StandardParameters {
        /**
         * Query string to retrieve specific proposals.
         */
        pqlQuery?: string;
    }
    export interface Params$Resource$Proposals$Setupcomplete extends StandardParameters {
        /**
         * The proposal id for which the setup is complete
         */
        proposalId?: string;
    }
    export interface Params$Resource$Proposals$Update extends StandardParameters {
        /**
         * The proposal id to update.
         */
        proposalId?: string;
        /**
         * The last known revision number to update. If the head revision in the marketplace database has since changed, an error will be thrown. The caller should then fetch the latest proposal at head revision and retry the update at that revision.
         */
        revisionNumber?: string;
        /**
         * The proposed action to take on the proposal. This field is required and it must be set when updating a proposal.
         */
        updateAction?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Proposal;
    }
    export class Resource$Pubprofiles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the requested publisher profile(s) by publisher accountId.
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
         * const adexchangebuyer = google.adexchangebuyer('v1.4');
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
         *   const res = await adexchangebuyer.pubprofiles.list({
         *     // The accountId of the publisher to get profiles for.
         *     accountId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "profiles": []
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
        list(params: Params$Resource$Pubprofiles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Pubprofiles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetPublisherProfilesByAccountIdResponse>>;
        list(params: Params$Resource$Pubprofiles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Pubprofiles$List, options: MethodOptions | BodyResponseCallback<Schema$GetPublisherProfilesByAccountIdResponse>, callback: BodyResponseCallback<Schema$GetPublisherProfilesByAccountIdResponse>): void;
        list(params: Params$Resource$Pubprofiles$List, callback: BodyResponseCallback<Schema$GetPublisherProfilesByAccountIdResponse>): void;
        list(callback: BodyResponseCallback<Schema$GetPublisherProfilesByAccountIdResponse>): void;
    }
    export interface Params$Resource$Pubprofiles$List extends StandardParameters {
        /**
         * The accountId of the publisher to get profiles for.
         */
        accountId?: number;
    }
    export {};
}
