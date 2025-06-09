import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace checks_v1alpha {
    export interface Options extends GlobalOptions {
        version: 'v1alpha';
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
     * Checks API
     *
     * The Checks API contains powerful and easy-to-use privacy and compliance APIs that interact with the Checks product and its underlying technology.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const checks = google.checks('v1alpha');
     * ```
     */
    export class Checks {
        context: APIRequestContext;
        accounts: Resource$Accounts;
        aisafety: Resource$Aisafety;
        media: Resource$Media;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Represents an app in Checks.
     */
    export interface Schema$GoogleChecksAccountV1alphaApp {
        /**
         * The resource name of the app. Example: `accounts/123/apps/456`
         */
        name?: string | null;
        /**
         * The app's title.
         */
        title?: string | null;
    }
    /**
     * The response message for AccountService.ListApps.
     */
    export interface Schema$GoogleChecksAccountV1alphaListAppsResponse {
        /**
         * The apps.
         */
        apps?: Schema$GoogleChecksAccountV1alphaApp[];
        /**
         * A token which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Request proto for ClassifyContent RPC.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentRequest {
        /**
         * Optional. Version of the classifier to use. If not specified, the latest version will be used.
         */
        classifierVersion?: string | null;
        /**
         * Optional. Context about the input that will be used to help on the classification.
         */
        context?: Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestContext;
        /**
         * Required. Content to be classified.
         */
        input?: Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestInputContent;
        /**
         * Required. List of policies to classify against.
         */
        policies?: Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestPolicyConfig[];
    }
    /**
     * Context about the input that will be used to help on the classification.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestContext {
        /**
         * Optional. Prompt that generated the model response.
         */
        prompt?: string | null;
    }
    /**
     * Content to be classified.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestInputContent {
        /**
         * Content in text format.
         */
        textInput?: Schema$GoogleChecksAisafetyV1alphaTextInput;
    }
    /**
     * List of policies to classify against.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentRequestPolicyConfig {
        /**
         * Required. Type of the policy.
         */
        policyType?: string | null;
        /**
         * Optional. Score threshold to use when deciding if the content is violative or non-violative. If not specified, the default 0.5 threshold for the policy will be used.
         */
        threshold?: number | null;
    }
    /**
     * Response proto for ClassifyContent RPC.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse {
        /**
         * Results of the classification for each policy.
         */
        policyResults?: Schema$GoogleChecksAisafetyV1alphaClassifyContentResponsePolicyResult[];
    }
    /**
     * Result for one policy against the corresponding input.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaClassifyContentResponsePolicyResult {
        /**
         * Type of the policy.
         */
        policyType?: string | null;
        /**
         * Final score for the results of this policy.
         */
        score?: number | null;
        /**
         * Result of the classification for the policy.
         */
        violationResult?: string | null;
    }
    /**
     * Text input to be classified.
     */
    export interface Schema$GoogleChecksAisafetyV1alphaTextInput {
        /**
         * Actual piece of text to be classified.
         */
        content?: string | null;
        /**
         * Optional. Language of the text in ISO 639-1 format. If the language is invalid or not specified, the system will try to detect it.
         */
        languageCode?: string | null;
    }
    /**
     * The request message for ReportService.AnalyzeUpload.
     */
    export interface Schema$GoogleChecksReportV1alphaAnalyzeUploadRequest {
        /**
         * Optional. The type of the uploaded app binary. If not provided, the server assumes APK file for Android and IPA file for iOS.
         */
        appBinaryFileType?: string | null;
        /**
         * Optional. Git commit hash or changelist number associated with the upload.
         */
        codeReferenceId?: string | null;
    }
    /**
     * Information about the analyzed app bundle.
     */
    export interface Schema$GoogleChecksReportV1alphaAppBundle {
        /**
         * Unique id of the bundle. For example: "com.google.Gmail".
         */
        bundleId?: string | null;
        /**
         * Git commit hash or changelist number associated with the release.
         */
        codeReferenceId?: string | null;
        /**
         * Identifies the type of release.
         */
        releaseType?: string | null;
        /**
         * The user-visible version of the bundle such as the Android `versionName` or iOS `CFBundleShortVersionString`. For example: "7.21.1".
         */
        version?: string | null;
        /**
         * The version used throughout the operating system and store to identify the build such as the Android `versionCode` or iOS `CFBundleVersion`.
         */
        versionId?: string | null;
    }
    /**
     * A check that was run on your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheck {
        /**
         * Regulations and policies that serve as the legal basis for the check.
         */
        citations?: Schema$GoogleChecksReportV1alphaCheckCitation[];
        /**
         * Evidence that substantiates the check result.
         */
        evidence?: Schema$GoogleChecksReportV1alphaCheckEvidence;
        /**
         * Regions that are impacted by the check. For more info, see https://google.aip.dev/143#countries-and-regions.
         */
        regionCodes?: string[] | null;
        /**
         * The urgency or risk level of the check.
         */
        severity?: string | null;
        /**
         * The result after running the check.
         */
        state?: string | null;
        /**
         * Additional information about the check state in relation to past reports.
         */
        stateMetadata?: Schema$GoogleChecksReportV1alphaCheckStateMetadata;
        /**
         * The type of check that was run. A type will only appear once in a report's list of checks.
         */
        type?: string | null;
    }
    /**
     * Regulation or policy that serves as the legal basis for the check.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckCitation {
        /**
         * Citation type.
         */
        type?: string | null;
    }
    /**
     * Evidence concerning data security.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckDataSecurityEvidence {
        /**
         * Evidence related to data in transit.
         */
        dataInTransitInfo?: Schema$GoogleChecksReportV1alphaCheckDataSecurityEvidenceDataInTransitInfo[];
    }
    /**
     * Evidence related to data in transit detected in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckDataSecurityEvidenceDataInTransitInfo {
        /**
         * The URL contacted by your app. This includes the protocol, domain, and URL parameters.
         */
        uri?: string | null;
    }
    /**
     * Evidence concerning a data type that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckDataTypeEvidence {
        /**
         * The data type that was found in your app.
         */
        dataType?: string | null;
        /**
         * Evidence collected about the data type.
         */
        dataTypeEvidence?: Schema$GoogleChecksReportV1alphaDataTypeEvidence;
    }
    /**
     * Evidence concerning an endpoint that was contacted by your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckEndpointEvidence {
        /**
         * The endpoint that was contacted by your app.
         */
        endpoint?: Schema$GoogleChecksReportV1alphaEndpoint;
    }
    /**
     * Evidence collected from endpoint restriction violation analysis.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckEndpointRestrictionViolationEvidence {
        /**
         * Endpoints in violation.
         */
        endpointDetails?: Schema$GoogleChecksReportV1alphaCheckEndpointRestrictionViolationEvidenceEndpointDetails[];
    }
    /**
     * Details of the endpoint in violation.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckEndpointRestrictionViolationEvidenceEndpointDetails {
        /**
         * The endpoint in violation.
         */
        endpoint?: Schema$GoogleChecksReportV1alphaEndpoint;
    }
    /**
     * Evidence for a check.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckEvidence {
        /**
         * Evidence concerning data security.
         */
        dataSecurity?: Schema$GoogleChecksReportV1alphaCheckDataSecurityEvidence;
        /**
         * Evidence concerning data types found in your app.
         */
        dataTypes?: Schema$GoogleChecksReportV1alphaCheckDataTypeEvidence[];
        /**
         * Evidence collected from endpoint restriction violation analysis.
         */
        endpointRestrictionViolations?: Schema$GoogleChecksReportV1alphaCheckEndpointRestrictionViolationEvidence[];
        /**
         * Evidence concerning endpoints that were contacted by your app.
         */
        endpoints?: Schema$GoogleChecksReportV1alphaCheckEndpointEvidence[];
        /**
         * Evidence collected from permission restriction violation analysis.
         */
        permissionRestrictionViolations?: Schema$GoogleChecksReportV1alphaCheckPermissionRestrictionViolationEvidence[];
        /**
         * Evidence concerning permissions that were found in your app.
         */
        permissions?: Schema$GoogleChecksReportV1alphaCheckPermissionEvidence[];
        /**
         * Evidence collected from your privacy policy(s).
         */
        privacyPolicyTexts?: Schema$GoogleChecksReportV1alphaCheckPrivacyPolicyTextEvidence[];
        /**
         * Evidence concerning SDK issues.
         */
        sdkIssues?: Schema$GoogleChecksReportV1alphaCheckSdkIssueEvidence[];
        /**
         * Evidence collected from SDK restriction violation analysis.
         */
        sdkRestrictionViolations?: Schema$GoogleChecksReportV1alphaCheckSdkRestrictionViolationEvidence[];
        /**
         * Evidence concerning SDKs that were found in your app.
         */
        sdks?: Schema$GoogleChecksReportV1alphaCheckSdkEvidence[];
    }
    /**
     * Evidence concerning a permission that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckPermissionEvidence {
        /**
         * The permission that was found in your app.
         */
        permission?: Schema$GoogleChecksReportV1alphaPermission;
    }
    /**
     * Evidence collected from permission restriction violation analysis.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckPermissionRestrictionViolationEvidence {
        /**
         * Permissions in violation.
         */
        permissionDetails?: Schema$GoogleChecksReportV1alphaCheckPermissionRestrictionViolationEvidencePermissionDetails[];
    }
    /**
     * Details of the permission in violation.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckPermissionRestrictionViolationEvidencePermissionDetails {
        /**
         * The permission in violation.
         */
        permission?: Schema$GoogleChecksReportV1alphaPermission;
    }
    /**
     * Evidence collected from your privacy policy(s).
     */
    export interface Schema$GoogleChecksReportV1alphaCheckPrivacyPolicyTextEvidence {
        /**
         * The privacy policy fragment that was used during the check.
         */
        policyFragment?: Schema$GoogleChecksReportV1alphaPolicyFragment;
    }
    /**
     * Evidence conerning an SDK that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckSdkEvidence {
        /**
         * The SDK that was found in your app.
         */
        sdk?: Schema$GoogleChecksReportV1alphaSdk;
    }
    /**
     * Evidence concerning an SDK issue.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckSdkIssueEvidence {
        /**
         * The SDK with an issue.
         */
        sdk?: Schema$GoogleChecksReportV1alphaSdk;
        /**
         * The SDK version.
         */
        sdkVersion?: string | null;
    }
    /**
     * Evidence collected from SDK restriction violation analysis.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckSdkRestrictionViolationEvidence {
        /**
         * SDKs in violation.
         */
        sdkDetails?: Schema$GoogleChecksReportV1alphaCheckSdkRestrictionViolationEvidenceSdkDetails[];
    }
    /**
     * Details of the SDK in violation.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckSdkRestrictionViolationEvidenceSdkDetails {
        /**
         * The SDK in violation.
         */
        sdk?: Schema$GoogleChecksReportV1alphaSdk;
    }
    /**
     * Additional information about the check state in relation to past reports.
     */
    export interface Schema$GoogleChecksReportV1alphaCheckStateMetadata {
        /**
         * Indicators related to the check state.
         */
        badges?: string[] | null;
        /**
         * The time when the check first started failing.
         */
        firstFailingTime?: string | null;
        /**
         * The last time the check failed.
         */
        lastFailingTime?: string | null;
    }
    /**
     * Represents the data monitoring section of the report.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoring {
        /**
         * Data types that your app shares or collects.
         */
        dataTypes?: Schema$GoogleChecksReportV1alphaDataMonitoringDataTypeResult[];
        /**
         * Endpoints that were found by dynamic analysis of your app.
         */
        endpoints?: Schema$GoogleChecksReportV1alphaDataMonitoringEndpointResult[];
        /**
         * Permissions that your app uses.
         */
        permissions?: Schema$GoogleChecksReportV1alphaDataMonitoringPermissionResult[];
        /**
         * SDKs that your app uses.
         */
        sdks?: Schema$GoogleChecksReportV1alphaDataMonitoringSdkResult[];
    }
    /**
     * Information about a data type that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoringDataTypeResult {
        /**
         * The data type that was shared or collected by your app.
         */
        dataType?: string | null;
        /**
         * Evidence collected about the data type.
         */
        dataTypeEvidence?: Schema$GoogleChecksReportV1alphaDataTypeEvidence;
        /**
         * Metadata about the result.
         */
        metadata?: Schema$GoogleChecksReportV1alphaDataMonitoringResultMetadata;
    }
    /**
     * Information about an endpoint that was contacted by your app.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoringEndpointResult {
        /**
         * The endpoint that was contacted by your app.
         */
        endpoint?: Schema$GoogleChecksReportV1alphaEndpoint;
        /**
         * The number of times this endpoint was contacted by your app.
         */
        hitCount?: number | null;
        /**
         * Metadata about the result.
         */
        metadata?: Schema$GoogleChecksReportV1alphaDataMonitoringResultMetadata;
    }
    /**
     * Information about a permission that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoringPermissionResult {
        /**
         * Metadata about the result.
         */
        metadata?: Schema$GoogleChecksReportV1alphaDataMonitoringResultMetadata;
        /**
         * The permission that was found in your app.
         */
        permission?: Schema$GoogleChecksReportV1alphaPermission;
    }
    /**
     * Information about a data monitoring result.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoringResultMetadata {
        /**
         * Badges that apply to this result.
         */
        badges?: string[] | null;
        /**
         * The timestamp when this result was first detected within the last 8 weeks. If not set, it wasn't detected within the last 8 weeks.
         */
        firstDetectedTime?: string | null;
        /**
         * Your app's version name when this result was last detected within the last 8 weeks. If not set, it wasn't detected within the last 8 weeks.
         */
        lastDetectedAppVersion?: string | null;
        /**
         * The timestamp when this result was last detected within the last 8 weeks. If not set, it wasn't detected within the last 8 weeks.
         */
        lastDetectedTime?: string | null;
    }
    /**
     * Information about an SDK that was found in your app.
     */
    export interface Schema$GoogleChecksReportV1alphaDataMonitoringSdkResult {
        /**
         * Metadata about the result.
         */
        metadata?: Schema$GoogleChecksReportV1alphaDataMonitoringResultMetadata;
        /**
         * The SDK that was found in your app.
         */
        sdk?: Schema$GoogleChecksReportV1alphaSdk;
    }
    /**
     * Evidence based on an endpoint that data was sent to.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidence {
        /**
         * Set of SDKs that are attributed to the exfiltration.
         */
        attributedSdks?: Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidenceAttributedSdk[];
        /**
         * Endpoints the data type was sent to.
         */
        endpointDetails?: Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidenceEndpointDetails[];
        /**
         * Type of data that was exfiltrated.
         */
        exfiltratedDataType?: string | null;
    }
    /**
     * Details of SDK that is attributed to the exfiltration.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidenceAttributedSdk {
        /**
         * SDK that is attributed to the exfiltration.
         */
        sdk?: Schema$GoogleChecksReportV1alphaSdk;
    }
    /**
     * Details of the endpoint the data type was sent to.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidenceEndpointDetails {
        /**
         * Endpoint the data type was sent to.
         */
        endpoint?: Schema$GoogleChecksReportV1alphaEndpoint;
    }
    /**
     * Evidence collected about a data type.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypeEvidence {
        /**
         * List of endpoints the data type was sent to.
         */
        endpoints?: Schema$GoogleChecksReportV1alphaDataTypeEndpointEvidence[];
        /**
         * List of included permissions that imply collection of the data type.
         */
        permissions?: Schema$GoogleChecksReportV1alphaDataTypePermissionEvidence[];
        /**
         * List of privacy policy texts that imply collection of the data type.
         */
        privacyPolicyTexts?: Schema$GoogleChecksReportV1alphaDataTypePrivacyPolicyTextEvidence[];
    }
    /**
     * Evidence based on the inclusion of a permission.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypePermissionEvidence {
        /**
         * Permission declared by your app.
         */
        permission?: Schema$GoogleChecksReportV1alphaPermission;
    }
    /**
     * Evidence based on information from the privacy policy.
     */
    export interface Schema$GoogleChecksReportV1alphaDataTypePrivacyPolicyTextEvidence {
        /**
         * The privacy policy fragment that implies collection of the data type.
         */
        policyFragment?: Schema$GoogleChecksReportV1alphaPolicyFragment;
    }
    /**
     * Information about an endpoint.
     */
    export interface Schema$GoogleChecksReportV1alphaEndpoint {
        /**
         * Domain name (e.g. ads.google.com).
         */
        domain?: string | null;
    }
    /**
     * The response message for ReportService.ListReports.
     */
    export interface Schema$GoogleChecksReportV1alphaListReportsResponse {
        /**
         * A token which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The reports for the specified app.
         */
        reports?: Schema$GoogleChecksReportV1alphaReport[];
    }
    /**
     * Information about a permission.
     */
    export interface Schema$GoogleChecksReportV1alphaPermission {
        /**
         * Permission identifier.
         */
        id?: string | null;
    }
    /**
     * Information about a policy fragment.
     */
    export interface Schema$GoogleChecksReportV1alphaPolicyFragment {
        /**
         * HTML content.
         */
        htmlContent?: string | null;
        /**
         * Policy URL.
         */
        sourceUri?: string | null;
    }
    /**
     * Privacy report.
     */
    export interface Schema$GoogleChecksReportV1alphaReport {
        /**
         * Information about the analyzed app bundle.
         */
        appBundle?: Schema$GoogleChecksReportV1alphaAppBundle;
        /**
         * List of checks that were run on the app bundle.
         */
        checks?: Schema$GoogleChecksReportV1alphaCheck[];
        /**
         * Information related to data monitoring.
         */
        dataMonitoring?: Schema$GoogleChecksReportV1alphaDataMonitoring;
        /**
         * Resource name of the report.
         */
        name?: string | null;
        /**
         * A URL to view results.
         */
        resultsUri?: string | null;
    }
    /**
     * Information about an SDK.
     */
    export interface Schema$GoogleChecksReportV1alphaSdk {
        /**
         * SDK identifier.
         */
        id?: string | null;
    }
    /**
     * The results of a Code Compliance CLI analysis.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaCliAnalysis {
        /**
         * Optional. Requested code scans resulting from preliminary CLI analysis.
         */
        codeScans?: Schema$GoogleChecksRepoScanV1alphaCodeScan[];
        /**
         * Optional. Data sources detected in the scan.
         */
        sources?: Schema$GoogleChecksRepoScanV1alphaSource[];
    }
    /**
     * Source code attribution.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaCodeAttribution {
        /**
         * Optional. Code excerpt where the source was detected along with surrounding code.
         */
        codeExcerpt?: string | null;
        /**
         * Required. Line number (1-based).
         */
        lineNumber?: number | null;
        /**
         * Required. Path of the file.
         */
        path?: string | null;
        /**
         * Optional. Start line number of the code excerpt (1-based).
         */
        startLineNumber?: number | null;
    }
    /**
     * A requested analysis of source code. Contains the source code and processing state.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaCodeScan {
        /**
         * Optional. Data type classification requests.
         */
        dataTypeClassifications?: Schema$GoogleChecksRepoScanV1alphaCodeScanDataTypeClassification[];
        /**
         * Required. Source code to analyze.
         */
        sourceCode?: Schema$GoogleChecksRepoScanV1alphaSourceCode;
    }
    /**
     * A request to classify data types.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaCodeScanDataTypeClassification {
        /**
         * Required. Candidate data type.
         */
        dataType?: string | null;
        /**
         * Required. Line number (1-based).
         */
        lineNumber?: number | null;
    }
    /**
     * The request message for RepoScanService.GenerateScan.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaGenerateScanRequest {
        /**
         * Required. CLI analysis results.
         */
        cliAnalysis?: Schema$GoogleChecksRepoScanV1alphaCliAnalysis;
        /**
         * Required. CLI version.
         */
        cliVersion?: string | null;
        /**
         * Required. Local scan path.
         */
        localScanPath?: string | null;
        /**
         * Required. SCM metadata.
         */
        scmMetadata?: Schema$GoogleChecksRepoScanV1alphaScmMetadata;
    }
    /**
     * The response message for RepoScanService.ListRepoScans.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse {
        /**
         * A token which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The repo scans for the specified app.
         */
        repoScans?: Schema$GoogleChecksRepoScanV1alphaRepoScan[];
    }
    /**
     * Pull request info.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaPullRequest {
        /**
         * Required. For PR analysis, we compare against the most recent scan of the base branch to highlight new issues.
         */
        baseBranch?: string | null;
        /**
         * Required. This can be supplied by the user or parsed automatically from predefined CI environment variables.
         */
        prNumber?: string | null;
    }
    /**
     * Repo scan.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaRepoScan {
        /**
         * CLI version.
         */
        cliVersion?: string | null;
        /**
         * Local scan path.
         */
        localScanPath?: string | null;
        /**
         * Identifier. Resource name of the scan.
         */
        name?: string | null;
        /**
         * A URL to view results.
         */
        resultsUri?: string | null;
        /**
         * SCM metadata.
         */
        scmMetadata?: Schema$GoogleChecksRepoScanV1alphaScmMetadata;
        /**
         * Data sources detected.
         */
        sources?: Schema$GoogleChecksRepoScanV1alphaSource[];
    }
    /**
     * SCM metadata.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaScmMetadata {
        /**
         * Required. Branch name.
         */
        branch?: string | null;
        /**
         * Optional. Contains info about the associated pull request. This is only populated for pull request scans.
         */
        pullRequest?: Schema$GoogleChecksRepoScanV1alphaPullRequest;
        /**
         * Required. Git remote URL.
         */
        remoteUri?: string | null;
        /**
         * Required. Revision ID, e.g. Git commit hash.
         */
        revisionId?: string | null;
    }
    /**
     * Represents a data source finding.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaSource {
        /**
         * Optional. Source code attribution for the finding.
         */
        codeAttribution?: Schema$GoogleChecksRepoScanV1alphaCodeAttribution;
        /**
         * Required. Data type.
         */
        dataType?: string | null;
        /**
         * Optional. Whether the finding was marked as a false positive.
         */
        falsePositive?: boolean | null;
    }
    /**
     * Contains source code from a repo.
     */
    export interface Schema$GoogleChecksRepoScanV1alphaSourceCode {
        /**
         * Required. Source code.
         */
        code?: string | null;
        /**
         * Required. End line number (1-based).
         */
        endLine?: number | null;
        /**
         * Required. Path of the file.
         */
        path?: string | null;
        /**
         * Required. Start line number (1-based).
         */
        startLine?: number | null;
    }
    /**
     * The response message for Operations.ListOperations.
     */
    export interface Schema$ListOperationsResponse {
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
        /**
         * A list of operations that matches the specified filter in the request.
         */
        operations?: Schema$Operation[];
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
     * The request message for Operations.WaitOperation.
     */
    export interface Schema$WaitOperationRequest {
        /**
         * The maximum duration to wait before timing out. If left blank, the wait will be at most the time permitted by the underlying HTTP/RPC protocol. If RPC context deadline is also specified, the shorter one will be used.
         */
        timeout?: string | null;
    }
    export class Resource$Accounts {
        context: APIRequestContext;
        apps: Resource$Accounts$Apps;
        repos: Resource$Accounts$Repos;
        constructor(context: APIRequestContext);
    }
    export class Resource$Accounts$Apps {
        context: APIRequestContext;
        operations: Resource$Accounts$Apps$Operations;
        reports: Resource$Accounts$Apps$Reports;
        constructor(context: APIRequestContext);
        /**
         * Gets an app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Apps$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Apps$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksAccountV1alphaApp>>;
        get(params: Params$Resource$Accounts$Apps$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Apps$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksAccountV1alphaApp>, callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaApp>): void;
        get(params: Params$Resource$Accounts$Apps$Get, callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaApp>): void;
        get(callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaApp>): void;
        /**
         * Lists the apps under the given account.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Apps$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Apps$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksAccountV1alphaListAppsResponse>>;
        list(params: Params$Resource$Accounts$Apps$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Apps$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksAccountV1alphaListAppsResponse>, callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaListAppsResponse>): void;
        list(params: Params$Resource$Accounts$Apps$List, callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaListAppsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleChecksAccountV1alphaListAppsResponse>): void;
    }
    export interface Params$Resource$Accounts$Apps$Get extends StandardParameters {
        /**
         * Required. Resource name of the app. Example: `accounts/123/apps/456`
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Apps$List extends StandardParameters {
        /**
         * Optional. The maximum number of results to return. The server may further constrain the maximum number of results returned in a single page. If unspecified, the server will decide the number of results to be returned.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous `ListApps` call. Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Required. The parent account. Example: `accounts/123`
         */
        parent?: string;
    }
    export class Resource$Accounts$Apps$Operations {
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
        cancel(params: Params$Resource$Accounts$Apps$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Accounts$Apps$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Accounts$Apps$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Accounts$Apps$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Accounts$Apps$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Accounts$Apps$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Accounts$Apps$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Accounts$Apps$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Accounts$Apps$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Accounts$Apps$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Apps$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Apps$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Accounts$Apps$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Apps$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Accounts$Apps$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Apps$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Apps$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Accounts$Apps$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Apps$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Accounts$Apps$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        /**
         * Waits until the specified long-running operation is done or reaches at most a specified timeout, returning the latest state. If the operation is already done, the latest state is immediately returned. If the timeout specified is greater than the default HTTP/RPC timeout, the HTTP/RPC timeout is used. If the server does not support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Note that this method is on a best-effort basis. It may return the latest state before the specified timeout (including immediately), meaning even an immediate response is no guarantee that the operation is done.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        wait(params: Params$Resource$Accounts$Apps$Operations$Wait, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        wait(params?: Params$Resource$Accounts$Apps$Operations$Wait, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        wait(params: Params$Resource$Accounts$Apps$Operations$Wait, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        wait(params: Params$Resource$Accounts$Apps$Operations$Wait, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        wait(params: Params$Resource$Accounts$Apps$Operations$Wait, callback: BodyResponseCallback<Schema$Operation>): void;
        wait(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accounts$Apps$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Accounts$Apps$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Apps$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Apps$Operations$List extends StandardParameters {
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
    export interface Params$Resource$Accounts$Apps$Operations$Wait extends StandardParameters {
        /**
         * The name of the operation resource to wait on.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WaitOperationRequest;
    }
    export class Resource$Accounts$Apps$Reports {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a report. By default, only the name and results_uri fields are returned. You can include other fields by listing them in the `fields` URL query parameter. For example, `?fields=name,checks` will return the name and checks fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Apps$Reports$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Apps$Reports$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksReportV1alphaReport>>;
        get(params: Params$Resource$Accounts$Apps$Reports$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Apps$Reports$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksReportV1alphaReport>, callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaReport>): void;
        get(params: Params$Resource$Accounts$Apps$Reports$Get, callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaReport>): void;
        get(callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaReport>): void;
        /**
         * Lists reports for the specified app. By default, only the name and results_uri fields are returned. You can include other fields by listing them in the `fields` URL query parameter. For example, `?fields=reports(name,checks)` will return the name and checks fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Apps$Reports$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Apps$Reports$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksReportV1alphaListReportsResponse>>;
        list(params: Params$Resource$Accounts$Apps$Reports$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Apps$Reports$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksReportV1alphaListReportsResponse>, callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaListReportsResponse>): void;
        list(params: Params$Resource$Accounts$Apps$Reports$List, callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaListReportsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleChecksReportV1alphaListReportsResponse>): void;
    }
    export interface Params$Resource$Accounts$Apps$Reports$Get extends StandardParameters {
        /**
         * Optional. An [AIP-160](https://google.aip.dev/160) filter string to filter checks within the report. Only checks that match the filter string are included in the response. Example: `state = FAILED`
         */
        checksFilter?: string;
        /**
         * Required. Resource name of the report. Example: `accounts/123/apps/456/reports/789`
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Apps$Reports$List extends StandardParameters {
        /**
         * Optional. An [AIP-160](https://google.aip.dev/160) filter string to filter checks within reports. Only checks that match the filter string are included in the response. Example: `state = FAILED`
         */
        checksFilter?: string;
        /**
         * Optional. An [AIP-160](https://google.aip.dev/160) filter string to filter reports. Example: `appBundle.releaseType = PRE_RELEASE`
         */
        filter?: string;
        /**
         * Optional. The maximum number of reports to return. If unspecified, at most 10 reports will be returned. The maximum value is 50; values above 50 will be coerced to 50.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous `ListReports` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListReports` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the app. Example: `accounts/123/apps/456`
         */
        parent?: string;
    }
    export class Resource$Accounts$Repos {
        context: APIRequestContext;
        operations: Resource$Accounts$Repos$Operations;
        scans: Resource$Accounts$Repos$Scans;
        constructor(context: APIRequestContext);
    }
    export class Resource$Accounts$Repos$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Repos$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Repos$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Accounts$Repos$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Repos$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Accounts$Repos$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Accounts$Repos$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Accounts$Repos$Scans {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Uploads the results of local Code Compliance analysis and generates a scan of privacy issues. Returns a google.longrunning.Operation containing analysis and findings.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generate(params: Params$Resource$Accounts$Repos$Scans$Generate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generate(params?: Params$Resource$Accounts$Repos$Scans$Generate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        generate(params: Params$Resource$Accounts$Repos$Scans$Generate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generate(params: Params$Resource$Accounts$Repos$Scans$Generate, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        generate(params: Params$Resource$Accounts$Repos$Scans$Generate, callback: BodyResponseCallback<Schema$Operation>): void;
        generate(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets a repo scan. By default, only the name and results_uri fields are returned. You can include other fields by listing them in the `fields` URL query parameter. For example, `?fields=name,sources` will return the name and sources fields.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Accounts$Repos$Scans$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Accounts$Repos$Scans$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksRepoScanV1alphaRepoScan>>;
        get(params: Params$Resource$Accounts$Repos$Scans$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Accounts$Repos$Scans$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaRepoScan>, callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaRepoScan>): void;
        get(params: Params$Resource$Accounts$Repos$Scans$Get, callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaRepoScan>): void;
        get(callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaRepoScan>): void;
        /**
         * Lists repo scans for the specified repo.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Accounts$Repos$Scans$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Accounts$Repos$Scans$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse>>;
        list(params: Params$Resource$Accounts$Repos$Scans$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Accounts$Repos$Scans$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse>, callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse>): void;
        list(params: Params$Resource$Accounts$Repos$Scans$List, callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleChecksRepoScanV1alphaListRepoScansResponse>): void;
    }
    export interface Params$Resource$Accounts$Repos$Scans$Generate extends StandardParameters {
        /**
         * Required. Resource name of the repo. Example: `accounts/123/repos/456`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleChecksRepoScanV1alphaGenerateScanRequest;
    }
    export interface Params$Resource$Accounts$Repos$Scans$Get extends StandardParameters {
        /**
         * Required. Resource name of the repo scan. Example: `accounts/123/repos/456/scans/789`
         */
        name?: string;
    }
    export interface Params$Resource$Accounts$Repos$Scans$List extends StandardParameters {
        /**
         * Optional. An [AIP-160](https://google.aip.dev/160) filter string to filter repo scans. Example: `scmMetadata.branch = main`
         */
        filter?: string;
        /**
         * Optional. The maximum number of repo scans to return. If unspecified, at most 10 repo scans will be returned. The maximum value is 50; values above 50 will be coerced to 50.
         */
        pageSize?: number;
        /**
         * Optional. A page token received from a previous `ListRepoScans` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListRepoScans` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Resource name of the repo. Example: `accounts/123/repos/456`
         */
        parent?: string;
    }
    export class Resource$Aisafety {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Analyze a piece of content with the provided set of policies.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        classifyContent(params: Params$Resource$Aisafety$Classifycontent, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        classifyContent(params?: Params$Resource$Aisafety$Classifycontent, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse>>;
        classifyContent(params: Params$Resource$Aisafety$Classifycontent, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        classifyContent(params: Params$Resource$Aisafety$Classifycontent, options: MethodOptions | BodyResponseCallback<Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse>, callback: BodyResponseCallback<Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse>): void;
        classifyContent(params: Params$Resource$Aisafety$Classifycontent, callback: BodyResponseCallback<Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse>): void;
        classifyContent(callback: BodyResponseCallback<Schema$GoogleChecksAisafetyV1alphaClassifyContentResponse>): void;
    }
    export interface Params$Resource$Aisafety$Classifycontent extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleChecksAisafetyV1alphaClassifyContentRequest;
    }
    export class Resource$Media {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Analyzes the uploaded app bundle and returns a google.longrunning.Operation containing the generated Report. ## Example (upload only) Send a regular POST request with the header `X-Goog-Upload-Protocol: raw`. ``` POST https://checks.googleapis.com/upload/v1alpha/{parent=accounts/x/apps/x\}/reports:analyzeUpload HTTP/1.1 X-Goog-Upload-Protocol: raw Content-Length: Content-Type: application/octet-stream ``` ## Example (upload with metadata) Send a multipart POST request where the first body part contains the metadata JSON and the second body part contains the binary upload. Include the header `X-Goog-Upload-Protocol: multipart`. ``` POST https://checks.googleapis.com/upload/v1alpha/{parent=accounts/x/apps/x\}/reports:analyzeUpload HTTP/1.1 X-Goog-Upload-Protocol: multipart Content-Length: ? Content-Type: multipart/related; boundary=BOUNDARY --BOUNDARY Content-Type: application/json {"code_reference_id":"db5bcc20f94055fb5bc08cbb9b0e7a5530308786"\} --BOUNDARY --BOUNDARY-- ``` *Note:* Metadata-only requests are not supported.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        upload(params: Params$Resource$Media$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Media$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        upload(params: Params$Resource$Media$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Media$Upload, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        upload(params: Params$Resource$Media$Upload, callback: BodyResponseCallback<Schema$Operation>): void;
        upload(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Media$Upload extends StandardParameters {
        /**
         * Required. Resource name of the app. Example: `accounts/123/apps/456`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleChecksReportV1alphaAnalyzeUploadRequest;
        /**
         * Media metadata
         */
        media?: {
            /**
             * Media mime-type
             */
            mimeType?: string;
            /**
             * Media body contents
             */
            body?: any;
        };
    }
    export {};
}
