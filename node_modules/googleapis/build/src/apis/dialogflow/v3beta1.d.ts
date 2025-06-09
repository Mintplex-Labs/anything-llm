import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace dialogflow_v3beta1 {
    export interface Options extends GlobalOptions {
        version: 'v3beta1';
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
     * Dialogflow API
     *
     * Builds conversational interfaces (for example, chatbots, and voice-powered apps and devices).
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const dialogflow = google.dialogflow('v3beta1');
     * ```
     */
    export class Dialogflow {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Hierarchical advanced settings for agent/flow/page/fulfillment/parameter. Settings exposed at lower level overrides the settings exposed at higher level. Overriding occurs at the sub-setting level. For example, the playback_interruption_settings at fulfillment level only overrides the playback_interruption_settings at the agent level, leaving other settings at the agent level unchanged. DTMF settings does not override each other. DTMF settings set at different levels define DTMF detections running in parallel. Hierarchy: Agent-\>Flow-\>Page-\>Fulfillment/Parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3AdvancedSettings {
        /**
         * If present, incoming audio is exported by Dialogflow to the configured Google Cloud Storage destination. Exposed at the following levels: - Agent level - Flow level
         */
        audioExportGcsDestination?: Schema$GoogleCloudDialogflowCxV3GcsDestination;
        /**
         * Settings for DTMF. Exposed at the following levels: - Agent level - Flow level - Page level - Parameter level.
         */
        dtmfSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettingsDtmfSettings;
        /**
         * Settings for logging. Settings for Dialogflow History, Contact Center messages, StackDriver logs, and speech logging. Exposed at the following levels: - Agent level.
         */
        loggingSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettingsLoggingSettings;
        /**
         * Settings for speech to text detection. Exposed at the following levels: - Agent level - Flow level - Page level - Parameter level
         */
        speechSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettingsSpeechSettings;
    }
    /**
     * Define behaviors for DTMF (dual tone multi frequency).
     */
    export interface Schema$GoogleCloudDialogflowCxV3AdvancedSettingsDtmfSettings {
        /**
         * If true, incoming audio is processed for DTMF (dual tone multi frequency) events. For example, if the caller presses a button on their telephone keypad and DTMF processing is enabled, Dialogflow will detect the event (e.g. a "3" was pressed) in the incoming audio and pass the event to the bot to drive business logic (e.g. when 3 is pressed, return the account balance).
         */
        enabled?: boolean | null;
        /**
         * Endpoint timeout setting for matching dtmf input to regex.
         */
        endpointingTimeoutDuration?: string | null;
        /**
         * The digit that terminates a DTMF digit sequence.
         */
        finishDigit?: string | null;
        /**
         * Interdigit timeout setting for matching dtmf input to regex.
         */
        interdigitTimeoutDuration?: string | null;
        /**
         * Max length of DTMF digits.
         */
        maxDigits?: number | null;
    }
    /**
     * Define behaviors on logging.
     */
    export interface Schema$GoogleCloudDialogflowCxV3AdvancedSettingsLoggingSettings {
        /**
         * Enables consent-based end-user input redaction, if true, a pre-defined session parameter `$session.params.conversation-redaction` will be used to determine if the utterance should be redacted.
         */
        enableConsentBasedRedaction?: boolean | null;
        /**
         * Enables DF Interaction logging.
         */
        enableInteractionLogging?: boolean | null;
        /**
         * Enables Google Cloud Logging.
         */
        enableStackdriverLogging?: boolean | null;
    }
    /**
     * Define behaviors of speech to text detection.
     */
    export interface Schema$GoogleCloudDialogflowCxV3AdvancedSettingsSpeechSettings {
        /**
         * Sensitivity of the speech model that detects the end of speech. Scale from 0 to 100.
         */
        endpointerSensitivity?: number | null;
        /**
         * Mapping from language to Speech-to-Text model. The mapped Speech-to-Text model will be selected for requests from its corresponding language. For more information, see [Speech models](https://cloud.google.com/dialogflow/cx/docs/concept/speech-models).
         */
        models?: {
            [key: string]: string;
        } | null;
        /**
         * Timeout before detecting no speech.
         */
        noSpeechTimeout?: string | null;
        /**
         * Use timeout based endpointing, interpreting endpointer sensitivity as seconds of timeout value.
         */
        useTimeoutBasedEndpointing?: boolean | null;
    }
    /**
     * Represents the natural speech audio to be processed.
     */
    export interface Schema$GoogleCloudDialogflowCxV3AudioInput {
        /**
         * The natural language speech audio to be processed. A single request can contain up to 2 minutes of speech audio data. The transcribed text cannot contain more than 256 bytes. For non-streaming audio detect intent, both `config` and `audio` must be provided. For streaming audio detect intent, `config` must be provided in the first request and `audio` must be provided in all following requests.
         */
        audio?: string | null;
        /**
         * Required. Instructs the speech recognizer how to process the speech audio.
         */
        config?: Schema$GoogleCloudDialogflowCxV3InputAudioConfig;
    }
    /**
     * Configuration of the barge-in behavior. Barge-in instructs the API to return a detected utterance at a proper time while the client is playing back the response audio from a previous request. When the client sees the utterance, it should stop the playback and immediately get ready for receiving the responses for the current request. The barge-in handling requires the client to start streaming audio input as soon as it starts playing back the audio from the previous response. The playback is modeled into two phases: * No barge-in phase: which goes first and during which speech detection should not be carried out. * Barge-in phase: which follows the no barge-in phase and during which the API starts speech detection and may inform the client that an utterance has been detected. Note that no-speech event is not expected in this phase. The client provides this configuration in terms of the durations of those two phases. The durations are measured in terms of the audio length from the start of the input audio. No-speech event is a response with END_OF_UTTERANCE without any transcript following up.
     */
    export interface Schema$GoogleCloudDialogflowCxV3BargeInConfig {
        /**
         * Duration that is not eligible for barge-in at the beginning of the input audio.
         */
        noBargeInDuration?: string | null;
        /**
         * Total duration for the playback at the beginning of the input audio.
         */
        totalDuration?: string | null;
    }
    /**
     * Metadata returned for the TestCases.BatchRunTestCases long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3BatchRunTestCasesMetadata {
        /**
         * The test errors.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3TestError[];
    }
    /**
     * The response message for TestCases.BatchRunTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3BatchRunTestCasesResponse {
        /**
         * The test case results. The detailed conversation turns are empty in this response.
         */
        results?: Schema$GoogleCloudDialogflowCxV3TestCaseResult[];
    }
    /**
     * Action performed by end user or Dialogflow agent in the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Action {
        /**
         * Optional. Action performed by the agent as a message.
         */
        agentUtterance?: Schema$GoogleCloudDialogflowCxV3beta1AgentUtterance;
        /**
         * Output only. Timestamp of the completion of the agent action.
         */
        completeTime?: string | null;
        /**
         * Output only. The display name of the action.
         */
        displayName?: string | null;
        /**
         * Optional. The agent received an event from the customer or a system event is emitted.
         */
        event?: Schema$GoogleCloudDialogflowCxV3beta1Event;
        /**
         * Optional. Action performed on behalf of the agent by invoking a CX flow.
         */
        flowInvocation?: Schema$GoogleCloudDialogflowCxV3beta1FlowInvocation;
        /**
         * Optional. Output only. The state machine update in flows.
         */
        flowStateUpdate?: Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdate;
        /**
         * Optional. Action performed on behalf of the agent by transitioning to a target CX flow.
         */
        flowTransition?: Schema$GoogleCloudDialogflowCxV3beta1FlowTransition;
        /**
         * Optional. Output only. Intent Match in flows.
         */
        intentMatch?: Schema$GoogleCloudDialogflowCxV3beta1ActionIntentMatch;
        /**
         * Optional. Output only. LLM call performed by the agent.
         */
        llmCall?: Schema$GoogleCloudDialogflowCxV3beta1LlmCall;
        /**
         * Optional. Action performed on behalf of the agent by invoking a child playbook.
         */
        playbookInvocation?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookInvocation;
        /**
         * Optional. Action performed on behalf of the agent by transitioning to a target playbook.
         */
        playbookTransition?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookTransition;
        /**
         * Output only. Timestamp of the start of the agent action.
         */
        startTime?: string | null;
        /**
         * Optional. Output only. The status of the action.
         */
        status?: Schema$GoogleCloudDialogflowCxV3beta1Status;
        /**
         * Optional. Speech-to-text action performed by the agent.
         */
        stt?: Schema$GoogleCloudDialogflowCxV3beta1ActionSTT;
        /**
         * Optional. The detailed tracing information for sub execution steps of the action.
         */
        subExecutionSteps?: Schema$GoogleCloudDialogflowCxV3beta1Span[];
        /**
         * Optional. Action performed on behalf of the agent by calling a plugin tool.
         */
        toolUse?: Schema$GoogleCloudDialogflowCxV3beta1ToolUse;
        /**
         * Optional. Text-to-speech action performed by the agent.
         */
        tts?: Schema$GoogleCloudDialogflowCxV3beta1ActionTTS;
        /**
         * Optional. Agent obtained a message from the customer.
         */
        userUtterance?: Schema$GoogleCloudDialogflowCxV3beta1UserUtterance;
    }
    /**
     * Stores metadata of the state update action, such as a state machine execution in flows.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdate {
        /**
         * The destination of the transition. Format: `projects//locations//agents//flows//pages/` or `projects//locations//agents//playbooks/`.
         */
        destination?: string | null;
        /**
         * The type of the event that triggered the state update.
         */
        eventType?: string | null;
        /**
         * The function call to execute.
         */
        functionCall?: Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdateFunctionCall;
        /**
         * The updated page and flow state.
         */
        pageState?: Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdatePageState;
        /**
         * The updated parameters.
         */
        updatedParameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Stores the metadata of a function call to execute.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdateFunctionCall {
        /**
         * The name of the function call.
         */
        name?: string | null;
    }
    /**
     * Stores the state of a page and its flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionFlowStateUpdatePageState {
        /**
         * The display name of the page.
         */
        displayName?: string | null;
        /**
         * The ID of the page. Format: `projects//locations//agents//flows//pages/`.
         */
        page?: string | null;
        /**
         * The status of the page.
         */
        status?: string | null;
    }
    /**
     * Stores metadata of the intent match action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionIntentMatch {
        /**
         * The matched intent.
         */
        matchedIntents?: Schema$GoogleCloudDialogflowCxV3beta1ActionIntentMatchMatchedIntent[];
    }
    /**
     * Stores the matched intent, which is the result of the intent match action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionIntentMatchMatchedIntent {
        /**
         * The display name of the matched intent.
         */
        displayName?: string | null;
        /**
         * The generative fallback response of the matched intent.
         */
        generativeFallback?: {
            [key: string]: any;
        } | null;
        /**
         * The ID of the matched intent.
         */
        intentId?: string | null;
        /**
         * The score of the matched intent.
         */
        score?: number | null;
    }
    /**
     * Stores metadata of the Speech-to-Text action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionSTT {
    }
    /**
     * Stores metadata of the Text-to-Speech action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ActionTTS {
    }
    /**
     * Hierarchical advanced settings for agent/flow/page/fulfillment/parameter. Settings exposed at lower level overrides the settings exposed at higher level. Overriding occurs at the sub-setting level. For example, the playback_interruption_settings at fulfillment level only overrides the playback_interruption_settings at the agent level, leaving other settings at the agent level unchanged. DTMF settings does not override each other. DTMF settings set at different levels define DTMF detections running in parallel. Hierarchy: Agent-\>Flow-\>Page-\>Fulfillment/Parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings {
        /**
         * If present, incoming audio is exported by Dialogflow to the configured Google Cloud Storage destination. Exposed at the following levels: - Agent level - Flow level
         */
        audioExportGcsDestination?: Schema$GoogleCloudDialogflowCxV3beta1GcsDestination;
        /**
         * Settings for DTMF. Exposed at the following levels: - Agent level - Flow level - Page level - Parameter level.
         */
        dtmfSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsDtmfSettings;
        /**
         * Settings for logging. Settings for Dialogflow History, Contact Center messages, StackDriver logs, and speech logging. Exposed at the following levels: - Agent level.
         */
        loggingSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsLoggingSettings;
        /**
         * Settings for speech to text detection. Exposed at the following levels: - Agent level - Flow level - Page level - Parameter level
         */
        speechSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsSpeechSettings;
    }
    /**
     * Define behaviors for DTMF (dual tone multi frequency).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsDtmfSettings {
        /**
         * If true, incoming audio is processed for DTMF (dual tone multi frequency) events. For example, if the caller presses a button on their telephone keypad and DTMF processing is enabled, Dialogflow will detect the event (e.g. a "3" was pressed) in the incoming audio and pass the event to the bot to drive business logic (e.g. when 3 is pressed, return the account balance).
         */
        enabled?: boolean | null;
        /**
         * Endpoint timeout setting for matching dtmf input to regex.
         */
        endpointingTimeoutDuration?: string | null;
        /**
         * The digit that terminates a DTMF digit sequence.
         */
        finishDigit?: string | null;
        /**
         * Interdigit timeout setting for matching dtmf input to regex.
         */
        interdigitTimeoutDuration?: string | null;
        /**
         * Max length of DTMF digits.
         */
        maxDigits?: number | null;
    }
    /**
     * Define behaviors on logging.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsLoggingSettings {
        /**
         * Enables consent-based end-user input redaction, if true, a pre-defined session parameter `$session.params.conversation-redaction` will be used to determine if the utterance should be redacted.
         */
        enableConsentBasedRedaction?: boolean | null;
        /**
         * Enables DF Interaction logging.
         */
        enableInteractionLogging?: boolean | null;
        /**
         * Enables Google Cloud Logging.
         */
        enableStackdriverLogging?: boolean | null;
    }
    /**
     * Define behaviors of speech to text detection.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsSpeechSettings {
        /**
         * Sensitivity of the speech model that detects the end of speech. Scale from 0 to 100.
         */
        endpointerSensitivity?: number | null;
        /**
         * Mapping from language to Speech-to-Text model. The mapped Speech-to-Text model will be selected for requests from its corresponding language. For more information, see [Speech models](https://cloud.google.com/dialogflow/cx/docs/concept/speech-models).
         */
        models?: {
            [key: string]: string;
        } | null;
        /**
         * Timeout before detecting no speech.
         */
        noSpeechTimeout?: string | null;
        /**
         * Use timeout based endpointing, interpreting endpointer sensitivity as seconds of timeout value.
         */
        useTimeoutBasedEndpointing?: boolean | null;
    }
    /**
     * Agents are best described as Natural Language Understanding (NLU) modules that transform user requests into actionable data. You can include agents in your app, product, or service to determine user intent and respond to the user in a natural way. After you create an agent, you can add Intents, Entity Types, Flows, Fulfillments, Webhooks, TransitionRouteGroups and so on to manage the conversation flows.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Agent {
        /**
         * Hierarchical advanced settings for this agent. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * Optional. Answer feedback collection settings.
         */
        answerFeedbackSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentAnswerFeedbackSettings;
        /**
         * The URI of the agent's avatar. Avatars are used throughout the Dialogflow console and in the self-hosted [Web Demo](https://cloud.google.com/dialogflow/docs/integrations/web-demo) integration.
         */
        avatarUri?: string | null;
        /**
         * Optional. The BigQuery export settings for this agent. The conversation data will be exported to BigQuery tables if it is enabled. By default, BigQuery export settings will not be exported with agent. You need to set include_bigquery_export_settings to include it in the exported agent.
         */
        bigqueryExportSettings?: Schema$GoogleCloudDialogflowCxV3beta1BigQueryExportSettings;
        /**
         * Optional. Settings for custom client certificates.
         */
        clientCertificateSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentClientCertificateSettings;
        /**
         * Required. Immutable. The default language of the agent as a language tag. See [Language Support](https://cloud.google.com/dialogflow/cx/docs/reference/language) for a list of the currently supported language codes. This field cannot be set by the Agents.UpdateAgent method.
         */
        defaultLanguageCode?: string | null;
        /**
         * The description of the agent. The maximum length is 500 characters. If exceeded, the request is rejected.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the agent, unique within the location.
         */
        displayName?: string | null;
        /**
         * Optional. Enable training multi-lingual models for this agent. These models will be trained on all the languages supported by the agent.
         */
        enableMultiLanguageTraining?: boolean | null;
        /**
         * Indicates if automatic spell correction is enabled in detect intent requests.
         */
        enableSpellCorrection?: boolean | null;
        /**
         * Indicates if stackdriver logging is enabled for the agent. Please use agent.advanced_settings instead.
         */
        enableStackdriverLogging?: boolean | null;
        /**
         * Gen App Builder-related agent-level settings.
         */
        genAppBuilderSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentGenAppBuilderSettings;
        /**
         * Git integration settings for this agent.
         */
        gitIntegrationSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettings;
        /**
         * Indicates whether the agent is locked for changes. If the agent is locked, modifications to the agent will be rejected except for RestoreAgent.
         */
        locked?: boolean | null;
        /**
         * The unique identifier of the agent. Required for the Agents.UpdateAgent method. Agents.CreateAgent populates the name automatically. Format: `projects//locations//agents/`.
         */
        name?: string | null;
        /**
         * Optional. Settings for end user personalization.
         */
        personalizationSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentPersonalizationSettings;
        /**
         * Optional. Output only. A read only boolean field reflecting Zone Isolation status of the agent.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Optional. Output only. A read only boolean field reflecting Zone Separation status of the agent.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Name of the SecuritySettings reference for the agent. Format: `projects//locations//securitySettings/`.
         */
        securitySettings?: string | null;
        /**
         * Speech recognition related settings.
         */
        speechToTextSettings?: Schema$GoogleCloudDialogflowCxV3beta1SpeechToTextSettings;
        /**
         * Name of the start flow in this agent. A start flow will be automatically created when the agent is created, and can only be deleted by deleting the agent. Format: `projects//locations//agents//flows/`. Currently only the default start flow with id "00000000-0000-0000-0000-000000000000" is allowed.
         */
        startFlow?: string | null;
        /**
         * Name of the start playbook in this agent. A start playbook will be automatically created when the agent is created, and can only be deleted by deleting the agent. Format: `projects//locations//agents//playbooks/`. Currently only the default playbook with id "00000000-0000-0000-0000-000000000000" is allowed.
         */
        startPlaybook?: string | null;
        /**
         * The list of all languages supported by the agent (except for the `default_language_code`).
         */
        supportedLanguageCodes?: string[] | null;
        /**
         * Settings on instructing the speech synthesizer on how to generate the output audio content.
         */
        textToSpeechSettings?: Schema$GoogleCloudDialogflowCxV3beta1TextToSpeechSettings;
        /**
         * Required. The time zone of the agent from the [time zone database](https://www.iana.org/time-zones), e.g., America/New_York, Europe/Paris.
         */
        timeZone?: string | null;
    }
    /**
     * Settings for answer feedback collection.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentAnswerFeedbackSettings {
        /**
         * Optional. If enabled, end users will be able to provide answer feedback to Dialogflow responses. Feature works only if interaction logging is enabled in the Dialogflow agent.
         */
        enableAnswerFeedback?: boolean | null;
    }
    /**
     * Settings for custom client certificates.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentClientCertificateSettings {
        /**
         * Optional. The name of the SecretManager secret version resource storing the passphrase. 'passphrase' should be left unset if the private key is not encrypted. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        passphrase?: string | null;
        /**
         * Required. The name of the SecretManager secret version resource storing the private key encoded in PEM format. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        privateKey?: string | null;
        /**
         * Required. The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines.
         */
        sslCertificate?: string | null;
    }
    /**
     * Settings for Gen App Builder.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentGenAppBuilderSettings {
        /**
         * Required. The full name of the Gen App Builder engine related to this agent if there is one. Format: `projects/{Project ID\}/locations/{Location ID\}/collections/{Collection ID\}/engines/{Engine ID\}`
         */
        engine?: string | null;
    }
    /**
     * Settings for connecting to Git repository for an agent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettings {
        /**
         * Git connection settings.
         */
        gitConnectionSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettingsGitConnectionSettings;
        /**
         * GitHub settings.
         */
        githubSettings?: Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettingsGithubSettings;
    }
    /**
     * Integration settings for a Git service hosted on Cloud Run.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettingsGitConnectionSettings {
        /**
         * The name of the SecretManager secret version resource storing the git access token. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        accessTokenSecret?: string | null;
        /**
         * Optional. List of branches configured for the repository.
         */
        branches?: string[] | null;
        /**
         * Required. Display name for the repository
         */
        displayName?: string | null;
        /**
         * Required. Git server reporitory URI.
         */
        repositoryUri?: string | null;
        /**
         * Required. Default branch of the repository.
         */
        trackingBranch?: string | null;
    }
    /**
     * Settings of integration with GitHub.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentGitIntegrationSettingsGithubSettings {
        /**
         * The access token used to authenticate the access to the GitHub repository.
         */
        accessToken?: string | null;
        /**
         * A list of branches configured to be used from Dialogflow.
         */
        branches?: string[] | null;
        /**
         * The unique repository display name for the GitHub repository.
         */
        displayName?: string | null;
        /**
         * The GitHub repository URI related to the agent.
         */
        repositoryUri?: string | null;
        /**
         * The branch of the GitHub repository tracked for this agent.
         */
        trackingBranch?: string | null;
    }
    /**
     * Settings for end user personalization.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentPersonalizationSettings {
        /**
         * Optional. Default end user metadata, used when processing DetectIntent requests. Recommended to be filled as a template instead of hard-coded value, for example { "age": "$session.params.age" \}. The data will be merged with the QueryParameters.end_user_metadata in DetectIntentRequest.query_params during query processing.
         */
        defaultEndUserMetadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * AgentUtterance represents one message sent by the agent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentUtterance {
        /**
         * Optional. True if the agent utterance needs to be generated by the LLM. Only used in webhook response to differentiate from empty text. Revisit whether we need this field or mark `text` as optional when we expose webhook interface to customer.
         */
        requireGeneration?: boolean | null;
        /**
         * Required. Message content in text.
         */
        text?: string | null;
    }
    /**
     * The response message for Agents.GetAgentValidationResult.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult {
        /**
         * Contains all flow validation results.
         */
        flowValidationResults?: Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult[];
        /**
         * The unique identifier of the agent validation result. Format: `projects//locations//agents//validationResult`.
         */
        name?: string | null;
    }
    /**
     * Stores information about feedback provided by users about a response.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback {
        /**
         * Optional. Custom rating from the user about the provided answer, with maximum length of 1024 characters. For example, client could use a customized JSON object to indicate the rating.
         */
        customRating?: string | null;
        /**
         * Optional. Rating from user for the specific Dialogflow response.
         */
        rating?: string | null;
        /**
         * Optional. In case of thumbs down rating provided, users can optionally provide context about the rating.
         */
        ratingReason?: Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedbackRatingReason;
    }
    /**
     * Stores extra information about why users provided thumbs down rating.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedbackRatingReason {
        /**
         * Optional. Additional feedback about the rating. This field can be populated without choosing a predefined `reason`.
         */
        feedback?: string | null;
        /**
         * Optional. Custom reason labels for thumbs down rating provided by the user. The maximum number of labels allowed is 10 and the maximum length of a single label is 128 characters.
         */
        reasonLabels?: string[] | null;
    }
    /**
     * Represents the natural speech audio to be processed.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1AudioInput {
        /**
         * The natural language speech audio to be processed. A single request can contain up to 2 minutes of speech audio data. The transcribed text cannot contain more than 256 bytes. For non-streaming audio detect intent, both `config` and `audio` must be provided. For streaming audio detect intent, `config` must be provided in the first request and `audio` must be provided in all following requests.
         */
        audio?: string | null;
        /**
         * Required. Instructs the speech recognizer how to process the speech audio.
         */
        config?: Schema$GoogleCloudDialogflowCxV3beta1InputAudioConfig;
    }
    /**
     * Configuration of the barge-in behavior. Barge-in instructs the API to return a detected utterance at a proper time while the client is playing back the response audio from a previous request. When the client sees the utterance, it should stop the playback and immediately get ready for receiving the responses for the current request. The barge-in handling requires the client to start streaming audio input as soon as it starts playing back the audio from the previous response. The playback is modeled into two phases: * No barge-in phase: which goes first and during which speech detection should not be carried out. * Barge-in phase: which follows the no barge-in phase and during which the API starts speech detection and may inform the client that an utterance has been detected. Note that no-speech event is not expected in this phase. The client provides this configuration in terms of the durations of those two phases. The durations are measured in terms of the audio length from the start of the input audio. No-speech event is a response with END_OF_UTTERANCE without any transcript following up.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BargeInConfig {
        /**
         * Duration that is not eligible for barge-in at the beginning of the input audio.
         */
        noBargeInDuration?: string | null;
        /**
         * Total duration for the playback at the beginning of the input audio.
         */
        totalDuration?: string | null;
    }
    /**
     * The request message for TestCases.BatchDeleteTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BatchDeleteTestCasesRequest {
        /**
         * Required. Format of test case names: `projects//locations//agents//testCases/`.
         */
        names?: string[] | null;
    }
    /**
     * Metadata returned for the TestCases.BatchRunTestCases long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BatchRunTestCasesMetadata {
        /**
         * The test errors.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3beta1TestError[];
    }
    /**
     * The request message for TestCases.BatchRunTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BatchRunTestCasesRequest {
        /**
         * Optional. If not set, draft environment is assumed. Format: `projects//locations//agents//environments/`.
         */
        environment?: string | null;
        /**
         * Required. Format: `projects//locations//agents//testCases/`.
         */
        testCases?: string[] | null;
    }
    /**
     * The response message for TestCases.BatchRunTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BatchRunTestCasesResponse {
        /**
         * The test case results. The detailed conversation turns are empty in this response.
         */
        results?: Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult[];
    }
    /**
     * The settings of BigQuery export.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BigQueryExportSettings {
        /**
         * The BigQuery table to export. Format: `projects//datasets//tables/`.
         */
        bigqueryTable?: string | null;
        /**
         * The field to indicate whether the BigQuery export is enabled.
         */
        enabled?: boolean | null;
    }
    /**
     * Boost specification to boost certain documents. A copy of google.cloud.discoveryengine.v1main.BoostSpec, field documentation is available at https://cloud.google.com/generative-ai-app-builder/docs/reference/rest/v1alpha/BoostSpec
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BoostSpec {
        /**
         * Optional. Condition boost specifications. If a document matches multiple conditions in the specifications, boost scores from these specifications are all applied and combined in a non-linear way. Maximum number of specifications is 20.
         */
        conditionBoostSpecs?: Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpec[];
    }
    /**
     * Boost applies to documents which match a condition.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpec {
        /**
         * Optional. Strength of the condition boost, which should be in [-1, 1]. Negative boost means demotion. Default is 0.0. Setting to 1.0 gives the document a big promotion. However, it does not necessarily mean that the boosted document will be the top result at all times, nor that other documents will be excluded. Results could still be shown even when none of them matches the condition. And results that are significantly more relevant to the search query can still trump your heavily favored but irrelevant documents. Setting to -1.0 gives the document a big demotion. However, results that are deeply relevant might still be shown. The document will have an upstream battle to get a fairly high ranking, but it is not blocked out completely. Setting to 0.0 means no boost applied. The boosting condition is ignored.
         */
        boost?: number | null;
        /**
         * Optional. Complex specification for custom ranking based on customer defined attribute value.
         */
        boostControlSpec?: Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpecBoostControlSpec;
        /**
         * Optional. An expression which specifies a boost condition. The syntax and supported fields are the same as a filter expression. Examples: * To boost documents with document ID "doc_1" or "doc_2", and color "Red" or "Blue": * (id: ANY("doc_1", "doc_2")) AND (color: ANY("Red","Blue"))
         */
        condition?: string | null;
    }
    /**
     * Specification for custom ranking based on customer specified attribute value. It provides more controls for customized ranking than the simple (condition, boost) combination above.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpecBoostControlSpec {
        /**
         * Optional. The attribute type to be used to determine the boost amount. The attribute value can be derived from the field value of the specified field_name. In the case of numerical it is straightforward i.e. attribute_value = numerical_field_value. In the case of freshness however, attribute_value = (time.now() - datetime_field_value).
         */
        attributeType?: string | null;
        /**
         * Optional. The control points used to define the curve. The monotonic function (defined through the interpolation_type above) passes through the control points listed here.
         */
        controlPoints?: Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpecBoostControlSpecControlPoint[];
        /**
         * Optional. The name of the field whose value will be used to determine the boost amount.
         */
        fieldName?: string | null;
        /**
         * Optional. The interpolation type to be applied to connect the control points listed below.
         */
        interpolationType?: string | null;
    }
    /**
     * The control points used to define the curve. The curve defined through these control points can only be monotonically increasing or decreasing(constant values are acceptable).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BoostSpecConditionBoostSpecBoostControlSpecControlPoint {
        /**
         * Optional. Can be one of: 1. The numerical field value. 2. The duration spec for freshness: The value must be formatted as an XSD `dayTimeDuration` value (a restricted subset of an ISO 8601 duration value). The pattern for this is: `nDnM]`.
         */
        attributeValue?: string | null;
        /**
         * Optional. The value between -1 to 1 by which to boost the score if the attribute_value evaluates to the value specified above.
         */
        boostAmount?: number | null;
    }
    /**
     * Boost specifications for data stores.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1BoostSpecs {
        /**
         * Optional. Data Stores where the boosting configuration is applied. The full names of the referenced data stores. Formats: `projects/{project\}/locations/{location\}/collections/{collection\}/dataStores/{data_store\}` `projects/{project\}/locations/{location\}/dataStores/{data_store\}
         */
        dataStores?: string[] | null;
        /**
         * Optional. A list of boosting specifications.
         */
        spec?: Schema$GoogleCloudDialogflowCxV3beta1BoostSpec[];
    }
    /**
     * The response message for TestCases.CalculateCoverage.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse {
        /**
         * The agent to calculate coverage for. Format: `projects//locations//agents/`.
         */
        agent?: string | null;
        /**
         * Intent coverage.
         */
        intentCoverage?: Schema$GoogleCloudDialogflowCxV3beta1IntentCoverage;
        /**
         * Transition route group coverage.
         */
        routeGroupCoverage?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverage;
        /**
         * Transition (excluding transition route groups) coverage.
         */
        transitionCoverage?: Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverage;
    }
    /**
     * Changelogs represents a change made to a given agent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Changelog {
        /**
         * The action of the change.
         */
        action?: string | null;
        /**
         * The timestamp of the change.
         */
        createTime?: string | null;
        /**
         * The affected resource display name of the change.
         */
        displayName?: string | null;
        /**
         * The affected language code of the change.
         */
        languageCode?: string | null;
        /**
         * The unique identifier of the changelog. Format: `projects//locations//agents//changelogs/`.
         */
        name?: string | null;
        /**
         * The affected resource name of the change.
         */
        resource?: string | null;
        /**
         * The affected resource type.
         */
        type?: string | null;
        /**
         * Email address of the authenticated user.
         */
        userEmail?: string | null;
    }
    /**
     * The request message for Versions.CompareVersions.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsRequest {
        /**
         * The language to compare the flow versions for. If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string | null;
        /**
         * Required. Name of the target flow version to compare with the base version. Use version ID `0` to indicate the draft version of the specified flow. Format: `projects//locations//agents//flows//versions/`.
         */
        targetVersion?: string | null;
    }
    /**
     * The response message for Versions.CompareVersions.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse {
        /**
         * JSON representation of the base version content.
         */
        baseVersionContentJson?: string | null;
        /**
         * The timestamp when the two version compares.
         */
        compareTime?: string | null;
        /**
         * JSON representation of the target version content.
         */
        targetVersionContentJson?: string | null;
    }
    /**
     * Represents a result from running a test case in an agent environment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ContinuousTestResult {
        /**
         * The resource name for the continuous test result. Format: `projects//locations//agents//environments//continuousTestResults/`.
         */
        name?: string | null;
        /**
         * The result of this continuous test run, i.e. whether all the tests in this continuous test run pass or not.
         */
        result?: string | null;
        /**
         * Time when the continuous testing run starts.
         */
        runTime?: string | null;
        /**
         * A list of individual test case results names in this continuous test run.
         */
        testCaseResults?: string[] | null;
    }
    /**
     * Represents a conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Conversation {
        /**
         * Duration of the conversation.
         */
        duration?: string | null;
        /**
         * Environment of the conversation. Only `name` and `display_name` are filled in this message.
         */
        environment?: Schema$GoogleCloudDialogflowCxV3beta1Environment;
        /**
         * All the Flow the conversation has went through. Only `name` and `display_name` are filled in this message.
         */
        flows?: Schema$GoogleCloudDialogflowCxV3beta1Flow[];
        /**
         * Flow versions used in the conversation.
         */
        flowVersions?: {
            [key: string]: string;
        } | null;
        /**
         * All the matched Intent in the conversation. Only `name` and `display_name` are filled in this message.
         */
        intents?: Schema$GoogleCloudDialogflowCxV3beta1Intent[];
        /**
         * Interactions of the conversation. Only populated for `GetConversation` and empty for `ListConversations`.
         */
        interactions?: Schema$GoogleCloudDialogflowCxV3beta1ConversationInteraction[];
        /**
         * The language of the conversation, which is the language of the first request in the conversation.
         */
        languageCode?: string | null;
        /**
         * Conversation metrics.
         */
        metrics?: Schema$GoogleCloudDialogflowCxV3beta1ConversationMetrics;
        /**
         * Identifier. The identifier of the conversation. If conversation ID is reused, interactions happened later than 48 hours of the conversation's create time will be ignored. Format: `projects//locations//agents//conversations/`
         */
        name?: string | null;
        /**
         * All the Page the conversation has went through. Only `name` and `display_name` are filled in this message.
         */
        pages?: Schema$GoogleCloudDialogflowCxV3beta1Page[];
        /**
         * Start time of the conversation, which is the time of the first request of the conversation.
         */
        startTime?: string | null;
        /**
         * The type of the conversation.
         */
        type?: string | null;
    }
    /**
     * Represents an interaction between an end user and a Dialogflow CX agent using V3 (Streaming)DetectIntent API, or an interaction between an end user and a Dialogflow CX agent using V2 (Streaming)AnalyzeContent API.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationInteraction {
        /**
         * Answer feedback for the final response.
         */
        answerFeedback?: Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback;
        /**
         * The time that the interaction was created.
         */
        createTime?: string | null;
        /**
         * Missing transition predicted for the interaction. This field is set only if the interaction match type was no-match.
         */
        missingTransition?: Schema$GoogleCloudDialogflowCxV3beta1ConversationInteractionMissingTransition;
        /**
         * The partial responses of the interaction. Empty if there is no partial response in the interaction. See the partial response documentation.
         */
        partialResponses?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse[];
        /**
         * The request of the interaction.
         */
        request?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest;
        /**
         * The input text or the transcript of the input audio in the request.
         */
        requestUtterances?: string | null;
        /**
         * The final response of the interaction.
         */
        response?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse;
        /**
         * The output text or the transcript of the output audio in the responses. If multiple output messages are returned, they will be concatenated into one.
         */
        responseUtterances?: string | null;
        /**
         * Metrics associated with different processing steps. Names and number of steps depend on the request and can change without a notice.
         */
        stepMetrics?: Schema$GoogleCloudDialogflowCxV3beta1ConversationInteractionStepMetrics[];
    }
    /**
     * Information collected for DF CX agents in case NLU predicted an intent that was filtered out as being inactive which may indicate a missing transition and/or absent functionality.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationInteractionMissingTransition {
        /**
         * Name of the intent that could have triggered.
         */
        intentDisplayName?: string | null;
        /**
         * Score of the above intent. The higher it is the more likely a transition was missed on a given page.
         */
        score?: number | null;
    }
    /**
     * Metrics of each processing step.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationInteractionStepMetrics {
        /**
         * Processing latency of the step.
         */
        latency?: string | null;
        /**
         * Name of the request processing step.
         */
        name?: string | null;
    }
    /**
     * Represents metrics for the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationMetrics {
        /**
         * The average confidence all of the Match in the conversation. Values range from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        averageMatchConfidence?: number | null;
        /**
         * A signal that indicates the interaction with the Dialogflow agent has ended. If any response has the ResponseMessage.end_interaction signal, this is set to true.
         */
        hasEndInteraction?: boolean | null;
        /**
         * Hands off conversation to a human agent. If any response has the ResponseMessage.live_agent_handoffsignal, this is set to true.
         */
        hasLiveAgentHandoff?: boolean | null;
        /**
         * Duration of all the input's audio in the conversation.
         */
        inputAudioDuration?: string | null;
        /**
         * The number of interactions in the conversation.
         */
        interactionCount?: number | null;
        /**
         * Match type counts.
         */
        matchTypeCount?: Schema$GoogleCloudDialogflowCxV3beta1ConversationMetricsMatchTypeCount;
        /**
         * Maximum latency of the Webhook calls in the conversation.
         */
        maxWebhookLatency?: string | null;
        /**
         * Duration of all the output's audio in the conversation.
         */
        outputAudioDuration?: string | null;
        /**
         * Query input counts.
         */
        queryInputCount?: Schema$GoogleCloudDialogflowCxV3beta1ConversationMetricsQueryInputCount;
    }
    /**
     * Count by Match.MatchType of the matches in the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationMetricsMatchTypeCount {
        /**
         * The number of matches with type Match.MatchType.DIRECT_INTENT.
         */
        directIntentCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.EVENT.
         */
        eventCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.INTENT.
         */
        intentCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.NO_INPUT.
         */
        noInputCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.NO_MATCH.
         */
        noMatchCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.PARAMETER_FILLING.
         */
        parameterFillingCount?: number | null;
        /**
         * The number of matches with type Match.MatchType.MATCH_TYPE_UNSPECIFIED.
         */
        unspecifiedCount?: number | null;
    }
    /**
     * Count by types of QueryInput of the requests in the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationMetricsQueryInputCount {
        /**
         * The number of AudioInput in the conversation.
         */
        audioCount?: number | null;
        /**
         * The number of DtmfInput in the conversation.
         */
        dtmfCount?: number | null;
        /**
         * The number of EventInput in the conversation.
         */
        eventCount?: number | null;
        /**
         * The number of IntentInput in the conversation.
         */
        intentCount?: number | null;
        /**
         * The number of TextInput in the conversation.
         */
        textCount?: number | null;
    }
    /**
     * This message is used to hold all the Conversation Signals data, which will be converted to JSON and exported to BigQuery.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationSignals {
        /**
         * Required. Turn signals for the current turn.
         */
        turnSignals?: Schema$GoogleCloudDialogflowCxV3beta1TurnSignals;
    }
    /**
     * One interaction between a human and virtual agent. The human provides some input and the virtual agent provides a response.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationTurn {
        /**
         * The user input.
         */
        userInput?: Schema$GoogleCloudDialogflowCxV3beta1ConversationTurnUserInput;
        /**
         * The virtual agent output.
         */
        virtualAgentOutput?: Schema$GoogleCloudDialogflowCxV3beta1ConversationTurnVirtualAgentOutput;
    }
    /**
     * The input from the human user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationTurnUserInput {
        /**
         * Whether sentiment analysis is enabled.
         */
        enableSentimentAnalysis?: boolean | null;
        /**
         * Parameters that need to be injected into the conversation during intent detection.
         */
        injectedParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Supports text input, event input, dtmf input in the test case.
         */
        input?: Schema$GoogleCloudDialogflowCxV3beta1QueryInput;
        /**
         * If webhooks should be allowed to trigger in response to the user utterance. Often if parameters are injected, webhooks should not be enabled.
         */
        isWebhookEnabled?: boolean | null;
    }
    /**
     * The output from the virtual agent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ConversationTurnVirtualAgentOutput {
        /**
         * The Page on which the utterance was spoken. Only name and displayName will be set.
         */
        currentPage?: Schema$GoogleCloudDialogflowCxV3beta1Page;
        /**
         * Required. Input only. The diagnostic info output for the turn. Required to calculate the testing coverage.
         */
        diagnosticInfo?: {
            [key: string]: any;
        } | null;
        /**
         * Output only. If this is part of a result conversation turn, the list of differences between the original run and the replay for this output, if any.
         */
        differences?: Schema$GoogleCloudDialogflowCxV3beta1TestRunDifference[];
        /**
         * The session parameters available to the bot at this point.
         */
        sessionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Response error from the agent in the test result. If set, other output is empty.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The text responses from the agent for the turn.
         */
        textResponses?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageText[];
        /**
         * The Intent that triggered the response. Only name and displayName will be set.
         */
        triggeredIntent?: Schema$GoogleCloudDialogflowCxV3beta1Intent;
    }
    /**
     * Metadata associated with the long running operation for Versions.CreateVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1CreateVersionOperationMetadata {
        /**
         * Name of the created version. Format: `projects//locations//agents//flows//versions/`.
         */
        version?: string | null;
    }
    /**
     * A data store connection. It represents a data store in Discovery Engine and the type of the contents it contains.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnection {
        /**
         * The full name of the referenced data store. Formats: `projects/{project\}/locations/{location\}/collections/{collection\}/dataStores/{data_store\}` `projects/{project\}/locations/{location\}/dataStores/{data_store\}`
         */
        dataStore?: string | null;
        /**
         * The type of the connected data store.
         */
        dataStoreType?: string | null;
        /**
         * The document processing mode for the data store connection. Should only be set for PUBLIC_WEB and UNSTRUCTURED data stores. If not set it is considered as DOCUMENTS, as this is the legacy mode.
         */
        documentProcessingMode?: string | null;
    }
    /**
     * Data store connection feature output signals. Might be only partially field if processing stop before the final answer. Reasons for this can be, but are not limited to: empty UCS search results, positive RAI check outcome, grounding failure, ...
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignals {
        /**
         * Optional. The final compiled answer.
         */
        answer?: string | null;
        /**
         * Optional. Diagnostic info related to the answer generation model call.
         */
        answerGenerationModelCallSignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsAnswerGenerationModelCallSignals;
        /**
         * Optional. Answer parts with relevant citations. Concatenation of texts should add up the `answer` (not counting whitespaces).
         */
        answerParts?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsAnswerPart[];
        /**
         * Optional. Snippets cited by the answer generation model from the most to least relevant.
         */
        citedSnippets?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsCitedSnippet[];
        /**
         * Optional. Grounding signals.
         */
        groundingSignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsGroundingSignals;
        /**
         * Optional. Diagnostic info related to the rewriter model call.
         */
        rewriterModelCallSignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsRewriterModelCallSignals;
        /**
         * Optional. Rewritten string query used for search.
         */
        rewrittenQuery?: string | null;
        /**
         * Optional. Safety check result.
         */
        safetySignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsSafetySignals;
        /**
         * Optional. Search snippets included in the answer generation prompt.
         */
        searchSnippets?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsSearchSnippet[];
    }
    /**
     * Diagnostic info related to the answer generation model call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsAnswerGenerationModelCallSignals {
        /**
         * Name of the generative model. For example, "gemini-ultra", "gemini-pro", "gemini-1.5-flash" etc. Defaults to "Other" if the model is unknown.
         */
        model?: string | null;
        /**
         * Output of the generative model.
         */
        modelOutput?: string | null;
        /**
         * Prompt as sent to the model.
         */
        renderedPrompt?: string | null;
    }
    /**
     * Answer part with citation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsAnswerPart {
        /**
         * Citations for this answer part. Indices of `search_snippets`.
         */
        supportingIndices?: number[] | null;
        /**
         * Substring of the answer.
         */
        text?: string | null;
    }
    /**
     * Snippet cited by the answer generation model.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsCitedSnippet {
        /**
         * Details of the snippet.
         */
        searchSnippet?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsSearchSnippet;
        /**
         * Index of the snippet in `search_snippets` field.
         */
        snippetIndex?: number | null;
    }
    /**
     * Grounding signals.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsGroundingSignals {
        /**
         * Represents the decision of the grounding check.
         */
        decision?: string | null;
        /**
         * Grounding score bucket setting.
         */
        score?: string | null;
    }
    /**
     * Diagnostic info related to the rewriter model call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsRewriterModelCallSignals {
        /**
         * Name of the generative model. For example, "gemini-ultra", "gemini-pro", "gemini-1.5-flash" etc. Defaults to "Other" if the model is unknown.
         */
        model?: string | null;
        /**
         * Output of the generative model.
         */
        modelOutput?: string | null;
        /**
         * Prompt as sent to the model.
         */
        renderedPrompt?: string | null;
    }
    /**
     * Safety check results.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsSafetySignals {
        /**
         * Specifies banned phrase match subject.
         */
        bannedPhraseMatch?: string | null;
        /**
         * Safety decision.
         */
        decision?: string | null;
        /**
         * The matched banned phrase if there was a match.
         */
        matchedBannedPhrase?: string | null;
    }
    /**
     * Search snippet details.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignalsSearchSnippet {
        /**
         * Title of the enclosing document.
         */
        documentTitle?: string | null;
        /**
         * Uri for the document. Present if specified for the document.
         */
        documentUri?: string | null;
        /**
         * Text included in the prompt.
         */
        text?: string | null;
    }
    /**
     * Metadata returned for the Environments.DeployFlow long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DeployFlowMetadata {
        /**
         * Errors of running deployment tests.
         */
        testErrors?: Schema$GoogleCloudDialogflowCxV3beta1TestError[];
    }
    /**
     * The request message for Environments.DeployFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DeployFlowRequest {
        /**
         * Required. The flow version to deploy. Format: `projects//locations//agents//flows//versions/`.
         */
        flowVersion?: string | null;
    }
    /**
     * The response message for Environments.DeployFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DeployFlowResponse {
        /**
         * The name of the flow version deployment. Format: `projects//locations//agents//environments//deployments/`.
         */
        deployment?: string | null;
        /**
         * The updated environment where the flow is deployed.
         */
        environment?: Schema$GoogleCloudDialogflowCxV3beta1Environment;
    }
    /**
     * Represents a deployment in an environment. A deployment happens when a flow version configured to be active in the environment. You can configure running pre-deployment steps, e.g. running validation test cases, experiment auto-rollout, etc.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Deployment {
        /**
         * End time of this deployment.
         */
        endTime?: string | null;
        /**
         * The name of the flow version for this deployment. Format: projects//locations//agents//flows//versions/.
         */
        flowVersion?: string | null;
        /**
         * The name of the deployment. Format: projects//locations//agents//environments//deployments/.
         */
        name?: string | null;
        /**
         * Result of the deployment.
         */
        result?: Schema$GoogleCloudDialogflowCxV3beta1DeploymentResult;
        /**
         * Start time of this deployment.
         */
        startTime?: string | null;
        /**
         * The current state of the deployment.
         */
        state?: string | null;
    }
    /**
     * Result of the deployment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DeploymentResult {
        /**
         * Results of test cases running before the deployment. Format: `projects//locations//agents//testCases//results/`.
         */
        deploymentTestResults?: string[] | null;
        /**
         * The name of the experiment triggered by this deployment. Format: projects//locations//agents//environments//experiments/.
         */
        experiment?: string | null;
    }
    /**
     * The request to detect user's intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest {
        /**
         * Instructs the speech synthesizer how to generate the output audio.
         */
        outputAudioConfig?: Schema$GoogleCloudDialogflowCxV3beta1OutputAudioConfig;
        /**
         * Required. The input specification.
         */
        queryInput?: Schema$GoogleCloudDialogflowCxV3beta1QueryInput;
        /**
         * The parameters of this query.
         */
        queryParams?: Schema$GoogleCloudDialogflowCxV3beta1QueryParameters;
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session). Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         */
        session?: string | null;
    }
    /**
     * The message returned from the DetectIntent method.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse {
        /**
         * Indicates whether the partial response can be cancelled when a later response arrives. e.g. if the agent specified some music as partial response, it can be cancelled.
         */
        allowCancellation?: boolean | null;
        /**
         * The audio data bytes encoded as specified in the request. Note: The output audio is generated based on the values of default platform text responses found in the `query_result.response_messages` field. If multiple default text responses exist, they will be concatenated when generating audio. If no default platform text responses exist, the generated audio content will be empty. In some scenarios, multiple output audio fields may be present in the response structure. In these cases, only the top-most-level audio output has content.
         */
        outputAudio?: string | null;
        /**
         * The config used by the speech synthesizer to generate the output audio.
         */
        outputAudioConfig?: Schema$GoogleCloudDialogflowCxV3beta1OutputAudioConfig;
        /**
         * The result of the conversational query.
         */
        queryResult?: Schema$GoogleCloudDialogflowCxV3beta1QueryResult;
        /**
         * Output only. The unique identifier of the response. It can be used to locate a response in the training example set or for reporting issues.
         */
        responseId?: string | null;
        /**
         * Response type.
         */
        responseType?: string | null;
    }
    /**
     * Represents the input for dtmf event.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1DtmfInput {
        /**
         * The dtmf digits.
         */
        digits?: string | null;
        /**
         * The finish digit (if any).
         */
        finishDigit?: string | null;
    }
    /**
     * Entities are extracted from user input and represent parameters that are meaningful to your application. For example, a date range, a proper name such as a geographic location or landmark, and so on. Entities represent actionable data for your application. When you define an entity, you can also include synonyms that all map to that entity. For example, "soft drink", "soda", "pop", and so on. There are three types of entities: * **System** - entities that are defined by the Dialogflow API for common data types such as date, time, currency, and so on. A system entity is represented by the `EntityType` type. * **Custom** - entities that are defined by you that represent actionable data that is meaningful to your application. For example, you could define a `pizza.sauce` entity for red or white pizza sauce, a `pizza.cheese` entity for the different types of cheese on a pizza, a `pizza.topping` entity for different toppings, and so on. A custom entity is represented by the `EntityType` type. * **User** - entities that are built for an individual user such as favorites, preferences, playlists, and so on. A user entity is represented by the SessionEntityType type. For more information about entity types, see the [Dialogflow documentation](https://cloud.google.com/dialogflow/docs/entities-overview).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EntityType {
        /**
         * Indicates whether the entity type can be automatically expanded.
         */
        autoExpansionMode?: string | null;
        /**
         * Required. The human-readable name of the entity type, unique within the agent.
         */
        displayName?: string | null;
        /**
         * Enables fuzzy entity extraction during classification.
         */
        enableFuzzyExtraction?: boolean | null;
        /**
         * The collection of entity entries associated with the entity type.
         */
        entities?: Schema$GoogleCloudDialogflowCxV3beta1EntityTypeEntity[];
        /**
         * Collection of exceptional words and phrases that shouldn't be matched. For example, if you have a size entity type with entry `giant`(an adjective), you might consider adding `giants`(a noun) as an exclusion. If the kind of entity type is `KIND_MAP`, then the phrases specified by entities and excluded phrases should be mutually exclusive.
         */
        excludedPhrases?: Schema$GoogleCloudDialogflowCxV3beta1EntityTypeExcludedPhrase[];
        /**
         * Required. Indicates the kind of entity type.
         */
        kind?: string | null;
        /**
         * The unique identifier of the entity type. Required for EntityTypes.UpdateEntityType. Format: `projects//locations//agents//entityTypes/`.
         */
        name?: string | null;
        /**
         * Indicates whether parameters of the entity type should be redacted in log. If redaction is enabled, page parameters and intent parameters referring to the entity type will be replaced by parameter name during logging.
         */
        redact?: boolean | null;
    }
    /**
     * An **entity entry** for an associated entity type.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EntityTypeEntity {
        /**
         * Required. A collection of value synonyms. For example, if the entity type is *vegetable*, and `value` is *scallions*, a synonym could be *green onions*. For `KIND_LIST` entity types: * This collection must contain exactly one synonym equal to `value`.
         */
        synonyms?: string[] | null;
        /**
         * Required. The primary value associated with this entity entry. For example, if the entity type is *vegetable*, the value could be *scallions*. For `KIND_MAP` entity types: * A canonical value to be used in place of synonyms. For `KIND_LIST` entity types: * A string that can contain references to other entity types (with or without aliases).
         */
        value?: string | null;
    }
    /**
     * An excluded entity phrase that should not be matched.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EntityTypeExcludedPhrase {
        /**
         * Required. The word or phrase to be excluded.
         */
        value?: string | null;
    }
    /**
     * Represents an environment for an agent. You can create multiple versions of your agent and publish them to separate environments. When you edit an agent, you are editing the draft agent. At any point, you can save the draft agent as an agent version, which is an immutable snapshot of your agent. When you save the draft agent, it is published to the default environment. When you create agent versions, you can publish them to custom environments. You can create a variety of custom environments for testing, development, production, etc.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Environment {
        /**
         * The human-readable description of the environment. The maximum length is 500 characters. If exceeded, the request is rejected.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the environment (unique in an agent). Limit of 64 characters.
         */
        displayName?: string | null;
        /**
         * The name of the environment. Format: `projects//locations//agents//environments/`.
         */
        name?: string | null;
        /**
         * The test cases config for continuous tests of this environment.
         */
        testCasesConfig?: Schema$GoogleCloudDialogflowCxV3beta1EnvironmentTestCasesConfig;
        /**
         * Output only. Update time of this environment.
         */
        updateTime?: string | null;
        /**
         * A list of configurations for flow versions. You should include version configs for all flows that are reachable from `Start Flow` in the agent. Otherwise, an error will be returned.
         */
        versionConfigs?: Schema$GoogleCloudDialogflowCxV3beta1EnvironmentVersionConfig[];
        /**
         * The webhook configuration for this environment.
         */
        webhookConfig?: Schema$GoogleCloudDialogflowCxV3beta1EnvironmentWebhookConfig;
    }
    /**
     * The configuration for continuous tests.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EnvironmentTestCasesConfig {
        /**
         * Whether to run test cases in TestCasesConfig.test_cases periodically. Default false. If set to true, run once a day.
         */
        enableContinuousRun?: boolean | null;
        /**
         * Whether to run test cases in TestCasesConfig.test_cases before deploying a flow version to the environment. Default false.
         */
        enablePredeploymentRun?: boolean | null;
        /**
         * A list of test case names to run. They should be under the same agent. Format of each test case name: `projects//locations//agents//testCases/`
         */
        testCases?: string[] | null;
    }
    /**
     * Configuration for the version.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EnvironmentVersionConfig {
        /**
         * Required. Both flow and playbook versions are supported. Format for flow version: projects//locations//agents//flows//versions/. Format for playbook version: projects//locations//agents//playbooks//versions/.
         */
        version?: string | null;
    }
    /**
     * Configuration for webhooks.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EnvironmentWebhookConfig {
        /**
         * The list of webhooks to override for the agent environment. The webhook must exist in the agent. You can override fields in `generic_web_service` and `service_directory`.
         */
        webhookOverrides?: Schema$GoogleCloudDialogflowCxV3beta1Webhook[];
    }
    /**
     * Event represents the event sent by the customer.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Event {
        /**
         * Required. Name of the event.
         */
        event?: string | null;
        /**
         * Optional. Unstructured text payload of the event.
         */
        text?: string | null;
    }
    /**
     * An event handler specifies an event that can be handled during a session. When the specified event happens, the following actions are taken in order: * If there is a `trigger_fulfillment` associated with the event, it will be called. * If there is a `target_page` associated with the event, the session will transition into the specified page. * If there is a `target_flow` associated with the event, the session will transition into the specified flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EventHandler {
        /**
         * Required. The name of the event to handle.
         */
        event?: string | null;
        /**
         * Output only. The unique identifier of this event handler.
         */
        name?: string | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The target playbook to transition to. Format: `projects//locations//agents//playbooks/`.
         */
        targetPlaybook?: string | null;
        /**
         * The fulfillment to call when the event occurs. Handling webhook errors with a fulfillment enabled with webhook could cause infinite loop. It is invalid to specify such fulfillment for a handler handling webhooks.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
    }
    /**
     * Represents the event to trigger.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1EventInput {
        /**
         * Name of the event.
         */
        event?: string | null;
    }
    /**
     * Example represents a sample execution of the playbook in the conversation. An example consists of a list of ordered actions performed by end user or Dialogflow agent according the playbook instructions to fulfill the task.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Example {
        /**
         * Required. The ordered list of actions performed by the end user and the Dialogflow agent.
         */
        actions?: Schema$GoogleCloudDialogflowCxV3beta1Action[];
        /**
         * Required. Example's output state.
         */
        conversationState?: string | null;
        /**
         * Output only. The timestamp of initial example creation.
         */
        createTime?: string | null;
        /**
         * Optional. The high level concise description of the example. The max number of characters is 200.
         */
        description?: string | null;
        /**
         * Required. The display name of the example.
         */
        displayName?: string | null;
        /**
         * Optional. The language code of the example. If not specified, the agent's default language is used. Note: languages must be enabled in the agent before they can be used. Note: example's language code is not currently used in dialogflow agents.
         */
        languageCode?: string | null;
        /**
         * The unique identifier of the playbook example. Format: `projects//locations//agents//playbooks//examples/`.
         */
        name?: string | null;
        /**
         * Optional. The input to the playbook in the example.
         */
        playbookInput?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookInput;
        /**
         * Optional. The output of the playbook in the example.
         */
        playbookOutput?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookOutput;
        /**
         * Output only. Estimated number of tokes current example takes when sent to the LLM.
         */
        tokenCount?: string | null;
        /**
         * Output only. Last time the example was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Exception thrown during the execution of an action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExceptionDetail {
        /**
         * Optional. The error message.
         */
        errorMessage?: string | null;
    }
    /**
     * Represents an experiment in an environment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Experiment {
        /**
         * Creation time of this experiment.
         */
        createTime?: string | null;
        /**
         * The definition of the experiment.
         */
        definition?: Schema$GoogleCloudDialogflowCxV3beta1ExperimentDefinition;
        /**
         * The human-readable description of the experiment.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the experiment (unique in an environment). Limit of 64 characters.
         */
        displayName?: string | null;
        /**
         * End time of this experiment.
         */
        endTime?: string | null;
        /**
         * Maximum number of days to run the experiment. If auto-rollout is not enabled, default value and maximum will be 30 days. If auto-rollout is enabled, default value and maximum will be 6 days.
         */
        experimentLength?: string | null;
        /**
         * Last update time of this experiment.
         */
        lastUpdateTime?: string | null;
        /**
         * The name of the experiment. Format: projects//locations//agents//environments//experiments/.
         */
        name?: string | null;
        /**
         * Inference result of the experiment.
         */
        result?: Schema$GoogleCloudDialogflowCxV3beta1ExperimentResult;
        /**
         * The configuration for auto rollout. If set, there should be exactly two variants in the experiment (control variant being the default version of the flow), the traffic allocation for the non-control variant will gradually increase to 100% when conditions are met, and eventually replace the control variant to become the default version of the flow.
         */
        rolloutConfig?: Schema$GoogleCloudDialogflowCxV3beta1RolloutConfig;
        /**
         * The reason why rollout has failed. Should only be set when state is ROLLOUT_FAILED.
         */
        rolloutFailureReason?: string | null;
        /**
         * State of the auto rollout process.
         */
        rolloutState?: Schema$GoogleCloudDialogflowCxV3beta1RolloutState;
        /**
         * Start time of this experiment.
         */
        startTime?: string | null;
        /**
         * The current state of the experiment. Transition triggered by Experiments.StartExperiment: DRAFT-\>RUNNING. Transition triggered by Experiments.CancelExperiment: DRAFT-\>DONE or RUNNING-\>DONE.
         */
        state?: string | null;
        /**
         * The history of updates to the experiment variants.
         */
        variantsHistory?: Schema$GoogleCloudDialogflowCxV3beta1VariantsHistory[];
    }
    /**
     * Definition of the experiment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExperimentDefinition {
        /**
         * The condition defines which subset of sessions are selected for this experiment. If not specified, all sessions are eligible. E.g. "query_input.language_code=en" See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition).
         */
        condition?: string | null;
        /**
         * The flow versions as the variants of this experiment.
         */
        versionVariants?: Schema$GoogleCloudDialogflowCxV3beta1VersionVariants;
    }
    /**
     * The inference result which includes an objective metric to optimize and the confidence interval.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExperimentResult {
        /**
         * The last time the experiment's stats data was updated. Will have default value if stats have never been computed for this experiment.
         */
        lastUpdateTime?: string | null;
        /**
         * Version variants and metrics.
         */
        versionMetrics?: Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultVersionMetrics[];
    }
    /**
     * A confidence interval is a range of possible values for the experiment objective you are trying to measure.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultConfidenceInterval {
        /**
         * The confidence level used to construct the interval, i.e. there is X% chance that the true value is within this interval.
         */
        confidenceLevel?: number | null;
        /**
         * Lower bound of the interval.
         */
        lowerBound?: number | null;
        /**
         * The percent change between an experiment metric's value and the value for its control.
         */
        ratio?: number | null;
        /**
         * Upper bound of the interval.
         */
        upperBound?: number | null;
    }
    /**
     * Metric and corresponding confidence intervals.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultMetric {
        /**
         * The probability that the treatment is better than all other treatments in the experiment
         */
        confidenceInterval?: Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultConfidenceInterval;
        /**
         * Count value of a metric.
         */
        count?: number | null;
        /**
         * Count-based metric type. Only one of type or count_type is specified in each Metric.
         */
        countType?: string | null;
        /**
         * Ratio value of a metric.
         */
        ratio?: number | null;
        /**
         * Ratio-based metric type. Only one of type or count_type is specified in each Metric.
         */
        type?: string | null;
    }
    /**
     * Version variant and associated metrics.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultVersionMetrics {
        /**
         * The metrics and corresponding confidence intervals in the inference result.
         */
        metrics?: Schema$GoogleCloudDialogflowCxV3beta1ExperimentResultMetric[];
        /**
         * Number of sessions that were allocated to this version.
         */
        sessionCount?: number | null;
        /**
         * The name of the flow Version. Format: `projects//locations//agents//flows//versions/`.
         */
        version?: string | null;
    }
    /**
     * The request message for Agents.ExportAgent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportAgentRequest {
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the agent to. The format of this URI must be `gs:///`. If left unspecified, the serialized agent is returned inline. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        agentUri?: string | null;
        /**
         * Optional. The data format of the exported agent. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * Optional. Environment name. If not set, draft environment is assumed. Format: `projects//locations//agents//environments/`.
         */
        environment?: string | null;
        /**
         * Optional. The Git branch to export the agent to.
         */
        gitDestination?: Schema$GoogleCloudDialogflowCxV3beta1ExportAgentRequestGitDestination;
        /**
         * Optional. Whether to include BigQuery Export setting.
         */
        includeBigqueryExportSettings?: boolean | null;
    }
    /**
     * Settings for exporting to a git branch.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportAgentRequestGitDestination {
        /**
         * Commit message for the git push.
         */
        commitMessage?: string | null;
        /**
         * Tracking branch for the git push.
         */
        trackingBranch?: string | null;
    }
    /**
     * The response message for Agents.ExportAgent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportAgentResponse {
        /**
         * Uncompressed raw byte content for agent. This field is populated if none of `agent_uri` and `git_destination` are specified in ExportAgentRequest.
         */
        agentContent?: string | null;
        /**
         * The URI to a file containing the exported agent. This field is populated if `agent_uri` is specified in ExportAgentRequest.
         */
        agentUri?: string | null;
        /**
         * Commit SHA of the git push. This field is populated if `git_destination` is specified in ExportAgentRequest.
         */
        commitSha?: string | null;
    }
    /**
     * Metadata returned for the EntityTypes.ExportEntityTypes long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportEntityTypesMetadata {
    }
    /**
     * The request message for EntityTypes.ExportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportEntityTypesRequest {
        /**
         * Optional. The data format of the exported entity types. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * Required. The name of the entity types to export. Format: `projects//locations//agents//entityTypes/`.
         */
        entityTypes?: string[] | null;
        /**
         * Optional. The option to return the serialized entity types inline.
         */
        entityTypesContentInline?: boolean | null;
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the entity types to. The format of this URI must be `gs:///`. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        entityTypesUri?: string | null;
        /**
         * Optional. The language to retrieve the entity type for. The following fields are language dependent: * `EntityType.entities.value` * `EntityType.entities.synonyms` * `EntityType.excluded_phrases.value` If not specified, all language dependent fields will be retrieved. [Many languages](https://cloud.google.com/dialogflow/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string | null;
    }
    /**
     * The response message for EntityTypes.ExportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportEntityTypesResponse {
        /**
         * Uncompressed byte content for entity types. This field is populated only if `entity_types_content_inline` is set to true in ExportEntityTypesRequest.
         */
        entityTypesContent?: Schema$GoogleCloudDialogflowCxV3beta1InlineDestination;
        /**
         * The URI to a file containing the exported entity types. This field is populated only if `entity_types_uri` is specified in ExportEntityTypesRequest.
         */
        entityTypesUri?: string | null;
    }
    /**
     * The request message for Flows.ExportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportFlowRequest {
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the flow to. The format of this URI must be `gs:///`. If left unspecified, the serialized flow is returned inline. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        flowUri?: string | null;
        /**
         * Optional. Whether to export flows referenced by the specified flow.
         */
        includeReferencedFlows?: boolean | null;
    }
    /**
     * The response message for Flows.ExportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportFlowResponse {
        /**
         * Uncompressed raw byte content for flow.
         */
        flowContent?: string | null;
        /**
         * The URI to a file containing the exported flow. This field is populated only if `flow_uri` is specified in ExportFlowRequest.
         */
        flowUri?: string | null;
    }
    /**
     * Metadata returned for the Intents.ExportIntents long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportIntentsMetadata {
    }
    /**
     * The request message for Intents.ExportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportIntentsRequest {
        /**
         * Optional. The data format of the exported intents. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * Required. The name of the intents to export. Format: `projects//locations//agents//intents/`.
         */
        intents?: string[] | null;
        /**
         * Optional. The option to return the serialized intents inline.
         */
        intentsContentInline?: boolean | null;
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the intents to. The format of this URI must be `gs:///`. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        intentsUri?: string | null;
    }
    /**
     * The response message for Intents.ExportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportIntentsResponse {
        /**
         * Uncompressed byte content for intents. This field is populated only if `intents_content_inline` is set to true in ExportIntentsRequest.
         */
        intentsContent?: Schema$GoogleCloudDialogflowCxV3beta1InlineDestination;
        /**
         * The URI to a file containing the exported intents. This field is populated only if `intents_uri` is specified in ExportIntentsRequest.
         */
        intentsUri?: string | null;
    }
    /**
     * The request message for Playbooks.ExportPlaybook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportPlaybookRequest {
        /**
         * Optional. The data format of the exported agent. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the playbook to. The format of this URI must be `gs:///`. If left unspecified, the serialized playbook is returned inline. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        playbookUri?: string | null;
    }
    /**
     * Metadata returned for the TestCases.ExportTestCases long running operation. This message currently has no fields.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportTestCasesMetadata {
    }
    /**
     * The request message for TestCases.ExportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportTestCasesRequest {
        /**
         * The data format of the exported test cases. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * The filter expression used to filter exported test cases, see [API Filtering](https://aip.dev/160). The expression is case insensitive and supports the following syntax: name = [OR name = ] ... For example: * "name = t1 OR name = t2" matches the test case with the exact resource name "t1" or "t2".
         */
        filter?: string | null;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the test cases to. The format of this URI must be `gs:///`. If unspecified, the serialized test cases is returned inline. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        gcsUri?: string | null;
    }
    /**
     * The response message for TestCases.ExportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportTestCasesResponse {
        /**
         * Uncompressed raw byte content for test cases.
         */
        content?: string | null;
        /**
         * The URI to a file containing the exported test cases. This field is populated only if `gcs_uri` is specified in ExportTestCasesRequest.
         */
        gcsUri?: string | null;
    }
    /**
     * The request message for Tools.ExportTools.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ExportToolsRequest {
        /**
         * Optional. The data format of the exported tools. If not specified, `BLOB` is assumed.
         */
        dataFormat?: string | null;
        /**
         * Required. The name of the tools to export. Format: `projects//locations//agents//tools/`.
         */
        tools?: string[] | null;
        /**
         * Optional. The option to return the serialized tools inline.
         */
        toolsContentInline?: boolean | null;
        /**
         * Optional. The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to export the tools to. The format of this URI must be `gs:///`. Dialogflow performs a write operation for the Cloud Storage object on the caller's behalf, so your request authentication must have write permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        toolsUri?: string | null;
    }
    /**
     * Filter specifications for data stores.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FilterSpecs {
        /**
         * Optional. Data Stores where the boosting configuration is applied. The full names of the referenced data stores. Formats: `projects/{project\}/locations/{location\}/collections/{collection\}/dataStores/{data_store\}` `projects/{project\}/locations/{location\}/dataStores/{data_store\}
         */
        dataStores?: string[] | null;
        /**
         * Optional. The filter expression to be applied. Expression syntax is documented at https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata#filter-expression-syntax
         */
        filter?: string | null;
    }
    /**
     * Flows represents the conversation flows when you build your chatbot agent. A flow consists of many pages connected by the transition routes. Conversations always start with the built-in Start Flow (with an all-0 ID). Transition routes can direct the conversation session from the current flow (parent flow) to another flow (sub flow). When the sub flow is finished, Dialogflow will bring the session back to the parent flow, where the sub flow is started. Usually, when a transition route is followed by a matched intent, the intent will be "consumed". This means the intent won't activate more transition routes. However, when the followed transition route moves the conversation session into a different flow, the matched intent can be carried over and to be consumed in the target flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Flow {
        /**
         * Hierarchical advanced settings for this flow. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * The description of the flow. The maximum length is 500 characters. If exceeded, the request is rejected.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the flow.
         */
        displayName?: string | null;
        /**
         * A flow's event handlers serve two purposes: * They are responsible for handling events (e.g. no match, webhook errors) in the flow. * They are inherited by every page's event handlers, which can be used to handle common events regardless of the current page. Event handlers defined in the page have higher priority than those defined in the flow. Unlike transition_routes, these handlers are evaluated on a first-match basis. The first one that matches the event get executed, with the rest being ignored.
         */
        eventHandlers?: Schema$GoogleCloudDialogflowCxV3beta1EventHandler[];
        /**
         * Optional. Knowledge connector configuration.
         */
        knowledgeConnectorSettings?: Schema$GoogleCloudDialogflowCxV3beta1KnowledgeConnectorSettings;
        /**
         * Indicates whether the flow is locked for changes. If the flow is locked, modifications to the flow will be rejected.
         */
        locked?: boolean | null;
        /**
         * Optional. Multi-lingual agent settings for this flow.
         */
        multiLanguageSettings?: Schema$GoogleCloudDialogflowCxV3beta1FlowMultiLanguageSettings;
        /**
         * The unique identifier of the flow. Format: `projects//locations//agents//flows/`.
         */
        name?: string | null;
        /**
         * NLU related settings of the flow.
         */
        nluSettings?: Schema$GoogleCloudDialogflowCxV3beta1NluSettings;
        /**
         * A flow's transition route group serve two purposes: * They are responsible for matching the user's first utterances in the flow. * They are inherited by every page's transition route groups. Transition route groups defined in the page have higher priority than those defined in the flow. Format:`projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        transitionRouteGroups?: string[] | null;
        /**
         * A flow's transition routes serve two purposes: * They are responsible for matching the user's first utterances in the flow. * They are inherited by every page's transition routes and can support use cases such as the user saying "help" or "can I talk to a human?", which can be handled in a common way regardless of the current page. Transition routes defined in the page have higher priority than those defined in the flow. TransitionRoutes are evaluated in the following order: * TransitionRoutes with intent specified. * TransitionRoutes with only condition specified. TransitionRoutes with intent specified are inherited by pages in the flow.
         */
        transitionRoutes?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute[];
    }
    /**
     * The flow import strategy used for resource conflict resolution associated with an ImportFlowRequest.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FlowImportStrategy {
        /**
         * Optional. Global flow import strategy for resource conflict resolution. The import Import strategy for resource conflict resolution, applied globally throughout the flow. It will be applied for all display name conflicts in the imported content. If not specified, 'CREATE_NEW' is assumed.
         */
        globalImportStrategy?: string | null;
    }
    /**
     * Stores metadata of the invocation of a child CX flow. Flow invocation actions enter the child flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FlowInvocation {
        /**
         * Output only. The display name of the flow.
         */
        displayName?: string | null;
        /**
         * Required. The unique identifier of the flow. Format: `projects//locations//agents/`.
         */
        flow?: string | null;
        /**
         * Required. Flow invocation's output state.
         */
        flowState?: string | null;
        /**
         * Optional. A list of input parameters for the flow.
         */
        inputActionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. A list of output parameters generated by the flow invocation.
         */
        outputActionParameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Settings for multi-lingual agents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FlowMultiLanguageSettings {
        /**
         * Optional. Enable multi-language detection for this flow. This can be set only if agent level multi language setting is enabled.
         */
        enableMultiLanguageDetection?: boolean | null;
        /**
         * Optional. Agent will respond in the detected language if the detected language code is in the supported resolved languages for this flow. This will be used only if multi-language training is enabled in the agent and multi-language detection is enabled in the flow. The supported languages must be a subset of the languages supported by the agent.
         */
        supportedResponseLanguageCodes?: string[] | null;
    }
    /**
     * Stores metadata of the transition to a target CX flow. Flow transition actions exit the caller playbook and enter the child flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FlowTransition {
        /**
         * Output only. The display name of the flow.
         */
        displayName?: string | null;
        /**
         * Required. The unique identifier of the flow. Format: `projects//locations//agents/`.
         */
        flow?: string | null;
        /**
         * A list of input parameters for the action.
         */
        inputActionParameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * The response message for Flows.GetFlowValidationResult.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult {
        /**
         * The unique identifier of the flow validation result. Format: `projects//locations//agents//flows//validationResult`.
         */
        name?: string | null;
        /**
         * Last time the flow was validated.
         */
        updateTime?: string | null;
        /**
         * Contains all validation messages.
         */
        validationMessages?: Schema$GoogleCloudDialogflowCxV3beta1ValidationMessage[];
    }
    /**
     * A form is a data model that groups related parameters that can be collected from the user. The process in which the agent prompts the user and collects parameter values from the user is called form filling. A form can be added to a page. When form filling is done, the filled parameters will be written to the session.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Form {
        /**
         * Parameters to collect from the user.
         */
        parameters?: Schema$GoogleCloudDialogflowCxV3beta1FormParameter[];
    }
    /**
     * Represents a form parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FormParameter {
        /**
         * Hierarchical advanced settings for this parameter. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * The default value of an optional parameter. If the parameter is required, the default value will be ignored.
         */
        defaultValue?: any | null;
        /**
         * Required. The human-readable name of the parameter, unique within the form.
         */
        displayName?: string | null;
        /**
         * Required. The entity type of the parameter. Format: `projects/-/locations/-/agents/-/entityTypes/` for system entity types (for example, `projects/-/locations/-/agents/-/entityTypes/sys.date`), or `projects//locations//agents//entityTypes/` for developer entity types.
         */
        entityType?: string | null;
        /**
         * Required. Defines fill behavior for the parameter.
         */
        fillBehavior?: Schema$GoogleCloudDialogflowCxV3beta1FormParameterFillBehavior;
        /**
         * Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Indicates whether the parameter content should be redacted in log. If redaction is enabled, the parameter content will be replaced by parameter name during logging. Note: the parameter content is subject to redaction if either parameter level redaction or entity type level redaction is enabled.
         */
        redact?: boolean | null;
        /**
         * Indicates whether the parameter is required. Optional parameters will not trigger prompts; however, they are filled if the user specifies them. Required parameters must be filled before form filling concludes.
         */
        required?: boolean | null;
    }
    /**
     * Configuration for how the filling of a parameter should be handled.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FormParameterFillBehavior {
        /**
         * Required. The fulfillment to provide the initial prompt that the agent can present to the user in order to fill the parameter.
         */
        initialPromptFulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
        /**
         * The handlers for parameter-level events, used to provide reprompt for the parameter or transition to a different page/flow. The supported events are: * `sys.no-match-`, where N can be from 1 to 6 * `sys.no-match-default` * `sys.no-input-`, where N can be from 1 to 6 * `sys.no-input-default` * `sys.invalid-parameter` `initial_prompt_fulfillment` provides the first prompt for the parameter. If the user's response does not fill the parameter, a no-match/no-input event will be triggered, and the fulfillment associated with the `sys.no-match-1`/`sys.no-input-1` handler (if defined) will be called to provide a prompt. The `sys.no-match-2`/`sys.no-input-2` handler (if defined) will respond to the next no-match/no-input event, and so on. A `sys.no-match-default` or `sys.no-input-default` handler will be used to handle all following no-match/no-input events after all numbered no-match/no-input handlers for the parameter are consumed. A `sys.invalid-parameter` handler can be defined to handle the case where the parameter values have been `invalidated` by webhook. For example, if the user's response fill the parameter, however the parameter was invalidated by webhook, the fulfillment associated with the `sys.invalid-parameter` handler (if defined) will be called to provide a prompt. If the event handler for the corresponding event can't be found on the parameter, `initial_prompt_fulfillment` will be re-prompted.
         */
        repromptEventHandlers?: Schema$GoogleCloudDialogflowCxV3beta1EventHandler[];
    }
    /**
     * Request of FulfillIntent
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentRequest {
        /**
         * The matched intent/event to fulfill.
         */
        match?: Schema$GoogleCloudDialogflowCxV3beta1Match;
        /**
         * Must be same as the corresponding MatchIntent request, otherwise the behavior is undefined.
         */
        matchIntentRequest?: Schema$GoogleCloudDialogflowCxV3beta1MatchIntentRequest;
        /**
         * Instructs the speech synthesizer how to generate output audio.
         */
        outputAudioConfig?: Schema$GoogleCloudDialogflowCxV3beta1OutputAudioConfig;
    }
    /**
     * Response of FulfillIntent
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse {
        /**
         * The audio data bytes encoded as specified in the request. Note: The output audio is generated based on the values of default platform text responses found in the `query_result.response_messages` field. If multiple default text responses exist, they will be concatenated when generating audio. If no default platform text responses exist, the generated audio content will be empty. In some scenarios, multiple output audio fields may be present in the response structure. In these cases, only the top-most-level audio output has content.
         */
        outputAudio?: string | null;
        /**
         * The config used by the speech synthesizer to generate the output audio.
         */
        outputAudioConfig?: Schema$GoogleCloudDialogflowCxV3beta1OutputAudioConfig;
        /**
         * The result of the conversational query.
         */
        queryResult?: Schema$GoogleCloudDialogflowCxV3beta1QueryResult;
        /**
         * Output only. The unique identifier of the response. It can be used to locate a response in the training example set or for reporting issues.
         */
        responseId?: string | null;
    }
    /**
     * A fulfillment can do one or more of the following actions at the same time: * Generate rich message responses. * Set parameter values. * Call the webhook. Fulfillments can be called at various stages in the Page or Form lifecycle. For example, when a DetectIntentRequest drives a session to enter a new page, the page's entry fulfillment can add a static response to the QueryResult in the returning DetectIntentResponse, call the webhook (for example, to load user data from a database), or both.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Fulfillment {
        /**
         * Hierarchical advanced settings for this fulfillment. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * Conditional cases for this fulfillment.
         */
        conditionalCases?: Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCases[];
        /**
         * If the flag is true, the agent will utilize LLM to generate a text response. If LLM generation fails, the defined responses in the fulfillment will be respected. This flag is only useful for fulfillments associated with no-match event handlers.
         */
        enableGenerativeFallback?: boolean | null;
        /**
         * The list of rich message responses to present to the user.
         */
        messages?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage[];
        /**
         * Whether Dialogflow should return currently queued fulfillment response messages in streaming APIs. If a webhook is specified, it happens before Dialogflow invokes webhook. Warning: 1) This flag only affects streaming API. Responses are still queued and returned once in non-streaming API. 2) The flag can be enabled in any fulfillment but only the first 3 partial responses will be returned. You may only want to apply it to fulfillments that have slow webhooks.
         */
        returnPartialResponses?: boolean | null;
        /**
         * Set parameter values before executing the webhook.
         */
        setParameterActions?: Schema$GoogleCloudDialogflowCxV3beta1FulfillmentSetParameterAction[];
        /**
         * The value of this field will be populated in the WebhookRequest `fulfillmentInfo.tag` field by Dialogflow when the associated webhook is called. The tag is typically used by the webhook service to identify which fulfillment is being called, but it could be used for other purposes. This field is required if `webhook` is specified.
         */
        tag?: string | null;
        /**
         * The webhook to call. Format: `projects//locations//agents//webhooks/`.
         */
        webhook?: string | null;
    }
    /**
     * A list of cascading if-else conditions. Cases are mutually exclusive. The first one with a matching condition is selected, all the rest ignored.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCases {
        /**
         * A list of cascading if-else conditions.
         */
        cases?: Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCasesCase[];
    }
    /**
     * Each case has a Boolean condition. When it is evaluated to be True, the corresponding messages will be selected and evaluated recursively.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCasesCase {
        /**
         * A list of case content.
         */
        caseContent?: Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCasesCaseCaseContent[];
        /**
         * The condition to activate and select this case. Empty means the condition is always true. The condition is evaluated against form parameters or session parameters. See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition).
         */
        condition?: string | null;
    }
    /**
     * The list of messages or conditional cases to activate for this case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCasesCaseCaseContent {
        /**
         * Additional cases to be evaluated.
         */
        additionalCases?: Schema$GoogleCloudDialogflowCxV3beta1FulfillmentConditionalCases;
        /**
         * Returned message.
         */
        message?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage;
    }
    /**
     * Setting a parameter value.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1FulfillmentSetParameterAction {
        /**
         * Display name of the parameter.
         */
        parameter?: string | null;
        /**
         * The new value of the parameter. A null value clears the parameter.
         */
        value?: any | null;
    }
    /**
     * Google Cloud Storage location for a Dialogflow operation that writes or exports objects (e.g. exported agent or transcripts) outside of Dialogflow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GcsDestination {
        /**
         * Required. The Google Cloud Storage URI for the exported objects. A URI is of the form: `gs://bucket/object-name-or-prefix` Whether a full object name, or just a prefix, its usage depends on the Dialogflow operation.
         */
        uri?: string | null;
    }
    /**
     * Represents the information of a query if handled by generative agent resources.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GenerativeInfo {
        /**
         * The actions performed by the generative playbook for the current agent response.
         */
        actionTracingInfo?: Schema$GoogleCloudDialogflowCxV3beta1Example;
        /**
         * The stack of playbooks that the conversation has currently entered, with the most recent one on the top.
         */
        currentPlaybooks?: string[] | null;
    }
    /**
     * Settings for Generative AI.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings {
        /**
         * Settings for Generative Fallback.
         */
        fallbackSettings?: Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsFallbackSettings;
        /**
         * Settings for Generative Safety.
         */
        generativeSafetySettings?: Schema$GoogleCloudDialogflowCxV3beta1SafetySettings;
        /**
         * Settings for knowledge connector.
         */
        knowledgeConnectorSettings?: Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsKnowledgeConnectorSettings;
        /**
         * Language for this settings.
         */
        languageCode?: string | null;
        /**
         * LLM model settings.
         */
        llmModelSettings?: Schema$GoogleCloudDialogflowCxV3beta1LlmModelSettings;
        /**
         * Format: `projects//locations//agents//generativeSettings`.
         */
        name?: string | null;
    }
    /**
     * Settings for Generative Fallback.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsFallbackSettings {
        /**
         * Stored prompts that can be selected, for example default templates like "conservative" or "chatty", or user defined ones.
         */
        promptTemplates?: Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsFallbackSettingsPromptTemplate[];
        /**
         * Display name of the selected prompt.
         */
        selectedPrompt?: string | null;
    }
    /**
     * Prompt template.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsFallbackSettingsPromptTemplate {
        /**
         * Prompt name.
         */
        displayName?: string | null;
        /**
         * If the flag is true, the prompt is frozen and cannot be modified by users.
         */
        frozen?: boolean | null;
        /**
         * Prompt text that is sent to a LLM on no-match default, placeholders are filled downstream. For example: "Here is a conversation $conversation, a response is: "
         */
        promptText?: string | null;
    }
    /**
     * Settings for knowledge connector. These parameters are used for LLM prompt like "You are . You are a helpful and verbose at , . Your task is to help humans on ".
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettingsKnowledgeConnectorSettings {
        /**
         * Name of the virtual agent. Used for LLM prompt. Can be left empty.
         */
        agent?: string | null;
        /**
         * Identity of the agent, e.g. "virtual agent", "AI assistant".
         */
        agentIdentity?: string | null;
        /**
         * Agent scope, e.g. "Example company website", "internal Example company website for employees", "manual of car owner".
         */
        agentScope?: string | null;
        /**
         * Name of the company, organization or other entity that the agent represents. Used for knowledge connector LLM prompt and for knowledge search.
         */
        business?: string | null;
        /**
         * Company description, used for LLM prompt, e.g. "a family company selling freshly roasted coffee beans".
         */
        businessDescription?: string | null;
        /**
         * Whether to disable fallback to Data Store search results (in case the LLM couldn't pick a proper answer). Per default the feature is enabled.
         */
        disableDataStoreFallback?: boolean | null;
    }
    /**
     * Generators contain prompt to be sent to the LLM model to generate text. The prompt can contain parameters which will be resolved before calling the model. It can optionally contain banned phrases to ensure the model responses are safe.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Generator {
        /**
         * Required. The human-readable name of the generator, unique within the agent. The prompt contains pre-defined parameters such as $conversation, $last-user-utterance, etc. populated by Dialogflow. It can also contain custom placeholders which will be resolved during fulfillment.
         */
        displayName?: string | null;
        /**
         * The LLM model settings.
         */
        llmModelSettings?: Schema$GoogleCloudDialogflowCxV3beta1LlmModelSettings;
        /**
         * Parameters passed to the LLM to configure its behavior.
         */
        modelParameter?: Schema$GoogleCloudDialogflowCxV3beta1GeneratorModelParameter;
        /**
         * The unique identifier of the generator. Must be set for the Generators.UpdateGenerator method. Generators.CreateGenerate populates the name automatically. Format: `projects//locations//agents//generators/`.
         */
        name?: string | null;
        /**
         * Optional. List of custom placeholders in the prompt text.
         */
        placeholders?: Schema$GoogleCloudDialogflowCxV3beta1GeneratorPlaceholder[];
        /**
         * Required. Prompt for the LLM model.
         */
        promptText?: Schema$GoogleCloudDialogflowCxV3beta1Phrase;
    }
    /**
     * Parameters to be passed to the LLM. If not set, default values will be used.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GeneratorModelParameter {
        /**
         * The maximum number of tokens to generate.
         */
        maxDecodeSteps?: number | null;
        /**
         * The temperature used for sampling. Temperature sampling occurs after both topP and topK have been applied. Valid range: [0.0, 1.0] Low temperature = less random. High temperature = more random.
         */
        temperature?: number | null;
        /**
         * If set, the sampling process in each step is limited to the top_k tokens with highest probabilities. Valid range: [1, 40] or 1000+. Small topK = less random. Large topK = more random.
         */
        topK?: number | null;
        /**
         * If set, only the tokens comprising the top top_p probability mass are considered. If both top_p and top_k are set, top_p will be used for further refining candidates selected with top_k. Valid range: (0.0, 1.0]. Small topP = less random. Large topP = more random.
         */
        topP?: number | null;
    }
    /**
     * Represents a custom placeholder in the prompt text.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1GeneratorPlaceholder {
        /**
         * Unique ID used to map custom placeholder to parameters in fulfillment.
         */
        id?: string | null;
        /**
         * Custom placeholder value in the prompt text.
         */
        name?: string | null;
    }
    /**
     * Handler can be used to define custom logic to be executed based on the user-specified triggers.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Handler {
        /**
         * A handler triggered by event.
         */
        eventHandler?: Schema$GoogleCloudDialogflowCxV3beta1HandlerEventHandler;
        /**
         * A handler triggered during specific lifecycle of the playbook execution.
         */
        lifecycleHandler?: Schema$GoogleCloudDialogflowCxV3beta1HandlerLifecycleHandler;
    }
    /**
     * A handler that is triggered by the specified event.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1HandlerEventHandler {
        /**
         * Optional. The condition that must be satisfied to trigger this handler.
         */
        condition?: string | null;
        /**
         * Required. The name of the event that triggers this handler.
         */
        event?: string | null;
        /**
         * Required. The fulfillment to call when the event occurs.
         */
        fulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
    }
    /**
     * A handler that is triggered on the specific lifecycle_stage of the playbook execution.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1HandlerLifecycleHandler {
        /**
         * Optional. The condition that must be satisfied to trigger this handler.
         */
        condition?: string | null;
        /**
         * Required. The fulfillment to call when this handler is triggered.
         */
        fulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
        /**
         * Required. The name of the lifecycle stage that triggers this handler. Supported values: * `playbook-start` * `pre-action-selection` * `pre-action-execution`
         */
        lifecycleStage?: string | null;
    }
    /**
     * Metadata returned for the EntityTypes.ImportEntityTypes long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesMetadata {
    }
    /**
     * The request message for EntityTypes.ImportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesRequest {
        /**
         * Uncompressed byte content of entity types.
         */
        entityTypesContent?: Schema$GoogleCloudDialogflowCxV3beta1InlineSource;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to import entity types from. The format of this URI must be `gs:///`. Dialogflow performs a read operation for the Cloud Storage object on the caller's behalf, so your request authentication must have read permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        entityTypesUri?: string | null;
        /**
         * Required. Merge option for importing entity types.
         */
        mergeOption?: string | null;
        /**
         * Optional. The target entity type to import into. Format: `projects//locations//agents//entity_types/`. If set, there should be only one entity type included in entity_types, of which the type should match the type of the target entity type. All entities in the imported entity type will be added to the target entity type.
         */
        targetEntityType?: string | null;
    }
    /**
     * The response message for EntityTypes.ImportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesResponse {
        /**
         * Info which resources have conflicts when REPORT_CONFLICT merge_option is set in ImportEntityTypesRequest.
         */
        conflictingResources?: Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesResponseConflictingResources;
        /**
         * The unique identifier of the imported entity types. Format: `projects//locations//agents//entity_types/`.
         */
        entityTypes?: string[] | null;
    }
    /**
     * Conflicting resources detected during the import process. Only filled when REPORT_CONFLICT is set in the request and there are conflicts in the display names.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesResponseConflictingResources {
        /**
         * Display names of conflicting entities.
         */
        entityDisplayNames?: string[] | null;
        /**
         * Display names of conflicting entity types.
         */
        entityTypeDisplayNames?: string[] | null;
    }
    /**
     * The request message for Flows.ImportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportFlowRequest {
        /**
         * Uncompressed raw byte content for flow.
         */
        flowContent?: string | null;
        /**
         * Optional. Specifies the import strategy used when resolving resource conflicts.
         */
        flowImportStrategy?: Schema$GoogleCloudDialogflowCxV3beta1FlowImportStrategy;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to import flow from. The format of this URI must be `gs:///`. Dialogflow performs a read operation for the Cloud Storage object on the caller's behalf, so your request authentication must have read permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        flowUri?: string | null;
        /**
         * Flow import mode. If not specified, `KEEP` is assumed.
         */
        importOption?: string | null;
    }
    /**
     * The response message for Flows.ImportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportFlowResponse {
        /**
         * The unique identifier of the new flow. Format: `projects//locations//agents//flows/`.
         */
        flow?: string | null;
    }
    /**
     * Metadata returned for the Intents.ImportIntents long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsMetadata {
    }
    /**
     * The request message for Intents.ImportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsRequest {
        /**
         * Uncompressed byte content of intents.
         */
        intentsContent?: Schema$GoogleCloudDialogflowCxV3beta1InlineSource;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to import intents from. The format of this URI must be `gs:///`. Dialogflow performs a read operation for the Cloud Storage object on the caller's behalf, so your request authentication must have read permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        intentsUri?: string | null;
        /**
         * Merge option for importing intents. If not specified, `REJECT` is assumed.
         */
        mergeOption?: string | null;
    }
    /**
     * The response message for Intents.ImportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsResponse {
        /**
         * Info which resources have conflicts when REPORT_CONFLICT merge_option is set in ImportIntentsRequest.
         */
        conflictingResources?: Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsResponseConflictingResources;
        /**
         * The unique identifier of the imported intents. Format: `projects//locations//agents//intents/`.
         */
        intents?: string[] | null;
    }
    /**
     * Conflicting resources detected during the import process. Only filled when REPORT_CONFLICT is set in the request and there are conflicts in the display names.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsResponseConflictingResources {
        /**
         * Display names of conflicting entities.
         */
        entityDisplayNames?: string[] | null;
        /**
         * Display names of conflicting intents.
         */
        intentDisplayNames?: string[] | null;
    }
    /**
     * The request message for Playbooks.ImportPlaybook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportPlaybookRequest {
        /**
         * Optional. Specifies the import strategy used when resolving resource conflicts.
         */
        importStrategy?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookImportStrategy;
        /**
         * Uncompressed raw byte content for playbook.
         */
        playbookContent?: string | null;
        /**
         * [Dialogflow access control] (https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        playbookUri?: string | null;
    }
    /**
     * Metadata returned for the TestCases.ImportTestCases long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportTestCasesMetadata {
        /**
         * Errors for failed test cases.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3beta1TestCaseError[];
    }
    /**
     * The request message for TestCases.ImportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportTestCasesRequest {
        /**
         * Uncompressed raw byte content for test cases.
         */
        content?: string | null;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to import test cases from. The format of this URI must be `gs:///`. Dialogflow performs a read operation for the Cloud Storage object on the caller's behalf, so your request authentication must have read permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        gcsUri?: string | null;
    }
    /**
     * The response message for TestCases.ImportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ImportTestCasesResponse {
        /**
         * The unique identifiers of the new test cases. Format: `projects//locations//agents//testCases/`.
         */
        names?: string[] | null;
    }
    /**
     * Inline destination for a Dialogflow operation that writes or exports objects (e.g. intents) outside of Dialogflow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1InlineDestination {
        /**
         * Output only. The uncompressed byte content for the objects. Only populated in responses.
         */
        content?: string | null;
    }
    /**
     * A type schema object that's specified inline.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1InlineSchema {
        /**
         * Schema of the elements if this is an ARRAY type.
         */
        items?: Schema$GoogleCloudDialogflowCxV3beta1TypeSchema;
        /**
         * Data type of the schema.
         */
        type?: string | null;
    }
    /**
     * Inline source for a Dialogflow operation that reads or imports objects (e.g. intents) into Dialogflow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1InlineSource {
        /**
         * The uncompressed byte content for the objects.
         */
        content?: string | null;
    }
    /**
     * Instructs the speech recognizer on how to process the audio content.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1InputAudioConfig {
        /**
         * Required. Audio encoding of the audio content to process.
         */
        audioEncoding?: string | null;
        /**
         * Configuration of barge-in behavior during the streaming of input audio.
         */
        bargeInConfig?: Schema$GoogleCloudDialogflowCxV3beta1BargeInConfig;
        /**
         * Optional. If `true`, Dialogflow returns SpeechWordInfo in StreamingRecognitionResult with information about the recognized speech words, e.g. start and end time offsets. If false or unspecified, Speech doesn't return any word-level information.
         */
        enableWordInfo?: boolean | null;
        /**
         * Optional. Which Speech model to select for the given request. For more information, see [Speech models](https://cloud.google.com/dialogflow/cx/docs/concept/speech-models).
         */
        model?: string | null;
        /**
         * Optional. Which variant of the Speech model to use.
         */
        modelVariant?: string | null;
        /**
         * If `true`, the request will opt out for STT conformer model migration. This field will be deprecated once force migration takes place in June 2024. Please refer to [Dialogflow CX Speech model migration](https://cloud.google.com/dialogflow/cx/docs/concept/speech-model-migration).
         */
        optOutConformerModelMigration?: boolean | null;
        /**
         * Optional. A list of strings containing words and phrases that the speech recognizer should recognize with higher likelihood. See [the Cloud Speech documentation](https://cloud.google.com/speech-to-text/docs/basics#phrase-hints) for more details.
         */
        phraseHints?: string[] | null;
        /**
         * Sample rate (in Hertz) of the audio content sent in the query. Refer to [Cloud Speech API documentation](https://cloud.google.com/speech-to-text/docs/basics) for more details.
         */
        sampleRateHertz?: number | null;
        /**
         * Optional. If `false` (default), recognition does not cease until the client closes the stream. If `true`, the recognizer will detect a single spoken utterance in input audio. Recognition ceases when it detects the audio's voice has stopped or paused. In this case, once a detected intent is received, the client should close the stream and start a new request with a new stream as needed. Note: This setting is relevant only for streaming methods.
         */
        singleUtterance?: boolean | null;
    }
    /**
     * An intent represents a user's intent to interact with a conversational agent. You can provide information for the Dialogflow API to use to match user input to an intent by adding training phrases (i.e., examples of user input) to your intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Intent {
        /**
         * Human readable description for better understanding an intent like its scope, content, result etc. Maximum character limit: 140 characters.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the intent, unique within the agent.
         */
        displayName?: string | null;
        /**
         * Indicates whether this is a fallback intent. Currently only default fallback intent is allowed in the agent, which is added upon agent creation. Adding training phrases to fallback intent is useful in the case of requests that are mistakenly matched, since training phrases assigned to fallback intents act as negative examples that triggers no-match event.
         */
        isFallback?: boolean | null;
        /**
         * The key/value metadata to label an intent. Labels can contain lowercase letters, digits and the symbols '-' and '_'. International characters are allowed, including letters from unicase alphabets. Keys must start with a letter. Keys and values can be no longer than 63 characters and no more than 128 bytes. Prefix "sys-" is reserved for Dialogflow defined labels. Currently allowed Dialogflow defined labels include: * sys-head * sys-contextual The above labels do not require value. "sys-head" means the intent is a head intent. "sys-contextual" means the intent is a contextual intent.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The unique identifier of the intent. Required for the Intents.UpdateIntent method. Intents.CreateIntent populates the name automatically. Format: `projects//locations//agents//intents/`.
         */
        name?: string | null;
        /**
         * The collection of parameters associated with the intent.
         */
        parameters?: Schema$GoogleCloudDialogflowCxV3beta1IntentParameter[];
        /**
         * The priority of this intent. Higher numbers represent higher priorities. - If the supplied value is unspecified or 0, the service translates the value to 500,000, which corresponds to the `Normal` priority in the console. - If the supplied value is negative, the intent is ignored in runtime detect intent requests.
         */
        priority?: number | null;
        /**
         * The collection of training phrases the agent is trained on to identify the intent.
         */
        trainingPhrases?: Schema$GoogleCloudDialogflowCxV3beta1IntentTrainingPhrase[];
    }
    /**
     * Intent coverage represents the percentage of all possible intents in the agent that are triggered in any of a parent's test cases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentCoverage {
        /**
         * The percent of intents in the agent that are covered.
         */
        coverageScore?: number | null;
        /**
         * The list of Intents present in the agent
         */
        intents?: Schema$GoogleCloudDialogflowCxV3beta1IntentCoverageIntent[];
    }
    /**
     * The agent's intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentCoverageIntent {
        /**
         * Whether the intent is covered by at least one of the agent's test cases.
         */
        covered?: boolean | null;
        /**
         * The intent full resource name
         */
        intent?: string | null;
    }
    /**
     * Represents the intent to trigger programmatically rather than as a result of natural language processing.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentInput {
        /**
         * Required. The unique identifier of the intent. Format: `projects//locations//agents//intents/`.
         */
        intent?: string | null;
    }
    /**
     * Represents an intent parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentParameter {
        /**
         * Required. The entity type of the parameter. Format: `projects/-/locations/-/agents/-/entityTypes/` for system entity types (for example, `projects/-/locations/-/agents/-/entityTypes/sys.date`), or `projects//locations//agents//entityTypes/` for developer entity types.
         */
        entityType?: string | null;
        /**
         * Required. The unique identifier of the parameter. This field is used by training phrases to annotate their parts.
         */
        id?: string | null;
        /**
         * Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Indicates whether the parameter content should be redacted in log. If redaction is enabled, the parameter content will be replaced by parameter name during logging. Note: the parameter content is subject to redaction if either parameter level redaction or entity type level redaction is enabled.
         */
        redact?: boolean | null;
    }
    /**
     * Represents an example that the agent is trained on to identify the intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentTrainingPhrase {
        /**
         * Output only. The unique identifier of the training phrase.
         */
        id?: string | null;
        /**
         * Required. The ordered list of training phrase parts. The parts are concatenated in order to form the training phrase. Note: The API does not automatically annotate training phrases like the Dialogflow Console does. Note: Do not forget to include whitespace at part boundaries, so the training phrase is well formatted when the parts are concatenated. If the training phrase does not need to be annotated with parameters, you just need a single part with only the Part.text field set. If you want to annotate the training phrase, you must create multiple parts, where the fields of each part are populated in one of two ways: - `Part.text` is set to a part of the phrase that has no parameters. - `Part.text` is set to a part of the phrase that you want to annotate, and the `parameter_id` field is set.
         */
        parts?: Schema$GoogleCloudDialogflowCxV3beta1IntentTrainingPhrasePart[];
        /**
         * Indicates how many times this example was added to the intent.
         */
        repeatCount?: number | null;
    }
    /**
     * Represents a part of a training phrase.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1IntentTrainingPhrasePart {
        /**
         * The parameter used to annotate this part of the training phrase. This field is required for annotated parts of the training phrase.
         */
        parameterId?: string | null;
        /**
         * Required. The text for this part.
         */
        text?: string | null;
    }
    /**
     * The Knowledge Connector settings for this page or flow. This includes information such as the attached Knowledge Bases, and the way to execute fulfillment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1KnowledgeConnectorSettings {
        /**
         * Optional. List of related data store connections.
         */
        dataStoreConnections?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnection[];
        /**
         * Whether Knowledge Connector is enabled or not.
         */
        enabled?: boolean | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The fulfillment to be triggered. When the answers from the Knowledge Connector are selected by Dialogflow, you can utitlize the request scoped parameter `$request.knowledge.answers` (contains up to the 5 highest confidence answers) and `$request.knowledge.questions` (contains the corresponding questions) to construct the fulfillment.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
    }
    /**
     * Represents the language information of the request.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LanguageInfo {
        /**
         * The confidence score of the detected language between 0 and 1.
         */
        confidenceScore?: number | null;
        /**
         * The language code specified in the original request.
         */
        inputLanguageCode?: string | null;
        /**
         * The language code detected for this request based on the user conversation.
         */
        resolvedLanguageCode?: string | null;
    }
    /**
     * The response message for Agents.ListAgents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse {
        /**
         * The list of agents. There will be a maximum number of items returned based on the page_size field in the request.
         */
        agents?: Schema$GoogleCloudDialogflowCxV3beta1Agent[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Changelogs.ListChangelogs.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse {
        /**
         * The list of changelogs. There will be a maximum number of items returned based on the page_size field in the request. The changelogs will be ordered by timestamp.
         */
        changelogs?: Schema$GoogleCloudDialogflowCxV3beta1Changelog[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Environments.ListTestCaseResults.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse {
        /**
         * The list of continuous test results.
         */
        continuousTestResults?: Schema$GoogleCloudDialogflowCxV3beta1ContinuousTestResult[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Conversations.ListConversations.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse {
        /**
         * The list of conversations. There will be a maximum number of items returned based on the page_size field. The returned conversations will be sorted by start_time in descending order (newest conversation first).
         */
        conversations?: Schema$GoogleCloudDialogflowCxV3beta1Conversation[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Deployments.ListDeployments.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse {
        /**
         * The list of deployments. There will be a maximum number of items returned based on the page_size field in the request. The list may in some cases be empty or contain fewer entries than page_size even if this isn't the last page.
         */
        deployments?: Schema$GoogleCloudDialogflowCxV3beta1Deployment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for EntityTypes.ListEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse {
        /**
         * The list of entity types. There will be a maximum number of items returned based on the page_size field in the request.
         */
        entityTypes?: Schema$GoogleCloudDialogflowCxV3beta1EntityType[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Environments.ListEnvironments.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse {
        /**
         * The list of environments. There will be a maximum number of items returned based on the page_size field in the request. The list may in some cases be empty or contain fewer entries than page_size even if this isn't the last page.
         */
        environments?: Schema$GoogleCloudDialogflowCxV3beta1Environment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Examples.ListExamples.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse {
        /**
         * The list of examples. There will be a maximum number of items returned based on the page_size field in the request.
         */
        examples?: Schema$GoogleCloudDialogflowCxV3beta1Example[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Experiments.ListExperiments.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse {
        /**
         * The list of experiments. There will be a maximum number of items returned based on the page_size field in the request. The list may in some cases be empty or contain fewer entries than page_size even if this isn't the last page.
         */
        experiments?: Schema$GoogleCloudDialogflowCxV3beta1Experiment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Flows.ListFlows.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse {
        /**
         * The list of flows. There will be a maximum number of items returned based on the page_size field in the request.
         */
        flows?: Schema$GoogleCloudDialogflowCxV3beta1Flow[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Generators.ListGenerators.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse {
        /**
         * The list of generators. There will be a maximum number of items returned based on the page_size field in the request.
         */
        generators?: Schema$GoogleCloudDialogflowCxV3beta1Generator[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Intents.ListIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse {
        /**
         * The list of intents. There will be a maximum number of items returned based on the page_size field in the request.
         */
        intents?: Schema$GoogleCloudDialogflowCxV3beta1Intent[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for Pages.ListPages.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of pages. There will be a maximum number of items returned based on the page_size field in the request.
         */
        pages?: Schema$GoogleCloudDialogflowCxV3beta1Page[];
    }
    /**
     * The response message for Playbooks.ListPlaybooks.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of playbooks. There will be a maximum number of items returned based on the page_size field in the request.
         */
        playbooks?: Schema$GoogleCloudDialogflowCxV3beta1Playbook[];
    }
    /**
     * The response message for Playbooks.ListPlaybookVersions.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of playbook version. There will be a maximum number of items returned based on the page_size field in the request.
         */
        playbookVersions?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion[];
    }
    /**
     * The response message for SecuritySettings.ListSecuritySettings.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of security settings.
         */
        securitySettings?: Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings[];
    }
    /**
     * The response message for SessionEntityTypes.ListSessionEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of session entity types. There will be a maximum number of items returned based on the page_size field in the request.
         */
        sessionEntityTypes?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType[];
    }
    /**
     * The response message for TestCases.ListTestCaseResults.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of test case results.
         */
        testCaseResults?: Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult[];
    }
    /**
     * The response message for TestCases.ListTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of test cases. There will be a maximum number of items returned based on the page_size field in the request.
         */
        testCases?: Schema$GoogleCloudDialogflowCxV3beta1TestCase[];
    }
    /**
     * The response message for Tools.ListTools.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of Tools. There will be a maximum number of items returned based on the page_size field in the request.
         */
        tools?: Schema$GoogleCloudDialogflowCxV3beta1Tool[];
    }
    /**
     * The response message for Tools.ListToolVersions.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of tool versions. There will be a maximum number of items returned based on the page_size field in the request.
         */
        toolVersions?: Schema$GoogleCloudDialogflowCxV3beta1ToolVersion[];
    }
    /**
     * The response message for TransitionRouteGroups.ListTransitionRouteGroups.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of transition route groups. There will be a maximum number of items returned based on the page_size field in the request. The list may in some cases be empty or contain fewer entries than page_size even if this isn't the last page.
         */
        transitionRouteGroups?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup[];
    }
    /**
     * The response message for Versions.ListVersions.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * A list of versions. There will be a maximum number of items returned based on the page_size field in the request. The list may in some cases be empty or contain fewer entries than page_size even if this isn't the last page.
         */
        versions?: Schema$GoogleCloudDialogflowCxV3beta1Version[];
    }
    /**
     * The response message for Webhooks.ListWebhooks.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The list of webhooks. There will be a maximum number of items returned based on the page_size field in the request.
         */
        webhooks?: Schema$GoogleCloudDialogflowCxV3beta1Webhook[];
    }
    /**
     * Stores metadata of the call of an LLM.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LlmCall {
        /**
         * The model of the LLM call.
         */
        model?: string | null;
        /**
         * A list of relevant examples used for the LLM prompt.
         */
        retrievedExamples?: Schema$GoogleCloudDialogflowCxV3beta1LlmCallRetrievedExample[];
        /**
         * The temperature of the LLM call.
         */
        temperature?: number | null;
        /**
         * The token counts of the LLM call.
         */
        tokenCount?: Schema$GoogleCloudDialogflowCxV3beta1LlmCallTokenCount;
    }
    /**
     * Relevant example used for the LLM prompt.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LlmCallRetrievedExample {
        /**
         * The display name of the example.
         */
        exampleDisplayName?: string | null;
        /**
         * The id of the example.
         */
        exampleId?: string | null;
        /**
         * Optional. The matched retrieval label of this LLM call.
         */
        matchedRetrievalLabel?: string | null;
        /**
         * Retrieval strategy of the example.
         */
        retrievalStrategy?: string | null;
    }
    /**
     * Stores token counts of the LLM call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LlmCallTokenCount {
        /**
         * The number of tokens used for the conversation history in the prompt.
         */
        conversationContextTokenCount?: string | null;
        /**
         * The number of tokens used for the retrieved examples in the prompt.
         */
        exampleTokenCount?: string | null;
        /**
         * The total number of tokens used for the input to the LLM call.
         */
        totalInputTokenCount?: string | null;
        /**
         * The total number of tokens used for the output of the LLM call.
         */
        totalOutputTokenCount?: string | null;
    }
    /**
     * Settings for LLM models.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LlmModelSettings {
        /**
         * The selected LLM model.
         */
        model?: string | null;
        /**
         * The custom prompt to use.
         */
        promptText?: string | null;
    }
    /**
     * The request message for Versions.LoadVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LoadVersionRequest {
        /**
         * This field is used to prevent accidental overwrite of other agent resources, which can potentially impact other flow's behavior. If `allow_override_agent_resources` is false, conflicted agent-level resources will not be overridden (i.e. intents, entities, webhooks).
         */
        allowOverrideAgentResources?: boolean | null;
    }
    /**
     * The response message for Environments.LookupEnvironmentHistory.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse {
        /**
         * Represents a list of snapshots for an environment. Time of the snapshots is stored in `update_time`.
         */
        environments?: Schema$GoogleCloudDialogflowCxV3beta1Environment[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
    }
    /**
     * Represents one match result of MatchIntent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Match {
        /**
         * The confidence of this match. Values range from 0.0 (completely uncertain) to 1.0 (completely certain). This value is for informational purpose only and is only used to help match the best intent within the classification threshold. This value may change for the same end-user expression at any time due to a model retraining or change in implementation.
         */
        confidence?: number | null;
        /**
         * The event that matched the query. Filled for `EVENT`, `NO_MATCH` and `NO_INPUT` match types.
         */
        event?: string | null;
        /**
         * The Intent that matched the query. Some, not all fields are filled in this message, including but not limited to: `name` and `display_name`. Only filled for `INTENT` match type.
         */
        intent?: Schema$GoogleCloudDialogflowCxV3beta1Intent;
        /**
         * Type of this Match.
         */
        matchType?: string | null;
        /**
         * The collection of parameters extracted from the query. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * Final text input which was matched during MatchIntent. This value can be different from original input sent in request because of spelling correction or other processing.
         */
        resolvedInput?: string | null;
    }
    /**
     * Request of MatchIntent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1MatchIntentRequest {
        /**
         * Persist session parameter changes from `query_params`.
         */
        persistParameterChanges?: boolean | null;
        /**
         * Required. The input specification.
         */
        queryInput?: Schema$GoogleCloudDialogflowCxV3beta1QueryInput;
        /**
         * The parameters of this query.
         */
        queryParams?: Schema$GoogleCloudDialogflowCxV3beta1QueryParameters;
    }
    /**
     * Response of MatchIntent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse {
        /**
         * The current Page. Some, not all fields are filled in this message, including but not limited to `name` and `display_name`.
         */
        currentPage?: Schema$GoogleCloudDialogflowCxV3beta1Page;
        /**
         * Match results, if more than one, ordered descendingly by the confidence we have that the particular intent matches the query.
         */
        matches?: Schema$GoogleCloudDialogflowCxV3beta1Match[];
        /**
         * If natural language text was provided as input, this field will contain a copy of the text.
         */
        text?: string | null;
        /**
         * If natural language speech audio was provided as input, this field will contain the transcript for the audio.
         */
        transcript?: string | null;
        /**
         * If an event was provided as input, this field will contain a copy of the event name.
         */
        triggerEvent?: string | null;
        /**
         * If an intent was provided as input, this field will contain a copy of the intent identifier. Format: `projects//locations//agents//intents/`.
         */
        triggerIntent?: string | null;
    }
    /**
     * A named metric is a metric with name, value and unit.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1NamedMetric {
        /**
         * The name of the metric.
         */
        name?: string | null;
        /**
         * The unit in which this metric is reported. Follows [The Unified Code for Units of Measure](https://unitsofmeasure.org/ucum.html) standard.
         */
        unit?: string | null;
        /**
         * The value of the metric.
         */
        value?: any | null;
    }
    /**
     * Settings related to NLU.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1NluSettings {
        /**
         * To filter out false positive results and still get variety in matched natural language inputs for your agent, you can tune the machine learning classification threshold. If the returned score value is less than the threshold value, then a no-match event will be triggered. The score values range from 0.0 (completely uncertain) to 1.0 (completely certain). If set to 0.0, the default of 0.3 is used. You can set a separate classification threshold for the flow in each language enabled for the agent.
         */
        classificationThreshold?: number | null;
        /**
         * Indicates NLU model training mode.
         */
        modelTrainingMode?: string | null;
        /**
         * Indicates the type of NLU model.
         */
        modelType?: string | null;
    }
    /**
     * Instructs the speech synthesizer how to generate the output audio content.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1OutputAudioConfig {
        /**
         * Required. Audio encoding of the synthesized audio content.
         */
        audioEncoding?: string | null;
        /**
         * Optional. The synthesis sample rate (in hertz) for this audio. If not provided, then the synthesizer will use the default sample rate based on the audio encoding. If this is different from the voice's natural sample rate, then the synthesizer will honor this request by converting to the desired sample rate (which might result in worse audio quality).
         */
        sampleRateHertz?: number | null;
        /**
         * Optional. Configuration of how speech should be synthesized. If not specified, Agent.text_to_speech_settings is applied.
         */
        synthesizeSpeechConfig?: Schema$GoogleCloudDialogflowCxV3beta1SynthesizeSpeechConfig;
    }
    /**
     * A Dialogflow CX conversation (session) can be described and visualized as a state machine. The states of a CX session are represented by pages. For each flow, you define many pages, where your combined pages can handle a complete conversation on the topics the flow is designed for. At any given moment, exactly one page is the current page, the current page is considered active, and the flow associated with that page is considered active. Every flow has a special start page. When a flow initially becomes active, the start page page becomes the current page. For each conversational turn, the current page will either stay the same or transition to another page. You configure each page to collect information from the end-user that is relevant for the conversational state represented by the page. For more information, see the [Page guide](https://cloud.google.com/dialogflow/cx/docs/concept/page).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Page {
        /**
         * Hierarchical advanced settings for this page. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * The description of the page. The maximum length is 500 characters.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the page, unique within the flow.
         */
        displayName?: string | null;
        /**
         * The fulfillment to call when the session is entering the page.
         */
        entryFulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
        /**
         * Handlers associated with the page to handle events such as webhook errors, no match or no input.
         */
        eventHandlers?: Schema$GoogleCloudDialogflowCxV3beta1EventHandler[];
        /**
         * The form associated with the page, used for collecting parameters relevant to the page.
         */
        form?: Schema$GoogleCloudDialogflowCxV3beta1Form;
        /**
         * Optional. Knowledge connector configuration.
         */
        knowledgeConnectorSettings?: Schema$GoogleCloudDialogflowCxV3beta1KnowledgeConnectorSettings;
        /**
         * The unique identifier of the page. Required for the Pages.UpdatePage method. Pages.CreatePage populates the name automatically. Format: `projects//locations//agents//flows//pages/`.
         */
        name?: string | null;
        /**
         * Ordered list of `TransitionRouteGroups` added to the page. Transition route groups must be unique within a page. If the page links both flow-level transition route groups and agent-level transition route groups, the flow-level ones will have higher priority and will be put before the agent-level ones. * If multiple transition routes within a page scope refer to the same intent, then the precedence order is: page's transition route -\> page's transition route group -\> flow's transition routes. * If multiple transition route groups within a page contain the same intent, then the first group in the ordered list takes precedence. Format:`projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        transitionRouteGroups?: string[] | null;
        /**
         * A list of transitions for the transition rules of this page. They route the conversation to another page in the same flow, or another flow. When we are in a certain page, the TransitionRoutes are evaluated in the following order: * TransitionRoutes defined in the page with intent specified. * TransitionRoutes defined in the transition route groups with intent specified. * TransitionRoutes defined in flow with intent specified. * TransitionRoutes defined in the transition route groups with intent specified. * TransitionRoutes defined in the page with only condition specified. * TransitionRoutes defined in the transition route groups with only condition specified.
         */
        transitionRoutes?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute[];
    }
    /**
     * Represents page information communicated to and from the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PageInfo {
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The unique identifier of the current page. Format: `projects//locations//agents//flows//pages/`.
         */
        currentPage?: string | null;
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The display name of the current page.
         */
        displayName?: string | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. Information about the form.
         */
        formInfo?: Schema$GoogleCloudDialogflowCxV3beta1PageInfoFormInfo;
    }
    /**
     * Represents form information.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PageInfoFormInfo {
        /**
         * Optional for both WebhookRequest and WebhookResponse. The parameters contained in the form. Note that the webhook cannot add or remove any form parameter.
         */
        parameterInfo?: Schema$GoogleCloudDialogflowCxV3beta1PageInfoFormInfoParameterInfo[];
    }
    /**
     * Represents parameter information.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PageInfoFormInfoParameterInfo {
        /**
         * Always present for WebhookRequest. Required for WebhookResponse. The human-readable name of the parameter, unique within the form. This field cannot be modified by the webhook.
         */
        displayName?: string | null;
        /**
         * Optional for WebhookRequest. Ignored for WebhookResponse. Indicates if the parameter value was just collected on the last conversation turn.
         */
        justCollected?: boolean | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. Indicates whether the parameter is required. Optional parameters will not trigger prompts; however, they are filled if the user specifies them. Required parameters must be filled before form filling concludes.
         */
        required?: boolean | null;
        /**
         * Always present for WebhookRequest. Required for WebhookResponse. The state of the parameter. This field can be set to INVALID by the webhook to invalidate the parameter; other values set by the webhook will be ignored.
         */
        state?: string | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. The value of the parameter. This field can be set by the webhook to change the parameter value.
         */
        value?: any | null;
    }
    /**
     * Defines the properties of a parameter. Used to define parameters used in the agent and the input / output parameters for each fulfillment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ParameterDefinition {
        /**
         * Human-readable description of the parameter. Limited to 300 characters.
         */
        description?: string | null;
        /**
         * Required. Name of parameter.
         */
        name?: string | null;
        /**
         * Type of parameter.
         */
        type?: string | null;
        /**
         * Optional. Type schema of parameter.
         */
        typeSchema?: Schema$GoogleCloudDialogflowCxV3beta1TypeSchema;
    }
    /**
     * Text input which can be used for prompt or banned phrases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Phrase {
        /**
         * Required. Text input which can be used for prompt or banned phrases.
         */
        text?: string | null;
    }
    /**
     * Playbook is the basic building block to instruct the LLM how to execute a certain task. A playbook consists of a goal to accomplish, an optional list of step by step instructions (the step instruction may refers to name of the custom or default plugin tools to use) to perform the task, a list of contextual input data to be passed in at the beginning of the invoked, and a list of output parameters to store the playbook result.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Playbook {
        /**
         * Output only. The timestamp of initial playbook creation.
         */
        createTime?: string | null;
        /**
         * Required. The human-readable name of the playbook, unique within an agent.
         */
        displayName?: string | null;
        /**
         * Required. High level description of the goal the playbook intend to accomplish. A goal should be concise since it's visible to other playbooks that may reference this playbook.
         */
        goal?: string | null;
        /**
         * Optional. A list of registered handlers to execute based on the specified triggers.
         */
        handlers?: Schema$GoogleCloudDialogflowCxV3beta1Handler[];
        /**
         * Optional. Defined structured input parameters for this playbook.
         */
        inputParameterDefinitions?: Schema$GoogleCloudDialogflowCxV3beta1ParameterDefinition[];
        /**
         * Instruction to accomplish target goal.
         */
        instruction?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookInstruction;
        /**
         * Optional. Llm model settings for the playbook.
         */
        llmModelSettings?: Schema$GoogleCloudDialogflowCxV3beta1LlmModelSettings;
        /**
         * The unique identifier of the playbook. Format: `projects//locations//agents//playbooks/`.
         */
        name?: string | null;
        /**
         * Optional. Defined structured output parameters for this playbook.
         */
        outputParameterDefinitions?: Schema$GoogleCloudDialogflowCxV3beta1ParameterDefinition[];
        /**
         * Optional. Type of the playbook.
         */
        playbookType?: string | null;
        /**
         * Output only. The resource name of flows referenced by the current playbook in the instructions.
         */
        referencedFlows?: string[] | null;
        /**
         * Output only. The resource name of other playbooks referenced by the current playbook in the instructions.
         */
        referencedPlaybooks?: string[] | null;
        /**
         * Optional. The resource name of tools referenced by the current playbook in the instructions. If not provided explicitly, they are will be implied using the tool being referenced in goal and steps.
         */
        referencedTools?: string[] | null;
        /**
         * Optional. Playbook level Settings for speech to text detection.
         */
        speechSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettingsSpeechSettings;
        /**
         * Output only. Estimated number of tokes current playbook takes when sent to the LLM.
         */
        tokenCount?: string | null;
        /**
         * Output only. Last time the playbook version was updated.
         */
        updateTime?: string | null;
    }
    /**
     * The playbook import strategy used for resource conflict resolution associated with an ImportPlaybookRequest.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookImportStrategy {
        /**
         * Optional. Specifies the import strategy used when resolving conflicts with the main playbook. If not specified, 'CREATE_NEW' is assumed.
         */
        mainPlaybookImportStrategy?: string | null;
        /**
         * Optional. Specifies the import strategy used when resolving referenced playbook/flow conflicts. If not specified, 'CREATE_NEW' is assumed.
         */
        nestedResourceImportStrategy?: string | null;
        /**
         * Optional. Specifies the import strategy used when resolving tool conflicts. If not specified, 'CREATE_NEW' is assumed. This will be applied after the main playbook and nested resource import strategies, meaning if the playbook that references the tool is skipped, the tool will also be skipped.
         */
        toolImportStrategy?: string | null;
    }
    /**
     * Input of the playbook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookInput {
        /**
         * Optional. A list of input parameters for the action.
         */
        actionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. Summary string of the preceding conversation for the child playbook invocation.
         */
        precedingConversationSummary?: string | null;
    }
    /**
     * Message of the Instruction of the playbook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookInstruction {
        /**
         * General guidelines for the playbook. These are unstructured instructions that are not directly part of the goal, e.g. "Always be polite". It's valid for this text to be long and used instead of steps altogether.
         */
        guidelines?: string | null;
        /**
         * Ordered list of step by step execution instructions to accomplish target goal.
         */
        steps?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookStep[];
    }
    /**
     * Stores metadata of the invocation of a child playbook. Playbook invocation actions enter the child playbook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookInvocation {
        /**
         * Output only. The display name of the playbook.
         */
        displayName?: string | null;
        /**
         * Required. The unique identifier of the playbook. Format: `projects//locations//agents//playbooks/`.
         */
        playbook?: string | null;
        /**
         * Optional. Input of the child playbook invocation.
         */
        playbookInput?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookInput;
        /**
         * Optional. Output of the child playbook invocation.
         */
        playbookOutput?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookOutput;
        /**
         * Required. Playbook invocation's output state.
         */
        playbookState?: string | null;
    }
    /**
     * Output of the playbook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookOutput {
        /**
         * Optional. A Struct object of output parameters for the action.
         */
        actionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. Summary string of the execution result of the child playbook.
         */
        executionSummary?: string | null;
        /**
         * End state of the playbook.
         */
        state?: string | null;
    }
    /**
     * Message of single step execution.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookStep {
        /**
         * Sub-processing needed to execute the current step.
         */
        steps?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookStep[];
        /**
         * Step instruction in text format.
         */
        text?: string | null;
    }
    /**
     * Stores metadata of the transition to another target playbook. Playbook transition actions exit the caller playbook and enter the target playbook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookTransition {
        /**
         * Output only. The display name of the playbook.
         */
        displayName?: string | null;
        /**
         * A list of input parameters for the action.
         */
        inputActionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The unique identifier of the playbook. Format: `projects//locations//agents//playbooks/`.
         */
        playbook?: string | null;
    }
    /**
     * Playbook version is a snapshot of the playbook at certain timestamp.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion {
        /**
         * Optional. The description of the playbook version.
         */
        description?: string | null;
        /**
         * Output only. Snapshot of the examples belonging to the playbook when the playbook version is created.
         */
        examples?: Schema$GoogleCloudDialogflowCxV3beta1Example[];
        /**
         * The unique identifier of the playbook version. Format: `projects//locations//agents//playbooks//versions/`.
         */
        name?: string | null;
        /**
         * Output only. Snapshot of the playbook when the playbook version is created.
         */
        playbook?: Schema$GoogleCloudDialogflowCxV3beta1Playbook;
        /**
         * Output only. Last time the playbook version was created or modified.
         */
        updateTime?: string | null;
    }
    /**
     * Represents the query input. It can contain one of: 1. A conversational query in the form of text. 2. An intent query that specifies which intent to trigger. 3. Natural language speech audio to be processed. 4. An event to be triggered. 5. DTMF digits to invoke an intent and fill in parameter value. 6. The results of a tool executed by the client.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1QueryInput {
        /**
         * The natural language speech audio to be processed.
         */
        audio?: Schema$GoogleCloudDialogflowCxV3beta1AudioInput;
        /**
         * The DTMF event to be handled.
         */
        dtmf?: Schema$GoogleCloudDialogflowCxV3beta1DtmfInput;
        /**
         * The event to be triggered.
         */
        event?: Schema$GoogleCloudDialogflowCxV3beta1EventInput;
        /**
         * The intent to be triggered.
         */
        intent?: Schema$GoogleCloudDialogflowCxV3beta1IntentInput;
        /**
         * Required. The language of the input. See [Language Support](https://cloud.google.com/dialogflow/cx/docs/reference/language) for a list of the currently supported language codes. Note that queries in the same session do not necessarily need to specify the same language.
         */
        languageCode?: string | null;
        /**
         * The natural language text to be processed.
         */
        text?: Schema$GoogleCloudDialogflowCxV3beta1TextInput;
        /**
         * The results of a tool executed by the client.
         */
        toolCallResult?: Schema$GoogleCloudDialogflowCxV3beta1ToolCallResult;
    }
    /**
     * Represents the parameters of a conversational query.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1QueryParameters {
        /**
         * Configures whether sentiment analysis should be performed. If not provided, sentiment analysis is not performed.
         */
        analyzeQueryTextSentiment?: boolean | null;
        /**
         * The channel which this query is for. If specified, only the ResponseMessage associated with the channel will be returned. If no ResponseMessage is associated with the channel, it falls back to the ResponseMessage with unspecified channel. If unspecified, the ResponseMessage with unspecified channel will be returned.
         */
        channel?: string | null;
        /**
         * The unique identifier of the page to override the current page in the session. Format: `projects//locations//agents//flows//pages/`. If `current_page` is specified, the previous state of the session will be ignored by Dialogflow, including the previous page and the previous session parameters. In most cases, current_page and parameters should be configured together to direct a session to a specific state.
         */
        currentPage?: string | null;
        /**
         * Optional. The unique identifier of the playbook to start or continue the session with. If `current_playbook` is specified, the previous state of the session will be ignored by Dialogflow. Format: `projects//locations//agents//playbooks/`.
         */
        currentPlaybook?: string | null;
        /**
         * Whether to disable webhook calls for this request.
         */
        disableWebhook?: boolean | null;
        /**
         * Optional. Information about the end-user to improve the relevance and accuracy of generative answers. This will be interpreted and used by a language model, so, for good results, the data should be self-descriptive, and in a simple structure. Example: ```json { "subscription plan": "Business Premium Plus", "devices owned": [ {"model": "Google Pixel 7"\}, {"model": "Google Pixel Tablet"\} ] \} ```
         */
        endUserMetadata?: {
            [key: string]: any;
        } | null;
        /**
         * A list of flow versions to override for the request. Format: `projects//locations//agents//flows//versions/`. If version 1 of flow X is included in this list, the traffic of flow X will go through version 1 regardless of the version configuration in the environment. Each flow can have at most one version specified in this list.
         */
        flowVersions?: string[] | null;
        /**
         * The geo location of this conversational query.
         */
        geoLocation?: Schema$GoogleTypeLatLng;
        /**
         * Optional. Use the specified LLM model settings for processing the request.
         */
        llmModelSettings?: Schema$GoogleCloudDialogflowCxV3beta1LlmModelSettings;
        /**
         * Additional parameters to be put into session parameters. To remove a parameter from the session, clients should explicitly set the parameter value to null. You can reference the session parameters in the agent with the following format: $session.params.parameter-id. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * This field can be used to pass custom data into the webhook associated with the agent. Arbitrary JSON objects are supported. Some integrations that query a Dialogflow agent may provide additional information in the payload. In particular, for the Dialogflow Phone Gateway integration, this field has the form: ``` { "telephony": { "caller_id": "+18558363987" \} \} ```
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. If set to true and data stores are involved in serving the request then DetectIntentResponse.query_result.data_store_connection_signals will be filled with data that can help evaluations.
         */
        populateDataStoreConnectionSignals?: boolean | null;
        /**
         * Optional. Search configuration for UCS search queries.
         */
        searchConfig?: Schema$GoogleCloudDialogflowCxV3beta1SearchConfig;
        /**
         * Additional session entity types to replace or extend developer entity types with. The entity synonyms apply to all languages and persist for the session of this query.
         */
        sessionEntityTypes?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType[];
        /**
         * Optional. Configure lifetime of the Dialogflow session. By default, a Dialogflow session remains active and its data is stored for 30 minutes after the last request is sent for the session. This value should be no longer than 1 day.
         */
        sessionTtl?: string | null;
        /**
         * The time zone of this conversational query from the [time zone database](https://www.iana.org/time-zones), e.g., America/New_York, Europe/Paris. If not provided, the time zone specified in the agent is used.
         */
        timeZone?: string | null;
        /**
         * This field can be used to pass HTTP headers for a webhook call. These headers will be sent to webhook along with the headers that have been configured through Dialogflow web console. The headers defined within this field will overwrite the headers configured through Dialogflow console if there is a conflict. Header names are case-insensitive. Google's specified headers are not allowed. Including: "Host", "Content-Length", "Connection", "From", "User-Agent", "Accept-Encoding", "If-Modified-Since", "If-None-Match", "X-Forwarded-For", etc.
         */
        webhookHeaders?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Represents the result of a conversational query.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1QueryResult {
        /**
         * Returns the current advanced settings including IVR settings. Even though the operations configured by these settings are performed by Dialogflow, the client may need to perform special logic at the moment. For example, if Dialogflow exports audio to Google Cloud Storage, then the client may need to wait for the resulting object to appear in the bucket before proceeding.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3beta1AdvancedSettings;
        /**
         * Indicates whether the Thumbs up/Thumbs down rating controls are need to be shown for the response in the Dialogflow Messenger widget.
         */
        allowAnswerFeedback?: boolean | null;
        /**
         * The current Flow. Some, not all fields are filled in this message, including but not limited to `name` and `display_name`.
         */
        currentFlow?: Schema$GoogleCloudDialogflowCxV3beta1Flow;
        /**
         * The current Page. Some, not all fields are filled in this message, including but not limited to `name` and `display_name`.
         */
        currentPage?: Schema$GoogleCloudDialogflowCxV3beta1Page;
        /**
         * Optional. Data store connection feature output signals. Filled only when data stores are involved in serving the query.
         */
        dataStoreConnectionSignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignals;
        /**
         * The free-form diagnostic info. For example, this field could contain webhook call latency. The fields of this data can change without notice, so you should not write code that depends on its structure. One of the fields is called "Alternative Matched Intents", which may aid with debugging. The following describes these intent results: - The list is empty if no intent was matched to end-user input. - Only intents that are referenced in the currently active flow are included. - The matched intent is included. - Other intents that could have matched end-user input, but did not match because they are referenced by intent routes that are out of [scope](https://cloud.google.com/dialogflow/cx/docs/concept/handler#scope), are included. - Other intents referenced by intent routes in scope that matched end-user input, but had a lower confidence score.
         */
        diagnosticInfo?: {
            [key: string]: any;
        } | null;
        /**
         * If a DTMF was provided as input, this field will contain a copy of the DtmfInput.
         */
        dtmf?: Schema$GoogleCloudDialogflowCxV3beta1DtmfInput;
        /**
         * The information of a query if handled by generative agent resources.
         */
        generativeInfo?: Schema$GoogleCloudDialogflowCxV3beta1GenerativeInfo;
        /**
         * The Intent that matched the conversational query. Some, not all fields are filled in this message, including but not limited to: `name` and `display_name`. This field is deprecated, please use QueryResult.match instead.
         */
        intent?: Schema$GoogleCloudDialogflowCxV3beta1Intent;
        /**
         * The intent detection confidence. Values range from 0.0 (completely uncertain) to 1.0 (completely certain). This value is for informational purpose only and is only used to help match the best intent within the classification threshold. This value may change for the same end-user expression at any time due to a model retraining or change in implementation. This field is deprecated, please use QueryResult.match instead.
         */
        intentDetectionConfidence?: number | null;
        /**
         * The language that was triggered during intent detection. See [Language Support](https://cloud.google.com/dialogflow/cx/docs/reference/language) for a list of the currently supported language codes.
         */
        languageCode?: string | null;
        /**
         * Intent match result, could be an intent or an event.
         */
        match?: Schema$GoogleCloudDialogflowCxV3beta1Match;
        /**
         * The collected session parameters. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * The list of rich messages returned to the client. Responses vary from simple text messages to more sophisticated, structured payloads used to drive complex logic.
         */
        responseMessages?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage[];
        /**
         * The sentiment analyss result, which depends on `analyze_query_text_sentiment`, specified in the request.
         */
        sentimentAnalysisResult?: Schema$GoogleCloudDialogflowCxV3beta1SentimentAnalysisResult;
        /**
         * If natural language text was provided as input, this field will contain a copy of the text.
         */
        text?: string | null;
        /**
         * If natural language speech audio was provided as input, this field will contain the transcript for the audio.
         */
        transcript?: string | null;
        /**
         * If an event was provided as input, this field will contain the name of the event.
         */
        triggerEvent?: string | null;
        /**
         * If an intent was provided as input, this field will contain a copy of the intent identifier. Format: `projects//locations//agents//intents/`.
         */
        triggerIntent?: string | null;
        /**
         * The list of webhook display names in the order of call sequence.
         */
        webhookDisplayNames?: string[] | null;
        /**
         * The list of webhook ids in the order of call sequence.
         */
        webhookIds?: string[] | null;
        /**
         * The list of webhook latencies in the order of call sequence.
         */
        webhookLatencies?: string[] | null;
        /**
         * The list of webhook payload in WebhookResponse.payload, in the order of call sequence. If some webhook call fails or doesn't return any payload, an empty `Struct` would be used instead.
         */
        webhookPayloads?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * The list of webhook call status in the order of call sequence.
         */
        webhookStatuses?: Schema$GoogleRpcStatus[];
        /**
         * The list of webhook tags in the order of call sequence.
         */
        webhookTags?: string[] | null;
    }
    /**
     * Resource name and display name.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResourceName {
        /**
         * Display name.
         */
        displayName?: string | null;
        /**
         * Name.
         */
        name?: string | null;
    }
    /**
     * Represents a response message that can be returned by a conversational agent. Response messages are also used for output audio synthesis. The approach is as follows: * If at least one OutputAudioText response is present, then all OutputAudioText responses are linearly concatenated, and the result is used for output audio synthesis. * If the OutputAudioText responses are a mixture of text and SSML, then the concatenated result is treated as SSML; otherwise, the result is treated as either text or SSML as appropriate. The agent designer should ideally use either text or SSML consistently throughout the bot design. * Otherwise, all Text responses are linearly concatenated, and the result is used for output audio synthesis. This approach allows for more sophisticated user experience scenarios, where the text displayed to the user may differ from what is heard.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage {
        /**
         * The channel which the response is associated with. Clients can specify the channel via QueryParameters.channel, and only associated channel response will be returned.
         */
        channel?: string | null;
        /**
         * Indicates that the conversation succeeded.
         */
        conversationSuccess?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageConversationSuccess;
        /**
         * Output only. A signal that indicates the interaction with the Dialogflow agent has ended. This message is generated by Dialogflow only when the conversation reaches `END_SESSION` page. It is not supposed to be defined by the user. It's guaranteed that there is at most one such message in each response.
         */
        endInteraction?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageEndInteraction;
        /**
         * Represents info card for knowledge answers, to be better rendered in Dialogflow Messenger.
         */
        knowledgeInfoCard?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageKnowledgeInfoCard;
        /**
         * Hands off conversation to a human agent.
         */
        liveAgentHandoff?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageLiveAgentHandoff;
        /**
         * Output only. An audio response message composed of both the synthesized Dialogflow agent responses and responses defined via play_audio. This message is generated by Dialogflow only and not supposed to be defined by the user.
         */
        mixedAudio?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageMixedAudio;
        /**
         * A text or ssml response that is preferentially used for TTS output audio synthesis, as described in the comment on the ResponseMessage message.
         */
        outputAudioText?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageOutputAudioText;
        /**
         * Returns a response containing a custom, platform-specific payload.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Signal that the client should play an audio clip hosted at a client-specific URI. Dialogflow uses this to construct mixed_audio. However, Dialogflow itself does not try to read or process the URI in any way.
         */
        playAudio?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessagePlayAudio;
        /**
         * A signal that the client should transfer the phone call connected to this agent to a third-party endpoint.
         */
        telephonyTransferCall?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageTelephonyTransferCall;
        /**
         * Returns a text response.
         */
        text?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageText;
        /**
         * Returns the definition of a tool call that should be executed by the client.
         */
        toolCall?: Schema$GoogleCloudDialogflowCxV3beta1ToolCall;
    }
    /**
     * Indicates that the conversation succeeded, i.e., the bot handled the issue that the customer talked to it about. Dialogflow only uses this to determine which conversations should be counted as successful and doesn't process the metadata in this message in any way. Note that Dialogflow also considers conversations that get to the conversation end page as successful even if they don't return ConversationSuccess. You may set this, for example: * In the entry_fulfillment of a Page if entering the page indicates that the conversation succeeded. * In a webhook response when you determine that you handled the customer issue.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageConversationSuccess {
        /**
         * Custom metadata. Dialogflow doesn't impose any structure on this.
         */
        metadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Indicates that interaction with the Dialogflow agent has ended. This message is generated by Dialogflow only and not supposed to be defined by the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageEndInteraction {
    }
    /**
     * Represents info card response. If the response contains generative knowledge prediction, Dialogflow will return a payload with Infobot Messenger compatible info card. Otherwise, the info card response is skipped.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageKnowledgeInfoCard {
    }
    /**
     * Indicates that the conversation should be handed off to a live agent. Dialogflow only uses this to determine which conversations were handed off to a human agent for measurement purposes. What else to do with this signal is up to you and your handoff procedures. You may set this, for example: * In the entry_fulfillment of a Page if entering the page indicates something went extremely wrong in the conversation. * In a webhook response when you determine that the customer issue can only be handled by a human.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageLiveAgentHandoff {
        /**
         * Custom metadata for your handoff procedure. Dialogflow doesn't impose any structure on this.
         */
        metadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents an audio message that is composed of both segments synthesized from the Dialogflow agent prompts and ones hosted externally at the specified URIs. The external URIs are specified via play_audio. This message is generated by Dialogflow only and not supposed to be defined by the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageMixedAudio {
        /**
         * Segments this audio response is composed of.
         */
        segments?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageMixedAudioSegment[];
    }
    /**
     * Represents one segment of audio.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageMixedAudioSegment {
        /**
         * Output only. Whether the playback of this segment can be interrupted by the end user's speech and the client should then start the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Raw audio synthesized from the Dialogflow agent's response using the output config specified in the request.
         */
        audio?: string | null;
        /**
         * Client-specific URI that points to an audio clip accessible to the client. Dialogflow does not impose any validation on it.
         */
        uri?: string | null;
    }
    /**
     * A text or ssml response that is preferentially used for TTS output audio synthesis, as described in the comment on the ResponseMessage message.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageOutputAudioText {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * The SSML text to be synthesized. For more information, see [SSML](/speech/text-to-speech/docs/ssml).
         */
        ssml?: string | null;
        /**
         * The raw text to be synthesized.
         */
        text?: string | null;
    }
    /**
     * Specifies an audio clip to be played by the client as part of the response.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessagePlayAudio {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Required. URI of the audio clip. Dialogflow does not impose any validation on this value. It is specific to the client that reads it.
         */
        audioUri?: string | null;
    }
    /**
     * Represents the signal that telles the client to transfer the phone call connected to the agent to a third-party endpoint.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageTelephonyTransferCall {
        /**
         * Transfer the call to a phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164).
         */
        phoneNumber?: string | null;
    }
    /**
     * The text response message.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ResponseMessageText {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Required. A collection of text response variants. If multiple variants are defined, only one text response variant is returned at runtime.
         */
        text?: string[] | null;
    }
    /**
     * The request message for Agents.RestoreAgent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestoreAgentRequest {
        /**
         * Uncompressed raw byte content for agent.
         */
        agentContent?: string | null;
        /**
         * The [Google Cloud Storage](https://cloud.google.com/storage/docs/) URI to restore agent from. The format of this URI must be `gs:///`. Dialogflow performs a read operation for the Cloud Storage object on the caller's behalf, so your request authentication must have read permissions for the object. For more information, see [Dialogflow access control](https://cloud.google.com/dialogflow/cx/docs/concept/access-control#storage).
         */
        agentUri?: string | null;
        /**
         * Setting for restoring from a git branch
         */
        gitSource?: Schema$GoogleCloudDialogflowCxV3beta1RestoreAgentRequestGitSource;
        /**
         * Agent restore mode. If not specified, `KEEP` is assumed.
         */
        restoreOption?: string | null;
    }
    /**
     * Settings for restoring from a git branch
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestoreAgentRequestGitSource {
        /**
         * tracking branch for the git pull
         */
        trackingBranch?: string | null;
    }
    /**
     * The request message for Playbooks.RestorePlaybookVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionRequest {
    }
    /**
     * The response message for Playbooks.RestorePlaybookVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse {
        /**
         * The updated playbook.
         */
        playbook?: Schema$GoogleCloudDialogflowCxV3beta1Playbook;
    }
    /**
     * The request message for Tools.RestoreToolVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionRequest {
    }
    /**
     * The response message for Tools.RestoreToolVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse {
        /**
         * The updated tool.
         */
        tool?: Schema$GoogleCloudDialogflowCxV3beta1Tool;
    }
    /**
     * The configuration for auto rollout.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RolloutConfig {
        /**
         * The conditions that are used to evaluate the failure of a rollout step. If not specified, no rollout steps will fail. E.g. "containment_rate < 10% OR average_turn_count < 3". See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition).
         */
        failureCondition?: string | null;
        /**
         * The conditions that are used to evaluate the success of a rollout step. If not specified, all rollout steps will proceed to the next one unless failure conditions are met. E.g. "containment_rate \> 60% AND callback_rate < 20%". See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition).
         */
        rolloutCondition?: string | null;
        /**
         * Steps to roll out a flow version. Steps should be sorted by percentage in ascending order.
         */
        rolloutSteps?: Schema$GoogleCloudDialogflowCxV3beta1RolloutConfigRolloutStep[];
    }
    /**
     * A single rollout step with specified traffic allocation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RolloutConfigRolloutStep {
        /**
         * The name of the rollout step;
         */
        displayName?: string | null;
        /**
         * The minimum time that this step should last. Should be longer than 1 hour. If not set, the default minimum duration for each step will be 1 hour.
         */
        minDuration?: string | null;
        /**
         * The percentage of traffic allocated to the flow version of this rollout step. (0%, 100%].
         */
        trafficPercent?: number | null;
    }
    /**
     * State of the auto-rollout process.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RolloutState {
        /**
         * Start time of the current step.
         */
        startTime?: string | null;
        /**
         * Display name of the current auto rollout step.
         */
        step?: string | null;
        /**
         * Index of the current step in the auto rollout steps list.
         */
        stepIndex?: number | null;
    }
    /**
     * Metadata returned for the Environments.RunContinuousTest long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunContinuousTestMetadata {
        /**
         * The test errors.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3beta1TestError[];
    }
    /**
     * The request message for Environments.RunContinuousTest.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunContinuousTestRequest {
    }
    /**
     * The response message for Environments.RunContinuousTest.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunContinuousTestResponse {
        /**
         * The result for a continuous test run.
         */
        continuousTestResult?: Schema$GoogleCloudDialogflowCxV3beta1ContinuousTestResult;
    }
    /**
     * Metadata returned for the TestCases.RunTestCase long running operation. This message currently has no fields.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunTestCaseMetadata {
    }
    /**
     * The request message for TestCases.RunTestCase.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunTestCaseRequest {
        /**
         * Optional. Environment name. If not set, draft environment is assumed. Format: `projects//locations//agents//environments/`.
         */
        environment?: string | null;
    }
    /**
     * The response message for TestCases.RunTestCase.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1RunTestCaseResponse {
        /**
         * The result.
         */
        result?: Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult;
    }
    /**
     * Settings for Generative Safety.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SafetySettings {
        /**
         * Banned phrases for generated text.
         */
        bannedPhrases?: Schema$GoogleCloudDialogflowCxV3beta1SafetySettingsPhrase[];
        /**
         * Optional. Default phrase match strategy for banned phrases.
         */
        defaultBannedPhraseMatchStrategy?: string | null;
    }
    /**
     * Text input which can be used for prompt or banned phrases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SafetySettingsPhrase {
        /**
         * Required. Language code of the phrase.
         */
        languageCode?: string | null;
        /**
         * Required. Text input which can be used for prompt or banned phrases.
         */
        text?: string | null;
    }
    /**
     * Search configuration for UCS search queries.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SearchConfig {
        /**
         * Optional. Boosting configuration for the datastores. Maps from datastore name to their boost configuration. Do not specify more than one BoostSpecs for each datastore name. If multiple BoostSpecs are provided for the same datastore name, the behavior is undefined.
         */
        boostSpecs?: Schema$GoogleCloudDialogflowCxV3beta1BoostSpecs[];
        /**
         * Optional. Filter configuration for the datastores. Maps from datastore name to the filter expression for that datastore. Do not specify more than one FilterSpecs for each datastore name. If multiple FilterSpecs are provided for the same datastore name, the behavior is undefined.
         */
        filterSpecs?: Schema$GoogleCloudDialogflowCxV3beta1FilterSpecs[];
    }
    /**
     * Represents the settings related to security issues, such as data redaction and data retention. It may take hours for updates on the settings to propagate to all the related components and take effect.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings {
        /**
         * Controls audio export settings for post-conversation analytics when ingesting audio to conversations via Participants.AnalyzeContent or Participants.StreamingAnalyzeContent. If retention_strategy is set to REMOVE_AFTER_CONVERSATION or audio_export_settings.gcs_bucket is empty, audio export is disabled. If audio export is enabled, audio is recorded and saved to audio_export_settings.gcs_bucket, subject to retention policy of audio_export_settings.gcs_bucket. This setting won't effect audio input for implicit sessions via Sessions.DetectIntent or Sessions.StreamingDetectIntent.
         */
        audioExportSettings?: Schema$GoogleCloudDialogflowCxV3beta1SecuritySettingsAudioExportSettings;
        /**
         * [DLP](https://cloud.google.com/dlp/docs) deidentify template name. Use this template to define de-identification configuration for the content. The `DLP De-identify Templates Reader` role is needed on the Dialogflow service identity service account (has the form `service-PROJECT_NUMBER@gcp-sa-dialogflow.iam.gserviceaccount.com`) for your agent's project. If empty, Dialogflow replaces sensitive info with `[redacted]` text. The template name will have one of the following formats: `projects//locations//deidentifyTemplates/` OR `organizations//locations//deidentifyTemplates/` Note: `deidentify_template` must be located in the same region as the `SecuritySettings`.
         */
        deidentifyTemplate?: string | null;
        /**
         * Required. The human-readable name of the security settings, unique within the location.
         */
        displayName?: string | null;
        /**
         * Controls conversation exporting settings to Insights after conversation is completed. If retention_strategy is set to REMOVE_AFTER_CONVERSATION, Insights export is disabled no matter what you configure here.
         */
        insightsExportSettings?: Schema$GoogleCloudDialogflowCxV3beta1SecuritySettingsInsightsExportSettings;
        /**
         * [DLP](https://cloud.google.com/dlp/docs) inspect template name. Use this template to define inspect base settings. The `DLP Inspect Templates Reader` role is needed on the Dialogflow service identity service account (has the form `service-PROJECT_NUMBER@gcp-sa-dialogflow.iam.gserviceaccount.com`) for your agent's project. If empty, we use the default DLP inspect config. The template name will have one of the following formats: `projects//locations//inspectTemplates/` OR `organizations//locations//inspectTemplates/` Note: `inspect_template` must be located in the same region as the `SecuritySettings`.
         */
        inspectTemplate?: string | null;
        /**
         * Resource name of the settings. Required for the SecuritySettingsService.UpdateSecuritySettings method. SecuritySettingsService.CreateSecuritySettings populates the name automatically. Format: `projects//locations//securitySettings/`.
         */
        name?: string | null;
        /**
         * List of types of data to remove when retention settings triggers purge.
         */
        purgeDataTypes?: string[] | null;
        /**
         * Defines the data for which Dialogflow applies redaction. Dialogflow does not redact data that it does not have access to – for example, Cloud logging.
         */
        redactionScope?: string | null;
        /**
         * Strategy that defines how we do redaction.
         */
        redactionStrategy?: string | null;
        /**
         * Specifies the retention behavior defined by SecuritySettings.RetentionStrategy.
         */
        retentionStrategy?: string | null;
        /**
         * Retains data in interaction logging for the specified number of days. This does not apply to Cloud logging, which is owned by the user - not Dialogflow. User must set a value lower than Dialogflow's default 365d TTL (30 days for Agent Assist traffic), higher value will be ignored and use default. Setting a value higher than that has no effect. A missing value or setting to 0 also means we use default TTL. When data retention configuration is changed, it only applies to the data created after the change; the TTL of existing data created before the change stays intact.
         */
        retentionWindowDays?: number | null;
    }
    /**
     * Settings for exporting audio.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SecuritySettingsAudioExportSettings {
        /**
         * Filename pattern for exported audio.
         */
        audioExportPattern?: string | null;
        /**
         * File format for exported audio file. Currently only in telephony recordings.
         */
        audioFormat?: string | null;
        /**
         * Enable audio redaction if it is true. Note that this only redacts end-user audio data; Synthesised audio from the virtual agent is not redacted.
         */
        enableAudioRedaction?: boolean | null;
        /**
         * Cloud Storage bucket to export audio record to. Setting this field would grant the Storage Object Creator role to the Dialogflow Service Agent. API caller that tries to modify this field should have the permission of storage.buckets.setIamPolicy.
         */
        gcsBucket?: string | null;
        /**
         * Whether to store TTS audio. By default, TTS audio from the virtual agent is not exported.
         */
        storeTtsAudio?: boolean | null;
    }
    /**
     * Settings for exporting conversations to [Insights](https://cloud.google.com/contact-center/insights/docs).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SecuritySettingsInsightsExportSettings {
        /**
         * If enabled, we will automatically exports conversations to Insights and Insights runs its analyzers.
         */
        enableInsightsExport?: boolean | null;
    }
    /**
     * The result of sentiment analysis. Sentiment analysis inspects user input and identifies the prevailing subjective opinion, especially to determine a user's attitude as positive, negative, or neutral.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SentimentAnalysisResult {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment, regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
    }
    /**
     * Session entity types are referred to as **User** entity types and are entities that are built for an individual user such as favorites, preferences, playlists, and so on. You can redefine a session entity type at the session level to extend or replace a custom entity type at the user session level (we refer to the entity types defined at the agent level as "custom entity types"). Note: session entity types apply to all queries, regardless of the language. For more information about entity types, see the [Dialogflow documentation](https://cloud.google.com/dialogflow/docs/entities-overview).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType {
        /**
         * Required. The collection of entities to override or supplement the custom entity type.
         */
        entities?: Schema$GoogleCloudDialogflowCxV3beta1EntityTypeEntity[];
        /**
         * Required. Indicates whether the additional data should override or supplement the custom entity type definition.
         */
        entityOverrideMode?: string | null;
        /**
         * Required. The unique identifier of the session entity type. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string | null;
    }
    /**
     * Represents session information communicated to and from the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SessionInfo {
        /**
         * Optional for WebhookRequest. Optional for WebhookResponse. All parameters collected from forms and intents during the session. Parameters can be created, updated, or removed by the webhook. To remove a parameter from the session, the webhook should explicitly set the parameter value to null in WebhookResponse. The map is keyed by parameters' display names.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The unique identifier of the session. This field can be used by the webhook to identify a session. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/` if environment is specified.
         */
        session?: string | null;
    }
    /**
     * A span represents a sub execution step of an action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Span {
        /**
         * Timestamp of the completion of the span.
         */
        completeTime?: string | null;
        /**
         * The unordered collection of metrics in this span.
         */
        metrics?: Schema$GoogleCloudDialogflowCxV3beta1NamedMetric[];
        /**
         * The name of the span.
         */
        name?: string | null;
        /**
         * Timestamp of the start of the span.
         */
        startTime?: string | null;
        /**
         * The metadata tags of the span such as span type.
         */
        tags?: string[] | null;
    }
    /**
     * Settings related to speech recognition.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SpeechToTextSettings {
        /**
         * Whether to use speech adaptation for speech recognition.
         */
        enableSpeechAdaptation?: boolean | null;
    }
    /**
     * The request message for Experiments.StartExperiment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1StartExperimentRequest {
    }
    /**
     * The status of the action.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Status {
        /**
         * Optional. The exception thrown during the execution of the action.
         */
        exception?: Schema$GoogleCloudDialogflowCxV3beta1ExceptionDetail;
    }
    /**
     * The request message for Experiments.StopExperiment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1StopExperimentRequest {
    }
    /**
     * The request to set the feedback for a bot answer.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SubmitAnswerFeedbackRequest {
        /**
         * Required. Feedback provided for a bot answer.
         */
        answerFeedback?: Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback;
        /**
         * Required. ID of the response to update its feedback. This is the same as DetectIntentResponse.response_id.
         */
        responseId?: string | null;
        /**
         * Optional. The mask to control which fields to update. If the mask is not present, all fields will be updated.
         */
        updateMask?: string | null;
    }
    /**
     * Configuration of how speech should be synthesized.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1SynthesizeSpeechConfig {
        /**
         * Optional. An identifier which selects 'audio effects' profiles that are applied on (post synthesized) text to speech. Effects are applied on top of each other in the order they are given.
         */
        effectsProfileId?: string[] | null;
        /**
         * Optional. Speaking pitch, in the range [-20.0, 20.0]. 20 means increase 20 semitones from the original pitch. -20 means decrease 20 semitones from the original pitch.
         */
        pitch?: number | null;
        /**
         * Optional. Speaking rate/speed, in the range [0.25, 4.0]. 1.0 is the normal native speed supported by the specific voice. 2.0 is twice as fast, and 0.5 is half as fast. If unset(0.0), defaults to the native 1.0 speed. Any other values < 0.25 or \> 4.0 will return an error.
         */
        speakingRate?: number | null;
        /**
         * Optional. The desired voice of the synthesized audio.
         */
        voice?: Schema$GoogleCloudDialogflowCxV3beta1VoiceSelectionParams;
        /**
         * Optional. Volume gain (in dB) of the normal native volume supported by the specific voice, in the range [-96.0, 16.0]. If unset, or set to a value of 0.0 (dB), will play at normal native signal amplitude. A value of -6.0 (dB) will play at approximately half the amplitude of the normal native signal amplitude. A value of +6.0 (dB) will play at approximately twice the amplitude of the normal native signal amplitude. We strongly recommend not to exceed +10 (dB) as there's usually no effective increase in loudness for any value greater than that.
         */
        volumeGainDb?: number | null;
    }
    /**
     * Represents a test case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestCase {
        /**
         * Output only. When the test was created.
         */
        creationTime?: string | null;
        /**
         * Required. The human-readable name of the test case, unique within the agent. Limit of 200 characters.
         */
        displayName?: string | null;
        /**
         * The latest test result.
         */
        lastTestResult?: Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult;
        /**
         * The unique identifier of the test case. TestCases.CreateTestCase will populate the name automatically. Otherwise use format: `projects//locations//agents//testCases/`.
         */
        name?: string | null;
        /**
         * Additional freeform notes about the test case. Limit of 400 characters.
         */
        notes?: string | null;
        /**
         * Tags are short descriptions that users may apply to test cases for organizational and filtering purposes. Each tag should start with "#" and has a limit of 30 characters.
         */
        tags?: string[] | null;
        /**
         * The conversation turns uttered when the test case was created, in chronological order. These include the canonical set of agent utterances that should occur when the agent is working properly.
         */
        testCaseConversationTurns?: Schema$GoogleCloudDialogflowCxV3beta1ConversationTurn[];
        /**
         * Config for the test case.
         */
        testConfig?: Schema$GoogleCloudDialogflowCxV3beta1TestConfig;
    }
    /**
     * Error info for importing a test.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestCaseError {
        /**
         * The status associated with the test case.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The test case.
         */
        testCase?: Schema$GoogleCloudDialogflowCxV3beta1TestCase;
    }
    /**
     * Represents a result from running a test case in an agent environment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult {
        /**
         * The conversation turns uttered during the test case replay in chronological order.
         */
        conversationTurns?: Schema$GoogleCloudDialogflowCxV3beta1ConversationTurn[];
        /**
         * Environment where the test was run. If not set, it indicates the draft environment.
         */
        environment?: string | null;
        /**
         * The resource name for the test case result. Format: `projects//locations//agents//testCases//results/`.
         */
        name?: string | null;
        /**
         * Whether the test case passed in the agent environment.
         */
        testResult?: string | null;
        /**
         * The time that the test was run.
         */
        testTime?: string | null;
    }
    /**
     * Represents configurations for a test case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestConfig {
        /**
         * Flow name to start the test case with. Format: `projects//locations//agents//flows/`. Only one of `flow` and `page` should be set to indicate the starting point of the test case. If neither is set, the test case will start with start page on the default start flow.
         */
        flow?: string | null;
        /**
         * The page to start the test case with. Format: `projects//locations//agents//flows//pages/`. Only one of `flow` and `page` should be set to indicate the starting point of the test case. If neither is set, the test case will start with start page on the default start flow.
         */
        page?: string | null;
        /**
         * Session parameters to be compared when calculating differences.
         */
        trackingParameters?: string[] | null;
    }
    /**
     * Error info for running a test.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestError {
        /**
         * The status associated with the test.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The test case resource name.
         */
        testCase?: string | null;
        /**
         * The timestamp when the test was completed.
         */
        testTime?: string | null;
    }
    /**
     * The description of differences between original and replayed agent output.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TestRunDifference {
        /**
         * A human readable description of the diff, showing the actual output vs expected output.
         */
        description?: string | null;
        /**
         * The type of diff.
         */
        type?: string | null;
    }
    /**
     * Represents the natural language text to be processed.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TextInput {
        /**
         * Required. The UTF-8 encoded natural language text to be processed.
         */
        text?: string | null;
    }
    /**
     * Settings related to speech synthesizing.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TextToSpeechSettings {
        /**
         * Configuration of how speech should be synthesized, mapping from language (https://cloud.google.com/dialogflow/cx/docs/reference/language) to SynthesizeSpeechConfig. These settings affect: - The [phone gateway](https://cloud.google.com/dialogflow/cx/docs/concept/integration/phone-gateway) synthesize configuration set via Agent.text_to_speech_settings. - How speech is synthesized when invoking session APIs. Agent.text_to_speech_settings only applies if OutputAudioConfig.synthesize_speech_config is not specified.
         */
        synthesizeSpeechConfigs?: {
            [key: string]: Schema$GoogleCloudDialogflowCxV3beta1SynthesizeSpeechConfig;
        } | null;
    }
    /**
     * A tool provides a list of actions which are available to the Playbook to attain its goal. A Tool consists of a description of the tool's usage and a specification of the tool which contains the schema and authentication information.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Tool {
        /**
         * Integration connectors tool specification.
         */
        connectorSpec?: Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorTool;
        /**
         * Data store search tool specification.
         */
        dataStoreSpec?: Schema$GoogleCloudDialogflowCxV3beta1ToolDataStoreTool;
        /**
         * Required. High level description of the Tool and its usage.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the Tool, unique within an agent.
         */
        displayName?: string | null;
        /**
         * Vertex extension tool specification.
         */
        extensionSpec?: Schema$GoogleCloudDialogflowCxV3beta1ToolExtensionTool;
        /**
         * Client side executed function specification.
         */
        functionSpec?: Schema$GoogleCloudDialogflowCxV3beta1ToolFunctionTool;
        /**
         * The unique identifier of the Tool. Format: `projects//locations//agents//tools/`.
         */
        name?: string | null;
        /**
         * OpenAPI specification of the Tool.
         */
        openApiSpec?: Schema$GoogleCloudDialogflowCxV3beta1ToolOpenApiTool;
        /**
         * Output only. The tool type.
         */
        toolType?: string | null;
    }
    /**
     * Authentication information required for API calls
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolAuthentication {
        /**
         * Config for API key auth.
         */
        apiKeyConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationApiKeyConfig;
        /**
         * Config for bearer token auth.
         */
        bearerTokenConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationBearerTokenConfig;
        /**
         * Config for OAuth.
         */
        oauthConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationOAuthConfig;
        /**
         * Config for [Diglogflow service agent](https://cloud.google.com/iam/docs/service-agents#dialogflow-service-agent) auth.
         */
        serviceAgentAuthConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationServiceAgentAuthConfig;
    }
    /**
     * Config for authentication with API key.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationApiKeyConfig {
        /**
         * Optional. The API key. If the `secret_version_for_api_key` field is set, this field will be ignored.
         */
        apiKey?: string | null;
        /**
         * Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.
         */
        keyName?: string | null;
        /**
         * Required. Key location in the request.
         */
        requestLocation?: string | null;
        /**
         * Optional. The name of the SecretManager secret version resource storing the API key. If this field is set, the `api_key` field will be ignored. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForApiKey?: string | null;
    }
    /**
     * Config for authentication using bearer token.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationBearerTokenConfig {
        /**
         * Optional. The name of the SecretManager secret version resource storing the Bearer token. If this field is set, the `token` field will be ignored. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForToken?: string | null;
        /**
         * Optional. The text token appended to the text `Bearer` to the request Authorization header. [Session parameters reference](https://cloud.google.com/dialogflow/cx/docs/concept/parameter#session-ref) can be used to pass the token dynamically, e.g. `$session.params.parameter-id`.
         */
        token?: string | null;
    }
    /**
     * Config for authentication with OAuth.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationOAuthConfig {
        /**
         * Required. The client ID from the OAuth provider.
         */
        clientId?: string | null;
        /**
         * Optional. The client secret from the OAuth provider. If the `secret_version_for_client_secret` field is set, this field will be ignored.
         */
        clientSecret?: string | null;
        /**
         * Required. OAuth grant types.
         */
        oauthGrantType?: string | null;
        /**
         * Optional. The OAuth scopes to grant.
         */
        scopes?: string[] | null;
        /**
         * Optional. The name of the SecretManager secret version resource storing the client secret. If this field is set, the `client_secret` field will be ignored. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForClientSecret?: string | null;
        /**
         * Required. The token endpoint in the OAuth provider to exchange for an access token.
         */
        tokenEndpoint?: string | null;
    }
    /**
     * Config for auth using [Diglogflow service agent](https://cloud.google.com/iam/docs/service-agents#dialogflow-service-agent).
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolAuthenticationServiceAgentAuthConfig {
        /**
         * Optional. Indicate the auth token type generated from the [Diglogflow service agent](https://cloud.google.com/iam/docs/service-agents#dialogflow-service-agent). The generated token is sent in the Authorization header.
         */
        serviceAgentAuth?: string | null;
    }
    /**
     * Represents a call of a specific tool's action with the specified inputs.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolCall {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Optional. The action's input parameters.
         */
        inputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
    }
    /**
     * The result of calling a tool's action that has been executed by the client.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolCallResult {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * The tool call's error.
         */
        error?: Schema$GoogleCloudDialogflowCxV3beta1ToolCallResultError;
        /**
         * The tool call's output parameters.
         */
        outputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
    }
    /**
     * An error produced by the tool call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolCallResultError {
        /**
         * Optional. The error message of the function.
         */
        message?: string | null;
    }
    /**
     * A ConnectorTool enabling using Integration Connectors Connections as tools.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorTool {
        /**
         * Required. Actions for the tool to use.
         */
        actions?: Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorToolAction[];
        /**
         * Optional. Integration Connectors end-user authentication configuration. If configured, the end-user authentication fields will be passed in the Integration Connectors API request and override the admin, default authentication configured for the Connection. **Note**: The Connection must have authentication override enabled in order to specify an EUC configuration here - otherwise, the ConnectorTool creation will fail. See: https://cloud.google.com/application-integration/docs/configure-connectors-task#configure-authentication-override
         */
        endUserAuthConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfig;
        /**
         * Required. The full resource name of the referenced Integration Connectors Connection. Format: `projects/x/locations/x/connections/x`
         */
        name?: string | null;
    }
    /**
     * Configuration of a Connection operation for the tool to use.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorToolAction {
        /**
         * ID of a Connection action for the tool to use.
         */
        connectionActionId?: string | null;
        /**
         * Entity operation configuration for the tool to use.
         */
        entityOperation?: Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorToolActionEntityOperation;
        /**
         * Optional. Entity fields to use as inputs for the operation. If no fields are specified, all fields of the Entity will be used.
         */
        inputFields?: string[] | null;
        /**
         * Optional. Entity fields to return from the operation. If no fields are specified, all fields of the Entity will be returned.
         */
        outputFields?: string[] | null;
    }
    /**
     * Entity CRUD operation specification.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolConnectorToolActionEntityOperation {
        /**
         * Required. ID of the entity.
         */
        entityId?: string | null;
        /**
         * Required. Operation to perform on the entity.
         */
        operation?: string | null;
    }
    /**
     * A DataStoreTool is a way to provide specifications needed to search a list of data stores.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolDataStoreTool {
        /**
         * Required. List of data stores to search.
         */
        dataStoreConnections?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnection[];
        /**
         * Required. Fallback prompt configurations to use.
         */
        fallbackPrompt?: Schema$GoogleCloudDialogflowCxV3beta1ToolDataStoreToolFallbackPrompt;
    }
    /**
     * A FallbackPrompt is a way to provide specifications for the Data Store fallback prompt when generating responses.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolDataStoreToolFallbackPrompt {
    }
    /**
     * End-user authentication configuration used for Connection calls. The field values can either be hardcoded authentication values or the names of [session parameters](https://cloud.google.com/dialogflow/cx/docs/concept/parameter#session-ref) or [request parameters](https://cloud.google.com/dialogflow/cx/docs/concept/parameter#request-scoped). If parameter names are provided, then those parameters can be used to pass the authentication values dynamically, through `$session.params.param-id` or `$request.payload.param-id`.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfig {
        /**
         * Oauth 2.0 Authorization Code authentication.
         */
        oauth2AuthCodeConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfigOauth2AuthCodeConfig;
        /**
         * JWT Profile Oauth 2.0 Authorization Grant authentication.
         */
        oauth2JwtBearerConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfigOauth2JwtBearerConfig;
    }
    /**
     * Oauth 2.0 Authorization Code authentication configuration.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfigOauth2AuthCodeConfig {
        /**
         * Required. Oauth token value or parameter name to pass it through.
         */
        oauthToken?: string | null;
    }
    /**
     * JWT Profile Oauth 2.0 Authorization Grant authentication configuration.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolEndUserAuthConfigOauth2JwtBearerConfig {
        /**
         * Required. Client key value or parameter name to pass it through.
         */
        clientKey?: string | null;
        /**
         * Required. Issuer value or parameter name to pass it through.
         */
        issuer?: string | null;
        /**
         * Required. Subject value or parameter name to pass it through.
         */
        subject?: string | null;
    }
    /**
     * An ExtensionTool is a way to use Vertex Extensions as a tool.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolExtensionTool {
        /**
         * Required. The full name of the referenced vertex extension. Formats: `projects/{project\}/locations/{location\}/extensions/{extension\}`
         */
        name?: string | null;
    }
    /**
     * A Function tool describes the functions to be invoked on the client side.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolFunctionTool {
        /**
         * Optional. The JSON schema is encapsulated in a google.protobuf.Struct to describe the input of the function. This input is a JSON object that contains the function's parameters as properties of the object.
         */
        inputSchema?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. The JSON schema is encapsulated in a google.protobuf.Struct to describe the output of the function. This output is a JSON object that contains the function's parameters as properties of the object.
         */
        outputSchema?: {
            [key: string]: any;
        } | null;
    }
    /**
     * An OpenAPI tool is a way to provide the Tool specifications in the Open API schema format.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolOpenApiTool {
        /**
         * Optional. Authentication information required by the API.
         */
        authentication?: Schema$GoogleCloudDialogflowCxV3beta1ToolAuthentication;
        /**
         * Optional. Service Directory configuration.
         */
        serviceDirectoryConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolServiceDirectoryConfig;
        /**
         * Required. The OpenAPI schema specified as a text.
         */
        textSchema?: string | null;
        /**
         * Optional. TLS configuration for the HTTPS verification.
         */
        tlsConfig?: Schema$GoogleCloudDialogflowCxV3beta1ToolTLSConfig;
    }
    /**
     * Configuration for tools using Service Directory.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolServiceDirectoryConfig {
        /**
         * Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects//locations//namespaces//services/`. `LocationID` of the service directory must be the same as the location of the agent.
         */
        service?: string | null;
    }
    /**
     * The TLS configuration.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolTLSConfig {
        /**
         * Required. Specifies a list of allowed custom CA certificates for HTTPS verification.
         */
        caCerts?: Schema$GoogleCloudDialogflowCxV3beta1ToolTLSConfigCACert[];
    }
    /**
     * The CA certificate.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolTLSConfigCACert {
        /**
         * Required. The allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, Dialogflow will use Google's default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command: ``` openssl x509 -req -days 200 -in example.com.csr \ -signkey example.com.key \ -out example.com.crt \ -extfile <(printf "\nsubjectAltName='DNS:www.example.com'") ```
         */
        cert?: string | null;
        /**
         * Required. The name of the allowed custom CA certificates. This can be used to disambiguate the custom CA certificates.
         */
        displayName?: string | null;
    }
    /**
     * Stores metadata of the invocation of an action supported by a tool.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolUse {
        /**
         * Optional. Name of the action to be called during the tool use.
         */
        action?: string | null;
        /**
         * Optional. Data store tool trace.
         */
        dataStoreToolTrace?: Schema$GoogleCloudDialogflowCxV3beta1ToolUseDataStoreToolTrace;
        /**
         * Output only. The display name of the tool.
         */
        displayName?: string | null;
        /**
         * Optional. A list of input parameters for the action.
         */
        inputActionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. A list of output parameters generated by the action.
         */
        outputActionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool that should be used. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
        /**
         * Optional. Webhook tool trace.
         */
        webhookToolTrace?: Schema$GoogleCloudDialogflowCxV3beta1ToolUseWebhookToolTrace;
    }
    /**
     * The tracing information for the data store tool.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolUseDataStoreToolTrace {
        /**
         * Optional. Data store connection feature output signals.
         */
        dataStoreConnectionSignals?: Schema$GoogleCloudDialogflowCxV3beta1DataStoreConnectionSignals;
    }
    /**
     * The tracing information for the webhook tool.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolUseWebhookToolTrace {
        /**
         * Optional. The tag of the webhook.
         */
        webhookTag?: string | null;
        /**
         * Optional. The url of the webhook.
         */
        webhookUri?: string | null;
    }
    /**
     * Tool version is a snapshot of the tool at certain timestamp.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ToolVersion {
        /**
         * Output only. Last time the tool version was created or modified.
         */
        createTime?: string | null;
        /**
         * Required. The display name of the tool version.
         */
        displayName?: string | null;
        /**
         * Identifier. The unique identifier of the tool version. Format: `projects//locations//agents//tools//versions/`.
         */
        name?: string | null;
        /**
         * Required. Snapshot of the tool to be associated with this version.
         */
        tool?: Schema$GoogleCloudDialogflowCxV3beta1Tool;
        /**
         * Output only. Last time the tool version was created or modified.
         */
        updateTime?: string | null;
    }
    /**
     * The request message for Flows.TrainFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TrainFlowRequest {
    }
    /**
     * Transition coverage represents the percentage of all possible page transitions (page-level transition routes and event handlers, excluding transition route groups) present within any of a parent's test cases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverage {
        /**
         * The percent of transitions in the agent that are covered.
         */
        coverageScore?: number | null;
        /**
         * The list of Transitions present in the agent.
         */
        transitions?: Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverageTransition[];
    }
    /**
     * A transition in a page.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverageTransition {
        /**
         * Whether the transition is covered by at least one of the agent's test cases.
         */
        covered?: boolean | null;
        /**
         * Event handler.
         */
        eventHandler?: Schema$GoogleCloudDialogflowCxV3beta1EventHandler;
        /**
         * The index of a transition in the transition list. Starting from 0.
         */
        index?: number | null;
        /**
         * The start node of a transition.
         */
        source?: Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverageTransitionNode;
        /**
         * The end node of a transition.
         */
        target?: Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverageTransitionNode;
        /**
         * Intent route or condition route.
         */
        transitionRoute?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute;
    }
    /**
     * The source or target of a transition.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionCoverageTransitionNode {
        /**
         * Indicates a transition to a Flow. Only some fields such as name and displayname will be set.
         */
        flow?: Schema$GoogleCloudDialogflowCxV3beta1Flow;
        /**
         * Indicates a transition to a Page. Only some fields such as name and displayname will be set.
         */
        page?: Schema$GoogleCloudDialogflowCxV3beta1Page;
    }
    /**
     * A transition route specifies a intent that can be matched and/or a data condition that can be evaluated during a session. When a specified transition is matched, the following actions are taken in order: * If there is a `trigger_fulfillment` associated with the transition, it will be called. * If there is a `target_page` associated with the transition, the session will transition into the specified page. * If there is a `target_flow` associated with the transition, the session will transition into the specified flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute {
        /**
         * The condition to evaluate against form parameters or session parameters. See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition). At least one of `intent` or `condition` must be specified. When both `intent` and `condition` are specified, the transition can only happen when both are fulfilled.
         */
        condition?: string | null;
        /**
         * Optional. The description of the transition route. The maximum length is 500 characters.
         */
        description?: string | null;
        /**
         * The unique identifier of an Intent. Format: `projects//locations//agents//intents/`. Indicates that the transition can only happen when the given intent is matched. At least one of `intent` or `condition` must be specified. When both `intent` and `condition` are specified, the transition can only happen when both are fulfilled.
         */
        intent?: string | null;
        /**
         * Output only. The unique identifier of this transition route.
         */
        name?: string | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The fulfillment to call when the condition is satisfied. At least one of `trigger_fulfillment` and `target` must be specified. When both are defined, `trigger_fulfillment` is executed first.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3beta1Fulfillment;
    }
    /**
     * A TransitionRouteGroup represents a group of `TransitionRoutes` to be used by a Page.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup {
        /**
         * Required. The human-readable name of the transition route group, unique within the flow. The display name can be no longer than 30 characters.
         */
        displayName?: string | null;
        /**
         * The unique identifier of the transition route group. TransitionRouteGroups.CreateTransitionRouteGroup populates the name automatically. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        name?: string | null;
        /**
         * Transition routes associated with the TransitionRouteGroup.
         */
        transitionRoutes?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute[];
    }
    /**
     * Transition route group coverage represents the percentage of all possible transition routes present within any of a parent's test cases. The results are grouped by the transition route group.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverage {
        /**
         * Transition route group coverages.
         */
        coverages?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverageCoverage[];
        /**
         * The percent of transition routes in all the transition route groups that are covered.
         */
        coverageScore?: number | null;
    }
    /**
     * Coverage result message for one transition route group.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverageCoverage {
        /**
         * The percent of transition routes in the transition route group that are covered.
         */
        coverageScore?: number | null;
        /**
         * Transition route group metadata. Only name and displayName will be set.
         */
        routeGroup?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup;
        /**
         * The list of transition routes and coverage in the transition route group.
         */
        transitions?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverageCoverageTransition[];
    }
    /**
     * A transition coverage in a transition route group.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroupCoverageCoverageTransition {
        /**
         * Whether the transition route is covered by at least one of the agent's test cases.
         */
        covered?: boolean | null;
        /**
         * Intent route or condition route.
         */
        transitionRoute?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRoute;
    }
    /**
     * Collection of all signals that were extracted for a single turn of the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TurnSignals {
        /**
         * Whether agent responded with LiveAgentHandoff fulfillment.
         */
        agentEscalated?: boolean | null;
        /**
         * Whether user was using DTMF input.
         */
        dtmfUsed?: boolean | null;
        /**
         * Failure reasons of the turn.
         */
        failureReasons?: string[] | null;
        /**
         * Whether NLU predicted NO_MATCH.
         */
        noMatch?: boolean | null;
        /**
         * Whether user provided no input.
         */
        noUserInput?: boolean | null;
        /**
         * Whether turn resulted in End Session page.
         */
        reachedEndPage?: boolean | null;
        /**
         * Sentiment magnitude of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentMagnitude?: number | null;
        /**
         * Sentiment score of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentScore?: number | null;
        /**
         * Whether user was specifically asking for a live agent.
         */
        userEscalated?: boolean | null;
        /**
         * Human-readable statuses of the webhooks triggered during this turn.
         */
        webhookStatuses?: string[] | null;
    }
    /**
     * Encapsulates different type schema variations: either a reference to an a schema that's already defined by a tool, or an inline definition.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TypeSchema {
        /**
         * Set if this is an inline schema definition.
         */
        inlineSchema?: Schema$GoogleCloudDialogflowCxV3beta1InlineSchema;
        /**
         * Set if this is a schema reference.
         */
        schemaReference?: Schema$GoogleCloudDialogflowCxV3beta1TypeSchemaSchemaReference;
    }
    /**
     * A reference to the schema of an existing tool.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1TypeSchemaSchemaReference {
        /**
         * The name of the schema.
         */
        schema?: string | null;
        /**
         * The tool that contains this schema definition. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
    }
    /**
     * UserUtterance represents one message sent by the customer.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1UserUtterance {
        /**
         * Optional. Audio input.
         */
        audio?: string | null;
        /**
         * Optional. Tokens of the audio input.
         */
        audioTokens?: number[] | null;
        /**
         * Required. Message content in text.
         */
        text?: string | null;
    }
    /**
     * The request message for Agents.ValidateAgent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ValidateAgentRequest {
        /**
         * If not specified, the agent's default language is used.
         */
        languageCode?: string | null;
    }
    /**
     * The request message for Flows.ValidateFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ValidateFlowRequest {
        /**
         * If not specified, the agent's default language is used.
         */
        languageCode?: string | null;
    }
    /**
     * Agent/flow validation message.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1ValidationMessage {
        /**
         * The message detail.
         */
        detail?: string | null;
        /**
         * The resource names of the resources where the message is found.
         */
        resourceNames?: Schema$GoogleCloudDialogflowCxV3beta1ResourceName[];
        /**
         * The names of the resources where the message is found.
         */
        resources?: string[] | null;
        /**
         * The type of the resources where the message is found.
         */
        resourceType?: string | null;
        /**
         * Indicates the severity of the message.
         */
        severity?: string | null;
    }
    /**
     * The history of variants update.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1VariantsHistory {
        /**
         * Update time of the variants.
         */
        updateTime?: string | null;
        /**
         * The flow versions as the variants.
         */
        versionVariants?: Schema$GoogleCloudDialogflowCxV3beta1VersionVariants;
    }
    /**
     * Represents a version of a flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Version {
        /**
         * Output only. Create time of the version.
         */
        createTime?: string | null;
        /**
         * The description of the version. The maximum length is 500 characters. If exceeded, the request is rejected.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the version. Limit of 64 characters.
         */
        displayName?: string | null;
        /**
         * Format: projects//locations//agents//flows//versions/. Version ID is a self-increasing number generated by Dialogflow upon version creation.
         */
        name?: string | null;
        /**
         * Output only. The NLU settings of the flow at version creation.
         */
        nluSettings?: Schema$GoogleCloudDialogflowCxV3beta1NluSettings;
        /**
         * Output only. The state of this version. This field is read-only and cannot be set by create and update methods.
         */
        state?: string | null;
    }
    /**
     * A list of flow version variants.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1VersionVariants {
        /**
         * A list of flow version variants.
         */
        variants?: Schema$GoogleCloudDialogflowCxV3beta1VersionVariantsVariant[];
    }
    /**
     * A single flow version with specified traffic allocation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1VersionVariantsVariant {
        /**
         * Whether the variant is for the control group.
         */
        isControlGroup?: boolean | null;
        /**
         * Percentage of the traffic which should be routed to this version of flow. Traffic allocation for a single flow must sum up to 1.0.
         */
        trafficAllocation?: number | null;
        /**
         * The name of the flow version. Format: `projects//locations//agents//flows//versions/`.
         */
        version?: string | null;
    }
    /**
     * Description of which voice to use for speech synthesis.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1VoiceSelectionParams {
        /**
         * Optional. The name of the voice. If not set, the service will choose a voice based on the other parameters such as language_code and ssml_gender. For the list of available voices, please refer to [Supported voices and languages](https://cloud.google.com/text-to-speech/docs/voices).
         */
        name?: string | null;
        /**
         * Optional. The preferred gender of the voice. If not set, the service will choose a voice based on the other parameters such as language_code and name. Note that this is only a preference, not requirement. If a voice of the appropriate gender is not available, the synthesizer should substitute a voice with a different gender rather than failing the request.
         */
        ssmlGender?: string | null;
    }
    /**
     * Webhooks host the developer's business logic. During a session, webhooks allow the developer to use the data extracted by Dialogflow's natural language processing to generate dynamic responses, validate collected data, or trigger actions on the backend.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1Webhook {
        /**
         * Indicates whether the webhook is disabled.
         */
        disabled?: boolean | null;
        /**
         * Required. The human-readable name of the webhook, unique within the agent.
         */
        displayName?: string | null;
        /**
         * Configuration for a generic web service.
         */
        genericWebService?: Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebService;
        /**
         * The unique identifier of the webhook. Required for the Webhooks.UpdateWebhook method. Webhooks.CreateWebhook populates the name automatically. Format: `projects//locations//agents//webhooks/`.
         */
        name?: string | null;
        /**
         * Configuration for a [Service Directory](https://cloud.google.com/service-directory) service.
         */
        serviceDirectory?: Schema$GoogleCloudDialogflowCxV3beta1WebhookServiceDirectoryConfig;
        /**
         * Webhook execution timeout. Execution is considered failed if Dialogflow doesn't receive a response from webhook at the end of the timeout period. Defaults to 5 seconds, maximum allowed timeout is 30 seconds.
         */
        timeout?: string | null;
    }
    /**
     * Represents configuration for a generic web service.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebService {
        /**
         * Optional. Specifies a list of allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, Dialogflow will use Google's default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command, ``` openssl x509 -req -days 200 -in example.com.csr \ -signkey example.com.key \ -out example.com.crt \ -extfile <(printf "\nsubjectAltName='DNS:www.example.com'") ```
         */
        allowedCaCerts?: string[] | null;
        /**
         * Optional. HTTP method for the flexible webhook calls. Standard webhook always uses POST.
         */
        httpMethod?: string | null;
        /**
         * Optional. The OAuth configuration of the webhook. If specified, Dialogflow will initiate the OAuth client credential flow to exchange an access token from the 3rd party platform and put it in the auth header.
         */
        oauthConfig?: Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebServiceOAuthConfig;
        /**
         * Optional. Maps the values extracted from specific fields of the flexible webhook response into session parameters. - Key: session parameter name - Value: field path in the webhook response
         */
        parameterMapping?: {
            [key: string]: string;
        } | null;
        /**
         * The password for HTTP Basic authentication.
         */
        password?: string | null;
        /**
         * Optional. Defines a custom JSON object as request body to send to flexible webhook.
         */
        requestBody?: string | null;
        /**
         * The HTTP request headers to send together with webhook requests.
         */
        requestHeaders?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The SecretManager secret version resource storing the username:password pair for HTTP Basic authentication. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForUsernamePassword?: string | null;
        /**
         * Optional. The HTTP request headers to send together with webhook requests. Header values are stored in SecretManager secret versions. When the same header name is specified in both `request_headers` and `secret_versions_for_request_headers`, the value in `secret_versions_for_request_headers` will be used.
         */
        secretVersionsForRequestHeaders?: {
            [key: string]: Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebServiceSecretVersionHeaderValue;
        } | null;
        /**
         * Optional. Indicate the auth token type generated from the [Diglogflow service agent](https://cloud.google.com/iam/docs/service-agents#dialogflow-service-agent). The generated token is sent in the Authorization header.
         */
        serviceAgentAuth?: string | null;
        /**
         * Required. The webhook URI for receiving POST requests. It must use https protocol.
         */
        uri?: string | null;
        /**
         * The user name for HTTP Basic authentication.
         */
        username?: string | null;
        /**
         * Optional. Type of the webhook.
         */
        webhookType?: string | null;
    }
    /**
     * Represents configuration of OAuth client credential flow for 3rd party API authentication.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebServiceOAuthConfig {
        /**
         * Required. The client ID provided by the 3rd party platform.
         */
        clientId?: string | null;
        /**
         * Optional. The client secret provided by the 3rd party platform.
         */
        clientSecret?: string | null;
        /**
         * Optional. The OAuth scopes to grant.
         */
        scopes?: string[] | null;
        /**
         * Optional. The name of the SecretManager secret version resource storing the client secret. If this field is set, the `client_secret` field will be ignored. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForClientSecret?: string | null;
        /**
         * Required. The token endpoint provided by the 3rd party platform to exchange an access token.
         */
        tokenEndpoint?: string | null;
    }
    /**
     * Represents the value of an HTTP header stored in a SecretManager secret version.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebServiceSecretVersionHeaderValue {
        /**
         * Required. The SecretManager secret version resource storing the header value. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersion?: string | null;
    }
    /**
     * The request message for a webhook call. The request is sent as a JSON object and the field names will be presented in camel cases. You may see undocumented fields in an actual request. These fields are used internally by Dialogflow and should be ignored.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookRequest {
        /**
         * Always present. The unique identifier of the DetectIntentResponse that will be returned to the API caller.
         */
        detectIntentResponseId?: string | null;
        /**
         * If DTMF was provided as input, this field will contain the DTMF digits.
         */
        dtmfDigits?: string | null;
        /**
         * Always present. Information about the fulfillment that triggered this webhook call.
         */
        fulfillmentInfo?: Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestFulfillmentInfo;
        /**
         * Information about the last matched intent.
         */
        intentInfo?: Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestIntentInfo;
        /**
         * The language code specified in the original request.
         */
        languageCode?: string | null;
        /**
         * Information about the language of the request.
         */
        languageInfo?: Schema$GoogleCloudDialogflowCxV3beta1LanguageInfo;
        /**
         * The list of rich message responses to present to the user. Webhook can choose to append or replace this list in WebhookResponse.fulfillment_response;
         */
        messages?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage[];
        /**
         * Information about page status.
         */
        pageInfo?: Schema$GoogleCloudDialogflowCxV3beta1PageInfo;
        /**
         * Custom data set in QueryParameters.payload.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * The sentiment analysis result of the current user request. The field is filled when sentiment analysis is configured to be enabled for the request.
         */
        sentimentAnalysisResult?: Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestSentimentAnalysisResult;
        /**
         * Information about session status.
         */
        sessionInfo?: Schema$GoogleCloudDialogflowCxV3beta1SessionInfo;
        /**
         * If natural language text was provided as input, this field will contain a copy of the text.
         */
        text?: string | null;
        /**
         * If natural language speech audio was provided as input, this field will contain the transcript for the audio.
         */
        transcript?: string | null;
        /**
         * If an event was provided as input, this field will contain the name of the event.
         */
        triggerEvent?: string | null;
        /**
         * If an intent was provided as input, this field will contain a copy of the intent identifier. Format: `projects//locations//agents//intents/`.
         */
        triggerIntent?: string | null;
    }
    /**
     * Represents fulfillment information communicated to the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestFulfillmentInfo {
        /**
         * Always present. The value of the Fulfillment.tag field will be populated in this field by Dialogflow when the associated webhook is called. The tag is typically used by the webhook service to identify which fulfillment is being called, but it could be used for other purposes.
         */
        tag?: string | null;
    }
    /**
     * Represents intent information communicated to the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestIntentInfo {
        /**
         * The confidence of the matched intent. Values range from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * Always present. The display name of the last matched intent.
         */
        displayName?: string | null;
        /**
         * Always present. The unique identifier of the last matched intent. Format: `projects//locations//agents//intents/`.
         */
        lastMatchedIntent?: string | null;
        /**
         * Parameters identified as a result of intent matching. This is a map of the name of the identified parameter to the value of the parameter identified from the user's utterance. All parameters defined in the matched intent that are identified will be surfaced here.
         */
        parameters?: {
            [key: string]: Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestIntentInfoIntentParameterValue;
        } | null;
    }
    /**
     * Represents a value for an intent parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestIntentInfoIntentParameterValue {
        /**
         * Always present. Original text value extracted from user utterance.
         */
        originalValue?: string | null;
        /**
         * Always present. Structured value for the parameter extracted from user utterance.
         */
        resolvedValue?: any | null;
    }
    /**
     * Represents the result of sentiment analysis.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookRequestSentimentAnalysisResult {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment, regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
    }
    /**
     * The response message for a webhook call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookResponse {
        /**
         * The fulfillment response to send to the user. This field can be omitted by the webhook if it does not intend to send any response to the user.
         */
        fulfillmentResponse?: Schema$GoogleCloudDialogflowCxV3beta1WebhookResponseFulfillmentResponse;
        /**
         * Information about page status. This field can be omitted by the webhook if it does not intend to modify page status.
         */
        pageInfo?: Schema$GoogleCloudDialogflowCxV3beta1PageInfo;
        /**
         * Value to append directly to QueryResult.webhook_payloads.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Information about session status. This field can be omitted by the webhook if it does not intend to modify session status.
         */
        sessionInfo?: Schema$GoogleCloudDialogflowCxV3beta1SessionInfo;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
    }
    /**
     * Represents a fulfillment response to the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookResponseFulfillmentResponse {
        /**
         * Merge behavior for `messages`.
         */
        mergeBehavior?: string | null;
        /**
         * The list of rich message responses to present to the user.
         */
        messages?: Schema$GoogleCloudDialogflowCxV3beta1ResponseMessage[];
    }
    /**
     * Represents configuration for a [Service Directory](https://cloud.google.com/service-directory) service.
     */
    export interface Schema$GoogleCloudDialogflowCxV3beta1WebhookServiceDirectoryConfig {
        /**
         * Generic Service configuration of this webhook.
         */
        genericWebService?: Schema$GoogleCloudDialogflowCxV3beta1WebhookGenericWebService;
        /**
         * Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects//locations//namespaces//services/`. `Location ID` of the service directory must be the same as the location of the agent.
         */
        service?: string | null;
    }
    /**
     * Represents a result from running a test case in an agent environment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ContinuousTestResult {
        /**
         * The resource name for the continuous test result. Format: `projects//locations//agents//environments//continuousTestResults/`.
         */
        name?: string | null;
        /**
         * The result of this continuous test run, i.e. whether all the tests in this continuous test run pass or not.
         */
        result?: string | null;
        /**
         * Time when the continuous testing run starts.
         */
        runTime?: string | null;
        /**
         * A list of individual test case results names in this continuous test run.
         */
        testCaseResults?: string[] | null;
    }
    /**
     * This message is used to hold all the Conversation Signals data, which will be converted to JSON and exported to BigQuery.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ConversationSignals {
        /**
         * Required. Turn signals for the current turn.
         */
        turnSignals?: Schema$GoogleCloudDialogflowCxV3TurnSignals;
    }
    /**
     * One interaction between a human and virtual agent. The human provides some input and the virtual agent provides a response.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ConversationTurn {
        /**
         * The user input.
         */
        userInput?: Schema$GoogleCloudDialogflowCxV3ConversationTurnUserInput;
        /**
         * The virtual agent output.
         */
        virtualAgentOutput?: Schema$GoogleCloudDialogflowCxV3ConversationTurnVirtualAgentOutput;
    }
    /**
     * The input from the human user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ConversationTurnUserInput {
        /**
         * Whether sentiment analysis is enabled.
         */
        enableSentimentAnalysis?: boolean | null;
        /**
         * Parameters that need to be injected into the conversation during intent detection.
         */
        injectedParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Supports text input, event input, dtmf input in the test case.
         */
        input?: Schema$GoogleCloudDialogflowCxV3QueryInput;
        /**
         * If webhooks should be allowed to trigger in response to the user utterance. Often if parameters are injected, webhooks should not be enabled.
         */
        isWebhookEnabled?: boolean | null;
    }
    /**
     * The output from the virtual agent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ConversationTurnVirtualAgentOutput {
        /**
         * The Page on which the utterance was spoken. Only name and displayName will be set.
         */
        currentPage?: Schema$GoogleCloudDialogflowCxV3Page;
        /**
         * Required. Input only. The diagnostic info output for the turn. Required to calculate the testing coverage.
         */
        diagnosticInfo?: {
            [key: string]: any;
        } | null;
        /**
         * Output only. If this is part of a result conversation turn, the list of differences between the original run and the replay for this output, if any.
         */
        differences?: Schema$GoogleCloudDialogflowCxV3TestRunDifference[];
        /**
         * The session parameters available to the bot at this point.
         */
        sessionParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Response error from the agent in the test result. If set, other output is empty.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The text responses from the agent for the turn.
         */
        textResponses?: Schema$GoogleCloudDialogflowCxV3ResponseMessageText[];
        /**
         * The Intent that triggered the response. Only name and displayName will be set.
         */
        triggeredIntent?: Schema$GoogleCloudDialogflowCxV3Intent;
    }
    /**
     * Metadata associated with the long running operation for Versions.CreateVersion.
     */
    export interface Schema$GoogleCloudDialogflowCxV3CreateVersionOperationMetadata {
        /**
         * Name of the created version. Format: `projects//locations//agents//flows//versions/`.
         */
        version?: string | null;
    }
    /**
     * A data store connection. It represents a data store in Discovery Engine and the type of the contents it contains.
     */
    export interface Schema$GoogleCloudDialogflowCxV3DataStoreConnection {
        /**
         * The full name of the referenced data store. Formats: `projects/{project\}/locations/{location\}/collections/{collection\}/dataStores/{data_store\}` `projects/{project\}/locations/{location\}/dataStores/{data_store\}`
         */
        dataStore?: string | null;
        /**
         * The type of the connected data store.
         */
        dataStoreType?: string | null;
        /**
         * The document processing mode for the data store connection. Should only be set for PUBLIC_WEB and UNSTRUCTURED data stores. If not set it is considered as DOCUMENTS, as this is the legacy mode.
         */
        documentProcessingMode?: string | null;
    }
    /**
     * Metadata returned for the Environments.DeployFlow long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3DeployFlowMetadata {
        /**
         * Errors of running deployment tests.
         */
        testErrors?: Schema$GoogleCloudDialogflowCxV3TestError[];
    }
    /**
     * The response message for Environments.DeployFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3DeployFlowResponse {
        /**
         * The name of the flow version Deployment. Format: `projects//locations//agents//environments//deployments/`.
         */
        deployment?: string | null;
        /**
         * The updated environment where the flow is deployed.
         */
        environment?: Schema$GoogleCloudDialogflowCxV3Environment;
    }
    /**
     * Represents the input for dtmf event.
     */
    export interface Schema$GoogleCloudDialogflowCxV3DtmfInput {
        /**
         * The dtmf digits.
         */
        digits?: string | null;
        /**
         * The finish digit (if any).
         */
        finishDigit?: string | null;
    }
    /**
     * Represents an environment for an agent. You can create multiple versions of your agent and publish them to separate environments. When you edit an agent, you are editing the draft agent. At any point, you can save the draft agent as an agent version, which is an immutable snapshot of your agent. When you save the draft agent, it is published to the default environment. When you create agent versions, you can publish them to custom environments. You can create a variety of custom environments for testing, development, production, etc.
     */
    export interface Schema$GoogleCloudDialogflowCxV3Environment {
        /**
         * The human-readable description of the environment. The maximum length is 500 characters. If exceeded, the request is rejected.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the environment (unique in an agent). Limit of 64 characters.
         */
        displayName?: string | null;
        /**
         * The name of the environment. Format: `projects//locations//agents//environments/`.
         */
        name?: string | null;
        /**
         * The test cases config for continuous tests of this environment.
         */
        testCasesConfig?: Schema$GoogleCloudDialogflowCxV3EnvironmentTestCasesConfig;
        /**
         * Output only. Update time of this environment.
         */
        updateTime?: string | null;
        /**
         * A list of configurations for flow versions. You should include version configs for all flows that are reachable from `Start Flow` in the agent. Otherwise, an error will be returned.
         */
        versionConfigs?: Schema$GoogleCloudDialogflowCxV3EnvironmentVersionConfig[];
        /**
         * The webhook configuration for this environment.
         */
        webhookConfig?: Schema$GoogleCloudDialogflowCxV3EnvironmentWebhookConfig;
    }
    /**
     * The configuration for continuous tests.
     */
    export interface Schema$GoogleCloudDialogflowCxV3EnvironmentTestCasesConfig {
        /**
         * Whether to run test cases in TestCasesConfig.test_cases periodically. Default false. If set to true, run once a day.
         */
        enableContinuousRun?: boolean | null;
        /**
         * Whether to run test cases in TestCasesConfig.test_cases before deploying a flow version to the environment. Default false.
         */
        enablePredeploymentRun?: boolean | null;
        /**
         * A list of test case names to run. They should be under the same agent. Format of each test case name: `projects//locations//agents//testCases/`
         */
        testCases?: string[] | null;
    }
    /**
     * Configuration for the version.
     */
    export interface Schema$GoogleCloudDialogflowCxV3EnvironmentVersionConfig {
        /**
         * Required. Both flow and playbook versions are supported. Format for flow version: projects//locations//agents//flows//versions/. Format for playbook version: projects//locations//agents//playbooks//versions/.
         */
        version?: string | null;
    }
    /**
     * Configuration for webhooks.
     */
    export interface Schema$GoogleCloudDialogflowCxV3EnvironmentWebhookConfig {
        /**
         * The list of webhooks to override for the agent environment. The webhook must exist in the agent. You can override fields in `generic_web_service` and `service_directory`.
         */
        webhookOverrides?: Schema$GoogleCloudDialogflowCxV3Webhook[];
    }
    /**
     * An event handler specifies an event that can be handled during a session. When the specified event happens, the following actions are taken in order: * If there is a `trigger_fulfillment` associated with the event, it will be called. * If there is a `target_page` associated with the event, the session will transition into the specified page. * If there is a `target_flow` associated with the event, the session will transition into the specified flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3EventHandler {
        /**
         * Required. The name of the event to handle.
         */
        event?: string | null;
        /**
         * Output only. The unique identifier of this event handler.
         */
        name?: string | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The target playbook to transition to. Format: `projects//locations//agents//playbooks/`.
         */
        targetPlaybook?: string | null;
        /**
         * The fulfillment to call when the event occurs. Handling webhook errors with a fulfillment enabled with webhook could cause infinite loop. It is invalid to specify such fulfillment for a handler handling webhooks.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3Fulfillment;
    }
    /**
     * Represents the event to trigger.
     */
    export interface Schema$GoogleCloudDialogflowCxV3EventInput {
        /**
         * Name of the event.
         */
        event?: string | null;
    }
    /**
     * The response message for Agents.ExportAgent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportAgentResponse {
        /**
         * Uncompressed raw byte content for agent. This field is populated if none of `agent_uri` and `git_destination` are specified in ExportAgentRequest.
         */
        agentContent?: string | null;
        /**
         * The URI to a file containing the exported agent. This field is populated if `agent_uri` is specified in ExportAgentRequest.
         */
        agentUri?: string | null;
        /**
         * Commit SHA of the git push. This field is populated if `git_destination` is specified in ExportAgentRequest.
         */
        commitSha?: string | null;
    }
    /**
     * Metadata returned for the EntityTypes.ExportEntityTypes long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportEntityTypesMetadata {
    }
    /**
     * The response message for EntityTypes.ExportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportEntityTypesResponse {
        /**
         * Uncompressed byte content for entity types. This field is populated only if `entity_types_content_inline` is set to true in ExportEntityTypesRequest.
         */
        entityTypesContent?: Schema$GoogleCloudDialogflowCxV3InlineDestination;
        /**
         * The URI to a file containing the exported entity types. This field is populated only if `entity_types_uri` is specified in ExportEntityTypesRequest.
         */
        entityTypesUri?: string | null;
    }
    /**
     * The response message for Flows.ExportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportFlowResponse {
        /**
         * Uncompressed raw byte content for flow.
         */
        flowContent?: string | null;
        /**
         * The URI to a file containing the exported flow. This field is populated only if `flow_uri` is specified in ExportFlowRequest.
         */
        flowUri?: string | null;
    }
    /**
     * Metadata returned for the Intents.ExportIntents long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportIntentsMetadata {
    }
    /**
     * The response message for Intents.ExportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportIntentsResponse {
        /**
         * Uncompressed byte content for intents. This field is populated only if `intents_content_inline` is set to true in ExportIntentsRequest.
         */
        intentsContent?: Schema$GoogleCloudDialogflowCxV3InlineDestination;
        /**
         * The URI to a file containing the exported intents. This field is populated only if `intents_uri` is specified in ExportIntentsRequest.
         */
        intentsUri?: string | null;
    }
    /**
     * Metadata returned for the TestCases.ExportTestCases long running operation. This message currently has no fields.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportTestCasesMetadata {
    }
    /**
     * The response message for TestCases.ExportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ExportTestCasesResponse {
        /**
         * Uncompressed raw byte content for test cases.
         */
        content?: string | null;
        /**
         * The URI to a file containing the exported test cases. This field is populated only if `gcs_uri` is specified in ExportTestCasesRequest.
         */
        gcsUri?: string | null;
    }
    /**
     * A form is a data model that groups related parameters that can be collected from the user. The process in which the agent prompts the user and collects parameter values from the user is called form filling. A form can be added to a page. When form filling is done, the filled parameters will be written to the session.
     */
    export interface Schema$GoogleCloudDialogflowCxV3Form {
        /**
         * Parameters to collect from the user.
         */
        parameters?: Schema$GoogleCloudDialogflowCxV3FormParameter[];
    }
    /**
     * Represents a form parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FormParameter {
        /**
         * Hierarchical advanced settings for this parameter. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettings;
        /**
         * The default value of an optional parameter. If the parameter is required, the default value will be ignored.
         */
        defaultValue?: any | null;
        /**
         * Required. The human-readable name of the parameter, unique within the form.
         */
        displayName?: string | null;
        /**
         * Required. The entity type of the parameter. Format: `projects/-/locations/-/agents/-/entityTypes/` for system entity types (for example, `projects/-/locations/-/agents/-/entityTypes/sys.date`), or `projects//locations//agents//entityTypes/` for developer entity types.
         */
        entityType?: string | null;
        /**
         * Required. Defines fill behavior for the parameter.
         */
        fillBehavior?: Schema$GoogleCloudDialogflowCxV3FormParameterFillBehavior;
        /**
         * Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Indicates whether the parameter content should be redacted in log. If redaction is enabled, the parameter content will be replaced by parameter name during logging. Note: the parameter content is subject to redaction if either parameter level redaction or entity type level redaction is enabled.
         */
        redact?: boolean | null;
        /**
         * Indicates whether the parameter is required. Optional parameters will not trigger prompts; however, they are filled if the user specifies them. Required parameters must be filled before form filling concludes.
         */
        required?: boolean | null;
    }
    /**
     * Configuration for how the filling of a parameter should be handled.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FormParameterFillBehavior {
        /**
         * Required. The fulfillment to provide the initial prompt that the agent can present to the user in order to fill the parameter.
         */
        initialPromptFulfillment?: Schema$GoogleCloudDialogflowCxV3Fulfillment;
        /**
         * The handlers for parameter-level events, used to provide reprompt for the parameter or transition to a different page/flow. The supported events are: * `sys.no-match-`, where N can be from 1 to 6 * `sys.no-match-default` * `sys.no-input-`, where N can be from 1 to 6 * `sys.no-input-default` * `sys.invalid-parameter` `initial_prompt_fulfillment` provides the first prompt for the parameter. If the user's response does not fill the parameter, a no-match/no-input event will be triggered, and the fulfillment associated with the `sys.no-match-1`/`sys.no-input-1` handler (if defined) will be called to provide a prompt. The `sys.no-match-2`/`sys.no-input-2` handler (if defined) will respond to the next no-match/no-input event, and so on. A `sys.no-match-default` or `sys.no-input-default` handler will be used to handle all following no-match/no-input events after all numbered no-match/no-input handlers for the parameter are consumed. A `sys.invalid-parameter` handler can be defined to handle the case where the parameter values have been `invalidated` by webhook. For example, if the user's response fill the parameter, however the parameter was invalidated by webhook, the fulfillment associated with the `sys.invalid-parameter` handler (if defined) will be called to provide a prompt. If the event handler for the corresponding event can't be found on the parameter, `initial_prompt_fulfillment` will be re-prompted.
         */
        repromptEventHandlers?: Schema$GoogleCloudDialogflowCxV3EventHandler[];
    }
    /**
     * A fulfillment can do one or more of the following actions at the same time: * Generate rich message responses. * Set parameter values. * Call the webhook. Fulfillments can be called at various stages in the Page or Form lifecycle. For example, when a DetectIntentRequest drives a session to enter a new page, the page's entry fulfillment can add a static response to the QueryResult in the returning DetectIntentResponse, call the webhook (for example, to load user data from a database), or both.
     */
    export interface Schema$GoogleCloudDialogflowCxV3Fulfillment {
        /**
         * Hierarchical advanced settings for this fulfillment. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettings;
        /**
         * Conditional cases for this fulfillment.
         */
        conditionalCases?: Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCases[];
        /**
         * If the flag is true, the agent will utilize LLM to generate a text response. If LLM generation fails, the defined responses in the fulfillment will be respected. This flag is only useful for fulfillments associated with no-match event handlers.
         */
        enableGenerativeFallback?: boolean | null;
        /**
         * The list of rich message responses to present to the user.
         */
        messages?: Schema$GoogleCloudDialogflowCxV3ResponseMessage[];
        /**
         * Whether Dialogflow should return currently queued fulfillment response messages in streaming APIs. If a webhook is specified, it happens before Dialogflow invokes webhook. Warning: 1) This flag only affects streaming API. Responses are still queued and returned once in non-streaming API. 2) The flag can be enabled in any fulfillment but only the first 3 partial responses will be returned. You may only want to apply it to fulfillments that have slow webhooks.
         */
        returnPartialResponses?: boolean | null;
        /**
         * Set parameter values before executing the webhook.
         */
        setParameterActions?: Schema$GoogleCloudDialogflowCxV3FulfillmentSetParameterAction[];
        /**
         * The value of this field will be populated in the WebhookRequest `fulfillmentInfo.tag` field by Dialogflow when the associated webhook is called. The tag is typically used by the webhook service to identify which fulfillment is being called, but it could be used for other purposes. This field is required if `webhook` is specified.
         */
        tag?: string | null;
        /**
         * The webhook to call. Format: `projects//locations//agents//webhooks/`.
         */
        webhook?: string | null;
    }
    /**
     * A list of cascading if-else conditions. Cases are mutually exclusive. The first one with a matching condition is selected, all the rest ignored.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCases {
        /**
         * A list of cascading if-else conditions.
         */
        cases?: Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCasesCase[];
    }
    /**
     * Each case has a Boolean condition. When it is evaluated to be True, the corresponding messages will be selected and evaluated recursively.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCasesCase {
        /**
         * A list of case content.
         */
        caseContent?: Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCasesCaseCaseContent[];
        /**
         * The condition to activate and select this case. Empty means the condition is always true. The condition is evaluated against form parameters or session parameters. See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition).
         */
        condition?: string | null;
    }
    /**
     * The list of messages or conditional cases to activate for this case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCasesCaseCaseContent {
        /**
         * Additional cases to be evaluated.
         */
        additionalCases?: Schema$GoogleCloudDialogflowCxV3FulfillmentConditionalCases;
        /**
         * Returned message.
         */
        message?: Schema$GoogleCloudDialogflowCxV3ResponseMessage;
    }
    /**
     * Setting a parameter value.
     */
    export interface Schema$GoogleCloudDialogflowCxV3FulfillmentSetParameterAction {
        /**
         * Display name of the parameter.
         */
        parameter?: string | null;
        /**
         * The new value of the parameter. A null value clears the parameter.
         */
        value?: any | null;
    }
    /**
     * Google Cloud Storage location for a Dialogflow operation that writes or exports objects (e.g. exported agent or transcripts) outside of Dialogflow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3GcsDestination {
        /**
         * Required. The Google Cloud Storage URI for the exported objects. A URI is of the form: `gs://bucket/object-name-or-prefix` Whether a full object name, or just a prefix, its usage depends on the Dialogflow operation.
         */
        uri?: string | null;
    }
    /**
     * Metadata returned for the EntityTypes.ImportEntityTypes long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportEntityTypesMetadata {
    }
    /**
     * The response message for EntityTypes.ImportEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportEntityTypesResponse {
        /**
         * Info which resources have conflicts when REPORT_CONFLICT merge_option is set in ImportEntityTypesRequest.
         */
        conflictingResources?: Schema$GoogleCloudDialogflowCxV3ImportEntityTypesResponseConflictingResources;
        /**
         * The unique identifier of the imported entity types. Format: `projects//locations//agents//entity_types/`.
         */
        entityTypes?: string[] | null;
    }
    /**
     * Conflicting resources detected during the import process. Only filled when REPORT_CONFLICT is set in the request and there are conflicts in the display names.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportEntityTypesResponseConflictingResources {
        /**
         * Display names of conflicting entities.
         */
        entityDisplayNames?: string[] | null;
        /**
         * Display names of conflicting entity types.
         */
        entityTypeDisplayNames?: string[] | null;
    }
    /**
     * The response message for Flows.ImportFlow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportFlowResponse {
        /**
         * The unique identifier of the new flow. Format: `projects//locations//agents//flows/`.
         */
        flow?: string | null;
    }
    /**
     * Metadata returned for the Intents.ImportIntents long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportIntentsMetadata {
    }
    /**
     * The response message for Intents.ImportIntents.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportIntentsResponse {
        /**
         * Info which resources have conflicts when REPORT_CONFLICT merge_option is set in ImportIntentsRequest.
         */
        conflictingResources?: Schema$GoogleCloudDialogflowCxV3ImportIntentsResponseConflictingResources;
        /**
         * The unique identifier of the imported intents. Format: `projects//locations//agents//intents/`.
         */
        intents?: string[] | null;
    }
    /**
     * Conflicting resources detected during the import process. Only filled when REPORT_CONFLICT is set in the request and there are conflicts in the display names.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportIntentsResponseConflictingResources {
        /**
         * Display names of conflicting entities.
         */
        entityDisplayNames?: string[] | null;
        /**
         * Display names of conflicting intents.
         */
        intentDisplayNames?: string[] | null;
    }
    /**
     * Metadata returned for the TestCases.ImportTestCases long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportTestCasesMetadata {
        /**
         * Errors for failed test cases.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3TestCaseError[];
    }
    /**
     * The response message for TestCases.ImportTestCases.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ImportTestCasesResponse {
        /**
         * The unique identifiers of the new test cases. Format: `projects//locations//agents//testCases/`.
         */
        names?: string[] | null;
    }
    /**
     * Inline destination for a Dialogflow operation that writes or exports objects (e.g. intents) outside of Dialogflow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3InlineDestination {
        /**
         * Output only. The uncompressed byte content for the objects. Only populated in responses.
         */
        content?: string | null;
    }
    /**
     * Instructs the speech recognizer on how to process the audio content.
     */
    export interface Schema$GoogleCloudDialogflowCxV3InputAudioConfig {
        /**
         * Required. Audio encoding of the audio content to process.
         */
        audioEncoding?: string | null;
        /**
         * Configuration of barge-in behavior during the streaming of input audio.
         */
        bargeInConfig?: Schema$GoogleCloudDialogflowCxV3BargeInConfig;
        /**
         * Optional. If `true`, Dialogflow returns SpeechWordInfo in StreamingRecognitionResult with information about the recognized speech words, e.g. start and end time offsets. If false or unspecified, Speech doesn't return any word-level information.
         */
        enableWordInfo?: boolean | null;
        /**
         * Optional. Which Speech model to select for the given request. For more information, see [Speech models](https://cloud.google.com/dialogflow/cx/docs/concept/speech-models).
         */
        model?: string | null;
        /**
         * Optional. Which variant of the Speech model to use.
         */
        modelVariant?: string | null;
        /**
         * If `true`, the request will opt out for STT conformer model migration. This field will be deprecated once force migration takes place in June 2024. Please refer to [Dialogflow CX Speech model migration](https://cloud.google.com/dialogflow/cx/docs/concept/speech-model-migration).
         */
        optOutConformerModelMigration?: boolean | null;
        /**
         * Optional. A list of strings containing words and phrases that the speech recognizer should recognize with higher likelihood. See [the Cloud Speech documentation](https://cloud.google.com/speech-to-text/docs/basics#phrase-hints) for more details.
         */
        phraseHints?: string[] | null;
        /**
         * Sample rate (in Hertz) of the audio content sent in the query. Refer to [Cloud Speech API documentation](https://cloud.google.com/speech-to-text/docs/basics) for more details.
         */
        sampleRateHertz?: number | null;
        /**
         * Optional. If `false` (default), recognition does not cease until the client closes the stream. If `true`, the recognizer will detect a single spoken utterance in input audio. Recognition ceases when it detects the audio's voice has stopped or paused. In this case, once a detected intent is received, the client should close the stream and start a new request with a new stream as needed. Note: This setting is relevant only for streaming methods.
         */
        singleUtterance?: boolean | null;
    }
    /**
     * An intent represents a user's intent to interact with a conversational agent. You can provide information for the Dialogflow API to use to match user input to an intent by adding training phrases (i.e., examples of user input) to your intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3Intent {
        /**
         * Human readable description for better understanding an intent like its scope, content, result etc. Maximum character limit: 140 characters.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the intent, unique within the agent.
         */
        displayName?: string | null;
        /**
         * Indicates whether this is a fallback intent. Currently only default fallback intent is allowed in the agent, which is added upon agent creation. Adding training phrases to fallback intent is useful in the case of requests that are mistakenly matched, since training phrases assigned to fallback intents act as negative examples that triggers no-match event.
         */
        isFallback?: boolean | null;
        /**
         * The key/value metadata to label an intent. Labels can contain lowercase letters, digits and the symbols '-' and '_'. International characters are allowed, including letters from unicase alphabets. Keys must start with a letter. Keys and values can be no longer than 63 characters and no more than 128 bytes. Prefix "sys-" is reserved for Dialogflow defined labels. Currently allowed Dialogflow defined labels include: * sys-head * sys-contextual The above labels do not require value. "sys-head" means the intent is a head intent. "sys.contextual" means the intent is a contextual intent.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The unique identifier of the intent. Required for the Intents.UpdateIntent method. Intents.CreateIntent populates the name automatically. Format: `projects//locations//agents//intents/`.
         */
        name?: string | null;
        /**
         * The collection of parameters associated with the intent.
         */
        parameters?: Schema$GoogleCloudDialogflowCxV3IntentParameter[];
        /**
         * The priority of this intent. Higher numbers represent higher priorities. - If the supplied value is unspecified or 0, the service translates the value to 500,000, which corresponds to the `Normal` priority in the console. - If the supplied value is negative, the intent is ignored in runtime detect intent requests.
         */
        priority?: number | null;
        /**
         * The collection of training phrases the agent is trained on to identify the intent.
         */
        trainingPhrases?: Schema$GoogleCloudDialogflowCxV3IntentTrainingPhrase[];
    }
    /**
     * Represents the intent to trigger programmatically rather than as a result of natural language processing.
     */
    export interface Schema$GoogleCloudDialogflowCxV3IntentInput {
        /**
         * Required. The unique identifier of the intent. Format: `projects//locations//agents//intents/`.
         */
        intent?: string | null;
    }
    /**
     * Represents an intent parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3IntentParameter {
        /**
         * Required. The entity type of the parameter. Format: `projects/-/locations/-/agents/-/entityTypes/` for system entity types (for example, `projects/-/locations/-/agents/-/entityTypes/sys.date`), or `projects//locations//agents//entityTypes/` for developer entity types.
         */
        entityType?: string | null;
        /**
         * Required. The unique identifier of the parameter. This field is used by training phrases to annotate their parts.
         */
        id?: string | null;
        /**
         * Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Indicates whether the parameter content should be redacted in log. If redaction is enabled, the parameter content will be replaced by parameter name during logging. Note: the parameter content is subject to redaction if either parameter level redaction or entity type level redaction is enabled.
         */
        redact?: boolean | null;
    }
    /**
     * Represents an example that the agent is trained on to identify the intent.
     */
    export interface Schema$GoogleCloudDialogflowCxV3IntentTrainingPhrase {
        /**
         * Output only. The unique identifier of the training phrase.
         */
        id?: string | null;
        /**
         * Required. The ordered list of training phrase parts. The parts are concatenated in order to form the training phrase. Note: The API does not automatically annotate training phrases like the Dialogflow Console does. Note: Do not forget to include whitespace at part boundaries, so the training phrase is well formatted when the parts are concatenated. If the training phrase does not need to be annotated with parameters, you just need a single part with only the Part.text field set. If you want to annotate the training phrase, you must create multiple parts, where the fields of each part are populated in one of two ways: - `Part.text` is set to a part of the phrase that has no parameters. - `Part.text` is set to a part of the phrase that you want to annotate, and the `parameter_id` field is set.
         */
        parts?: Schema$GoogleCloudDialogflowCxV3IntentTrainingPhrasePart[];
        /**
         * Indicates how many times this example was added to the intent.
         */
        repeatCount?: number | null;
    }
    /**
     * Represents a part of a training phrase.
     */
    export interface Schema$GoogleCloudDialogflowCxV3IntentTrainingPhrasePart {
        /**
         * The parameter used to annotate this part of the training phrase. This field is required for annotated parts of the training phrase.
         */
        parameterId?: string | null;
        /**
         * Required. The text for this part.
         */
        text?: string | null;
    }
    /**
     * The Knowledge Connector settings for this page or flow. This includes information such as the attached Knowledge Bases, and the way to execute fulfillment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3KnowledgeConnectorSettings {
        /**
         * Optional. List of related data store connections.
         */
        dataStoreConnections?: Schema$GoogleCloudDialogflowCxV3DataStoreConnection[];
        /**
         * Whether Knowledge Connector is enabled or not.
         */
        enabled?: boolean | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The fulfillment to be triggered. When the answers from the Knowledge Connector are selected by Dialogflow, you can utitlize the request scoped parameter `$request.knowledge.answers` (contains up to the 5 highest confidence answers) and `$request.knowledge.questions` (contains the corresponding questions) to construct the fulfillment.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3Fulfillment;
    }
    /**
     * Represents the language information of the request.
     */
    export interface Schema$GoogleCloudDialogflowCxV3LanguageInfo {
        /**
         * The confidence score of the detected language between 0 and 1.
         */
        confidenceScore?: number | null;
        /**
         * The language code specified in the original request.
         */
        inputLanguageCode?: string | null;
        /**
         * The language code detected for this request based on the user conversation.
         */
        resolvedLanguageCode?: string | null;
    }
    /**
     * A Dialogflow CX conversation (session) can be described and visualized as a state machine. The states of a CX session are represented by pages. For each flow, you define many pages, where your combined pages can handle a complete conversation on the topics the flow is designed for. At any given moment, exactly one page is the current page, the current page is considered active, and the flow associated with that page is considered active. Every flow has a special start page. When a flow initially becomes active, the start page page becomes the current page. For each conversational turn, the current page will either stay the same or transition to another page. You configure each page to collect information from the end-user that is relevant for the conversational state represented by the page. For more information, see the [Page guide](https://cloud.google.com/dialogflow/cx/docs/concept/page).
     */
    export interface Schema$GoogleCloudDialogflowCxV3Page {
        /**
         * Hierarchical advanced settings for this page. The settings exposed at the lower level overrides the settings exposed at the higher level.
         */
        advancedSettings?: Schema$GoogleCloudDialogflowCxV3AdvancedSettings;
        /**
         * The description of the page. The maximum length is 500 characters.
         */
        description?: string | null;
        /**
         * Required. The human-readable name of the page, unique within the flow.
         */
        displayName?: string | null;
        /**
         * The fulfillment to call when the session is entering the page.
         */
        entryFulfillment?: Schema$GoogleCloudDialogflowCxV3Fulfillment;
        /**
         * Handlers associated with the page to handle events such as webhook errors, no match or no input.
         */
        eventHandlers?: Schema$GoogleCloudDialogflowCxV3EventHandler[];
        /**
         * The form associated with the page, used for collecting parameters relevant to the page.
         */
        form?: Schema$GoogleCloudDialogflowCxV3Form;
        /**
         * Optional. Knowledge connector configuration.
         */
        knowledgeConnectorSettings?: Schema$GoogleCloudDialogflowCxV3KnowledgeConnectorSettings;
        /**
         * The unique identifier of the page. Required for the Pages.UpdatePage method. Pages.CreatePage populates the name automatically. Format: `projects//locations//agents//flows//pages/`.
         */
        name?: string | null;
        /**
         * Ordered list of `TransitionRouteGroups` added to the page. Transition route groups must be unique within a page. If the page links both flow-level transition route groups and agent-level transition route groups, the flow-level ones will have higher priority and will be put before the agent-level ones. * If multiple transition routes within a page scope refer to the same intent, then the precedence order is: page's transition route -\> page's transition route group -\> flow's transition routes. * If multiple transition route groups within a page contain the same intent, then the first group in the ordered list takes precedence. Format:`projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        transitionRouteGroups?: string[] | null;
        /**
         * A list of transitions for the transition rules of this page. They route the conversation to another page in the same flow, or another flow. When we are in a certain page, the TransitionRoutes are evaluated in the following order: * TransitionRoutes defined in the page with intent specified. * TransitionRoutes defined in the transition route groups with intent specified. * TransitionRoutes defined in flow with intent specified. * TransitionRoutes defined in the transition route groups with intent specified. * TransitionRoutes defined in the page with only condition specified. * TransitionRoutes defined in the transition route groups with only condition specified.
         */
        transitionRoutes?: Schema$GoogleCloudDialogflowCxV3TransitionRoute[];
    }
    /**
     * Represents page information communicated to and from the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3PageInfo {
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The unique identifier of the current page. Format: `projects//locations//agents//flows//pages/`.
         */
        currentPage?: string | null;
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The display name of the current page.
         */
        displayName?: string | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. Information about the form.
         */
        formInfo?: Schema$GoogleCloudDialogflowCxV3PageInfoFormInfo;
    }
    /**
     * Represents form information.
     */
    export interface Schema$GoogleCloudDialogflowCxV3PageInfoFormInfo {
        /**
         * Optional for both WebhookRequest and WebhookResponse. The parameters contained in the form. Note that the webhook cannot add or remove any form parameter.
         */
        parameterInfo?: Schema$GoogleCloudDialogflowCxV3PageInfoFormInfoParameterInfo[];
    }
    /**
     * Represents parameter information.
     */
    export interface Schema$GoogleCloudDialogflowCxV3PageInfoFormInfoParameterInfo {
        /**
         * Always present for WebhookRequest. Required for WebhookResponse. The human-readable name of the parameter, unique within the form. This field cannot be modified by the webhook.
         */
        displayName?: string | null;
        /**
         * Optional for WebhookRequest. Ignored for WebhookResponse. Indicates if the parameter value was just collected on the last conversation turn.
         */
        justCollected?: boolean | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. Indicates whether the parameter is required. Optional parameters will not trigger prompts; however, they are filled if the user specifies them. Required parameters must be filled before form filling concludes.
         */
        required?: boolean | null;
        /**
         * Always present for WebhookRequest. Required for WebhookResponse. The state of the parameter. This field can be set to INVALID by the webhook to invalidate the parameter; other values set by the webhook will be ignored.
         */
        state?: string | null;
        /**
         * Optional for both WebhookRequest and WebhookResponse. The value of the parameter. This field can be set by the webhook to change the parameter value.
         */
        value?: any | null;
    }
    /**
     * Represents the query input. It can contain one of: 1. A conversational query in the form of text. 2. An intent query that specifies which intent to trigger. 3. Natural language speech audio to be processed. 4. An event to be triggered. 5. DTMF digits to invoke an intent and fill in parameter value. 6. The results of a tool executed by the client.
     */
    export interface Schema$GoogleCloudDialogflowCxV3QueryInput {
        /**
         * The natural language speech audio to be processed.
         */
        audio?: Schema$GoogleCloudDialogflowCxV3AudioInput;
        /**
         * The DTMF event to be handled.
         */
        dtmf?: Schema$GoogleCloudDialogflowCxV3DtmfInput;
        /**
         * The event to be triggered.
         */
        event?: Schema$GoogleCloudDialogflowCxV3EventInput;
        /**
         * The intent to be triggered.
         */
        intent?: Schema$GoogleCloudDialogflowCxV3IntentInput;
        /**
         * Required. The language of the input. See [Language Support](https://cloud.google.com/dialogflow/cx/docs/reference/language) for a list of the currently supported language codes. Note that queries in the same session do not necessarily need to specify the same language.
         */
        languageCode?: string | null;
        /**
         * The natural language text to be processed.
         */
        text?: Schema$GoogleCloudDialogflowCxV3TextInput;
        /**
         * The results of a tool executed by the client.
         */
        toolCallResult?: Schema$GoogleCloudDialogflowCxV3ToolCallResult;
    }
    /**
     * Represents a response message that can be returned by a conversational agent. Response messages are also used for output audio synthesis. The approach is as follows: * If at least one OutputAudioText response is present, then all OutputAudioText responses are linearly concatenated, and the result is used for output audio synthesis. * If the OutputAudioText responses are a mixture of text and SSML, then the concatenated result is treated as SSML; otherwise, the result is treated as either text or SSML as appropriate. The agent designer should ideally use either text or SSML consistently throughout the bot design. * Otherwise, all Text responses are linearly concatenated, and the result is used for output audio synthesis. This approach allows for more sophisticated user experience scenarios, where the text displayed to the user may differ from what is heard.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessage {
        /**
         * The channel which the response is associated with. Clients can specify the channel via QueryParameters.channel, and only associated channel response will be returned.
         */
        channel?: string | null;
        /**
         * Indicates that the conversation succeeded.
         */
        conversationSuccess?: Schema$GoogleCloudDialogflowCxV3ResponseMessageConversationSuccess;
        /**
         * Output only. A signal that indicates the interaction with the Dialogflow agent has ended. This message is generated by Dialogflow only when the conversation reaches `END_SESSION` page. It is not supposed to be defined by the user. It's guaranteed that there is at most one such message in each response.
         */
        endInteraction?: Schema$GoogleCloudDialogflowCxV3ResponseMessageEndInteraction;
        /**
         * Represents info card for knowledge answers, to be better rendered in Dialogflow Messenger.
         */
        knowledgeInfoCard?: Schema$GoogleCloudDialogflowCxV3ResponseMessageKnowledgeInfoCard;
        /**
         * Hands off conversation to a human agent.
         */
        liveAgentHandoff?: Schema$GoogleCloudDialogflowCxV3ResponseMessageLiveAgentHandoff;
        /**
         * Output only. An audio response message composed of both the synthesized Dialogflow agent responses and responses defined via play_audio. This message is generated by Dialogflow only and not supposed to be defined by the user.
         */
        mixedAudio?: Schema$GoogleCloudDialogflowCxV3ResponseMessageMixedAudio;
        /**
         * A text or ssml response that is preferentially used for TTS output audio synthesis, as described in the comment on the ResponseMessage message.
         */
        outputAudioText?: Schema$GoogleCloudDialogflowCxV3ResponseMessageOutputAudioText;
        /**
         * Returns a response containing a custom, platform-specific payload.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Signal that the client should play an audio clip hosted at a client-specific URI. Dialogflow uses this to construct mixed_audio. However, Dialogflow itself does not try to read or process the URI in any way.
         */
        playAudio?: Schema$GoogleCloudDialogflowCxV3ResponseMessagePlayAudio;
        /**
         * Response type.
         */
        responseType?: string | null;
        /**
         * A signal that the client should transfer the phone call connected to this agent to a third-party endpoint.
         */
        telephonyTransferCall?: Schema$GoogleCloudDialogflowCxV3ResponseMessageTelephonyTransferCall;
        /**
         * Returns a text response.
         */
        text?: Schema$GoogleCloudDialogflowCxV3ResponseMessageText;
        /**
         * Returns the definition of a tool call that should be executed by the client.
         */
        toolCall?: Schema$GoogleCloudDialogflowCxV3ToolCall;
    }
    /**
     * Indicates that the conversation succeeded, i.e., the bot handled the issue that the customer talked to it about. Dialogflow only uses this to determine which conversations should be counted as successful and doesn't process the metadata in this message in any way. Note that Dialogflow also considers conversations that get to the conversation end page as successful even if they don't return ConversationSuccess. You may set this, for example: * In the entry_fulfillment of a Page if entering the page indicates that the conversation succeeded. * In a webhook response when you determine that you handled the customer issue.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageConversationSuccess {
        /**
         * Custom metadata. Dialogflow doesn't impose any structure on this.
         */
        metadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Indicates that interaction with the Dialogflow agent has ended. This message is generated by Dialogflow only and not supposed to be defined by the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageEndInteraction {
    }
    /**
     * Represents info card response. If the response contains generative knowledge prediction, Dialogflow will return a payload with Infobot Messenger compatible info card. Otherwise, the info card response is skipped.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageKnowledgeInfoCard {
    }
    /**
     * Indicates that the conversation should be handed off to a live agent. Dialogflow only uses this to determine which conversations were handed off to a human agent for measurement purposes. What else to do with this signal is up to you and your handoff procedures. You may set this, for example: * In the entry_fulfillment of a Page if entering the page indicates something went extremely wrong in the conversation. * In a webhook response when you determine that the customer issue can only be handled by a human.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageLiveAgentHandoff {
        /**
         * Custom metadata for your handoff procedure. Dialogflow doesn't impose any structure on this.
         */
        metadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents an audio message that is composed of both segments synthesized from the Dialogflow agent prompts and ones hosted externally at the specified URIs. The external URIs are specified via play_audio. This message is generated by Dialogflow only and not supposed to be defined by the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageMixedAudio {
        /**
         * Segments this audio response is composed of.
         */
        segments?: Schema$GoogleCloudDialogflowCxV3ResponseMessageMixedAudioSegment[];
    }
    /**
     * Represents one segment of audio.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageMixedAudioSegment {
        /**
         * Output only. Whether the playback of this segment can be interrupted by the end user's speech and the client should then start the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Raw audio synthesized from the Dialogflow agent's response using the output config specified in the request.
         */
        audio?: string | null;
        /**
         * Client-specific URI that points to an audio clip accessible to the client. Dialogflow does not impose any validation on it.
         */
        uri?: string | null;
    }
    /**
     * A text or ssml response that is preferentially used for TTS output audio synthesis, as described in the comment on the ResponseMessage message.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageOutputAudioText {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * The SSML text to be synthesized. For more information, see [SSML](/speech/text-to-speech/docs/ssml).
         */
        ssml?: string | null;
        /**
         * The raw text to be synthesized.
         */
        text?: string | null;
    }
    /**
     * Specifies an audio clip to be played by the client as part of the response.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessagePlayAudio {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Required. URI of the audio clip. Dialogflow does not impose any validation on this value. It is specific to the client that reads it.
         */
        audioUri?: string | null;
    }
    /**
     * Represents the signal that telles the client to transfer the phone call connected to the agent to a third-party endpoint.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageTelephonyTransferCall {
        /**
         * Transfer the call to a phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164).
         */
        phoneNumber?: string | null;
    }
    /**
     * The text response message.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ResponseMessageText {
        /**
         * Output only. Whether the playback of this message can be interrupted by the end user's speech and the client can then starts the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Required. A collection of text response variants. If multiple variants are defined, only one text response variant is returned at runtime.
         */
        text?: string[] | null;
    }
    /**
     * Metadata returned for the Environments.RunContinuousTest long running operation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3RunContinuousTestMetadata {
        /**
         * The test errors.
         */
        errors?: Schema$GoogleCloudDialogflowCxV3TestError[];
    }
    /**
     * The response message for Environments.RunContinuousTest.
     */
    export interface Schema$GoogleCloudDialogflowCxV3RunContinuousTestResponse {
        /**
         * The result for a continuous test run.
         */
        continuousTestResult?: Schema$GoogleCloudDialogflowCxV3ContinuousTestResult;
    }
    /**
     * Metadata returned for the TestCases.RunTestCase long running operation. This message currently has no fields.
     */
    export interface Schema$GoogleCloudDialogflowCxV3RunTestCaseMetadata {
    }
    /**
     * The response message for TestCases.RunTestCase.
     */
    export interface Schema$GoogleCloudDialogflowCxV3RunTestCaseResponse {
        /**
         * The result.
         */
        result?: Schema$GoogleCloudDialogflowCxV3TestCaseResult;
    }
    /**
     * Represents session information communicated to and from the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3SessionInfo {
        /**
         * Optional for WebhookRequest. Optional for WebhookResponse. All parameters collected from forms and intents during the session. Parameters can be created, updated, or removed by the webhook. To remove a parameter from the session, the webhook should explicitly set the parameter value to null in WebhookResponse. The map is keyed by parameters' display names.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * Always present for WebhookRequest. Ignored for WebhookResponse. The unique identifier of the session. This field can be used by the webhook to identify a session. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/` if environment is specified.
         */
        session?: string | null;
    }
    /**
     * Represents a test case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestCase {
        /**
         * Output only. When the test was created.
         */
        creationTime?: string | null;
        /**
         * Required. The human-readable name of the test case, unique within the agent. Limit of 200 characters.
         */
        displayName?: string | null;
        /**
         * The latest test result.
         */
        lastTestResult?: Schema$GoogleCloudDialogflowCxV3TestCaseResult;
        /**
         * The unique identifier of the test case. TestCases.CreateTestCase will populate the name automatically. Otherwise use format: `projects//locations//agents//testCases/`.
         */
        name?: string | null;
        /**
         * Additional freeform notes about the test case. Limit of 400 characters.
         */
        notes?: string | null;
        /**
         * Tags are short descriptions that users may apply to test cases for organizational and filtering purposes. Each tag should start with "#" and has a limit of 30 characters.
         */
        tags?: string[] | null;
        /**
         * The conversation turns uttered when the test case was created, in chronological order. These include the canonical set of agent utterances that should occur when the agent is working properly.
         */
        testCaseConversationTurns?: Schema$GoogleCloudDialogflowCxV3ConversationTurn[];
        /**
         * Config for the test case.
         */
        testConfig?: Schema$GoogleCloudDialogflowCxV3TestConfig;
    }
    /**
     * Error info for importing a test.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestCaseError {
        /**
         * The status associated with the test case.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The test case.
         */
        testCase?: Schema$GoogleCloudDialogflowCxV3TestCase;
    }
    /**
     * Represents a result from running a test case in an agent environment.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestCaseResult {
        /**
         * The conversation turns uttered during the test case replay in chronological order.
         */
        conversationTurns?: Schema$GoogleCloudDialogflowCxV3ConversationTurn[];
        /**
         * Environment where the test was run. If not set, it indicates the draft environment.
         */
        environment?: string | null;
        /**
         * The resource name for the test case result. Format: `projects//locations//agents//testCases//results/`.
         */
        name?: string | null;
        /**
         * Whether the test case passed in the agent environment.
         */
        testResult?: string | null;
        /**
         * The time that the test was run.
         */
        testTime?: string | null;
    }
    /**
     * Represents configurations for a test case.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestConfig {
        /**
         * Flow name to start the test case with. Format: `projects//locations//agents//flows/`. Only one of `flow` and `page` should be set to indicate the starting point of the test case. If neither is set, the test case will start with start page on the default start flow.
         */
        flow?: string | null;
        /**
         * The page to start the test case with. Format: `projects//locations//agents//flows//pages/`. Only one of `flow` and `page` should be set to indicate the starting point of the test case. If neither is set, the test case will start with start page on the default start flow.
         */
        page?: string | null;
        /**
         * Session parameters to be compared when calculating differences.
         */
        trackingParameters?: string[] | null;
    }
    /**
     * Error info for running a test.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestError {
        /**
         * The status associated with the test.
         */
        status?: Schema$GoogleRpcStatus;
        /**
         * The test case resource name.
         */
        testCase?: string | null;
        /**
         * The timestamp when the test was completed.
         */
        testTime?: string | null;
    }
    /**
     * The description of differences between original and replayed agent output.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TestRunDifference {
        /**
         * A human readable description of the diff, showing the actual output vs expected output.
         */
        description?: string | null;
        /**
         * The type of diff.
         */
        type?: string | null;
    }
    /**
     * Represents the natural language text to be processed.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TextInput {
        /**
         * Required. The UTF-8 encoded natural language text to be processed.
         */
        text?: string | null;
    }
    /**
     * Represents a call of a specific tool's action with the specified inputs.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ToolCall {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Optional. The action's input parameters.
         */
        inputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
    }
    /**
     * The result of calling a tool's action that has been executed by the client.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ToolCallResult {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * The tool call's error.
         */
        error?: Schema$GoogleCloudDialogflowCxV3ToolCallResultError;
        /**
         * The tool call's output parameters.
         */
        outputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//agents//tools/`.
         */
        tool?: string | null;
    }
    /**
     * An error produced by the tool call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3ToolCallResultError {
        /**
         * Optional. The error message of the function.
         */
        message?: string | null;
    }
    /**
     * A transition route specifies a intent that can be matched and/or a data condition that can be evaluated during a session. When a specified transition is matched, the following actions are taken in order: * If there is a `trigger_fulfillment` associated with the transition, it will be called. * If there is a `target_page` associated with the transition, the session will transition into the specified page. * If there is a `target_flow` associated with the transition, the session will transition into the specified flow.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TransitionRoute {
        /**
         * The condition to evaluate against form parameters or session parameters. See the [conditions reference](https://cloud.google.com/dialogflow/cx/docs/reference/condition). At least one of `intent` or `condition` must be specified. When both `intent` and `condition` are specified, the transition can only happen when both are fulfilled.
         */
        condition?: string | null;
        /**
         * Optional. The description of the transition route. The maximum length is 500 characters.
         */
        description?: string | null;
        /**
         * The unique identifier of an Intent. Format: `projects//locations//agents//intents/`. Indicates that the transition can only happen when the given intent is matched. At least one of `intent` or `condition` must be specified. When both `intent` and `condition` are specified, the transition can only happen when both are fulfilled.
         */
        intent?: string | null;
        /**
         * Output only. The unique identifier of this transition route.
         */
        name?: string | null;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
        /**
         * The fulfillment to call when the condition is satisfied. At least one of `trigger_fulfillment` and `target` must be specified. When both are defined, `trigger_fulfillment` is executed first.
         */
        triggerFulfillment?: Schema$GoogleCloudDialogflowCxV3Fulfillment;
    }
    /**
     * Collection of all signals that were extracted for a single turn of the conversation.
     */
    export interface Schema$GoogleCloudDialogflowCxV3TurnSignals {
        /**
         * Whether agent responded with LiveAgentHandoff fulfillment.
         */
        agentEscalated?: boolean | null;
        /**
         * Whether user was using DTMF input.
         */
        dtmfUsed?: boolean | null;
        /**
         * Failure reasons of the turn.
         */
        failureReasons?: string[] | null;
        /**
         * Whether NLU predicted NO_MATCH.
         */
        noMatch?: boolean | null;
        /**
         * Whether user provided no input.
         */
        noUserInput?: boolean | null;
        /**
         * Whether turn resulted in End Session page.
         */
        reachedEndPage?: boolean | null;
        /**
         * Sentiment magnitude of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentMagnitude?: number | null;
        /**
         * Sentiment score of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentScore?: number | null;
        /**
         * Whether user was specifically asking for a live agent.
         */
        userEscalated?: boolean | null;
        /**
         * Human-readable statuses of the webhooks triggered during this turn.
         */
        webhookStatuses?: string[] | null;
    }
    /**
     * Webhooks host the developer's business logic. During a session, webhooks allow the developer to use the data extracted by Dialogflow's natural language processing to generate dynamic responses, validate collected data, or trigger actions on the backend.
     */
    export interface Schema$GoogleCloudDialogflowCxV3Webhook {
        /**
         * Indicates whether the webhook is disabled.
         */
        disabled?: boolean | null;
        /**
         * Required. The human-readable name of the webhook, unique within the agent.
         */
        displayName?: string | null;
        /**
         * Configuration for a generic web service.
         */
        genericWebService?: Schema$GoogleCloudDialogflowCxV3WebhookGenericWebService;
        /**
         * The unique identifier of the webhook. Required for the Webhooks.UpdateWebhook method. Webhooks.CreateWebhook populates the name automatically. Format: `projects//locations//agents//webhooks/`.
         */
        name?: string | null;
        /**
         * Configuration for a [Service Directory](https://cloud.google.com/service-directory) service.
         */
        serviceDirectory?: Schema$GoogleCloudDialogflowCxV3WebhookServiceDirectoryConfig;
        /**
         * Webhook execution timeout. Execution is considered failed if Dialogflow doesn't receive a response from webhook at the end of the timeout period. Defaults to 5 seconds, maximum allowed timeout is 30 seconds.
         */
        timeout?: string | null;
    }
    /**
     * Represents configuration for a generic web service.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookGenericWebService {
        /**
         * Optional. Specifies a list of allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, Dialogflow will use Google's default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command, ``` openssl x509 -req -days 200 -in example.com.csr \ -signkey example.com.key \ -out example.com.crt \ -extfile <(printf "\nsubjectAltName='DNS:www.example.com'") ```
         */
        allowedCaCerts?: string[] | null;
        /**
         * Optional. HTTP method for the flexible webhook calls. Standard webhook always uses POST.
         */
        httpMethod?: string | null;
        /**
         * Optional. The OAuth configuration of the webhook. If specified, Dialogflow will initiate the OAuth client credential flow to exchange an access token from the 3rd party platform and put it in the auth header.
         */
        oauthConfig?: Schema$GoogleCloudDialogflowCxV3WebhookGenericWebServiceOAuthConfig;
        /**
         * Optional. Maps the values extracted from specific fields of the flexible webhook response into session parameters. - Key: session parameter name - Value: field path in the webhook response
         */
        parameterMapping?: {
            [key: string]: string;
        } | null;
        /**
         * The password for HTTP Basic authentication.
         */
        password?: string | null;
        /**
         * Optional. Defines a custom JSON object as request body to send to flexible webhook.
         */
        requestBody?: string | null;
        /**
         * The HTTP request headers to send together with webhook requests.
         */
        requestHeaders?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The SecretManager secret version resource storing the username:password pair for HTTP Basic authentication. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForUsernamePassword?: string | null;
        /**
         * Optional. The HTTP request headers to send together with webhook requests. Header values are stored in SecretManager secret versions. When the same header name is specified in both `request_headers` and `secret_versions_for_request_headers`, the value in `secret_versions_for_request_headers` will be used.
         */
        secretVersionsForRequestHeaders?: {
            [key: string]: Schema$GoogleCloudDialogflowCxV3WebhookGenericWebServiceSecretVersionHeaderValue;
        } | null;
        /**
         * Optional. Indicate the auth token type generated from the [Diglogflow service agent](https://cloud.google.com/iam/docs/service-agents#dialogflow-service-agent). The generated token is sent in the Authorization header.
         */
        serviceAgentAuth?: string | null;
        /**
         * Required. The webhook URI for receiving POST requests. It must use https protocol.
         */
        uri?: string | null;
        /**
         * The user name for HTTP Basic authentication.
         */
        username?: string | null;
        /**
         * Optional. Type of the webhook.
         */
        webhookType?: string | null;
    }
    /**
     * Represents configuration of OAuth client credential flow for 3rd party API authentication.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookGenericWebServiceOAuthConfig {
        /**
         * Required. The client ID provided by the 3rd party platform.
         */
        clientId?: string | null;
        /**
         * Optional. The client secret provided by the 3rd party platform.
         */
        clientSecret?: string | null;
        /**
         * Optional. The OAuth scopes to grant.
         */
        scopes?: string[] | null;
        /**
         * Optional. The name of the SecretManager secret version resource storing the client secret. If this field is set, the `client_secret` field will be ignored. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersionForClientSecret?: string | null;
        /**
         * Required. The token endpoint provided by the 3rd party platform to exchange an access token.
         */
        tokenEndpoint?: string | null;
    }
    /**
     * Represents the value of an HTTP header stored in a SecretManager secret version.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookGenericWebServiceSecretVersionHeaderValue {
        /**
         * Required. The SecretManager secret version resource storing the header value. Format: `projects/{project\}/secrets/{secret\}/versions/{version\}`
         */
        secretVersion?: string | null;
    }
    /**
     * The request message for a webhook call. The request is sent as a JSON object and the field names will be presented in camel cases. You may see undocumented fields in an actual request. These fields are used internally by Dialogflow and should be ignored.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookRequest {
        /**
         * Always present. The unique identifier of the DetectIntentResponse that will be returned to the API caller.
         */
        detectIntentResponseId?: string | null;
        /**
         * If DTMF was provided as input, this field will contain the DTMF digits.
         */
        dtmfDigits?: string | null;
        /**
         * Always present. Information about the fulfillment that triggered this webhook call.
         */
        fulfillmentInfo?: Schema$GoogleCloudDialogflowCxV3WebhookRequestFulfillmentInfo;
        /**
         * Information about the last matched intent.
         */
        intentInfo?: Schema$GoogleCloudDialogflowCxV3WebhookRequestIntentInfo;
        /**
         * The language code specified in the original request.
         */
        languageCode?: string | null;
        /**
         * Information about the language of the request.
         */
        languageInfo?: Schema$GoogleCloudDialogflowCxV3LanguageInfo;
        /**
         * The list of rich message responses to present to the user. Webhook can choose to append or replace this list in WebhookResponse.fulfillment_response;
         */
        messages?: Schema$GoogleCloudDialogflowCxV3ResponseMessage[];
        /**
         * Information about page status.
         */
        pageInfo?: Schema$GoogleCloudDialogflowCxV3PageInfo;
        /**
         * Custom data set in QueryParameters.payload.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * The sentiment analysis result of the current user request. The field is filled when sentiment analysis is configured to be enabled for the request.
         */
        sentimentAnalysisResult?: Schema$GoogleCloudDialogflowCxV3WebhookRequestSentimentAnalysisResult;
        /**
         * Information about session status.
         */
        sessionInfo?: Schema$GoogleCloudDialogflowCxV3SessionInfo;
        /**
         * If natural language text was provided as input, this field will contain a copy of the text.
         */
        text?: string | null;
        /**
         * If natural language speech audio was provided as input, this field will contain the transcript for the audio.
         */
        transcript?: string | null;
        /**
         * If an event was provided as input, this field will contain the name of the event.
         */
        triggerEvent?: string | null;
        /**
         * If an intent was provided as input, this field will contain a copy of the intent identifier. Format: `projects//locations//agents//intents/`.
         */
        triggerIntent?: string | null;
    }
    /**
     * Represents fulfillment information communicated to the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookRequestFulfillmentInfo {
        /**
         * Always present. The value of the Fulfillment.tag field will be populated in this field by Dialogflow when the associated webhook is called. The tag is typically used by the webhook service to identify which fulfillment is being called, but it could be used for other purposes.
         */
        tag?: string | null;
    }
    /**
     * Represents intent information communicated to the webhook.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookRequestIntentInfo {
        /**
         * The confidence of the matched intent. Values range from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * Always present. The display name of the last matched intent.
         */
        displayName?: string | null;
        /**
         * Always present. The unique identifier of the last matched intent. Format: `projects//locations//agents//intents/`.
         */
        lastMatchedIntent?: string | null;
        /**
         * Parameters identified as a result of intent matching. This is a map of the name of the identified parameter to the value of the parameter identified from the user's utterance. All parameters defined in the matched intent that are identified will be surfaced here.
         */
        parameters?: {
            [key: string]: Schema$GoogleCloudDialogflowCxV3WebhookRequestIntentInfoIntentParameterValue;
        } | null;
    }
    /**
     * Represents a value for an intent parameter.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookRequestIntentInfoIntentParameterValue {
        /**
         * Always present. Original text value extracted from user utterance.
         */
        originalValue?: string | null;
        /**
         * Always present. Structured value for the parameter extracted from user utterance.
         */
        resolvedValue?: any | null;
    }
    /**
     * Represents the result of sentiment analysis.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookRequestSentimentAnalysisResult {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment, regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
    }
    /**
     * The response message for a webhook call.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookResponse {
        /**
         * The fulfillment response to send to the user. This field can be omitted by the webhook if it does not intend to send any response to the user.
         */
        fulfillmentResponse?: Schema$GoogleCloudDialogflowCxV3WebhookResponseFulfillmentResponse;
        /**
         * Information about page status. This field can be omitted by the webhook if it does not intend to modify page status.
         */
        pageInfo?: Schema$GoogleCloudDialogflowCxV3PageInfo;
        /**
         * Value to append directly to QueryResult.webhook_payloads.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Information about session status. This field can be omitted by the webhook if it does not intend to modify session status.
         */
        sessionInfo?: Schema$GoogleCloudDialogflowCxV3SessionInfo;
        /**
         * The target flow to transition to. Format: `projects//locations//agents//flows/`.
         */
        targetFlow?: string | null;
        /**
         * The target page to transition to. Format: `projects//locations//agents//flows//pages/`.
         */
        targetPage?: string | null;
    }
    /**
     * Represents a fulfillment response to the user.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookResponseFulfillmentResponse {
        /**
         * Merge behavior for `messages`.
         */
        mergeBehavior?: string | null;
        /**
         * The list of rich message responses to present to the user.
         */
        messages?: Schema$GoogleCloudDialogflowCxV3ResponseMessage[];
    }
    /**
     * Represents configuration for a [Service Directory](https://cloud.google.com/service-directory) service.
     */
    export interface Schema$GoogleCloudDialogflowCxV3WebhookServiceDirectoryConfig {
        /**
         * Generic Service configuration of this webhook.
         */
        genericWebService?: Schema$GoogleCloudDialogflowCxV3WebhookGenericWebService;
        /**
         * Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects//locations//namespaces//services/`. `Location ID` of the service directory must be the same as the location of the agent.
         */
        service?: string | null;
    }
    /**
     * Represents a part of a message possibly annotated with an entity. The part can be an entity or purely a part of the message between two entities or message start/end.
     */
    export interface Schema$GoogleCloudDialogflowV2AnnotatedMessagePart {
        /**
         * The [Dialogflow system entity type](https://cloud.google.com/dialogflow/docs/reference/system-entities) of this message part. If this is empty, Dialogflow could not annotate the phrase part with a system entity.
         */
        entityType?: string | null;
        /**
         * The [Dialogflow system entity formatted value ](https://cloud.google.com/dialogflow/docs/reference/system-entities) of this message part. For example for a system entity of type `@sys.unit-currency`, this may contain: { "amount": 5, "currency": "USD" \}
         */
        formattedValue?: any | null;
        /**
         * A part of a message possibly annotated with an entity.
         */
        text?: string | null;
    }
    /**
     * Represents article answer.
     */
    export interface Schema$GoogleCloudDialogflowV2ArticleAnswer {
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * Article match confidence. The system's confidence score that this article is a good match for this conversation, as a value from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * A map that contains metadata about the answer and the document from which it originates.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Article snippets.
         */
        snippets?: string[] | null;
        /**
         * The article title.
         */
        title?: string | null;
        /**
         * The article URI.
         */
        uri?: string | null;
    }
    /**
     * Metadata for article suggestion models.
     */
    export interface Schema$GoogleCloudDialogflowV2ArticleSuggestionModelMetadata {
        /**
         * Optional. Type of the article suggestion model. If not provided, model_type is used.
         */
        trainingModelType?: string | null;
    }
    /**
     * The response message for EntityTypes.BatchUpdateEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowV2BatchUpdateEntityTypesResponse {
        /**
         * The collection of updated or created entity types.
         */
        entityTypes?: Schema$GoogleCloudDialogflowV2EntityType[];
    }
    /**
     * The response message for Intents.BatchUpdateIntents.
     */
    export interface Schema$GoogleCloudDialogflowV2BatchUpdateIntentsResponse {
        /**
         * The collection of updated or created intents.
         */
        intents?: Schema$GoogleCloudDialogflowV2Intent[];
    }
    /**
     * Represents a part of a message possibly annotated with an entity. The part can be an entity or purely a part of the message between two entities or message start/end.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1AnnotatedMessagePart {
        /**
         * Optional. The [Dialogflow system entity type](https://cloud.google.com/dialogflow/docs/reference/system-entities) of this message part. If this is empty, Dialogflow could not annotate the phrase part with a system entity.
         */
        entityType?: string | null;
        /**
         * Optional. The [Dialogflow system entity formatted value ](https://cloud.google.com/dialogflow/docs/reference/system-entities) of this message part. For example for a system entity of type `@sys.unit-currency`, this may contain: { "amount": 5, "currency": "USD" \}
         */
        formattedValue?: any | null;
        /**
         * Required. A part of a message possibly annotated with an entity.
         */
        text?: string | null;
    }
    /**
     * Represents article answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ArticleAnswer {
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * A map that contains metadata about the answer and the document from which it originates.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Article snippets.
         */
        snippets?: string[] | null;
        /**
         * The article title.
         */
        title?: string | null;
        /**
         * The article URI.
         */
        uri?: string | null;
    }
    /**
     * The response message for EntityTypes.BatchUpdateEntityTypes.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1BatchUpdateEntityTypesResponse {
        /**
         * The collection of updated or created entity types.
         */
        entityTypes?: Schema$GoogleCloudDialogflowV2beta1EntityType[];
    }
    /**
     * The response message for Intents.BatchUpdateIntents.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1BatchUpdateIntentsResponse {
        /**
         * The collection of updated or created intents.
         */
        intents?: Schema$GoogleCloudDialogflowV2beta1Intent[];
    }
    /**
     * Metadata for a ConversationProfile.ClearSuggestionFeatureConfig operation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ClearSuggestionFeatureConfigOperationMetadata {
        /**
         * The resource name of the conversation profile. Format: `projects//locations//conversationProfiles/`
         */
        conversationProfile?: string | null;
        /**
         * Timestamp whe the request was created. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * Required. The participant role to remove the suggestion feature config. Only HUMAN_AGENT or END_USER can be used.
         */
        participantRole?: string | null;
        /**
         * Required. The type of the suggestion feature to remove.
         */
        suggestionFeatureType?: string | null;
    }
    /**
     * Dialogflow contexts are similar to natural language context. If a person says to you "they are orange", you need context in order to understand what "they" is referring to. Similarly, for Dialogflow to handle an end-user expression like that, it needs to be provided with context in order to correctly match an intent. Using contexts, you can control the flow of a conversation. You can configure contexts for an intent by setting input and output contexts, which are identified by string names. When an intent is matched, any configured output contexts for that intent become active. While any contexts are active, Dialogflow is more likely to match intents that are configured with input contexts that correspond to the currently active contexts. For more information about context, see the [Contexts guide](https://cloud.google.com/dialogflow/docs/contexts-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1Context {
        /**
         * Optional. The number of conversational query requests after which the context expires. The default is `0`. If set to `0`, the context expires immediately. Contexts expire automatically after 20 minutes if there are no matching queries.
         */
        lifespanCount?: number | null;
        /**
         * Required. The unique identifier of the context. Supported formats: - `projects//agent/sessions//contexts/`, - `projects//locations//agent/sessions//contexts/`, - `projects//agent/environments//users//sessions//contexts/`, - `projects//locations//agent/environments//users//sessions//contexts/`, The `Context ID` is always converted to lowercase, may only contain characters in `a-zA-Z0-9_-%` and may be at most 250 bytes long. If `Environment ID` is not specified, we assume default 'draft' environment. If `User ID` is not specified, we assume default '-' user. The following context names are reserved for internal use by Dialogflow. You should not use these contexts or create contexts with these names: * `__system_counters__` * `*_id_dialog_context` * `*_dialog_params_size`
         */
        name?: string | null;
        /**
         * Optional. The collection of parameters associated with this context. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents a notification sent to Pub/Sub subscribers for conversation lifecycle events.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ConversationEvent {
        /**
         * Required. The unique identifier of the conversation this notification refers to. Format: `projects//conversations/`.
         */
        conversation?: string | null;
        /**
         * Optional. More detailed information about an error. Only set for type UNRECOVERABLE_ERROR_IN_PHONE_CALL.
         */
        errorStatus?: Schema$GoogleRpcStatus;
        /**
         * Payload of NEW_MESSAGE event.
         */
        newMessagePayload?: Schema$GoogleCloudDialogflowV2beta1Message;
        /**
         * Payload of NEW_RECOGNITION_RESULT event.
         */
        newRecognitionResultPayload?: Schema$GoogleCloudDialogflowV2beta1StreamingRecognitionResult;
        /**
         * Required. The type of the event that this notification refers to.
         */
        type?: string | null;
    }
    /**
     * Represents a Dialogflow assist answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1DialogflowAssistAnswer {
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * An intent suggestion generated from conversation.
         */
        intentSuggestion?: Schema$GoogleCloudDialogflowV2beta1IntentSuggestion;
        /**
         * Result from v2 agent.
         */
        queryResult?: Schema$GoogleCloudDialogflowV2beta1QueryResult;
    }
    /**
     * A customer-managed encryption key specification that can be applied to all created resources (e.g. Conversation).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1EncryptionSpec {
        /**
         * Required. The name of customer-managed encryption key that is used to secure a resource and its sub-resources. If empty, the resource is secured by the default Google encryption key. Only the key in the same location as this resource is allowed to be used for encryption. Format: `projects/{project\}/locations/{location\}/keyRings/{keyRing\}/cryptoKeys/{key\}`
         */
        kmsKey?: string | null;
        /**
         * Immutable. The resource name of the encryption key specification resource. Format: projects/{project\}/locations/{location\}/encryptionSpec
         */
        name?: string | null;
    }
    /**
     * Each intent parameter has a type, called the entity type, which dictates exactly how data from an end-user expression is extracted. Dialogflow provides predefined system entities that can match many common types of data. For example, there are system entities for matching dates, times, colors, email addresses, and so on. You can also create your own custom entities for matching custom data. For example, you could define a vegetable entity that can match the types of vegetables available for purchase with a grocery store agent. For more information, see the [Entity guide](https://cloud.google.com/dialogflow/docs/entities-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1EntityType {
        /**
         * Optional. Indicates whether the entity type can be automatically expanded.
         */
        autoExpansionMode?: string | null;
        /**
         * Required. The name of the entity type.
         */
        displayName?: string | null;
        /**
         * Optional. Enables fuzzy entity extraction during classification.
         */
        enableFuzzyExtraction?: boolean | null;
        /**
         * Optional. The collection of entity entries associated with the entity type.
         */
        entities?: Schema$GoogleCloudDialogflowV2beta1EntityTypeEntity[];
        /**
         * Required. Indicates the kind of entity type.
         */
        kind?: string | null;
        /**
         * The unique identifier of the entity type. Required for EntityTypes.UpdateEntityType and EntityTypes.BatchUpdateEntityTypes methods. Supported formats: - `projects//agent/entityTypes/` - `projects//locations//agent/entityTypes/`
         */
        name?: string | null;
    }
    /**
     * An **entity entry** for an associated entity type.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1EntityTypeEntity {
        /**
         * Required. A collection of value synonyms. For example, if the entity type is *vegetable*, and `value` is *scallions*, a synonym could be *green onions*. For `KIND_LIST` entity types: * This collection must contain exactly one synonym equal to `value`.
         */
        synonyms?: string[] | null;
        /**
         * Required. The primary value associated with this entity entry. For example, if the entity type is *vegetable*, the value could be *scallions*. For `KIND_MAP` entity types: * A reference value to be used in place of synonyms. For `KIND_LIST` entity types: * A string that can contain references to other entity types (with or without aliases).
         */
        value?: string | null;
    }
    /**
     * Events allow for matching intents by event name instead of the natural language input. For instance, input `` can trigger a personalized welcome response. The parameter `name` may be used by the agent in the response: `"Hello #welcome_event.name! What can I do for you today?"`.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1EventInput {
        /**
         * Required. The language of this query. See [Language Support](https://cloud.google.com/dialogflow/docs/reference/language) for a list of the currently supported language codes. Note that queries in the same session do not necessarily need to specify the same language. This field is ignored when used in the context of a WebhookResponse.followup_event_input field, because the language was already defined in the originating detect intent request.
         */
        languageCode?: string | null;
        /**
         * Required. The unique identifier of the event.
         */
        name?: string | null;
        /**
         * The collection of parameters associated with the event. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * The response message for Agents.ExportAgent.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ExportAgentResponse {
        /**
         * Zip compressed raw byte content for agent.
         */
        agentContent?: string | null;
        /**
         * The URI to a file containing the exported agent. This field is populated only if `agent_uri` is specified in `ExportAgentRequest`.
         */
        agentUri?: string | null;
    }
    /**
     * Metadata related to the Export Data Operations (e.g. ExportDocument).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ExportOperationMetadata {
        /**
         * Cloud Storage file path of the exported data.
         */
        exportedGcsDestination?: Schema$GoogleCloudDialogflowV2beta1GcsDestination;
    }
    /**
     * Represents answer from "frequently asked questions".
     */
    export interface Schema$GoogleCloudDialogflowV2beta1FaqAnswer {
        /**
         * The piece of text from the `source` knowledge base document.
         */
        answer?: string | null;
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * The system's confidence score that this Knowledge answer is a good match for this conversational query, range from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * A map that contains metadata about the answer and the document from which it originates.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The corresponding FAQ question.
         */
        question?: string | null;
        /**
         * Indicates which Knowledge Document this answer was extracted from. Format: `projects//locations//agent/knowledgeBases//documents/`.
         */
        source?: string | null;
    }
    /**
     * Suggestion generated using free form generator.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1FreeFormSuggestion {
        /**
         * Required. Free form suggestion.
         */
        response?: string | null;
    }
    /**
     * Google Cloud Storage location for the output.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1GcsDestination {
        /**
         * Required. The Google Cloud Storage URIs for the output. A URI is of the form: `gs://bucket/object-prefix-or-name` Whether a prefix or name is used depends on the use case. The requesting user must have "write-permission" to the bucket.
         */
        uri?: string | null;
    }
    /**
     * The response message for Conversations.GenerateSuggestions.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1GenerateSuggestionsResponse {
        /**
         * The answers generated for the conversation based on context.
         */
        generatorSuggestionAnswers?: Schema$GoogleCloudDialogflowV2beta1GenerateSuggestionsResponseGeneratorSuggestionAnswer[];
        /**
         * The name of the latest conversation message used as context for compiling suggestion. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * A GeneratorSuggestion answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1GenerateSuggestionsResponseGeneratorSuggestionAnswer {
        /**
         * Answer record that uniquely identifies the suggestion. This can be used to provide suggestion feedback.
         */
        answerRecord?: string | null;
        /**
         * Suggestion details.
         */
        generatorSuggestion?: Schema$GoogleCloudDialogflowV2beta1GeneratorSuggestion;
        /**
         * The name of the generator used to generate this suggestion. Format: `projects//locations//generators/`.
         */
        sourceGenerator?: string | null;
    }
    /**
     * Suggestion generated using a Generator.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1GeneratorSuggestion {
        /**
         * Optional. Free form suggestion.
         */
        freeFormSuggestion?: Schema$GoogleCloudDialogflowV2beta1FreeFormSuggestion;
        /**
         * Optional. Suggested summary.
         */
        summarySuggestion?: Schema$GoogleCloudDialogflowV2beta1SummarySuggestion;
        /**
         * Optional. List of request and response for tool calls executed.
         */
        toolCallInfo?: Schema$GoogleCloudDialogflowV2beta1GeneratorSuggestionToolCallInfo[];
    }
    /**
     * Request and response for a tool call.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1GeneratorSuggestionToolCallInfo {
        /**
         * Required. Request for a tool call.
         */
        toolCall?: Schema$GoogleCloudDialogflowV2beta1ToolCall;
        /**
         * Required. Response for a tool call.
         */
        toolCallResult?: Schema$GoogleCloudDialogflowV2beta1ToolCallResult;
    }
    /**
     * Output only. Represents a notification sent to Pub/Sub subscribers for agent assistant events in a specific conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1HumanAgentAssistantEvent {
        /**
         * The conversation this notification refers to. Format: `projects//conversations/`.
         */
        conversation?: string | null;
        /**
         * The participant that the suggestion is compiled for. And This field is used to call Participants.ListSuggestions API. Format: `projects//conversations//participants/`. It will not be set in legacy workflow. HumanAgentAssistantConfig.name for more information.
         */
        participant?: string | null;
        /**
         * The suggestion results payload that this notification refers to. It will only be set when HumanAgentAssistantConfig.SuggestionConfig.group_suggestion_responses sets to true.
         */
        suggestionResults?: Schema$GoogleCloudDialogflowV2beta1SuggestionResult[];
    }
    /**
     * Response message for Documents.ImportDocuments.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ImportDocumentsResponse {
        /**
         * Includes details about skipped documents or any other warnings.
         */
        warnings?: Schema$GoogleRpcStatus[];
    }
    /**
     * Metadata for initializing a location-level encryption specification.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1InitializeEncryptionSpecMetadata {
        /**
         * Output only. The original request for initialization.
         */
        request?: Schema$GoogleCloudDialogflowV2beta1InitializeEncryptionSpecRequest;
    }
    /**
     * The request to initialize a location-level encryption specification.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1InitializeEncryptionSpecRequest {
        /**
         * Required. The encryption spec used for CMEK encryption. It is required that the kms key is in the same region as the endpoint. The same key will be used for all provisioned resources, if encryption is available. If the kms_key_name is left empty, no encryption will be enforced.
         */
        encryptionSpec?: Schema$GoogleCloudDialogflowV2beta1EncryptionSpec;
    }
    /**
     * An intent categorizes an end-user's intention for one conversation turn. For each agent, you define many intents, where your combined intents can handle a complete conversation. When an end-user writes or says something, referred to as an end-user expression or end-user input, Dialogflow matches the end-user input to the best intent in your agent. Matching an intent is also known as intent classification. For more information, see the [intent guide](https://cloud.google.com/dialogflow/docs/intents-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1Intent {
        /**
         * Optional. The name of the action associated with the intent. Note: The action name must not contain whitespaces.
         */
        action?: string | null;
        /**
         * Optional. The list of platforms for which the first responses will be copied from the messages in PLATFORM_UNSPECIFIED (i.e. default platform).
         */
        defaultResponsePlatforms?: string[] | null;
        /**
         * Required. The name of this intent.
         */
        displayName?: string | null;
        /**
         * Optional. Indicates that this intent ends an interaction. Some integrations (e.g., Actions on Google or Dialogflow phone gateway) use this information to close interaction with an end user. Default is false.
         */
        endInteraction?: boolean | null;
        /**
         * Optional. The collection of event names that trigger the intent. If the collection of input contexts is not empty, all of the contexts must be present in the active user session for an event to trigger this intent. Event names are limited to 150 characters.
         */
        events?: string[] | null;
        /**
         * Output only. Information about all followup intents that have this intent as a direct or indirect parent. We populate this field only in the output.
         */
        followupIntentInfo?: Schema$GoogleCloudDialogflowV2beta1IntentFollowupIntentInfo[];
        /**
         * Optional. The list of context names required for this intent to be triggered. Formats: - `projects//agent/sessions/-/contexts/` - `projects//locations//agent/sessions/-/contexts/`
         */
        inputContextNames?: string[] | null;
        /**
         * Optional. Indicates whether this is a fallback intent.
         */
        isFallback?: boolean | null;
        /**
         * Optional. Indicates that a live agent should be brought in to handle the interaction with the user. In most cases, when you set this flag to true, you would also want to set end_interaction to true as well. Default is false.
         */
        liveAgentHandoff?: boolean | null;
        /**
         * Optional. The collection of rich messages corresponding to the `Response` field in the Dialogflow console.
         */
        messages?: Schema$GoogleCloudDialogflowV2beta1IntentMessage[];
        /**
         * Optional. Indicates whether Machine Learning is disabled for the intent. Note: If `ml_disabled` setting is set to true, then this intent is not taken into account during inference in `ML ONLY` match mode. Also, auto-markup in the UI is turned off.
         */
        mlDisabled?: boolean | null;
        /**
         * Optional. Indicates whether Machine Learning is enabled for the intent. Note: If `ml_enabled` setting is set to false, then this intent is not taken into account during inference in `ML ONLY` match mode. Also, auto-markup in the UI is turned off. DEPRECATED! Please use `ml_disabled` field instead. NOTE: If both `ml_enabled` and `ml_disabled` are either not set or false, then the default value is determined as follows: - Before April 15th, 2018 the default is: ml_enabled = false / ml_disabled = true. - After April 15th, 2018 the default is: ml_enabled = true / ml_disabled = false.
         */
        mlEnabled?: boolean | null;
        /**
         * Optional. The unique identifier of this intent. Required for Intents.UpdateIntent and Intents.BatchUpdateIntents methods. Supported formats: - `projects//agent/intents/` - `projects//locations//agent/intents/`
         */
        name?: string | null;
        /**
         * Optional. The collection of contexts that are activated when the intent is matched. Context messages in this collection should not set the parameters field. Setting the `lifespan_count` to 0 will reset the context when the intent is matched. Format: `projects//agent/sessions/-/contexts/`.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2beta1Context[];
        /**
         * Optional. The collection of parameters associated with the intent.
         */
        parameters?: Schema$GoogleCloudDialogflowV2beta1IntentParameter[];
        /**
         * Optional. The unique identifier of the parent intent in the chain of followup intents. You can set this field when creating an intent, for example with CreateIntent or BatchUpdateIntents, in order to make this intent a followup intent. It identifies the parent followup intent. Format: `projects//agent/intents/`.
         */
        parentFollowupIntentName?: string | null;
        /**
         * Optional. The priority of this intent. Higher numbers represent higher priorities. - If the supplied value is unspecified or 0, the service translates the value to 500,000, which corresponds to the `Normal` priority in the console. - If the supplied value is negative, the intent is ignored in runtime detect intent requests.
         */
        priority?: number | null;
        /**
         * Optional. Indicates whether to delete all contexts in the current session when this intent is matched.
         */
        resetContexts?: boolean | null;
        /**
         * Output only. The unique identifier of the root intent in the chain of followup intents. It identifies the correct followup intents chain for this intent. Format: `projects//agent/intents/`.
         */
        rootFollowupIntentName?: string | null;
        /**
         * Optional. The collection of examples that the agent is trained on.
         */
        trainingPhrases?: Schema$GoogleCloudDialogflowV2beta1IntentTrainingPhrase[];
        /**
         * Optional. Indicates whether webhooks are enabled for the intent.
         */
        webhookState?: string | null;
    }
    /**
     * Represents a single followup intent in the chain.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentFollowupIntentInfo {
        /**
         * The unique identifier of the followup intent. Format: `projects//agent/intents/`.
         */
        followupIntentName?: string | null;
        /**
         * The unique identifier of the followup intent's parent. Format: `projects//agent/intents/`.
         */
        parentFollowupIntentName?: string | null;
    }
    /**
     * Corresponds to the `Response` field in the Dialogflow console.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessage {
        /**
         * Displays a basic card for Actions on Google.
         */
        basicCard?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCard;
        /**
         * Browse carousel card for Actions on Google.
         */
        browseCarouselCard?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCard;
        /**
         * Displays a card.
         */
        card?: Schema$GoogleCloudDialogflowV2beta1IntentMessageCard;
        /**
         * Displays a carousel card for Actions on Google.
         */
        carouselSelect?: Schema$GoogleCloudDialogflowV2beta1IntentMessageCarouselSelect;
        /**
         * Displays an image.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Displays a link out suggestion chip for Actions on Google.
         */
        linkOutSuggestion?: Schema$GoogleCloudDialogflowV2beta1IntentMessageLinkOutSuggestion;
        /**
         * Displays a list card for Actions on Google.
         */
        listSelect?: Schema$GoogleCloudDialogflowV2beta1IntentMessageListSelect;
        /**
         * The media content card for Actions on Google.
         */
        mediaContent?: Schema$GoogleCloudDialogflowV2beta1IntentMessageMediaContent;
        /**
         * A custom platform-specific response.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. The platform that this message is intended for.
         */
        platform?: string | null;
        /**
         * Displays quick replies.
         */
        quickReplies?: Schema$GoogleCloudDialogflowV2beta1IntentMessageQuickReplies;
        /**
         * Rich Business Messaging (RBM) carousel rich card response.
         */
        rbmCarouselRichCard?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCarouselCard;
        /**
         * Standalone Rich Business Messaging (RBM) rich card response.
         */
        rbmStandaloneRichCard?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmStandaloneCard;
        /**
         * Rich Business Messaging (RBM) text response. RBM allows businesses to send enriched and branded versions of SMS. See https://jibe.google.com/business-messaging.
         */
        rbmText?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmText;
        /**
         * Returns a voice or text-only response for Actions on Google.
         */
        simpleResponses?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSimpleResponses;
        /**
         * Displays suggestion chips for Actions on Google.
         */
        suggestions?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSuggestions;
        /**
         * Table card for Actions on Google.
         */
        tableCard?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCard;
        /**
         * Plays audio from a file in Telephony Gateway.
         */
        telephonyPlayAudio?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonyPlayAudio;
        /**
         * Synthesizes speech in Telephony Gateway.
         */
        telephonySynthesizeSpeech?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonySynthesizeSpeech;
        /**
         * Transfers the call in Telephony Gateway.
         */
        telephonyTransferCall?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonyTransferCall;
        /**
         * Returns a text response.
         */
        text?: Schema$GoogleCloudDialogflowV2beta1IntentMessageText;
    }
    /**
     * The basic card message. Useful for displaying information.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCard {
        /**
         * Optional. The collection of card buttons.
         */
        buttons?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCardButton[];
        /**
         * Required, unless image is present. The body text of the card.
         */
        formattedText?: string | null;
        /**
         * Optional. The image for the card.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Optional. The subtitle of the card.
         */
        subtitle?: string | null;
        /**
         * Optional. The title of the card.
         */
        title?: string | null;
    }
    /**
     * The button object that appears at the bottom of a card.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCardButton {
        /**
         * Required. Action to take when a user taps on the button.
         */
        openUriAction?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCardButtonOpenUriAction;
        /**
         * Required. The title of the button.
         */
        title?: string | null;
    }
    /**
     * Opens the given URI.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCardButtonOpenUriAction {
        /**
         * Required. The HTTP or HTTPS scheme URI.
         */
        uri?: string | null;
    }
    /**
     * Browse Carousel Card for Actions on Google. https://developers.google.com/actions/assistant/responses#browsing_carousel
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCard {
        /**
         * Optional. Settings for displaying the image. Applies to every image in items.
         */
        imageDisplayOptions?: string | null;
        /**
         * Required. List of items in the Browse Carousel Card. Minimum of two items, maximum of ten.
         */
        items?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCardBrowseCarouselCardItem[];
    }
    /**
     * Browsing carousel tile
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCardBrowseCarouselCardItem {
        /**
         * Optional. Description of the carousel item. Maximum of four lines of text.
         */
        description?: string | null;
        /**
         * Optional. Text that appears at the bottom of the Browse Carousel Card. Maximum of one line of text.
         */
        footer?: string | null;
        /**
         * Optional. Hero image for the carousel item.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Required. Action to present to the user.
         */
        openUriAction?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCardBrowseCarouselCardItemOpenUrlAction;
        /**
         * Required. Title of the carousel item. Maximum of two lines of text.
         */
        title?: string | null;
    }
    /**
     * Actions on Google action to open a given url.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageBrowseCarouselCardBrowseCarouselCardItemOpenUrlAction {
        /**
         * Required. URL
         */
        url?: string | null;
        /**
         * Optional. Specifies the type of viewer that is used when opening the URL. Defaults to opening via web browser.
         */
        urlTypeHint?: string | null;
    }
    /**
     * The card response message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageCard {
        /**
         * Optional. The collection of card buttons.
         */
        buttons?: Schema$GoogleCloudDialogflowV2beta1IntentMessageCardButton[];
        /**
         * Optional. The public URI to an image file for the card.
         */
        imageUri?: string | null;
        /**
         * Optional. The subtitle of the card.
         */
        subtitle?: string | null;
        /**
         * Optional. The title of the card.
         */
        title?: string | null;
    }
    /**
     * Optional. Contains information about a button.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageCardButton {
        /**
         * Optional. The text to send back to the Dialogflow API or a URI to open.
         */
        postback?: string | null;
        /**
         * Optional. The text to show on the button.
         */
        text?: string | null;
    }
    /**
     * The card for presenting a carousel of options to select from.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageCarouselSelect {
        /**
         * Required. Carousel items.
         */
        items?: Schema$GoogleCloudDialogflowV2beta1IntentMessageCarouselSelectItem[];
    }
    /**
     * An item in the carousel.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageCarouselSelectItem {
        /**
         * Optional. The body text of the card.
         */
        description?: string | null;
        /**
         * Optional. The image to display.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Required. Additional info about the option item.
         */
        info?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSelectItemInfo;
        /**
         * Required. Title of the carousel item.
         */
        title?: string | null;
    }
    /**
     * Column properties for TableCard.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageColumnProperties {
        /**
         * Required. Column heading.
         */
        header?: string | null;
        /**
         * Optional. Defines text alignment for all cells in this column.
         */
        horizontalAlignment?: string | null;
    }
    /**
     * The image response message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageImage {
        /**
         * A text description of the image to be used for accessibility, e.g., screen readers. Required if image_uri is set for CarouselSelect.
         */
        accessibilityText?: string | null;
        /**
         * Optional. The public URI to an image file.
         */
        imageUri?: string | null;
    }
    /**
     * The suggestion chip message that allows the user to jump out to the app or website associated with this agent.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageLinkOutSuggestion {
        /**
         * Required. The name of the app or site this chip is linking to.
         */
        destinationName?: string | null;
        /**
         * Required. The URI of the app or site to open when the user taps the suggestion chip.
         */
        uri?: string | null;
    }
    /**
     * The card for presenting a list of options to select from.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageListSelect {
        /**
         * Required. List items.
         */
        items?: Schema$GoogleCloudDialogflowV2beta1IntentMessageListSelectItem[];
        /**
         * Optional. Subtitle of the list.
         */
        subtitle?: string | null;
        /**
         * Optional. The overall title of the list.
         */
        title?: string | null;
    }
    /**
     * An item in the list.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageListSelectItem {
        /**
         * Optional. The main text describing the item.
         */
        description?: string | null;
        /**
         * Optional. The image to display.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Required. Additional information about this option.
         */
        info?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSelectItemInfo;
        /**
         * Required. The title of the list item.
         */
        title?: string | null;
    }
    /**
     * The media content card for Actions on Google.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageMediaContent {
        /**
         * Required. List of media objects.
         */
        mediaObjects?: Schema$GoogleCloudDialogflowV2beta1IntentMessageMediaContentResponseMediaObject[];
        /**
         * Optional. What type of media is the content (ie "audio").
         */
        mediaType?: string | null;
    }
    /**
     * Response media object for media content card.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageMediaContentResponseMediaObject {
        /**
         * Required. Url where the media is stored.
         */
        contentUrl?: string | null;
        /**
         * Optional. Description of media card.
         */
        description?: string | null;
        /**
         * Optional. Icon to display above media content.
         */
        icon?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Optional. Image to display above media content.
         */
        largeImage?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Required. Name of media card.
         */
        name?: string | null;
    }
    /**
     * The quick replies response message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageQuickReplies {
        /**
         * Optional. The collection of quick replies.
         */
        quickReplies?: string[] | null;
        /**
         * Optional. The title of the collection of quick replies.
         */
        title?: string | null;
    }
    /**
     * Rich Business Messaging (RBM) Card content
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCardContent {
        /**
         * Optional. Description of the card (at most 2000 bytes). At least one of the title, description or media must be set.
         */
        description?: string | null;
        /**
         * Optional. However at least one of the title, description or media must be set. Media (image, GIF or a video) to include in the card.
         */
        media?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCardContentRbmMedia;
        /**
         * Optional. List of suggestions to include in the card.
         */
        suggestions?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestion[];
        /**
         * Optional. Title of the card (at most 200 bytes). At least one of the title, description or media must be set.
         */
        title?: string | null;
    }
    /**
     * Rich Business Messaging (RBM) Media displayed in Cards The following media-types are currently supported: Image Types * image/jpeg * image/jpg' * image/gif * image/png Video Types * video/h263 * video/m4v * video/mp4 * video/mpeg * video/mpeg4 * video/webm
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCardContentRbmMedia {
        /**
         * Required. Publicly reachable URI of the file. The RBM platform determines the MIME type of the file from the content-type field in the HTTP headers when the platform fetches the file. The content-type field must be present and accurate in the HTTP response from the URL.
         */
        fileUri?: string | null;
        /**
         * Required for cards with vertical orientation. The height of the media within a rich card with a vertical layout. For a standalone card with horizontal layout, height is not customizable, and this field is ignored.
         */
        height?: string | null;
        /**
         * Optional. Publicly reachable URI of the thumbnail.If you don't provide a thumbnail URI, the RBM platform displays a blank placeholder thumbnail until the user's device downloads the file. Depending on the user's setting, the file may not download automatically and may require the user to tap a download button.
         */
        thumbnailUri?: string | null;
    }
    /**
     * Carousel Rich Business Messaging (RBM) rich card. Rich cards allow you to respond to users with more vivid content, e.g. with media and suggestions. If you want to show a single card with more control over the layout, please use RbmStandaloneCard instead.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCarouselCard {
        /**
         * Required. The cards in the carousel. A carousel must have at least 2 cards and at most 10.
         */
        cardContents?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCardContent[];
        /**
         * Required. The width of the cards in the carousel.
         */
        cardWidth?: string | null;
    }
    /**
     * Standalone Rich Business Messaging (RBM) rich card. Rich cards allow you to respond to users with more vivid content, e.g. with media and suggestions. You can group multiple rich cards into one using RbmCarouselCard but carousel cards will give you less control over the card layout.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmStandaloneCard {
        /**
         * Required. Card content.
         */
        cardContent?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmCardContent;
        /**
         * Required. Orientation of the card.
         */
        cardOrientation?: string | null;
        /**
         * Required if orientation is horizontal. Image preview alignment for standalone cards with horizontal layout.
         */
        thumbnailImageAlignment?: string | null;
    }
    /**
     * Rich Business Messaging (RBM) suggested client-side action that the user can choose from the card.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedAction {
        /**
         * Suggested client side action: Dial a phone number
         */
        dial?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionDial;
        /**
         * Suggested client side action: Open a URI on device
         */
        openUrl?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionOpenUri;
        /**
         * Opaque payload that the Dialogflow receives in a user event when the user taps the suggested action. This data will be also forwarded to webhook to allow performing custom business logic.
         */
        postbackData?: string | null;
        /**
         * Suggested client side action: Share user location
         */
        shareLocation?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionShareLocation;
        /**
         * Text to display alongside the action.
         */
        text?: string | null;
    }
    /**
     * Opens the user's default dialer app with the specified phone number but does not dial automatically.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionDial {
        /**
         * Required. The phone number to fill in the default dialer app. This field should be in [E.164](https://en.wikipedia.org/wiki/E.164) format. An example of a correctly formatted phone number: +15556767888.
         */
        phoneNumber?: string | null;
    }
    /**
     * Opens the user's default web browser app to the specified uri If the user has an app installed that is registered as the default handler for the URL, then this app will be opened instead, and its icon will be used in the suggested action UI.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionOpenUri {
        /**
         * Required. The uri to open on the user device
         */
        uri?: string | null;
    }
    /**
     * Opens the device's location chooser so the user can pick a location to send back to the agent.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedActionRbmSuggestedActionShareLocation {
    }
    /**
     * Rich Business Messaging (RBM) suggested reply that the user can click instead of typing in their own response.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedReply {
        /**
         * Opaque payload that the Dialogflow receives in a user event when the user taps the suggested reply. This data will be also forwarded to webhook to allow performing custom business logic.
         */
        postbackData?: string | null;
        /**
         * Suggested reply text.
         */
        text?: string | null;
    }
    /**
     * Rich Business Messaging (RBM) suggestion. Suggestions allow user to easily select/click a predefined response or perform an action (like opening a web uri).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestion {
        /**
         * Predefined client side actions that user can choose
         */
        action?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedAction;
        /**
         * Predefined replies for user to select instead of typing
         */
        reply?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestedReply;
    }
    /**
     * Rich Business Messaging (RBM) text response with suggestions.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmText {
        /**
         * Optional. One or more suggestions to show to the user.
         */
        rbmSuggestion?: Schema$GoogleCloudDialogflowV2beta1IntentMessageRbmSuggestion[];
        /**
         * Required. Text sent and displayed to the user.
         */
        text?: string | null;
    }
    /**
     * Additional info about the select item for when it is triggered in a dialog.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageSelectItemInfo {
        /**
         * Required. A unique key that will be sent back to the agent if this response is given.
         */
        key?: string | null;
        /**
         * Optional. A list of synonyms that can also be used to trigger this item in dialog.
         */
        synonyms?: string[] | null;
    }
    /**
     * The simple response message containing speech or text.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageSimpleResponse {
        /**
         * Optional. The text to display.
         */
        displayText?: string | null;
        /**
         * One of text_to_speech or ssml must be provided. Structured spoken response to the user in the SSML format. Mutually exclusive with text_to_speech.
         */
        ssml?: string | null;
        /**
         * One of text_to_speech or ssml must be provided. The plain text of the speech output. Mutually exclusive with ssml.
         */
        textToSpeech?: string | null;
    }
    /**
     * The collection of simple response candidates. This message in `QueryResult.fulfillment_messages` and `WebhookResponse.fulfillment_messages` should contain only one `SimpleResponse`.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageSimpleResponses {
        /**
         * Required. The list of simple responses.
         */
        simpleResponses?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSimpleResponse[];
    }
    /**
     * The suggestion chip message that the user can tap to quickly post a reply to the conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageSuggestion {
        /**
         * Required. The text shown the in the suggestion chip.
         */
        title?: string | null;
    }
    /**
     * The collection of suggestions.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageSuggestions {
        /**
         * Required. The list of suggested replies.
         */
        suggestions?: Schema$GoogleCloudDialogflowV2beta1IntentMessageSuggestion[];
    }
    /**
     * Table card for Actions on Google.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCard {
        /**
         * Optional. List of buttons for the card.
         */
        buttons?: Schema$GoogleCloudDialogflowV2beta1IntentMessageBasicCardButton[];
        /**
         * Optional. Display properties for the columns in this table.
         */
        columnProperties?: Schema$GoogleCloudDialogflowV2beta1IntentMessageColumnProperties[];
        /**
         * Optional. Image which should be displayed on the card.
         */
        image?: Schema$GoogleCloudDialogflowV2beta1IntentMessageImage;
        /**
         * Optional. Rows in this table of data.
         */
        rows?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCardRow[];
        /**
         * Optional. Subtitle to the title.
         */
        subtitle?: string | null;
        /**
         * Required. Title of the card.
         */
        title?: string | null;
    }
    /**
     * Cell of TableCardRow.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCardCell {
        /**
         * Required. Text in this cell.
         */
        text?: string | null;
    }
    /**
     * Row of TableCard.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCardRow {
        /**
         * Optional. List of cells that make up this row.
         */
        cells?: Schema$GoogleCloudDialogflowV2beta1IntentMessageTableCardCell[];
        /**
         * Optional. Whether to add a visual divider after this row.
         */
        dividerAfter?: boolean | null;
    }
    /**
     * Plays audio from a file in Telephony Gateway.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonyPlayAudio {
        /**
         * Required. URI to a Google Cloud Storage object containing the audio to play, e.g., "gs://bucket/object". The object must contain a single channel (mono) of linear PCM audio (2 bytes / sample) at 8kHz. This object must be readable by the `service-@gcp-sa-dialogflow.iam.gserviceaccount.com` service account where is the number of the Telephony Gateway project (usually the same as the Dialogflow agent project). If the Google Cloud Storage bucket is in the Telephony Gateway project, this permission is added by default when enabling the Dialogflow V2 API. For audio from other sources, consider using the `TelephonySynthesizeSpeech` message with SSML.
         */
        audioUri?: string | null;
    }
    /**
     * Synthesizes speech and plays back the synthesized audio to the caller in Telephony Gateway. Telephony Gateway takes the synthesizer settings from `DetectIntentResponse.output_audio_config` which can either be set at request-level or can come from the agent-level synthesizer config.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonySynthesizeSpeech {
        /**
         * The SSML to be synthesized. For more information, see [SSML](https://developers.google.com/actions/reference/ssml).
         */
        ssml?: string | null;
        /**
         * The raw text to be synthesized.
         */
        text?: string | null;
    }
    /**
     * Transfers the call in Telephony Gateway.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageTelephonyTransferCall {
        /**
         * Required. The phone number to transfer the call to in [E.164 format](https://en.wikipedia.org/wiki/E.164). We currently only allow transferring to US numbers (+1xxxyyyzzzz).
         */
        phoneNumber?: string | null;
    }
    /**
     * The text response message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentMessageText {
        /**
         * Optional. The collection of the agent's responses.
         */
        text?: string[] | null;
    }
    /**
     * Represents intent parameters.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentParameter {
        /**
         * Optional. The default value to use when the `value` yields an empty result. Default values can be extracted from contexts by using the following syntax: `#context_name.parameter_name`.
         */
        defaultValue?: string | null;
        /**
         * Required. The name of the parameter.
         */
        displayName?: string | null;
        /**
         * Optional. The name of the entity type, prefixed with `@`, that describes values of the parameter. If the parameter is required, this must be provided.
         */
        entityTypeDisplayName?: string | null;
        /**
         * Optional. Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Optional. Indicates whether the parameter is required. That is, whether the intent cannot be completed without collecting the parameter value.
         */
        mandatory?: boolean | null;
        /**
         * The unique identifier of this parameter.
         */
        name?: string | null;
        /**
         * Optional. The collection of prompts that the agent can present to the user in order to collect a value for the parameter.
         */
        prompts?: string[] | null;
        /**
         * Optional. The definition of the parameter value. It can be: - a constant string, - a parameter value defined as `$parameter_name`, - an original parameter value defined as `$parameter_name.original`, - a parameter value from some context defined as `#context_name.parameter_name`.
         */
        value?: string | null;
    }
    /**
     * Represents an intent suggestion.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentSuggestion {
        /**
         * Human readable description for better understanding an intent like its scope, content, result etc. Maximum character limit: 140 characters.
         */
        description?: string | null;
        /**
         * The display name of the intent.
         */
        displayName?: string | null;
        /**
         * The unique identifier of this intent. Format: `projects//locations//agent/intents/`.
         */
        intentV2?: string | null;
    }
    /**
     * Represents an example that the agent is trained on.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentTrainingPhrase {
        /**
         * Output only. The unique identifier of this training phrase.
         */
        name?: string | null;
        /**
         * Required. The ordered list of training phrase parts. The parts are concatenated in order to form the training phrase. Note: The API does not automatically annotate training phrases like the Dialogflow Console does. Note: Do not forget to include whitespace at part boundaries, so the training phrase is well formatted when the parts are concatenated. If the training phrase does not need to be annotated with parameters, you just need a single part with only the Part.text field set. If you want to annotate the training phrase, you must create multiple parts, where the fields of each part are populated in one of two ways: - `Part.text` is set to a part of the phrase that has no parameters. - `Part.text` is set to a part of the phrase that you want to annotate, and the `entity_type`, `alias`, and `user_defined` fields are all set.
         */
        parts?: Schema$GoogleCloudDialogflowV2beta1IntentTrainingPhrasePart[];
        /**
         * Optional. Indicates how many times this example was added to the intent. Each time a developer adds an existing sample by editing an intent or training, this counter is increased.
         */
        timesAddedCount?: number | null;
        /**
         * Required. The type of the training phrase.
         */
        type?: string | null;
    }
    /**
     * Represents a part of a training phrase.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1IntentTrainingPhrasePart {
        /**
         * Optional. The parameter name for the value extracted from the annotated part of the example. This field is required for annotated parts of the training phrase.
         */
        alias?: string | null;
        /**
         * Optional. The entity type name prefixed with `@`. This field is required for annotated parts of the training phrase.
         */
        entityType?: string | null;
        /**
         * Required. The text for this part.
         */
        text?: string | null;
        /**
         * Optional. Indicates whether the text was manually annotated. This field is set to true when the Dialogflow Console is used to manually annotate the part. When creating an annotated part with the API, you must set this to true.
         */
        userDefined?: boolean | null;
    }
    /**
     * Represents the result of querying a Knowledge base.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAnswers {
        /**
         * A list of answers from Knowledge Connector.
         */
        answers?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAnswersAnswer[];
    }
    /**
     * An answer from Knowledge Connector.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAnswersAnswer {
        /**
         * The piece of text from the `source` knowledge base document that answers this conversational query.
         */
        answer?: string | null;
        /**
         * The corresponding FAQ question if the answer was extracted from a FAQ Document, empty otherwise.
         */
        faqQuestion?: string | null;
        /**
         * The system's confidence score that this Knowledge answer is a good match for this conversational query. The range is from 0.0 (completely uncertain) to 1.0 (completely certain). Note: The confidence score is likely to vary somewhat (possibly even for identical requests), as the underlying model is under constant improvement. It may be deprecated in the future. We recommend using `match_confidence_level` which should be generally more stable.
         */
        matchConfidence?: number | null;
        /**
         * The system's confidence level that this knowledge answer is a good match for this conversational query. NOTE: The confidence level for a given `` pair may change without notice, as it depends on models that are constantly being improved. However, it will change less frequently than the confidence score below, and should be preferred for referencing the quality of an answer.
         */
        matchConfidenceLevel?: string | null;
        /**
         * Indicates which Knowledge Document this answer was extracted from. Format: `projects//knowledgeBases//documents/`.
         */
        source?: string | null;
    }
    /**
     * Represents a Knowledge Assist answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswer {
        /**
         * The name of the answer record. Format: `projects//locations//answer Records/`.
         */
        answerRecord?: string | null;
        /**
         * The query suggested based on the context. Suggestion is made only if it is different from the previous suggestion.
         */
        suggestedQuery?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerSuggestedQuery;
        /**
         * The answer generated for the suggested query. Whether or not an answer is generated depends on how confident we are about the generated query.
         */
        suggestedQueryAnswer?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswer;
    }
    /**
     * Represents an answer from Knowledge. Currently supports FAQ and Generative answers.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswer {
        /**
         * The piece of text from the `source` that answers this suggested query.
         */
        answerText?: string | null;
        /**
         * Populated if the prediction came from FAQ.
         */
        faqSource?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerFaqSource;
        /**
         * Populated if the prediction was Generative.
         */
        generativeSource?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerGenerativeSource;
    }
    /**
     * Details about source of FAQ answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerFaqSource {
        /**
         * The corresponding FAQ question.
         */
        question?: string | null;
    }
    /**
     * Details about source of Generative answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerGenerativeSource {
        /**
         * All snippets used for this Generative Prediction, with their source URI and data.
         */
        snippets?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerGenerativeSourceSnippet[];
    }
    /**
     * Snippet Source for a Generative Prediction.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerKnowledgeAnswerGenerativeSourceSnippet {
        /**
         * Metadata of the document.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Text taken from that URI.
         */
        text?: string | null;
        /**
         * Title of the document.
         */
        title?: string | null;
        /**
         * URI the data is sourced from.
         */
        uri?: string | null;
    }
    /**
     * Represents a suggested query.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswerSuggestedQuery {
        /**
         * Suggested query text.
         */
        queryText?: string | null;
    }
    /**
     * Metadata in google::longrunning::Operation for Knowledge operations.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1KnowledgeOperationMetadata {
        /**
         * Metadata for the Export Data Operation such as the destination of export.
         */
        exportOperationMetadata?: Schema$GoogleCloudDialogflowV2beta1ExportOperationMetadata;
        /**
         * The name of the knowledge base interacted with during the operation.
         */
        knowledgeBase?: string | null;
        /**
         * Required. Output only. The current state of this operation.
         */
        state?: string | null;
    }
    /**
     * Represents a message posted into a conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1Message {
        /**
         * Required. The message content.
         */
        content?: string | null;
        /**
         * Output only. The time when the message was created in Contact Center AI.
         */
        createTime?: string | null;
        /**
         * Optional. The message language. This should be a [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) language tag. Example: "en-US".
         */
        languageCode?: string | null;
        /**
         * Output only. The annotation for the message.
         */
        messageAnnotation?: Schema$GoogleCloudDialogflowV2beta1MessageAnnotation;
        /**
         * Optional. The unique identifier of the message. Format: `projects//locations//conversations//messages/`.
         */
        name?: string | null;
        /**
         * Output only. The participant that sends this message.
         */
        participant?: string | null;
        /**
         * Output only. The role of the participant.
         */
        participantRole?: string | null;
        /**
         * Optional. Automated agent responses.
         */
        responseMessages?: Schema$GoogleCloudDialogflowV2beta1ResponseMessage[];
        /**
         * Optional. The time when the message was sent. For voice messages, this is the time when an utterance started.
         */
        sendTime?: string | null;
        /**
         * Output only. The sentiment analysis result for the message.
         */
        sentimentAnalysis?: Schema$GoogleCloudDialogflowV2beta1SentimentAnalysisResult;
    }
    /**
     * Represents the result of annotation for the message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1MessageAnnotation {
        /**
         * Required. Indicates whether the text message contains entities.
         */
        containEntities?: boolean | null;
        /**
         * Optional. The collection of annotated message parts ordered by their position in the message. You can recover the annotated message by concatenating [AnnotatedMessagePart.text].
         */
        parts?: Schema$GoogleCloudDialogflowV2beta1AnnotatedMessagePart[];
    }
    /**
     * Represents the contents of the original request that was passed to the `[Streaming]DetectIntent` call.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1OriginalDetectIntentRequest {
        /**
         * Optional. This field is set to the value of the `QueryParameters.payload` field passed in the request. Some integrations that query a Dialogflow agent may provide additional information in the payload. In particular, for the Dialogflow Phone Gateway integration, this field has the form: { "telephony": { "caller_id": "+18558363987" \} \} Note: The caller ID field (`caller_id`) will be redacted for Trial Edition agents and populated with the caller ID in [E.164 format](https://en.wikipedia.org/wiki/E.164) for Essentials Edition agents.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * The source of this request, e.g., `google`, `facebook`, `slack`. It is set by Dialogflow-owned servers.
         */
        source?: string | null;
        /**
         * Optional. The version of the protocol used for this request. This field is AoG-specific.
         */
        version?: string | null;
    }
    /**
     * Represents the result of conversational query or event processing.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1QueryResult {
        /**
         * The action name from the matched intent.
         */
        action?: string | null;
        /**
         * This field is set to: - `false` if the matched intent has required parameters and not all of the required parameter values have been collected. - `true` if all required parameter values have been collected, or if the matched intent doesn't contain any required parameters.
         */
        allRequiredParamsPresent?: boolean | null;
        /**
         * Indicates whether the conversational query triggers a cancellation for slot filling. For more information, see the [cancel slot filling documentation](https://cloud.google.com/dialogflow/es/docs/intents-actions-parameters#cancel).
         */
        cancelsSlotFilling?: boolean | null;
        /**
         * Free-form diagnostic information for the associated detect intent request. The fields of this data can change without notice, so you should not write code that depends on its structure. The data may contain: - webhook call latency - webhook errors
         */
        diagnosticInfo?: {
            [key: string]: any;
        } | null;
        /**
         * The collection of rich messages to present to the user.
         */
        fulfillmentMessages?: Schema$GoogleCloudDialogflowV2beta1IntentMessage[];
        /**
         * The text to be pronounced to the user or shown on the screen. Note: This is a legacy field, `fulfillment_messages` should be preferred.
         */
        fulfillmentText?: string | null;
        /**
         * The intent that matched the conversational query. Some, not all fields are filled in this message, including but not limited to: `name`, `display_name`, `end_interaction` and `is_fallback`.
         */
        intent?: Schema$GoogleCloudDialogflowV2beta1Intent;
        /**
         * The intent detection confidence. Values range from 0.0 (completely uncertain) to 1.0 (completely certain). This value is for informational purpose only and is only used to help match the best intent within the classification threshold. This value may change for the same end-user expression at any time due to a model retraining or change in implementation. If there are `multiple knowledge_answers` messages, this value is set to the greatest `knowledgeAnswers.match_confidence` value in the list.
         */
        intentDetectionConfidence?: number | null;
        /**
         * The result from Knowledge Connector (if any), ordered by decreasing `KnowledgeAnswers.match_confidence`.
         */
        knowledgeAnswers?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAnswers;
        /**
         * The language that was triggered during intent detection. See [Language Support](https://cloud.google.com/dialogflow/docs/reference/language) for a list of the currently supported language codes.
         */
        languageCode?: string | null;
        /**
         * The collection of output contexts. If applicable, `output_contexts.parameters` contains entries with name `.original` containing the original parameter values before the query.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2beta1Context[];
        /**
         * The collection of extracted parameters. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * The original conversational query text: - If natural language text was provided as input, `query_text` contains a copy of the input. - If natural language speech audio was provided as input, `query_text` contains the speech recognition result. If speech recognizer produced multiple alternatives, a particular one is picked. - If automatic spell correction is enabled, `query_text` will contain the corrected user input.
         */
        queryText?: string | null;
        /**
         * The sentiment analysis result, which depends on the `sentiment_analysis_request_config` specified in the request.
         */
        sentimentAnalysisResult?: Schema$GoogleCloudDialogflowV2beta1SentimentAnalysisResult;
        /**
         * The Speech recognition confidence between 0.0 and 1.0. A higher number indicates an estimated greater likelihood that the recognized words are correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is not guaranteed to be accurate or set. In particular this field isn't set for StreamingDetectIntent since the streaming endpoint has separate confidence estimates per portion of the audio in StreamingRecognitionResult.
         */
        speechRecognitionConfidence?: number | null;
        /**
         * If the query was fulfilled by a webhook call, this field is set to the value of the `payload` field returned in the webhook response.
         */
        webhookPayload?: {
            [key: string]: any;
        } | null;
        /**
         * If the query was fulfilled by a webhook call, this field is set to the value of the `source` field returned in the webhook response.
         */
        webhookSource?: string | null;
    }
    /**
     * Response messages from an automated agent.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessage {
        /**
         * A signal that indicates the interaction with the Dialogflow agent has ended.
         */
        endInteraction?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageEndInteraction;
        /**
         * Hands off conversation to a live agent.
         */
        liveAgentHandoff?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageLiveAgentHandoff;
        /**
         * An audio response message composed of both the synthesized Dialogflow agent responses and the audios hosted in places known to the client.
         */
        mixedAudio?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageMixedAudio;
        /**
         * Returns a response containing a custom, platform-specific payload.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * A signal that the client should transfer the phone call connected to this agent to a third-party endpoint.
         */
        telephonyTransferCall?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageTelephonyTransferCall;
        /**
         * Returns a text response.
         */
        text?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageText;
    }
    /**
     * Indicates that interaction with the Dialogflow agent has ended.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageEndInteraction {
    }
    /**
     * Indicates that the conversation should be handed off to a human agent. Dialogflow only uses this to determine which conversations were handed off to a human agent for measurement purposes. What else to do with this signal is up to you and your handoff procedures. You may set this, for example: * In the entry fulfillment of a Dialogflow CX Page if entering the page indicates something went extremely wrong in the conversation. * In a webhook response when you determine that the customer issue can only be handled by a human.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageLiveAgentHandoff {
        /**
         * Custom metadata for your handoff procedure. Dialogflow doesn't impose any structure on this.
         */
        metadata?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents an audio message that is composed of both segments synthesized from the Dialogflow agent prompts and ones hosted externally at the specified URIs.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageMixedAudio {
        /**
         * Segments this audio response is composed of.
         */
        segments?: Schema$GoogleCloudDialogflowV2beta1ResponseMessageMixedAudioSegment[];
    }
    /**
     * Represents one segment of audio.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageMixedAudioSegment {
        /**
         * Whether the playback of this segment can be interrupted by the end user's speech and the client should then start the next Dialogflow request.
         */
        allowPlaybackInterruption?: boolean | null;
        /**
         * Raw audio synthesized from the Dialogflow agent's response using the output config specified in the request.
         */
        audio?: string | null;
        /**
         * Client-specific URI that points to an audio clip accessible to the client.
         */
        uri?: string | null;
    }
    /**
     * Represents the signal that telles the client to transfer the phone call connected to the agent to a third-party endpoint.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageTelephonyTransferCall {
        /**
         * Transfer the call to a phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164).
         */
        phoneNumber?: string | null;
        /**
         * Transfer the call to a SIP endpoint.
         */
        sipUri?: string | null;
    }
    /**
     * The text response message.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ResponseMessageText {
        /**
         * A collection of text response variants. If multiple variants are defined, only one text response variant is returned at runtime.
         */
        text?: string[] | null;
    }
    /**
     * The sentiment, such as positive/negative feeling or association, for a unit of analysis, such as the query text. See: https://cloud.google.com/natural-language/docs/basics#interpreting_sentiment_analysis_values for how to interpret the result.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1Sentiment {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment, regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
    }
    /**
     * The result of sentiment analysis. Sentiment analysis inspects user input and identifies the prevailing subjective opinion, especially to determine a user's attitude as positive, negative, or neutral. For Participants.DetectIntent, it needs to be configured in DetectIntentRequest.query_params. For Participants.StreamingDetectIntent, it needs to be configured in StreamingDetectIntentRequest.query_params. And for Participants.AnalyzeContent and Participants.StreamingAnalyzeContent, it needs to be configured in ConversationProfile.human_agent_assistant_config
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SentimentAnalysisResult {
        /**
         * The sentiment analysis result for `query_text`.
         */
        queryTextSentiment?: Schema$GoogleCloudDialogflowV2beta1Sentiment;
    }
    /**
     * A session represents a conversation between a Dialogflow agent and an end-user. You can create special entities, called session entities, during a session. Session entities can extend or replace custom entity types and only exist during the session that they were created for. All session data, including session entities, is stored by Dialogflow for 20 minutes. For more information, see the [session entity guide](https://cloud.google.com/dialogflow/docs/entities-session).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SessionEntityType {
        /**
         * Required. The collection of entities associated with this session entity type.
         */
        entities?: Schema$GoogleCloudDialogflowV2beta1EntityTypeEntity[];
        /**
         * Required. Indicates whether the additional data should override or supplement the custom entity type definition.
         */
        entityOverrideMode?: string | null;
        /**
         * Required. The unique identifier of this session entity type. Supported formats: - `projects//agent/sessions//entityTypes/` - `projects//locations//agent/sessions//entityTypes/` - `projects//agent/environments//users//sessions//entityTypes/` - `projects//locations//agent/environments/ /users//sessions//entityTypes/` If `Location ID` is not specified we assume default 'us' location. If `Environment ID` is not specified, we assume default 'draft' environment. If `User ID` is not specified, we assume default '-' user. `` must be the display name of an existing entity type in the same agent that will be overridden or supplemented.
         */
        name?: string | null;
    }
    /**
     * Metadata for a ConversationProfile.SetSuggestionFeatureConfig operation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SetSuggestionFeatureConfigOperationMetadata {
        /**
         * The resource name of the conversation profile. Format: `projects//locations//conversationProfiles/`
         */
        conversationProfile?: string | null;
        /**
         * Timestamp whe the request was created. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * Required. The participant role to add or update the suggestion feature config. Only HUMAN_AGENT or END_USER can be used.
         */
        participantRole?: string | null;
        /**
         * Required. The type of the suggestion feature to add or update.
         */
        suggestionFeatureType?: string | null;
    }
    /**
     * Represents a smart reply answer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SmartReplyAnswer {
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * Smart reply confidence. The system's confidence score that this reply is a good match for this conversation, as a value from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * The content of the reply.
         */
        reply?: string | null;
    }
    /**
     * Information for a word recognized by the speech recognizer.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SpeechWordInfo {
        /**
         * The Speech confidence between 0.0 and 1.0 for this word. A higher number indicates an estimated greater likelihood that the recognized word is correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is not guaranteed to be fully stable over time for the same audio input. Users should also not rely on it to always be provided.
         */
        confidence?: number | null;
        /**
         * Time offset relative to the beginning of the audio that corresponds to the end of the spoken word. This is an experimental feature and the accuracy of the time offset can vary.
         */
        endOffset?: string | null;
        /**
         * Time offset relative to the beginning of the audio that corresponds to the start of the spoken word. This is an experimental feature and the accuracy of the time offset can vary.
         */
        startOffset?: string | null;
        /**
         * The word this info is for.
         */
        word?: string | null;
    }
    /**
     * Contains a speech recognition result corresponding to a portion of the audio that is currently being processed or an indication that this is the end of the single requested utterance. While end-user audio is being processed, Dialogflow sends a series of results. Each result may contain a `transcript` value. A transcript represents a portion of the utterance. While the recognizer is processing audio, transcript values may be interim values or finalized values. Once a transcript is finalized, the `is_final` value is set to true and processing continues for the next transcript. If `StreamingDetectIntentRequest.query_input.audio_config.single_utterance` was true, and the recognizer has completed processing audio, the `message_type` value is set to `END_OF_SINGLE_UTTERANCE and the following (last) result contains the last finalized transcript. The complete end-user utterance is determined by concatenating the finalized transcript values received for the series of results. In the following example, single utterance is enabled. In the case where single utterance is not enabled, result 7 would not occur. ``` Num | transcript | message_type | is_final --- | ----------------------- | ----------------------- | -------- 1 | "tube" | TRANSCRIPT | false 2 | "to be a" | TRANSCRIPT | false 3 | "to be" | TRANSCRIPT | false 4 | "to be or not to be" | TRANSCRIPT | true 5 | "that's" | TRANSCRIPT | false 6 | "that is | TRANSCRIPT | false 7 | unset | END_OF_SINGLE_UTTERANCE | unset 8 | " that is the question" | TRANSCRIPT | true ``` Concatenating the finalized transcripts with `is_final` set to true, the complete utterance becomes "to be or not to be that is the question".
     */
    export interface Schema$GoogleCloudDialogflowV2beta1StreamingRecognitionResult {
        /**
         * The Speech confidence between 0.0 and 1.0 for the current portion of audio. A higher number indicates an estimated greater likelihood that the recognized words are correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is typically only provided if `is_final` is true and you should not rely on it being accurate or even set.
         */
        confidence?: number | null;
        /**
         * DTMF digits. Populated if and only if `message_type` = `DTMF_DIGITS`.
         */
        dtmfDigits?: Schema$GoogleCloudDialogflowV2beta1TelephonyDtmfEvents;
        /**
         * If `false`, the `StreamingRecognitionResult` represents an interim result that may change. If `true`, the recognizer will not return any further hypotheses about this piece of the audio. May only be populated for `message_type` = `TRANSCRIPT`.
         */
        isFinal?: boolean | null;
        /**
         * Detected language code for the transcript.
         */
        languageCode?: string | null;
        /**
         * Type of the result message.
         */
        messageType?: string | null;
        /**
         * Time offset of the end of this Speech recognition result relative to the beginning of the audio. Only populated for `message_type` = `TRANSCRIPT`.
         */
        speechEndOffset?: string | null;
        /**
         * Word-specific information for the words recognized by Speech in transcript. Populated if and only if `message_type` = `TRANSCRIPT` and [InputAudioConfig.enable_word_info] is set.
         */
        speechWordInfo?: Schema$GoogleCloudDialogflowV2beta1SpeechWordInfo[];
        /**
         * An estimate of the likelihood that the speech recognizer will not change its guess about this interim recognition result: * If the value is unspecified or 0.0, Dialogflow didn't compute the stability. In particular, Dialogflow will only provide stability for `TRANSCRIPT` results with `is_final = false`. * Otherwise, the value is in (0.0, 1.0] where 0.0 means completely unstable and 1.0 means completely stable.
         */
        stability?: number | null;
        /**
         * Transcript text representing the words that the user spoke. Populated if and only if `message_type` = `TRANSCRIPT`.
         */
        transcript?: string | null;
    }
    /**
     * The response message for Participants.SuggestArticles.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestArticlesResponse {
        /**
         * Output only. Articles ordered by score in descending order.
         */
        articleAnswers?: Schema$GoogleCloudDialogflowV2beta1ArticleAnswer[];
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestArticlesResponse.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * The response message for Participants.SuggestDialogflowAssists.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestDialogflowAssistsResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestDialogflowAssistsRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * Output only. Multiple reply options provided by Dialogflow assist service. The order is based on the rank of the model prediction.
         */
        dialogflowAssistAnswers?: Schema$GoogleCloudDialogflowV2beta1DialogflowAssistAnswer[];
        /**
         * The name of the latest conversation message used to suggest answer. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * The request message for Participants.SuggestFaqAnswers.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestFaqAnswersResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestFaqAnswersRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * Output only. Answers extracted from FAQ documents.
         */
        faqAnswers?: Schema$GoogleCloudDialogflowV2beta1FaqAnswer[];
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * One response of different type of suggestion response which is used in the response of Participants.AnalyzeContent and Participants.AnalyzeContent, as well as HumanAgentAssistantEvent.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestionResult {
        /**
         * Error status if the request failed.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Suggestions generated using generators triggered by customer or agent messages.
         */
        generateSuggestionsResponse?: Schema$GoogleCloudDialogflowV2beta1GenerateSuggestionsResponse;
        /**
         * SuggestArticlesResponse if request is for ARTICLE_SUGGESTION.
         */
        suggestArticlesResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestArticlesResponse;
        /**
         * SuggestDialogflowAssistsResponse if request is for DIALOGFLOW_ASSIST.
         */
        suggestDialogflowAssistsResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestDialogflowAssistsResponse;
        /**
         * SuggestDialogflowAssistsResponse if request is for ENTITY_EXTRACTION.
         */
        suggestEntityExtractionResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestDialogflowAssistsResponse;
        /**
         * SuggestFaqAnswersResponse if request is for FAQ_ANSWER.
         */
        suggestFaqAnswersResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestFaqAnswersResponse;
        /**
         * SuggestKnowledgeAssistResponse if request is for KNOWLEDGE_ASSIST.
         */
        suggestKnowledgeAssistResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestKnowledgeAssistResponse;
        /**
         * SuggestSmartRepliesResponse if request is for SMART_REPLY.
         */
        suggestSmartRepliesResponse?: Schema$GoogleCloudDialogflowV2beta1SuggestSmartRepliesResponse;
    }
    /**
     * The response message for Participants.SuggestKnowledgeAssist.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestKnowledgeAssistResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestKnowledgeAssistRequest.context_size field in the request if there are fewer messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * Output only. Knowledge Assist suggestion.
         */
        knowledgeAssistAnswer?: Schema$GoogleCloudDialogflowV2beta1KnowledgeAssistAnswer;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * The response message for Participants.SuggestSmartReplies.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SuggestSmartRepliesResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestSmartRepliesRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
        /**
         * Output only. Multiple reply options provided by smart reply service. The order is based on the rank of the model prediction. The maximum number of the returned replies is set in SmartReplyConfig.
         */
        smartReplyAnswers?: Schema$GoogleCloudDialogflowV2beta1SmartReplyAnswer[];
    }
    /**
     * Suggested summary of the conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SummarySuggestion {
        /**
         * Required. All the parts of generated summary.
         */
        summarySections?: Schema$GoogleCloudDialogflowV2beta1SummarySuggestionSummarySection[];
    }
    /**
     * A component of the generated summary.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1SummarySuggestionSummarySection {
        /**
         * Required. Name of the section.
         */
        section?: string | null;
        /**
         * Required. Summary text for the section.
         */
        summary?: string | null;
    }
    /**
     * A wrapper of repeated TelephonyDtmf digits.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1TelephonyDtmfEvents {
        /**
         * A sequence of TelephonyDtmf digits.
         */
        dtmfEvents?: string[] | null;
    }
    /**
     * Represents a call of a specific tool's action with the specified inputs.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ToolCall {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Output only. Create time of the tool call.
         */
        createTime?: string | null;
        /**
         * Optional. The action's input parameters.
         */
        inputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//tools/`.
         */
        tool?: string | null;
    }
    /**
     * The result of calling a tool's action.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ToolCallResult {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Only populated if the response content is utf-8 encoded.
         */
        content?: string | null;
        /**
         * Output only. Create time of the tool call result.
         */
        createTime?: string | null;
        /**
         * The tool call's error.
         */
        error?: Schema$GoogleCloudDialogflowV2beta1ToolCallResultError;
        /**
         * Only populated if the response content is not utf-8 encoded. (by definition byte fields are base64 encoded).
         */
        rawContent?: string | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//tools/`.
         */
        tool?: string | null;
    }
    /**
     * An error produced by the tool call.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1ToolCallResultError {
        /**
         * Optional. The error message of the function.
         */
        message?: string | null;
    }
    /**
     * The request message for a webhook call.
     */
    export interface Schema$GoogleCloudDialogflowV2beta1WebhookRequest {
        /**
         * Alternative query results from KnowledgeService.
         */
        alternativeQueryResults?: Schema$GoogleCloudDialogflowV2beta1QueryResult[];
        /**
         * Optional. The contents of the original request that was passed to `[Streaming]DetectIntent` call.
         */
        originalDetectIntentRequest?: Schema$GoogleCloudDialogflowV2beta1OriginalDetectIntentRequest;
        /**
         * The result of the conversational query or event processing. Contains the same value as `[Streaming]DetectIntentResponse.query_result`.
         */
        queryResult?: Schema$GoogleCloudDialogflowV2beta1QueryResult;
        /**
         * The unique identifier of the response. Contains the same value as `[Streaming]DetectIntentResponse.response_id`.
         */
        responseId?: string | null;
        /**
         * The unique identifier of detectIntent request session. Can be used to identify end-user inside webhook implementation. Supported formats: - `projects//agent/sessions/, - `projects//locations//agent/sessions/`, - `projects//agent/environments//users//sessions/`, - `projects//locations//agent/environments//users//sessions/`,
         */
        session?: string | null;
    }
    /**
     * The response message for a webhook call. This response is validated by the Dialogflow server. If validation fails, an error will be returned in the QueryResult.diagnostic_info field. Setting JSON fields to an empty value with the wrong type is a common error. To avoid this error: - Use `""` for empty strings - Use `{\}` or `null` for empty objects - Use `[]` or `null` for empty arrays For more information, see the [Protocol Buffers Language Guide](https://developers.google.com/protocol-buffers/docs/proto3#json).
     */
    export interface Schema$GoogleCloudDialogflowV2beta1WebhookResponse {
        /**
         * Optional. Indicates that this intent ends an interaction. Some integrations (e.g., Actions on Google or Dialogflow phone gateway) use this information to close interaction with an end user. Default is false.
         */
        endInteraction?: boolean | null;
        /**
         * Optional. Invokes the supplied events. When this field is set, Dialogflow ignores the `fulfillment_text`, `fulfillment_messages`, and `payload` fields.
         */
        followupEventInput?: Schema$GoogleCloudDialogflowV2beta1EventInput;
        /**
         * Optional. The rich response messages intended for the end-user. When provided, Dialogflow uses this field to populate QueryResult.fulfillment_messages sent to the integration or API caller.
         */
        fulfillmentMessages?: Schema$GoogleCloudDialogflowV2beta1IntentMessage[];
        /**
         * Optional. The text response message intended for the end-user. It is recommended to use `fulfillment_messages.text.text[0]` instead. When provided, Dialogflow uses this field to populate QueryResult.fulfillment_text sent to the integration or API caller.
         */
        fulfillmentText?: string | null;
        /**
         * Indicates that a live agent should be brought in to handle the interaction with the user. In most cases, when you set this flag to true, you would also want to set end_interaction to true as well. Default is false.
         */
        liveAgentHandoff?: boolean | null;
        /**
         * Optional. The collection of output contexts that will overwrite currently active contexts for the session and reset their lifespans. When provided, Dialogflow uses this field to populate QueryResult.output_contexts sent to the integration or API caller.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2beta1Context[];
        /**
         * Optional. This field can be used to pass custom data from your webhook to the integration or API caller. Arbitrary JSON objects are supported. When provided, Dialogflow uses this field to populate QueryResult.webhook_payload sent to the integration or API caller. This field is also used by the [Google Assistant integration](https://cloud.google.com/dialogflow/docs/integrations/aog) for rich response messages. See the format definition at [Google Assistant Dialogflow webhook format](https://developers.google.com/assistant/actions/build/json/dialogflow-webhook-json)
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. Additional session entity types to replace or extend developer entity types with. The entity synonyms apply to all languages and persist for the session. Setting this data from a webhook overwrites the session entity types that have been set using `detectIntent`, `streamingDetectIntent` or SessionEntityType management methods.
         */
        sessionEntityTypes?: Schema$GoogleCloudDialogflowV2beta1SessionEntityType[];
        /**
         * Optional. A custom field used to identify the webhook source. Arbitrary strings are supported. When provided, Dialogflow uses this field to populate QueryResult.webhook_source sent to the integration or API caller.
         */
        source?: string | null;
    }
    /**
     * Metadata for a ConversationProfiles.ClearSuggestionFeatureConfig operation.
     */
    export interface Schema$GoogleCloudDialogflowV2ClearSuggestionFeatureConfigOperationMetadata {
        /**
         * The resource name of the conversation profile. Format: `projects//locations//conversationProfiles/`
         */
        conversationProfile?: string | null;
        /**
         * Timestamp whe the request was created. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * Required. The participant role to remove the suggestion feature config. Only HUMAN_AGENT or END_USER can be used.
         */
        participantRole?: string | null;
        /**
         * Required. The type of the suggestion feature to remove.
         */
        suggestionFeatureType?: string | null;
    }
    /**
     * Dialogflow contexts are similar to natural language context. If a person says to you "they are orange", you need context in order to understand what "they" is referring to. Similarly, for Dialogflow to handle an end-user expression like that, it needs to be provided with context in order to correctly match an intent. Using contexts, you can control the flow of a conversation. You can configure contexts for an intent by setting input and output contexts, which are identified by string names. When an intent is matched, any configured output contexts for that intent become active. While any contexts are active, Dialogflow is more likely to match intents that are configured with input contexts that correspond to the currently active contexts. For more information about context, see the [Contexts guide](https://cloud.google.com/dialogflow/docs/contexts-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2Context {
        /**
         * Optional. The number of conversational query requests after which the context expires. The default is `0`. If set to `0`, the context expires immediately. Contexts expire automatically after 20 minutes if there are no matching queries.
         */
        lifespanCount?: number | null;
        /**
         * Required. The unique identifier of the context. Format: `projects//agent/sessions//contexts/`, or `projects//agent/environments//users//sessions//contexts/`. The `Context ID` is always converted to lowercase, may only contain characters in `a-zA-Z0-9_-%` and may be at most 250 bytes long. If `Environment ID` is not specified, we assume default 'draft' environment. If `User ID` is not specified, we assume default '-' user. The following context names are reserved for internal use by Dialogflow. You should not use these contexts or create contexts with these names: * `__system_counters__` * `*_id_dialog_context` * `*_dialog_params_size`
         */
        name?: string | null;
        /**
         * Optional. The collection of parameters associated with this context. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents a notification sent to Pub/Sub subscribers for conversation lifecycle events.
     */
    export interface Schema$GoogleCloudDialogflowV2ConversationEvent {
        /**
         * The unique identifier of the conversation this notification refers to. Format: `projects//conversations/`.
         */
        conversation?: string | null;
        /**
         * More detailed information about an error. Only set for type UNRECOVERABLE_ERROR_IN_PHONE_CALL.
         */
        errorStatus?: Schema$GoogleRpcStatus;
        /**
         * Payload of NEW_MESSAGE event.
         */
        newMessagePayload?: Schema$GoogleCloudDialogflowV2Message;
        /**
         * Payload of NEW_RECOGNITION_RESULT event.
         */
        newRecognitionResultPayload?: Schema$GoogleCloudDialogflowV2StreamingRecognitionResult;
        /**
         * The type of the event that this notification refers to.
         */
        type?: string | null;
    }
    /**
     * Represents a conversation model.
     */
    export interface Schema$GoogleCloudDialogflowV2ConversationModel {
        /**
         * Metadata for article suggestion models.
         */
        articleSuggestionModelMetadata?: Schema$GoogleCloudDialogflowV2ArticleSuggestionModelMetadata;
        /**
         * Output only. Creation time of this model.
         */
        createTime?: string | null;
        /**
         * Required. Datasets used to create model.
         */
        datasets?: Schema$GoogleCloudDialogflowV2InputDataset[];
        /**
         * Required. The display name of the model. At most 64 bytes long.
         */
        displayName?: string | null;
        /**
         * Language code for the conversation model. If not specified, the language is en-US. Language at ConversationModel should be set for all non en-us languages. This should be a [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) language tag. Example: "en-US".
         */
        languageCode?: string | null;
        /**
         * ConversationModel resource name. Format: `projects//conversationModels/`
         */
        name?: string | null;
        /**
         * Output only. A read only boolean field reflecting Zone Isolation status of the model.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Output only. A read only boolean field reflecting Zone Separation status of the model.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Metadata for smart reply models.
         */
        smartReplyModelMetadata?: Schema$GoogleCloudDialogflowV2SmartReplyModelMetadata;
        /**
         * Output only. State of the model. A model can only serve prediction requests after it gets deployed.
         */
        state?: string | null;
    }
    /**
     * Metadata for CreateConversationDataset.
     */
    export interface Schema$GoogleCloudDialogflowV2CreateConversationDatasetOperationMetadata {
        /**
         * The resource name of the conversation dataset that will be created. Format: `projects//locations//conversationDatasets/`
         */
        conversationDataset?: string | null;
    }
    /**
     * Metadata for a ConversationModels.CreateConversationModelEvaluation operation.
     */
    export interface Schema$GoogleCloudDialogflowV2CreateConversationModelEvaluationOperationMetadata {
        /**
         * The resource name of the conversation model. Format: `projects//locations//conversationModels/`
         */
        conversationModel?: string | null;
        /**
         * The resource name of the conversation model. Format: `projects//locations//conversationModels//evaluations/`
         */
        conversationModelEvaluation?: string | null;
        /**
         * Timestamp when the request to create conversation model was submitted. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * State of CreateConversationModel operation.
         */
        state?: string | null;
    }
    /**
     * Metadata for a ConversationModels.CreateConversationModel operation.
     */
    export interface Schema$GoogleCloudDialogflowV2CreateConversationModelOperationMetadata {
        /**
         * The resource name of the conversation model. Format: `projects//conversationModels/`
         */
        conversationModel?: string | null;
        /**
         * Timestamp when the request to create conversation model is submitted. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * State of CreateConversationModel operation.
         */
        state?: string | null;
    }
    /**
     * Metadata for DeleteConversationDataset.
     */
    export interface Schema$GoogleCloudDialogflowV2DeleteConversationDatasetOperationMetadata {
    }
    /**
     * Metadata for a ConversationModels.DeleteConversationModel operation.
     */
    export interface Schema$GoogleCloudDialogflowV2DeleteConversationModelOperationMetadata {
        /**
         * The resource name of the conversation model. Format: `projects//conversationModels/`
         */
        conversationModel?: string | null;
        /**
         * Timestamp when delete conversation model request was created. The time is measured on server side.
         */
        createTime?: string | null;
    }
    /**
     * Metadata for a ConversationModels.DeployConversationModel operation.
     */
    export interface Schema$GoogleCloudDialogflowV2DeployConversationModelOperationMetadata {
        /**
         * The resource name of the conversation model. Format: `projects//conversationModels/`
         */
        conversationModel?: string | null;
        /**
         * Timestamp when request to deploy conversation model was submitted. The time is measured on server side.
         */
        createTime?: string | null;
    }
    /**
     * A customer-managed encryption key specification that can be applied to all created resources (e.g. Conversation).
     */
    export interface Schema$GoogleCloudDialogflowV2EncryptionSpec {
        /**
         * Required. The name of customer-managed encryption key that is used to secure a resource and its sub-resources. If empty, the resource is secured by the default Google encryption key. Only the key in the same location as this resource is allowed to be used for encryption. Format: `projects/{project\}/locations/{location\}/keyRings/{keyRing\}/cryptoKeys/{key\}`
         */
        kmsKey?: string | null;
        /**
         * Immutable. The resource name of the encryption key specification resource. Format: projects/{project\}/locations/{location\}/encryptionSpec
         */
        name?: string | null;
    }
    /**
     * Each intent parameter has a type, called the entity type, which dictates exactly how data from an end-user expression is extracted. Dialogflow provides predefined system entities that can match many common types of data. For example, there are system entities for matching dates, times, colors, email addresses, and so on. You can also create your own custom entities for matching custom data. For example, you could define a vegetable entity that can match the types of vegetables available for purchase with a grocery store agent. For more information, see the [Entity guide](https://cloud.google.com/dialogflow/docs/entities-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2EntityType {
        /**
         * Optional. Indicates whether the entity type can be automatically expanded.
         */
        autoExpansionMode?: string | null;
        /**
         * Required. The name of the entity type.
         */
        displayName?: string | null;
        /**
         * Optional. Enables fuzzy entity extraction during classification.
         */
        enableFuzzyExtraction?: boolean | null;
        /**
         * Optional. The collection of entity entries associated with the entity type.
         */
        entities?: Schema$GoogleCloudDialogflowV2EntityTypeEntity[];
        /**
         * Required. Indicates the kind of entity type.
         */
        kind?: string | null;
        /**
         * The unique identifier of the entity type. Required for EntityTypes.UpdateEntityType and EntityTypes.BatchUpdateEntityTypes methods. Format: `projects//agent/entityTypes/`.
         */
        name?: string | null;
    }
    /**
     * An **entity entry** for an associated entity type.
     */
    export interface Schema$GoogleCloudDialogflowV2EntityTypeEntity {
        /**
         * Required. A collection of value synonyms. For example, if the entity type is *vegetable*, and `value` is *scallions*, a synonym could be *green onions*. For `KIND_LIST` entity types: * This collection must contain exactly one synonym equal to `value`.
         */
        synonyms?: string[] | null;
        /**
         * Required. The primary value associated with this entity entry. For example, if the entity type is *vegetable*, the value could be *scallions*. For `KIND_MAP` entity types: * A reference value to be used in place of synonyms. For `KIND_LIST` entity types: * A string that can contain references to other entity types (with or without aliases).
         */
        value?: string | null;
    }
    /**
     * Events allow for matching intents by event name instead of the natural language input. For instance, input `` can trigger a personalized welcome response. The parameter `name` may be used by the agent in the response: `"Hello #welcome_event.name! What can I do for you today?"`.
     */
    export interface Schema$GoogleCloudDialogflowV2EventInput {
        /**
         * Required. The language of this query. See [Language Support](https://cloud.google.com/dialogflow/docs/reference/language) for a list of the currently supported language codes. Note that queries in the same session do not necessarily need to specify the same language. This field is ignored when used in the context of a WebhookResponse.followup_event_input field, because the language was already defined in the originating detect intent request.
         */
        languageCode?: string | null;
        /**
         * Required. The unique identifier of the event.
         */
        name?: string | null;
        /**
         * The collection of parameters associated with the event. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * The response message for Agents.ExportAgent.
     */
    export interface Schema$GoogleCloudDialogflowV2ExportAgentResponse {
        /**
         * Zip compressed raw byte content for agent.
         */
        agentContent?: string | null;
        /**
         * The URI to a file containing the exported agent. This field is populated only if `agent_uri` is specified in `ExportAgentRequest`.
         */
        agentUri?: string | null;
    }
    /**
     * Metadata related to the Export Data Operations (e.g. ExportDocument).
     */
    export interface Schema$GoogleCloudDialogflowV2ExportOperationMetadata {
        /**
         * Cloud Storage file path of the exported data.
         */
        exportedGcsDestination?: Schema$GoogleCloudDialogflowV2GcsDestination;
    }
    /**
     * Represents answer from "frequently asked questions".
     */
    export interface Schema$GoogleCloudDialogflowV2FaqAnswer {
        /**
         * The piece of text from the `source` knowledge base document.
         */
        answer?: string | null;
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * The system's confidence score that this Knowledge answer is a good match for this conversational query, range from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * A map that contains metadata about the answer and the document from which it originates.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The corresponding FAQ question.
         */
        question?: string | null;
        /**
         * Indicates which Knowledge Document this answer was extracted from. Format: `projects//locations//agent/knowledgeBases//documents/`.
         */
        source?: string | null;
    }
    /**
     * Suggestion generated using free form generator.
     */
    export interface Schema$GoogleCloudDialogflowV2FreeFormSuggestion {
        /**
         * Required. Free form suggestion.
         */
        response?: string | null;
    }
    /**
     * Google Cloud Storage location for the output.
     */
    export interface Schema$GoogleCloudDialogflowV2GcsDestination {
        /**
         * The Google Cloud Storage URIs for the output. A URI is of the form: `gs://bucket/object-prefix-or-name` Whether a prefix or name is used depends on the use case. The requesting user must have "write-permission" to the bucket.
         */
        uri?: string | null;
    }
    /**
     * The response message for Conversations.GenerateSuggestions.
     */
    export interface Schema$GoogleCloudDialogflowV2GenerateSuggestionsResponse {
        /**
         * The answers generated for the conversation based on context.
         */
        generatorSuggestionAnswers?: Schema$GoogleCloudDialogflowV2GenerateSuggestionsResponseGeneratorSuggestionAnswer[];
        /**
         * The name of the latest conversation message used as context for compiling suggestion. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * A GeneratorSuggestion answer.
     */
    export interface Schema$GoogleCloudDialogflowV2GenerateSuggestionsResponseGeneratorSuggestionAnswer {
        /**
         * Answer record that uniquely identifies the suggestion. This can be used to provide suggestion feedback.
         */
        answerRecord?: string | null;
        /**
         * Suggestion details.
         */
        generatorSuggestion?: Schema$GoogleCloudDialogflowV2GeneratorSuggestion;
        /**
         * The name of the generator used to generate this suggestion. Format: `projects//locations//generators/`.
         */
        sourceGenerator?: string | null;
    }
    /**
     * Suggestion generated using a Generator.
     */
    export interface Schema$GoogleCloudDialogflowV2GeneratorSuggestion {
        /**
         * Optional. Free form suggestion.
         */
        freeFormSuggestion?: Schema$GoogleCloudDialogflowV2FreeFormSuggestion;
        /**
         * Optional. Suggested summary.
         */
        summarySuggestion?: Schema$GoogleCloudDialogflowV2SummarySuggestion;
        /**
         * Optional. List of request and response for tool calls executed.
         */
        toolCallInfo?: Schema$GoogleCloudDialogflowV2GeneratorSuggestionToolCallInfo[];
    }
    /**
     * Request and response for a tool call.
     */
    export interface Schema$GoogleCloudDialogflowV2GeneratorSuggestionToolCallInfo {
        /**
         * Required. Request for a tool call.
         */
        toolCall?: Schema$GoogleCloudDialogflowV2ToolCall;
        /**
         * Required. Response for a tool call.
         */
        toolCallResult?: Schema$GoogleCloudDialogflowV2ToolCallResult;
    }
    /**
     * Represents a notification sent to Cloud Pub/Sub subscribers for human agent assistant events in a specific conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2HumanAgentAssistantEvent {
        /**
         * The conversation this notification refers to. Format: `projects//conversations/`.
         */
        conversation?: string | null;
        /**
         * The participant that the suggestion is compiled for. Format: `projects//conversations//participants/`. It will not be set in legacy workflow.
         */
        participant?: string | null;
        /**
         * The suggestion results payload that this notification refers to.
         */
        suggestionResults?: Schema$GoogleCloudDialogflowV2SuggestionResult[];
    }
    /**
     * Metadata for a ConversationDatasets.ImportConversationData operation.
     */
    export interface Schema$GoogleCloudDialogflowV2ImportConversationDataOperationMetadata {
        /**
         * The resource name of the imported conversation dataset. Format: `projects//locations//conversationDatasets/`
         */
        conversationDataset?: string | null;
        /**
         * Timestamp when import conversation data request was created. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * Partial failures are failures that don't fail the whole long running operation, e.g. single files that couldn't be read.
         */
        partialFailures?: Schema$GoogleRpcStatus[];
    }
    /**
     * Response used for ConversationDatasets.ImportConversationData long running operation.
     */
    export interface Schema$GoogleCloudDialogflowV2ImportConversationDataOperationResponse {
        /**
         * The resource name of the imported conversation dataset. Format: `projects//locations//conversationDatasets/`
         */
        conversationDataset?: string | null;
        /**
         * Number of conversations imported successfully.
         */
        importCount?: number | null;
    }
    /**
     * Response message for Documents.ImportDocuments.
     */
    export interface Schema$GoogleCloudDialogflowV2ImportDocumentsResponse {
        /**
         * Includes details about skipped documents or any other warnings.
         */
        warnings?: Schema$GoogleRpcStatus[];
    }
    /**
     * Metadata for initializing a location-level encryption specification.
     */
    export interface Schema$GoogleCloudDialogflowV2InitializeEncryptionSpecMetadata {
        /**
         * Output only. The original request for initialization.
         */
        request?: Schema$GoogleCloudDialogflowV2InitializeEncryptionSpecRequest;
    }
    /**
     * The request to initialize a location-level encryption specification.
     */
    export interface Schema$GoogleCloudDialogflowV2InitializeEncryptionSpecRequest {
        /**
         * Required. The encryption spec used for CMEK encryption. It is required that the kms key is in the same region as the endpoint. The same key will be used for all provisioned resources, if encryption is available. If the kms_key_name is left empty, no encryption will be enforced.
         */
        encryptionSpec?: Schema$GoogleCloudDialogflowV2EncryptionSpec;
    }
    /**
     * InputDataset used to create model or do evaluation. NextID:5
     */
    export interface Schema$GoogleCloudDialogflowV2InputDataset {
        /**
         * Required. ConversationDataset resource name. Format: `projects//locations//conversationDatasets/`
         */
        dataset?: string | null;
    }
    /**
     * An intent categorizes an end-user's intention for one conversation turn. For each agent, you define many intents, where your combined intents can handle a complete conversation. When an end-user writes or says something, referred to as an end-user expression or end-user input, Dialogflow matches the end-user input to the best intent in your agent. Matching an intent is also known as intent classification. For more information, see the [intent guide](https://cloud.google.com/dialogflow/docs/intents-overview).
     */
    export interface Schema$GoogleCloudDialogflowV2Intent {
        /**
         * Optional. The name of the action associated with the intent. Note: The action name must not contain whitespaces.
         */
        action?: string | null;
        /**
         * Optional. The list of platforms for which the first responses will be copied from the messages in PLATFORM_UNSPECIFIED (i.e. default platform).
         */
        defaultResponsePlatforms?: string[] | null;
        /**
         * Required. The name of this intent.
         */
        displayName?: string | null;
        /**
         * Optional. Indicates that this intent ends an interaction. Some integrations (e.g., Actions on Google or Dialogflow phone gateway) use this information to close interaction with an end user. Default is false.
         */
        endInteraction?: boolean | null;
        /**
         * Optional. The collection of event names that trigger the intent. If the collection of input contexts is not empty, all of the contexts must be present in the active user session for an event to trigger this intent. Event names are limited to 150 characters.
         */
        events?: string[] | null;
        /**
         * Output only. Read-only. Information about all followup intents that have this intent as a direct or indirect parent. We populate this field only in the output.
         */
        followupIntentInfo?: Schema$GoogleCloudDialogflowV2IntentFollowupIntentInfo[];
        /**
         * Optional. The list of context names required for this intent to be triggered. Format: `projects//agent/sessions/-/contexts/`.
         */
        inputContextNames?: string[] | null;
        /**
         * Optional. Indicates whether this is a fallback intent.
         */
        isFallback?: boolean | null;
        /**
         * Optional. Indicates that a live agent should be brought in to handle the interaction with the user. In most cases, when you set this flag to true, you would also want to set end_interaction to true as well. Default is false.
         */
        liveAgentHandoff?: boolean | null;
        /**
         * Optional. The collection of rich messages corresponding to the `Response` field in the Dialogflow console.
         */
        messages?: Schema$GoogleCloudDialogflowV2IntentMessage[];
        /**
         * Optional. Indicates whether Machine Learning is disabled for the intent. Note: If `ml_disabled` setting is set to true, then this intent is not taken into account during inference in `ML ONLY` match mode. Also, auto-markup in the UI is turned off.
         */
        mlDisabled?: boolean | null;
        /**
         * Optional. The unique identifier of this intent. Required for Intents.UpdateIntent and Intents.BatchUpdateIntents methods. Format: `projects//agent/intents/`.
         */
        name?: string | null;
        /**
         * Optional. The collection of contexts that are activated when the intent is matched. Context messages in this collection should not set the parameters field. Setting the `lifespan_count` to 0 will reset the context when the intent is matched. Format: `projects//agent/sessions/-/contexts/`.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2Context[];
        /**
         * Optional. The collection of parameters associated with the intent.
         */
        parameters?: Schema$GoogleCloudDialogflowV2IntentParameter[];
        /**
         * Read-only after creation. The unique identifier of the parent intent in the chain of followup intents. You can set this field when creating an intent, for example with CreateIntent or BatchUpdateIntents, in order to make this intent a followup intent. It identifies the parent followup intent. Format: `projects//agent/intents/`.
         */
        parentFollowupIntentName?: string | null;
        /**
         * Optional. The priority of this intent. Higher numbers represent higher priorities. - If the supplied value is unspecified or 0, the service translates the value to 500,000, which corresponds to the `Normal` priority in the console. - If the supplied value is negative, the intent is ignored in runtime detect intent requests.
         */
        priority?: number | null;
        /**
         * Optional. Indicates whether to delete all contexts in the current session when this intent is matched.
         */
        resetContexts?: boolean | null;
        /**
         * Output only. Read-only. The unique identifier of the root intent in the chain of followup intents. It identifies the correct followup intents chain for this intent. We populate this field only in the output. Format: `projects//agent/intents/`.
         */
        rootFollowupIntentName?: string | null;
        /**
         * Optional. The collection of examples that the agent is trained on.
         */
        trainingPhrases?: Schema$GoogleCloudDialogflowV2IntentTrainingPhrase[];
        /**
         * Optional. Indicates whether webhooks are enabled for the intent.
         */
        webhookState?: string | null;
    }
    /**
     * Represents a single followup intent in the chain.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentFollowupIntentInfo {
        /**
         * The unique identifier of the followup intent. Format: `projects//agent/intents/`.
         */
        followupIntentName?: string | null;
        /**
         * The unique identifier of the followup intent's parent. Format: `projects//agent/intents/`.
         */
        parentFollowupIntentName?: string | null;
    }
    /**
     * A rich response message. Corresponds to the intent `Response` field in the Dialogflow console. For more information, see [Rich response messages](https://cloud.google.com/dialogflow/docs/intents-rich-messages).
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessage {
        /**
         * The basic card response for Actions on Google.
         */
        basicCard?: Schema$GoogleCloudDialogflowV2IntentMessageBasicCard;
        /**
         * Browse carousel card for Actions on Google.
         */
        browseCarouselCard?: Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCard;
        /**
         * The card response.
         */
        card?: Schema$GoogleCloudDialogflowV2IntentMessageCard;
        /**
         * The carousel card response for Actions on Google.
         */
        carouselSelect?: Schema$GoogleCloudDialogflowV2IntentMessageCarouselSelect;
        /**
         * The image response.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * The link out suggestion chip for Actions on Google.
         */
        linkOutSuggestion?: Schema$GoogleCloudDialogflowV2IntentMessageLinkOutSuggestion;
        /**
         * The list card response for Actions on Google.
         */
        listSelect?: Schema$GoogleCloudDialogflowV2IntentMessageListSelect;
        /**
         * The media content card for Actions on Google.
         */
        mediaContent?: Schema$GoogleCloudDialogflowV2IntentMessageMediaContent;
        /**
         * A custom platform-specific response.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. The platform that this message is intended for.
         */
        platform?: string | null;
        /**
         * The quick replies response.
         */
        quickReplies?: Schema$GoogleCloudDialogflowV2IntentMessageQuickReplies;
        /**
         * The voice and text-only responses for Actions on Google.
         */
        simpleResponses?: Schema$GoogleCloudDialogflowV2IntentMessageSimpleResponses;
        /**
         * The suggestion chips for Actions on Google.
         */
        suggestions?: Schema$GoogleCloudDialogflowV2IntentMessageSuggestions;
        /**
         * Table card for Actions on Google.
         */
        tableCard?: Schema$GoogleCloudDialogflowV2IntentMessageTableCard;
        /**
         * The text response.
         */
        text?: Schema$GoogleCloudDialogflowV2IntentMessageText;
    }
    /**
     * The basic card message. Useful for displaying information.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBasicCard {
        /**
         * Optional. The collection of card buttons.
         */
        buttons?: Schema$GoogleCloudDialogflowV2IntentMessageBasicCardButton[];
        /**
         * Required, unless image is present. The body text of the card.
         */
        formattedText?: string | null;
        /**
         * Optional. The image for the card.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Optional. The subtitle of the card.
         */
        subtitle?: string | null;
        /**
         * Optional. The title of the card.
         */
        title?: string | null;
    }
    /**
     * The button object that appears at the bottom of a card.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBasicCardButton {
        /**
         * Required. Action to take when a user taps on the button.
         */
        openUriAction?: Schema$GoogleCloudDialogflowV2IntentMessageBasicCardButtonOpenUriAction;
        /**
         * Required. The title of the button.
         */
        title?: string | null;
    }
    /**
     * Opens the given URI.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBasicCardButtonOpenUriAction {
        /**
         * Required. The HTTP or HTTPS scheme URI.
         */
        uri?: string | null;
    }
    /**
     * Browse Carousel Card for Actions on Google. https://developers.google.com/actions/assistant/responses#browsing_carousel
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCard {
        /**
         * Optional. Settings for displaying the image. Applies to every image in items.
         */
        imageDisplayOptions?: string | null;
        /**
         * Required. List of items in the Browse Carousel Card. Minimum of two items, maximum of ten.
         */
        items?: Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCardBrowseCarouselCardItem[];
    }
    /**
     * Browsing carousel tile
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCardBrowseCarouselCardItem {
        /**
         * Optional. Description of the carousel item. Maximum of four lines of text.
         */
        description?: string | null;
        /**
         * Optional. Text that appears at the bottom of the Browse Carousel Card. Maximum of one line of text.
         */
        footer?: string | null;
        /**
         * Optional. Hero image for the carousel item.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Required. Action to present to the user.
         */
        openUriAction?: Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCardBrowseCarouselCardItemOpenUrlAction;
        /**
         * Required. Title of the carousel item. Maximum of two lines of text.
         */
        title?: string | null;
    }
    /**
     * Actions on Google action to open a given url.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageBrowseCarouselCardBrowseCarouselCardItemOpenUrlAction {
        /**
         * Required. URL
         */
        url?: string | null;
        /**
         * Optional. Specifies the type of viewer that is used when opening the URL. Defaults to opening via web browser.
         */
        urlTypeHint?: string | null;
    }
    /**
     * The card response message.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageCard {
        /**
         * Optional. The collection of card buttons.
         */
        buttons?: Schema$GoogleCloudDialogflowV2IntentMessageCardButton[];
        /**
         * Optional. The public URI to an image file for the card.
         */
        imageUri?: string | null;
        /**
         * Optional. The subtitle of the card.
         */
        subtitle?: string | null;
        /**
         * Optional. The title of the card.
         */
        title?: string | null;
    }
    /**
     * Contains information about a button.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageCardButton {
        /**
         * Optional. The text to send back to the Dialogflow API or a URI to open.
         */
        postback?: string | null;
        /**
         * Optional. The text to show on the button.
         */
        text?: string | null;
    }
    /**
     * The card for presenting a carousel of options to select from.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageCarouselSelect {
        /**
         * Required. Carousel items.
         */
        items?: Schema$GoogleCloudDialogflowV2IntentMessageCarouselSelectItem[];
    }
    /**
     * An item in the carousel.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageCarouselSelectItem {
        /**
         * Optional. The body text of the card.
         */
        description?: string | null;
        /**
         * Optional. The image to display.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Required. Additional info about the option item.
         */
        info?: Schema$GoogleCloudDialogflowV2IntentMessageSelectItemInfo;
        /**
         * Required. Title of the carousel item.
         */
        title?: string | null;
    }
    /**
     * Column properties for TableCard.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageColumnProperties {
        /**
         * Required. Column heading.
         */
        header?: string | null;
        /**
         * Optional. Defines text alignment for all cells in this column.
         */
        horizontalAlignment?: string | null;
    }
    /**
     * The image response message.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageImage {
        /**
         * Optional. A text description of the image to be used for accessibility, e.g., screen readers.
         */
        accessibilityText?: string | null;
        /**
         * Optional. The public URI to an image file.
         */
        imageUri?: string | null;
    }
    /**
     * The suggestion chip message that allows the user to jump out to the app or website associated with this agent.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageLinkOutSuggestion {
        /**
         * Required. The name of the app or site this chip is linking to.
         */
        destinationName?: string | null;
        /**
         * Required. The URI of the app or site to open when the user taps the suggestion chip.
         */
        uri?: string | null;
    }
    /**
     * The card for presenting a list of options to select from.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageListSelect {
        /**
         * Required. List items.
         */
        items?: Schema$GoogleCloudDialogflowV2IntentMessageListSelectItem[];
        /**
         * Optional. Subtitle of the list.
         */
        subtitle?: string | null;
        /**
         * Optional. The overall title of the list.
         */
        title?: string | null;
    }
    /**
     * An item in the list.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageListSelectItem {
        /**
         * Optional. The main text describing the item.
         */
        description?: string | null;
        /**
         * Optional. The image to display.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Required. Additional information about this option.
         */
        info?: Schema$GoogleCloudDialogflowV2IntentMessageSelectItemInfo;
        /**
         * Required. The title of the list item.
         */
        title?: string | null;
    }
    /**
     * The media content card for Actions on Google.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageMediaContent {
        /**
         * Required. List of media objects.
         */
        mediaObjects?: Schema$GoogleCloudDialogflowV2IntentMessageMediaContentResponseMediaObject[];
        /**
         * Optional. What type of media is the content (ie "audio").
         */
        mediaType?: string | null;
    }
    /**
     * Response media object for media content card.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageMediaContentResponseMediaObject {
        /**
         * Required. Url where the media is stored.
         */
        contentUrl?: string | null;
        /**
         * Optional. Description of media card.
         */
        description?: string | null;
        /**
         * Optional. Icon to display above media content.
         */
        icon?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Optional. Image to display above media content.
         */
        largeImage?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Required. Name of media card.
         */
        name?: string | null;
    }
    /**
     * The quick replies response message.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageQuickReplies {
        /**
         * Optional. The collection of quick replies.
         */
        quickReplies?: string[] | null;
        /**
         * Optional. The title of the collection of quick replies.
         */
        title?: string | null;
    }
    /**
     * Additional info about the select item for when it is triggered in a dialog.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageSelectItemInfo {
        /**
         * Required. A unique key that will be sent back to the agent if this response is given.
         */
        key?: string | null;
        /**
         * Optional. A list of synonyms that can also be used to trigger this item in dialog.
         */
        synonyms?: string[] | null;
    }
    /**
     * The simple response message containing speech or text.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageSimpleResponse {
        /**
         * Optional. The text to display.
         */
        displayText?: string | null;
        /**
         * One of text_to_speech or ssml must be provided. Structured spoken response to the user in the SSML format. Mutually exclusive with text_to_speech.
         */
        ssml?: string | null;
        /**
         * One of text_to_speech or ssml must be provided. The plain text of the speech output. Mutually exclusive with ssml.
         */
        textToSpeech?: string | null;
    }
    /**
     * The collection of simple response candidates. This message in `QueryResult.fulfillment_messages` and `WebhookResponse.fulfillment_messages` should contain only one `SimpleResponse`.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageSimpleResponses {
        /**
         * Required. The list of simple responses.
         */
        simpleResponses?: Schema$GoogleCloudDialogflowV2IntentMessageSimpleResponse[];
    }
    /**
     * The suggestion chip message that the user can tap to quickly post a reply to the conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageSuggestion {
        /**
         * Required. The text shown the in the suggestion chip.
         */
        title?: string | null;
    }
    /**
     * The collection of suggestions.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageSuggestions {
        /**
         * Required. The list of suggested replies.
         */
        suggestions?: Schema$GoogleCloudDialogflowV2IntentMessageSuggestion[];
    }
    /**
     * Table card for Actions on Google.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageTableCard {
        /**
         * Optional. List of buttons for the card.
         */
        buttons?: Schema$GoogleCloudDialogflowV2IntentMessageBasicCardButton[];
        /**
         * Optional. Display properties for the columns in this table.
         */
        columnProperties?: Schema$GoogleCloudDialogflowV2IntentMessageColumnProperties[];
        /**
         * Optional. Image which should be displayed on the card.
         */
        image?: Schema$GoogleCloudDialogflowV2IntentMessageImage;
        /**
         * Optional. Rows in this table of data.
         */
        rows?: Schema$GoogleCloudDialogflowV2IntentMessageTableCardRow[];
        /**
         * Optional. Subtitle to the title.
         */
        subtitle?: string | null;
        /**
         * Required. Title of the card.
         */
        title?: string | null;
    }
    /**
     * Cell of TableCardRow.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageTableCardCell {
        /**
         * Required. Text in this cell.
         */
        text?: string | null;
    }
    /**
     * Row of TableCard.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageTableCardRow {
        /**
         * Optional. List of cells that make up this row.
         */
        cells?: Schema$GoogleCloudDialogflowV2IntentMessageTableCardCell[];
        /**
         * Optional. Whether to add a visual divider after this row.
         */
        dividerAfter?: boolean | null;
    }
    /**
     * The text response message.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentMessageText {
        /**
         * Optional. The collection of the agent's responses.
         */
        text?: string[] | null;
    }
    /**
     * Represents intent parameters.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentParameter {
        /**
         * Optional. The default value to use when the `value` yields an empty result. Default values can be extracted from contexts by using the following syntax: `#context_name.parameter_name`.
         */
        defaultValue?: string | null;
        /**
         * Required. The name of the parameter.
         */
        displayName?: string | null;
        /**
         * Optional. The name of the entity type, prefixed with `@`, that describes values of the parameter. If the parameter is required, this must be provided.
         */
        entityTypeDisplayName?: string | null;
        /**
         * Optional. Indicates whether the parameter represents a list of values.
         */
        isList?: boolean | null;
        /**
         * Optional. Indicates whether the parameter is required. That is, whether the intent cannot be completed without collecting the parameter value.
         */
        mandatory?: boolean | null;
        /**
         * The unique identifier of this parameter.
         */
        name?: string | null;
        /**
         * Optional. The collection of prompts that the agent can present to the user in order to collect a value for the parameter.
         */
        prompts?: string[] | null;
        /**
         * Optional. The definition of the parameter value. It can be: - a constant string, - a parameter value defined as `$parameter_name`, - an original parameter value defined as `$parameter_name.original`, - a parameter value from some context defined as `#context_name.parameter_name`.
         */
        value?: string | null;
    }
    /**
     * Represents an example that the agent is trained on.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentTrainingPhrase {
        /**
         * Output only. The unique identifier of this training phrase.
         */
        name?: string | null;
        /**
         * Required. The ordered list of training phrase parts. The parts are concatenated in order to form the training phrase. Note: The API does not automatically annotate training phrases like the Dialogflow Console does. Note: Do not forget to include whitespace at part boundaries, so the training phrase is well formatted when the parts are concatenated. If the training phrase does not need to be annotated with parameters, you just need a single part with only the Part.text field set. If you want to annotate the training phrase, you must create multiple parts, where the fields of each part are populated in one of two ways: - `Part.text` is set to a part of the phrase that has no parameters. - `Part.text` is set to a part of the phrase that you want to annotate, and the `entity_type`, `alias`, and `user_defined` fields are all set.
         */
        parts?: Schema$GoogleCloudDialogflowV2IntentTrainingPhrasePart[];
        /**
         * Optional. Indicates how many times this example was added to the intent. Each time a developer adds an existing sample by editing an intent or training, this counter is increased.
         */
        timesAddedCount?: number | null;
        /**
         * Required. The type of the training phrase.
         */
        type?: string | null;
    }
    /**
     * Represents a part of a training phrase.
     */
    export interface Schema$GoogleCloudDialogflowV2IntentTrainingPhrasePart {
        /**
         * Optional. The parameter name for the value extracted from the annotated part of the example. This field is required for annotated parts of the training phrase.
         */
        alias?: string | null;
        /**
         * Optional. The entity type name prefixed with `@`. This field is required for annotated parts of the training phrase.
         */
        entityType?: string | null;
        /**
         * Required. The text for this part.
         */
        text?: string | null;
        /**
         * Optional. Indicates whether the text was manually annotated. This field is set to true when the Dialogflow Console is used to manually annotate the part. When creating an annotated part with the API, you must set this to true.
         */
        userDefined?: boolean | null;
    }
    /**
     * Represents a Knowledge Assist answer.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswer {
        /**
         * The name of the answer record. Format: `projects//locations//answer Records/`.
         */
        answerRecord?: string | null;
        /**
         * The query suggested based on the context. Suggestion is made only if it is different from the previous suggestion.
         */
        suggestedQuery?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerSuggestedQuery;
        /**
         * The answer generated for the suggested query. Whether or not an answer is generated depends on how confident we are about the generated query.
         */
        suggestedQueryAnswer?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswer;
    }
    /**
     * Represents an answer from Knowledge. Currently supports FAQ and Generative answers.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswer {
        /**
         * The piece of text from the `source` that answers this suggested query.
         */
        answerText?: string | null;
        /**
         * Populated if the prediction came from FAQ.
         */
        faqSource?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerFaqSource;
        /**
         * Populated if the prediction was Generative.
         */
        generativeSource?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerGenerativeSource;
    }
    /**
     * Details about source of FAQ answer.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerFaqSource {
        /**
         * The corresponding FAQ question.
         */
        question?: string | null;
    }
    /**
     * Details about source of Generative answer.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerGenerativeSource {
        /**
         * All snippets used for this Generative Prediction, with their source URI and data.
         */
        snippets?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerGenerativeSourceSnippet[];
    }
    /**
     * Snippet Source for a Generative Prediction.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerKnowledgeAnswerGenerativeSourceSnippet {
        /**
         * Metadata of the document.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Text taken from that URI.
         */
        text?: string | null;
        /**
         * Title of the document.
         */
        title?: string | null;
        /**
         * URI the data is sourced from.
         */
        uri?: string | null;
    }
    /**
     * Represents a suggested query.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswerSuggestedQuery {
        /**
         * Suggested query text.
         */
        queryText?: string | null;
    }
    /**
     * Metadata in google::longrunning::Operation for Knowledge operations.
     */
    export interface Schema$GoogleCloudDialogflowV2KnowledgeOperationMetadata {
        /**
         * Metadata for the Export Data Operation such as the destination of export.
         */
        exportOperationMetadata?: Schema$GoogleCloudDialogflowV2ExportOperationMetadata;
        /**
         * The name of the knowledge base interacted with during the operation.
         */
        knowledgeBase?: string | null;
        /**
         * Output only. The current state of this operation.
         */
        state?: string | null;
    }
    /**
     * Represents a message posted into a conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2Message {
        /**
         * Required. The message content.
         */
        content?: string | null;
        /**
         * Output only. The time when the message was created in Contact Center AI.
         */
        createTime?: string | null;
        /**
         * Optional. The message language. This should be a [BCP-47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) language tag. Example: "en-US".
         */
        languageCode?: string | null;
        /**
         * Output only. The annotation for the message.
         */
        messageAnnotation?: Schema$GoogleCloudDialogflowV2MessageAnnotation;
        /**
         * Optional. The unique identifier of the message. Format: `projects//locations//conversations//messages/`.
         */
        name?: string | null;
        /**
         * Output only. The participant that sends this message.
         */
        participant?: string | null;
        /**
         * Output only. The role of the participant.
         */
        participantRole?: string | null;
        /**
         * Optional. The time when the message was sent. For voice messages, this is the time when an utterance started.
         */
        sendTime?: string | null;
        /**
         * Output only. The sentiment analysis result for the message.
         */
        sentimentAnalysis?: Schema$GoogleCloudDialogflowV2SentimentAnalysisResult;
    }
    /**
     * Represents the result of annotation for the message.
     */
    export interface Schema$GoogleCloudDialogflowV2MessageAnnotation {
        /**
         * Indicates whether the text message contains entities.
         */
        containEntities?: boolean | null;
        /**
         * The collection of annotated message parts ordered by their position in the message. You can recover the annotated message by concatenating [AnnotatedMessagePart.text].
         */
        parts?: Schema$GoogleCloudDialogflowV2AnnotatedMessagePart[];
    }
    /**
     * Represents the contents of the original request that was passed to the `[Streaming]DetectIntent` call.
     */
    export interface Schema$GoogleCloudDialogflowV2OriginalDetectIntentRequest {
        /**
         * Optional. This field is set to the value of the `QueryParameters.payload` field passed in the request. Some integrations that query a Dialogflow agent may provide additional information in the payload. In particular, for the Dialogflow Phone Gateway integration, this field has the form: { "telephony": { "caller_id": "+18558363987" \} \} Note: The caller ID field (`caller_id`) will be redacted for Trial Edition agents and populated with the caller ID in [E.164 format](https://en.wikipedia.org/wiki/E.164) for Essentials Edition agents.
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * The source of this request, e.g., `google`, `facebook`, `slack`. It is set by Dialogflow-owned servers.
         */
        source?: string | null;
        /**
         * Optional. The version of the protocol used for this request. This field is AoG-specific.
         */
        version?: string | null;
    }
    /**
     * Represents the result of conversational query or event processing.
     */
    export interface Schema$GoogleCloudDialogflowV2QueryResult {
        /**
         * The action name from the matched intent.
         */
        action?: string | null;
        /**
         * This field is set to: - `false` if the matched intent has required parameters and not all of the required parameter values have been collected. - `true` if all required parameter values have been collected, or if the matched intent doesn't contain any required parameters.
         */
        allRequiredParamsPresent?: boolean | null;
        /**
         * Indicates whether the conversational query triggers a cancellation for slot filling. For more information, see the [cancel slot filling documentation](https://cloud.google.com/dialogflow/es/docs/intents-actions-parameters#cancel).
         */
        cancelsSlotFilling?: boolean | null;
        /**
         * Free-form diagnostic information for the associated detect intent request. The fields of this data can change without notice, so you should not write code that depends on its structure. The data may contain: - webhook call latency - webhook errors
         */
        diagnosticInfo?: {
            [key: string]: any;
        } | null;
        /**
         * The collection of rich messages to present to the user.
         */
        fulfillmentMessages?: Schema$GoogleCloudDialogflowV2IntentMessage[];
        /**
         * The text to be pronounced to the user or shown on the screen. Note: This is a legacy field, `fulfillment_messages` should be preferred.
         */
        fulfillmentText?: string | null;
        /**
         * The intent that matched the conversational query. Some, not all fields are filled in this message, including but not limited to: `name`, `display_name`, `end_interaction` and `is_fallback`.
         */
        intent?: Schema$GoogleCloudDialogflowV2Intent;
        /**
         * The intent detection confidence. Values range from 0.0 (completely uncertain) to 1.0 (completely certain). This value is for informational purpose only and is only used to help match the best intent within the classification threshold. This value may change for the same end-user expression at any time due to a model retraining or change in implementation. If there are `multiple knowledge_answers` messages, this value is set to the greatest `knowledgeAnswers.match_confidence` value in the list.
         */
        intentDetectionConfidence?: number | null;
        /**
         * The language that was triggered during intent detection. See [Language Support](https://cloud.google.com/dialogflow/docs/reference/language) for a list of the currently supported language codes.
         */
        languageCode?: string | null;
        /**
         * The collection of output contexts. If applicable, `output_contexts.parameters` contains entries with name `.original` containing the original parameter values before the query.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2Context[];
        /**
         * The collection of extracted parameters. Depending on your protocol or client library language, this is a map, associative array, symbol table, dictionary, or JSON object composed of a collection of (MapKey, MapValue) pairs: * MapKey type: string * MapKey value: parameter name * MapValue type: If parameter's entity type is a composite entity then use map, otherwise, depending on the parameter value type, it could be one of string, number, boolean, null, list or map. * MapValue value: If parameter's entity type is a composite entity then use map from composite entity property names to property values, otherwise, use parameter value.
         */
        parameters?: {
            [key: string]: any;
        } | null;
        /**
         * The original conversational query text: - If natural language text was provided as input, `query_text` contains a copy of the input. - If natural language speech audio was provided as input, `query_text` contains the speech recognition result. If speech recognizer produced multiple alternatives, a particular one is picked. - If automatic spell correction is enabled, `query_text` will contain the corrected user input.
         */
        queryText?: string | null;
        /**
         * The sentiment analysis result, which depends on the `sentiment_analysis_request_config` specified in the request.
         */
        sentimentAnalysisResult?: Schema$GoogleCloudDialogflowV2SentimentAnalysisResult;
        /**
         * The Speech recognition confidence between 0.0 and 1.0. A higher number indicates an estimated greater likelihood that the recognized words are correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is not guaranteed to be accurate or set. In particular this field isn't set for StreamingDetectIntent since the streaming endpoint has separate confidence estimates per portion of the audio in StreamingRecognitionResult.
         */
        speechRecognitionConfidence?: number | null;
        /**
         * If the query was fulfilled by a webhook call, this field is set to the value of the `payload` field returned in the webhook response.
         */
        webhookPayload?: {
            [key: string]: any;
        } | null;
        /**
         * If the query was fulfilled by a webhook call, this field is set to the value of the `source` field returned in the webhook response.
         */
        webhookSource?: string | null;
    }
    /**
     * The sentiment, such as positive/negative feeling or association, for a unit of analysis, such as the query text. See: https://cloud.google.com/natural-language/docs/basics#interpreting_sentiment_analysis_values for how to interpret the result.
     */
    export interface Schema$GoogleCloudDialogflowV2Sentiment {
        /**
         * A non-negative number in the [0, +inf) range, which represents the absolute magnitude of sentiment, regardless of score (positive or negative).
         */
        magnitude?: number | null;
        /**
         * Sentiment score between -1.0 (negative sentiment) and 1.0 (positive sentiment).
         */
        score?: number | null;
    }
    /**
     * The result of sentiment analysis. Sentiment analysis inspects user input and identifies the prevailing subjective opinion, especially to determine a user's attitude as positive, negative, or neutral. For DetectIntent, it needs to be configured in DetectIntentRequest.query_params. For StreamingDetectIntent, it needs to be configured in StreamingDetectIntentRequest.query_params. And for Participants.AnalyzeContent and Participants.StreamingAnalyzeContent, it needs to be configured in ConversationProfile.human_agent_assistant_config
     */
    export interface Schema$GoogleCloudDialogflowV2SentimentAnalysisResult {
        /**
         * The sentiment analysis result for `query_text`.
         */
        queryTextSentiment?: Schema$GoogleCloudDialogflowV2Sentiment;
    }
    /**
     * A session represents a conversation between a Dialogflow agent and an end-user. You can create special entities, called session entities, during a session. Session entities can extend or replace custom entity types and only exist during the session that they were created for. All session data, including session entities, is stored by Dialogflow for 20 minutes. For more information, see the [session entity guide](https://cloud.google.com/dialogflow/docs/entities-session).
     */
    export interface Schema$GoogleCloudDialogflowV2SessionEntityType {
        /**
         * Required. The collection of entities associated with this session entity type.
         */
        entities?: Schema$GoogleCloudDialogflowV2EntityTypeEntity[];
        /**
         * Required. Indicates whether the additional data should override or supplement the custom entity type definition.
         */
        entityOverrideMode?: string | null;
        /**
         * Required. The unique identifier of this session entity type. Format: `projects//agent/sessions//entityTypes/`, or `projects//agent/environments//users//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment. If `User ID` is not specified, we assume default '-' user. `` must be the display name of an existing entity type in the same agent that will be overridden or supplemented.
         */
        name?: string | null;
    }
    /**
     * Metadata for a ConversationProfiles.SetSuggestionFeatureConfig operation.
     */
    export interface Schema$GoogleCloudDialogflowV2SetSuggestionFeatureConfigOperationMetadata {
        /**
         * The resource name of the conversation profile. Format: `projects//locations//conversationProfiles/`
         */
        conversationProfile?: string | null;
        /**
         * Timestamp whe the request was created. The time is measured on server side.
         */
        createTime?: string | null;
        /**
         * Required. The participant role to add or update the suggestion feature config. Only HUMAN_AGENT or END_USER can be used.
         */
        participantRole?: string | null;
        /**
         * Required. The type of the suggestion feature to add or update.
         */
        suggestionFeatureType?: string | null;
    }
    /**
     * Represents a smart reply answer.
     */
    export interface Schema$GoogleCloudDialogflowV2SmartReplyAnswer {
        /**
         * The name of answer record, in the format of "projects//locations//answerRecords/"
         */
        answerRecord?: string | null;
        /**
         * Smart reply confidence. The system's confidence score that this reply is a good match for this conversation, as a value from 0.0 (completely uncertain) to 1.0 (completely certain).
         */
        confidence?: number | null;
        /**
         * The content of the reply.
         */
        reply?: string | null;
    }
    /**
     * Metadata for smart reply models.
     */
    export interface Schema$GoogleCloudDialogflowV2SmartReplyModelMetadata {
        /**
         * Optional. Type of the smart reply model. If not provided, model_type is used.
         */
        trainingModelType?: string | null;
    }
    /**
     * Information for a word recognized by the speech recognizer.
     */
    export interface Schema$GoogleCloudDialogflowV2SpeechWordInfo {
        /**
         * The Speech confidence between 0.0 and 1.0 for this word. A higher number indicates an estimated greater likelihood that the recognized word is correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is not guaranteed to be fully stable over time for the same audio input. Users should also not rely on it to always be provided.
         */
        confidence?: number | null;
        /**
         * Time offset relative to the beginning of the audio that corresponds to the end of the spoken word. This is an experimental feature and the accuracy of the time offset can vary.
         */
        endOffset?: string | null;
        /**
         * Time offset relative to the beginning of the audio that corresponds to the start of the spoken word. This is an experimental feature and the accuracy of the time offset can vary.
         */
        startOffset?: string | null;
        /**
         * The word this info is for.
         */
        word?: string | null;
    }
    /**
     * Contains a speech recognition result corresponding to a portion of the audio that is currently being processed or an indication that this is the end of the single requested utterance. While end-user audio is being processed, Dialogflow sends a series of results. Each result may contain a `transcript` value. A transcript represents a portion of the utterance. While the recognizer is processing audio, transcript values may be interim values or finalized values. Once a transcript is finalized, the `is_final` value is set to true and processing continues for the next transcript. If `StreamingDetectIntentRequest.query_input.audio_config.single_utterance` was true, and the recognizer has completed processing audio, the `message_type` value is set to `END_OF_SINGLE_UTTERANCE and the following (last) result contains the last finalized transcript. The complete end-user utterance is determined by concatenating the finalized transcript values received for the series of results. In the following example, single utterance is enabled. In the case where single utterance is not enabled, result 7 would not occur. ``` Num | transcript | message_type | is_final --- | ----------------------- | ----------------------- | -------- 1 | "tube" | TRANSCRIPT | false 2 | "to be a" | TRANSCRIPT | false 3 | "to be" | TRANSCRIPT | false 4 | "to be or not to be" | TRANSCRIPT | true 5 | "that's" | TRANSCRIPT | false 6 | "that is | TRANSCRIPT | false 7 | unset | END_OF_SINGLE_UTTERANCE | unset 8 | " that is the question" | TRANSCRIPT | true ``` Concatenating the finalized transcripts with `is_final` set to true, the complete utterance becomes "to be or not to be that is the question".
     */
    export interface Schema$GoogleCloudDialogflowV2StreamingRecognitionResult {
        /**
         * The Speech confidence between 0.0 and 1.0 for the current portion of audio. A higher number indicates an estimated greater likelihood that the recognized words are correct. The default of 0.0 is a sentinel value indicating that confidence was not set. This field is typically only provided if `is_final` is true and you should not rely on it being accurate or even set.
         */
        confidence?: number | null;
        /**
         * If `false`, the `StreamingRecognitionResult` represents an interim result that may change. If `true`, the recognizer will not return any further hypotheses about this piece of the audio. May only be populated for `message_type` = `TRANSCRIPT`.
         */
        isFinal?: boolean | null;
        /**
         * Detected language code for the transcript.
         */
        languageCode?: string | null;
        /**
         * Type of the result message.
         */
        messageType?: string | null;
        /**
         * Time offset of the end of this Speech recognition result relative to the beginning of the audio. Only populated for `message_type` = `TRANSCRIPT`.
         */
        speechEndOffset?: string | null;
        /**
         * Word-specific information for the words recognized by Speech in transcript. Populated if and only if `message_type` = `TRANSCRIPT` and [InputAudioConfig.enable_word_info] is set.
         */
        speechWordInfo?: Schema$GoogleCloudDialogflowV2SpeechWordInfo[];
        /**
         * Transcript text representing the words that the user spoke. Populated if and only if `message_type` = `TRANSCRIPT`.
         */
        transcript?: string | null;
    }
    /**
     * The response message for Participants.SuggestArticles.
     */
    export interface Schema$GoogleCloudDialogflowV2SuggestArticlesResponse {
        /**
         * Articles ordered by score in descending order.
         */
        articleAnswers?: Schema$GoogleCloudDialogflowV2ArticleAnswer[];
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestArticlesRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * The request message for Participants.SuggestFaqAnswers.
     */
    export interface Schema$GoogleCloudDialogflowV2SuggestFaqAnswersResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestFaqAnswersRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * Answers extracted from FAQ documents.
         */
        faqAnswers?: Schema$GoogleCloudDialogflowV2FaqAnswer[];
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * One response of different type of suggestion response which is used in the response of Participants.AnalyzeContent and Participants.AnalyzeContent, as well as HumanAgentAssistantEvent.
     */
    export interface Schema$GoogleCloudDialogflowV2SuggestionResult {
        /**
         * Error status if the request failed.
         */
        error?: Schema$GoogleRpcStatus;
        /**
         * Suggestions generated using generators triggered by customer or agent messages.
         */
        generateSuggestionsResponse?: Schema$GoogleCloudDialogflowV2GenerateSuggestionsResponse;
        /**
         * SuggestArticlesResponse if request is for ARTICLE_SUGGESTION.
         */
        suggestArticlesResponse?: Schema$GoogleCloudDialogflowV2SuggestArticlesResponse;
        /**
         * SuggestFaqAnswersResponse if request is for FAQ_ANSWER.
         */
        suggestFaqAnswersResponse?: Schema$GoogleCloudDialogflowV2SuggestFaqAnswersResponse;
        /**
         * SuggestKnowledgeAssistResponse if request is for KNOWLEDGE_ASSIST.
         */
        suggestKnowledgeAssistResponse?: Schema$GoogleCloudDialogflowV2SuggestKnowledgeAssistResponse;
        /**
         * SuggestSmartRepliesResponse if request is for SMART_REPLY.
         */
        suggestSmartRepliesResponse?: Schema$GoogleCloudDialogflowV2SuggestSmartRepliesResponse;
    }
    /**
     * The response message for Participants.SuggestKnowledgeAssist.
     */
    export interface Schema$GoogleCloudDialogflowV2SuggestKnowledgeAssistResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestKnowledgeAssistRequest.context_size field in the request if there are fewer messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * Output only. Knowledge Assist suggestion.
         */
        knowledgeAssistAnswer?: Schema$GoogleCloudDialogflowV2KnowledgeAssistAnswer;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
    }
    /**
     * The response message for Participants.SuggestSmartReplies.
     */
    export interface Schema$GoogleCloudDialogflowV2SuggestSmartRepliesResponse {
        /**
         * Number of messages prior to and including latest_message to compile the suggestion. It may be smaller than the SuggestSmartRepliesRequest.context_size field in the request if there aren't that many messages in the conversation.
         */
        contextSize?: number | null;
        /**
         * The name of the latest conversation message used to compile suggestion for. Format: `projects//locations//conversations//messages/`.
         */
        latestMessage?: string | null;
        /**
         * Output only. Multiple reply options provided by smart reply service. The order is based on the rank of the model prediction. The maximum number of the returned replies is set in SmartReplyConfig.
         */
        smartReplyAnswers?: Schema$GoogleCloudDialogflowV2SmartReplyAnswer[];
    }
    /**
     * Suggested summary of the conversation.
     */
    export interface Schema$GoogleCloudDialogflowV2SummarySuggestion {
        /**
         * Required. All the parts of generated summary.
         */
        summarySections?: Schema$GoogleCloudDialogflowV2SummarySuggestionSummarySection[];
    }
    /**
     * A component of the generated summary.
     */
    export interface Schema$GoogleCloudDialogflowV2SummarySuggestionSummarySection {
        /**
         * Required. Name of the section.
         */
        section?: string | null;
        /**
         * Required. Summary text for the section.
         */
        summary?: string | null;
    }
    /**
     * Represents a call of a specific tool's action with the specified inputs.
     */
    export interface Schema$GoogleCloudDialogflowV2ToolCall {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Output only. Create time of the tool call.
         */
        createTime?: string | null;
        /**
         * Optional. The action's input parameters.
         */
        inputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//tools/`.
         */
        tool?: string | null;
    }
    /**
     * The result of calling a tool's action.
     */
    export interface Schema$GoogleCloudDialogflowV2ToolCallResult {
        /**
         * Required. The name of the tool's action associated with this call.
         */
        action?: string | null;
        /**
         * Only populated if the response content is utf-8 encoded.
         */
        content?: string | null;
        /**
         * Output only. Create time of the tool call result.
         */
        createTime?: string | null;
        /**
         * The tool call's error.
         */
        error?: Schema$GoogleCloudDialogflowV2ToolCallResultError;
        /**
         * Only populated if the response content is not utf-8 encoded. (by definition byte fields are base64 encoded).
         */
        rawContent?: string | null;
        /**
         * Required. The tool associated with this call. Format: `projects//locations//tools/`.
         */
        tool?: string | null;
    }
    /**
     * An error produced by the tool call.
     */
    export interface Schema$GoogleCloudDialogflowV2ToolCallResultError {
        /**
         * Optional. The error message of the function.
         */
        message?: string | null;
    }
    /**
     * Metadata for a ConversationModels.UndeployConversationModel operation.
     */
    export interface Schema$GoogleCloudDialogflowV2UndeployConversationModelOperationMetadata {
        /**
         * The resource name of the conversation model. Format: `projects//conversationModels/`
         */
        conversationModel?: string | null;
        /**
         * Timestamp when the request to undeploy conversation model was submitted. The time is measured on server side.
         */
        createTime?: string | null;
    }
    /**
     * The request message for a webhook call.
     */
    export interface Schema$GoogleCloudDialogflowV2WebhookRequest {
        /**
         * Optional. The contents of the original request that was passed to `[Streaming]DetectIntent` call.
         */
        originalDetectIntentRequest?: Schema$GoogleCloudDialogflowV2OriginalDetectIntentRequest;
        /**
         * The result of the conversational query or event processing. Contains the same value as `[Streaming]DetectIntentResponse.query_result`.
         */
        queryResult?: Schema$GoogleCloudDialogflowV2QueryResult;
        /**
         * The unique identifier of the response. Contains the same value as `[Streaming]DetectIntentResponse.response_id`.
         */
        responseId?: string | null;
        /**
         * The unique identifier of detectIntent request session. Can be used to identify end-user inside webhook implementation. Format: `projects//agent/sessions/`, or `projects//agent/environments//users//sessions/`.
         */
        session?: string | null;
    }
    /**
     * The response message for a webhook call. This response is validated by the Dialogflow server. If validation fails, an error will be returned in the QueryResult.diagnostic_info field. Setting JSON fields to an empty value with the wrong type is a common error. To avoid this error: - Use `""` for empty strings - Use `{\}` or `null` for empty objects - Use `[]` or `null` for empty arrays For more information, see the [Protocol Buffers Language Guide](https://developers.google.com/protocol-buffers/docs/proto3#json).
     */
    export interface Schema$GoogleCloudDialogflowV2WebhookResponse {
        /**
         * Optional. Invokes the supplied events. When this field is set, Dialogflow ignores the `fulfillment_text`, `fulfillment_messages`, and `payload` fields.
         */
        followupEventInput?: Schema$GoogleCloudDialogflowV2EventInput;
        /**
         * Optional. The rich response messages intended for the end-user. When provided, Dialogflow uses this field to populate QueryResult.fulfillment_messages sent to the integration or API caller.
         */
        fulfillmentMessages?: Schema$GoogleCloudDialogflowV2IntentMessage[];
        /**
         * Optional. The text response message intended for the end-user. It is recommended to use `fulfillment_messages.text.text[0]` instead. When provided, Dialogflow uses this field to populate QueryResult.fulfillment_text sent to the integration or API caller.
         */
        fulfillmentText?: string | null;
        /**
         * Optional. The collection of output contexts that will overwrite currently active contexts for the session and reset their lifespans. When provided, Dialogflow uses this field to populate QueryResult.output_contexts sent to the integration or API caller.
         */
        outputContexts?: Schema$GoogleCloudDialogflowV2Context[];
        /**
         * Optional. This field can be used to pass custom data from your webhook to the integration or API caller. Arbitrary JSON objects are supported. When provided, Dialogflow uses this field to populate QueryResult.webhook_payload sent to the integration or API caller. This field is also used by the [Google Assistant integration](https://cloud.google.com/dialogflow/docs/integrations/aog) for rich response messages. See the format definition at [Google Assistant Dialogflow webhook format](https://developers.google.com/assistant/actions/build/json/dialogflow-webhook-json)
         */
        payload?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. Additional session entity types to replace or extend developer entity types with. The entity synonyms apply to all languages and persist for the session. Setting this data from a webhook overwrites the session entity types that have been set using `detectIntent`, `streamingDetectIntent` or SessionEntityType management methods.
         */
        sessionEntityTypes?: Schema$GoogleCloudDialogflowV2SessionEntityType[];
        /**
         * Optional. A custom field used to identify the webhook source. Arbitrary strings are supported. When provided, Dialogflow uses this field to populate QueryResult.webhook_source sent to the integration or API caller.
         */
        source?: string | null;
    }
    /**
     * This message is used to hold all the Conversation Signals data, which will be converted to JSON and exported to BigQuery.
     */
    export interface Schema$GoogleCloudDialogflowV3alpha1ConversationSignals {
        /**
         * Required. Turn signals for the current turn.
         */
        turnSignals?: Schema$GoogleCloudDialogflowV3alpha1TurnSignals;
    }
    /**
     * Collection of all signals that were extracted for a single turn of the conversation.
     */
    export interface Schema$GoogleCloudDialogflowV3alpha1TurnSignals {
        /**
         * Whether agent responded with LiveAgentHandoff fulfillment.
         */
        agentEscalated?: boolean | null;
        /**
         * Whether user was using DTMF input.
         */
        dtmfUsed?: boolean | null;
        /**
         * Failure reasons of the turn.
         */
        failureReasons?: string[] | null;
        /**
         * Whether NLU predicted NO_MATCH.
         */
        noMatch?: boolean | null;
        /**
         * Whether user provided no input.
         */
        noUserInput?: boolean | null;
        /**
         * Whether turn resulted in End Session page.
         */
        reachedEndPage?: boolean | null;
        /**
         * Sentiment magnitude of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentMagnitude?: number | null;
        /**
         * Sentiment score of the user utterance if [sentiment](https://cloud.google.com/dialogflow/cx/docs/concept/sentiment) was enabled.
         */
        sentimentScore?: number | null;
        /**
         * Whether agent has triggered the event corresponding to user abandoning the conversation.
         */
        triggeredAbandonmentEvent?: boolean | null;
        /**
         * Whether user was specifically asking for a live agent.
         */
        userEscalated?: boolean | null;
        /**
         * Human-readable statuses of the webhooks triggered during this turn.
         */
        webhookStatuses?: string[] | null;
    }
    /**
     * The response message for Locations.ListLocations.
     */
    export interface Schema$GoogleCloudLocationListLocationsResponse {
        /**
         * A list of locations that matches the specified filter in the request.
         */
        locations?: Schema$GoogleCloudLocationLocation[];
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * A resource that represents a Google Cloud location.
     */
    export interface Schema$GoogleCloudLocationLocation {
        /**
         * The friendly name for this location, typically a nearby city name. For example, "Tokyo".
         */
        displayName?: string | null;
        /**
         * Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"\}
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The canonical id for this location. For example: `"us-east1"`.
         */
        locationId?: string | null;
        /**
         * Service-specific metadata. For example the available capacity at the given location.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`
         */
        name?: string | null;
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$GoogleLongrunningListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$GoogleLongrunningOperation[];
    }
    /**
     * This resource represents a long-running operation that is the result of a network API call.
     */
    export interface Schema$GoogleLongrunningOperation {
        /**
         * If the value is `false`, it means the operation is still in progress. If `true`, the operation is completed, and either `error` or `response` is available.
         */
        done?: boolean | null;
        /**
         * The error result of the operation in case of failure or cancellation.
         */
        error?: Schema$GoogleRpcStatus;
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
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    /**
     * The `Status` type defines a logical error model that is suitable for different programming environments, including REST APIs and RPC APIs. It is used by [gRPC](https://github.com/grpc). Each `Status` message contains three pieces of data: error code, error message, and error details. You can find out more about this error model and how to work with it in the [API Design Guide](https://cloud.google.com/apis/design/errors).
     */
    export interface Schema$GoogleRpcStatus {
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
     * An object that represents a latitude/longitude pair. This is expressed as a pair of doubles to represent degrees latitude and degrees longitude. Unless specified otherwise, this object must conform to the WGS84 standard. Values must be within normalized ranges.
     */
    export interface Schema$GoogleTypeLatLng {
        /**
         * The latitude in degrees. It must be in the range [-90.0, +90.0].
         */
        latitude?: number | null;
        /**
         * The longitude in degrees. It must be in the range [-180.0, +180.0].
         */
        longitude?: number | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        operations: Resource$Projects$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        agents: Resource$Projects$Locations$Agents;
        operations: Resource$Projects$Locations$Operations;
        securitySettings: Resource$Projects$Locations$Securitysettings;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudLocationLocation>>;
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudLocationLocation>, callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        get(params: Params$Resource$Projects$Locations$Get, callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudLocationLocation>): void;
        /**
         * Lists information about the supported locations for this service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudLocationListLocationsResponse>>;
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$List, callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudLocationListLocationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$List extends StandardParameters {
        /**
         * Optional. A list of extra location types that should be used as conditions for controlling the visibility of the locations.
         */
        extraLocationTypes?: string[];
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * The resource that owns the locations collection, if applicable.
         */
        name?: string;
        /**
         * The maximum number of results to return. If not set, the service selects a default.
         */
        pageSize?: number;
        /**
         * A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Agents {
        context: APIRequestContext;
        changelogs: Resource$Projects$Locations$Agents$Changelogs;
        conversations: Resource$Projects$Locations$Agents$Conversations;
        entityTypes: Resource$Projects$Locations$Agents$Entitytypes;
        environments: Resource$Projects$Locations$Agents$Environments;
        flows: Resource$Projects$Locations$Agents$Flows;
        generators: Resource$Projects$Locations$Agents$Generators;
        intents: Resource$Projects$Locations$Agents$Intents;
        playbooks: Resource$Projects$Locations$Agents$Playbooks;
        sessions: Resource$Projects$Locations$Agents$Sessions;
        testCases: Resource$Projects$Locations$Agents$Testcases;
        tools: Resource$Projects$Locations$Agents$Tools;
        transitionRouteGroups: Resource$Projects$Locations$Agents$Transitionroutegroups;
        webhooks: Resource$Projects$Locations$Agents$Webhooks;
        constructor(context: APIRequestContext);
        /**
         * Creates an agent in the specified location. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Agent>>;
        create(params: Params$Resource$Projects$Locations$Agents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        /**
         * Deletes the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the specified agent to a binary file. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: ExportAgentResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Agent>>;
        get(params: Params$Resource$Projects$Locations$Agents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        /**
         * Gets the generative settings for the agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Getgenerativesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getGenerativeSettings(params?: Params$Resource$Projects$Locations$Agents$Getgenerativesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>>;
        getGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Getgenerativesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Getgenerativesettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        getGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Getgenerativesettings, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        getGenerativeSettings(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        /**
         * Gets the latest agent validation result. Agent validation is performed when ValidateAgent is called.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Getvalidationresult, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getValidationResult(params?: Params$Resource$Projects$Locations$Agents$Getvalidationresult, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>>;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Getvalidationresult, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Getvalidationresult, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Getvalidationresult, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
        getValidationResult(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
        /**
         * Returns the list of all agents in the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListAgentsResponse>): void;
        /**
         * Updates the specified agent. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Agent>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Agent>): void;
        /**
         * Restores the specified agent from a binary file. Replaces the current agent with a new one. Note that all existing resources in agent (e.g. intents, entity types, flows) will be removed. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: An [Empty message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#empty) Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restore(params: Params$Resource$Projects$Locations$Agents$Restore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restore(params?: Params$Resource$Projects$Locations$Agents$Restore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        restore(params: Params$Resource$Projects$Locations$Agents$Restore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Restore, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Restore, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        restore(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Updates the generative settings for the agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Updategenerativesettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateGenerativeSettings(params?: Params$Resource$Projects$Locations$Agents$Updategenerativesettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>>;
        updateGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Updategenerativesettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Updategenerativesettings, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        updateGenerativeSettings(params: Params$Resource$Projects$Locations$Agents$Updategenerativesettings, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        updateGenerativeSettings(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings>): void;
        /**
         * Validates the specified agent and creates or updates validation results. The agent in draft version is validated. Please call this API after the training is completed to get the complete validation results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        validate(params: Params$Resource$Projects$Locations$Agents$Validate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        validate(params?: Params$Resource$Projects$Locations$Agents$Validate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>>;
        validate(params: Params$Resource$Projects$Locations$Agents$Validate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        validate(params: Params$Resource$Projects$Locations$Agents$Validate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
        validate(params: Params$Resource$Projects$Locations$Agents$Validate, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
        validate(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AgentValidationResult>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Create extends StandardParameters {
        /**
         * Required. The location to create a agent for. Format: `projects//locations/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Agent;
    }
    export interface Params$Resource$Projects$Locations$Agents$Delete extends StandardParameters {
        /**
         * Required. The name of the agent to delete. Format: `projects//locations//agents/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Export extends StandardParameters {
        /**
         * Required. The name of the agent to export. Format: `projects//locations//agents/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportAgentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Get extends StandardParameters {
        /**
         * Required. The name of the agent. Format: `projects//locations//agents/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Getgenerativesettings extends StandardParameters {
        /**
         * Required. Language code of the generative settings.
         */
        languageCode?: string;
        /**
         * Required. Format: `projects//locations//agents//generativeSettings`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Getvalidationresult extends StandardParameters {
        /**
         * If not specified, the agent's default language is used.
         */
        languageCode?: string;
        /**
         * Required. The agent name. Format: `projects//locations//agents//validationResult`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The location to list all agents for. Format: `projects//locations/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Patch extends StandardParameters {
        /**
         * The unique identifier of the agent. Required for the Agents.UpdateAgent method. Agents.CreateAgent populates the name automatically. Format: `projects//locations//agents/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Agent;
    }
    export interface Params$Resource$Projects$Locations$Agents$Restore extends StandardParameters {
        /**
         * Required. The name of the agent to restore into. Format: `projects//locations//agents/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1RestoreAgentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Updategenerativesettings extends StandardParameters {
        /**
         * Format: `projects//locations//agents//generativeSettings`.
         */
        name?: string;
        /**
         * Optional. The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1GenerativeSettings;
    }
    export interface Params$Resource$Projects$Locations$Agents$Validate extends StandardParameters {
        /**
         * Required. The agent to validate. Format: `projects//locations//agents/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ValidateAgentRequest;
    }
    export class Resource$Projects$Locations$Agents$Changelogs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the specified Changelog.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Changelogs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Changelogs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Changelog>>;
        get(params: Params$Resource$Projects$Locations$Agents$Changelogs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Changelogs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Changelog>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Changelog>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Changelogs$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Changelog>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Changelog>): void;
        /**
         * Returns the list of Changelogs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Changelogs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Changelogs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Changelogs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Changelogs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Changelogs$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListChangelogsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Changelogs$Get extends StandardParameters {
        /**
         * Required. The name of the changelog to get. Format: `projects//locations//agents//changelogs/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Changelogs$List extends StandardParameters {
        /**
         * The filter string. Supports filter by user_email, resource, type and create_time. Some examples: 1. By user email: user_email = "someone@google.com" 2. By resource name: resource = "projects/123/locations/global/agents/456/flows/789" 3. By resource display name: display_name = "my agent" 4. By action: action = "Create" 5. By type: type = "flows" 6. By create time. Currently predicates on `create_time` and `create_time_epoch_seconds` are supported: create_time_epoch_seconds \> 1551790877 AND create_time <= 2017-01-15T01:30:15.01Z 7. Combination of above filters: resource = "projects/123/locations/global/agents/456/flows/789" AND user_email = "someone@google.com" AND create_time <= 2017-01-15T01:30:15.01Z
         */
        filter?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent containing the changelogs. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Agents$Conversations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes the specified conversation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Conversations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Conversations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Conversations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Conversations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Conversations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified conversation.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Conversations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Conversations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Conversation>>;
        get(params: Params$Resource$Projects$Locations$Agents$Conversations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Conversations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Conversation>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Conversation>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Conversations$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Conversation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Conversation>): void;
        /**
         * Returns the list of all conversations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Conversations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Conversations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Conversations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Conversations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Conversations$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListConversationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Conversations$Delete extends StandardParameters {
        /**
         * Required. The name of the conversation. Format: `projects//locations//agents//conversations/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Conversations$Get extends StandardParameters {
        /**
         * Required. The name of the conversation. Format: `projects//locations//agents//conversations/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Conversations$List extends StandardParameters {
        /**
         * Optional. The filter string. Supports filter by create_time, metrics.has_end_interaction, metrics.has_live_agent_handoff, intents.display_name, pages.display_name and flows.display_name. Timestamps expect an RFC-3339 formatted string (e.g. 2012-04-21T11:30:00-04:00). UTC offsets are supported. Some examples: 1. By create time: create_time \> "2022-04-21T11:30:00-04:00" 2. By intent display name: intents.display_name : "billing" 3. By end interaction signal: metrics.has_end_interaction = true
         */
        filter?: string;
        /**
         * Optional. The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all conversations for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Agents$Entitytypes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an entity type in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1EntityType>>;
        create(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        /**
         * Deletes the specified entity type. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the selected entity types.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1EntityType>>;
        get(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        /**
         * Imports the specified entitytypes into the agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        import(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Import, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Returns the list of all entity types in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Entitytypes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Entitytypes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Entitytypes$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Entitytypes$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEntityTypesResponse>): void;
        /**
         * Updates the specified entity type. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Entitytypes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1EntityType>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Entitytypes$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1EntityType>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Create extends StandardParameters {
        /**
         * The language of the following fields in `entity_type`: * `EntityType.entities.value` * `EntityType.entities.synonyms` * `EntityType.excluded_phrases.value` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The agent to create a entity type for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1EntityType;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Delete extends StandardParameters {
        /**
         * This field has no effect for entity type not being used. For entity types that are used by intents or pages: * If `force` is set to false, an error will be returned with message indicating the referencing resources. * If `force` is set to true, Dialogflow will remove the entity type, as well as any references to the entity type (i.e. Page parameter of the entity type will be changed to '@sys.any' and intent parameter of the entity type will be removed).
         */
        force?: boolean;
        /**
         * Required. The name of the entity type to delete. Format: `projects//locations//agents//entityTypes/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Export extends StandardParameters {
        /**
         * Required. The name of the parent agent to export entity types. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportEntityTypesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Get extends StandardParameters {
        /**
         * The language to retrieve the entity type for. The following fields are language dependent: * `EntityType.entities.value` * `EntityType.entities.synonyms` * `EntityType.excluded_phrases.value` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the entity type. Format: `projects//locations//agents//entityTypes/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Import extends StandardParameters {
        /**
         * Required. The agent to import the entity types into. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ImportEntityTypesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$List extends StandardParameters {
        /**
         * The language to list entity types for. The following fields are language dependent: * `EntityType.entities.value` * `EntityType.entities.synonyms` * `EntityType.excluded_phrases.value` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all entity types for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Entitytypes$Patch extends StandardParameters {
        /**
         * The language of the following fields in `entity_type`: * `EntityType.entities.value` * `EntityType.entities.synonyms` * `EntityType.excluded_phrases.value` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the entity type. Required for EntityTypes.UpdateEntityType. Format: `projects//locations//agents//entityTypes/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1EntityType;
    }
    export class Resource$Projects$Locations$Agents$Environments {
        context: APIRequestContext;
        continuousTestResults: Resource$Projects$Locations$Agents$Environments$Continuoustestresults;
        deployments: Resource$Projects$Locations$Agents$Environments$Deployments;
        experiments: Resource$Projects$Locations$Agents$Environments$Experiments;
        sessions: Resource$Projects$Locations$Agents$Environments$Sessions;
        constructor(context: APIRequestContext);
        /**
         * Creates an Environment in the specified Agent. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: Environment
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Environments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Environments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Deploys a flow to the specified Environment. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: DeployFlowMetadata - `response`: DeployFlowResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deployFlow(params: Params$Resource$Projects$Locations$Agents$Environments$Deployflow, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deployFlow(params?: Params$Resource$Projects$Locations$Agents$Environments$Deployflow, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        deployFlow(params: Params$Resource$Projects$Locations$Agents$Environments$Deployflow, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deployFlow(params: Params$Resource$Projects$Locations$Agents$Environments$Deployflow, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        deployFlow(params: Params$Resource$Projects$Locations$Agents$Environments$Deployflow, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        deployFlow(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Environments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Environment>>;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Environment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Environment>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Environment>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Environment>): void;
        /**
         * Returns the list of all environments in the specified Agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Environments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Environments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListEnvironmentsResponse>): void;
        /**
         * Looks up the history of the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookupEnvironmentHistory(params: Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookupEnvironmentHistory(params?: Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse>>;
        lookupEnvironmentHistory(params: Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookupEnvironmentHistory(params: Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse>): void;
        lookupEnvironmentHistory(params: Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse>): void;
        lookupEnvironmentHistory(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1LookupEnvironmentHistoryResponse>): void;
        /**
         * Updates the specified Environment. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: Environment
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Environments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Patch, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Kicks off a continuous test under the specified Environment. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: RunContinuousTestMetadata - `response`: RunContinuousTestResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        runContinuousTest(params: Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        runContinuousTest(params?: Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        runContinuousTest(params: Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        runContinuousTest(params: Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        runContinuousTest(params: Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        runContinuousTest(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Create extends StandardParameters {
        /**
         * Required. The Agent to create an Environment for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Environment;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Delete extends StandardParameters {
        /**
         * Required. The name of the Environment to delete. Format: `projects//locations//agents//environments/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Deployflow extends StandardParameters {
        /**
         * Required. The environment to deploy the flow to. Format: `projects//locations//agents//environments/`.
         */
        environment?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1DeployFlowRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Get extends StandardParameters {
        /**
         * Required. The name of the Environment. Format: `projects//locations//agents//environments/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20 and at most 100.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The Agent to list all environments for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Lookupenvironmenthistory extends StandardParameters {
        /**
         * Required. Resource name of the environment to look up the history for. Format: `projects//locations//agents//environments/`.
         */
        name?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Patch extends StandardParameters {
        /**
         * The name of the environment. Format: `projects//locations//agents//environments/`.
         */
        name?: string;
        /**
         * Required. The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Environment;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Runcontinuoustest extends StandardParameters {
        /**
         * Required. Format: `projects//locations//agents//environments/`.
         */
        environment?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1RunContinuousTestRequest;
    }
    export class Resource$Projects$Locations$Agents$Environments$Continuoustestresults {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Fetches a list of continuous test results for a given environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListContinuousTestResultsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Continuoustestresults$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The environment to list results for. Format: `projects//locations//agents//environments/`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Agents$Environments$Deployments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the specified Deployment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Deployment>>;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Deployment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Deployment>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Deployment>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Deployment>): void;
        /**
         * Returns the list of all deployments in the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Environments$Deployments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Deployments$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListDeploymentsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Deployments$Get extends StandardParameters {
        /**
         * Required. The name of the Deployment. Format: `projects//locations//agents//environments//deployments/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Deployments$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20 and at most 100.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The Environment to list all environments for. Format: `projects//locations//agents//environments/`.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Agents$Environments$Experiments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an Experiment in the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Experiment>>;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        /**
         * Deletes the specified Experiment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified Experiment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Experiment>>;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        /**
         * Returns the list of all experiments in the specified Environment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExperimentsResponse>): void;
        /**
         * Updates the specified Experiment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Experiment>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        /**
         * Starts the specified Experiment. This rpc only changes the state of experiment from PENDING to RUNNING.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        start(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        start(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Experiment>>;
        start(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        start(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        start(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        start(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        /**
         * Stops the specified Experiment. This rpc only changes the state of experiment from RUNNING to DONE.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        stop(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stop(params?: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Experiment>>;
        stop(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stop(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        stop(params: Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
        stop(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Experiment>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Create extends StandardParameters {
        /**
         * Required. The Agent to create an Environment for. Format: `projects//locations//agents//environments/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Experiment;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Delete extends StandardParameters {
        /**
         * Required. The name of the Environment to delete. Format: `projects//locations//agents//environments//experiments/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Get extends StandardParameters {
        /**
         * Required. The name of the Environment. Format: `projects//locations//agents//environments//experiments/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20 and at most 100.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The Environment to list all environments for. Format: `projects//locations//agents//environments/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Patch extends StandardParameters {
        /**
         * The name of the experiment. Format: projects//locations//agents//environments//experiments/.
         */
        name?: string;
        /**
         * Required. The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Experiment;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Start extends StandardParameters {
        /**
         * Required. Resource name of the experiment to start. Format: `projects//locations//agents//environments//experiments/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1StartExperimentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Experiments$Stop extends StandardParameters {
        /**
         * Required. Resource name of the experiment to stop. Format: `projects//locations//agents//environments//experiments/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1StopExperimentRequest;
    }
    export class Resource$Projects$Locations$Agents$Environments$Sessions {
        context: APIRequestContext;
        entityTypes: Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes;
        constructor(context: APIRequestContext);
        /**
         * Processes a natural language query and returns structured, actionable data as a result. This method is not idempotent, because it may cause session entity types to be updated, which in turn might affect results of future queries. Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        detectIntent(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>>;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        detectIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        /**
         * Fulfills a matched intent returned by MatchIntent. Must be called after MatchIntent, with input from MatchIntentResponse. Otherwise, the behavior is undefined.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fulfillIntent(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>>;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        fulfillIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        /**
         * Returns preliminary intent match results, doesn't change the session status.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        matchIntent(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>>;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        matchIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        /**
         * Processes a natural language query and returns structured, actionable data as a result through server-side streaming. Server-side streaming allows Dialogflow to send [partial responses](https://cloud.google.com/dialogflow/cx/docs/concept/fulfillment#partial-response) earlier in a single request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        serverStreamingDetectIntent(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>>;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        serverStreamingDetectIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Detectintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session). Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Fulfillintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Matchintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1MatchIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Serverstreamingdetectintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session). Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest;
    }
    export class Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        /**
         * Deletes the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        /**
         * Returns the list of all session entity types in the specified session.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        /**
         * Updates the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Create extends StandardParameters {
        /**
         * Required. The session to create a session entity type for. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Delete extends StandardParameters {
        /**
         * Required. The name of the session entity type to delete. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Get extends StandardParameters {
        /**
         * Required. The name of the session entity type. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The session to list all session entity types from. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Environments$Sessions$Entitytypes$Patch extends StandardParameters {
        /**
         * Required. The unique identifier of the session entity type. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
        /**
         * The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType;
    }
    export class Resource$Projects$Locations$Agents$Flows {
        context: APIRequestContext;
        pages: Resource$Projects$Locations$Agents$Flows$Pages;
        transitionRouteGroups: Resource$Projects$Locations$Agents$Flows$Transitionroutegroups;
        versions: Resource$Projects$Locations$Agents$Flows$Versions;
        constructor(context: APIRequestContext);
        /**
         * Creates a flow in the specified agent. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Flows$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Flow>>;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        /**
         * Deletes a specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Flows$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the specified flow to a binary file. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: ExportFlowResponse Note that resources (e.g. intents, entities, webhooks) that the flow references will also be exported.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Flows$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Flows$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Flows$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Flows$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Flows$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Flows$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Flow>>;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        /**
         * Gets the latest flow validation result. Flow validation is performed when ValidateFlow is called.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getValidationResult(params?: Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>>;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
        getValidationResult(params: Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
        getValidationResult(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
        /**
         * Imports the specified flow to the specified agent from a binary file. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: ImportFlowResponse Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Agents$Flows$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Agents$Flows$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        import(params: Params$Resource$Projects$Locations$Agents$Flows$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Flows$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Flows$Import, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Returns the list of all flows in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Flows$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Flows$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListFlowsResponse>): void;
        /**
         * Updates the specified flow. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Flows$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Flow>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Flow>): void;
        /**
         * Trains the specified flow. Note that only the flow in 'draft' environment is trained. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: An [Empty message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#empty) Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        train(params: Params$Resource$Projects$Locations$Agents$Flows$Train, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        train(params?: Params$Resource$Projects$Locations$Agents$Flows$Train, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        train(params: Params$Resource$Projects$Locations$Agents$Flows$Train, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        train(params: Params$Resource$Projects$Locations$Agents$Flows$Train, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        train(params: Params$Resource$Projects$Locations$Agents$Flows$Train, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        train(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Validates the specified flow and creates or updates validation results. Please call this API after the training is completed to get the complete validation results.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        validate(params: Params$Resource$Projects$Locations$Agents$Flows$Validate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        validate(params?: Params$Resource$Projects$Locations$Agents$Flows$Validate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>>;
        validate(params: Params$Resource$Projects$Locations$Agents$Flows$Validate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        validate(params: Params$Resource$Projects$Locations$Agents$Flows$Validate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
        validate(params: Params$Resource$Projects$Locations$Agents$Flows$Validate, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
        validate(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FlowValidationResult>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Create extends StandardParameters {
        /**
         * The language of the following fields in `flow`: * `Flow.event_handlers.trigger_fulfillment.messages` * `Flow.event_handlers.trigger_fulfillment.conditional_cases` * `Flow.transition_routes.trigger_fulfillment.messages` * `Flow.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The agent to create a flow for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Flow;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Delete extends StandardParameters {
        /**
         * This field has no effect for flows with no incoming transitions. For flows with incoming transitions: * If `force` is set to false, an error will be returned with message indicating the incoming transitions. * If `force` is set to true, Dialogflow will remove the flow, as well as any transitions to the flow (i.e. Target flow in event handlers or Target flow in transition routes that point to this flow will be cleared).
         */
        force?: boolean;
        /**
         * Required. The name of the flow to delete. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Export extends StandardParameters {
        /**
         * Required. The name of the flow to export. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportFlowRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Get extends StandardParameters {
        /**
         * The language to retrieve the flow for. The following fields are language dependent: * `Flow.event_handlers.trigger_fulfillment.messages` * `Flow.event_handlers.trigger_fulfillment.conditional_cases` * `Flow.transition_routes.trigger_fulfillment.messages` * `Flow.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the flow to get. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Getvalidationresult extends StandardParameters {
        /**
         * If not specified, the agent's default language is used.
         */
        languageCode?: string;
        /**
         * Required. The flow name. Format: `projects//locations//agents//flows//validationResult`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Import extends StandardParameters {
        /**
         * Required. The agent to import the flow into. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ImportFlowRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$List extends StandardParameters {
        /**
         * The language to list flows for. The following fields are language dependent: * `Flow.event_handlers.trigger_fulfillment.messages` * `Flow.event_handlers.trigger_fulfillment.conditional_cases` * `Flow.transition_routes.trigger_fulfillment.messages` * `Flow.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent containing the flows. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Patch extends StandardParameters {
        /**
         * The language of the following fields in `flow`: * `Flow.event_handlers.trigger_fulfillment.messages` * `Flow.event_handlers.trigger_fulfillment.conditional_cases` * `Flow.transition_routes.trigger_fulfillment.messages` * `Flow.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the flow. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Flow;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Train extends StandardParameters {
        /**
         * Required. The flow to train. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TrainFlowRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Validate extends StandardParameters {
        /**
         * Required. The flow to validate. Format: `projects//locations//agents//flows/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ValidateFlowRequest;
    }
    export class Resource$Projects$Locations$Agents$Flows$Pages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a page in the specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Flows$Pages$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Page>>;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        /**
         * Deletes the specified page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Flows$Pages$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Page>>;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        /**
         * Returns the list of all pages in the specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Flows$Pages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPagesResponse>): void;
        /**
         * Updates the specified page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Page>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Page>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Pages$Create extends StandardParameters {
        /**
         * The language of the following fields in `page`: * `Page.entry_fulfillment.messages` * `Page.entry_fulfillment.conditional_cases` * `Page.event_handlers.trigger_fulfillment.messages` * `Page.event_handlers.trigger_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.messages` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.messages` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.conditional_cases` * `Page.transition_routes.trigger_fulfillment.messages` * `Page.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The flow to create a page for. Format: `projects//locations//agents//flows/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Page;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Pages$Delete extends StandardParameters {
        /**
         * This field has no effect for pages with no incoming transitions. For pages with incoming transitions: * If `force` is set to false, an error will be returned with message indicating the incoming transitions. * If `force` is set to true, Dialogflow will remove the page, as well as any transitions to the page (i.e. Target page in event handlers or Target page in transition routes that point to this page will be cleared).
         */
        force?: boolean;
        /**
         * Required. The name of the page to delete. Format: `projects//locations//agents//Flows//pages/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Pages$Get extends StandardParameters {
        /**
         * The language to retrieve the page for. The following fields are language dependent: * `Page.entry_fulfillment.messages` * `Page.entry_fulfillment.conditional_cases` * `Page.event_handlers.trigger_fulfillment.messages` * `Page.event_handlers.trigger_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.messages` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.messages` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.conditional_cases` * `Page.transition_routes.trigger_fulfillment.messages` * `Page.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the page. Format: `projects//locations//agents//flows//pages/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Pages$List extends StandardParameters {
        /**
         * The language to list pages for. The following fields are language dependent: * `Page.entry_fulfillment.messages` * `Page.entry_fulfillment.conditional_cases` * `Page.event_handlers.trigger_fulfillment.messages` * `Page.event_handlers.trigger_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.messages` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.messages` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.conditional_cases` * `Page.transition_routes.trigger_fulfillment.messages` * `Page.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The flow to list all pages for. Format: `projects//locations//agents//flows/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Pages$Patch extends StandardParameters {
        /**
         * The language of the following fields in `page`: * `Page.entry_fulfillment.messages` * `Page.entry_fulfillment.conditional_cases` * `Page.event_handlers.trigger_fulfillment.messages` * `Page.event_handlers.trigger_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.messages` * `Page.form.parameters.fill_behavior.initial_prompt_fulfillment.conditional_cases` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.messages` * `Page.form.parameters.fill_behavior.reprompt_event_handlers.conditional_cases` * `Page.transition_routes.trigger_fulfillment.messages` * `Page.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the page. Required for the Pages.UpdatePage method. Pages.CreatePage populates the name automatically. Format: `projects//locations//agents//flows//pages/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Page;
    }
    export class Resource$Projects$Locations$Agents$Flows$Transitionroutegroups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an TransitionRouteGroup in the specified flow. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        /**
         * Deletes the specified TransitionRouteGroup. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified TransitionRouteGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        /**
         * Returns the list of all transition route groups in the specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        /**
         * Updates the specified TransitionRouteGroup. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Create extends StandardParameters {
        /**
         * The language of the following fields in `TransitionRouteGroup`: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The flow to create an TransitionRouteGroup for. Format: `projects//locations//agents//flows/` or `projects//locations//agents/` for agent-level groups.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Delete extends StandardParameters {
        /**
         * This field has no effect for transition route group that no page is using. If the transition route group is referenced by any page: * If `force` is set to false, an error will be returned with message indicating pages that reference the transition route group. * If `force` is set to true, Dialogflow will remove the transition route group, as well as any reference to it.
         */
        force?: boolean;
        /**
         * Required. The name of the TransitionRouteGroup to delete. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Get extends StandardParameters {
        /**
         * The language to retrieve the transition route group for. The following fields are language dependent: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the TransitionRouteGroup. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$List extends StandardParameters {
        /**
         * The language to list transition route groups for. The following fields are language dependent: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The flow to list all transition route groups for. Format: `projects//locations//agents//flows/` or `projects//locations//agents/.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Transitionroutegroups$Patch extends StandardParameters {
        /**
         * The language of the following fields in `TransitionRouteGroup`: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the transition route group. TransitionRouteGroups.CreateTransitionRouteGroup populates the name automatically. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        name?: string;
        /**
         * The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup;
    }
    export class Resource$Projects$Locations$Agents$Flows$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Compares the specified base version with target version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        compareVersions(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        compareVersions(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse>>;
        compareVersions(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        compareVersions(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse>): void;
        compareVersions(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse>): void;
        compareVersions(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsResponse>): void;
        /**
         * Creates a Version in the specified Flow. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: CreateVersionOperationMetadata - `response`: Version
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Create, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        create(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Deletes the specified Version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified Version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Version>>;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
        /**
         * Returns the list of all versions in the specified Flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListVersionsResponse>): void;
        /**
         * Loads resources in the specified version to the draft flow. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: An empty [Struct message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#struct) - `response`: An [Empty message](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#empty)
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        load(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Load, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        load(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Load, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        load(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Load, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        load(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Load, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        load(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Load, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        load(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Updates the specified Version.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Version>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Version>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Compareversions extends StandardParameters {
        /**
         * Required. Name of the base flow version to compare with the target version. Use version ID `0` to indicate the draft version of the specified flow. Format: `projects//locations//agents//flows//versions/`.
         */
        baseVersion?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1CompareVersionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Create extends StandardParameters {
        /**
         * Required. The Flow to create an Version for. Format: `projects//locations//agents//flows/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Version;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Delete extends StandardParameters {
        /**
         * Required. The name of the Version to delete. Format: `projects//locations//agents//flows//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Get extends StandardParameters {
        /**
         * Required. The name of the Version. Format: `projects//locations//agents//flows//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20 and at most 100.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The Flow to list all versions for. Format: `projects//locations//agents//flows/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Load extends StandardParameters {
        /**
         * Required. The Version to be loaded to draft flow. Format: `projects//locations//agents//flows//versions/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1LoadVersionRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Flows$Versions$Patch extends StandardParameters {
        /**
         * Format: projects//locations//agents//flows//versions/. Version ID is a self-increasing number generated by Dialogflow upon version creation.
         */
        name?: string;
        /**
         * Required. The mask to control which fields get updated. Currently only `description` and `display_name` can be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Version;
    }
    export class Resource$Projects$Locations$Agents$Generators {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a generator in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Generators$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Generators$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Generator>>;
        create(params: Params$Resource$Projects$Locations$Agents$Generators$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Generators$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Generators$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        /**
         * Deletes the specified generators.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Generators$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Generators$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Generators$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Generators$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Generators$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified generator.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Generators$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Generators$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Generator>>;
        get(params: Params$Resource$Projects$Locations$Agents$Generators$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Generators$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Generators$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        /**
         * Returns the list of all generators in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Generators$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Generators$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Generators$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Generators$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Generators$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListGeneratorsResponse>): void;
        /**
         * Update the specified generator.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Generators$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Generators$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Generator>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Generators$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Generators$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Generators$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Generator>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Generators$Create extends StandardParameters {
        /**
         * The language to create generators for the following fields: * `Generator.prompt_text.text` If not specified, the agent's default language is used.
         */
        languageCode?: string;
        /**
         * Required. The agent to create a generator for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Generator;
    }
    export interface Params$Resource$Projects$Locations$Agents$Generators$Delete extends StandardParameters {
        /**
         * This field has no effect for generators not being used. For generators that are used by pages/flows/transition route groups: * If `force` is set to false, an error will be returned with message indicating the referenced resources. * If `force` is set to true, Dialogflow will remove the generator, as well as any references to the generator (i.e. Generator) in fulfillments.
         */
        force?: boolean;
        /**
         * Required. The name of the generator to delete. Format: `projects//locations//agents//generators/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Generators$Get extends StandardParameters {
        /**
         * The language to list generators for.
         */
        languageCode?: string;
        /**
         * Required. The name of the generator. Format: `projects//locations//agents//generators/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Generators$List extends StandardParameters {
        /**
         * The language to list generators for.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all generators for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Generators$Patch extends StandardParameters {
        /**
         * The language to list generators for.
         */
        languageCode?: string;
        /**
         * The unique identifier of the generator. Must be set for the Generators.UpdateGenerator method. Generators.CreateGenerate populates the name automatically. Format: `projects//locations//agents//generators/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Generator;
    }
    export class Resource$Projects$Locations$Agents$Intents {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an intent in the specified agent. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Intents$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Intents$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Intent>>;
        create(params: Params$Resource$Projects$Locations$Agents$Intents$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Intents$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Intents$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        /**
         * Deletes the specified intent. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Intents$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Intents$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Intents$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Intents$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Intents$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the selected intents. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: ExportIntentsMetadata - `response`: ExportIntentsResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Intents$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Intents$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Intents$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Intents$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Intents$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified intent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Intents$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Intents$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Intent>>;
        get(params: Params$Resource$Projects$Locations$Agents$Intents$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Intents$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Intents$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        /**
         * Imports the specified intents into the agent. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: ImportIntentsMetadata - `response`: ImportIntentsResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Agents$Intents$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Agents$Intents$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        import(params: Params$Resource$Projects$Locations$Agents$Intents$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Intents$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Intents$Import, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Returns the list of all intents in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Intents$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Intents$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Intents$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Intents$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Intents$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListIntentsResponse>): void;
        /**
         * Updates the specified intent. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Intents$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Intents$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Intent>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Intents$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Intents$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Intents$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Intent>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Create extends StandardParameters {
        /**
         * The language of the following fields in `intent`: * `Intent.training_phrases.parts.text` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The agent to create an intent for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Intent;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Delete extends StandardParameters {
        /**
         * Required. The name of the intent to delete. Format: `projects//locations//agents//intents/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Export extends StandardParameters {
        /**
         * Required. The name of the parent agent to export intents. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportIntentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Get extends StandardParameters {
        /**
         * The language to retrieve the intent for. The following fields are language dependent: * `Intent.training_phrases.parts.text` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the intent. Format: `projects//locations//agents//intents/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Import extends StandardParameters {
        /**
         * Required. The agent to import the intents into. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ImportIntentsRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$List extends StandardParameters {
        /**
         * The resource view to apply to the returned intent.
         */
        intentView?: string;
        /**
         * The language to list intents for. The following fields are language dependent: * `Intent.training_phrases.parts.text` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all intents for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Intents$Patch extends StandardParameters {
        /**
         * The language of the following fields in `intent`: * `Intent.training_phrases.parts.text` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the intent. Required for the Intents.UpdateIntent method. Intents.CreateIntent populates the name automatically. Format: `projects//locations//agents//intents/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Intent;
    }
    export class Resource$Projects$Locations$Agents$Playbooks {
        context: APIRequestContext;
        examples: Resource$Projects$Locations$Agents$Playbooks$Examples;
        versions: Resource$Projects$Locations$Agents$Playbooks$Versions;
        constructor(context: APIRequestContext);
        /**
         * Creates a playbook in a specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Playbook>>;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        /**
         * Deletes a specified playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the specified playbook to a binary file. Note that resources (e.g. examples, tools) that the playbook references will also be exported.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Playbooks$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Playbooks$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Playbooks$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Playbooks$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Playbook>>;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        /**
         * Imports the specified playbook to the specified agent from a binary file.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Agents$Playbooks$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        import(params: Params$Resource$Projects$Locations$Agents$Playbooks$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Playbooks$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Playbooks$Import, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Returns a list of playbooks in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Playbooks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybooksResponse>): void;
        /**
         * Updates the specified Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Playbook>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Playbook>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Create extends StandardParameters {
        /**
         * Required. The agent to create a playbook for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Playbook;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Delete extends StandardParameters {
        /**
         * Required. The name of the playbook to delete. Format: `projects//locations//agents//playbooks/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Export extends StandardParameters {
        /**
         * Required. The name of the playbook to export. Format: `projects//locations//agents//playbooks/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportPlaybookRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Get extends StandardParameters {
        /**
         * Required. The name of the playbook. Format: `projects//locations//agents//playbooks/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Import extends StandardParameters {
        /**
         * Required. The agent to import the playbook into. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ImportPlaybookRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list playbooks from. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Patch extends StandardParameters {
        /**
         * The unique identifier of the playbook. Format: `projects//locations//agents//playbooks/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Playbook;
    }
    export class Resource$Projects$Locations$Agents$Playbooks$Examples {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an example in the specified playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Example>>;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        /**
         * Deletes the specified example.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified example.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Example>>;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        /**
         * Returns a list of examples in the specified playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListExamplesResponse>): void;
        /**
         * Update the specified example.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Example>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Example>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Create extends StandardParameters {
        /**
         * Required. The playbook to create an example for. Format: `projects//locations//agents//playbooks/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Example;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Delete extends StandardParameters {
        /**
         * Required. The name of the example to delete. Format: `projects//locations//agents//playbooks//examples/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Get extends StandardParameters {
        /**
         * Required. The name of the example. Format: `projects//locations//agents//playbooks//examples/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Examples$List extends StandardParameters {
        /**
         * Optional. The language to list examples for. If not specified, list all examples under the playbook. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Optional. The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The playbook to list the examples from. Format: `projects//locations//agents//playbooks/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Examples$Patch extends StandardParameters {
        /**
         * The unique identifier of the playbook example. Format: `projects//locations//agents//playbooks//examples/`.
         */
        name?: string;
        /**
         * Optional. The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Example;
    }
    export class Resource$Projects$Locations$Agents$Playbooks$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a version for the specified Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>>;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        /**
         * Deletes the specified version of the Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified version of the Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>>;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion>): void;
        /**
         * Lists versions for the specified Playbook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListPlaybookVersionsResponse>): void;
        /**
         * Retrieves the specified version of the Playbook and stores it as the current playbook draft, returning the playbook with resources updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restore(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restore(params?: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse>>;
        restore(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse>): void;
        restore(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Create extends StandardParameters {
        /**
         * Required. The playbook to create a version for. Format: `projects//locations//agents//playbooks/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1PlaybookVersion;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Delete extends StandardParameters {
        /**
         * Required. The name of the playbook version to delete. Format: `projects//locations//agents//playbooks//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Get extends StandardParameters {
        /**
         * Required. The name of the playbook version. Format: `projects//locations//agents//playbooks//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Versions$List extends StandardParameters {
        /**
         * Optional. The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The playbook to list versions for. Format: `projects//locations//agents//playbooks/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Playbooks$Versions$Restore extends StandardParameters {
        /**
         * Required. The name of the playbook version. Format: `projects//locations//agents//playbooks//versions/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1RestorePlaybookVersionRequest;
    }
    export class Resource$Projects$Locations$Agents$Sessions {
        context: APIRequestContext;
        entityTypes: Resource$Projects$Locations$Agents$Sessions$Entitytypes;
        constructor(context: APIRequestContext);
        /**
         * Processes a natural language query and returns structured, actionable data as a result. This method is not idempotent, because it may cause session entity types to be updated, which in turn might affect results of future queries. Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Detectintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        detectIntent(params?: Params$Resource$Projects$Locations$Agents$Sessions$Detectintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>>;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Detectintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Detectintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        detectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Detectintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        detectIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        /**
         * Fulfills a matched intent returned by MatchIntent. Must be called after MatchIntent, with input from MatchIntentResponse. Otherwise, the behavior is undefined.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fulfillIntent(params?: Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>>;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        fulfillIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        fulfillIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentResponse>): void;
        /**
         * Returns preliminary intent match results, doesn't change the session status.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Matchintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        matchIntent(params?: Params$Resource$Projects$Locations$Agents$Sessions$Matchintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>>;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Matchintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Matchintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        matchIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Matchintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        matchIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1MatchIntentResponse>): void;
        /**
         * Processes a natural language query and returns structured, actionable data as a result through server-side streaming. Server-side streaming allows Dialogflow to send [partial responses](https://cloud.google.com/dialogflow/cx/docs/concept/fulfillment#partial-response) earlier in a single request.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        serverStreamingDetectIntent(params?: Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>>;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        serverStreamingDetectIntent(params: Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        serverStreamingDetectIntent(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1DetectIntentResponse>): void;
        /**
         * Updates the feedback received from the user for a single turn of the bot response.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        submitAnswerFeedback(params: Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submitAnswerFeedback(params?: Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback>>;
        submitAnswerFeedback(params: Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submitAnswerFeedback(params: Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback>): void;
        submitAnswerFeedback(params: Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback>): void;
        submitAnswerFeedback(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1AnswerFeedback>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Detectintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session). Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Fulfillintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1FulfillIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Matchintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1MatchIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Serverstreamingdetectintent extends StandardParameters {
        /**
         * Required. The name of the session this query is sent to. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment. It's up to the API caller to choose an appropriate `Session ID`. It can be a random number or some type of session identifiers (preferably hashed). The length of the `Session ID` must not exceed 36 characters. For more information, see the [sessions guide](https://cloud.google.com/dialogflow/cx/docs/concept/session). Note: Always use agent versions for production traffic. See [Versions and environments](https://cloud.google.com/dialogflow/cx/docs/concept/version).
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1DetectIntentRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Submitanswerfeedback extends StandardParameters {
        /**
         * Required. The name of the session the feedback was sent to.
         */
        session?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SubmitAnswerFeedbackRequest;
    }
    export class Resource$Projects$Locations$Agents$Sessions$Entitytypes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        create(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        /**
         * Deletes the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        get(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        /**
         * Returns the list of all session entity types in the specified session.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSessionEntityTypesResponse>): void;
        /**
         * Updates the specified session entity type.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Create extends StandardParameters {
        /**
         * Required. The session to create a session entity type for. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Delete extends StandardParameters {
        /**
         * Required. The name of the session entity type to delete. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Get extends StandardParameters {
        /**
         * Required. The name of the session entity type. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The session to list all session entity types from. Format: `projects//locations//agents//sessions/` or `projects//locations//agents//environments//sessions/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Sessions$Entitytypes$Patch extends StandardParameters {
        /**
         * Required. The unique identifier of the session entity type. Format: `projects//locations//agents//sessions//entityTypes/` or `projects//locations//agents//environments//sessions//entityTypes/`. If `Environment ID` is not specified, we assume default 'draft' environment.
         */
        name?: string;
        /**
         * The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SessionEntityType;
    }
    export class Resource$Projects$Locations$Agents$Testcases {
        context: APIRequestContext;
        results: Resource$Projects$Locations$Agents$Testcases$Results;
        constructor(context: APIRequestContext);
        /**
         * Batch deletes test cases.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchDelete(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchDelete(params?: Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        batchDelete(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchDelete(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        batchDelete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Kicks off a batch run of test cases. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: BatchRunTestCasesMetadata - `response`: BatchRunTestCasesResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        batchRun(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchrun, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchRun(params?: Params$Resource$Projects$Locations$Agents$Testcases$Batchrun, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        batchRun(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchrun, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchRun(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchrun, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchRun(params: Params$Resource$Projects$Locations$Agents$Testcases$Batchrun, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        batchRun(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Calculates the test coverage for an agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        calculateCoverage(params: Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        calculateCoverage(params?: Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse>>;
        calculateCoverage(params: Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        calculateCoverage(params: Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse>): void;
        calculateCoverage(params: Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse>): void;
        calculateCoverage(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1CalculateCoverageResponse>): void;
        /**
         * Creates a test case for the given agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Testcases$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Testcases$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TestCase>>;
        create(params: Params$Resource$Projects$Locations$Agents$Testcases$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Testcases$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Testcases$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        /**
         * Exports the test cases under the agent to a Cloud Storage bucket or a local file. Filter can be applied to export a subset of test cases. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: ExportTestCasesMetadata - `response`: ExportTestCasesResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Testcases$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Testcases$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Testcases$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Testcases$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Testcases$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Gets a test case.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Testcases$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TestCase>>;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        /**
         * Imports the test cases from a Cloud Storage bucket or a local file. It always creates new test cases and won't overwrite any existing ones. The provided ID in the imported test case is neglected. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: ImportTestCasesMetadata - `response`: ImportTestCasesResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        import(params: Params$Resource$Projects$Locations$Agents$Testcases$Import, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        import(params?: Params$Resource$Projects$Locations$Agents$Testcases$Import, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        import(params: Params$Resource$Projects$Locations$Agents$Testcases$Import, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Testcases$Import, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(params: Params$Resource$Projects$Locations$Agents$Testcases$Import, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        import(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Fetches a list of test cases for a given agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Testcases$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCasesResponse>): void;
        /**
         * Updates the specified test case.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Testcases$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Testcases$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TestCase>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Testcases$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Testcases$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Testcases$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCase>): void;
        /**
         * Kicks off a test case run. This method is a [long-running operation](https://cloud.google.com/dialogflow/cx/docs/how/long-running-operation). The returned `Operation` type has the following method-specific fields: - `metadata`: RunTestCaseMetadata - `response`: RunTestCaseResponse
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        run(params: Params$Resource$Projects$Locations$Agents$Testcases$Run, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        run(params?: Params$Resource$Projects$Locations$Agents$Testcases$Run, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        run(params: Params$Resource$Projects$Locations$Agents$Testcases$Run, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        run(params: Params$Resource$Projects$Locations$Agents$Testcases$Run, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        run(params: Params$Resource$Projects$Locations$Agents$Testcases$Run, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        run(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Batchdelete extends StandardParameters {
        /**
         * Required. The agent to delete test cases from. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1BatchDeleteTestCasesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Batchrun extends StandardParameters {
        /**
         * Required. Agent name. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1BatchRunTestCasesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Calculatecoverage extends StandardParameters {
        /**
         * Required. The agent to calculate coverage for. Format: `projects//locations//agents/`.
         */
        agent?: string;
        /**
         * Required. The type of coverage requested.
         */
        type?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Create extends StandardParameters {
        /**
         * Required. The agent to create the test case for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TestCase;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Export extends StandardParameters {
        /**
         * Required. The agent where to export test cases from. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportTestCasesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Get extends StandardParameters {
        /**
         * Required. The name of the testcase. Format: `projects//locations//agents//testCases/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Import extends StandardParameters {
        /**
         * Required. The agent to import test cases to. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ImportTestCasesRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20. Note that when TestCaseView = FULL, the maximum page size allowed is 20. When TestCaseView = BASIC, the maximum page size allowed is 500.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all pages for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Specifies whether response should include all fields or just the metadata.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Patch extends StandardParameters {
        /**
         * The unique identifier of the test case. TestCases.CreateTestCase will populate the name automatically. Otherwise use format: `projects//locations//agents//testCases/`.
         */
        name?: string;
        /**
         * Required. The mask to specify which fields should be updated. The `creationTime` and `lastTestResult` cannot be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TestCase;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Run extends StandardParameters {
        /**
         * Required. Format of test case name to run: `projects//locations//agents//testCases/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1RunTestCaseRequest;
    }
    export class Resource$Projects$Locations$Agents$Testcases$Results {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a test case result.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Testcases$Results$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult>>;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TestCaseResult>): void;
        /**
         * Fetches the list of run results for the given test case. A maximum of 100 results are kept for each test case.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Testcases$Results$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Testcases$Results$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTestCaseResultsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Results$Get extends StandardParameters {
        /**
         * Required. The name of the testcase. Format: `projects//locations//agents//testCases//results/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Testcases$Results$List extends StandardParameters {
        /**
         * The filter expression used to filter test case results. See [API Filtering](https://aip.dev/160). The expression is case insensitive. Only 'AND' is supported for logical operators. The supported syntax is listed below in detail: [AND ] ... [AND latest] The supported fields and operators are: field operator `environment` `=`, `IN` (Use value `draft` for draft environment) `test_time` `\>`, `<` `latest` only returns the latest test result in all results for each test case. Examples: * "environment=draft AND latest" matches the latest test result for each test case in the draft environment. * "environment IN (e1,e2)" matches any test case results with an environment resource name of either "e1" or "e2". * "test_time \> 1602540713" matches any test case results with test time later than a unix timestamp in seconds 1602540713.
         */
        filter?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The test case to list results for. Format: `projects//locations//agents//testCases/`. Specify a `-` as a wildcard for TestCase ID to list results across multiple test cases.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Agents$Tools {
        context: APIRequestContext;
        versions: Resource$Projects$Locations$Agents$Tools$Versions;
        constructor(context: APIRequestContext);
        /**
         * Creates a Tool in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Tools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Tool>>;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        /**
         * Deletes a specified Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Tools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Exports the selected tools.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        export(params: Params$Resource$Projects$Locations$Agents$Tools$Export, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        export(params?: Params$Resource$Projects$Locations$Agents$Tools$Export, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        export(params: Params$Resource$Projects$Locations$Agents$Tools$Export, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Tools$Export, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(params: Params$Resource$Projects$Locations$Agents$Tools$Export, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        export(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Retrieves the specified Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Tools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Tool>>;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        /**
         * Returns a list of Tools in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Tools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Tools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolsResponse>): void;
        /**
         * Update the specified Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Tools$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Tools$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Tool>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Tools$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Tools$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Tools$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Tool>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Create extends StandardParameters {
        /**
         * Required. The agent to create a Tool for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Tool;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Delete extends StandardParameters {
        /**
         * This field has no effect for Tools not being used. For Tools that are used: * If `force` is set to false, an error will be returned with message indicating the referenced resources. * If `force` is set to true, Dialogflow will remove the tool, as well as any references to the tool.
         */
        force?: boolean;
        /**
         * Required. The name of the Tool to be deleted. Format: `projects//locations//agents//tools/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Export extends StandardParameters {
        /**
         * Required. The agent to export tools from. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ExportToolsRequest;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Get extends StandardParameters {
        /**
         * Required. The name of the Tool. Format: `projects//locations//agents//tools/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list the Tools from. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Patch extends StandardParameters {
        /**
         * The unique identifier of the Tool. Format: `projects//locations//agents//tools/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Tool;
    }
    export class Resource$Projects$Locations$Agents$Tools$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a version for the specified Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Tools$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>>;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        /**
         * Deletes the specified version of the Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified version of the Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Tools$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>>;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ToolVersion>): void;
        /**
         * List versions of the specified Tool.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Tools$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListToolVersionsResponse>): void;
        /**
         * Retrieves the specified version of the Tool and stores it as the current tool draft, returning the tool with resources updated.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        restore(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restore(params?: Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse>>;
        restore(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse>): void;
        restore(params: Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse>): void;
        restore(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Versions$Create extends StandardParameters {
        /**
         * Required. The tool to create a version for. Format: `projects//locations//agents//tools/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1ToolVersion;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Versions$Delete extends StandardParameters {
        /**
         * Optional. This field has no effect for Tools not being used. For Tools that are used: * If `force` is set to false, an error will be returned with message indicating the referenced resources. * If `force` is set to true, Dialogflow will remove the tool, as well as any references to the tool.
         */
        force?: boolean;
        /**
         * Required. The name of the tool version to delete. Format: `projects//locations//agents//tools//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Versions$Get extends StandardParameters {
        /**
         * Required. The name of the tool version. Format: `projects//locations//agents//tools//versions/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Versions$List extends StandardParameters {
        /**
         * Optional. The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * Optional. The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The parent of the tool versions. Format: `projects//locations//agents//tools/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Tools$Versions$Restore extends StandardParameters {
        /**
         * Required. The name of the tool version. Format: `projects//locations//agents//tools//versions/`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1RestoreToolVersionRequest;
    }
    export class Resource$Projects$Locations$Agents$Transitionroutegroups {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an TransitionRouteGroup in the specified flow. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        create(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        /**
         * Deletes the specified TransitionRouteGroup. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified TransitionRouteGroup.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        get(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        /**
         * Returns the list of all transition route groups in the specified flow.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListTransitionRouteGroupsResponse>): void;
        /**
         * Updates the specified TransitionRouteGroup. Note: You should always train a flow prior to sending it queries. See the [training documentation](https://cloud.google.com/dialogflow/cx/docs/concept/training).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Create extends StandardParameters {
        /**
         * The language of the following fields in `TransitionRouteGroup`: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The flow to create an TransitionRouteGroup for. Format: `projects//locations//agents//flows/` or `projects//locations//agents/` for agent-level groups.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup;
    }
    export interface Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Delete extends StandardParameters {
        /**
         * This field has no effect for transition route group that no page is using. If the transition route group is referenced by any page: * If `force` is set to false, an error will be returned with message indicating pages that reference the transition route group. * If `force` is set to true, Dialogflow will remove the transition route group, as well as any reference to it.
         */
        force?: boolean;
        /**
         * Required. The name of the TransitionRouteGroup to delete. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Get extends StandardParameters {
        /**
         * The language to retrieve the transition route group for. The following fields are language dependent: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * Required. The name of the TransitionRouteGroup. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Transitionroutegroups$List extends StandardParameters {
        /**
         * The language to list transition route groups for. The following fields are language dependent: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The flow to list all transition route groups for. Format: `projects//locations//agents//flows/` or `projects//locations//agents/.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Transitionroutegroups$Patch extends StandardParameters {
        /**
         * The language of the following fields in `TransitionRouteGroup`: * `TransitionRouteGroup.transition_routes.trigger_fulfillment.messages` * `TransitionRouteGroup.transition_routes.trigger_fulfillment.conditional_cases` If not specified, the agent's default language is used. [Many languages](https://cloud.google.com/dialogflow/cx/docs/reference/language) are supported. Note: languages must be enabled in the agent before they can be used.
         */
        languageCode?: string;
        /**
         * The unique identifier of the transition route group. TransitionRouteGroups.CreateTransitionRouteGroup populates the name automatically. Format: `projects//locations//agents//flows//transitionRouteGroups/` or `projects//locations//agents//transitionRouteGroups/` for agent-level groups.
         */
        name?: string;
        /**
         * The mask to control which fields get updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1TransitionRouteGroup;
    }
    export class Resource$Projects$Locations$Agents$Webhooks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a webhook in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Agents$Webhooks$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Agents$Webhooks$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Webhook>>;
        create(params: Params$Resource$Projects$Locations$Agents$Webhooks$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Webhooks$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        create(params: Params$Resource$Projects$Locations$Agents$Webhooks$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        /**
         * Deletes the specified webhook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Agents$Webhooks$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Agents$Webhooks$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Agents$Webhooks$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Webhooks$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Agents$Webhooks$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified webhook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Agents$Webhooks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Agents$Webhooks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Webhook>>;
        get(params: Params$Resource$Projects$Locations$Agents$Webhooks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Webhooks$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        get(params: Params$Resource$Projects$Locations$Agents$Webhooks$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        /**
         * Returns the list of all webhooks in the specified agent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Agents$Webhooks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Agents$Webhooks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse>>;
        list(params: Params$Resource$Projects$Locations$Agents$Webhooks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Webhooks$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse>): void;
        list(params: Params$Resource$Projects$Locations$Agents$Webhooks$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListWebhooksResponse>): void;
        /**
         * Updates the specified webhook.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Agents$Webhooks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Agents$Webhooks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1Webhook>>;
        patch(params: Params$Resource$Projects$Locations$Agents$Webhooks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Webhooks$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        patch(params: Params$Resource$Projects$Locations$Agents$Webhooks$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1Webhook>): void;
    }
    export interface Params$Resource$Projects$Locations$Agents$Webhooks$Create extends StandardParameters {
        /**
         * Required. The agent to create a webhook for. Format: `projects//locations//agents/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Webhook;
    }
    export interface Params$Resource$Projects$Locations$Agents$Webhooks$Delete extends StandardParameters {
        /**
         * This field has no effect for webhook not being used. For webhooks that are used by pages/flows/transition route groups: * If `force` is set to false, an error will be returned with message indicating the referenced resources. * If `force` is set to true, Dialogflow will remove the webhook, as well as any references to the webhook (i.e. Webhook and tagin fulfillments that point to this webhook will be removed).
         */
        force?: boolean;
        /**
         * Required. The name of the webhook to delete. Format: `projects//locations//agents//webhooks/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Webhooks$Get extends StandardParameters {
        /**
         * Required. The name of the webhook. Format: `projects//locations//agents//webhooks/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Webhooks$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 100 and at most 1000.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The agent to list all webhooks for. Format: `projects//locations//agents/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Agents$Webhooks$Patch extends StandardParameters {
        /**
         * The unique identifier of the webhook. Required for the Webhooks.UpdateWebhook method. Webhooks.CreateWebhook populates the name automatically. Format: `projects//locations//agents//webhooks/`.
         */
        name?: string;
        /**
         * The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1Webhook;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of `1`, corresponding to `Code.CANCELLED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Securitysettings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create security settings in the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Securitysettings$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Securitysettings$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>>;
        create(params: Params$Resource$Projects$Locations$Securitysettings$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Securitysettings$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        create(params: Params$Resource$Projects$Locations$Securitysettings$Create, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        /**
         * Deletes the specified SecuritySettings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Securitysettings$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Securitysettings$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Securitysettings$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Securitysettings$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Securitysettings$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Retrieves the specified SecuritySettings. The returned settings may be stale by up to 1 minute.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Securitysettings$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Securitysettings$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>>;
        get(params: Params$Resource$Projects$Locations$Securitysettings$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Securitysettings$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        get(params: Params$Resource$Projects$Locations$Securitysettings$Get, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        /**
         * Returns the list of all security settings in the specified location.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Securitysettings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Securitysettings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse>>;
        list(params: Params$Resource$Projects$Locations$Securitysettings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Securitysettings$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Securitysettings$List, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1ListSecuritySettingsResponse>): void;
        /**
         * Updates the specified SecuritySettings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Securitysettings$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Securitysettings$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>>;
        patch(params: Params$Resource$Projects$Locations$Securitysettings$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Securitysettings$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        patch(params: Params$Resource$Projects$Locations$Securitysettings$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings>): void;
    }
    export interface Params$Resource$Projects$Locations$Securitysettings$Create extends StandardParameters {
        /**
         * Required. The location to create an SecuritySettings for. Format: `projects//locations/`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings;
    }
    export interface Params$Resource$Projects$Locations$Securitysettings$Delete extends StandardParameters {
        /**
         * Required. The name of the SecuritySettings to delete. Format: `projects//locations//securitySettings/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Securitysettings$Get extends StandardParameters {
        /**
         * Required. Resource name of the settings. Format: `projects//locations//securitySettings/`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Securitysettings$List extends StandardParameters {
        /**
         * The maximum number of items to return in a single page. By default 20 and at most 100.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous list request.
         */
        pageToken?: string;
        /**
         * Required. The location to list all security settings for. Format: `projects//locations/`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Securitysettings$Patch extends StandardParameters {
        /**
         * Resource name of the settings. Required for the SecuritySettingsService.UpdateSecuritySettings method. SecuritySettingsService.CreateSecuritySettings populates the name automatically. Format: `projects//locations//securitySettings/`.
         */
        name?: string;
        /**
         * Required. The mask to control which fields get updated. If the mask is not present, all fields will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDialogflowCxV3beta1SecuritySettings;
    }
    export class Resource$Projects$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of `1`, corresponding to `Code.CANCELLED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(params: Params$Resource$Projects$Operations$Cancel, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        get(params: Params$Resource$Projects$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(params: Params$Resource$Projects$Operations$Get, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        get(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningListOperationsResponse>>;
        list(params: Params$Resource$Projects$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(params: Params$Resource$Projects$Operations$List, callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleLongrunningListOperationsResponse>): void;
    }
    export interface Params$Resource$Projects$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export {};
}
