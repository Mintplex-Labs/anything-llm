import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace vision_v1p1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1p1beta1';
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
     * Cloud Vision API
     *
     * Integrates Google Vision features, including image labeling, face, logo, and landmark detection, optical character recognition (OCR), and detection of explicit content, into applications.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const vision = google.vision('v1p1beta1');
     * ```
     */
    export class Vision {
        context: APIRequestContext;
        files: Resource$Files;
        images: Resource$Images;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Response to a single file annotation request. A file may contain one or more images, which individually have their own responses.
     */
    export interface Schema$AnnotateFileResponse {
        /**
         * If set, represents the error message for the failed request. The `responses` field will not be set in this case.
         */
        error?: Schema$Status;
        /**
         * Information about the file for which this response is generated.
         */
        inputConfig?: Schema$InputConfig;
        /**
         * Individual responses to images found within the file. This field will be empty if the `error` field is set.
         */
        responses?: Schema$AnnotateImageResponse[];
        /**
         * This field gives the total number of pages in the file.
         */
        totalPages?: number | null;
    }
    /**
     * Response to an image annotation request.
     */
    export interface Schema$AnnotateImageResponse {
        /**
         * If present, contextual information is needed to understand where this image comes from.
         */
        context?: Schema$ImageAnnotationContext;
        /**
         * If present, crop hints have completed successfully.
         */
        cropHintsAnnotation?: Schema$CropHintsAnnotation;
        /**
         * If set, represents the error message for the operation. Note that filled-in image annotations are guaranteed to be correct, even when `error` is set.
         */
        error?: Schema$Status;
        /**
         * If present, face detection has completed successfully.
         */
        faceAnnotations?: Schema$FaceAnnotation[];
        /**
         * If present, text (OCR) detection or document (OCR) text detection has completed successfully. This annotation provides the structural hierarchy for the OCR detected text.
         */
        fullTextAnnotation?: Schema$TextAnnotation;
        /**
         * If present, image properties were extracted successfully.
         */
        imagePropertiesAnnotation?: Schema$ImageProperties;
        /**
         * If present, label detection has completed successfully.
         */
        labelAnnotations?: Schema$EntityAnnotation[];
        /**
         * If present, landmark detection has completed successfully.
         */
        landmarkAnnotations?: Schema$EntityAnnotation[];
        /**
         * If present, localized object detection has completed successfully. This will be sorted descending by confidence score.
         */
        localizedObjectAnnotations?: Schema$LocalizedObjectAnnotation[];
        /**
         * If present, logo detection has completed successfully.
         */
        logoAnnotations?: Schema$EntityAnnotation[];
        /**
         * If present, product search has completed successfully.
         */
        productSearchResults?: Schema$ProductSearchResults;
        /**
         * If present, safe-search annotation has completed successfully.
         */
        safeSearchAnnotation?: Schema$SafeSearchAnnotation;
        /**
         * If present, text (OCR) detection has completed successfully.
         */
        textAnnotations?: Schema$EntityAnnotation[];
        /**
         * If present, web detection has completed successfully.
         */
        webDetection?: Schema$WebDetection;
    }
    /**
     * The response for a single offline file annotation request.
     */
    export interface Schema$AsyncAnnotateFileResponse {
        /**
         * The output location and metadata from AsyncAnnotateFileRequest.
         */
        outputConfig?: Schema$OutputConfig;
    }
    /**
     * Response to an async batch file annotation request.
     */
    export interface Schema$AsyncBatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, one for each request in AsyncBatchAnnotateFilesRequest.
         */
        responses?: Schema$AsyncAnnotateFileResponse[];
    }
    /**
     * Response to an async batch image annotation request.
     */
    export interface Schema$AsyncBatchAnnotateImagesResponse {
        /**
         * The output location and metadata from AsyncBatchAnnotateImagesRequest.
         */
        outputConfig?: Schema$OutputConfig;
    }
    /**
     * A list of file annotation responses.
     */
    export interface Schema$BatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, each response corresponding to each AnnotateFileRequest in BatchAnnotateFilesRequest.
         */
        responses?: Schema$AnnotateFileResponse[];
    }
    /**
     * Metadata for the batch operations such as the current state. This is included in the `metadata` field of the `Operation` returned by the `GetOperation` call of the `google::longrunning::Operations` service.
     */
    export interface Schema$BatchOperationMetadata {
        /**
         * The time when the batch request is finished and google.longrunning.Operation.done is set to true.
         */
        endTime?: string | null;
        /**
         * The current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the batch request was submitted to the server.
         */
        submitTime?: string | null;
    }
    /**
     * Logical element on the page.
     */
    export interface Schema$Block {
        /**
         * Detected block type (text, image etc) for this block.
         */
        blockType?: string | null;
        /**
         * The bounding box for the block. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$BoundingPoly;
        /**
         * Confidence of the OCR results on the block. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * List of paragraphs in this block (if this blocks is of type text).
         */
        paragraphs?: Schema$Paragraph[];
        /**
         * Additional information detected for the block.
         */
        property?: Schema$TextProperty;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$Vertex[];
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
     * Color information consists of RGB channels, score, and the fraction of the image that the color occupies in the image.
     */
    export interface Schema$ColorInfo {
        /**
         * RGB components of the color.
         */
        color?: Schema$Color;
        /**
         * The fraction of pixels the color occupies in the image. Value in range [0, 1].
         */
        pixelFraction?: number | null;
        /**
         * Image-specific score for this color. Value in range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Single crop hint that is used to generate a new crop when serving an image.
     */
    export interface Schema$CropHint {
        /**
         * The bounding polygon for the crop region. The coordinates of the bounding box are in the original image's scale.
         */
        boundingPoly?: Schema$BoundingPoly;
        /**
         * Confidence of this being a salient region. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Fraction of importance of this salient region with respect to the original image.
         */
        importanceFraction?: number | null;
    }
    /**
     * Set of crop hints that are used to generate new crops when serving images.
     */
    export interface Schema$CropHintsAnnotation {
        /**
         * Crop hint results.
         */
        cropHints?: Schema$CropHint[];
    }
    /**
     * Detected start or end of a structural component.
     */
    export interface Schema$DetectedBreak {
        /**
         * True if break prepends the element.
         */
        isPrefix?: boolean | null;
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$DetectedLanguage {
        /**
         * Confidence of detected language. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Set of dominant colors and their corresponding scores.
     */
    export interface Schema$DominantColorsAnnotation {
        /**
         * RGB color values with their score and pixel fraction.
         */
        colors?: Schema$ColorInfo[];
    }
    /**
     * Set of detected entity features.
     */
    export interface Schema$EntityAnnotation {
        /**
         * Image region to which this entity belongs. Not produced for `LABEL_DETECTION` features.
         */
        boundingPoly?: Schema$BoundingPoly;
        /**
         * **Deprecated. Use `score` instead.** The accuracy of the entity detection in an image. For example, for an image in which the "Eiffel Tower" entity is detected, this field represents the confidence that there is a tower in the query image. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Entity textual description, expressed in its `locale` language.
         */
        description?: string | null;
        /**
         * The language code for the locale in which the entity textual `description` is expressed.
         */
        locale?: string | null;
        /**
         * The location information for the detected entity. Multiple `LocationInfo` elements can be present because one location may indicate the location of the scene in the image, and another location may indicate the location of the place where the image was taken. Location information is usually present for landmarks.
         */
        locations?: Schema$LocationInfo[];
        /**
         * Opaque entity ID. Some IDs may be available in [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
         */
        mid?: string | null;
        /**
         * Some entities may have optional user-supplied `Property` (name/value) fields, such a score or string that qualifies the entity.
         */
        properties?: Schema$Property[];
        /**
         * Overall score of the result. Range [0, 1].
         */
        score?: number | null;
        /**
         * The relevancy of the ICA (Image Content Annotation) label to the image. For example, the relevancy of "tower" is likely higher to an image containing the detected "Eiffel Tower" than to an image containing a detected distant towering building, even though the confidence that there is a tower in each image may be the same. Range [0, 1].
         */
        topicality?: number | null;
    }
    /**
     * A face annotation object contains the results of face detection.
     */
    export interface Schema$FaceAnnotation {
        /**
         * Anger likelihood.
         */
        angerLikelihood?: string | null;
        /**
         * Blurred likelihood.
         */
        blurredLikelihood?: string | null;
        /**
         * The bounding polygon around the face. The coordinates of the bounding box are in the original image's scale. The bounding box is computed to "frame" the face in accordance with human expectations. It is based on the landmarker results. Note that one or more x and/or y coordinates may not be generated in the `BoundingPoly` (the polygon will be unbounded) if only a partial face appears in the image to be annotated.
         */
        boundingPoly?: Schema$BoundingPoly;
        /**
         * Detection confidence. Range [0, 1].
         */
        detectionConfidence?: number | null;
        /**
         * The `fd_bounding_poly` bounding polygon is tighter than the `boundingPoly`, and encloses only the skin part of the face. Typically, it is used to eliminate the face from any image analysis that detects the "amount of skin" visible in an image. It is not based on the landmarker results, only on the initial face detection, hence the fd (face detection) prefix.
         */
        fdBoundingPoly?: Schema$BoundingPoly;
        /**
         * Headwear likelihood.
         */
        headwearLikelihood?: string | null;
        /**
         * Joy likelihood.
         */
        joyLikelihood?: string | null;
        /**
         * Face landmarking confidence. Range [0, 1].
         */
        landmarkingConfidence?: number | null;
        /**
         * Detected face landmarks.
         */
        landmarks?: Schema$Landmark[];
        /**
         * Yaw angle, which indicates the leftward/rightward angle that the face is pointing relative to the vertical plane perpendicular to the image. Range [-180,180].
         */
        panAngle?: number | null;
        /**
         * Roll angle, which indicates the amount of clockwise/anti-clockwise rotation of the face relative to the image vertical about the axis perpendicular to the face. Range [-180,180].
         */
        rollAngle?: number | null;
        /**
         * Sorrow likelihood.
         */
        sorrowLikelihood?: string | null;
        /**
         * Surprise likelihood.
         */
        surpriseLikelihood?: string | null;
        /**
         * Pitch angle, which indicates the upwards/downwards angle that the face is pointing relative to the image's horizontal plane. Range [-180,180].
         */
        tiltAngle?: number | null;
        /**
         * Under-exposed likelihood.
         */
        underExposedLikelihood?: string | null;
    }
    /**
     * The Google Cloud Storage location where the output will be written to.
     */
    export interface Schema$GcsDestination {
        /**
         * Google Cloud Storage URI prefix where the results will be stored. Results will be in JSON format and preceded by its corresponding input URI prefix. This field can either represent a gcs file prefix or gcs directory. In either case, the uri should be unique because in order to get all of the output files, you will need to do a wildcard gcs search on the uri prefix you provide. Examples: * File Prefix: gs://bucket-name/here/filenameprefix The output files will be created in gs://bucket-name/here/ and the names of the output files will begin with "filenameprefix". * Directory Prefix: gs://bucket-name/some/location/ The output files will be created in gs://bucket-name/some/location/ and the names of the output files could be anything because there was no filename prefix specified. If multiple outputs, each response is still AnnotateFileResponse, each of which contains some subset of the full list of AnnotateImageResponse. Multiple outputs can happen if, for example, the output JSON is too large and overflows into multiple sharded files.
         */
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input will be read from.
     */
    export interface Schema$GcsSource {
        /**
         * Google Cloud Storage URI for the input file. This must only be a Google Cloud Storage object. Wildcards are not currently supported.
         */
        uri?: string | null;
    }
    /**
     * A request to annotate one single file, e.g. a PDF, TIFF or GIF file.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AnnotateFileRequest {
        /**
         * Required. Requested features.
         */
        features?: Schema$GoogleCloudVisionV1p1beta1Feature[];
        /**
         * Additional context that may accompany the image(s) in the file.
         */
        imageContext?: Schema$GoogleCloudVisionV1p1beta1ImageContext;
        /**
         * Required. Information about the input file.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p1beta1InputConfig;
        /**
         * Pages of the file to perform image annotation. Pages starts from 1, we assume the first page of the file is page 1. At most 5 pages are supported per request. Pages can be negative. Page 1 means the first page. Page 2 means the second page. Page -1 means the last page. Page -2 means the second to the last page. If the file is GIF instead of PDF or TIFF, page refers to GIF frames. If this field is empty, by default the service performs image annotation for the first 5 pages of the file.
         */
        pages?: number[] | null;
    }
    /**
     * Response to a single file annotation request. A file may contain one or more images, which individually have their own responses.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AnnotateFileResponse {
        /**
         * If set, represents the error message for the failed request. The `responses` field will not be set in this case.
         */
        error?: Schema$Status;
        /**
         * Information about the file for which this response is generated.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p1beta1InputConfig;
        /**
         * Individual responses to images found within the file. This field will be empty if the `error` field is set.
         */
        responses?: Schema$GoogleCloudVisionV1p1beta1AnnotateImageResponse[];
        /**
         * This field gives the total number of pages in the file.
         */
        totalPages?: number | null;
    }
    /**
     * Request for performing Google Cloud Vision API tasks over a user-provided image, with user-requested features, and with context information.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AnnotateImageRequest {
        /**
         * Requested features.
         */
        features?: Schema$GoogleCloudVisionV1p1beta1Feature[];
        /**
         * The image to be processed.
         */
        image?: Schema$GoogleCloudVisionV1p1beta1Image;
        /**
         * Additional context that may accompany the image.
         */
        imageContext?: Schema$GoogleCloudVisionV1p1beta1ImageContext;
    }
    /**
     * Response to an image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AnnotateImageResponse {
        /**
         * If present, contextual information is needed to understand where this image comes from.
         */
        context?: Schema$GoogleCloudVisionV1p1beta1ImageAnnotationContext;
        /**
         * If present, crop hints have completed successfully.
         */
        cropHintsAnnotation?: Schema$GoogleCloudVisionV1p1beta1CropHintsAnnotation;
        /**
         * If set, represents the error message for the operation. Note that filled-in image annotations are guaranteed to be correct, even when `error` is set.
         */
        error?: Schema$Status;
        /**
         * If present, face detection has completed successfully.
         */
        faceAnnotations?: Schema$GoogleCloudVisionV1p1beta1FaceAnnotation[];
        /**
         * If present, text (OCR) detection or document (OCR) text detection has completed successfully. This annotation provides the structural hierarchy for the OCR detected text.
         */
        fullTextAnnotation?: Schema$GoogleCloudVisionV1p1beta1TextAnnotation;
        /**
         * If present, image properties were extracted successfully.
         */
        imagePropertiesAnnotation?: Schema$GoogleCloudVisionV1p1beta1ImageProperties;
        /**
         * If present, label detection has completed successfully.
         */
        labelAnnotations?: Schema$GoogleCloudVisionV1p1beta1EntityAnnotation[];
        /**
         * If present, landmark detection has completed successfully.
         */
        landmarkAnnotations?: Schema$GoogleCloudVisionV1p1beta1EntityAnnotation[];
        /**
         * If present, localized object detection has completed successfully. This will be sorted descending by confidence score.
         */
        localizedObjectAnnotations?: Schema$GoogleCloudVisionV1p1beta1LocalizedObjectAnnotation[];
        /**
         * If present, logo detection has completed successfully.
         */
        logoAnnotations?: Schema$GoogleCloudVisionV1p1beta1EntityAnnotation[];
        /**
         * If present, product search has completed successfully.
         */
        productSearchResults?: Schema$GoogleCloudVisionV1p1beta1ProductSearchResults;
        /**
         * If present, safe-search annotation has completed successfully.
         */
        safeSearchAnnotation?: Schema$GoogleCloudVisionV1p1beta1SafeSearchAnnotation;
        /**
         * If present, text (OCR) detection has completed successfully.
         */
        textAnnotations?: Schema$GoogleCloudVisionV1p1beta1EntityAnnotation[];
        /**
         * If present, web detection has completed successfully.
         */
        webDetection?: Schema$GoogleCloudVisionV1p1beta1WebDetection;
    }
    /**
     * An offline file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AsyncAnnotateFileRequest {
        /**
         * Required. Requested features.
         */
        features?: Schema$GoogleCloudVisionV1p1beta1Feature[];
        /**
         * Additional context that may accompany the image(s) in the file.
         */
        imageContext?: Schema$GoogleCloudVisionV1p1beta1ImageContext;
        /**
         * Required. Information about the input file.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p1beta1InputConfig;
        /**
         * Required. The desired output location and metadata (e.g. format).
         */
        outputConfig?: Schema$GoogleCloudVisionV1p1beta1OutputConfig;
    }
    /**
     * The response for a single offline file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AsyncAnnotateFileResponse {
        /**
         * The output location and metadata from AsyncAnnotateFileRequest.
         */
        outputConfig?: Schema$GoogleCloudVisionV1p1beta1OutputConfig;
    }
    /**
     * Multiple async file annotation requests are batched into a single service call.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateFilesRequest {
        /**
         * Optional. The labels with user-defined metadata for the request. Label keys and values can be no longer than 63 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string | null;
        /**
         * Required. Individual async file annotation requests for this batch.
         */
        requests?: Schema$GoogleCloudVisionV1p1beta1AsyncAnnotateFileRequest[];
    }
    /**
     * Response to an async batch file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, one for each request in AsyncBatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p1beta1AsyncAnnotateFileResponse[];
    }
    /**
     * Request for async image annotation for a list of images.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateImagesRequest {
        /**
         * Optional. The labels with user-defined metadata for the request. Label keys and values can be no longer than 63 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The desired output location and metadata (e.g. format).
         */
        outputConfig?: Schema$GoogleCloudVisionV1p1beta1OutputConfig;
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string | null;
        /**
         * Required. Individual image annotation requests for this batch.
         */
        requests?: Schema$GoogleCloudVisionV1p1beta1AnnotateImageRequest[];
    }
    /**
     * A list of requests to annotate files using the BatchAnnotateFiles API.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesRequest {
        /**
         * Optional. The labels with user-defined metadata for the request. Label keys and values can be no longer than 63 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string | null;
        /**
         * Required. The list of file annotation requests. Right now we support only one AnnotateFileRequest in BatchAnnotateFilesRequest.
         */
        requests?: Schema$GoogleCloudVisionV1p1beta1AnnotateFileRequest[];
    }
    /**
     * A list of file annotation responses.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, each response corresponding to each AnnotateFileRequest in BatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p1beta1AnnotateFileResponse[];
    }
    /**
     * Multiple image annotation requests are batched into a single service call.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesRequest {
        /**
         * Optional. The labels with user-defined metadata for the request. Label keys and values can be no longer than 63 characters (Unicode codepoints), can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string | null;
        /**
         * Required. Individual image annotation requests for this batch.
         */
        requests?: Schema$GoogleCloudVisionV1p1beta1AnnotateImageRequest[];
    }
    /**
     * Response to a batch image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse {
        /**
         * Individual responses to image annotation requests within the batch.
         */
        responses?: Schema$GoogleCloudVisionV1p1beta1AnnotateImageResponse[];
    }
    /**
     * Logical element on the page.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Block {
        /**
         * Detected block type (text, image etc) for this block.
         */
        blockType?: string | null;
        /**
         * The bounding box for the block. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Confidence of the OCR results on the block. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * List of paragraphs in this block (if this blocks is of type text).
         */
        paragraphs?: Schema$GoogleCloudVisionV1p1beta1Paragraph[];
        /**
         * Additional information detected for the block.
         */
        property?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudVisionV1p1beta1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudVisionV1p1beta1Vertex[];
    }
    /**
     * Color information consists of RGB channels, score, and the fraction of the image that the color occupies in the image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ColorInfo {
        /**
         * RGB components of the color.
         */
        color?: Schema$Color;
        /**
         * The fraction of pixels the color occupies in the image. Value in range [0, 1].
         */
        pixelFraction?: number | null;
        /**
         * Image-specific score for this color. Value in range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Single crop hint that is used to generate a new crop when serving an image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1CropHint {
        /**
         * The bounding polygon for the crop region. The coordinates of the bounding box are in the original image's scale.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Confidence of this being a salient region. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Fraction of importance of this salient region with respect to the original image.
         */
        importanceFraction?: number | null;
    }
    /**
     * Set of crop hints that are used to generate new crops when serving images.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1CropHintsAnnotation {
        /**
         * Crop hint results.
         */
        cropHints?: Schema$GoogleCloudVisionV1p1beta1CropHint[];
    }
    /**
     * Parameters for crop hints annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1CropHintsParams {
        /**
         * Aspect ratios in floats, representing the ratio of the width to the height of the image. For example, if the desired aspect ratio is 4/3, the corresponding float value should be 1.33333. If not specified, the best possible crop is returned. The number of provided aspect ratios is limited to a maximum of 16; any aspect ratios provided after the 16th are ignored.
         */
        aspectRatios?: number[] | null;
    }
    /**
     * Set of dominant colors and their corresponding scores.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1DominantColorsAnnotation {
        /**
         * RGB color values with their score and pixel fraction.
         */
        colors?: Schema$GoogleCloudVisionV1p1beta1ColorInfo[];
    }
    /**
     * Set of detected entity features.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1EntityAnnotation {
        /**
         * Image region to which this entity belongs. Not produced for `LABEL_DETECTION` features.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * **Deprecated. Use `score` instead.** The accuracy of the entity detection in an image. For example, for an image in which the "Eiffel Tower" entity is detected, this field represents the confidence that there is a tower in the query image. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Entity textual description, expressed in its `locale` language.
         */
        description?: string | null;
        /**
         * The language code for the locale in which the entity textual `description` is expressed.
         */
        locale?: string | null;
        /**
         * The location information for the detected entity. Multiple `LocationInfo` elements can be present because one location may indicate the location of the scene in the image, and another location may indicate the location of the place where the image was taken. Location information is usually present for landmarks.
         */
        locations?: Schema$GoogleCloudVisionV1p1beta1LocationInfo[];
        /**
         * Opaque entity ID. Some IDs may be available in [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
         */
        mid?: string | null;
        /**
         * Some entities may have optional user-supplied `Property` (name/value) fields, such a score or string that qualifies the entity.
         */
        properties?: Schema$GoogleCloudVisionV1p1beta1Property[];
        /**
         * Overall score of the result. Range [0, 1].
         */
        score?: number | null;
        /**
         * The relevancy of the ICA (Image Content Annotation) label to the image. For example, the relevancy of "tower" is likely higher to an image containing the detected "Eiffel Tower" than to an image containing a detected distant towering building, even though the confidence that there is a tower in each image may be the same. Range [0, 1].
         */
        topicality?: number | null;
    }
    /**
     * A face annotation object contains the results of face detection.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1FaceAnnotation {
        /**
         * Anger likelihood.
         */
        angerLikelihood?: string | null;
        /**
         * Blurred likelihood.
         */
        blurredLikelihood?: string | null;
        /**
         * The bounding polygon around the face. The coordinates of the bounding box are in the original image's scale. The bounding box is computed to "frame" the face in accordance with human expectations. It is based on the landmarker results. Note that one or more x and/or y coordinates may not be generated in the `BoundingPoly` (the polygon will be unbounded) if only a partial face appears in the image to be annotated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Detection confidence. Range [0, 1].
         */
        detectionConfidence?: number | null;
        /**
         * The `fd_bounding_poly` bounding polygon is tighter than the `boundingPoly`, and encloses only the skin part of the face. Typically, it is used to eliminate the face from any image analysis that detects the "amount of skin" visible in an image. It is not based on the landmarker results, only on the initial face detection, hence the fd (face detection) prefix.
         */
        fdBoundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Headwear likelihood.
         */
        headwearLikelihood?: string | null;
        /**
         * Joy likelihood.
         */
        joyLikelihood?: string | null;
        /**
         * Face landmarking confidence. Range [0, 1].
         */
        landmarkingConfidence?: number | null;
        /**
         * Detected face landmarks.
         */
        landmarks?: Schema$GoogleCloudVisionV1p1beta1FaceAnnotationLandmark[];
        /**
         * Yaw angle, which indicates the leftward/rightward angle that the face is pointing relative to the vertical plane perpendicular to the image. Range [-180,180].
         */
        panAngle?: number | null;
        /**
         * Roll angle, which indicates the amount of clockwise/anti-clockwise rotation of the face relative to the image vertical about the axis perpendicular to the face. Range [-180,180].
         */
        rollAngle?: number | null;
        /**
         * Sorrow likelihood.
         */
        sorrowLikelihood?: string | null;
        /**
         * Surprise likelihood.
         */
        surpriseLikelihood?: string | null;
        /**
         * Pitch angle, which indicates the upwards/downwards angle that the face is pointing relative to the image's horizontal plane. Range [-180,180].
         */
        tiltAngle?: number | null;
        /**
         * Under-exposed likelihood.
         */
        underExposedLikelihood?: string | null;
    }
    /**
     * A face-specific landmark (for example, a face feature). Landmark positions may fall outside the bounds of the image if the face is near one or more edges of the image. Therefore it is NOT guaranteed that `0 <= x < width` or `0 <= y < height`.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1FaceAnnotationLandmark {
        /**
         * Face landmark position.
         */
        position?: Schema$GoogleCloudVisionV1p1beta1Position;
        /**
         * Face landmark type.
         */
        type?: string | null;
    }
    /**
     * The type of Google Cloud Vision API detection to perform, and the maximum number of results to return for that type. Multiple `Feature` objects can be specified in the `features` list.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Feature {
        /**
         * Maximum number of results of this type. Does not apply to `TEXT_DETECTION`, `DOCUMENT_TEXT_DETECTION`, or `CROP_HINTS`.
         */
        maxResults?: number | null;
        /**
         * Model to use for the feature. Supported values: "builtin/stable" (the default if unset) and "builtin/latest". `DOCUMENT_TEXT_DETECTION` and `TEXT_DETECTION` also support "builtin/weekly" for the bleeding edge release updated weekly.
         */
        model?: string | null;
        /**
         * The feature type.
         */
        type?: string | null;
    }
    /**
     * The Google Cloud Storage location where the output will be written to.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1GcsDestination {
        /**
         * Google Cloud Storage URI prefix where the results will be stored. Results will be in JSON format and preceded by its corresponding input URI prefix. This field can either represent a gcs file prefix or gcs directory. In either case, the uri should be unique because in order to get all of the output files, you will need to do a wildcard gcs search on the uri prefix you provide. Examples: * File Prefix: gs://bucket-name/here/filenameprefix The output files will be created in gs://bucket-name/here/ and the names of the output files will begin with "filenameprefix". * Directory Prefix: gs://bucket-name/some/location/ The output files will be created in gs://bucket-name/some/location/ and the names of the output files could be anything because there was no filename prefix specified. If multiple outputs, each response is still AnnotateFileResponse, each of which contains some subset of the full list of AnnotateImageResponse. Multiple outputs can happen if, for example, the output JSON is too large and overflows into multiple sharded files.
         */
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input will be read from.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1GcsSource {
        /**
         * Google Cloud Storage URI for the input file. This must only be a Google Cloud Storage object. Wildcards are not currently supported.
         */
        uri?: string | null;
    }
    /**
     * Client image to perform Google Cloud Vision API tasks over.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Image {
        /**
         * Image content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateImages requests. It does not work for AsyncBatchAnnotateImages requests.
         */
        content?: string | null;
        /**
         * Google Cloud Storage image location, or publicly-accessible image URL. If both `content` and `source` are provided for an image, `content` takes precedence and is used to perform the image annotation request.
         */
        source?: Schema$GoogleCloudVisionV1p1beta1ImageSource;
    }
    /**
     * If an image was produced from a file (e.g. a PDF), this message gives information about the source of that image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ImageAnnotationContext {
        /**
         * If the file was a PDF or TIFF, this field gives the page number within the file used to produce the image.
         */
        pageNumber?: number | null;
        /**
         * The URI of the file used to produce the image.
         */
        uri?: string | null;
    }
    /**
     * Image context and/or feature-specific parameters.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ImageContext {
        /**
         * Parameters for crop hints annotation request.
         */
        cropHintsParams?: Schema$GoogleCloudVisionV1p1beta1CropHintsParams;
        /**
         * List of languages to use for TEXT_DETECTION. In most cases, an empty value yields the best results since it enables automatic language detection. For languages based on the Latin alphabet, setting `language_hints` is not needed. In rare cases, when the language of the text in the image is known, setting a hint will help get better results (although it will be a significant hindrance if the hint is wrong). Text detection returns an error if one or more of the specified languages is not one of the [supported languages](https://cloud.google.com/vision/docs/languages).
         */
        languageHints?: string[] | null;
        /**
         * Not used.
         */
        latLongRect?: Schema$GoogleCloudVisionV1p1beta1LatLongRect;
        /**
         * Parameters for product search.
         */
        productSearchParams?: Schema$GoogleCloudVisionV1p1beta1ProductSearchParams;
        /**
         * Parameters for text detection and document text detection.
         */
        textDetectionParams?: Schema$GoogleCloudVisionV1p1beta1TextDetectionParams;
        /**
         * Parameters for web detection.
         */
        webDetectionParams?: Schema$GoogleCloudVisionV1p1beta1WebDetectionParams;
    }
    /**
     * Stores image properties, such as dominant colors.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ImageProperties {
        /**
         * If present, dominant colors completed successfully.
         */
        dominantColors?: Schema$GoogleCloudVisionV1p1beta1DominantColorsAnnotation;
    }
    /**
     * External image source (Google Cloud Storage or web URL image location).
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ImageSource {
        /**
         * **Use `image_uri` instead.** The Google Cloud Storage URI of the form `gs://bucket_name/object_name`. Object versioning is not supported. See [Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris) for more info.
         */
        gcsImageUri?: string | null;
        /**
         * The URI of the source image. Can be either: 1. A Google Cloud Storage URI of the form `gs://bucket_name/object_name`. Object versioning is not supported. See [Google Cloud Storage Request URIs](https://cloud.google.com/storage/docs/reference-uris) for more info. 2. A publicly-accessible image HTTP/HTTPS URL. When fetching images from HTTP/HTTPS URLs, Google cannot guarantee that the request will be completed. Your request may fail if the specified host denies the request (e.g. due to request throttling or DOS prevention), or if Google throttles requests to the site for abuse prevention. You should not depend on externally-hosted images for production applications. When both `gcs_image_uri` and `image_uri` are specified, `image_uri` takes precedence.
         */
        imageUri?: string | null;
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1InputConfig {
        /**
         * File content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateFiles requests. It does not work for AsyncBatchAnnotateFiles requests.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage location to read the input from.
         */
        gcsSource?: Schema$GoogleCloudVisionV1p1beta1GcsSource;
        /**
         * The type of the file. Currently only "application/pdf", "image/tiff" and "image/gif" are supported. Wildcards are not supported.
         */
        mimeType?: string | null;
    }
    /**
     * Rectangle determined by min and max `LatLng` pairs.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1LatLongRect {
        /**
         * Max lat/long pair.
         */
        maxLatLng?: Schema$LatLng;
        /**
         * Min lat/long pair.
         */
        minLatLng?: Schema$LatLng;
    }
    /**
     * Set of detected objects with bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1LocalizedObjectAnnotation {
        /**
         * Image region to which this object belongs. This must be populated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Detected entity location information.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1LocationInfo {
        /**
         * lat/long location coordinates.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Contains metadata for the BatchAnnotateImages operation.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1OutputConfig {
        /**
         * The max number of response protos to put into each output JSON file on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 response protos will be generated. If `batch_size` = 20, then 5 json files each containing 20 response protos will be written under the prefix `gcs_destination`.`uri`. Currently, batch_size only applies to GcsDestination, with potential future support for other output configurations.
         */
        batchSize?: number | null;
        /**
         * The Google Cloud Storage location to write the output(s) to.
         */
        gcsDestination?: Schema$GoogleCloudVisionV1p1beta1GcsDestination;
    }
    /**
     * Detected page from OCR.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Page {
        /**
         * List of blocks of text, images etc on this page.
         */
        blocks?: Schema$GoogleCloudVisionV1p1beta1Block[];
        /**
         * Confidence of the OCR results on the page. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Page height. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        height?: number | null;
        /**
         * Additional information detected on the page.
         */
        property?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty;
        /**
         * Page width. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        width?: number | null;
    }
    /**
     * Structural unit of text representing a number of words in certain order.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Paragraph {
        /**
         * The bounding box for the paragraph. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the paragraph. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the paragraph.
         */
        property?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty;
        /**
         * List of all words in this paragraph.
         */
        words?: Schema$GoogleCloudVisionV1p1beta1Word[];
    }
    /**
     * A 3D position in the image, used primarily for Face detection landmarks. A valid Position must have both x and y coordinates. The position coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Position {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
        /**
         * Z coordinate (or depth).
         */
        z?: number | null;
    }
    /**
     * A Product contains ReferenceImages.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Product {
        /**
         * User-provided metadata to be stored with this product. Must be at most 4096 characters long.
         */
        description?: string | null;
        /**
         * The user-provided name for this Product. Must not be empty. Must be at most 4096 characters long.
         */
        displayName?: string | null;
        /**
         * The resource name of the product. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID`. This field is ignored when creating a product.
         */
        name?: string | null;
        /**
         * Immutable. The category for the product identified by the reference image. This should be one of "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1" or "general-v1". The legacy categories "homegoods", "apparel", and "toys" are still supported, but these should not be used for new products.
         */
        productCategory?: string | null;
        /**
         * Key-value pairs that can be attached to a product. At query time, constraints can be specified based on the product_labels. Note that integer values can be provided as strings, e.g. "1199". Only strings with integer values can match a range-based restriction which is to be supported soon. Multiple values can be assigned to the same key. One product may have up to 500 product_labels. Notice that the total number of distinct product_labels over all products in one ProductSet cannot exceed 1M, otherwise the product search pipeline will refuse to work for that ProductSet.
         */
        productLabels?: Schema$GoogleCloudVisionV1p1beta1ProductKeyValue[];
    }
    /**
     * A product label represented as a key-value pair.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductKeyValue {
        /**
         * The key of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        key?: string | null;
        /**
         * The value of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        value?: string | null;
    }
    /**
     * Parameters for a product search request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductSearchParams {
        /**
         * The bounding polygon around the area of interest in the image. If it is not specified, system discretion will be applied.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * The filtering expression. This can be used to restrict search results based on Product labels. We currently support an AND of OR of key-value expressions, where each expression within an OR must have the same key. An '=' should be used to connect the key and value. For example, "(color = red OR color = blue) AND brand = Google" is acceptable, but "(color = red OR brand = Google)" is not acceptable. "color: red" is not acceptable because it uses a ':' instead of an '='.
         */
        filter?: string | null;
        /**
         * The list of product categories to search in. Currently, we only consider the first category, and either "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1", or "general-v1" should be specified. The legacy categories "homegoods", "apparel", and "toys" are still supported but will be deprecated. For new products, please use "homegoods-v2", "apparel-v2", or "toys-v2" for better product search accuracy. It is recommended to migrate existing products to these categories as well.
         */
        productCategories?: string[] | null;
        /**
         * The resource name of a ProductSet to be searched for similar images. Format is: `projects/PROJECT_ID/locations/LOC_ID/productSets/PRODUCT_SET_ID`.
         */
        productSet?: string | null;
    }
    /**
     * Results for a product search request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductSearchResults {
        /**
         * Timestamp of the index which provided these results. Products added to the product set and products removed from the product set after this time are not reflected in the current results.
         */
        indexTime?: string | null;
        /**
         * List of results grouped by products detected in the query image. Each entry corresponds to one bounding polygon in the query image, and contains the matching products specific to that region. There may be duplicate product matches in the union of all the per-product results.
         */
        productGroupedResults?: Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsGroupedResult[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsResult[];
    }
    /**
     * Information about the products similar to a single product in a query image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsGroupedResult {
        /**
         * The bounding polygon around the product detected in the query image.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * List of generic predictions for the object in the bounding box.
         */
        objectAnnotations?: Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsObjectAnnotation[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsResult[];
    }
    /**
     * Prediction for what the object in the bounding box is.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsObjectAnnotation {
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Information about a product.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1ProductSearchResultsResult {
        /**
         * The resource name of the image from the product that is the closest match to the query.
         */
        image?: string | null;
        /**
         * The Product.
         */
        product?: Schema$GoogleCloudVisionV1p1beta1Product;
        /**
         * A confidence level on the match, ranging from 0 (no confidence) to 1 (full confidence).
         */
        score?: number | null;
    }
    /**
     * A `Property` consists of a user-supplied name/value pair.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Property {
        /**
         * Name of the property.
         */
        name?: string | null;
        /**
         * Value of numeric properties.
         */
        uint64Value?: string | null;
        /**
         * Value of the property.
         */
        value?: string | null;
    }
    /**
     * Set of features pertaining to the image, computed by computer vision methods over safe-search verticals (for example, adult, spoof, medical, violence).
     */
    export interface Schema$GoogleCloudVisionV1p1beta1SafeSearchAnnotation {
        /**
         * Represents the adult content likelihood for the image. Adult content may contain elements such as nudity, pornographic images or cartoons, or sexual activities.
         */
        adult?: string | null;
        /**
         * Likelihood that this is a medical image.
         */
        medical?: string | null;
        /**
         * Likelihood that the request image contains racy content. Racy content may include (but is not limited to) skimpy or sheer clothing, strategically covered nudity, lewd or provocative poses, or close-ups of sensitive body areas.
         */
        racy?: string | null;
        /**
         * Spoof likelihood. The likelihood that an modification was made to the image's canonical version to make it appear funny or offensive.
         */
        spoof?: string | null;
        /**
         * Likelihood that this image contains violent content. Violent content may include death, serious harm, or injury to individuals or groups of individuals.
         */
        violence?: string | null;
    }
    /**
     * A single symbol representation.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Symbol {
        /**
         * The bounding box for the symbol. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the symbol. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the symbol.
         */
        property?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty;
        /**
         * The actual UTF-8 representation of the symbol.
         */
        text?: string | null;
    }
    /**
     * TextAnnotation contains a structured representation of OCR extracted text. The hierarchy of an OCR extracted text structure is like this: TextAnnotation -\> Page -\> Block -\> Paragraph -\> Word -\> Symbol Each structural component, starting from Page, may further have their own properties. Properties describe detected languages, breaks etc.. Please refer to the TextAnnotation.TextProperty message definition below for more detail.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1TextAnnotation {
        /**
         * List of pages detected by OCR.
         */
        pages?: Schema$GoogleCloudVisionV1p1beta1Page[];
        /**
         * UTF-8 text detected on the pages.
         */
        text?: string | null;
    }
    /**
     * Detected start or end of a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1TextAnnotationDetectedBreak {
        /**
         * True if break prepends the element.
         */
        isPrefix?: boolean | null;
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1TextAnnotationDetectedLanguage {
        /**
         * Confidence of detected language. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Additional information detected on the structural component.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty {
        /**
         * Detected start or end of a text segment.
         */
        detectedBreak?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationDetectedLanguage[];
    }
    /**
     * Parameters for text detections. This is used to control TEXT_DETECTION and DOCUMENT_TEXT_DETECTION features.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1TextDetectionParams {
        /**
         * A list of advanced OCR options to further fine-tune OCR behavior. Current valid values are: - `legacy_layout`: a heuristics layout detection algorithm, which serves as an alternative to the current ML-based layout detection algorithm. Customers can choose the best suitable layout algorithm based on their situation.
         */
        advancedOcrOptions?: string[] | null;
        /**
         * By default, Cloud Vision API only includes confidence score for DOCUMENT_TEXT_DETECTION result. Set the flag to true to include confidence score for TEXT_DETECTION as well.
         */
        enableTextDetectionConfidenceScore?: boolean | null;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Relevant information for the image from the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetection {
        /**
         * The service's best guess as to the topic of the request image. Inferred from similar images on the open web.
         */
        bestGuessLabels?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebLabel[];
        /**
         * Fully matching images from the Internet. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage[];
        /**
         * Web pages containing the matching images from the Internet.
         */
        pagesWithMatchingImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebPage[];
        /**
         * Partial matching images from the Internet. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage[];
        /**
         * The visually similar image results.
         */
        visuallySimilarImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage[];
        /**
         * Deduced entities from similar images on the Internet.
         */
        webEntities?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebEntity[];
    }
    /**
     * Parameters for web detection request.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetectionParams {
        /**
         * This field has no effect on results.
         */
        includeGeoResults?: boolean | null;
    }
    /**
     * Entity deduced from similar images on the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetectionWebEntity {
        /**
         * Canonical description of the entity, in English.
         */
        description?: string | null;
        /**
         * Opaque entity ID.
         */
        entityId?: string | null;
        /**
         * Overall relevancy score for the entity. Not normalized and not comparable across different image queries.
         */
        score?: number | null;
    }
    /**
     * Metadata for online images.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage {
        /**
         * (Deprecated) Overall relevancy score for the image.
         */
        score?: number | null;
        /**
         * The result image URL.
         */
        url?: string | null;
    }
    /**
     * Label to provide extra metadata for the web detection.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetectionWebLabel {
        /**
         * Label for extra metadata.
         */
        label?: string | null;
        /**
         * The BCP-47 language code for `label`, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Metadata for web pages.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1WebDetectionWebPage {
        /**
         * Fully matching images on the page. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage[];
        /**
         * Title for the web page, may contain HTML markups.
         */
        pageTitle?: string | null;
        /**
         * Partial matching images on the page. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p1beta1WebDetectionWebImage[];
        /**
         * (Deprecated) Overall relevancy score for the web page.
         */
        score?: number | null;
        /**
         * The result web page URL.
         */
        url?: string | null;
    }
    /**
     * A word representation.
     */
    export interface Schema$GoogleCloudVisionV1p1beta1Word {
        /**
         * The bounding box for the word. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p1beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the word. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the word.
         */
        property?: Schema$GoogleCloudVisionV1p1beta1TextAnnotationTextProperty;
        /**
         * List of symbols in the word. The order of the symbols follows the natural reading order.
         */
        symbols?: Schema$GoogleCloudVisionV1p1beta1Symbol[];
    }
    /**
     * Response to a single file annotation request. A file may contain one or more images, which individually have their own responses.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1AnnotateFileResponse {
        /**
         * If set, represents the error message for the failed request. The `responses` field will not be set in this case.
         */
        error?: Schema$Status;
        /**
         * Information about the file for which this response is generated.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p2beta1InputConfig;
        /**
         * Individual responses to images found within the file. This field will be empty if the `error` field is set.
         */
        responses?: Schema$GoogleCloudVisionV1p2beta1AnnotateImageResponse[];
        /**
         * This field gives the total number of pages in the file.
         */
        totalPages?: number | null;
    }
    /**
     * Response to an image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1AnnotateImageResponse {
        /**
         * If present, contextual information is needed to understand where this image comes from.
         */
        context?: Schema$GoogleCloudVisionV1p2beta1ImageAnnotationContext;
        /**
         * If present, crop hints have completed successfully.
         */
        cropHintsAnnotation?: Schema$GoogleCloudVisionV1p2beta1CropHintsAnnotation;
        /**
         * If set, represents the error message for the operation. Note that filled-in image annotations are guaranteed to be correct, even when `error` is set.
         */
        error?: Schema$Status;
        /**
         * If present, face detection has completed successfully.
         */
        faceAnnotations?: Schema$GoogleCloudVisionV1p2beta1FaceAnnotation[];
        /**
         * If present, text (OCR) detection or document (OCR) text detection has completed successfully. This annotation provides the structural hierarchy for the OCR detected text.
         */
        fullTextAnnotation?: Schema$GoogleCloudVisionV1p2beta1TextAnnotation;
        /**
         * If present, image properties were extracted successfully.
         */
        imagePropertiesAnnotation?: Schema$GoogleCloudVisionV1p2beta1ImageProperties;
        /**
         * If present, label detection has completed successfully.
         */
        labelAnnotations?: Schema$GoogleCloudVisionV1p2beta1EntityAnnotation[];
        /**
         * If present, landmark detection has completed successfully.
         */
        landmarkAnnotations?: Schema$GoogleCloudVisionV1p2beta1EntityAnnotation[];
        /**
         * If present, localized object detection has completed successfully. This will be sorted descending by confidence score.
         */
        localizedObjectAnnotations?: Schema$GoogleCloudVisionV1p2beta1LocalizedObjectAnnotation[];
        /**
         * If present, logo detection has completed successfully.
         */
        logoAnnotations?: Schema$GoogleCloudVisionV1p2beta1EntityAnnotation[];
        /**
         * If present, product search has completed successfully.
         */
        productSearchResults?: Schema$GoogleCloudVisionV1p2beta1ProductSearchResults;
        /**
         * If present, safe-search annotation has completed successfully.
         */
        safeSearchAnnotation?: Schema$GoogleCloudVisionV1p2beta1SafeSearchAnnotation;
        /**
         * If present, text (OCR) detection has completed successfully.
         */
        textAnnotations?: Schema$GoogleCloudVisionV1p2beta1EntityAnnotation[];
        /**
         * If present, web detection has completed successfully.
         */
        webDetection?: Schema$GoogleCloudVisionV1p2beta1WebDetection;
    }
    /**
     * The response for a single offline file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1AsyncAnnotateFileResponse {
        /**
         * The output location and metadata from AsyncAnnotateFileRequest.
         */
        outputConfig?: Schema$GoogleCloudVisionV1p2beta1OutputConfig;
    }
    /**
     * Response to an async batch file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1AsyncBatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, one for each request in AsyncBatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p2beta1AsyncAnnotateFileResponse[];
    }
    /**
     * Logical element on the page.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Block {
        /**
         * Detected block type (text, image etc) for this block.
         */
        blockType?: string | null;
        /**
         * The bounding box for the block. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Confidence of the OCR results on the block. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * List of paragraphs in this block (if this blocks is of type text).
         */
        paragraphs?: Schema$GoogleCloudVisionV1p2beta1Paragraph[];
        /**
         * Additional information detected for the block.
         */
        property?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudVisionV1p2beta1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudVisionV1p2beta1Vertex[];
    }
    /**
     * Color information consists of RGB channels, score, and the fraction of the image that the color occupies in the image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ColorInfo {
        /**
         * RGB components of the color.
         */
        color?: Schema$Color;
        /**
         * The fraction of pixels the color occupies in the image. Value in range [0, 1].
         */
        pixelFraction?: number | null;
        /**
         * Image-specific score for this color. Value in range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Single crop hint that is used to generate a new crop when serving an image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1CropHint {
        /**
         * The bounding polygon for the crop region. The coordinates of the bounding box are in the original image's scale.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Confidence of this being a salient region. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Fraction of importance of this salient region with respect to the original image.
         */
        importanceFraction?: number | null;
    }
    /**
     * Set of crop hints that are used to generate new crops when serving images.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1CropHintsAnnotation {
        /**
         * Crop hint results.
         */
        cropHints?: Schema$GoogleCloudVisionV1p2beta1CropHint[];
    }
    /**
     * Set of dominant colors and their corresponding scores.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1DominantColorsAnnotation {
        /**
         * RGB color values with their score and pixel fraction.
         */
        colors?: Schema$GoogleCloudVisionV1p2beta1ColorInfo[];
    }
    /**
     * Set of detected entity features.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1EntityAnnotation {
        /**
         * Image region to which this entity belongs. Not produced for `LABEL_DETECTION` features.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * **Deprecated. Use `score` instead.** The accuracy of the entity detection in an image. For example, for an image in which the "Eiffel Tower" entity is detected, this field represents the confidence that there is a tower in the query image. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Entity textual description, expressed in its `locale` language.
         */
        description?: string | null;
        /**
         * The language code for the locale in which the entity textual `description` is expressed.
         */
        locale?: string | null;
        /**
         * The location information for the detected entity. Multiple `LocationInfo` elements can be present because one location may indicate the location of the scene in the image, and another location may indicate the location of the place where the image was taken. Location information is usually present for landmarks.
         */
        locations?: Schema$GoogleCloudVisionV1p2beta1LocationInfo[];
        /**
         * Opaque entity ID. Some IDs may be available in [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
         */
        mid?: string | null;
        /**
         * Some entities may have optional user-supplied `Property` (name/value) fields, such a score or string that qualifies the entity.
         */
        properties?: Schema$GoogleCloudVisionV1p2beta1Property[];
        /**
         * Overall score of the result. Range [0, 1].
         */
        score?: number | null;
        /**
         * The relevancy of the ICA (Image Content Annotation) label to the image. For example, the relevancy of "tower" is likely higher to an image containing the detected "Eiffel Tower" than to an image containing a detected distant towering building, even though the confidence that there is a tower in each image may be the same. Range [0, 1].
         */
        topicality?: number | null;
    }
    /**
     * A face annotation object contains the results of face detection.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1FaceAnnotation {
        /**
         * Anger likelihood.
         */
        angerLikelihood?: string | null;
        /**
         * Blurred likelihood.
         */
        blurredLikelihood?: string | null;
        /**
         * The bounding polygon around the face. The coordinates of the bounding box are in the original image's scale. The bounding box is computed to "frame" the face in accordance with human expectations. It is based on the landmarker results. Note that one or more x and/or y coordinates may not be generated in the `BoundingPoly` (the polygon will be unbounded) if only a partial face appears in the image to be annotated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Detection confidence. Range [0, 1].
         */
        detectionConfidence?: number | null;
        /**
         * The `fd_bounding_poly` bounding polygon is tighter than the `boundingPoly`, and encloses only the skin part of the face. Typically, it is used to eliminate the face from any image analysis that detects the "amount of skin" visible in an image. It is not based on the landmarker results, only on the initial face detection, hence the fd (face detection) prefix.
         */
        fdBoundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Headwear likelihood.
         */
        headwearLikelihood?: string | null;
        /**
         * Joy likelihood.
         */
        joyLikelihood?: string | null;
        /**
         * Face landmarking confidence. Range [0, 1].
         */
        landmarkingConfidence?: number | null;
        /**
         * Detected face landmarks.
         */
        landmarks?: Schema$GoogleCloudVisionV1p2beta1FaceAnnotationLandmark[];
        /**
         * Yaw angle, which indicates the leftward/rightward angle that the face is pointing relative to the vertical plane perpendicular to the image. Range [-180,180].
         */
        panAngle?: number | null;
        /**
         * Roll angle, which indicates the amount of clockwise/anti-clockwise rotation of the face relative to the image vertical about the axis perpendicular to the face. Range [-180,180].
         */
        rollAngle?: number | null;
        /**
         * Sorrow likelihood.
         */
        sorrowLikelihood?: string | null;
        /**
         * Surprise likelihood.
         */
        surpriseLikelihood?: string | null;
        /**
         * Pitch angle, which indicates the upwards/downwards angle that the face is pointing relative to the image's horizontal plane. Range [-180,180].
         */
        tiltAngle?: number | null;
        /**
         * Under-exposed likelihood.
         */
        underExposedLikelihood?: string | null;
    }
    /**
     * A face-specific landmark (for example, a face feature). Landmark positions may fall outside the bounds of the image if the face is near one or more edges of the image. Therefore it is NOT guaranteed that `0 <= x < width` or `0 <= y < height`.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1FaceAnnotationLandmark {
        /**
         * Face landmark position.
         */
        position?: Schema$GoogleCloudVisionV1p2beta1Position;
        /**
         * Face landmark type.
         */
        type?: string | null;
    }
    /**
     * The Google Cloud Storage location where the output will be written to.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1GcsDestination {
        /**
         * Google Cloud Storage URI prefix where the results will be stored. Results will be in JSON format and preceded by its corresponding input URI prefix. This field can either represent a gcs file prefix or gcs directory. In either case, the uri should be unique because in order to get all of the output files, you will need to do a wildcard gcs search on the uri prefix you provide. Examples: * File Prefix: gs://bucket-name/here/filenameprefix The output files will be created in gs://bucket-name/here/ and the names of the output files will begin with "filenameprefix". * Directory Prefix: gs://bucket-name/some/location/ The output files will be created in gs://bucket-name/some/location/ and the names of the output files could be anything because there was no filename prefix specified. If multiple outputs, each response is still AnnotateFileResponse, each of which contains some subset of the full list of AnnotateImageResponse. Multiple outputs can happen if, for example, the output JSON is too large and overflows into multiple sharded files.
         */
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input will be read from.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1GcsSource {
        /**
         * Google Cloud Storage URI for the input file. This must only be a Google Cloud Storage object. Wildcards are not currently supported.
         */
        uri?: string | null;
    }
    /**
     * If an image was produced from a file (e.g. a PDF), this message gives information about the source of that image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ImageAnnotationContext {
        /**
         * If the file was a PDF or TIFF, this field gives the page number within the file used to produce the image.
         */
        pageNumber?: number | null;
        /**
         * The URI of the file used to produce the image.
         */
        uri?: string | null;
    }
    /**
     * Stores image properties, such as dominant colors.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ImageProperties {
        /**
         * If present, dominant colors completed successfully.
         */
        dominantColors?: Schema$GoogleCloudVisionV1p2beta1DominantColorsAnnotation;
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1InputConfig {
        /**
         * File content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateFiles requests. It does not work for AsyncBatchAnnotateFiles requests.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage location to read the input from.
         */
        gcsSource?: Schema$GoogleCloudVisionV1p2beta1GcsSource;
        /**
         * The type of the file. Currently only "application/pdf", "image/tiff" and "image/gif" are supported. Wildcards are not supported.
         */
        mimeType?: string | null;
    }
    /**
     * Set of detected objects with bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1LocalizedObjectAnnotation {
        /**
         * Image region to which this object belongs. This must be populated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Detected entity location information.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1LocationInfo {
        /**
         * lat/long location coordinates.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Contains metadata for the BatchAnnotateImages operation.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1OutputConfig {
        /**
         * The max number of response protos to put into each output JSON file on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 response protos will be generated. If `batch_size` = 20, then 5 json files each containing 20 response protos will be written under the prefix `gcs_destination`.`uri`. Currently, batch_size only applies to GcsDestination, with potential future support for other output configurations.
         */
        batchSize?: number | null;
        /**
         * The Google Cloud Storage location to write the output(s) to.
         */
        gcsDestination?: Schema$GoogleCloudVisionV1p2beta1GcsDestination;
    }
    /**
     * Detected page from OCR.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Page {
        /**
         * List of blocks of text, images etc on this page.
         */
        blocks?: Schema$GoogleCloudVisionV1p2beta1Block[];
        /**
         * Confidence of the OCR results on the page. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Page height. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        height?: number | null;
        /**
         * Additional information detected on the page.
         */
        property?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty;
        /**
         * Page width. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        width?: number | null;
    }
    /**
     * Structural unit of text representing a number of words in certain order.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Paragraph {
        /**
         * The bounding box for the paragraph. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the paragraph. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the paragraph.
         */
        property?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty;
        /**
         * List of all words in this paragraph.
         */
        words?: Schema$GoogleCloudVisionV1p2beta1Word[];
    }
    /**
     * A 3D position in the image, used primarily for Face detection landmarks. A valid Position must have both x and y coordinates. The position coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Position {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
        /**
         * Z coordinate (or depth).
         */
        z?: number | null;
    }
    /**
     * A Product contains ReferenceImages.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Product {
        /**
         * User-provided metadata to be stored with this product. Must be at most 4096 characters long.
         */
        description?: string | null;
        /**
         * The user-provided name for this Product. Must not be empty. Must be at most 4096 characters long.
         */
        displayName?: string | null;
        /**
         * The resource name of the product. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID`. This field is ignored when creating a product.
         */
        name?: string | null;
        /**
         * Immutable. The category for the product identified by the reference image. This should be one of "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1" or "general-v1". The legacy categories "homegoods", "apparel", and "toys" are still supported, but these should not be used for new products.
         */
        productCategory?: string | null;
        /**
         * Key-value pairs that can be attached to a product. At query time, constraints can be specified based on the product_labels. Note that integer values can be provided as strings, e.g. "1199". Only strings with integer values can match a range-based restriction which is to be supported soon. Multiple values can be assigned to the same key. One product may have up to 500 product_labels. Notice that the total number of distinct product_labels over all products in one ProductSet cannot exceed 1M, otherwise the product search pipeline will refuse to work for that ProductSet.
         */
        productLabels?: Schema$GoogleCloudVisionV1p2beta1ProductKeyValue[];
    }
    /**
     * A product label represented as a key-value pair.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ProductKeyValue {
        /**
         * The key of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        key?: string | null;
        /**
         * The value of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        value?: string | null;
    }
    /**
     * Results for a product search request.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ProductSearchResults {
        /**
         * Timestamp of the index which provided these results. Products added to the product set and products removed from the product set after this time are not reflected in the current results.
         */
        indexTime?: string | null;
        /**
         * List of results grouped by products detected in the query image. Each entry corresponds to one bounding polygon in the query image, and contains the matching products specific to that region. There may be duplicate product matches in the union of all the per-product results.
         */
        productGroupedResults?: Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsGroupedResult[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsResult[];
    }
    /**
     * Information about the products similar to a single product in a query image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsGroupedResult {
        /**
         * The bounding polygon around the product detected in the query image.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * List of generic predictions for the object in the bounding box.
         */
        objectAnnotations?: Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsObjectAnnotation[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsResult[];
    }
    /**
     * Prediction for what the object in the bounding box is.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsObjectAnnotation {
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Information about a product.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1ProductSearchResultsResult {
        /**
         * The resource name of the image from the product that is the closest match to the query.
         */
        image?: string | null;
        /**
         * The Product.
         */
        product?: Schema$GoogleCloudVisionV1p2beta1Product;
        /**
         * A confidence level on the match, ranging from 0 (no confidence) to 1 (full confidence).
         */
        score?: number | null;
    }
    /**
     * A `Property` consists of a user-supplied name/value pair.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Property {
        /**
         * Name of the property.
         */
        name?: string | null;
        /**
         * Value of numeric properties.
         */
        uint64Value?: string | null;
        /**
         * Value of the property.
         */
        value?: string | null;
    }
    /**
     * Set of features pertaining to the image, computed by computer vision methods over safe-search verticals (for example, adult, spoof, medical, violence).
     */
    export interface Schema$GoogleCloudVisionV1p2beta1SafeSearchAnnotation {
        /**
         * Represents the adult content likelihood for the image. Adult content may contain elements such as nudity, pornographic images or cartoons, or sexual activities.
         */
        adult?: string | null;
        /**
         * Likelihood that this is a medical image.
         */
        medical?: string | null;
        /**
         * Likelihood that the request image contains racy content. Racy content may include (but is not limited to) skimpy or sheer clothing, strategically covered nudity, lewd or provocative poses, or close-ups of sensitive body areas.
         */
        racy?: string | null;
        /**
         * Spoof likelihood. The likelihood that an modification was made to the image's canonical version to make it appear funny or offensive.
         */
        spoof?: string | null;
        /**
         * Likelihood that this image contains violent content. Violent content may include death, serious harm, or injury to individuals or groups of individuals.
         */
        violence?: string | null;
    }
    /**
     * A single symbol representation.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Symbol {
        /**
         * The bounding box for the symbol. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the symbol. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the symbol.
         */
        property?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty;
        /**
         * The actual UTF-8 representation of the symbol.
         */
        text?: string | null;
    }
    /**
     * TextAnnotation contains a structured representation of OCR extracted text. The hierarchy of an OCR extracted text structure is like this: TextAnnotation -\> Page -\> Block -\> Paragraph -\> Word -\> Symbol Each structural component, starting from Page, may further have their own properties. Properties describe detected languages, breaks etc.. Please refer to the TextAnnotation.TextProperty message definition below for more detail.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1TextAnnotation {
        /**
         * List of pages detected by OCR.
         */
        pages?: Schema$GoogleCloudVisionV1p2beta1Page[];
        /**
         * UTF-8 text detected on the pages.
         */
        text?: string | null;
    }
    /**
     * Detected start or end of a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1TextAnnotationDetectedBreak {
        /**
         * True if break prepends the element.
         */
        isPrefix?: boolean | null;
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1TextAnnotationDetectedLanguage {
        /**
         * Confidence of detected language. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Additional information detected on the structural component.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty {
        /**
         * Detected start or end of a text segment.
         */
        detectedBreak?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationDetectedLanguage[];
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Relevant information for the image from the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1WebDetection {
        /**
         * The service's best guess as to the topic of the request image. Inferred from similar images on the open web.
         */
        bestGuessLabels?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebLabel[];
        /**
         * Fully matching images from the Internet. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage[];
        /**
         * Web pages containing the matching images from the Internet.
         */
        pagesWithMatchingImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebPage[];
        /**
         * Partial matching images from the Internet. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage[];
        /**
         * The visually similar image results.
         */
        visuallySimilarImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage[];
        /**
         * Deduced entities from similar images on the Internet.
         */
        webEntities?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebEntity[];
    }
    /**
     * Entity deduced from similar images on the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1WebDetectionWebEntity {
        /**
         * Canonical description of the entity, in English.
         */
        description?: string | null;
        /**
         * Opaque entity ID.
         */
        entityId?: string | null;
        /**
         * Overall relevancy score for the entity. Not normalized and not comparable across different image queries.
         */
        score?: number | null;
    }
    /**
     * Metadata for online images.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage {
        /**
         * (Deprecated) Overall relevancy score for the image.
         */
        score?: number | null;
        /**
         * The result image URL.
         */
        url?: string | null;
    }
    /**
     * Label to provide extra metadata for the web detection.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1WebDetectionWebLabel {
        /**
         * Label for extra metadata.
         */
        label?: string | null;
        /**
         * The BCP-47 language code for `label`, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Metadata for web pages.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1WebDetectionWebPage {
        /**
         * Fully matching images on the page. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage[];
        /**
         * Title for the web page, may contain HTML markups.
         */
        pageTitle?: string | null;
        /**
         * Partial matching images on the page. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p2beta1WebDetectionWebImage[];
        /**
         * (Deprecated) Overall relevancy score for the web page.
         */
        score?: number | null;
        /**
         * The result web page URL.
         */
        url?: string | null;
    }
    /**
     * A word representation.
     */
    export interface Schema$GoogleCloudVisionV1p2beta1Word {
        /**
         * The bounding box for the word. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p2beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the word. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the word.
         */
        property?: Schema$GoogleCloudVisionV1p2beta1TextAnnotationTextProperty;
        /**
         * List of symbols in the word. The order of the symbols follows the natural reading order.
         */
        symbols?: Schema$GoogleCloudVisionV1p2beta1Symbol[];
    }
    /**
     * Response to a single file annotation request. A file may contain one or more images, which individually have their own responses.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1AnnotateFileResponse {
        /**
         * If set, represents the error message for the failed request. The `responses` field will not be set in this case.
         */
        error?: Schema$Status;
        /**
         * Information about the file for which this response is generated.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p3beta1InputConfig;
        /**
         * Individual responses to images found within the file. This field will be empty if the `error` field is set.
         */
        responses?: Schema$GoogleCloudVisionV1p3beta1AnnotateImageResponse[];
        /**
         * This field gives the total number of pages in the file.
         */
        totalPages?: number | null;
    }
    /**
     * Response to an image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1AnnotateImageResponse {
        /**
         * If present, contextual information is needed to understand where this image comes from.
         */
        context?: Schema$GoogleCloudVisionV1p3beta1ImageAnnotationContext;
        /**
         * If present, crop hints have completed successfully.
         */
        cropHintsAnnotation?: Schema$GoogleCloudVisionV1p3beta1CropHintsAnnotation;
        /**
         * If set, represents the error message for the operation. Note that filled-in image annotations are guaranteed to be correct, even when `error` is set.
         */
        error?: Schema$Status;
        /**
         * If present, face detection has completed successfully.
         */
        faceAnnotations?: Schema$GoogleCloudVisionV1p3beta1FaceAnnotation[];
        /**
         * If present, text (OCR) detection or document (OCR) text detection has completed successfully. This annotation provides the structural hierarchy for the OCR detected text.
         */
        fullTextAnnotation?: Schema$GoogleCloudVisionV1p3beta1TextAnnotation;
        /**
         * If present, image properties were extracted successfully.
         */
        imagePropertiesAnnotation?: Schema$GoogleCloudVisionV1p3beta1ImageProperties;
        /**
         * If present, label detection has completed successfully.
         */
        labelAnnotations?: Schema$GoogleCloudVisionV1p3beta1EntityAnnotation[];
        /**
         * If present, landmark detection has completed successfully.
         */
        landmarkAnnotations?: Schema$GoogleCloudVisionV1p3beta1EntityAnnotation[];
        /**
         * If present, localized object detection has completed successfully. This will be sorted descending by confidence score.
         */
        localizedObjectAnnotations?: Schema$GoogleCloudVisionV1p3beta1LocalizedObjectAnnotation[];
        /**
         * If present, logo detection has completed successfully.
         */
        logoAnnotations?: Schema$GoogleCloudVisionV1p3beta1EntityAnnotation[];
        /**
         * If present, product search has completed successfully.
         */
        productSearchResults?: Schema$GoogleCloudVisionV1p3beta1ProductSearchResults;
        /**
         * If present, safe-search annotation has completed successfully.
         */
        safeSearchAnnotation?: Schema$GoogleCloudVisionV1p3beta1SafeSearchAnnotation;
        /**
         * If present, text (OCR) detection has completed successfully.
         */
        textAnnotations?: Schema$GoogleCloudVisionV1p3beta1EntityAnnotation[];
        /**
         * If present, web detection has completed successfully.
         */
        webDetection?: Schema$GoogleCloudVisionV1p3beta1WebDetection;
    }
    /**
     * The response for a single offline file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1AsyncAnnotateFileResponse {
        /**
         * The output location and metadata from AsyncAnnotateFileRequest.
         */
        outputConfig?: Schema$GoogleCloudVisionV1p3beta1OutputConfig;
    }
    /**
     * Response to an async batch file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1AsyncBatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, one for each request in AsyncBatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p3beta1AsyncAnnotateFileResponse[];
    }
    /**
     * Metadata for the batch operations such as the current state. This is included in the `metadata` field of the `Operation` returned by the `GetOperation` call of the `google::longrunning::Operations` service.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1BatchOperationMetadata {
        /**
         * The time when the batch request is finished and google.longrunning.Operation.done is set to true.
         */
        endTime?: string | null;
        /**
         * The current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the batch request was submitted to the server.
         */
        submitTime?: string | null;
    }
    /**
     * Logical element on the page.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Block {
        /**
         * Detected block type (text, image etc) for this block.
         */
        blockType?: string | null;
        /**
         * The bounding box for the block. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Confidence of the OCR results on the block. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * List of paragraphs in this block (if this blocks is of type text).
         */
        paragraphs?: Schema$GoogleCloudVisionV1p3beta1Paragraph[];
        /**
         * Additional information detected for the block.
         */
        property?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudVisionV1p3beta1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudVisionV1p3beta1Vertex[];
    }
    /**
     * Color information consists of RGB channels, score, and the fraction of the image that the color occupies in the image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ColorInfo {
        /**
         * RGB components of the color.
         */
        color?: Schema$Color;
        /**
         * The fraction of pixels the color occupies in the image. Value in range [0, 1].
         */
        pixelFraction?: number | null;
        /**
         * Image-specific score for this color. Value in range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Single crop hint that is used to generate a new crop when serving an image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1CropHint {
        /**
         * The bounding polygon for the crop region. The coordinates of the bounding box are in the original image's scale.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Confidence of this being a salient region. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Fraction of importance of this salient region with respect to the original image.
         */
        importanceFraction?: number | null;
    }
    /**
     * Set of crop hints that are used to generate new crops when serving images.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1CropHintsAnnotation {
        /**
         * Crop hint results.
         */
        cropHints?: Schema$GoogleCloudVisionV1p3beta1CropHint[];
    }
    /**
     * Set of dominant colors and their corresponding scores.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1DominantColorsAnnotation {
        /**
         * RGB color values with their score and pixel fraction.
         */
        colors?: Schema$GoogleCloudVisionV1p3beta1ColorInfo[];
    }
    /**
     * Set of detected entity features.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1EntityAnnotation {
        /**
         * Image region to which this entity belongs. Not produced for `LABEL_DETECTION` features.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * **Deprecated. Use `score` instead.** The accuracy of the entity detection in an image. For example, for an image in which the "Eiffel Tower" entity is detected, this field represents the confidence that there is a tower in the query image. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Entity textual description, expressed in its `locale` language.
         */
        description?: string | null;
        /**
         * The language code for the locale in which the entity textual `description` is expressed.
         */
        locale?: string | null;
        /**
         * The location information for the detected entity. Multiple `LocationInfo` elements can be present because one location may indicate the location of the scene in the image, and another location may indicate the location of the place where the image was taken. Location information is usually present for landmarks.
         */
        locations?: Schema$GoogleCloudVisionV1p3beta1LocationInfo[];
        /**
         * Opaque entity ID. Some IDs may be available in [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
         */
        mid?: string | null;
        /**
         * Some entities may have optional user-supplied `Property` (name/value) fields, such a score or string that qualifies the entity.
         */
        properties?: Schema$GoogleCloudVisionV1p3beta1Property[];
        /**
         * Overall score of the result. Range [0, 1].
         */
        score?: number | null;
        /**
         * The relevancy of the ICA (Image Content Annotation) label to the image. For example, the relevancy of "tower" is likely higher to an image containing the detected "Eiffel Tower" than to an image containing a detected distant towering building, even though the confidence that there is a tower in each image may be the same. Range [0, 1].
         */
        topicality?: number | null;
    }
    /**
     * A face annotation object contains the results of face detection.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1FaceAnnotation {
        /**
         * Anger likelihood.
         */
        angerLikelihood?: string | null;
        /**
         * Blurred likelihood.
         */
        blurredLikelihood?: string | null;
        /**
         * The bounding polygon around the face. The coordinates of the bounding box are in the original image's scale. The bounding box is computed to "frame" the face in accordance with human expectations. It is based on the landmarker results. Note that one or more x and/or y coordinates may not be generated in the `BoundingPoly` (the polygon will be unbounded) if only a partial face appears in the image to be annotated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Detection confidence. Range [0, 1].
         */
        detectionConfidence?: number | null;
        /**
         * The `fd_bounding_poly` bounding polygon is tighter than the `boundingPoly`, and encloses only the skin part of the face. Typically, it is used to eliminate the face from any image analysis that detects the "amount of skin" visible in an image. It is not based on the landmarker results, only on the initial face detection, hence the fd (face detection) prefix.
         */
        fdBoundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Headwear likelihood.
         */
        headwearLikelihood?: string | null;
        /**
         * Joy likelihood.
         */
        joyLikelihood?: string | null;
        /**
         * Face landmarking confidence. Range [0, 1].
         */
        landmarkingConfidence?: number | null;
        /**
         * Detected face landmarks.
         */
        landmarks?: Schema$GoogleCloudVisionV1p3beta1FaceAnnotationLandmark[];
        /**
         * Yaw angle, which indicates the leftward/rightward angle that the face is pointing relative to the vertical plane perpendicular to the image. Range [-180,180].
         */
        panAngle?: number | null;
        /**
         * Roll angle, which indicates the amount of clockwise/anti-clockwise rotation of the face relative to the image vertical about the axis perpendicular to the face. Range [-180,180].
         */
        rollAngle?: number | null;
        /**
         * Sorrow likelihood.
         */
        sorrowLikelihood?: string | null;
        /**
         * Surprise likelihood.
         */
        surpriseLikelihood?: string | null;
        /**
         * Pitch angle, which indicates the upwards/downwards angle that the face is pointing relative to the image's horizontal plane. Range [-180,180].
         */
        tiltAngle?: number | null;
        /**
         * Under-exposed likelihood.
         */
        underExposedLikelihood?: string | null;
    }
    /**
     * A face-specific landmark (for example, a face feature). Landmark positions may fall outside the bounds of the image if the face is near one or more edges of the image. Therefore it is NOT guaranteed that `0 <= x < width` or `0 <= y < height`.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1FaceAnnotationLandmark {
        /**
         * Face landmark position.
         */
        position?: Schema$GoogleCloudVisionV1p3beta1Position;
        /**
         * Face landmark type.
         */
        type?: string | null;
    }
    /**
     * The Google Cloud Storage location where the output will be written to.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1GcsDestination {
        /**
         * Google Cloud Storage URI prefix where the results will be stored. Results will be in JSON format and preceded by its corresponding input URI prefix. This field can either represent a gcs file prefix or gcs directory. In either case, the uri should be unique because in order to get all of the output files, you will need to do a wildcard gcs search on the uri prefix you provide. Examples: * File Prefix: gs://bucket-name/here/filenameprefix The output files will be created in gs://bucket-name/here/ and the names of the output files will begin with "filenameprefix". * Directory Prefix: gs://bucket-name/some/location/ The output files will be created in gs://bucket-name/some/location/ and the names of the output files could be anything because there was no filename prefix specified. If multiple outputs, each response is still AnnotateFileResponse, each of which contains some subset of the full list of AnnotateImageResponse. Multiple outputs can happen if, for example, the output JSON is too large and overflows into multiple sharded files.
         */
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input will be read from.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1GcsSource {
        /**
         * Google Cloud Storage URI for the input file. This must only be a Google Cloud Storage object. Wildcards are not currently supported.
         */
        uri?: string | null;
    }
    /**
     * If an image was produced from a file (e.g. a PDF), this message gives information about the source of that image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ImageAnnotationContext {
        /**
         * If the file was a PDF or TIFF, this field gives the page number within the file used to produce the image.
         */
        pageNumber?: number | null;
        /**
         * The URI of the file used to produce the image.
         */
        uri?: string | null;
    }
    /**
     * Stores image properties, such as dominant colors.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ImageProperties {
        /**
         * If present, dominant colors completed successfully.
         */
        dominantColors?: Schema$GoogleCloudVisionV1p3beta1DominantColorsAnnotation;
    }
    /**
     * Response message for the `ImportProductSets` method. This message is returned by the google.longrunning.Operations.GetOperation method in the returned google.longrunning.Operation.response field.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ImportProductSetsResponse {
        /**
         * The list of reference_images that are imported successfully.
         */
        referenceImages?: Schema$GoogleCloudVisionV1p3beta1ReferenceImage[];
        /**
         * The rpc status for each ImportProductSet request, including both successes and errors. The number of statuses here matches the number of lines in the csv file, and statuses[i] stores the success or failure status of processing the i-th line of the csv, starting from line 0.
         */
        statuses?: Schema$Status[];
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1InputConfig {
        /**
         * File content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateFiles requests. It does not work for AsyncBatchAnnotateFiles requests.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage location to read the input from.
         */
        gcsSource?: Schema$GoogleCloudVisionV1p3beta1GcsSource;
        /**
         * The type of the file. Currently only "application/pdf", "image/tiff" and "image/gif" are supported. Wildcards are not supported.
         */
        mimeType?: string | null;
    }
    /**
     * Set of detected objects with bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1LocalizedObjectAnnotation {
        /**
         * Image region to which this object belongs. This must be populated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Detected entity location information.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1LocationInfo {
        /**
         * lat/long location coordinates.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Contains metadata for the BatchAnnotateImages operation.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1OutputConfig {
        /**
         * The max number of response protos to put into each output JSON file on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 response protos will be generated. If `batch_size` = 20, then 5 json files each containing 20 response protos will be written under the prefix `gcs_destination`.`uri`. Currently, batch_size only applies to GcsDestination, with potential future support for other output configurations.
         */
        batchSize?: number | null;
        /**
         * The Google Cloud Storage location to write the output(s) to.
         */
        gcsDestination?: Schema$GoogleCloudVisionV1p3beta1GcsDestination;
    }
    /**
     * Detected page from OCR.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Page {
        /**
         * List of blocks of text, images etc on this page.
         */
        blocks?: Schema$GoogleCloudVisionV1p3beta1Block[];
        /**
         * Confidence of the OCR results on the page. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Page height. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        height?: number | null;
        /**
         * Additional information detected on the page.
         */
        property?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty;
        /**
         * Page width. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        width?: number | null;
    }
    /**
     * Structural unit of text representing a number of words in certain order.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Paragraph {
        /**
         * The bounding box for the paragraph. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the paragraph. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the paragraph.
         */
        property?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty;
        /**
         * List of all words in this paragraph.
         */
        words?: Schema$GoogleCloudVisionV1p3beta1Word[];
    }
    /**
     * A 3D position in the image, used primarily for Face detection landmarks. A valid Position must have both x and y coordinates. The position coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Position {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
        /**
         * Z coordinate (or depth).
         */
        z?: number | null;
    }
    /**
     * A Product contains ReferenceImages.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Product {
        /**
         * User-provided metadata to be stored with this product. Must be at most 4096 characters long.
         */
        description?: string | null;
        /**
         * The user-provided name for this Product. Must not be empty. Must be at most 4096 characters long.
         */
        displayName?: string | null;
        /**
         * The resource name of the product. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID`. This field is ignored when creating a product.
         */
        name?: string | null;
        /**
         * Immutable. The category for the product identified by the reference image. This should be one of "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1" or "general-v1". The legacy categories "homegoods", "apparel", and "toys" are still supported, but these should not be used for new products.
         */
        productCategory?: string | null;
        /**
         * Key-value pairs that can be attached to a product. At query time, constraints can be specified based on the product_labels. Note that integer values can be provided as strings, e.g. "1199". Only strings with integer values can match a range-based restriction which is to be supported soon. Multiple values can be assigned to the same key. One product may have up to 500 product_labels. Notice that the total number of distinct product_labels over all products in one ProductSet cannot exceed 1M, otherwise the product search pipeline will refuse to work for that ProductSet.
         */
        productLabels?: Schema$GoogleCloudVisionV1p3beta1ProductKeyValue[];
    }
    /**
     * A product label represented as a key-value pair.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ProductKeyValue {
        /**
         * The key of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        key?: string | null;
        /**
         * The value of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        value?: string | null;
    }
    /**
     * Results for a product search request.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ProductSearchResults {
        /**
         * Timestamp of the index which provided these results. Products added to the product set and products removed from the product set after this time are not reflected in the current results.
         */
        indexTime?: string | null;
        /**
         * List of results grouped by products detected in the query image. Each entry corresponds to one bounding polygon in the query image, and contains the matching products specific to that region. There may be duplicate product matches in the union of all the per-product results.
         */
        productGroupedResults?: Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsGroupedResult[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsResult[];
    }
    /**
     * Information about the products similar to a single product in a query image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsGroupedResult {
        /**
         * The bounding polygon around the product detected in the query image.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * List of generic predictions for the object in the bounding box.
         */
        objectAnnotations?: Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsObjectAnnotation[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsResult[];
    }
    /**
     * Prediction for what the object in the bounding box is.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsObjectAnnotation {
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Information about a product.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ProductSearchResultsResult {
        /**
         * The resource name of the image from the product that is the closest match to the query.
         */
        image?: string | null;
        /**
         * The Product.
         */
        product?: Schema$GoogleCloudVisionV1p3beta1Product;
        /**
         * A confidence level on the match, ranging from 0 (no confidence) to 1 (full confidence).
         */
        score?: number | null;
    }
    /**
     * A `Property` consists of a user-supplied name/value pair.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Property {
        /**
         * Name of the property.
         */
        name?: string | null;
        /**
         * Value of numeric properties.
         */
        uint64Value?: string | null;
        /**
         * Value of the property.
         */
        value?: string | null;
    }
    /**
     * A `ReferenceImage` represents a product image and its associated metadata, such as bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1ReferenceImage {
        /**
         * Optional. Bounding polygons around the areas of interest in the reference image. If this field is empty, the system will try to detect regions of interest. At most 10 bounding polygons will be used. The provided shape is converted into a non-rotated rectangle. Once converted, the small edge of the rectangle must be greater than or equal to 300 pixels. The aspect ratio must be 1:4 or less (i.e. 1:3 is ok; 1:5 is not).
         */
        boundingPolys?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly[];
        /**
         * The resource name of the reference image. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID/referenceImages/IMAGE_ID`. This field is ignored when creating a reference image.
         */
        name?: string | null;
        /**
         * Required. The Google Cloud Storage URI of the reference image. The URI must start with `gs://`.
         */
        uri?: string | null;
    }
    /**
     * Set of features pertaining to the image, computed by computer vision methods over safe-search verticals (for example, adult, spoof, medical, violence).
     */
    export interface Schema$GoogleCloudVisionV1p3beta1SafeSearchAnnotation {
        /**
         * Represents the adult content likelihood for the image. Adult content may contain elements such as nudity, pornographic images or cartoons, or sexual activities.
         */
        adult?: string | null;
        /**
         * Likelihood that this is a medical image.
         */
        medical?: string | null;
        /**
         * Likelihood that the request image contains racy content. Racy content may include (but is not limited to) skimpy or sheer clothing, strategically covered nudity, lewd or provocative poses, or close-ups of sensitive body areas.
         */
        racy?: string | null;
        /**
         * Spoof likelihood. The likelihood that an modification was made to the image's canonical version to make it appear funny or offensive.
         */
        spoof?: string | null;
        /**
         * Likelihood that this image contains violent content. Violent content may include death, serious harm, or injury to individuals or groups of individuals.
         */
        violence?: string | null;
    }
    /**
     * A single symbol representation.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Symbol {
        /**
         * The bounding box for the symbol. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the symbol. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the symbol.
         */
        property?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty;
        /**
         * The actual UTF-8 representation of the symbol.
         */
        text?: string | null;
    }
    /**
     * TextAnnotation contains a structured representation of OCR extracted text. The hierarchy of an OCR extracted text structure is like this: TextAnnotation -\> Page -\> Block -\> Paragraph -\> Word -\> Symbol Each structural component, starting from Page, may further have their own properties. Properties describe detected languages, breaks etc.. Please refer to the TextAnnotation.TextProperty message definition below for more detail.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1TextAnnotation {
        /**
         * List of pages detected by OCR.
         */
        pages?: Schema$GoogleCloudVisionV1p3beta1Page[];
        /**
         * UTF-8 text detected on the pages.
         */
        text?: string | null;
    }
    /**
     * Detected start or end of a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1TextAnnotationDetectedBreak {
        /**
         * True if break prepends the element.
         */
        isPrefix?: boolean | null;
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1TextAnnotationDetectedLanguage {
        /**
         * Confidence of detected language. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Additional information detected on the structural component.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty {
        /**
         * Detected start or end of a text segment.
         */
        detectedBreak?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationDetectedLanguage[];
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Relevant information for the image from the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1WebDetection {
        /**
         * The service's best guess as to the topic of the request image. Inferred from similar images on the open web.
         */
        bestGuessLabels?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebLabel[];
        /**
         * Fully matching images from the Internet. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage[];
        /**
         * Web pages containing the matching images from the Internet.
         */
        pagesWithMatchingImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebPage[];
        /**
         * Partial matching images from the Internet. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage[];
        /**
         * The visually similar image results.
         */
        visuallySimilarImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage[];
        /**
         * Deduced entities from similar images on the Internet.
         */
        webEntities?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebEntity[];
    }
    /**
     * Entity deduced from similar images on the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1WebDetectionWebEntity {
        /**
         * Canonical description of the entity, in English.
         */
        description?: string | null;
        /**
         * Opaque entity ID.
         */
        entityId?: string | null;
        /**
         * Overall relevancy score for the entity. Not normalized and not comparable across different image queries.
         */
        score?: number | null;
    }
    /**
     * Metadata for online images.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage {
        /**
         * (Deprecated) Overall relevancy score for the image.
         */
        score?: number | null;
        /**
         * The result image URL.
         */
        url?: string | null;
    }
    /**
     * Label to provide extra metadata for the web detection.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1WebDetectionWebLabel {
        /**
         * Label for extra metadata.
         */
        label?: string | null;
        /**
         * The BCP-47 language code for `label`, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Metadata for web pages.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1WebDetectionWebPage {
        /**
         * Fully matching images on the page. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage[];
        /**
         * Title for the web page, may contain HTML markups.
         */
        pageTitle?: string | null;
        /**
         * Partial matching images on the page. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p3beta1WebDetectionWebImage[];
        /**
         * (Deprecated) Overall relevancy score for the web page.
         */
        score?: number | null;
        /**
         * The result web page URL.
         */
        url?: string | null;
    }
    /**
     * A word representation.
     */
    export interface Schema$GoogleCloudVisionV1p3beta1Word {
        /**
         * The bounding box for the word. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p3beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the word. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the word.
         */
        property?: Schema$GoogleCloudVisionV1p3beta1TextAnnotationTextProperty;
        /**
         * List of symbols in the word. The order of the symbols follows the natural reading order.
         */
        symbols?: Schema$GoogleCloudVisionV1p3beta1Symbol[];
    }
    /**
     * Response to a single file annotation request. A file may contain one or more images, which individually have their own responses.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1AnnotateFileResponse {
        /**
         * If set, represents the error message for the failed request. The `responses` field will not be set in this case.
         */
        error?: Schema$Status;
        /**
         * Information about the file for which this response is generated.
         */
        inputConfig?: Schema$GoogleCloudVisionV1p4beta1InputConfig;
        /**
         * Individual responses to images found within the file. This field will be empty if the `error` field is set.
         */
        responses?: Schema$GoogleCloudVisionV1p4beta1AnnotateImageResponse[];
        /**
         * This field gives the total number of pages in the file.
         */
        totalPages?: number | null;
    }
    /**
     * Response to an image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1AnnotateImageResponse {
        /**
         * If present, contextual information is needed to understand where this image comes from.
         */
        context?: Schema$GoogleCloudVisionV1p4beta1ImageAnnotationContext;
        /**
         * If present, crop hints have completed successfully.
         */
        cropHintsAnnotation?: Schema$GoogleCloudVisionV1p4beta1CropHintsAnnotation;
        /**
         * If set, represents the error message for the operation. Note that filled-in image annotations are guaranteed to be correct, even when `error` is set.
         */
        error?: Schema$Status;
        /**
         * If present, face detection has completed successfully.
         */
        faceAnnotations?: Schema$GoogleCloudVisionV1p4beta1FaceAnnotation[];
        /**
         * If present, text (OCR) detection or document (OCR) text detection has completed successfully. This annotation provides the structural hierarchy for the OCR detected text.
         */
        fullTextAnnotation?: Schema$GoogleCloudVisionV1p4beta1TextAnnotation;
        /**
         * If present, image properties were extracted successfully.
         */
        imagePropertiesAnnotation?: Schema$GoogleCloudVisionV1p4beta1ImageProperties;
        /**
         * If present, label detection has completed successfully.
         */
        labelAnnotations?: Schema$GoogleCloudVisionV1p4beta1EntityAnnotation[];
        /**
         * If present, landmark detection has completed successfully.
         */
        landmarkAnnotations?: Schema$GoogleCloudVisionV1p4beta1EntityAnnotation[];
        /**
         * If present, localized object detection has completed successfully. This will be sorted descending by confidence score.
         */
        localizedObjectAnnotations?: Schema$GoogleCloudVisionV1p4beta1LocalizedObjectAnnotation[];
        /**
         * If present, logo detection has completed successfully.
         */
        logoAnnotations?: Schema$GoogleCloudVisionV1p4beta1EntityAnnotation[];
        /**
         * If present, product search has completed successfully.
         */
        productSearchResults?: Schema$GoogleCloudVisionV1p4beta1ProductSearchResults;
        /**
         * If present, safe-search annotation has completed successfully.
         */
        safeSearchAnnotation?: Schema$GoogleCloudVisionV1p4beta1SafeSearchAnnotation;
        /**
         * If present, text (OCR) detection has completed successfully.
         */
        textAnnotations?: Schema$GoogleCloudVisionV1p4beta1EntityAnnotation[];
        /**
         * If present, web detection has completed successfully.
         */
        webDetection?: Schema$GoogleCloudVisionV1p4beta1WebDetection;
    }
    /**
     * The response for a single offline file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1AsyncAnnotateFileResponse {
        /**
         * The output location and metadata from AsyncAnnotateFileRequest.
         */
        outputConfig?: Schema$GoogleCloudVisionV1p4beta1OutputConfig;
    }
    /**
     * Response to an async batch file annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1AsyncBatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, one for each request in AsyncBatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p4beta1AsyncAnnotateFileResponse[];
    }
    /**
     * Response to an async batch image annotation request.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1AsyncBatchAnnotateImagesResponse {
        /**
         * The output location and metadata from AsyncBatchAnnotateImagesRequest.
         */
        outputConfig?: Schema$GoogleCloudVisionV1p4beta1OutputConfig;
    }
    /**
     * A list of file annotation responses.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1BatchAnnotateFilesResponse {
        /**
         * The list of file annotation responses, each response corresponding to each AnnotateFileRequest in BatchAnnotateFilesRequest.
         */
        responses?: Schema$GoogleCloudVisionV1p4beta1AnnotateFileResponse[];
    }
    /**
     * Metadata for the batch operations such as the current state. This is included in the `metadata` field of the `Operation` returned by the `GetOperation` call of the `google::longrunning::Operations` service.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1BatchOperationMetadata {
        /**
         * The time when the batch request is finished and google.longrunning.Operation.done is set to true.
         */
        endTime?: string | null;
        /**
         * The current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the batch request was submitted to the server.
         */
        submitTime?: string | null;
    }
    /**
     * Logical element on the page.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Block {
        /**
         * Detected block type (text, image etc) for this block.
         */
        blockType?: string | null;
        /**
         * The bounding box for the block. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Confidence of the OCR results on the block. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * List of paragraphs in this block (if this blocks is of type text).
         */
        paragraphs?: Schema$GoogleCloudVisionV1p4beta1Paragraph[];
        /**
         * Additional information detected for the block.
         */
        property?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty;
    }
    /**
     * A bounding polygon for the detected image annotation.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1BoundingPoly {
        /**
         * The bounding polygon normalized vertices.
         */
        normalizedVertices?: Schema$GoogleCloudVisionV1p4beta1NormalizedVertex[];
        /**
         * The bounding polygon vertices.
         */
        vertices?: Schema$GoogleCloudVisionV1p4beta1Vertex[];
    }
    /**
     * A Celebrity is a group of Faces with an identity.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Celebrity {
        /**
         * The Celebrity's description.
         */
        description?: string | null;
        /**
         * The Celebrity's display name.
         */
        displayName?: string | null;
        /**
         * The resource name of the preloaded Celebrity. Has the format `builtin/{mid\}`.
         */
        name?: string | null;
    }
    /**
     * Color information consists of RGB channels, score, and the fraction of the image that the color occupies in the image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ColorInfo {
        /**
         * RGB components of the color.
         */
        color?: Schema$Color;
        /**
         * The fraction of pixels the color occupies in the image. Value in range [0, 1].
         */
        pixelFraction?: number | null;
        /**
         * Image-specific score for this color. Value in range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Single crop hint that is used to generate a new crop when serving an image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1CropHint {
        /**
         * The bounding polygon for the crop region. The coordinates of the bounding box are in the original image's scale.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Confidence of this being a salient region. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Fraction of importance of this salient region with respect to the original image.
         */
        importanceFraction?: number | null;
    }
    /**
     * Set of crop hints that are used to generate new crops when serving images.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1CropHintsAnnotation {
        /**
         * Crop hint results.
         */
        cropHints?: Schema$GoogleCloudVisionV1p4beta1CropHint[];
    }
    /**
     * Set of dominant colors and their corresponding scores.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1DominantColorsAnnotation {
        /**
         * RGB color values with their score and pixel fraction.
         */
        colors?: Schema$GoogleCloudVisionV1p4beta1ColorInfo[];
    }
    /**
     * Set of detected entity features.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1EntityAnnotation {
        /**
         * Image region to which this entity belongs. Not produced for `LABEL_DETECTION` features.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * **Deprecated. Use `score` instead.** The accuracy of the entity detection in an image. For example, for an image in which the "Eiffel Tower" entity is detected, this field represents the confidence that there is a tower in the query image. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Entity textual description, expressed in its `locale` language.
         */
        description?: string | null;
        /**
         * The language code for the locale in which the entity textual `description` is expressed.
         */
        locale?: string | null;
        /**
         * The location information for the detected entity. Multiple `LocationInfo` elements can be present because one location may indicate the location of the scene in the image, and another location may indicate the location of the place where the image was taken. Location information is usually present for landmarks.
         */
        locations?: Schema$GoogleCloudVisionV1p4beta1LocationInfo[];
        /**
         * Opaque entity ID. Some IDs may be available in [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
         */
        mid?: string | null;
        /**
         * Some entities may have optional user-supplied `Property` (name/value) fields, such a score or string that qualifies the entity.
         */
        properties?: Schema$GoogleCloudVisionV1p4beta1Property[];
        /**
         * Overall score of the result. Range [0, 1].
         */
        score?: number | null;
        /**
         * The relevancy of the ICA (Image Content Annotation) label to the image. For example, the relevancy of "tower" is likely higher to an image containing the detected "Eiffel Tower" than to an image containing a detected distant towering building, even though the confidence that there is a tower in each image may be the same. Range [0, 1].
         */
        topicality?: number | null;
    }
    /**
     * A face annotation object contains the results of face detection.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1FaceAnnotation {
        /**
         * Anger likelihood.
         */
        angerLikelihood?: string | null;
        /**
         * Blurred likelihood.
         */
        blurredLikelihood?: string | null;
        /**
         * The bounding polygon around the face. The coordinates of the bounding box are in the original image's scale. The bounding box is computed to "frame" the face in accordance with human expectations. It is based on the landmarker results. Note that one or more x and/or y coordinates may not be generated in the `BoundingPoly` (the polygon will be unbounded) if only a partial face appears in the image to be annotated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Detection confidence. Range [0, 1].
         */
        detectionConfidence?: number | null;
        /**
         * The `fd_bounding_poly` bounding polygon is tighter than the `boundingPoly`, and encloses only the skin part of the face. Typically, it is used to eliminate the face from any image analysis that detects the "amount of skin" visible in an image. It is not based on the landmarker results, only on the initial face detection, hence the fd (face detection) prefix.
         */
        fdBoundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Headwear likelihood.
         */
        headwearLikelihood?: string | null;
        /**
         * Joy likelihood.
         */
        joyLikelihood?: string | null;
        /**
         * Face landmarking confidence. Range [0, 1].
         */
        landmarkingConfidence?: number | null;
        /**
         * Detected face landmarks.
         */
        landmarks?: Schema$GoogleCloudVisionV1p4beta1FaceAnnotationLandmark[];
        /**
         * Yaw angle, which indicates the leftward/rightward angle that the face is pointing relative to the vertical plane perpendicular to the image. Range [-180,180].
         */
        panAngle?: number | null;
        /**
         * Additional recognition information. Only computed if image_context.face_recognition_params is provided, **and** a match is found to a Celebrity in the input CelebritySet. This field is sorted in order of decreasing confidence values.
         */
        recognitionResult?: Schema$GoogleCloudVisionV1p4beta1FaceRecognitionResult[];
        /**
         * Roll angle, which indicates the amount of clockwise/anti-clockwise rotation of the face relative to the image vertical about the axis perpendicular to the face. Range [-180,180].
         */
        rollAngle?: number | null;
        /**
         * Sorrow likelihood.
         */
        sorrowLikelihood?: string | null;
        /**
         * Surprise likelihood.
         */
        surpriseLikelihood?: string | null;
        /**
         * Pitch angle, which indicates the upwards/downwards angle that the face is pointing relative to the image's horizontal plane. Range [-180,180].
         */
        tiltAngle?: number | null;
        /**
         * Under-exposed likelihood.
         */
        underExposedLikelihood?: string | null;
    }
    /**
     * A face-specific landmark (for example, a face feature). Landmark positions may fall outside the bounds of the image if the face is near one or more edges of the image. Therefore it is NOT guaranteed that `0 <= x < width` or `0 <= y < height`.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1FaceAnnotationLandmark {
        /**
         * Face landmark position.
         */
        position?: Schema$GoogleCloudVisionV1p4beta1Position;
        /**
         * Face landmark type.
         */
        type?: string | null;
    }
    /**
     * Information about a face's identity.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1FaceRecognitionResult {
        /**
         * The Celebrity that this face was matched to.
         */
        celebrity?: Schema$GoogleCloudVisionV1p4beta1Celebrity;
        /**
         * Recognition confidence. Range [0, 1].
         */
        confidence?: number | null;
    }
    /**
     * The Google Cloud Storage location where the output will be written to.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1GcsDestination {
        /**
         * Google Cloud Storage URI prefix where the results will be stored. Results will be in JSON format and preceded by its corresponding input URI prefix. This field can either represent a gcs file prefix or gcs directory. In either case, the uri should be unique because in order to get all of the output files, you will need to do a wildcard gcs search on the uri prefix you provide. Examples: * File Prefix: gs://bucket-name/here/filenameprefix The output files will be created in gs://bucket-name/here/ and the names of the output files will begin with "filenameprefix". * Directory Prefix: gs://bucket-name/some/location/ The output files will be created in gs://bucket-name/some/location/ and the names of the output files could be anything because there was no filename prefix specified. If multiple outputs, each response is still AnnotateFileResponse, each of which contains some subset of the full list of AnnotateImageResponse. Multiple outputs can happen if, for example, the output JSON is too large and overflows into multiple sharded files.
         */
        uri?: string | null;
    }
    /**
     * The Google Cloud Storage location where the input will be read from.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1GcsSource {
        /**
         * Google Cloud Storage URI for the input file. This must only be a Google Cloud Storage object. Wildcards are not currently supported.
         */
        uri?: string | null;
    }
    /**
     * If an image was produced from a file (e.g. a PDF), this message gives information about the source of that image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ImageAnnotationContext {
        /**
         * If the file was a PDF or TIFF, this field gives the page number within the file used to produce the image.
         */
        pageNumber?: number | null;
        /**
         * The URI of the file used to produce the image.
         */
        uri?: string | null;
    }
    /**
     * Stores image properties, such as dominant colors.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ImageProperties {
        /**
         * If present, dominant colors completed successfully.
         */
        dominantColors?: Schema$GoogleCloudVisionV1p4beta1DominantColorsAnnotation;
    }
    /**
     * Response message for the `ImportProductSets` method. This message is returned by the google.longrunning.Operations.GetOperation method in the returned google.longrunning.Operation.response field.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ImportProductSetsResponse {
        /**
         * The list of reference_images that are imported successfully.
         */
        referenceImages?: Schema$GoogleCloudVisionV1p4beta1ReferenceImage[];
        /**
         * The rpc status for each ImportProductSet request, including both successes and errors. The number of statuses here matches the number of lines in the csv file, and statuses[i] stores the success or failure status of processing the i-th line of the csv, starting from line 0.
         */
        statuses?: Schema$Status[];
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1InputConfig {
        /**
         * File content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateFiles requests. It does not work for AsyncBatchAnnotateFiles requests.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage location to read the input from.
         */
        gcsSource?: Schema$GoogleCloudVisionV1p4beta1GcsSource;
        /**
         * The type of the file. Currently only "application/pdf", "image/tiff" and "image/gif" are supported. Wildcards are not supported.
         */
        mimeType?: string | null;
    }
    /**
     * Set of detected objects with bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1LocalizedObjectAnnotation {
        /**
         * Image region to which this object belongs. This must be populated.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Detected entity location information.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1LocationInfo {
        /**
         * lat/long location coordinates.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Contains metadata for the BatchAnnotateImages operation.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1OutputConfig {
        /**
         * The max number of response protos to put into each output JSON file on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 response protos will be generated. If `batch_size` = 20, then 5 json files each containing 20 response protos will be written under the prefix `gcs_destination`.`uri`. Currently, batch_size only applies to GcsDestination, with potential future support for other output configurations.
         */
        batchSize?: number | null;
        /**
         * The Google Cloud Storage location to write the output(s) to.
         */
        gcsDestination?: Schema$GoogleCloudVisionV1p4beta1GcsDestination;
    }
    /**
     * Detected page from OCR.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Page {
        /**
         * List of blocks of text, images etc on this page.
         */
        blocks?: Schema$GoogleCloudVisionV1p4beta1Block[];
        /**
         * Confidence of the OCR results on the page. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Page height. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        height?: number | null;
        /**
         * Additional information detected on the page.
         */
        property?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty;
        /**
         * Page width. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        width?: number | null;
    }
    /**
     * Structural unit of text representing a number of words in certain order.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Paragraph {
        /**
         * The bounding box for the paragraph. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the paragraph. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the paragraph.
         */
        property?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty;
        /**
         * List of all words in this paragraph.
         */
        words?: Schema$GoogleCloudVisionV1p4beta1Word[];
    }
    /**
     * A 3D position in the image, used primarily for Face detection landmarks. A valid Position must have both x and y coordinates. The position coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Position {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
        /**
         * Z coordinate (or depth).
         */
        z?: number | null;
    }
    /**
     * A Product contains ReferenceImages.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Product {
        /**
         * User-provided metadata to be stored with this product. Must be at most 4096 characters long.
         */
        description?: string | null;
        /**
         * The user-provided name for this Product. Must not be empty. Must be at most 4096 characters long.
         */
        displayName?: string | null;
        /**
         * The resource name of the product. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID`. This field is ignored when creating a product.
         */
        name?: string | null;
        /**
         * Immutable. The category for the product identified by the reference image. This should be one of "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1" or "general-v1". The legacy categories "homegoods", "apparel", and "toys" are still supported, but these should not be used for new products.
         */
        productCategory?: string | null;
        /**
         * Key-value pairs that can be attached to a product. At query time, constraints can be specified based on the product_labels. Note that integer values can be provided as strings, e.g. "1199". Only strings with integer values can match a range-based restriction which is to be supported soon. Multiple values can be assigned to the same key. One product may have up to 500 product_labels. Notice that the total number of distinct product_labels over all products in one ProductSet cannot exceed 1M, otherwise the product search pipeline will refuse to work for that ProductSet.
         */
        productLabels?: Schema$GoogleCloudVisionV1p4beta1ProductKeyValue[];
    }
    /**
     * A product label represented as a key-value pair.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ProductKeyValue {
        /**
         * The key of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        key?: string | null;
        /**
         * The value of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        value?: string | null;
    }
    /**
     * Results for a product search request.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ProductSearchResults {
        /**
         * Timestamp of the index which provided these results. Products added to the product set and products removed from the product set after this time are not reflected in the current results.
         */
        indexTime?: string | null;
        /**
         * List of results grouped by products detected in the query image. Each entry corresponds to one bounding polygon in the query image, and contains the matching products specific to that region. There may be duplicate product matches in the union of all the per-product results.
         */
        productGroupedResults?: Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsGroupedResult[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsResult[];
    }
    /**
     * Information about the products similar to a single product in a query image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsGroupedResult {
        /**
         * The bounding polygon around the product detected in the query image.
         */
        boundingPoly?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * List of generic predictions for the object in the bounding box.
         */
        objectAnnotations?: Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsObjectAnnotation[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsResult[];
    }
    /**
     * Prediction for what the object in the bounding box is.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsObjectAnnotation {
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Information about a product.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ProductSearchResultsResult {
        /**
         * The resource name of the image from the product that is the closest match to the query.
         */
        image?: string | null;
        /**
         * The Product.
         */
        product?: Schema$GoogleCloudVisionV1p4beta1Product;
        /**
         * A confidence level on the match, ranging from 0 (no confidence) to 1 (full confidence).
         */
        score?: number | null;
    }
    /**
     * A `Property` consists of a user-supplied name/value pair.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Property {
        /**
         * Name of the property.
         */
        name?: string | null;
        /**
         * Value of numeric properties.
         */
        uint64Value?: string | null;
        /**
         * Value of the property.
         */
        value?: string | null;
    }
    /**
     * A `ReferenceImage` represents a product image and its associated metadata, such as bounding boxes.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1ReferenceImage {
        /**
         * Optional. Bounding polygons around the areas of interest in the reference image. If this field is empty, the system will try to detect regions of interest. At most 10 bounding polygons will be used. The provided shape is converted into a non-rotated rectangle. Once converted, the small edge of the rectangle must be greater than or equal to 300 pixels. The aspect ratio must be 1:4 or less (i.e. 1:3 is ok; 1:5 is not).
         */
        boundingPolys?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly[];
        /**
         * The resource name of the reference image. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID/referenceImages/IMAGE_ID`. This field is ignored when creating a reference image.
         */
        name?: string | null;
        /**
         * Required. The Google Cloud Storage URI of the reference image. The URI must start with `gs://`.
         */
        uri?: string | null;
    }
    /**
     * Set of features pertaining to the image, computed by computer vision methods over safe-search verticals (for example, adult, spoof, medical, violence).
     */
    export interface Schema$GoogleCloudVisionV1p4beta1SafeSearchAnnotation {
        /**
         * Represents the adult content likelihood for the image. Adult content may contain elements such as nudity, pornographic images or cartoons, or sexual activities.
         */
        adult?: string | null;
        /**
         * Likelihood that this is a medical image.
         */
        medical?: string | null;
        /**
         * Likelihood that the request image contains racy content. Racy content may include (but is not limited to) skimpy or sheer clothing, strategically covered nudity, lewd or provocative poses, or close-ups of sensitive body areas.
         */
        racy?: string | null;
        /**
         * Spoof likelihood. The likelihood that an modification was made to the image's canonical version to make it appear funny or offensive.
         */
        spoof?: string | null;
        /**
         * Likelihood that this image contains violent content. Violent content may include death, serious harm, or injury to individuals or groups of individuals.
         */
        violence?: string | null;
    }
    /**
     * A single symbol representation.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Symbol {
        /**
         * The bounding box for the symbol. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the symbol. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the symbol.
         */
        property?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty;
        /**
         * The actual UTF-8 representation of the symbol.
         */
        text?: string | null;
    }
    /**
     * TextAnnotation contains a structured representation of OCR extracted text. The hierarchy of an OCR extracted text structure is like this: TextAnnotation -\> Page -\> Block -\> Paragraph -\> Word -\> Symbol Each structural component, starting from Page, may further have their own properties. Properties describe detected languages, breaks etc.. Please refer to the TextAnnotation.TextProperty message definition below for more detail.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1TextAnnotation {
        /**
         * List of pages detected by OCR.
         */
        pages?: Schema$GoogleCloudVisionV1p4beta1Page[];
        /**
         * UTF-8 text detected on the pages.
         */
        text?: string | null;
    }
    /**
     * Detected start or end of a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1TextAnnotationDetectedBreak {
        /**
         * True if break prepends the element.
         */
        isPrefix?: boolean | null;
        /**
         * Detected break type.
         */
        type?: string | null;
    }
    /**
     * Detected language for a structural component.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1TextAnnotationDetectedLanguage {
        /**
         * Confidence of detected language. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Additional information detected on the structural component.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty {
        /**
         * Detected start or end of a text segment.
         */
        detectedBreak?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationDetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationDetectedLanguage[];
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Relevant information for the image from the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1WebDetection {
        /**
         * The service's best guess as to the topic of the request image. Inferred from similar images on the open web.
         */
        bestGuessLabels?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebLabel[];
        /**
         * Fully matching images from the Internet. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage[];
        /**
         * Web pages containing the matching images from the Internet.
         */
        pagesWithMatchingImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebPage[];
        /**
         * Partial matching images from the Internet. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage[];
        /**
         * The visually similar image results.
         */
        visuallySimilarImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage[];
        /**
         * Deduced entities from similar images on the Internet.
         */
        webEntities?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebEntity[];
    }
    /**
     * Entity deduced from similar images on the Internet.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1WebDetectionWebEntity {
        /**
         * Canonical description of the entity, in English.
         */
        description?: string | null;
        /**
         * Opaque entity ID.
         */
        entityId?: string | null;
        /**
         * Overall relevancy score for the entity. Not normalized and not comparable across different image queries.
         */
        score?: number | null;
    }
    /**
     * Metadata for online images.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage {
        /**
         * (Deprecated) Overall relevancy score for the image.
         */
        score?: number | null;
        /**
         * The result image URL.
         */
        url?: string | null;
    }
    /**
     * Label to provide extra metadata for the web detection.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1WebDetectionWebLabel {
        /**
         * Label for extra metadata.
         */
        label?: string | null;
        /**
         * The BCP-47 language code for `label`, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Metadata for web pages.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1WebDetectionWebPage {
        /**
         * Fully matching images on the page. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage[];
        /**
         * Title for the web page, may contain HTML markups.
         */
        pageTitle?: string | null;
        /**
         * Partial matching images on the page. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$GoogleCloudVisionV1p4beta1WebDetectionWebImage[];
        /**
         * (Deprecated) Overall relevancy score for the web page.
         */
        score?: number | null;
        /**
         * The result web page URL.
         */
        url?: string | null;
    }
    /**
     * A word representation.
     */
    export interface Schema$GoogleCloudVisionV1p4beta1Word {
        /**
         * The bounding box for the word. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$GoogleCloudVisionV1p4beta1BoundingPoly;
        /**
         * Confidence of the OCR results for the word. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the word.
         */
        property?: Schema$GoogleCloudVisionV1p4beta1TextAnnotationTextProperty;
        /**
         * List of symbols in the word. The order of the symbols follows the natural reading order.
         */
        symbols?: Schema$GoogleCloudVisionV1p4beta1Symbol[];
    }
    /**
     * Information about the products similar to a single product in a query image.
     */
    export interface Schema$GroupedResult {
        /**
         * The bounding polygon around the product detected in the query image.
         */
        boundingPoly?: Schema$BoundingPoly;
        /**
         * List of generic predictions for the object in the bounding box.
         */
        objectAnnotations?: Schema$ObjectAnnotation[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$Result[];
    }
    /**
     * If an image was produced from a file (e.g. a PDF), this message gives information about the source of that image.
     */
    export interface Schema$ImageAnnotationContext {
        /**
         * If the file was a PDF or TIFF, this field gives the page number within the file used to produce the image.
         */
        pageNumber?: number | null;
        /**
         * The URI of the file used to produce the image.
         */
        uri?: string | null;
    }
    /**
     * Stores image properties, such as dominant colors.
     */
    export interface Schema$ImageProperties {
        /**
         * If present, dominant colors completed successfully.
         */
        dominantColors?: Schema$DominantColorsAnnotation;
    }
    /**
     * Response message for the `ImportProductSets` method. This message is returned by the google.longrunning.Operations.GetOperation method in the returned google.longrunning.Operation.response field.
     */
    export interface Schema$ImportProductSetsResponse {
        /**
         * The list of reference_images that are imported successfully.
         */
        referenceImages?: Schema$ReferenceImage[];
        /**
         * The rpc status for each ImportProductSet request, including both successes and errors. The number of statuses here matches the number of lines in the csv file, and statuses[i] stores the success or failure status of processing the i-th line of the csv, starting from line 0.
         */
        statuses?: Schema$Status[];
    }
    /**
     * The desired input location and metadata.
     */
    export interface Schema$InputConfig {
        /**
         * File content, represented as a stream of bytes. Note: As with all `bytes` fields, protobuffers use a pure binary representation, whereas JSON representations use base64. Currently, this field only works for BatchAnnotateFiles requests. It does not work for AsyncBatchAnnotateFiles requests.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage location to read the input from.
         */
        gcsSource?: Schema$GcsSource;
        /**
         * The type of the file. Currently only "application/pdf", "image/tiff" and "image/gif" are supported. Wildcards are not supported.
         */
        mimeType?: string | null;
    }
    /**
     * A product label represented as a key-value pair.
     */
    export interface Schema$KeyValue {
        /**
         * The key of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        key?: string | null;
        /**
         * The value of the label attached to the product. Cannot be empty and cannot exceed 128 bytes.
         */
        value?: string | null;
    }
    /**
     * A face-specific landmark (for example, a face feature). Landmark positions may fall outside the bounds of the image if the face is near one or more edges of the image. Therefore it is NOT guaranteed that `0 <= x < width` or `0 <= y < height`.
     */
    export interface Schema$Landmark {
        /**
         * Face landmark position.
         */
        position?: Schema$Position;
        /**
         * Face landmark type.
         */
        type?: string | null;
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
     * Set of detected objects with bounding boxes.
     */
    export interface Schema$LocalizedObjectAnnotation {
        /**
         * Image region to which this object belongs. This must be populated.
         */
        boundingPoly?: Schema$BoundingPoly;
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
    }
    /**
     * Detected entity location information.
     */
    export interface Schema$LocationInfo {
        /**
         * lat/long location coordinates.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the normalized vertex coordinates are relative to the original image and range from 0 to 1.
     */
    export interface Schema$NormalizedVertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Prediction for what the object in the bounding box is.
     */
    export interface Schema$ObjectAnnotation {
        /**
         * The BCP-47 language code, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * Object ID that should align with EntityAnnotation mid.
         */
        mid?: string | null;
        /**
         * Object name, expressed in its `language_code` language.
         */
        name?: string | null;
        /**
         * Score of the result. Range [0, 1].
         */
        score?: number | null;
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
     * Contains metadata for the BatchAnnotateImages operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * The time when the batch request was received.
         */
        createTime?: string | null;
        /**
         * Current state of the batch operation.
         */
        state?: string | null;
        /**
         * The time when the operation result was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * The desired output location and metadata.
     */
    export interface Schema$OutputConfig {
        /**
         * The max number of response protos to put into each output JSON file on Google Cloud Storage. The valid range is [1, 100]. If not specified, the default value is 20. For example, for one pdf file with 100 pages, 100 response protos will be generated. If `batch_size` = 20, then 5 json files each containing 20 response protos will be written under the prefix `gcs_destination`.`uri`. Currently, batch_size only applies to GcsDestination, with potential future support for other output configurations.
         */
        batchSize?: number | null;
        /**
         * The Google Cloud Storage location to write the output(s) to.
         */
        gcsDestination?: Schema$GcsDestination;
    }
    /**
     * Detected page from OCR.
     */
    export interface Schema$Page {
        /**
         * List of blocks of text, images etc on this page.
         */
        blocks?: Schema$Block[];
        /**
         * Confidence of the OCR results on the page. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Page height. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        height?: number | null;
        /**
         * Additional information detected on the page.
         */
        property?: Schema$TextProperty;
        /**
         * Page width. For PDFs the unit is points. For images (including TIFFs) the unit is pixels.
         */
        width?: number | null;
    }
    /**
     * Structural unit of text representing a number of words in certain order.
     */
    export interface Schema$Paragraph {
        /**
         * The bounding box for the paragraph. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$BoundingPoly;
        /**
         * Confidence of the OCR results for the paragraph. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the paragraph.
         */
        property?: Schema$TextProperty;
        /**
         * List of all words in this paragraph.
         */
        words?: Schema$Word[];
    }
    /**
     * A 3D position in the image, used primarily for Face detection landmarks. A valid Position must have both x and y coordinates. The position coordinates are in the same scale as the original image.
     */
    export interface Schema$Position {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
        /**
         * Z coordinate (or depth).
         */
        z?: number | null;
    }
    /**
     * A Product contains ReferenceImages.
     */
    export interface Schema$Product {
        /**
         * User-provided metadata to be stored with this product. Must be at most 4096 characters long.
         */
        description?: string | null;
        /**
         * The user-provided name for this Product. Must not be empty. Must be at most 4096 characters long.
         */
        displayName?: string | null;
        /**
         * The resource name of the product. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID`. This field is ignored when creating a product.
         */
        name?: string | null;
        /**
         * Immutable. The category for the product identified by the reference image. This should be one of "homegoods-v2", "apparel-v2", "toys-v2", "packagedgoods-v1" or "general-v1". The legacy categories "homegoods", "apparel", and "toys" are still supported, but these should not be used for new products.
         */
        productCategory?: string | null;
        /**
         * Key-value pairs that can be attached to a product. At query time, constraints can be specified based on the product_labels. Note that integer values can be provided as strings, e.g. "1199". Only strings with integer values can match a range-based restriction which is to be supported soon. Multiple values can be assigned to the same key. One product may have up to 500 product_labels. Notice that the total number of distinct product_labels over all products in one ProductSet cannot exceed 1M, otherwise the product search pipeline will refuse to work for that ProductSet.
         */
        productLabels?: Schema$KeyValue[];
    }
    /**
     * Results for a product search request.
     */
    export interface Schema$ProductSearchResults {
        /**
         * Timestamp of the index which provided these results. Products added to the product set and products removed from the product set after this time are not reflected in the current results.
         */
        indexTime?: string | null;
        /**
         * List of results grouped by products detected in the query image. Each entry corresponds to one bounding polygon in the query image, and contains the matching products specific to that region. There may be duplicate product matches in the union of all the per-product results.
         */
        productGroupedResults?: Schema$GroupedResult[];
        /**
         * List of results, one for each product match.
         */
        results?: Schema$Result[];
    }
    /**
     * A `Property` consists of a user-supplied name/value pair.
     */
    export interface Schema$Property {
        /**
         * Name of the property.
         */
        name?: string | null;
        /**
         * Value of numeric properties.
         */
        uint64Value?: string | null;
        /**
         * Value of the property.
         */
        value?: string | null;
    }
    /**
     * A `ReferenceImage` represents a product image and its associated metadata, such as bounding boxes.
     */
    export interface Schema$ReferenceImage {
        /**
         * Optional. Bounding polygons around the areas of interest in the reference image. If this field is empty, the system will try to detect regions of interest. At most 10 bounding polygons will be used. The provided shape is converted into a non-rotated rectangle. Once converted, the small edge of the rectangle must be greater than or equal to 300 pixels. The aspect ratio must be 1:4 or less (i.e. 1:3 is ok; 1:5 is not).
         */
        boundingPolys?: Schema$BoundingPoly[];
        /**
         * The resource name of the reference image. Format is: `projects/PROJECT_ID/locations/LOC_ID/products/PRODUCT_ID/referenceImages/IMAGE_ID`. This field is ignored when creating a reference image.
         */
        name?: string | null;
        /**
         * Required. The Google Cloud Storage URI of the reference image. The URI must start with `gs://`.
         */
        uri?: string | null;
    }
    /**
     * Information about a product.
     */
    export interface Schema$Result {
        /**
         * The resource name of the image from the product that is the closest match to the query.
         */
        image?: string | null;
        /**
         * The Product.
         */
        product?: Schema$Product;
        /**
         * A confidence level on the match, ranging from 0 (no confidence) to 1 (full confidence).
         */
        score?: number | null;
    }
    /**
     * Set of features pertaining to the image, computed by computer vision methods over safe-search verticals (for example, adult, spoof, medical, violence).
     */
    export interface Schema$SafeSearchAnnotation {
        /**
         * Represents the adult content likelihood for the image. Adult content may contain elements such as nudity, pornographic images or cartoons, or sexual activities.
         */
        adult?: string | null;
        /**
         * Likelihood that this is a medical image.
         */
        medical?: string | null;
        /**
         * Likelihood that the request image contains racy content. Racy content may include (but is not limited to) skimpy or sheer clothing, strategically covered nudity, lewd or provocative poses, or close-ups of sensitive body areas.
         */
        racy?: string | null;
        /**
         * Spoof likelihood. The likelihood that an modification was made to the image's canonical version to make it appear funny or offensive.
         */
        spoof?: string | null;
        /**
         * Likelihood that this image contains violent content. Violent content may include death, serious harm, or injury to individuals or groups of individuals.
         */
        violence?: string | null;
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
     * A single symbol representation.
     */
    export interface Schema$Symbol {
        /**
         * The bounding box for the symbol. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$BoundingPoly;
        /**
         * Confidence of the OCR results for the symbol. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the symbol.
         */
        property?: Schema$TextProperty;
        /**
         * The actual UTF-8 representation of the symbol.
         */
        text?: string | null;
    }
    /**
     * TextAnnotation contains a structured representation of OCR extracted text. The hierarchy of an OCR extracted text structure is like this: TextAnnotation -\> Page -\> Block -\> Paragraph -\> Word -\> Symbol Each structural component, starting from Page, may further have their own properties. Properties describe detected languages, breaks etc.. Please refer to the TextAnnotation.TextProperty message definition below for more detail.
     */
    export interface Schema$TextAnnotation {
        /**
         * List of pages detected by OCR.
         */
        pages?: Schema$Page[];
        /**
         * UTF-8 text detected on the pages.
         */
        text?: string | null;
    }
    /**
     * Additional information detected on the structural component.
     */
    export interface Schema$TextProperty {
        /**
         * Detected start or end of a text segment.
         */
        detectedBreak?: Schema$DetectedBreak;
        /**
         * A list of detected languages together with confidence.
         */
        detectedLanguages?: Schema$DetectedLanguage[];
    }
    /**
     * A vertex represents a 2D point in the image. NOTE: the vertex coordinates are in the same scale as the original image.
     */
    export interface Schema$Vertex {
        /**
         * X coordinate.
         */
        x?: number | null;
        /**
         * Y coordinate.
         */
        y?: number | null;
    }
    /**
     * Relevant information for the image from the Internet.
     */
    export interface Schema$WebDetection {
        /**
         * The service's best guess as to the topic of the request image. Inferred from similar images on the open web.
         */
        bestGuessLabels?: Schema$WebLabel[];
        /**
         * Fully matching images from the Internet. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$WebImage[];
        /**
         * Web pages containing the matching images from the Internet.
         */
        pagesWithMatchingImages?: Schema$WebPage[];
        /**
         * Partial matching images from the Internet. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$WebImage[];
        /**
         * The visually similar image results.
         */
        visuallySimilarImages?: Schema$WebImage[];
        /**
         * Deduced entities from similar images on the Internet.
         */
        webEntities?: Schema$WebEntity[];
    }
    /**
     * Entity deduced from similar images on the Internet.
     */
    export interface Schema$WebEntity {
        /**
         * Canonical description of the entity, in English.
         */
        description?: string | null;
        /**
         * Opaque entity ID.
         */
        entityId?: string | null;
        /**
         * Overall relevancy score for the entity. Not normalized and not comparable across different image queries.
         */
        score?: number | null;
    }
    /**
     * Metadata for online images.
     */
    export interface Schema$WebImage {
        /**
         * (Deprecated) Overall relevancy score for the image.
         */
        score?: number | null;
        /**
         * The result image URL.
         */
        url?: string | null;
    }
    /**
     * Label to provide extra metadata for the web detection.
     */
    export interface Schema$WebLabel {
        /**
         * Label for extra metadata.
         */
        label?: string | null;
        /**
         * The BCP-47 language code for `label`, such as "en-US" or "sr-Latn". For more information, see http://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
    }
    /**
     * Metadata for web pages.
     */
    export interface Schema$WebPage {
        /**
         * Fully matching images on the page. Can include resized copies of the query image.
         */
        fullMatchingImages?: Schema$WebImage[];
        /**
         * Title for the web page, may contain HTML markups.
         */
        pageTitle?: string | null;
        /**
         * Partial matching images on the page. Those images are similar enough to share some key-point features. For example an original image will likely have partial matching for its crops.
         */
        partialMatchingImages?: Schema$WebImage[];
        /**
         * (Deprecated) Overall relevancy score for the web page.
         */
        score?: number | null;
        /**
         * The result web page URL.
         */
        url?: string | null;
    }
    /**
     * A word representation.
     */
    export interface Schema$Word {
        /**
         * The bounding box for the word. The vertices are in the order of top-left, top-right, bottom-right, bottom-left. When a rotation of the bounding box is detected the rotation is represented as around the top-left corner as defined when the text is read in the 'natural' orientation. For example: * when the text is horizontal it might look like: 0----1 | | 3----2 * when it's rotated 180 degrees around the top-left corner it becomes: 2----3 | | 1----0 and the vertex order will still be (0, 1, 2, 3).
         */
        boundingBox?: Schema$BoundingPoly;
        /**
         * Confidence of the OCR results for the word. Range [0, 1].
         */
        confidence?: number | null;
        /**
         * Additional information detected for the word.
         */
        property?: Schema$TextProperty;
        /**
         * List of symbols in the word. The order of the symbols follows the natural reading order.
         */
        symbols?: Schema$Symbol[];
    }
    export class Resource$Files {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Service that performs image detection and annotation for a batch of files. Now only "application/pdf", "image/tiff" and "image/gif" are supported. This service will extract at most 5 (customers can specify which 5 in AnnotateFileRequest.pages) frames (gif) or pages (pdf or tiff) from each file provided and perform detection and annotation for each image extracted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Files$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Files$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>>;
        annotate(params: Params$Resource$Files$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Files$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(params: Params$Resource$Files$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of generic files, such as PDF files, which may contain multiple pages and multiple images per page. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateFilesResponse` (results).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Files$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Files$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Files$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Files$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Files$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Files$Annotate extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesRequest;
    }
    export interface Params$Resource$Files$Asyncbatchannotate extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateFilesRequest;
    }
    export class Resource$Images {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Run image detection and annotation for a batch of images.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Images$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Images$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>>;
        annotate(params: Params$Resource$Images$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Images$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(params: Params$Resource$Images$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of images. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateImagesResponse` (results). This service will write image annotation outputs to json files in customer GCS bucket, each json file containing BatchAnnotateImagesResponse proto.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Images$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Images$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Images$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Images$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Images$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Images$Annotate extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesRequest;
    }
    export interface Params$Resource$Images$Asyncbatchannotate extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateImagesRequest;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        files: Resource$Projects$Files;
        images: Resource$Projects$Images;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Files {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Service that performs image detection and annotation for a batch of files. Now only "application/pdf", "image/tiff" and "image/gif" are supported. This service will extract at most 5 (customers can specify which 5 in AnnotateFileRequest.pages) frames (gif) or pages (pdf or tiff) from each file provided and perform detection and annotation for each image extracted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Projects$Files$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Projects$Files$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>>;
        annotate(params: Params$Resource$Projects$Files$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Projects$Files$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(params: Params$Resource$Projects$Files$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of generic files, such as PDF files, which may contain multiple pages and multiple images per page. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateFilesResponse` (results).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Projects$Files$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Projects$Files$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Projects$Files$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Files$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Files$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Files$Annotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesRequest;
    }
    export interface Params$Resource$Projects$Files$Asyncbatchannotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateFilesRequest;
    }
    export class Resource$Projects$Images {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Run image detection and annotation for a batch of images.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Projects$Images$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Projects$Images$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>>;
        annotate(params: Params$Resource$Projects$Images$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Projects$Images$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(params: Params$Resource$Projects$Images$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of images. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateImagesResponse` (results). This service will write image annotation outputs to json files in customer GCS bucket, each json file containing BatchAnnotateImagesResponse proto.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Projects$Images$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Projects$Images$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Projects$Images$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Images$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Images$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Images$Annotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesRequest;
    }
    export interface Params$Resource$Projects$Images$Asyncbatchannotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateImagesRequest;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        files: Resource$Projects$Locations$Files;
        images: Resource$Projects$Locations$Images;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Files {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Service that performs image detection and annotation for a batch of files. Now only "application/pdf", "image/tiff" and "image/gif" are supported. This service will extract at most 5 (customers can specify which 5 in AnnotateFileRequest.pages) frames (gif) or pages (pdf or tiff) from each file provided and perform detection and annotation for each image extracted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Projects$Locations$Files$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Projects$Locations$Files$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>>;
        annotate(params: Params$Resource$Projects$Locations$Files$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Projects$Locations$Files$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(params: Params$Resource$Projects$Locations$Files$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of generic files, such as PDF files, which may contain multiple pages and multiple images per page. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateFilesResponse` (results).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Files$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Projects$Locations$Files$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Files$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Files$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Files$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Files$Annotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateFilesRequest;
    }
    export interface Params$Resource$Projects$Locations$Files$Asyncbatchannotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateFilesRequest;
    }
    export class Resource$Projects$Locations$Images {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Run image detection and annotation for a batch of images.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        annotate(params: Params$Resource$Projects$Locations$Images$Annotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotate(params?: Params$Resource$Projects$Locations$Images$Annotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>>;
        annotate(params: Params$Resource$Projects$Locations$Images$Annotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotate(params: Params$Resource$Projects$Locations$Images$Annotate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(params: Params$Resource$Projects$Locations$Images$Annotate, callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        annotate(callback: BodyResponseCallback<Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesResponse>): void;
        /**
         * Run asynchronous image detection and annotation for a list of images. Progress and results can be retrieved through the `google.longrunning.Operations` interface. `Operation.metadata` contains `OperationMetadata` (metadata). `Operation.response` contains `AsyncBatchAnnotateImagesResponse` (results). This service will write image annotation outputs to json files in customer GCS bucket, each json file containing BatchAnnotateImagesResponse proto.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Images$Asyncbatchannotate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        asyncBatchAnnotate(params?: Params$Resource$Projects$Locations$Images$Asyncbatchannotate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Images$Asyncbatchannotate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Images$Asyncbatchannotate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(params: Params$Resource$Projects$Locations$Images$Asyncbatchannotate, callback: BodyResponseCallback<Schema$Operation>): void;
        asyncBatchAnnotate(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Images$Annotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1BatchAnnotateImagesRequest;
    }
    export interface Params$Resource$Projects$Locations$Images$Asyncbatchannotate extends StandardParameters {
        /**
         * Optional. Target project and location to make a call. Format: `projects/{project-id\}/locations/{location-id\}`. If no parent is specified, a region will be chosen automatically. Supported location-ids: `us`: USA country only, `asia`: East asia areas, like Japan, Taiwan, `eu`: The European Union. Example: `projects/project-A/locations/eu`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudVisionV1p1beta1AsyncBatchAnnotateImagesRequest;
    }
    export {};
}
