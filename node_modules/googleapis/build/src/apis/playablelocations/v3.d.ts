import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace playablelocations_v3 {
    export interface Options extends GlobalOptions {
        version: 'v3';
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
     * Playable Locations API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const playablelocations = google.playablelocations('v3');
     * ```
     */
    export class Playablelocations {
        context: APIRequestContext;
        v3: Resource$V3;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Encapsulates impression event details.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3Impression {
        /**
         * An arbitrary, developer-defined type identifier for each type of game object used in your game. Since players interact with differ types of game objects in different ways, this field allows you to segregate impression data by type for analysis. You should assign a unique `game_object_type` ID to represent a distinct type of game object in your game. For example, 1=monster location, 2=powerup location.
         */
        gameObjectType?: number | null;
        /**
         * Required. The type of impression event.
         */
        impressionType?: string | null;
        /**
         * Required. The name of the playable location.
         */
        locationName?: string | null;
    }
    /**
     * A request for logging impressions.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3LogImpressionsRequest {
        /**
         * Required. Information about the client device. For example, device model and operating system.
         */
        clientInfo?: Schema$GoogleMapsUnityClientInfo;
        /**
         * Required. Impression event details. The maximum number of impression reports that you can log at once is 50.
         */
        impressions?: Schema$GoogleMapsPlayablelocationsV3Impression[];
        /**
         * Required. A string that uniquely identifies the log impressions request. This allows you to detect duplicate requests. We recommend that you use UUIDs for this value. The value must not exceed 50 characters. You should reuse the `request_id` only when retrying a request in case of failure. In this case, the request must be identical to the one that failed.
         */
        requestId?: string | null;
    }
    /**
     * A response for the LogImpressions method. This method returns no data upon success.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse {
    }
    /**
     * A request for logging your player's bad location reports.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsRequest {
        /**
         * Required. Information about the client device (for example, device model and operating system).
         */
        clientInfo?: Schema$GoogleMapsUnityClientInfo;
        /**
         * Required. Player reports. The maximum number of player reports that you can log at once is 50.
         */
        playerReports?: Schema$GoogleMapsPlayablelocationsV3PlayerReport[];
        /**
         * Required. A string that uniquely identifies the log player reports request. This allows you to detect duplicate requests. We recommend that you use UUIDs for this value. The value must not exceed 50 characters. You should reuse the `request_id` only when retrying a request in the case of a failure. In that case, the request must be identical to the one that failed.
         */
        requestId?: string | null;
    }
    /**
     * A response for the LogPlayerReports method. This method returns no data upon success.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse {
    }
    /**
     * A report submitted by a player about a playable location that is considered inappropriate for use in the game.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3PlayerReport {
        /**
         * Language code (in BCP-47 format) indicating the language of the freeform description provided in `reason_details`. Examples are "en", "en-US" or "ja-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Required. The name of the playable location.
         */
        locationName?: string | null;
        /**
         * Required. A free-form description detailing why the playable location is considered bad.
         */
        reasonDetails?: string | null;
        /**
         * Required. One or more reasons why this playable location is considered bad.
         */
        reasons?: string[] | null;
    }
    /**
     * Specifies the area to search for playable locations.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SampleAreaFilter {
        /**
         * Required. The S2 cell ID of the area you want. This must be between cell level 11 and 14 (inclusive). S2 cells are 64-bit integers that identify areas on the Earth. They are hierarchical, and can therefore be used for spatial indexing. The S2 geometry library is available in a number of languages: * [C++](https://github.com/google/s2geometry) * [Java](https://github.com/google/s2-geometry-library-java) * [Go](https://github.com/golang/geo) * [Python](https://github.com/google/s2geometry/tree/master/src/python)
         */
        s2CellId?: string | null;
    }
    /**
     * Encapsulates a filter criterion for searching for a set of playable locations.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SampleCriterion {
        /**
         * Specifies which `PlayableLocation` fields are returned. `name` (which is used for logging impressions), `center_point` and `place_id` (or `plus_code`) are always returned. The following fields are omitted unless you specify them here: * snapped_point * types Note: The more fields you include, the more expensive in terms of data and associated latency your query will be.
         */
        fieldsToReturn?: string | null;
        /**
         * Specifies filtering options, and specifies what will be included in the result set.
         */
        filter?: Schema$GoogleMapsPlayablelocationsV3SampleFilter;
        /**
         * Required. An arbitrary, developer-defined identifier of the type of game object that the playable location is used for. This field allows you to specify criteria per game object type when searching for playable locations. You should assign a unique `game_object_type` ID across all `request_criteria` to represent a distinct type of game object. For example, 1=monster location, 2=powerup location. The response contains a map.
         */
        gameObjectType?: number | null;
    }
    /**
     * Specifies the filters to use when searching for playable locations.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SampleFilter {
        /**
         * Restricts the set of playable locations to just the [types](/maps/documentation/gaming/tt/types) that you want.
         */
        includedTypes?: string[] | null;
        /**
         * Specifies the maximum number of playable locations to return. This value must not be greater than 1000. The default value is 100. Only the top-ranking playable locations are returned.
         */
        maxLocationCount?: number | null;
        /**
         * A set of options that control the spacing between playable locations. By default the minimum distance between locations is 200m.
         */
        spacing?: Schema$GoogleMapsPlayablelocationsV3SampleSpacingOptions;
    }
    /**
     * A geographical point suitable for placing game objects in location-based games.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocation {
        /**
         * Required. The latitude and longitude associated with the center of the playable location. By default, the set of playable locations returned from SamplePlayableLocations use center-point coordinates.
         */
        centerPoint?: Schema$GoogleTypeLatLng;
        /**
         * Required. The name of this playable location.
         */
        name?: string | null;
        /**
         * A [place ID] (https://developers.google.com/places/place-id)
         */
        placeId?: string | null;
        /**
         * A [plus code] (http://openlocationcode.com)
         */
        plusCode?: string | null;
        /**
         * The playable location's coordinates, snapped to the sidewalk of the nearest road, if a nearby road exists.
         */
        snappedPoint?: Schema$GoogleTypeLatLng;
        /**
         * A collection of [Playable Location Types](/maps/documentation/gaming/tt/types) for this playable location. The first type in the collection is the primary type. Type information might not be available for all playable locations.
         */
        types?: string[] | null;
    }
    /**
     * A list of PlayableLocation objects that satisfies a single Criterion.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationList {
        /**
         * A list of playable locations for this game object type.
         */
        locations?: Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocation[];
    }
    /**
     *  Life of a query: - When a game starts in a new location, your game server issues a SamplePlayableLocations request. The request specifies the S2 cell, and contains one or more "criteria" for filtering: - Criterion 0: i locations for long-lived bases, or level 0 monsters, or... - Criterion 1: j locations for short-lived bases, or level 1 monsters, ... - Criterion 2: k locations for random objects. - etc (up to 5 criterion may be specified). `PlayableLocationList` will then contain mutually exclusive lists of `PlayableLocation` objects that satisfy each of the criteria. Think of it as a collection of real-world locations that you can then associate with your game state. Note: These points are impermanent in nature. E.g, parks can close, and places can be removed. The response specifies how long you can expect the playable locations to last. Once they expire, you should query the `samplePlayableLocations` API again to get a fresh view of the real world.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsRequest {
        /**
         * Required. Specifies the area to search within for playable locations.
         */
        areaFilter?: Schema$GoogleMapsPlayablelocationsV3SampleAreaFilter;
        /**
         * Required. Specifies one or more (up to 5) criteria for filtering the returned playable locations.
         */
        criteria?: Schema$GoogleMapsPlayablelocationsV3SampleCriterion[];
    }
    /**
     *  Response for the SamplePlayableLocations method.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse {
        /**
         * Each PlayableLocation object corresponds to a game_object_type specified in the request.
         */
        locationsPerGameObjectType?: {
            [key: string]: Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationList;
        } | null;
        /**
         * Required. Specifies the "time-to-live" for the set of playable locations. You can use this value to determine how long to cache the set of playable locations. After this length of time, your back-end game server should issue a new SamplePlayableLocations request to get a fresh set of playable locations (because for example, they might have been removed, a park might have closed for the day, a business might have closed permanently).
         */
        ttl?: string | null;
    }
    /**
     * A set of options that specifies the separation between playable locations.
     */
    export interface Schema$GoogleMapsPlayablelocationsV3SampleSpacingOptions {
        /**
         * Required. The minimum spacing between any two playable locations, measured in meters. The minimum value is 30. The maximum value is 1000. Inputs will be rounded up to the next 10 meter interval. The default value is 200m. Set this field to remove tight clusters of playable locations. Note: The spacing is a greedy algorithm. It optimizes for selecting the highest ranking locations first, not to maximize the number of locations selected. Consider the following scenario: * Rank: A: 2, B: 1, C: 3. * Distance: A--200m--B--200m--C If spacing=250, it will pick the highest ranked location [B], not [A, C]. Note: Spacing works within the game object type itself, as well as the previous ones. Suppose three game object types, each with the following spacing: * X: 400m, Y: undefined, Z: 200m. 1. Add locations for X, within 400m of each other. 2. Add locations for Y, without any spacing. 3. Finally, add locations for Z within 200m of each other as well X and Y. The distance diagram between those locations end up as: * From-\>To. * X-\>X: 400m * Y-\>X, Y-\>Y: unspecified. * Z-\>X, Z-\>Y, Z-\>Z: 200m.
         */
        minSpacingMeters?: number | null;
        /**
         * Specifies whether the minimum spacing constraint applies to the center-point or to the snapped point of playable locations. The default value is `CENTER_POINT`. If a snapped point is not available for a playable location, its center-point is used instead. Set this to the point type used in your game.
         */
        pointType?: string | null;
    }
    /**
     * Client information.
     */
    export interface Schema$GoogleMapsUnityClientInfo {
        /**
         * API client name and version. For example, the SDK calling the API. The exact format is up to the client.
         */
        apiClient?: string | null;
        /**
         * Application ID, such as the package name on Android and the bundle identifier on iOS platforms.
         */
        applicationId?: string | null;
        /**
         * Application version number, such as "1.2.3". The exact format is application-dependent.
         */
        applicationVersion?: string | null;
        /**
         * Device model as reported by the device. The exact format is platform-dependent.
         */
        deviceModel?: string | null;
        /**
         * Language code (in BCP-47 format) indicating the UI language of the client. Examples are "en", "en-US" or "ja-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Operating system name and version as reported by the OS. For example, "Mac OS X 10.10.4". The exact format is platform-dependent.
         */
        operatingSystem?: string | null;
        /**
         * Build number/version of the operating system. e.g., the contents of android.os.Build.ID in Android, or the contents of sysctl "kern.osversion" in iOS.
         */
        operatingSystemBuild?: string | null;
        /**
         * Platform where the application is running.
         */
        platform?: string | null;
    }
    /**
     * An object that represents a latitude/longitude pair. This is expressed as a pair of doubles to represent degrees latitude and degrees longitude. Unless specified otherwise, this object must conform to the WGS84 standard. Values must be within normalized ranges.
     */
    export interface Schema$GoogleTypeLatLng {
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        latitude?: number | null;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        longitude?: number | null;
    }
    export class Resource$V3 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Logs new events when playable locations are displayed, and when they are interacted with. Impressions are not partially saved; either all impressions are saved and this request succeeds, or no impressions are saved, and this request fails.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/playablelocations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const playablelocations = google.playablelocations('v3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await playablelocations.logImpressions({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "clientInfo": {},
         *       //   "impressions": [],
         *       //   "requestId": "my_requestId"
         *       // }
         *     },
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
        logImpressions(params: Params$Resource$V3$Logimpressions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        logImpressions(params?: Params$Resource$V3$Logimpressions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse>>;
        logImpressions(params: Params$Resource$V3$Logimpressions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        logImpressions(params: Params$Resource$V3$Logimpressions, options: MethodOptions | BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse>, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse>): void;
        logImpressions(params: Params$Resource$V3$Logimpressions, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse>): void;
        logImpressions(callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogImpressionsResponse>): void;
        /**
         * Logs bad playable location reports submitted by players. Reports are not partially saved; either all reports are saved and this request succeeds, or no reports are saved, and this request fails.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/playablelocations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const playablelocations = google.playablelocations('v3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await playablelocations.logPlayerReports({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "clientInfo": {},
         *       //   "playerReports": [],
         *       //   "requestId": "my_requestId"
         *       // }
         *     },
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
        logPlayerReports(params: Params$Resource$V3$Logplayerreports, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        logPlayerReports(params?: Params$Resource$V3$Logplayerreports, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse>>;
        logPlayerReports(params: Params$Resource$V3$Logplayerreports, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        logPlayerReports(params: Params$Resource$V3$Logplayerreports, options: MethodOptions | BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse>, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse>): void;
        logPlayerReports(params: Params$Resource$V3$Logplayerreports, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse>): void;
        logPlayerReports(callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsResponse>): void;
        /**
         * Returns a set of playable locations that lie within a specified area, that satisfy optional filter criteria. Note: Identical `SamplePlayableLocations` requests can return different results as the state of the world changes over time.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/playablelocations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const playablelocations = google.playablelocations('v3');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await playablelocations.samplePlayableLocations({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "areaFilter": {},
         *       //   "criteria": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "locationsPerGameObjectType": {},
         *   //   "ttl": "my_ttl"
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
        samplePlayableLocations(params: Params$Resource$V3$Sampleplayablelocations, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        samplePlayableLocations(params?: Params$Resource$V3$Sampleplayablelocations, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse>>;
        samplePlayableLocations(params: Params$Resource$V3$Sampleplayablelocations, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        samplePlayableLocations(params: Params$Resource$V3$Sampleplayablelocations, options: MethodOptions | BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse>, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse>): void;
        samplePlayableLocations(params: Params$Resource$V3$Sampleplayablelocations, callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse>): void;
        samplePlayableLocations(callback: BodyResponseCallback<Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsResponse>): void;
    }
    export interface Params$Resource$V3$Logimpressions extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleMapsPlayablelocationsV3LogImpressionsRequest;
    }
    export interface Params$Resource$V3$Logplayerreports extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleMapsPlayablelocationsV3LogPlayerReportsRequest;
    }
    export interface Params$Resource$V3$Sampleplayablelocations extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleMapsPlayablelocationsV3SamplePlayableLocationsRequest;
    }
    export {};
}
