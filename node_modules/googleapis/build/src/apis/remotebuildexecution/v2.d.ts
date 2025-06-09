import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace remotebuildexecution_v2 {
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
     * Remote Build Execution API
     *
     * Supplies a Remote Execution API service for tools such as bazel.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const remotebuildexecution = google.remotebuildexecution('v2');
     * ```
     */
    export class Remotebuildexecution {
        context: APIRequestContext;
        actionResults: Resource$Actionresults;
        actions: Resource$Actions;
        blobs: Resource$Blobs;
        operations: Resource$Operations;
        v2: Resource$V2;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An `Action` captures all the information about an execution which is required to reproduce it. `Action`s are the core component of the [Execution] service. A single `Action` represents a repeatable action that can be performed by the execution service. `Action`s can be succinctly identified by the digest of their wire format encoding and, once an `Action` has been executed, will be cached in the action cache. Future requests can then use the cached result rather than needing to run afresh. When a server completes execution of an Action, it MAY choose to cache the result in the ActionCache unless `do_not_cache` is `true`. Clients SHOULD expect the server to do so. By default, future calls to Execute the same `Action` will also serve their results from the cache. Clients must take care to understand the caching behaviour. Ideally, all `Action`s will be reproducible so that serving a result from cache is always desirable and correct.
     */
    export interface Schema$BuildBazelRemoteExecutionV2Action {
        /**
         * The digest of the Command to run, which MUST be present in the ContentAddressableStorage.
         */
        commandDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * If true, then the `Action`'s result cannot be cached, and in-flight requests for the same `Action` may not be merged.
         */
        doNotCache?: boolean | null;
        /**
         * The digest of the root Directory for the input files. The files in the directory tree are available in the correct location on the build machine before the command is executed. The root directory, as well as every subdirectory and content blob referred to, MUST be in the ContentAddressableStorage.
         */
        inputRootDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The optional platform requirements for the execution environment. The server MAY choose to execute the action on any worker satisfying the requirements, so the client SHOULD ensure that running the action on any such worker will have the same result. A detailed lexicon for this can be found in the accompanying platform.md. New in version 2.2: clients SHOULD set these platform properties as well as those in the Command. Servers SHOULD prefer those set here.
         */
        platform?: Schema$BuildBazelRemoteExecutionV2Platform;
        /**
         * An optional additional salt value used to place this `Action` into a separate cache namespace from other instances having the same field contents. This salt typically comes from operational configuration specific to sources such as repo and service configuration, and allows disowning an entire set of ActionResults that might have been poisoned by buggy software or tool failures.
         */
        salt?: string | null;
        /**
         * A timeout after which the execution should be killed. If the timeout is absent, then the client is specifying that the execution should continue as long as the server will let it. The server SHOULD impose a timeout if the client does not specify one, however, if the client does specify a timeout that is longer than the server's maximum timeout, the server MUST reject the request. The timeout is a part of the Action message, and therefore two `Actions` with different timeouts are different, even if they are otherwise identical. This is because, if they were not, running an `Action` with a lower timeout than is required might result in a cache hit from an execution run with a longer timeout, hiding the fact that the timeout is too short. By encoding it directly in the `Action`, a lower timeout will result in a cache miss and the execution timeout will fail immediately, rather than whenever the cache entry gets evicted.
         */
        timeout?: string | null;
    }
    /**
     * Describes the server/instance capabilities for updating the action cache.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ActionCacheUpdateCapabilities {
        updateEnabled?: boolean | null;
    }
    /**
     * An ActionResult represents the result of an Action being run. It is advised that at least one field (for example `ActionResult.execution_metadata.Worker`) have a non-default value, to ensure that the serialized value is non-empty, which can then be used as a basic data sanity check.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ActionResult {
        /**
         * The details of the execution that originally produced this result.
         */
        executionMetadata?: Schema$BuildBazelRemoteExecutionV2ExecutedActionMetadata;
        /**
         * The exit code of the command.
         */
        exitCode?: number | null;
        /**
         * The output directories of the action. For each output directory requested in the `output_directories` or `output_paths` field of the Action, if the corresponding directory existed after the action completed, a single entry will be present in the output list, which will contain the digest of a Tree message containing the directory tree, and the path equal exactly to the corresponding Action output_directories member. As an example, suppose the Action had an output directory `a/b/dir` and the execution produced the following contents in `a/b/dir`: a file named `bar` and a directory named `foo` with an executable file named `baz`. Then, output_directory will contain (hashes shortened for readability): ```json // OutputDirectory proto: { path: "a/b/dir" tree_digest: { hash: "4a73bc9d03...", size: 55 \} \} // Tree proto with hash "4a73bc9d03..." and size 55: { root: { files: [ { name: "bar", digest: { hash: "4a73bc9d03...", size: 65534 \} \} ], directories: [ { name: "foo", digest: { hash: "4cf2eda940...", size: 43 \} \} ] \} children : { // (Directory proto with hash "4cf2eda940..." and size 43) files: [ { name: "baz", digest: { hash: "b2c941073e...", size: 1294, \}, is_executable: true \} ] \} \} ``` If an output of the same name as listed in `output_files` of the Command was found in `output_directories`, but was not a directory, the server will return a FAILED_PRECONDITION.
         */
        outputDirectories?: Schema$BuildBazelRemoteExecutionV2OutputDirectory[];
        /**
         * The output directories of the action that are symbolic links to other directories. Those may be links to other output directories, or input directories, or even absolute paths outside of the working directory, if the server supports SymlinkAbsolutePathStrategy.ALLOWED. For each output directory requested in the `output_directories` field of the Action, if the directory existed after the action completed, a single entry will be present either in this field, or in the `output_directories` field, if the directory was not a symbolic link. If an output of the same name was found, but was a symbolic link to a file instead of a directory, the server will return a FAILED_PRECONDITION. If the action does not produce the requested output, then that output will be omitted from the list. The server is free to arrange the output list as desired; clients MUST NOT assume that the output list is sorted. DEPRECATED as of v2.1. Servers that wish to be compatible with v2.0 API should still populate this field in addition to `output_symlinks`.
         */
        outputDirectorySymlinks?: Schema$BuildBazelRemoteExecutionV2OutputSymlink[];
        /**
         * The output files of the action. For each output file requested in the `output_files` or `output_paths` field of the Action, if the corresponding file existed after the action completed, a single entry will be present either in this field, or the `output_file_symlinks` field if the file was a symbolic link to another file (`output_symlinks` field after v2.1). If an output listed in `output_files` was found, but was a directory rather than a regular file, the server will return a FAILED_PRECONDITION. If the action does not produce the requested output, then that output will be omitted from the list. The server is free to arrange the output list as desired; clients MUST NOT assume that the output list is sorted.
         */
        outputFiles?: Schema$BuildBazelRemoteExecutionV2OutputFile[];
        /**
         * The output files of the action that are symbolic links to other files. Those may be links to other output files, or input files, or even absolute paths outside of the working directory, if the server supports SymlinkAbsolutePathStrategy.ALLOWED. For each output file requested in the `output_files` or `output_paths` field of the Action, if the corresponding file existed after the action completed, a single entry will be present either in this field, or in the `output_files` field, if the file was not a symbolic link. If an output symbolic link of the same name as listed in `output_files` of the Command was found, but its target type was not a regular file, the server will return a FAILED_PRECONDITION. If the action does not produce the requested output, then that output will be omitted from the list. The server is free to arrange the output list as desired; clients MUST NOT assume that the output list is sorted. DEPRECATED as of v2.1. Servers that wish to be compatible with v2.0 API should still populate this field in addition to `output_symlinks`.
         */
        outputFileSymlinks?: Schema$BuildBazelRemoteExecutionV2OutputSymlink[];
        /**
         * New in v2.1: this field will only be populated if the command `output_paths` field was used, and not the pre v2.1 `output_files` or `output_directories` fields. The output paths of the action that are symbolic links to other paths. Those may be links to other outputs, or inputs, or even absolute paths outside of the working directory, if the server supports SymlinkAbsolutePathStrategy.ALLOWED. A single entry for each output requested in `output_paths` field of the Action, if the corresponding path existed after the action completed and was a symbolic link. If the action does not produce a requested output, then that output will be omitted from the list. The server is free to arrange the output list as desired; clients MUST NOT assume that the output list is sorted.
         */
        outputSymlinks?: Schema$BuildBazelRemoteExecutionV2OutputSymlink[];
        /**
         * The digest for a blob containing the standard error of the action, which can be retrieved from the ContentAddressableStorage.
         */
        stderrDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The standard error buffer of the action. The server SHOULD NOT inline stderr unless requested by the client in the GetActionResultRequest message. The server MAY omit inlining, even if requested, and MUST do so if inlining would cause the response to exceed message size limits.
         */
        stderrRaw?: string | null;
        /**
         * The digest for a blob containing the standard output of the action, which can be retrieved from the ContentAddressableStorage.
         */
        stdoutDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The standard output buffer of the action. The server SHOULD NOT inline stdout unless requested by the client in the GetActionResultRequest message. The server MAY omit inlining, even if requested, and MUST do so if inlining would cause the response to exceed message size limits.
         */
        stdoutRaw?: string | null;
    }
    /**
     * A request message for ContentAddressableStorage.BatchReadBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchReadBlobsRequest {
        /**
         * The individual blob digests.
         */
        digests?: Schema$BuildBazelRemoteExecutionV2Digest[];
    }
    /**
     * A response message for ContentAddressableStorage.BatchReadBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse {
        /**
         * The responses to the requests.
         */
        responses?: Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponseResponse[];
    }
    /**
     * A response corresponding to a single blob that the client tried to download.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponseResponse {
        /**
         * The raw binary data.
         */
        data?: string | null;
        /**
         * The digest to which this response corresponds.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The result of attempting to download that blob.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * A request message for ContentAddressableStorage.BatchUpdateBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsRequest {
        /**
         * The individual upload requests.
         */
        requests?: Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsRequestRequest[];
    }
    /**
     * A request corresponding to a single blob that the client wants to upload.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsRequestRequest {
        /**
         * The raw binary data.
         */
        data?: string | null;
        /**
         * The digest of the blob. This MUST be the digest of `data`.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
    }
    /**
     * A response message for ContentAddressableStorage.BatchUpdateBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse {
        /**
         * The responses to the requests.
         */
        responses?: Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponseResponse[];
    }
    /**
     * A response corresponding to a single blob that the client tried to upload.
     */
    export interface Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponseResponse {
        /**
         * The blob digest to which this response corresponds.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The result of attempting to upload that blob.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Capabilities of the remote cache system.
     */
    export interface Schema$BuildBazelRemoteExecutionV2CacheCapabilities {
        /**
         * Capabilities for updating the action cache.
         */
        actionCacheUpdateCapabilities?: Schema$BuildBazelRemoteExecutionV2ActionCacheUpdateCapabilities;
        /**
         * Supported cache priority range for both CAS and ActionCache.
         */
        cachePriorityCapabilities?: Schema$BuildBazelRemoteExecutionV2PriorityCapabilities;
        /**
         * All the digest functions supported by the remote cache. Remote cache may support multiple digest functions simultaneously.
         */
        digestFunction?: string[] | null;
        /**
         * Maximum total size of blobs to be uploaded/downloaded using batch methods. A value of 0 means no limit is set, although in practice there will always be a message size limitation of the protocol in use, e.g. GRPC.
         */
        maxBatchTotalSizeBytes?: string | null;
        /**
         * Compressors supported by the "compressed-blobs" bytestream resources. Servers MUST support identity/no-compression, even if it is not listed here. Note that this does not imply which if any compressors are supported by the server at the gRPC level.
         */
        supportedCompressor?: string[] | null;
        /**
         * Whether absolute symlink targets are supported.
         */
        symlinkAbsolutePathStrategy?: string | null;
    }
    /**
     * A `Command` is the actual command executed by a worker running an Action and specifications of its environment. Except as otherwise required, the environment (such as which system libraries or binaries are available, and what filesystems are mounted where) is defined by and specific to the implementation of the remote execution API.
     */
    export interface Schema$BuildBazelRemoteExecutionV2Command {
        /**
         * The arguments to the command. The first argument must be the path to the executable, which must be either a relative path, in which case it is evaluated with respect to the input root, or an absolute path.
         */
        arguments?: string[] | null;
        /**
         * The environment variables to set when running the program. The worker may provide its own default environment variables; these defaults can be overridden using this field. Additional variables can also be specified. In order to ensure that equivalent Commands always hash to the same value, the environment variables MUST be lexicographically sorted by name. Sorting of strings is done by code point, equivalently, by the UTF-8 bytes.
         */
        environmentVariables?: Schema$BuildBazelRemoteExecutionV2CommandEnvironmentVariable[];
        /**
         * A list of the output directories that the client expects to retrieve from the action. Only the listed directories will be returned (an entire directory structure will be returned as a Tree message digest, see OutputDirectory), as well as files listed in `output_files`. Other files or directories that may be created during command execution are discarded. The paths are relative to the working directory of the action execution. The paths are specified using a single forward slash (`/`) as a path separator, even if the execution platform natively uses a different separator. The path MUST NOT include a trailing slash, nor a leading slash, being a relative path. The special value of empty string is allowed, although not recommended, and can be used to capture the entire working directory tree, including inputs. In order to ensure consistent hashing of the same Action, the output paths MUST be sorted lexicographically by code point (or, equivalently, by UTF-8 bytes). An output directory cannot be duplicated or have the same path as any of the listed output files. An output directory is allowed to be a parent of another output directory. Directories leading up to the output directories (but not the output directories themselves) are created by the worker prior to execution, even if they are not explicitly part of the input root. DEPRECATED since 2.1: Use `output_paths` instead.
         */
        outputDirectories?: string[] | null;
        /**
         * A list of the output files that the client expects to retrieve from the action. Only the listed files, as well as directories listed in `output_directories`, will be returned to the client as output. Other files or directories that may be created during command execution are discarded. The paths are relative to the working directory of the action execution. The paths are specified using a single forward slash (`/`) as a path separator, even if the execution platform natively uses a different separator. The path MUST NOT include a trailing slash, nor a leading slash, being a relative path. In order to ensure consistent hashing of the same Action, the output paths MUST be sorted lexicographically by code point (or, equivalently, by UTF-8 bytes). An output file cannot be duplicated, be a parent of another output file, or have the same path as any of the listed output directories. Directories leading up to the output files are created by the worker prior to execution, even if they are not explicitly part of the input root. DEPRECATED since v2.1: Use `output_paths` instead.
         */
        outputFiles?: string[] | null;
        /**
         * A list of keys for node properties the client expects to retrieve for output files and directories. Keys are either names of string-based NodeProperty or names of fields in NodeProperties. In order to ensure that equivalent `Action`s always hash to the same value, the node properties MUST be lexicographically sorted by name. Sorting of strings is done by code point, equivalently, by the UTF-8 bytes. The interpretation of string-based properties is server-dependent. If a property is not recognized by the server, the server will return an `INVALID_ARGUMENT`.
         */
        outputNodeProperties?: string[] | null;
        /**
         * A list of the output paths that the client expects to retrieve from the action. Only the listed paths will be returned to the client as output. The type of the output (file or directory) is not specified, and will be determined by the server after action execution. If the resulting path is a file, it will be returned in an OutputFile) typed field. If the path is a directory, the entire directory structure will be returned as a Tree message digest, see OutputDirectory) Other files or directories that may be created during command execution are discarded. The paths are relative to the working directory of the action execution. The paths are specified using a single forward slash (`/`) as a path separator, even if the execution platform natively uses a different separator. The path MUST NOT include a trailing slash, nor a leading slash, being a relative path. In order to ensure consistent hashing of the same Action, the output paths MUST be deduplicated and sorted lexicographically by code point (or, equivalently, by UTF-8 bytes). Directories leading up to the output paths are created by the worker prior to execution, even if they are not explicitly part of the input root. New in v2.1: this field supersedes the DEPRECATED `output_files` and `output_directories` fields. If `output_paths` is used, `output_files` and `output_directories` will be ignored!
         */
        outputPaths?: string[] | null;
        /**
         * The platform requirements for the execution environment. The server MAY choose to execute the action on any worker satisfying the requirements, so the client SHOULD ensure that running the action on any such worker will have the same result. A detailed lexicon for this can be found in the accompanying platform.md. DEPRECATED as of v2.2: platform properties are now specified directly in the action. See documentation note in the Action for migration.
         */
        platform?: Schema$BuildBazelRemoteExecutionV2Platform;
        /**
         * The working directory, relative to the input root, for the command to run in. It must be a directory which exists in the input tree. If it is left empty, then the action is run in the input root.
         */
        workingDirectory?: string | null;
    }
    /**
     * An `EnvironmentVariable` is one variable to set in the running program's environment.
     */
    export interface Schema$BuildBazelRemoteExecutionV2CommandEnvironmentVariable {
        /**
         * The variable name.
         */
        name?: string | null;
        /**
         * The variable value.
         */
        value?: string | null;
    }
    /**
     * A content digest. A digest for a given blob consists of the size of the blob and its hash. The hash algorithm to use is defined by the server. The size is considered to be an integral part of the digest and cannot be separated. That is, even if the `hash` field is correctly specified but `size_bytes` is not, the server MUST reject the request. The reason for including the size in the digest is as follows: in a great many cases, the server needs to know the size of the blob it is about to work with prior to starting an operation with it, such as flattening Merkle tree structures or streaming it to a worker. Technically, the server could implement a separate metadata store, but this results in a significantly more complicated implementation as opposed to having the client specify the size up-front (or storing the size along with the digest in every message where digests are embedded). This does mean that the API leaks some implementation details of (what we consider to be) a reasonable server implementation, but we consider this to be a worthwhile tradeoff. When a `Digest` is used to refer to a proto message, it always refers to the message in binary encoded form. To ensure consistent hashing, clients and servers MUST ensure that they serialize messages according to the following rules, even if there are alternate valid encodings for the same message: * Fields are serialized in tag order. * There are no unknown fields. * There are no duplicate fields. * Fields are serialized according to the default semantics for their type. Most protocol buffer implementations will always follow these rules when serializing, but care should be taken to avoid shortcuts. For instance, concatenating two messages to merge them may produce duplicate fields.
     */
    export interface Schema$BuildBazelRemoteExecutionV2Digest {
        /**
         * The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         */
        hash?: string | null;
        /**
         * The size of the blob, in bytes.
         */
        sizeBytes?: string | null;
    }
    /**
     * A `Directory` represents a directory node in a file tree, containing zero or more children FileNodes, DirectoryNodes and SymlinkNodes. Each `Node` contains its name in the directory, either the digest of its content (either a file blob or a `Directory` proto) or a symlink target, as well as possibly some metadata about the file or directory. In order to ensure that two equivalent directory trees hash to the same value, the following restrictions MUST be obeyed when constructing a a `Directory`: * Every child in the directory must have a path of exactly one segment. Multiple levels of directory hierarchy may not be collapsed. * Each child in the directory must have a unique path segment (file name). Note that while the API itself is case-sensitive, the environment where the Action is executed may or may not be case-sensitive. That is, it is legal to call the API with a Directory that has both "Foo" and "foo" as children, but the Action may be rejected by the remote system upon execution. * The files, directories and symlinks in the directory must each be sorted in lexicographical order by path. The path strings must be sorted by code point, equivalently, by UTF-8 bytes. * The NodeProperties of files, directories, and symlinks must be sorted in lexicographical order by property name. A `Directory` that obeys the restrictions is said to be in canonical form. As an example, the following could be used for a file named `bar` and a directory named `foo` with an executable file named `baz` (hashes shortened for readability): ```json // (Directory proto) { files: [ { name: "bar", digest: { hash: "4a73bc9d03...", size: 65534 \}, node_properties: [ { "name": "MTime", "value": "2017-01-15T01:30:15.01Z" \} ] \} ], directories: [ { name: "foo", digest: { hash: "4cf2eda940...", size: 43 \} \} ] \} // (Directory proto with hash "4cf2eda940..." and size 43) { files: [ { name: "baz", digest: { hash: "b2c941073e...", size: 1294, \}, is_executable: true \} ] \} ```
     */
    export interface Schema$BuildBazelRemoteExecutionV2Directory {
        /**
         * The subdirectories in the directory.
         */
        directories?: Schema$BuildBazelRemoteExecutionV2DirectoryNode[];
        /**
         * The files in the directory.
         */
        files?: Schema$BuildBazelRemoteExecutionV2FileNode[];
        nodeProperties?: Schema$BuildBazelRemoteExecutionV2NodeProperties;
        /**
         * The symlinks in the directory.
         */
        symlinks?: Schema$BuildBazelRemoteExecutionV2SymlinkNode[];
    }
    /**
     * A `DirectoryNode` represents a child of a Directory which is itself a `Directory` and its associated metadata.
     */
    export interface Schema$BuildBazelRemoteExecutionV2DirectoryNode {
        /**
         * The digest of the Directory object represented. See Digest for information about how to take the digest of a proto message.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The name of the directory.
         */
        name?: string | null;
    }
    /**
     * ExecutedActionMetadata contains details about a completed execution.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecutedActionMetadata {
        /**
         * Details that are specific to the kind of worker used. For example, on POSIX-like systems this could contain a message with getrusage(2) statistics.
         */
        auxiliaryMetadata?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * When the worker completed executing the action command.
         */
        executionCompletedTimestamp?: string | null;
        /**
         * When the worker started executing the action command.
         */
        executionStartTimestamp?: string | null;
        /**
         * When the worker finished fetching action inputs.
         */
        inputFetchCompletedTimestamp?: string | null;
        /**
         * When the worker started fetching action inputs.
         */
        inputFetchStartTimestamp?: string | null;
        /**
         * When the worker finished uploading action outputs.
         */
        outputUploadCompletedTimestamp?: string | null;
        /**
         * When the worker started uploading action outputs.
         */
        outputUploadStartTimestamp?: string | null;
        /**
         * When was the action added to the queue.
         */
        queuedTimestamp?: string | null;
        /**
         * The name of the worker which ran the execution.
         */
        worker?: string | null;
        /**
         * When the worker completed the action, including all stages.
         */
        workerCompletedTimestamp?: string | null;
        /**
         * When the worker received the action.
         */
        workerStartTimestamp?: string | null;
    }
    /**
     * Metadata about an ongoing execution, which will be contained in the metadata field of the Operation.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecuteOperationMetadata {
        /**
         * The digest of the Action being executed.
         */
        actionDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * The current stage of execution.
         */
        stage?: string | null;
        /**
         * If set, the client can use this resource name with ByteStream.Read to stream the standard error from the endpoint hosting streamed responses.
         */
        stderrStreamName?: string | null;
        /**
         * If set, the client can use this resource name with ByteStream.Read to stream the standard output from the endpoint hosting streamed responses.
         */
        stdoutStreamName?: string | null;
    }
    /**
     * A request message for Execution.Execute.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecuteRequest {
        /**
         * The digest of the Action to execute.
         */
        actionDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * An optional policy for execution of the action. The server will have a default policy if this is not provided.
         */
        executionPolicy?: Schema$BuildBazelRemoteExecutionV2ExecutionPolicy;
        /**
         * An optional policy for the results of this execution in the remote cache. The server will have a default policy if this is not provided. This may be applied to both the ActionResult and the associated blobs.
         */
        resultsCachePolicy?: Schema$BuildBazelRemoteExecutionV2ResultsCachePolicy;
        /**
         * If true, the action will be executed even if its result is already present in the ActionCache. The execution is still allowed to be merged with other in-flight executions of the same action, however - semantically, the service MUST only guarantee that the results of an execution with this field set were not visible before the corresponding execution request was sent. Note that actions from execution requests setting this field set are still eligible to be entered into the action cache upon completion, and services SHOULD overwrite any existing entries that may exist. This allows skip_cache_lookup requests to be used as a mechanism for replacing action cache entries that reference outputs no longer available or that are poisoned in any way. If false, the result may be served from the action cache.
         */
        skipCacheLookup?: boolean | null;
    }
    /**
     * The response message for Execution.Execute, which will be contained in the response field of the Operation.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecuteResponse {
        /**
         * True if the result was served from cache, false if it was executed.
         */
        cachedResult?: boolean | null;
        /**
         * Freeform informational message with details on the execution of the action that may be displayed to the user upon failure or when requested explicitly.
         */
        message?: string | null;
        /**
         * The result of the action.
         */
        result?: Schema$BuildBazelRemoteExecutionV2ActionResult;
        /**
         * An optional list of additional log outputs the server wishes to provide. A server can use this to return execution-specific logs however it wishes. This is intended primarily to make it easier for users to debug issues that may be outside of the actual job execution, such as by identifying the worker executing the action or by providing logs from the worker's setup phase. The keys SHOULD be human readable so that a client can display them to a user.
         */
        serverLogs?: {
            [key: string]: Schema$BuildBazelRemoteExecutionV2LogFile;
        } | null;
        /**
         * If the status has a code other than `OK`, it indicates that the action did not finish execution. For example, if the operation times out during execution, the status will have a `DEADLINE_EXCEEDED` code. Servers MUST use this field for errors in execution, rather than the error field on the `Operation` object. If the status code is other than `OK`, then the result MUST NOT be cached. For an error status, the `result` field is optional; the server may populate the output-, stdout-, and stderr-related fields if it has any information available, such as the stdout and stderr of a timed-out action.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Capabilities of the remote execution system.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecutionCapabilities {
        /**
         * Remote execution may only support a single digest function.
         */
        digestFunction?: string | null;
        /**
         * Whether remote execution is enabled for the particular server/instance.
         */
        execEnabled?: boolean | null;
        /**
         * Supported execution priority range.
         */
        executionPriorityCapabilities?: Schema$BuildBazelRemoteExecutionV2PriorityCapabilities;
        /**
         * Supported node properties.
         */
        supportedNodeProperties?: string[] | null;
    }
    /**
     * An `ExecutionPolicy` can be used to control the scheduling of the action.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ExecutionPolicy {
        /**
         * The priority (relative importance) of this action. Generally, a lower value means that the action should be run sooner than actions having a greater priority value, but the interpretation of a given value is server- dependent. A priority of 0 means the *default* priority. Priorities may be positive or negative, and such actions should run later or sooner than actions having the default priority, respectively. The particular semantics of this field is up to the server. In particular, every server will have their own supported range of priorities, and will decide how these map into scheduling policy.
         */
        priority?: number | null;
    }
    /**
     * A `FileNode` represents a single file and associated metadata.
     */
    export interface Schema$BuildBazelRemoteExecutionV2FileNode {
        /**
         * The digest of the file's content.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * True if file is executable, false otherwise.
         */
        isExecutable?: boolean | null;
        /**
         * The name of the file.
         */
        name?: string | null;
        nodeProperties?: Schema$BuildBazelRemoteExecutionV2NodeProperties;
    }
    /**
     * A request message for ContentAddressableStorage.FindMissingBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2FindMissingBlobsRequest {
        /**
         * A list of the blobs to check.
         */
        blobDigests?: Schema$BuildBazelRemoteExecutionV2Digest[];
    }
    /**
     * A response message for ContentAddressableStorage.FindMissingBlobs.
     */
    export interface Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse {
        /**
         * A list of the blobs requested *not* present in the storage.
         */
        missingBlobDigests?: Schema$BuildBazelRemoteExecutionV2Digest[];
    }
    /**
     * A response message for ContentAddressableStorage.GetTree.
     */
    export interface Schema$BuildBazelRemoteExecutionV2GetTreeResponse {
        /**
         * The directories descended from the requested root.
         */
        directories?: Schema$BuildBazelRemoteExecutionV2Directory[];
        /**
         * If present, signifies that there are more results which the client can retrieve by passing this as the page_token in a subsequent request. If empty, signifies that this is the last page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * A `LogFile` is a log stored in the CAS.
     */
    export interface Schema$BuildBazelRemoteExecutionV2LogFile {
        /**
         * The digest of the log contents.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * This is a hint as to the purpose of the log, and is set to true if the log is human-readable text that can be usefully displayed to a user, and false otherwise. For instance, if a command-line client wishes to print the server logs to the terminal for a failed action, this allows it to avoid displaying a binary file.
         */
        humanReadable?: boolean | null;
    }
    /**
     * Node properties for FileNodes, DirectoryNodes, and SymlinkNodes. The server is responsible for specifying the properties that it accepts.
     */
    export interface Schema$BuildBazelRemoteExecutionV2NodeProperties {
        /**
         * The file's last modification timestamp.
         */
        mtime?: string | null;
        /**
         * A list of string-based NodeProperties.
         */
        properties?: Schema$BuildBazelRemoteExecutionV2NodeProperty[];
        /**
         * The UNIX file mode, e.g., 0755.
         */
        unixMode?: number | null;
    }
    /**
     * A single property for FileNodes, DirectoryNodes, and SymlinkNodes. The server is responsible for specifying the property `name`s that it accepts. If permitted by the server, the same `name` may occur multiple times.
     */
    export interface Schema$BuildBazelRemoteExecutionV2NodeProperty {
        /**
         * The property name.
         */
        name?: string | null;
        /**
         * The property value.
         */
        value?: string | null;
    }
    /**
     * An `OutputDirectory` is the output in an `ActionResult` corresponding to a directory's full contents rather than a single file.
     */
    export interface Schema$BuildBazelRemoteExecutionV2OutputDirectory {
        /**
         * The full path of the directory relative to the working directory. The path separator is a forward slash `/`. Since this is a relative path, it MUST NOT begin with a leading forward slash. The empty string value is allowed, and it denotes the entire working directory.
         */
        path?: string | null;
        /**
         * The digest of the encoded Tree proto containing the directory's contents.
         */
        treeDigest?: Schema$BuildBazelRemoteExecutionV2Digest;
    }
    /**
     * An `OutputFile` is similar to a FileNode, but it is used as an output in an `ActionResult`. It allows a full file path rather than only a name.
     */
    export interface Schema$BuildBazelRemoteExecutionV2OutputFile {
        /**
         * The contents of the file if inlining was requested. The server SHOULD NOT inline file contents unless requested by the client in the GetActionResultRequest message. The server MAY omit inlining, even if requested, and MUST do so if inlining would cause the response to exceed message size limits.
         */
        contents?: string | null;
        /**
         * The digest of the file's content.
         */
        digest?: Schema$BuildBazelRemoteExecutionV2Digest;
        /**
         * True if file is executable, false otherwise.
         */
        isExecutable?: boolean | null;
        nodeProperties?: Schema$BuildBazelRemoteExecutionV2NodeProperties;
        /**
         * The full path of the file relative to the working directory, including the filename. The path separator is a forward slash `/`. Since this is a relative path, it MUST NOT begin with a leading forward slash.
         */
        path?: string | null;
    }
    /**
     * An `OutputSymlink` is similar to a Symlink, but it is used as an output in an `ActionResult`. `OutputSymlink` is binary-compatible with `SymlinkNode`.
     */
    export interface Schema$BuildBazelRemoteExecutionV2OutputSymlink {
        nodeProperties?: Schema$BuildBazelRemoteExecutionV2NodeProperties;
        /**
         * The full path of the symlink relative to the working directory, including the filename. The path separator is a forward slash `/`. Since this is a relative path, it MUST NOT begin with a leading forward slash.
         */
        path?: string | null;
        /**
         * The target path of the symlink. The path separator is a forward slash `/`. The target path can be relative to the parent directory of the symlink or it can be an absolute path starting with `/`. Support for absolute paths can be checked using the Capabilities API. `..` components are allowed anywhere in the target path.
         */
        target?: string | null;
    }
    /**
     * A `Platform` is a set of requirements, such as hardware, operating system, or compiler toolchain, for an Action's execution environment. A `Platform` is represented as a series of key-value pairs representing the properties that are required of the platform.
     */
    export interface Schema$BuildBazelRemoteExecutionV2Platform {
        /**
         * The properties that make up this platform. In order to ensure that equivalent `Platform`s always hash to the same value, the properties MUST be lexicographically sorted by name, and then by value. Sorting of strings is done by code point, equivalently, by the UTF-8 bytes.
         */
        properties?: Schema$BuildBazelRemoteExecutionV2PlatformProperty[];
    }
    /**
     * A single property for the environment. The server is responsible for specifying the property `name`s that it accepts. If an unknown `name` is provided in the requirements for an Action, the server SHOULD reject the execution request. If permitted by the server, the same `name` may occur multiple times. The server is also responsible for specifying the interpretation of property `value`s. For instance, a property describing how much RAM must be available may be interpreted as allowing a worker with 16GB to fulfill a request for 8GB, while a property describing the OS environment on which the action must be performed may require an exact match with the worker's OS. The server MAY use the `value` of one or more properties to determine how it sets up the execution environment, such as by making specific system files available to the worker. Both names and values are typically case-sensitive. Note that the platform is implicitly part of the action digest, so even tiny changes in the names or values (like changing case) may result in different action cache entries.
     */
    export interface Schema$BuildBazelRemoteExecutionV2PlatformProperty {
        /**
         * The property name.
         */
        name?: string | null;
        /**
         * The property value.
         */
        value?: string | null;
    }
    /**
     * Allowed values for priority in ResultsCachePolicy and ExecutionPolicy Used for querying both cache and execution valid priority ranges.
     */
    export interface Schema$BuildBazelRemoteExecutionV2PriorityCapabilities {
        priorities?: Schema$BuildBazelRemoteExecutionV2PriorityCapabilitiesPriorityRange[];
    }
    /**
     * Supported range of priorities, including boundaries.
     */
    export interface Schema$BuildBazelRemoteExecutionV2PriorityCapabilitiesPriorityRange {
        /**
         * The maximum numeric value for this priority range, which represents the least urgent task or shortest retained item.
         */
        maxPriority?: number | null;
        /**
         * The minimum numeric value for this priority range, which represents the most urgent task or longest retained item.
         */
        minPriority?: number | null;
    }
    /**
     * An optional Metadata to attach to any RPC request to tell the server about an external context of the request. The server may use this for logging or other purposes. To use it, the client attaches the header to the call using the canonical proto serialization: * name: `build.bazel.remote.execution.v2.requestmetadata-bin` * contents: the base64 encoded binary `RequestMetadata` message. Note: the gRPC library serializes binary headers encoded in base 64 by default (https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#requests). Therefore, if the gRPC library is used to pass/retrieve this metadata, the user may ignore the base64 encoding and assume it is simply serialized as a binary message.
     */
    export interface Schema$BuildBazelRemoteExecutionV2RequestMetadata {
        /**
         * An identifier that ties multiple requests to the same action. For example, multiple requests to the CAS, Action Cache, and Execution API are used in order to compile foo.cc.
         */
        actionId?: string | null;
        /**
         * A brief description of the kind of action, for example, CppCompile or GoLink. There is no standard agreed set of values for this, and they are expected to vary between different client tools.
         */
        actionMnemonic?: string | null;
        /**
         * An identifier for the configuration in which the target was built, e.g. for differentiating building host tools or different target platforms. There is no expectation that this value will have any particular structure, or equality across invocations, though some client tools may offer these guarantees.
         */
        configurationId?: string | null;
        /**
         * An identifier to tie multiple tool invocations together. For example, runs of foo_test, bar_test and baz_test on a post-submit of a given patch.
         */
        correlatedInvocationsId?: string | null;
        /**
         * An identifier for the target which produced this action. No guarantees are made around how many actions may relate to a single target.
         */
        targetId?: string | null;
        /**
         * The details for the tool invoking the requests.
         */
        toolDetails?: Schema$BuildBazelRemoteExecutionV2ToolDetails;
        /**
         * An identifier that ties multiple actions together to a final result. For example, multiple actions are required to build and run foo_test.
         */
        toolInvocationId?: string | null;
    }
    /**
     * A `ResultsCachePolicy` is used for fine-grained control over how action outputs are stored in the CAS and Action Cache.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ResultsCachePolicy {
        /**
         * The priority (relative importance) of this content in the overall cache. Generally, a lower value means a longer retention time or other advantage, but the interpretation of a given value is server-dependent. A priority of 0 means a *default* value, decided by the server. The particular semantics of this field is up to the server. In particular, every server will have their own supported range of priorities, and will decide how these map into retention/eviction policy.
         */
        priority?: number | null;
    }
    /**
     * A response message for Capabilities.GetCapabilities.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ServerCapabilities {
        /**
         * Capabilities of the remote cache system.
         */
        cacheCapabilities?: Schema$BuildBazelRemoteExecutionV2CacheCapabilities;
        /**
         * Earliest RE API version supported, including deprecated versions.
         */
        deprecatedApiVersion?: Schema$BuildBazelSemverSemVer;
        /**
         * Capabilities of the remote execution system.
         */
        executionCapabilities?: Schema$BuildBazelRemoteExecutionV2ExecutionCapabilities;
        /**
         * Latest RE API version supported.
         */
        highApiVersion?: Schema$BuildBazelSemverSemVer;
        /**
         * Earliest non-deprecated RE API version supported.
         */
        lowApiVersion?: Schema$BuildBazelSemverSemVer;
    }
    /**
     * A `SymlinkNode` represents a symbolic link.
     */
    export interface Schema$BuildBazelRemoteExecutionV2SymlinkNode {
        /**
         * The name of the symlink.
         */
        name?: string | null;
        nodeProperties?: Schema$BuildBazelRemoteExecutionV2NodeProperties;
        /**
         * The target path of the symlink. The path separator is a forward slash `/`. The target path can be relative to the parent directory of the symlink or it can be an absolute path starting with `/`. Support for absolute paths can be checked using the Capabilities API. `..` components are allowed anywhere in the target path as logical canonicalization may lead to different behavior in the presence of directory symlinks (e.g. `foo/../bar` may not be the same as `bar`). To reduce potential cache misses, canonicalization is still recommended where this is possible without impacting correctness.
         */
        target?: string | null;
    }
    /**
     * Details for the tool used to call the API.
     */
    export interface Schema$BuildBazelRemoteExecutionV2ToolDetails {
        /**
         * Name of the tool, e.g. bazel.
         */
        toolName?: string | null;
        /**
         * Version of the tool used for the request, e.g. 5.0.3.
         */
        toolVersion?: string | null;
    }
    /**
     * A `Tree` contains all the Directory protos in a single directory Merkle tree, compressed into one message.
     */
    export interface Schema$BuildBazelRemoteExecutionV2Tree {
        /**
         * All the child directories: the directories referred to by the root and, recursively, all its children. In order to reconstruct the directory tree, the client must take the digests of each of the child directories and then build up a tree starting from the `root`.
         */
        children?: Schema$BuildBazelRemoteExecutionV2Directory[];
        /**
         * The root directory in the tree.
         */
        root?: Schema$BuildBazelRemoteExecutionV2Directory;
    }
    /**
     * A request message for WaitExecution.
     */
    export interface Schema$BuildBazelRemoteExecutionV2WaitExecutionRequest {
    }
    /**
     * The full version of a given tool.
     */
    export interface Schema$BuildBazelSemverSemVer {
        /**
         * The major version, e.g 10 for 10.2.3.
         */
        major?: number | null;
        /**
         * The minor version, e.g. 2 for 10.2.3.
         */
        minor?: number | null;
        /**
         * The patch version, e.g 3 for 10.2.3.
         */
        patch?: number | null;
        /**
         * The pre-release version. Either this field or major/minor/patch fields must be filled. They are mutually exclusive. Pre-release versions are assumed to be earlier than any released versions.
         */
        prerelease?: string | null;
    }
    /**
     * CommandDuration contains the various duration metrics tracked when a bot performs a command.
     */
    export interface Schema$GoogleDevtoolsRemotebuildbotCommandDurations {
        /**
         * The time spent to release the CAS blobs used by the task.
         */
        casRelease?: string | null;
        /**
         * The time spent waiting for Container Manager to assign an asynchronous container for execution.
         */
        cmWaitForAssignment?: string | null;
        /**
         * The time spent preparing the command to be run in a Docker container (includes pulling the Docker image, if necessary).
         */
        dockerPrep?: string | null;
        /**
         * The timestamp when docker preparation begins.
         */
        dockerPrepStartTime?: string | null;
        /**
         * The time spent downloading the input files and constructing the working directory.
         */
        download?: string | null;
        /**
         * The timestamp when downloading the input files begins.
         */
        downloadStartTime?: string | null;
        /**
         * The timestamp when execution begins.
         */
        execStartTime?: string | null;
        /**
         * The time spent executing the command (i.e., doing useful work).
         */
        execution?: string | null;
        /**
         * The timestamp when preparation is done and bot starts downloading files.
         */
        isoPrepDone?: string | null;
        /**
         * The time spent completing the command, in total.
         */
        overall?: string | null;
        /**
         * The time spent uploading the stdout logs.
         */
        stdout?: string | null;
        /**
         * The time spent uploading the output files.
         */
        upload?: string | null;
        /**
         * The timestamp when uploading the output files begins.
         */
        uploadStartTime?: string | null;
    }
    /**
     * CommandEvents contains counters for the number of warnings and errors that occurred during the execution of a command.
     */
    export interface Schema$GoogleDevtoolsRemotebuildbotCommandEvents {
        /**
         * Indicates if and how Container Manager is being used for task execution.
         */
        cmUsage?: string | null;
        /**
         * Indicates whether we are using a cached Docker image (true) or had to pull the Docker image (false) for this command.
         */
        dockerCacheHit?: boolean | null;
        /**
         * Docker Image name.
         */
        dockerImageName?: string | null;
        /**
         * The input cache miss ratio.
         */
        inputCacheMiss?: number | null;
        /**
         * The number of errors reported.
         */
        numErrors?: string | null;
        /**
         * The number of warnings reported.
         */
        numWarnings?: string | null;
        /**
         * Indicates whether output files and/or output directories were found relative to the execution root or to the user provided work directory or both or none.
         */
        outputLocation?: string | null;
        /**
         * Indicates whether an asynchronous container was used for execution.
         */
        usedAsyncContainer?: boolean | null;
    }
    /**
     * The internal status of the command result.
     */
    export interface Schema$GoogleDevtoolsRemotebuildbotCommandStatus {
        /**
         * The status code.
         */
        code?: string | null;
        /**
         * The error message.
         */
        message?: string | null;
    }
    /**
     * ResourceUsage is the system resource usage of the host machine.
     */
    export interface Schema$GoogleDevtoolsRemotebuildbotResourceUsage {
        cpuUsedPercent?: number | null;
        diskUsage?: Schema$GoogleDevtoolsRemotebuildbotResourceUsageStat;
        memoryUsage?: Schema$GoogleDevtoolsRemotebuildbotResourceUsageStat;
        totalDiskIoStats?: Schema$GoogleDevtoolsRemotebuildbotResourceUsageIOStats;
    }
    export interface Schema$GoogleDevtoolsRemotebuildbotResourceUsageIOStats {
        readBytesCount?: string | null;
        readCount?: string | null;
        readTimeMs?: string | null;
        writeBytesCount?: string | null;
        writeCount?: string | null;
        writeTimeMs?: string | null;
    }
    export interface Schema$GoogleDevtoolsRemotebuildbotResourceUsageStat {
        total?: string | null;
        used?: string | null;
    }
    /**
     * AcceleratorConfig defines the accelerator cards to attach to the VM.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaAcceleratorConfig {
        /**
         * The number of guest accelerator cards exposed to each VM.
         */
        acceleratorCount?: string | null;
        /**
         * The type of accelerator to attach to each VM, e.g. "nvidia-tesla-k80" for nVidia Tesla K80.
         */
        acceleratorType?: string | null;
    }
    /**
     * Autoscale defines the autoscaling policy of a worker pool.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaAutoscale {
        /**
         * The maximal number of workers. Must be equal to or greater than min_size.
         */
        maxSize?: string | null;
        /**
         * The minimal number of workers. Must be greater than 0.
         */
        minSize?: string | null;
    }
    /**
     * The request used for `CreateInstance`.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaCreateInstanceRequest {
        /**
         * Specifies the instance to create. The name in the instance, if specified in the instance, is ignored.
         */
        instance?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaInstance;
        /**
         * ID of the created instance. A valid `instance_id` must: be 6-50 characters long, contain only lowercase letters, digits, hyphens and underscores, start with a lowercase letter, and end with a lowercase letter or a digit.
         */
        instanceId?: string | null;
        /**
         * Resource name of the project containing the instance. Format: `projects/[PROJECT_ID]`.
         */
        parent?: string | null;
    }
    /**
     * The request used for `CreateWorkerPool`.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaCreateWorkerPoolRequest {
        /**
         * Resource name of the instance in which to create the new worker pool. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`.
         */
        parent?: string | null;
        /**
         * ID of the created worker pool. A valid pool ID must: be 6-50 characters long, contain only lowercase letters, digits, hyphens and underscores, start with a lowercase letter, and end with a lowercase letter or a digit.
         */
        poolId?: string | null;
        /**
         * Specifies the worker pool to create. The name in the worker pool, if specified, is ignored.
         */
        workerPool?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerPool;
    }
    /**
     * The request used for `DeleteInstance`.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaDeleteInstanceRequest {
        /**
         * Name of the instance to delete. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`.
         */
        name?: string | null;
    }
    /**
     * The request used for DeleteWorkerPool.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaDeleteWorkerPoolRequest {
        /**
         * Name of the worker pool to delete. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]/workerpools/[POOL_ID]`.
         */
        name?: string | null;
    }
    /**
     * FeaturePolicy defines features allowed to be used on RBE instances, as well as instance-wide behavior changes that take effect without opt-in or opt-out at usage time.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicy {
        /**
         * Which container image sources are allowed. Currently only RBE-supported registry (gcr.io) is allowed. One can allow all repositories under a project or one specific repository only. E.g. container_image_sources { policy: RESTRICTED allowed_values: [ "gcr.io/project-foo", "gcr.io/project-bar/repo-baz", ] \} will allow any repositories under "gcr.io/project-foo" plus the repository "gcr.io/project-bar/repo-baz". Default (UNSPECIFIED) is equivalent to any source is allowed.
         */
        containerImageSources?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerAddCapabilities can be used or what capabilities are allowed.
         */
        dockerAddCapabilities?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerChrootPath can be used.
         */
        dockerChrootPath?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerNetwork can be used or what network modes are allowed. E.g. one may allow `off` value only via `allowed_values`.
         */
        dockerNetwork?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerPrivileged can be used.
         */
        dockerPrivileged?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerRunAsRoot can be used.
         */
        dockerRunAsRoot?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerRuntime is allowed to be set or what runtimes are allowed. Note linux_isolation takes precedence, and if set, docker_runtime values may be rejected if they are incompatible with the selected isolation.
         */
        dockerRuntime?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * Whether dockerSiblingContainers can be used.
         */
        dockerSiblingContainers?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature;
        /**
         * linux_isolation allows overriding the docker runtime used for containers started on Linux.
         */
        linuxIsolation?: string | null;
    }
    /**
     * Defines whether a feature can be used or what values are accepted.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicyFeature {
        /**
         * A list of acceptable values. Only effective when the policy is `RESTRICTED`.
         */
        allowedValues?: string[] | null;
        /**
         * The policy of the feature.
         */
        policy?: string | null;
    }
    /**
     * The request used for `GetInstance`.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaGetInstanceRequest {
        /**
         * Name of the instance to retrieve. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`.
         */
        name?: string | null;
    }
    /**
     * The request used for GetWorkerPool.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaGetWorkerPoolRequest {
        /**
         * Name of the worker pool to retrieve. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]/workerpools/[POOL_ID]`.
         */
        name?: string | null;
    }
    /**
     * Instance conceptually encapsulates all Remote Build Execution resources for remote builds. An instance consists of storage and compute resources (for example, `ContentAddressableStorage`, `ActionCache`, `WorkerPools`) used for running remote builds. All Remote Build Execution API calls are scoped to an instance.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaInstance {
        /**
         * The policy to define whether or not RBE features can be used or how they can be used.
         */
        featurePolicy?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaFeaturePolicy;
        /**
         * The location is a GCP region. Currently only `us-central1` is supported.
         */
        location?: string | null;
        /**
         * Output only. Whether stack driver logging is enabled for the instance.
         */
        loggingEnabled?: boolean | null;
        /**
         * Output only. Instance resource name formatted as: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`. Name should not be populated when creating an instance since it is provided in the `instance_id` field.
         */
        name?: string | null;
        /**
         * Output only. State of the instance.
         */
        state?: string | null;
    }
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaListInstancesRequest {
        /**
         * Resource name of the project. Format: `projects/[PROJECT_ID]`.
         */
        parent?: string | null;
    }
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaListInstancesResponse {
        /**
         * The list of instances in a given project.
         */
        instances?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaInstance[];
    }
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaListWorkerPoolsRequest {
        /**
         * Optional. A filter expression that filters resources listed in the response. The expression must specify the field name, a comparison operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. String values are case-insensitive. The comparison operator must be either `:`, `=`, `!=`, `\>`, `\>=`, `<=` or `<`. The `:` operator can be used with string fields to match substrings. For non-string fields it is equivalent to the `=` operator. The `:*` comparison can be used to test whether a key has been defined. You can also filter on nested fields. To filter on multiple expressions, you can separate expression using `AND` and `OR` operators, using parentheses to specify precedence. If neither operator is specified, `AND` is assumed. Examples: Include only pools with more than 100 reserved workers: `(worker_count \> 100) (worker_config.reserved = true)` Include only pools with a certain label or machines of the e2-standard family: `worker_config.labels.key1 : * OR worker_config.machine_type: e2-standard`
         */
        filter?: string | null;
        /**
         * Resource name of the instance. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`.
         */
        parent?: string | null;
    }
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaListWorkerPoolsResponse {
        /**
         * The list of worker pools in a given instance.
         */
        workerPools?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerPool[];
    }
    /**
     * The request used for `UpdateInstance`.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaUpdateInstanceRequest {
        /**
         * Specifies the instance to update.
         */
        instance?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaInstance;
        /**
         * Deprecated, use instance.logging_enabled instead. Whether to enable Stackdriver logging for this instance.
         */
        loggingEnabled?: boolean | null;
        /**
         * Deprecated, use instance.Name instead. Name of the instance to update. Format: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]`.
         */
        name?: string | null;
        /**
         * The update mask applies to instance. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If an empty update_mask is provided, only the non-default valued field in the worker pool field will be updated. Note that in order to update a field to the default value (zero, false, empty string) an explicit update_mask must be provided.
         */
        updateMask?: string | null;
    }
    /**
     * The request used for UpdateWorkerPool.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaUpdateWorkerPoolRequest {
        /**
         * The update mask applies to worker_pool. For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If an empty update_mask is provided, only the non-default valued field in the worker pool field will be updated. Note that in order to update a field to the default value (zero, false, empty string) an explicit update_mask must be provided.
         */
        updateMask?: string | null;
        /**
         * Specifies the worker pool to update.
         */
        workerPool?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerPool;
    }
    /**
     * Defines the configuration to be used for creating workers in the worker pool.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerConfig {
        /**
         * The accelerator card attached to each VM.
         */
        accelerator?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaAcceleratorConfig;
        /**
         * Required. Size of the disk attached to the worker, in GB. See https://cloud.google.com/compute/docs/disks/
         */
        diskSizeGb?: string | null;
        /**
         * Required. Disk Type to use for the worker. See [Storage options](https://cloud.google.com/compute/docs/disks/#introduction). Currently only `pd-standard` and `pd-ssd` are supported.
         */
        diskType?: string | null;
        /**
         * Labels associated with the workers. Label keys and values can be no longer than 63 characters, can only contain lowercase letters, numeric characters, underscores and dashes. International letters are permitted. Label keys must start with a letter. Label values are optional. There can not be more than 64 labels per resource.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. Machine type of the worker, such as `e2-standard-2`. See https://cloud.google.com/compute/docs/machine-types for a list of supported machine types. Note that `f1-micro` and `g1-small` are not yet supported.
         */
        machineType?: string | null;
        /**
         * The maximum number of actions a worker can execute concurrently.
         */
        maxConcurrentActions?: string | null;
        /**
         * Minimum CPU platform to use when creating the worker. See [CPU Platforms](https://cloud.google.com/compute/docs/cpu-platforms).
         */
        minCpuPlatform?: string | null;
        /**
         * Determines the type of network access granted to workers. Possible values: - "public": Workers can connect to the public internet. - "private": Workers can only connect to Google APIs and services. - "restricted-private": Workers can only connect to Google APIs that are reachable through `restricted.googleapis.com` (`199.36.153.4/30`).
         */
        networkAccess?: string | null;
        /**
         * Determines whether the worker is reserved (equivalent to a Compute Engine on-demand VM and therefore won't be preempted). See [Preemptible VMs](https://cloud.google.com/preemptible-vms/) for more details.
         */
        reserved?: boolean | null;
        /**
         * The node type name to be used for sole-tenant nodes.
         */
        soleTenantNodeType?: string | null;
        /**
         * The name of the image used by each VM.
         */
        vmImage?: string | null;
    }
    /**
     * A worker pool resource in the Remote Build Execution API.
     */
    export interface Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerPool {
        /**
         * The autoscale policy to apply on a pool.
         */
        autoscale?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaAutoscale;
        /**
         * Channel specifies the release channel of the pool.
         */
        channel?: string | null;
        /**
         * WorkerPool resource name formatted as: `projects/[PROJECT_ID]/instances/[INSTANCE_ID]/workerpools/[POOL_ID]`. name should not be populated when creating a worker pool since it is provided in the `poolId` field.
         */
        name?: string | null;
        /**
         * Output only. State of the worker pool.
         */
        state?: string | null;
        /**
         * Specifies the properties, such as machine type and disk size, used for creating workers in a worker pool.
         */
        workerConfig?: Schema$GoogleDevtoolsRemotebuildexecutionAdminV1alphaWorkerConfig;
        /**
         * The desired number of workers in the worker pool. Must be a value between 0 and 15000.
         */
        workerCount?: string | null;
    }
    /**
     * AdminTemp is a prelimiary set of administration tasks. It's called "Temp" because we do not yet know the best way to represent admin tasks; it's possible that this will be entirely replaced in later versions of this API. If this message proves to be sufficient, it will be renamed in the alpha or beta release of this API. This message (suitably marshalled into a protobuf.Any) can be used as the inline_assignment field in a lease; the lease assignment field should simply be `"admin"` in these cases. This message is heavily based on Swarming administration tasks from the LUCI project (http://github.com/luci/luci-py/appengine/swarming).
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2AdminTemp {
        /**
         * The argument to the admin action; see `Command` for semantics.
         */
        arg?: string | null;
        /**
         * The admin action; see `Command` for legal values.
         */
        command?: string | null;
    }
    /**
     * Describes a blob of binary content with its digest.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2Blob {
        /**
         * The contents of the blob.
         */
        contents?: string | null;
        /**
         * The digest of the blob. This should be verified by the receiver.
         */
        digest?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest;
    }
    /**
     * DEPRECATED - use CommandResult instead. Describes the actual outputs from the task.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandOutputs {
        /**
         * exit_code is only fully reliable if the status' code is OK. If the task exceeded its deadline or was cancelled, the process may still produce an exit code as it is cancelled, and this will be populated, but a successful (zero) is unlikely to be correct unless the status code is OK.
         */
        exitCode?: number | null;
        /**
         * The output files. The blob referenced by the digest should contain one of the following (implementation-dependent): * A marshalled DirectoryMetadata of the returned filesystem * A LUCI-style .isolated file
         */
        outputs?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest;
    }
    /**
     * DEPRECATED - use CommandResult instead. Can be used as part of CompleteRequest.metadata, or are part of a more sophisticated message.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandOverhead {
        /**
         * The elapsed time between calling Accept and Complete. The server will also have its own idea of what this should be, but this excludes the overhead of the RPCs and the bot response time.
         */
        duration?: string | null;
        /**
         * The amount of time *not* spent executing the command (ie uploading/downloading files).
         */
        overhead?: string | null;
    }
    /**
     * All information about the execution of a command, suitable for providing as the Bots interface's `Lease.result` field.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandResult {
        /**
         * The elapsed time between calling Accept and Complete. The server will also have its own idea of what this should be, but this excludes the overhead of the RPCs and the bot response time.
         */
        duration?: string | null;
        /**
         * The exit code of the process. An exit code of "0" should only be trusted if `status` has a code of OK (otherwise it may simply be unset).
         */
        exitCode?: number | null;
        /**
         * Implementation-dependent metadata about the task. Both servers and bots may define messages which can be encoded here; bots are free to provide metadata in multiple formats, and servers are free to choose one or more of the values to process and ignore others. In particular, it is *not* considered an error for the bot to provide the server with a field that it doesn't know about.
         */
        metadata?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * The output files. The blob referenced by the digest should contain one of the following (implementation-dependent): * A marshalled DirectoryMetadata of the returned filesystem * A LUCI-style .isolated file
         */
        outputs?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest;
        /**
         * The amount of time *not* spent executing the command (ie uploading/downloading files).
         */
        overhead?: string | null;
        /**
         * An overall status for the command. For example, if the command timed out, this might have a code of DEADLINE_EXCEEDED; if it was killed by the OS for memory exhaustion, it might have a code of RESOURCE_EXHAUSTED.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Describes a shell-style task to execute, suitable for providing as the Bots interface's `Lease.payload` field.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandTask {
        /**
         * The expected outputs from the task.
         */
        expectedOutputs?: Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskOutputs;
        /**
         * The inputs to the task.
         */
        inputs?: Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskInputs;
        /**
         * The timeouts of this task.
         */
        timeouts?: Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskTimeouts;
    }
    /**
     * Describes the inputs to a shell-style task.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskInputs {
        /**
         * The command itself to run (e.g., argv). This field should be passed directly to the underlying operating system, and so it must be sensible to that operating system. For example, on Windows, the first argument might be "C:\Windows\System32\ping.exe" - that is, using drive letters and backslashes. A command for a *nix system, on the other hand, would use forward slashes. All other fields in the RWAPI must consistently use forward slashes, since those fields may be interpretted by both the service and the bot.
         */
        arguments?: string[] | null;
        /**
         * All environment variables required by the task.
         */
        environmentVariables?: Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskInputsEnvironmentVariable[];
        /**
         * The input filesystem to be set up prior to the task beginning. The contents should be a repeated set of FileMetadata messages though other formats are allowed if better for the implementation (eg, a LUCI-style .isolated file). This field is repeated since implementations might want to cache the metadata, in which case it may be useful to break up portions of the filesystem that change frequently (eg, specific input files) from those that don't (eg, standard header files).
         */
        files?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest[];
        /**
         * Inline contents for blobs expected to be needed by the bot to execute the task. For example, contents of entries in `files` or blobs that are indirectly referenced by an entry there. The bot should check against this list before downloading required task inputs to reduce the number of communications between itself and the remote CAS server.
         */
        inlineBlobs?: Schema$GoogleDevtoolsRemoteworkersV1test2Blob[];
        /**
         * Directory from which a command is executed. It is a relative directory with respect to the bot's working directory (i.e., "./"). If it is non-empty, then it must exist under "./". Otherwise, "./" will be used.
         */
        workingDirectory?: string | null;
    }
    /**
     * An environment variable required by this task.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskInputsEnvironmentVariable {
        /**
         * The envvar name.
         */
        name?: string | null;
        /**
         * The envvar value.
         */
        value?: string | null;
    }
    /**
     * Describes the expected outputs of the command.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskOutputs {
        /**
         * A list of expected directories, relative to the execution root. All paths MUST be delimited by forward slashes.
         */
        directories?: string[] | null;
        /**
         * A list of expected files, relative to the execution root. All paths MUST be delimited by forward slashes.
         */
        files?: string[] | null;
        /**
         * The destination to which any stderr should be sent. The method by which the bot should send the stream contents to that destination is not defined in this API. As examples, the destination could be a file referenced in the `files` field in this message, or it could be a URI that must be written via the ByteStream API.
         */
        stderrDestination?: string | null;
        /**
         * The destination to which any stdout should be sent. The method by which the bot should send the stream contents to that destination is not defined in this API. As examples, the destination could be a file referenced in the `files` field in this message, or it could be a URI that must be written via the ByteStream API.
         */
        stdoutDestination?: string | null;
    }
    /**
     * Describes the timeouts associated with this task.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2CommandTaskTimeouts {
        /**
         * This specifies the maximum time that the task can run, excluding the time required to download inputs or upload outputs. That is, the worker will terminate the task if it runs longer than this.
         */
        execution?: string | null;
        /**
         * This specifies the maximum amount of time the task can be idle - that is, go without generating some output in either stdout or stderr. If the process is silent for more than the specified time, the worker will terminate the task.
         */
        idle?: string | null;
        /**
         * If the execution or IO timeouts are exceeded, the worker will try to gracefully terminate the task and return any existing logs. However, tasks may be hard-frozen in which case this process will fail. This timeout specifies how long to wait for a terminated task to shut down gracefully (e.g. via SIGTERM) before we bring down the hammer (e.g. SIGKILL on *nix, CTRL_BREAK_EVENT on Windows).
         */
        shutdown?: string | null;
    }
    /**
     * The CommandTask and CommandResult messages assume the existence of a service that can serve blobs of content, identified by a hash and size known as a "digest." The method by which these blobs may be retrieved is not specified here, but a model implementation is in the Remote Execution API's "ContentAddressibleStorage" interface. In the context of the RWAPI, a Digest will virtually always refer to the contents of a file or a directory. The latter is represented by the byte-encoded Directory message.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2Digest {
        /**
         * A string-encoded hash (eg "1a2b3c", not the byte array [0x1a, 0x2b, 0x3c]) using an implementation-defined hash algorithm (eg SHA-256).
         */
        hash?: string | null;
        /**
         * The size of the contents. While this is not strictly required as part of an identifier (after all, any given hash will have exactly one canonical size), it's useful in almost all cases when one might want to send or retrieve blobs of content and is included here for this reason.
         */
        sizeBytes?: string | null;
    }
    /**
     * The contents of a directory. Similar to the equivalent message in the Remote Execution API.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2Directory {
        /**
         * Any subdirectories
         */
        directories?: Schema$GoogleDevtoolsRemoteworkersV1test2DirectoryMetadata[];
        /**
         * The files in this directory
         */
        files?: Schema$GoogleDevtoolsRemoteworkersV1test2FileMetadata[];
    }
    /**
     * The metadata for a directory. Similar to the equivalent message in the Remote Execution API.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2DirectoryMetadata {
        /**
         * A pointer to the contents of the directory, in the form of a marshalled Directory message.
         */
        digest?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest;
        /**
         * The path of the directory, as in FileMetadata.path.
         */
        path?: string | null;
    }
    /**
     * The metadata for a file. Similar to the equivalent message in the Remote Execution API.
     */
    export interface Schema$GoogleDevtoolsRemoteworkersV1test2FileMetadata {
        /**
         * If the file is small enough, its contents may also or alternatively be listed here.
         */
        contents?: string | null;
        /**
         * A pointer to the contents of the file. The method by which a client retrieves the contents from a CAS system is not defined here.
         */
        digest?: Schema$GoogleDevtoolsRemoteworkersV1test2Digest;
        /**
         * Properties of the file
         */
        isExecutable?: boolean | null;
        /**
         * The path of this file. If this message is part of the CommandOutputs.outputs fields, the path is relative to the execution root and must correspond to an entry in CommandTask.outputs.files. If this message is part of a Directory message, then the path is relative to the root of that directory. All paths MUST be delimited by forward slashes.
         */
        path?: string | null;
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
         * The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
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
    export class Resource$Actionresults {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieve a cached execution result. Implementations SHOULD ensure that any blobs referenced from the ContentAddressableStorage are available at the time of returning the ActionResult and will be for some period of time afterwards. The lifetimes of the referenced blobs SHOULD be increased if necessary and applicable. Errors: * `NOT_FOUND`: The requested `ActionResult` is not in the cache.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.actionResults.get({
         *     // The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         *     hash: 'placeholder-value',
         *     // A hint to the server to inline the contents of the listed output files. Each path needs to exactly match one file path in either `output_paths` or `output_files` (DEPRECATED since v2.1) in the Command message.
         *     inlineOutputFiles: 'placeholder-value',
         *     // A hint to the server to request inlining stderr in the ActionResult message.
         *     inlineStderr: 'placeholder-value',
         *     // A hint to the server to request inlining stdout in the ActionResult message.
         *     inlineStdout: 'placeholder-value',
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *     // The size of the blob, in bytes.
         *     sizeBytes: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionMetadata": {},
         *   //   "exitCode": 0,
         *   //   "outputDirectories": [],
         *   //   "outputDirectorySymlinks": [],
         *   //   "outputFileSymlinks": [],
         *   //   "outputFiles": [],
         *   //   "outputSymlinks": [],
         *   //   "stderrDigest": {},
         *   //   "stderrRaw": "my_stderrRaw",
         *   //   "stdoutDigest": {},
         *   //   "stdoutRaw": "my_stdoutRaw"
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
        get(params: Params$Resource$Actionresults$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Actionresults$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2ActionResult>>;
        get(params: Params$Resource$Actionresults$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Actionresults$Get, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
        get(params: Params$Resource$Actionresults$Get, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
        get(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
        /**
         * Upload a new execution result. In order to allow the server to perform access control based on the type of action, and to assist with client debugging, the client MUST first upload the Action that produced the result, along with its Command, into the `ContentAddressableStorage`. Server implementations MAY modify the `UpdateActionResultRequest.action_result` and return an equivalent value. Errors: * `INVALID_ARGUMENT`: One or more arguments are invalid. * `FAILED_PRECONDITION`: One or more errors occurred in updating the action result, such as a missing command or action. * `RESOURCE_EXHAUSTED`: There is insufficient storage space to add the entry to the cache.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.actionResults.update({
         *     // The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         *     hash: 'placeholder-value',
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *     // The priority (relative importance) of this content in the overall cache. Generally, a lower value means a longer retention time or other advantage, but the interpretation of a given value is server-dependent. A priority of 0 means a *default* value, decided by the server. The particular semantics of this field is up to the server. In particular, every server will have their own supported range of priorities, and will decide how these map into retention/eviction policy.
         *     'resultsCachePolicy.priority': 'placeholder-value',
         *     // The size of the blob, in bytes.
         *     sizeBytes: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "executionMetadata": {},
         *       //   "exitCode": 0,
         *       //   "outputDirectories": [],
         *       //   "outputDirectorySymlinks": [],
         *       //   "outputFileSymlinks": [],
         *       //   "outputFiles": [],
         *       //   "outputSymlinks": [],
         *       //   "stderrDigest": {},
         *       //   "stderrRaw": "my_stderrRaw",
         *       //   "stdoutDigest": {},
         *       //   "stdoutRaw": "my_stdoutRaw"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionMetadata": {},
         *   //   "exitCode": 0,
         *   //   "outputDirectories": [],
         *   //   "outputDirectorySymlinks": [],
         *   //   "outputFileSymlinks": [],
         *   //   "outputFiles": [],
         *   //   "outputSymlinks": [],
         *   //   "stderrDigest": {},
         *   //   "stderrRaw": "my_stderrRaw",
         *   //   "stdoutDigest": {},
         *   //   "stdoutRaw": "my_stdoutRaw"
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
        update(params: Params$Resource$Actionresults$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Actionresults$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2ActionResult>>;
        update(params: Params$Resource$Actionresults$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Actionresults$Update, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
        update(params: Params$Resource$Actionresults$Update, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
        update(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ActionResult>): void;
    }
    export interface Params$Resource$Actionresults$Get extends StandardParameters {
        /**
         * The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         */
        hash?: string;
        /**
         * A hint to the server to inline the contents of the listed output files. Each path needs to exactly match one file path in either `output_paths` or `output_files` (DEPRECATED since v2.1) in the Command message.
         */
        inlineOutputFiles?: string[];
        /**
         * A hint to the server to request inlining stderr in the ActionResult message.
         */
        inlineStderr?: boolean;
        /**
         * A hint to the server to request inlining stdout in the ActionResult message.
         */
        inlineStdout?: boolean;
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * The size of the blob, in bytes.
         */
        sizeBytes?: string;
    }
    export interface Params$Resource$Actionresults$Update extends StandardParameters {
        /**
         * The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         */
        hash?: string;
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * The priority (relative importance) of this content in the overall cache. Generally, a lower value means a longer retention time or other advantage, but the interpretation of a given value is server-dependent. A priority of 0 means a *default* value, decided by the server. The particular semantics of this field is up to the server. In particular, every server will have their own supported range of priorities, and will decide how these map into retention/eviction policy.
         */
        'resultsCachePolicy.priority'?: number;
        /**
         * The size of the blob, in bytes.
         */
        sizeBytes?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2ActionResult;
    }
    export class Resource$Actions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Execute an action remotely. In order to execute an action, the client must first upload all of the inputs, the Command to run, and the Action into the ContentAddressableStorage. It then calls `Execute` with an `action_digest` referring to them. The server will run the action and eventually return the result. The input `Action`'s fields MUST meet the various canonicalization requirements specified in the documentation for their types so that it has the same digest as other logically equivalent `Action`s. The server MAY enforce the requirements and return errors if a non-canonical input is received. It MAY also proceed without verifying some or all of the requirements, such as for performance reasons. If the server does not verify the requirement, then it will treat the `Action` as distinct from another logically equivalent action if they hash differently. Returns a stream of google.longrunning.Operation messages describing the resulting execution, with eventual `response` ExecuteResponse. The `metadata` on the operation is of type ExecuteOperationMetadata. If the client remains connected after the first response is returned after the server, then updates are streamed as if the client had called WaitExecution until the execution completes or the request reaches an error. The operation can also be queried using Operations API. The server NEED NOT implement other methods or functionality of the Operations API. Errors discovered during creation of the `Operation` will be reported as gRPC Status errors, while errors that occurred while running the action will be reported in the `status` field of the `ExecuteResponse`. The server MUST NOT set the `error` field of the `Operation` proto. The possible errors include: * `INVALID_ARGUMENT`: One or more arguments are invalid. * `FAILED_PRECONDITION`: One or more errors occurred in setting up the action requested, such as a missing input or command or no worker being available. The client may be able to fix the errors and retry. * `RESOURCE_EXHAUSTED`: There is insufficient quota of some resource to run the action. * `UNAVAILABLE`: Due to a transient condition, such as all workers being occupied (and the server does not support a queue), the action could not be started. The client should retry. * `INTERNAL`: An internal error occurred in the execution engine or the worker. * `DEADLINE_EXCEEDED`: The execution timed out. * `CANCELLED`: The operation was cancelled by the client. This status is only possible if the server implements the Operations API CancelOperation method, and it was called for the current execution. In the case of a missing input or command, the server SHOULD additionally send a PreconditionFailure error detail where, for each requested blob not present in the CAS, there is a `Violation` with a `type` of `MISSING` and a `subject` of `"blobs/{hash\}/{size\}"` indicating the digest of the missing blob. The server does not need to guarantee that a call to this method leads to at most one execution of the action. The server MAY execute the action multiple times, potentially in parallel. These redundant executions MAY continue to run, even if the operation is completed.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.actions.execute({
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "actionDigest": {},
         *       //   "executionPolicy": {},
         *       //   "resultsCachePolicy": {},
         *       //   "skipCacheLookup": false
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        execute(params: Params$Resource$Actions$Execute, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        execute(params?: Params$Resource$Actions$Execute, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        execute(params: Params$Resource$Actions$Execute, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        execute(params: Params$Resource$Actions$Execute, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        execute(params: Params$Resource$Actions$Execute, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        execute(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Actions$Execute extends StandardParameters {
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2ExecuteRequest;
    }
    export class Resource$Blobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Download many blobs at once. The server may enforce a limit of the combined total size of blobs to be downloaded using this API. This limit may be obtained using the Capabilities API. Requests exceeding the limit should either be split into smaller chunks or downloaded using the ByteStream API, as appropriate. This request is equivalent to calling a Bytestream `Read` request on each individual blob, in parallel. The requests may succeed or fail independently. Errors: * `INVALID_ARGUMENT`: The client attempted to read more than the server supported limit. Every error on individual read will be returned in the corresponding digest status.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.blobs.batchRead({
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "digests": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "responses": []
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
        batchRead(params: Params$Resource$Blobs$Batchread, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchRead(params?: Params$Resource$Blobs$Batchread, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse>>;
        batchRead(params: Params$Resource$Blobs$Batchread, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchRead(params: Params$Resource$Blobs$Batchread, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse>): void;
        batchRead(params: Params$Resource$Blobs$Batchread, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse>): void;
        batchRead(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchReadBlobsResponse>): void;
        /**
         * Upload many blobs at once. The server may enforce a limit of the combined total size of blobs to be uploaded using this API. This limit may be obtained using the Capabilities API. Requests exceeding the limit should either be split into smaller chunks or uploaded using the ByteStream API, as appropriate. This request is equivalent to calling a Bytestream `Write` request on each individual blob, in parallel. The requests may succeed or fail independently. Errors: * `INVALID_ARGUMENT`: The client attempted to upload more than the server supported limit. Individual requests may return the following errors, additionally: * `RESOURCE_EXHAUSTED`: There is insufficient disk quota to store the blob. * `INVALID_ARGUMENT`: The Digest does not match the provided data.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.blobs.batchUpdate({
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "requests": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "responses": []
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
        batchUpdate(params: Params$Resource$Blobs$Batchupdate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        batchUpdate(params?: Params$Resource$Blobs$Batchupdate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse>>;
        batchUpdate(params: Params$Resource$Blobs$Batchupdate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        batchUpdate(params: Params$Resource$Blobs$Batchupdate, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse>): void;
        batchUpdate(params: Params$Resource$Blobs$Batchupdate, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse>): void;
        batchUpdate(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsResponse>): void;
        /**
         * Determine if blobs are present in the CAS. Clients can use this API before uploading blobs to determine which ones are already present in the CAS and do not need to be uploaded again. Servers SHOULD increase the lifetimes of the referenced blobs if necessary and applicable. There are no method-specific errors.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.blobs.findMissing({
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "blobDigests": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "missingBlobDigests": []
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
        findMissing(params: Params$Resource$Blobs$Findmissing, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        findMissing(params?: Params$Resource$Blobs$Findmissing, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse>>;
        findMissing(params: Params$Resource$Blobs$Findmissing, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        findMissing(params: Params$Resource$Blobs$Findmissing, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse>): void;
        findMissing(params: Params$Resource$Blobs$Findmissing, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse>): void;
        findMissing(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2FindMissingBlobsResponse>): void;
        /**
         * Fetch the entire directory tree rooted at a node. This request must be targeted at a Directory stored in the ContentAddressableStorage (CAS). The server will enumerate the `Directory` tree recursively and return every node descended from the root. The GetTreeRequest.page_token parameter can be used to skip ahead in the stream (e.g. when retrying a partially completed and aborted request), by setting it to a value taken from GetTreeResponse.next_page_token of the last successfully processed GetTreeResponse). The exact traversal order is unspecified and, unless retrieving subsequent pages from an earlier request, is not guaranteed to be stable across multiple invocations of `GetTree`. If part of the tree is missing from the CAS, the server will return the portion present and omit the rest. Errors: * `NOT_FOUND`: The requested tree root is not present in the CAS.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.blobs.getTree({
         *     // The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         *     hash: 'placeholder-value',
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *     // A maximum page size to request. If present, the server will request no more than this many items. Regardless of whether a page size is specified, the server may place its own limit on the number of items to be returned and require the client to retrieve more items using a subsequent request.
         *     pageSize: 'placeholder-value',
         *     // A page token, which must be a value received in a previous GetTreeResponse. If present, the server will use that token as an offset, returning only that page and the ones that succeed it.
         *     pageToken: 'placeholder-value',
         *     // The size of the blob, in bytes.
         *     sizeBytes: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "directories": [],
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
        getTree(params: Params$Resource$Blobs$Gettree, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getTree(params?: Params$Resource$Blobs$Gettree, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2GetTreeResponse>>;
        getTree(params: Params$Resource$Blobs$Gettree, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getTree(params: Params$Resource$Blobs$Gettree, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2GetTreeResponse>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2GetTreeResponse>): void;
        getTree(params: Params$Resource$Blobs$Gettree, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2GetTreeResponse>): void;
        getTree(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2GetTreeResponse>): void;
    }
    export interface Params$Resource$Blobs$Batchread extends StandardParameters {
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2BatchReadBlobsRequest;
    }
    export interface Params$Resource$Blobs$Batchupdate extends StandardParameters {
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2BatchUpdateBlobsRequest;
    }
    export interface Params$Resource$Blobs$Findmissing extends StandardParameters {
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2FindMissingBlobsRequest;
    }
    export interface Params$Resource$Blobs$Gettree extends StandardParameters {
        /**
         * The hash. In the case of SHA-256, it will always be a lowercase hex string exactly 64 characters long.
         */
        hash?: string;
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
        /**
         * A maximum page size to request. If present, the server will request no more than this many items. Regardless of whether a page size is specified, the server may place its own limit on the number of items to be returned and require the client to retrieve more items using a subsequent request.
         */
        pageSize?: number;
        /**
         * A page token, which must be a value received in a previous GetTreeResponse. If present, the server will use that token as an offset, returning only that page and the ones that succeed it.
         */
        pageToken?: string;
        /**
         * The size of the blob, in bytes.
         */
        sizeBytes?: string;
    }
    export class Resource$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Wait for an execution operation to complete. When the client initially makes the request, the server immediately responds with the current status of the execution. The server will leave the request stream open until the operation completes, and then respond with the completed operation. The server MAY choose to stream additional updates as execution progresses, such as to provide an update as to the state of the execution.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.operations.waitExecution({
         *     // The name of the Operation returned by Execute.
         *     name: 'operations/.*',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {}
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "done": false,
         *   //   "error": {},
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "response": {}
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
        waitExecution(params: Params$Resource$Operations$Waitexecution, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        waitExecution(params?: Params$Resource$Operations$Waitexecution, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleLongrunningOperation>>;
        waitExecution(params: Params$Resource$Operations$Waitexecution, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        waitExecution(params: Params$Resource$Operations$Waitexecution, options: MethodOptions | BodyResponseCallback<Schema$GoogleLongrunningOperation>, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        waitExecution(params: Params$Resource$Operations$Waitexecution, callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
        waitExecution(callback: BodyResponseCallback<Schema$GoogleLongrunningOperation>): void;
    }
    export interface Params$Resource$Operations$Waitexecution extends StandardParameters {
        /**
         * The name of the Operation returned by Execute.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BuildBazelRemoteExecutionV2WaitExecutionRequest;
    }
    export class Resource$V2 {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * GetCapabilities returns the server capabilities configuration of the remote endpoint. Only the capabilities of the services supported by the endpoint will be returned: * Execution + CAS + Action Cache endpoints should return both CacheCapabilities and ExecutionCapabilities. * Execution only endpoints should return ExecutionCapabilities. * CAS + Action Cache only endpoints should return CacheCapabilities.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/remotebuildexecution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const remotebuildexecution = google.remotebuildexecution('v2');
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
         *   const res = await remotebuildexecution.getCapabilities({
         *     // The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         *     instanceName: '.*',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cacheCapabilities": {},
         *   //   "deprecatedApiVersion": {},
         *   //   "executionCapabilities": {},
         *   //   "highApiVersion": {},
         *   //   "lowApiVersion": {}
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
        getCapabilities(params: Params$Resource$V2$Getcapabilities, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getCapabilities(params?: Params$Resource$V2$Getcapabilities, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BuildBazelRemoteExecutionV2ServerCapabilities>>;
        getCapabilities(params: Params$Resource$V2$Getcapabilities, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getCapabilities(params: Params$Resource$V2$Getcapabilities, options: MethodOptions | BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ServerCapabilities>, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ServerCapabilities>): void;
        getCapabilities(params: Params$Resource$V2$Getcapabilities, callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ServerCapabilities>): void;
        getCapabilities(callback: BodyResponseCallback<Schema$BuildBazelRemoteExecutionV2ServerCapabilities>): void;
    }
    export interface Params$Resource$V2$Getcapabilities extends StandardParameters {
        /**
         * The instance of the execution system to operate against. A server may support multiple instances of the execution system (with their own workers, storage, caches, etc.). The server MAY require use of this field to select between them in an implementation-defined fashion, otherwise it can be omitted.
         */
        instanceName?: string;
    }
    export {};
}
