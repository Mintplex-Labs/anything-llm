import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace firebaseml_v2beta {
    export interface Options extends GlobalOptions {
        version: 'v2beta';
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
     * Firebase ML API
     *
     * Access custom machine learning models hosted via Firebase ML.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const firebaseml = google.firebaseml('v2beta');
     * ```
     */
    export class Firebaseml {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
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
     * Content blob.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Blob {
        /**
         * Required. Raw bytes.
         */
        data?: string | null;
        /**
         * Optional. Display name of the blob. Used to provide a label or filename to distinguish blobs. This field is only returned in PromptMessage for prompt management. It is not currently used in the Gemini GenerateContent calls.
         */
        displayName?: string | null;
        /**
         * Required. The IANA standard MIME type of the source data.
         */
        mimeType?: string | null;
    }
    /**
     * A response candidate generated from the model.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Candidate {
        /**
         * Output only. Average log probability score of the candidate.
         */
        avgLogprobs?: number | null;
        /**
         * Output only. Source attribution of the generated content.
         */
        citationMetadata?: Schema$GoogleCloudAiplatformV1beta1CitationMetadata;
        /**
         * Output only. Content parts of the candidate.
         */
        content?: Schema$GoogleCloudAiplatformV1beta1Content;
        /**
         * Output only. Describes the reason the mode stopped generating tokens in more detail. This is only filled when `finish_reason` is set.
         */
        finishMessage?: string | null;
        /**
         * Output only. The reason why the model stopped generating tokens. If empty, the model has not stopped generating the tokens.
         */
        finishReason?: string | null;
        /**
         * Output only. Metadata specifies sources used to ground generated content.
         */
        groundingMetadata?: Schema$GoogleCloudAiplatformV1beta1GroundingMetadata;
        /**
         * Output only. Index of the candidate.
         */
        index?: number | null;
        /**
         * Output only. Log-likelihood scores for the response tokens and top tokens
         */
        logprobsResult?: Schema$GoogleCloudAiplatformV1beta1LogprobsResult;
        /**
         * Output only. List of ratings for the safety of a response candidate. There is at most one rating per category.
         */
        safetyRatings?: Schema$GoogleCloudAiplatformV1beta1SafetyRating[];
    }
    /**
     * Source attributions for content.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Citation {
        /**
         * Output only. End index into the content.
         */
        endIndex?: number | null;
        /**
         * Output only. License of the attribution.
         */
        license?: string | null;
        /**
         * Output only. Publication date of the attribution.
         */
        publicationDate?: Schema$Date;
        /**
         * Output only. Start index into the content.
         */
        startIndex?: number | null;
        /**
         * Output only. Title of the attribution.
         */
        title?: string | null;
        /**
         * Output only. Url reference of the attribution.
         */
        uri?: string | null;
    }
    /**
     * A collection of source attributions for a piece of content.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1CitationMetadata {
        /**
         * Output only. List of citations.
         */
        citations?: Schema$GoogleCloudAiplatformV1beta1Citation[];
    }
    /**
     * Result of executing the [ExecutableCode]. Always follows a `part` containing the [ExecutableCode].
     */
    export interface Schema$GoogleCloudAiplatformV1beta1CodeExecutionResult {
        /**
         * Required. Outcome of the code execution.
         */
        outcome?: string | null;
        /**
         * Optional. Contains stdout when code execution is successful, stderr or other description otherwise.
         */
        output?: string | null;
    }
    /**
     * The base structured datatype containing multi-part content of a message. A `Content` includes a `role` field designating the producer of the `Content` and a `parts` field containing multi-part data that contains the content of the message turn.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Content {
        /**
         * Required. Ordered `Parts` that constitute a single message. Parts may have different IANA MIME types.
         */
        parts?: Schema$GoogleCloudAiplatformV1beta1Part[];
        /**
         * Optional. The producer of the content. Must be either 'user' or 'model'. Useful to set for multi-turn conversations, otherwise can be left blank or unset.
         */
        role?: string | null;
    }
    /**
     * Request message for PredictionService.CountTokens.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1CountTokensRequest {
        /**
         * Optional. Input content.
         */
        contents?: Schema$GoogleCloudAiplatformV1beta1Content[];
        /**
         * Optional. Generation config that the model will use to generate the response.
         */
        generationConfig?: Schema$GoogleCloudAiplatformV1beta1GenerationConfig;
        /**
         * Optional. The instances that are the input to token counting call. Schema is identical to the prediction schema of the underlying model.
         */
        instances?: any[] | null;
        /**
         * Optional. The name of the publisher model requested to serve the prediction. Format: `projects/{project\}/locations/{location\}/publishers/x/models/x`
         */
        model?: string | null;
        /**
         * Optional. The user provided system instructions for the model. Note: only text should be used in parts and content in each part will be in a separate paragraph.
         */
        systemInstruction?: Schema$GoogleCloudAiplatformV1beta1Content;
        /**
         * Optional. A list of `Tools` the model may use to generate the next response. A `Tool` is a piece of code that enables the system to interact with external systems to perform an action, or set of actions, outside of knowledge and scope of the model.
         */
        tools?: Schema$GoogleCloudAiplatformV1beta1Tool[];
    }
    /**
     * Response message for PredictionService.CountTokens.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1CountTokensResponse {
        /**
         * Output only. List of modalities that were processed in the request input.
         */
        promptTokensDetails?: Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount[];
        /**
         * The total number of billable characters counted across all instances from the request.
         */
        totalBillableCharacters?: number | null;
        /**
         * The total number of tokens counted across all instances from the request.
         */
        totalTokens?: number | null;
    }
    /**
     * Describes the options to customize dynamic retrieval.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1DynamicRetrievalConfig {
        /**
         * Optional. The threshold to be used in dynamic retrieval. If not set, a system default value is used.
         */
        dynamicThreshold?: number | null;
        /**
         * The mode of the predictor to be used in dynamic retrieval.
         */
        mode?: string | null;
    }
    /**
     * Tool to search public web data, powered by Vertex AI Search and Sec4 compliance.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1EnterpriseWebSearch {
    }
    /**
     * Code generated by the model that is meant to be executed, and the result returned to the model. Generated when using the [FunctionDeclaration] tool and [FunctionCallingConfig] mode is set to [Mode.CODE].
     */
    export interface Schema$GoogleCloudAiplatformV1beta1ExecutableCode {
        /**
         * Required. The code to be executed.
         */
        code?: string | null;
        /**
         * Required. Programming language of the `code`.
         */
        language?: string | null;
    }
    /**
     * URI based data.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1FileData {
        /**
         * Optional. Display name of the file data. Used to provide a label or filename to distinguish file datas. This field is only returned in PromptMessage for prompt management. It is not currently used in the Gemini GenerateContent calls.
         */
        displayName?: string | null;
        /**
         * Required. URI.
         */
        fileUri?: string | null;
        /**
         * Required. The IANA standard MIME type of the source data.
         */
        mimeType?: string | null;
    }
    /**
     * A predicted [FunctionCall] returned from the model that contains a string representing the [FunctionDeclaration.name] and a structured JSON object containing the parameters and their values.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1FunctionCall {
        /**
         * Optional. The function parameters and values in JSON object format. See [FunctionDeclaration.parameters] for parameter details.
         */
        args?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. The unique id of the function call. If populated, the client to execute the `function_call` and return the response with the matching `id`.
         */
        id?: string | null;
        /**
         * Required. The name of the function to call. Matches [FunctionDeclaration.name].
         */
        name?: string | null;
    }
    /**
     * Function calling config.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1FunctionCallingConfig {
        /**
         * Optional. Function names to call. Only set when the Mode is ANY. Function names should match [FunctionDeclaration.name]. With mode set to ANY, model will predict a function call from the set of function names provided.
         */
        allowedFunctionNames?: string[] | null;
        /**
         * Optional. Function calling mode.
         */
        mode?: string | null;
    }
    /**
     * Structured representation of a function declaration as defined by the [OpenAPI 3.0 specification](https://spec.openapis.org/oas/v3.0.3). Included in this declaration are the function name, description, parameters and response type. This FunctionDeclaration is a representation of a block of code that can be used as a `Tool` by the model and executed by the client.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1FunctionDeclaration {
        /**
         * Optional. Description and purpose of the function. Model uses it to decide how and whether to call the function.
         */
        description?: string | null;
        /**
         * Required. The name of the function to call. Must start with a letter or an underscore. Must be a-z, A-Z, 0-9, or contain underscores, dots and dashes, with a maximum length of 64.
         */
        name?: string | null;
        /**
         * Optional. Describes the parameters to this function in JSON Schema Object format. Reflects the Open API 3.03 Parameter Object. string Key: the name of the parameter. Parameter names are case sensitive. Schema Value: the Schema defining the type used for the parameter. For function with no parameters, this can be left unset. Parameter names must start with a letter or an underscore and must only contain chars a-z, A-Z, 0-9, or underscores with a maximum length of 64. Example with 1 required and 1 optional parameter: type: OBJECT properties: param1: type: STRING param2: type: INTEGER required: - param1
         */
        parameters?: Schema$GoogleCloudAiplatformV1beta1Schema;
        /**
         * Optional. Describes the output from this function in JSON Schema format. Reflects the Open API 3.03 Response Object. The Schema defines the type used for the response value of the function.
         */
        response?: Schema$GoogleCloudAiplatformV1beta1Schema;
    }
    /**
     * The result output from a [FunctionCall] that contains a string representing the [FunctionDeclaration.name] and a structured JSON object containing any output from the function is used as context to the model. This should contain the result of a [FunctionCall] made based on model prediction.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1FunctionResponse {
        /**
         * Optional. The id of the function call this response is for. Populated by the client to match the corresponding function call `id`.
         */
        id?: string | null;
        /**
         * Required. The name of the function to call. Matches [FunctionDeclaration.name] and [FunctionCall.name].
         */
        name?: string | null;
        /**
         * Required. The function response in JSON object format. Use "output" key to specify function output and "error" key to specify error details (if any). If "output" and "error" keys are not specified, then whole "response" is treated as function output.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Request message for [PredictionService.GenerateContent].
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerateContentRequest {
        /**
         * Optional. The name of the cached content used as context to serve the prediction. Note: only used in explicit caching, where users can have control over caching (e.g. what content to cache) and enjoy guaranteed cost savings. Format: `projects/{project\}/locations/{location\}/cachedContents/{cachedContent\}`
         */
        cachedContent?: string | null;
        /**
         * Required. The content of the current conversation with the model. For single-turn queries, this is a single instance. For multi-turn queries, this is a repeated field that contains conversation history + latest request.
         */
        contents?: Schema$GoogleCloudAiplatformV1beta1Content[];
        /**
         * Optional. Generation config.
         */
        generationConfig?: Schema$GoogleCloudAiplatformV1beta1GenerationConfig;
        /**
         * Optional. The labels with user-defined metadata for the request. It is used for billing and reporting only. Label keys and values can be no longer than 63 characters (Unicode codepoints) and can only contain lowercase letters, numeric characters, underscores, and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Per request settings for blocking unsafe content. Enforced on GenerateContentResponse.candidates.
         */
        safetySettings?: Schema$GoogleCloudAiplatformV1beta1SafetySetting[];
        /**
         * Optional. The user provided system instructions for the model. Note: only text should be used in parts and content in each part will be in a separate paragraph.
         */
        systemInstruction?: Schema$GoogleCloudAiplatformV1beta1Content;
        /**
         * Optional. Tool config. This config is shared for all tools provided in the request.
         */
        toolConfig?: Schema$GoogleCloudAiplatformV1beta1ToolConfig;
        /**
         * Optional. A list of `Tools` the model may use to generate the next response. A `Tool` is a piece of code that enables the system to interact with external systems to perform an action, or set of actions, outside of knowledge and scope of the model.
         */
        tools?: Schema$GoogleCloudAiplatformV1beta1Tool[];
    }
    /**
     * Response message for [PredictionService.GenerateContent].
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse {
        /**
         * Output only. Generated candidates.
         */
        candidates?: Schema$GoogleCloudAiplatformV1beta1Candidate[];
        /**
         * Output only. Timestamp when the request is made to the server.
         */
        createTime?: string | null;
        /**
         * Output only. The model version used to generate the response.
         */
        modelVersion?: string | null;
        /**
         * Output only. Content filter results for a prompt sent in the request. Note: Sent only in the first stream chunk. Only happens when no candidates were generated due to content violations.
         */
        promptFeedback?: Schema$GoogleCloudAiplatformV1beta1GenerateContentResponsePromptFeedback;
        /**
         * Output only. response_id is used to identify each response. It is the encoding of the event_id.
         */
        responseId?: string | null;
        /**
         * Usage metadata about the response(s).
         */
        usageMetadata?: Schema$GoogleCloudAiplatformV1beta1GenerateContentResponseUsageMetadata;
    }
    /**
     * Content filter results for a prompt sent in the request.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerateContentResponsePromptFeedback {
        /**
         * Output only. Blocked reason.
         */
        blockReason?: string | null;
        /**
         * Output only. A readable block reason message.
         */
        blockReasonMessage?: string | null;
        /**
         * Output only. Safety ratings.
         */
        safetyRatings?: Schema$GoogleCloudAiplatformV1beta1SafetyRating[];
    }
    /**
     * Usage metadata about response(s).
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerateContentResponseUsageMetadata {
        /**
         * Output only. Number of tokens in the cached part in the input (the cached content).
         */
        cachedContentTokenCount?: number | null;
        /**
         * Output only. List of modalities of the cached content in the request input.
         */
        cacheTokensDetails?: Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount[];
        /**
         * Number of tokens in the response(s).
         */
        candidatesTokenCount?: number | null;
        /**
         * Output only. List of modalities that were returned in the response.
         */
        candidatesTokensDetails?: Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount[];
        /**
         * Number of tokens in the request. When `cached_content` is set, this is still the total effective prompt size meaning this includes the number of tokens in the cached content.
         */
        promptTokenCount?: number | null;
        /**
         * Output only. List of modalities that were processed in the request input.
         */
        promptTokensDetails?: Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount[];
        /**
         * Output only. Number of tokens present in thoughts output.
         */
        thoughtsTokenCount?: number | null;
        /**
         * Output only. Number of tokens present in tool-use prompt(s).
         */
        toolUsePromptTokenCount?: number | null;
        /**
         * Output only. List of modalities that were processed for tool-use request inputs.
         */
        toolUsePromptTokensDetails?: Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount[];
        /**
         * Total token count for prompt, response candidates, and tool-use prompts (if present).
         */
        totalTokenCount?: number | null;
        /**
         * Output only. Traffic type. This shows whether a request consumes Pay-As-You-Go or Provisioned Throughput quota.
         */
        trafficType?: string | null;
    }
    /**
     * Generation config.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfig {
        /**
         * Optional. If enabled, audio timestamp will be included in the request to the model.
         */
        audioTimestamp?: boolean | null;
        /**
         * Optional. Number of candidates to generate.
         */
        candidateCount?: number | null;
        /**
         * Optional. Frequency penalties.
         */
        frequencyPenalty?: number | null;
        /**
         * Optional. Logit probabilities.
         */
        logprobs?: number | null;
        /**
         * Optional. The maximum number of output tokens to generate per message.
         */
        maxOutputTokens?: number | null;
        /**
         * Optional. If specified, the media resolution specified will be used.
         */
        mediaResolution?: string | null;
        /**
         * Optional. Config for model selection.
         */
        modelConfig?: Schema$GoogleCloudAiplatformV1beta1GenerationConfigModelConfig;
        /**
         * Optional. Positive penalties.
         */
        presencePenalty?: number | null;
        /**
         * Optional. If true, export the logprobs results in response.
         */
        responseLogprobs?: boolean | null;
        /**
         * Optional. Output response mimetype of the generated candidate text. Supported mimetype: - `text/plain`: (default) Text output. - `application/json`: JSON response in the candidates. The model needs to be prompted to output the appropriate response type, otherwise the behavior is undefined. This is a preview feature.
         */
        responseMimeType?: string | null;
        /**
         * Optional. The modalities of the response.
         */
        responseModalities?: string[] | null;
        /**
         * Optional. The `Schema` object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. Represents a select subset of an [OpenAPI 3.0 schema object](https://spec.openapis.org/oas/v3.0.3#schema). If set, a compatible response_mime_type must also be set. Compatible mimetypes: `application/json`: Schema for JSON response.
         */
        responseSchema?: Schema$GoogleCloudAiplatformV1beta1Schema;
        /**
         * Optional. Routing configuration.
         */
        routingConfig?: Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfig;
        /**
         * Optional. Seed.
         */
        seed?: number | null;
        /**
         * Optional. The speech generation config.
         */
        speechConfig?: Schema$GoogleCloudAiplatformV1beta1SpeechConfig;
        /**
         * Optional. Stop sequences.
         */
        stopSequences?: string[] | null;
        /**
         * Optional. Controls the randomness of predictions.
         */
        temperature?: number | null;
        /**
         * Optional. Config for thinking features. An error will be returned if this field is set for models that don't support thinking.
         */
        thinkingConfig?: Schema$GoogleCloudAiplatformV1beta1GenerationConfigThinkingConfig;
        /**
         * Optional. If specified, top-k sampling will be used.
         */
        topK?: number | null;
        /**
         * Optional. If specified, nucleus sampling will be used.
         */
        topP?: number | null;
    }
    /**
     * Config for model selection.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfigModelConfig {
        /**
         * Required. Feature selection preference.
         */
        featureSelectionPreference?: string | null;
    }
    /**
     * The configuration for routing the request to a specific model.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfig {
        /**
         * Automated routing.
         */
        autoMode?: Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfigAutoRoutingMode;
        /**
         * Manual routing.
         */
        manualMode?: Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfigManualRoutingMode;
    }
    /**
     * When automated routing is specified, the routing will be determined by the pretrained routing model and customer provided model routing preference.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfigAutoRoutingMode {
        /**
         * The model routing preference.
         */
        modelRoutingPreference?: string | null;
    }
    /**
     * When manual routing is set, the specified model will be used directly.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfigRoutingConfigManualRoutingMode {
        /**
         * The model name to use. Only the public LLM models are accepted. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#supported-models).
         */
        modelName?: string | null;
    }
    /**
     * Config for thinking features.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GenerationConfigThinkingConfig {
        /**
         * Optional. Indicates whether to include thoughts in the response. If true, thoughts are returned only when available.
         */
        includeThoughts?: boolean | null;
        /**
         * Optional. Indicates the thinking budget in tokens. This is only applied when enable_thinking is true.
         */
        thinkingBudget?: number | null;
    }
    /**
     * Tool to retrieve public web data for grounding, powered by Google.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GoogleSearchRetrieval {
        /**
         * Specifies the dynamic retrieval configuration for the given source.
         */
        dynamicRetrievalConfig?: Schema$GoogleCloudAiplatformV1beta1DynamicRetrievalConfig;
    }
    /**
     * Grounding chunk.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GroundingChunk {
        /**
         * Grounding chunk from context retrieved by the retrieval tools.
         */
        retrievedContext?: Schema$GoogleCloudAiplatformV1beta1GroundingChunkRetrievedContext;
        /**
         * Grounding chunk from the web.
         */
        web?: Schema$GoogleCloudAiplatformV1beta1GroundingChunkWeb;
    }
    /**
     * Chunk from context retrieved by the retrieval tools.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GroundingChunkRetrievedContext {
        /**
         * Additional context for the RAG retrieval result. This is only populated when using the RAG retrieval tool.
         */
        ragChunk?: Schema$GoogleCloudAiplatformV1beta1RagChunk;
        /**
         * Text of the attribution.
         */
        text?: string | null;
        /**
         * Title of the attribution.
         */
        title?: string | null;
        /**
         * URI reference of the attribution.
         */
        uri?: string | null;
    }
    /**
     * Chunk from the web.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GroundingChunkWeb {
        /**
         * Domain of the (original) URI.
         */
        domain?: string | null;
        /**
         * Title of the chunk.
         */
        title?: string | null;
        /**
         * URI reference of the chunk.
         */
        uri?: string | null;
    }
    /**
     * Metadata returned to client when grounding is enabled.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GroundingMetadata {
        /**
         * List of supporting references retrieved from specified grounding source.
         */
        groundingChunks?: Schema$GoogleCloudAiplatformV1beta1GroundingChunk[];
        /**
         * Optional. List of grounding support.
         */
        groundingSupports?: Schema$GoogleCloudAiplatformV1beta1GroundingSupport[];
        /**
         * Optional. Output only. Retrieval metadata.
         */
        retrievalMetadata?: Schema$GoogleCloudAiplatformV1beta1RetrievalMetadata;
        /**
         * Optional. Queries executed by the retrieval tools.
         */
        retrievalQueries?: string[] | null;
        /**
         * Optional. Google search entry for the following-up web searches.
         */
        searchEntryPoint?: Schema$GoogleCloudAiplatformV1beta1SearchEntryPoint;
        /**
         * Optional. Web search queries for the following-up web search.
         */
        webSearchQueries?: string[] | null;
    }
    /**
     * Grounding support.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1GroundingSupport {
        /**
         * Confidence score of the support references. Ranges from 0 to 1. 1 is the most confident. This list must have the same size as the grounding_chunk_indices.
         */
        confidenceScores?: number[] | null;
        /**
         * A list of indices (into 'grounding_chunk') specifying the citations associated with the claim. For instance [1,3,4] means that grounding_chunk[1], grounding_chunk[3], grounding_chunk[4] are the retrieved content attributed to the claim.
         */
        groundingChunkIndices?: number[] | null;
        /**
         * Segment of the content this support belongs to.
         */
        segment?: Schema$GoogleCloudAiplatformV1beta1Segment;
    }
    /**
     * Logprobs Result
     */
    export interface Schema$GoogleCloudAiplatformV1beta1LogprobsResult {
        /**
         * Length = total number of decoding steps. The chosen candidates may or may not be in top_candidates.
         */
        chosenCandidates?: Schema$GoogleCloudAiplatformV1beta1LogprobsResultCandidate[];
        /**
         * Length = total number of decoding steps.
         */
        topCandidates?: Schema$GoogleCloudAiplatformV1beta1LogprobsResultTopCandidates[];
    }
    /**
     * Candidate for the logprobs token and score.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1LogprobsResultCandidate {
        /**
         * The candidate's log probability.
         */
        logProbability?: number | null;
        /**
         * The candidate's token string value.
         */
        token?: string | null;
        /**
         * The candidate's token id value.
         */
        tokenId?: number | null;
    }
    /**
     * Candidates with top log probabilities at each decoding step.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1LogprobsResultTopCandidates {
        /**
         * Sorted by log probability in descending order.
         */
        candidates?: Schema$GoogleCloudAiplatformV1beta1LogprobsResultCandidate[];
    }
    /**
     * Represents token counting info for a single modality.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1ModalityTokenCount {
        /**
         * The modality associated with this token count.
         */
        modality?: string | null;
        /**
         * Number of tokens.
         */
        tokenCount?: number | null;
    }
    /**
     * A datatype containing media that is part of a multi-part `Content` message. A `Part` consists of data which has an associated datatype. A `Part` can only contain one of the accepted types in `Part.data`. A `Part` must have a fixed IANA MIME type identifying the type and subtype of the media if `inline_data` or `file_data` field is filled with raw bytes.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Part {
        /**
         * Optional. Result of executing the [ExecutableCode].
         */
        codeExecutionResult?: Schema$GoogleCloudAiplatformV1beta1CodeExecutionResult;
        /**
         * Optional. Code generated by the model that is meant to be executed.
         */
        executableCode?: Schema$GoogleCloudAiplatformV1beta1ExecutableCode;
        /**
         * Optional. URI based data.
         */
        fileData?: Schema$GoogleCloudAiplatformV1beta1FileData;
        /**
         * Optional. A predicted [FunctionCall] returned from the model that contains a string representing the [FunctionDeclaration.name] with the parameters and their values.
         */
        functionCall?: Schema$GoogleCloudAiplatformV1beta1FunctionCall;
        /**
         * Optional. The result output of a [FunctionCall] that contains a string representing the [FunctionDeclaration.name] and a structured JSON object containing any output from the function call. It is used as context to the model.
         */
        functionResponse?: Schema$GoogleCloudAiplatformV1beta1FunctionResponse;
        /**
         * Optional. Inlined bytes data.
         */
        inlineData?: Schema$GoogleCloudAiplatformV1beta1Blob;
        /**
         * Optional. Text part (can be code).
         */
        text?: string | null;
        /**
         * Output only. Indicates if the part is thought from the model.
         */
        thought?: boolean | null;
        /**
         * Optional. Video metadata. The metadata should only be specified while the video data is presented in inline_data or file_data.
         */
        videoMetadata?: Schema$GoogleCloudAiplatformV1beta1VideoMetadata;
    }
    /**
     * The configuration for the prebuilt speaker to use.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1PrebuiltVoiceConfig {
        /**
         * The name of the preset voice to use.
         */
        voiceName?: string | null;
    }
    /**
     * A RagChunk includes the content of a chunk of a RagFile, and associated metadata.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagChunk {
        /**
         * If populated, represents where the chunk starts and ends in the document.
         */
        pageSpan?: Schema$GoogleCloudAiplatformV1beta1RagChunkPageSpan;
        /**
         * The content of the chunk.
         */
        text?: string | null;
    }
    /**
     * Represents where the chunk starts and ends in the document.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagChunkPageSpan {
        /**
         * Page where chunk starts in the document. Inclusive. 1-indexed.
         */
        firstPage?: number | null;
        /**
         * Page where chunk ends in the document. Inclusive. 1-indexed.
         */
        lastPage?: number | null;
    }
    /**
     * Specifies the context retrieval config.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfig {
        /**
         * Optional. Config for filters.
         */
        filter?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigFilter;
        /**
         * Optional. Config for Hybrid Search.
         */
        hybridSearch?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigHybridSearch;
        /**
         * Optional. Config for ranking and reranking.
         */
        ranking?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRanking;
        /**
         * Optional. The number of contexts to retrieve.
         */
        topK?: number | null;
    }
    /**
     * Config for filters.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigFilter {
        /**
         * Optional. String for metadata filtering.
         */
        metadataFilter?: string | null;
        /**
         * Optional. Only returns contexts with vector distance smaller than the threshold.
         */
        vectorDistanceThreshold?: number | null;
        /**
         * Optional. Only returns contexts with vector similarity larger than the threshold.
         */
        vectorSimilarityThreshold?: number | null;
    }
    /**
     * Config for Hybrid Search.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigHybridSearch {
        /**
         * Optional. Alpha value controls the weight between dense and sparse vector search results. The range is [0, 1], while 0 means sparse vector search only and 1 means dense vector search only. The default value is 0.5 which balances sparse and dense vector search equally.
         */
        alpha?: number | null;
    }
    /**
     * Config for ranking and reranking.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRanking {
        /**
         * Optional. Config for LlmRanker.
         */
        llmRanker?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRankingLlmRanker;
        /**
         * Optional. Config for Rank Service.
         */
        rankService?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRankingRankService;
    }
    /**
     * Config for LlmRanker.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRankingLlmRanker {
        /**
         * Optional. The model name used for ranking. See [Supported models](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference#supported-models).
         */
        modelName?: string | null;
    }
    /**
     * Config for Rank Service.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfigRankingRankService {
        /**
         * Optional. The model name of the rank service. Format: `semantic-ranker-512@latest`
         */
        modelName?: string | null;
    }
    /**
     * Defines a retrieval tool that model can call to access external knowledge.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Retrieval {
        /**
         * Optional. Deprecated. This option is no longer supported.
         */
        disableAttribution?: boolean | null;
        /**
         * Set to use data source powered by Vertex AI Search.
         */
        vertexAiSearch?: Schema$GoogleCloudAiplatformV1beta1VertexAISearch;
        /**
         * Set to use data source powered by Vertex RAG store. User data is uploaded via the VertexRagDataService.
         */
        vertexRagStore?: Schema$GoogleCloudAiplatformV1beta1VertexRagStore;
    }
    /**
     * Retrieval config.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RetrievalConfig {
        /**
         * The language code of the user.
         */
        languageCode?: string | null;
        /**
         * The location of the user.
         */
        latLng?: Schema$LatLng;
    }
    /**
     * Metadata related to retrieval in the grounding flow.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1RetrievalMetadata {
        /**
         * Optional. Score indicating how likely information from Google Search could help answer the prompt. The score is in the range `[0, 1]`, where 0 is the least likely and 1 is the most likely. This score is only populated when Google Search grounding and dynamic retrieval is enabled. It will be compared to the threshold to determine whether to trigger Google Search.
         */
        googleSearchDynamicRetrievalScore?: number | null;
    }
    /**
     * Safety rating corresponding to the generated content.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1SafetyRating {
        /**
         * Output only. Indicates whether the content was filtered out because of this rating.
         */
        blocked?: boolean | null;
        /**
         * Output only. Harm category.
         */
        category?: string | null;
        /**
         * Output only. Harm probability levels in the content.
         */
        probability?: string | null;
        /**
         * Output only. Harm probability score.
         */
        probabilityScore?: number | null;
        /**
         * Output only. Harm severity levels in the content.
         */
        severity?: string | null;
        /**
         * Output only. Harm severity score.
         */
        severityScore?: number | null;
    }
    /**
     * Safety settings.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1SafetySetting {
        /**
         * Required. Harm category.
         */
        category?: string | null;
        /**
         * Optional. Specify if the threshold is used for probability or severity score. If not specified, the threshold is used for probability score.
         */
        method?: string | null;
        /**
         * Required. The harm block threshold.
         */
        threshold?: string | null;
    }
    /**
     * Schema is used to define the format of input/output data. Represents a select subset of an [OpenAPI 3.0 schema object](https://spec.openapis.org/oas/v3.0.3#schema-object). More fields may be added in the future as needed.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Schema {
        /**
         * Optional. Can either be a boolean or an object; controls the presence of additional properties.
         */
        additionalProperties?: any | null;
        /**
         * Optional. The value should be validated against any (one or more) of the subschemas in the list.
         */
        anyOf?: Schema$GoogleCloudAiplatformV1beta1Schema[];
        /**
         * Optional. Default value of the data.
         */
        default?: any | null;
        /**
         * Optional. A map of definitions for use by `ref` Only allowed at the root of the schema.
         */
        defs?: {
            [key: string]: Schema$GoogleCloudAiplatformV1beta1Schema;
        } | null;
        /**
         * Optional. The description of the data.
         */
        description?: string | null;
        /**
         * Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as : {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]\} 2. We can define apartment number as : {type:INTEGER, format:enum, enum:["101", "201", "301"]\}
         */
        enum?: string[] | null;
        /**
         * Optional. Example of the object. Will only populated when the object is the root.
         */
        example?: any | null;
        /**
         * Optional. The format of the data. Supported formats: for NUMBER type: "float", "double" for INTEGER type: "int32", "int64" for STRING type: "email", "byte", etc
         */
        format?: string | null;
        /**
         * Optional. SCHEMA FIELDS FOR TYPE ARRAY Schema of the elements of Type.ARRAY.
         */
        items?: Schema$GoogleCloudAiplatformV1beta1Schema;
        /**
         * Optional. Maximum value of the Type.INTEGER and Type.NUMBER
         */
        maximum?: number | null;
        /**
         * Optional. Maximum number of the elements for Type.ARRAY.
         */
        maxItems?: string | null;
        /**
         * Optional. Maximum length of the Type.STRING
         */
        maxLength?: string | null;
        /**
         * Optional. Maximum number of the properties for Type.OBJECT.
         */
        maxProperties?: string | null;
        /**
         * Optional. SCHEMA FIELDS FOR TYPE INTEGER and NUMBER Minimum value of the Type.INTEGER and Type.NUMBER
         */
        minimum?: number | null;
        /**
         * Optional. Minimum number of the elements for Type.ARRAY.
         */
        minItems?: string | null;
        /**
         * Optional. SCHEMA FIELDS FOR TYPE STRING Minimum length of the Type.STRING
         */
        minLength?: string | null;
        /**
         * Optional. Minimum number of the properties for Type.OBJECT.
         */
        minProperties?: string | null;
        /**
         * Optional. Indicates if the value may be null.
         */
        nullable?: boolean | null;
        /**
         * Optional. Pattern of the Type.STRING to restrict a string to a regular expression.
         */
        pattern?: string | null;
        /**
         * Optional. SCHEMA FIELDS FOR TYPE OBJECT Properties of Type.OBJECT.
         */
        properties?: {
            [key: string]: Schema$GoogleCloudAiplatformV1beta1Schema;
        } | null;
        /**
         * Optional. The order of the properties. Not a standard field in open api spec. Only used to support the order of the properties.
         */
        propertyOrdering?: string[] | null;
        /**
         * Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring
         */
        ref?: string | null;
        /**
         * Optional. Required properties of Type.OBJECT.
         */
        required?: string[] | null;
        /**
         * Optional. The title of the Schema.
         */
        title?: string | null;
        /**
         * Optional. The type of the data.
         */
        type?: string | null;
    }
    /**
     * Google search entry point.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1SearchEntryPoint {
        /**
         * Optional. Web content snippet that can be embedded in a web page or an app webview.
         */
        renderedContent?: string | null;
        /**
         * Optional. Base64 encoded JSON representing array of tuple.
         */
        sdkBlob?: string | null;
    }
    /**
     * Segment of the content.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Segment {
        /**
         * Output only. End index in the given Part, measured in bytes. Offset from the start of the Part, exclusive, starting at zero.
         */
        endIndex?: number | null;
        /**
         * Output only. The index of a Part object within its parent Content object.
         */
        partIndex?: number | null;
        /**
         * Output only. Start index in the given Part, measured in bytes. Offset from the start of the Part, inclusive, starting at zero.
         */
        startIndex?: number | null;
        /**
         * Output only. The text corresponding to the segment from the response.
         */
        text?: string | null;
    }
    /**
     * The speech generation config.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1SpeechConfig {
        /**
         * Optional. Language code (ISO 639. e.g. en-US) for the speech synthesization.
         */
        languageCode?: string | null;
        /**
         * The configuration for the speaker to use.
         */
        voiceConfig?: Schema$GoogleCloudAiplatformV1beta1VoiceConfig;
    }
    /**
     * Tool details that the model may use to generate response. A `Tool` is a piece of code that enables the system to interact with external systems to perform an action, or set of actions, outside of knowledge and scope of the model. A Tool object should contain exactly one type of Tool (e.g FunctionDeclaration, Retrieval or GoogleSearchRetrieval).
     */
    export interface Schema$GoogleCloudAiplatformV1beta1Tool {
        /**
         * Optional. CodeExecution tool type. Enables the model to execute code as part of generation.
         */
        codeExecution?: Schema$GoogleCloudAiplatformV1beta1ToolCodeExecution;
        /**
         * Optional. Tool to support searching public web data, powered by Vertex AI Search and Sec4 compliance.
         */
        enterpriseWebSearch?: Schema$GoogleCloudAiplatformV1beta1EnterpriseWebSearch;
        /**
         * Optional. Function tool type. One or more function declarations to be passed to the model along with the current user query. Model may decide to call a subset of these functions by populating FunctionCall in the response. User should provide a FunctionResponse for each function call in the next turn. Based on the function responses, Model will generate the final response back to the user. Maximum 128 function declarations can be provided.
         */
        functionDeclarations?: Schema$GoogleCloudAiplatformV1beta1FunctionDeclaration[];
        /**
         * Optional. GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google.
         */
        googleSearch?: Schema$GoogleCloudAiplatformV1beta1ToolGoogleSearch;
        /**
         * Optional. GoogleSearchRetrieval tool type. Specialized retrieval tool that is powered by Google search.
         */
        googleSearchRetrieval?: Schema$GoogleCloudAiplatformV1beta1GoogleSearchRetrieval;
        /**
         * Optional. Retrieval tool type. System will always execute the provided retrieval tool(s) to get external knowledge to answer the prompt. Retrieval results are presented to the model for generation.
         */
        retrieval?: Schema$GoogleCloudAiplatformV1beta1Retrieval;
    }
    /**
     * Tool that executes code generated by the model, and automatically returns the result to the model. See also [ExecutableCode]and [CodeExecutionResult] which are input and output to this tool.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1ToolCodeExecution {
    }
    /**
     * Tool config. This config is shared for all tools provided in the request.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1ToolConfig {
        /**
         * Optional. Function calling config.
         */
        functionCallingConfig?: Schema$GoogleCloudAiplatformV1beta1FunctionCallingConfig;
        /**
         * Optional. Retrieval config.
         */
        retrievalConfig?: Schema$GoogleCloudAiplatformV1beta1RetrievalConfig;
    }
    /**
     * GoogleSearch tool type. Tool to support Google Search in Model. Powered by Google.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1ToolGoogleSearch {
    }
    /**
     * Retrieve from Vertex AI Search datastore or engine for grounding. datastore and engine are mutually exclusive. See https://cloud.google.com/products/agent-builder
     */
    export interface Schema$GoogleCloudAiplatformV1beta1VertexAISearch {
        /**
         * Optional. Fully-qualified Vertex AI Search data store resource ID. Format: `projects/{project\}/locations/{location\}/collections/{collection\}/dataStores/{dataStore\}`
         */
        datastore?: string | null;
        /**
         * Optional. Fully-qualified Vertex AI Search engine resource ID. Format: `projects/{project\}/locations/{location\}/collections/{collection\}/engines/{engine\}`
         */
        engine?: string | null;
        /**
         * Optional. Filter strings to be passed to the search API.
         */
        filter?: string | null;
        /**
         * Optional. Number of search results to return per query. The default value is 10. The maximumm allowed value is 10.
         */
        maxResults?: number | null;
    }
    /**
     * Retrieve from Vertex RAG Store for grounding.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1VertexRagStore {
        /**
         * Optional. Deprecated. Please use rag_resources instead.
         */
        ragCorpora?: string[] | null;
        /**
         * Optional. The representation of the rag source. It can be used to specify corpus only or ragfiles. Currently only support one corpus or multiple files from one corpus. In the future we may open up multiple corpora support.
         */
        ragResources?: Schema$GoogleCloudAiplatformV1beta1VertexRagStoreRagResource[];
        /**
         * Optional. The retrieval config for the Rag query.
         */
        ragRetrievalConfig?: Schema$GoogleCloudAiplatformV1beta1RagRetrievalConfig;
        /**
         * Optional. Number of top k results to return from the selected corpora.
         */
        similarityTopK?: number | null;
        /**
         * Optional. Only return results with vector distance smaller than the threshold.
         */
        vectorDistanceThreshold?: number | null;
    }
    /**
     * The definition of the Rag resource.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1VertexRagStoreRagResource {
        /**
         * Optional. RagCorpora resource name. Format: `projects/{project\}/locations/{location\}/ragCorpora/{rag_corpus\}`
         */
        ragCorpus?: string | null;
        /**
         * Optional. rag_file_id. The files should be in the same rag_corpus set in rag_corpus field.
         */
        ragFileIds?: string[] | null;
    }
    /**
     * Metadata describes the input video content.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1VideoMetadata {
        /**
         * Optional. The end offset of the video.
         */
        endOffset?: string | null;
        /**
         * Optional. The start offset of the video.
         */
        startOffset?: string | null;
    }
    /**
     * The configuration for the voice to use.
     */
    export interface Schema$GoogleCloudAiplatformV1beta1VoiceConfig {
        /**
         * The configuration for the prebuilt voice to use.
         */
        prebuiltVoiceConfig?: Schema$GoogleCloudAiplatformV1beta1PrebuiltVoiceConfig;
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
     * This is returned in the longrunning operations for create/update.
     */
    export interface Schema$ModelOperationMetadata {
        basicOperationStatus?: string | null;
        /**
         * The name of the model we are creating/updating The name must have the form `projects/{project_id\}/models/{model_id\}`
         */
        name?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        publishers: Resource$Projects$Locations$Publishers;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Publishers {
        context: APIRequestContext;
        models: Resource$Projects$Locations$Publishers$Models;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Publishers$Models {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Perform a token counting.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        countTokens(params: Params$Resource$Projects$Locations$Publishers$Models$Counttokens, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        countTokens(params?: Params$Resource$Projects$Locations$Publishers$Models$Counttokens, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudAiplatformV1beta1CountTokensResponse>>;
        countTokens(params: Params$Resource$Projects$Locations$Publishers$Models$Counttokens, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        countTokens(params: Params$Resource$Projects$Locations$Publishers$Models$Counttokens, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1CountTokensResponse>, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1CountTokensResponse>): void;
        countTokens(params: Params$Resource$Projects$Locations$Publishers$Models$Counttokens, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1CountTokensResponse>): void;
        countTokens(callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1CountTokensResponse>): void;
        /**
         * Generate content with multimodal inputs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Generatecontent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateContent(params?: Params$Resource$Projects$Locations$Publishers$Models$Generatecontent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>>;
        generateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Generatecontent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Generatecontent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
        generateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Generatecontent, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
        generateContent(callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
        /**
         * Generate content with multimodal inputs with streaming support.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        streamGenerateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        streamGenerateContent(params?: Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>>;
        streamGenerateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        streamGenerateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
        streamGenerateContent(params: Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent, callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
        streamGenerateContent(callback: BodyResponseCallback<Schema$GoogleCloudAiplatformV1beta1GenerateContentResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Publishers$Models$Counttokens extends StandardParameters {
        /**
         * Required. The name of the Endpoint requested to perform token counting. Format: `projects/{project\}/locations/{location\}/endpoints/{endpoint\}`
         */
        endpoint?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudAiplatformV1beta1CountTokensRequest;
    }
    export interface Params$Resource$Projects$Locations$Publishers$Models$Generatecontent extends StandardParameters {
        /**
         * Required. The fully qualified name of the publisher model or tuned model endpoint to use. Publisher model format: `projects/{project\}/locations/{location\}/publishers/x/models/x` Tuned model endpoint format: `projects/{project\}/locations/{location\}/endpoints/{endpoint\}`
         */
        model?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudAiplatformV1beta1GenerateContentRequest;
    }
    export interface Params$Resource$Projects$Locations$Publishers$Models$Streamgeneratecontent extends StandardParameters {
        /**
         * Required. The fully qualified name of the publisher model or tuned model endpoint to use. Publisher model format: `projects/{project\}/locations/{location\}/publishers/x/models/x` Tuned model endpoint format: `projects/{project\}/locations/{location\}/endpoints/{endpoint\}`
         */
        model?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudAiplatformV1beta1GenerateContentRequest;
    }
    export {};
}
