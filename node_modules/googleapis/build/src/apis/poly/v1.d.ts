import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace poly_v1 {
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
     * Poly API
     *
     * The Poly API provides read access to assets hosted on poly.google.com to all, and upload access to poly.google.com for whitelisted accounts.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const poly = google.poly('v1');
     * ```
     */
    export class Poly {
        context: APIRequestContext;
        assets: Resource$Assets;
        users: Resource$Users;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents and describes an asset in the Poly library. An asset is a 3D model or scene created using [Tilt Brush](//www.tiltbrush.com), [Blocks](//vr.google.com/blocks/), or any 3D program that produces a file that can be upload to Poly.
     */
    export interface Schema$Asset {
        /**
         * The author's publicly visible name. Use this name when giving credit to the author. For more information, see [Licensing](/poly/discover/licensing).
         */
        authorName?: string | null;
        /**
         * For published assets, the time when the asset was published. For unpublished assets, the time when the asset was created.
         */
        createTime?: string | null;
        /**
         * The human-readable description, set by the asset's author.
         */
        description?: string | null;
        /**
         * The human-readable name, set by the asset's author.
         */
        displayName?: string | null;
        /**
         * A list of Formats where each format describes one representation of the asset.
         */
        formats?: Schema$Format[];
        /**
         * Whether this asset has been curated by the Poly team.
         */
        isCurated?: boolean | null;
        /**
         * The license under which the author has made the asset available for use, if any.
         */
        license?: string | null;
        /**
         * Application-defined opaque metadata for this asset. This field is only returned when querying for the signed-in user's own assets, not for public assets. This string is limited to 1K chars. It is up to the creator of the asset to define the format for this string (for example, JSON).
         */
        metadata?: string | null;
        /**
         * The unique identifier for the asset in the form: `assets/{ASSET_ID\}`.
         */
        name?: string | null;
        /**
         * Hints for displaying the asset. Note that these parameters are not immutable; the author of an asset may change them post-publication.
         */
        presentationParams?: Schema$PresentationParams;
        /**
         * The remix info for the asset.
         */
        remixInfo?: Schema$RemixInfo;
        /**
         * The thumbnail image for the asset.
         */
        thumbnail?: Schema$File;
        /**
         * The time when the asset was last modified. For published assets, whose contents are immutable, the update time changes only when metadata properties, such as visibility, are updated.
         */
        updateTime?: string | null;
        /**
         * The visibility of the asset and who can access it.
         */
        visibility?: string | null;
    }
    /**
     * A message generated by the asset import process.
     */
    export interface Schema$AssetImportMessage {
        /**
         * The code associated with this message.
         */
        code?: string | null;
        /**
         * An optional file path. Only present for those error codes that specify it.
         */
        filePath?: string | null;
        /**
         * An optional image error. Only present for INVALID_IMAGE_FILE.
         */
        imageError?: Schema$ImageError;
        /**
         * An optional OBJ parse error. Only present for OBJ_PARSE_ERROR.
         */
        objParseError?: Schema$ObjParseError;
    }
    /**
     * Represents a file in Poly, which can be a root, resource, or thumbnail file.
     */
    export interface Schema$File {
        /**
         * The MIME content-type, such as `image/png`. For more information, see [MIME types](//developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types).
         */
        contentType?: string | null;
        /**
         * The path of the resource file relative to the root file. For root or thumbnail files, this is just the filename.
         */
        relativePath?: string | null;
        /**
         * The URL where the file data can be retrieved.
         */
        url?: string | null;
    }
    /**
     * The same asset can be represented in different formats, for example, a [WaveFront .obj](//en.wikipedia.org/wiki/Wavefront_.obj_file) file with its corresponding .mtl file or a [Khronos glTF](//www.khronos.org/gltf) file with its corresponding .glb binary data. A format refers to a specific representation of an asset and contains all information needed to retrieve and describe this representation.
     */
    export interface Schema$Format {
        /**
         * Complexity stats about this representation of the asset.
         */
        formatComplexity?: Schema$FormatComplexity;
        /**
         * A short string that identifies the format type of this representation. Possible values are: `FBX`, `GLTF`, `GLTF2`, `OBJ`, and `TILT`.
         */
        formatType?: string | null;
        /**
         * A list of dependencies of the root element. May include, but is not limited to, materials, textures, and shader programs.
         */
        resources?: Schema$File[];
        /**
         * The root of the file hierarchy. This will always be populated. For some format_types - such as `TILT`, which are self-contained - this is all of the data. Other types - such as `OBJ` - often reference other data elements. These are contained in the resources field.
         */
        root?: Schema$File;
    }
    /**
     * Information on the complexity of this Format.
     */
    export interface Schema$FormatComplexity {
        /**
         * A non-negative integer that represents the level of detail (LOD) of this format relative to other formats of the same asset with the same format_type. This hint allows you to sort formats from the most-detailed (0) to least-detailed (integers greater than 0).
         */
        lodHint?: number | null;
        /**
         * The estimated number of triangles.
         */
        triangleCount?: string | null;
    }
    /**
     * A message resulting from reading an image file.
     */
    export interface Schema$ImageError {
        /**
         * The type of image error encountered. Optional for older image errors.
         */
        code?: string | null;
        /**
         * The file path in the import of the image that was rejected.
         */
        filePath?: string | null;
    }
    /**
     * A response message from a request to list.
     */
    export interface Schema$ListAssetsResponse {
        /**
         * A list of assets that match the criteria specified in the request.
         */
        assets?: Schema$Asset[];
        /**
         * The continuation token for retrieving the next page. If empty, indicates that there are no more pages. To get the next page, submit the same request specifying this value as the page_token.
         */
        nextPageToken?: string | null;
        /**
         * The total number of assets in the list, without pagination.
         */
        totalSize?: number | null;
    }
    /**
     * A response message from a request to list.
     */
    export interface Schema$ListLikedAssetsResponse {
        /**
         * A list of assets that match the criteria specified in the request.
         */
        assets?: Schema$Asset[];
        /**
         * The continuation token for retrieving the next page. If empty, indicates that there are no more pages. To get the next page, submit the same request specifying this value as the page_token.
         */
        nextPageToken?: string | null;
        /**
         * The total number of assets in the list, without pagination.
         */
        totalSize?: number | null;
    }
    /**
     * A response message from a request to list.
     */
    export interface Schema$ListUserAssetsResponse {
        /**
         * The continuation token for retrieving the next page. If empty, indicates that there are no more pages. To get the next page, submit the same request specifying this value as the page_token.
         */
        nextPageToken?: string | null;
        /**
         * The total number of assets in the list, without pagination.
         */
        totalSize?: number | null;
        /**
         * A list of UserAssets matching the request.
         */
        userAssets?: Schema$UserAsset[];
    }
    /**
     * Details of an error resulting from parsing an OBJ file
     */
    export interface Schema$ObjParseError {
        /**
         * The type of problem found (required).
         */
        code?: string | null;
        /**
         * The ending character index at which the problem was found.
         */
        endIndex?: number | null;
        /**
         * The file path in which the problem was found.
         */
        filePath?: string | null;
        /**
         * The text of the line. Note that this may be truncated if the line was very long. This may not include the error if it occurs after line truncation.
         */
        line?: string | null;
        /**
         * Line number at which the problem was found.
         */
        lineNumber?: number | null;
        /**
         * The starting character index at which the problem was found.
         */
        startIndex?: number | null;
    }
    /**
     * Hints for displaying the asset, based on information available when the asset was uploaded.
     */
    export interface Schema$PresentationParams {
        /**
         * A background color which could be used for displaying the 3D asset in a 'thumbnail' or 'palette' style view. Authors have the option to set this background color when publishing or editing their asset. This is represented as a six-digit hexademical triplet specifying the RGB components of the background color, e.g. #FF0000 for Red.
         */
        backgroundColor?: string | null;
        /**
         * The materials' diffuse/albedo color. This does not apply to vertex colors or texture maps.
         */
        colorSpace?: string | null;
        /**
         * A rotation that should be applied to the object root to make it upright. More precisely, this quaternion transforms from "object space" (the space in which the object is defined) to "presentation space", a coordinate system where +Y is up, +X is right, -Z is forward. For example, if the object is the Eiffel Tower, in its local coordinate system the object might be laid out such that the base of the tower is on the YZ plane and the tip of the tower is towards positive X. In this case this quaternion would specify a rotation (of 90 degrees about the Z axis) such that in the presentation space the base of the tower is aligned with the XZ plane, and the tip of the tower lies towards +Y. This rotation is unrelated to the object's pose in the web preview, which is just a camera position setting and is *not* reflected in this rotation. Please note: this is applicable only to the gLTF.
         */
        orientingRotation?: Schema$Quaternion;
    }
    /**
     * A [Quaternion](//en.wikipedia.org/wiki/Quaternion). Please note: if in the response you see "w: 1" and nothing else this is the default value of [0, 0, 0, 1] where x,y, and z are 0.
     */
    export interface Schema$Quaternion {
        /**
         * The scalar component.
         */
        w?: number | null;
        /**
         * The x component.
         */
        x?: number | null;
        /**
         * The y component.
         */
        y?: number | null;
        /**
         * The z component.
         */
        z?: number | null;
    }
    /**
     * Info about the sources of this asset (i.e. assets that were remixed to create this asset).
     */
    export interface Schema$RemixInfo {
        /**
         * Resource ids for the sources of this remix, of the form: `assets/{ASSET_ID\}`
         */
        sourceAsset?: string[] | null;
    }
    /**
     * A response message from a request to startImport. This is returned in the response field of the Operation.
     */
    export interface Schema$StartAssetImportResponse {
        /**
         * The id of newly created asset. If this is empty when the operation is complete it means the import failed. Please refer to the assetImportMessages field to understand what went wrong.
         */
        assetId?: string | null;
        /**
         * The id of the asset import.
         */
        assetImportId?: string | null;
        /**
         * The message from the asset import. This will contain any warnings (or - in the case of failure - errors) that occurred during import.
         */
        assetImportMessages?: Schema$AssetImportMessage[];
        /**
         * The publish URL for the asset.
         */
        publishUrl?: string | null;
    }
    /**
     * Data about the user's asset.
     */
    export interface Schema$UserAsset {
        /**
         * An Asset.
         */
        asset?: Schema$Asset;
    }
    export class Resource$Assets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns detailed information about an asset given its name. PRIVATE assets are returned only if the currently authenticated user (via OAuth token) is the author of the asset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Assets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Assets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Asset>>;
        get(params: Params$Resource$Assets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Assets$Get, options: MethodOptions | BodyResponseCallback<Schema$Asset>, callback: BodyResponseCallback<Schema$Asset>): void;
        get(params: Params$Resource$Assets$Get, callback: BodyResponseCallback<Schema$Asset>): void;
        get(callback: BodyResponseCallback<Schema$Asset>): void;
        /**
         * Lists all public, remixable assets. These are assets with an access level of PUBLIC and published under the CC-By license.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Assets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Assets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListAssetsResponse>>;
        list(params: Params$Resource$Assets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Assets$List, options: MethodOptions | BodyResponseCallback<Schema$ListAssetsResponse>, callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
        list(params: Params$Resource$Assets$List, callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListAssetsResponse>): void;
    }
    export interface Params$Resource$Assets$Get extends StandardParameters {
        /**
         * Required. An asset's name in the form `assets/{ASSET_ID\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Assets$List extends StandardParameters {
        /**
         * Filter assets based on the specified category. Supported values are: `animals`, `architecture`, `art`, `food`, `nature`, `objects`, `people`, `scenes`, `technology`, and `transport`.
         */
        category?: string;
        /**
         * Return only assets that have been curated by the Poly team.
         */
        curated?: boolean;
        /**
         * Return only assets with the matching format. Acceptable values are: `BLOCKS`, `FBX`, `GLTF`, `GLTF2`, `OBJ`, `TILT`.
         */
        format?: string;
        /**
         * One or more search terms to be matched against all text that Poly has indexed for assets, which includes display_name, description, and tags. Multiple keywords should be separated by spaces.
         */
        keywords?: string;
        /**
         * Returns assets that are of the specified complexity or less. Defaults to COMPLEX. For example, a request for MEDIUM assets also includes SIMPLE assets.
         */
        maxComplexity?: string;
        /**
         * Specifies an ordering for assets. Acceptable values are: `BEST`, `NEWEST`, `OLDEST`. Defaults to `BEST`, which ranks assets based on a combination of popularity and other features.
         */
        orderBy?: string;
        /**
         * The maximum number of assets to be returned. This value must be between `1` and `100`. Defaults to `20`.
         */
        pageSize?: number;
        /**
         * Specifies a continuation token from a previous search whose results were split into multiple pages. To get the next page, submit the same request specifying the value from next_page_token.
         */
        pageToken?: string;
    }
    export class Resource$Users {
        context: APIRequestContext;
        assets: Resource$Users$Assets;
        likedassets: Resource$Users$Likedassets;
        constructor(context: APIRequestContext);
    }
    export class Resource$Users$Assets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists assets authored by the given user. Only the value 'me', representing the currently-authenticated user, is supported. May include assets with an access level of PRIVATE or UNLISTED and assets which are All Rights Reserved for the currently-authenticated user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Users$Assets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$Assets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListUserAssetsResponse>>;
        list(params: Params$Resource$Users$Assets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$Assets$List, options: MethodOptions | BodyResponseCallback<Schema$ListUserAssetsResponse>, callback: BodyResponseCallback<Schema$ListUserAssetsResponse>): void;
        list(params: Params$Resource$Users$Assets$List, callback: BodyResponseCallback<Schema$ListUserAssetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListUserAssetsResponse>): void;
    }
    export interface Params$Resource$Users$Assets$List extends StandardParameters {
        /**
         * Return only assets with the matching format. Acceptable values are: `BLOCKS`, `FBX`, `GLTF`, `GLTF2`, `OBJ`, and `TILT`.
         */
        format?: string;
        /**
         * A valid user id. Currently, only the special value 'me', representing the currently-authenticated user is supported. To use 'me', you must pass an OAuth token with the request.
         */
        name?: string;
        /**
         * Specifies an ordering for assets. Acceptable values are: `BEST`, `NEWEST`, `OLDEST`. Defaults to `BEST`, which ranks assets based on a combination of popularity and other features.
         */
        orderBy?: string;
        /**
         * The maximum number of assets to be returned. This value must be between `1` and `100`. Defaults to `20`.
         */
        pageSize?: number;
        /**
         * Specifies a continuation token from a previous search whose results were split into multiple pages. To get the next page, submit the same request specifying the value from next_page_token.
         */
        pageToken?: string;
        /**
         * The visibility of the assets to be returned. Defaults to VISIBILITY_UNSPECIFIED which returns all assets.
         */
        visibility?: string;
    }
    export class Resource$Users$Likedassets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists assets that the user has liked. Only the value 'me', representing the currently-authenticated user, is supported. May include assets with an access level of UNLISTED.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Users$Likedassets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$Likedassets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLikedAssetsResponse>>;
        list(params: Params$Resource$Users$Likedassets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$Likedassets$List, options: MethodOptions | BodyResponseCallback<Schema$ListLikedAssetsResponse>, callback: BodyResponseCallback<Schema$ListLikedAssetsResponse>): void;
        list(params: Params$Resource$Users$Likedassets$List, callback: BodyResponseCallback<Schema$ListLikedAssetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLikedAssetsResponse>): void;
    }
    export interface Params$Resource$Users$Likedassets$List extends StandardParameters {
        /**
         * Return only assets with the matching format. Acceptable values are: `BLOCKS`, `FBX`, `GLTF`, `GLTF2`, `OBJ`, `TILT`.
         */
        format?: string;
        /**
         * A valid user id. Currently, only the special value 'me', representing the currently-authenticated user is supported. To use 'me', you must pass an OAuth token with the request.
         */
        name?: string;
        /**
         * Specifies an ordering for assets. Acceptable values are: `BEST`, `NEWEST`, `OLDEST`, 'LIKED_TIME'. Defaults to `LIKED_TIME`, which ranks assets based on how recently they were liked.
         */
        orderBy?: string;
        /**
         * The maximum number of assets to be returned. This value must be between `1` and `100`. Defaults to `20`.
         */
        pageSize?: number;
        /**
         * Specifies a continuation token from a previous search whose results were split into multiple pages. To get the next page, submit the same request specifying the value from next_page_token.
         */
        pageToken?: string;
    }
    export {};
}
