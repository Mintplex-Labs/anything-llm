import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace firebaserules_v1 {
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
     * Firebase Rules API
     *
     * Creates and manages rules that determine when a Firebase Rules-enabled service should permit a request.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const firebaserules = google.firebaserules('v1');
     * ```
     */
    export class Firebaserules {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Arg matchers for the mock function.
     */
    export interface Schema$Arg {
        /**
         * Argument matches any value provided.
         */
        anyValue?: Schema$Empty;
        /**
         * Argument exactly matches value provided.
         */
        exactValue?: any | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Describes where in a file an expression is found and what it was evaluated to over the course of its use.
     */
    export interface Schema$ExpressionReport {
        /**
         * Subexpressions
         */
        children?: Schema$ExpressionReport[];
        /**
         * Position of expression in original rules source.
         */
        sourcePosition?: Schema$SourcePosition;
        /**
         * Values that this expression evaluated to when encountered.
         */
        values?: Schema$ValueCount[];
    }
    /**
     * `File` containing source content.
     */
    export interface Schema$File {
        /**
         * Required. Textual Content.
         */
        content?: string | null;
        /**
         * Fingerprint (e.g. github sha) associated with the `File`.
         */
        fingerprint?: string | null;
        /**
         * Required. File name.
         */
        name?: string | null;
    }
    /**
     * Represents a service-defined function call that was invoked during test execution.
     */
    export interface Schema$FunctionCall {
        /**
         * The arguments that were provided to the function.
         */
        args?: any[] | null;
        /**
         * Name of the function invoked.
         */
        function?: string | null;
    }
    /**
     * Mock function definition. Mocks must refer to a function declared by the target service. The type of the function args and result will be inferred at test time. If either the arg or result values are not compatible with function type declaration, the request will be considered invalid. More than one `FunctionMock` may be provided for a given function name so long as the `Arg` matchers are distinct. There may be only one function for a given overload where all `Arg` values are `Arg.any_value`.
     */
    export interface Schema$FunctionMock {
        /**
         * The list of `Arg` values to match. The order in which the arguments are provided is the order in which they must appear in the function invocation.
         */
        args?: Schema$Arg[];
        /**
         * The name of the function. The function name must match one provided by a service declaration.
         */
        function?: string | null;
        /**
         * The mock result of the function call.
         */
        result?: Schema$Result;
    }
    /**
     * The response for FirebaseRulesService.GetReleaseExecutable
     */
    export interface Schema$GetReleaseExecutableResponse {
        /**
         * Executable view of the `Ruleset` referenced by the `Release`.
         */
        executable?: string | null;
        /**
         * The Rules runtime version of the executable.
         */
        executableVersion?: string | null;
        /**
         * `Language` used to generate the executable bytes.
         */
        language?: string | null;
        /**
         * `Ruleset` name associated with the `Release` executable.
         */
        rulesetName?: string | null;
        /**
         * Optional, indicates the freshness of the result. The response is guaranteed to be the latest within an interval up to the sync_time (inclusive).
         */
        syncTime?: string | null;
        /**
         * Timestamp for the most recent `Release.update_time`.
         */
        updateTime?: string | null;
    }
    /**
     * Issues include warnings, errors, and deprecation notices.
     */
    export interface Schema$Issue {
        /**
         * Short error description.
         */
        description?: string | null;
        /**
         * The severity of the issue.
         */
        severity?: string | null;
        /**
         * Position of the issue in the `Source`.
         */
        sourcePosition?: Schema$SourcePosition;
    }
    /**
     * The response for FirebaseRulesService.ListReleases.
     */
    export interface Schema$ListReleasesResponse {
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
        /**
         * List of `Release` instances.
         */
        releases?: Schema$Release[];
    }
    /**
     * The response for FirebaseRulesService.ListRulesets.
     */
    export interface Schema$ListRulesetsResponse {
        /**
         * The pagination token to retrieve the next page of results. If the value is empty, no further results remain.
         */
        nextPageToken?: string | null;
        /**
         * List of `Ruleset` instances.
         */
        rulesets?: Schema$Ruleset[];
    }
    /**
     * Metadata for a Ruleset.
     */
    export interface Schema$Metadata {
        /**
         * Services that this ruleset has declarations for (e.g., "cloud.firestore"). There may be 0+ of these.
         */
        services?: string[] | null;
    }
    /**
     * `Release` is a named reference to a `Ruleset`. Once a `Release` refers to a `Ruleset`, rules-enabled services will be able to enforce the `Ruleset`.
     */
    export interface Schema$Release {
        /**
         * Output only. Time the release was created.
         */
        createTime?: string | null;
        /**
         * Required. Format: `projects/{project_id\}/releases/{release_id\}`
         */
        name?: string | null;
        /**
         * Required. Name of the `Ruleset` referred to by this `Release`. The `Ruleset` must exist for the `Release` to be created.
         */
        rulesetName?: string | null;
        /**
         * Output only. Time the release was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Possible result values from the function mock invocation.
     */
    export interface Schema$Result {
        /**
         * The result is undefined, meaning the result could not be computed.
         */
        undefined?: Schema$Empty;
        /**
         * The result is an actual value. The type of the value must match that of the type declared by the service.
         */
        value?: any | null;
    }
    /**
     * `Ruleset` is an immutable copy of `Source` with a globally unique identifier and a creation time.
     */
    export interface Schema$Ruleset {
        /**
         * Immutable. Intended resource to which this Ruleset should be released. May be left blank to signify the resource associated with the default release. Expected format: firestore.googleapis.com/projects//databases/
         */
        attachmentPoint?: string | null;
        /**
         * Output only. Time the `Ruleset` was created.
         */
        createTime?: string | null;
        /**
         * Output only. The metadata for this ruleset.
         */
        metadata?: Schema$Metadata;
        /**
         * Output only. Name of the `Ruleset`. The ruleset_id is auto generated by the service. Format: `projects/{project_id\}/rulesets/{ruleset_id\}`
         */
        name?: string | null;
        /**
         * Required. `Source` for the `Ruleset`.
         */
        source?: Schema$Source;
    }
    /**
     * `Source` is one or more `File` messages comprising a logical set of rules.
     */
    export interface Schema$Source {
        /**
         * Required. `File` set constituting the `Source` bundle.
         */
        files?: Schema$File[];
    }
    /**
     * Position in the `Source` content including its line, column number, and an index of the `File` in the `Source` message. Used for debug purposes.
     */
    export interface Schema$SourcePosition {
        /**
         * First column on the source line associated with the source fragment.
         */
        column?: number | null;
        /**
         * Start position relative to the beginning of the file.
         */
        currentOffset?: number | null;
        /**
         * End position relative to the beginning of the file.
         */
        endOffset?: number | null;
        /**
         * Name of the `File`.
         */
        fileName?: string | null;
        /**
         * Line number of the source fragment. 1-based.
         */
        line?: number | null;
    }
    /**
     * `TestCase` messages provide the request context and an expectation as to whether the given context will be allowed or denied. Test cases may specify the `request`, `resource`, and `function_mocks` to mock a function call to a service-provided function. The `request` object represents context present at request-time. The `resource` is the value of the target resource as it appears in persistent storage before the request is executed.
     */
    export interface Schema$TestCase {
        /**
         * Test expectation.
         */
        expectation?: string | null;
        /**
         * Specifies what should be included in the response.
         */
        expressionReportLevel?: string | null;
        /**
         * Optional function mocks for service-defined functions. If not set, any service defined function is expected to return an error, which may or may not influence the test outcome.
         */
        functionMocks?: Schema$FunctionMock[];
        /**
         * Specifies whether paths (such as request.path) are encoded and how.
         */
        pathEncoding?: string | null;
        /**
         * Request context. The exact format of the request context is service-dependent. See the appropriate service documentation for information about the supported fields and types on the request. Minimally, all services support the following fields and types: Request field | Type ---------------|----------------- auth.uid | `string` auth.token | `map` headers | `map` method | `string` params | `map` path | `string` time | `google.protobuf.Timestamp` If the request value is not well-formed for the service, the request will be rejected as an invalid argument.
         */
        request?: any | null;
        /**
         * Optional resource value as it appears in persistent storage before the request is fulfilled. The resource type depends on the `request.path` value.
         */
        resource?: any | null;
    }
    /**
     * Test result message containing the state of the test as well as a description and source position for test failures.
     */
    export interface Schema$TestResult {
        /**
         * Debug messages related to test execution issues encountered during evaluation. Debug messages may be related to too many or too few invocations of function mocks or to runtime errors that occur during evaluation. For example: ```Unable to read variable [name: "resource"]```
         */
        debugMessages?: string[] | null;
        /**
         * Position in the `Source` or `Ruleset` where the principle runtime error occurs. Evaluation of an expression may result in an error. Rules are deny by default, so a `DENY` expectation when an error is generated is valid. When there is a `DENY` with an error, the `SourcePosition` is returned. E.g. `error_position { line: 19 column: 37 \}`
         */
        errorPosition?: Schema$SourcePosition;
        /**
         * The mapping from expression in the ruleset AST to the values they were evaluated to. Partially-nested to mirror AST structure. Note that this field is actually tracking expressions and not permission statements in contrast to the "visited_expressions" field above. Literal expressions are omitted.
         */
        expressionReports?: Schema$ExpressionReport[];
        /**
         * The set of function calls made to service-defined methods. Function calls are included in the order in which they are encountered during evaluation, are provided for both mocked and unmocked functions, and included on the response regardless of the test `state`.
         */
        functionCalls?: Schema$FunctionCall[];
        /**
         * State of the test.
         */
        state?: string | null;
        /**
         * The set of visited permission expressions for a given test. This returns the positions and evaluation results of all visited permission expressions which were relevant to the test case, e.g. ``` match /path { allow read if: \} ``` For a detailed report of the intermediate evaluation states, see the `expression_reports` field
         */
        visitedExpressions?: Schema$VisitedExpression[];
    }
    /**
     * The request for FirebaseRulesService.TestRuleset.
     */
    export interface Schema$TestRulesetRequest {
        /**
         * Optional. Optional `Source` to be checked for correctness. This field must not be set when the resource name refers to a `Ruleset`.
         */
        source?: Schema$Source;
        /**
         * Required. The tests to execute against the `Source`. When `Source` is provided inline, the test cases will only be run if the `Source` is syntactically and semantically valid. Inline `TestSuite` to run.
         */
        testSuite?: Schema$TestSuite;
    }
    /**
     * The response for FirebaseRulesService.TestRuleset.
     */
    export interface Schema$TestRulesetResponse {
        /**
         * Syntactic and semantic `Source` issues of varying severity. Issues of `ERROR` severity will prevent tests from executing.
         */
        issues?: Schema$Issue[];
        /**
         * The set of test results given the test cases in the `TestSuite`. The results will appear in the same order as the test cases appear in the `TestSuite`.
         */
        testResults?: Schema$TestResult[];
    }
    /**
     * `TestSuite` is a collection of `TestCase` instances that validate the logical correctness of a `Ruleset`. The `TestSuite` may be referenced in-line within a `TestRuleset` invocation or as part of a `Release` object as a pre-release check.
     */
    export interface Schema$TestSuite {
        /**
         * Collection of test cases associated with the `TestSuite`.
         */
        testCases?: Schema$TestCase[];
    }
    /**
     * The request for FirebaseRulesService.UpdateRelease.
     */
    export interface Schema$UpdateReleaseRequest {
        /**
         * Required. `Release` to update.
         */
        release?: Schema$Release;
        /**
         * Optional. Specifies which fields to update.
         */
        updateMask?: string | null;
    }
    /**
     * Tuple for how many times an Expression was evaluated to a particular ExpressionValue.
     */
    export interface Schema$ValueCount {
        /**
         * The amount of times that expression returned.
         */
        count?: number | null;
        /**
         * The return value of the expression
         */
        value?: any | null;
    }
    /**
     * Store the position and access outcome for an expression visited in rules.
     */
    export interface Schema$VisitedExpression {
        /**
         * Position in the `Source` or `Ruleset` where an expression was visited.
         */
        sourcePosition?: Schema$SourcePosition;
        /**
         * The evaluated value for the visited expression, e.g. true/false
         */
        value?: any | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        releases: Resource$Projects$Releases;
        rulesets: Resource$Projects$Rulesets;
        constructor(context: APIRequestContext);
        /**
         * Test `Source` for syntactic and semantic correctness. Issues present, if any, will be returned to the caller with a description, severity, and source location. The test method may be executed with `Source` or a `Ruleset` name. Passing `Source` is useful for unit testing new rules. Passing a `Ruleset` name is useful for regression testing an existing rule. The following is an example of `Source` that permits users to upload images to a bucket bearing their user id and matching the correct metadata: _*Example*_ // Users are allowed to subscribe and unsubscribe to the blog. service firebase.storage { match /users/{userId\}/images/{imageName\} { allow write: if userId == request.auth.uid && (imageName.matches('*.png$') || imageName.matches('*.jpg$')) && resource.mimeType.matches('^image/') \} \}
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        test(params: Params$Resource$Projects$Test, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        test(params?: Params$Resource$Projects$Test, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestRulesetResponse>>;
        test(params: Params$Resource$Projects$Test, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        test(params: Params$Resource$Projects$Test, options: MethodOptions | BodyResponseCallback<Schema$TestRulesetResponse>, callback: BodyResponseCallback<Schema$TestRulesetResponse>): void;
        test(params: Params$Resource$Projects$Test, callback: BodyResponseCallback<Schema$TestRulesetResponse>): void;
        test(callback: BodyResponseCallback<Schema$TestRulesetResponse>): void;
    }
    export interface Params$Resource$Projects$Test extends StandardParameters {
        /**
         * Required. Tests may either provide `source` or a `Ruleset` resource name. For tests against `source`, the resource name must refer to the project: Format: `projects/{project_id\}` For tests against a `Ruleset`, this must be the `Ruleset` resource name: Format: `projects/{project_id\}/rulesets/{ruleset_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestRulesetRequest;
    }
    export class Resource$Projects$Releases {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a `Release`. Release names should reflect the developer's deployment practices. For example, the release name may include the environment name, application name, application version, or any other name meaningful to the developer. Once a `Release` refers to a `Ruleset`, the rules can be enforced by Firebase Rules-enabled services. More than one `Release` may be 'live' concurrently. Consider the following three `Release` names for `projects/foo` and the `Ruleset` to which they refer. Release Name -\> Ruleset Name * projects/foo/releases/prod -\> projects/foo/rulesets/uuid123 * projects/foo/releases/prod/beta -\> projects/foo/rulesets/uuid123 * projects/foo/releases/prod/v23 -\> projects/foo/rulesets/uuid456 The relationships reflect a `Ruleset` rollout in progress. The `prod` and `prod/beta` releases refer to the same `Ruleset`. However, `prod/v23` refers to a new `Ruleset`. The `Ruleset` reference for a `Release` may be updated using the UpdateRelease method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Releases$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Releases$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Release>>;
        create(params: Params$Resource$Projects$Releases$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Releases$Create, options: MethodOptions | BodyResponseCallback<Schema$Release>, callback: BodyResponseCallback<Schema$Release>): void;
        create(params: Params$Resource$Projects$Releases$Create, callback: BodyResponseCallback<Schema$Release>): void;
        create(callback: BodyResponseCallback<Schema$Release>): void;
        /**
         * Delete a `Release` by resource name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Releases$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Releases$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Releases$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Releases$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Releases$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get a `Release` by name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Releases$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Releases$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Release>>;
        get(params: Params$Resource$Projects$Releases$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Releases$Get, options: MethodOptions | BodyResponseCallback<Schema$Release>, callback: BodyResponseCallback<Schema$Release>): void;
        get(params: Params$Resource$Projects$Releases$Get, callback: BodyResponseCallback<Schema$Release>): void;
        get(callback: BodyResponseCallback<Schema$Release>): void;
        /**
         * Get the `Release` executable to use when enforcing rules.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getExecutable(params: Params$Resource$Projects$Releases$Getexecutable, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getExecutable(params?: Params$Resource$Projects$Releases$Getexecutable, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetReleaseExecutableResponse>>;
        getExecutable(params: Params$Resource$Projects$Releases$Getexecutable, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getExecutable(params: Params$Resource$Projects$Releases$Getexecutable, options: MethodOptions | BodyResponseCallback<Schema$GetReleaseExecutableResponse>, callback: BodyResponseCallback<Schema$GetReleaseExecutableResponse>): void;
        getExecutable(params: Params$Resource$Projects$Releases$Getexecutable, callback: BodyResponseCallback<Schema$GetReleaseExecutableResponse>): void;
        getExecutable(callback: BodyResponseCallback<Schema$GetReleaseExecutableResponse>): void;
        /**
         * List the `Release` values for a project. This list may optionally be filtered by `Release` name, `Ruleset` name, `TestSuite` name, or any combination thereof.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Releases$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Releases$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListReleasesResponse>>;
        list(params: Params$Resource$Projects$Releases$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Releases$List, options: MethodOptions | BodyResponseCallback<Schema$ListReleasesResponse>, callback: BodyResponseCallback<Schema$ListReleasesResponse>): void;
        list(params: Params$Resource$Projects$Releases$List, callback: BodyResponseCallback<Schema$ListReleasesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListReleasesResponse>): void;
        /**
         * Update a `Release` via PATCH. Only updates to `ruleset_name` will be honored. `Release` rename is not supported. To create a `Release` use the CreateRelease method.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Releases$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Releases$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Release>>;
        patch(params: Params$Resource$Projects$Releases$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Releases$Patch, options: MethodOptions | BodyResponseCallback<Schema$Release>, callback: BodyResponseCallback<Schema$Release>): void;
        patch(params: Params$Resource$Projects$Releases$Patch, callback: BodyResponseCallback<Schema$Release>): void;
        patch(callback: BodyResponseCallback<Schema$Release>): void;
    }
    export interface Params$Resource$Projects$Releases$Create extends StandardParameters {
        /**
         * Required. Resource name for the project which owns this `Release`. Format: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Release;
    }
    export interface Params$Resource$Projects$Releases$Delete extends StandardParameters {
        /**
         * Required. Resource name for the `Release` to delete. Format: `projects/{project_id\}/releases/{release_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Releases$Get extends StandardParameters {
        /**
         * Required. Resource name of the `Release`. Format: `projects/{project_id\}/releases/{release_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Releases$Getexecutable extends StandardParameters {
        /**
         * Optional. The requested runtime executable version. Defaults to FIREBASE_RULES_EXECUTABLE_V1.
         */
        executableVersion?: string;
        /**
         * Required. Resource name of the `Release`. Format: `projects/{project_id\}/releases/{release_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Releases$List extends StandardParameters {
        /**
         * Optional. `Release` filter. The list method supports filters with restrictions on the `Release.name`, and `Release.ruleset_name`. Example 1: A filter of 'name=prod*' might return `Release`s with names within 'projects/foo' prefixed with 'prod': Name -\> Ruleset Name: * projects/foo/releases/prod -\> projects/foo/rulesets/uuid1234 * projects/foo/releases/prod/v1 -\> projects/foo/rulesets/uuid1234 * projects/foo/releases/prod/v2 -\> projects/foo/rulesets/uuid8888 Example 2: A filter of `name=prod* ruleset_name=uuid1234` would return only `Release` instances for 'projects/foo' with names prefixed with 'prod' referring to the same `Ruleset` name of 'uuid1234': Name -\> Ruleset Name: * projects/foo/releases/prod -\> projects/foo/rulesets/1234 * projects/foo/releases/prod/v1 -\> projects/foo/rulesets/1234 In the examples, the filter parameters refer to the search filters are relative to the project. Fully qualified prefixed may also be used.
         */
        filter?: string;
        /**
         * Required. Resource name for the project. Format: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Optional. Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load fewer than `page_size` results due to the size of the output. To traverse all of the releases, the caller should iterate until the `page_token` on the response is empty.
         */
        pageSize?: number;
        /**
         * Optional. Next page token for the next batch of `Release` instances.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Projects$Releases$Patch extends StandardParameters {
        /**
         * Required. Resource name for the project which owns this `Release`. Format: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateReleaseRequest;
    }
    export class Resource$Projects$Rulesets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a `Ruleset` from `Source`. The `Ruleset` is given a unique generated name which is returned to the caller. `Source` containing syntactic or semantics errors will result in an error response indicating the first error encountered. For a detailed view of `Source` issues, use TestRuleset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Rulesets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Rulesets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Ruleset>>;
        create(params: Params$Resource$Projects$Rulesets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Rulesets$Create, options: MethodOptions | BodyResponseCallback<Schema$Ruleset>, callback: BodyResponseCallback<Schema$Ruleset>): void;
        create(params: Params$Resource$Projects$Rulesets$Create, callback: BodyResponseCallback<Schema$Ruleset>): void;
        create(callback: BodyResponseCallback<Schema$Ruleset>): void;
        /**
         * Delete a `Ruleset` by resource name. If the `Ruleset` is referenced by a `Release` the operation will fail.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Rulesets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Rulesets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Rulesets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Rulesets$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Rulesets$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get a `Ruleset` by name including the full `Source` contents.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Rulesets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Rulesets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Ruleset>>;
        get(params: Params$Resource$Projects$Rulesets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Rulesets$Get, options: MethodOptions | BodyResponseCallback<Schema$Ruleset>, callback: BodyResponseCallback<Schema$Ruleset>): void;
        get(params: Params$Resource$Projects$Rulesets$Get, callback: BodyResponseCallback<Schema$Ruleset>): void;
        get(callback: BodyResponseCallback<Schema$Ruleset>): void;
        /**
         * List `Ruleset` metadata only and optionally filter the results by `Ruleset` name. The full `Source` contents of a `Ruleset` may be retrieved with GetRuleset.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Rulesets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Rulesets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListRulesetsResponse>>;
        list(params: Params$Resource$Projects$Rulesets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Rulesets$List, options: MethodOptions | BodyResponseCallback<Schema$ListRulesetsResponse>, callback: BodyResponseCallback<Schema$ListRulesetsResponse>): void;
        list(params: Params$Resource$Projects$Rulesets$List, callback: BodyResponseCallback<Schema$ListRulesetsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListRulesetsResponse>): void;
    }
    export interface Params$Resource$Projects$Rulesets$Create extends StandardParameters {
        /**
         * Required. Resource name for Project which owns this `Ruleset`. Format: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Ruleset;
    }
    export interface Params$Resource$Projects$Rulesets$Delete extends StandardParameters {
        /**
         * Required. Resource name for the ruleset to delete. Format: `projects/{project_id\}/rulesets/{ruleset_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Rulesets$Get extends StandardParameters {
        /**
         * Required. Resource name for the ruleset to get. Format: `projects/{project_id\}/rulesets/{ruleset_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Rulesets$List extends StandardParameters {
        /**
         * Optional. `Ruleset` filter. The list method supports filters with restrictions on `Ruleset.name`. Filters on `Ruleset.create_time` should use the `date` function which parses strings that conform to the RFC 3339 date/time specifications. Example: `create_time \> date("2017-01-01T00:00:00Z") AND name=UUID-*`
         */
        filter?: string;
        /**
         * Required. Resource name for the project. Format: `projects/{project_id\}`
         */
        name?: string;
        /**
         * Optional. Page size to load. Maximum of 100. Defaults to 10. Note: `page_size` is just a hint and the service may choose to load less than `page_size` due to the size of the output. To traverse all of the releases, caller should iterate until the `page_token` is empty.
         */
        pageSize?: number;
        /**
         * Optional. Next page token for loading the next batch of `Ruleset` instances.
         */
        pageToken?: string;
    }
    export {};
}
