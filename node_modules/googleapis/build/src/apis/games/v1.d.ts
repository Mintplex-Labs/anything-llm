import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace games_v1 {
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
     * Google Play Games Services API
     *
     * The Google Play Games Service allows developers to enhance games with social leaderboards, achievements, game state, sign-in with Google, and more.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const games = google.games('v1');
     * ```
     */
    export class Games {
        context: APIRequestContext;
        accesstokens: Resource$Accesstokens;
        achievementDefinitions: Resource$Achievementdefinitions;
        achievements: Resource$Achievements;
        applications: Resource$Applications;
        events: Resource$Events;
        leaderboards: Resource$Leaderboards;
        metagame: Resource$Metagame;
        players: Resource$Players;
        recall: Resource$Recall;
        revisions: Resource$Revisions;
        scores: Resource$Scores;
        snapshots: Resource$Snapshots;
        stats: Resource$Stats;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An achievement definition object.
     */
    export interface Schema$AchievementDefinition {
        /**
         * The type of the achievement.
         */
        achievementType?: string | null;
        /**
         * The description of the achievement.
         */
        description?: string | null;
        /**
         * Experience points which will be earned when unlocking this achievement.
         */
        experiencePoints?: string | null;
        /**
         * The total steps for an incremental achievement as a string.
         */
        formattedTotalSteps?: string | null;
        /**
         * The ID of the achievement.
         */
        id?: string | null;
        /**
         * The initial state of the achievement.
         */
        initialState?: string | null;
        /**
         * Indicates whether the revealed icon image being returned is a default image, or is provided by the game.
         */
        isRevealedIconUrlDefault?: boolean | null;
        /**
         * Indicates whether the unlocked icon image being returned is a default image, or is game-provided.
         */
        isUnlockedIconUrlDefault?: boolean | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementDefinition`.
         */
        kind?: string | null;
        /**
         * The name of the achievement.
         */
        name?: string | null;
        /**
         * The image URL for the revealed achievement icon.
         */
        revealedIconUrl?: string | null;
        /**
         * The total steps for an incremental achievement.
         */
        totalSteps?: number | null;
        /**
         * The image URL for the unlocked achievement icon.
         */
        unlockedIconUrl?: string | null;
    }
    /**
     * A list of achievement definition objects.
     */
    export interface Schema$AchievementDefinitionsListResponse {
        /**
         * The achievement definitions.
         */
        items?: Schema$AchievementDefinition[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementDefinitionsListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * An achievement increment response
     */
    export interface Schema$AchievementIncrementResponse {
        /**
         * The current steps recorded for this incremental achievement.
         */
        currentSteps?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementIncrementResponse`.
         */
        kind?: string | null;
        /**
         * Whether the current steps for the achievement has reached the number of steps required to unlock.
         */
        newlyUnlocked?: boolean | null;
    }
    /**
     * An achievement reveal response
     */
    export interface Schema$AchievementRevealResponse {
        /**
         * The current state of the achievement for which a reveal was attempted. This might be `UNLOCKED` if the achievement was already unlocked.
         */
        currentState?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementRevealResponse`.
         */
        kind?: string | null;
    }
    /**
     * An achievement set steps at least response.
     */
    export interface Schema$AchievementSetStepsAtLeastResponse {
        /**
         * The current steps recorded for this incremental achievement.
         */
        currentSteps?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementSetStepsAtLeastResponse`.
         */
        kind?: string | null;
        /**
         * Whether the current steps for the achievement has reached the number of steps required to unlock.
         */
        newlyUnlocked?: boolean | null;
    }
    /**
     * An achievement unlock response
     */
    export interface Schema$AchievementUnlockResponse {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementUnlockResponse`.
         */
        kind?: string | null;
        /**
         * Whether this achievement was newly unlocked (that is, whether the unlock request for the achievement was the first for the player).
         */
        newlyUnlocked?: boolean | null;
    }
    /**
     * A list of achievement update requests.
     */
    export interface Schema$AchievementUpdateMultipleRequest {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementUpdateMultipleRequest`.
         */
        kind?: string | null;
        /**
         * The individual achievement update requests.
         */
        updates?: Schema$AchievementUpdateRequest[];
    }
    /**
     * Response message for UpdateMultipleAchievements rpc.
     */
    export interface Schema$AchievementUpdateMultipleResponse {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementUpdateMultipleResponse`.
         */
        kind?: string | null;
        /**
         * The updated state of the achievements.
         */
        updatedAchievements?: Schema$AchievementUpdateResponse[];
    }
    /**
     * A request to update an achievement.
     */
    export interface Schema$AchievementUpdateRequest {
        /**
         * The achievement this update is being applied to.
         */
        achievementId?: string | null;
        /**
         * The payload if an update of type `INCREMENT` was requested for the achievement.
         */
        incrementPayload?: Schema$GamesAchievementIncrement;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementUpdateRequest`.
         */
        kind?: string | null;
        /**
         * The payload if an update of type `SET_STEPS_AT_LEAST` was requested for the achievement.
         */
        setStepsAtLeastPayload?: Schema$GamesAchievementSetStepsAtLeast;
        /**
         * The type of update being applied.
         */
        updateType?: string | null;
    }
    /**
     * An updated achievement.
     */
    export interface Schema$AchievementUpdateResponse {
        /**
         * The achievement this update is was applied to.
         */
        achievementId?: string | null;
        /**
         * The current state of the achievement.
         */
        currentState?: string | null;
        /**
         * The current steps recorded for this achievement if it is incremental.
         */
        currentSteps?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#achievementUpdateResponse`.
         */
        kind?: string | null;
        /**
         * Whether this achievement was newly unlocked (that is, whether the unlock request for the achievement was the first for the player).
         */
        newlyUnlocked?: boolean | null;
        /**
         * Whether the requested updates actually affected the achievement.
         */
        updateOccurred?: boolean | null;
    }
    /**
     * The Application resource.
     */
    export interface Schema$Application {
        /**
         * The number of achievements visible to the currently authenticated player.
         */
        achievement_count?: number | null;
        /**
         * The assets of the application.
         */
        assets?: Schema$ImageAsset[];
        /**
         * The author of the application.
         */
        author?: string | null;
        /**
         * The category of the application.
         */
        category?: Schema$ApplicationCategory;
        /**
         * The description of the application.
         */
        description?: string | null;
        /**
         * A list of features that have been enabled for the application.
         */
        enabledFeatures?: string[] | null;
        /**
         * The ID of the application.
         */
        id?: string | null;
        /**
         * The instances of the application.
         */
        instances?: Schema$Instance[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#application`.
         */
        kind?: string | null;
        /**
         * The last updated timestamp of the application.
         */
        lastUpdatedTimestamp?: string | null;
        /**
         * The number of leaderboards visible to the currently authenticated player.
         */
        leaderboard_count?: number | null;
        /**
         * The name of the application.
         */
        name?: string | null;
        /**
         * A hint to the client UI for what color to use as an app-themed color. The color is given as an RGB triplet (e.g. "E0E0E0").
         */
        themeColor?: string | null;
    }
    /**
     * An application category object.
     */
    export interface Schema$ApplicationCategory {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#applicationCategory`.
         */
        kind?: string | null;
        /**
         * The primary category.
         */
        primary?: string | null;
        /**
         * The secondary category.
         */
        secondary?: string | null;
    }
    /**
     * Primary scoped player identifier for an application.
     */
    export interface Schema$ApplicationPlayerId {
        /**
         * The application that this player identifier is for.
         */
        applicationId?: string | null;
        /**
         * The player identifier for the application.
         */
        playerId?: string | null;
    }
    /**
     * A third party application verification response resource.
     */
    export interface Schema$ApplicationVerifyResponse {
        /**
         * An alternate ID that was once used for the player that was issued the auth token used in this request. (This field is not normally populated.)
         */
        alternate_player_id?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#applicationVerifyResponse`.
         */
        kind?: string | null;
        /**
         * The ID of the player that was issued the auth token used in this request.
         */
        player_id?: string | null;
    }
    /**
     * Data related to individual game categories.
     */
    export interface Schema$Category {
        /**
         * The category name.
         */
        category?: string | null;
        /**
         * Experience points earned in this category.
         */
        experiencePoints?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#category`.
         */
        kind?: string | null;
    }
    /**
     * A third party list metagame categories response.
     */
    export interface Schema$CategoryListResponse {
        /**
         * The list of categories with usage data.
         */
        items?: Schema$Category[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#categoryListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Container for a URL end point of the requested type.
     */
    export interface Schema$EndPoint {
        /**
         * A URL suitable for loading in a web browser for the requested endpoint.
         */
        url?: string | null;
    }
    /**
     * A batch update failure resource.
     */
    export interface Schema$EventBatchRecordFailure {
        /**
         * The cause for the update failure.
         */
        failureCause?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventBatchRecordFailure`.
         */
        kind?: string | null;
        /**
         * The time range which was rejected; empty for a request-wide failure.
         */
        range?: Schema$EventPeriodRange;
    }
    /**
     * An event child relationship resource.
     */
    export interface Schema$EventChild {
        /**
         * The ID of the child event.
         */
        childId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventChild`.
         */
        kind?: string | null;
    }
    /**
     * An event definition resource.
     */
    export interface Schema$EventDefinition {
        /**
         * A list of events that are a child of this event.
         */
        childEvents?: Schema$EventChild[];
        /**
         * Description of what this event represents.
         */
        description?: string | null;
        /**
         * The name to display for the event.
         */
        displayName?: string | null;
        /**
         * The ID of the event.
         */
        id?: string | null;
        /**
         * The base URL for the image that represents the event.
         */
        imageUrl?: string | null;
        /**
         * Indicates whether the icon image being returned is a default image, or is game-provided.
         */
        isDefaultImageUrl?: boolean | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventDefinition`.
         */
        kind?: string | null;
        /**
         * The visibility of event being tracked in this definition.
         */
        visibility?: string | null;
    }
    /**
     * A ListDefinitions response.
     */
    export interface Schema$EventDefinitionListResponse {
        /**
         * The event definitions.
         */
        items?: Schema$EventDefinition[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventDefinitionListResponse`.
         */
        kind?: string | null;
        /**
         * The pagination token for the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * An event period time range.
     */
    export interface Schema$EventPeriodRange {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventPeriodRange`.
         */
        kind?: string | null;
        /**
         * The time when this update period ends, in millis, since 1970 UTC (Unix Epoch).
         */
        periodEndMillis?: string | null;
        /**
         * The time when this update period begins, in millis, since 1970 UTC (Unix Epoch).
         */
        periodStartMillis?: string | null;
    }
    /**
     * An event period update resource.
     */
    export interface Schema$EventPeriodUpdate {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventPeriodUpdate`.
         */
        kind?: string | null;
        /**
         * The time period being covered by this update.
         */
        timePeriod?: Schema$EventPeriodRange;
        /**
         * The updates being made for this time period.
         */
        updates?: Schema$EventUpdateRequest[];
    }
    /**
     * An event update failure resource.
     */
    export interface Schema$EventRecordFailure {
        /**
         * The ID of the event that was not updated.
         */
        eventId?: string | null;
        /**
         * The cause for the update failure.
         */
        failureCause?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventRecordFailure`.
         */
        kind?: string | null;
    }
    /**
     * An event period update resource.
     */
    export interface Schema$EventRecordRequest {
        /**
         * The current time when this update was sent, in milliseconds, since 1970 UTC (Unix Epoch).
         */
        currentTimeMillis?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventRecordRequest`.
         */
        kind?: string | null;
        /**
         * The request ID used to identify this attempt to record events.
         */
        requestId?: string | null;
        /**
         * A list of the time period updates being made in this request.
         */
        timePeriods?: Schema$EventPeriodUpdate[];
    }
    /**
     * An event period update resource.
     */
    export interface Schema$EventUpdateRequest {
        /**
         * The ID of the event being modified in this update.
         */
        definitionId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventUpdateRequest`.
         */
        kind?: string | null;
        /**
         * The number of times this event occurred in this time period.
         */
        updateCount?: string | null;
    }
    /**
     * An event period update resource.
     */
    export interface Schema$EventUpdateResponse {
        /**
         * Any batch-wide failures which occurred applying updates.
         */
        batchFailures?: Schema$EventBatchRecordFailure[];
        /**
         * Any failures updating a particular event.
         */
        eventFailures?: Schema$EventRecordFailure[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#eventUpdateResponse`.
         */
        kind?: string | null;
        /**
         * The current status of any updated events
         */
        playerEvents?: Schema$PlayerEvent[];
    }
    /**
     * Recall tokens for a game.
     */
    export interface Schema$GamePlayerToken {
        /**
         * The application that this player identifier is for.
         */
        applicationId?: string | null;
        /**
         * Recall token data.
         */
        recallToken?: Schema$RecallToken;
    }
    /**
     * The payload to request to increment an achievement.
     */
    export interface Schema$GamesAchievementIncrement {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#GamesAchievementIncrement`.
         */
        kind?: string | null;
        /**
         * The requestId associated with an increment to an achievement.
         */
        requestId?: string | null;
        /**
         * The number of steps to be incremented.
         */
        steps?: number | null;
    }
    /**
     * The payload to request to increment an achievement.
     */
    export interface Schema$GamesAchievementSetStepsAtLeast {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#GamesAchievementSetStepsAtLeast`.
         */
        kind?: string | null;
        /**
         * The minimum number of steps for the achievement to be set to.
         */
        steps?: number | null;
    }
    /**
     * Response for the GeneratePlayGroupingApiToken RPC.
     */
    export interface Schema$GeneratePlayGroupingApiTokenResponse {
        /**
         * Token for accessing the Play Grouping API.
         */
        token?: Schema$PlayGroupingApiToken;
    }
    /**
     * Response for the GenerateRecallPlayGroupingApiToken RPC.
     */
    export interface Schema$GenerateRecallPlayGroupingApiTokenResponse {
        /**
         * Token for accessing the Play Grouping API.
         */
        token?: Schema$PlayGroupingApiToken;
    }
    /**
     * Response message for GetMultipleApplicationPlayerIds rpc.
     */
    export interface Schema$GetMultipleApplicationPlayerIdsResponse {
        /**
         * Output only. The requested applications along with the scoped ids for tha player, if that player has an id for the application. If not, the application is not included in the response.
         */
        playerIds?: Schema$ApplicationPlayerId[];
    }
    /**
     * An image asset object.
     */
    export interface Schema$ImageAsset {
        /**
         * The height of the asset.
         */
        height?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#imageAsset`.
         */
        kind?: string | null;
        /**
         * The name of the asset.
         */
        name?: string | null;
        /**
         * The URL of the asset.
         */
        url?: string | null;
        /**
         * The width of the asset.
         */
        width?: number | null;
    }
    /**
     * The Instance resource.
     */
    export interface Schema$Instance {
        /**
         * URI which shows where a user can acquire this instance.
         */
        acquisitionUri?: string | null;
        /**
         * Platform dependent details for Android.
         */
        androidInstance?: Schema$InstanceAndroidDetails;
        /**
         * Platform dependent details for iOS.
         */
        iosInstance?: Schema$InstanceIosDetails;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#instance`.
         */
        kind?: string | null;
        /**
         * Localized display name.
         */
        name?: string | null;
        /**
         * The platform type.
         */
        platformType?: string | null;
        /**
         * Flag to show if this game instance supports realtime play.
         */
        realtimePlay?: boolean | null;
        /**
         * Flag to show if this game instance supports turn based play.
         */
        turnBasedPlay?: boolean | null;
        /**
         * Platform dependent details for Web.
         */
        webInstance?: Schema$InstanceWebDetails;
    }
    /**
     * The Android instance details resource.
     */
    export interface Schema$InstanceAndroidDetails {
        /**
         * Flag indicating whether the anti-piracy check is enabled.
         */
        enablePiracyCheck?: boolean | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#instanceAndroidDetails`.
         */
        kind?: string | null;
        /**
         * Android package name which maps to Google Play URL.
         */
        packageName?: string | null;
        /**
         * Indicates that this instance is the default for new installations.
         */
        preferred?: boolean | null;
    }
    /**
     * The iOS details resource.
     */
    export interface Schema$InstanceIosDetails {
        /**
         * Bundle identifier.
         */
        bundleIdentifier?: string | null;
        /**
         * iTunes App ID.
         */
        itunesAppId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#instanceIosDetails`.
         */
        kind?: string | null;
        /**
         * Indicates that this instance is the default for new installations on iPad devices.
         */
        preferredForIpad?: boolean | null;
        /**
         * Indicates that this instance is the default for new installations on iPhone devices.
         */
        preferredForIphone?: boolean | null;
        /**
         * Flag to indicate if this instance supports iPad.
         */
        supportIpad?: boolean | null;
        /**
         * Flag to indicate if this instance supports iPhone.
         */
        supportIphone?: boolean | null;
    }
    /**
     * The Web details resource.
     */
    export interface Schema$InstanceWebDetails {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#instanceWebDetails`.
         */
        kind?: string | null;
        /**
         * Launch URL for the game.
         */
        launchUrl?: string | null;
        /**
         * Indicates that this instance is the default for new installations.
         */
        preferred?: boolean | null;
    }
    /**
     * The Leaderboard resource.
     */
    export interface Schema$Leaderboard {
        /**
         * The icon for the leaderboard.
         */
        iconUrl?: string | null;
        /**
         * The leaderboard ID.
         */
        id?: string | null;
        /**
         * Indicates whether the icon image being returned is a default image, or is game-provided.
         */
        isIconUrlDefault?: boolean | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#leaderboard`.
         */
        kind?: string | null;
        /**
         * The name of the leaderboard.
         */
        name?: string | null;
        /**
         * How scores are ordered.
         */
        order?: string | null;
    }
    /**
     * The Leaderboard Entry resource.
     */
    export interface Schema$LeaderboardEntry {
        /**
         * The localized string for the numerical value of this score.
         */
        formattedScore?: string | null;
        /**
         * The localized string for the rank of this score for this leaderboard.
         */
        formattedScoreRank?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#leaderboardEntry`.
         */
        kind?: string | null;
        /**
         * The player who holds this score.
         */
        player?: Schema$Player;
        /**
         * The rank of this score for this leaderboard.
         */
        scoreRank?: string | null;
        /**
         * Additional information about the score. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string | null;
        /**
         * The numerical value of this score.
         */
        scoreValue?: string | null;
        /**
         * The time span of this high score.
         */
        timeSpan?: string | null;
        /**
         * The timestamp at which this score was recorded, in milliseconds since the epoch in UTC.
         */
        writeTimestampMillis?: string | null;
    }
    /**
     * A list of leaderboard objects.
     */
    export interface Schema$LeaderboardListResponse {
        /**
         * The leaderboards.
         */
        items?: Schema$Leaderboard[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#leaderboardListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * A score rank in a leaderboard.
     */
    export interface Schema$LeaderboardScoreRank {
        /**
         * The number of scores in the leaderboard as a string.
         */
        formattedNumScores?: string | null;
        /**
         * The rank in the leaderboard as a string.
         */
        formattedRank?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#leaderboardScoreRank`.
         */
        kind?: string | null;
        /**
         * The number of scores in the leaderboard.
         */
        numScores?: string | null;
        /**
         * The rank in the leaderboard.
         */
        rank?: string | null;
    }
    /**
     * A ListScores response.
     */
    export interface Schema$LeaderboardScores {
        /**
         * The scores in the leaderboard.
         */
        items?: Schema$LeaderboardEntry[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#leaderboardScores`.
         */
        kind?: string | null;
        /**
         * The pagination token for the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The total number of scores in the leaderboard.
         */
        numScores?: string | null;
        /**
         * The score of the requesting player on the leaderboard. The player's score may appear both here and in the list of scores above. If you are viewing a public leaderboard and the player is not sharing their gameplay information publicly, the `scoreRank`and `formattedScoreRank` values will not be present.
         */
        playerScore?: Schema$LeaderboardEntry;
        /**
         * The pagination token for the previous page of results.
         */
        prevPageToken?: string | null;
    }
    /**
     * Request to link an in-game account with a PGS principal (encoded in the session id).
     */
    export interface Schema$LinkPersonaRequest {
        /**
         * Required. Cardinality constraint to observe when linking a persona to a player in the scope of a game.
         */
        cardinalityConstraint?: string | null;
        /**
         * Required. Resolution policy to apply when the linking of a persona to a player would result in violating the specified cardinality constraint.
         */
        conflictingLinksResolutionPolicy?: string | null;
        /**
         * Input only. Optional expiration time.
         */
        expireTime?: string | null;
        /**
         * Required. Stable identifier of the in-game account. Please refrain from re-using the same persona for different games.
         */
        persona?: string | null;
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application.
         */
        sessionId?: string | null;
        /**
         * Required. Value of the token to create. Opaque to Play Games and assumed to be non-stable (encrypted with key rotation).
         */
        token?: string | null;
        /**
         * Input only. Optional time-to-live.
         */
        ttl?: string | null;
    }
    /**
     * Outcome of a persona linking attempt.
     */
    export interface Schema$LinkPersonaResponse {
        /**
         * Output only. State of a persona linking attempt.
         */
        state?: string | null;
    }
    /**
     * The metagame config resource
     */
    export interface Schema$MetagameConfig {
        /**
         * Current version of the metagame configuration data. When this data is updated, the version number will be increased by one.
         */
        currentVersion?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#metagameConfig`.
         */
        kind?: string | null;
        /**
         * The list of player levels.
         */
        playerLevels?: Schema$PlayerLevel[];
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
        experienceInfo?: Schema$PlayerExperienceInfo;
        /**
         * The friend status of the given player, relative to the requester. This is unset if the player is not sharing their friends list with the game.
         */
        friendStatus?: string | null;
        /**
         * Per-application unique player identifier.
         */
        gamePlayerId?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#player`
         */
        kind?: string | null;
        /**
         * A representation of the individual components of the name.
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
     * An achievement object.
     */
    export interface Schema$PlayerAchievement {
        /**
         * The state of the achievement.
         */
        achievementState?: string | null;
        /**
         * The current steps for an incremental achievement.
         */
        currentSteps?: number | null;
        /**
         * Experience points earned for the achievement. This field is absent for achievements that have not yet been unlocked and 0 for achievements that have been unlocked by testers but that are unpublished.
         */
        experiencePoints?: string | null;
        /**
         * The current steps for an incremental achievement as a string.
         */
        formattedCurrentStepsString?: string | null;
        /**
         * The ID of the achievement.
         */
        id?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerAchievement`.
         */
        kind?: string | null;
        /**
         * The timestamp of the last modification to this achievement's state.
         */
        lastUpdatedTimestamp?: string | null;
    }
    /**
     * A list of achievement objects.
     */
    export interface Schema$PlayerAchievementListResponse {
        /**
         * The achievements.
         */
        items?: Schema$PlayerAchievement[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerAchievementListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * An event status resource.
     */
    export interface Schema$PlayerEvent {
        /**
         * The ID of the event definition.
         */
        definitionId?: string | null;
        /**
         * The current number of times this event has occurred, as a string. The formatting of this string depends on the configuration of your event in the Play Games Developer Console.
         */
        formattedNumEvents?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerEvent`.
         */
        kind?: string | null;
        /**
         * The current number of times this event has occurred.
         */
        numEvents?: string | null;
        /**
         * The ID of the player.
         */
        playerId?: string | null;
    }
    /**
     * A ListByPlayer response.
     */
    export interface Schema$PlayerEventListResponse {
        /**
         * The player events.
         */
        items?: Schema$PlayerEvent[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerEventListResponse`.
         */
        kind?: string | null;
        /**
         * The pagination token for the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * 1P/3P metadata about the player's experience.
     */
    export interface Schema$PlayerExperienceInfo {
        /**
         * The current number of experience points for the player.
         */
        currentExperiencePoints?: string | null;
        /**
         * The current level of the player.
         */
        currentLevel?: Schema$PlayerLevel;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerExperienceInfo`.
         */
        kind?: string | null;
        /**
         * The timestamp when the player was leveled up, in millis since Unix epoch UTC.
         */
        lastLevelUpTimestampMillis?: string | null;
        /**
         * The next level of the player. If the current level is the maximum level, this should be same as the current level.
         */
        nextLevel?: Schema$PlayerLevel;
    }
    /**
     * A player leaderboard score object.
     */
    export interface Schema$PlayerLeaderboardScore {
        /**
         * The rank of the score in the friends collection for this leaderboard.
         */
        friendsRank?: Schema$LeaderboardScoreRank;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerLeaderboardScore`.
         */
        kind?: string | null;
        /**
         * The ID of the leaderboard this score is in.
         */
        leaderboard_id?: string | null;
        /**
         * The public rank of the score in this leaderboard. This object will not be present if the user is not sharing their scores publicly.
         */
        publicRank?: Schema$LeaderboardScoreRank;
        /**
         * The formatted value of this score.
         */
        scoreString?: string | null;
        /**
         * Additional information about the score. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string | null;
        /**
         * The numerical value of this score.
         */
        scoreValue?: string | null;
        /**
         * The social rank of the score in this leaderboard.
         */
        socialRank?: Schema$LeaderboardScoreRank;
        /**
         * The time span of this score.
         */
        timeSpan?: string | null;
        /**
         * The timestamp at which this score was recorded, in milliseconds since the epoch in UTC.
         */
        writeTimestamp?: string | null;
    }
    /**
     * A list of player leaderboard scores.
     */
    export interface Schema$PlayerLeaderboardScoreListResponse {
        /**
         * The leaderboard scores.
         */
        items?: Schema$PlayerLeaderboardScore[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerLeaderboardScoreListResponse`.
         */
        kind?: string | null;
        /**
         * The pagination token for the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The Player resources for the owner of this score.
         */
        player?: Schema$Player;
    }
    /**
     * 1P/3P metadata about a user's level.
     */
    export interface Schema$PlayerLevel {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerLevel`.
         */
        kind?: string | null;
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
     * A third party player list response.
     */
    export interface Schema$PlayerListResponse {
        /**
         * The players.
         */
        items?: Schema$Player[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * A player score.
     */
    export interface Schema$PlayerScore {
        /**
         * The formatted score for this player score.
         */
        formattedScore?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerScore`.
         */
        kind?: string | null;
        /**
         * The numerical value for this player score.
         */
        score?: string | null;
        /**
         * Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string | null;
        /**
         * The time span for this player score.
         */
        timeSpan?: string | null;
    }
    /**
     * A list of score submission statuses.
     */
    export interface Schema$PlayerScoreListResponse {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerScoreListResponse`.
         */
        kind?: string | null;
        /**
         * The score submissions statuses.
         */
        submittedScores?: Schema$PlayerScoreResponse[];
    }
    /**
     * A list of leaderboard entry resources.
     */
    export interface Schema$PlayerScoreResponse {
        /**
         * The time spans where the submitted score is better than the existing score for that time span.
         */
        beatenScoreTimeSpans?: string[] | null;
        /**
         * The formatted value of the submitted score.
         */
        formattedScore?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerScoreResponse`.
         */
        kind?: string | null;
        /**
         * The leaderboard ID that this score was submitted to.
         */
        leaderboardId?: string | null;
        /**
         * Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string | null;
        /**
         * The scores in time spans that have not been beaten. As an example, the submitted score may be better than the player's `DAILY` score, but not better than the player's scores for the `WEEKLY` or `ALL_TIME` time spans.
         */
        unbeatenScores?: Schema$PlayerScore[];
    }
    /**
     * A list of score submission requests.
     */
    export interface Schema$PlayerScoreSubmissionList {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#playerScoreSubmissionList`.
         */
        kind?: string | null;
        /**
         * The score submissions.
         */
        scores?: Schema$ScoreSubmission[];
    }
    /**
     * Token data returned from GeneratePlayGroupingApiToken RPC.
     */
    export interface Schema$PlayGroupingApiToken {
        /**
         * Value of the token.
         */
        tokenValue?: string | null;
    }
    /**
     * Profile settings
     */
    export interface Schema$ProfileSettings {
        friendsListVisibility?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#profileSettings`.
         */
        kind?: string | null;
        /**
         * Whether the player's profile is visible to the currently signed in player.
         */
        profileVisible?: boolean | null;
    }
    /**
     * Recall token data returned from RetrievePlayerTokens RPC
     */
    export interface Schema$RecallToken {
        /**
         * Optional. Optional expiration time of the token
         */
        expireTime?: string | null;
        /**
         * Required. Whether the persona identified by the token is linked to multiple PGS Players
         */
        multiPlayerPersona?: boolean | null;
        /**
         * Required. Value of the Recall token as it is provided by the client via LinkPersona RPC
         */
        token?: string | null;
    }
    /**
     * Request to remove all Recall tokens associated with a persona for an app.
     */
    export interface Schema$ResetPersonaRequest {
        /**
         * Value of the 'persona' field as it was provided by the client in LinkPersona RPC
         */
        persona?: string | null;
    }
    /**
     * Response for the ResetPersona RPC
     */
    export interface Schema$ResetPersonaResponse {
        /**
         * Required. Whether any tokens were unlinked as a result of this request.
         */
        unlinked?: boolean | null;
    }
    /**
     * Recall token data returned from for the RetrieveDeveloperGamesLastPlayerToken RPC
     */
    export interface Schema$RetrieveDeveloperGamesLastPlayerTokenResponse {
        /**
         * The recall token associated with the requested PGS Player principal. It can be unset if there is no recall token associated with the requested principal.
         */
        gamePlayerToken?: Schema$GamePlayerToken;
    }
    /**
     * A list of recall token data returned from the RetrieveGamesPlayerTokens RPC
     */
    export interface Schema$RetrieveGamesPlayerTokensResponse {
        /**
         * The requested applications along with the recall tokens for the player. If the player does not have recall tokens for an application, that application is not included in the response.
         */
        gamePlayerTokens?: Schema$GamePlayerToken[];
    }
    /**
     * Response for the RetrievePlayerTokens RPC
     */
    export interface Schema$RetrievePlayerTokensResponse {
        /**
         * Required. Recall tokens associated with the requested PGS Player principal
         */
        tokens?: Schema$RecallToken[];
    }
    /**
     * A third party checking a revision response.
     */
    export interface Schema$RevisionCheckResponse {
        /**
         * The version of the API this client revision should use when calling API methods.
         */
        apiVersion?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#revisionCheckResponse`.
         */
        kind?: string | null;
        /**
         * The result of the revision check.
         */
        revisionStatus?: string | null;
    }
    /**
     * Scoped player identifiers.
     */
    export interface Schema$ScopedPlayerIds {
        /**
         * Identifier of the player across all games of the given developer. Every player has the same developer_player_key in all games of one developer. Developer player key changes for the game if the game is transferred to another developer. Note that game_player_id will stay unchanged.
         */
        developerPlayerKey?: string | null;
        /**
         * Game-scoped player identifier. This is the same id that is returned in GetPlayer game_player_id field.
         */
        gamePlayerId?: string | null;
    }
    /**
     * A request to submit a score to leaderboards.
     */
    export interface Schema$ScoreSubmission {
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#scoreSubmission`.
         */
        kind?: string | null;
        /**
         * The leaderboard this score is being submitted to.
         */
        leaderboardId?: string | null;
        /**
         * The new score being submitted.
         */
        score?: string | null;
        /**
         * Additional information about this score. Values will contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string | null;
        /**
         * Signature Values will contain URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        signature?: string | null;
    }
    /**
     * An snapshot object.
     */
    export interface Schema$Snapshot {
        /**
         * The cover image of this snapshot. May be absent if there is no image.
         */
        coverImage?: Schema$SnapshotImage;
        /**
         * The description of this snapshot.
         */
        description?: string | null;
        /**
         * The ID of the file underlying this snapshot in the Drive API. Only present if the snapshot is a view on a Drive file and the file is owned by the caller.
         */
        driveId?: string | null;
        /**
         * The duration associated with this snapshot, in millis.
         */
        durationMillis?: string | null;
        /**
         * The ID of the snapshot.
         */
        id?: string | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#snapshot`.
         */
        kind?: string | null;
        /**
         * The timestamp (in millis since Unix epoch) of the last modification to this snapshot.
         */
        lastModifiedMillis?: string | null;
        /**
         * The progress value (64-bit integer set by developer) associated with this snapshot.
         */
        progressValue?: string | null;
        /**
         * The title of this snapshot.
         */
        title?: string | null;
        /**
         * The type of this snapshot.
         */
        type?: string | null;
        /**
         * The unique name provided when the snapshot was created.
         */
        uniqueName?: string | null;
    }
    /**
     * An image of a snapshot.
     */
    export interface Schema$SnapshotImage {
        /**
         * The height of the image.
         */
        height?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#snapshotImage`.
         */
        kind?: string | null;
        /**
         * The MIME type of the image.
         */
        mime_type?: string | null;
        /**
         * The URL of the image. This URL may be invalidated at any time and should not be cached.
         */
        url?: string | null;
        /**
         * The width of the image.
         */
        width?: number | null;
    }
    /**
     * A third party list snapshots response.
     */
    export interface Schema$SnapshotListResponse {
        /**
         * The snapshots.
         */
        items?: Schema$Snapshot[];
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#snapshotListResponse`.
         */
        kind?: string | null;
        /**
         * Token corresponding to the next page of results. If there are no more results, the token is omitted.
         */
        nextPageToken?: string | null;
    }
    /**
     * A third party stats resource.
     */
    export interface Schema$StatsResponse {
        /**
         * Average session length in minutes of the player. E.g., 1, 30, 60, ... . Not populated if there is not enough information.
         */
        avg_session_length_minutes?: number | null;
        /**
         * The probability of the player not returning to play the game in the next day. E.g., 0, 0.1, 0.5, ..., 1.0. Not populated if there is not enough information.
         */
        churn_probability?: number | null;
        /**
         * Number of days since the player last played this game. E.g., 0, 1, 5, 10, ... . Not populated if there is not enough information.
         */
        days_since_last_played?: number | null;
        /**
         * The probability of the player going to spend beyond a threshold amount of money. E.g., 0, 0.25, 0.50, 0.75. Not populated if there is not enough information.
         */
        high_spender_probability?: number | null;
        /**
         * Uniquely identifies the type of this resource. Value is always the fixed string `games#statsResponse`.
         */
        kind?: string | null;
        /**
         * Number of in-app purchases made by the player in this game. E.g., 0, 1, 5, 10, ... . Not populated if there is not enough information.
         */
        num_purchases?: number | null;
        /**
         * The approximate number of sessions of the player within the last 28 days, where a session begins when the player is connected to Play Games Services and ends when they are disconnected. E.g., 0, 1, 5, 10, ... . Not populated if there is not enough information.
         */
        num_sessions?: number | null;
        /**
         * The approximation of the sessions percentile of the player within the last 30 days, where a session begins when the player is connected to Play Games Services and ends when they are disconnected. E.g., 0, 0.25, 0.5, 0.75. Not populated if there is not enough information.
         */
        num_sessions_percentile?: number | null;
        /**
         * The approximate spend percentile of the player in this game. E.g., 0, 0.25, 0.5, 0.75. Not populated if there is not enough information.
         */
        spend_percentile?: number | null;
        /**
         * The probability of the player going to spend the game in the next seven days. E.g., 0, 0.25, 0.50, 0.75. Not populated if there is not enough information.
         */
        spend_probability?: number | null;
        /**
         * The predicted amount of money that the player going to spend in the next 28 days. E.g., 1, 30, 60, ... . Not populated if there is not enough information.
         */
        total_spend_next_28_days?: number | null;
    }
    /**
     * Request to remove a Recall token linking PGS principal and an in-game account
     */
    export interface Schema$UnlinkPersonaRequest {
        /**
         * Value of the 'persona' field as it was provided by the client in LinkPersona RPC
         */
        persona?: string | null;
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application.
         */
        sessionId?: string | null;
        /**
         * Value of the Recall token as it was provided by the client in LinkPersona RPC
         */
        token?: string | null;
    }
    /**
     * Response for the UnlinkPersona RPC
     */
    export interface Schema$UnlinkPersonaResponse {
        /**
         * Required. Whether a Recall token specified by the request was deleted. Can be 'false' when there were no Recall tokens satisfied the criteria from the request.
         */
        unlinked?: boolean | null;
    }
    export class Resource$Accesstokens {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Generates a Play Grouping API token for the PGS user identified by the attached credential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generatePlayGroupingApiToken(params: Params$Resource$Accesstokens$Generateplaygroupingapitoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generatePlayGroupingApiToken(params?: Params$Resource$Accesstokens$Generateplaygroupingapitoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GeneratePlayGroupingApiTokenResponse>>;
        generatePlayGroupingApiToken(params: Params$Resource$Accesstokens$Generateplaygroupingapitoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generatePlayGroupingApiToken(params: Params$Resource$Accesstokens$Generateplaygroupingapitoken, options: MethodOptions | BodyResponseCallback<Schema$GeneratePlayGroupingApiTokenResponse>, callback: BodyResponseCallback<Schema$GeneratePlayGroupingApiTokenResponse>): void;
        generatePlayGroupingApiToken(params: Params$Resource$Accesstokens$Generateplaygroupingapitoken, callback: BodyResponseCallback<Schema$GeneratePlayGroupingApiTokenResponse>): void;
        generatePlayGroupingApiToken(callback: BodyResponseCallback<Schema$GeneratePlayGroupingApiTokenResponse>): void;
        /**
         * Generates a Play Grouping API token for the PGS user identified by the Recall session ID provided in the request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateRecallPlayGroupingApiToken(params: Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateRecallPlayGroupingApiToken(params?: Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateRecallPlayGroupingApiTokenResponse>>;
        generateRecallPlayGroupingApiToken(params: Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateRecallPlayGroupingApiToken(params: Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken, options: MethodOptions | BodyResponseCallback<Schema$GenerateRecallPlayGroupingApiTokenResponse>, callback: BodyResponseCallback<Schema$GenerateRecallPlayGroupingApiTokenResponse>): void;
        generateRecallPlayGroupingApiToken(params: Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken, callback: BodyResponseCallback<Schema$GenerateRecallPlayGroupingApiTokenResponse>): void;
        generateRecallPlayGroupingApiToken(callback: BodyResponseCallback<Schema$GenerateRecallPlayGroupingApiTokenResponse>): void;
    }
    export interface Params$Resource$Accesstokens$Generateplaygroupingapitoken extends StandardParameters {
        /**
         * Required. App package name to generate the token for (e.g. com.example.mygame).
         */
        packageName?: string;
        /**
         * Required. Persona to associate with the token. Persona is a developer-provided stable identifier of the user. Must be deterministically generated (e.g. as a one-way hash) from the user account ID and user profile ID (if the app has the concept), according to the developer's own user identity system.
         */
        persona?: string;
    }
    export interface Params$Resource$Accesstokens$Generaterecallplaygroupingapitoken extends StandardParameters {
        /**
         * Required. App package name to generate the token for (e.g. com.example.mygame).
         */
        packageName?: string;
        /**
         * Required. Persona to associate with the token. Persona is a developer-provided stable identifier of the user. Must be deterministically generated (e.g. as a one-way hash) from the user account ID and user profile ID (if the app has the concept), according to the developer's own user identity system.
         */
        persona?: string;
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application. See https://developer.android.com/games/pgs/recall/recall-setup on how to integrate with Recall and get session ID.
         */
        recallSessionId?: string;
    }
    export class Resource$Achievementdefinitions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all the achievement definitions for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Achievementdefinitions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Achievementdefinitions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementDefinitionsListResponse>>;
        list(params: Params$Resource$Achievementdefinitions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Achievementdefinitions$List, options: MethodOptions | BodyResponseCallback<Schema$AchievementDefinitionsListResponse>, callback: BodyResponseCallback<Schema$AchievementDefinitionsListResponse>): void;
        list(params: Params$Resource$Achievementdefinitions$List, callback: BodyResponseCallback<Schema$AchievementDefinitionsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$AchievementDefinitionsListResponse>): void;
    }
    export interface Params$Resource$Achievementdefinitions$List extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of achievement resources to return in the response, used for paging. For any response, the actual number of achievement resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export class Resource$Achievements {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Increments the steps of the achievement with the given ID for the currently authenticated player.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        increment(params: Params$Resource$Achievements$Increment, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        increment(params?: Params$Resource$Achievements$Increment, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementIncrementResponse>>;
        increment(params: Params$Resource$Achievements$Increment, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        increment(params: Params$Resource$Achievements$Increment, options: MethodOptions | BodyResponseCallback<Schema$AchievementIncrementResponse>, callback: BodyResponseCallback<Schema$AchievementIncrementResponse>): void;
        increment(params: Params$Resource$Achievements$Increment, callback: BodyResponseCallback<Schema$AchievementIncrementResponse>): void;
        increment(callback: BodyResponseCallback<Schema$AchievementIncrementResponse>): void;
        /**
         * Lists the progress for all your application's achievements for the currently authenticated player.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Achievements$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Achievements$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerAchievementListResponse>>;
        list(params: Params$Resource$Achievements$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Achievements$List, options: MethodOptions | BodyResponseCallback<Schema$PlayerAchievementListResponse>, callback: BodyResponseCallback<Schema$PlayerAchievementListResponse>): void;
        list(params: Params$Resource$Achievements$List, callback: BodyResponseCallback<Schema$PlayerAchievementListResponse>): void;
        list(callback: BodyResponseCallback<Schema$PlayerAchievementListResponse>): void;
        /**
         * Sets the state of the achievement with the given ID to `REVEALED` for the currently authenticated player.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reveal(params: Params$Resource$Achievements$Reveal, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reveal(params?: Params$Resource$Achievements$Reveal, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementRevealResponse>>;
        reveal(params: Params$Resource$Achievements$Reveal, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reveal(params: Params$Resource$Achievements$Reveal, options: MethodOptions | BodyResponseCallback<Schema$AchievementRevealResponse>, callback: BodyResponseCallback<Schema$AchievementRevealResponse>): void;
        reveal(params: Params$Resource$Achievements$Reveal, callback: BodyResponseCallback<Schema$AchievementRevealResponse>): void;
        reveal(callback: BodyResponseCallback<Schema$AchievementRevealResponse>): void;
        /**
         * Sets the steps for the currently authenticated player towards unlocking an achievement. If the steps parameter is less than the current number of steps that the player already gained for the achievement, the achievement is not modified.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setStepsAtLeast(params: Params$Resource$Achievements$Setstepsatleast, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setStepsAtLeast(params?: Params$Resource$Achievements$Setstepsatleast, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementSetStepsAtLeastResponse>>;
        setStepsAtLeast(params: Params$Resource$Achievements$Setstepsatleast, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setStepsAtLeast(params: Params$Resource$Achievements$Setstepsatleast, options: MethodOptions | BodyResponseCallback<Schema$AchievementSetStepsAtLeastResponse>, callback: BodyResponseCallback<Schema$AchievementSetStepsAtLeastResponse>): void;
        setStepsAtLeast(params: Params$Resource$Achievements$Setstepsatleast, callback: BodyResponseCallback<Schema$AchievementSetStepsAtLeastResponse>): void;
        setStepsAtLeast(callback: BodyResponseCallback<Schema$AchievementSetStepsAtLeastResponse>): void;
        /**
         * Unlocks this achievement for the currently authenticated player.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unlock(params: Params$Resource$Achievements$Unlock, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unlock(params?: Params$Resource$Achievements$Unlock, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementUnlockResponse>>;
        unlock(params: Params$Resource$Achievements$Unlock, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unlock(params: Params$Resource$Achievements$Unlock, options: MethodOptions | BodyResponseCallback<Schema$AchievementUnlockResponse>, callback: BodyResponseCallback<Schema$AchievementUnlockResponse>): void;
        unlock(params: Params$Resource$Achievements$Unlock, callback: BodyResponseCallback<Schema$AchievementUnlockResponse>): void;
        unlock(callback: BodyResponseCallback<Schema$AchievementUnlockResponse>): void;
        /**
         * Updates multiple achievements for the currently authenticated player.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateMultiple(params: Params$Resource$Achievements$Updatemultiple, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateMultiple(params?: Params$Resource$Achievements$Updatemultiple, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AchievementUpdateMultipleResponse>>;
        updateMultiple(params: Params$Resource$Achievements$Updatemultiple, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateMultiple(params: Params$Resource$Achievements$Updatemultiple, options: MethodOptions | BodyResponseCallback<Schema$AchievementUpdateMultipleResponse>, callback: BodyResponseCallback<Schema$AchievementUpdateMultipleResponse>): void;
        updateMultiple(params: Params$Resource$Achievements$Updatemultiple, callback: BodyResponseCallback<Schema$AchievementUpdateMultipleResponse>): void;
        updateMultiple(callback: BodyResponseCallback<Schema$AchievementUpdateMultipleResponse>): void;
    }
    export interface Params$Resource$Achievements$Increment extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
        /**
         * A randomly generated numeric ID for each request specified by the caller. This number is used at the server to ensure that the request is handled correctly across retries.
         */
        requestId?: string;
        /**
         * Required. The number of steps to increment.
         */
        stepsToIncrement?: number;
    }
    export interface Params$Resource$Achievements$List extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of achievement resources to return in the response, used for paging. For any response, the actual number of achievement resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
        /**
         * Tells the server to return only achievements with the specified state. If this parameter isn't specified, all achievements are returned.
         */
        state?: string;
    }
    export interface Params$Resource$Achievements$Reveal extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
    }
    export interface Params$Resource$Achievements$Setstepsatleast extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
        /**
         * Required. The minimum value to set the steps to.
         */
        steps?: number;
    }
    export interface Params$Resource$Achievements$Unlock extends StandardParameters {
        /**
         * The ID of the achievement used by this method.
         */
        achievementId?: string;
    }
    export interface Params$Resource$Achievements$Updatemultiple extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$AchievementUpdateMultipleRequest;
    }
    export class Resource$Applications {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the metadata of the application with the given ID. If the requested application is not available for the specified `platformType`, the returned response will not include any instance data.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Applications$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Applications$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Application>>;
        get(params: Params$Resource$Applications$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Applications$Get, options: MethodOptions | BodyResponseCallback<Schema$Application>, callback: BodyResponseCallback<Schema$Application>): void;
        get(params: Params$Resource$Applications$Get, callback: BodyResponseCallback<Schema$Application>): void;
        get(callback: BodyResponseCallback<Schema$Application>): void;
        /**
         * Returns a URL for the requested end point type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getEndPoint(params: Params$Resource$Applications$Getendpoint, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getEndPoint(params?: Params$Resource$Applications$Getendpoint, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EndPoint>>;
        getEndPoint(params: Params$Resource$Applications$Getendpoint, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getEndPoint(params: Params$Resource$Applications$Getendpoint, options: MethodOptions | BodyResponseCallback<Schema$EndPoint>, callback: BodyResponseCallback<Schema$EndPoint>): void;
        getEndPoint(params: Params$Resource$Applications$Getendpoint, callback: BodyResponseCallback<Schema$EndPoint>): void;
        getEndPoint(callback: BodyResponseCallback<Schema$EndPoint>): void;
        /**
         * Indicate that the currently authenticated user is playing your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        played(params: Params$Resource$Applications$Played, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        played(params?: Params$Resource$Applications$Played, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        played(params: Params$Resource$Applications$Played, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        played(params: Params$Resource$Applications$Played, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        played(params: Params$Resource$Applications$Played, callback: BodyResponseCallback<void>): void;
        played(callback: BodyResponseCallback<void>): void;
        /**
         * Verifies the auth token provided with this request is for the application with the specified ID, and returns the ID of the player it was granted for.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        verify(params: Params$Resource$Applications$Verify, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        verify(params?: Params$Resource$Applications$Verify, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApplicationVerifyResponse>>;
        verify(params: Params$Resource$Applications$Verify, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        verify(params: Params$Resource$Applications$Verify, options: MethodOptions | BodyResponseCallback<Schema$ApplicationVerifyResponse>, callback: BodyResponseCallback<Schema$ApplicationVerifyResponse>): void;
        verify(params: Params$Resource$Applications$Verify, callback: BodyResponseCallback<Schema$ApplicationVerifyResponse>): void;
        verify(callback: BodyResponseCallback<Schema$ApplicationVerifyResponse>): void;
    }
    export interface Params$Resource$Applications$Get extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * Restrict application details returned to the specific platform.
         */
        platformType?: string;
    }
    export interface Params$Resource$Applications$Getendpoint extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
        /**
         * Type of endpoint being requested.
         */
        endPointType?: string;
    }
    export interface Params$Resource$Applications$Played extends StandardParameters {
    }
    export interface Params$Resource$Applications$Verify extends StandardParameters {
        /**
         * The application ID from the Google Play developer console.
         */
        applicationId?: string;
    }
    export class Resource$Events {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a list showing the current progress on events in this application for the currently authenticated user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listByPlayer(params: Params$Resource$Events$Listbyplayer, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listByPlayer(params?: Params$Resource$Events$Listbyplayer, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerEventListResponse>>;
        listByPlayer(params: Params$Resource$Events$Listbyplayer, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listByPlayer(params: Params$Resource$Events$Listbyplayer, options: MethodOptions | BodyResponseCallback<Schema$PlayerEventListResponse>, callback: BodyResponseCallback<Schema$PlayerEventListResponse>): void;
        listByPlayer(params: Params$Resource$Events$Listbyplayer, callback: BodyResponseCallback<Schema$PlayerEventListResponse>): void;
        listByPlayer(callback: BodyResponseCallback<Schema$PlayerEventListResponse>): void;
        /**
         * Returns a list of the event definitions in this application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listDefinitions(params: Params$Resource$Events$Listdefinitions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listDefinitions(params?: Params$Resource$Events$Listdefinitions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EventDefinitionListResponse>>;
        listDefinitions(params: Params$Resource$Events$Listdefinitions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listDefinitions(params: Params$Resource$Events$Listdefinitions, options: MethodOptions | BodyResponseCallback<Schema$EventDefinitionListResponse>, callback: BodyResponseCallback<Schema$EventDefinitionListResponse>): void;
        listDefinitions(params: Params$Resource$Events$Listdefinitions, callback: BodyResponseCallback<Schema$EventDefinitionListResponse>): void;
        listDefinitions(callback: BodyResponseCallback<Schema$EventDefinitionListResponse>): void;
        /**
         * Records a batch of changes to the number of times events have occurred for the currently authenticated user of this application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        record(params: Params$Resource$Events$Record, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        record(params?: Params$Resource$Events$Record, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EventUpdateResponse>>;
        record(params: Params$Resource$Events$Record, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        record(params: Params$Resource$Events$Record, options: MethodOptions | BodyResponseCallback<Schema$EventUpdateResponse>, callback: BodyResponseCallback<Schema$EventUpdateResponse>): void;
        record(params: Params$Resource$Events$Record, callback: BodyResponseCallback<Schema$EventUpdateResponse>): void;
        record(callback: BodyResponseCallback<Schema$EventUpdateResponse>): void;
    }
    export interface Params$Resource$Events$Listbyplayer extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of events to return in the response, used for paging. For any response, the actual number of events to return may be less than the specified maxResults.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Events$Listdefinitions extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of event definitions to return in the response, used for paging. For any response, the actual number of event definitions to return may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Events$Record extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EventRecordRequest;
    }
    export class Resource$Leaderboards {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the metadata of the leaderboard with the given ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Leaderboards$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Leaderboards$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Leaderboard>>;
        get(params: Params$Resource$Leaderboards$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Leaderboards$Get, options: MethodOptions | BodyResponseCallback<Schema$Leaderboard>, callback: BodyResponseCallback<Schema$Leaderboard>): void;
        get(params: Params$Resource$Leaderboards$Get, callback: BodyResponseCallback<Schema$Leaderboard>): void;
        get(callback: BodyResponseCallback<Schema$Leaderboard>): void;
        /**
         * Lists all the leaderboard metadata for your application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Leaderboards$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Leaderboards$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LeaderboardListResponse>>;
        list(params: Params$Resource$Leaderboards$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Leaderboards$List, options: MethodOptions | BodyResponseCallback<Schema$LeaderboardListResponse>, callback: BodyResponseCallback<Schema$LeaderboardListResponse>): void;
        list(params: Params$Resource$Leaderboards$List, callback: BodyResponseCallback<Schema$LeaderboardListResponse>): void;
        list(callback: BodyResponseCallback<Schema$LeaderboardListResponse>): void;
    }
    export interface Params$Resource$Leaderboards$Get extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
    }
    export interface Params$Resource$Leaderboards$List extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of leaderboards to return in the response. For any response, the actual number of leaderboards returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export class Resource$Metagame {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Return the metagame configuration data for the calling application.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getMetagameConfig(params: Params$Resource$Metagame$Getmetagameconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMetagameConfig(params?: Params$Resource$Metagame$Getmetagameconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$MetagameConfig>>;
        getMetagameConfig(params: Params$Resource$Metagame$Getmetagameconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMetagameConfig(params: Params$Resource$Metagame$Getmetagameconfig, options: MethodOptions | BodyResponseCallback<Schema$MetagameConfig>, callback: BodyResponseCallback<Schema$MetagameConfig>): void;
        getMetagameConfig(params: Params$Resource$Metagame$Getmetagameconfig, callback: BodyResponseCallback<Schema$MetagameConfig>): void;
        getMetagameConfig(callback: BodyResponseCallback<Schema$MetagameConfig>): void;
        /**
         * List play data aggregated per category for the player corresponding to `playerId`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listCategoriesByPlayer(params: Params$Resource$Metagame$Listcategoriesbyplayer, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listCategoriesByPlayer(params?: Params$Resource$Metagame$Listcategoriesbyplayer, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CategoryListResponse>>;
        listCategoriesByPlayer(params: Params$Resource$Metagame$Listcategoriesbyplayer, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listCategoriesByPlayer(params: Params$Resource$Metagame$Listcategoriesbyplayer, options: MethodOptions | BodyResponseCallback<Schema$CategoryListResponse>, callback: BodyResponseCallback<Schema$CategoryListResponse>): void;
        listCategoriesByPlayer(params: Params$Resource$Metagame$Listcategoriesbyplayer, callback: BodyResponseCallback<Schema$CategoryListResponse>): void;
        listCategoriesByPlayer(callback: BodyResponseCallback<Schema$CategoryListResponse>): void;
    }
    export interface Params$Resource$Metagame$Getmetagameconfig extends StandardParameters {
    }
    export interface Params$Resource$Metagame$Listcategoriesbyplayer extends StandardParameters {
        /**
         * The collection of categories for which data will be returned.
         */
        collection?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of category resources to return in the response, used for paging. For any response, the actual number of category resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
    }
    export class Resource$Players {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the Player resource with the given ID. To retrieve the player for the currently authenticated user, set `playerId` to `me`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Players$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Players$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Player>>;
        get(params: Params$Resource$Players$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Players$Get, options: MethodOptions | BodyResponseCallback<Schema$Player>, callback: BodyResponseCallback<Schema$Player>): void;
        get(params: Params$Resource$Players$Get, callback: BodyResponseCallback<Schema$Player>): void;
        get(callback: BodyResponseCallback<Schema$Player>): void;
        /**
         * Get the application player ids for the currently authenticated player across all requested games by the same developer as the calling application. This will only return ids for players that actually have an id (scoped or otherwise) with that game.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getMultipleApplicationPlayerIds(params: Params$Resource$Players$Getmultipleapplicationplayerids, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMultipleApplicationPlayerIds(params?: Params$Resource$Players$Getmultipleapplicationplayerids, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetMultipleApplicationPlayerIdsResponse>>;
        getMultipleApplicationPlayerIds(params: Params$Resource$Players$Getmultipleapplicationplayerids, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMultipleApplicationPlayerIds(params: Params$Resource$Players$Getmultipleapplicationplayerids, options: MethodOptions | BodyResponseCallback<Schema$GetMultipleApplicationPlayerIdsResponse>, callback: BodyResponseCallback<Schema$GetMultipleApplicationPlayerIdsResponse>): void;
        getMultipleApplicationPlayerIds(params: Params$Resource$Players$Getmultipleapplicationplayerids, callback: BodyResponseCallback<Schema$GetMultipleApplicationPlayerIdsResponse>): void;
        getMultipleApplicationPlayerIds(callback: BodyResponseCallback<Schema$GetMultipleApplicationPlayerIdsResponse>): void;
        /**
         * Retrieves scoped player identifiers for currently authenticated user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getScopedPlayerIds(params: Params$Resource$Players$Getscopedplayerids, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getScopedPlayerIds(params?: Params$Resource$Players$Getscopedplayerids, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ScopedPlayerIds>>;
        getScopedPlayerIds(params: Params$Resource$Players$Getscopedplayerids, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getScopedPlayerIds(params: Params$Resource$Players$Getscopedplayerids, options: MethodOptions | BodyResponseCallback<Schema$ScopedPlayerIds>, callback: BodyResponseCallback<Schema$ScopedPlayerIds>): void;
        getScopedPlayerIds(params: Params$Resource$Players$Getscopedplayerids, callback: BodyResponseCallback<Schema$ScopedPlayerIds>): void;
        getScopedPlayerIds(callback: BodyResponseCallback<Schema$ScopedPlayerIds>): void;
        /**
         * Get the collection of players for the currently authenticated user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Players$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Players$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerListResponse>>;
        list(params: Params$Resource$Players$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Players$List, options: MethodOptions | BodyResponseCallback<Schema$PlayerListResponse>, callback: BodyResponseCallback<Schema$PlayerListResponse>): void;
        list(params: Params$Resource$Players$List, callback: BodyResponseCallback<Schema$PlayerListResponse>): void;
        list(callback: BodyResponseCallback<Schema$PlayerListResponse>): void;
    }
    export interface Params$Resource$Players$Get extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
        /**
         * Consistency token of the player id. The call returns a 'not found' result when the token is present and invalid. Empty value is ignored. See also GlobalPlayerIdConsistencyTokenProto
         */
        playerIdConsistencyToken?: string;
    }
    export interface Params$Resource$Players$Getmultipleapplicationplayerids extends StandardParameters {
        /**
         * Required. The application IDs from the Google Play developer console for the games to return scoped ids for.
         */
        applicationIds?: string[];
    }
    export interface Params$Resource$Players$Getscopedplayerids extends StandardParameters {
    }
    export interface Params$Resource$Players$List extends StandardParameters {
        /**
         * Collection of players being retrieved
         */
        collection?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of player resources to return in the response, used for paging. For any response, the actual number of player resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
    }
    export class Resource$Recall {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieve the Recall tokens from all requested games that is associated with the PGS Player encoded in the provided recall session id. The API is only available for users that have an active PGS Player profile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        gamesPlayerTokens(params: Params$Resource$Recall$Gamesplayertokens, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        gamesPlayerTokens(params?: Params$Resource$Recall$Gamesplayertokens, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RetrieveGamesPlayerTokensResponse>>;
        gamesPlayerTokens(params: Params$Resource$Recall$Gamesplayertokens, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        gamesPlayerTokens(params: Params$Resource$Recall$Gamesplayertokens, options: MethodOptions | BodyResponseCallback<Schema$RetrieveGamesPlayerTokensResponse>, callback: BodyResponseCallback<Schema$RetrieveGamesPlayerTokensResponse>): void;
        gamesPlayerTokens(params: Params$Resource$Recall$Gamesplayertokens, callback: BodyResponseCallback<Schema$RetrieveGamesPlayerTokensResponse>): void;
        gamesPlayerTokens(callback: BodyResponseCallback<Schema$RetrieveGamesPlayerTokensResponse>): void;
        /**
         * Retrieve the last Recall token from all developer games that is associated with the PGS Player encoded in the provided recall session id. The API is only available for users that have active PGS Player profile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lastTokenFromAllDeveloperGames(params: Params$Resource$Recall$Lasttokenfromalldevelopergames, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lastTokenFromAllDeveloperGames(params?: Params$Resource$Recall$Lasttokenfromalldevelopergames, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RetrieveDeveloperGamesLastPlayerTokenResponse>>;
        lastTokenFromAllDeveloperGames(params: Params$Resource$Recall$Lasttokenfromalldevelopergames, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lastTokenFromAllDeveloperGames(params: Params$Resource$Recall$Lasttokenfromalldevelopergames, options: MethodOptions | BodyResponseCallback<Schema$RetrieveDeveloperGamesLastPlayerTokenResponse>, callback: BodyResponseCallback<Schema$RetrieveDeveloperGamesLastPlayerTokenResponse>): void;
        lastTokenFromAllDeveloperGames(params: Params$Resource$Recall$Lasttokenfromalldevelopergames, callback: BodyResponseCallback<Schema$RetrieveDeveloperGamesLastPlayerTokenResponse>): void;
        lastTokenFromAllDeveloperGames(callback: BodyResponseCallback<Schema$RetrieveDeveloperGamesLastPlayerTokenResponse>): void;
        /**
         * Associate the PGS Player principal encoded in the provided recall session id with an in-game account
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        linkPersona(params: Params$Resource$Recall$Linkpersona, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        linkPersona(params?: Params$Resource$Recall$Linkpersona, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LinkPersonaResponse>>;
        linkPersona(params: Params$Resource$Recall$Linkpersona, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        linkPersona(params: Params$Resource$Recall$Linkpersona, options: MethodOptions | BodyResponseCallback<Schema$LinkPersonaResponse>, callback: BodyResponseCallback<Schema$LinkPersonaResponse>): void;
        linkPersona(params: Params$Resource$Recall$Linkpersona, callback: BodyResponseCallback<Schema$LinkPersonaResponse>): void;
        linkPersona(callback: BodyResponseCallback<Schema$LinkPersonaResponse>): void;
        /**
         * Delete all Recall tokens linking the given persona to any player (with or without a profile).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        resetPersona(params: Params$Resource$Recall$Resetpersona, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resetPersona(params?: Params$Resource$Recall$Resetpersona, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResetPersonaResponse>>;
        resetPersona(params: Params$Resource$Recall$Resetpersona, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resetPersona(params: Params$Resource$Recall$Resetpersona, options: MethodOptions | BodyResponseCallback<Schema$ResetPersonaResponse>, callback: BodyResponseCallback<Schema$ResetPersonaResponse>): void;
        resetPersona(params: Params$Resource$Recall$Resetpersona, callback: BodyResponseCallback<Schema$ResetPersonaResponse>): void;
        resetPersona(callback: BodyResponseCallback<Schema$ResetPersonaResponse>): void;
        /**
         * Retrieve all Recall tokens associated with the PGS Player encoded in the provided recall session id. The API is only available for users that have active PGS Player profile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        retrieveTokens(params: Params$Resource$Recall$Retrievetokens, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        retrieveTokens(params?: Params$Resource$Recall$Retrievetokens, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RetrievePlayerTokensResponse>>;
        retrieveTokens(params: Params$Resource$Recall$Retrievetokens, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        retrieveTokens(params: Params$Resource$Recall$Retrievetokens, options: MethodOptions | BodyResponseCallback<Schema$RetrievePlayerTokensResponse>, callback: BodyResponseCallback<Schema$RetrievePlayerTokensResponse>): void;
        retrieveTokens(params: Params$Resource$Recall$Retrievetokens, callback: BodyResponseCallback<Schema$RetrievePlayerTokensResponse>): void;
        retrieveTokens(callback: BodyResponseCallback<Schema$RetrievePlayerTokensResponse>): void;
        /**
         * Delete a Recall token linking the PGS Player principal identified by the Recall session and an in-game account identified either by the 'persona' or by the token value.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unlinkPersona(params: Params$Resource$Recall$Unlinkpersona, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unlinkPersona(params?: Params$Resource$Recall$Unlinkpersona, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UnlinkPersonaResponse>>;
        unlinkPersona(params: Params$Resource$Recall$Unlinkpersona, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unlinkPersona(params: Params$Resource$Recall$Unlinkpersona, options: MethodOptions | BodyResponseCallback<Schema$UnlinkPersonaResponse>, callback: BodyResponseCallback<Schema$UnlinkPersonaResponse>): void;
        unlinkPersona(params: Params$Resource$Recall$Unlinkpersona, callback: BodyResponseCallback<Schema$UnlinkPersonaResponse>): void;
        unlinkPersona(callback: BodyResponseCallback<Schema$UnlinkPersonaResponse>): void;
    }
    export interface Params$Resource$Recall$Gamesplayertokens extends StandardParameters {
        /**
         * Required. The application IDs from the Google Play developer console for the games to return scoped ids for.
         */
        applicationIds?: string[];
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application.
         */
        sessionId?: string;
    }
    export interface Params$Resource$Recall$Lasttokenfromalldevelopergames extends StandardParameters {
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application.
         */
        sessionId?: string;
    }
    export interface Params$Resource$Recall$Linkpersona extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$LinkPersonaRequest;
    }
    export interface Params$Resource$Recall$Resetpersona extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResetPersonaRequest;
    }
    export interface Params$Resource$Recall$Retrievetokens extends StandardParameters {
        /**
         * Required. Opaque server-generated string that encodes all the necessary information to identify the PGS player / Google user and application.
         */
        sessionId?: string;
    }
    export interface Params$Resource$Recall$Unlinkpersona extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$UnlinkPersonaRequest;
    }
    export class Resource$Revisions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Checks whether the games client is out of date.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        check(params: Params$Resource$Revisions$Check, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        check(params?: Params$Resource$Revisions$Check, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RevisionCheckResponse>>;
        check(params: Params$Resource$Revisions$Check, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        check(params: Params$Resource$Revisions$Check, options: MethodOptions | BodyResponseCallback<Schema$RevisionCheckResponse>, callback: BodyResponseCallback<Schema$RevisionCheckResponse>): void;
        check(params: Params$Resource$Revisions$Check, callback: BodyResponseCallback<Schema$RevisionCheckResponse>): void;
        check(callback: BodyResponseCallback<Schema$RevisionCheckResponse>): void;
    }
    export interface Params$Resource$Revisions$Check extends StandardParameters {
        /**
         * Required. The revision of the client SDK used by your application. Format: `[PLATFORM_TYPE]:[VERSION_NUMBER]`. Possible values of `PLATFORM_TYPE` are: * `ANDROID` - Client is running the Android SDK. * `IOS` - Client is running the iOS SDK. * `WEB_APP` - Client is running as a Web App.
         */
        clientRevision?: string;
    }
    export class Resource$Scores {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get high scores, and optionally ranks, in leaderboards for the currently authenticated player. For a specific time span, `leaderboardId` can be set to `ALL` to retrieve data for all leaderboards in a given time span. `NOTE: You cannot ask for 'ALL' leaderboards and 'ALL' timeSpans in the same request; only one parameter may be set to 'ALL'.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Scores$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Scores$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerLeaderboardScoreListResponse>>;
        get(params: Params$Resource$Scores$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Scores$Get, options: MethodOptions | BodyResponseCallback<Schema$PlayerLeaderboardScoreListResponse>, callback: BodyResponseCallback<Schema$PlayerLeaderboardScoreListResponse>): void;
        get(params: Params$Resource$Scores$Get, callback: BodyResponseCallback<Schema$PlayerLeaderboardScoreListResponse>): void;
        get(callback: BodyResponseCallback<Schema$PlayerLeaderboardScoreListResponse>): void;
        /**
         * Lists the scores in a leaderboard, starting from the top.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Scores$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Scores$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LeaderboardScores>>;
        list(params: Params$Resource$Scores$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Scores$List, options: MethodOptions | BodyResponseCallback<Schema$LeaderboardScores>, callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        list(params: Params$Resource$Scores$List, callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        list(callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        /**
         * Lists the scores in a leaderboard around (and including) a player's score.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        listWindow(params: Params$Resource$Scores$Listwindow, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listWindow(params?: Params$Resource$Scores$Listwindow, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LeaderboardScores>>;
        listWindow(params: Params$Resource$Scores$Listwindow, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listWindow(params: Params$Resource$Scores$Listwindow, options: MethodOptions | BodyResponseCallback<Schema$LeaderboardScores>, callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        listWindow(params: Params$Resource$Scores$Listwindow, callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        listWindow(callback: BodyResponseCallback<Schema$LeaderboardScores>): void;
        /**
         * Submits a score to the specified leaderboard.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submit(params: Params$Resource$Scores$Submit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submit(params?: Params$Resource$Scores$Submit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerScoreResponse>>;
        submit(params: Params$Resource$Scores$Submit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submit(params: Params$Resource$Scores$Submit, options: MethodOptions | BodyResponseCallback<Schema$PlayerScoreResponse>, callback: BodyResponseCallback<Schema$PlayerScoreResponse>): void;
        submit(params: Params$Resource$Scores$Submit, callback: BodyResponseCallback<Schema$PlayerScoreResponse>): void;
        submit(callback: BodyResponseCallback<Schema$PlayerScoreResponse>): void;
        /**
         * Submits multiple scores to leaderboards.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submitMultiple(params: Params$Resource$Scores$Submitmultiple, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submitMultiple(params?: Params$Resource$Scores$Submitmultiple, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PlayerScoreListResponse>>;
        submitMultiple(params: Params$Resource$Scores$Submitmultiple, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submitMultiple(params: Params$Resource$Scores$Submitmultiple, options: MethodOptions | BodyResponseCallback<Schema$PlayerScoreListResponse>, callback: BodyResponseCallback<Schema$PlayerScoreListResponse>): void;
        submitMultiple(params: Params$Resource$Scores$Submitmultiple, callback: BodyResponseCallback<Schema$PlayerScoreListResponse>): void;
        submitMultiple(callback: BodyResponseCallback<Schema$PlayerScoreListResponse>): void;
    }
    export interface Params$Resource$Scores$Get extends StandardParameters {
        /**
         * The types of ranks to return. If the parameter is omitted, no ranks will be returned.
         */
        includeRankType?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the leaderboard. Can be set to 'ALL' to retrieve data for all leaderboards for this application.
         */
        leaderboardId?: string;
        /**
         * The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
        /**
         * The time span for the scores and ranks you're requesting.
         */
        timeSpan?: string;
    }
    export interface Params$Resource$Scores$List extends StandardParameters {
        /**
         * The collection of scores you're requesting.
         */
        collection?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
        /**
         * The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * Required. The time span for the scores and ranks you're requesting.
         */
        timeSpan?: string;
    }
    export interface Params$Resource$Scores$Listwindow extends StandardParameters {
        /**
         * The collection of scores you're requesting.
         */
        collection?: string;
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
        /**
         * The maximum number of leaderboard scores to return in the response. For any response, the actual number of leaderboard scores returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * The preferred number of scores to return above the player's score. More scores may be returned if the player is at the bottom of the leaderboard; fewer may be returned if the player is at the top. Must be less than or equal to maxResults.
         */
        resultsAbove?: number;
        /**
         * True if the top scores should be returned when the player is not in the leaderboard. Defaults to true.
         */
        returnTopIfAbsent?: boolean;
        /**
         * Required. The time span for the scores and ranks you're requesting.
         */
        timeSpan?: string;
    }
    export interface Params$Resource$Scores$Submit extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the leaderboard.
         */
        leaderboardId?: string;
        /**
         * Required. The score you're submitting. The submitted score is ignored if it is worse than a previously submitted score, where worse depends on the leaderboard sort order. The meaning of the score value depends on the leaderboard format type. For fixed-point, the score represents the raw value. For time, the score represents elapsed time in milliseconds. For currency, the score represents a value in micro units.
         */
        score?: string;
        /**
         * Additional information about the score you're submitting. Values must contain no more than 64 URI-safe characters as defined by section 2.3 of RFC 3986.
         */
        scoreTag?: string;
    }
    export interface Params$Resource$Scores$Submitmultiple extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$PlayerScoreSubmissionList;
    }
    export class Resource$Snapshots {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the metadata for a given snapshot ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Snapshots$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Snapshots$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Snapshot>>;
        get(params: Params$Resource$Snapshots$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Snapshots$Get, options: MethodOptions | BodyResponseCallback<Schema$Snapshot>, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(params: Params$Resource$Snapshots$Get, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(callback: BodyResponseCallback<Schema$Snapshot>): void;
        /**
         * Retrieves a list of snapshots created by your application for the player corresponding to the player ID.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Snapshots$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Snapshots$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SnapshotListResponse>>;
        list(params: Params$Resource$Snapshots$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Snapshots$List, options: MethodOptions | BodyResponseCallback<Schema$SnapshotListResponse>, callback: BodyResponseCallback<Schema$SnapshotListResponse>): void;
        list(params: Params$Resource$Snapshots$List, callback: BodyResponseCallback<Schema$SnapshotListResponse>): void;
        list(callback: BodyResponseCallback<Schema$SnapshotListResponse>): void;
    }
    export interface Params$Resource$Snapshots$Get extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The ID of the snapshot.
         */
        snapshotId?: string;
    }
    export interface Params$Resource$Snapshots$List extends StandardParameters {
        /**
         * The preferred language to use for strings returned by this method.
         */
        language?: string;
        /**
         * The maximum number of snapshot resources to return in the response, used for paging. For any response, the actual number of snapshot resources returned may be less than the specified `maxResults`.
         */
        maxResults?: number;
        /**
         * The token returned by the previous request.
         */
        pageToken?: string;
        /**
         * A player ID. A value of `me` may be used in place of the authenticated player's ID.
         */
        playerId?: string;
    }
    export class Resource$Stats {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns engagement and spend statistics in this application for the currently authenticated user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Stats$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Stats$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StatsResponse>>;
        get(params: Params$Resource$Stats$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Stats$Get, options: MethodOptions | BodyResponseCallback<Schema$StatsResponse>, callback: BodyResponseCallback<Schema$StatsResponse>): void;
        get(params: Params$Resource$Stats$Get, callback: BodyResponseCallback<Schema$StatsResponse>): void;
        get(callback: BodyResponseCallback<Schema$StatsResponse>): void;
    }
    export interface Params$Resource$Stats$Get extends StandardParameters {
    }
    export {};
}
