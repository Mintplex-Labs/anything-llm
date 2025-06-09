import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace language_v1beta1 {
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
     * Cloud Natural Language API
     *
     * Provides natural language understanding technologies, such as sentiment analysis, entity recognition, entity sentiment analysis, and other text annotations, to developers.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const language = google.language('v1beta1');
     * ```
     */
    export class Language {
        context: APIRequestContext;
        documents: Resource$Documents;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The entity analysis request message.
     */
    export interface Schema$AnalyzeEntitiesRequest {
        /**
         * Input document.
         */
        document?: Schema$Document;
        /**
         * The encoding type used by the API to calculate offsets.
         */
        encodingType?: string | null;
    }
    /**
     * The entity analysis response message.
     */
    export interface Schema$AnalyzeEntitiesResponse {
        /**
         * The recognized entities in the input document.
         */
        entities?: Schema$Entity[];
        /**
         * The language of the text, which will be the same as the language specified in the request or, if not specified, the automatically-detected language. See Document.language field for more details.
         */
        language?: string | null;
    }
    /**
     * The sentiment analysis request message.
     */
    export interface Schema$AnalyzeSentimentRequest {
        /**
         * Input document.
         */
        document?: Schema$Document;
        /**
         * The encoding type used by the API to calculate sentence offsets for the sentence sentiment.
         */
        encodingType?: string | null;
    }
    /**
     * The sentiment analysis response message.
     */
    export interface Schema$AnalyzeSentimentResponse {
        /**
         * The overall sentiment of the input document.
         */
        documentSentiment?: Schema$Sentiment;
        /**
         * The language of the text, which will be the same as the language specified in the request or, if not specified, the automatically-detected language. See Document.language field for more details.
         */
        language?: string | null;
        /**
         * The sentiment for all the sentences in the document.
         */
        sentences?: Schema$Sentence[];
    }
    /**
     * The syntax analysis request message.
     */
    export interface Schema$AnalyzeSyntaxRequest {
        /**
         * Input document.
         */
        document?: Schema$Document;
        /**
         * The encoding type used by the API to calculate offsets.
         */
        encodingType?: string | null;
    }
    /**
     * The syntax analysis response message.
     */
    export interface Schema$AnalyzeSyntaxResponse {
        /**
         * The language of the text, which will be the same as the language specified in the request or, if not specified, the automatically-detected language. See Document.language field for more details.
         */
        language?: string | null;
        /**
         * Sentences in the input document.
         */
        sentences?: Schema$Sentence[];
        /**
         * Tokens, along with their syntactic information, in the input document.
         */
        tokens?: Schema$Token[];
    }
    /**
     * The request message for the text annotation API, which can perform multiple analysis types (sentiment, entities, and syntax) in one call.
     */
    export interface Schema$AnnotateTextRequest {
        /**
         * Input document.
         */
        document?: Schema$Document;
        /**
         * The encoding type used by the API to calculate offsets.
         */
        encodingType?: string | null;
        /**
         * The enabled features.
         */
        features?: Schema$Features;
    }
    /**
     * The text annotations response message.
     */
    export interface Schema$AnnotateTextResponse {
        /**
         * The overall sentiment for the document. Populated if the user enables AnnotateTextRequest.Features.extract_document_sentiment.
         */
        documentSentiment?: Schema$Sentiment;
        /**
         * Entities, along with their semantic information, in the input document. Populated if the user enables AnnotateTextRequest.Features.extract_entities.
         */
        entities?: Schema$Entity[];
        /**
         * The language of the text, which will be the same as the language specified in the request or, if not specified, the automatically-detected language. See Document.language field for more details.
         */
        language?: string | null;
        /**
         * Sentences in the input document. Populated if the user enables AnnotateTextRequest.Features.extract_syntax.
         */
        sentences?: Schema$Sentence[];
        /**
         * Tokens, along with their syntactic information, in the input document. Populated if the user enables AnnotateTextRequest.Features.extract_syntax.
         */
        tokens?: Schema$Token[];
    }
    /**
     * Represents dependency parse tree information for a token.
     */
    export interface Schema$DependencyEdge {
        /**
         * Represents the head of this token in the dependency tree. This is the index of the token which has an arc going to this token. The index is the position of the token in the array of tokens returned by the API method. If this token is a root token, then the `head_token_index` is its own index.
         */
        headTokenIndex?: number | null;
        /**
         * The parse label for the token.
         */
        label?: string | null;
    }
    /**
     * Represents the input to API methods.
     */
    export interface Schema$Document {
        /**
         * The content of the input in string format. Cloud audit logging exempt since it is based on user data.
         */
        content?: string | null;
        /**
         * The Google Cloud Storage URI where the file content is located. This URI must be of the form: gs://bucket_name/object_name. For more details, see https://cloud.google.com/storage/docs/reference-uris. NOTE: Cloud Storage object versioning is not supported.
         */
        gcsContentUri?: string | null;
        /**
         * The language of the document (if not specified, the language is automatically detected). Both ISO and BCP-47 language codes are accepted. [Language Support](https://cloud.google.com/natural-language/docs/languages) lists currently supported languages for each API method. If the language (either specified by the caller or automatically detected) is not supported by the called API method, an `INVALID_ARGUMENT` error is returned.
         */
        language?: string | null;
        /**
         * Required. If the type is not set or is `TYPE_UNSPECIFIED`, returns an `INVALID_ARGUMENT` error.
         */
        type?: string | null;
    }
    /**
     * Represents a phrase in the text that is a known entity, such as a person, an organization, or location. The API associates information, such as salience and mentions, with entities.
     */
    export interface Schema$Entity {
        /**
         * The mentions of this entity in the input document. The API currently supports proper noun mentions.
         */
        mentions?: Schema$EntityMention[];
        /**
         * Metadata associated with the entity. Currently, Wikipedia URLs and Knowledge Graph MIDs are provided, if available. The associated keys are "wikipedia_url" and "mid", respectively.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The representative name for the entity.
         */
        name?: string | null;
        /**
         * The salience score associated with the entity in the [0, 1.0] range. The salience score for an entity provides information about the importance or centrality of that entity to the entire document text. Scores closer to 0 are less salient, while scores closer to 1.0 are highly salient.
         */
        salience?: number | null;
        /**
         * The entity type.
         */
        type?: string | null;
    }
    /**
     * Represents a mention for an entity in the text. Currently, proper noun mentions are supported.
     */
    export interface Schema$EntityMention {
        /**
         * The mention text.
         */
        text?: Schema$TextSpan;
        /**
         * The type of the entity mention.
         */
        type?: string | null;
    }
    /**
     * All available features for sentiment, syntax, and semantic analysis. Setting each one to true will enable that specific analysis for the input.
     */
    export interface Schema$Features {
        /**
         * Extract document-level sentiment.
         */
        extractDocumentSentiment?: boolean | null;
        /**
         * Extract entities.
         */
        extractEntities?: boolean | null;
        /**
         * Extract syntax information.
         */
        extractSyntax?: boolean | null;
    }
    /**
     * Represents part of speech information for a token.
     */
    export interface Schema$PartOfSpeech {
        /**
         * The grammatical aspect.
         */
        aspect?: string | null;
        /**
         * The grammatical case.
         */
        case?: string | null;
        /**
         * The grammatical form.
         */
        form?: string | null;
        /**
         * The grammatical gender.
         */
        gender?: string | null;
        /**
         * The grammatical mood.
         */
        mood?: string | null;
        /**
         * The grammatical number.
         */
        number?: string | null;
        /**
         * The grammatical person.
         */
        person?: string | null;
        /**
         * The grammatical properness.
         */
        proper?: string | null;
        /**
         * The grammatical reciprocity.
         */
        reciprocity?: string | null;
        /**
         * The part of speech tag.
         */
        tag?: string | null;
        /**
         * The grammatical tense.
         */
        tense?: string | null;
        /**
         * The grammatical voice.
         */
        voice?: string | null;
    }
    /**
     * Represents a sentence in the input document.
     */
    export interface Schema$Sentence {
        /**
         * For calls to AnalyzeSentiment or if AnnotateTextRequest.Features.extract_document_sentiment is set to true, this field will contain the sentiment for the sentence.
         */
        sentiment?: Schema$Sentiment;
        /**
         * The sentence text.
         */
        text?: Schema$TextSpan;
    }
    /**
     * Represents the feeling associated with the entire text or entities in the text.
     */
    export interface Schema$Sentiment {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * DEPRECATED FIELD - This field is being deprecated in favor of score. Please refer to our documentation at https://cloud.google.com/natural-language/docs for more information.
         */
        polarity?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
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
     * Represents an output piece of text.
     */
    export interface Schema$TextSpan {
        /**
         * The API calculates the beginning offset of the content in the original document according to the EncodingType specified in the API request.
         */
        beginOffset?: number | null;
        /**
         * The content of the output text.
         */
        content?: string | null;
    }
    /**
     * Represents the smallest syntactic building block of the text.
     */
    export interface Schema$Token {
        /**
         * Dependency tree parse for this token.
         */
        dependencyEdge?: Schema$DependencyEdge;
        /**
         * [Lemma](https://en.wikipedia.org/wiki/Lemma_%28morphology%29) of the token.
         */
        lemma?: string | null;
        /**
         * Parts of speech tag for this token.
         */
        partOfSpeech?: Schema$PartOfSpeech;
        /**
         * The token text.
         */
        text?: Schema$TextSpan;
    }
    export class Resource$Documents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Finds named entities (currently proper names and common nouns) in the text along with entity types, salience, mentions for each entity, and other properties.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/language.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const language = google.language('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-language',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await language.documents.analyzeEntities({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "document": {},
         *       //   "encodingType": "my_encodingType"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "entities": [],
         *   //   "language": "my_language"
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
        analyzeEntities(params: Params$Resource$Documents$Analyzeentities, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        analyzeEntities(params?: Params$Resource$Documents$Analyzeentities, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AnalyzeEntitiesResponse>>;
        analyzeEntities(params: Params$Resource$Documents$Analyzeentities, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        analyzeEntities(params: Params$Resource$Documents$Analyzeentities, options: MethodOptions | BodyResponseCallback<Schema$AnalyzeEntitiesResponse>, callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
        analyzeEntities(params: Params$Resource$Documents$Analyzeentities, callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
        analyzeEntities(callback: BodyResponseCallback<Schema$AnalyzeEntitiesResponse>): void;
        /**
         * Analyzes the sentiment of the provided text.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/language.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const language = google.language('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-language',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await language.documents.analyzeSentiment({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "document": {},
         *       //   "encodingType": "my_encodingType"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "documentSentiment": {},
         *   //   "language": "my_language",
         *   //   "sentences": []
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
        analyzeSentiment(params: Params$Resource$Documents$Analyzesentiment, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        analyzeSentiment(params?: Params$Resource$Documents$Analyzesentiment, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AnalyzeSentimentResponse>>;
        analyzeSentiment(params: Params$Resource$Documents$Analyzesentiment, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        analyzeSentiment(params: Params$Resource$Documents$Analyzesentiment, options: MethodOptions | BodyResponseCallback<Schema$AnalyzeSentimentResponse>, callback: BodyResponseCallback<Schema$AnalyzeSentimentResponse>): void;
        analyzeSentiment(params: Params$Resource$Documents$Analyzesentiment, callback: BodyResponseCallback<Schema$AnalyzeSentimentResponse>): void;
        analyzeSentiment(callback: BodyResponseCallback<Schema$AnalyzeSentimentResponse>): void;
        /**
         * Analyzes the syntax of the text and provides sentence boundaries and tokenization along with part of speech tags, dependency trees, and other properties.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/language.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const language = google.language('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-language',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await language.documents.analyzeSyntax({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "document": {},
         *       //   "encodingType": "my_encodingType"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "language": "my_language",
         *   //   "sentences": [],
         *   //   "tokens": []
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
        analyzeSyntax(params: Params$Resource$Documents$Analyzesyntax, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        analyzeSyntax(params?: Params$Resource$Documents$Analyzesyntax, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AnalyzeSyntaxResponse>>;
        analyzeSyntax(params: Params$Resource$Documents$Analyzesyntax, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        analyzeSyntax(params: Params$Resource$Documents$Analyzesyntax, options: MethodOptions | BodyResponseCallback<Schema$AnalyzeSyntaxResponse>, callback: BodyResponseCallback<Schema$AnalyzeSyntaxResponse>): void;
        analyzeSyntax(params: Params$Resource$Documents$Analyzesyntax, callback: BodyResponseCallback<Schema$AnalyzeSyntaxResponse>): void;
        analyzeSyntax(callback: BodyResponseCallback<Schema$AnalyzeSyntaxResponse>): void;
        /**
         * A convenience method that provides all the features that analyzeSentiment, analyzeEntities, and analyzeSyntax provide in one call.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/language.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const language = google.language('v1beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-language',
         *       'https://www.googleapis.com/auth/cloud-platform',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await language.documents.annotateText({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "document": {},
         *       //   "encodingType": "my_encodingType",
         *       //   "features": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "documentSentiment": {},
         *   //   "entities": [],
         *   //   "language": "my_language",
         *   //   "sentences": [],
         *   //   "tokens": []
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
        annotateText(params: Params$Resource$Documents$Annotatetext, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        annotateText(params?: Params$Resource$Documents$Annotatetext, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AnnotateTextResponse>>;
        annotateText(params: Params$Resource$Documents$Annotatetext, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        annotateText(params: Params$Resource$Documents$Annotatetext, options: MethodOptions | BodyResponseCallback<Schema$AnnotateTextResponse>, callback: BodyResponseCallback<Schema$AnnotateTextResponse>): void;
        annotateText(params: Params$Resource$Documents$Annotatetext, callback: BodyResponseCallback<Schema$AnnotateTextResponse>): void;
        annotateText(callback: BodyResponseCallback<Schema$AnnotateTextResponse>): void;
    }
    export interface Params$Resource$Documents$Analyzeentities extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnalyzeEntitiesRequest;
    }
    export interface Params$Resource$Documents$Analyzesentiment extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnalyzeSentimentRequest;
    }
    export interface Params$Resource$Documents$Analyzesyntax extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnalyzeSyntaxRequest;
    }
    export interface Params$Resource$Documents$Annotatetext extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AnnotateTextRequest;
    }
    export {};
}
