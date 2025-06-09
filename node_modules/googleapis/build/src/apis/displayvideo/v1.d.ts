import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace displayvideo_v1 {
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
     * Display &amp; Video 360 API
     *
     * Display &amp; Video 360 API allows users to automate complex Display &amp; Video 360 workflows, such as creating insertion orders and setting targeting options for individual line items.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const displayvideo = google.displayvideo('v1');
     * ```
     */
    export class Displayvideo {
        context: APIRequestContext;
        advertisers: Resource$Advertisers;
        combinedAudiences: Resource$Combinedaudiences;
        customBiddingAlgorithms: Resource$Custombiddingalgorithms;
        customLists: Resource$Customlists;
        firstAndThirdPartyAudiences: Resource$Firstandthirdpartyaudiences;
        floodlightGroups: Resource$Floodlightgroups;
        googleAudiences: Resource$Googleaudiences;
        guaranteedOrders: Resource$Guaranteedorders;
        inventorySourceGroups: Resource$Inventorysourcegroups;
        inventorySources: Resource$Inventorysources;
        media: Resource$Media;
        partners: Resource$Partners;
        sdfdownloadtasks: Resource$Sdfdownloadtasks;
        targetingTypes: Resource$Targetingtypes;
        users: Resource$Users;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request message for ManualTriggerService.ActivateManualTrigger.
     */
    export interface Schema$ActivateManualTriggerRequest {
    }
    /**
     * Configuration for custom Active View video viewability metrics.
     */
    export interface Schema$ActiveViewVideoViewabilityMetricConfig {
        /**
         * Required. The display name of the custom metric.
         */
        displayName?: string | null;
        /**
         * The minimum visible video duration required (in seconds) in order for an impression to be recorded. You must specify minimum_duration, minimum_quartile or both. If both are specified, an impression meets the metric criteria if either requirement is met (whichever happens first).
         */
        minimumDuration?: string | null;
        /**
         * The minimum visible video duration required, based on the video quartiles, in order for an impression to be recorded. You must specify minimum_duration, minimum_quartile or both. If both are specified, an impression meets the metric criteria if either requirement is met (whichever happens first).
         */
        minimumQuartile?: string | null;
        /**
         * Required. The minimum percentage of the video ad's pixels visible on the screen in order for an impression to be recorded.
         */
        minimumViewability?: string | null;
        /**
         * Required. The minimum percentage of the video ad's volume required in order for an impression to be recorded.
         */
        minimumVolume?: string | null;
    }
    /**
     * Details of Adloox settings.
     */
    export interface Schema$Adloox {
        /**
         * Adloox's brand safety settings.
         */
        excludedAdlooxCategories?: string[] | null;
    }
    /**
     * A single advertiser in Display & Video 360 (DV360).
     */
    export interface Schema$Advertiser {
        /**
         * Required. Immutable. Ad server related settings of the advertiser.
         */
        adServerConfig?: Schema$AdvertiserAdServerConfig;
        /**
         * Output only. The unique ID of the advertiser. Assigned by the system.
         */
        advertiserId?: string | null;
        /**
         * Required. Creative related settings of the advertiser.
         */
        creativeConfig?: Schema$AdvertiserCreativeConfig;
        /**
         * Settings that control how advertiser data may be accessed.
         */
        dataAccessConfig?: Schema$AdvertiserDataAccessConfig;
        /**
         * Required. The display name of the advertiser. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Controls whether or not insertion orders and line items of the advertiser can spend their budgets and bid on inventory. * Accepted values are `ENTITY_STATUS_ACTIVE`, `ENTITY_STATUS_PAUSED` and `ENTITY_STATUS_SCHEDULED_FOR_DELETION`. * If set to `ENTITY_STATUS_SCHEDULED_FOR_DELETION`, the advertiser will be deleted 30 days from when it was first scheduled for deletion.
         */
        entityStatus?: string | null;
        /**
         * Required. General settings of the advertiser.
         */
        generalConfig?: Schema$AdvertiserGeneralConfig;
        /**
         * Integration details of the advertiser. Only integrationCode is currently applicable to advertiser. Other fields of IntegrationDetails are not supported and will be ignored if provided.
         */
        integrationDetails?: Schema$IntegrationDetails;
        /**
         * Output only. The resource name of the advertiser.
         */
        name?: string | null;
        /**
         * Required. Immutable. The unique ID of the partner that the advertiser belongs to.
         */
        partnerId?: string | null;
        /**
         * Whether integration with Mediaocean (Prisma) is enabled. By enabling this, you agree to the following: On behalf of my company, I authorize Mediaocean (Prisma) to send budget segment plans to Google, and I authorize Google to send corresponding reporting and invoices from DV360 to Mediaocean for the purposes of budget planning, billing, and reconciliation for this advertiser.
         */
        prismaEnabled?: boolean | null;
        /**
         * Targeting settings related to ad serving of the advertiser.
         */
        servingConfig?: Schema$AdvertiserTargetingConfig;
        /**
         * Output only. The timestamp when the advertiser was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * Ad server related settings of an advertiser.
     */
    export interface Schema$AdvertiserAdServerConfig {
        /**
         * The configuration for advertisers that use both Campaign Manager 360 (CM360) and third-party ad servers.
         */
        cmHybridConfig?: Schema$CmHybridConfig;
        /**
         * The configuration for advertisers that use third-party ad servers only.
         */
        thirdPartyOnlyConfig?: Schema$ThirdPartyOnlyConfig;
    }
    /**
     * Creatives related settings of an advertiser.
     */
    export interface Schema$AdvertiserCreativeConfig {
        /**
         * Whether or not the advertiser is enabled for dynamic creatives.
         */
        dynamicCreativeEnabled?: boolean | null;
        /**
         * An ID for configuring campaign monitoring provided by Integral Ad Service (IAS). The DV360 system will append an IAS "Campaign Monitor" tag containing this ID to the creative tag.
         */
        iasClientId?: string | null;
        /**
         * Whether or not to use DV360's Online Behavioral Advertising (OBA) compliance. Starting on February 9, 2024, this field will be affected by an update to the Display & Video 360 API Terms of Service. See our [announcement](//ads-developers.googleblog.com/2024/01/update-to-display-video-360-api-terms.html) for more detail. Warning: Changing OBA settings may cause the audit status of your creatives to be reset by some ad exchanges, making them ineligible to serve until they are re-approved.
         */
        obaComplianceDisabled?: boolean | null;
        /**
         * By setting this field to `true`, you, on behalf of your company, authorize Google to use video creatives associated with this Display & Video 360 advertiser to provide reporting and features related to the advertiser's television campaigns. Applicable only when the advertiser has a CM360 hybrid ad server configuration.
         */
        videoCreativeDataSharingAuthorized?: boolean | null;
    }
    /**
     * Settings that control how advertiser related data may be accessed.
     */
    export interface Schema$AdvertiserDataAccessConfig {
        /**
         * Structured Data Files (SDF) settings for the advertiser. If not specified, the SDF settings of the parent partner are used.
         */
        sdfConfig?: Schema$AdvertiserSdfConfig;
    }
    /**
     * General settings of an advertiser.
     */
    export interface Schema$AdvertiserGeneralConfig {
        /**
         * Required. Immutable. Advertiser's currency in ISO 4217 format. Accepted codes and the currencies they represent are: Currency Code : Currency Name * `ARS` : Argentine Peso * `AUD` : Australian Dollar * `BRL` : Brazilian Real * `CAD` : Canadian Dollar * `CHF` : Swiss Franc * `CLP` : Chilean Peso * `CNY` : Chinese Yuan * `COP` : Colombian Peso * `CZK` : Czech Koruna * `DKK` : Danish Krone * `EGP` : Egyption Pound * `EUR` : Euro * `GBP` : British Pound * `HKD` : Hong Kong Dollar * `HUF` : Hungarian Forint * `IDR` : Indonesian Rupiah * `ILS` : Israeli Shekel * `INR` : Indian Rupee * `JPY` : Japanese Yen * `KRW` : South Korean Won * `MXN` : Mexican Pesos * `MYR` : Malaysian Ringgit * `NGN` : Nigerian Naira * `NOK` : Norwegian Krone * `NZD` : New Zealand Dollar * `PEN` : Peruvian Nuevo Sol * `PLN` : Polish Zloty * `RON` : New Romanian Leu * `RUB` : Russian Ruble * `SEK` : Swedish Krona * `TRY` : Turkish Lira * `TWD` : New Taiwan Dollar * `USD` : US Dollar * `ZAR` : South African Rand
         */
        currencyCode?: string | null;
        /**
         * Required. The domain URL of the advertiser's primary website. The system will send this information to publishers that require website URL to associate a campaign with an advertiser. Provide a URL with no path or query string, beginning with `http:` or `https:`. For example, http://www.example.com
         */
        domainUrl?: string | null;
        /**
         * Output only. The standard TZ database name of the advertiser's time zone. For example, `America/New_York`. See more at: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones For CM360 hybrid advertisers, the time zone is the same as that of the associated CM360 account; for third-party only advertisers, the time zone is the same as that of the parent partner.
         */
        timeZone?: string | null;
    }
    /**
     * Structured Data Files (SDF) settings of an advertiser.
     */
    export interface Schema$AdvertiserSdfConfig {
        /**
         * Whether or not this advertiser overrides the SDF configuration of its parent partner. By default, an advertiser inherits the SDF configuration from the parent partner. To override the partner configuration, set this field to `true` and provide the new configuration in sdfConfig.
         */
        overridePartnerSdfConfig?: boolean | null;
        /**
         * The SDF configuration for the advertiser. * Required when overridePartnerSdfConfig is `true`. * Output only when overridePartnerSdfConfig is `false`.
         */
        sdfConfig?: Schema$SdfConfig;
    }
    /**
     * Targeting settings related to ad serving of an advertiser.
     */
    export interface Schema$AdvertiserTargetingConfig {
        /**
         * Whether or not connected TV devices are exempt from viewability targeting for all video line items under the advertiser.
         */
        exemptTvFromViewabilityTargeting?: boolean | null;
    }
    /**
     * Represents a targetable age range. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_AGE_RANGE`.
     */
    export interface Schema$AgeRangeAssignedTargetingOptionDetails {
        /**
         * Required. The age range of an audience. We only support targeting a continuous age range of an audience. Thus, the age range represented in this field can be 1) targeted solely, or, 2) part of a larger continuous age range. The reach of a continuous age range targeting can be expanded by also targeting an audience of an unknown age.
         */
        ageRange?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_AGE_RANGE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable age range. This will be populated in the age_range_details field when targeting_type is `TARGETING_TYPE_AGE_RANGE`.
     */
    export interface Schema$AgeRangeTargetingOptionDetails {
        /**
         * Output only. The age range of an audience.
         */
        ageRange?: string | null;
    }
    /**
     * Details for assigned app targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_APP`.
     */
    export interface Schema$AppAssignedTargetingOptionDetails {
        /**
         * Required. The ID of the app. Android's Play store app uses bundle ID, for example `com.google.android.gm`. Apple's App store app ID uses 9 digit string, for example `422689480`.
         */
        appId?: string | null;
        /**
         * Indicates the platform of the targeted app. If this field is not specified, the app platform will be assumed to be mobile (i.e., Android or iOS), and we will derive the appropriate mobile platform from the app ID.
         */
        appPlatform?: string | null;
        /**
         * Output only. The display name of the app.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
    }
    /**
     * Details for assigned app category targeting option. This will be populated in the app_category_details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_APP_CATEGORY`.
     */
    export interface Schema$AppCategoryAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the app category.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_APP_CATEGORY`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable collection of apps. A collection lets you target dynamic groups of related apps that are maintained by the platform, for example `All Apps/Google Play/Games`. This will be populated in the app_category_details field when targeting_type is `TARGETING_TYPE_APP_CATEGORY`.
     */
    export interface Schema$AppCategoryTargetingOptionDetails {
        /**
         * Output only. The name of the app collection.
         */
        displayName?: string | null;
    }
    /**
     * A single asset.
     */
    export interface Schema$Asset {
        /**
         * The asset content. For uploaded assets, the content is the serving path.
         */
        content?: string | null;
        /**
         * Media ID of the uploaded asset. This is a unique identifier for the asset. This ID can be passed to other API calls, e.g. CreateCreative to associate the asset with a creative. The Media ID space updated on **April 5, 2023**. Update media IDs cached before **April 5, 2023** by retrieving the new media ID from associated creative resources or re-uploading the asset.
         */
        mediaId?: string | null;
    }
    /**
     * Asset association for the creative.
     */
    export interface Schema$AssetAssociation {
        /**
         * The associated asset.
         */
        asset?: Schema$Asset;
        /**
         * The role of this asset for the creative.
         */
        role?: string | null;
    }
    /**
     * An assignment between a targetable inventory source and an inventory source group.
     */
    export interface Schema$AssignedInventorySource {
        /**
         * Output only. The unique ID of the assigned inventory source. The ID is only unique within a given inventory source group. It may be reused in other contexts.
         */
        assignedInventorySourceId?: string | null;
        /**
         * Required. The ID of the inventory source entity being targeted.
         */
        inventorySourceId?: string | null;
        /**
         * Output only. The resource name of the assigned inventory source.
         */
        name?: string | null;
    }
    /**
     * An assignment between a location list and a relevant targeting option.
     */
    export interface Schema$AssignedLocation {
        /**
         * Output only. The unique ID of the assigned location. The ID is only unique within a location list. It may be reused in other contexts.
         */
        assignedLocationId?: string | null;
        /**
         * Output only. The resource name of the assigned location.
         */
        name?: string | null;
        /**
         * Required. The ID of the targeting option assigned to the location list.
         */
        targetingOptionId?: string | null;
    }
    /**
     * A single assigned targeting option, which defines the state of a targeting option for an entity with targeting settings.
     */
    export interface Schema$AssignedTargetingOption {
        /**
         * Age range details. This field will be populated when the targeting_type is `TARGETING_TYPE_AGE_RANGE`.
         */
        ageRangeDetails?: Schema$AgeRangeAssignedTargetingOptionDetails;
        /**
         * App category details. This field will be populated when the targeting_type is `TARGETING_TYPE_APP_CATEGORY`.
         */
        appCategoryDetails?: Schema$AppCategoryAssignedTargetingOptionDetails;
        /**
         * App details. This field will be populated when the targeting_type is `TARGETING_TYPE_APP`.
         */
        appDetails?: Schema$AppAssignedTargetingOptionDetails;
        /**
         * Output only. The unique ID of the assigned targeting option. The ID is only unique within a given resource and targeting type. It may be reused in other contexts.
         */
        assignedTargetingOptionId?: string | null;
        /**
         * Audience targeting details. This field will be populated when the targeting_type is `TARGETING_TYPE_AUDIENCE_GROUP`. You can only target one audience group option per resource.
         */
        audienceGroupDetails?: Schema$AudienceGroupAssignedTargetingOptionDetails;
        /**
         * Audio content type details. This field will be populated when the targeting_type is `TARGETING_TYPE_AUDIO_CONTENT_TYPE`.
         */
        audioContentTypeDetails?: Schema$AudioContentTypeAssignedTargetingOptionDetails;
        /**
         * Authorized seller status details. This field will be populated when the targeting_type is `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS`. You can only target one authorized seller status option per resource. If a resource doesn't have an authorized seller status option, all authorized sellers indicated as DIRECT or RESELLER in the ads.txt file are targeted by default.
         */
        authorizedSellerStatusDetails?: Schema$AuthorizedSellerStatusAssignedTargetingOptionDetails;
        /**
         * Browser details. This field will be populated when the targeting_type is `TARGETING_TYPE_BROWSER`.
         */
        browserDetails?: Schema$BrowserAssignedTargetingOptionDetails;
        /**
         * Business chain details. This field will be populated when the targeting_type is `TARGETING_TYPE_BUSINESS_CHAIN`.
         */
        businessChainDetails?: Schema$BusinessChainAssignedTargetingOptionDetails;
        /**
         * Carrier and ISP details. This field will be populated when the targeting_type is `TARGETING_TYPE_CARRIER_AND_ISP`.
         */
        carrierAndIspDetails?: Schema$CarrierAndIspAssignedTargetingOptionDetails;
        /**
         * Category details. This field will be populated when the targeting_type is `TARGETING_TYPE_CATEGORY`. Targeting a category will also target its subcategories. If a category is excluded from targeting and a subcategory is included, the exclusion will take precedence.
         */
        categoryDetails?: Schema$CategoryAssignedTargetingOptionDetails;
        /**
         * Channel details. This field will be populated when the targeting_type is `TARGETING_TYPE_CHANNEL`.
         */
        channelDetails?: Schema$ChannelAssignedTargetingOptionDetails;
        /**
         * Content duration details. This field will be populated when the targeting_type is `TARGETING_TYPE_CONTENT_DURATION`.
         */
        contentDurationDetails?: Schema$ContentDurationAssignedTargetingOptionDetails;
        /**
         * Content genre details. This field will be populated when the targeting_type is `TARGETING_TYPE_CONTENT_GENRE`.
         */
        contentGenreDetails?: Schema$ContentGenreAssignedTargetingOptionDetails;
        /**
         * Content instream position details. This field will be populated when the targeting_type is `TARGETING_TYPE_CONTENT_INSTREAM_POSITION`.
         */
        contentInstreamPositionDetails?: Schema$ContentInstreamPositionAssignedTargetingOptionDetails;
        /**
         * Content outstream position details. This field will be populated when the targeting_type is `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION`.
         */
        contentOutstreamPositionDetails?: Schema$ContentOutstreamPositionAssignedTargetingOptionDetails;
        /**
         * Content duration details. This field will be populated when the TargetingType is `TARGETING_TYPE_CONTENT_STREAM_TYPE`.
         */
        contentStreamTypeDetails?: Schema$ContentStreamTypeAssignedTargetingOptionDetails;
        /**
         * Day and time details. This field will be populated when the targeting_type is `TARGETING_TYPE_DAY_AND_TIME`.
         */
        dayAndTimeDetails?: Schema$DayAndTimeAssignedTargetingOptionDetails;
        /**
         * Device make and model details. This field will be populated when the targeting_type is `TARGETING_TYPE_DEVICE_MAKE_MODEL`.
         */
        deviceMakeModelDetails?: Schema$DeviceMakeModelAssignedTargetingOptionDetails;
        /**
         * Device Type details. This field will be populated when the targeting_type is `TARGETING_TYPE_DEVICE_TYPE`.
         */
        deviceTypeDetails?: Schema$DeviceTypeAssignedTargetingOptionDetails;
        /**
         * Digital content label details. This field will be populated when the targeting_type is `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION`. Digital content labels are targeting exclusions. Advertiser level digital content label exclusions, if set, are always applied in serving (even though they aren't visible in resource settings). Resource settings can exclude content labels in addition to advertiser exclusions, but can't override them. A line item won't serve if all the digital content labels are excluded.
         */
        digitalContentLabelExclusionDetails?: Schema$DigitalContentLabelAssignedTargetingOptionDetails;
        /**
         * Environment details. This field will be populated when the targeting_type is `TARGETING_TYPE_ENVIRONMENT`.
         */
        environmentDetails?: Schema$EnvironmentAssignedTargetingOptionDetails;
        /**
         * Exchange details. This field will be populated when the targeting_type is `TARGETING_TYPE_EXCHANGE`.
         */
        exchangeDetails?: Schema$ExchangeAssignedTargetingOptionDetails;
        /**
         * Gender details. This field will be populated when the targeting_type is `TARGETING_TYPE_GENDER`.
         */
        genderDetails?: Schema$GenderAssignedTargetingOptionDetails;
        /**
         * Geographic region details. This field will be populated when the targeting_type is `TARGETING_TYPE_GEO_REGION`.
         */
        geoRegionDetails?: Schema$GeoRegionAssignedTargetingOptionDetails;
        /**
         * Household income details. This field will be populated when the targeting_type is `TARGETING_TYPE_HOUSEHOLD_INCOME`.
         */
        householdIncomeDetails?: Schema$HouseholdIncomeAssignedTargetingOptionDetails;
        /**
         * Output only. The inheritance status of the assigned targeting option.
         */
        inheritance?: string | null;
        /**
         * Inventory source details. This field will be populated when the targeting_type is `TARGETING_TYPE_INVENTORY_SOURCE`.
         */
        inventorySourceDetails?: Schema$InventorySourceAssignedTargetingOptionDetails;
        /**
         * Inventory source group details. This field will be populated when the targeting_type is `TARGETING_TYPE_INVENTORY_SOURCE_GROUP`.
         */
        inventorySourceGroupDetails?: Schema$InventorySourceGroupAssignedTargetingOptionDetails;
        /**
         * Keyword details. This field will be populated when the targeting_type is `TARGETING_TYPE_KEYWORD`. A maximum of 5000 direct negative keywords can be assigned to a resource. No limit on number of positive keywords that can be assigned.
         */
        keywordDetails?: Schema$KeywordAssignedTargetingOptionDetails;
        /**
         * Language details. This field will be populated when the targeting_type is `TARGETING_TYPE_LANGUAGE`.
         */
        languageDetails?: Schema$LanguageAssignedTargetingOptionDetails;
        /**
         * Output only. The resource name for this assigned targeting option.
         */
        name?: string | null;
        /**
         * Native content position details. This field will be populated when the targeting_type is `TARGETING_TYPE_NATIVE_CONTENT_POSITION`.
         */
        nativeContentPositionDetails?: Schema$NativeContentPositionAssignedTargetingOptionDetails;
        /**
         * Keyword details. This field will be populated when the targeting_type is `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST`. A maximum of 4 negative keyword lists can be assigned to a resource.
         */
        negativeKeywordListDetails?: Schema$NegativeKeywordListAssignedTargetingOptionDetails;
        /**
         * Open Measurement enabled inventory details. This field will be populated when the targeting_type is `TARGETING_TYPE_OMID`.
         */
        omidDetails?: Schema$OmidAssignedTargetingOptionDetails;
        /**
         * On screen position details. This field will be populated when the targeting_type is `TARGETING_TYPE_ON_SCREEN_POSITION`.
         */
        onScreenPositionDetails?: Schema$OnScreenPositionAssignedTargetingOptionDetails;
        /**
         * Operating system details. This field will be populated when the targeting_type is `TARGETING_TYPE_OPERATING_SYSTEM`.
         */
        operatingSystemDetails?: Schema$OperatingSystemAssignedTargetingOptionDetails;
        /**
         * Parental status details. This field will be populated when the targeting_type is `TARGETING_TYPE_PARENTAL_STATUS`.
         */
        parentalStatusDetails?: Schema$ParentalStatusAssignedTargetingOptionDetails;
        /**
         * POI details. This field will be populated when the targeting_type is `TARGETING_TYPE_POI`.
         */
        poiDetails?: Schema$PoiAssignedTargetingOptionDetails;
        /**
         * Proximity location list details. This field will be populated when the targeting_type is `TARGETING_TYPE_PROXIMITY_LOCATION_LIST`.
         */
        proximityLocationListDetails?: Schema$ProximityLocationListAssignedTargetingOptionDetails;
        /**
         * Regional location list details. This field will be populated when the targeting_type is `TARGETING_TYPE_REGIONAL_LOCATION_LIST`.
         */
        regionalLocationListDetails?: Schema$RegionalLocationListAssignedTargetingOptionDetails;
        /**
         * Sensitive category details. This field will be populated when the targeting_type is `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`. Sensitive categories are targeting exclusions. Advertiser level sensitive category exclusions, if set, are always applied in serving (even though they aren't visible in resource settings). Resource settings can exclude sensitive categories in addition to advertiser exclusions, but can't override them.
         */
        sensitiveCategoryExclusionDetails?: Schema$SensitiveCategoryAssignedTargetingOptionDetails;
        /**
         * Sub-exchange details. This field will be populated when the targeting_type is `TARGETING_TYPE_SUB_EXCHANGE`.
         */
        subExchangeDetails?: Schema$SubExchangeAssignedTargetingOptionDetails;
        /**
         * Output only. Identifies the type of this assigned targeting option.
         */
        targetingType?: string | null;
        /**
         * Third party verification details. This field will be populated when the targeting_type is `TARGETING_TYPE_THIRD_PARTY_VERIFIER`.
         */
        thirdPartyVerifierDetails?: Schema$ThirdPartyVerifierAssignedTargetingOptionDetails;
        /**
         * URL details. This field will be populated when the targeting_type is `TARGETING_TYPE_URL`.
         */
        urlDetails?: Schema$UrlAssignedTargetingOptionDetails;
        /**
         * User rewarded content details. This field will be populated when the targeting_type is `TARGETING_TYPE_USER_REWARDED_CONTENT`.
         */
        userRewardedContentDetails?: Schema$UserRewardedContentAssignedTargetingOptionDetails;
        /**
         * Video player size details. This field will be populated when the targeting_type is `TARGETING_TYPE_VIDEO_PLAYER_SIZE`.
         */
        videoPlayerSizeDetails?: Schema$VideoPlayerSizeAssignedTargetingOptionDetails;
        /**
         * Viewability details. This field will be populated when the targeting_type is `TARGETING_TYPE_VIEWABILITY`. You can only target one viewability option per resource.
         */
        viewabilityDetails?: Schema$ViewabilityAssignedTargetingOptionDetails;
    }
    /**
     * A single assigned user role, which defines a user's authorized interaction with a specified partner or advertiser.
     */
    export interface Schema$AssignedUserRole {
        /**
         * The ID of the advertiser that the assigend user role applies to.
         */
        advertiserId?: string | null;
        /**
         * Output only. The ID of the assigned user role.
         */
        assignedUserRoleId?: string | null;
        /**
         * The ID of the partner that the assigned user role applies to.
         */
        partnerId?: string | null;
        /**
         * Required. The user role to assign to a user for the entity.
         */
        userRole?: string | null;
    }
    /**
     * Assigned audience group targeting option details. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_AUDIENCE_GROUP`. The relation between each group is UNION, except for excluded_first_and_third_party_audience_group and excluded_google_audience_group, of which COMPLEMENT is used as an INTERSECTION with other groups.
     */
    export interface Schema$AudienceGroupAssignedTargetingOptionDetails {
        /**
         * The first and third party audience ids and recencies of the excluded first and third party audience group. Used for negative targeting. The COMPLEMENT of the UNION of this group and other excluded audience groups is used as an INTERSECTION to any positive audience targeting. All items are logically ‘OR’ of each other.
         */
        excludedFirstAndThirdPartyAudienceGroup?: Schema$FirstAndThirdPartyAudienceGroup;
        /**
         * The Google audience ids of the excluded Google audience group. Used for negative targeting. The COMPLEMENT of the UNION of this group and other excluded audience groups is used as an INTERSECTION to any positive audience targeting. Only contains Affinity, In-market and Installed-apps type Google audiences. All items are logically ‘OR’ of each other.
         */
        excludedGoogleAudienceGroup?: Schema$GoogleAudienceGroup;
        /**
         * The combined audience ids of the included combined audience group. Contains combined audience ids only.
         */
        includedCombinedAudienceGroup?: Schema$CombinedAudienceGroup;
        /**
         * The custom list ids of the included custom list group. Contains custom list ids only.
         */
        includedCustomListGroup?: Schema$CustomListGroup;
        /**
         * The first and third party audience ids and recencies of included first and third party audience groups. Each first and third party audience group contains first and third party audience ids only. The relation between each first and third party audience group is INTERSECTION, and the result is UNION'ed with other audience groups. Repeated groups with same settings will be ignored.
         */
        includedFirstAndThirdPartyAudienceGroups?: Schema$FirstAndThirdPartyAudienceGroup[];
        /**
         * The Google audience ids of the included Google audience group. Contains Google audience ids only.
         */
        includedGoogleAudienceGroup?: Schema$GoogleAudienceGroup;
    }
    /**
     * Details for audio content type assigned targeting option. This will be populated in the audio_content_type_details field when targeting_type is `TARGETING_TYPE_AUDIO_CONTENT_TYPE`. Explicitly targeting all options is not supported. Remove all audio content type targeting options to achieve this effect.
     */
    export interface Schema$AudioContentTypeAssignedTargetingOptionDetails {
        /**
         * Required. The audio content type.
         */
        audioContentType?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_AUDIO_CONTENT_TYPE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable audio content type. This will be populated in the audio_content_type_details field when targeting_type is `TARGETING_TYPE_AUDIO_CONTENT_TYPE`.
     */
    export interface Schema$AudioContentTypeTargetingOptionDetails {
        /**
         * Output only. The audio content type.
         */
        audioContentType?: string | null;
    }
    /**
     * The length an audio or a video has been played.
     */
    export interface Schema$AudioVideoOffset {
        /**
         * The offset in percentage of the audio or video duration.
         */
        percentage?: string | null;
        /**
         * The offset in seconds from the start of the audio or video.
         */
        seconds?: string | null;
    }
    /**
     * Response message for AdvertiserService.AuditAdvertiser.
     */
    export interface Schema$AuditAdvertiserResponse {
        /**
         * The number of individual targeting options from the following targeting types that are assigned to a line item under this advertiser. These individual targeting options count towards the limit of 4500000 ad group targeting options per advertiser. Qualifying Targeting types: * Channels, URLs, apps, and collections * Demographic * Google Audiences, including Affinity, Custom Affinity, and In-market audiences * Inventory source * Keyword * Mobile app category * User lists * Video targeting * Viewability
         */
        adGroupCriteriaCount?: string | null;
        /**
         * The number of individual targeting options from the following targeting types that are assigned to a line item under this advertiser. These individual targeting options count towards the limit of 900000 campaign targeting options per advertiser. Qualifying Targeting types: * Position * Browser * Connection speed * Day and time * Device and operating system * Digital content label * Sensitive categories * Environment * Geography, including business chains and proximity * ISP * Language * Third-party verification
         */
        campaignCriteriaCount?: string | null;
        /**
         * The number of channels created under this advertiser. These channels count towards the limit of 1000 channels per advertiser.
         */
        channelsCount?: string | null;
        /**
         * The number of negative keyword lists created under this advertiser. These negative keyword lists count towards the limit of 20 negative keyword lists per advertiser.
         */
        negativeKeywordListsCount?: string | null;
        /**
         * The number of negatively targeted channels created under this advertiser. These negatively targeted channels count towards the limit of 5 negatively targeted channels per advertiser.
         */
        negativelyTargetedChannelsCount?: string | null;
        /**
         * The number of ACTIVE and PAUSED campaigns under this advertiser. These campaigns count towards the limit of 9999 campaigns per advertiser.
         */
        usedCampaignsCount?: string | null;
        /**
         * The number of ACTIVE, PAUSED and DRAFT insertion orders under this advertiser. These insertion orders count towards the limit of 9999 insertion orders per advertiser.
         */
        usedInsertionOrdersCount?: string | null;
        /**
         * The number of ACTIVE, PAUSED, and DRAFT line items under this advertiser. These line items count towards the limit of 9999 line items per advertiser.
         */
        usedLineItemsCount?: string | null;
    }
    /**
     * Represents an assigned authorized seller status. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS`. If a resource does not have an `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` assigned targeting option, it is using the "Authorized Direct Sellers and Resellers" option.
     */
    export interface Schema$AuthorizedSellerStatusAssignedTargetingOptionDetails {
        /**
         * Output only. The authorized seller status to target.
         */
        authorizedSellerStatus?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable authorized seller status. This will be populated in the authorized_seller_status_details field when targeting_type is `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS`.
     */
    export interface Schema$AuthorizedSellerStatusTargetingOptionDetails {
        /**
         * Output only. The authorized seller status.
         */
        authorizedSellerStatus?: string | null;
    }
    /**
     * Settings that control the bid strategy. Bid strategy determines the bid price.
     */
    export interface Schema$BiddingStrategy {
        /**
         * A strategy that uses a fixed bid price.
         */
        fixedBid?: Schema$FixedBidStrategy;
        /**
         * A strategy that automatically adjusts the bid to optimize to your performance goal while spending the full budget. At insertion order level, the markup_type of line items cannot be set to `PARTNER_REVENUE_MODEL_MARKUP_TYPE_CPM`. In addition, when performance_goal_type is one of: * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPA` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPC` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_AV_VIEWED` , the line_item_type of the insertion order line items must be either: * `LINE_ITEM_TYPE_DISPLAY_DEFAULT` * `LINE_ITEM_TYPE_VIDEO_DEFAULT` , and when performance_goal_type is either: * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CIVA` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_IVO_TEN` the line_item_type of the insertion order line items must be `LINE_ITEM_TYPE_VIDEO_DEFAULT`.
         */
        maximizeSpendAutoBid?: Schema$MaximizeSpendBidStrategy;
        /**
         * A strategy that automatically adjusts the bid to meet or beat a specified performance goal. It is to be used only for a line item entity.
         */
        performanceGoalAutoBid?: Schema$PerformanceGoalBidStrategy;
    }
    /**
     * Details for assigned browser targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_BROWSER`.
     */
    export interface Schema$BrowserAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the browser.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted. All assigned browser targeting options on the same resource must have the same value for this field.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_BROWSER`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable browser. This will be populated in the browser_details field when targeting_type is `TARGETING_TYPE_BROWSER`.
     */
    export interface Schema$BrowserTargetingOptionDetails {
        /**
         * Output only. The display name of the browser.
         */
        displayName?: string | null;
    }
    /**
     * Summarized information of an individual campaign budget.
     */
    export interface Schema$BudgetSummary {
        /**
         * Corresponds to the external_budget_id of a campaign budget. If the value is not set in the campaign budget, this field will be empty.
         */
        externalBudgetId?: string | null;
        /**
         * The sum of charges made under this budget before taxes, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        preTaxAmountMicros?: string | null;
        /**
         * Relevant client, product, and estimate codes from the Mediaocean Prisma tool. Only applicable for campaign budgets with an external_budget_source of EXTERNAL_BUDGET_SOURCE_MEDIA_OCEAN.
         */
        prismaCpeCode?: Schema$PrismaCpeCode;
        /**
         * The amount of tax applied to charges under this budget, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        taxAmountMicros?: string | null;
        /**
         * The total sum of charges made under this budget, including tax, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        totalAmountMicros?: string | null;
    }
    /**
     * Request message for BulkEditAdvertiserAssignedTargetingOptions.
     */
    export interface Schema$BulkEditAdvertiserAssignedTargetingOptionsRequest {
        /**
         * The assigned targeting options to create in batch, specified as a list of `CreateAssignedTargetingOptionsRequest`. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`
         */
        createRequests?: Schema$CreateAssignedTargetingOptionsRequest[];
        /**
         * The assigned targeting options to delete in batch, specified as a list of `DeleteAssignedTargetingOptionsRequest`. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`
         */
        deleteRequests?: Schema$DeleteAssignedTargetingOptionsRequest[];
    }
    export interface Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options that have been successfully created. This list will be absent if empty.
         */
        createdAssignedTargetingOptions?: Schema$AssignedTargetingOption[];
    }
    /**
     * Request message for AssignedInventorySourceService.BulkEdit.
     */
    export interface Schema$BulkEditAssignedInventorySourcesRequest {
        /**
         * The ID of the advertiser that owns the parent inventory source group. The parent partner does not have access to these assigned inventory sources.
         */
        advertiserId?: string | null;
        /**
         * The assigned inventory sources to create in bulk, specified as a list of AssignedInventorySources.
         */
        createdAssignedInventorySources?: Schema$AssignedInventorySource[];
        /**
         * The IDs of the assigned inventory sources to delete in bulk, specified as a list of assigned_inventory_source_ids.
         */
        deletedAssignedInventorySources?: string[] | null;
        /**
         * The ID of the partner that owns the inventory source group. Only this partner has write access to these assigned inventory sources.
         */
        partnerId?: string | null;
    }
    /**
     * Response message for AssignedInventorySourceService.BulkEdit.
     */
    export interface Schema$BulkEditAssignedInventorySourcesResponse {
        /**
         * The list of assigned inventory sources that have been successfully created. This list will be absent if empty.
         */
        assignedInventorySources?: Schema$AssignedInventorySource[];
    }
    /**
     * Request message for AssignedLocationService.BulkEditAssignedLocations.
     */
    export interface Schema$BulkEditAssignedLocationsRequest {
        /**
         * The assigned locations to create in bulk, specified as a list of AssignedLocation resources.
         */
        createdAssignedLocations?: Schema$AssignedLocation[];
        /**
         * The IDs of the assigned locations to delete in bulk, specified as a list of assignedLocationId values.
         */
        deletedAssignedLocations?: string[] | null;
    }
    export interface Schema$BulkEditAssignedLocationsResponse {
        /**
         * The list of assigned locations that have been successfully created. This list will be absent if empty.
         */
        assignedLocations?: Schema$AssignedLocation[];
    }
    /**
     * Request message for BulkEditAssignedUserRoles.
     */
    export interface Schema$BulkEditAssignedUserRolesRequest {
        /**
         * The assigned user roles to create in batch, specified as a list of AssignedUserRoles.
         */
        createdAssignedUserRoles?: Schema$AssignedUserRole[];
        /**
         * The assigned user roles to delete in batch, specified as a list of assigned_user_role_ids. The format of assigned_user_role_id is `entityType-entityid`, for example `partner-123`.
         */
        deletedAssignedUserRoles?: string[] | null;
    }
    export interface Schema$BulkEditAssignedUserRolesResponse {
        /**
         * The list of assigned user roles that have been successfully created. This list will be absent if empty.
         */
        createdAssignedUserRoles?: Schema$AssignedUserRole[];
    }
    /**
     * Request message for BulkEditLineItemAssignedTargetingOptions.
     */
    export interface Schema$BulkEditLineItemAssignedTargetingOptionsRequest {
        /**
         * The assigned targeting options to create in batch, specified as a list of `CreateAssignedTargetingOptionsRequest`.
         */
        createRequests?: Schema$CreateAssignedTargetingOptionsRequest[];
        /**
         * The assigned targeting options to delete in batch, specified as a list of `DeleteAssignedTargetingOptionsRequest`.
         */
        deleteRequests?: Schema$DeleteAssignedTargetingOptionsRequest[];
    }
    export interface Schema$BulkEditLineItemAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options that have been successfully created. This list will be absent if empty.
         */
        createdAssignedTargetingOptions?: Schema$AssignedTargetingOption[];
    }
    /**
     * Request message for NegativeKeywordService.BulkEditNegativeKeywords.
     */
    export interface Schema$BulkEditNegativeKeywordsRequest {
        /**
         * The negative keywords to create in batch, specified as a list of NegativeKeywords.
         */
        createdNegativeKeywords?: Schema$NegativeKeyword[];
        /**
         * The negative keywords to delete in batch, specified as a list of keyword_values.
         */
        deletedNegativeKeywords?: string[] | null;
    }
    /**
     * Response message for NegativeKeywordService.BulkEditNegativeKeywords.
     */
    export interface Schema$BulkEditNegativeKeywordsResponse {
        /**
         * The list of negative keywords that have been successfully created. This list will be absent if empty.
         */
        negativeKeywords?: Schema$NegativeKeyword[];
    }
    /**
     * Request message for BulkEditPartnerAssignedTargetingOptions.
     */
    export interface Schema$BulkEditPartnerAssignedTargetingOptionsRequest {
        /**
         * The assigned targeting options to create in batch, specified as a list of `CreateAssignedTargetingOptionsRequest`. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        createRequests?: Schema$CreateAssignedTargetingOptionsRequest[];
        /**
         * The assigned targeting options to delete in batch, specified as a list of `DeleteAssignedTargetingOptionsRequest`. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        deleteRequests?: Schema$DeleteAssignedTargetingOptionsRequest[];
    }
    export interface Schema$BulkEditPartnerAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options that have been successfully created. This list will be absent if empty.
         */
        createdAssignedTargetingOptions?: Schema$AssignedTargetingOption[];
    }
    /**
     * Request message for SiteService.BulkEditSites.
     */
    export interface Schema$BulkEditSitesRequest {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string | null;
        /**
         * The sites to create in batch, specified as a list of Sites.
         */
        createdSites?: Schema$Site[];
        /**
         * The sites to delete in batch, specified as a list of site url_or_app_ids.
         */
        deletedSites?: string[] | null;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string | null;
    }
    /**
     * Response message for SiteService.BulkEditSites.
     */
    export interface Schema$BulkEditSitesResponse {
        /**
         * The list of sites that have been successfully created. This list will be absent if empty.
         */
        sites?: Schema$Site[];
    }
    export interface Schema$BulkListAdvertiserAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent BulkListAdvertiserAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$BulkListCampaignAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent BulkListCampaignAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent BulkListInsertionOrderAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$BulkListLineItemAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent BulkListLineItemAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    /**
     * Details for assigned Business chain targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_BUSINESS_CHAIN`.
     */
    export interface Schema$BusinessChainAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of a business chain, e.g. "KFC", "Chase Bank".
         */
        displayName?: string | null;
        /**
         * Required. The radius of the area around the business chain that will be targeted. The units of the radius are specified by proximity_radius_unit. Must be 1 to 800 if unit is `DISTANCE_UNIT_KILOMETERS` and 1 to 500 if unit is `DISTANCE_UNIT_MILES`. The minimum increment for both cases is 0.1. Inputs will be rounded to the nearest acceptable value if it is too granular, e.g. 15.57 will become 15.6.
         */
        proximityRadiusAmount?: number | null;
        /**
         * Required. The unit of distance by which the targeting radius is measured.
         */
        proximityRadiusUnit?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_BUSINESS_CHAIN`. Accepted business chain targeting option IDs can be retrieved using SearchTargetingOptions.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Search terms for Business Chain targeting options. At least one of the field should be populated.
     */
    export interface Schema$BusinessChainSearchTerms {
        /**
         * The search query for the desired business chain. The query must be the full name of the business, e.g. "KFC", "mercedes-benz".
         */
        businessChainQuery?: string | null;
        /**
         * The search query for the desired geo region, e.g. "Seattle", "United State".
         */
        regionQuery?: string | null;
    }
    /**
     * Represents a targetable business chain within a geo region. This will be populated in the business_chain_details field when targeting_type is `TARGETING_TYPE_BUSINESS_CHAIN`.
     */
    export interface Schema$BusinessChainTargetingOptionDetails {
        /**
         * Output only. The display name of the business chain, e.g. "KFC", "Chase Bank".
         */
        businessChain?: string | null;
        /**
         * Output only. The display name of the geographic region, e.g. "Ontario, Canada".
         */
        geoRegion?: string | null;
        /**
         * Output only. The type of the geographic region.
         */
        geoRegionType?: string | null;
    }
    /**
     * A single campaign.
     */
    export interface Schema$Campaign {
        /**
         * Output only. The unique ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string | null;
        /**
         * The list of budgets available to this campaign. If this field is not set, the campaign uses an unlimited budget.
         */
        campaignBudgets?: Schema$CampaignBudget[];
        /**
         * Required. The planned spend and duration of the campaign.
         */
        campaignFlight?: Schema$CampaignFlight;
        /**
         * Required. The goal of the campaign.
         */
        campaignGoal?: Schema$CampaignGoal;
        /**
         * Output only. The unique ID of the campaign. Assigned by the system.
         */
        campaignId?: string | null;
        /**
         * Required. The display name of the campaign. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Controls whether or not the insertion orders under this campaign can spend their budgets and bid on inventory. * Accepted values are `ENTITY_STATUS_ACTIVE`, `ENTITY_STATUS_ARCHIVED`, and `ENTITY_STATUS_PAUSED`. * For CreateCampaign method, `ENTITY_STATUS_ARCHIVED` is not allowed.
         */
        entityStatus?: string | null;
        /**
         * Required. The frequency cap setting of the campaign.
         */
        frequencyCap?: Schema$FrequencyCap;
        /**
         * Output only. The resource name of the campaign.
         */
        name?: string | null;
        /**
         * Output only. The timestamp when the campaign was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * Settings that control how the campaign budget is allocated.
     */
    export interface Schema$CampaignBudget {
        /**
         * Required. The total amount the linked insertion order segments can budget. The amount is in micros. Must be greater than 0. For example, 500000000 represents 500 standard units of the currency.
         */
        budgetAmountMicros?: string | null;
        /**
         * The unique ID of the campaign budget. Assigned by the system. Do not set for new budgets. Must be included when updating or adding budgets to campaign_budgets. Otherwise, a new ID will be generated and assigned.
         */
        budgetId?: string | null;
        /**
         * Required. Immutable. Specifies whether the budget is measured in currency or impressions.
         */
        budgetUnit?: string | null;
        /**
         * Required. The date range for the campaign budget. Linked budget segments may have a different date range. They are resolved relative to the parent advertiser's time zone. Both `start_date` and `end_date` must be before the year 2037.
         */
        dateRange?: Schema$DateRange;
        /**
         * Required. The display name of the budget. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Immutable. The ID identifying this budget to the external source. If this field is set and the invoice detail level of the corresponding billing profile is set to "Budget level PO", all impressions served against this budget will include this ID on the invoice. Must be unique under the campaign.
         */
        externalBudgetId?: string | null;
        /**
         * Required. The external source of the budget.
         */
        externalBudgetSource?: string | null;
        /**
         * Immutable. The ID used to group budgets to be included the same invoice. If this field is set and the invoice level of the corresponding billing profile is set to "Budget invoice grouping ID", all external_budget_id sharing the same invoice_grouping_id will be grouped in the same invoice.
         */
        invoiceGroupingId?: string | null;
        /**
         * Additional metadata for use by the Mediaocean Prisma tool. Required for Mediaocean budgets. Only applicable to prisma_enabled advertisers.
         */
        prismaConfig?: Schema$PrismaConfig;
    }
    /**
     * Settings that track the planned spend and duration of a campaign.
     */
    export interface Schema$CampaignFlight {
        /**
         * Required. The dates that the campaign is expected to run. They are resolved relative to the parent advertiser's time zone. * The dates specified here will not affect serving. They are used to generate alerts and warnings. For example, if the flight date of any child insertion order is outside the range of these dates, the user interface will show a warning. * `start_date` is required and must be the current date or later. * `end_date` is optional. If specified, it must be the `start_date` or later. * Any specified date must be before the year 2037.
         */
        plannedDates?: Schema$DateRange;
        /**
         * The amount the campaign is expected to spend for its given planned_dates. This will not limit serving, but will be used for tracking spend in the DV360 UI. The amount is in micros. Must be greater than or equal to 0. For example, 500000000 represents 500 standard units of the currency.
         */
        plannedSpendAmountMicros?: string | null;
    }
    /**
     * Settings that control the goal of a campaign.
     */
    export interface Schema$CampaignGoal {
        /**
         * Required. The type of the campaign goal.
         */
        campaignGoalType?: string | null;
        /**
         * Required. The performance goal of the campaign. Acceptable values for performance_goal_type are: * `PERFORMANCE_GOAL_TYPE_CPM` * `PERFORMANCE_GOAL_TYPE_CPC` * `PERFORMANCE_GOAL_TYPE_CPA` * `PERFORMANCE_GOAL_TYPE_CPIAVC` * `PERFORMANCE_GOAL_TYPE_CTR` * `PERFORMANCE_GOAL_TYPE_VIEWABILITY` * `PERFORMANCE_GOAL_TYPE_OTHER`
         */
        performanceGoal?: Schema$PerformanceGoal;
    }
    /**
     * Details for assigned carrier and ISP targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_CARRIER_AND_ISP`.
     */
    export interface Schema$CarrierAndIspAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the carrier or ISP.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted. All assigned carrier and ISP targeting options on the same resource must have the same value for this field.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_CARRIER_AND_ISP`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable carrier or ISP. This will be populated in the carrier_and_isp_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_CARRIER_AND_ISP`.
     */
    export interface Schema$CarrierAndIspTargetingOptionDetails {
        /**
         * Output only. The display name of the carrier or ISP.
         */
        displayName?: string | null;
        /**
         * Output only. The type indicating if it's carrier or ISP.
         */
        type?: string | null;
    }
    /**
     * Assigned category targeting option details. This will be populated in the category_details field when targeting_type is `TARGETING_TYPE_CATEGORY`.
     */
    export interface Schema$CategoryAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the category.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CATEGORY`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable category. This will be populated in the category_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_CATEGORY`.
     */
    export interface Schema$CategoryTargetingOptionDetails {
        /**
         * Output only. The display name of the category.
         */
        displayName?: string | null;
    }
    /**
     * A single channel. Channels are custom groups of related websites and apps.
     */
    export interface Schema$Channel {
        /**
         * The ID of the advertiser that owns the channel.
         */
        advertiserId?: string | null;
        /**
         * Output only. The unique ID of the channel. Assigned by the system.
         */
        channelId?: string | null;
        /**
         * Required. The display name of the channel. Must be UTF-8 encoded with a maximum length of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The resource name of the channel.
         */
        name?: string | null;
        /**
         * Output only. Number of line items that are directly targeting this channel negatively.
         */
        negativelyTargetedLineItemCount?: string | null;
        /**
         * The ID of the partner that owns the channel.
         */
        partnerId?: string | null;
        /**
         * Output only. Number of line items that are directly targeting this channel positively.
         */
        positivelyTargetedLineItemCount?: string | null;
    }
    /**
     * Details for assigned channel targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_CHANNEL`.
     */
    export interface Schema$ChannelAssignedTargetingOptionDetails {
        /**
         * Required. ID of the channel. Should refer to the channel ID field on a [Partner-owned channel](partners.channels#Channel.FIELDS.channel_id) or [advertiser-owned channel](advertisers.channels#Channel.FIELDS.channel_id) resource.
         */
        channelId?: string | null;
        /**
         * Indicates if this option is being negatively targeted. For advertiser level assigned targeting option, this field must be true.
         */
        negative?: boolean | null;
    }
    /**
     * Settings for advertisers that use both Campaign Manager 360 (CM360) and third-party ad servers.
     */
    export interface Schema$CmHybridConfig {
        /**
         * Required. Immutable. Account ID of the CM360 Floodlight configuration linked with the DV360 advertiser.
         */
        cmAccountId?: string | null;
        /**
         * Output only. The set of CM360 Advertiser IDs sharing the CM360 Floodlight configuration.
         */
        cmAdvertiserIds?: string[] | null;
        /**
         * Required. Immutable. ID of the CM360 Floodlight configuration linked with the DV360 advertiser.
         */
        cmFloodlightConfigId?: string | null;
        /**
         * Required. Immutable. By setting this field to `true`, you, on behalf of your company, authorize the sharing of information from the given Floodlight configuration to this Display & Video 360 advertiser.
         */
        cmFloodlightLinkingAuthorized?: boolean | null;
        /**
         * A list of CM360 sites whose placements will be synced to DV360 as creatives. If absent or empty in CreateAdvertiser method, the system will automatically create a CM360 site. Removing sites from this list may cause DV360 creatives synced from CM360 to be deleted. At least one site must be specified.
         */
        cmSyncableSiteIds?: string[] | null;
        /**
         * Whether or not to report DV360 cost to CM360.
         */
        dv360ToCmCostReportingEnabled?: boolean | null;
        /**
         * Whether or not to include DV360 data in CM360 data transfer reports.
         */
        dv360ToCmDataSharingEnabled?: boolean | null;
    }
    /**
     * A Campaign Manager 360 tracking ad.
     */
    export interface Schema$CmTrackingAd {
        /**
         * The ad ID of the campaign manager 360 tracking Ad.
         */
        cmAdId?: string | null;
        /**
         * The creative ID of the campaign manager 360 tracking Ad.
         */
        cmCreativeId?: string | null;
        /**
         * The placement ID of the campaign manager 360 tracking Ad.
         */
        cmPlacementId?: string | null;
    }
    /**
     * Describes a combined audience resource.
     */
    export interface Schema$CombinedAudience {
        /**
         * Output only. The unique ID of the combined audience. Assigned by the system.
         */
        combinedAudienceId?: string | null;
        /**
         * Output only. The display name of the combined audience. .
         */
        displayName?: string | null;
        /**
         * Output only. The resource name of the combined audience.
         */
        name?: string | null;
    }
    /**
     * Details of combined audience group. All combined audience targeting settings are logically ‘OR’ of each other.
     */
    export interface Schema$CombinedAudienceGroup {
        /**
         * Required. All combined audience targeting settings in combined audience group. Repeated settings with same id will be ignored. The number of combined audience settings should be no more than five, error will be thrown otherwise.
         */
        settings?: Schema$CombinedAudienceTargetingSetting[];
    }
    /**
     * Details of combined audience targeting setting.
     */
    export interface Schema$CombinedAudienceTargetingSetting {
        /**
         * Required. Combined audience id of combined audience targeting setting. This id is combined_audience_id.
         */
        combinedAudienceId?: string | null;
    }
    /**
     * User consent status.
     */
    export interface Schema$Consent {
        /**
         * Represents consent for ad personalization.
         */
        adPersonalization?: string | null;
        /**
         * Represents consent for ad user data.
         */
        adUserData?: string | null;
    }
    /**
     * Contact information defining a Customer Match audience member.
     */
    export interface Schema$ContactInfo {
        /**
         * Country code of the member. Must also be set with the following fields: * hashed_first_name * hashed_last_name * zip_codes
         */
        countryCode?: string | null;
        /**
         * A list of SHA256 hashed email of the member. Before hashing, remove all whitespace and make sure the string is all lowercase.
         */
        hashedEmails?: string[] | null;
        /**
         * SHA256 hashed first name of the member. Before hashing, remove all whitespace and make sure the string is all lowercase. Must also be set with the following fields: * country_code * hashed_last_name * zip_codes
         */
        hashedFirstName?: string | null;
        /**
         * SHA256 hashed last name of the member. Before hashing, remove all whitespace and make sure the string is all lowercase. Must also be set with the following fields: * country_code * hashed_first_name * zip_codes
         */
        hashedLastName?: string | null;
        /**
         * A list of SHA256 hashed phone numbers of the member. Before hashing, all phone numbers must be formatted using the [E.164 format](//en.wikipedia.org/wiki/E.164) and include the country calling code.
         */
        hashedPhoneNumbers?: string[] | null;
        /**
         * A list of zip codes of the member. Must also be set with the following fields: * country_code * hashed_first_name * hashed_last_name
         */
        zipCodes?: string[] | null;
    }
    /**
     * Wrapper message for a list of contact information defining Customer Match audience members.
     */
    export interface Schema$ContactInfoList {
        /**
         * Input only. The consent setting for the users in contact_infos. Leaving this field unset indicates that consent is not specified. If ad_user_data or ad_personalization fields are set to `CONSENT_STATUS_DENIED`, the request will return an error.
         */
        consent?: Schema$Consent;
        /**
         * A list of ContactInfo objects defining Customer Match audience members. The size of members after splitting the contact_infos mustn't be greater than 500,000.
         */
        contactInfos?: Schema$ContactInfo[];
    }
    /**
     * Details for content duration assigned targeting option. This will be populated in the content_duration_details field when targeting_type is `TARGETING_TYPE_CONTENT_DURATION`. Explicitly targeting all options is not supported. Remove all content duration targeting options to achieve this effect.
     */
    export interface Schema$ContentDurationAssignedTargetingOptionDetails {
        /**
         * Output only. The content duration.
         */
        contentDuration?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CONTENT_DURATION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable content duration. This will be populated in the content_duration_details field when targeting_type is `TARGETING_TYPE_CONTENT_DURATION`.
     */
    export interface Schema$ContentDurationTargetingOptionDetails {
        /**
         * Output only. The content duration.
         */
        contentDuration?: string | null;
    }
    /**
     * Details for content genre assigned targeting option. This will be populated in the content_genre_details field when targeting_type is `TARGETING_TYPE_CONTENT_GENRE`. Explicitly targeting all options is not supported. Remove all content genre targeting options to achieve this effect.
     */
    export interface Schema$ContentGenreAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the content genre.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CONTENT_GENRE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable content genre. This will be populated in the content_genre_details field when targeting_type is `TARGETING_TYPE_CONTENT_GENRE`.
     */
    export interface Schema$ContentGenreTargetingOptionDetails {
        /**
         * Output only. The display name of the content genre
         */
        displayName?: string | null;
    }
    /**
     * Assigned content instream position targeting option details. This will be populated in the content_instream_position_details field when targeting_type is `TARGETING_TYPE_CONTENT_INSTREAM_POSITION`.
     */
    export interface Schema$ContentInstreamPositionAssignedTargetingOptionDetails {
        /**
         * Output only. The ad type to target. Only applicable to insertion order targeting and new line items supporting the specified ad type will inherit this targeting option by default. Possible values are: * `AD_TYPE_VIDEO`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_VIDEO_DEFAULT`. * `AD_TYPE_AUDIO`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_AUDIO_DEFAULT`.
         */
        adType?: string | null;
        /**
         * Required. The content instream position for video or audio ads.
         */
        contentInstreamPosition?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CONTENT_INSTREAM_POSITION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable content instream position, which could be used by video and audio ads. This will be populated in the content_instream_position_details field when targeting_type is `TARGETING_TYPE_CONTENT_INSTREAM_POSITION`.
     */
    export interface Schema$ContentInstreamPositionTargetingOptionDetails {
        /**
         * Output only. The content instream position.
         */
        contentInstreamPosition?: string | null;
    }
    /**
     * Assigned content outstream position targeting option details. This will be populated in the content_outstream_position_details field when targeting_type is `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION`.
     */
    export interface Schema$ContentOutstreamPositionAssignedTargetingOptionDetails {
        /**
         * Output only. The ad type to target. Only applicable to insertion order targeting and new line items supporting the specified ad type will inherit this targeting option by default. Possible values are: * `AD_TYPE_DISPLAY`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_DISPLAY_DEFAULT`. * `AD_TYPE_VIDEO`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_VIDEO_DEFAULT`.
         */
        adType?: string | null;
        /**
         * Required. The content outstream position.
         */
        contentOutstreamPosition?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable content outstream position, which could be used by display and video ads. This will be populated in the content_outstream_position_details field when targeting_type is `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION`.
     */
    export interface Schema$ContentOutstreamPositionTargetingOptionDetails {
        /**
         * Output only. The content outstream position.
         */
        contentOutstreamPosition?: string | null;
    }
    /**
     * Details for content stream type assigned targeting option. This will be populated in the content_stream_type_details field when targeting_type is `TARGETING_TYPE_CONTENT_STREAM_TYPE`. Explicitly targeting all options is not supported. Remove all content stream type targeting options to achieve this effect.
     */
    export interface Schema$ContentStreamTypeAssignedTargetingOptionDetails {
        /**
         * Output only. The content stream type.
         */
        contentStreamType?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_CONTENT_STREAM_TYPE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable content stream type. This will be populated in the content_stream_type_details field when targeting_type is `TARGETING_TYPE_CONTENT_STREAM_TYPE`.
     */
    export interface Schema$ContentStreamTypeTargetingOptionDetails {
        /**
         * Output only. The content stream type.
         */
        contentStreamType?: string | null;
    }
    /**
     * Settings that control how conversions are counted. All post-click conversions will be counted. A percentage value can be set for post-view conversions counting.
     */
    export interface Schema$ConversionCountingConfig {
        /**
         * The Floodlight activity configs used to track conversions. The number of conversions counted is the sum of all of the conversions counted by all of the Floodlight activity IDs specified in this field.
         */
        floodlightActivityConfigs?: Schema$TrackingFloodlightActivityConfig[];
        /**
         * The percentage of post-view conversions to count, in millis (1/1000 of a percent). Must be between 0 and 100000 inclusive. For example, to track 50% of the post-click conversions, set a value of 50000.
         */
        postViewCountPercentageMillis?: string | null;
    }
    /**
     * Counter event of the creative.
     */
    export interface Schema$CounterEvent {
        /**
         * Required. The name of the counter event.
         */
        name?: string | null;
        /**
         * Required. The name used to identify this counter event in reports.
         */
        reportingName?: string | null;
    }
    /**
     * A request message for CreateAsset.
     */
    export interface Schema$CreateAssetRequest {
        /**
         * Required. The filename of the asset, including the file extension. The filename must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        filename?: string | null;
    }
    /**
     * A response message for CreateAsset.
     */
    export interface Schema$CreateAssetResponse {
        /**
         * The uploaded asset, if successful.
         */
        asset?: Schema$Asset;
    }
    /**
     * A request listing which assigned targeting options of a given targeting type should be created and added.
     */
    export interface Schema$CreateAssignedTargetingOptionsRequest {
        /**
         * Required. The assigned targeting options to create and add.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * Required. Identifies the type of this assigned targeting option.
         */
        targetingType?: string | null;
    }
    /**
     * Request message for [SdfDownloadTaskService.CreateSdfDownloadTask].
     */
    export interface Schema$CreateSdfDownloadTaskRequest {
        /**
         * The ID of the advertiser to download SDF for.
         */
        advertiserId?: string | null;
        /**
         * Filters on entities by their entity IDs.
         */
        idFilter?: Schema$IdFilter;
        /**
         * Filters on Inventory Sources by their IDs.
         */
        inventorySourceFilter?: Schema$InventorySourceFilter;
        /**
         * Filters on selected file types. The entities in each file are filtered by a chosen set of filter entities. The filter entities must be the same type as, or a parent type of, the selected file types.
         */
        parentEntityFilter?: Schema$ParentEntityFilter;
        /**
         * The ID of the partner to download SDF for.
         */
        partnerId?: string | null;
        /**
         * Required. The SDF version of the downloaded file. If set to `SDF_VERSION_UNSPECIFIED`, this will default to the version specified by the advertiser or partner identified by `root_id`. An advertiser inherits its SDF version from its partner unless configured otherwise.
         */
        version?: string | null;
    }
    /**
     * A single Creative.
     */
    export interface Schema$Creative {
        /**
         * Additional dimensions. Applicable when creative_type is one of: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_EXPANDABLE` * `CREATIVE_TYPE_NATIVE` * `CREATIVE_TYPE_NATIVE_SITE_SQUARE` * `CREATIVE_TYPE_LIGHTBOX` * `CREATIVE_TYPE_PUBLISHER_HOSTED` If this field is specified, width_pixels and height_pixels are both required and must be greater than or equal to 0.
         */
        additionalDimensions?: Schema$Dimensions[];
        /**
         * Output only. The unique ID of the advertiser the creative belongs to.
         */
        advertiserId?: string | null;
        /**
         * Third-party HTML tracking tag to be appended to the creative tag.
         */
        appendedTag?: string | null;
        /**
         * Required. Assets associated to this creative.
         */
        assets?: Schema$AssetAssociation[];
        /**
         * Output only. The unique ID of the Campaign Manager 360 placement associated with the creative. This field is only applicable for creatives that are synced from Campaign Manager.
         */
        cmPlacementId?: string | null;
        /**
         * The Campaign Manager 360 tracking ad associated with the creative. Optional for the following creative_type when created by an advertiser that uses both Campaign Manager 360 and third-party ad serving: * `CREATIVE_TYPE_NATIVE` * `CREATIVE_TYPE_NATIVE_SITE_SQUARE` Output only for other cases.
         */
        cmTrackingAd?: Schema$CmTrackingAd;
        /**
         * The IDs of companion creatives for a video creative. You can assign existing display creatives (with image or HTML5 assets) to serve surrounding the publisher's video player. Companions display around the video player while the video is playing and remain after the video has completed. Creatives contain additional dimensions can not be companion creatives. This field is only supported for following creative_type: * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_VIDEO`
         */
        companionCreativeIds?: string[] | null;
        /**
         * Counter events for a rich media creative. Counters track the number of times that a user interacts with any part of a rich media creative in a specified way (mouse-overs, mouse-outs, clicks, taps, data loading, keyboard entries, etc.). Any event that can be captured in the creative can be recorded as a counter. Leave it empty or unset for creatives containing image assets only.
         */
        counterEvents?: Schema$CounterEvent[];
        /**
         * Output only. The timestamp when the creative was created. Assigned by the system.
         */
        createTime?: string | null;
        /**
         * Output only. A list of attributes of the creative that is generated by the system.
         */
        creativeAttributes?: string[] | null;
        /**
         * Output only. The unique ID of the creative. Assigned by the system.
         */
        creativeId?: string | null;
        /**
         * Required. Immutable. The type of the creative.
         */
        creativeType?: string | null;
        /**
         * Required. Primary dimensions of the creative. Applicable to all creative types. The value of width_pixels and height_pixels defaults to `0` when creative_type is one of: * `CREATIVE_TYPE_VIDEO` * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_NATIVE_VIDEO`
         */
        dimensions?: Schema$Dimensions;
        /**
         * Required. The display name of the creative. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. Indicates whether the creative is dynamic.
         */
        dynamic?: boolean | null;
        /**
         * Required. Controls whether or not the creative can serve. Accepted values are: * `ENTITY_STATUS_ACTIVE` * `ENTITY_STATUS_ARCHIVED` * `ENTITY_STATUS_PAUSED`
         */
        entityStatus?: string | null;
        /**
         * Required. Exit events for this creative. An exit (also known as a click tag) is any area in your creative that someone can click or tap to open an advertiser's landing page. Every creative must include at least one exit. You can add an exit to your creative in any of the following ways: * Use Google Web Designer's tap area. * Define a JavaScript variable called "clickTag". * Use the Enabler (Enabler.exit()) to track exits in rich media formats.
         */
        exitEvents?: Schema$ExitEvent[];
        /**
         * Optional. Specifies the expanding direction of the creative. Required and only valid for third-party expandable creatives. Third-party expandable creatives are creatives with following hosting source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_EXPANDABLE`
         */
        expandingDirection?: string | null;
        /**
         * Optional. Indicates the creative will automatically expand on hover. Optional and only valid for third-party expandable creatives. Third-party expandable creatives are creatives with following hosting source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_EXPANDABLE`
         */
        expandOnHover?: boolean | null;
        /**
         * Required. Indicates where the creative is hosted.
         */
        hostingSource?: string | null;
        /**
         * Output only. Indicates the third-party VAST tag creative requires HTML5 Video support. Output only and only valid for third-party VAST tag creatives. Third-party VAST tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        html5Video?: boolean | null;
        /**
         * Indicates whether Integral Ad Science (IAS) campaign monitoring is enabled. To enable this for the creative, make sure the Advertiser.creative_config.ias_client_id has been set to your IAS client ID.
         */
        iasCampaignMonitoring?: boolean | null;
        /**
         * ID information used to link this creative to an external system. Must be UTF-8 encoded with a length of no more than 10,000 characters.
         */
        integrationCode?: string | null;
        /**
         * JavaScript measurement URL from supported third-party verification providers (ComScore, DoubleVerify, IAS, Moat). HTML script tags are not supported. This field is only writeable in following creative_type: * `CREATIVE_TYPE_NATIVE` * `CREATIVE_TYPE_NATIVE_SITE_SQUARE` * `CREATIVE_TYPE_NATIVE_VIDEO`
         */
        jsTrackerUrl?: string | null;
        /**
         * Output only. The IDs of the line items this creative is associated with. To associate a creative to a line item, use LineItem.creative_ids instead.
         */
        lineItemIds?: string[] | null;
        /**
         * Output only. Media duration of the creative. Applicable when creative_type is one of: * `CREATIVE_TYPE_VIDEO` * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_NATIVE_VIDEO` * `CREATIVE_TYPE_PUBLISHER_HOSTED`
         */
        mediaDuration?: string | null;
        /**
         * Output only. Indicates the third-party audio creative supports MP3. Output only and only valid for third-party audio creatives. Third-party audio creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_AUDIO`
         */
        mp3Audio?: boolean | null;
        /**
         * Output only. The resource name of the creative.
         */
        name?: string | null;
        /**
         * User notes for this creative. Must be UTF-8 encoded with a length of no more than 20,000 characters.
         */
        notes?: string | null;
        /**
         * Specifies the OBA icon for a video creative. This field is only supported in following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        obaIcon?: Schema$ObaIcon;
        /**
         * Output only. Indicates the third-party audio creative supports OGG. Output only and only valid for third-party audio creatives. Third-party audio creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_AUDIO`
         */
        oggAudio?: boolean | null;
        /**
         * Amount of time to play the video before counting a view. This field is required when skippable is true. This field is only supported for the following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        progressOffset?: Schema$AudioVideoOffset;
        /**
         * Optional. Indicates that the creative relies on HTML5 to render properly. Optional and only valid for third-party tag creatives. Third-party tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_EXPANDABLE`
         */
        requireHtml5?: boolean | null;
        /**
         * Optional. Indicates that the creative requires MRAID (Mobile Rich Media Ad Interface Definitions system). Set this if the creative relies on mobile gestures for interactivity, such as swiping or tapping. Optional and only valid for third-party tag creatives. Third-party tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_EXPANDABLE`
         */
        requireMraid?: boolean | null;
        /**
         * Optional. Indicates that the creative will wait for a return ping for attribution. Only valid when using a Campaign Manager 360 tracking ad with a third-party ad server parameter and the ${DC_DBM_TOKEN\} macro. Optional and only valid for third-party tag creatives or third-party VAST tag creatives. Third-party tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_EXPANDABLE` Third-party VAST tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_VIDEO`
         */
        requirePingForAttribution?: boolean | null;
        /**
         * Output only. The current status of the creative review process.
         */
        reviewStatus?: Schema$ReviewStatusInfo;
        /**
         * Amount of time to play the video before the skip button appears. This field is required when skippable is true. This field is only supported for the following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        skipOffset?: Schema$AudioVideoOffset;
        /**
         * Whether the user can choose to skip a video creative. This field is only supported for the following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        skippable?: boolean | null;
        /**
         * Optional. The original third-party tag used for the creative. Required and only valid for third-party tag creatives. Third-party tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_EXPANDABLE`
         */
        thirdPartyTag?: string | null;
        /**
         * Tracking URLs from third parties to track interactions with a video creative. This field is only supported for the following creative_type: * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_VIDEO` * `CREATIVE_TYPE_NATIVE_VIDEO`
         */
        thirdPartyUrls?: Schema$ThirdPartyUrl[];
        /**
         * Timer custom events for a rich media creative. Timers track the time during which a user views and interacts with a specified part of a rich media creative. A creative can have multiple timer events, each timed independently. Leave it empty or unset for creatives containing image assets only.
         */
        timerEvents?: Schema$TimerEvent[];
        /**
         * Tracking URLs for analytics providers or third-party ad technology vendors. The URLs must start with https (except on inventory that doesn't require SSL compliance). If using macros in your URL, use only macros supported by Display & Video 360. Standard URLs only, no IMG or SCRIPT tags. This field is only writeable in following creative_type: * `CREATIVE_TYPE_NATIVE` * `CREATIVE_TYPE_NATIVE_SITE_SQUARE` * `CREATIVE_TYPE_NATIVE_VIDEO`
         */
        trackerUrls?: string[] | null;
        /**
         * Output only. Audio/Video transcodes. Display & Video 360 transcodes the main asset into a number of alternative versions that use different file formats or have different properties (resolution, audio bit rate, and video bit rate), each designed for specific video players or bandwidths. These transcodes give a publisher's system more options to choose from for each impression on your video and ensures that the appropriate file serves based on the viewer’s connection and screen size. This field is only supported in following creative_type: * `CREATIVE_TYPE_VIDEO` * `CREATIVE_TYPE_NATIVE_VIDEO` * `CREATIVE_TYPE_AUDIO`
         */
        transcodes?: Schema$Transcode[];
        /**
         * Optional. An optional creative identifier provided by a registry that is unique across all platforms. Universal Ad ID is part of the VAST 4.0 standard. It can be modified after the creative is created. This field is only supported for the following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        universalAdId?: Schema$UniversalAdId;
        /**
         * Output only. The timestamp when the creative was last updated, either by the user or system (e.g. creative review). Assigned by the system.
         */
        updateTime?: string | null;
        /**
         * Optional. The URL of the VAST tag for a third-party VAST tag creative. Required and only valid for third-party VAST tag creatives. Third-party VAST tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_AUDIO` * `CREATIVE_TYPE_VIDEO`
         */
        vastTagUrl?: string | null;
        /**
         * Output only. Indicates the third-party VAST tag creative requires VPAID (Digital Video Player-Ad Interface). Output only and only valid for third-party VAST tag creatives. Third-party VAST tag creatives are creatives with following hosting_source: * `HOSTING_SOURCE_THIRD_PARTY` combined with following creative_type: * `CREATIVE_TYPE_VIDEO`
         */
        vpaid?: boolean | null;
    }
    /**
     * Creative requirements configuration for the inventory source.
     */
    export interface Schema$CreativeConfig {
        /**
         * The type of creative that can be assigned to the inventory source. Only the following types are supported: * `CREATIVE_TYPE_STANDARD` * `CREATIVE_TYPE_VIDEO`
         */
        creativeType?: string | null;
        /**
         * The configuration for display creatives. Applicable when creative_type is `CREATIVE_TYPE_STANDARD`.
         */
        displayCreativeConfig?: Schema$InventorySourceDisplayCreativeConfig;
        /**
         * The configuration for video creatives. Applicable when creative_type is `CREATIVE_TYPE_VIDEO`.
         */
        videoCreativeConfig?: Schema$InventorySourceVideoCreativeConfig;
    }
    /**
     * A single custom bidding algorithm.
     */
    export interface Schema$CustomBiddingAlgorithm {
        /**
         * Immutable. The unique ID of the advertiser that owns the custom bidding algorithm.
         */
        advertiserId?: string | null;
        /**
         * Output only. The unique ID of the custom bidding algorithm. Assigned by the system.
         */
        customBiddingAlgorithmId?: string | null;
        /**
         * Output only. The status of custom bidding algorithm.
         */
        customBiddingAlgorithmState?: string | null;
        /**
         * Required. Immutable. The type of custom bidding algorithm.
         */
        customBiddingAlgorithmType?: string | null;
        /**
         * Required. The display name of the custom bidding algorithm. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Controls whether or not the custom bidding algorithm can be used as a bidding strategy. Accepted values are: * `ENTITY_STATUS_ACTIVE` * `ENTITY_STATUS_ARCHIVED`
         */
        entityStatus?: string | null;
        /**
         * Output only. The state of custom bidding model readiness for each advertiser who has access. This field may only include the state of the queried advertiser if the algorithm [`owner`](/display-video/api/reference/rest/v1/customBiddingAlgorithms#CustomBiddingAlgorithm.FIELDS.oneof_owner) is a partner and is being retrieved using an advertiser [`accessor`](/display-video/api/reference/rest/v1/customBiddingAlgorithms/list#body.QUERY_PARAMETERS.oneof_accessor).
         */
        modelReadiness?: Schema$CustomBiddingModelReadinessState[];
        /**
         * Output only. The resource name of the custom bidding algorithm.
         */
        name?: string | null;
        /**
         * Immutable. The unique ID of the partner that owns the custom bidding algorithm.
         */
        partnerId?: string | null;
        /**
         * The IDs of the advertisers who have access to this algorithm. If advertiser_id is set, this field will only consist of that value. This field will not be set if the algorithm [`owner`](/display-video/api/reference/rest/v1/customBiddingAlgorithms#CustomBiddingAlgorithm.FIELDS.oneof_owner) is a partner and is being retrieved using an advertiser [`accessor`](/display-video/api/reference/rest/v1/customBiddingAlgorithms/list#body.QUERY_PARAMETERS.oneof_accessor).
         */
        sharedAdvertiserIds?: string[] | null;
    }
    /**
     * The custom bidding algorithm model readiness state for a single shared advertiser.
     */
    export interface Schema$CustomBiddingModelReadinessState {
        /**
         * The unique ID of the relevant advertiser.
         */
        advertiserId?: string | null;
        /**
         * The readiness state of custom bidding model.
         */
        readinessState?: string | null;
    }
    /**
     * A single custom bidding script.
     */
    export interface Schema$CustomBiddingScript {
        /**
         * Output only. Whether the script is currently being used for scoring by the parent algorithm.
         */
        active?: boolean | null;
        /**
         * Output only. The time when the script was created.
         */
        createTime?: string | null;
        /**
         * Output only. The unique ID of the custom bidding algorithm the script belongs to.
         */
        customBiddingAlgorithmId?: string | null;
        /**
         * Output only. The unique ID of the custom bidding script.
         */
        customBiddingScriptId?: string | null;
        /**
         * Output only. Error details of a rejected custom bidding script. This field will only be populated when state is REJECTED.
         */
        errors?: Schema$ScriptError[];
        /**
         * Output only. The resource name of the custom bidding script.
         */
        name?: string | null;
        /**
         * The reference to the uploaded script file.
         */
        script?: Schema$CustomBiddingScriptRef;
        /**
         * Output only. The state of the custom bidding script.
         */
        state?: string | null;
    }
    /**
     * The reference to the uploaded custom bidding script file.
     */
    export interface Schema$CustomBiddingScriptRef {
        /**
         * A resource name to be used in media.download to Download the script files. Or media.upload to Upload the script files. Resource names have the format `customBiddingAlgorithms/{custom_bidding_algorithm_id\}/scriptRef/{ref_id\}`.
         */
        resourceName?: string | null;
    }
    /**
     * Describes a custom list entity, such as a custom affinity or custom intent audience list.
     */
    export interface Schema$CustomList {
        /**
         * Output only. The unique ID of the custom list. Assigned by the system.
         */
        customListId?: string | null;
        /**
         * Output only. The display name of the custom list. .
         */
        displayName?: string | null;
        /**
         * Output only. The resource name of the custom list.
         */
        name?: string | null;
    }
    /**
     * Details of custom list group. All custom list targeting settings are logically ‘OR’ of each other.
     */
    export interface Schema$CustomListGroup {
        /**
         * Required. All custom list targeting settings in custom list group. Repeated settings with same id will be ignored.
         */
        settings?: Schema$CustomListTargetingSetting[];
    }
    /**
     * Details of custom list targeting setting.
     */
    export interface Schema$CustomListTargetingSetting {
        /**
         * Required. Custom id of custom list targeting setting. This id is custom_list_id.
         */
        customListId?: string | null;
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
     * A date range.
     */
    export interface Schema$DateRange {
        /**
         * The upper bound of the date range, inclusive. Must specify a positive value for `year`, `month`, and `day`.
         */
        endDate?: Schema$Date;
        /**
         * The lower bound of the date range, inclusive. Must specify a positive value for `year`, `month`, and `day`.
         */
        startDate?: Schema$Date;
    }
    /**
     * Representation of a segment of time defined on a specific day of the week and with a start and end time. The time represented by `start_hour` must be before the time represented by `end_hour`.
     */
    export interface Schema$DayAndTimeAssignedTargetingOptionDetails {
        /**
         * Required. The day of the week for this day and time targeting setting.
         */
        dayOfWeek?: string | null;
        /**
         * Required. The end hour for day and time targeting. Must be between 1 (1 hour after start of day) and 24 (end of day).
         */
        endHour?: number | null;
        /**
         * Required. The start hour for day and time targeting. Must be between 0 (start of day) and 23 (1 hour before end of day).
         */
        startHour?: number | null;
        /**
         * Required. The mechanism used to determine which timezone to use for this day and time targeting setting.
         */
        timeZoneResolution?: string | null;
    }
    /**
     * Request message for ManualTriggerService.DeactivateManualTrigger.
     */
    export interface Schema$DeactivateManualTriggerRequest {
    }
    /**
     * A request listing which assigned targeting options of a given targeting type should be deleted.
     */
    export interface Schema$DeleteAssignedTargetingOptionsRequest {
        /**
         * Required. The assigned targeting option IDs to delete.
         */
        assignedTargetingOptionIds?: string[] | null;
        /**
         * Required. Identifies the type of this assigned targeting option.
         */
        targetingType?: string | null;
    }
    /**
     * Assigned device make and model targeting option details. This will be populated in the device_make_model_details field when targeting_type is `TARGETING_TYPE_DEVICE_MAKE_MODEL`.
     */
    export interface Schema$DeviceMakeModelAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the device make and model.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_DEVICE_MAKE_MODEL`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable device make and model. This will be populated in the device_make_model_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_DEVICE_MAKE_MODEL`.
     */
    export interface Schema$DeviceMakeModelTargetingOptionDetails {
        /**
         * Output only. The display name of the device make and model.
         */
        displayName?: string | null;
    }
    /**
     * Targeting details for device type. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_DEVICE_TYPE`.
     */
    export interface Schema$DeviceTypeAssignedTargetingOptionDetails {
        /**
         * Required. The display name of the device type.
         */
        deviceType?: string | null;
        /**
         * Required. ID of the device type.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable device type. This will be populated in the device_type_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_DEVICE_TYPE`.
     */
    export interface Schema$DeviceTypeTargetingOptionDetails {
        /**
         * Output only. The device type that is used to be targeted.
         */
        deviceType?: string | null;
    }
    /**
     * Targeting details for digital content label. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION`.
     */
    export interface Schema$DigitalContentLabelAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the digital content label rating tier.
         */
        contentRatingTier?: string | null;
        /**
         * Required. ID of the digital content label to be EXCLUDED.
         */
        excludedTargetingOptionId?: string | null;
    }
    /**
     * Represents a targetable digital content label rating tier. This will be populated in the digital_content_label_details field of the TargetingOption when targeting_type is `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION`.
     */
    export interface Schema$DigitalContentLabelTargetingOptionDetails {
        /**
         * Output only. An enum for the content label brand safety tiers.
         */
        contentRatingTier?: string | null;
    }
    /**
     * Dimensions.
     */
    export interface Schema$Dimensions {
        /**
         * The height in pixels.
         */
        heightPixels?: number | null;
        /**
         * The width in pixels.
         */
        widthPixels?: number | null;
    }
    /**
     * Details of DoubleVerify settings.
     */
    export interface Schema$DoubleVerify {
        /**
         * Avoid bidding on apps with the star ratings.
         */
        appStarRating?: Schema$DoubleVerifyAppStarRating;
        /**
         * Avoid bidding on apps with the age rating.
         */
        avoidedAgeRatings?: string[] | null;
        /**
         * DV Brand Safety Controls.
         */
        brandSafetyCategories?: Schema$DoubleVerifyBrandSafetyCategories;
        /**
         * The custom segment ID provided by DoubleVerify. The ID must start with "51" and consist of eight digits. Custom segment ID cannot be specified along with any of the following fields: * brand_safety_categories * avoided_age_ratings * app_star_rating * fraud_invalid_traffic
         */
        customSegmentId?: string | null;
        /**
         * Display viewability settings (applicable to display line items only).
         */
        displayViewability?: Schema$DoubleVerifyDisplayViewability;
        /**
         * Avoid Sites and Apps with historical Fraud & IVT Rates.
         */
        fraudInvalidTraffic?: Schema$DoubleVerifyFraudInvalidTraffic;
        /**
         * Video viewability settings (applicable to video line items only).
         */
        videoViewability?: Schema$DoubleVerifyVideoViewability;
    }
    /**
     * Details of DoubleVerify star ratings settings.
     */
    export interface Schema$DoubleVerifyAppStarRating {
        /**
         * Avoid bidding on apps with the star ratings.
         */
        avoidedStarRating?: string | null;
        /**
         * Avoid bidding on apps with insufficient star ratings.
         */
        avoidInsufficientStarRating?: boolean | null;
    }
    /**
     * Settings for brand safety controls.
     */
    export interface Schema$DoubleVerifyBrandSafetyCategories {
        /**
         * Brand safety high severity avoidance categories.
         */
        avoidedHighSeverityCategories?: string[] | null;
        /**
         * Brand safety medium severity avoidance categories.
         */
        avoidedMediumSeverityCategories?: string[] | null;
        /**
         * Unknown or unrateable.
         */
        avoidUnknownBrandSafetyCategory?: boolean | null;
    }
    /**
     * Details of DoubleVerify display viewability settings.
     */
    export interface Schema$DoubleVerifyDisplayViewability {
        /**
         * Target web and app inventory to maximize IAB viewable rate.
         */
        iab?: string | null;
        /**
         * Target web and app inventory to maximize 100% viewable duration.
         */
        viewableDuring?: string | null;
    }
    /**
     * DoubleVerify Fraud & Invalid Traffic settings.
     */
    export interface Schema$DoubleVerifyFraudInvalidTraffic {
        /**
         * Avoid Sites and Apps with historical Fraud & IVT.
         */
        avoidedFraudOption?: string | null;
        /**
         * Insufficient Historical Fraud & IVT Stats.
         */
        avoidInsufficientOption?: boolean | null;
    }
    /**
     * Details of DoubleVerify video viewability settings.
     */
    export interface Schema$DoubleVerifyVideoViewability {
        /**
         * Target inventory to maximize impressions with 400x300 or greater player size.
         */
        playerImpressionRate?: string | null;
        /**
         * Target web inventory to maximize IAB viewable rate.
         */
        videoIab?: string | null;
        /**
         * Target web inventory to maximize fully viewable rate.
         */
        videoViewableRate?: string | null;
    }
    /**
     * Request message for FirstAndThirdPartyAudienceService.EditCustomerMatchMembers.
     */
    export interface Schema$EditCustomerMatchMembersRequest {
        /**
         * Input only. A list of contact information to define the members to be added.
         */
        addedContactInfoList?: Schema$ContactInfoList;
        /**
         * Input only. A list of mobile device IDs to define the members to be added.
         */
        addedMobileDeviceIdList?: Schema$MobileDeviceIdList;
        /**
         * Required. The ID of the owner advertiser of the updated Customer Match FirstAndThirdPartyAudience.
         */
        advertiserId?: string | null;
    }
    /**
     * The response of FirstAndThirdPartyAudienceService.EditCustomerMatchMembers.
     */
    export interface Schema$EditCustomerMatchMembersResponse {
        /**
         * Required. The ID of the updated Customer Match FirstAndThirdPartyAudience.
         */
        firstAndThirdPartyAudienceId?: string | null;
    }
    /**
     * Request message for GuaranteedOrderService.EditGuaranteedOrderReadAccessors.
     */
    export interface Schema$EditGuaranteedOrderReadAccessorsRequest {
        /**
         * The advertisers to add as read accessors to the guaranteed order.
         */
        addedAdvertisers?: string[] | null;
        /**
         * Required. The partner context in which the change is being made.
         */
        partnerId?: string | null;
        /**
         * Whether to give all advertisers of the read/write accessor partner read access to the guaranteed order. Only applicable if read_write_partner_id is set in the guaranteed order.
         */
        readAccessInherited?: boolean | null;
        /**
         * The advertisers to remove as read accessors to the guaranteed order.
         */
        removedAdvertisers?: string[] | null;
    }
    export interface Schema$EditGuaranteedOrderReadAccessorsResponse {
        /**
         * Whether all advertisers of read_write_partner_id have read access to the guaranteed order.
         */
        readAccessInherited?: boolean | null;
        /**
         * The IDs of advertisers with read access to the guaranteed order.
         */
        readAdvertiserIds?: string[] | null;
    }
    /**
     * Request message for InventorySourceService.EditInventorySourceReadWriteAccessors.
     */
    export interface Schema$EditInventorySourceReadWriteAccessorsRequest {
        /**
         * The advertisers to add or remove from the list of advertisers that have read/write access to the inventory source. This change will remove an existing partner read/write accessor.
         */
        advertisersUpdate?: Schema$EditInventorySourceReadWriteAccessorsRequestAdvertisersUpdate;
        /**
         * Set the partner context as read/write accessor of the inventory source. This will remove all other current read/write advertiser accessors.
         */
        assignPartner?: boolean | null;
        /**
         * Required. The partner context by which the accessors change is being made.
         */
        partnerId?: string | null;
    }
    /**
     * Update to the list of advertisers with read/write access to the inventory source.
     */
    export interface Schema$EditInventorySourceReadWriteAccessorsRequestAdvertisersUpdate {
        /**
         * The advertisers to add.
         */
        addedAdvertisers?: string[] | null;
        /**
         * The advertisers to remove.
         */
        removedAdvertisers?: string[] | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Assigned environment targeting option details. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_ENVIRONMENT`.
     */
    export interface Schema$EnvironmentAssignedTargetingOptionDetails {
        /**
         * Required. The serving environment.
         */
        environment?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_ENVIRONMENT` (e.g., "508010" for targeting the `ENVIRONMENT_WEB_OPTIMIZED` option).
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable environment. This will be populated in the environment_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_ENVIRONMENT`.
     */
    export interface Schema$EnvironmentTargetingOptionDetails {
        /**
         * Output only. The serving environment.
         */
        environment?: string | null;
    }
    /**
     * Details for assigned exchange targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_EXCHANGE`.
     */
    export interface Schema$ExchangeAssignedTargetingOptionDetails {
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_EXCHANGE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Settings that control which exchanges are enabled for a partner.
     */
    export interface Schema$ExchangeConfig {
        /**
         * All enabled exchanges in the partner. Duplicate enabled exchanges will be ignored.
         */
        enabledExchanges?: Schema$ExchangeConfigEnabledExchange[];
    }
    /**
     * An enabled exchange in the partner.
     */
    export interface Schema$ExchangeConfigEnabledExchange {
        /**
         * The enabled exchange.
         */
        exchange?: string | null;
        /**
         * Output only. Agency ID of Google Ad Manager. The field is only relevant when Google Ad Manager is the enabled exchange.
         */
        googleAdManagerAgencyId?: string | null;
        /**
         * Output only. Network ID of Google Ad Manager. The field is only relevant when Google Ad Manager is the enabled exchange.
         */
        googleAdManagerBuyerNetworkId?: string | null;
        /**
         * Output only. Seat ID of the enabled exchange.
         */
        seatId?: string | null;
    }
    /**
     * Exchange review status for the creative.
     */
    export interface Schema$ExchangeReviewStatus {
        /**
         * The exchange reviewing the creative.
         */
        exchange?: string | null;
        /**
         * Status of the exchange review.
         */
        status?: string | null;
    }
    /**
     * Represents a targetable exchange. This will be populated in the exchange_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_EXCHANGE`.
     */
    export interface Schema$ExchangeTargetingOptionDetails {
        /**
         * Output only. The type of exchange.
         */
        exchange?: string | null;
    }
    /**
     * Exit event of the creative.
     */
    export interface Schema$ExitEvent {
        /**
         * The name of the click tag of the exit event. The name must be unique within one creative. Leave it empty or unset for creatives containing image assets only.
         */
        name?: string | null;
        /**
         * The name used to identify this event in reports. Leave it empty or unset for creatives containing image assets only.
         */
        reportingName?: string | null;
        /**
         * Required. The type of the exit event.
         */
        type?: string | null;
        /**
         * Required. The click through URL of the exit event. This is required when type is: * `EXIT_EVENT_TYPE_DEFAULT` * `EXIT_EVENT_TYPE_BACKUP`
         */
        url?: string | null;
    }
    /**
     * Describes a first or third party audience list used for targeting. First party audiences are created via usage of client data. Third party audiences are provided by Third Party data providers and can only be licensed to customers.
     */
    export interface Schema$FirstAndThirdPartyAudience {
        /**
         * Output only. The estimated audience size for the Display network in the past month. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only returned in GET request.
         */
        activeDisplayAudienceSize?: string | null;
        /**
         * The app_id matches with the type of the mobile_device_ids being uploaded. Only applicable to audience_type `CUSTOMER_MATCH_DEVICE_ID`
         */
        appId?: string | null;
        /**
         * Output only. The source of the audience.
         */
        audienceSource?: string | null;
        /**
         * The type of the audience.
         */
        audienceType?: string | null;
        /**
         * Input only. A list of contact information to define the initial audience members. Only applicable to audience_type `CUSTOMER_MATCH_CONTACT_INFO`
         */
        contactInfoList?: Schema$ContactInfoList;
        /**
         * The user-provided description of the audience. Only applicable to first party audiences.
         */
        description?: string | null;
        /**
         * Output only. The estimated audience size for the Display network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only returned in GET request.
         */
        displayAudienceSize?: string | null;
        /**
         * Output only. The estimated desktop audience size in Display network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only applicable to first party audiences. Only returned in GET request.
         */
        displayDesktopAudienceSize?: string | null;
        /**
         * Output only. The estimated mobile app audience size in Display network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only applicable to first party audiences. Only returned in GET request.
         */
        displayMobileAppAudienceSize?: string | null;
        /**
         * Output only. The estimated mobile web audience size in Display network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only applicable to first party audiences. Only returned in GET request.
         */
        displayMobileWebAudienceSize?: string | null;
        /**
         * The display name of the first and third party audience.
         */
        displayName?: string | null;
        /**
         * Output only. The unique ID of the first and third party audience. Assigned by the system.
         */
        firstAndThirdPartyAudienceId?: string | null;
        /**
         * Whether the audience is a first or third party audience.
         */
        firstAndThirdPartyAudienceType?: string | null;
        /**
         * Output only. The estimated audience size for Gmail network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only applicable to first party audiences. Only returned in GET request.
         */
        gmailAudienceSize?: string | null;
        /**
         * The duration in days that an entry remains in the audience after the qualifying event. If the audience has no expiration, set the value of this field to 10000. Otherwise, the set value must be greater than 0 and less than or equal to 540. Only applicable to first party audiences. This field is required if one of the following audience_type is used: * `CUSTOMER_MATCH_CONTACT_INFO` * `CUSTOMER_MATCH_DEVICE_ID`
         */
        membershipDurationDays?: string | null;
        /**
         * Input only. A list of mobile device IDs to define the initial audience members. Only applicable to audience_type `CUSTOMER_MATCH_DEVICE_ID`
         */
        mobileDeviceIdList?: Schema$MobileDeviceIdList;
        /**
         * Output only. The resource name of the first and third party audience.
         */
        name?: string | null;
        /**
         * Output only. The estimated audience size for YouTube network. If the size is less than 1000, the number will be hidden and 0 will be returned due to privacy reasons. Otherwise, the number will be rounded off to two significant digits. Only applicable to first party audiences. Only returned in GET request.
         */
        youtubeAudienceSize?: string | null;
    }
    /**
     * Details of first and third party audience group. All first and third party audience targeting settings are logically ‘OR’ of each other.
     */
    export interface Schema$FirstAndThirdPartyAudienceGroup {
        /**
         * Required. All first and third party audience targeting settings in first and third party audience group. Repeated settings with same id are not allowed.
         */
        settings?: Schema$FirstAndThirdPartyAudienceTargetingSetting[];
    }
    /**
     * Details of first and third party audience targeting setting.
     */
    export interface Schema$FirstAndThirdPartyAudienceTargetingSetting {
        /**
         * Required. First and third party audience id of the first and third party audience targeting setting. This id is first_and_third_party_audience_id.
         */
        firstAndThirdPartyAudienceId?: string | null;
        /**
         * The recency of the first and third party audience targeting setting. Only applicable to first party audiences, otherwise will be ignored. For more info, refer to https://support.google.com/displayvideo/answer/2949947#recency When unspecified, no recency limit will be used.
         */
        recency?: string | null;
    }
    /**
     * A strategy that uses a fixed bidding price.
     */
    export interface Schema$FixedBidStrategy {
        /**
         * The fixed bid amount, in micros of the advertiser's currency. For insertion order entity, bid_amount_micros should be set as 0. For line item entity, bid_amount_micros must be greater than or equal to billable unit of the given currency and smaller than or equal to the upper limit 1000000000. For example, 1500000 represents 1.5 standard units of the currency.
         */
        bidAmountMicros?: string | null;
    }
    /**
     * A single Floodlight group.
     */
    export interface Schema$FloodlightGroup {
        /**
         * The Active View video viewability metric configuration for the Floodlight group.
         */
        activeViewConfig?: Schema$ActiveViewVideoViewabilityMetricConfig;
        /**
         * User-defined custom variables owned by the Floodlight group. Use custom Floodlight variables to create reporting data that is tailored to your unique business needs. Custom Floodlight variables use the keys `U1=`, `U2=`, and so on, and can take any values that you choose to pass to them. You can use them to track virtually any type of data that you collect about your customers, such as the genre of movie that a customer purchases, the country to which the item is shipped, and so on. Custom Floodlight variables may not be used to pass any data that could be used or recognized as personally identifiable information (PII). Example: `custom_variables { fields { "U1": value { number_value: 123.4 \}, "U2": value { string_value: "MyVariable2" \}, "U3": value { string_value: "MyVariable3" \} \} \}` Acceptable values for keys are "U1" through "U100", inclusive. String values must be less than 64 characters long, and cannot contain the following characters: `"<\>`.
         */
        customVariables?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The display name of the Floodlight group.
         */
        displayName?: string | null;
        /**
         * Output only. The unique ID of the Floodlight group. Assigned by the system.
         */
        floodlightGroupId?: string | null;
        /**
         * Required. The lookback window for the Floodlight group. Both click_days and impression_days are required. Acceptable values for both are `0` to `90`, inclusive.
         */
        lookbackWindow?: Schema$LookbackWindow;
        /**
         * Output only. The resource name of the Floodlight group.
         */
        name?: string | null;
        /**
         * Required. The web tag type enabled for the Floodlight group.
         */
        webTagType?: string | null;
    }
    /**
     * Settings that control the number of times a user may be shown with the same ad during a given time period.
     */
    export interface Schema$FrequencyCap {
        /**
         * The maximum number of times a user may be shown the same ad during this period. Must be greater than 0. Required when unlimited is `false` and max_views is not set.
         */
        maxImpressions?: number | null;
        /**
         * The time unit in which the frequency cap will be applied. Required when unlimited is `false`.
         */
        timeUnit?: string | null;
        /**
         * The number of time_unit the frequency cap will last. Required when unlimited is `false`. The following restrictions apply based on the value of time_unit: * `TIME_UNIT_LIFETIME` - this field is output only and will default to 1 * `TIME_UNIT_MONTHS` - must be between 1 and 2 * `TIME_UNIT_WEEKS` - must be between 1 and 4 * `TIME_UNIT_DAYS` - must be between 1 and 6 * `TIME_UNIT_HOURS` - must be between 1 and 23 * `TIME_UNIT_MINUTES` - must be between 1 and 59
         */
        timeUnitCount?: number | null;
        /**
         * Whether unlimited frequency capping is applied. When this field is set to `true`, the remaining frequency cap fields are not applicable.
         */
        unlimited?: boolean | null;
    }
    /**
     * Details for assigned gender targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_GENDER`.
     */
    export interface Schema$GenderAssignedTargetingOptionDetails {
        /**
         * Required. The gender of the audience.
         */
        gender?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_GENDER`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable gender. This will be populated in the gender_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_GENDER`.
     */
    export interface Schema$GenderTargetingOptionDetails {
        /**
         * Output only. The gender of an audience.
         */
        gender?: string | null;
    }
    /**
     * Request message for LineItemService.GenerateDefaultLineItem.
     */
    export interface Schema$GenerateDefaultLineItemRequest {
        /**
         * Required. The display name of the line item. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. The unique ID of the insertion order that the line item belongs to.
         */
        insertionOrderId?: string | null;
        /**
         * Required. The type of the line item.
         */
        lineItemType?: string | null;
        /**
         * The mobile app promoted by the line item. This is applicable only when line_item_type is either `LINE_ITEM_TYPE_DISPLAY_MOBILE_APP_INSTALL` or `LINE_ITEM_TYPE_VIDEO_MOBILE_APP_INSTALL`.
         */
        mobileApp?: Schema$MobileApp;
    }
    /**
     * Details for assigned geographic region targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_GEO_REGION`.
     */
    export interface Schema$GeoRegionAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the geographic region (e.g., "Ontario, Canada").
         */
        displayName?: string | null;
        /**
         * Output only. The type of geographic region targeting.
         */
        geoRegionType?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_GEO_REGION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Search terms for geo region targeting options.
     */
    export interface Schema$GeoRegionSearchTerms {
        /**
         * The search query for the desired geo region. The query can be a prefix, e.g. "New Yor", "Seattle", "USA", etc.
         */
        geoRegionQuery?: string | null;
    }
    /**
     * Represents a targetable geographic region. This will be populated in the geo_region_details field when targeting_type is `TARGETING_TYPE_GEO_REGION`.
     */
    export interface Schema$GeoRegionTargetingOptionDetails {
        /**
         * Output only. The display name of the geographic region (e.g., "Ontario, Canada").
         */
        displayName?: string | null;
        /**
         * Output only. The type of geographic region targeting.
         */
        geoRegionType?: string | null;
    }
    /**
     * Describes a Google audience resource. Includes Google audience lists.
     */
    export interface Schema$GoogleAudience {
        /**
         * Output only. The display name of the Google audience. .
         */
        displayName?: string | null;
        /**
         * Output only. The unique ID of the Google audience. Assigned by the system.
         */
        googleAudienceId?: string | null;
        /**
         * Output only. The type of Google audience. .
         */
        googleAudienceType?: string | null;
        /**
         * Output only. The resource name of the google audience.
         */
        name?: string | null;
    }
    /**
     * Details of Google audience group. All Google audience targeting settings are logically ‘OR’ of each other.
     */
    export interface Schema$GoogleAudienceGroup {
        /**
         * Required. All Google audience targeting settings in Google audience group. Repeated settings with same id will be ignored.
         */
        settings?: Schema$GoogleAudienceTargetingSetting[];
    }
    /**
     * Details of Google audience targeting setting.
     */
    export interface Schema$GoogleAudienceTargetingSetting {
        /**
         * Required. Google audience id of the Google audience targeting setting. This id is google_audience_id.
         */
        googleAudienceId?: string | null;
    }
    /**
     * Media resource.
     */
    export interface Schema$GoogleBytestreamMedia {
        /**
         * Name of the media resource.
         */
        resourceName?: string | null;
    }
    /**
     * A guaranteed order. Guaranteed orders are parent entity of guaranteed inventory sources. When creating a guaranteed inventory source, a guaranteed order ID must be assigned to the inventory source.
     */
    export interface Schema$GuaranteedOrder {
        /**
         * Output only. The ID of default advertiser of the guaranteed order. The default advertiser is either the read_write_advertiser_id or, if that is not set, the first advertiser listed in read_advertiser_ids. Otherwise, there is no default advertiser.
         */
        defaultAdvertiserId?: string | null;
        /**
         * The ID of the default campaign that is assigned to the guaranteed order. The default campaign must belong to the default advertiser.
         */
        defaultCampaignId?: string | null;
        /**
         * Required. The display name of the guaranteed order. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Immutable. The exchange where the guaranteed order originated.
         */
        exchange?: string | null;
        /**
         * Output only. The unique identifier of the guaranteed order. The guaranteed order IDs have the format `{exchange\}-{legacy_guaranteed_order_id\}`.
         */
        guaranteedOrderId?: string | null;
        /**
         * Output only. The legacy ID of the guaranteed order. Assigned by the original exchange. The legacy ID is unique within one exchange, but is not guaranteed to be unique across all guaranteed orders. This ID is used in SDF and UI.
         */
        legacyGuaranteedOrderId?: string | null;
        /**
         * Output only. The resource name of the guaranteed order.
         */
        name?: string | null;
        /**
         * Required. The publisher name of the guaranteed order. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        publisherName?: string | null;
        /**
         * Whether all advertisers of read_write_partner_id have read access to the guaranteed order. Only applicable if read_write_partner_id is set. If True, overrides read_advertiser_ids.
         */
        readAccessInherited?: boolean | null;
        /**
         * The IDs of advertisers with read access to the guaranteed order. This field must not include the advertiser assigned to read_write_advertiser_id if it is set. All advertisers in this field must belong to read_write_partner_id or the same partner as read_write_advertiser_id.
         */
        readAdvertiserIds?: string[] | null;
        /**
         * The advertiser with read/write access to the guaranteed order. This is also the default advertiser of the guaranteed order.
         */
        readWriteAdvertiserId?: string | null;
        /**
         * The partner with read/write access to the guaranteed order.
         */
        readWritePartnerId?: string | null;
        /**
         * The status settings of the guaranteed order.
         */
        status?: Schema$GuaranteedOrderStatus;
        /**
         * Output only. The timestamp when the guaranteed order was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * The status settings of the guaranteed order.
     */
    export interface Schema$GuaranteedOrderStatus {
        /**
         * Output only. The configuration status of the guaranteed order. Acceptable values are `PENDING` and `COMPLETED`. A guaranteed order must be configured (fill in the required fields, choose creatives, and select a default campaign) before it can serve. Currently the configuration action can only be performed via UI.
         */
        configStatus?: string | null;
        /**
         * The user-provided reason for pausing this guaranteed order. Must be UTF-8 encoded with a maximum length of 100 bytes. Only applicable when entity_status is set to `ENTITY_STATUS_PAUSED`.
         */
        entityPauseReason?: string | null;
        /**
         * Whether or not the guaranteed order is servable. Acceptable values are `ENTITY_STATUS_ACTIVE`, `ENTITY_STATUS_ARCHIVED`, and `ENTITY_STATUS_PAUSED`. Default value is `ENTITY_STATUS_ACTIVE`.
         */
        entityStatus?: string | null;
    }
    /**
     * Details for assigned household income targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_HOUSEHOLD_INCOME`.
     */
    export interface Schema$HouseholdIncomeAssignedTargetingOptionDetails {
        /**
         * Required. The household income of the audience.
         */
        householdIncome?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_HOUSEHOLD_INCOME`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable household income. This will be populated in the household_income_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_HOUSEHOLD_INCOME`.
     */
    export interface Schema$HouseholdIncomeTargetingOptionDetails {
        /**
         * Output only. The household income of an audience.
         */
        householdIncome?: string | null;
    }
    /**
     * A filtering option that filters entities by their entity IDs.
     */
    export interface Schema$IdFilter {
        /**
         * YouTube Ads to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        adGroupAdIds?: string[] | null;
        /**
         * YouTube Ad Groups to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        adGroupIds?: string[] | null;
        /**
         * Campaigns to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        campaignIds?: string[] | null;
        /**
         * Insertion Orders to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        insertionOrderIds?: string[] | null;
        /**
         * Line Items to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        lineItemIds?: string[] | null;
        /**
         * Media Products to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest.
         */
        mediaProductIds?: string[] | null;
    }
    /**
     * A single insertion order.
     */
    export interface Schema$InsertionOrder {
        /**
         * Output only. The unique ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string | null;
        /**
         * The bidding strategy of the insertion order. By default, fixed_bid is set.
         */
        bidStrategy?: Schema$BiddingStrategy;
        /**
         * Immutable. The billable outcome of the insertion order. Outcome based buying is deprecated. `BILLABLE_OUTCOME_PAY_PER_IMPRESSION` is the only valid value.
         */
        billableOutcome?: string | null;
        /**
         * Required. The budget allocation settings of the insertion order.
         */
        budget?: Schema$InsertionOrderBudget;
        /**
         * Required. Immutable. The unique ID of the campaign that the insertion order belongs to.
         */
        campaignId?: string | null;
        /**
         * Required. The display name of the insertion order. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Controls whether or not the insertion order can spend its budget and bid on inventory. * For CreateInsertionOrder method, only `ENTITY_STATUS_DRAFT` is allowed. To activate an insertion order, use UpdateInsertionOrder method and update the status to `ENTITY_STATUS_ACTIVE` after creation. * An insertion order cannot be changed back to `ENTITY_STATUS_DRAFT` status from any other status. * An insertion order cannot be set to `ENTITY_STATUS_ACTIVE` if its parent campaign is not active.
         */
        entityStatus?: string | null;
        /**
         * Required. The frequency capping setting of the insertion order.
         */
        frequencyCap?: Schema$FrequencyCap;
        /**
         * Output only. The unique ID of the insertion order. Assigned by the system.
         */
        insertionOrderId?: string | null;
        /**
         * The type of insertion order. If this field is unspecified in creation, the value defaults to `RTB`.
         */
        insertionOrderType?: string | null;
        /**
         * Additional integration details of the insertion order.
         */
        integrationDetails?: Schema$IntegrationDetails;
        /**
         * Output only. The resource name of the insertion order.
         */
        name?: string | null;
        /**
         * Required. The budget spending speed setting of the insertion order.
         */
        pacing?: Schema$Pacing;
        /**
         * The partner costs associated with the insertion order. If absent or empty in CreateInsertionOrder method, the newly created insertion order will inherit partner costs from the partner settings.
         */
        partnerCosts?: Schema$PartnerCost[];
        /**
         * Required. Performance goal of the insertion order.
         */
        performanceGoal?: Schema$PerformanceGoal;
        /**
         * Output only. The reservation type of the insertion order.
         */
        reservationType?: string | null;
        /**
         * Output only. The timestamp when the insertion order was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * Settings that control how insertion order budget is allocated.
     */
    export interface Schema$InsertionOrderBudget {
        /**
         * The type of automation used to manage bid and budget for the insertion order. If this field is unspecified in creation, the value defaults to `INSERTION_ORDER_AUTOMATION_TYPE_NONE`.
         */
        automationType?: string | null;
        /**
         * Required. The list of budget segments. Use a budget segment to specify a specific budget for a given period of time an insertion order is running.
         */
        budgetSegments?: Schema$InsertionOrderBudgetSegment[];
        /**
         * Required. Immutable. The budget unit specifies whether the budget is currency based or impression based.
         */
        budgetUnit?: string | null;
    }
    /**
     * Settings that control the budget of a single budget segment.
     */
    export interface Schema$InsertionOrderBudgetSegment {
        /**
         * Required. The budget amount the insertion order will spend for the given date_range. The amount is in micros. Must be greater than 0. For example, 500000000 represents 500 standard units of the currency.
         */
        budgetAmountMicros?: string | null;
        /**
         * The budget_id of the campaign budget that this insertion order budget segment is a part of.
         */
        campaignBudgetId?: string | null;
        /**
         * Required. The start and end date settings of the budget segment. They are resolved relative to the parent advertiser's time zone. * When creating a new budget segment, both `start_date` and `end_date` must be in the future. * An existing budget segment with a `start_date` in the past has a mutable `end_date` but an immutable `start_date`. * `end_date` must be the `start_date` or later, both before the year 2037.
         */
        dateRange?: Schema$DateRange;
        /**
         * The budget segment description. It can be used to enter Purchase Order information for each budget segment and have that information printed on the invoices. Must be UTF-8 encoded.
         */
        description?: string | null;
    }
    /**
     * Details of Integral Ad Science settings.
     */
    export interface Schema$IntegralAdScience {
        /**
         * The custom segment ID provided by Integral Ad Science. The ID must be between `1000001` and `1999999`, inclusive.
         */
        customSegmentId?: string[] | null;
        /**
         * Display Viewability section (applicable to display line items only).
         */
        displayViewability?: string | null;
        /**
         * Ad Fraud settings.
         */
        excludedAdFraudRisk?: string | null;
        /**
         * Brand Safety - **Adult content**.
         */
        excludedAdultRisk?: string | null;
        /**
         * Brand Safety - **Alcohol**.
         */
        excludedAlcoholRisk?: string | null;
        /**
         * Brand Safety - **Drugs**.
         */
        excludedDrugsRisk?: string | null;
        /**
         * Brand Safety - **Gambling**.
         */
        excludedGamblingRisk?: string | null;
        /**
         * Brand Safety - **Hate speech**.
         */
        excludedHateSpeechRisk?: string | null;
        /**
         * Brand Safety - **Illegal downloads**.
         */
        excludedIllegalDownloadsRisk?: string | null;
        /**
         * Brand Safety - **Offensive language**.
         */
        excludedOffensiveLanguageRisk?: string | null;
        /**
         * Brand Safety - **Violence**.
         */
        excludedViolenceRisk?: string | null;
        /**
         * Brand Safety - **Unrateable**.
         */
        excludeUnrateable?: boolean | null;
        /**
         * True advertising quality (applicable to Display line items only).
         */
        traqScoreOption?: string | null;
        /**
         * Video Viewability Section (applicable to video line items only).
         */
        videoViewability?: string | null;
    }
    /**
     * Integration details of an entry.
     */
    export interface Schema$IntegrationDetails {
        /**
         * Additional details of the entry in string format. Must be UTF-8 encoded with a length of no more than 1000 characters.
         */
        details?: string | null;
        /**
         * An external identifier to be associated with the entry. The integration code will show up together with the entry in many places in the system, for example, reporting. Must be UTF-8 encoded with a length of no more than 500 characters.
         */
        integrationCode?: string | null;
    }
    /**
     * An inventory source.
     */
    export interface Schema$InventorySource {
        /**
         * Whether the inventory source has a guaranteed or non-guaranteed delivery.
         */
        commitment?: string | null;
        /**
         * The creative requirements of the inventory source. Not applicable for auction packages.
         */
        creativeConfigs?: Schema$CreativeConfig[];
        /**
         * The ID in the exchange space that uniquely identifies the inventory source. Must be unique across buyers within each exchange but not necessarily unique across exchanges.
         */
        dealId?: string | null;
        /**
         * The delivery method of the inventory source. * For non-guaranteed inventory sources, the only acceptable value is `INVENTORY_SOURCE_DELIVERY_METHOD_PROGRAMMATIC`. * For guaranteed inventory sources, acceptable values are `INVENTORY_SOURCE_DELIVERY_METHOD_TAG` and `INVENTORY_SOURCE_DELIVERY_METHOD_PROGRAMMATIC`.
         */
        deliveryMethod?: string | null;
        /**
         * The display name of the inventory source. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * The exchange to which the inventory source belongs.
         */
        exchange?: string | null;
        /**
         * Immutable. The ID of the guaranteed order that this inventory source belongs to. Only applicable when commitment is `INVENTORY_SOURCE_COMMITMENT_GUARANTEED`.
         */
        guaranteedOrderId?: string | null;
        /**
         * Output only. The unique ID of the inventory source. Assigned by the system.
         */
        inventorySourceId?: string | null;
        /**
         * Output only. The product type of the inventory source, denoting the way through which it sells inventory.
         */
        inventorySourceProductType?: string | null;
        /**
         * Denotes the type of the inventory source.
         */
        inventorySourceType?: string | null;
        /**
         * Output only. The resource name of the inventory source.
         */
        name?: string | null;
        /**
         * The publisher/seller name of the inventory source.
         */
        publisherName?: string | null;
        /**
         * Required. The rate details of the inventory source.
         */
        rateDetails?: Schema$RateDetails;
        /**
         * Output only. The IDs of advertisers with read-only access to the inventory source.
         */
        readAdvertiserIds?: string[] | null;
        /**
         * Output only. The IDs of partners with read-only access to the inventory source. All advertisers of partners in this field inherit read-only access to the inventory source.
         */
        readPartnerIds?: string[] | null;
        /**
         * The partner or advertisers that have read/write access to the inventory source. Output only when commitment is `INVENTORY_SOURCE_COMMITMENT_GUARANTEED`, in which case the read/write accessors are inherited from the parent guaranteed order. Required when commitment is `INVENTORY_SOURCE_COMMITMENT_NON_GUARANTEED`. If commitment is `INVENTORY_SOURCE_COMMITMENT_NON_GUARANTEED` and a partner is set in this field, all advertisers under this partner will automatically have read-only access to the inventory source. These advertisers will not be included in read_advertiser_ids.
         */
        readWriteAccessors?: Schema$InventorySourceAccessors;
        /**
         * The status settings of the inventory source.
         */
        status?: Schema$InventorySourceStatus;
        /**
         * The time range when this inventory source starts and stops serving.
         */
        timeRange?: Schema$TimeRange;
        /**
         * Output only. The timestamp when the inventory source was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * The partner or advertisers with access to the inventory source.
     */
    export interface Schema$InventorySourceAccessors {
        /**
         * The advertisers with access to the inventory source. All advertisers must belong to the same partner.
         */
        advertisers?: Schema$InventorySourceAccessorsAdvertiserAccessors;
        /**
         * The partner with access to the inventory source.
         */
        partner?: Schema$InventorySourceAccessorsPartnerAccessor;
    }
    /**
     * The advertisers with access to the inventory source.
     */
    export interface Schema$InventorySourceAccessorsAdvertiserAccessors {
        /**
         * The IDs of the advertisers.
         */
        advertiserIds?: string[] | null;
    }
    /**
     * The partner with access to the inventory source.
     */
    export interface Schema$InventorySourceAccessorsPartnerAccessor {
        /**
         * The ID of the partner.
         */
        partnerId?: string | null;
    }
    /**
     * Targeting details for inventory source. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_INVENTORY_SOURCE`.
     */
    export interface Schema$InventorySourceAssignedTargetingOptionDetails {
        /**
         * Required. ID of the inventory source. Should refer to the inventory_source_id field of an InventorySource resource.
         */
        inventorySourceId?: string | null;
    }
    /**
     * The configuration for display creatives.
     */
    export interface Schema$InventorySourceDisplayCreativeConfig {
        /**
         * The size requirements for display creatives that can be assigned to the inventory source.
         */
        creativeSize?: Schema$Dimensions;
    }
    /**
     * A filtering option for filtering on Inventory Source entities.
     */
    export interface Schema$InventorySourceFilter {
        /**
         * Inventory Sources to download by ID. All IDs must belong to the same Advertiser or Partner specified in CreateSdfDownloadTaskRequest. Leave empty to download all Inventory Sources for the selected Advertiser or Partner.
         */
        inventorySourceIds?: string[] | null;
    }
    /**
     * A collection of targetable inventory sources.
     */
    export interface Schema$InventorySourceGroup {
        /**
         * Required. The display name of the inventory source group. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The unique ID of the inventory source group. Assigned by the system.
         */
        inventorySourceGroupId?: string | null;
        /**
         * Output only. The resource name of the inventory source group.
         */
        name?: string | null;
    }
    /**
     * Targeting details for inventory source group. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_INVENTORY_SOURCE_GROUP`.
     */
    export interface Schema$InventorySourceGroupAssignedTargetingOptionDetails {
        /**
         * Required. ID of the inventory source group. Should refer to the inventory_source_group_id field of an InventorySourceGroup resource.
         */
        inventorySourceGroupId?: string | null;
    }
    /**
     * The status related settings of the inventory source.
     */
    export interface Schema$InventorySourceStatus {
        /**
         * Output only. The configuration status of the inventory source. Only applicable for guaranteed inventory sources. Acceptable values are `INVENTORY_SOURCE_CONFIG_STATUS_PENDING` and `INVENTORY_SOURCE_CONFIG_STATUS_COMPLETED`. An inventory source must be configured (fill in the required fields, choose creatives, and select a default campaign) before it can serve.
         */
        configStatus?: string | null;
        /**
         * The user-provided reason for pausing this inventory source. Must not exceed 100 characters. Only applicable when entity_status is set to `ENTITY_STATUS_PAUSED`.
         */
        entityPauseReason?: string | null;
        /**
         * Whether or not the inventory source is servable. Acceptable values are `ENTITY_STATUS_ACTIVE`, `ENTITY_STATUS_ARCHIVED`, and `ENTITY_STATUS_PAUSED`. Default value is `ENTITY_STATUS_ACTIVE`.
         */
        entityStatus?: string | null;
        /**
         * Output only. The seller-provided reason for pausing this inventory source. Only applicable for inventory sources synced directly from the publishers and when seller_status is set to `ENTITY_STATUS_PAUSED`.
         */
        sellerPauseReason?: string | null;
        /**
         * Output only. The status set by the seller for the inventory source. Only applicable for inventory sources synced directly from the publishers. Acceptable values are `ENTITY_STATUS_ACTIVE` and `ENTITY_STATUS_PAUSED`.
         */
        sellerStatus?: string | null;
    }
    /**
     * The configuration for video creatives.
     */
    export interface Schema$InventorySourceVideoCreativeConfig {
        /**
         * The duration requirements for the video creatives that can be assigned to the inventory source.
         */
        duration?: string | null;
    }
    /**
     * A single invoice.
     */
    export interface Schema$Invoice {
        /**
         * The budget grouping ID for this invoice. This field will only be set if the invoice level of the corresponding billing profile was set to "Budget invoice grouping ID".
         */
        budgetInvoiceGroupingId?: string | null;
        /**
         * The list of summarized information for each budget associated with this invoice. This field will only be set if the invoice detail level of the corresponding billing profile was set to "Budget level PO".
         */
        budgetSummaries?: Schema$BudgetSummary[];
        /**
         * The ID of the original invoice being adjusted by this invoice, if applicable. May appear on the invoice PDF as `Reference invoice number`. If replaced_invoice_ids is set, this field will be empty.
         */
        correctedInvoiceId?: string | null;
        /**
         * The currency used in the invoice in ISO 4217 format.
         */
        currencyCode?: string | null;
        /**
         * The display name of the invoice.
         */
        displayName?: string | null;
        /**
         * The date when the invoice is due.
         */
        dueDate?: Schema$Date;
        /**
         * The unique ID of the invoice.
         */
        invoiceId?: string | null;
        /**
         * The type of invoice document.
         */
        invoiceType?: string | null;
        /**
         * The date when the invoice was issued.
         */
        issueDate?: Schema$Date;
        /**
         * The resource name of the invoice.
         */
        name?: string | null;
        /**
         * The total amount of costs or adjustments not tied to a particular budget, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        nonBudgetMicros?: string | null;
        /**
         * The ID of the payments account the invoice belongs to. Appears on the invoice PDF as `Billing Account Number`.
         */
        paymentsAccountId?: string | null;
        /**
         * The ID of the payments profile the invoice belongs to. Appears on the invoice PDF as `Billing ID`.
         */
        paymentsProfileId?: string | null;
        /**
         * The URL to download a PDF copy of the invoice. This URL is user specific and requires a valid OAuth 2.0 access token to access. The access token must be provided in an `Authorization: Bearer` HTTP header and be authorized for one of the following scopes: * `https://www.googleapis.com/auth/display-video-mediaplanning` * `https://www.googleapis.com/auth/display-video` The URL will be valid for 7 days after retrieval of this invoice object or until this invoice is retrieved again.
         */
        pdfUrl?: string | null;
        /**
         * Purchase order number associated with the invoice.
         */
        purchaseOrderNumber?: string | null;
        /**
         * The ID(s) of any originally issued invoice that is being cancelled by this invoice, if applicable. Multiple invoices may be listed if those invoices are being consolidated into a single invoice. May appear on invoice PDF as `Replaced invoice numbers`. If corrected_invoice_id is set, this field will be empty.
         */
        replacedInvoiceIds?: string[] | null;
        /**
         * The service start and end dates which are covered by this invoice.
         */
        serviceDateRange?: Schema$DateRange;
        /**
         * The pre-tax subtotal amount, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        subtotalAmountMicros?: string | null;
        /**
         * The invoice total amount, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        totalAmountMicros?: string | null;
        /**
         * The sum of all taxes in invoice, in micros of the invoice's currency. For example, if currency_code is `USD`, then 1000000 represents one US dollar.
         */
        totalTaxAmountMicros?: string | null;
    }
    /**
     * Details for assigned keyword targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_KEYWORD`.
     */
    export interface Schema$KeywordAssignedTargetingOptionDetails {
        /**
         * Required. The keyword, for example `car insurance`. Positive keyword cannot be offensive word. Must be UTF-8 encoded with a maximum size of 255 bytes. Maximum number of characters is 80. Maximum number of words is 10.
         */
        keyword?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
    }
    /**
     * Details for assigned language targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_LANGUAGE`.
     */
    export interface Schema$LanguageAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the language (e.g., "French").
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted. All assigned language targeting options on the same resource must have the same value for this field.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_LANGUAGE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable language. This will be populated in the language_details field when targeting_type is `TARGETING_TYPE_LANGUAGE`.
     */
    export interface Schema$LanguageTargetingOptionDetails {
        /**
         * Output only. The display name of the language (e.g., "French").
         */
        displayName?: string | null;
    }
    /**
     * A single line item.
     */
    export interface Schema$LineItem {
        /**
         * Output only. The unique ID of the advertiser the line item belongs to.
         */
        advertiserId?: string | null;
        /**
         * Required. The bidding strategy of the line item.
         */
        bidStrategy?: Schema$BiddingStrategy;
        /**
         * Required. The budget allocation setting of the line item.
         */
        budget?: Schema$LineItemBudget;
        /**
         * Output only. The unique ID of the campaign that the line item belongs to.
         */
        campaignId?: string | null;
        /**
         * The conversion tracking setting of the line item.
         */
        conversionCounting?: Schema$ConversionCountingConfig;
        /**
         * The IDs of the creatives associated with the line item.
         */
        creativeIds?: string[] | null;
        /**
         * Required. The display name of the line item. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Controls whether or not the line item can spend its budget and bid on inventory. * For CreateLineItem method, only `ENTITY_STATUS_DRAFT` is allowed. To activate a line item, use UpdateLineItem method and update the status to `ENTITY_STATUS_ACTIVE` after creation. * A line item cannot be changed back to `ENTITY_STATUS_DRAFT` status from any other status. * If the line item's parent insertion order is not active, the line item can't spend its budget even if its own status is `ENTITY_STATUS_ACTIVE`.
         */
        entityStatus?: string | null;
        /**
         * Whether to exclude new exchanges from automatically being targeted by the line item. This field is false by default.
         */
        excludeNewExchanges?: boolean | null;
        /**
         * Required. The start and end time of the line item's flight.
         */
        flight?: Schema$LineItemFlight;
        /**
         * Required. The impression frequency cap settings of the line item. The max_impressions field in this settings object must be used if assigning a limited cap.
         */
        frequencyCap?: Schema$FrequencyCap;
        /**
         * Required. Immutable. The unique ID of the insertion order that the line item belongs to.
         */
        insertionOrderId?: string | null;
        /**
         * Integration details of the line item.
         */
        integrationDetails?: Schema$IntegrationDetails;
        /**
         * The IDs of the private inventory sources assigned to the line item.
         */
        inventorySourceIds?: string[] | null;
        /**
         * Output only. The unique ID of the line item. Assigned by the system.
         */
        lineItemId?: string | null;
        /**
         * Required. Immutable. The type of the line item.
         */
        lineItemType?: string | null;
        /**
         * The mobile app promoted by the line item. This is applicable only when line_item_type is either `LINE_ITEM_TYPE_DISPLAY_MOBILE_APP_INSTALL` or `LINE_ITEM_TYPE_VIDEO_MOBILE_APP_INSTALL`.
         */
        mobileApp?: Schema$MobileApp;
        /**
         * Output only. The resource name of the line item.
         */
        name?: string | null;
        /**
         * Required. The budget spending speed setting of the line item.
         */
        pacing?: Schema$Pacing;
        /**
         * The partner costs associated with the line item. If absent or empty in CreateLineItem method, the newly created line item will inherit partner costs from its parent insertion order.
         */
        partnerCosts?: Schema$PartnerCost[];
        /**
         * Required. The partner revenue model setting of the line item.
         */
        partnerRevenueModel?: Schema$PartnerRevenueModel;
        /**
         * Output only. The reservation type of the line item.
         */
        reservationType?: string | null;
        /**
         * The [optimized targeting](//support.google.com/displayvideo/answer/12060859) settings of the line item. This config is only applicable for display, video, or audio line items that use automated bidding and positively target eligible audience lists.
         */
        targetingExpansion?: Schema$TargetingExpansionConfig;
        /**
         * Output only. The timestamp when the line item was last updated. Assigned by the system.
         */
        updateTime?: string | null;
        /**
         * Output only. The warning messages generated by the line item. These warnings do not block saving the line item, but some may block the line item from running.
         */
        warningMessages?: string[] | null;
    }
    /**
     * Settings that control how budget is allocated.
     */
    export interface Schema$LineItemBudget {
        /**
         * Required. The type of the budget allocation. `LINE_ITEM_BUDGET_ALLOCATION_TYPE_AUTOMATIC` is only applicable when automatic budget allocation is enabled for the parent insertion order.
         */
        budgetAllocationType?: string | null;
        /**
         * Output only. The budget unit specifies whether the budget is currency based or impression based. This value is inherited from the parent insertion order.
         */
        budgetUnit?: string | null;
        /**
         * The maximum budget amount the line item will spend. Must be greater than 0. When budget_allocation_type is: * `LINE_ITEM_BUDGET_ALLOCATION_TYPE_AUTOMATIC`, this field is immutable and is set by the system. * `LINE_ITEM_BUDGET_ALLOCATION_TYPE_FIXED`, if budget_unit is: - `BUDGET_UNIT_CURRENCY`, this field represents maximum budget amount to spend, in micros of the advertiser's currency. For example, 1500000 represents 1.5 standard units of the currency. - `BUDGET_UNIT_IMPRESSIONS`, this field represents the maximum number of impressions to serve. * `LINE_ITEM_BUDGET_ALLOCATION_TYPE_UNLIMITED`, this field is not applicable and will be ignored by the system.
         */
        maxAmount?: string | null;
    }
    /**
     * Settings that control the active duration of a line item.
     */
    export interface Schema$LineItemFlight {
        /**
         * The flight start and end dates of the line item. They are resolved relative to the parent advertiser's time zone. * Required when flight_date_type is `LINE_ITEM_FLIGHT_DATE_TYPE_CUSTOM`. Output only otherwise. * When creating a new flight, both `start_date` and `end_date` must be in the future. * An existing flight with a `start_date` in the past has a mutable `end_date` but an immutable `start_date`. * `end_date` must be the `start_date` or later, both before the year 2037.
         */
        dateRange?: Schema$DateRange;
        /**
         * Required. The type of the line item's flight dates.
         */
        flightDateType?: string | null;
        /**
         * The ID of the manual trigger associated with the line item. * Required when flight_date_type is `LINE_ITEM_FLIGHT_DATE_TYPE_TRIGGER`. Must not be set otherwise. * When set, the line item's flight dates are inherited from its parent insertion order. * Active line items will spend when the selected trigger is activated within the parent insertion order's flight dates. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This field will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         */
        triggerId?: string | null;
    }
    /**
     * Response message for ListAdvertiserAssignedTargetingOptions.
     */
    export interface Schema$ListAdvertiserAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent ListAdvertiserAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListAdvertisersResponse {
        /**
         * The list of advertisers. This list will be absent if empty.
         */
        advertisers?: Schema$Advertiser[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListAdvertisers` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for AssignedInventorySourceService.ListAssignedInventorySources.
     */
    export interface Schema$ListAssignedInventorySourcesResponse {
        /**
         * The list of assigned inventory sources. This list will be absent if empty.
         */
        assignedInventorySources?: Schema$AssignedInventorySource[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListAssignedInventorySources` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for AssignedLocationService.ListAssignedLocations.
     */
    export interface Schema$ListAssignedLocationsResponse {
        /**
         * The list of assigned locations. This list will be absent if empty.
         */
        assignedLocations?: Schema$AssignedLocation[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListAssignedLocations` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListCampaignAssignedTargetingOptions.
     */
    export interface Schema$ListCampaignAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent ListCampaignAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCampaignsResponse {
        /**
         * The list of campaigns. This list will be absent if empty.
         */
        campaigns?: Schema$Campaign[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCampaigns` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListChannelsResponse {
        /**
         * The list of channels. This list will be absent if empty.
         */
        channels?: Schema$Channel[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListChannels` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCombinedAudiencesResponse {
        /**
         * The list of combined audiences. This list will be absent if empty.
         */
        combinedAudiences?: Schema$CombinedAudience[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCombinedAudiences` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCreativesResponse {
        /**
         * The list of creatives. This list will be absent if empty.
         */
        creatives?: Schema$Creative[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCreativesRequest` method to retrieve the next page of results. If this field is null, it means this is the last page.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCustomBiddingAlgorithmsResponse {
        /**
         * The list of custom bidding algorithms. This list will be absent if empty.
         */
        customBiddingAlgorithms?: Schema$CustomBiddingAlgorithm[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCustomBiddingAlgorithmsRequest` method to retrieve the next page of results. If this field is null, it means this is the last page.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCustomBiddingScriptsResponse {
        /**
         * The list of custom bidding scripts. This list will be absent if empty.
         */
        customBiddingScripts?: Schema$CustomBiddingScript[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCustomBiddingScriptsRequest` method to retrieve the next page of results. If this field is null, it means this is the last page.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListCustomListsResponse {
        /**
         * The list of custom lists. This list will be absent if empty.
         */
        customLists?: Schema$CustomList[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListCustomLists` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListFirstAndThirdPartyAudiencesResponse {
        /**
         * The list of first and third party audiences. Audience size properties will not be included. This list will be absent if empty.
         */
        firstAndThirdPartyAudiences?: Schema$FirstAndThirdPartyAudience[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListFirstAndThirdPartyAudiences` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListGoogleAudiencesResponse {
        /**
         * The list of Google audiences. This list will be absent if empty.
         */
        googleAudiences?: Schema$GoogleAudience[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListGoogleAudiences` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListGuaranteedOrdersResponse {
        /**
         * The list of guaranteed orders. This list will be absent if empty.
         */
        guaranteedOrders?: Schema$GuaranteedOrder[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListGuaranteedOrders` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListInsertionOrderAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent ListInsertionOrderAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListInsertionOrdersResponse {
        /**
         * The list of insertion orders. This list will be absent if empty.
         */
        insertionOrders?: Schema$InsertionOrder[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListInsertionOrders` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for InventorySourceGroupService.ListInventorySourceGroups.
     */
    export interface Schema$ListInventorySourceGroupsResponse {
        /**
         * The list of inventory source groups. This list will be absent if empty.
         */
        inventorySourceGroups?: Schema$InventorySourceGroup[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListInventorySourceGroups` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListInventorySourcesResponse {
        /**
         * The list of inventory sources. This list will be absent if empty.
         */
        inventorySources?: Schema$InventorySource[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListInventorySources` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListInvoicesResponse {
        /**
         * The list of invoices. This list will be absent if empty.
         */
        invoices?: Schema$Invoice[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListInvoices` method to retrieve the next page of results. This token will be absent if there are no more invoices to return.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListLineItemAssignedTargetingOptions.
     */
    export interface Schema$ListLineItemAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent ListLineItemAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListLineItemsResponse {
        /**
         * The list of line items. This list will be absent if empty.
         */
        lineItems?: Schema$LineItem[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListLineItems` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListLocationListsResponse {
        /**
         * The list of location lists. This list will be absent if empty.
         */
        locationLists?: Schema$LocationList[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListLocationLists` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListManualTriggersResponse {
        /**
         * The list of manual triggers. This list will be absent if empty.
         */
        manualTriggers?: Schema$ManualTrigger[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListManualTriggers` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for NegativeKeywordListService.ListNegativeKeywordLists.
     */
    export interface Schema$ListNegativeKeywordListsResponse {
        /**
         * The list of negative keyword lists. This list will be absent if empty.
         */
        negativeKeywordLists?: Schema$NegativeKeywordList[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListNegativeKeywordLists` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for NegativeKeywordService.ListNegativeKeywords.
     */
    export interface Schema$ListNegativeKeywordsResponse {
        /**
         * The list of negative keywords. This list will be absent if empty.
         */
        negativeKeywords?: Schema$NegativeKeyword[];
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListNegativeKeywords` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListPartnerAssignedTargetingOptionsResponse {
        /**
         * The list of assigned targeting options. This list will be absent if empty.
         */
        assignedTargetingOptions?: Schema$AssignedTargetingOption[];
        /**
         * A token identifying the next page of results. This value should be specified as the pageToken in a subsequent ListPartnerAssignedTargetingOptionsRequest to fetch the next page of results. This token will be absent if there are no more assigned_targeting_options to return.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$ListPartnersResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListPartners` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of partners. This list will be absent if empty.
         */
        partners?: Schema$Partner[];
    }
    /**
     * Response message for SiteService.ListSites.
     */
    export interface Schema$ListSitesResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListSites` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of sites. This list will be absent if empty.
         */
        sites?: Schema$Site[];
    }
    /**
     * Response message for ListTargetingOptions.
     */
    export interface Schema$ListTargetingOptionsResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListTargetingOptions` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of targeting options. This list will be absent if empty.
         */
        targetingOptions?: Schema$TargetingOption[];
    }
    export interface Schema$ListUsersResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `ListUsers` method to retrieve the next page of results. This token will be absent if there are no more results to return.
         */
        nextPageToken?: string | null;
        /**
         * The list of users. This list will be absent if empty.
         */
        users?: Schema$User[];
    }
    /**
     * A list of locations used for targeting.
     */
    export interface Schema$LocationList {
        /**
         * Required. Immutable. The unique ID of the advertiser the location list belongs to.
         */
        advertiserId?: string | null;
        /**
         * Required. The display name of the location list. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The unique ID of the location list. Assigned by the system.
         */
        locationListId?: string | null;
        /**
         * Required. Immutable. The type of location. All locations in the list will share this type.
         */
        locationType?: string | null;
        /**
         * Output only. The resource name of the location list.
         */
        name?: string | null;
    }
    /**
     * Specifies how many days into the past to look when determining whether to record a conversion.
     */
    export interface Schema$LookbackWindow {
        /**
         * Lookback window, in days, from the last time a given user clicked on one of your ads.
         */
        clickDays?: number | null;
        /**
         * Lookback window, in days, from the last time a given user viewed one of your ads.
         */
        impressionDays?: number | null;
    }
    export interface Schema$LookupInvoiceCurrencyResponse {
        /**
         * Currency used by the advertiser in ISO 4217 format.
         */
        currencyCode?: string | null;
    }
    /**
     * A single manual trigger in Display & Video 360. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This resource will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
     */
    export interface Schema$ManualTrigger {
        /**
         * Required. The maximum duration of each activation in minutes. Must be between 1 and 360 inclusive. After this duration, the trigger will be automatically deactivated.
         */
        activationDurationMinutes?: string | null;
        /**
         * Required. Immutable. The unique ID of the advertiser that the manual trigger belongs to.
         */
        advertiserId?: string | null;
        /**
         * Required. The display name of the manual trigger. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The timestamp of the trigger's latest activation.
         */
        latestActivationTime?: string | null;
        /**
         * Output only. The resource name of the manual trigger.
         */
        name?: string | null;
        /**
         * Output only. The state of the manual trigger. Will be set to the `INACTIVE` state upon creation.
         */
        state?: string | null;
        /**
         * Output only. The unique ID of the manual trigger.
         */
        triggerId?: string | null;
    }
    /**
     * A strategy that automatically adjusts the bid to optimize a specified performance goal while spending the full budget.
     */
    export interface Schema$MaximizeSpendBidStrategy {
        /**
         * The ID of the Custom Bidding Algorithm used by this strategy. Only applicable when performance_goal_type is set to `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CUSTOM_ALGO`.
         */
        customBiddingAlgorithmId?: string | null;
        /**
         * The maximum average CPM that may be bid, in micros of the advertiser's currency. Must be greater than or equal to a billable unit of the given currency. For example, 1500000 represents 1.5 standard units of the currency.
         */
        maxAverageCpmBidAmountMicros?: string | null;
        /**
         * Required. The type of the performance goal that the bidding strategy tries to minimize while spending the full budget. `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM` is not supported for this strategy.
         */
        performanceGoalType?: string | null;
        /**
         * Whether the strategy takes deal floor prices into account.
         */
        raiseBidForDeals?: boolean | null;
    }
    /**
     * Measurement settings of a partner.
     */
    export interface Schema$MeasurementConfig {
        /**
         * Whether or not to report DV360 cost to CM360.
         */
        dv360ToCmCostReportingEnabled?: boolean | null;
        /**
         * Whether or not to include DV360 data in CM360 data transfer reports.
         */
        dv360ToCmDataSharingEnabled?: boolean | null;
    }
    /**
     * A mobile app promoted by a mobile app install line item.
     */
    export interface Schema$MobileApp {
        /**
         * Required. The ID of the app provided by the platform store. Android apps are identified by the bundle ID used by Android's Play store, such as `com.google.android.gm`. iOS apps are identified by a nine-digit app ID used by Apple's App store, such as `422689480`.
         */
        appId?: string | null;
        /**
         * Output only. The app name.
         */
        displayName?: string | null;
        /**
         * Output only. The app platform.
         */
        platform?: string | null;
        /**
         * Output only. The app publisher.
         */
        publisher?: string | null;
    }
    /**
     * Wrapper message for a list of mobile device IDs defining Customer Match audience members.
     */
    export interface Schema$MobileDeviceIdList {
        /**
         * Input only. The consent setting for the users in mobile_device_ids. Leaving this field unset indicates that consent is not specified. If ad_user_data or ad_personalization fields are set to `CONSENT_STATUS_DENIED`, the request will return an error.
         */
        consent?: Schema$Consent;
        /**
         * A list of mobile device IDs defining Customer Match audience members. The size of mobile_device_ids mustn't be greater than 500,000.
         */
        mobileDeviceIds?: string[] | null;
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
     * Details for native content position assigned targeting option. This will be populated in the native_content_position_details field when targeting_type is `TARGETING_TYPE_NATIVE_CONTENT_POSITION`. Explicitly targeting all options is not supported. Remove all native content position targeting options to achieve this effect.
     */
    export interface Schema$NativeContentPositionAssignedTargetingOptionDetails {
        /**
         * Required. The content position.
         */
        contentPosition?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_NATIVE_CONTENT_POSITION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable native content position. This will be populated in the native_content_position_details field when targeting_type is `TARGETING_TYPE_NATIVE_CONTENT_POSITION`.
     */
    export interface Schema$NativeContentPositionTargetingOptionDetails {
        /**
         * Output only. The content position.
         */
        contentPosition?: string | null;
    }
    /**
     * A negatively targeted keyword that belongs to a negative keyword list.
     */
    export interface Schema$NegativeKeyword {
        /**
         * Required. Immutable. The negatively targeted keyword, for example `car insurance`. Must be UTF-8 encoded with a maximum size of 255 bytes. Maximum number of characters is 80. Maximum number of words is 10. Valid characters are restricted to ASCII characters only. The only URL-escaping permitted is for representing whitespace between words. Leading or trailing whitespace is ignored.
         */
        keywordValue?: string | null;
        /**
         * Output only. The resource name of the negative keyword.
         */
        name?: string | null;
    }
    /**
     * A list of negative keywords used for targeting.
     */
    export interface Schema$NegativeKeywordList {
        /**
         * Output only. The unique ID of the advertiser the negative keyword list belongs to.
         */
        advertiserId?: string | null;
        /**
         * Required. The display name of the negative keyword list. Must be UTF-8 encoded with a maximum size of 255 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The resource name of the negative keyword list.
         */
        name?: string | null;
        /**
         * Output only. The unique ID of the negative keyword list. Assigned by the system.
         */
        negativeKeywordListId?: string | null;
        /**
         * Output only. Number of line items that are directly targeting this negative keyword list.
         */
        targetedLineItemCount?: string | null;
    }
    /**
     * Targeting details for negative keyword list. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST`.
     */
    export interface Schema$NegativeKeywordListAssignedTargetingOptionDetails {
        /**
         * Required. ID of the negative keyword list. Should refer to the negative_keyword_list_id field of a NegativeKeywordList resource.
         */
        negativeKeywordListId?: string | null;
    }
    /**
     * OBA Icon for a Creative
     */
    export interface Schema$ObaIcon {
        /**
         * Required. The click tracking URL of the OBA icon. Only URLs of the following domains are allowed: * https://info.evidon.com * https://l.betrad.com
         */
        clickTrackingUrl?: string | null;
        /**
         * The dimensions of the OBA icon.
         */
        dimensions?: Schema$Dimensions;
        /**
         * Required. The landing page URL of the OBA icon. Only URLs of the following domains are allowed: * https://info.evidon.com * https://l.betrad.com
         */
        landingPageUrl?: string | null;
        /**
         * The position of the OBA icon on the creative.
         */
        position?: string | null;
        /**
         * The program of the OBA icon. For example: “AdChoices”.
         */
        program?: string | null;
        /**
         * The MIME type of the OBA icon resource.
         */
        resourceMimeType?: string | null;
        /**
         * The URL of the OBA icon resource.
         */
        resourceUrl?: string | null;
        /**
         * Required. The view tracking URL of the OBA icon. Only URLs of the following domains are allowed: * https://info.evidon.com * https://l.betrad.com
         */
        viewTrackingUrl?: string | null;
    }
    /**
     * Represents a targetable Open Measurement enabled inventory type. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_OMID`.
     */
    export interface Schema$OmidAssignedTargetingOptionDetails {
        /**
         * Required. The type of Open Measurement enabled inventory.
         */
        omid?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_OMID`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable Open Measurement enabled inventory type. This will be populated in the omid_details field when targeting_type is `TARGETING_TYPE_OMID`.
     */
    export interface Schema$OmidTargetingOptionDetails {
        /**
         * Output only. The type of Open Measurement enabled inventory.
         */
        omid?: string | null;
    }
    /**
     * On screen position targeting option details. This will be populated in the on_screen_position_details field when targeting_type is `TARGETING_TYPE_ON_SCREEN_POSITION`.
     */
    export interface Schema$OnScreenPositionAssignedTargetingOptionDetails {
        /**
         * Output only. The ad type to target. Only applicable to insertion order targeting and new line items supporting the specified ad type will inherit this targeting option by default. Possible values are: * `AD_TYPE_DISPLAY`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_DISPLAY_DEFAULT`. * `AD_TYPE_VIDEO`, the setting will be inherited by new line item when line_item_type is `LINE_ITEM_TYPE_VIDEO_DEFAULT`.
         */
        adType?: string | null;
        /**
         * Output only. The on screen position.
         */
        onScreenPosition?: string | null;
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_ON_SCREEN_POSITION`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable on screen position, which could be used by display and video ads. This will be populated in the on_screen_position_details field when targeting_type is `TARGETING_TYPE_ON_SCREEN_POSITION`.
     */
    export interface Schema$OnScreenPositionTargetingOptionDetails {
        /**
         * Output only. The on screen position.
         */
        onScreenPosition?: string | null;
    }
    /**
     * Assigned operating system targeting option details. This will be populated in the operating_system_details field when targeting_type is `TARGETING_TYPE_OPERATING_SYSTEM`.
     */
    export interface Schema$OperatingSystemAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of the operating system.
         */
        displayName?: string | null;
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The targeting option ID populated in targeting_option_id field when targeting_type is `TARGETING_TYPE_OPERATING_SYSTEM`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable operating system. This will be populated in the operating_system_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_OPERATING_SYSTEM`.
     */
    export interface Schema$OperatingSystemTargetingOptionDetails {
        /**
         * Output only. The display name of the operating system.
         */
        displayName?: string | null;
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$Operation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
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
     * Settings that control the rate at which a budget is spent.
     */
    export interface Schema$Pacing {
        /**
         * Maximum number of impressions to serve every day. Applicable when the budget is impression based. Must be greater than 0.
         */
        dailyMaxImpressions?: string | null;
        /**
         * Maximum currency amount to spend every day in micros of advertiser's currency. Applicable when the budget is currency based. Must be greater than 0. For example, for 1.5 standard unit of the currency, set this field to 1500000. The value assigned will be rounded to whole billable units for the relevant currency by the following rules: any positive value less than a single billable unit will be rounded up to one billable unit and any value larger than a single billable unit will be rounded down to the nearest billable value. For example, if the currency's billable unit is 0.01, and this field is set to 10257770, it will round down to 10250000, a value of 10.25. If set to 505, it will round up to 10000, a value of 0.01.
         */
        dailyMaxMicros?: string | null;
        /**
         * Required. The time period in which the pacing budget will be spent. When automatic budget allocation is enabled at the insertion order via automationType, this field is output only and defaults to `PACING_PERIOD_FLIGHT`.
         */
        pacingPeriod?: string | null;
        /**
         * Required. The type of pacing that defines how the budget amount will be spent across the pacing_period.
         */
        pacingType?: string | null;
    }
    /**
     * Details for assigned parental status targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_PARENTAL_STATUS`.
     */
    export interface Schema$ParentalStatusAssignedTargetingOptionDetails {
        /**
         * Required. The parental status of the audience.
         */
        parentalStatus?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_PARENTAL_STATUS`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable parental status. This will be populated in the parental_status_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_PARENTAL_STATUS`.
     */
    export interface Schema$ParentalStatusTargetingOptionDetails {
        /**
         * Output only. The parental status of an audience.
         */
        parentalStatus?: string | null;
    }
    /**
     * A filtering option that filters on selected file types belonging to a chosen set of filter entities.
     */
    export interface Schema$ParentEntityFilter {
        /**
         * Required. File types that will be returned.
         */
        fileType?: string[] | null;
        /**
         * The IDs of the specified filter type. This is used to filter entities to fetch. If filter type is not `FILTER_TYPE_NONE`, at least one ID must be specified.
         */
        filterIds?: string[] | null;
        /**
         * Required. Filter type used to filter fetched entities.
         */
        filterType?: string | null;
    }
    /**
     * A single partner in Display & Video 360 (DV360).
     */
    export interface Schema$Partner {
        /**
         * Ad server related settings of the partner.
         */
        adServerConfig?: Schema$PartnerAdServerConfig;
        /**
         * Settings that control how partner data may be accessed.
         */
        dataAccessConfig?: Schema$PartnerDataAccessConfig;
        /**
         * The display name of the partner. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Output only. The status of the partner.
         */
        entityStatus?: string | null;
        /**
         * Settings that control which exchanges are enabled for the partner.
         */
        exchangeConfig?: Schema$ExchangeConfig;
        /**
         * General settings of the partner.
         */
        generalConfig?: Schema$PartnerGeneralConfig;
        /**
         * Output only. The resource name of the partner.
         */
        name?: string | null;
        /**
         * Output only. The unique ID of the partner. Assigned by the system.
         */
        partnerId?: string | null;
        /**
         * Output only. The timestamp when the partner was last updated. Assigned by the system.
         */
        updateTime?: string | null;
    }
    /**
     * Ad server related settings of a partner.
     */
    export interface Schema$PartnerAdServerConfig {
        /**
         * Measurement settings of a partner.
         */
        measurementConfig?: Schema$MeasurementConfig;
    }
    /**
     * Settings that control a partner cost. A partner cost is any type of expense involved in running a campaign, other than the costs of purchasing impressions (which is called the media cost) and using third-party audience segment data (data fee). Some examples of partner costs include the fees for using DV360, a third-party ad server, or a third-party ad serving verification service.
     */
    export interface Schema$PartnerCost {
        /**
         * Required. The type of the partner cost.
         */
        costType?: string | null;
        /**
         * The CPM fee amount in micros of advertiser's currency. Applicable when the fee_type is `PARTNER_FEE_TYPE_CPM_FEE`. Must be greater than or equal to 0. For example, for 1.5 standard unit of the advertiser's currency, set this field to 1500000.
         */
        feeAmount?: string | null;
        /**
         * The media fee percentage in millis (1/1000 of a percent). Applicable when the fee_type is `PARTNER_FEE_TYPE_MEDIA_FEE`. Must be greater than or equal to 0. For example: 100 represents 0.1%.
         */
        feePercentageMillis?: string | null;
        /**
         * Required. The fee type for this partner cost.
         */
        feeType?: string | null;
        /**
         * The invoice type for this partner cost. * Required when cost_type is one of: - `PARTNER_COST_TYPE_ADLOOX` - `PARTNER_COST_TYPE_DOUBLE_VERIFY` - `PARTNER_COST_TYPE_INTEGRAL_AD_SCIENCE`. * Output only for other types.
         */
        invoiceType?: string | null;
    }
    /**
     * Settings that control how partner related data may be accessed.
     */
    export interface Schema$PartnerDataAccessConfig {
        /**
         * Structured Data Files (SDF) settings for the partner. The SDF configuration for the partner.
         */
        sdfConfig?: Schema$SdfConfig;
    }
    /**
     * General settings of a partner.
     */
    export interface Schema$PartnerGeneralConfig {
        /**
         * Immutable. Partner's currency in ISO 4217 format.
         */
        currencyCode?: string | null;
        /**
         * Immutable. The standard TZ database name of the partner's time zone. For example, `America/New_York`. See more at: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
         */
        timeZone?: string | null;
    }
    /**
     * Settings that control how partner revenue is calculated.
     */
    export interface Schema$PartnerRevenueModel {
        /**
         * Required. The markup amount of the partner revenue model. Must be greater than or equal to 0. * When the markup_type is set to be `PARTNER_REVENUE_MODEL_MARKUP_TYPE_CPM`, this field represents the CPM markup in micros of advertiser's currency. For example, 1500000 represents 1.5 standard units of the currency. * When the markup_type is set to be `PARTNER_REVENUE_MODEL_MARKUP_TYPE_MEDIA_COST_MARKUP`, this field represents the media cost percent markup in millis. For example, 100 represents 0.1% (decimal 0.001). * When the markup_type is set to be `PARTNER_REVENUE_MODEL_MARKUP_TYPE_TOTAL_MEDIA_COST_MARKUP`, this field represents the total media cost percent markup in millis. For example, 100 represents 0.1% (decimal 0.001).
         */
        markupAmount?: string | null;
        /**
         * Required. The markup type of the partner revenue model.
         */
        markupType?: string | null;
    }
    /**
     * Settings that control the performance goal of a campaign.
     */
    export interface Schema$PerformanceGoal {
        /**
         * The goal amount, in micros of the advertiser's currency. Applicable when performance_goal_type is one of: * `PERFORMANCE_GOAL_TYPE_CPM` * `PERFORMANCE_GOAL_TYPE_CPC` * `PERFORMANCE_GOAL_TYPE_CPA` * `PERFORMANCE_GOAL_TYPE_CPIAVC` * `PERFORMANCE_GOAL_TYPE_VCPM` For example 1500000 represents 1.5 standard units of the currency.
         */
        performanceGoalAmountMicros?: string | null;
        /**
         * The decimal representation of the goal percentage in micros. Applicable when performance_goal_type is one of: * `PERFORMANCE_GOAL_TYPE_CTR` * `PERFORMANCE_GOAL_TYPE_VIEWABILITY` * `PERFORMANCE_GOAL_TYPE_CLICK_CVR` * `PERFORMANCE_GOAL_TYPE_IMPRESSION_CVR` * `PERFORMANCE_GOAL_TYPE_VTR` * `PERFORMANCE_GOAL_TYPE_AUDIO_COMPLETION_RATE` * `PERFORMANCE_GOAL_TYPE_VIDEO_COMPLETION_RATE` For example, 70000 represents 7% (decimal 0.07).
         */
        performanceGoalPercentageMicros?: string | null;
        /**
         * A key performance indicator (KPI) string, which can be empty. Must be UTF-8 encoded with a length of no more than 100 characters. Applicable when performance_goal_type is set to `PERFORMANCE_GOAL_TYPE_OTHER`.
         */
        performanceGoalString?: string | null;
        /**
         * Required. The type of the performance goal.
         */
        performanceGoalType?: string | null;
    }
    /**
     * A strategy that automatically adjusts the bid to meet or beat a specified performance goal.
     */
    export interface Schema$PerformanceGoalBidStrategy {
        /**
         * The ID of the Custom Bidding Algorithm used by this strategy. Only applicable when performance_goal_type is set to `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CUSTOM_ALGO`.
         */
        customBiddingAlgorithmId?: string | null;
        /**
         * The maximum average CPM that may be bid, in micros of the advertiser's currency. Must be greater than or equal to a billable unit of the given currency. Not applicable when performance_goal_type is set to `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM`. For example, 1500000 represents 1.5 standard units of the currency.
         */
        maxAverageCpmBidAmountMicros?: string | null;
        /**
         * Required. The performance goal the bidding strategy will attempt to meet or beat, in micros of the advertiser's currency or in micro of the ROAS (Return On Advertising Spend) value which is also based on advertiser's currency. Must be greater than or equal to a billable unit of the given currency and smaller or equal to upper bounds. Each performance_goal_type has its upper bound: * when performance_goal_type is `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPA`, upper bound is 10000.00 USD. * when performance_goal_type is `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPC`, upper bound is 1000.00 USD. * when performance_goal_type is `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM`, upper bound is 1000.00 USD. * when performance_goal_type is `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CUSTOM_ALGO`, upper bound is 1000.00 and lower bound is 0.01. Example: If set to `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM`, the bid price will be based on the probability that each available impression will be viewable. For example, if viewable CPM target is $2 and an impression is 40% likely to be viewable, the bid price will be $0.80 CPM (40% of $2). For example, 1500000 represents 1.5 standard units of the currency or ROAS value.
         */
        performanceGoalAmountMicros?: string | null;
        /**
         * Required. The type of the performance goal that the bidding strategy will try to meet or beat. For line item level usage, the value must be one of: * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPA` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CPC` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_VIEWABLE_CPM` * `BIDDING_STRATEGY_PERFORMANCE_GOAL_TYPE_CUSTOM_ALGO`.
         */
        performanceGoalType?: string | null;
    }
    /**
     * Details for assigned POI targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_POI`.
     */
    export interface Schema$PoiAssignedTargetingOptionDetails {
        /**
         * Output only. The display name of a POI, e.g. "Times Square", "Space Needle", followed by its full address if available.
         */
        displayName?: string | null;
        /**
         * Output only. Latitude of the POI rounding to 6th decimal place.
         */
        latitude?: number | null;
        /**
         * Output only. Longitude of the POI rounding to 6th decimal place.
         */
        longitude?: number | null;
        /**
         * Required. The radius of the area around the POI that will be targeted. The units of the radius are specified by proximity_radius_unit. Must be 1 to 800 if unit is `DISTANCE_UNIT_KILOMETERS` and 1 to 500 if unit is `DISTANCE_UNIT_MILES`.
         */
        proximityRadiusAmount?: number | null;
        /**
         * Required. The unit of distance by which the targeting radius is measured.
         */
        proximityRadiusUnit?: string | null;
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_POI`. Accepted POI targeting option IDs can be retrieved using `targetingTypes.targetingOptions.search`. If targeting a specific latitude/longitude coordinate removed from an address or POI name, you can generate the necessary targeting option ID by rounding the desired coordinate values to the 6th decimal place, removing the decimals, and concatenating the string values separated by a semicolon. For example, you can target the latitude/longitude pair of 40.7414691, -74.003387 using the targeting option ID "40741469;-74003387". **Upon** **creation, this field value will be updated to append a semicolon and** **alphanumerical hash value if only latitude/longitude coordinates are** **provided.**
         */
        targetingOptionId?: string | null;
    }
    /**
     * Search terms for POI targeting options.
     */
    export interface Schema$PoiSearchTerms {
        /**
         * The search query for the desired POI name, street address, or coordinate of the desired POI. The query can be a prefix, e.g. "Times squar", "40.7505045,-73.99562", "315 W 44th St", etc.
         */
        poiQuery?: string | null;
    }
    /**
     * Represents a targetable point of interest(POI). This will be populated in the poi_details field when targeting_type is `TARGETING_TYPE_POI`.
     */
    export interface Schema$PoiTargetingOptionDetails {
        /**
         * Output only. The display name of a POI(e.g. "Times Square", "Space Needle"), followed by its full address if available.
         */
        displayName?: string | null;
        /**
         * Output only. Latitude of the POI rounding to 6th decimal place.
         */
        latitude?: number | null;
        /**
         * Output only. Longitude of the POI rounding to 6th decimal place.
         */
        longitude?: number | null;
    }
    /**
     * Settings specific to the Mediaocean Prisma tool.
     */
    export interface Schema$PrismaConfig {
        /**
         * Required. Relevant client, product, and estimate codes from the Mediaocean Prisma tool.
         */
        prismaCpeCode?: Schema$PrismaCpeCode;
        /**
         * Required. The Prisma type.
         */
        prismaType?: string | null;
        /**
         * Required. The entity allocated this budget (DSP, site, etc.).
         */
        supplier?: string | null;
    }
    /**
     * Google Payments Center supports searching and filtering on the component fields of this code.
     */
    export interface Schema$PrismaCpeCode {
        /**
         * The Prisma client code.
         */
        prismaClientCode?: string | null;
        /**
         * The Prisma estimate code.
         */
        prismaEstimateCode?: string | null;
        /**
         * The Prisma product code.
         */
        prismaProductCode?: string | null;
    }
    /**
     * Targeting details for proximity location list. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_PROXIMITY_LOCATION_LIST`.
     */
    export interface Schema$ProximityLocationListAssignedTargetingOptionDetails {
        /**
         * Required. ID of the proximity location list. Should refer to the location_list_id field of a LocationList resource whose type is `TARGETING_LOCATION_TYPE_PROXIMITY`.
         */
        proximityLocationListId?: string | null;
        /**
         * Required. Radius range for proximity location list. This represents the size of the area around a chosen location that will be targeted. `All` proximity location targeting under a single resource must have the same radius range value. Set this value to match any existing targeting. If updated, this field will change the radius range for all proximity targeting under the resource.
         */
        proximityRadiusRange?: string | null;
    }
    /**
     * Publisher review status for the creative.
     */
    export interface Schema$PublisherReviewStatus {
        /**
         * The publisher reviewing the creative.
         */
        publisherName?: string | null;
        /**
         * Status of the publisher review.
         */
        status?: string | null;
    }
    /**
     * The rate related settings of the inventory source.
     */
    export interface Schema$RateDetails {
        /**
         * The rate type. Acceptable values are `INVENTORY_SOURCE_RATE_TYPE_CPM_FIXED`, `INVENTORY_SOURCE_RATE_TYPE_CPM_FLOOR`, and `INVENTORY_SOURCE_RATE_TYPE_CPD`.
         */
        inventorySourceRateType?: string | null;
        /**
         * Output only. The amount that the buyer has committed to spending on the inventory source up front. Only applicable for guaranteed inventory sources.
         */
        minimumSpend?: Schema$Money;
        /**
         * The rate for the inventory source.
         */
        rate?: Schema$Money;
        /**
         * Required for guaranteed inventory sources. The number of impressions guaranteed by the seller.
         */
        unitsPurchased?: string | null;
    }
    /**
     * Targeting details for regional location list. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_REGIONAL_LOCATION_LIST`.
     */
    export interface Schema$RegionalLocationListAssignedTargetingOptionDetails {
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. ID of the regional location list. Should refer to the location_list_id field of a LocationList resource whose type is `TARGETING_LOCATION_TYPE_REGIONAL`.
         */
        regionalLocationListId?: string | null;
    }
    /**
     * Request message for NegativeKeywordService.ReplaceNegativeKeywords.
     */
    export interface Schema$ReplaceNegativeKeywordsRequest {
        /**
         * The negative keywords that will replace the existing keywords in the negative keyword list, specified as a list of NegativeKeywords.
         */
        newNegativeKeywords?: Schema$NegativeKeyword[];
    }
    /**
     * Response message for NegativeKeywordService.ReplaceNegativeKeywords.
     */
    export interface Schema$ReplaceNegativeKeywordsResponse {
        /**
         * The full list of negative keywords now present in the negative keyword list.
         */
        negativeKeywords?: Schema$NegativeKeyword[];
    }
    /**
     * Request message for SiteService.ReplaceSites.
     */
    export interface Schema$ReplaceSitesRequest {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string | null;
        /**
         * The sites that will replace the existing sites assigned to the channel, specified as a list of Sites.
         */
        newSites?: Schema$Site[];
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string | null;
    }
    /**
     * Response message for SiteService.ReplaceSites.
     */
    export interface Schema$ReplaceSitesResponse {
        /**
         * The list of sites in the channel after replacing.
         */
        sites?: Schema$Site[];
    }
    /**
     * Review statuses for the creative.
     */
    export interface Schema$ReviewStatusInfo {
        /**
         * Represents the basic approval needed for a creative to begin serving. Summary of creative_and_landing_page_review_status and content_and_policy_review_status.
         */
        approvalStatus?: string | null;
        /**
         * Content and policy review status for the creative.
         */
        contentAndPolicyReviewStatus?: string | null;
        /**
         * Creative and landing page review status for the creative.
         */
        creativeAndLandingPageReviewStatus?: string | null;
        /**
         * Exchange review statuses for the creative.
         */
        exchangeReviewStatuses?: Schema$ExchangeReviewStatus[];
        /**
         * Publisher review statuses for the creative.
         */
        publisherReviewStatuses?: Schema$PublisherReviewStatus[];
    }
    /**
     * An error message for a custom bidding script.
     */
    export interface Schema$ScriptError {
        /**
         * The column number in the script where the error was thrown.
         */
        column?: string | null;
        /**
         * The type of error.
         */
        errorCode?: string | null;
        /**
         * The detailed error message.
         */
        errorMessage?: string | null;
        /**
         * The line number in the script where the error was thrown.
         */
        line?: string | null;
    }
    /**
     * Structured Data File (SDF) related settings.
     */
    export interface Schema$SdfConfig {
        /**
         * An administrator email address to which the SDF processing status reports will be sent.
         */
        adminEmail?: string | null;
        /**
         * Required. The version of SDF being used.
         */
        version?: string | null;
    }
    /**
     * Type for the response returned by [SdfDownloadTaskService.CreateSdfDownloadTask].
     */
    export interface Schema$SdfDownloadTask {
        /**
         * A resource name to be used in media.download to Download the prepared files. Resource names have the format `download/sdfdownloadtasks/media/{media_id\}`. `media_id` will be made available by the long running operation service once the task status is done.
         */
        resourceName?: string | null;
    }
    /**
     * Type for the metadata returned by [SdfDownloadTaskService.CreateSdfDownloadTask].
     */
    export interface Schema$SdfDownloadTaskMetadata {
        /**
         * The time when the operation was created.
         */
        createTime?: string | null;
        /**
         * The time when execution was completed.
         */
        endTime?: string | null;
        /**
         * The SDF version used to execute this download task.
         */
        version?: string | null;
    }
    /**
     * Request message for SearchTargetingOptions.
     */
    export interface Schema$SearchTargetingOptionsRequest {
        /**
         * Required. The Advertiser this request is being made in the context of.
         */
        advertiserId?: string | null;
        /**
         * Search terms for Business Chain targeting options. Can only be used when targeting_type is `TARGETING_TYPE_BUSINESS_CHAIN`.
         */
        businessChainSearchTerms?: Schema$BusinessChainSearchTerms;
        /**
         * Search terms for geo region targeting options. Can only be used when targeting_type is `TARGETING_TYPE_GEO_REGION`.
         */
        geoRegionSearchTerms?: Schema$GeoRegionSearchTerms;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number | null;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `SearchTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string | null;
        /**
         * Search terms for POI targeting options. Can only be used when targeting_type is `TARGETING_TYPE_POI`.
         */
        poiSearchTerms?: Schema$PoiSearchTerms;
    }
    /**
     * Response message for SearchTargetingOptions.
     */
    export interface Schema$SearchTargetingOptionsResponse {
        /**
         * A token to retrieve the next page of results. Pass this value in the page_token field in the subsequent call to `SearchTargetingOptions` method to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of targeting options that match the search criteria. This list will be absent if empty.
         */
        targetingOptions?: Schema$TargetingOption[];
    }
    /**
     * Targeting details for sensitive category. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`.
     */
    export interface Schema$SensitiveCategoryAssignedTargetingOptionDetails {
        /**
         * Required. ID of the sensitive category to be EXCLUDED.
         */
        excludedTargetingOptionId?: string | null;
        /**
         * Output only. An enum for the DV360 Sensitive category content classifier.
         */
        sensitiveCategory?: string | null;
    }
    /**
     * Represents a targetable sensitive category. This will be populated in the sensitive_category_details field of the TargetingOption when targeting_type is `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`.
     */
    export interface Schema$SensitiveCategoryTargetingOptionDetails {
        /**
         * Output only. An enum for the DV360 Sensitive category content classifier.
         */
        sensitiveCategory?: string | null;
    }
    /**
     * A single site. Sites are apps or websites belonging to a channel.
     */
    export interface Schema$Site {
        /**
         * Output only. The resource name of the site.
         */
        name?: string | null;
        /**
         * Required. The app ID or URL of the site. Must be UTF-8 encoded with a maximum length of 240 bytes.
         */
        urlOrAppId?: string | null;
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
     * Details for assigned sub-exchange targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_SUB_EXCHANGE`.
     */
    export interface Schema$SubExchangeAssignedTargetingOptionDetails {
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_SUB_EXCHANGE`.
         */
        targetingOptionId?: string | null;
    }
    /**
     * Represents a targetable sub-exchange. This will be populated in the sub_exchange_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_SUB_EXCHANGE`.
     */
    export interface Schema$SubExchangeTargetingOptionDetails {
        /**
         * Output only. The display name of the sub-exchange.
         */
        displayName?: string | null;
    }
    /**
     * Settings that control the [optimized targeting](//support.google.com/displayvideo/answer/12060859) settings of the line item.
     */
    export interface Schema$TargetingExpansionConfig {
        /**
         * Whether to exclude first-party audiences from use in targeting expansion. This field was deprecated with the launch of [optimized targeting](//support.google.com/displayvideo/answer/12060859). This field will be set to `false`. If this field is set to `true` when deprecated, all positive first-party audience targeting assigned to this line item will be replaced with negative targeting of the same first-party audiences to ensure the continued exclusion of those audiences.
         */
        excludeFirstPartyAudience?: boolean | null;
        /**
         * Required. Whether optimized targeting is turned on. This field supports the following values: * `NO_EXPANSION`: optimized targeting is turned off * `LEAST_EXPANSION`: optimized targeting is turned on If this field is set to any other value, it will automatically be set to `LEAST_EXPANSION`. `NO_EXPANSION` will be the default value for the field and will be automatically assigned if you do not set the field.
         */
        targetingExpansionLevel?: string | null;
    }
    /**
     * Represents a single targeting option, which is a targetable concept in DV360.
     */
    export interface Schema$TargetingOption {
        /**
         * Age range details.
         */
        ageRangeDetails?: Schema$AgeRangeTargetingOptionDetails;
        /**
         * App category details.
         */
        appCategoryDetails?: Schema$AppCategoryTargetingOptionDetails;
        /**
         * Audio content type details.
         */
        audioContentTypeDetails?: Schema$AudioContentTypeTargetingOptionDetails;
        /**
         * Authorized seller status resource details.
         */
        authorizedSellerStatusDetails?: Schema$AuthorizedSellerStatusTargetingOptionDetails;
        /**
         * Browser details.
         */
        browserDetails?: Schema$BrowserTargetingOptionDetails;
        /**
         * Business chain resource details.
         */
        businessChainDetails?: Schema$BusinessChainTargetingOptionDetails;
        /**
         * Carrier and ISP details.
         */
        carrierAndIspDetails?: Schema$CarrierAndIspTargetingOptionDetails;
        /**
         * Category resource details.
         */
        categoryDetails?: Schema$CategoryTargetingOptionDetails;
        /**
         * Content duration resource details.
         */
        contentDurationDetails?: Schema$ContentDurationTargetingOptionDetails;
        /**
         * Content genre resource details.
         */
        contentGenreDetails?: Schema$ContentGenreTargetingOptionDetails;
        /**
         * Content instream position details.
         */
        contentInstreamPositionDetails?: Schema$ContentInstreamPositionTargetingOptionDetails;
        /**
         * Content outstream position details.
         */
        contentOutstreamPositionDetails?: Schema$ContentOutstreamPositionTargetingOptionDetails;
        /**
         * Content stream type resource details.
         */
        contentStreamTypeDetails?: Schema$ContentStreamTypeTargetingOptionDetails;
        /**
         * Device make and model resource details.
         */
        deviceMakeModelDetails?: Schema$DeviceMakeModelTargetingOptionDetails;
        /**
         * Device type details.
         */
        deviceTypeDetails?: Schema$DeviceTypeTargetingOptionDetails;
        /**
         * Digital content label details.
         */
        digitalContentLabelDetails?: Schema$DigitalContentLabelTargetingOptionDetails;
        /**
         * Environment details.
         */
        environmentDetails?: Schema$EnvironmentTargetingOptionDetails;
        /**
         * Exchange details.
         */
        exchangeDetails?: Schema$ExchangeTargetingOptionDetails;
        /**
         * Gender details.
         */
        genderDetails?: Schema$GenderTargetingOptionDetails;
        /**
         * Geographic region resource details.
         */
        geoRegionDetails?: Schema$GeoRegionTargetingOptionDetails;
        /**
         * Household income details.
         */
        householdIncomeDetails?: Schema$HouseholdIncomeTargetingOptionDetails;
        /**
         * Language resource details.
         */
        languageDetails?: Schema$LanguageTargetingOptionDetails;
        /**
         * Output only. The resource name for this targeting option.
         */
        name?: string | null;
        /**
         * Native content position details.
         */
        nativeContentPositionDetails?: Schema$NativeContentPositionTargetingOptionDetails;
        /**
         * Open Measurement enabled inventory details.
         */
        omidDetails?: Schema$OmidTargetingOptionDetails;
        /**
         * On screen position details.
         */
        onScreenPositionDetails?: Schema$OnScreenPositionTargetingOptionDetails;
        /**
         * Operating system resources details.
         */
        operatingSystemDetails?: Schema$OperatingSystemTargetingOptionDetails;
        /**
         * Parental status details.
         */
        parentalStatusDetails?: Schema$ParentalStatusTargetingOptionDetails;
        /**
         * POI resource details.
         */
        poiDetails?: Schema$PoiTargetingOptionDetails;
        /**
         * Sensitive Category details.
         */
        sensitiveCategoryDetails?: Schema$SensitiveCategoryTargetingOptionDetails;
        /**
         * Sub-exchange details.
         */
        subExchangeDetails?: Schema$SubExchangeTargetingOptionDetails;
        /**
         * Output only. A unique identifier for this targeting option. The tuple {`targeting_type`, `targeting_option_id`\} will be unique.
         */
        targetingOptionId?: string | null;
        /**
         * Output only. The type of this targeting option.
         */
        targetingType?: string | null;
        /**
         * User rewarded content details.
         */
        userRewardedContentDetails?: Schema$UserRewardedContentTargetingOptionDetails;
        /**
         * Video player size details.
         */
        videoPlayerSizeDetails?: Schema$VideoPlayerSizeTargetingOptionDetails;
        /**
         * Viewability resource details.
         */
        viewabilityDetails?: Schema$ViewabilityTargetingOptionDetails;
    }
    /**
     * Settings for advertisers that use third-party ad servers only.
     */
    export interface Schema$ThirdPartyOnlyConfig {
        /**
         * Whether or not order ID reporting for pixels is enabled. This value cannot be changed once set to `true`.
         */
        pixelOrderIdReportingEnabled?: boolean | null;
    }
    /**
     * Tracking URLs from third parties to track interactions with an audio or a video creative.
     */
    export interface Schema$ThirdPartyUrl {
        /**
         * The type of interaction needs to be tracked by the tracking URL
         */
        type?: string | null;
        /**
         * Tracking URL used to track the interaction. Provide a URL with optional path or query string, beginning with `https:`. For example, https://www.example.com/path
         */
        url?: string | null;
    }
    /**
     * Assigned third party verifier targeting option details. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_THIRD_PARTY_VERIFIER`.
     */
    export interface Schema$ThirdPartyVerifierAssignedTargetingOptionDetails {
        /**
         * Third party brand verifier -- Adloox.
         */
        adloox?: Schema$Adloox;
        /**
         * Third party brand verifier -- DoubleVerify.
         */
        doubleVerify?: Schema$DoubleVerify;
        /**
         * Third party brand verifier -- Integral Ad Science.
         */
        integralAdScience?: Schema$IntegralAdScience;
    }
    /**
     * A time range.
     */
    export interface Schema$TimeRange {
        /**
         * Required. The upper bound of a time range, inclusive.
         */
        endTime?: string | null;
        /**
         * Required. The lower bound of a time range, inclusive.
         */
        startTime?: string | null;
    }
    /**
     * Timer event of the creative.
     */
    export interface Schema$TimerEvent {
        /**
         * Required. The name of the timer event.
         */
        name?: string | null;
        /**
         * Required. The name used to identify this timer event in reports.
         */
        reportingName?: string | null;
    }
    /**
     * Settings that control the behavior of a single Floodlight activity config.
     */
    export interface Schema$TrackingFloodlightActivityConfig {
        /**
         * Required. The ID of the Floodlight activity.
         */
        floodlightActivityId?: string | null;
        /**
         * Required. The number of days after an ad has been clicked in which a conversion may be counted. Must be between 0 and 90 inclusive.
         */
        postClickLookbackWindowDays?: number | null;
        /**
         * Required. The number of days after an ad has been viewed in which a conversion may be counted. Must be between 0 and 90 inclusive.
         */
        postViewLookbackWindowDays?: number | null;
    }
    /**
     * Represents information about the transcoded audio or video file.
     */
    export interface Schema$Transcode {
        /**
         * The bit rate for the audio stream of the transcoded video, or the bit rate for the transcoded audio, in kilobits per second.
         */
        audioBitRateKbps?: string | null;
        /**
         * The sample rate for the audio stream of the transcoded video, or the sample rate for the transcoded audio, in hertz.
         */
        audioSampleRateHz?: string | null;
        /**
         * The transcoding bit rate of the transcoded video, in kilobits per second.
         */
        bitRateKbps?: string | null;
        /**
         * The dimensions of the transcoded video.
         */
        dimensions?: Schema$Dimensions;
        /**
         * The size of the transcoded file, in bytes.
         */
        fileSizeBytes?: string | null;
        /**
         * The frame rate of the transcoded video, in frames per second.
         */
        frameRate?: number | null;
        /**
         * The MIME type of the transcoded file.
         */
        mimeType?: string | null;
        /**
         * The name of the transcoded file.
         */
        name?: string | null;
        /**
         * Indicates if the transcoding was successful.
         */
        transcoded?: boolean | null;
    }
    /**
     * A creative identifier provided by a registry that is unique across all platforms. This is part of the VAST 4.0 standard.
     */
    export interface Schema$UniversalAdId {
        /**
         * The unique creative identifier.
         */
        id?: string | null;
        /**
         * The registry provides unique creative identifiers.
         */
        registry?: string | null;
    }
    /**
     * Details for assigned URL targeting option. This will be populated in the details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_URL`.
     */
    export interface Schema$UrlAssignedTargetingOptionDetails {
        /**
         * Indicates if this option is being negatively targeted.
         */
        negative?: boolean | null;
        /**
         * Required. The URL, for example `example.com`. DV360 supports two levels of subdirectory targeting, for example `www.example.com/one-subdirectory-level/second-level`, and five levels of subdomain targeting, for example `five.four.three.two.one.example.com`.
         */
        url?: string | null;
    }
    /**
     * A single user in Display & Video 360.
     */
    export interface Schema$User {
        /**
         * The assigned user roles. Required in CreateUser. Output only in UpdateUser. Can only be updated through BulkEditAssignedUserRoles.
         */
        assignedUserRoles?: Schema$AssignedUserRole[];
        /**
         * Required. The display name of the user. Must be UTF-8 encoded with a maximum size of 240 bytes.
         */
        displayName?: string | null;
        /**
         * Required. Immutable. The email address used to identify the user.
         */
        email?: string | null;
        /**
         * Output only. The timestamp when the user last logged in DV360 UI.
         */
        lastLoginTime?: string | null;
        /**
         * Output only. The resource name of the user.
         */
        name?: string | null;
        /**
         * Output only. The unique ID of the user. Assigned by the system.
         */
        userId?: string | null;
    }
    /**
     * User rewarded content targeting option details. This will be populated in the user_rewarded_content_details field when targeting_type is `TARGETING_TYPE_USER_REWARDED_CONTENT`.
     */
    export interface Schema$UserRewardedContentAssignedTargetingOptionDetails {
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_USER_REWARDED_CONTENT`.
         */
        targetingOptionId?: string | null;
        /**
         * Output only. User rewarded content status for video ads.
         */
        userRewardedContent?: string | null;
    }
    /**
     * Represents a targetable user rewarded content status for video ads only. This will be populated in the user_rewarded_content_details field when targeting_type is `TARGETING_TYPE_USER_REWARDED_CONTENT`.
     */
    export interface Schema$UserRewardedContentTargetingOptionDetails {
        /**
         * Output only. User rewarded content status for video ads.
         */
        userRewardedContent?: string | null;
    }
    /**
     * Video player size targeting option details. This will be populated in the video_player_size_details field when targeting_type is `TARGETING_TYPE_VIDEO_PLAYER_SIZE`. Explicitly targeting all options is not supported. Remove all video player size targeting options to achieve this effect.
     */
    export interface Schema$VideoPlayerSizeAssignedTargetingOptionDetails {
        /**
         * Required. The targeting_option_id field when targeting_type is `TARGETING_TYPE_VIDEO_PLAYER_SIZE`.
         */
        targetingOptionId?: string | null;
        /**
         * Required. The video player size.
         */
        videoPlayerSize?: string | null;
    }
    /**
     * Represents a targetable video player size. This will be populated in the video_player_size_details field when targeting_type is `TARGETING_TYPE_VIDEO_PLAYER_SIZE`.
     */
    export interface Schema$VideoPlayerSizeTargetingOptionDetails {
        /**
         * Output only. The video player size.
         */
        videoPlayerSize?: string | null;
    }
    /**
     * Assigned viewability targeting option details. This will be populated in the viewability_details field of an AssignedTargetingOption when targeting_type is `TARGETING_TYPE_VIEWABILITY`.
     */
    export interface Schema$ViewabilityAssignedTargetingOptionDetails {
        /**
         * Required. The targeting_option_id of a TargetingOption of type `TARGETING_TYPE_VIEWABILITY` (e.g., "509010" for targeting the `VIEWABILITY_10_PERCENT_OR_MORE` option).
         */
        targetingOptionId?: string | null;
        /**
         * Required. The predicted viewability percentage.
         */
        viewability?: string | null;
    }
    /**
     * Represents a targetable viewability. This will be populated in the viewability_details field of a TargetingOption when targeting_type is `TARGETING_TYPE_VIEWABILITY`.
     */
    export interface Schema$ViewabilityTargetingOptionDetails {
        /**
         * Output only. The predicted viewability percentage.
         */
        viewability?: string | null;
    }
    export class Resource$Advertisers {
        context: APIRequestContext;
        assets: Resource$Advertisers$Assets;
        campaigns: Resource$Advertisers$Campaigns;
        channels: Resource$Advertisers$Channels;
        creatives: Resource$Advertisers$Creatives;
        insertionOrders: Resource$Advertisers$Insertionorders;
        invoices: Resource$Advertisers$Invoices;
        lineItems: Resource$Advertisers$Lineitems;
        locationLists: Resource$Advertisers$Locationlists;
        manualTriggers: Resource$Advertisers$Manualtriggers;
        negativeKeywordLists: Resource$Advertisers$Negativekeywordlists;
        targetingTypes: Resource$Advertisers$Targetingtypes;
        constructor(context: APIRequestContext);
        /**
         * Audits an advertiser. Returns the counts of used entities per resource type under the advertiser provided. Used entities count towards their respective resource limit. See https://support.google.com/displayvideo/answer/6071450.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        audit(params: Params$Resource$Advertisers$Audit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        audit(params?: Params$Resource$Advertisers$Audit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AuditAdvertiserResponse>>;
        audit(params: Params$Resource$Advertisers$Audit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        audit(params: Params$Resource$Advertisers$Audit, options: MethodOptions | BodyResponseCallback<Schema$AuditAdvertiserResponse>, callback: BodyResponseCallback<Schema$AuditAdvertiserResponse>): void;
        audit(params: Params$Resource$Advertisers$Audit, callback: BodyResponseCallback<Schema$AuditAdvertiserResponse>): void;
        audit(callback: BodyResponseCallback<Schema$AuditAdvertiserResponse>): void;
        /**
         * Bulk edits targeting options under a single advertiser. The operation will delete the assigned targeting options provided in BulkEditAdvertiserAssignedTargetingOptionsRequest.delete_requests and then create the assigned targeting options provided in BulkEditAdvertiserAssignedTargetingOptionsRequest.create_requests .
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEditAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEditAdvertiserAssignedTargetingOptions(params?: Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse>>;
        bulkEditAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEditAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse>): void;
        bulkEditAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse>): void;
        bulkEditAdvertiserAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkEditAdvertiserAssignedTargetingOptionsResponse>): void;
        /**
         * Lists assigned targeting options of an advertiser across targeting types.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkListAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkListAdvertiserAssignedTargetingOptions(params?: Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkListAdvertiserAssignedTargetingOptionsResponse>>;
        bulkListAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkListAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkListAdvertiserAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkListAdvertiserAssignedTargetingOptionsResponse>): void;
        bulkListAdvertiserAssignedTargetingOptions(params: Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkListAdvertiserAssignedTargetingOptionsResponse>): void;
        bulkListAdvertiserAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkListAdvertiserAssignedTargetingOptionsResponse>): void;
        /**
         * Creates a new advertiser. Returns the newly created advertiser if successful. This method can take up to 180 seconds to complete.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Advertiser>>;
        create(params: Params$Resource$Advertisers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Create, options: MethodOptions | BodyResponseCallback<Schema$Advertiser>, callback: BodyResponseCallback<Schema$Advertiser>): void;
        create(params: Params$Resource$Advertisers$Create, callback: BodyResponseCallback<Schema$Advertiser>): void;
        create(callback: BodyResponseCallback<Schema$Advertiser>): void;
        /**
         * Deletes an advertiser. Deleting an advertiser will delete all of its child resources, for example, campaigns, insertion orders and line items. A deleted advertiser cannot be recovered.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Advertiser>>;
        get(params: Params$Resource$Advertisers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Get, options: MethodOptions | BodyResponseCallback<Schema$Advertiser>, callback: BodyResponseCallback<Schema$Advertiser>): void;
        get(params: Params$Resource$Advertisers$Get, callback: BodyResponseCallback<Schema$Advertiser>): void;
        get(callback: BodyResponseCallback<Schema$Advertiser>): void;
        /**
         * Lists advertisers that are accessible to the current user. The order is defined by the order_by parameter. A single partner_id is required. Cross-partner listing is not supported.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAdvertisersResponse>>;
        list(params: Params$Resource$Advertisers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$List, options: MethodOptions | BodyResponseCallback<Schema$ListAdvertisersResponse>, callback: BodyResponseCallback<Schema$ListAdvertisersResponse>): void;
        list(params: Params$Resource$Advertisers$List, callback: BodyResponseCallback<Schema$ListAdvertisersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAdvertisersResponse>): void;
        /**
         * Updates an existing advertiser. Returns the updated advertiser if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Advertiser>>;
        patch(params: Params$Resource$Advertisers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Patch, options: MethodOptions | BodyResponseCallback<Schema$Advertiser>, callback: BodyResponseCallback<Schema$Advertiser>): void;
        patch(params: Params$Resource$Advertisers$Patch, callback: BodyResponseCallback<Schema$Advertiser>): void;
        patch(callback: BodyResponseCallback<Schema$Advertiser>): void;
    }
    export interface Params$Resource$Advertisers$Audit extends StandardParameters {
        /**
         * Required. The ID of the advertiser to audit.
         */
        advertiserId?: string;
        /**
         * Optional. The specific fields to return. If no mask is specified, all fields in the response proto will be filled. Valid values are: * usedLineItemsCount * usedInsertionOrdersCount * usedCampaignsCount * channelsCount * negativelyTargetedChannelsCount * negativeKeywordListsCount * adGroupCriteriaCount * campaignCriteriaCount
         */
        readMask?: string;
    }
    export interface Params$Resource$Advertisers$Bulkeditadvertiserassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditAdvertiserAssignedTargetingOptionsRequest;
    }
    export interface Params$Resource$Advertisers$Bulklistadvertiserassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=) operator`. Supported fields: * `targetingType` Examples: * targetingType with value TARGETING_TYPE_CHANNEL `targetingType="TARGETING_TYPE_CHANNEL"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `targetingType` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `targetingType desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. The size must be an integer between `1` and `5000`. If unspecified, the default is '5000'. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token that lets the client fetch the next page of results. Typically, this is the value of next_page_token returned from the previous call to `BulkListAdvertiserAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$Advertiser;
    }
    export interface Params$Resource$Advertisers$Delete extends StandardParameters {
        /**
         * The ID of the advertiser we need to delete.
         */
        advertiserId?: string;
    }
    export interface Params$Resource$Advertisers$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser to fetch.
         */
        advertiserId?: string;
    }
    export interface Params$Resource$Advertisers$List extends StandardParameters {
        /**
         * Allows filtering by advertiser fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. * A restriction has the form of `{field\} {operator\} {value\}`. * The `updateTime` field must use the `GREATER THAN OR EQUAL TO (\>=)` or `LESS THAN OR EQUAL TO (<=)` operators. * All other fields must use the `EQUALS (=)` operator. Supported fields: * `advertiserId` * `displayName` * `entityStatus` * `updateTime` (input in ISO 8601 format, or `YYYY-MM-DDTHH:MM:SSZ`) Examples: * All active advertisers under a partner: `entityStatus="ENTITY_STATUS_ACTIVE"` * All advertisers with an update time less than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime<="2020-11-04T18:54:47Z"` * All advertisers with an update time greater than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime\>="2020-11-04T18:54:47Z"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `entityStatus` * `updateTime` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListAdvertisers` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. The ID of the partner that the fetched advertisers should all belong to. The system only supports listing advertisers for one partner at a time.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Advertisers$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser. Assigned by the system.
         */
        advertiserId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Advertiser;
    }
    export class Resource$Advertisers$Assets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Uploads an asset. Returns the ID of the newly uploaded asset if successful. The asset file size should be no more than 10 MB for images, 200 MB for ZIP files, and 1 GB for videos. Must be used within the [multipart media upload process](/display-video/api/guides/how-tos/upload#multipart). Examples using provided client libraries can be found in our [Creating Creatives guide](/display-video/api/guides/creating-creatives/overview#upload_an_asset).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        upload(params: Params$Resource$Advertisers$Assets$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Advertisers$Assets$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CreateAssetResponse>>;
        upload(params: Params$Resource$Advertisers$Assets$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Advertisers$Assets$Upload, options: MethodOptions | BodyResponseCallback<Schema$CreateAssetResponse>, callback: BodyResponseCallback<Schema$CreateAssetResponse>): void;
        upload(params: Params$Resource$Advertisers$Assets$Upload, callback: BodyResponseCallback<Schema$CreateAssetResponse>): void;
        upload(callback: BodyResponseCallback<Schema$CreateAssetResponse>): void;
    }
    export interface Params$Resource$Advertisers$Assets$Upload extends StandardParameters {
        /**
         * Required. The ID of the advertiser this asset belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateAssetRequest;
        /**
         * Media metadata
         */
        media?: {
            /**
             * Media mime-type
             */
            mimeType?: string;
            /**
             * Media body contents
             */
            body?: any;
        };
    }
    export class Resource$Advertisers$Campaigns {
        context: APIRequestContext;
        targetingTypes: Resource$Advertisers$Campaigns$Targetingtypes;
        constructor(context: APIRequestContext);
        /**
         * Lists assigned targeting options of a campaign across targeting types.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkListCampaignAssignedTargetingOptions(params: Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkListCampaignAssignedTargetingOptions(params?: Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkListCampaignAssignedTargetingOptionsResponse>>;
        bulkListCampaignAssignedTargetingOptions(params: Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkListCampaignAssignedTargetingOptions(params: Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkListCampaignAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkListCampaignAssignedTargetingOptionsResponse>): void;
        bulkListCampaignAssignedTargetingOptions(params: Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkListCampaignAssignedTargetingOptionsResponse>): void;
        bulkListCampaignAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkListCampaignAssignedTargetingOptionsResponse>): void;
        /**
         * Creates a new campaign. Returns the newly created campaign if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Campaigns$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Campaigns$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Campaign>>;
        create(params: Params$Resource$Advertisers$Campaigns$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Campaigns$Create, options: MethodOptions | BodyResponseCallback<Schema$Campaign>, callback: BodyResponseCallback<Schema$Campaign>): void;
        create(params: Params$Resource$Advertisers$Campaigns$Create, callback: BodyResponseCallback<Schema$Campaign>): void;
        create(callback: BodyResponseCallback<Schema$Campaign>): void;
        /**
         * Permanently deletes a campaign. A deleted campaign cannot be recovered. The campaign should be archived first, i.e. set entity_status to `ENTITY_STATUS_ARCHIVED`, to be able to delete it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Campaigns$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Campaigns$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Campaigns$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Campaigns$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Campaigns$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a campaign.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Campaigns$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Campaigns$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Campaign>>;
        get(params: Params$Resource$Advertisers$Campaigns$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Campaigns$Get, options: MethodOptions | BodyResponseCallback<Schema$Campaign>, callback: BodyResponseCallback<Schema$Campaign>): void;
        get(params: Params$Resource$Advertisers$Campaigns$Get, callback: BodyResponseCallback<Schema$Campaign>): void;
        get(callback: BodyResponseCallback<Schema$Campaign>): void;
        /**
         * Lists campaigns in an advertiser. The order is defined by the order_by parameter. If a filter by entity_status is not specified, campaigns with `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Campaigns$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Campaigns$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCampaignsResponse>>;
        list(params: Params$Resource$Advertisers$Campaigns$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Campaigns$List, options: MethodOptions | BodyResponseCallback<Schema$ListCampaignsResponse>, callback: BodyResponseCallback<Schema$ListCampaignsResponse>): void;
        list(params: Params$Resource$Advertisers$Campaigns$List, callback: BodyResponseCallback<Schema$ListCampaignsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCampaignsResponse>): void;
        /**
         * Updates an existing campaign. Returns the updated campaign if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Campaigns$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Campaigns$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Campaign>>;
        patch(params: Params$Resource$Advertisers$Campaigns$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Campaigns$Patch, options: MethodOptions | BodyResponseCallback<Schema$Campaign>, callback: BodyResponseCallback<Schema$Campaign>): void;
        patch(params: Params$Resource$Advertisers$Campaigns$Patch, callback: BodyResponseCallback<Schema$Campaign>): void;
        patch(callback: BodyResponseCallback<Schema$Campaign>): void;
    }
    export interface Params$Resource$Advertisers$Campaigns$Bulklistcampaignassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the campaign to list assigned targeting options for.
         */
        campaignId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `targetingType` * `inheritance` Examples: * `AssignedTargetingOption` resources of targeting type `TARGETING_TYPE_LANGUAGE` or `TARGETING_TYPE_GENDER`: `targetingType="TARGETING_TYPE_LANGUAGE" OR targetingType="TARGETING_TYPE_GENDER"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER`: `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `targetingType` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `targetingType desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. The size must be an integer between `1` and `5000`. If unspecified, the default is `5000`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token that lets the client fetch the next page of results. Typically, this is the value of next_page_token returned from the previous call to `BulkListCampaignAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Campaigns$Create extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Campaign;
    }
    export interface Params$Resource$Advertisers$Campaigns$Delete extends StandardParameters {
        /**
         * The ID of the advertiser this campaign belongs to.
         */
        advertiserId?: string;
        /**
         * The ID of the campaign we need to delete.
         */
        campaignId?: string;
    }
    export interface Params$Resource$Advertisers$Campaigns$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser this campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the campaign to fetch.
         */
        campaignId?: string;
    }
    export interface Params$Resource$Advertisers$Campaigns$List extends StandardParameters {
        /**
         * The ID of the advertiser to list campaigns for.
         */
        advertiserId?: string;
        /**
         * Allows filtering by campaign fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `updateTime` field must use the `GREATER THAN OR EQUAL TO (\>=)` or `LESS THAN OR EQUAL TO (<=)` operators. * All other fields must use the `EQUALS (=)` operator. Supported fields: * `campaignId` * `displayName` * `entityStatus` * `updateTime` (input in ISO 8601 format, or `YYYY-MM-DDTHH:MM:SSZ`) Examples: * All `ENTITY_STATUS_ACTIVE` or `ENTITY_STATUS_PAUSED` campaigns under an advertiser: `(entityStatus="ENTITY_STATUS_ACTIVE" OR entityStatus="ENTITY_STATUS_PAUSED")` * All campaigns with an update time less than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime<="2020-11-04T18:54:47Z"` * All campaigns with an update time greater than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime\>="2020-11-04T18:54:47Z"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `entityStatus` * `updateTime` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCampaigns` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Campaigns$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the campaign. Assigned by the system.
         */
        campaignId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Campaign;
    }
    export class Resource$Advertisers$Campaigns$Targetingtypes {
        context: APIRequestContext;
        assignedTargetingOptions: Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a single targeting option assigned to a campaign.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        get(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Lists the targeting options assigned to a campaign for a specified targeting type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCampaignAssignedTargetingOptionsResponse>>;
        list(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListCampaignAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListCampaignAssignedTargetingOptionsResponse>): void;
        list(params: Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List, callback: BodyResponseCallback<Schema$ListCampaignAssignedTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCampaignAssignedTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Required. An identifier unique to the targeting type in this campaign that identifies the assigned targeting option being requested.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the campaign the assigned targeting option belongs to.
         */
        campaignId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Campaigns$Targetingtypes$Assignedtargetingoptions$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser the campaign belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the campaign to list assigned targeting options for.
         */
        campaignId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedTargetingOptionId` * `inheritance` Examples: * `AssignedTargetingOption` resources with ID 1 or 2 `assignedTargetingOptionId="1" OR assignedTargetingOptionId="2"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER` `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedTargetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `assignedTargetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `5000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCampaignAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. Identifies the type of assigned targeting options to list. Supported targeting types: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
    }
    export class Resource$Advertisers$Channels {
        context: APIRequestContext;
        sites: Resource$Advertisers$Channels$Sites;
        constructor(context: APIRequestContext);
        /**
         * Creates a new channel. Returns the newly created channel if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Channels$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Channels$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        create(params: Params$Resource$Advertisers$Channels$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Channels$Create, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        create(params: Params$Resource$Advertisers$Channels$Create, callback: BodyResponseCallback<Schema$Channel>): void;
        create(callback: BodyResponseCallback<Schema$Channel>): void;
        /**
         * Gets a channel for a partner or advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Channels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Channels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        get(params: Params$Resource$Advertisers$Channels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Channels$Get, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        get(params: Params$Resource$Advertisers$Channels$Get, callback: BodyResponseCallback<Schema$Channel>): void;
        get(callback: BodyResponseCallback<Schema$Channel>): void;
        /**
         * Lists channels for a partner or advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Channels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Channels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListChannelsResponse>>;
        list(params: Params$Resource$Advertisers$Channels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Channels$List, options: MethodOptions | BodyResponseCallback<Schema$ListChannelsResponse>, callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        list(params: Params$Resource$Advertisers$Channels$List, callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        /**
         * Updates a channel. Returns the updated channel if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Channels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Channels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        patch(params: Params$Resource$Advertisers$Channels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Channels$Patch, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        patch(params: Params$Resource$Advertisers$Channels$Patch, callback: BodyResponseCallback<Schema$Channel>): void;
        patch(callback: BodyResponseCallback<Schema$Channel>): void;
    }
    export interface Params$Resource$Advertisers$Channels$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the created channel.
         */
        advertiserId?: string;
        /**
         * The ID of the partner that owns the created channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export interface Params$Resource$Advertisers$Channels$Get extends StandardParameters {
        /**
         * The ID of the advertiser that owns the fetched channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the channel to fetch.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the fetched channel.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Advertisers$Channels$List extends StandardParameters {
        /**
         * The ID of the advertiser that owns the channels.
         */
        advertiserId?: string;
        /**
         * Allows filtering by channel fields. Supported syntax: * Filter expressions for channel can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All channels for which the display name contains "google": `displayName : "google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `channelId` The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListChannels` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that owns the channels.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Advertisers$Channels$Patch extends StandardParameters {
        /**
         * The ID of the advertiser that owns the created channel.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the channel. Assigned by the system.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the created channel.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export class Resource$Advertisers$Channels$Sites {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits sites under a single channel. The operation will delete the sites provided in BulkEditSitesRequest.deleted_sites and then create the sites provided in BulkEditSitesRequest.created_sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEdit(params: Params$Resource$Advertisers$Channels$Sites$Bulkedit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEdit(params?: Params$Resource$Advertisers$Channels$Sites$Bulkedit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditSitesResponse>>;
        bulkEdit(params: Params$Resource$Advertisers$Channels$Sites$Bulkedit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEdit(params: Params$Resource$Advertisers$Channels$Sites$Bulkedit, options: MethodOptions | BodyResponseCallback<Schema$BulkEditSitesResponse>, callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        bulkEdit(params: Params$Resource$Advertisers$Channels$Sites$Bulkedit, callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        bulkEdit(callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        /**
         * Creates a site in a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Channels$Sites$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Channels$Sites$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Site>>;
        create(params: Params$Resource$Advertisers$Channels$Sites$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Channels$Sites$Create, options: MethodOptions | BodyResponseCallback<Schema$Site>, callback: BodyResponseCallback<Schema$Site>): void;
        create(params: Params$Resource$Advertisers$Channels$Sites$Create, callback: BodyResponseCallback<Schema$Site>): void;
        create(callback: BodyResponseCallback<Schema$Site>): void;
        /**
         * Deletes a site from a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Channels$Sites$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Channels$Sites$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Channels$Sites$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Channels$Sites$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Channels$Sites$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists sites in a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Channels$Sites$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Channels$Sites$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSitesResponse>>;
        list(params: Params$Resource$Advertisers$Channels$Sites$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Channels$Sites$List, options: MethodOptions | BodyResponseCallback<Schema$ListSitesResponse>, callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        list(params: Params$Resource$Advertisers$Channels$Sites$List, callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        /**
         * Replaces all of the sites under a single channel. The operation will replace the sites under a channel with the sites provided in ReplaceSitesRequest.new_sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        replace(params: Params$Resource$Advertisers$Channels$Sites$Replace, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        replace(params?: Params$Resource$Advertisers$Channels$Sites$Replace, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReplaceSitesResponse>>;
        replace(params: Params$Resource$Advertisers$Channels$Sites$Replace, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        replace(params: Params$Resource$Advertisers$Channels$Sites$Replace, options: MethodOptions | BodyResponseCallback<Schema$ReplaceSitesResponse>, callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
        replace(params: Params$Resource$Advertisers$Channels$Sites$Replace, callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
        replace(callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
    }
    export interface Params$Resource$Advertisers$Channels$Sites$Bulkedit extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel to which the sites belong.
         */
        channelId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditSitesRequest;
    }
    export interface Params$Resource$Advertisers$Channels$Sites$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel in which the site will be created.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Site;
    }
    export interface Params$Resource$Advertisers$Channels$Sites$Delete extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel to which the site belongs.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Required. The URL or app ID of the site to delete.
         */
        urlOrAppId?: string;
    }
    export interface Params$Resource$Advertisers$Channels$Sites$List extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel to which the requested sites belong.
         */
        channelId?: string;
        /**
         * Allows filtering by site fields. Supported syntax: * Filter expressions for site retrieval can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `urlOrAppId` Examples: * All sites for which the URL or app ID contains "google": `urlOrAppId : "google"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `urlOrAppId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `urlOrAppId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `10000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListSites` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Advertisers$Channels$Sites$Replace extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel whose sites will be replaced.
         */
        channelId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReplaceSitesRequest;
    }
    export class Resource$Advertisers$Creatives {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new creative. Returns the newly created creative if successful. A ["Standard" user role](//support.google.com/displayvideo/answer/2723011) or greater for the parent advertiser or partner is required to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Creatives$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Creatives$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        create(params: Params$Resource$Advertisers$Creatives$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Creatives$Create, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        create(params: Params$Resource$Advertisers$Creatives$Create, callback: BodyResponseCallback<Schema$Creative>): void;
        create(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Deletes a creative. Returns error code `NOT_FOUND` if the creative does not exist. The creative should be archived first, i.e. set entity_status to `ENTITY_STATUS_ARCHIVED`, before it can be deleted. A ["Standard" user role](//support.google.com/displayvideo/answer/2723011) or greater for the parent advertiser or partner is required to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Creatives$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Creatives$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Creatives$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Creatives$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Creatives$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a creative.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Creatives$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Creatives$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        get(params: Params$Resource$Advertisers$Creatives$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Creatives$Get, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        get(params: Params$Resource$Advertisers$Creatives$Get, callback: BodyResponseCallback<Schema$Creative>): void;
        get(callback: BodyResponseCallback<Schema$Creative>): void;
        /**
         * Lists creatives in an advertiser. The order is defined by the order_by parameter. If a filter by entity_status is not specified, creatives with `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Creatives$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Creatives$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCreativesResponse>>;
        list(params: Params$Resource$Advertisers$Creatives$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Creatives$List, options: MethodOptions | BodyResponseCallback<Schema$ListCreativesResponse>, callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        list(params: Params$Resource$Advertisers$Creatives$List, callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCreativesResponse>): void;
        /**
         * Updates an existing creative. Returns the updated creative if successful. A ["Standard" user role](//support.google.com/displayvideo/answer/2723011) or greater for the parent advertiser or partner is required to make this request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Creatives$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Creatives$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Creative>>;
        patch(params: Params$Resource$Advertisers$Creatives$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Creatives$Patch, options: MethodOptions | BodyResponseCallback<Schema$Creative>, callback: BodyResponseCallback<Schema$Creative>): void;
        patch(params: Params$Resource$Advertisers$Creatives$Patch, callback: BodyResponseCallback<Schema$Creative>): void;
        patch(callback: BodyResponseCallback<Schema$Creative>): void;
    }
    export interface Params$Resource$Advertisers$Creatives$Create extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the creative belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Creative;
    }
    export interface Params$Resource$Advertisers$Creatives$Delete extends StandardParameters {
        /**
         * The ID of the advertiser this creative belongs to.
         */
        advertiserId?: string;
        /**
         * The ID of the creative to be deleted.
         */
        creativeId?: string;
    }
    export interface Params$Resource$Advertisers$Creatives$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser this creative belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the creative to fetch.
         */
        creativeId?: string;
    }
    export interface Params$Resource$Advertisers$Creatives$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser to list creatives for.
         */
        advertiserId?: string;
        /**
         * Allows filtering by creative fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `lineItemIds` field must use the `HAS (:)` operator. * The `updateTime` field must use the `GREATER THAN OR EQUAL TO (\>=)` or `LESS THAN OR EQUAL TO (<=)` operators. * All other fields must use the `EQUALS (=)` operator. * For `entityStatus`, `minDuration`, `maxDuration`, `updateTime`, and `dynamic` fields, there may be at most one restriction. Supported Fields: * `approvalStatus` * `creativeId` * `creativeType` * `dimensions` (input in the form of `{width\}x{height\}`) * `dynamic` * `entityStatus` * `exchangeReviewStatus` (input in the form of `{exchange\}-{reviewStatus\}`) * `lineItemIds` * `maxDuration` (input in the form of `{duration\}s`. Only seconds are supported) * `minDuration` (input in the form of `{duration\}s`. Only seconds are supported) * `updateTime` (input in ISO 8601 format, or `YYYY-MM-DDTHH:MM:SSZ`) Notes: * For `updateTime`, a creative resource's field value reflects the last time that a creative has been updated, which includes updates made by the system (e.g. creative review updates). Examples: * All native creatives: `creativeType="CREATIVE_TYPE_NATIVE"` * All active creatives with 300x400 or 50x100 dimensions: `entityStatus="ENTITY_STATUS_ACTIVE" AND (dimensions="300x400" OR dimensions="50x100")` * All dynamic creatives that are approved by AdX or AppNexus, with a minimum duration of 5 seconds and 200ms: `dynamic="true" AND minDuration="5.2s" AND (exchangeReviewStatus="EXCHANGE_GOOGLE_AD_MANAGER-REVIEW_STATUS_APPROVED" OR exchangeReviewStatus="EXCHANGE_APPNEXUS-REVIEW_STATUS_APPROVED")` * All video creatives that are associated with line item ID 1 or 2: `creativeType="CREATIVE_TYPE_VIDEO" AND (lineItemIds:1 OR lineItemIds:2)` * Find creatives by multiple creative IDs: `creativeId=1 OR creativeId=2` * All creatives with an update time greater than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime\>="2020-11-04T18:54:47Z"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `creativeId` (default) * `createTime` * `mediaDuration` * `dimensions` (sorts by width first, then by height) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `createTime desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCreatives` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Creatives$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the creative belongs to.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the creative. Assigned by the system.
         */
        creativeId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Creative;
    }
    export class Resource$Advertisers$Insertionorders {
        context: APIRequestContext;
        targetingTypes: Resource$Advertisers$Insertionorders$Targetingtypes;
        constructor(context: APIRequestContext);
        /**
         * Lists assigned targeting options of an insertion order across targeting types.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkListInsertionOrderAssignedTargetingOptions(params: Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkListInsertionOrderAssignedTargetingOptions(params?: Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse>>;
        bulkListInsertionOrderAssignedTargetingOptions(params: Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkListInsertionOrderAssignedTargetingOptions(params: Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse>): void;
        bulkListInsertionOrderAssignedTargetingOptions(params: Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse>): void;
        bulkListInsertionOrderAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkListInsertionOrderAssignedTargetingOptionsResponse>): void;
        /**
         * Creates a new insertion order. Returns the newly created insertion order if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Insertionorders$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Insertionorders$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InsertionOrder>>;
        create(params: Params$Resource$Advertisers$Insertionorders$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Insertionorders$Create, options: MethodOptions | BodyResponseCallback<Schema$InsertionOrder>, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        create(params: Params$Resource$Advertisers$Insertionorders$Create, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        create(callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        /**
         * Deletes an insertion order. Returns error code `NOT_FOUND` if the insertion order does not exist. The insertion order should be archived first, i.e. set entity_status to `ENTITY_STATUS_ARCHIVED`, to be able to delete it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Insertionorders$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Insertionorders$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Insertionorders$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Insertionorders$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Insertionorders$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an insertion order. Returns error code `NOT_FOUND` if the insertion order does not exist.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Insertionorders$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Insertionorders$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InsertionOrder>>;
        get(params: Params$Resource$Advertisers$Insertionorders$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Insertionorders$Get, options: MethodOptions | BodyResponseCallback<Schema$InsertionOrder>, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        get(params: Params$Resource$Advertisers$Insertionorders$Get, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        get(callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        /**
         * Lists insertion orders in an advertiser. The order is defined by the order_by parameter. If a filter by entity_status is not specified, insertion orders with `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Insertionorders$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Insertionorders$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInsertionOrdersResponse>>;
        list(params: Params$Resource$Advertisers$Insertionorders$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Insertionorders$List, options: MethodOptions | BodyResponseCallback<Schema$ListInsertionOrdersResponse>, callback: BodyResponseCallback<Schema$ListInsertionOrdersResponse>): void;
        list(params: Params$Resource$Advertisers$Insertionorders$List, callback: BodyResponseCallback<Schema$ListInsertionOrdersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInsertionOrdersResponse>): void;
        /**
         * Updates an existing insertion order. Returns the updated insertion order if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Insertionorders$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Insertionorders$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InsertionOrder>>;
        patch(params: Params$Resource$Advertisers$Insertionorders$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Insertionorders$Patch, options: MethodOptions | BodyResponseCallback<Schema$InsertionOrder>, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        patch(params: Params$Resource$Advertisers$Insertionorders$Patch, callback: BodyResponseCallback<Schema$InsertionOrder>): void;
        patch(callback: BodyResponseCallback<Schema$InsertionOrder>): void;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Bulklistinsertionorderassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `targetingType` * `inheritance` Examples: * `AssignedTargetingOption` resources of targeting type `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` or `TARGETING_TYPE_CHANNEL`: `targetingType="TARGETING_TYPE_PROXIMITY_LOCATION_LIST" OR targetingType="TARGETING_TYPE_CHANNEL"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER`: `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the insertion order to list assigned targeting options for.
         */
        insertionOrderId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `targetingType` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `targetingType desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. The size must be an integer between `1` and `5000`. If unspecified, the default is `5000`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token that lets the client fetch the next page of results. Typically, this is the value of next_page_token returned from the previous call to `BulkListInsertionOrderAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Create extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InsertionOrder;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Delete extends StandardParameters {
        /**
         * The ID of the advertiser this insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * The ID of the insertion order to delete.
         */
        insertionOrderId?: string;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser this insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the insertion order to fetch.
         */
        insertionOrderId?: string;
    }
    export interface Params$Resource$Advertisers$Insertionorders$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser to list insertion orders for.
         */
        advertiserId?: string;
        /**
         * Allows filtering by insertion order fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `updateTime` field must use the `GREATER THAN OR EQUAL TO (\>=)` or `LESS THAN OR EQUAL TO (<=)` operators. * All other fields must use the `EQUALS (=)` operator. Supported fields: * `campaignId` * `displayName` * `entityStatus` * `updateTime` (input in ISO 8601 format, or `YYYY-MM-DDTHH:MM:SSZ`) Examples: * All insertion orders under a campaign: `campaignId="1234"` * All `ENTITY_STATUS_ACTIVE` or `ENTITY_STATUS_PAUSED` insertion orders under an advertiser: `(entityStatus="ENTITY_STATUS_ACTIVE" OR entityStatus="ENTITY_STATUS_PAUSED")` * All insertion orders with an update time less than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime<="2020-11-04T18:54:47Z"` * All insertion orders with an update time greater than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime\>="2020-11-04T18:54:47Z"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * "displayName" (default) * "entityStatus" * "updateTime" The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `100`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListInsertionOrders` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the insertion order. Assigned by the system.
         */
        insertionOrderId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InsertionOrder;
    }
    export class Resource$Advertisers$Insertionorders$Targetingtypes {
        context: APIRequestContext;
        assignedTargetingOptions: Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a single targeting option assigned to an insertion order.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        get(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Lists the targeting options assigned to an insertion order.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInsertionOrderAssignedTargetingOptionsResponse>>;
        list(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListInsertionOrderAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListInsertionOrderAssignedTargetingOptionsResponse>): void;
        list(params: Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List, callback: BodyResponseCallback<Schema$ListInsertionOrderAssignedTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInsertionOrderAssignedTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Required. An identifier unique to the targeting type in this insertion order that identifies the assigned targeting option being requested.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the insertion order the assigned targeting option belongs to.
         */
        insertionOrderId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Insertionorders$Targetingtypes$Assignedtargetingoptions$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser the insertion order belongs to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedTargetingOptionId` * `inheritance` Examples: * `AssignedTargetingOption` resources with ID 1 or 2: `assignedTargetingOptionId="1" OR assignedTargetingOptionId="2"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER`: `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the insertion order to list assigned targeting options for.
         */
        insertionOrderId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedTargetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `assignedTargetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `5000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListInsertionOrderAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. Identifies the type of assigned targeting options to list. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
    }
    export class Resource$Advertisers$Invoices {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists invoices posted for an advertiser in a given month. Invoices generated by billing profiles with a "Partner" invoice level are not retrievable through this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Invoices$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Invoices$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInvoicesResponse>>;
        list(params: Params$Resource$Advertisers$Invoices$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Invoices$List, options: MethodOptions | BodyResponseCallback<Schema$ListInvoicesResponse>, callback: BodyResponseCallback<Schema$ListInvoicesResponse>): void;
        list(params: Params$Resource$Advertisers$Invoices$List, callback: BodyResponseCallback<Schema$ListInvoicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInvoicesResponse>): void;
        /**
         * Retrieves the invoice currency used by an advertiser in a given month.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookupInvoiceCurrency(params: Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookupInvoiceCurrency(params?: Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LookupInvoiceCurrencyResponse>>;
        lookupInvoiceCurrency(params: Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookupInvoiceCurrency(params: Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency, options: MethodOptions | BodyResponseCallback<Schema$LookupInvoiceCurrencyResponse>, callback: BodyResponseCallback<Schema$LookupInvoiceCurrencyResponse>): void;
        lookupInvoiceCurrency(params: Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency, callback: BodyResponseCallback<Schema$LookupInvoiceCurrencyResponse>): void;
        lookupInvoiceCurrency(callback: BodyResponseCallback<Schema$LookupInvoiceCurrencyResponse>): void;
    }
    export interface Params$Resource$Advertisers$Invoices$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser to list invoices for.
         */
        advertiserId?: string;
        /**
         * The month to list the invoices for. If not set, the request will retrieve invoices for the previous month. Must be in the format YYYYMM.
         */
        issueMonth?: string;
        /**
         * Select type of invoice to retrieve for Loi Sapin advertisers. Only applicable to Loi Sapin advertisers. Will be ignored otherwise.
         */
        loiSapinInvoiceType?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListInvoices` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Invoices$Lookupinvoicecurrency extends StandardParameters {
        /**
         * Required. The ID of the advertiser to lookup currency for.
         */
        advertiserId?: string;
        /**
         * Month for which the currency is needed. If not set, the request will return existing currency settings for the advertiser. Must be in the format YYYYMM.
         */
        invoiceMonth?: string;
    }
    export class Resource$Advertisers$Lineitems {
        context: APIRequestContext;
        targetingTypes: Resource$Advertisers$Lineitems$Targetingtypes;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits targeting options under a single line item. The operation will delete the assigned targeting options provided in BulkEditLineItemAssignedTargetingOptionsRequest.delete_requests and then create the assigned targeting options provided in BulkEditLineItemAssignedTargetingOptionsRequest.create_requests. Requests to this endpoint cannot be made concurrently with the following requests updating the same line item: * lineItems.patch * assignedTargetingOptions.create * assignedTargetingOptions.delete YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEditLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEditLineItemAssignedTargetingOptions(params?: Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditLineItemAssignedTargetingOptionsResponse>>;
        bulkEditLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEditLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkEditLineItemAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkEditLineItemAssignedTargetingOptionsResponse>): void;
        bulkEditLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkEditLineItemAssignedTargetingOptionsResponse>): void;
        bulkEditLineItemAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkEditLineItemAssignedTargetingOptionsResponse>): void;
        /**
         * Lists assigned targeting options of a line item across targeting types.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkListLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkListLineItemAssignedTargetingOptions(params?: Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkListLineItemAssignedTargetingOptionsResponse>>;
        bulkListLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkListLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkListLineItemAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkListLineItemAssignedTargetingOptionsResponse>): void;
        bulkListLineItemAssignedTargetingOptions(params: Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkListLineItemAssignedTargetingOptionsResponse>): void;
        bulkListLineItemAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkListLineItemAssignedTargetingOptionsResponse>): void;
        /**
         * Creates a new line item. Returns the newly created line item if successful. YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Lineitems$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Lineitems$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LineItem>>;
        create(params: Params$Resource$Advertisers$Lineitems$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Lineitems$Create, options: MethodOptions | BodyResponseCallback<Schema$LineItem>, callback: BodyResponseCallback<Schema$LineItem>): void;
        create(params: Params$Resource$Advertisers$Lineitems$Create, callback: BodyResponseCallback<Schema$LineItem>): void;
        create(callback: BodyResponseCallback<Schema$LineItem>): void;
        /**
         * Deletes a line item. Returns error code `NOT_FOUND` if the line item does not exist. The line item should be archived first, i.e. set entity_status to `ENTITY_STATUS_ARCHIVED`, to be able to delete it. YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Lineitems$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Lineitems$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Lineitems$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Lineitems$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Lineitems$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Creates a new line item with settings (including targeting) inherited from the insertion order and an `ENTITY_STATUS_DRAFT` entity_status. Returns the newly created line item if successful. There are default values based on the three fields: * The insertion order's insertion_order_type * The insertion order's automation_type * The given line_item_type YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateDefault(params: Params$Resource$Advertisers$Lineitems$Generatedefault, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateDefault(params?: Params$Resource$Advertisers$Lineitems$Generatedefault, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LineItem>>;
        generateDefault(params: Params$Resource$Advertisers$Lineitems$Generatedefault, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateDefault(params: Params$Resource$Advertisers$Lineitems$Generatedefault, options: MethodOptions | BodyResponseCallback<Schema$LineItem>, callback: BodyResponseCallback<Schema$LineItem>): void;
        generateDefault(params: Params$Resource$Advertisers$Lineitems$Generatedefault, callback: BodyResponseCallback<Schema$LineItem>): void;
        generateDefault(callback: BodyResponseCallback<Schema$LineItem>): void;
        /**
         * Gets a line item.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Lineitems$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Lineitems$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LineItem>>;
        get(params: Params$Resource$Advertisers$Lineitems$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Lineitems$Get, options: MethodOptions | BodyResponseCallback<Schema$LineItem>, callback: BodyResponseCallback<Schema$LineItem>): void;
        get(params: Params$Resource$Advertisers$Lineitems$Get, callback: BodyResponseCallback<Schema$LineItem>): void;
        get(callback: BodyResponseCallback<Schema$LineItem>): void;
        /**
         * Lists line items in an advertiser. The order is defined by the order_by parameter. If a filter by entity_status is not specified, line items with `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Lineitems$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Lineitems$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLineItemsResponse>>;
        list(params: Params$Resource$Advertisers$Lineitems$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Lineitems$List, options: MethodOptions | BodyResponseCallback<Schema$ListLineItemsResponse>, callback: BodyResponseCallback<Schema$ListLineItemsResponse>): void;
        list(params: Params$Resource$Advertisers$Lineitems$List, callback: BodyResponseCallback<Schema$ListLineItemsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLineItemsResponse>): void;
        /**
         * Updates an existing line item. Returns the updated line item if successful. Requests to this endpoint cannot be made concurrently with the following requests updating the same line item: * BulkEditAssignedTargetingOptions * BulkUpdateLineItems * assignedTargetingOptions.create * assignedTargetingOptions.delete YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Lineitems$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Lineitems$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LineItem>>;
        patch(params: Params$Resource$Advertisers$Lineitems$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Lineitems$Patch, options: MethodOptions | BodyResponseCallback<Schema$LineItem>, callback: BodyResponseCallback<Schema$LineItem>): void;
        patch(params: Params$Resource$Advertisers$Lineitems$Patch, callback: BodyResponseCallback<Schema$LineItem>): void;
        patch(callback: BodyResponseCallback<Schema$LineItem>): void;
    }
    export interface Params$Resource$Advertisers$Lineitems$Bulkeditlineitemassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the line item the assigned targeting option will belong to.
         */
        lineItemId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditLineItemAssignedTargetingOptionsRequest;
    }
    export interface Params$Resource$Advertisers$Lineitems$Bulklistlineitemassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `targetingType` * `inheritance` Examples: * `AssignedTargetingOption` resources of targeting type `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` or `TARGETING_TYPE_CHANNEL`: `targetingType="TARGETING_TYPE_PROXIMITY_LOCATION_LIST" OR targetingType="TARGETING_TYPE_CHANNEL"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER`: `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the line item to list assigned targeting options for.
         */
        lineItemId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `targetingType` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `targetingType desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. The size must be an integer between `1` and `5000`. If unspecified, the default is `5000`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token that lets the client fetch the next page of results. Typically, this is the value of next_page_token returned from the previous call to `BulkListLineItemAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$Create extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LineItem;
    }
    export interface Params$Resource$Advertisers$Lineitems$Delete extends StandardParameters {
        /**
         * The ID of the advertiser this line item belongs to.
         */
        advertiserId?: string;
        /**
         * The ID of the line item to delete.
         */
        lineItemId?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$Generatedefault extends StandardParameters {
        /**
         * Required. The ID of the advertiser this line item belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GenerateDefaultLineItemRequest;
    }
    export interface Params$Resource$Advertisers$Lineitems$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser this line item belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the line item to fetch.
         */
        lineItemId?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser to list line items for.
         */
        advertiserId?: string;
        /**
         * Allows filtering by line item fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `updateTime` field must use the `GREATER THAN OR EQUAL TO (\>=)` or `LESS THAN OR EQUAL TO (<=)` operators. * All other fields must use the `EQUALS (=)` operator. Supported fields: * `campaignId` * `displayName` * `entityStatus` * `insertionOrderId` * `lineItemId` * `lineItemType` * `updateTime` (input in ISO 8601 format, or `YYYY-MM-DDTHH:MM:SSZ`) Examples: * All line items under an insertion order: `insertionOrderId="1234"` * All `ENTITY_STATUS_ACTIVE` or `ENTITY_STATUS_PAUSED` and `LINE_ITEM_TYPE_DISPLAY_DEFAULT` line items under an advertiser: `(entityStatus="ENTITY_STATUS_ACTIVE" OR entityStatus="ENTITY_STATUS_PAUSED") AND lineItemType="LINE_ITEM_TYPE_DISPLAY_DEFAULT"` * All line items with an update time less than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime<="2020-11-04T18:54:47Z"` * All line items with an update time greater than or equal to 2020-11-04T18:54:47Z (format of ISO 8601): `updateTime\>="2020-11-04T18:54:47Z"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `entityStatus` * `updateTime` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListLineItems` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the line item. Assigned by the system.
         */
        lineItemId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LineItem;
    }
    export class Resource$Advertisers$Lineitems$Targetingtypes {
        context: APIRequestContext;
        assignedTargetingOptions: Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Assigns a targeting option to a line item. Returns the assigned targeting option if successful. Requests to this endpoint cannot be made concurrently with the following requests updating the same line item: * lineItems.bulkEditAssignedTargetingOptions * lineItems.bulkUpdate * lineItems.patch * DeleteLineItemAssignedTargetingOption YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        create(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Deletes an assigned targeting option from a line item. Requests to this endpoint cannot be made concurrently with the following requests updating the same line item: * lineItems.bulkEditAssignedTargetingOptions * lineItems.bulkUpdate * lineItems.patch * CreateLineItemAssignedTargetingOption YouTube & Partners line items cannot be created or updated using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a single targeting option assigned to a line item.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        get(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Lists the targeting options assigned to a line item.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLineItemAssignedTargetingOptionsResponse>>;
        list(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListLineItemAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListLineItemAssignedTargetingOptionsResponse>): void;
        list(params: Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List, callback: BodyResponseCallback<Schema$ListLineItemAssignedTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLineItemAssignedTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Create extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the line item the assigned targeting option will belong to.
         */
        lineItemId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AssignedTargetingOption;
    }
    export interface Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Delete extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the assigned targeting option to delete.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the line item the assigned targeting option belongs to.
         */
        lineItemId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Required. An identifier unique to the targeting type in this line item that identifies the assigned targeting option being requested.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the line item the assigned targeting option belongs to.
         */
        lineItemId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY` * `TARGETING_TYPE_YOUTUBE_CHANNEL` (only for `LINE_ITEM_TYPE_YOUTUBE_AND_PARTNERS_VIDEO_SEQUENCE` line items) * `TARGETING_TYPE_YOUTUBE_VIDEO` (only for `LINE_ITEM_TYPE_YOUTUBE_AND_PARTNERS_VIDEO_SEQUENCE` line items)
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Lineitems$Targetingtypes$Assignedtargetingoptions$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser the line item belongs to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedTargetingOptionId` * `inheritance` Examples: * `AssignedTargetingOption` resources with ID 1 or 2: `assignedTargetingOptionId="1" OR assignedTargetingOptionId="2"` * `AssignedTargetingOption` resources with inheritance status of `NOT_INHERITED` or `INHERITED_FROM_PARTNER`: `inheritance="NOT_INHERITED" OR inheritance="INHERITED_FROM_PARTNER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the line item to list assigned targeting options for.
         */
        lineItemId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedTargetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `assignedTargetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `5000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListLineItemAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. Identifies the type of assigned targeting options to list. Supported targeting types include: * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_APP` * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AUDIENCE_GROUP` * `TARGETING_TYPE_AUDIO_CONTENT_TYPE` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_BUSINESS_CHAIN` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_CONTENT_DURATION` * `TARGETING_TYPE_CONTENT_GENRE` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_STREAM_TYPE` * `TARGETING_TYPE_DAY_AND_TIME` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_INVENTORY_SOURCE` * `TARGETING_TYPE_INVENTORY_SOURCE_GROUP` * `TARGETING_TYPE_KEYWORD` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_NEGATIVE_KEYWORD_LIST` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_PROXIMITY_LOCATION_LIST` * `TARGETING_TYPE_REGIONAL_LOCATION_LIST` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_THIRD_PARTY_VERIFIER` * `TARGETING_TYPE_URL` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_VIEWABILITY` * `TARGETING_TYPE_YOUTUBE_CHANNEL` (only for `LINE_ITEM_TYPE_YOUTUBE_AND_PARTNERS_VIDEO_SEQUENCE` line items) * `TARGETING_TYPE_YOUTUBE_VIDEO` (only for `LINE_ITEM_TYPE_YOUTUBE_AND_PARTNERS_VIDEO_SEQUENCE` line items)
         */
        targetingType?: string;
    }
    export class Resource$Advertisers$Locationlists {
        context: APIRequestContext;
        assignedLocations: Resource$Advertisers$Locationlists$Assignedlocations;
        constructor(context: APIRequestContext);
        /**
         * Creates a new location list. Returns the newly created location list if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Locationlists$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Locationlists$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LocationList>>;
        create(params: Params$Resource$Advertisers$Locationlists$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Locationlists$Create, options: MethodOptions | BodyResponseCallback<Schema$LocationList>, callback: BodyResponseCallback<Schema$LocationList>): void;
        create(params: Params$Resource$Advertisers$Locationlists$Create, callback: BodyResponseCallback<Schema$LocationList>): void;
        create(callback: BodyResponseCallback<Schema$LocationList>): void;
        /**
         * Gets a location list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Locationlists$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Locationlists$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LocationList>>;
        get(params: Params$Resource$Advertisers$Locationlists$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Locationlists$Get, options: MethodOptions | BodyResponseCallback<Schema$LocationList>, callback: BodyResponseCallback<Schema$LocationList>): void;
        get(params: Params$Resource$Advertisers$Locationlists$Get, callback: BodyResponseCallback<Schema$LocationList>): void;
        get(callback: BodyResponseCallback<Schema$LocationList>): void;
        /**
         * Lists location lists based on a given advertiser id.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Locationlists$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Locationlists$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationListsResponse>>;
        list(params: Params$Resource$Advertisers$Locationlists$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Locationlists$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationListsResponse>, callback: BodyResponseCallback<Schema$ListLocationListsResponse>): void;
        list(params: Params$Resource$Advertisers$Locationlists$List, callback: BodyResponseCallback<Schema$ListLocationListsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationListsResponse>): void;
        /**
         * Updates a location list. Returns the updated location list if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Locationlists$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Locationlists$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LocationList>>;
        patch(params: Params$Resource$Advertisers$Locationlists$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Locationlists$Patch, options: MethodOptions | BodyResponseCallback<Schema$LocationList>, callback: BodyResponseCallback<Schema$LocationList>): void;
        patch(params: Params$Resource$Advertisers$Locationlists$Patch, callback: BodyResponseCallback<Schema$LocationList>): void;
        patch(callback: BodyResponseCallback<Schema$LocationList>): void;
    }
    export interface Params$Resource$Advertisers$Locationlists$Create extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location list belongs.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LocationList;
    }
    export interface Params$Resource$Advertisers$Locationlists$Get extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the fetched location list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the location list to fetch.
         */
        locationListId?: string;
    }
    export interface Params$Resource$Advertisers$Locationlists$List extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the fetched location lists belong.
         */
        advertiserId?: string;
        /**
         * Allows filtering by location list fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `locationType` Examples: * All regional location list: `locationType="TARGETING_LOCATION_TYPE_REGIONAL"` * All proximity location list: `locationType="TARGETING_LOCATION_TYPE_PROXIMITY"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `locationListId` (default) * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. Defaults to `100` if not set. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListLocationLists` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Locationlists$Patch extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location lists belongs.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the location list. Assigned by the system.
         */
        locationListId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LocationList;
    }
    export class Resource$Advertisers$Locationlists$Assignedlocations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits multiple assignments between locations and a single location list. The operation will delete the assigned locations provided in deletedAssignedLocations and then create the assigned locations provided in createdAssignedLocations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEdit(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEdit(params?: Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditAssignedLocationsResponse>>;
        bulkEdit(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEdit(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit, options: MethodOptions | BodyResponseCallback<Schema$BulkEditAssignedLocationsResponse>, callback: BodyResponseCallback<Schema$BulkEditAssignedLocationsResponse>): void;
        bulkEdit(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit, callback: BodyResponseCallback<Schema$BulkEditAssignedLocationsResponse>): void;
        bulkEdit(callback: BodyResponseCallback<Schema$BulkEditAssignedLocationsResponse>): void;
        /**
         * Creates an assignment between a location and a location list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Locationlists$Assignedlocations$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedLocation>>;
        create(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Create, options: MethodOptions | BodyResponseCallback<Schema$AssignedLocation>, callback: BodyResponseCallback<Schema$AssignedLocation>): void;
        create(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Create, callback: BodyResponseCallback<Schema$AssignedLocation>): void;
        create(callback: BodyResponseCallback<Schema$AssignedLocation>): void;
        /**
         * Deletes the assignment between a location and a location list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists locations assigned to a location list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Locationlists$Assignedlocations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAssignedLocationsResponse>>;
        list(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$List, options: MethodOptions | BodyResponseCallback<Schema$ListAssignedLocationsResponse>, callback: BodyResponseCallback<Schema$ListAssignedLocationsResponse>): void;
        list(params: Params$Resource$Advertisers$Locationlists$Assignedlocations$List, callback: BodyResponseCallback<Schema$ListAssignedLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAssignedLocationsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Locationlists$Assignedlocations$Bulkedit extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the location list to which these assignments are assigned.
         */
        locationListId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditAssignedLocationsRequest;
    }
    export interface Params$Resource$Advertisers$Locationlists$Assignedlocations$Create extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the location list for which the assignment will be created.
         */
        locationListId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AssignedLocation;
    }
    export interface Params$Resource$Advertisers$Locationlists$Assignedlocations$Delete extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the assigned location to delete.
         */
        assignedLocationId?: string;
        /**
         * Required. The ID of the location list to which this assignment is assigned.
         */
        locationListId?: string;
    }
    export interface Params$Resource$Advertisers$Locationlists$Assignedlocations$List extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the location list belongs.
         */
        advertiserId?: string;
        /**
         * Allows filtering by location list assignment fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedLocationId` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the location list to which these assignments are assigned.
         */
        locationListId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedLocationId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `assignedLocationId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListAssignedLocations` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export class Resource$Advertisers$Manualtriggers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Activates a manual trigger. Each activation of the manual trigger must be at least 5 minutes apart, otherwise an error will be returned. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        activate(params: Params$Resource$Advertisers$Manualtriggers$Activate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        activate(params?: Params$Resource$Advertisers$Manualtriggers$Activate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManualTrigger>>;
        activate(params: Params$Resource$Advertisers$Manualtriggers$Activate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        activate(params: Params$Resource$Advertisers$Manualtriggers$Activate, options: MethodOptions | BodyResponseCallback<Schema$ManualTrigger>, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        activate(params: Params$Resource$Advertisers$Manualtriggers$Activate, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        activate(callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        /**
         * Creates a new manual trigger. Returns the newly created manual trigger if successful. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Manualtriggers$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Manualtriggers$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManualTrigger>>;
        create(params: Params$Resource$Advertisers$Manualtriggers$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Manualtriggers$Create, options: MethodOptions | BodyResponseCallback<Schema$ManualTrigger>, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        create(params: Params$Resource$Advertisers$Manualtriggers$Create, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        create(callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        /**
         * Deactivates a manual trigger. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deactivate(params: Params$Resource$Advertisers$Manualtriggers$Deactivate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deactivate(params?: Params$Resource$Advertisers$Manualtriggers$Deactivate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManualTrigger>>;
        deactivate(params: Params$Resource$Advertisers$Manualtriggers$Deactivate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deactivate(params: Params$Resource$Advertisers$Manualtriggers$Deactivate, options: MethodOptions | BodyResponseCallback<Schema$ManualTrigger>, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        deactivate(params: Params$Resource$Advertisers$Manualtriggers$Deactivate, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        deactivate(callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        /**
         * Gets a manual trigger. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Manualtriggers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Manualtriggers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManualTrigger>>;
        get(params: Params$Resource$Advertisers$Manualtriggers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Manualtriggers$Get, options: MethodOptions | BodyResponseCallback<Schema$ManualTrigger>, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        get(params: Params$Resource$Advertisers$Manualtriggers$Get, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        get(callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        /**
         * Lists manual triggers that are accessible to the current user for a given advertiser ID. The order is defined by the order_by parameter. A single advertiser_id is required. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Manualtriggers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Manualtriggers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListManualTriggersResponse>>;
        list(params: Params$Resource$Advertisers$Manualtriggers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Manualtriggers$List, options: MethodOptions | BodyResponseCallback<Schema$ListManualTriggersResponse>, callback: BodyResponseCallback<Schema$ListManualTriggersResponse>): void;
        list(params: Params$Resource$Advertisers$Manualtriggers$List, callback: BodyResponseCallback<Schema$ListManualTriggersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListManualTriggersResponse>): void;
        /**
         * Updates a manual trigger. Returns the updated manual trigger if successful. **Warning:** Line Items using manual triggers no longer serve in Display & Video 360. This method will sunset on August 1, 2023. Read our [feature deprecation announcement](/display-video/api/deprecations#features.manual_triggers) for more information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Manualtriggers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Manualtriggers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManualTrigger>>;
        patch(params: Params$Resource$Advertisers$Manualtriggers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Manualtriggers$Patch, options: MethodOptions | BodyResponseCallback<Schema$ManualTrigger>, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        patch(params: Params$Resource$Advertisers$Manualtriggers$Patch, callback: BodyResponseCallback<Schema$ManualTrigger>): void;
        patch(callback: BodyResponseCallback<Schema$ManualTrigger>): void;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$Activate extends StandardParameters {
        /**
         * Required. The ID of the advertiser that the manual trigger belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the manual trigger to activate.
         */
        triggerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ActivateManualTriggerRequest;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$Create extends StandardParameters {
        /**
         * Required. Immutable. The unique ID of the advertiser that the manual trigger belongs to.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManualTrigger;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$Deactivate extends StandardParameters {
        /**
         * Required. The ID of the advertiser that the manual trigger belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the manual trigger to deactivate.
         */
        triggerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeactivateManualTriggerRequest;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser this manual trigger belongs to.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the manual trigger to fetch.
         */
        triggerId?: string;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser that the fetched manual triggers belong to.
         */
        advertiserId?: string;
        /**
         * Allows filtering by manual trigger fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `displayName` * `state` Examples: * All active manual triggers under an advertiser: `state="ACTIVE"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `state` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListManualTriggers` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Manualtriggers$Patch extends StandardParameters {
        /**
         * Required. Immutable. The unique ID of the advertiser that the manual trigger belongs to.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the manual trigger.
         */
        triggerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManualTrigger;
    }
    export class Resource$Advertisers$Negativekeywordlists {
        context: APIRequestContext;
        negativeKeywords: Resource$Advertisers$Negativekeywordlists$Negativekeywords;
        constructor(context: APIRequestContext);
        /**
         * Creates a new negative keyword list. Returns the newly created negative keyword list if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Negativekeywordlists$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NegativeKeywordList>>;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Create, options: MethodOptions | BodyResponseCallback<Schema$NegativeKeywordList>, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Create, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        create(callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        /**
         * Deletes a negative keyword list given an advertiser ID and a negative keyword list ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Negativekeywordlists$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a negative keyword list given an advertiser ID and a negative keyword list ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Negativekeywordlists$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Negativekeywordlists$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NegativeKeywordList>>;
        get(params: Params$Resource$Advertisers$Negativekeywordlists$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Negativekeywordlists$Get, options: MethodOptions | BodyResponseCallback<Schema$NegativeKeywordList>, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        get(params: Params$Resource$Advertisers$Negativekeywordlists$Get, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        get(callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        /**
         * Lists negative keyword lists based on a given advertiser id.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Negativekeywordlists$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Negativekeywordlists$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNegativeKeywordListsResponse>>;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$List, options: MethodOptions | BodyResponseCallback<Schema$ListNegativeKeywordListsResponse>, callback: BodyResponseCallback<Schema$ListNegativeKeywordListsResponse>): void;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$List, callback: BodyResponseCallback<Schema$ListNegativeKeywordListsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNegativeKeywordListsResponse>): void;
        /**
         * Updates a negative keyword list. Returns the updated negative keyword list if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Advertisers$Negativekeywordlists$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Advertisers$Negativekeywordlists$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NegativeKeywordList>>;
        patch(params: Params$Resource$Advertisers$Negativekeywordlists$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Advertisers$Negativekeywordlists$Patch, options: MethodOptions | BodyResponseCallback<Schema$NegativeKeywordList>, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        patch(params: Params$Resource$Advertisers$Negativekeywordlists$Patch, callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
        patch(callback: BodyResponseCallback<Schema$NegativeKeywordList>): void;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Create extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the negative keyword list will belong.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NegativeKeywordList;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Delete extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the negative keyword list to delete.
         */
        negativeKeywordListId?: string;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Get extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the fetched negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the negative keyword list to fetch.
         */
        negativeKeywordListId?: string;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$List extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the fetched negative keyword lists belong.
         */
        advertiserId?: string;
        /**
         * Requested page size. Must be between `1` and `200`. Defaults to `100` if not set. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListNegativeKeywordLists` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Patch extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the negative keyword list. Assigned by the system.
         */
        negativeKeywordListId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NegativeKeywordList;
    }
    export class Resource$Advertisers$Negativekeywordlists$Negativekeywords {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits negative keywords in a single negative keyword list. The operation will delete the negative keywords provided in BulkEditNegativeKeywordsRequest.deleted_negative_keywords and then create the negative keywords provided in BulkEditNegativeKeywordsRequest.created_negative_keywords. This operation is guaranteed to be atomic and will never result in a partial success or partial failure.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEdit(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEdit(params?: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditNegativeKeywordsResponse>>;
        bulkEdit(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEdit(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit, options: MethodOptions | BodyResponseCallback<Schema$BulkEditNegativeKeywordsResponse>, callback: BodyResponseCallback<Schema$BulkEditNegativeKeywordsResponse>): void;
        bulkEdit(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit, callback: BodyResponseCallback<Schema$BulkEditNegativeKeywordsResponse>): void;
        bulkEdit(callback: BodyResponseCallback<Schema$BulkEditNegativeKeywordsResponse>): void;
        /**
         * Creates a negative keyword in a negative keyword list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NegativeKeyword>>;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create, options: MethodOptions | BodyResponseCallback<Schema$NegativeKeyword>, callback: BodyResponseCallback<Schema$NegativeKeyword>): void;
        create(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create, callback: BodyResponseCallback<Schema$NegativeKeyword>): void;
        create(callback: BodyResponseCallback<Schema$NegativeKeyword>): void;
        /**
         * Deletes a negative keyword from a negative keyword list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists negative keywords in a negative keyword list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNegativeKeywordsResponse>>;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List, options: MethodOptions | BodyResponseCallback<Schema$ListNegativeKeywordsResponse>, callback: BodyResponseCallback<Schema$ListNegativeKeywordsResponse>): void;
        list(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List, callback: BodyResponseCallback<Schema$ListNegativeKeywordsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNegativeKeywordsResponse>): void;
        /**
         * Replaces all negative keywords in a single negative keyword list. The operation will replace the keywords in a negative keyword list with keywords provided in ReplaceNegativeKeywordsRequest.new_negative_keywords.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        replace(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        replace(params?: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReplaceNegativeKeywordsResponse>>;
        replace(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        replace(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace, options: MethodOptions | BodyResponseCallback<Schema$ReplaceNegativeKeywordsResponse>, callback: BodyResponseCallback<Schema$ReplaceNegativeKeywordsResponse>): void;
        replace(params: Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace, callback: BodyResponseCallback<Schema$ReplaceNegativeKeywordsResponse>): void;
        replace(callback: BodyResponseCallback<Schema$ReplaceNegativeKeywordsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Bulkedit extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the parent negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent negative keyword list to which the negative keywords belong.
         */
        negativeKeywordListId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditNegativeKeywordsRequest;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Create extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the parent negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent negative keyword list in which the negative keyword will be created.
         */
        negativeKeywordListId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NegativeKeyword;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Delete extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the parent negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The keyword value of the negative keyword to delete.
         */
        keywordValue?: string;
        /**
         * Required. The ID of the parent negative keyword list to which the negative keyword belongs.
         */
        negativeKeywordListId?: string;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$List extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the parent negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Allows filtering by negative keyword fields. Supported syntax: * Filter expressions for negative keywords can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `keywordValue` Examples: * All negative keywords for which the keyword value contains "google": `keywordValue : "google"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the parent negative keyword list to which the requested negative keywords belong.
         */
        negativeKeywordListId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `keywordValue` (default) The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `keywordValue desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `1000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListNegativeKeywords` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Advertisers$Negativekeywordlists$Negativekeywords$Replace extends StandardParameters {
        /**
         * Required. The ID of the DV360 advertiser to which the parent negative keyword list belongs.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent negative keyword list to which the negative keywords belong.
         */
        negativeKeywordListId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReplaceNegativeKeywordsRequest;
    }
    export class Resource$Advertisers$Targetingtypes {
        context: APIRequestContext;
        assignedTargetingOptions: Resource$Advertisers$Targetingtypes$Assignedtargetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Advertisers$Targetingtypes$Assignedtargetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Assigns a targeting option to an advertiser. Returns the assigned targeting option if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        create(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Deletes an assigned targeting option from an advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a single targeting option assigned to an advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        get(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Lists the targeting options assigned to an advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAdvertiserAssignedTargetingOptionsResponse>>;
        list(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListAdvertiserAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListAdvertiserAssignedTargetingOptionsResponse>): void;
        list(params: Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List, callback: BodyResponseCallback<Schema$ListAdvertiserAssignedTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAdvertiserAssignedTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Create extends StandardParameters {
        /**
         * Required. The ID of the advertiser.
         */
        advertiserId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`
         */
        targetingType?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AssignedTargetingOption;
    }
    export interface Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Delete extends StandardParameters {
        /**
         * Required. The ID of the advertiser.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the assigned targeting option to delete.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$Get extends StandardParameters {
        /**
         * Required. The ID of the advertiser.
         */
        advertiserId?: string;
        /**
         * Required. An identifier unique to the targeting type in this advertiser that identifies the assigned targeting option being requested.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_YOUTUBE_VIDEO` * `TARGETING_TYPE_YOUTUBE_CHANNEL`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Advertisers$Targetingtypes$Assignedtargetingoptions$List extends StandardParameters {
        /**
         * Required. The ID of the advertiser.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedTargetingOptionId` Examples: * `AssignedTargetingOption` with ID 123456: `assignedTargetingOptionId="123456"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedTargetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `assignedTargetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `5000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListAdvertiserAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. Identifies the type of assigned targeting options to list. Supported targeting types: * `TARGETING_TYPE_CHANNEL` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_OMID` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_YOUTUBE_VIDEO` * `TARGETING_TYPE_YOUTUBE_CHANNEL`
         */
        targetingType?: string;
    }
    export class Resource$Combinedaudiences {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a combined audience.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Combinedaudiences$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Combinedaudiences$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CombinedAudience>>;
        get(params: Params$Resource$Combinedaudiences$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Combinedaudiences$Get, options: MethodOptions | BodyResponseCallback<Schema$CombinedAudience>, callback: BodyResponseCallback<Schema$CombinedAudience>): void;
        get(params: Params$Resource$Combinedaudiences$Get, callback: BodyResponseCallback<Schema$CombinedAudience>): void;
        get(callback: BodyResponseCallback<Schema$CombinedAudience>): void;
        /**
         * Lists combined audiences. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Combinedaudiences$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Combinedaudiences$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCombinedAudiencesResponse>>;
        list(params: Params$Resource$Combinedaudiences$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Combinedaudiences$List, options: MethodOptions | BodyResponseCallback<Schema$ListCombinedAudiencesResponse>, callback: BodyResponseCallback<Schema$ListCombinedAudiencesResponse>): void;
        list(params: Params$Resource$Combinedaudiences$List, callback: BodyResponseCallback<Schema$ListCombinedAudiencesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCombinedAudiencesResponse>): void;
    }
    export interface Params$Resource$Combinedaudiences$Get extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched combined audience.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the combined audience to fetch.
         */
        combinedAudienceId?: string;
        /**
         * The ID of the partner that has access to the fetched combined audience.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Combinedaudiences$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched combined audiences.
         */
        advertiserId?: string;
        /**
         * Allows filtering by combined audience fields. Supported syntax: * Filter expressions for combined audiences can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All combined audiences for which the display name contains "Google": `displayName : "Google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `combinedAudienceId` (default) * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCombinedAudiences` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the fetched combined audiences.
         */
        partnerId?: string;
    }
    export class Resource$Custombiddingalgorithms {
        context: APIRequestContext;
        scripts: Resource$Custombiddingalgorithms$Scripts;
        constructor(context: APIRequestContext);
        /**
         * Creates a new custom bidding algorithm. Returns the newly created custom bidding algorithm if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Custombiddingalgorithms$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Custombiddingalgorithms$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingAlgorithm>>;
        create(params: Params$Resource$Custombiddingalgorithms$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Custombiddingalgorithms$Create, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingAlgorithm>, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        create(params: Params$Resource$Custombiddingalgorithms$Create, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        create(callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        /**
         * Gets a custom bidding algorithm.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Custombiddingalgorithms$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Custombiddingalgorithms$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingAlgorithm>>;
        get(params: Params$Resource$Custombiddingalgorithms$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Custombiddingalgorithms$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingAlgorithm>, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        get(params: Params$Resource$Custombiddingalgorithms$Get, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        get(callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        /**
         * Lists custom bidding algorithms that are accessible to the current user and can be used in bidding stratgies. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Custombiddingalgorithms$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Custombiddingalgorithms$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCustomBiddingAlgorithmsResponse>>;
        list(params: Params$Resource$Custombiddingalgorithms$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Custombiddingalgorithms$List, options: MethodOptions | BodyResponseCallback<Schema$ListCustomBiddingAlgorithmsResponse>, callback: BodyResponseCallback<Schema$ListCustomBiddingAlgorithmsResponse>): void;
        list(params: Params$Resource$Custombiddingalgorithms$List, callback: BodyResponseCallback<Schema$ListCustomBiddingAlgorithmsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCustomBiddingAlgorithmsResponse>): void;
        /**
         * Updates an existing custom bidding algorithm. Returns the updated custom bidding algorithm if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Custombiddingalgorithms$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Custombiddingalgorithms$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingAlgorithm>>;
        patch(params: Params$Resource$Custombiddingalgorithms$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Custombiddingalgorithms$Patch, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingAlgorithm>, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        patch(params: Params$Resource$Custombiddingalgorithms$Patch, callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        patch(callback: BodyResponseCallback<Schema$CustomBiddingAlgorithm>): void;
        /**
         * Creates a custom bidding script reference object for a script file. The resulting reference object provides a resource path to which the script file should be uploaded. This reference object should be included in when creating a new custom bidding script object.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        uploadScript(params: Params$Resource$Custombiddingalgorithms$Uploadscript, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        uploadScript(params?: Params$Resource$Custombiddingalgorithms$Uploadscript, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingScriptRef>>;
        uploadScript(params: Params$Resource$Custombiddingalgorithms$Uploadscript, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        uploadScript(params: Params$Resource$Custombiddingalgorithms$Uploadscript, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingScriptRef>, callback: BodyResponseCallback<Schema$CustomBiddingScriptRef>): void;
        uploadScript(params: Params$Resource$Custombiddingalgorithms$Uploadscript, callback: BodyResponseCallback<Schema$CustomBiddingScriptRef>): void;
        uploadScript(callback: BodyResponseCallback<Schema$CustomBiddingScriptRef>): void;
    }
    export interface Params$Resource$Custombiddingalgorithms$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomBiddingAlgorithm;
    }
    export interface Params$Resource$Custombiddingalgorithms$Get extends StandardParameters {
        /**
         * The ID of the DV360 partner that has access to the custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom bidding algorithm to fetch.
         */
        customBiddingAlgorithmId?: string;
        /**
         * The ID of the DV360 partner that has access to the custom bidding algorithm.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Custombiddingalgorithms$List extends StandardParameters {
        /**
         * The ID of the DV360 advertiser that has access to the custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Allows filtering by custom bidding algorithm fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND`. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `customBiddingAlgorithmType` field must use the `EQUALS (=)` operator. * The `displayName` field must use the `HAS (:)` operator. Supported fields: * `customBiddingAlgorithmType` * `displayName` Examples: * All custom bidding algorithms for which the display name contains "politics": `displayName:"politics"`. * All custom bidding algorithms for which the type is "SCRIPT_BASED": `customBiddingAlgorithmType=SCRIPT_BASED` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCustomBiddingAlgorithms` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the DV360 partner that has access to the custom bidding algorithm.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Custombiddingalgorithms$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the custom bidding algorithm. Assigned by the system.
         */
        customBiddingAlgorithmId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomBiddingAlgorithm;
    }
    export interface Params$Resource$Custombiddingalgorithms$Uploadscript extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom bidding algorithm owns the script.
         */
        customBiddingAlgorithmId?: string;
        /**
         * The ID of the partner that owns the parent custom bidding algorithm. Only this partner will have write access to this custom bidding script.
         */
        partnerId?: string;
    }
    export class Resource$Custombiddingalgorithms$Scripts {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new custom bidding script. Returns the newly created script if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Custombiddingalgorithms$Scripts$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Custombiddingalgorithms$Scripts$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingScript>>;
        create(params: Params$Resource$Custombiddingalgorithms$Scripts$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Custombiddingalgorithms$Scripts$Create, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingScript>, callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        create(params: Params$Resource$Custombiddingalgorithms$Scripts$Create, callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        create(callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        /**
         * Gets a custom bidding script.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Custombiddingalgorithms$Scripts$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Custombiddingalgorithms$Scripts$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomBiddingScript>>;
        get(params: Params$Resource$Custombiddingalgorithms$Scripts$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Custombiddingalgorithms$Scripts$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomBiddingScript>, callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        get(params: Params$Resource$Custombiddingalgorithms$Scripts$Get, callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        get(callback: BodyResponseCallback<Schema$CustomBiddingScript>): void;
        /**
         * Lists custom bidding scripts that belong to the given algorithm. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Custombiddingalgorithms$Scripts$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Custombiddingalgorithms$Scripts$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCustomBiddingScriptsResponse>>;
        list(params: Params$Resource$Custombiddingalgorithms$Scripts$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Custombiddingalgorithms$Scripts$List, options: MethodOptions | BodyResponseCallback<Schema$ListCustomBiddingScriptsResponse>, callback: BodyResponseCallback<Schema$ListCustomBiddingScriptsResponse>): void;
        list(params: Params$Resource$Custombiddingalgorithms$Scripts$List, callback: BodyResponseCallback<Schema$ListCustomBiddingScriptsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCustomBiddingScriptsResponse>): void;
    }
    export interface Params$Resource$Custombiddingalgorithms$Scripts$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom bidding algorithm that owns the script.
         */
        customBiddingAlgorithmId?: string;
        /**
         * The ID of the partner that owns the parent custom bidding algorithm. Only this partner will have write access to this custom bidding script.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CustomBiddingScript;
    }
    export interface Params$Resource$Custombiddingalgorithms$Scripts$Get extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom bidding algorithm owns the script.
         */
        customBiddingAlgorithmId?: string;
        /**
         * Required. The ID of the custom bidding script to fetch.
         */
        customBiddingScriptId?: string;
        /**
         * The ID of the partner that owns the parent custom bidding algorithm. Only this partner will have write access to this custom bidding script.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Custombiddingalgorithms$Scripts$List extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent custom bidding algorithm.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom bidding algorithm owns the script.
         */
        customBiddingAlgorithmId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `createTime desc` (default) The default sorting order is descending. To specify ascending order for a field, the suffix "desc" should be removed. Example: `createTime`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCustomBiddingScripts` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that owns the parent custom bidding algorithm. Only this partner will have write access to this custom bidding script.
         */
        partnerId?: string;
    }
    export class Resource$Customlists {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a custom list.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Customlists$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Customlists$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CustomList>>;
        get(params: Params$Resource$Customlists$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Customlists$Get, options: MethodOptions | BodyResponseCallback<Schema$CustomList>, callback: BodyResponseCallback<Schema$CustomList>): void;
        get(params: Params$Resource$Customlists$Get, callback: BodyResponseCallback<Schema$CustomList>): void;
        get(callback: BodyResponseCallback<Schema$CustomList>): void;
        /**
         * Lists custom lists. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Customlists$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Customlists$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListCustomListsResponse>>;
        list(params: Params$Resource$Customlists$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Customlists$List, options: MethodOptions | BodyResponseCallback<Schema$ListCustomListsResponse>, callback: BodyResponseCallback<Schema$ListCustomListsResponse>): void;
        list(params: Params$Resource$Customlists$List, callback: BodyResponseCallback<Schema$ListCustomListsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListCustomListsResponse>): void;
    }
    export interface Params$Resource$Customlists$Get extends StandardParameters {
        /**
         * The ID of the DV360 advertiser that has access to the fetched custom lists.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the custom list to fetch.
         */
        customListId?: string;
    }
    export interface Params$Resource$Customlists$List extends StandardParameters {
        /**
         * The ID of the DV360 advertiser that has access to the fetched custom lists.
         */
        advertiserId?: string;
        /**
         * Allows filtering by custom list fields. Supported syntax: * Filter expressions for custom lists can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All custom lists for which the display name contains "Google": `displayName:"Google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `customListId` (default) * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListCustomLists` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export class Resource$Firstandthirdpartyaudiences {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a FirstAndThirdPartyAudience. Only supported for the following audience_type: * `CUSTOMER_MATCH_CONTACT_INFO` * `CUSTOMER_MATCH_DEVICE_ID`
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Firstandthirdpartyaudiences$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Firstandthirdpartyaudiences$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FirstAndThirdPartyAudience>>;
        create(params: Params$Resource$Firstandthirdpartyaudiences$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Firstandthirdpartyaudiences$Create, options: MethodOptions | BodyResponseCallback<Schema$FirstAndThirdPartyAudience>, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        create(params: Params$Resource$Firstandthirdpartyaudiences$Create, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        create(callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        /**
         * Updates the member list of a Customer Match audience. Only supported for the following audience_type: * `CUSTOMER_MATCH_CONTACT_INFO` * `CUSTOMER_MATCH_DEVICE_ID`
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        editCustomerMatchMembers(params: Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        editCustomerMatchMembers(params?: Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EditCustomerMatchMembersResponse>>;
        editCustomerMatchMembers(params: Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        editCustomerMatchMembers(params: Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers, options: MethodOptions | BodyResponseCallback<Schema$EditCustomerMatchMembersResponse>, callback: BodyResponseCallback<Schema$EditCustomerMatchMembersResponse>): void;
        editCustomerMatchMembers(params: Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers, callback: BodyResponseCallback<Schema$EditCustomerMatchMembersResponse>): void;
        editCustomerMatchMembers(callback: BodyResponseCallback<Schema$EditCustomerMatchMembersResponse>): void;
        /**
         * Gets a first and third party audience.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Firstandthirdpartyaudiences$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Firstandthirdpartyaudiences$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FirstAndThirdPartyAudience>>;
        get(params: Params$Resource$Firstandthirdpartyaudiences$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Firstandthirdpartyaudiences$Get, options: MethodOptions | BodyResponseCallback<Schema$FirstAndThirdPartyAudience>, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        get(params: Params$Resource$Firstandthirdpartyaudiences$Get, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        get(callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        /**
         * Lists first and third party audiences. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Firstandthirdpartyaudiences$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Firstandthirdpartyaudiences$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListFirstAndThirdPartyAudiencesResponse>>;
        list(params: Params$Resource$Firstandthirdpartyaudiences$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Firstandthirdpartyaudiences$List, options: MethodOptions | BodyResponseCallback<Schema$ListFirstAndThirdPartyAudiencesResponse>, callback: BodyResponseCallback<Schema$ListFirstAndThirdPartyAudiencesResponse>): void;
        list(params: Params$Resource$Firstandthirdpartyaudiences$List, callback: BodyResponseCallback<Schema$ListFirstAndThirdPartyAudiencesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListFirstAndThirdPartyAudiencesResponse>): void;
        /**
         * Updates an existing FirstAndThirdPartyAudience. Only supported for the following audience_type: * `CUSTOMER_MATCH_CONTACT_INFO` * `CUSTOMER_MATCH_DEVICE_ID`
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Firstandthirdpartyaudiences$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Firstandthirdpartyaudiences$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FirstAndThirdPartyAudience>>;
        patch(params: Params$Resource$Firstandthirdpartyaudiences$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Firstandthirdpartyaudiences$Patch, options: MethodOptions | BodyResponseCallback<Schema$FirstAndThirdPartyAudience>, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        patch(params: Params$Resource$Firstandthirdpartyaudiences$Patch, callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
        patch(callback: BodyResponseCallback<Schema$FirstAndThirdPartyAudience>): void;
    }
    export interface Params$Resource$Firstandthirdpartyaudiences$Create extends StandardParameters {
        /**
         * Required. The ID of the advertiser under whom the FirstAndThirdPartyAudience will be created.
         */
        advertiserId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FirstAndThirdPartyAudience;
    }
    export interface Params$Resource$Firstandthirdpartyaudiences$Editcustomermatchmembers extends StandardParameters {
        /**
         * Required. The ID of the Customer Match FirstAndThirdPartyAudience whose members will be edited.
         */
        firstAndThirdPartyAudienceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EditCustomerMatchMembersRequest;
    }
    export interface Params$Resource$Firstandthirdpartyaudiences$Get extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched first and third party audience.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the first and third party audience to fetch.
         */
        firstAndThirdPartyAudienceId?: string;
        /**
         * The ID of the partner that has access to the fetched first and third party audience.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Firstandthirdpartyaudiences$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched first and third party audiences.
         */
        advertiserId?: string;
        /**
         * Allows filtering by first and third party audience fields. Supported syntax: * Filter expressions for first and third party audiences can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All first and third party audiences for which the display name contains "Google": `displayName:"Google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `firstAndThirdPartyAudienceId` (default) * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListFirstAndThirdPartyAudiences` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the fetched first and third party audiences.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Firstandthirdpartyaudiences$Patch extends StandardParameters {
        /**
         * Required. The ID of the owner advertiser of the updated FirstAndThirdPartyAudience.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the first and third party audience. Assigned by the system.
         */
        firstAndThirdPartyAudienceId?: string;
        /**
         * Required. The mask to control which fields to update. Updates are only supported for the following fields: * `displayName` * `description` * `membershipDurationDays`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FirstAndThirdPartyAudience;
    }
    export class Resource$Floodlightgroups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a Floodlight group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Floodlightgroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Floodlightgroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FloodlightGroup>>;
        get(params: Params$Resource$Floodlightgroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Floodlightgroups$Get, options: MethodOptions | BodyResponseCallback<Schema$FloodlightGroup>, callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
        get(params: Params$Resource$Floodlightgroups$Get, callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
        get(callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
        /**
         * Updates an existing Floodlight group. Returns the updated Floodlight group if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Floodlightgroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Floodlightgroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FloodlightGroup>>;
        patch(params: Params$Resource$Floodlightgroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Floodlightgroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$FloodlightGroup>, callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
        patch(params: Params$Resource$Floodlightgroups$Patch, callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
        patch(callback: BodyResponseCallback<Schema$FloodlightGroup>): void;
    }
    export interface Params$Resource$Floodlightgroups$Get extends StandardParameters {
        /**
         * Required. The ID of the Floodlight group to fetch.
         */
        floodlightGroupId?: string;
        /**
         * Required. The partner context by which the Floodlight group is being accessed.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Floodlightgroups$Patch extends StandardParameters {
        /**
         * Output only. The unique ID of the Floodlight group. Assigned by the system.
         */
        floodlightGroupId?: string;
        /**
         * Required. The partner context by which the Floodlight group is being accessed.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$FloodlightGroup;
    }
    export class Resource$Googleaudiences {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a Google audience.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Googleaudiences$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Googleaudiences$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAudience>>;
        get(params: Params$Resource$Googleaudiences$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Googleaudiences$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAudience>, callback: BodyResponseCallback<Schema$GoogleAudience>): void;
        get(params: Params$Resource$Googleaudiences$Get, callback: BodyResponseCallback<Schema$GoogleAudience>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAudience>): void;
        /**
         * Lists Google audiences. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Googleaudiences$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Googleaudiences$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListGoogleAudiencesResponse>>;
        list(params: Params$Resource$Googleaudiences$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Googleaudiences$List, options: MethodOptions | BodyResponseCallback<Schema$ListGoogleAudiencesResponse>, callback: BodyResponseCallback<Schema$ListGoogleAudiencesResponse>): void;
        list(params: Params$Resource$Googleaudiences$List, callback: BodyResponseCallback<Schema$ListGoogleAudiencesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListGoogleAudiencesResponse>): void;
    }
    export interface Params$Resource$Googleaudiences$Get extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched Google audience.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the Google audience to fetch.
         */
        googleAudienceId?: string;
        /**
         * The ID of the partner that has access to the fetched Google audience.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Googleaudiences$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the fetched Google audiences.
         */
        advertiserId?: string;
        /**
         * Allows filtering by Google audience fields. Supported syntax: * Filter expressions for Google audiences can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All Google audiences for which the display name contains "Google": `displayName:"Google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `googleAudienceId` (default) * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListGoogleAudiences` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the fetched Google audiences.
         */
        partnerId?: string;
    }
    export class Resource$Guaranteedorders {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new guaranteed order. Returns the newly created guaranteed order if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Guaranteedorders$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Guaranteedorders$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GuaranteedOrder>>;
        create(params: Params$Resource$Guaranteedorders$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Guaranteedorders$Create, options: MethodOptions | BodyResponseCallback<Schema$GuaranteedOrder>, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        create(params: Params$Resource$Guaranteedorders$Create, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        create(callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        /**
         * Edits read advertisers of a guaranteed order.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        editGuaranteedOrderReadAccessors(params: Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        editGuaranteedOrderReadAccessors(params?: Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EditGuaranteedOrderReadAccessorsResponse>>;
        editGuaranteedOrderReadAccessors(params: Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        editGuaranteedOrderReadAccessors(params: Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors, options: MethodOptions | BodyResponseCallback<Schema$EditGuaranteedOrderReadAccessorsResponse>, callback: BodyResponseCallback<Schema$EditGuaranteedOrderReadAccessorsResponse>): void;
        editGuaranteedOrderReadAccessors(params: Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors, callback: BodyResponseCallback<Schema$EditGuaranteedOrderReadAccessorsResponse>): void;
        editGuaranteedOrderReadAccessors(callback: BodyResponseCallback<Schema$EditGuaranteedOrderReadAccessorsResponse>): void;
        /**
         * Gets a guaranteed order.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Guaranteedorders$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Guaranteedorders$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GuaranteedOrder>>;
        get(params: Params$Resource$Guaranteedorders$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Guaranteedorders$Get, options: MethodOptions | BodyResponseCallback<Schema$GuaranteedOrder>, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        get(params: Params$Resource$Guaranteedorders$Get, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        get(callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        /**
         * Lists guaranteed orders that are accessible to the current user. The order is defined by the order_by parameter. If a filter by entity_status is not specified, guaranteed orders with entity status `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Guaranteedorders$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Guaranteedorders$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListGuaranteedOrdersResponse>>;
        list(params: Params$Resource$Guaranteedorders$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Guaranteedorders$List, options: MethodOptions | BodyResponseCallback<Schema$ListGuaranteedOrdersResponse>, callback: BodyResponseCallback<Schema$ListGuaranteedOrdersResponse>): void;
        list(params: Params$Resource$Guaranteedorders$List, callback: BodyResponseCallback<Schema$ListGuaranteedOrdersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListGuaranteedOrdersResponse>): void;
        /**
         * Updates an existing guaranteed order. Returns the updated guaranteed order if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Guaranteedorders$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Guaranteedorders$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GuaranteedOrder>>;
        patch(params: Params$Resource$Guaranteedorders$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Guaranteedorders$Patch, options: MethodOptions | BodyResponseCallback<Schema$GuaranteedOrder>, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        patch(params: Params$Resource$Guaranteedorders$Patch, callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
        patch(callback: BodyResponseCallback<Schema$GuaranteedOrder>): void;
    }
    export interface Params$Resource$Guaranteedorders$Create extends StandardParameters {
        /**
         * The ID of the advertiser that the request is being made within.
         */
        advertiserId?: string;
        /**
         * The ID of the partner that the request is being made within.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GuaranteedOrder;
    }
    export interface Params$Resource$Guaranteedorders$Editguaranteedorderreadaccessors extends StandardParameters {
        /**
         * Required. The ID of the guaranteed order to edit. The ID is of the format `{exchange\}-{legacy_guaranteed_order_id\}`
         */
        guaranteedOrderId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EditGuaranteedOrderReadAccessorsRequest;
    }
    export interface Params$Resource$Guaranteedorders$Get extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the guaranteed order.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the guaranteed order to fetch. The ID is of the format `{exchange\}-{legacy_guaranteed_order_id\}`
         */
        guaranteedOrderId?: string;
        /**
         * The ID of the partner that has access to the guaranteed order.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Guaranteedorders$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the guaranteed order.
         */
        advertiserId?: string;
        /**
         * Allows filtering by guaranteed order fields. * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `guaranteed_order_id` * `exchange` * `display_name` * `status.entityStatus` Examples: * All active guaranteed orders: `status.entityStatus="ENTITY_STATUS_ACTIVE"` * Guaranteed orders belonging to Google Ad Manager or Rubicon exchanges: `exchange="EXCHANGE_GOOGLE_AD_MANAGER" OR exchange="EXCHANGE_RUBICON"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListGuaranteedOrders` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the guaranteed order.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Guaranteedorders$Patch extends StandardParameters {
        /**
         * The ID of the advertiser that the request is being made within.
         */
        advertiserId?: string;
        /**
         * Output only. The unique identifier of the guaranteed order. The guaranteed order IDs have the format `{exchange\}-{legacy_guaranteed_order_id\}`.
         */
        guaranteedOrderId?: string;
        /**
         * The ID of the partner that the request is being made within.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GuaranteedOrder;
    }
    export class Resource$Inventorysourcegroups {
        context: APIRequestContext;
        assignedInventorySources: Resource$Inventorysourcegroups$Assignedinventorysources;
        constructor(context: APIRequestContext);
        /**
         * Creates a new inventory source group. Returns the newly created inventory source group if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Inventorysourcegroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Inventorysourcegroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySourceGroup>>;
        create(params: Params$Resource$Inventorysourcegroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Inventorysourcegroups$Create, options: MethodOptions | BodyResponseCallback<Schema$InventorySourceGroup>, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        create(params: Params$Resource$Inventorysourcegroups$Create, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        create(callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        /**
         * Deletes an inventory source group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Inventorysourcegroups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Inventorysourcegroups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Inventorysourcegroups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Inventorysourcegroups$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Inventorysourcegroups$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets an inventory source group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Inventorysourcegroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inventorysourcegroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySourceGroup>>;
        get(params: Params$Resource$Inventorysourcegroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inventorysourcegroups$Get, options: MethodOptions | BodyResponseCallback<Schema$InventorySourceGroup>, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        get(params: Params$Resource$Inventorysourcegroups$Get, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        get(callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        /**
         * Lists inventory source groups that are accessible to the current user. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inventorysourcegroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inventorysourcegroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInventorySourceGroupsResponse>>;
        list(params: Params$Resource$Inventorysourcegroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inventorysourcegroups$List, options: MethodOptions | BodyResponseCallback<Schema$ListInventorySourceGroupsResponse>, callback: BodyResponseCallback<Schema$ListInventorySourceGroupsResponse>): void;
        list(params: Params$Resource$Inventorysourcegroups$List, callback: BodyResponseCallback<Schema$ListInventorySourceGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInventorySourceGroupsResponse>): void;
        /**
         * Updates an inventory source group. Returns the updated inventory source group if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Inventorysourcegroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Inventorysourcegroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySourceGroup>>;
        patch(params: Params$Resource$Inventorysourcegroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Inventorysourcegroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$InventorySourceGroup>, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        patch(params: Params$Resource$Inventorysourcegroups$Patch, callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
        patch(callback: BodyResponseCallback<Schema$InventorySourceGroup>): void;
    }
    export interface Params$Resource$Inventorysourcegroups$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the inventory source group. The parent partner will not have access to this group.
         */
        advertiserId?: string;
        /**
         * The ID of the partner that owns the inventory source group. Only this partner will have write access to this group. Only advertisers to which this group is explicitly shared will have read access to this group.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InventorySourceGroup;
    }
    export interface Params$Resource$Inventorysourcegroups$Delete extends StandardParameters {
        /**
         * The ID of the advertiser that owns the inventory source group. The parent partner does not have access to this group.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the inventory source group to delete.
         */
        inventorySourceGroupId?: string;
        /**
         * The ID of the partner that owns the inventory source group. Only this partner has write access to this group.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysourcegroups$Get extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the inventory source group. If an inventory source group is partner-owned, only advertisers to which the group is explicitly shared can access the group.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the inventory source group to fetch.
         */
        inventorySourceGroupId?: string;
        /**
         * The ID of the partner that has access to the inventory source group. A partner cannot access an advertiser-owned inventory source group.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysourcegroups$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the inventory source group. If an inventory source group is partner-owned, only advertisers to which the group is explicitly shared can access the group.
         */
        advertiserId?: string;
        /**
         * Allows filtering by inventory source group fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `inventorySourceGroupId` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `inventorySourceGroupId` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListInventorySources` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the inventory source group. A partner cannot access advertiser-owned inventory source groups.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysourcegroups$Patch extends StandardParameters {
        /**
         * The ID of the advertiser that owns the inventory source group. The parent partner does not have access to this group.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the inventory source group. Assigned by the system.
         */
        inventorySourceGroupId?: string;
        /**
         * The ID of the partner that owns the inventory source group. Only this partner has write access to this group.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InventorySourceGroup;
    }
    export class Resource$Inventorysourcegroups$Assignedinventorysources {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits multiple assignments between inventory sources and a single inventory source group. The operation will delete the assigned inventory sources provided in BulkEditAssignedInventorySourcesRequest.deleted_assigned_inventory_sources and then create the assigned inventory sources provided in BulkEditAssignedInventorySourcesRequest.created_assigned_inventory_sources.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEdit(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEdit(params?: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditAssignedInventorySourcesResponse>>;
        bulkEdit(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEdit(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit, options: MethodOptions | BodyResponseCallback<Schema$BulkEditAssignedInventorySourcesResponse>, callback: BodyResponseCallback<Schema$BulkEditAssignedInventorySourcesResponse>): void;
        bulkEdit(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit, callback: BodyResponseCallback<Schema$BulkEditAssignedInventorySourcesResponse>): void;
        bulkEdit(callback: BodyResponseCallback<Schema$BulkEditAssignedInventorySourcesResponse>): void;
        /**
         * Creates an assignment between an inventory source and an inventory source group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedInventorySource>>;
        create(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create, options: MethodOptions | BodyResponseCallback<Schema$AssignedInventorySource>, callback: BodyResponseCallback<Schema$AssignedInventorySource>): void;
        create(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create, callback: BodyResponseCallback<Schema$AssignedInventorySource>): void;
        create(callback: BodyResponseCallback<Schema$AssignedInventorySource>): void;
        /**
         * Deletes the assignment between an inventory source and an inventory source group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists inventory sources assigned to an inventory source group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inventorysourcegroups$Assignedinventorysources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAssignedInventorySourcesResponse>>;
        list(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$List, options: MethodOptions | BodyResponseCallback<Schema$ListAssignedInventorySourcesResponse>, callback: BodyResponseCallback<Schema$ListAssignedInventorySourcesResponse>): void;
        list(params: Params$Resource$Inventorysourcegroups$Assignedinventorysources$List, callback: BodyResponseCallback<Schema$ListAssignedInventorySourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAssignedInventorySourcesResponse>): void;
    }
    export interface Params$Resource$Inventorysourcegroups$Assignedinventorysources$Bulkedit extends StandardParameters {
        /**
         * Required. The ID of the inventory source group to which the assignments are assigned.
         */
        inventorySourceGroupId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditAssignedInventorySourcesRequest;
    }
    export interface Params$Resource$Inventorysourcegroups$Assignedinventorysources$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent inventory source group. The parent partner will not have access to this assigned inventory source.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the inventory source group to which the assignment will be assigned.
         */
        inventorySourceGroupId?: string;
        /**
         * The ID of the partner that owns the parent inventory source group. Only this partner will have write access to this assigned inventory source.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AssignedInventorySource;
    }
    export interface Params$Resource$Inventorysourcegroups$Assignedinventorysources$Delete extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent inventory source group. The parent partner does not have access to this assigned inventory source.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the assigned inventory source to delete.
         */
        assignedInventorySourceId?: string;
        /**
         * Required. The ID of the inventory source group to which this assignment is assigned.
         */
        inventorySourceGroupId?: string;
        /**
         * The ID of the partner that owns the parent inventory source group. Only this partner has write access to this assigned inventory source.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysourcegroups$Assignedinventorysources$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the assignment. If the parent inventory source group is partner-owned, only advertisers to which the parent group is explicitly shared can access the assigned inventory source.
         */
        advertiserId?: string;
        /**
         * Allows filtering by assigned inventory source fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the `OR` logical operator. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedInventorySourceId` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Required. The ID of the inventory source group to which these assignments are assigned.
         */
        inventorySourceGroupId?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedInventorySourceId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `assignedInventorySourceId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `100`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListAssignedInventorySources` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the assignment. If the parent inventory source group is advertiser-owned, the assignment cannot be accessed via a partner.
         */
        partnerId?: string;
    }
    export class Resource$Inventorysources {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new inventory source. Returns the newly created inventory source if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Inventorysources$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Inventorysources$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySource>>;
        create(params: Params$Resource$Inventorysources$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Inventorysources$Create, options: MethodOptions | BodyResponseCallback<Schema$InventorySource>, callback: BodyResponseCallback<Schema$InventorySource>): void;
        create(params: Params$Resource$Inventorysources$Create, callback: BodyResponseCallback<Schema$InventorySource>): void;
        create(callback: BodyResponseCallback<Schema$InventorySource>): void;
        /**
         * Edits read/write accessors of an inventory source. Returns the updated read_write_accessors for the inventory source.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        editInventorySourceReadWriteAccessors(params: Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        editInventorySourceReadWriteAccessors(params?: Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySourceAccessors>>;
        editInventorySourceReadWriteAccessors(params: Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        editInventorySourceReadWriteAccessors(params: Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors, options: MethodOptions | BodyResponseCallback<Schema$InventorySourceAccessors>, callback: BodyResponseCallback<Schema$InventorySourceAccessors>): void;
        editInventorySourceReadWriteAccessors(params: Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors, callback: BodyResponseCallback<Schema$InventorySourceAccessors>): void;
        editInventorySourceReadWriteAccessors(callback: BodyResponseCallback<Schema$InventorySourceAccessors>): void;
        /**
         * Gets an inventory source.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Inventorysources$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inventorysources$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySource>>;
        get(params: Params$Resource$Inventorysources$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inventorysources$Get, options: MethodOptions | BodyResponseCallback<Schema$InventorySource>, callback: BodyResponseCallback<Schema$InventorySource>): void;
        get(params: Params$Resource$Inventorysources$Get, callback: BodyResponseCallback<Schema$InventorySource>): void;
        get(callback: BodyResponseCallback<Schema$InventorySource>): void;
        /**
         * Lists inventory sources that are accessible to the current user. The order is defined by the order_by parameter. If a filter by entity_status is not specified, inventory sources with entity status `ENTITY_STATUS_ARCHIVED` will not be included in the results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inventorysources$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inventorysources$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInventorySourcesResponse>>;
        list(params: Params$Resource$Inventorysources$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inventorysources$List, options: MethodOptions | BodyResponseCallback<Schema$ListInventorySourcesResponse>, callback: BodyResponseCallback<Schema$ListInventorySourcesResponse>): void;
        list(params: Params$Resource$Inventorysources$List, callback: BodyResponseCallback<Schema$ListInventorySourcesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInventorySourcesResponse>): void;
        /**
         * Updates an existing inventory source. Returns the updated inventory source if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Inventorysources$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Inventorysources$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InventorySource>>;
        patch(params: Params$Resource$Inventorysources$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Inventorysources$Patch, options: MethodOptions | BodyResponseCallback<Schema$InventorySource>, callback: BodyResponseCallback<Schema$InventorySource>): void;
        patch(params: Params$Resource$Inventorysources$Patch, callback: BodyResponseCallback<Schema$InventorySource>): void;
        patch(callback: BodyResponseCallback<Schema$InventorySource>): void;
    }
    export interface Params$Resource$Inventorysources$Create extends StandardParameters {
        /**
         * The ID of the advertiser that the request is being made within.
         */
        advertiserId?: string;
        /**
         * The ID of the partner that the request is being made within.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InventorySource;
    }
    export interface Params$Resource$Inventorysources$Editinventorysourcereadwriteaccessors extends StandardParameters {
        /**
         * Required. The ID of inventory source to update.
         */
        inventorySourceId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EditInventorySourceReadWriteAccessorsRequest;
    }
    export interface Params$Resource$Inventorysources$Get extends StandardParameters {
        /**
         * Required. The ID of the inventory source to fetch.
         */
        inventorySourceId?: string;
        /**
         * Required. The ID of the DV360 partner to which the fetched inventory source is permissioned.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysources$List extends StandardParameters {
        /**
         * The ID of the advertiser that has access to the inventory source.
         */
        advertiserId?: string;
        /**
         * Allows filtering by inventory source fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `status.entityStatus` * `commitment` * `deliveryMethod` * `rateDetails.rateType` * `exchange` Examples: * All active inventory sources: `status.entityStatus="ENTITY_STATUS_ACTIVE"` * Inventory sources belonging to Google Ad Manager or Rubicon exchanges: `exchange="EXCHANGE_GOOGLE_AD_MANAGER" OR exchange="EXCHANGE_RUBICON"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListInventorySources` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that has access to the inventory source.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Inventorysources$Patch extends StandardParameters {
        /**
         * The ID of the advertiser that the request is being made within.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the inventory source. Assigned by the system.
         */
        inventorySourceId?: string;
        /**
         * The ID of the partner that the request is being made within.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InventorySource;
    }
    export class Resource$Media {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Downloads media. Download is supported on the URI `/download/{resource_name=**\}?alt=media.` **Note**: Download requests will not be successful without including `alt=media` query string.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        download(params: Params$Resource$Media$Download, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        download(params?: Params$Resource$Media$Download, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleBytestreamMedia>>;
        download(params: Params$Resource$Media$Download, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        download(params: Params$Resource$Media$Download, options: MethodOptions | BodyResponseCallback<Schema$GoogleBytestreamMedia>, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        download(params: Params$Resource$Media$Download, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        download(callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        /**
         * Uploads media. Upload is supported on the URI `/upload/media/{resource_name=**\}?upload_type=media.` **Note**: Upload requests will not be successful without including `upload_type=media` query string.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        upload(params: Params$Resource$Media$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Media$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleBytestreamMedia>>;
        upload(params: Params$Resource$Media$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Media$Upload, options: MethodOptions | BodyResponseCallback<Schema$GoogleBytestreamMedia>, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        upload(params: Params$Resource$Media$Upload, callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
        upload(callback: BodyResponseCallback<Schema$GoogleBytestreamMedia>): void;
    }
    export interface Params$Resource$Media$Download extends StandardParameters {
        /**
         * Name of the media that is being downloaded. See ReadRequest.resource_name.
         */
        resourceName?: string;
    }
    export interface Params$Resource$Media$Upload extends StandardParameters {
        /**
         * Name of the media that is being downloaded. See ReadRequest.resource_name.
         */
        resourceName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleBytestreamMedia;
        /**
         * Media metadata
         */
        media?: {
            /**
             * Media mime-type
             */
            mimeType?: string;
            /**
             * Media body contents
             */
            body?: any;
        };
    }
    export class Resource$Partners {
        context: APIRequestContext;
        channels: Resource$Partners$Channels;
        targetingTypes: Resource$Partners$Targetingtypes;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits targeting options under a single partner. The operation will delete the assigned targeting options provided in BulkEditPartnerAssignedTargetingOptionsRequest.deleteRequests and then create the assigned targeting options provided in BulkEditPartnerAssignedTargetingOptionsRequest.createRequests .
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEditPartnerAssignedTargetingOptions(params: Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEditPartnerAssignedTargetingOptions(params?: Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditPartnerAssignedTargetingOptionsResponse>>;
        bulkEditPartnerAssignedTargetingOptions(params: Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEditPartnerAssignedTargetingOptions(params: Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions, options: MethodOptions | BodyResponseCallback<Schema$BulkEditPartnerAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$BulkEditPartnerAssignedTargetingOptionsResponse>): void;
        bulkEditPartnerAssignedTargetingOptions(params: Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions, callback: BodyResponseCallback<Schema$BulkEditPartnerAssignedTargetingOptionsResponse>): void;
        bulkEditPartnerAssignedTargetingOptions(callback: BodyResponseCallback<Schema$BulkEditPartnerAssignedTargetingOptionsResponse>): void;
        /**
         * Gets a partner.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Partners$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Partners$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Partner>>;
        get(params: Params$Resource$Partners$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Partners$Get, options: MethodOptions | BodyResponseCallback<Schema$Partner>, callback: BodyResponseCallback<Schema$Partner>): void;
        get(params: Params$Resource$Partners$Get, callback: BodyResponseCallback<Schema$Partner>): void;
        get(callback: BodyResponseCallback<Schema$Partner>): void;
        /**
         * Lists partners that are accessible to the current user. The order is defined by the order_by parameter.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Partners$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Partners$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPartnersResponse>>;
        list(params: Params$Resource$Partners$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Partners$List, options: MethodOptions | BodyResponseCallback<Schema$ListPartnersResponse>, callback: BodyResponseCallback<Schema$ListPartnersResponse>): void;
        list(params: Params$Resource$Partners$List, callback: BodyResponseCallback<Schema$ListPartnersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPartnersResponse>): void;
    }
    export interface Params$Resource$Partners$Bulkeditpartnerassignedtargetingoptions extends StandardParameters {
        /**
         * Required. The ID of the partner.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditPartnerAssignedTargetingOptionsRequest;
    }
    export interface Params$Resource$Partners$Get extends StandardParameters {
        /**
         * Required. The ID of the partner to fetch.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Partners$List extends StandardParameters {
        /**
         * Allows filtering by partner fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `AND` or `OR` logical operators. A sequence of restrictions implicitly uses `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `entityStatus` Examples: * All active partners: `entityStatus="ENTITY_STATUS_ACTIVE"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListPartners` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export class Resource$Partners$Channels {
        context: APIRequestContext;
        sites: Resource$Partners$Channels$Sites;
        constructor(context: APIRequestContext);
        /**
         * Creates a new channel. Returns the newly created channel if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Partners$Channels$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Partners$Channels$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        create(params: Params$Resource$Partners$Channels$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Partners$Channels$Create, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        create(params: Params$Resource$Partners$Channels$Create, callback: BodyResponseCallback<Schema$Channel>): void;
        create(callback: BodyResponseCallback<Schema$Channel>): void;
        /**
         * Gets a channel for a partner or advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Partners$Channels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Partners$Channels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        get(params: Params$Resource$Partners$Channels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Partners$Channels$Get, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        get(params: Params$Resource$Partners$Channels$Get, callback: BodyResponseCallback<Schema$Channel>): void;
        get(callback: BodyResponseCallback<Schema$Channel>): void;
        /**
         * Lists channels for a partner or advertiser.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Partners$Channels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Partners$Channels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListChannelsResponse>>;
        list(params: Params$Resource$Partners$Channels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Partners$Channels$List, options: MethodOptions | BodyResponseCallback<Schema$ListChannelsResponse>, callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        list(params: Params$Resource$Partners$Channels$List, callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListChannelsResponse>): void;
        /**
         * Updates a channel. Returns the updated channel if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Partners$Channels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Partners$Channels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Channel>>;
        patch(params: Params$Resource$Partners$Channels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Partners$Channels$Patch, options: MethodOptions | BodyResponseCallback<Schema$Channel>, callback: BodyResponseCallback<Schema$Channel>): void;
        patch(params: Params$Resource$Partners$Channels$Patch, callback: BodyResponseCallback<Schema$Channel>): void;
        patch(callback: BodyResponseCallback<Schema$Channel>): void;
    }
    export interface Params$Resource$Partners$Channels$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the created channel.
         */
        advertiserId?: string;
        /**
         * The ID of the partner that owns the created channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export interface Params$Resource$Partners$Channels$Get extends StandardParameters {
        /**
         * The ID of the advertiser that owns the fetched channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the channel to fetch.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the fetched channel.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Partners$Channels$List extends StandardParameters {
        /**
         * The ID of the advertiser that owns the channels.
         */
        advertiserId?: string;
        /**
         * Allows filtering by channel fields. Supported syntax: * Filter expressions for channel can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `displayName` Examples: * All channels for which the display name contains "google": `displayName : "google"`. The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) * `channelId` The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListChannels` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that owns the channels.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Partners$Channels$Patch extends StandardParameters {
        /**
         * The ID of the advertiser that owns the created channel.
         */
        advertiserId?: string;
        /**
         * Output only. The unique ID of the channel. Assigned by the system.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the created channel.
         */
        partnerId?: string;
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Channel;
    }
    export class Resource$Partners$Channels$Sites {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits sites under a single channel. The operation will delete the sites provided in BulkEditSitesRequest.deleted_sites and then create the sites provided in BulkEditSitesRequest.created_sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEdit(params: Params$Resource$Partners$Channels$Sites$Bulkedit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEdit(params?: Params$Resource$Partners$Channels$Sites$Bulkedit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditSitesResponse>>;
        bulkEdit(params: Params$Resource$Partners$Channels$Sites$Bulkedit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEdit(params: Params$Resource$Partners$Channels$Sites$Bulkedit, options: MethodOptions | BodyResponseCallback<Schema$BulkEditSitesResponse>, callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        bulkEdit(params: Params$Resource$Partners$Channels$Sites$Bulkedit, callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        bulkEdit(callback: BodyResponseCallback<Schema$BulkEditSitesResponse>): void;
        /**
         * Creates a site in a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Partners$Channels$Sites$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Partners$Channels$Sites$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Site>>;
        create(params: Params$Resource$Partners$Channels$Sites$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Partners$Channels$Sites$Create, options: MethodOptions | BodyResponseCallback<Schema$Site>, callback: BodyResponseCallback<Schema$Site>): void;
        create(params: Params$Resource$Partners$Channels$Sites$Create, callback: BodyResponseCallback<Schema$Site>): void;
        create(callback: BodyResponseCallback<Schema$Site>): void;
        /**
         * Deletes a site from a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Partners$Channels$Sites$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Partners$Channels$Sites$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Partners$Channels$Sites$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Partners$Channels$Sites$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Partners$Channels$Sites$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists sites in a channel.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Partners$Channels$Sites$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Partners$Channels$Sites$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSitesResponse>>;
        list(params: Params$Resource$Partners$Channels$Sites$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Partners$Channels$Sites$List, options: MethodOptions | BodyResponseCallback<Schema$ListSitesResponse>, callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        list(params: Params$Resource$Partners$Channels$Sites$List, callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSitesResponse>): void;
        /**
         * Replaces all of the sites under a single channel. The operation will replace the sites under a channel with the sites provided in ReplaceSitesRequest.new_sites.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        replace(params: Params$Resource$Partners$Channels$Sites$Replace, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        replace(params?: Params$Resource$Partners$Channels$Sites$Replace, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReplaceSitesResponse>>;
        replace(params: Params$Resource$Partners$Channels$Sites$Replace, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        replace(params: Params$Resource$Partners$Channels$Sites$Replace, options: MethodOptions | BodyResponseCallback<Schema$ReplaceSitesResponse>, callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
        replace(params: Params$Resource$Partners$Channels$Sites$Replace, callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
        replace(callback: BodyResponseCallback<Schema$ReplaceSitesResponse>): void;
    }
    export interface Params$Resource$Partners$Channels$Sites$Bulkedit extends StandardParameters {
        /**
         * Required. The ID of the parent channel to which the sites belong.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditSitesRequest;
    }
    export interface Params$Resource$Partners$Channels$Sites$Create extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel in which the site will be created.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Site;
    }
    export interface Params$Resource$Partners$Channels$Sites$Delete extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel to which the site belongs.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Required. The URL or app ID of the site to delete.
         */
        urlOrAppId?: string;
    }
    export interface Params$Resource$Partners$Channels$Sites$List extends StandardParameters {
        /**
         * The ID of the advertiser that owns the parent channel.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the parent channel to which the requested sites belong.
         */
        channelId?: string;
        /**
         * Allows filtering by site fields. Supported syntax: * Filter expressions for site retrieval can only contain at most one restriction. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `HAS (:)` operator. Supported fields: * `urlOrAppId` Examples: * All sites for which the URL or app ID contains "google": `urlOrAppId : "google"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `urlOrAppId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix " desc" should be added to the field name. Example: `urlOrAppId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `10000`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListSites` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
    }
    export interface Params$Resource$Partners$Channels$Sites$Replace extends StandardParameters {
        /**
         * Required. The ID of the parent channel whose sites will be replaced.
         */
        channelId?: string;
        /**
         * The ID of the partner that owns the parent channel.
         */
        partnerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReplaceSitesRequest;
    }
    export class Resource$Partners$Targetingtypes {
        context: APIRequestContext;
        assignedTargetingOptions: Resource$Partners$Targetingtypes$Assignedtargetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Partners$Targetingtypes$Assignedtargetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Assigns a targeting option to a partner. Returns the assigned targeting option if successful.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        create(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        create(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Deletes an assigned targeting option from a partner.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a single targeting option assigned to a partner.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AssignedTargetingOption>>;
        get(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$AssignedTargetingOption>, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get, callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$AssignedTargetingOption>): void;
        /**
         * Lists the targeting options assigned to a partner.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPartnerAssignedTargetingOptionsResponse>>;
        list(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListPartnerAssignedTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListPartnerAssignedTargetingOptionsResponse>): void;
        list(params: Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List, callback: BodyResponseCallback<Schema$ListPartnerAssignedTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPartnerAssignedTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Create extends StandardParameters {
        /**
         * Required. The ID of the partner.
         */
        partnerId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        targetingType?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AssignedTargetingOption;
    }
    export interface Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Delete extends StandardParameters {
        /**
         * Required. The ID of the assigned targeting option to delete.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the partner.
         */
        partnerId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$Get extends StandardParameters {
        /**
         * Required. An identifier unique to the targeting type in this partner that identifies the assigned targeting option being requested.
         */
        assignedTargetingOptionId?: string;
        /**
         * Required. The ID of the partner.
         */
        partnerId?: string;
        /**
         * Required. Identifies the type of this assigned targeting option. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Partners$Targetingtypes$Assignedtargetingoptions$List extends StandardParameters {
        /**
         * Allows filtering by assigned targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `OR`. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `assignedTargetingOptionId` Examples: * `AssignedTargetingOption` resource with ID 123456: `assignedTargetingOptionId="123456"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `assignedTargetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `assignedTargetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListPartnerAssignedTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. The ID of the partner.
         */
        partnerId?: string;
        /**
         * Required. Identifies the type of assigned targeting options to list. Supported targeting types: * `TARGETING_TYPE_CHANNEL`
         */
        targetingType?: string;
    }
    export class Resource$Sdfdownloadtasks {
        context: APIRequestContext;
        operations: Resource$Sdfdownloadtasks$Operations;
        constructor(context: APIRequestContext);
        /**
         * Creates an SDF Download Task. Returns an Operation. An SDF Download Task is a long-running, asynchronous operation. The metadata type of this operation is SdfDownloadTaskMetadata. If the request is successful, the response type of the operation is SdfDownloadTask. The response will not include the download files, which must be retrieved with media.download. The state of operation can be retrieved with sdfdownloadtask.operations.get. Any errors can be found in the error.message. Note that error.details is expected to be empty.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Sdfdownloadtasks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Sdfdownloadtasks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Sdfdownloadtasks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Sdfdownloadtasks$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Sdfdownloadtasks$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Sdfdownloadtasks$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateSdfDownloadTaskRequest;
    }
    export class Resource$Sdfdownloadtasks$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of an asynchronous SDF download task operation. Clients should poll this method at intervals of 30 seconds.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Sdfdownloadtasks$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Sdfdownloadtasks$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Sdfdownloadtasks$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Targetingtypes {
        context: APIRequestContext;
        targetingOptions: Resource$Targetingtypes$Targetingoptions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Targetingtypes$Targetingoptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a single targeting option.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Targetingtypes$Targetingoptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Targetingtypes$Targetingoptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TargetingOption>>;
        get(params: Params$Resource$Targetingtypes$Targetingoptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Targetingtypes$Targetingoptions$Get, options: MethodOptions | BodyResponseCallback<Schema$TargetingOption>, callback: BodyResponseCallback<Schema$TargetingOption>): void;
        get(params: Params$Resource$Targetingtypes$Targetingoptions$Get, callback: BodyResponseCallback<Schema$TargetingOption>): void;
        get(callback: BodyResponseCallback<Schema$TargetingOption>): void;
        /**
         * Lists targeting options of a given type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Targetingtypes$Targetingoptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Targetingtypes$Targetingoptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListTargetingOptionsResponse>>;
        list(params: Params$Resource$Targetingtypes$Targetingoptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Targetingtypes$Targetingoptions$List, options: MethodOptions | BodyResponseCallback<Schema$ListTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$ListTargetingOptionsResponse>): void;
        list(params: Params$Resource$Targetingtypes$Targetingoptions$List, callback: BodyResponseCallback<Schema$ListTargetingOptionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListTargetingOptionsResponse>): void;
        /**
         * Searches for targeting options of a given type based on the given search terms.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Targetingtypes$Targetingoptions$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Targetingtypes$Targetingoptions$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchTargetingOptionsResponse>>;
        search(params: Params$Resource$Targetingtypes$Targetingoptions$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Targetingtypes$Targetingoptions$Search, options: MethodOptions | BodyResponseCallback<Schema$SearchTargetingOptionsResponse>, callback: BodyResponseCallback<Schema$SearchTargetingOptionsResponse>): void;
        search(params: Params$Resource$Targetingtypes$Targetingoptions$Search, callback: BodyResponseCallback<Schema$SearchTargetingOptionsResponse>): void;
        search(callback: BodyResponseCallback<Schema$SearchTargetingOptionsResponse>): void;
    }
    export interface Params$Resource$Targetingtypes$Targetingoptions$Get extends StandardParameters {
        /**
         * Required. The Advertiser this request is being made in the context of.
         */
        advertiserId?: string;
        /**
         * Required. The ID of the of targeting option to retrieve.
         */
        targetingOptionId?: string;
        /**
         * Required. The type of targeting option to retrieve. Accepted values are: * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_VIEWABILITY` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_OMID`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Targetingtypes$Targetingoptions$List extends StandardParameters {
        /**
         * Required. The Advertiser this request is being made in the context of.
         */
        advertiserId?: string;
        /**
         * Allows filtering by targeting option fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by `OR` logical operators. * A restriction has the form of `{field\} {operator\} {value\}`. * All fields must use the `EQUALS (=)` operator. Supported fields: * `carrierAndIspDetails.type` * `geoRegionDetails.geoRegionType` * `targetingOptionId` Examples: * All `GEO REGION` targeting options that belong to sub type `GEO_REGION_TYPE_COUNTRY` or `GEO_REGION_TYPE_STATE`: `geoRegionDetails.geoRegionType="GEO_REGION_TYPE_COUNTRY" OR geoRegionDetails.geoRegionType="GEO_REGION_TYPE_STATE"` * All `CARRIER AND ISP` targeting options that belong to sub type `CARRIER_AND_ISP_TYPE_CARRIER`: `carrierAndIspDetails.type="CARRIER_AND_ISP_TYPE_CARRIER"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `targetingOptionId` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. Example: `targetingOptionId desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`. Returns error code `INVALID_ARGUMENT` if an invalid value is specified.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListTargetingOptions` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
        /**
         * Required. The type of targeting option to be listed. Accepted values are: * `TARGETING_TYPE_APP_CATEGORY` * `TARGETING_TYPE_AGE_RANGE` * `TARGETING_TYPE_GENDER` * `TARGETING_TYPE_VIDEO_PLAYER_SIZE` * `TARGETING_TYPE_USER_REWARDED_CONTENT` * `TARGETING_TYPE_PARENTAL_STATUS` * `TARGETING_TYPE_CONTENT_INSTREAM_POSITION` * `TARGETING_TYPE_CONTENT_OUTSTREAM_POSITION` * `TARGETING_TYPE_DEVICE_TYPE` * `TARGETING_TYPE_BROWSER` * `TARGETING_TYPE_HOUSEHOLD_INCOME` * `TARGETING_TYPE_ON_SCREEN_POSITION` * `TARGETING_TYPE_CARRIER_AND_ISP` * `TARGETING_TYPE_OPERATING_SYSTEM` * `TARGETING_TYPE_DEVICE_MAKE_MODEL` * `TARGETING_TYPE_ENVIRONMENT` * `TARGETING_TYPE_CATEGORY` * `TARGETING_TYPE_VIEWABILITY` * `TARGETING_TYPE_AUTHORIZED_SELLER_STATUS` * `TARGETING_TYPE_LANGUAGE` * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_DIGITAL_CONTENT_LABEL_EXCLUSION` * `TARGETING_TYPE_SENSITIVE_CATEGORY_EXCLUSION` * `TARGETING_TYPE_EXCHANGE` * `TARGETING_TYPE_SUB_EXCHANGE` * `TARGETING_TYPE_NATIVE_CONTENT_POSITION` * `TARGETING_TYPE_OMID`
         */
        targetingType?: string;
    }
    export interface Params$Resource$Targetingtypes$Targetingoptions$Search extends StandardParameters {
        /**
         * Required. The type of targeting options to retrieve. Accepted values are: * `TARGETING_TYPE_GEO_REGION` * `TARGETING_TYPE_POI` * `TARGETING_TYPE_BUSINESS_CHAIN`
         */
        targetingType?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SearchTargetingOptionsRequest;
    }
    export class Resource$Users {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Bulk edits user roles for a user. The operation will delete the assigned user roles provided in BulkEditAssignedUserRolesRequest.deletedAssignedUserRoles and then assign the user roles provided in BulkEditAssignedUserRolesRequest.createdAssignedUserRoles. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        bulkEditAssignedUserRoles(params: Params$Resource$Users$Bulkeditassigneduserroles, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bulkEditAssignedUserRoles(params?: Params$Resource$Users$Bulkeditassigneduserroles, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BulkEditAssignedUserRolesResponse>>;
        bulkEditAssignedUserRoles(params: Params$Resource$Users$Bulkeditassigneduserroles, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bulkEditAssignedUserRoles(params: Params$Resource$Users$Bulkeditassigneduserroles, options: MethodOptions | BodyResponseCallback<Schema$BulkEditAssignedUserRolesResponse>, callback: BodyResponseCallback<Schema$BulkEditAssignedUserRolesResponse>): void;
        bulkEditAssignedUserRoles(params: Params$Resource$Users$Bulkeditassigneduserroles, callback: BodyResponseCallback<Schema$BulkEditAssignedUserRolesResponse>): void;
        bulkEditAssignedUserRoles(callback: BodyResponseCallback<Schema$BulkEditAssignedUserRolesResponse>): void;
        /**
         * Creates a new user. Returns the newly created user if successful. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Users$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Users$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        create(params: Params$Resource$Users$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Users$Create, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        create(params: Params$Resource$Users$Create, callback: BodyResponseCallback<Schema$User>): void;
        create(callback: BodyResponseCallback<Schema$User>): void;
        /**
         * Deletes a user. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Users$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Users$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Users$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a user. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Users$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Users$Get, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        get(params: Params$Resource$Users$Get, callback: BodyResponseCallback<Schema$User>): void;
        get(callback: BodyResponseCallback<Schema$User>): void;
        /**
         * Lists users that are accessible to the current user. If two users have user roles on the same partner or advertiser, they can access each other. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Users$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListUsersResponse>>;
        list(params: Params$Resource$Users$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$List, options: MethodOptions | BodyResponseCallback<Schema$ListUsersResponse>, callback: BodyResponseCallback<Schema$ListUsersResponse>): void;
        list(params: Params$Resource$Users$List, callback: BodyResponseCallback<Schema$ListUsersResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListUsersResponse>): void;
        /**
         * Updates an existing user. Returns the updated user if successful. This method has unique authentication requirements. Read the prerequisites in our [Managing Users guide](/display-video/api/guides/users/overview#prerequisites) before using this method. The "Try this method" feature does not work for this method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Users$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Users$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        patch(params: Params$Resource$Users$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Users$Patch, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        patch(params: Params$Resource$Users$Patch, callback: BodyResponseCallback<Schema$User>): void;
        patch(callback: BodyResponseCallback<Schema$User>): void;
    }
    export interface Params$Resource$Users$Bulkeditassigneduserroles extends StandardParameters {
        /**
         * Required. The ID of the user to which the assigned user roles belong.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BulkEditAssignedUserRolesRequest;
    }
    export interface Params$Resource$Users$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export interface Params$Resource$Users$Delete extends StandardParameters {
        /**
         * Required. The ID of the user to delete.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Get extends StandardParameters {
        /**
         * Required. The ID of the user to fetch.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$List extends StandardParameters {
        /**
         * Allows filtering by user fields. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions can be combined by the logical operator `AND`. * A restriction has the form of `{field\} {operator\} {value\}`. * The `budget.budget_segments.date_range.end_date` field must use the `LESS THAN (<)` operator. * The `displayName and `email` field must use the `HAS (:)` operator. * All other fields must use the `EQUALS (=)` operator. Supported fields: * `assignedUserRole.advertiserId` * `assignedUserRole.entityType` * This is synthetic field of `AssignedUserRole` used for filtering. Identifies the type of entity to which the user role is assigned. Valid values are `Partner` and `Advertiser`. * `assignedUserRole.parentPartnerId` * This is a synthetic field of `AssignedUserRole` used for filtering. Identifies the parent partner of the entity to which the user role is assigned. * `assignedUserRole.partnerId` * `assignedUserRole.userRole` * `displayName` * `email` Examples: * The user with `displayName` containing "foo": `displayName:"foo"` * The user with `email` containing "bar": `email:"bar"` * All users with standard user roles: `assignedUserRole.userRole="STANDARD"` * All users with user roles for partner 123: `assignedUserRole.partnerId="123"` * All users with user roles for advertiser 123: `assignedUserRole.advertiserId="123"` * All users with partner level user roles: `entityType="PARTNER"` * All users with user roles for partner 123 and advertisers under partner 123: `parentPartnerId="123"` The length of this field should be no more than 500 characters. Reference our [filter `LIST` requests](/display-video/api/guides/how-tos/filters) guide for more information.
         */
        filter?: string;
        /**
         * Field by which to sort the list. Acceptable values are: * `displayName` (default) The default sorting order is ascending. To specify descending order for a field, a suffix "desc" should be added to the field name. For example, `displayName desc`.
         */
        orderBy?: string;
        /**
         * Requested page size. Must be between `1` and `200`. If unspecified will default to `100`.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results the server should return. Typically, this is the value of next_page_token returned from the previous call to `ListUsers` method. If not specified, the first page of results will be returned.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Users$Patch extends StandardParameters {
        /**
         * Required. The mask to control which fields to update.
         */
        updateMask?: string;
        /**
         * Output only. The unique ID of the user. Assigned by the system.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export {};
}
