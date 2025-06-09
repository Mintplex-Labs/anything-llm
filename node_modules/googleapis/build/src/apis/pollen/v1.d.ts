import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace pollen_v1 {
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
     * Pollen API
     *
     * The Pollen API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const pollen = google.pollen('v1');
     * ```
     */
    export class Pollen {
        context: APIRequestContext;
        forecast: Resource$Forecast;
        mapTypes: Resource$Maptypes;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents a color in the RGBA color space. This representation is designed for simplicity of conversion to and from color representations in various languages over compactness. For example, the fields of this representation can be trivially provided to the constructor of `java.awt.Color` in Java; it can also be trivially provided to UIColor's `+colorWithRed:green:blue:alpha` method in iOS; and, with just a little work, it can be easily formatted into a CSS `rgba()` string in JavaScript. This reference page doesn't have information about the absolute color space that should be used to interpret the RGB value—for example, sRGB, Adobe RGB, DCI-P3, and BT.2020. By default, applications should assume the sRGB color space. When color equality needs to be decided, implementations, unless documented otherwise, treat two colors as equal if all their red, green, blue, and alpha values each differ by at most `1e-5`. Example (Java): import com.google.type.Color; // ... public static java.awt.Color fromProto(Color protocolor) { float alpha = protocolor.hasAlpha() ? protocolor.getAlpha().getValue() : 1.0; return new java.awt.Color( protocolor.getRed(), protocolor.getGreen(), protocolor.getBlue(), alpha); \} public static Color toProto(java.awt.Color color) { float red = (float) color.getRed(); float green = (float) color.getGreen(); float blue = (float) color.getBlue(); float denominator = 255.0; Color.Builder resultBuilder = Color .newBuilder() .setRed(red / denominator) .setGreen(green / denominator) .setBlue(blue / denominator); int alpha = color.getAlpha(); if (alpha != 255) { result.setAlpha( FloatValue .newBuilder() .setValue(((float) alpha) / denominator) .build()); \} return resultBuilder.build(); \} // ... Example (iOS / Obj-C): // ... static UIColor* fromProto(Color* protocolor) { float red = [protocolor red]; float green = [protocolor green]; float blue = [protocolor blue]; FloatValue* alpha_wrapper = [protocolor alpha]; float alpha = 1.0; if (alpha_wrapper != nil) { alpha = [alpha_wrapper value]; \} return [UIColor colorWithRed:red green:green blue:blue alpha:alpha]; \} static Color* toProto(UIColor* color) { CGFloat red, green, blue, alpha; if (![color getRed:&red green:&green blue:&blue alpha:&alpha]) { return nil; \} Color* result = [[Color alloc] init]; [result setRed:red]; [result setGreen:green]; [result setBlue:blue]; if (alpha <= 0.9999) { [result setAlpha:floatWrapperWithValue(alpha)]; \} [result autorelease]; return result; \} // ... Example (JavaScript): // ... var protoToCssColor = function(rgb_color) { var redFrac = rgb_color.red || 0.0; var greenFrac = rgb_color.green || 0.0; var blueFrac = rgb_color.blue || 0.0; var red = Math.floor(redFrac * 255); var green = Math.floor(greenFrac * 255); var blue = Math.floor(blueFrac * 255); if (!('alpha' in rgb_color)) { return rgbToCssColor(red, green, blue); \} var alphaFrac = rgb_color.alpha.value || 0.0; var rgbParams = [red, green, blue].join(','); return ['rgba(', rgbParams, ',', alphaFrac, ')'].join(''); \}; var rgbToCssColor = function(red, green, blue) { var rgbNumber = new Number((red << 16) | (green << 8) | blue); var hexString = rgbNumber.toString(16); var missingZeros = 6 - hexString.length; var resultBuilder = ['#']; for (var i = 0; i < missingZeros; i++) { resultBuilder.push('0'); \} resultBuilder.push(hexString); return resultBuilder.join(''); \}; // ...
     */
    export interface Schema$Color {
        /**
         * The fraction of this color that should be applied to the pixel. That is, the final pixel color is defined by the equation: `pixel color = alpha * (this color) + (1.0 - alpha) * (background color)` This means that a value of 1.0 corresponds to a solid color, whereas a value of 0.0 corresponds to a completely transparent color. This uses a wrapper message rather than a simple float scalar so that it is possible to distinguish between a default value and the value being unset. If omitted, this color object is rendered as a solid color (as if the alpha value had been explicitly given a value of 1.0).
         */
        alpha?: number | null;
        /**
         * The amount of blue in the color as a value in the interval [0, 1].
         */
        blue?: number | null;
        /**
         * The amount of green in the color as a value in the interval [0, 1].
         */
        green?: number | null;
        /**
         * The amount of red in the color as a value in the interval [0, 1].
         */
        red?: number | null;
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
     * This object contains the daily forecast information for each day requested.
     */
    export interface Schema$DayInfo {
        /**
         * The date in UTC at which the pollen forecast data is represented.
         */
        date?: Schema$Date;
        /**
         * This list will include up to 15 pollen species affecting the location specified in the request.
         */
        plantInfo?: Schema$PlantInfo[];
        /**
         * This list will include up to three pollen types (GRASS, WEED, TREE) affecting the location specified in the request.
         */
        pollenTypeInfo?: Schema$PollenTypeInfo[];
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
     * This object contains data representing specific pollen index value, category and description.
     */
    export interface Schema$IndexInfo {
        /**
         * Text classification of index numerical score interpretation. The index consists of six categories: * 0: "None" * 1: "Very low" * 2: "Low" * 3: "Moderate" * 4: "High" * 5: "Very high
         */
        category?: string | null;
        /**
         * The index's code. This field represents the index for programming purposes by using snake cases instead of spaces. Example: "UPI".
         */
        code?: string | null;
        /**
         * The color used to represent the Pollen Index numeric score.
         */
        color?: Schema$Color;
        /**
         * A human readable representation of the index name. Example: "Universal Pollen Index".
         */
        displayName?: string | null;
        /**
         * Textual explanation of current index level.
         */
        indexDescription?: string | null;
        /**
         * The index's numeric score. Numeric range is between 0 and 5.
         */
        value?: number | null;
    }
    export interface Schema$LookupForecastResponse {
        /**
         * Required. This object contains the daily forecast information for each day requested.
         */
        dailyInfo?: Schema$DayInfo[];
        /**
         * Optional. The token to retrieve the next page.
         */
        nextPageToken?: string | null;
        /**
         * The ISO_3166-1 alpha-2 code of the country/region corresponding to the location provided in the request. This field might be omitted from the response if the location provided in the request resides in a disputed territory.
         */
        regionCode?: string | null;
    }
    /**
     * Contains general information about plants, including details on their seasonality, special shapes and colors, information about allergic cross-reactions, and plant photos.
     */
    export interface Schema$PlantDescription {
        /**
         * Textual description of pollen cross reaction plants. Example: Alder, Hazel, Hornbeam, Beech, Willow, and Oak pollen.
         */
        crossReaction?: string | null;
        /**
         * A human readable representation of the plant family name. Example: "Betulaceae (the Birch family)".
         */
        family?: string | null;
        /**
         * Link to the picture of the plant.
         */
        picture?: string | null;
        /**
         * Link to a closeup picture of the plant.
         */
        pictureCloseup?: string | null;
        /**
         * Textual list of explanations of seasons where the pollen is active. Example: "Late winter, spring".
         */
        season?: string | null;
        /**
         * Textual description of the plants' colors of leaves, bark, flowers or seeds that helps identify the plant.
         */
        specialColors?: string | null;
        /**
         * Textual description of the plants' shapes of leaves, bark, flowers or seeds that helps identify the plant.
         */
        specialShapes?: string | null;
        /**
         * The plant's pollen type. For example: "GRASS". A list of all available codes could be found here.
         */
        type?: string | null;
    }
    /**
     * This object contains the daily information on specific plant.
     */
    export interface Schema$PlantInfo {
        /**
         * The plant code name. For example: "COTTONWOOD". A list of all available codes could be found here.
         */
        code?: string | null;
        /**
         * A human readable representation of the plant name. Example: “Cottonwood".
         */
        displayName?: string | null;
        /**
         * This object contains data representing specific pollen index value, category and description.
         */
        indexInfo?: Schema$IndexInfo;
        /**
         * Indication of either the plant is in season or not.
         */
        inSeason?: boolean | null;
        /**
         * Contains general information about plants, including details on their seasonality, special shapes and colors, information about allergic cross-reactions, and plant photos.
         */
        plantDescription?: Schema$PlantDescription;
    }
    /**
     * This object contains the pollen type index and health recommendation information on specific pollen type.
     */
    export interface Schema$PollenTypeInfo {
        /**
         * The pollen type's code name. For example: "GRASS"
         */
        code?: string | null;
        /**
         * A human readable representation of the pollen type name. Example: "Grass"
         */
        displayName?: string | null;
        /**
         * Textual list of explanations, related to health insights based on the current pollen levels.
         */
        healthRecommendations?: string[] | null;
        /**
         * Contains the Universal Pollen Index (UPI) data for the pollen type.
         */
        indexInfo?: Schema$IndexInfo;
        /**
         * Indication whether the plant is in season or not.
         */
        inSeason?: boolean | null;
    }
    export class Resource$Forecast {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns up to 5 days of daily pollen information in more than 65 countries, up to 1km resolution.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Forecast$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Forecast$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LookupForecastResponse>>;
        lookup(params: Params$Resource$Forecast$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Forecast$Lookup, options: MethodOptions | BodyResponseCallback<Schema$LookupForecastResponse>, callback: BodyResponseCallback<Schema$LookupForecastResponse>): void;
        lookup(params: Params$Resource$Forecast$Lookup, callback: BodyResponseCallback<Schema$LookupForecastResponse>): void;
        lookup(callback: BodyResponseCallback<Schema$LookupForecastResponse>): void;
    }
    export interface Params$Resource$Forecast$Lookup extends StandardParameters {
        /**
         * Required. A number that indicates how many forecast days to request (minimum value 1, maximum value is 5).
         */
        days?: number;
        /**
         * Optional. Allows the client to choose the language for the response. If data cannot be provided for that language, the API uses the closest match. Allowed values rely on the IETF BCP-47 standard. The default value is "en".
         */
        languageCode?: string;
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        'location.latitude'?: number;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        'location.longitude'?: number;
        /**
         * Optional. The maximum number of daily info records to return per page. The default and max value is 5, indicating 5 days of data.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous daily call. It is used to retrieve the subsequent page. Note that when providing a value for the page token, all other request parameters provided must match the previous call that provided the page token.
         */
        pageToken?: string;
        /**
         * Optional. Contains general information about plants, including details on their seasonality, special shapes and colors, information about allergic cross-reactions, and plant photos. The default value is "true".
         */
        plantsDescription?: boolean;
    }
    export class Resource$Maptypes {
        context: APIRequestContext;
        heatmapTiles: Resource$Maptypes$Heatmaptiles;
        constructor(context: APIRequestContext);
    }
    export class Resource$Maptypes$Heatmaptiles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a byte array containing the data of the tile PNG image.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookupHeatmapTile(params: Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookupHeatmapTile(params?: Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HttpBody>>;
        lookupHeatmapTile(params: Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookupHeatmapTile(params: Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile, options: MethodOptions | BodyResponseCallback<Schema$HttpBody>, callback: BodyResponseCallback<Schema$HttpBody>): void;
        lookupHeatmapTile(params: Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile, callback: BodyResponseCallback<Schema$HttpBody>): void;
        lookupHeatmapTile(callback: BodyResponseCallback<Schema$HttpBody>): void;
    }
    export interface Params$Resource$Maptypes$Heatmaptiles$Lookupheatmaptile extends StandardParameters {
        /**
         * Required. The type of the pollen heatmap. Defines the combination of pollen type and index that the map will graphically represent.
         */
        mapType?: string;
        /**
         * Required. Defines the east-west point in the requested tile.
         */
        x?: number;
        /**
         * Required. Defines the north-south point in the requested tile.
         */
        y?: number;
        /**
         * Required. The map's zoom level. Defines how large or small the contents of a map appear in a map view. * Zoom level 0 is the entire world in a single tile. * Zoom level 1 is the entire world in 4 tiles. * Zoom level 2 is the entire world in 16 tiles. * Zoom level 16 is the entire world in 65,536 tiles. Allowed values: 0-16
         */
        zoom?: number;
    }
    export {};
}
