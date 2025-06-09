import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace gamesManagement_v1management {
    export interface Options extends GlobalOptions {
        version: 'v1management';
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
     * Google Play Games Services Management API
     *
     * The Google Play Games Management API allows developers to manage resources from the Google Play Game service.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const gamesManagement = google.gamesManagement('v1management');
     * ```
     */
    export class Gamesmanagement {
        context: APIRequestContext;
        achievements: Resource$Achievements;
        applications: Resource$Applications;
        events: Resource$Events;
        players: Resource$Players;
        scores: Resource$Scores;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Achievement reset all response.
     */
    export interface Schema$AchievementResetAllResponse {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#achievementResetAllResponse`.
         */
        kind?: string | null;
        /**
         * The achievement reset results.
         */
        results?: Schema$AchievementResetResponse[];
    }
    export interface Schema$AchievementResetMultipleForAllRequest {
        /**
         * The IDs of achievements to reset.
         */
        achievement_ids?: string[] | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#achievementResetMultipleForAllRequest`.
         */
        kind?: string | null;
    }
    /**
     * An achievement reset response.
     */
    export interface Schema$AchievementResetResponse {
        /**
         * The current state of the achievement. This is the same as the initial state of the achievement. Possible values are: - "`HIDDEN`"- Achievement is hidden. - "`REVEALED`" - Achievement is revealed. - "`UNLOCKED`" - Achievement is unlocked.
         */
        currentState?: string | null;
        /**
         * The ID of an achievement for which player state has been updated.
         */
        definitionId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#achievementResetResponse`.
         */
        kind?: string | null;
        /**
         * Flag to indicate if the requested update actually occurred.
         */
        updateOccurred?: boolean | null;
    }
    /**
     * Multiple events reset all request.
     */
    export interface Schema$EventsResetMultipleForAllRequest {
        /**
         * The IDs of events to reset.
         */
        event_ids?: string[] | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#eventsResetMultipleForAllRequest`.
         */
        kind?: string | null;
    }
    /**
     * 1P/3P metadata about the player's experience.
     */
    export interface Schema$GamesPlayerExperienceInfoResource {
        /**
         * The current number of experience points for the player.
         */
        currentExperiencePoints?: string | null;
        /**
         * The current level of the player.
         */
        currentLevel?: Schema$GamesPlayerLevelResource;
        /**
         * The timestamp when the player was leveled up, in millis since Unix epoch UTC.
         */
        lastLevelUpTimestampMillis?: string | null;
        /**
         * The next level of the player. If the current level is the maximum level, this should be same as the current level.
         */
        nextLevel?: Schema$GamesPlayerLevelResource;
    }
    /**
     * 1P/3P metadata about a user's level.
     */
    export interface Schema$GamesPlayerLevelResource {
        /**
         * The level for the user.
         */
        level?: number | null;
        /**
         * The maximum experience points for this level.
         */
        maxExperiencePoints?: string | null;
        /**
         * The minimum experience points for this level.
         */
        minExperiencePoints?: string | null;
    }
    /**
     * The HiddenPlayer resource.
     */
    export interface Schema$HiddenPlayer {
        /**
         * Output only. The time this player was hidden.
         */
        hiddenTimeMillis?: string | null;
        /**
         * Output only. Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#hiddenPlayer`.
         */
        kind?: string | null;
        /**
         * Output only. The player information.
         */
        player?: Schema$Player;
    }
    /**
     * A list of hidden players.
     */
    export interface Schema$HiddenPlayerList {
        /**
         * The players.
         */
        items?: Schema$HiddenPlayer[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#hiddenPlayerList`.
         */
        kind?: string | null;
        /**
         * The pagination token for the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * A Player resource.
     */
    export interface Schema$Player {
        /**
         * The base URL for the image that represents the player.
         */
        avatarImageUrl?: string | null;
        /**
         * The url to the landscape mode player banner image.
         */
        bannerUrlLandscape?: string | null;
        /**
         * The url to the portrait mode player banner image.
         */
        bannerUrlPortrait?: string | null;
        /**
         * The name to display for the player.
         */
        displayName?: string | null;
        /**
         * An object to represent Play Game experience information for the player.
         */
        experienceInfo?: Schema$GamesPlayerExperienceInfoResource;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#player`.
         */
        kind?: string | null;
        /**
         * An object representation of the individual components of the player's name. For some players, these fields may not be present.
         */
        name?: {
            familyName?: string;
            givenName?: string;
        } | null;
        /**
         * The player ID that was used for this player the first time they signed into the game in question. This is only populated for calls to player.get for the requesting player, only if the player ID has subsequently changed, and only to clients that support remapping player IDs.
         */
        originalPlayerId?: string | null;
        /**
         * The ID of the player.
         */
        playerId?: string | null;
        /**
         * The player's profile settings. Controls whether or not the player's profile is visible to other players.
         */
        profileSettings?: Schema$ProfileSettings;
        /**
         * The player's title rewarded for their game activities.
         */
        title?: string | null;
    }
    /**
     * A list of leaderboard reset resources.
     */
    export interface Schema$PlayerScoreResetAllResponse {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#playerScoreResetAllResponse`.
         */
        kind?: string | null;
        /**
         * The leaderboard reset results.
         */
        results?: Schema$PlayerScoreResetResponse[];
    }
    /**
     * A list of reset leaderboard entry resources.
     */
    export interface Schema$PlayerScoreResetResponse {
        /**
         * The ID of an leaderboard for which player state has been updated.
         */
        definitionId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#playerScoreResetResponse`.
         */
        kind?: string | null;
        /**
         * The time spans of the updated score. Possible values are: - "`ALL_TIME`" - The score is an all-time score. - "`WEEKLY`" - The score is a weekly score. - "`DAILY`" - The score is a daily score.
         */
        resetScoreTimeSpans?: string[] | null;
    }
    /**
     * Profile settings
     */
    export interface Schema$ProfileSettings {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#profileSettings`.
         */
        kind?: string | null;
        profileVisible?: boolean | null;
    }
    export interface Schema$ScoresResetMultipleForAllRequest {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `gamesManagement#scoresResetMultipleForAllRequest`.
         */
        kind?: string | null;
        /**
         * The IDs of leaderboards to reset.
         */
        leaderboard_ids?: string[] | null;
    }
    export class Resource$Achievements {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Resets the achievement with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reset(params: Params$Resource$Achievements$Reset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reset(params?: Params$Resource$Achievements$Reset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementResetResponse>>;
        reset(params: Params$Resource$Achievements$Reset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reset(params: Params$Resource$Achievements$Reset, options: MethodOptions | BodyResponseCallback<Schema$AchievementResetResponse>, callback: BodyResponseCallback<Schema$AchievementResetResponse>): void;
        reset(params: Params$Resource$Achievements$Reset, callback: BodyResponseCallback<Schema$AchievementResetResponse>): void;
        reset(callback: BodyResponseCallback<Schema$AchievementResetResponse>): void;
        /**
         * Resets all achievements for the currently authenticated player for your application. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAll(params: Params$Resource$Achievements$Resetall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAll(params?: Params$Resource$Achievements$Resetall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementResetAllResponse>>;
        resetAll(params: Params$Resource$Achievements$Resetall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAll(params: Params$Resource$Achievements$Resetall, options: MethodOptions | BodyResponseCallback<Schema$AchievementResetAllResponse>, callback: BodyResponseCallback<Schema$AchievementResetAllResponse>): void;
        resetAll(params: Params$Resource$Achievements$Resetall, callback: BodyResponseCallback<Schema$AchievementResetAllResponse>): void;
        resetAll(callback: BodyResponseCallback<Schema$AchievementResetAllResponse>): void;
        /**
         * Resets all draft achievements for all players. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAllForAllPlayers(params: Params$Resource$Achievements$Resetallforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAllForAllPlayers(params?: Params$Resource$Achievements$Resetallforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetAllForAllPlayers(params: Params$Resource$Achievements$Resetallforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAllForAllPlayers(params: Params$Resource$Achievements$Resetallforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(params: Params$Resource$Achievements$Resetallforallplayers, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets the achievement with the given ID for all players. This method is only available to user accounts for your developer console. Only draft achievements can be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetForAllPlayers(params: Params$Resource$Achievements$Resetforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetForAllPlayers(params?: Params$Resource$Achievements$Resetforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetForAllPlayers(params: Params$Resource$Achievements$Resetforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetForAllPlayers(params: Params$Resource$Achievements$Resetforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(params: Params$Resource$Achievements$Resetforallplayers, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets achievements with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft achievements may be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetMultipleForAllPlayers(params: Params$Resource$Achievements$Resetmultipleforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetMultipleForAllPlayers(params?: Params$Resource$Achievements$Resetmultipleforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetMultipleForAllPlayers(params: Params$Resource$Achievements$Resetmultipleforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Achievements$Resetmultipleforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Achievements$Resetmultipleforallplayers, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Achievements$Reset extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
    }
    export interface Params$Resource$Achievements$Resetall extends StandardParameters {
    }
    export interface Params$Resource$Achievements$Resetallforallplayers extends StandardParameters {
    }
    export interface Params$Resource$Achievements$Resetforallplayers extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
    }
    export interface Params$Resource$Achievements$Resetmultipleforallplayers extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AchievementResetMultipleForAllRequest;
    }
    export class Resource$Applications {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get the list of players hidden from the given application. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listHidden(params: Params$Resource$Applications$Listhidden, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listHidden(params?: Params$Resource$Applications$Listhidden, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$HiddenPlayerList>>;
        listHidden(params: Params$Resource$Applications$Listhidden, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listHidden(params: Params$Resource$Applications$Listhidden, options: MethodOptions | BodyResponseCallback<Schema$HiddenPlayerList>, callback: BodyResponseCallback<Schema$HiddenPlayerList>): void;
        listHidden(params: Params$Resource$Applications$Listhidden, callback: BodyResponseCallback<Schema$HiddenPlayerList>): void;
        listHidden(callback: BodyResponseCallback<Schema$HiddenPlayerList>): void;
    }
    export interface Params$Resource$Applications$Listhidden extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
        /**
         * The maximum number of player resources to return in the response, used for paging. For any response, the actual number of player resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export class Resource$Events {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Resets all player progress on the event with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reset(params: Params$Resource$Events$Reset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reset(params?: Params$Resource$Events$Reset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        reset(params: Params$Resource$Events$Reset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reset(params: Params$Resource$Events$Reset, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        reset(params: Params$Resource$Events$Reset, callback: BodyResponseCallback<void>): void;
        reset(callback: BodyResponseCallback<void>): void;
        /**
         * Resets all player progress on all events for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAll(params: Params$Resource$Events$Resetall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAll(params?: Params$Resource$Events$Resetall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetAll(params: Params$Resource$Events$Resetall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAll(params: Params$Resource$Events$Resetall, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetAll(params: Params$Resource$Events$Resetall, callback: BodyResponseCallback<void>): void;
        resetAll(callback: BodyResponseCallback<void>): void;
        /**
         * Resets all draft events for all players. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAllForAllPlayers(params: Params$Resource$Events$Resetallforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAllForAllPlayers(params?: Params$Resource$Events$Resetallforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetAllForAllPlayers(params: Params$Resource$Events$Resetallforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAllForAllPlayers(params: Params$Resource$Events$Resetallforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(params: Params$Resource$Events$Resetallforallplayers, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets the event with the given ID for all players. This method is only available to user accounts for your developer console. Only draft events can be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetForAllPlayers(params: Params$Resource$Events$Resetforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetForAllPlayers(params?: Params$Resource$Events$Resetforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetForAllPlayers(params: Params$Resource$Events$Resetforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetForAllPlayers(params: Params$Resource$Events$Resetforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(params: Params$Resource$Events$Resetforallplayers, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets events with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft events may be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetMultipleForAllPlayers(params: Params$Resource$Events$Resetmultipleforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetMultipleForAllPlayers(params?: Params$Resource$Events$Resetmultipleforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetMultipleForAllPlayers(params: Params$Resource$Events$Resetmultipleforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Events$Resetmultipleforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Events$Resetmultipleforallplayers, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Events$Reset extends StandardParameters {
        /**
         * The ID of the event.
         */
        eventId?: string;
    }
    export interface Params$Resource$Events$Resetall extends StandardParameters {
    }
    export interface Params$Resource$Events$Resetallforallplayers extends StandardParameters {
    }
    export interface Params$Resource$Events$Resetforallplayers extends StandardParameters {
        /**
         * The ID of the event.
         */
        eventId?: string;
    }
    export interface Params$Resource$Events$Resetmultipleforallplayers extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$EventsResetMultipleForAllRequest;
    }
    export class Resource$Players {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Hide the given player's leaderboard scores from the given application. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        hide(params: Params$Resource$Players$Hide, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        hide(params?: Params$Resource$Players$Hide, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        hide(params: Params$Resource$Players$Hide, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        hide(params: Params$Resource$Players$Hide, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        hide(params: Params$Resource$Players$Hide, callback: BodyResponseCallback<void>): void;
        hide(callback: BodyResponseCallback<void>): void;
        /**
         * Unhide the given player's leaderboard scores from the given application. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unhide(params: Params$Resource$Players$Unhide, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unhide(params?: Params$Resource$Players$Unhide, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        unhide(params: Params$Resource$Players$Unhide, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unhide(params: Params$Resource$Players$Unhide, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        unhide(params: Params$Resource$Players$Unhide, callback: BodyResponseCallback<void>): void;
        unhide(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Players$Hide extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
    }
    export interface Params$Resource$Players$Unhide extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
    }
    export class Resource$Scores {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Resets scores for the leaderboard with the given ID for the currently authenticated player. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reset(params: Params$Resource$Scores$Reset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reset(params?: Params$Resource$Scores$Reset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerScoreResetResponse>>;
        reset(params: Params$Resource$Scores$Reset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reset(params: Params$Resource$Scores$Reset, options: MethodOptions | BodyResponseCallback<Schema$PlayerScoreResetResponse>, callback: BodyResponseCallback<Schema$PlayerScoreResetResponse>): void;
        reset(params: Params$Resource$Scores$Reset, callback: BodyResponseCallback<Schema$PlayerScoreResetResponse>): void;
        reset(callback: BodyResponseCallback<Schema$PlayerScoreResetResponse>): void;
        /**
         * Resets all scores for all leaderboards for the currently authenticated players. This method is only accessible to whitelisted tester accounts for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAll(params: Params$Resource$Scores$Resetall, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAll(params?: Params$Resource$Scores$Resetall, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerScoreResetAllResponse>>;
        resetAll(params: Params$Resource$Scores$Resetall, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAll(params: Params$Resource$Scores$Resetall, options: MethodOptions | BodyResponseCallback<Schema$PlayerScoreResetAllResponse>, callback: BodyResponseCallback<Schema$PlayerScoreResetAllResponse>): void;
        resetAll(params: Params$Resource$Scores$Resetall, callback: BodyResponseCallback<Schema$PlayerScoreResetAllResponse>): void;
        resetAll(callback: BodyResponseCallback<Schema$PlayerScoreResetAllResponse>): void;
        /**
         * Resets scores for all draft leaderboards for all players. This method is only available to user accounts for your developer console.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetAllForAllPlayers(params: Params$Resource$Scores$Resetallforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetAllForAllPlayers(params?: Params$Resource$Scores$Resetallforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetAllForAllPlayers(params: Params$Resource$Scores$Resetallforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetAllForAllPlayers(params: Params$Resource$Scores$Resetallforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(params: Params$Resource$Scores$Resetallforallplayers, callback: BodyResponseCallback<void>): void;
        resetAllForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets scores for the leaderboard with the given ID for all players. This method is only available to user accounts for your developer console. Only draft leaderboards can be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetForAllPlayers(params: Params$Resource$Scores$Resetforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetForAllPlayers(params?: Params$Resource$Scores$Resetforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetForAllPlayers(params: Params$Resource$Scores$Resetforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetForAllPlayers(params: Params$Resource$Scores$Resetforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(params: Params$Resource$Scores$Resetforallplayers, callback: BodyResponseCallback<void>): void;
        resetForAllPlayers(callback: BodyResponseCallback<void>): void;
        /**
         * Resets scores for the leaderboards with the given IDs for all players. This method is only available to user accounts for your developer console. Only draft leaderboards may be reset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetMultipleForAllPlayers(params: Params$Resource$Scores$Resetmultipleforallplayers, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetMultipleForAllPlayers(params?: Params$Resource$Scores$Resetmultipleforallplayers, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        resetMultipleForAllPlayers(params: Params$Resource$Scores$Resetmultipleforallplayers, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Scores$Resetmultipleforallplayers, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(params: Params$Resource$Scores$Resetmultipleforallplayers, callback: BodyResponseCallback<void>): void;
        resetMultipleForAllPlayers(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Scores$Reset extends StandardParameters {
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
    }
    export interface Params$Resource$Scores$Resetall extends StandardParameters {
    }
    export interface Params$Resource$Scores$Resetallforallplayers extends StandardParameters {
    }
    export interface Params$Resource$Scores$Resetforallplayers extends StandardParameters {
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
    }
    export interface Params$Resource$Scores$Resetmultipleforallplayers extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$ScoresResetMultipleForAllRequest;
    }
    export {};
}
