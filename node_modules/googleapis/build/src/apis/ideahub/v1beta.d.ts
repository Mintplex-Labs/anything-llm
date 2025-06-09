import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace ideahub_v1beta {
    export interface Options extends GlobalOptions {
        version: 'v1beta';
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
     * Idea Hub API
     *
     * This is an invitation-only API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const ideahub = google.ideahub('v1beta');
     * ```
     */
    export class Ideahub {
        context: APIRequestContext;
        platforms: Resource$Platforms;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents locales that are available for a web property.
     */
    export interface Schema$GoogleSearchIdeahubV1betaAvailableLocale {
        /**
         * A string in BCP 47 format, without a resource prefix.
         */
        locale?: string | null;
        /**
         * A string in BCP 47 format, prefixed with the platform and property name, and "locales/". Format: platforms/{platform\}/properties/{property\}/locales/{locale\}
         */
        name?: string | null;
    }
    /**
     * A single Idea that we want to show the end user.
     */
    export interface Schema$GoogleSearchIdeahubV1betaIdea {
        /**
         * Unique identifier for the idea. Format: ideas/{ideaId\}
         */
        name?: string | null;
        /**
         * The idea’s text.
         */
        text?: string | null;
        /**
         * The Topics that match the idea.
         */
        topics?: Schema$GoogleSearchIdeahubV1betaTopic[];
    }
    /**
     * An idea activity entry.
     */
    export interface Schema$GoogleSearchIdeahubV1betaIdeaActivity {
        /**
         * The Idea IDs for this entry. If empty, topics should be set.
         */
        ideas?: string[] | null;
        /**
         * Unique identifier for the idea activity. The name is ignored when creating an idea activity. Format: platforms/{platform\}/properties/{property\}/ideaActivities/{idea_activity\}
         */
        name?: string | null;
        /**
         * The Topic IDs for this entry. If empty, ideas should be set.
         */
        topics?: string[] | null;
        /**
         * The type of activity performed.
         */
        type?: string | null;
        /**
         * The uri the activity relates to.
         */
        uri?: string | null;
    }
    /**
     * Represents idea state specific to a web property.
     */
    export interface Schema$GoogleSearchIdeahubV1betaIdeaState {
        /**
         * Whether the idea is dismissed.
         */
        dismissed?: boolean | null;
        /**
         * Unique identifier for the idea state. Format: platforms/{platform\}/properties/{property\}/ideaStates/{idea_state\}
         */
        name?: string | null;
        /**
         * Whether the idea is saved.
         */
        saved?: boolean | null;
    }
    /**
     * Response for whether ideas are available for a given web property on a platform, for the currently logged-in user.
     */
    export interface Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse {
        /**
         * Locales for which ideas are available for the given Creator.
         */
        availableLocales?: Schema$GoogleSearchIdeahubV1betaAvailableLocale[];
        /**
         * A token that can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    export interface Schema$GoogleSearchIdeahubV1betaListIdeasResponse {
        /**
         * Results for the ListIdeasRequest.
         */
        ideas?: Schema$GoogleSearchIdeahubV1betaIdea[];
        /**
         * Used to fetch the next page in a subsequent request.
         */
        nextPageToken?: string | null;
    }
    /**
     * Represents a Topic umbrella for a list of questions that a Creator may want to respond to.
     */
    export interface Schema$GoogleSearchIdeahubV1betaTopic {
        /**
         * String displayed to the creator indicating the name of the Topic.
         */
        displayName?: string | null;
        /**
         * The mID of the topic.
         */
        mid?: string | null;
        /**
         * Unique identifier for the topic. Format: topics/{topic\}
         */
        name?: string | null;
    }
    /**
     * Represents topic state specific to a web property.
     */
    export interface Schema$GoogleSearchIdeahubV1betaTopicState {
        /**
         * Whether the topic is dismissed.
         */
        dismissed?: boolean | null;
        /**
         * Unique identifier for the topic state. Format: platforms/{platform\}/properties/{property\}/topicStates/{topic_state\}
         */
        name?: string | null;
        /**
         * Whether the topic is saved.
         */
        saved?: boolean | null;
    }
    export class Resource$Platforms {
        context: APIRequestContext;
        properties: Resource$Platforms$Properties;
        constructor(context: APIRequestContext);
    }
    export class Resource$Platforms$Properties {
        context: APIRequestContext;
        ideaActivities: Resource$Platforms$Properties$Ideaactivities;
        ideas: Resource$Platforms$Properties$Ideas;
        ideaStates: Resource$Platforms$Properties$Ideastates;
        locales: Resource$Platforms$Properties$Locales;
        topicStates: Resource$Platforms$Properties$Topicstates;
        constructor(context: APIRequestContext);
    }
    export class Resource$Platforms$Properties$Ideaactivities {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an idea activity entry.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/ideahub.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const ideahub = google.ideahub('v1beta');
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
         *   const res = await ideahub.platforms.properties.ideaActivities.create({
         *     // Required. The parent resource where this idea activity will be created. Format: platforms/{platform\}/property/{property\}
         *     parent: 'platforms/my-platform/properties/my-propertie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "ideas": [],
         *       //   "name": "my_name",
         *       //   "topics": [],
         *       //   "type": "my_type",
         *       //   "uri": "my_uri"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "ideas": [],
         *   //   "name": "my_name",
         *   //   "topics": [],
         *   //   "type": "my_type",
         *   //   "uri": "my_uri"
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
        create(params: Params$Resource$Platforms$Properties$Ideaactivities$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Platforms$Properties$Ideaactivities$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleSearchIdeahubV1betaIdeaActivity>>;
        create(params: Params$Resource$Platforms$Properties$Ideaactivities$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Platforms$Properties$Ideaactivities$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaActivity>, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaActivity>): void;
        create(params: Params$Resource$Platforms$Properties$Ideaactivities$Create, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaActivity>): void;
        create(callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaActivity>): void;
    }
    export interface Params$Resource$Platforms$Properties$Ideaactivities$Create extends StandardParameters {
        /**
         * Required. The parent resource where this idea activity will be created. Format: platforms/{platform\}/property/{property\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleSearchIdeahubV1betaIdeaActivity;
    }
    export class Resource$Platforms$Properties$Ideas {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List ideas for a given Creator and filter and sort options.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/ideahub.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const ideahub = google.ideahub('v1beta');
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
         *   const res = await ideahub.platforms.properties.ideas.list({
         *     // Allows filtering. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions are implicitly combined, as if the `AND` operator was always used. The `OR` operator is currently unsupported. * Supported functions: - `saved(bool)`: If set to true, fetches only saved ideas. If set to false, fetches all except saved ideas. Can't be simultaneously used with `dismissed(bool)`. - `dismissed(bool)`: If set to true, fetches only dismissed ideas. Can't be simultaneously used with `saved(bool)`. The `false` value is currently unsupported. Examples: * `saved(true)` * `saved(false)` * `dismissed(true)` The length of this field should be no more than 500 characters.
         *     filter: 'placeholder-value',
         *     // Order semantics described below.
         *     orderBy: 'placeholder-value',
         *     // The maximum number of ideas per page. If unspecified, at most 10 ideas will be returned. The maximum value is 2000; values above 2000 will be coerced to 2000.
         *     pageSize: 'placeholder-value',
         *     // Used to fetch next page.
         *     pageToken: 'placeholder-value',
         *     // Required. If defined, specifies the creator for which to filter by. Format: publishers/{publisher\}/properties/{property\}
         *     parent: 'platforms/my-platform/properties/my-propertie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "ideas": [],
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
        list(params: Params$Resource$Platforms$Properties$Ideas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Platforms$Properties$Ideas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleSearchIdeahubV1betaListIdeasResponse>>;
        list(params: Params$Resource$Platforms$Properties$Ideas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Platforms$Properties$Ideas$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListIdeasResponse>, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListIdeasResponse>): void;
        list(params: Params$Resource$Platforms$Properties$Ideas$List, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListIdeasResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListIdeasResponse>): void;
    }
    export interface Params$Resource$Platforms$Properties$Ideas$List extends StandardParameters {
        /**
         * Allows filtering. Supported syntax: * Filter expressions are made up of one or more restrictions. * Restrictions are implicitly combined, as if the `AND` operator was always used. The `OR` operator is currently unsupported. * Supported functions: - `saved(bool)`: If set to true, fetches only saved ideas. If set to false, fetches all except saved ideas. Can't be simultaneously used with `dismissed(bool)`. - `dismissed(bool)`: If set to true, fetches only dismissed ideas. Can't be simultaneously used with `saved(bool)`. The `false` value is currently unsupported. Examples: * `saved(true)` * `saved(false)` * `dismissed(true)` The length of this field should be no more than 500 characters.
         */
        filter?: string;
        /**
         * Order semantics described below.
         */
        orderBy?: string;
        /**
         * The maximum number of ideas per page. If unspecified, at most 10 ideas will be returned. The maximum value is 2000; values above 2000 will be coerced to 2000.
         */
        pageSize?: number;
        /**
         * Used to fetch next page.
         */
        pageToken?: string;
        /**
         * Required. If defined, specifies the creator for which to filter by. Format: publishers/{publisher\}/properties/{property\}
         */
        parent?: string;
    }
    export class Resource$Platforms$Properties$Ideastates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Update an idea state resource.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/ideahub.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const ideahub = google.ideahub('v1beta');
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
         *   const res = await ideahub.platforms.properties.ideaStates.patch({
         *     // Unique identifier for the idea state. Format: platforms/{platform\}/properties/{property\}/ideaStates/{idea_state\}
         *     name: 'platforms/my-platform/properties/my-propertie/ideaStates/my-ideaState',
         *     // The list of fields to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dismissed": false,
         *       //   "name": "my_name",
         *       //   "saved": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dismissed": false,
         *   //   "name": "my_name",
         *   //   "saved": false
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
        patch(params: Params$Resource$Platforms$Properties$Ideastates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Platforms$Properties$Ideastates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleSearchIdeahubV1betaIdeaState>>;
        patch(params: Params$Resource$Platforms$Properties$Ideastates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Platforms$Properties$Ideastates$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaState>, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaState>): void;
        patch(params: Params$Resource$Platforms$Properties$Ideastates$Patch, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaState>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaIdeaState>): void;
    }
    export interface Params$Resource$Platforms$Properties$Ideastates$Patch extends StandardParameters {
        /**
         * Unique identifier for the idea state. Format: platforms/{platform\}/properties/{property\}/ideaStates/{idea_state\}
         */
        name?: string;
        /**
         * The list of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleSearchIdeahubV1betaIdeaState;
    }
    export class Resource$Platforms$Properties$Locales {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns which locales ideas are available in for a given Creator.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/ideahub.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const ideahub = google.ideahub('v1beta');
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
         *   const res = await ideahub.platforms.properties.locales.list({
         *     // The maximum number of locales to return. The service may return fewer than this value. If unspecified, at most 100 locales will be returned. The maximum value is 100; values above 100 will be coerced to 100.
         *     pageSize: 'placeholder-value',
         *     // A page token, received from a previous `ListAvailableLocales` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAvailableLocales` must match the call that provided the page token.
         *     pageToken: 'placeholder-value',
         *     // Required. The web property to check idea availability for Format: platforms/{platform\}/property/{property\}
         *     parent: 'platforms/my-platform/properties/my-propertie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "availableLocales": [],
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
        list(params: Params$Resource$Platforms$Properties$Locales$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Platforms$Properties$Locales$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse>>;
        list(params: Params$Resource$Platforms$Properties$Locales$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Platforms$Properties$Locales$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse>, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse>): void;
        list(params: Params$Resource$Platforms$Properties$Locales$List, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaListAvailableLocalesResponse>): void;
    }
    export interface Params$Resource$Platforms$Properties$Locales$List extends StandardParameters {
        /**
         * The maximum number of locales to return. The service may return fewer than this value. If unspecified, at most 100 locales will be returned. The maximum value is 100; values above 100 will be coerced to 100.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListAvailableLocales` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAvailableLocales` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The web property to check idea availability for Format: platforms/{platform\}/property/{property\}
         */
        parent?: string;
    }
    export class Resource$Platforms$Properties$Topicstates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Update a topic state resource.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/ideahub.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const ideahub = google.ideahub('v1beta');
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
         *   const res = await ideahub.platforms.properties.topicStates.patch({
         *     // Unique identifier for the topic state. Format: platforms/{platform\}/properties/{property\}/topicStates/{topic_state\}
         *     name: 'platforms/my-platform/properties/my-propertie/topicStates/my-topicState',
         *     // The list of fields to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "dismissed": false,
         *       //   "name": "my_name",
         *       //   "saved": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dismissed": false,
         *   //   "name": "my_name",
         *   //   "saved": false
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
        patch(params: Params$Resource$Platforms$Properties$Topicstates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Platforms$Properties$Topicstates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleSearchIdeahubV1betaTopicState>>;
        patch(params: Params$Resource$Platforms$Properties$Topicstates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Platforms$Properties$Topicstates$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaTopicState>, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaTopicState>): void;
        patch(params: Params$Resource$Platforms$Properties$Topicstates$Patch, callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaTopicState>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleSearchIdeahubV1betaTopicState>): void;
    }
    export interface Params$Resource$Platforms$Properties$Topicstates$Patch extends StandardParameters {
        /**
         * Unique identifier for the topic state. Format: platforms/{platform\}/properties/{property\}/topicStates/{topic_state\}
         */
        name?: string;
        /**
         * The list of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleSearchIdeahubV1betaTopicState;
    }
    export {};
}
