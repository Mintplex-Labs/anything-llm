import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace clouddebugger_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
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
     * Cloud Debugger API (Deprecated)
     *
     * Examines the call stack and variables of a running application without stopping or slowing it down. (Deprecated)
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const clouddebugger = google.clouddebugger('v2');
     * ```
     */
    export class Clouddebugger {
        context: APIRequestContext;
        controller: Resource$Controller;
        debugger: Resource$Debugger;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An alias to a repo revision.
     */
    export interface Schema$AliasContext {
        /**
         * The alias kind.
         */
        kind?: string | null;
        /**
         * The alias name.
         */
        name?: string | null;
    }
    /**
     * ------------------------------------------------------------------------------ ## Breakpoint (the resource) Represents the breakpoint specification, status and results.
     */
    export interface Schema$Breakpoint {
        /**
         * Action that the agent should perform when the code at the breakpoint location is hit.
         */
        action?: string | null;
        /**
         * The deadline for the breakpoint to stay in CANARY_ACTIVE state. The value is meaningless when the breakpoint is not in CANARY_ACTIVE state.
         */
        canaryExpireTime?: string | null;
        /**
         * Condition that triggers the breakpoint. The condition is a compound boolean expression composed using expressions in a programming language at the source location.
         */
        condition?: string | null;
        /**
         * Time this breakpoint was created by the server in seconds resolution.
         */
        createTime?: string | null;
        /**
         * Values of evaluated expressions at breakpoint time. The evaluated expressions appear in exactly the same order they are listed in the `expressions` field. The `name` field holds the original expression text, the `value` or `members` field holds the result of the evaluated expression. If the expression cannot be evaluated, the `status` inside the `Variable` will indicate an error and contain the error text.
         */
        evaluatedExpressions?: Schema$Variable[];
        /**
         * List of read-only expressions to evaluate at the breakpoint location. The expressions are composed using expressions in the programming language at the source location. If the breakpoint action is `LOG`, the evaluated expressions are included in log statements.
         */
        expressions?: string[] | null;
        /**
         * Time this breakpoint was finalized as seen by the server in seconds resolution.
         */
        finalTime?: string | null;
        /**
         * Breakpoint identifier, unique in the scope of the debuggee.
         */
        id?: string | null;
        /**
         * When true, indicates that this is a final result and the breakpoint state will not change from here on.
         */
        isFinalState?: boolean | null;
        /**
         * A set of custom breakpoint properties, populated by the agent, to be displayed to the user.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Breakpoint source location.
         */
        location?: Schema$SourceLocation;
        /**
         * Indicates the severity of the log. Only relevant when action is `LOG`.
         */
        logLevel?: string | null;
        /**
         * Only relevant when action is `LOG`. Defines the message to log when the breakpoint hits. The message may include parameter placeholders `$0`, `$1`, etc. These placeholders are replaced with the evaluated value of the appropriate expression. Expressions not referenced in `log_message_format` are not logged. Example: `Message received, id = $0, count = $1` with `expressions` = `[ message.id, message.count ]`.
         */
        logMessageFormat?: string | null;
        /**
         * The stack at breakpoint time, where stack_frames[0] represents the most recently entered function.
         */
        stackFrames?: Schema$StackFrame[];
        /**
         * The current state of the breakpoint.
         */
        state?: string | null;
        /**
         * Breakpoint status. The status includes an error flag and a human readable message. This field is usually unset. The message can be either informational or an error message. Regardless, clients should always display the text message back to the user. Error status indicates complete failure of the breakpoint. Example (non-final state): `Still loading symbols...` Examples (final state): * `Invalid line number` referring to location * `Field f not found in class C` referring to condition
         */
        status?: Schema$StatusMessage;
        /**
         * E-mail address of the user that created this breakpoint
         */
        userEmail?: string | null;
        /**
         * The `variable_table` exists to aid with computation, memory and network traffic optimization. It enables storing a variable once and reference it from multiple variables, including variables stored in the `variable_table` itself. For example, the same `this` object, which may appear at many levels of the stack, can have all of its data stored once in this table. The stack frame variables then would hold only a reference to it. The variable `var_table_index` field is an index into this repeated field. The stored objects are nameless and get their name from the referencing variable. The effective variable is a merge of the referencing variable and the referenced variable.
         */
        variableTable?: Schema$Variable[];
    }
    /**
     * A CloudRepoSourceContext denotes a particular revision in a cloud repo (a repo hosted by the Google Cloud Platform).
     */
    export interface Schema$CloudRepoSourceContext {
        /**
         * An alias, which may be a branch or tag.
         */
        aliasContext?: Schema$AliasContext;
        /**
         * The name of an alias (branch, tag, etc.).
         */
        aliasName?: string | null;
        /**
         * The ID of the repo.
         */
        repoId?: Schema$RepoId;
        /**
         * A revision ID.
         */
        revisionId?: string | null;
    }
    /**
     * A CloudWorkspaceId is a unique identifier for a cloud workspace. A cloud workspace is a place associated with a repo where modified files can be stored before they are committed.
     */
    export interface Schema$CloudWorkspaceId {
        /**
         * The unique name of the workspace within the repo. This is the name chosen by the client in the Source API's CreateWorkspace method.
         */
        name?: string | null;
        /**
         * The ID of the repo containing the workspace.
         */
        repoId?: Schema$RepoId;
    }
    /**
     * A CloudWorkspaceSourceContext denotes a workspace at a particular snapshot.
     */
    export interface Schema$CloudWorkspaceSourceContext {
        /**
         * The ID of the snapshot. An empty snapshot_id refers to the most recent snapshot.
         */
        snapshotId?: string | null;
        /**
         * The ID of the workspace.
         */
        workspaceId?: Schema$CloudWorkspaceId;
    }
    /**
     * Represents the debugged application. The application may include one or more replicated processes executing the same code. Each of these processes is attached with a debugger agent, carrying out the debugging commands. Agents attached to the same debuggee identify themselves as such by using exactly the same Debuggee message value when registering.
     */
    export interface Schema$Debuggee {
        /**
         * Version ID of the agent. Schema: `domain/language-platform/vmajor.minor` (for example `google.com/java-gcp/v1.1`).
         */
        agentVersion?: string | null;
        /**
         * Used when setting breakpoint canary for this debuggee.
         */
        canaryMode?: string | null;
        /**
         * Human readable description of the debuggee. Including a human-readable project name, environment name and version information is recommended.
         */
        description?: string | null;
        /**
         * References to the locations and revisions of the source code used in the deployed application.
         */
        extSourceContexts?: Schema$ExtendedSourceContext[];
        /**
         * Unique identifier for the debuggee generated by the controller service.
         */
        id?: string | null;
        /**
         * If set to `true`, indicates that the agent should disable itself and detach from the debuggee.
         */
        isDisabled?: boolean | null;
        /**
         * If set to `true`, indicates that Controller service does not detect any activity from the debuggee agents and the application is possibly stopped.
         */
        isInactive?: boolean | null;
        /**
         * A set of custom debuggee properties, populated by the agent, to be displayed to the user.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Project the debuggee is associated with. Use project number or id when registering a Google Cloud Platform project.
         */
        project?: string | null;
        /**
         * References to the locations and revisions of the source code used in the deployed application.
         */
        sourceContexts?: Schema$SourceContext[];
        /**
         * Human readable message to be displayed to the user about this debuggee. Absence of this field indicates no status. The message can be either informational or an error status.
         */
        status?: Schema$StatusMessage;
        /**
         * Uniquifier to further distinguish the application. It is possible that different applications might have identical values in the debuggee message, thus, incorrectly identified as a single application by the Controller service. This field adds salt to further distinguish the application. Agents should consider seeding this field with value that identifies the code, binary, configuration and environment.
         */
        uniquifier?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * An ExtendedSourceContext is a SourceContext combined with additional details describing the context.
     */
    export interface Schema$ExtendedSourceContext {
        /**
         * Any source context.
         */
        context?: Schema$SourceContext;
        /**
         * Labels with user defined metadata.
         */
        labels?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Represents a message with parameters.
     */
    export interface Schema$FormatMessage {
        /**
         * Format template for the message. The `format` uses placeholders `$0`, `$1`, etc. to reference parameters. `$$` can be used to denote the `$` character. Examples: * `Failed to load '$0' which helps debug $1 the first time it is loaded. Again, $0 is very important.` * `Please pay $$10 to use $0 instead of $1.`
         */
        format?: string | null;
        /**
         * Optional parameters to be embedded into the message.
         */
        parameters?: string[] | null;
    }
    /**
     * A SourceContext referring to a Gerrit project.
     */
    export interface Schema$GerritSourceContext {
        /**
         * An alias, which may be a branch or tag.
         */
        aliasContext?: Schema$AliasContext;
        /**
         * The name of an alias (branch, tag, etc.).
         */
        aliasName?: string | null;
        /**
         * The full project name within the host. Projects may be nested, so "project/subproject" is a valid project name. The "repo name" is hostURI/project.
         */
        gerritProject?: string | null;
        /**
         * The URI of a running Gerrit instance.
         */
        hostUri?: string | null;
        /**
         * A revision (commit) ID.
         */
        revisionId?: string | null;
    }
    /**
     * Response for getting breakpoint information.
     */
    export interface Schema$GetBreakpointResponse {
        /**
         * Complete breakpoint state. The fields `id` and `location` are guaranteed to be set.
         */
        breakpoint?: Schema$Breakpoint;
    }
    /**
     * A GitSourceContext denotes a particular revision in a third party Git repository (e.g. GitHub).
     */
    export interface Schema$GitSourceContext {
        /**
         * Git commit hash. required.
         */
        revisionId?: string | null;
        /**
         * Git repository URL.
         */
        url?: string | null;
    }
    /**
     * Response for listing active breakpoints.
     */
    export interface Schema$ListActiveBreakpointsResponse {
        /**
         * List of all active breakpoints. The fields `id` and `location` are guaranteed to be set on each breakpoint.
         */
        breakpoints?: Schema$Breakpoint[];
        /**
         * A token that can be used in the next method call to block until the list of breakpoints changes.
         */
        nextWaitToken?: string | null;
        /**
         * If set to `true`, indicates that there is no change to the list of active breakpoints and the server-selected timeout has expired. The `breakpoints` field would be empty and should be ignored.
         */
        waitExpired?: boolean | null;
    }
    /**
     * Response for listing breakpoints.
     */
    export interface Schema$ListBreakpointsResponse {
        /**
         * List of breakpoints matching the request. The fields `id` and `location` are guaranteed to be set on each breakpoint. The fields: `stack_frames`, `evaluated_expressions` and `variable_table` are cleared on each breakpoint regardless of its status.
         */
        breakpoints?: Schema$Breakpoint[];
        /**
         * A wait token that can be used in the next call to `list` (REST) or `ListBreakpoints` (RPC) to block until the list of breakpoints has changes.
         */
        nextWaitToken?: string | null;
    }
    /**
     * Response for listing debuggees.
     */
    export interface Schema$ListDebuggeesResponse {
        /**
         * List of debuggees accessible to the calling user. The fields `debuggee.id` and `description` are guaranteed to be set. The `description` field is a human readable field provided by agents and can be displayed to users.
         */
        debuggees?: Schema$Debuggee[];
    }
    /**
     * Selects a repo using a Google Cloud Platform project ID (e.g. winged-cargo-31) and a repo name within that project.
     */
    export interface Schema$ProjectRepoId {
        /**
         * The ID of the project.
         */
        projectId?: string | null;
        /**
         * The name of the repo. Leave empty for the default repo.
         */
        repoName?: string | null;
    }
    /**
     * Request to register a debuggee.
     */
    export interface Schema$RegisterDebuggeeRequest {
        /**
         * Required. Debuggee information to register. The fields `project`, `uniquifier`, `description` and `agent_version` of the debuggee must be set.
         */
        debuggee?: Schema$Debuggee;
    }
    /**
     * Response for registering a debuggee.
     */
    export interface Schema$RegisterDebuggeeResponse {
        /**
         * A unique ID generated for the agent. Each RegisterDebuggee request will generate a new agent ID.
         */
        agentId?: string | null;
        /**
         * Debuggee resource. The field `id` is guaranteed to be set (in addition to the echoed fields). If the field `is_disabled` is set to `true`, the agent should disable itself by removing all breakpoints and detaching from the application. It should however continue to poll `RegisterDebuggee` until reenabled.
         */
        debuggee?: Schema$Debuggee;
    }
    /**
     * A unique identifier for a cloud repo.
     */
    export interface Schema$RepoId {
        /**
         * A combination of a project ID and a repo name.
         */
        projectRepoId?: Schema$ProjectRepoId;
        /**
         * A server-assigned, globally unique identifier.
         */
        uid?: string | null;
    }
    /**
     * Response for setting a breakpoint.
     */
    export interface Schema$SetBreakpointResponse {
        /**
         * Breakpoint resource. The field `id` is guaranteed to be set (in addition to the echoed fields).
         */
        breakpoint?: Schema$Breakpoint;
    }
    /**
     * A SourceContext is a reference to a tree of files. A SourceContext together with a path point to a unique revision of a single file or directory.
     */
    export interface Schema$SourceContext {
        /**
         * A SourceContext referring to a revision in a cloud repo.
         */
        cloudRepo?: Schema$CloudRepoSourceContext;
        /**
         * A SourceContext referring to a snapshot in a cloud workspace.
         */
        cloudWorkspace?: Schema$CloudWorkspaceSourceContext;
        /**
         * A SourceContext referring to a Gerrit project.
         */
        gerrit?: Schema$GerritSourceContext;
        /**
         * A SourceContext referring to any third party Git repo (e.g. GitHub).
         */
        git?: Schema$GitSourceContext;
    }
    /**
     * Represents a location in the source code.
     */
    export interface Schema$SourceLocation {
        /**
         * Column within a line. The first column in a line as the value `1`. Agents that do not support setting breakpoints on specific columns ignore this field.
         */
        column?: number | null;
        /**
         * Line inside the file. The first line in the file has the value `1`.
         */
        line?: number | null;
        /**
         * Path to the source file within the source context of the target binary.
         */
        path?: string | null;
    }
    /**
     * Represents a stack frame context.
     */
    export interface Schema$StackFrame {
        /**
         * Set of arguments passed to this function. Note that this might not be populated for all stack frames.
         */
        arguments?: Schema$Variable[];
        /**
         * Demangled function name at the call site.
         */
        function?: string | null;
        /**
         * Set of local variables at the stack frame location. Note that this might not be populated for all stack frames.
         */
        locals?: Schema$Variable[];
        /**
         * Source location of the call site.
         */
        location?: Schema$SourceLocation;
    }
    /**
     * Represents a contextual status message. The message can indicate an error or informational status, and refer to specific parts of the containing object. For example, the `Breakpoint.status` field can indicate an error referring to the `BREAKPOINT_SOURCE_LOCATION` with the message `Location not found`.
     */
    export interface Schema$StatusMessage {
        /**
         * Status message text.
         */
        description?: Schema$FormatMessage;
        /**
         * Distinguishes errors from informational messages.
         */
        isError?: boolean | null;
        /**
         * Reference to which the message applies.
         */
        refersTo?: string | null;
    }
    /**
     * Request to update an active breakpoint.
     */
    export interface Schema$UpdateActiveBreakpointRequest {
        /**
         * Required. Updated breakpoint information. The field `id` must be set. The agent must echo all Breakpoint specification fields in the update.
         */
        breakpoint?: Schema$Breakpoint;
    }
    /**
     * Response for updating an active breakpoint. The message is defined to allow future extensions.
     */
    export interface Schema$UpdateActiveBreakpointResponse {
    }
    /**
     * Represents a variable or an argument possibly of a compound object type. Note how the following variables are represented: 1) A simple variable: int x = 5 { name: "x", value: "5", type: "int" \} // Captured variable 2) A compound object: struct T { int m1; int m2; \}; T x = { 3, 7 \}; { // Captured variable name: "x", type: "T", members { name: "m1", value: "3", type: "int" \}, members { name: "m2", value: "7", type: "int" \} \} 3) A pointer where the pointee was captured: T x = { 3, 7 \}; T* p = &x; { // Captured variable name: "p", type: "T*", value: "0x00500500", members { name: "m1", value: "3", type: "int" \}, members { name: "m2", value: "7", type: "int" \} \} 4) A pointer where the pointee was not captured: T* p = new T; { // Captured variable name: "p", type: "T*", value: "0x00400400" status { is_error: true, description { format: "unavailable" \} \} \} The status should describe the reason for the missing value, such as ``, ``, ``. Note that a null pointer should not have members. 5) An unnamed value: int* p = new int(7); { // Captured variable name: "p", value: "0x00500500", type: "int*", members { value: "7", type: "int" \} \} 6) An unnamed pointer where the pointee was not captured: int* p = new int(7); int** pp = &p; { // Captured variable name: "pp", value: "0x00500500", type: "int**", members { value: "0x00400400", type: "int*" status { is_error: true, description: { format: "unavailable" \} \} \} \} \} To optimize computation, memory and network traffic, variables that repeat in the output multiple times can be stored once in a shared variable table and be referenced using the `var_table_index` field. The variables stored in the shared table are nameless and are essentially a partition of the complete variable. To reconstruct the complete variable, merge the referencing variable with the referenced variable. When using the shared variable table, the following variables: T x = { 3, 7 \}; T* p = &x; T& r = x; { name: "x", var_table_index: 3, type: "T" \} // Captured variables { name: "p", value "0x00500500", type="T*", var_table_index: 3 \} { name: "r", type="T&", var_table_index: 3 \} { // Shared variable table entry #3: members { name: "m1", value: "3", type: "int" \}, members { name: "m2", value: "7", type: "int" \} \} Note that the pointer address is stored with the referencing variable and not with the referenced variable. This allows the referenced variable to be shared between pointers and references. The type field is optional. The debugger agent may or may not support it.
     */
    export interface Schema$Variable {
        /**
         * Members contained or pointed to by the variable.
         */
        members?: Schema$Variable[];
        /**
         * Name of the variable, if any.
         */
        name?: string | null;
        /**
         * Status associated with the variable. This field will usually stay unset. A status of a single variable only applies to that variable or expression. The rest of breakpoint data still remains valid. Variables might be reported in error state even when breakpoint is not in final state. The message may refer to variable name with `refers_to` set to `VARIABLE_NAME`. Alternatively `refers_to` will be set to `VARIABLE_VALUE`. In either case variable value and members will be unset. Example of error message applied to name: `Invalid expression syntax`. Example of information message applied to value: `Not captured`. Examples of error message applied to value: * `Malformed string`, * `Field f not found in class C` * `Null pointer dereference`
         */
        status?: Schema$StatusMessage;
        /**
         * Variable type (e.g. `MyClass`). If the variable is split with `var_table_index`, `type` goes next to `value`. The interpretation of a type is agent specific. It is recommended to include the dynamic type rather than a static type of an object.
         */
        type?: string | null;
        /**
         * Simple value of the variable.
         */
        value?: string | null;
        /**
         * Reference to a variable in the shared variable table. More than one variable can reference the same variable in the table. The `var_table_index` field is an index into `variable_table` in Breakpoint.
         */
        varTableIndex?: number | null;
    }
    export class Resource$Controller {
        context: APIRequestContext;
        debuggees: Resource$Controller$Debuggees;
        constructor(context: APIRequestContext);
    }
    export class Resource$Controller$Debuggees {
        context: APIRequestContext;
        breakpoints: Resource$Controller$Debuggees$Breakpoints;
        constructor(context: APIRequestContext);
        /**
         * Registers the debuggee with the controller service. All agents attached to the same application must call this method with exactly the same request content to get back the same stable `debuggee_id`. Agents should call this method again whenever `google.rpc.Code.NOT_FOUND` is returned from any controller method. This protocol allows the controller service to disable debuggees, recover from data loss, or change the `debuggee_id` format. Agents must handle `debuggee_id` value changing upon re-registration.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.controller.debuggees.register({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "debuggee": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "agentId": "my_agentId",
         *   //   "debuggee": {}
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
        register(params: Params$Resource$Controller$Debuggees$Register, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        register(params?: Params$Resource$Controller$Debuggees$Register, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$RegisterDebuggeeResponse>>;
        register(params: Params$Resource$Controller$Debuggees$Register, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        register(params: Params$Resource$Controller$Debuggees$Register, options: MethodOptions | BodyResponseCallback<Schema$RegisterDebuggeeResponse>, callback: BodyResponseCallback<Schema$RegisterDebuggeeResponse>): void;
        register(params: Params$Resource$Controller$Debuggees$Register, callback: BodyResponseCallback<Schema$RegisterDebuggeeResponse>): void;
        register(callback: BodyResponseCallback<Schema$RegisterDebuggeeResponse>): void;
    }
    export interface Params$Resource$Controller$Debuggees$Register extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RegisterDebuggeeRequest;
    }
    export class Resource$Controller$Debuggees$Breakpoints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns the list of all active breakpoints for the debuggee. The breakpoint specification (`location`, `condition`, and `expressions` fields) is semantically immutable, although the field values may change. For example, an agent may update the location line number to reflect the actual line where the breakpoint was set, but this doesn't change the breakpoint semantics. This means that an agent does not need to check if a breakpoint has changed when it encounters the same breakpoint on a successive call. Moreover, an agent should remember the breakpoints that are completed until the controller removes them from the active list to avoid setting those breakpoints again.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.controller.debuggees.breakpoints.list({
         *     // Identifies the agent. This is the ID returned in the RegisterDebuggee response.
         *     agentId: 'placeholder-value',
         *     // Required. Identifies the debuggee.
         *     debuggeeId: 'placeholder-value',
         *     // If set to `true` (recommended), returns `google.rpc.Code.OK` status and sets the `wait_expired` response field to `true` when the server-selected timeout has expired. If set to `false` (deprecated), returns `google.rpc.Code.ABORTED` status when the server-selected timeout has expired.
         *     successOnTimeout: 'placeholder-value',
         *     // A token that, if specified, blocks the method call until the list of active breakpoints has changed, or a server-selected timeout has expired. The value should be set from the `next_wait_token` field in the last response. The initial value should be set to `"init"`.
         *     waitToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "breakpoints": [],
         *   //   "nextWaitToken": "my_nextWaitToken",
         *   //   "waitExpired": false
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
        list(params: Params$Resource$Controller$Debuggees$Breakpoints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Controller$Debuggees$Breakpoints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListActiveBreakpointsResponse>>;
        list(params: Params$Resource$Controller$Debuggees$Breakpoints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Controller$Debuggees$Breakpoints$List, options: MethodOptions | BodyResponseCallback<Schema$ListActiveBreakpointsResponse>, callback: BodyResponseCallback<Schema$ListActiveBreakpointsResponse>): void;
        list(params: Params$Resource$Controller$Debuggees$Breakpoints$List, callback: BodyResponseCallback<Schema$ListActiveBreakpointsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListActiveBreakpointsResponse>): void;
        /**
         * Updates the breakpoint state or mutable fields. The entire Breakpoint message must be sent back to the controller service. Updates to active breakpoint fields are only allowed if the new value does not change the breakpoint specification. Updates to the `location`, `condition` and `expressions` fields should not alter the breakpoint semantics. These may only make changes such as canonicalizing a value or snapping the location to the correct line of code.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.controller.debuggees.breakpoints.update({
         *     // Required. Identifies the debuggee being debugged.
         *     debuggeeId: 'placeholder-value',
         *     // Breakpoint identifier, unique in the scope of the debuggee.
         *     id: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "breakpoint": {}
         *       // }
         *     },
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
        update(params: Params$Resource$Controller$Debuggees$Breakpoints$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Controller$Debuggees$Breakpoints$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UpdateActiveBreakpointResponse>>;
        update(params: Params$Resource$Controller$Debuggees$Breakpoints$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Controller$Debuggees$Breakpoints$Update, options: MethodOptions | BodyResponseCallback<Schema$UpdateActiveBreakpointResponse>, callback: BodyResponseCallback<Schema$UpdateActiveBreakpointResponse>): void;
        update(params: Params$Resource$Controller$Debuggees$Breakpoints$Update, callback: BodyResponseCallback<Schema$UpdateActiveBreakpointResponse>): void;
        update(callback: BodyResponseCallback<Schema$UpdateActiveBreakpointResponse>): void;
    }
    export interface Params$Resource$Controller$Debuggees$Breakpoints$List extends StandardParameters {
        /**
         * Identifies the agent. This is the ID returned in the RegisterDebuggee response.
         */
        agentId?: string;
        /**
         * Required. Identifies the debuggee.
         */
        debuggeeId?: string;
        /**
         * If set to `true` (recommended), returns `google.rpc.Code.OK` status and sets the `wait_expired` response field to `true` when the server-selected timeout has expired. If set to `false` (deprecated), returns `google.rpc.Code.ABORTED` status when the server-selected timeout has expired.
         */
        successOnTimeout?: boolean;
        /**
         * A token that, if specified, blocks the method call until the list of active breakpoints has changed, or a server-selected timeout has expired. The value should be set from the `next_wait_token` field in the last response. The initial value should be set to `"init"`.
         */
        waitToken?: string;
    }
    export interface Params$Resource$Controller$Debuggees$Breakpoints$Update extends StandardParameters {
        /**
         * Required. Identifies the debuggee being debugged.
         */
        debuggeeId?: string;
        /**
         * Breakpoint identifier, unique in the scope of the debuggee.
         */
        id?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UpdateActiveBreakpointRequest;
    }
    export class Resource$Debugger {
        context: APIRequestContext;
        debuggees: Resource$Debugger$Debuggees;
        constructor(context: APIRequestContext);
    }
    export class Resource$Debugger$Debuggees {
        context: APIRequestContext;
        breakpoints: Resource$Debugger$Debuggees$Breakpoints;
        constructor(context: APIRequestContext);
        /**
         * Lists all the debuggees that the user has access to.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.debugger.debuggees.list({
         *     // Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         *     clientVersion: 'placeholder-value',
         *     // When set to `true`, the result includes all debuggees. Otherwise, the result includes only debuggees that are active.
         *     includeInactive: 'placeholder-value',
         *     // Required. Project number of a Google Cloud project whose debuggees to list.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "debuggees": []
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
        list(params: Params$Resource$Debugger$Debuggees$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Debugger$Debuggees$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDebuggeesResponse>>;
        list(params: Params$Resource$Debugger$Debuggees$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Debugger$Debuggees$List, options: MethodOptions | BodyResponseCallback<Schema$ListDebuggeesResponse>, callback: BodyResponseCallback<Schema$ListDebuggeesResponse>): void;
        list(params: Params$Resource$Debugger$Debuggees$List, callback: BodyResponseCallback<Schema$ListDebuggeesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDebuggeesResponse>): void;
    }
    export interface Params$Resource$Debugger$Debuggees$List extends StandardParameters {
        /**
         * Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         */
        clientVersion?: string;
        /**
         * When set to `true`, the result includes all debuggees. Otherwise, the result includes only debuggees that are active.
         */
        includeInactive?: boolean;
        /**
         * Required. Project number of a Google Cloud project whose debuggees to list.
         */
        project?: string;
    }
    export class Resource$Debugger$Debuggees$Breakpoints {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes the breakpoint from the debuggee.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.debugger.debuggees.breakpoints.delete({
         *     // Required. ID of the breakpoint to delete.
         *     breakpointId: 'placeholder-value',
         *     // Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         *     clientVersion: 'placeholder-value',
         *     // Required. ID of the debuggee whose breakpoint to delete.
         *     debuggeeId: 'placeholder-value',
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
        delete(params: Params$Resource$Debugger$Debuggees$Breakpoints$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Debugger$Debuggees$Breakpoints$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Debugger$Debuggees$Breakpoints$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Debugger$Debuggees$Breakpoints$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Debugger$Debuggees$Breakpoints$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets breakpoint information.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.debugger.debuggees.breakpoints.get({
         *     // Required. ID of the breakpoint to get.
         *     breakpointId: 'placeholder-value',
         *     // Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         *     clientVersion: 'placeholder-value',
         *     // Required. ID of the debuggee whose breakpoint to get.
         *     debuggeeId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "breakpoint": {}
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
        get(params: Params$Resource$Debugger$Debuggees$Breakpoints$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Debugger$Debuggees$Breakpoints$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetBreakpointResponse>>;
        get(params: Params$Resource$Debugger$Debuggees$Breakpoints$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Debugger$Debuggees$Breakpoints$Get, options: MethodOptions | BodyResponseCallback<Schema$GetBreakpointResponse>, callback: BodyResponseCallback<Schema$GetBreakpointResponse>): void;
        get(params: Params$Resource$Debugger$Debuggees$Breakpoints$Get, callback: BodyResponseCallback<Schema$GetBreakpointResponse>): void;
        get(callback: BodyResponseCallback<Schema$GetBreakpointResponse>): void;
        /**
         * Lists all breakpoints for the debuggee.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.debugger.debuggees.breakpoints.list({
         *     // Only breakpoints with the specified action will pass the filter.
         *     'action.value': 'placeholder-value',
         *     // Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         *     clientVersion: 'placeholder-value',
         *     // Required. ID of the debuggee whose breakpoints to list.
         *     debuggeeId: 'placeholder-value',
         *     // When set to `true`, the response includes the list of breakpoints set by any user. Otherwise, it includes only breakpoints set by the caller.
         *     includeAllUsers: 'placeholder-value',
         *     // When set to `true`, the response includes active and inactive breakpoints. Otherwise, it includes only active breakpoints.
         *     includeInactive: 'placeholder-value',
         *     // This field is deprecated. The following fields are always stripped out of the result: `stack_frames`, `evaluated_expressions` and `variable_table`.
         *     stripResults: 'placeholder-value',
         *     // A wait token that, if specified, blocks the call until the breakpoints list has changed, or a server selected timeout has expired. The value should be set from the last response. The error code `google.rpc.Code.ABORTED` (RPC) is returned on wait timeout, which should be called again with the same `wait_token`.
         *     waitToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "breakpoints": [],
         *   //   "nextWaitToken": "my_nextWaitToken"
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
        list(params: Params$Resource$Debugger$Debuggees$Breakpoints$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Debugger$Debuggees$Breakpoints$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListBreakpointsResponse>>;
        list(params: Params$Resource$Debugger$Debuggees$Breakpoints$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Debugger$Debuggees$Breakpoints$List, options: MethodOptions | BodyResponseCallback<Schema$ListBreakpointsResponse>, callback: BodyResponseCallback<Schema$ListBreakpointsResponse>): void;
        list(params: Params$Resource$Debugger$Debuggees$Breakpoints$List, callback: BodyResponseCallback<Schema$ListBreakpointsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListBreakpointsResponse>): void;
        /**
         * Sets the breakpoint to the debuggee.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/clouddebugger.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const clouddebugger = google.clouddebugger('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud_debugger',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await clouddebugger.debugger.debuggees.breakpoints.set({
         *     // The canary option set by the user upon setting breakpoint.
         *     canaryOption: 'placeholder-value',
         *     // Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         *     clientVersion: 'placeholder-value',
         *     // Required. ID of the debuggee where the breakpoint is to be set.
         *     debuggeeId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "action": "my_action",
         *       //   "canaryExpireTime": "my_canaryExpireTime",
         *       //   "condition": "my_condition",
         *       //   "createTime": "my_createTime",
         *       //   "evaluatedExpressions": [],
         *       //   "expressions": [],
         *       //   "finalTime": "my_finalTime",
         *       //   "id": "my_id",
         *       //   "isFinalState": false,
         *       //   "labels": {},
         *       //   "location": {},
         *       //   "logLevel": "my_logLevel",
         *       //   "logMessageFormat": "my_logMessageFormat",
         *       //   "stackFrames": [],
         *       //   "state": "my_state",
         *       //   "status": {},
         *       //   "userEmail": "my_userEmail",
         *       //   "variableTable": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "breakpoint": {}
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
        set(params: Params$Resource$Debugger$Debuggees$Breakpoints$Set, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        set(params?: Params$Resource$Debugger$Debuggees$Breakpoints$Set, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SetBreakpointResponse>>;
        set(params: Params$Resource$Debugger$Debuggees$Breakpoints$Set, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        set(params: Params$Resource$Debugger$Debuggees$Breakpoints$Set, options: MethodOptions | BodyResponseCallback<Schema$SetBreakpointResponse>, callback: BodyResponseCallback<Schema$SetBreakpointResponse>): void;
        set(params: Params$Resource$Debugger$Debuggees$Breakpoints$Set, callback: BodyResponseCallback<Schema$SetBreakpointResponse>): void;
        set(callback: BodyResponseCallback<Schema$SetBreakpointResponse>): void;
    }
    export interface Params$Resource$Debugger$Debuggees$Breakpoints$Delete extends StandardParameters {
        /**
         * Required. ID of the breakpoint to delete.
         */
        breakpointId?: string;
        /**
         * Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         */
        clientVersion?: string;
        /**
         * Required. ID of the debuggee whose breakpoint to delete.
         */
        debuggeeId?: string;
    }
    export interface Params$Resource$Debugger$Debuggees$Breakpoints$Get extends StandardParameters {
        /**
         * Required. ID of the breakpoint to get.
         */
        breakpointId?: string;
        /**
         * Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         */
        clientVersion?: string;
        /**
         * Required. ID of the debuggee whose breakpoint to get.
         */
        debuggeeId?: string;
    }
    export interface Params$Resource$Debugger$Debuggees$Breakpoints$List extends StandardParameters {
        /**
         * Only breakpoints with the specified action will pass the filter.
         */
        'action.value'?: string;
        /**
         * Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         */
        clientVersion?: string;
        /**
         * Required. ID of the debuggee whose breakpoints to list.
         */
        debuggeeId?: string;
        /**
         * When set to `true`, the response includes the list of breakpoints set by any user. Otherwise, it includes only breakpoints set by the caller.
         */
        includeAllUsers?: boolean;
        /**
         * When set to `true`, the response includes active and inactive breakpoints. Otherwise, it includes only active breakpoints.
         */
        includeInactive?: boolean;
        /**
         * This field is deprecated. The following fields are always stripped out of the result: `stack_frames`, `evaluated_expressions` and `variable_table`.
         */
        stripResults?: boolean;
        /**
         * A wait token that, if specified, blocks the call until the breakpoints list has changed, or a server selected timeout has expired. The value should be set from the last response. The error code `google.rpc.Code.ABORTED` (RPC) is returned on wait timeout, which should be called again with the same `wait_token`.
         */
        waitToken?: string;
    }
    export interface Params$Resource$Debugger$Debuggees$Breakpoints$Set extends StandardParameters {
        /**
         * The canary option set by the user upon setting breakpoint.
         */
        canaryOption?: string;
        /**
         * Required. The client version making the call. Schema: `domain/type/version` (e.g., `google.com/intellij/v1`).
         */
        clientVersion?: string;
        /**
         * Required. ID of the debuggee where the breakpoint is to be set.
         */
        debuggeeId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Breakpoint;
    }
    export {};
}
