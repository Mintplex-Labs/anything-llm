import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace areainsights_v1 {
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
     * Places Aggregate API
     *
     * Places Aggregate API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const areainsights = google.areainsights('v1');
     * ```
     */
    export class Areainsights {
        context: APIRequestContext;
        v1: Resource$V1;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A circle is defined by a center point and radius in meters.
     */
    export interface Schema$Circle {
        /**
         * The latitude and longitude of the center of the circle.
         */
        latLng?: Schema$LatLng;
        /**
         * **Format:** Must be in the format `places/PLACE_ID`, where `PLACE_ID` is the unique identifier of a place. For example: `places/ChIJgUbEo8cfqokR5lP9_Wh_DaM`.
         */
        place?: string | null;
        /**
         * Optional. The radius of the circle in meters
         */
        radius?: number | null;
    }
    /**
     * Request for the ComputeInsights RPC.
     */
    export interface Schema$ComputeInsightsRequest {
        /**
         * Required. Insight filter.
         */
        filter?: Schema$Filter;
        /**
         * Required. Insights to compute. Currently only INSIGHT_COUNT and INSIGHT_PLACES are supported.
         */
        insights?: string[] | null;
    }
    /**
     * Response for the ComputeInsights RPC.
     */
    export interface Schema$ComputeInsightsResponse {
        /**
         * Result for Insights.INSIGHT_COUNT.
         */
        count?: string | null;
        /**
         * Result for Insights.INSIGHT_PLACES.
         */
        placeInsights?: Schema$PlaceInsight[];
    }
    /**
     * Custom Area.
     */
    export interface Schema$CustomArea {
        /**
         * Required. The custom area represented as a polygon
         */
        polygon?: Schema$Polygon;
    }
    /**
     * Filters for the ComputeInsights RPC.
     */
    export interface Schema$Filter {
        /**
         * Required. Restricts results to places which are located in the area specified by location filters.
         */
        locationFilter?: Schema$LocationFilter;
        /**
         * Optional. Restricts results to places whose operating status is included on this list. If operating_status is not set, OPERATING_STATUS_OPERATIONAL is used as default.
         */
        operatingStatus?: string[] | null;
        /**
         * Optional. Restricts results to places whose price level is included on this list. If `price_levels` is not set, all price levels are included in the results.
         */
        priceLevels?: string[] | null;
        /**
         * Optional. Restricts results to places whose average user ratings are in the range specified by rating_filter. If rating_filter is not set, all ratings are included in the result.
         */
        ratingFilter?: Schema$RatingFilter;
        /**
         * Required. Place type filters.
         */
        typeFilter?: Schema$TypeFilter;
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
     * Location filters. Specifies the area of interest for the insight.
     */
    export interface Schema$LocationFilter {
        /**
         * Area as a circle.
         */
        circle?: Schema$Circle;
        /**
         * Custom area specified by a polygon.
         */
        customArea?: Schema$CustomArea;
        /**
         * Area as region.
         */
        region?: Schema$Region;
    }
    /**
     * Holds information about a place
     */
    export interface Schema$PlaceInsight {
        /**
         * The unique identifier of the place. This resource name can be used to retrieve details about the place using the [Places API](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places/get).
         */
        place?: string | null;
    }
    /**
     * A polygon is represented by a series of connected coordinates in an counterclockwise ordered sequence. The coordinates form a closed loop and define a filled region. The first and last coordinates are equivalent, and they must contain identical values. The format is a simplified version of GeoJSON polygons (we only support one counterclockwise exterior ring).
     */
    export interface Schema$Polygon {
        /**
         * Optional. The coordinates that define the polygon.
         */
        coordinates?: Schema$LatLng[];
    }
    /**
     * Average user rating filters.
     */
    export interface Schema$RatingFilter {
        /**
         * Optional. Restricts results to places whose average user rating is strictly less than or equal to max_rating. Values must be between 1.0 and 5.0.
         */
        maxRating?: number | null;
        /**
         * Optional. Restricts results to places whose average user rating is greater than or equal to min_rating. Values must be between 1.0 and 5.0.
         */
        minRating?: number | null;
    }
    /**
     * A region is a geographic boundary such as: cities, postal codes, counties, states, etc.
     */
    export interface Schema$Region {
        /**
         * The unique identifier of a specific geographic region.
         */
        place?: string | null;
    }
    /**
     * Place type filters. Only Place types from [Table a](https://developers.google.com/maps/documentation/places/web-service/place-types#table-a) are supported. A place can only have a single primary type associated with it. For example, the primary type might be "mexican_restaurant" or "steak_house". Use included_primary_types and excluded_primary_types to filter the results on a place's primary type. A place can also have multiple type values associated with it. For example a restaurant might have the following types: "seafood_restaurant", "restaurant", "food", "point_of_interest", "establishment". Use included_types and excluded_types to filter the results on the list of types associated with a place. If a search is specified with multiple type restrictions, only places that satisfy all of the restrictions are returned. For example, if you specify {"included_types": ["restaurant"], "excluded_primary_types": ["steak_house"]\}, the returned places provide "restaurant" related services but do not operate primarily as a "steak_house". If there are any conflicting types, i.e. a type appears in both included_types and excluded_types types or included_primary_types and excluded_primary_types, an INVALID_ARGUMENT error is returned. One of included_types or included_primary_types must be set.
     */
    export interface Schema$TypeFilter {
        /**
         * Optional. Excluded primary Place types.
         */
        excludedPrimaryTypes?: string[] | null;
        /**
         * Optional. Excluded Place types.
         */
        excludedTypes?: string[] | null;
        /**
         * Optional. Included primary Place types.
         */
        includedPrimaryTypes?: string[] | null;
        /**
         * Optional. Included Place types.
         */
        includedTypes?: string[] | null;
    }
    export class Resource$V1 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * This method lets you retrieve insights about areas using a variety of filter such as: area, place type, operating status, price level and ratings. Currently "count" and "places" insights are supported. With "count" insights you can answer questions such as "How many restaurant are located in California that are operational, are inexpensive and have an average rating of at least 4 stars" (see `insight` enum for more details). With "places" insights, you can determine which places match the requested filter. Clients can then use those place resource names to fetch more details about each individual place using the Places API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        computeInsights(params: Params$Resource$V1$Computeinsights, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        computeInsights(params?: Params$Resource$V1$Computeinsights, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ComputeInsightsResponse>>;
        computeInsights(params: Params$Resource$V1$Computeinsights, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        computeInsights(params: Params$Resource$V1$Computeinsights, options: MethodOptions | BodyResponseCallback<Schema$ComputeInsightsResponse>, callback: BodyResponseCallback<Schema$ComputeInsightsResponse>): void;
        computeInsights(params: Params$Resource$V1$Computeinsights, callback: BodyResponseCallback<Schema$ComputeInsightsResponse>): void;
        computeInsights(callback: BodyResponseCallback<Schema$ComputeInsightsResponse>): void;
    }
    export interface Params$Resource$V1$Computeinsights extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$ComputeInsightsRequest;
    }
    export {};
}
