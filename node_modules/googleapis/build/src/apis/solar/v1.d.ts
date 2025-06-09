import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace solar_v1 {
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
     * Solar API
     *
     * Solar API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const solar = google.solar('v1');
     * ```
     */
    export class Solar {
        context: APIRequestContext;
        buildingInsights: Resource$Buildinginsights;
        dataLayers: Resource$Datalayers;
        geoTiff: Resource$Geotiff;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Response message for `Solar.FindClosestBuildingInsights`. Information about the location, dimensions, and solar potential of a building.
     */
    export interface Schema$BuildingInsights {
        /**
         * Administrative area 1 (e.g., in the US, the state) that contains this building. For example, in the US, the abbreviation might be "MA" or "CA."
         */
        administrativeArea?: string | null;
        /**
         * The bounding box of the building.
         */
        boundingBox?: Schema$LatLngBox;
        /**
         * A point near the center of the building.
         */
        center?: Schema$LatLng;
        /**
         * Date that the underlying imagery was acquired. This is approximate.
         */
        imageryDate?: Schema$Date;
        /**
         * When processing was completed on this imagery.
         */
        imageryProcessedDate?: Schema$Date;
        /**
         * The quality of the imagery used to compute the data for this building.
         */
        imageryQuality?: string | null;
        /**
         * The resource name for the building, of the format `buildings/{place_id\}`.
         */
        name?: string | null;
        /**
         * Postal code (e.g., US zip code) this building is contained by.
         */
        postalCode?: string | null;
        /**
         * Region code for the country (or region) this building is in.
         */
        regionCode?: string | null;
        /**
         * Solar potential of the building.
         */
        solarPotential?: Schema$SolarPotential;
        /**
         * Statistical area (e.g., US census tract) this building is in.
         */
        statisticalArea?: string | null;
    }
    /**
     * Cost and benefit of an outright purchase of a particular configuration of solar panels with a particular electricity usage.
     */
    export interface Schema$CashPurchaseSavings {
        /**
         * Initial cost before tax incentives: the amount that must be paid out-of-pocket. Contrast with `upfront_cost`, which is after tax incentives.
         */
        outOfPocketCost?: Schema$Money;
        /**
         * Number of years until payback occurs. A negative value means payback never occurs within the lifetime period.
         */
        paybackYears?: number | null;
        /**
         * The value of all tax rebates.
         */
        rebateValue?: Schema$Money;
        /**
         * How much is saved (or not) over the lifetime period.
         */
        savings?: Schema$SavingsOverTime;
        /**
         * Initial cost after tax incentives: it's the amount that must be paid during first year. Contrast with `out_of_pocket_cost`, which is before tax incentives.
         */
        upfrontCost?: Schema$Money;
    }
    /**
     * Information about the solar potential of a region. The actual data are contained in a number of GeoTIFF files covering the requested region, for which this message contains URLs: Each string in the `DataLayers` message contains a URL from which the corresponding GeoTIFF can be fetched. These URLs are valid for a few hours after they've been generated. Most of the GeoTIFF files are at a resolution of 0.1m/pixel, but the monthly flux file is at 0.5m/pixel, and the hourly shade files are at 1m/pixel. If a `pixel_size_meters` value was specified in the `GetDataLayersRequest`, then the minimum resolution in the GeoTIFF files will be that value.
     */
    export interface Schema$DataLayers {
        /**
         * The URL for the annual flux map (annual sunlight on roofs) of the region. Values are kWh/kW/year. This is *unmasked flux*: flux is computed for every location, not just building rooftops. Invalid locations are stored as -9999: locations outside our coverage area will be invalid, and a few locations inside the coverage area, where we were unable to calculate flux, will also be invalid.
         */
        annualFluxUrl?: string | null;
        /**
         * The URL for an image of the DSM (Digital Surface Model) of the region. Values are in meters above EGM96 geoid (i.e., sea level). Invalid locations (where we don't have data) are stored as -9999.
         */
        dsmUrl?: string | null;
        /**
         * Twelve URLs for hourly shade, corresponding to January...December, in order. Each GeoTIFF will contain 24 bands, corresponding to the 24 hours of the day. Each pixel is a 32 bit integer, corresponding to the (up to) 31 days of that month; a 1 bit means that the corresponding location is able to see the sun at that day, of that hour, of that month. Invalid locations are stored as -9999 (since this is negative, it has bit 31 set, and no valid value could have bit 31 set as that would correspond to the 32nd day of the month). An example may be useful. If you want to know whether a point (at pixel location (x, y)) saw sun at 4pm on the 22nd of June you would: 1. fetch the sixth URL in this list (corresponding to June). 1. look up the 17th channel (corresponding to 4pm). 1. read the 32-bit value at (x, y). 1. read bit 21 of the value (corresponding to the 22nd of the month). 1. if that bit is a 1, then that spot saw the sun at 4pm 22 June. More formally: Given `month` (1-12), `day` (1...month max; February has 28 days) and `hour` (0-23), the shade/sun for that month/day/hour at a position `(x, y)` is the bit ``` (hourly_shade[month - 1])(x, y)[hour] & (1 << (day - 1)) ``` where `(x, y)` is spatial indexing, `[month - 1]` refers to fetching the `month - 1`st URL (indexing from zero), `[hour]` is indexing into the channels, and a final non-zero result means "sunny". There are no leap days, and DST doesn't exist (all days are 24 hours long; noon is always "standard time" noon).
         */
        hourlyShadeUrls?: string[] | null;
        /**
         * When the source imagery (from which all the other data are derived) in this region was taken. It is necessarily somewhat approximate, as the images may have been taken over more than one day.
         */
        imageryDate?: Schema$Date;
        /**
         * When processing was completed on this imagery.
         */
        imageryProcessedDate?: Schema$Date;
        /**
         * The quality of the result's imagery.
         */
        imageryQuality?: string | null;
        /**
         * The URL for the building mask image: one bit per pixel saying whether that pixel is considered to be part of a rooftop or not.
         */
        maskUrl?: string | null;
        /**
         * The URL for the monthly flux map (sunlight on roofs, broken down by month) of the region. Values are kWh/kW/year. The GeoTIFF pointed to by this URL will contain twelve bands, corresponding to January...December, in order.
         */
        monthlyFluxUrl?: string | null;
        /**
         * The URL for an image of RGB data (aerial photo) of the region.
         */
        rgbUrl?: string | null;
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
     * Cost and benefit of using a loan to buy a particular configuration of solar panels with a particular electricity usage.
     */
    export interface Schema$FinancedPurchaseSavings {
        /**
         * Annual loan payments.
         */
        annualLoanPayment?: Schema$Money;
        /**
         * The interest rate on loans assumed in this set of calculations.
         */
        loanInterestRate?: number | null;
        /**
         * The value of all tax rebates (including Federal Investment Tax Credit (ITC)).
         */
        rebateValue?: Schema$Money;
        /**
         * How much is saved (or not) over the lifetime period.
         */
        savings?: Schema$SavingsOverTime;
    }
    /**
     * Analysis of the cost and benefits of the optimum solar layout for a particular electric bill size.
     */
    export interface Schema$FinancialAnalysis {
        /**
         * How much electricity the house uses in an average month, based on the bill size and the local electricity rates.
         */
        averageKwhPerMonth?: number | null;
        /**
         * Cost and benefit of buying the solar panels with cash.
         */
        cashPurchaseSavings?: Schema$CashPurchaseSavings;
        /**
         * Whether this is the bill size selected to be the default bill for the area this building is in. Exactly one `FinancialAnalysis` in `BuildingSolarPotential` should have `default_bill` set.
         */
        defaultBill?: boolean | null;
        /**
         * Cost and benefit of buying the solar panels by financing the purchase.
         */
        financedPurchaseSavings?: Schema$FinancedPurchaseSavings;
        /**
         * Financial information that applies regardless of the financing method used.
         */
        financialDetails?: Schema$FinancialDetails;
        /**
         * Cost and benefit of leasing the solar panels.
         */
        leasingSavings?: Schema$LeasingSavings;
        /**
         * The monthly electric bill this analysis assumes.
         */
        monthlyBill?: Schema$Money;
        /**
         * Index in solar_panel_configs of the optimum solar layout for this bill size. This can be -1 indicating that there is no layout. In this case, the remaining submessages will be omitted.
         */
        panelConfigIndex?: number | null;
    }
    /**
     * Details of a financial analysis. Some of these details are already stored at higher levels (e.g., out of pocket cost). Total money amounts are over a lifetime period defined by the panel_lifetime_years field in SolarPotential. Note: The out of pocket cost of purchasing the panels is given in the out_of_pocket_cost field in CashPurchaseSavings.
     */
    export interface Schema$FinancialDetails {
        /**
         * Total cost of electricity the user would have paid over the lifetime period if they didn't install solar.
         */
        costOfElectricityWithoutSolar?: Schema$Money;
        /**
         * Amount of money available from federal incentives; this applies if the user buys (with or without a loan) the panels.
         */
        federalIncentive?: Schema$Money;
        /**
         * How many AC kWh we think the solar panels will generate in their first year.
         */
        initialAcKwhPerYear?: number | null;
        /**
         * Amount of money the user will receive from Solar Renewable Energy Credits over the panel lifetime; this applies if the user buys (with or without a loan) the panels.
         */
        lifetimeSrecTotal?: Schema$Money;
        /**
         * Whether net metering is allowed.
         */
        netMeteringAllowed?: boolean | null;
        /**
         * The percentage (0-100) of solar electricity production we assumed was exported to the grid, based on the first quarter of production. This affects the calculations if net metering is not allowed.
         */
        percentageExportedToGrid?: number | null;
        /**
         * Utility bill for electricity not produced by solar, for the lifetime of the panels.
         */
        remainingLifetimeUtilityBill?: Schema$Money;
        /**
         * Percentage (0-100) of the user's power supplied by solar. Valid for the first year but approximately correct for future years.
         */
        solarPercentage?: number | null;
        /**
         * Amount of money available from state incentives; this applies if the user buys (with or without a loan) the panels.
         */
        stateIncentive?: Schema$Money;
        /**
         * Amount of money available from utility incentives; this applies if the user buys (with or without a loan) the panels.
         */
        utilityIncentive?: Schema$Money;
    }
    /**
     * Message that represents an arbitrary HTTP body. It should only be used for payload formats that can't be represented as JSON, such as raw binary or an HTML page. This message can be used both in streaming and non-streaming API methods in the request as well as the response. It can be used as a top-level request field, which is convenient if one wants to extract parameters from either the URL or HTTP template into the request fields and also want access to the raw HTTP body. Example: message GetResourceRequest { // A unique request id. string request_id = 1; // The raw HTTP body is bound to this field. google.api.HttpBody http_body = 2; \} service ResourceService { rpc GetResource(GetResourceRequest) returns (google.api.HttpBody); rpc UpdateResource(google.api.HttpBody) returns (google.protobuf.Empty); \} Example with streaming methods: service CaldavService { rpc GetCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); rpc UpdateCalendar(stream google.api.HttpBody) returns (stream google.api.HttpBody); \} Use of this type only changes how the request and response bodies are handled, all other features will continue to work unchanged.
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
     * An object that represents a latitude/longitude pair. This is expressed as a pair of doubles to represent degrees latitude and degrees longitude. Unless specified otherwise, this object must conform to the WGS84 standard. Values must be within normalized ranges.
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
     * A bounding box in lat/lng coordinates.
     */
    export interface Schema$LatLngBox {
        /**
         * The northeast corner of the box.
         */
        ne?: Schema$LatLng;
        /**
         * The southwest corner of the box.
         */
        sw?: Schema$LatLng;
    }
    /**
     * Cost and benefit of leasing a particular configuration of solar panels with a particular electricity usage.
     */
    export interface Schema$LeasingSavings {
        /**
         * Estimated annual leasing cost.
         */
        annualLeasingCost?: Schema$Money;
        /**
         * Whether leases are allowed in this juristiction (leases are not allowed in some states). If this field is false, then the values in this message should probably be ignored.
         */
        leasesAllowed?: boolean | null;
        /**
         * Whether leases are supported in this juristiction by the financial calculation engine. If this field is false, then the values in this message should probably be ignored. This is independent of `leases_allowed`: in some areas leases are allowed, but under conditions that aren't handled by the financial models.
         */
        leasesSupported?: boolean | null;
        /**
         * How much is saved (or not) over the lifetime period.
         */
        savings?: Schema$SavingsOverTime;
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
     * Information about the size and sunniness quantiles of a roof segment.
     */
    export interface Schema$RoofSegmentSizeAndSunshineStats {
        /**
         * Compass direction the roof segment is pointing in. 0 = North, 90 = East, 180 = South. For a "flat" roof segment (`pitch_degrees` very near 0), azimuth is not well defined, so for consistency, we define it arbitrarily to be 0 (North).
         */
        azimuthDegrees?: number | null;
        /**
         * The bounding box of the roof segment.
         */
        boundingBox?: Schema$LatLngBox;
        /**
         * A point near the center of the roof segment.
         */
        center?: Schema$LatLng;
        /**
         * Angle of the roof segment relative to the theoretical ground plane. 0 = parallel to the ground, 90 = perpendicular to the ground.
         */
        pitchDegrees?: number | null;
        /**
         * The height of the roof segment plane, in meters above sea level, at the point designated by `center`. Together with the pitch, azimuth, and center location, this fully defines the roof segment plane.
         */
        planeHeightAtCenterMeters?: number | null;
        /**
         * Total size and sunlight quantiles for the roof segment.
         */
        stats?: Schema$SizeAndSunshineStats;
    }
    /**
     * Information about a roof segment on the building, with some number of panels placed on it.
     */
    export interface Schema$RoofSegmentSummary {
        /**
         * Compass direction the roof segment is pointing in. 0 = North, 90 = East, 180 = South. For a "flat" roof segment (`pitch_degrees` very near 0), azimuth is not well defined, so for consistency, we define it arbitrarily to be 0 (North).
         */
        azimuthDegrees?: number | null;
        /**
         * The total number of panels on this segment.
         */
        panelsCount?: number | null;
        /**
         * Angle of the roof segment relative to the theoretical ground plane. 0 = parallel to the ground, 90 = perpendicular to the ground.
         */
        pitchDegrees?: number | null;
        /**
         * Index in roof_segment_stats of the corresponding `RoofSegmentSizeAndSunshineStats`.
         */
        segmentIndex?: number | null;
        /**
         * How much sunlight energy this part of the layout captures over the course of a year, in DC kWh, assuming the panels described above.
         */
        yearlyEnergyDcKwh?: number | null;
    }
    /**
     * Financial information that's shared between different financing methods.
     */
    export interface Schema$SavingsOverTime {
        /**
         * Indicates whether this scenario is financially viable. Will be false for scenarios with poor financial viability (e.g., money-losing).
         */
        financiallyViable?: boolean | null;
        /**
         * Using the assumed discount rate, what is the present value of the cumulative lifetime savings?
         */
        presentValueOfSavingsLifetime?: Schema$Money;
        /**
         * Using the assumed discount rate, what is the present value of the cumulative 20-year savings?
         */
        presentValueOfSavingsYear20?: Schema$Money;
        /**
         * Savings in the entire panel lifetime.
         */
        savingsLifetime?: Schema$Money;
        /**
         * Savings in the first year after panel installation.
         */
        savingsYear1?: Schema$Money;
        /**
         * Savings in the first twenty years after panel installation.
         */
        savingsYear20?: Schema$Money;
    }
    /**
     * Size and sunniness quantiles of a roof, or part of a roof.
     */
    export interface Schema$SizeAndSunshineStats {
        /**
         * The area of the roof or roof segment, in m^2. This is the roof area (accounting for tilt), not the ground footprint area.
         */
        areaMeters2?: number | null;
        /**
         * The ground footprint area covered by the roof or roof segment, in m^2.
         */
        groundAreaMeters2?: number | null;
        /**
         * Quantiles of the pointwise sunniness across the area. If there are N values here, this represents the (N-1)-iles. For example, if there are 5 values, then they would be the quartiles (min, 25%, 50%, 75%, max). Values are in annual kWh/kW like max_sunshine_hours_per_year.
         */
        sunshineQuantiles?: number[] | null;
    }
    /**
     * SolarPanel describes the position, orientation, and production of a single solar panel. See the panel_height_meters, panel_width_meters, and panel_capacity_watts fields in SolarPotential for information on the parameters of the panel.
     */
    export interface Schema$SolarPanel {
        /**
         * The centre of the panel.
         */
        center?: Schema$LatLng;
        /**
         * The orientation of the panel.
         */
        orientation?: string | null;
        /**
         * Index in roof_segment_stats of the `RoofSegmentSizeAndSunshineStats` which corresponds to the roof segment that this panel is placed on.
         */
        segmentIndex?: number | null;
        /**
         * How much sunlight energy this layout captures over the course of a year, in DC kWh.
         */
        yearlyEnergyDcKwh?: number | null;
    }
    /**
     * SolarPanelConfig describes a particular placement of solar panels on the roof.
     */
    export interface Schema$SolarPanelConfig {
        /**
         * Total number of panels. Note that this is redundant to (the sum of) the corresponding fields in roof_segment_summaries.
         */
        panelsCount?: number | null;
        /**
         * Information about the production of each roof segment that is carrying at least one panel in this layout. `roof_segment_summaries[i]` describes the i-th roof segment, including its size, expected production and orientation.
         */
        roofSegmentSummaries?: Schema$RoofSegmentSummary[];
        /**
         * How much sunlight energy this layout captures over the course of a year, in DC kWh, assuming the panels described above.
         */
        yearlyEnergyDcKwh?: number | null;
    }
    /**
     * Information about the solar potential of a building. A number of fields in this are defined in terms of "panels". The fields panel_capacity_watts, panel_height_meters, and panel_width_meters describe the parameters of the model of panel used in these calculations.
     */
    export interface Schema$SolarPotential {
        /**
         * Size and sunlight quantiles for the entire building, including parts of the roof that were not assigned to some roof segment. Because the orientations of these parts are not well characterised, the roof area estimate is unreliable, but the ground area estimate is reliable. It may be that a more reliable whole building roof area can be obtained by scaling the roof area from whole_roof_stats by the ratio of the ground areas of `building_stats` and `whole_roof_stats`.
         */
        buildingStats?: Schema$SizeAndSunshineStats;
        /**
         * Equivalent amount of CO2 produced per MWh of grid electricity. This is a measure of the carbon intensity of grid electricity displaced by solar electricity.
         */
        carbonOffsetFactorKgPerMwh?: number | null;
        /**
         * A FinancialAnalysis gives the savings from going solar assuming a given monthly bill and a given electricity provider. They are in order of increasing order of monthly bill amount. This field will be empty for buildings in areas for which the Solar API does not have enough information to perform financial computations.
         */
        financialAnalyses?: Schema$FinancialAnalysis[];
        /**
         * Size, in square meters, of the maximum array.
         */
        maxArrayAreaMeters2?: number | null;
        /**
         * Size of the maximum array - that is, the maximum number of panels that can fit on the roof.
         */
        maxArrayPanelsCount?: number | null;
        /**
         * Maximum number of sunshine hours received per year, by any point on the roof. Sunshine hours are a measure of the total amount of insolation (energy) received per year. 1 sunshine hour = 1 kWh per kW (where kW refers to kW of capacity under Standard Testing Conditions).
         */
        maxSunshineHoursPerYear?: number | null;
        /**
         * Capacity, in watts, of the panel used in the calculations.
         */
        panelCapacityWatts?: number | null;
        /**
         * Height, in meters in portrait orientation, of the panel used in the calculations.
         */
        panelHeightMeters?: number | null;
        /**
         * The expected lifetime, in years, of the solar panels. This is used in the financial calculations.
         */
        panelLifetimeYears?: number | null;
        /**
         * Width, in meters in portrait orientation, of the panel used in the calculations.
         */
        panelWidthMeters?: number | null;
        /**
         * Size and sunlight quantiles for each roof segment.
         */
        roofSegmentStats?: Schema$RoofSegmentSizeAndSunshineStats[];
        /**
         * Each SolarPanelConfig describes a different arrangement of solar panels on the roof. They are in order of increasing number of panels. The `SolarPanelConfig` with panels_count=N is based on the first N panels in the `solar_panels` list. This field is only populated if at least 4 panels can fit on a roof.
         */
        solarPanelConfigs?: Schema$SolarPanelConfig[];
        /**
         * Each SolarPanel describes a single solar panel. They are listed in the order that the panel layout algorithm placed this. This is usually, though not always, in decreasing order of annual energy production.
         */
        solarPanels?: Schema$SolarPanel[];
        /**
         * Total size and sunlight quantiles for the part of the roof that was assigned to some roof segment. Despite the name, this may not include the entire building. See building_stats.
         */
        wholeRoofStats?: Schema$SizeAndSunshineStats;
    }
    export class Resource$Buildinginsights {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Locates the building whose centroid is closest to a query point. Returns an error with code `NOT_FOUND` if there are no buildings within approximately 50m of the query point.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        findClosest(params: Params$Resource$Buildinginsights$Findclosest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        findClosest(params?: Params$Resource$Buildinginsights$Findclosest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildingInsights>>;
        findClosest(params: Params$Resource$Buildinginsights$Findclosest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        findClosest(params: Params$Resource$Buildinginsights$Findclosest, options: MethodOptions | BodyResponseCallback<Schema$BuildingInsights>, callback: BodyResponseCallback<Schema$BuildingInsights>): void;
        findClosest(params: Params$Resource$Buildinginsights$Findclosest, callback: BodyResponseCallback<Schema$BuildingInsights>): void;
        findClosest(callback: BodyResponseCallback<Schema$BuildingInsights>): void;
    }
    export interface Params$Resource$Buildinginsights$Findclosest extends StandardParameters {
        /**
         * Optional. Specifies the pre-GA features to enable.
         */
        experiments?: string[];
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        'location.latitude'?: number;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        'location.longitude'?: number;
        /**
         * Optional. The minimum quality level allowed in the results. No result with lower quality than this will be returned. Not specifying this is equivalent to restricting to HIGH quality only.
         */
        requiredQuality?: string;
    }
    export class Resource$Datalayers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets solar information for a region surrounding a location. Returns an error with code `NOT_FOUND` if the location is outside the coverage area.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Datalayers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Datalayers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DataLayers>>;
        get(params: Params$Resource$Datalayers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Datalayers$Get, options: MethodOptions | BodyResponseCallback<Schema$DataLayers>, callback: BodyResponseCallback<Schema$DataLayers>): void;
        get(params: Params$Resource$Datalayers$Get, callback: BodyResponseCallback<Schema$DataLayers>): void;
        get(callback: BodyResponseCallback<Schema$DataLayers>): void;
    }
    export interface Params$Resource$Datalayers$Get extends StandardParameters {
        /**
         * Optional. Whether to require exact quality of the imagery. If set to false, the `required_quality` field is interpreted as the minimum required quality, such that HIGH quality imagery may be returned when `required_quality` is set to MEDIUM. If set to true, `required_quality` is interpreted as the exact required quality and only `MEDIUM` quality imagery is returned if `required_quality` is set to `MEDIUM`.
         */
        exactQualityRequired?: boolean;
        /**
         * Optional. Specifies the pre-GA experiments to enable.
         */
        experiments?: string[];
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        'location.latitude'?: number;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        'location.longitude'?: number;
        /**
         * Optional. The minimum scale, in meters per pixel, of the data to return. Values of 0.1 (the default, if this field is not set explicitly), 0.25, 0.5, and 1.0 are supported. Imagery components whose normal resolution is less than `pixel_size_meters` will be returned at the resolution specified by `pixel_size_meters`; imagery components whose normal resolution is equal to or greater than `pixel_size_meters` will be returned at that normal resolution.
         */
        pixelSizeMeters?: number;
        /**
         * Required. The radius, in meters, defining the region surrounding that centre point for which data should be returned. The limitations on this value are: * Any value up to 100m can always be specified. * Values over 100m can be specified, as long as `radius_meters` <= `pixel_size_meters * 1000`. * However, for values over 175m, the `DataLayerView` in the request must not include monthly flux or hourly shade.
         */
        radiusMeters?: number;
        /**
         * Optional. The minimum quality level allowed in the results. No result with lower quality than this will be returned. Not specifying this is equivalent to restricting to HIGH quality only.
         */
        requiredQuality?: string;
        /**
         * Optional. The desired subset of the data to return.
         */
        view?: string;
    }
    export class Resource$Geotiff {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns an image by its ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Geotiff$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Geotiff$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        get(params: Params$Resource$Geotiff$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Geotiff$Get, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        get(params: Params$Resource$Geotiff$Get, callback: BodyResponseCallback<Schema$HttpBody>): void;
        get(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Geotiff$Get extends StandardParameters {
        /**
         * Required. The ID of the asset being requested.
         */
        id?: string;
    }
    export {};
}
