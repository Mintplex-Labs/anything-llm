import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace transcoder_v1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1beta1';
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
     * Transcoder API
     *
     * This API converts video files into formats suitable for consumer distribution.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const transcoder = google.transcoder('v1beta1');
     * ```
     */
    export class Transcoder {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Ad break.
     */
    export interface Schema$AdBreak {
        /**
         * Start time in seconds for the ad break, relative to the output file timeline. The default is `0s`.
         */
        startTimeOffset?: string | null;
    }
    /**
     * Configuration for AES-128 encryption.
     */
    export interface Schema$Aes128Encryption {
        /**
         * Required. URI of the key delivery service. This URI is inserted into the M3U8 header.
         */
        keyUri?: string | null;
    }
    /**
     * Animation types.
     */
    export interface Schema$Animation {
        /**
         * End previous animation.
         */
        animationEnd?: Schema$AnimationEnd;
        /**
         * Display overlay object with fade animation.
         */
        animationFade?: Schema$AnimationFade;
        /**
         * Display static overlay object.
         */
        animationStatic?: Schema$AnimationStatic;
    }
    /**
     * End previous overlay animation from the video. Without AnimationEnd, the overlay object will keep the state of previous animation until the end of the video.
     */
    export interface Schema$AnimationEnd {
        /**
         * The time to end overlay object, in seconds. Default: 0
         */
        startTimeOffset?: string | null;
    }
    /**
     * Display overlay object with fade animation.
     */
    export interface Schema$AnimationFade {
        /**
         * The time to end the fade animation, in seconds. Default: `start_time_offset` + 1s
         */
        endTimeOffset?: string | null;
        /**
         * Required. Type of fade animation: `FADE_IN` or `FADE_OUT`.
         */
        fadeType?: string | null;
        /**
         * The time to start the fade animation, in seconds. Default: 0
         */
        startTimeOffset?: string | null;
        /**
         * Normalized coordinates based on output video resolution. Valid values: `0.0`–`1.0`. `xy` is the upper-left coordinate of the overlay object. For example, use the x and y coordinates {0,0\} to position the top-left corner of the overlay animation in the top-left corner of the output video.
         */
        xy?: Schema$NormalizedCoordinate;
    }
    /**
     * Display static overlay object.
     */
    export interface Schema$AnimationStatic {
        /**
         * The time to start displaying the overlay object, in seconds. Default: 0
         */
        startTimeOffset?: string | null;
        /**
         * Normalized coordinates based on output video resolution. Valid values: `0.0`–`1.0`. `xy` is the upper-left coordinate of the overlay object. For example, use the x and y coordinates {0,0\} to position the top-left corner of the overlay animation in the top-left corner of the output video.
         */
        xy?: Schema$NormalizedCoordinate;
    }
    /**
     * Audio preprocessing configuration.
     */
    export interface Schema$Audio {
        /**
         * Enable boosting high frequency components. The default is `false`.
         */
        highBoost?: boolean | null;
        /**
         * Enable boosting low frequency components. The default is `false`.
         */
        lowBoost?: boolean | null;
        /**
         * Specify audio loudness normalization in loudness units relative to full scale (LUFS). Enter a value between -24 and 0 (the default), where: * -24 is the Advanced Television Systems Committee (ATSC A/85) standard * -23 is the EU R128 broadcast standard * -19 is the prior standard for online mono audio * -18 is the ReplayGain standard * -16 is the prior standard for stereo audio * -14 is the new online audio standard recommended by Spotify, as well as Amazon Echo * 0 disables normalization
         */
        lufs?: number | null;
    }
    /**
     * The mapping for the `Job.edit_list` atoms with audio `EditAtom.inputs`.
     */
    export interface Schema$AudioAtom {
        /**
         * List of `Channel`s for this audio stream. for in-depth explanation.
         */
        channels?: Schema$AudioChannel[];
        /**
         * Required. The `EditAtom.key` that references the atom with audio inputs in the `Job.edit_list`.
         */
        key?: string | null;
    }
    /**
     * The audio channel.
     */
    export interface Schema$AudioChannel {
        /**
         * List of `Job.inputs` for this audio channel.
         */
        inputs?: Schema$AudioChannelInput[];
    }
    /**
     * Identifies which input file, track, and channel should be used.
     */
    export interface Schema$AudioChannelInput {
        /**
         * Required. The zero-based index of the channel in the input file.
         */
        channel?: number | null;
        /**
         * Audio volume control in dB. Negative values decrease volume, positive values increase. The default is 0.
         */
        gainDb?: number | null;
        /**
         * Required. The `Input.key` that identifies the input file.
         */
        key?: string | null;
        /**
         * Required. The zero-based index of the track in the input file.
         */
        track?: number | null;
    }
    /**
     * Audio stream resource.
     */
    export interface Schema$AudioStream {
        /**
         * Required. Audio bitrate in bits per second. Must be between 1 and 10,000,000.
         */
        bitrateBps?: number | null;
        /**
         * Number of audio channels. Must be between 1 and 6. The default is 2.
         */
        channelCount?: number | null;
        /**
         * A list of channel names specifying layout of the audio channels. This only affects the metadata embedded in the container headers, if supported by the specified format. The default is `["fl", "fr"]`. Supported channel names: - 'fl' - Front left channel - 'fr' - Front right channel - 'sl' - Side left channel - 'sr' - Side right channel - 'fc' - Front center channel - 'lfe' - Low frequency
         */
        channelLayout?: string[] | null;
        /**
         * The codec for this audio stream. The default is `"aac"`. Supported audio codecs: - 'aac' - 'aac-he' - 'aac-he-v2' - 'mp3' - 'ac3' - 'eac3'
         */
        codec?: string | null;
        /**
         * The mapping for the `Job.edit_list` atoms with audio `EditAtom.inputs`.
         */
        mapping?: Schema$AudioAtom[];
        /**
         * The audio sample rate in Hertz. The default is 48000 Hertz.
         */
        sampleRateHertz?: number | null;
    }
    /**
     * Color preprocessing configuration.
     */
    export interface Schema$Color {
        /**
         * Control brightness of the video. Enter a value between -1 and 1, where -1 is minimum brightness and 1 is maximum brightness. 0 is no change. The default is 0.
         */
        brightness?: number | null;
        /**
         * Control black and white contrast of the video. Enter a value between -1 and 1, where -1 is minimum contrast and 1 is maximum contrast. 0 is no change. The default is 0.
         */
        contrast?: number | null;
        /**
         * Control color saturation of the video. Enter a value between -1 and 1, where -1 is fully desaturated and 1 is maximum saturation. 0 is no change. The default is 0.
         */
        saturation?: number | null;
    }
    /**
     * Video cropping configuration for the input video. The cropped input video is scaled to match the output resolution.
     */
    export interface Schema$Crop {
        /**
         * The number of pixels to crop from the bottom. The default is 0.
         */
        bottomPixels?: number | null;
        /**
         * The number of pixels to crop from the left. The default is 0.
         */
        leftPixels?: number | null;
        /**
         * The number of pixels to crop from the right. The default is 0.
         */
        rightPixels?: number | null;
        /**
         * The number of pixels to crop from the top. The default is 0.
         */
        topPixels?: number | null;
    }
    /**
     * Deblock preprocessing configuration.
     */
    export interface Schema$Deblock {
        /**
         * Enable deblocker. The default is `false`.
         */
        enabled?: boolean | null;
        /**
         * Set strength of the deblocker. Enter a value between 0 and 1. The higher the value, the stronger the block removal. 0 is no deblocking. The default is 0.
         */
        strength?: number | null;
    }
    /**
     * Denoise preprocessing configuration.
     */
    export interface Schema$Denoise {
        /**
         * Set strength of the denoise. Enter a value between 0 and 1. The higher the value, the smoother the image. 0 is no denoising. The default is 0.
         */
        strength?: number | null;
        /**
         * Set the denoiser mode. The default is `"standard"`. Supported denoiser modes: - 'standard' - 'grain'
         */
        tune?: string | null;
    }
    /**
     * Edit atom.
     */
    export interface Schema$EditAtom {
        /**
         * End time in seconds for the atom, relative to the input file timeline. When `end_time_offset` is not specified, the `inputs` are used until the end of the atom.
         */
        endTimeOffset?: string | null;
        /**
         * List of `Input.key`s identifying files that should be used in this atom. The listed `inputs` must have the same timeline.
         */
        inputs?: string[] | null;
        /**
         * A unique key for this atom. Must be specified when using advanced mapping.
         */
        key?: string | null;
        /**
         * Start time in seconds for the atom, relative to the input file timeline. The default is `0s`.
         */
        startTimeOffset?: string | null;
    }
    /**
     * Encoding of an input file such as an audio, video, or text track. Elementary streams must be packaged before mapping and sharing between different output formats.
     */
    export interface Schema$ElementaryStream {
        /**
         * Encoding of an audio stream.
         */
        audioStream?: Schema$AudioStream;
        /**
         * A unique key for this elementary stream.
         */
        key?: string | null;
        /**
         * Encoding of a text stream. For example, closed captions or subtitles.
         */
        textStream?: Schema$TextStream;
        /**
         * Encoding of a video stream.
         */
        videoStream?: Schema$VideoStream;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Encryption settings.
     */
    export interface Schema$Encryption {
        /**
         * Configuration for AES-128 encryption.
         */
        aes128?: Schema$Aes128Encryption;
        /**
         * Required. 128 bit Initialization Vector (IV) represented as lowercase hexadecimal digits.
         */
        iv?: string | null;
        /**
         * Required. 128 bit encryption key represented as lowercase hexadecimal digits.
         */
        key?: string | null;
        /**
         * Configuration for MPEG Common Encryption (MPEG-CENC).
         */
        mpegCenc?: Schema$MpegCommonEncryption;
        /**
         * Configuration for SAMPLE-AES encryption.
         */
        sampleAes?: Schema$SampleAesEncryption;
    }
    /**
     * Additional information about the reasons for the failure.
     */
    export interface Schema$FailureDetail {
        /**
         * A description of the failure.
         */
        description?: string | null;
    }
    /**
     * Overlaid jpeg image.
     */
    export interface Schema$Image {
        /**
         * Target image opacity. Valid values are from `1.0` (solid, default) to `0.0` (transparent), exclusive. Set this to a value greater than `0.0`.
         */
        alpha?: number | null;
        /**
         * Normalized image resolution, based on output video resolution. Valid values: `0.0`–`1.0`. To respect the original image aspect ratio, set either `x` or `y` to `0.0`. To use the original image resolution, set both `x` and `y` to `0.0`.
         */
        resolution?: Schema$NormalizedCoordinate;
        /**
         * Required. URI of the JPEG image in Cloud Storage. For example, `gs://bucket/inputs/image.jpeg`. JPEG is the only supported image type.
         */
        uri?: string | null;
    }
    /**
     * Input asset.
     */
    export interface Schema$Input {
        /**
         * A unique key for this input. Must be specified when using advanced mapping and edit lists.
         */
        key?: string | null;
        /**
         * Preprocessing configurations.
         */
        preprocessingConfig?: Schema$PreprocessingConfig;
        /**
         * URI of the media. Input files must be at least 5 seconds in duration and stored in Cloud Storage (for example, `gs://bucket/inputs/file.mp4`). If empty, the value will be populated from `Job.input_uri`.
         */
        uri?: string | null;
    }
    /**
     * Transcoding job resource.
     */
    export interface Schema$Job {
        /**
         * The configuration for this job.
         */
        config?: Schema$JobConfig;
        /**
         * Output only. The time the job was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the transcoding finished.
         */
        endTime?: string | null;
        /**
         * Output only. List of failure details. This property may contain additional information about the failure when `failure_reason` is present. *Note*: This feature is not yet available.
         */
        failureDetails?: Schema$FailureDetail[];
        /**
         * Output only. A description of the reason for the failure. This property is always present when `state` is `FAILED`.
         */
        failureReason?: string | null;
        /**
         * Input only. Specify the `input_uri` to populate empty `uri` fields in each element of `Job.config.inputs` or `JobTemplate.config.inputs` when using template. URI of the media. Input files must be at least 5 seconds in duration and stored in Cloud Storage (for example, `gs://bucket/inputs/file.mp4`).
         */
        inputUri?: string | null;
        /**
         * The resource name of the job. Format: `projects/{project\}/locations/{location\}/jobs/{job\}`
         */
        name?: string | null;
        /**
         * Output only. The origin URI. *Note*: This feature is not yet available.
         */
        originUri?: Schema$OriginUri;
        /**
         * Input only. Specify the `output_uri` to populate an empty `Job.config.output.uri` or `JobTemplate.config.output.uri` when using template. URI for the output file(s). For example, `gs://my-bucket/outputs/`.
         */
        outputUri?: string | null;
        /**
         * Specify the priority of the job. Enter a value between 0 and 100, where 0 is the lowest priority and 100 is the highest priority. The default is 0.
         */
        priority?: number | null;
        /**
         * Output only. Estimated fractional progress, from `0` to `1` for each step. *Note*: This feature is not yet available.
         */
        progress?: Schema$Progress;
        /**
         * Output only. The time the transcoding started.
         */
        startTime?: string | null;
        /**
         * Output only. The current state of the job.
         */
        state?: string | null;
        /**
         * Input only. Specify the `template_id` to use for populating `Job.config`. The default is `preset/web-hd`. Preset Transcoder templates: - `preset/{preset_id\}` - User defined JobTemplate: `{job_template_id\}`
         */
        templateId?: string | null;
        /**
         * Job time to live value in days, which will be effective after job completion. Job should be deleted automatically after the given TTL. Enter a value between 1 and 90. The default is 30.
         */
        ttlAfterCompletionDays?: number | null;
    }
    /**
     * Job configuration
     */
    export interface Schema$JobConfig {
        /**
         * List of ad breaks. Specifies where to insert ad break tags in the output manifests.
         */
        adBreaks?: Schema$AdBreak[];
        /**
         * List of `Edit atom`s. Defines the ultimate timeline of the resulting file or manifest.
         */
        editList?: Schema$EditAtom[];
        /**
         * List of elementary streams.
         */
        elementaryStreams?: Schema$ElementaryStream[];
        /**
         * List of input assets stored in Cloud Storage.
         */
        inputs?: Schema$Input[];
        /**
         * List of output manifests.
         */
        manifests?: Schema$Manifest[];
        /**
         * List of multiplexing settings for output streams.
         */
        muxStreams?: Schema$MuxStream[];
        /**
         * Output configuration.
         */
        output?: Schema$Output;
        /**
         * List of overlays on the output video, in descending Z-order.
         */
        overlays?: Schema$Overlay[];
        /**
         * Destination on Pub/Sub.
         */
        pubsubDestination?: Schema$PubsubDestination;
        /**
         * List of output sprite sheets.
         */
        spriteSheets?: Schema$SpriteSheet[];
    }
    /**
     * Transcoding job template resource.
     */
    export interface Schema$JobTemplate {
        /**
         * The configuration for this template.
         */
        config?: Schema$JobConfig;
        /**
         * The resource name of the job template. Format: `projects/{project\}/locations/{location\}/jobTemplates/{job_template\}`
         */
        name?: string | null;
    }
    /**
     * Response message for `TranscoderService.ListJobs`.
     */
    export interface Schema$ListJobsResponse {
        /**
         * List of jobs in the specified region.
         */
        jobs?: Schema$Job[];
        /**
         * The pagination token.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for `TranscoderService.ListJobTemplates`.
     */
    export interface Schema$ListJobTemplatesResponse {
        /**
         * List of job templates in the specified region.
         */
        jobTemplates?: Schema$JobTemplate[];
        /**
         * The pagination token.
         */
        nextPageToken?: string | null;
    }
    /**
     * Manifest configuration.
     */
    export interface Schema$Manifest {
        /**
         * The name of the generated file. The default is `"manifest"` with the extension suffix corresponding to the `Manifest.type`.
         */
        fileName?: string | null;
        /**
         * Required. List of user given `MuxStream.key`s that should appear in this manifest. When `Manifest.type` is `HLS`, a media manifest with name `MuxStream.key` and `.m3u8` extension is generated for each element of the `Manifest.mux_streams`.
         */
        muxStreams?: string[] | null;
        /**
         * Required. Type of the manifest, can be "HLS" or "DASH".
         */
        type?: string | null;
    }
    /**
     * Configuration for MPEG Common Encryption (MPEG-CENC).
     */
    export interface Schema$MpegCommonEncryption {
        /**
         * Required. 128 bit Key ID represented as lowercase hexadecimal digits for use with common encryption.
         */
        keyId?: string | null;
        /**
         * Required. Specify the encryption scheme. Supported encryption schemes: - 'cenc' - 'cbcs'
         */
        scheme?: string | null;
    }
    /**
     * Multiplexing settings for output stream.
     */
    export interface Schema$MuxStream {
        /**
         * The container format. The default is `"mp4"` Supported container formats: - 'ts' - 'fmp4'- the corresponding file extension is `".m4s"` - 'mp4' - 'vtt'
         */
        container?: string | null;
        /**
         * List of `ElementaryStream.key`s multiplexed in this stream.
         */
        elementaryStreams?: string[] | null;
        /**
         * Encryption settings.
         */
        encryption?: Schema$Encryption;
        /**
         * The name of the generated file. The default is `MuxStream.key` with the extension suffix corresponding to the `MuxStream.container`. Individual segments also have an incremental 10-digit zero-padded suffix starting from 0 before the extension, such as `"mux_stream0000000123.ts"`.
         */
        fileName?: string | null;
        /**
         * A unique key for this multiplexed stream. HLS media manifests will be named `MuxStream.key` with the `".m3u8"` extension suffix.
         */
        key?: string | null;
        /**
         * Segment settings for `"ts"`, `"fmp4"` and `"vtt"`.
         */
        segmentSettings?: Schema$SegmentSettings;
    }
    /**
     * 2D normalized coordinates. Default: `{0.0, 0.0\}`
     */
    export interface Schema$NormalizedCoordinate {
        /**
         * Normalized x coordinate.
         */
        x?: number | null;
        /**
         * Normalized y coordinate.
         */
        y?: number | null;
    }
    /**
     * The origin URI.
     */
    export interface Schema$OriginUri {
        /**
         * Dash manifest URI. If multiple Dash manifests are created, only the first one is listed.
         */
        dash?: string | null;
        /**
         * HLS manifest URI per https://tools.ietf.org/html/rfc8216#section-4.3.4. If multiple HLS manifests are created, only the first one is listed.
         */
        hls?: string | null;
    }
    /**
     * Location of output file(s) in a Cloud Storage bucket.
     */
    export interface Schema$Output {
        /**
         * URI for the output file(s). For example, `gs://my-bucket/outputs/`. If empty the value is populated from `Job.output_uri`.
         */
        uri?: string | null;
    }
    /**
     * Overlay configuration.
     */
    export interface Schema$Overlay {
        /**
         * List of Animations. The list should be chronological, without any time overlap.
         */
        animations?: Schema$Animation[];
        /**
         * Image overlay.
         */
        image?: Schema$Image;
    }
    /**
     * Pad filter configuration for the input video. The padded input video is scaled after padding with black to match the output resolution.
     */
    export interface Schema$Pad {
        /**
         * The number of pixels to add to the bottom. The default is 0.
         */
        bottomPixels?: number | null;
        /**
         * The number of pixels to add to the left. The default is 0.
         */
        leftPixels?: number | null;
        /**
         * The number of pixels to add to the right. The default is 0.
         */
        rightPixels?: number | null;
        /**
         * The number of pixels to add to the top. The default is 0.
         */
        topPixels?: number | null;
    }
    /**
     * Preprocessing configurations.
     */
    export interface Schema$PreprocessingConfig {
        /**
         * Audio preprocessing configuration.
         */
        audio?: Schema$Audio;
        /**
         * Color preprocessing configuration.
         */
        color?: Schema$Color;
        /**
         * Specify the video cropping configuration.
         */
        crop?: Schema$Crop;
        /**
         * Deblock preprocessing configuration.
         */
        deblock?: Schema$Deblock;
        /**
         * Denoise preprocessing configuration.
         */
        denoise?: Schema$Denoise;
        /**
         * Specify the video pad filter configuration.
         */
        pad?: Schema$Pad;
    }
    /**
     * Estimated fractional progress for each step, from `0` to `1`.
     */
    export interface Schema$Progress {
        /**
         * Estimated fractional progress for `analyzing` step.
         */
        analyzed?: number | null;
        /**
         * Estimated fractional progress for `encoding` step.
         */
        encoded?: number | null;
        /**
         * Estimated fractional progress for `notifying` step.
         */
        notified?: number | null;
        /**
         * Estimated fractional progress for `uploading` step.
         */
        uploaded?: number | null;
    }
    /**
     * A Pub/Sub destination.
     */
    export interface Schema$PubsubDestination {
        /**
         * The name of the Pub/Sub topic to publish job completion notification to. For example: `projects/{project\}/topics/{topic\}`.
         */
        topic?: string | null;
    }
    /**
     * Configuration for SAMPLE-AES encryption.
     */
    export interface Schema$SampleAesEncryption {
        /**
         * Required. URI of the key delivery service. This URI is inserted into the M3U8 header.
         */
        keyUri?: string | null;
    }
    /**
     * Segment settings for `"ts"`, `"fmp4"` and `"vtt"`.
     */
    export interface Schema$SegmentSettings {
        /**
         * Required. Create an individual segment file. The default is `false`.
         */
        individualSegments?: boolean | null;
        /**
         * Duration of the segments in seconds. The default is `"6.0s"`. Note that `segmentDuration` must be greater than or equal to [`gopDuration`](#videostream), and `segmentDuration` must be divisible by [`gopDuration`](#videostream).
         */
        segmentDuration?: string | null;
    }
    /**
     * Sprite sheet configuration.
     */
    export interface Schema$SpriteSheet {
        /**
         * The maximum number of sprites per row in a sprite sheet. The default is 0, which indicates no maximum limit.
         */
        columnCount?: number | null;
        /**
         * End time in seconds, relative to the output file timeline. When `end_time_offset` is not specified, the sprites are generated until the end of the output file.
         */
        endTimeOffset?: string | null;
        /**
         * Required. File name prefix for the generated sprite sheets. Each sprite sheet has an incremental 10-digit zero-padded suffix starting from 0 before the extension, such as `"sprite_sheet0000000123.jpeg"`.
         */
        filePrefix?: string | null;
        /**
         * Format type. The default is `"jpeg"`. Supported formats: - 'jpeg'
         */
        format?: string | null;
        /**
         * Starting from `0s`, create sprites at regular intervals. Specify the interval value in seconds.
         */
        interval?: string | null;
        /**
         * The quality of the generated sprite sheet. Enter a value between 1 and 100, where 1 is the lowest quality and 100 is the highest quality. The default is 100. A high quality value corresponds to a low image data compression ratio.
         */
        quality?: number | null;
        /**
         * The maximum number of rows per sprite sheet. When the sprite sheet is full, a new sprite sheet is created. The default is 0, which indicates no maximum limit.
         */
        rowCount?: number | null;
        /**
         * Required. The height of sprite in pixels. Must be an even integer. To preserve the source aspect ratio, set the SpriteSheet.sprite_height_pixels field or the SpriteSheet.sprite_width_pixels field, but not both (the API will automatically calculate the missing field).
         */
        spriteHeightPixels?: number | null;
        /**
         * Required. The width of sprite in pixels. Must be an even integer. To preserve the source aspect ratio, set the SpriteSheet.sprite_width_pixels field or the SpriteSheet.sprite_height_pixels field, but not both (the API will automatically calculate the missing field).
         */
        spriteWidthPixels?: number | null;
        /**
         * Start time in seconds, relative to the output file timeline. Determines the first sprite to pick. The default is `0s`.
         */
        startTimeOffset?: string | null;
        /**
         * Total number of sprites. Create the specified number of sprites distributed evenly across the timeline of the output media. The default is 100.
         */
        totalCount?: number | null;
    }
    /**
     * The mapping for the `Job.edit_list` atoms with text `EditAtom.inputs`.
     */
    export interface Schema$TextAtom {
        /**
         * List of `Job.inputs` that should be embedded in this atom. Only one input is supported.
         */
        inputs?: Schema$TextInput[];
        /**
         * Required. The `EditAtom.key` that references atom with text inputs in the `Job.edit_list`.
         */
        key?: string | null;
    }
    /**
     * Identifies which input file and track should be used.
     */
    export interface Schema$TextInput {
        /**
         * Required. The `Input.key` that identifies the input file.
         */
        key?: string | null;
        /**
         * Required. The zero-based index of the track in the input file.
         */
        track?: number | null;
    }
    /**
     * Encoding of a text stream. For example, closed captions or subtitles.
     */
    export interface Schema$TextStream {
        /**
         * The codec for this text stream. The default is `"webvtt"`. Supported text codecs: - 'srt' - 'ttml' - 'cea608' - 'cea708' - 'webvtt'
         */
        codec?: string | null;
        /**
         * Required. The BCP-47 language code, such as `"en-US"` or `"sr-Latn"`. For more information, see https://www.unicode.org/reports/tr35/#Unicode_locale_identifier.
         */
        languageCode?: string | null;
        /**
         * The mapping for the `Job.edit_list` atoms with text `EditAtom.inputs`.
         */
        mapping?: Schema$TextAtom[];
    }
    /**
     * Video stream resource.
     */
    export interface Schema$VideoStream {
        /**
         * Specifies whether an open Group of Pictures (GOP) structure should be allowed or not. The default is `false`.
         */
        allowOpenGop?: boolean | null;
        /**
         * Specify the intensity of the adaptive quantizer (AQ). Must be between 0 and 1, where 0 disables the quantizer and 1 maximizes the quantizer. A higher value equals a lower bitrate but smoother image. The default is 0.
         */
        aqStrength?: number | null;
        /**
         * The number of consecutive B-frames. Must be greater than or equal to zero. Must be less than `VideoStream.gop_frame_count` if set. The default is 0.
         */
        bFrameCount?: number | null;
        /**
         * Required. The video bitrate in bits per second. The minimum value is 1,000. The maximum value for H264/H265 is 800,000,000. The maximum value for VP9 is 480,000,000.
         */
        bitrateBps?: number | null;
        /**
         * Allow B-pyramid for reference frame selection. This may not be supported on all decoders. The default is `false`.
         */
        bPyramid?: boolean | null;
        /**
         * Codec type. The following codecs are supported: * `h264` (default) * `h265` * `vp9`
         */
        codec?: string | null;
        /**
         * Target CRF level. Must be between 10 and 36, where 10 is the highest quality and 36 is the most efficient compression. The default is 21.
         */
        crfLevel?: number | null;
        /**
         * Use two-pass encoding strategy to achieve better video quality. `VideoStream.rate_control_mode` must be `"vbr"`. The default is `false`.
         */
        enableTwoPass?: boolean | null;
        /**
         * The entropy coder to use. The default is `"cabac"`. Supported entropy coders: - 'cavlc' - 'cabac'
         */
        entropyCoder?: string | null;
        /**
         * Required. The target video frame rate in frames per second (FPS). Must be less than or equal to 120. Will default to the input frame rate if larger than the input frame rate. The API will generate an output FPS that is divisible by the input FPS, and smaller or equal to the target FPS. See [Calculate frame rate](https://cloud.google.com/transcoder/docs/concepts/frame-rate) for more information.
         */
        frameRate?: number | null;
        /**
         * Select the GOP size based on the specified duration. The default is `"3s"`. Note that `gopDuration` must be less than or equal to [`segmentDuration`](#SegmentSettings), and [`segmentDuration`](#SegmentSettings) must be divisible by `gopDuration`.
         */
        gopDuration?: string | null;
        /**
         * Select the GOP size based on the specified frame count. Must be greater than zero.
         */
        gopFrameCount?: number | null;
        /**
         * The height of the video in pixels. Must be an even integer. When not specified, the height is adjusted to match the specified width and input aspect ratio. If both are omitted, the input height is used.
         */
        heightPixels?: number | null;
        /**
         * Pixel format to use. The default is `"yuv420p"`. Supported pixel formats: - 'yuv420p' pixel format. - 'yuv422p' pixel format. - 'yuv444p' pixel format. - 'yuv420p10' 10-bit HDR pixel format. - 'yuv422p10' 10-bit HDR pixel format. - 'yuv444p10' 10-bit HDR pixel format. - 'yuv420p12' 12-bit HDR pixel format. - 'yuv422p12' 12-bit HDR pixel format. - 'yuv444p12' 12-bit HDR pixel format.
         */
        pixelFormat?: string | null;
        /**
         * Enforces the specified codec preset. The default is `veryfast`. The available options are FFmpeg-compatible. Note that certain values for this field may cause the transcoder to override other fields you set in the `VideoStream` message.
         */
        preset?: string | null;
        /**
         * Enforces the specified codec profile. The following profiles are supported: * `baseline` * `main` * `high` (default) The available options are FFmpeg-compatible. Note that certain values for this field may cause the transcoder to override other fields you set in the `VideoStream` message.
         */
        profile?: string | null;
        /**
         * Specify the `rate_control_mode`. The default is `"vbr"`. Supported rate control modes: - 'vbr' - variable bitrate - 'crf' - constant rate factor
         */
        rateControlMode?: string | null;
        /**
         * Enforces the specified codec tune. The available options are FFmpeg-compatible. Note that certain values for this field may cause the transcoder to override other fields you set in the `VideoStream` message.
         */
        tune?: string | null;
        /**
         * Initial fullness of the Video Buffering Verifier (VBV) buffer in bits. Must be greater than zero. The default is equal to 90% of `VideoStream.vbv_size_bits`.
         */
        vbvFullnessBits?: number | null;
        /**
         * Size of the Video Buffering Verifier (VBV) buffer in bits. Must be greater than zero. The default is equal to `VideoStream.bitrate_bps`.
         */
        vbvSizeBits?: number | null;
        /**
         * The width of the video in pixels. Must be an even integer. When not specified, the width is adjusted to match the specified height and input aspect ratio. If both are omitted, the input width is used.
         */
        widthPixels?: number | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        jobs: Resource$Projects$Locations$Jobs;
        jobTemplates: Resource$Projects$Locations$Jobtemplates;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a job in the specified region.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobs.create({
         *     // Required. The parent location to create and process this job. Format: `projects/{project\}/locations/{location\}`
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "config": {},
         *       //   "createTime": "my_createTime",
         *       //   "endTime": "my_endTime",
         *       //   "failureDetails": [],
         *       //   "failureReason": "my_failureReason",
         *       //   "inputUri": "my_inputUri",
         *       //   "name": "my_name",
         *       //   "originUri": {},
         *       //   "outputUri": "my_outputUri",
         *       //   "priority": 0,
         *       //   "progress": {},
         *       //   "startTime": "my_startTime",
         *       //   "state": "my_state",
         *       //   "templateId": "my_templateId",
         *       //   "ttlAfterCompletionDays": 0
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "config": {},
         *   //   "createTime": "my_createTime",
         *   //   "endTime": "my_endTime",
         *   //   "failureDetails": [],
         *   //   "failureReason": "my_failureReason",
         *   //   "inputUri": "my_inputUri",
         *   //   "name": "my_name",
         *   //   "originUri": {},
         *   //   "outputUri": "my_outputUri",
         *   //   "priority": 0,
         *   //   "progress": {},
         *   //   "startTime": "my_startTime",
         *   //   "state": "my_state",
         *   //   "templateId": "my_templateId",
         *   //   "ttlAfterCompletionDays": 0
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
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Jobs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Deletes a job.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobs.delete({
         *     // Required. The name of the job to delete. Format: `projects/{project\}/locations/{location\}/jobs/{job\}`
         *     name: 'projects/my-project/locations/my-location/jobs/my-job',
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
        delete(params: Params$Resource$Projects$Locations$Jobs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Jobs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Jobs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Jobs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Jobs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns the job data.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobs.get({
         *     // Required. The name of the job to retrieve. Format: `projects/{project\}/locations/{location\}/jobs/{job\}`
         *     name: 'projects/my-project/locations/my-location/jobs/my-job',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "config": {},
         *   //   "createTime": "my_createTime",
         *   //   "endTime": "my_endTime",
         *   //   "failureDetails": [],
         *   //   "failureReason": "my_failureReason",
         *   //   "inputUri": "my_inputUri",
         *   //   "name": "my_name",
         *   //   "originUri": {},
         *   //   "outputUri": "my_outputUri",
         *   //   "priority": 0,
         *   //   "progress": {},
         *   //   "startTime": "my_startTime",
         *   //   "state": "my_state",
         *   //   "templateId": "my_templateId",
         *   //   "ttlAfterCompletionDays": 0
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
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Lists jobs in the specified region.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobs.list({
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The `next_page_token` value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // Required. Format: `projects/{project\}/locations/{location\}`
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "jobs": [],
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
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Create extends StandardParameters {
        /**
         * Required. The parent location to create and process this job. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Delete extends StandardParameters {
        /**
         * Required. The name of the job to delete. Format: `projects/{project\}/locations/{location\}/jobs/{job\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Get extends StandardParameters {
        /**
         * Required. The name of the job to retrieve. Format: `projects/{project\}/locations/{location\}/jobs/{job\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Jobtemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a job template in the specified region.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobTemplates.create({
         *     // Required. The ID to use for the job template, which will become the final component of the job template's resource name. This value should be 4-63 characters, and valid characters must match the regular expression `a-zA-Z*`.
         *     jobTemplateId: 'placeholder-value',
         *     // Required. The parent location to create this job template. Format: `projects/{project\}/locations/{location\}`
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "config": {},
         *       //   "name": "my_name"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "config": {},
         *   //   "name": "my_name"
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
        create(params: Params$Resource$Projects$Locations$Jobtemplates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Jobtemplates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$JobTemplate>>;
        create(params: Params$Resource$Projects$Locations$Jobtemplates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Jobtemplates$Create, options: MethodOptions | BodyResponseCallback<Schema$JobTemplate>, callback: BodyResponseCallback<Schema$JobTemplate>): void;
        create(params: Params$Resource$Projects$Locations$Jobtemplates$Create, callback: BodyResponseCallback<Schema$JobTemplate>): void;
        create(callback: BodyResponseCallback<Schema$JobTemplate>): void;
        /**
         * Deletes a job template.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobTemplates.delete({
         *     // Required. The name of the job template to delete. `projects/{project\}/locations/{location\}/jobTemplates/{job_template\}`
         *     name: 'projects/my-project/locations/my-location/jobTemplates/my-jobTemplate',
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
        delete(params: Params$Resource$Projects$Locations$Jobtemplates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Jobtemplates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Jobtemplates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Jobtemplates$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Jobtemplates$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns the job template data.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobTemplates.get({
         *     // Required. The name of the job template to retrieve. Format: `projects/{project\}/locations/{location\}/jobTemplates/{job_template\}`
         *     name: 'projects/my-project/locations/my-location/jobTemplates/my-jobTemplate',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "config": {},
         *   //   "name": "my_name"
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
        get(params: Params$Resource$Projects$Locations$Jobtemplates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Jobtemplates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$JobTemplate>>;
        get(params: Params$Resource$Projects$Locations$Jobtemplates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Jobtemplates$Get, options: MethodOptions | BodyResponseCallback<Schema$JobTemplate>, callback: BodyResponseCallback<Schema$JobTemplate>): void;
        get(params: Params$Resource$Projects$Locations$Jobtemplates$Get, callback: BodyResponseCallback<Schema$JobTemplate>): void;
        get(callback: BodyResponseCallback<Schema$JobTemplate>): void;
        /**
         * Lists job templates in the specified region.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/transcoder.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const transcoder = google.transcoder('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/cloud-platform'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await transcoder.projects.locations.jobTemplates.list({
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The `next_page_token` value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // Required. The parent location from which to retrieve the collection of job templates. Format: `projects/{project\}/locations/{location\}`
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "jobTemplates": [],
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
        list(params: Params$Resource$Projects$Locations$Jobtemplates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Jobtemplates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobTemplatesResponse>>;
        list(params: Params$Resource$Projects$Locations$Jobtemplates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Jobtemplates$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobTemplatesResponse>, callback: BodyResponseCallback<Schema$ListJobTemplatesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Jobtemplates$List, callback: BodyResponseCallback<Schema$ListJobTemplatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobTemplatesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobtemplates$Create extends StandardParameters {
        /**
         * Required. The ID to use for the job template, which will become the final component of the job template's resource name. This value should be 4-63 characters, and valid characters must match the regular expression `a-zA-Z*`.
         */
        jobTemplateId?: string;
        /**
         * Required. The parent location to create this job template. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$JobTemplate;
    }
    export interface Params$Resource$Projects$Locations$Jobtemplates$Delete extends StandardParameters {
        /**
         * Required. The name of the job template to delete. `projects/{project\}/locations/{location\}/jobTemplates/{job_template\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobtemplates$Get extends StandardParameters {
        /**
         * Required. The name of the job template to retrieve. Format: `projects/{project\}/locations/{location\}/jobTemplates/{job_template\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobtemplates$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent location from which to retrieve the collection of job templates. Format: `projects/{project\}/locations/{location\}`
         */
        parent?: string;
    }
    export {};
}
