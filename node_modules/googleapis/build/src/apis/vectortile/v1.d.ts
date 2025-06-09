import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace vectortile_v1 {
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
     * Semantic Tile API
     *
     * Serves vector tiles containing geospatial data.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const vectortile = google.vectortile('v1');
     * ```
     */
    export class Vectortile {
        context: APIRequestContext;
        featuretiles: Resource$Featuretiles;
        terraintiles: Resource$Terraintiles;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents an area. Used to represent regions such as water, parks, etc. Next ID: 10
     */
    export interface Schema$Area {
        /**
         * The z-order of this geometry when rendered on a flat basemap. Geometry with a lower z-order should be rendered beneath geometry with a higher z-order. This z-ordering does not imply anything about the altitude of the area relative to the ground, but it can be used to prevent z-fighting. Unlike Area.z_order this can be used to compare with Line.basemap_z_order, and in fact may yield more accurate rendering (where a line may be rendered beneath an area).
         */
        basemapZOrder?: Schema$BasemapZOrder;
        /**
         * True if the polygon is not entirely internal to the feature that it belongs to: that is, some of the edges are bordering another feature.
         */
        hasExternalEdges?: boolean | null;
        /**
         * When has_external_edges is true, the polygon has some edges that border another feature. This field indicates the internal edges that do not border another feature. Each value is an index into the vertices array, and denotes the start vertex of the internal edge (the next vertex in the boundary loop is the end of the edge). If the selected vertex is the last vertex in the boundary loop, then the edge between that vertex and the starting vertex of the loop is internal. This field may be used for styling. For example, building parapets could be placed only on the external edges of a building polygon, or water could be lighter colored near the external edges of a body of water. If has_external_edges is false, all edges are internal and this field will be empty.
         */
        internalEdges?: number[] | null;
        /**
         * Identifies the boundary loops of the polygon. Only set for INDEXED_TRIANGLE polygons. Each value is an index into the vertices array indicating the beginning of a loop. For instance, values of [2, 5] would indicate loop_data contained 3 loops with indices 0-1, 2-4, and 5-end. This may be used in conjunction with the internal_edges field for styling polygon boundaries. Note that an edge may be on a polygon boundary but still internal to the feature. For example, a feature split across multiple tiles will have an internal polygon boundary edge along the edge of the tile.
         */
        loopBreaks?: number[] | null;
        /**
         * When the polygon encoding is of type INDEXED_TRIANGLES, this contains the indices of the triangle vertices in the vertex_offsets field. There are 3 vertex indices per triangle.
         */
        triangleIndices?: number[] | null;
        /**
         * The polygon encoding type used for this area.
         */
        type?: string | null;
        /**
         * The vertices present in the polygon defining the area.
         */
        vertexOffsets?: Schema$Vertex2DList;
        /**
         * The z-ordering of this area. Areas with a lower z-order should be rendered beneath areas with a higher z-order. This z-ordering does not imply anything about the altitude of the line relative to the ground, but it can be used to prevent z-fighting during rendering on the client. This z-ordering can only be used to compare areas, and cannot be compared with the z_order field in the Line message. The z-order may be negative or zero. Prefer Area.basemap_z_order.
         */
        zOrder?: number | null;
    }
    /**
     * Metadata necessary to determine the ordering of a particular basemap element relative to others. To render the basemap correctly, sort by z-plane, then z-grade, then z-within-grade.
     */
    export interface Schema$BasemapZOrder {
        /**
         * The second most significant component of the ordering of a component to be rendered onto the basemap.
         */
        zGrade?: number | null;
        /**
         * The most significant component of the ordering of a component to be rendered onto the basemap.
         */
        zPlane?: number | null;
        /**
         * The least significant component of the ordering of a component to be rendered onto the basemap.
         */
        zWithinGrade?: number | null;
    }
    /**
     * Represents a height-extruded area: a 3D prism with a constant X-Y plane cross section. Used to represent extruded buildings. A single building may consist of several extruded areas. The min_z and max_z fields are scaled to the size of the tile. An extruded area with a max_z value of 4096 has the same height as the width of the tile that it is on.
     */
    export interface Schema$ExtrudedArea {
        /**
         * The area representing the footprint of the extruded area.
         */
        area?: Schema$Area;
        /**
         * The z-value in local tile coordinates where the extruded area ends.
         */
        maxZ?: number | null;
        /**
         * The z-value in local tile coordinates where the extruded area begins. This is non-zero for extruded areas that begin off the ground. For example, a building with a skybridge may have an extruded area component with a non-zero min_z.
         */
        minZ?: number | null;
    }
    /**
     * A feature representing a single geographic entity.
     */
    export interface Schema$Feature {
        /**
         * The localized name of this feature. Currently only returned for roads.
         */
        displayName?: string | null;
        /**
         * The geometry of this feature, representing the space that it occupies in the world.
         */
        geometry?: Schema$Geometry;
        /**
         * Place ID of this feature, suitable for use in Places API details requests.
         */
        placeId?: string | null;
        /**
         * Relations to other features.
         */
        relations?: Schema$Relation[];
        /**
         * Metadata for features with the SEGMENT FeatureType.
         */
        segmentInfo?: Schema$SegmentInfo;
        /**
         * The type of this feature.
         */
        type?: string | null;
    }
    /**
     * A tile containing information about the map features located in the region it covers.
     */
    export interface Schema$FeatureTile {
        /**
         * The global tile coordinates that uniquely identify this tile.
         */
        coordinates?: Schema$TileCoordinates;
        /**
         * Features present on this map tile.
         */
        features?: Schema$Feature[];
        /**
         * Resource name of the tile. The tile resource name is prefixed by its collection ID `tiles/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `tiles/@1,2,3z`.
         */
        name?: string | null;
        /**
         * Data providers for the data contained in this tile.
         */
        providers?: Schema$ProviderInfo[];
        /**
         * Tile response status code to support tile caching.
         */
        status?: string | null;
        /**
         * An opaque value, usually less than 30 characters, that contains version info about this tile and the data that was used to generate it. The client should store this value in its tile cache and pass it back to the API in the client_tile_version_id field of subsequent tile requests in order to enable the API to detect when the new tile would be the same as the one the client already has in its cache. Also see STATUS_OK_DATA_UNCHANGED.
         */
        versionId?: string | null;
    }
    /**
     * A packed representation of a 2D grid of uniformly spaced points containing elevation data. Each point within the grid represents the altitude in meters above average sea level at that location within the tile. Elevations provided are (generally) relative to the EGM96 geoid, however some areas will be relative to NAVD88. EGM96 and NAVD88 are off by no more than 2 meters. The grid is oriented north-west to south-east, as illustrated: rows[0].a[0] rows[0].a[m] +-----------------+ | | | N | | ^ | | | | | W <-----\> E | | | | | v | | S | | | +-----------------+ rows[n].a[0] rows[n].a[m] Rather than storing the altitudes directly, we store the diffs between them as integers at some requested level of precision to take advantage of integer packing. The actual altitude values a[] can be reconstructed using the scale and each row's first_altitude and altitude_diff fields. More details in go/elevation-encoding-options-for-enduro under "Recommended implementation".
     */
    export interface Schema$FirstDerivativeElevationGrid {
        /**
         * A multiplier applied to the altitude fields below to extract the actual altitudes in meters from the elevation grid.
         */
        altitudeMultiplier?: number | null;
        /**
         * Rows of points containing altitude data making up the elevation grid. Each row is the same length. Rows are ordered from north to south. E.g: rows[0] is the north-most row, and rows[n] is the south-most row.
         */
        rows?: Schema$Row[];
    }
    /**
     * Represents the geometry of a feature, that is, the shape that it has on the map. The local tile coordinate system has the origin at the north-west (upper-left) corner of the tile, and is scaled to 4096 units across each edge. The height (Z) axis has the same scale factor: an extruded area with a max_z value of 4096 has the same height as the width of the tile that it is on. There is no clipping boundary, so it is possible that some coordinates will lie outside the tile boundaries.
     */
    export interface Schema$Geometry {
        /**
         * The areas present in this geometry.
         */
        areas?: Schema$Area[];
        /**
         * The extruded areas present in this geometry. Not populated if modeled_volumes are included in this geometry unless always_include_building_footprints is set in GetFeatureTileRequest, in which case the client should decide which (extruded areas or modeled volumes) should be used (they should not be rendered together).
         */
        extrudedAreas?: Schema$ExtrudedArea[];
        /**
         * The lines present in this geometry.
         */
        lines?: Schema$Line[];
        /**
         * The modeled volumes present in this geometry. Not populated unless enable_modeled_volumes has been set in GetFeatureTileRequest.
         */
        modeledVolumes?: Schema$ModeledVolume[];
    }
    /**
     * Represents a 2D polyline. Used to represent segments such as roads, train tracks, etc.
     */
    export interface Schema$Line {
        /**
         * The z-order of this geometry when rendered on a flat basemap. Geometry with a lower z-order should be rendered beneath geometry with a higher z-order. This z-ordering does not imply anything about the altitude of the area relative to the ground, but it can be used to prevent z-fighting. Unlike Line.z_order this can be used to compare with Area.basemap_z_order, and in fact may yield more accurate rendering (where a line may be rendered beneath an area).
         */
        basemapZOrder?: Schema$BasemapZOrder;
        /**
         * The vertices present in the polyline.
         */
        vertexOffsets?: Schema$Vertex2DList;
        /**
         * The z-order of the line. Lines with a lower z-order should be rendered beneath lines with a higher z-order. This z-ordering does not imply anything about the altitude of the area relative to the ground, but it can be used to prevent z-fighting during rendering on the client. In general, larger and more important road features will have a higher z-order line associated with them. This z-ordering can only be used to compare lines, and cannot be compared with the z_order field in the Area message. The z-order may be negative or zero. Prefer Line.basemap_z_order.
         */
        zOrder?: number | null;
    }
    /**
     * Represents a modeled volume in 3D space. Used to represent 3D buildings.
     */
    export interface Schema$ModeledVolume {
        /**
         * The triangle strips present in this mesh.
         */
        strips?: Schema$TriangleStrip[];
        /**
         * The vertices present in the mesh defining the modeled volume.
         */
        vertexOffsets?: Schema$Vertex3DList;
    }
    /**
     * Information about the data providers that should be included in the attribution string shown by the client.
     */
    export interface Schema$ProviderInfo {
        /**
         * Attribution string for this provider. This string is not localized.
         */
        description?: string | null;
    }
    /**
     * Represents a relation to another feature in the tile. For example, a building might be occupied by a given POI. The related feature can be retrieved using the related feature index.
     */
    export interface Schema$Relation {
        /**
         * Zero-based index to look up the related feature from the list of features in the tile.
         */
        relatedFeatureIndex?: number | null;
        /**
         * Relation type between the origin feature to the related feature.
         */
        relationType?: string | null;
    }
    /**
     * Extra metadata relating to roads.
     */
    export interface Schema$RoadInfo {
        /**
         * Road has signage discouraging or prohibiting use by the general public. E.g., roads with signs that say "Private", or "No trespassing."
         */
        isPrivate?: boolean | null;
    }
    /**
     * A row of altitude points in the elevation grid, ordered from west to east.
     */
    export interface Schema$Row {
        /**
         * The difference between each successive pair of altitudes, from west to east. The first, westmost point, is just the altitude rather than a diff. The units are specified by the altitude_multiplier parameter above; the value in meters is given by altitude_multiplier * altitude_diffs[n]. The altitude row (in metres above sea level) can be reconstructed with: a[0] = altitude_diffs[0] * altitude_multiplier when n \> 0, a[n] = a[n-1] + altitude_diffs[n-1] * altitude_multiplier.
         */
        altitudeDiffs?: number[] | null;
    }
    /**
     * A packed representation of a 2D grid of uniformly spaced points containing elevation data. Each point within the grid represents the altitude in meters above average sea level at that location within the tile. Elevations provided are (generally) relative to the EGM96 geoid, however some areas will be relative to NAVD88. EGM96 and NAVD88 are off by no more than 2 meters. The grid is oriented north-west to south-east, as illustrated: rows[0].a[0] rows[0].a[m] +-----------------+ | | | N | | ^ | | | | | W <-----\> E | | | | | v | | S | | | +-----------------+ rows[n].a[0] rows[n].a[m] Rather than storing the altitudes directly, we store the diffs of the diffs between them as integers at some requested level of precision to take advantage of integer packing. Note that the data is packed in such a way that is fast to decode in Unity and that further optimizes wire size.
     */
    export interface Schema$SecondDerivativeElevationGrid {
        /**
         * A multiplier applied to the elements in the encoded data to extract the actual altitudes in meters.
         */
        altitudeMultiplier?: number | null;
        /**
         * The number of columns included in the encoded elevation data (i.e. the horizontal resolution of the grid).
         */
        columnCount?: number | null;
        /**
         * A stream of elements each representing a point on the tile running across each row from left to right, top to bottom. There will be precisely horizontal_resolution * vertical_resolution elements in the stream. The elements are not the heights, rather the second order derivative of the values one would expect in a stream of height data. Each element is a varint with the following encoding: ------------------------------------------------------------------------| | Head Nibble | ------------------------------------------------------------------------| | Bit 0 | Bit 1 | Bits 2-3 | | Terminator| Sign (1=neg) | Least significant 2 bits of absolute error | ------------------------------------------------------------------------| | Tail Nibble #1 | ------------------------------------------------------------------------| | Bit 0 | Bit 1-3 | | Terminator| Least significant 3 bits of absolute error | ------------------------------------------------------------------------| | ... | Tail Nibble #n | ------------------------------------------------------------------------| | Bit 0 | Bit 1-3 | | Terminator| Least significant 3 bits of absolute error | ------------------------------------------------------------------------|
         */
        encodedData?: string | null;
        /**
         * The number of rows included in the encoded elevation data (i.e. the vertical resolution of the grid).
         */
        rowCount?: number | null;
    }
    /**
     * Extra metadata relating to segments.
     */
    export interface Schema$SegmentInfo {
        /**
         * Metadata for features with the ROAD FeatureType.
         */
        roadInfo?: Schema$RoadInfo;
    }
    /**
     * A tile containing information about the terrain located in the region it covers.
     */
    export interface Schema$TerrainTile {
        /**
         * The global tile coordinates that uniquely identify this tile.
         */
        coordinates?: Schema$TileCoordinates;
        /**
         * Terrain elevation data encoded as a FirstDerivativeElevationGrid. cs/symbol:FirstDerivativeElevationGrid.
         */
        firstDerivative?: Schema$FirstDerivativeElevationGrid;
        /**
         * Resource name of the tile. The tile resource name is prefixed by its collection ID `terrain/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `terrain/@1,2,3z`.
         */
        name?: string | null;
        /**
         * Terrain elevation data encoded as a SecondDerivativeElevationGrid. cs/symbol:SecondDerivativeElevationGrid. See go/byte-encoded-terrain for more details.
         */
        secondDerivative?: Schema$SecondDerivativeElevationGrid;
    }
    /**
     * Global tile coordinates. Global tile coordinates reference a specific tile on the map at a specific zoom level. The origin of this coordinate system is always at the northwest corner of the map, with x values increasing from west to east and y values increasing from north to south. Tiles are indexed using x, y coordinates from that origin. The zoom level containing the entire world in a tile is 0, and it increases as you zoom in. Zoom level n + 1 will contain 4 times as many tiles as zoom level n. The zoom level controls the level of detail of the data that is returned. In particular, this affects the set of feature types returned, their density, and geometry simplification. The exact tile contents may change over time, but care will be taken to keep supporting the most important use cases. For example, zoom level 15 shows roads for orientation and planning in the local neighborhood and zoom level 17 shows buildings to give users on foot a sense of situational awareness.
     */
    export interface Schema$TileCoordinates {
        /**
         * Required. The x coordinate.
         */
        x?: number | null;
        /**
         * Required. The y coordinate.
         */
        y?: number | null;
        /**
         * Required. The Google Maps API zoom level.
         */
        zoom?: number | null;
    }
    /**
     * Represents a strip of triangles. Each triangle uses the last edge of the previous one. The following diagram shows an example of a triangle strip, with each vertex labeled with its index in the vertex_index array. (1)-----(3) / \ / \ / \ / \ / \ / \ (0)-----(2)-----(4) Vertices may be in either clockwise or counter-clockwise order.
     */
    export interface Schema$TriangleStrip {
        /**
         * Index into the vertex_offset array representing the next vertex in the triangle strip.
         */
        vertexIndices?: number[] | null;
    }
    /**
     * 2D vertex list used for lines and areas. Each entry represents an offset from the previous one in local tile coordinates. The first entry is offset from (0, 0). For example, the list of vertices [(1,1), (2, 2), (1, 2)] would be encoded in vertex offsets as [(1, 1), (1, 1), (-1, 0)].
     */
    export interface Schema$Vertex2DList {
        /**
         * List of x-offsets in local tile coordinates.
         */
        xOffsets?: number[] | null;
        /**
         * List of y-offsets in local tile coordinates.
         */
        yOffsets?: number[] | null;
    }
    /**
     * 3D vertex list used for modeled volumes. Each entry represents an offset from the previous one in local tile coordinates. The first coordinate is offset from (0, 0, 0).
     */
    export interface Schema$Vertex3DList {
        /**
         * List of x-offsets in local tile coordinates.
         */
        xOffsets?: number[] | null;
        /**
         * List of y-offsets in local tile coordinates.
         */
        yOffsets?: number[] | null;
        /**
         * List of z-offsets in local tile coordinates.
         */
        zOffsets?: number[] | null;
    }
    export class Resource$Featuretiles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a feature tile by its tile resource name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/vectortile.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const vectortile = google.vectortile('v1');
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
         *   const res = await vectortile.featuretiles.get({
         *     // Flag indicating whether the returned tile will always contain 2.5D footprints for structures. If enabled_modeled_volumes is set, this will mean that structures will have both their 3D models and 2.5D footprints returned.
         *     alwaysIncludeBuildingFootprints: 'placeholder-value',
         *     // API client name and version. For example, the SDK calling the API. The exact format is up to the client.
         *     'clientInfo.apiClient': 'placeholder-value',
         *     // Application ID, such as the package name on Android and the bundle identifier on iOS platforms.
         *     'clientInfo.applicationId': 'placeholder-value',
         *     // Application version number, such as "1.2.3". The exact format is application-dependent.
         *     'clientInfo.applicationVersion': 'placeholder-value',
         *     // Device model as reported by the device. The exact format is platform-dependent.
         *     'clientInfo.deviceModel': 'placeholder-value',
         *     // Operating system name and version as reported by the OS. For example, "Mac OS X 10.10.4". The exact format is platform-dependent.
         *     'clientInfo.operatingSystem': 'placeholder-value',
         *     // Platform where the application is running.
         *     'clientInfo.platform': 'placeholder-value',
         *     // Required. A client-generated user ID. The ID should be generated and persisted during the first user session or whenever a pre-existing ID is not found. The exact format is up to the client. This must be non-empty in a GetFeatureTileRequest (whether via the header or GetFeatureTileRequest.client_info).
         *     'clientInfo.userId': 'placeholder-value',
         *     // Optional version id identifying the tile that is already in the client's cache. This field should be populated with the most recent version_id value returned by the API for the requested tile. If the version id is empty the server always returns a newly rendered tile. If it is provided the server checks if the tile contents would be identical to one that's already on the client, and if so, returns a stripped-down response tile with STATUS_OK_DATA_UNCHANGED instead.
         *     clientTileVersionId: 'placeholder-value',
         *     // Flag indicating whether detailed highway types should be returned. If this is set, the CONTROLLED_ACCESS_HIGHWAY type may be returned. If not, then these highways will have the generic HIGHWAY type. This exists for backwards compatibility reasons.
         *     enableDetailedHighwayTypes: 'placeholder-value',
         *     // Flag indicating whether human-readable names should be returned for features. If this is set, the display_name field on the feature will be filled out.
         *     enableFeatureNames: 'placeholder-value',
         *     // Flag indicating whether 3D building models should be enabled. If this is set structures will be returned as 3D modeled volumes rather than 2.5D extruded areas where possible.
         *     enableModeledVolumes: 'placeholder-value',
         *     // Flag indicating whether political features should be returned.
         *     enablePoliticalFeatures: 'placeholder-value',
         *     // Flag indicating whether the returned tile will contain road features that are marked private. Private roads are indicated by the Feature.segment_info.road_info.is_private field.
         *     enablePrivateRoads: 'placeholder-value',
         *     // Flag indicating whether unclipped buildings should be returned. If this is set, building render ops will extend beyond the tile boundary. Buildings will only be returned on the tile that contains their centroid.
         *     enableUnclippedBuildings: 'placeholder-value',
         *     // Required. The BCP-47 language code corresponding to the language in which the name was requested, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         *     languageCode: 'placeholder-value',
         *     // Required. Resource name of the tile. The tile resource name is prefixed by its collection ID `tiles/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `tiles/@1,2,3z`.
         *     name: 'featuretiles/my-featuretile',
         *     // Required. The Unicode country/region code (CLDR) of the location from which the request is coming from, such as "US" and "419". For more information, see http://www.unicode.org/reports/tr35/#unicode_region_subtag.
         *     regionCode: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "coordinates": {},
         *   //   "features": [],
         *   //   "name": "my_name",
         *   //   "providers": [],
         *   //   "status": "my_status",
         *   //   "versionId": "my_versionId"
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
        get(params: Params$Resource$Featuretiles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Featuretiles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FeatureTile>>;
        get(params: Params$Resource$Featuretiles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Featuretiles$Get, options: MethodOptions | BodyResponseCallback<Schema$FeatureTile>, callback: BodyResponseCallback<Schema$FeatureTile>): void;
        get(params: Params$Resource$Featuretiles$Get, callback: BodyResponseCallback<Schema$FeatureTile>): void;
        get(callback: BodyResponseCallback<Schema$FeatureTile>): void;
    }
    export interface Params$Resource$Featuretiles$Get extends StandardParameters {
        /**
         * Flag indicating whether the returned tile will always contain 2.5D footprints for structures. If enabled_modeled_volumes is set, this will mean that structures will have both their 3D models and 2.5D footprints returned.
         */
        alwaysIncludeBuildingFootprints?: boolean;
        /**
         * API client name and version. For example, the SDK calling the API. The exact format is up to the client.
         */
        'clientInfo.apiClient'?: string;
        /**
         * Application ID, such as the package name on Android and the bundle identifier on iOS platforms.
         */
        'clientInfo.applicationId'?: string;
        /**
         * Application version number, such as "1.2.3". The exact format is application-dependent.
         */
        'clientInfo.applicationVersion'?: string;
        /**
         * Device model as reported by the device. The exact format is platform-dependent.
         */
        'clientInfo.deviceModel'?: string;
        /**
         * Operating system name and version as reported by the OS. For example, "Mac OS X 10.10.4". The exact format is platform-dependent.
         */
        'clientInfo.operatingSystem'?: string;
        /**
         * Platform where the application is running.
         */
        'clientInfo.platform'?: string;
        /**
         * Required. A client-generated user ID. The ID should be generated and persisted during the first user session or whenever a pre-existing ID is not found. The exact format is up to the client. This must be non-empty in a GetFeatureTileRequest (whether via the header or GetFeatureTileRequest.client_info).
         */
        'clientInfo.userId'?: string;
        /**
         * Optional version id identifying the tile that is already in the client's cache. This field should be populated with the most recent version_id value returned by the API for the requested tile. If the version id is empty the server always returns a newly rendered tile. If it is provided the server checks if the tile contents would be identical to one that's already on the client, and if so, returns a stripped-down response tile with STATUS_OK_DATA_UNCHANGED instead.
         */
        clientTileVersionId?: string;
        /**
         * Flag indicating whether detailed highway types should be returned. If this is set, the CONTROLLED_ACCESS_HIGHWAY type may be returned. If not, then these highways will have the generic HIGHWAY type. This exists for backwards compatibility reasons.
         */
        enableDetailedHighwayTypes?: boolean;
        /**
         * Flag indicating whether human-readable names should be returned for features. If this is set, the display_name field on the feature will be filled out.
         */
        enableFeatureNames?: boolean;
        /**
         * Flag indicating whether 3D building models should be enabled. If this is set structures will be returned as 3D modeled volumes rather than 2.5D extruded areas where possible.
         */
        enableModeledVolumes?: boolean;
        /**
         * Flag indicating whether political features should be returned.
         */
        enablePoliticalFeatures?: boolean;
        /**
         * Flag indicating whether the returned tile will contain road features that are marked private. Private roads are indicated by the Feature.segment_info.road_info.is_private field.
         */
        enablePrivateRoads?: boolean;
        /**
         * Flag indicating whether unclipped buildings should be returned. If this is set, building render ops will extend beyond the tile boundary. Buildings will only be returned on the tile that contains their centroid.
         */
        enableUnclippedBuildings?: boolean;
        /**
         * Required. The BCP-47 language code corresponding to the language in which the name was requested, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string;
        /**
         * Required. Resource name of the tile. The tile resource name is prefixed by its collection ID `tiles/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `tiles/@1,2,3z`.
         */
        name?: string;
        /**
         * Required. The Unicode country/region code (CLDR) of the location from which the request is coming from, such as "US" and "419". For more information, see http://www.unicode.org/reports/tr35/#unicode_region_subtag.
         */
        regionCode?: string;
    }
    export class Resource$Terraintiles {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a terrain tile by its tile resource name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/vectortile.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const vectortile = google.vectortile('v1');
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
         *   const res = await vectortile.terraintiles.get({
         *     // The precision of terrain altitudes in centimeters. Possible values: between 1 (cm level precision) and 1,000,000 (10-kilometer level precision).
         *     altitudePrecisionCentimeters: 'placeholder-value',
         *     // API client name and version. For example, the SDK calling the API. The exact format is up to the client.
         *     'clientInfo.apiClient': 'placeholder-value',
         *     // Application ID, such as the package name on Android and the bundle identifier on iOS platforms.
         *     'clientInfo.applicationId': 'placeholder-value',
         *     // Application version number, such as "1.2.3". The exact format is application-dependent.
         *     'clientInfo.applicationVersion': 'placeholder-value',
         *     // Device model as reported by the device. The exact format is platform-dependent.
         *     'clientInfo.deviceModel': 'placeholder-value',
         *     // Operating system name and version as reported by the OS. For example, "Mac OS X 10.10.4". The exact format is platform-dependent.
         *     'clientInfo.operatingSystem': 'placeholder-value',
         *     // Platform where the application is running.
         *     'clientInfo.platform': 'placeholder-value',
         *     // Required. A client-generated user ID. The ID should be generated and persisted during the first user session or whenever a pre-existing ID is not found. The exact format is up to the client. This must be non-empty in a GetFeatureTileRequest (whether via the header or GetFeatureTileRequest.client_info).
         *     'clientInfo.userId': 'placeholder-value',
         *     // The maximum allowed resolution for the returned elevation heightmap. Possible values: between 1 and 1024 (and not less than min_elevation_resolution_cells). Over-sized heightmaps will be non-uniformly down-sampled such that each edge is no longer than this value. Non-uniformity is chosen to maximise the amount of preserved data. For example: Original resolution: 100px (width) * 30px (height) max_elevation_resolution: 30 New resolution: 30px (width) * 30px (height)
         *     maxElevationResolutionCells: 'placeholder-value',
         *     //  api-linter: core::0131::request-unknown-fields=disabled aip.dev/not-precedent: Maintaining existing request parameter pattern. The minimum allowed resolution for the returned elevation heightmap. Possible values: between 0 and 1024 (and not more than max_elevation_resolution_cells). Zero is supported for backward compatibility. Under-sized heightmaps will be non-uniformly up-sampled such that each edge is no shorter than this value. Non-uniformity is chosen to maximise the amount of preserved data. For example: Original resolution: 30px (width) * 10px (height) min_elevation_resolution: 30 New resolution: 30px (width) * 30px (height)
         *     minElevationResolutionCells: 'placeholder-value',
         *     // Required. Resource name of the tile. The tile resource name is prefixed by its collection ID `terraintiles/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `terraintiles/@1,2,3z`.
         *     name: 'terraintiles/my-terraintile',
         *     // Terrain formats that the client understands.
         *     terrainFormats: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "coordinates": {},
         *   //   "firstDerivative": {},
         *   //   "name": "my_name",
         *   //   "secondDerivative": {}
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
        get(params: Params$Resource$Terraintiles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Terraintiles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TerrainTile>>;
        get(params: Params$Resource$Terraintiles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Terraintiles$Get, options: MethodOptions | BodyResponseCallback<Schema$TerrainTile>, callback: BodyResponseCallback<Schema$TerrainTile>): void;
        get(params: Params$Resource$Terraintiles$Get, callback: BodyResponseCallback<Schema$TerrainTile>): void;
        get(callback: BodyResponseCallback<Schema$TerrainTile>): void;
    }
    export interface Params$Resource$Terraintiles$Get extends StandardParameters {
        /**
         * The precision of terrain altitudes in centimeters. Possible values: between 1 (cm level precision) and 1,000,000 (10-kilometer level precision).
         */
        altitudePrecisionCentimeters?: number;
        /**
         * API client name and version. For example, the SDK calling the API. The exact format is up to the client.
         */
        'clientInfo.apiClient'?: string;
        /**
         * Application ID, such as the package name on Android and the bundle identifier on iOS platforms.
         */
        'clientInfo.applicationId'?: string;
        /**
         * Application version number, such as "1.2.3". The exact format is application-dependent.
         */
        'clientInfo.applicationVersion'?: string;
        /**
         * Device model as reported by the device. The exact format is platform-dependent.
         */
        'clientInfo.deviceModel'?: string;
        /**
         * Operating system name and version as reported by the OS. For example, "Mac OS X 10.10.4". The exact format is platform-dependent.
         */
        'clientInfo.operatingSystem'?: string;
        /**
         * Platform where the application is running.
         */
        'clientInfo.platform'?: string;
        /**
         * Required. A client-generated user ID. The ID should be generated and persisted during the first user session or whenever a pre-existing ID is not found. The exact format is up to the client. This must be non-empty in a GetFeatureTileRequest (whether via the header or GetFeatureTileRequest.client_info).
         */
        'clientInfo.userId'?: string;
        /**
         * The maximum allowed resolution for the returned elevation heightmap. Possible values: between 1 and 1024 (and not less than min_elevation_resolution_cells). Over-sized heightmaps will be non-uniformly down-sampled such that each edge is no longer than this value. Non-uniformity is chosen to maximise the amount of preserved data. For example: Original resolution: 100px (width) * 30px (height) max_elevation_resolution: 30 New resolution: 30px (width) * 30px (height)
         */
        maxElevationResolutionCells?: number;
        /**
         *  api-linter: core::0131::request-unknown-fields=disabled aip.dev/not-precedent: Maintaining existing request parameter pattern. The minimum allowed resolution for the returned elevation heightmap. Possible values: between 0 and 1024 (and not more than max_elevation_resolution_cells). Zero is supported for backward compatibility. Under-sized heightmaps will be non-uniformly up-sampled such that each edge is no shorter than this value. Non-uniformity is chosen to maximise the amount of preserved data. For example: Original resolution: 30px (width) * 10px (height) min_elevation_resolution: 30 New resolution: 30px (width) * 30px (height)
         */
        minElevationResolutionCells?: number;
        /**
         * Required. Resource name of the tile. The tile resource name is prefixed by its collection ID `terraintiles/` followed by the resource ID, which encodes the tile's global x and y coordinates and zoom level as `@,,z`. For example, `terraintiles/@1,2,3z`.
         */
        name?: string;
        /**
         * Terrain formats that the client understands.
         */
        terrainFormats?: string[];
    }
    export {};
}
