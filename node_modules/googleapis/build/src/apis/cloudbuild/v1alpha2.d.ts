import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudbuild_v1alpha2 {
    export interface Options extends GlobalOptions {
        version: 'v1alpha2';
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
     * Cloud Build API
     *
     * Creates and manages builds on Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudbuild = google.cloudbuild('v1alpha2');
     * ```
     */
    export class Cloudbuild {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * ApprovalConfig describes configuration for manual approval of a build.
     */
    export interface Schema$ApprovalConfig {
        /**
         * Whether or not approval is needed. If this is set on a build, it will become pending when created, and will need to be explicitly approved to start.
         */
        approvalRequired?: boolean | null;
    }
    /**
     * ApprovalResult describes the decision and associated metadata of a manual approval of a build.
     */
    export interface Schema$ApprovalResult {
        /**
         * Output only. The time when the approval decision was made.
         */
        approvalTime?: string | null;
        /**
         * Output only. Email of the user that called the ApproveBuild API to approve or reject a build at the time that the API was called.
         */
        approverAccount?: string | null;
        /**
         * Optional. An optional comment for this manual approval result.
         */
        comment?: string | null;
        /**
         * Required. The decision of this manual approval.
         */
        decision?: string | null;
        /**
         * Optional. An optional URL tied to this manual approval result. This field is essentially the same as comment, except that it will be rendered by the UI differently. An example use case is a link to an external job that approved this Build.
         */
        url?: string | null;
    }
    /**
     * Files in the workspace to upload to Cloud Storage upon successful completion of all build steps.
     */
    export interface Schema$ArtifactObjects {
        /**
         * Cloud Storage bucket and optional object path, in the form "gs://bucket/path/to/somewhere/". (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)). Files in the workspace matching any path pattern will be uploaded to Cloud Storage with this location as a prefix.
         */
        location?: string | null;
        /**
         * Path globs used to match files in the build's workspace.
         */
        paths?: string[] | null;
        /**
         * Output only. Stores timing information for pushing all artifact objects.
         */
        timing?: Schema$TimeSpan;
    }
    /**
     * An artifact that was uploaded during a build. This is a single record in the artifact manifest JSON file.
     */
    export interface Schema$ArtifactResult {
        /**
         * The file hash of the artifact.
         */
        fileHash?: Schema$FileHashes[];
        /**
         * The path of an artifact in a Google Cloud Storage bucket, with the generation number. For example, `gs://mybucket/path/to/output.jar#generation`.
         */
        location?: string | null;
    }
    /**
     * Artifacts produced by a build that should be uploaded upon successful completion of all build steps.
     */
    export interface Schema$Artifacts {
        /**
         * A list of images to be pushed upon the successful completion of all build steps. The images will be pushed using the builder service account's credentials. The digests of the pushed images will be stored in the Build resource's results field. If any of the images fail to be pushed, the build is marked FAILURE.
         */
        images?: string[] | null;
        /**
         * A list of Maven artifacts to be uploaded to Artifact Registry upon successful completion of all build steps. Artifacts in the workspace matching specified paths globs will be uploaded to the specified Artifact Registry repository using the builder service account's credentials. If any artifacts fail to be pushed, the build is marked FAILURE.
         */
        mavenArtifacts?: Schema$MavenArtifact[];
        /**
         * A list of objects to be uploaded to Cloud Storage upon successful completion of all build steps. Files in the workspace matching specified paths globs will be uploaded to the specified Cloud Storage location using the builder service account's credentials. The location and generation of the uploaded objects will be stored in the Build resource's results field. If any objects fail to be pushed, the build is marked FAILURE.
         */
        objects?: Schema$ArtifactObjects;
        /**
         * A list of Python packages to be uploaded to Artifact Registry upon successful completion of all build steps. The build service account credentials will be used to perform the upload. If any objects fail to be pushed, the build is marked FAILURE.
         */
        pythonPackages?: Schema$PythonPackage[];
    }
    /**
     * Response of BatchCreateBitbucketServerConnectedRepositories RPC method including all successfully connected Bitbucket Server repositories.
     */
    export interface Schema$BatchCreateBitbucketServerConnectedRepositoriesResponse {
        /**
         * The connected Bitbucket Server repositories.
         */
        bitbucketServerConnectedRepositories?: Schema$BitbucketServerConnectedRepository[];
    }
    /**
     * Metadata for `BatchCreateBitbucketServerConnectedRepositories` operation.
     */
    export interface Schema$BatchCreateBitbucketServerConnectedRepositoriesResponseMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * The name of the `BitbucketServerConfig` that added connected repositories. Format: `projects/{project\}/locations/{location\}/bitbucketServerConfigs/{config\}`
         */
        config?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
    }
    /**
     * Response of BatchCreateGitLabConnectedRepositories RPC method.
     */
    export interface Schema$BatchCreateGitLabConnectedRepositoriesResponse {
        /**
         * The GitLab connected repository requests' responses.
         */
        gitlabConnectedRepositories?: Schema$GitLabConnectedRepository[];
    }
    /**
     * Metadata for `BatchCreateGitLabConnectedRepositories` operation.
     */
    export interface Schema$BatchCreateGitLabConnectedRepositoriesResponseMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * The name of the `GitLabConfig` that added connected repositories. Format: `projects/{project\}/locations/{location\}/gitLabConfigs/{config\}`
         */
        config?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
    }
    /**
     * Message for response of creating repositories in batch.
     */
    export interface Schema$BatchCreateRepositoriesResponse {
        /**
         * Repository resources created.
         */
        repositories?: Schema$Repository[];
    }
    /**
     * / BitbucketServerConnectedRepository represents a connected Bitbucket Server / repository.
     */
    export interface Schema$BitbucketServerConnectedRepository {
        /**
         * The name of the `BitbucketServerConfig` that added connected repository. Format: `projects/{project\}/locations/{location\}/bitbucketServerConfigs/{config\}`
         */
        parent?: string | null;
        /**
         * The Bitbucket Server repositories to connect.
         */
        repo?: Schema$BitbucketServerRepositoryId;
        /**
         * Output only. The status of the repo connection request.
         */
        status?: Schema$Status;
    }
    /**
     * BitbucketServerRepositoryId identifies a specific repository hosted on a Bitbucket Server.
     */
    export interface Schema$BitbucketServerRepositoryId {
        /**
         * Required. Identifier for the project storing the repository.
         */
        projectKey?: string | null;
        /**
         * Required. Identifier for the repository.
         */
        repoSlug?: string | null;
        /**
         * Output only. The ID of the webhook that was created for receiving events from this repo. We only create and manage a single webhook for each repo.
         */
        webhookId?: number | null;
    }
    /**
     * A build resource in the Cloud Build API. At a high level, a `Build` describes where to find source code, how to build it (for example, the builder image to run on the source), and where to store the built artifacts. Fields can include the following variables, which will be expanded when the build is created: - $PROJECT_ID: the project ID of the build. - $PROJECT_NUMBER: the project number of the build. - $LOCATION: the location/region of the build. - $BUILD_ID: the autogenerated ID of the build. - $REPO_NAME: the source repository name specified by RepoSource. - $BRANCH_NAME: the branch name specified by RepoSource. - $TAG_NAME: the tag name specified by RepoSource. - $REVISION_ID or $COMMIT_SHA: the commit SHA specified by RepoSource or resolved from the specified branch or tag. - $SHORT_SHA: first 7 characters of $REVISION_ID or $COMMIT_SHA.
     */
    export interface Schema$Build {
        /**
         * Output only. Describes this build's approval configuration, status, and result.
         */
        approval?: Schema$BuildApproval;
        /**
         * Artifacts produced by the build that should be uploaded upon successful completion of all build steps.
         */
        artifacts?: Schema$Artifacts;
        /**
         * Secrets and secret environment variables.
         */
        availableSecrets?: Schema$Secrets;
        /**
         * Output only. The ID of the `BuildTrigger` that triggered this build, if it was triggered automatically.
         */
        buildTriggerId?: string | null;
        /**
         * Output only. Time at which the request to create the build was received.
         */
        createTime?: string | null;
        /**
         * Output only. Contains information about the build when status=FAILURE.
         */
        failureInfo?: Schema$FailureInfo;
        /**
         * Output only. Time at which execution of the build was finished. The difference between finish_time and start_time is the duration of the build's execution.
         */
        finishTime?: string | null;
        /**
         * Output only. Unique identifier of the build.
         */
        id?: string | null;
        /**
         * A list of images to be pushed upon the successful completion of all build steps. The images are pushed using the builder service account's credentials. The digests of the pushed images will be stored in the `Build` resource's results field. If any of the images fail to be pushed, the build status is marked `FAILURE`.
         */
        images?: string[] | null;
        /**
         * Google Cloud Storage bucket where logs should be written (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)). Logs file names will be of the format `${logs_bucket\}/log-${build_id\}.txt`.
         */
        logsBucket?: string | null;
        /**
         * Output only. URL to logs for this build in Google Cloud Console.
         */
        logUrl?: string | null;
        /**
         * Output only. The 'Build' name with format: `projects/{project\}/locations/{location\}/builds/{build\}`, where {build\} is a unique identifier generated by the service.
         */
        name?: string | null;
        /**
         * Special options for this build.
         */
        options?: Schema$BuildOptions;
        /**
         * Output only. ID of the project.
         */
        projectId?: string | null;
        /**
         * TTL in queue for this build. If provided and the build is enqueued longer than this value, the build will expire and the build status will be `EXPIRED`. The TTL starts ticking from create_time.
         */
        queueTtl?: string | null;
        /**
         * Output only. Results of the build.
         */
        results?: Schema$Results;
        /**
         * Secrets to decrypt using Cloud Key Management Service. Note: Secret Manager is the recommended technique for managing sensitive data with Cloud Build. Use `available_secrets` to configure builds to access secrets from Secret Manager. For instructions, see: https://cloud.google.com/cloud-build/docs/securing-builds/use-secrets
         */
        secrets?: Schema$Secret[];
        /**
         * IAM service account whose credentials will be used at build runtime. Must be of the format `projects/{PROJECT_ID\}/serviceAccounts/{ACCOUNT\}`. ACCOUNT can be email address or uniqueId of the service account.
         */
        serviceAccount?: string | null;
        /**
         * The location of the source files to build.
         */
        source?: Schema$Source;
        /**
         * Output only. A permanent fixed identifier for source.
         */
        sourceProvenance?: Schema$SourceProvenance;
        /**
         * Output only. Time at which execution of the build was started.
         */
        startTime?: string | null;
        /**
         * Output only. Status of the build.
         */
        status?: string | null;
        /**
         * Output only. Customer-readable message about the current status.
         */
        statusDetail?: string | null;
        /**
         * Required. The operations to be performed on the workspace.
         */
        steps?: Schema$BuildStep[];
        /**
         * Substitutions data for `Build` resource.
         */
        substitutions?: {
            [key: string]: string;
        } | null;
        /**
         * Tags for annotation of a `Build`. These are not docker tags.
         */
        tags?: string[] | null;
        /**
         * Amount of time that this build should be allowed to run, to second granularity. If this amount of time elapses, work on the build will cease and the build status will be `TIMEOUT`. `timeout` starts ticking from `startTime`. Default time is ten minutes.
         */
        timeout?: string | null;
        /**
         * Output only. Stores timing information for phases of the build. Valid keys are: * BUILD: time to execute all build steps. * PUSH: time to push all artifacts including docker images and non docker artifacts. * FETCHSOURCE: time to fetch source. * SETUPBUILD: time to set up build. If the build does not specify source or images, these keys will not be included.
         */
        timing?: {
            [key: string]: Schema$TimeSpan;
        } | null;
        /**
         * Output only. Non-fatal problems encountered during the execution of the build.
         */
        warnings?: Schema$Warning[];
    }
    /**
     * BuildApproval describes a build's approval configuration, state, and result.
     */
    export interface Schema$BuildApproval {
        /**
         * Output only. Configuration for manual approval of this build.
         */
        config?: Schema$ApprovalConfig;
        /**
         * Output only. Result of manual approval for this Build.
         */
        result?: Schema$ApprovalResult;
        /**
         * Output only. The state of this build's approval.
         */
        state?: string | null;
    }
    /**
     * Metadata for build operations.
     */
    export interface Schema$BuildOperationMetadata {
        /**
         * The build that the operation is tracking.
         */
        build?: Schema$Build;
    }
    /**
     * Optional arguments to enable specific features of builds.
     */
    export interface Schema$BuildOptions {
        /**
         * Requested disk size for the VM that runs the build. Note that this is *NOT* "disk free"; some of the space will be used by the operating system and build utilities. Also note that this is the minimum disk size that will be allocated for the build -- the build may run with a larger disk than requested. At present, the maximum disk size is 2000GB; builds that request more than the maximum are rejected with an error.
         */
        diskSizeGb?: string | null;
        /**
         * Option to specify whether or not to apply bash style string operations to the substitutions. NOTE: this is always enabled for triggered builds and cannot be overridden in the build configuration file.
         */
        dynamicSubstitutions?: boolean | null;
        /**
         * A list of global environment variable definitions that will exist for all build steps in this build. If a variable is defined in both globally and in a build step, the variable will use the build step value. The elements are of the form "KEY=VALUE" for the environment variable "KEY" being given the value "VALUE".
         */
        env?: string[] | null;
        /**
         * Option to specify the logging mode, which determines if and where build logs are stored.
         */
        logging?: string | null;
        /**
         * Option to define build log streaming behavior to Google Cloud Storage.
         */
        logStreamingOption?: string | null;
        /**
         * Compute Engine machine type on which to run the build.
         */
        machineType?: string | null;
        /**
         * Optional. Specification for execution on a `WorkerPool`. See [running builds in a private pool](https://cloud.google.com/build/docs/private-pools/run-builds-in-private-pool) for more information.
         */
        pool?: Schema$PoolOption;
        /**
         * Requested verifiability options.
         */
        requestedVerifyOption?: string | null;
        /**
         * A list of global environment variables, which are encrypted using a Cloud Key Management Service crypto key. These values must be specified in the build's `Secret`. These variables will be available to all build steps in this build.
         */
        secretEnv?: string[] | null;
        /**
         * Requested hash for SourceProvenance.
         */
        sourceProvenanceHash?: string[] | null;
        /**
         * Option to specify behavior when there is an error in the substitution checks. NOTE: this is always set to ALLOW_LOOSE for triggered builds and cannot be overridden in the build configuration file.
         */
        substitutionOption?: string | null;
        /**
         * Global list of volumes to mount for ALL build steps Each volume is created as an empty volume prior to starting the build process. Upon completion of the build, volumes and their contents are discarded. Global volume names and paths cannot conflict with the volumes defined a build step. Using a global volume in a build with only one step is not valid as it is indicative of a build request with an incorrect configuration.
         */
        volumes?: Schema$Volume[];
        /**
         * This field deprecated; please use `pool.name` instead.
         */
        workerPool?: string | null;
    }
    /**
     * A step in the build pipeline.
     */
    export interface Schema$BuildStep {
        /**
         * Allow this build step to fail without failing the entire build if and only if the exit code is one of the specified codes. If allow_failure is also specified, this field will take precedence.
         */
        allowExitCodes?: number[] | null;
        /**
         * Allow this build step to fail without failing the entire build. If false, the entire build will fail if this step fails. Otherwise, the build will succeed, but this step will still have a failure status. Error information will be reported in the failure_detail field.
         */
        allowFailure?: boolean | null;
        /**
         * A list of arguments that will be presented to the step when it is started. If the image used to run the step's container has an entrypoint, the `args` are used as arguments to that entrypoint. If the image does not define an entrypoint, the first element in args is used as the entrypoint, and the remainder will be used as arguments.
         */
        args?: string[] | null;
        /**
         * Working directory to use when running this step's container. If this value is a relative path, it is relative to the build's working directory. If this value is absolute, it may be outside the build's working directory, in which case the contents of the path may not be persisted across build step executions, unless a `volume` for that path is specified. If the build specifies a `RepoSource` with `dir` and a step with a `dir`, which specifies an absolute path, the `RepoSource` `dir` is ignored for the step's execution.
         */
        dir?: string | null;
        /**
         * Entrypoint to be used instead of the build step image's default entrypoint. If unset, the image's default entrypoint is used.
         */
        entrypoint?: string | null;
        /**
         * A list of environment variable definitions to be used when running a step. The elements are of the form "KEY=VALUE" for the environment variable "KEY" being given the value "VALUE".
         */
        env?: string[] | null;
        /**
         * Output only. Return code from running the step.
         */
        exitCode?: number | null;
        /**
         * Unique identifier for this build step, used in `wait_for` to reference this build step as a dependency.
         */
        id?: string | null;
        /**
         * Required. The name of the container image that will run this particular build step. If the image is available in the host's Docker daemon's cache, it will be run directly. If not, the host will attempt to pull the image first, using the builder service account's credentials if necessary. The Docker daemon's cache will already have the latest versions of all of the officially supported build steps ([https://github.com/GoogleCloudPlatform/cloud-builders](https://github.com/GoogleCloudPlatform/cloud-builders)). The Docker daemon will also have cached many of the layers for some popular images, like "ubuntu", "debian", but they will be refreshed at the time you attempt to use them. If you built an image in a previous build step, it will be stored in the host's Docker daemon's cache and is available to use as the name for a later build step.
         */
        name?: string | null;
        /**
         * Output only. Stores timing information for pulling this build step's builder image only.
         */
        pullTiming?: Schema$TimeSpan;
        /**
         * A shell script to be executed in the step. When script is provided, the user cannot specify the entrypoint or args.
         */
        script?: string | null;
        /**
         * A list of environment variables which are encrypted using a Cloud Key Management Service crypto key. These values must be specified in the build's `Secret`.
         */
        secretEnv?: string[] | null;
        /**
         * Output only. Status of the build step. At this time, build step status is only updated on build completion; step status is not updated in real-time as the build progresses.
         */
        status?: string | null;
        /**
         * Time limit for executing this build step. If not defined, the step has no time limit and will be allowed to continue to run until either it completes or the build itself times out.
         */
        timeout?: string | null;
        /**
         * Output only. Stores timing information for executing this build step.
         */
        timing?: Schema$TimeSpan;
        /**
         * List of volumes to mount into the build step. Each volume is created as an empty volume prior to execution of the build step. Upon completion of the build, volumes and their contents are discarded. Using a named volume in only one step is not valid as it is indicative of a build request with an incorrect configuration.
         */
        volumes?: Schema$Volume[];
        /**
         * The ID(s) of the step(s) that this build step depends on. This build step will not start until all the build steps in `wait_for` have completed successfully. If `wait_for` is empty, this build step will start when all previous build steps in the `Build.Steps` list have completed successfully.
         */
        waitFor?: string[] | null;
    }
    /**
     * An image built by the pipeline.
     */
    export interface Schema$BuiltImage {
        /**
         * Docker Registry 2.0 digest.
         */
        digest?: string | null;
        /**
         * Name used to push the container image to Google Container Registry, as presented to `docker push`.
         */
        name?: string | null;
        /**
         * Output only. Stores timing information for pushing the specified image.
         */
        pushTiming?: Schema$TimeSpan;
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Metadata for `CreateBitbucketServerConfig` operation.
     */
    export interface Schema$CreateBitbucketServerConfigOperationMetadata {
        /**
         * The resource name of the BitbucketServerConfig to be created. Format: `projects/{project\}/locations/{location\}/bitbucketServerConfigs/{id\}`.
         */
        bitbucketServerConfig?: string | null;
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
    }
    /**
     * Metadata for `CreateGithubEnterpriseConfig` operation.
     */
    export interface Schema$CreateGitHubEnterpriseConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitHubEnterprise to be created. Format: `projects/{project\}/locations/{location\}/githubEnterpriseConfigs/{id\}`.
         */
        githubEnterpriseConfig?: string | null;
    }
    /**
     * Metadata for `CreateGitLabConfig` operation.
     */
    export interface Schema$CreateGitLabConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitLabConfig to be created. Format: `projects/{project\}/locations/{location\}/gitlabConfigs/{id\}`.
         */
        gitlabConfig?: string | null;
    }
    /**
     * Metadata for the `CreateWorkerPool` operation.
     */
    export interface Schema$CreateWorkerPoolOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the `WorkerPool` to create. Format: `projects/{project\}/locations/{location\}/workerPools/{worker_pool\}`.
         */
        workerPool?: string | null;
    }
    /**
     * Metadata for `DeleteBitbucketServerConfig` operation.
     */
    export interface Schema$DeleteBitbucketServerConfigOperationMetadata {
        /**
         * The resource name of the BitbucketServerConfig to be deleted. Format: `projects/{project\}/locations/{location\}/bitbucketServerConfigs/{id\}`.
         */
        bitbucketServerConfig?: string | null;
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
    }
    /**
     * Metadata for `DeleteGitHubEnterpriseConfig` operation.
     */
    export interface Schema$DeleteGitHubEnterpriseConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitHubEnterprise to be deleted. Format: `projects/{project\}/locations/{location\}/githubEnterpriseConfigs/{id\}`.
         */
        githubEnterpriseConfig?: string | null;
    }
    /**
     * Metadata for `DeleteGitLabConfig` operation.
     */
    export interface Schema$DeleteGitLabConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitLabConfig to be created. Format: `projects/{project\}/locations/{location\}/gitlabConfigs/{id\}`.
         */
        gitlabConfig?: string | null;
    }
    /**
     * Metadata for the `DeleteWorkerPool` operation.
     */
    export interface Schema$DeleteWorkerPoolOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the `WorkerPool` being deleted. Format: `projects/{project\}/locations/{location\}/workerPools/{worker_pool\}`.
         */
        workerPool?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * A fatal problem encountered during the execution of the build.
     */
    export interface Schema$FailureInfo {
        /**
         * Explains the failure issue in more detail using hard-coded text.
         */
        detail?: string | null;
        /**
         * The name of the failure.
         */
        type?: string | null;
    }
    /**
     * Container message for hashes of byte content of files, used in SourceProvenance messages to verify integrity of source input to the build.
     */
    export interface Schema$FileHashes {
        /**
         * Collection of file hashes.
         */
        fileHash?: Schema$Hash[];
    }
    /**
     * GitLabConnectedRepository represents a GitLab connected repository request response.
     */
    export interface Schema$GitLabConnectedRepository {
        /**
         * The name of the `GitLabConfig` that added connected repository. Format: `projects/{project\}/locations/{location\}/gitLabConfigs/{config\}`
         */
        parent?: string | null;
        /**
         * The GitLab repositories to connect.
         */
        repo?: Schema$GitLabRepositoryId;
        /**
         * Output only. The status of the repo connection request.
         */
        status?: Schema$Status;
    }
    /**
     * GitLabRepositoryId identifies a specific repository hosted on GitLab.com or GitLabEnterprise
     */
    export interface Schema$GitLabRepositoryId {
        /**
         * Required. Identifier for the repository. example: "namespace/project-slug", namespace is usually the username or group ID
         */
        id?: string | null;
        /**
         * Output only. The ID of the webhook that was created for receiving events from this repo. We only create and manage a single webhook for each repo.
         */
        webhookId?: number | null;
    }
    /**
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$GoogleDevtoolsCloudbuildV2OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        requestedCancellation?: boolean | null;
        /**
         * Output only. Human-readable status of the operation, if any.
         */
        statusMessage?: string | null;
        /**
         * Output only. Server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Output only. Name of the verb executed by the operation.
         */
        verb?: string | null;
    }
    /**
     * Container message for hash values.
     */
    export interface Schema$Hash {
        /**
         * The type of hash that was performed.
         */
        type?: string | null;
        /**
         * The hash value.
         */
        value?: string | null;
    }
    /**
     * HTTPDelivery is the delivery configuration for an HTTP notification.
     */
    export interface Schema$HTTPDelivery {
        /**
         * The URI to which JSON-containing HTTP POST requests should be sent.
         */
        uri?: string | null;
    }
    /**
     * Pairs a set of secret environment variables mapped to encrypted values with the Cloud KMS key to use to decrypt the value.
     */
    export interface Schema$InlineSecret {
        /**
         * Map of environment variable name to its encrypted value. Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step. Values can be at most 64 KB in size. There can be at most 100 secret values across all of a build's secrets.
         */
        envMap?: {
            [key: string]: string;
        } | null;
        /**
         * Resource name of Cloud KMS crypto key to decrypt the encrypted value. In format: projects/x/locations/x/keyRings/x/cryptoKeys/x
         */
        kmsKeyName?: string | null;
    }
    /**
     * Response containing existing `WorkerPools`.
     */
    export interface Schema$ListWorkerPoolsResponse {
        /**
         * `WorkerPools` for the specified project.
         */
        workerPools?: Schema$WorkerPool[];
    }
    /**
     * A Maven artifact to upload to Artifact Registry upon successful completion of all build steps.
     */
    export interface Schema$MavenArtifact {
        /**
         * Maven `artifactId` value used when uploading the artifact to Artifact Registry.
         */
        artifactId?: string | null;
        /**
         * Maven `groupId` value used when uploading the artifact to Artifact Registry.
         */
        groupId?: string | null;
        /**
         * Path to an artifact in the build's workspace to be uploaded to Artifact Registry. This can be either an absolute path, e.g. /workspace/my-app/target/my-app-1.0.SNAPSHOT.jar or a relative path from /workspace, e.g. my-app/target/my-app-1.0.SNAPSHOT.jar.
         */
        path?: string | null;
        /**
         * Artifact Registry repository, in the form "https://$REGION-maven.pkg.dev/$PROJECT/$REPOSITORY" Artifact in the workspace specified by path will be uploaded to Artifact Registry with this location as a prefix.
         */
        repository?: string | null;
        /**
         * Maven `version` value used when uploading the artifact to Artifact Registry.
         */
        version?: string | null;
    }
    /**
     * Network describes the network configuration for a `WorkerPool`.
     */
    export interface Schema$NetworkConfig {
        /**
         * Required. Immutable. The network definition that the workers are peered to. If this section is left empty, the workers will be peered to WorkerPool.project_id on the default network. Must be in the format `projects/{project\}/global/networks/{network\}`, where {project\} is a project number, such as `12345`, and {network\} is the name of a VPC network in the project.
         */
        peeredNetwork?: string | null;
    }
    /**
     * Notification is the container which holds the data that is relevant to this particular notification.
     */
    export interface Schema$Notification {
        /**
         * The filter string to use for notification filtering. Currently, this is assumed to be a CEL program. See https://opensource.google/projects/cel for more.
         */
        filter?: string | null;
        /**
         * Configuration for HTTP delivery.
         */
        httpDelivery?: Schema$HTTPDelivery;
        /**
         * Configuration for Slack delivery.
         */
        slackDelivery?: Schema$SlackDelivery;
        /**
         * Configuration for SMTP (email) delivery.
         */
        smtpDelivery?: Schema$SMTPDelivery;
        /**
         * Escape hatch for users to supply custom delivery configs.
         */
        structDelivery?: {
            [key: string]: any;
        } | null;
    }
    /**
     * NotifierConfig is the top-level configuration message.
     */
    export interface Schema$NotifierConfig {
        /**
         * The API version of this configuration format.
         */
        apiVersion?: string | null;
        /**
         * The type of notifier to use (e.g. SMTPNotifier).
         */
        kind?: string | null;
        /**
         * Metadata for referring to/handling/deploying this notifier.
         */
        metadata?: Schema$NotifierMetadata;
        /**
         * The actual configuration for this notifier.
         */
        spec?: Schema$NotifierSpec;
    }
    /**
     * NotifierMetadata contains the data which can be used to reference or describe this notifier.
     */
    export interface Schema$NotifierMetadata {
        /**
         * The human-readable and user-given name for the notifier. For example: "repo-merge-email-notifier".
         */
        name?: string | null;
        /**
         * The string representing the name and version of notifier to deploy. Expected to be of the form of "/:". For example: "gcr.io/my-project/notifiers/smtp:1.2.34".
         */
        notifier?: string | null;
    }
    /**
     * NotifierSecret is the container that maps a secret name (reference) to its Google Cloud Secret Manager resource path.
     */
    export interface Schema$NotifierSecret {
        /**
         * Name is the local name of the secret, such as the verbatim string "my-smtp-password".
         */
        name?: string | null;
        /**
         * Value is interpreted to be a resource path for fetching the actual (versioned) secret data for this secret. For example, this would be a Google Cloud Secret Manager secret version resource path like: "projects/my-project/secrets/my-secret/versions/latest".
         */
        value?: string | null;
    }
    /**
     * NotifierSecretRef contains the reference to a secret stored in the corresponding NotifierSpec.
     */
    export interface Schema$NotifierSecretRef {
        /**
         * The value of `secret_ref` should be a `name` that is registered in a `Secret` in the `secrets` list of the `Spec`.
         */
        secretRef?: string | null;
    }
    /**
     * NotifierSpec is the configuration container for notifications.
     */
    export interface Schema$NotifierSpec {
        /**
         * The configuration of this particular notifier.
         */
        notification?: Schema$Notification;
        /**
         * Configurations for secret resources used by this particular notifier.
         */
        secrets?: Schema$NotifierSecret[];
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
         * The normal response of the operation in case of success. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents the metadata of the long-running operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have been cancelled successfully have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        cancelRequested?: boolean | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. Human-readable status of the operation, if any.
         */
        statusDetail?: string | null;
        /**
         * Output only. Server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Output only. Name of the verb executed by the operation.
         */
        verb?: string | null;
    }
    /**
     * Details about how a build should be executed on a `WorkerPool`. See [running builds in a private pool](https://cloud.google.com/build/docs/private-pools/run-builds-in-private-pool) for more information.
     */
    export interface Schema$PoolOption {
        /**
         * The `WorkerPool` resource to execute the build on. You must have `cloudbuild.workerpools.use` on the project hosting the WorkerPool. Format projects/{project\}/locations/{location\}/workerPools/{workerPoolId\}
         */
        name?: string | null;
    }
    /**
     * Metadata for `ProcessAppManifestCallback` operation.
     */
    export interface Schema$ProcessAppManifestCallbackOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitHubEnterprise to be created. Format: `projects/{project\}/locations/{location\}/githubEnterpriseConfigs/{id\}`.
         */
        githubEnterpriseConfig?: string | null;
    }
    /**
     * Python package to upload to Artifact Registry upon successful completion of all build steps. A package can encapsulate multiple objects to be uploaded to a single repository.
     */
    export interface Schema$PythonPackage {
        /**
         * Path globs used to match files in the build's workspace. For Python/ Twine, this is usually `dist/x`, and sometimes additionally an `.asc` file.
         */
        paths?: string[] | null;
        /**
         * Artifact Registry repository, in the form "https://$REGION-python.pkg.dev/$PROJECT/$REPOSITORY" Files in the workspace matching any path pattern will be uploaded to Artifact Registry with this location as a prefix.
         */
        repository?: string | null;
    }
    /**
     * A repository associated to a parent connection.
     */
    export interface Schema$Repository {
        /**
         * Allows clients to store small amounts of arbitrary data.
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. Server assigned timestamp for when the connection was created.
         */
        createTime?: string | null;
        /**
         * This checksum is computed by the server based on the value of other fields, and may be sent on update and delete requests to ensure the client has an up-to-date value before proceeding.
         */
        etag?: string | null;
        /**
         * Immutable. Resource name of the repository, in the format `projects/x/locations/x/connections/x/repositories/x`.
         */
        name?: string | null;
        /**
         * Required. Git Clone HTTPS URI.
         */
        remoteUri?: string | null;
        /**
         * Output only. Server assigned timestamp for when the connection was updated.
         */
        updateTime?: string | null;
    }
    /**
     * Location of the source in a Google Cloud Source Repository.
     */
    export interface Schema$RepoSource {
        /**
         * Regex matching branches to build. The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax
         */
        branchName?: string | null;
        /**
         * Explicit commit SHA to build.
         */
        commitSha?: string | null;
        /**
         * Directory, relative to the source root, in which to run the build. This must be a relative path. If a step's `dir` is specified and is an absolute path, this value is ignored for that step's execution.
         */
        dir?: string | null;
        /**
         * Only trigger a build if the revision regex does NOT match the revision regex.
         */
        invertRegex?: boolean | null;
        /**
         * ID of the project that owns the Cloud Source Repository. If omitted, the project ID requesting the build is assumed.
         */
        projectId?: string | null;
        /**
         * Name of the Cloud Source Repository.
         */
        repoName?: string | null;
        /**
         * Substitutions to use in a triggered build. Should only be used with RunBuildTrigger
         */
        substitutions?: {
            [key: string]: string;
        } | null;
        /**
         * Regex matching tags to build. The syntax of the regular expressions accepted is the syntax accepted by RE2 and described at https://github.com/google/re2/wiki/Syntax
         */
        tagName?: string | null;
    }
    /**
     * Artifacts created by the build pipeline.
     */
    export interface Schema$Results {
        /**
         * Path to the artifact manifest for non-container artifacts uploaded to Cloud Storage. Only populated when artifacts are uploaded to Cloud Storage.
         */
        artifactManifest?: string | null;
        /**
         * Time to push all non-container artifacts to Cloud Storage.
         */
        artifactTiming?: Schema$TimeSpan;
        /**
         * List of build step digests, in the order corresponding to build step indices.
         */
        buildStepImages?: string[] | null;
        /**
         * List of build step outputs, produced by builder images, in the order corresponding to build step indices. [Cloud Builders](https://cloud.google.com/cloud-build/docs/cloud-builders) can produce this output by writing to `$BUILDER_OUTPUT/output`. Only the first 4KB of data is stored.
         */
        buildStepOutputs?: string[] | null;
        /**
         * Container images that were built as a part of the build.
         */
        images?: Schema$BuiltImage[];
        /**
         * Maven artifacts uploaded to Artifact Registry at the end of the build.
         */
        mavenArtifacts?: Schema$UploadedMavenArtifact[];
        /**
         * Number of non-container artifacts uploaded to Cloud Storage. Only populated when artifacts are uploaded to Cloud Storage.
         */
        numArtifacts?: string | null;
        /**
         * Python artifacts uploaded to Artifact Registry at the end of the build.
         */
        pythonPackages?: Schema$UploadedPythonPackage[];
    }
    /**
     * Represents the custom metadata of the RunWorkflow long-running operation.
     */
    export interface Schema$RunWorkflowCustomOperationMetadata {
        /**
         * Output only. API version used to start the operation.
         */
        apiVersion?: string | null;
        /**
         * Output only. The time the operation was created.
         */
        createTime?: string | null;
        /**
         * Output only. The time the operation finished running.
         */
        endTime?: string | null;
        /**
         * Output only. ID of the pipeline run created by RunWorkflow.
         */
        pipelineRunId?: string | null;
        /**
         * Output only. Identifies whether the user has requested cancellation of the operation. Operations that have successfully been cancelled have Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         */
        requestedCancellation?: boolean | null;
        /**
         * Output only. Server-defined resource path for the target of the operation.
         */
        target?: string | null;
        /**
         * Output only. Name of the verb executed by the operation.
         */
        verb?: string | null;
    }
    /**
     * Pairs a set of secret environment variables containing encrypted values with the Cloud KMS key to use to decrypt the value. Note: Use `kmsKeyName` with `available_secrets` instead of using `kmsKeyName` with `secret`. For instructions see: https://cloud.google.com/cloud-build/docs/securing-builds/use-encrypted-credentials.
     */
    export interface Schema$Secret {
        /**
         * Cloud KMS key name to use to decrypt these envs.
         */
        kmsKeyName?: string | null;
        /**
         * Map of environment variable name to its encrypted value. Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step. Values can be at most 64 KB in size. There can be at most 100 secret values across all of a build's secrets.
         */
        secretEnv?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Pairs a secret environment variable with a SecretVersion in Secret Manager.
     */
    export interface Schema$SecretManagerSecret {
        /**
         * Environment variable name to associate with the secret. Secret environment variables must be unique across all of a build's secrets, and must be used by at least one build step.
         */
        env?: string | null;
        /**
         * Resource name of the SecretVersion. In format: projects/x/secrets/x/versions/x
         */
        versionName?: string | null;
    }
    /**
     * Secrets and secret environment variables.
     */
    export interface Schema$Secrets {
        /**
         * Secrets encrypted with KMS key and the associated secret environment variable.
         */
        inline?: Schema$InlineSecret[];
        /**
         * Secrets in Secret Manager and associated secret environment variable.
         */
        secretManager?: Schema$SecretManagerSecret[];
    }
    /**
     * SlackDelivery is the delivery configuration for delivering Slack messages via webhooks. See Slack webhook documentation at: https://api.slack.com/messaging/webhooks.
     */
    export interface Schema$SlackDelivery {
        /**
         * The secret reference for the Slack webhook URI for sending messages to a channel.
         */
        webhookUri?: Schema$NotifierSecretRef;
    }
    /**
     * SMTPDelivery is the delivery configuration for an SMTP (email) notification.
     */
    export interface Schema$SMTPDelivery {
        /**
         * This is the SMTP account/email that appears in the `From:` of the email. If empty, it is assumed to be sender.
         */
        fromAddress?: string | null;
        /**
         * The SMTP sender's password.
         */
        password?: Schema$NotifierSecretRef;
        /**
         * The SMTP port of the server.
         */
        port?: string | null;
        /**
         * This is the list of addresses to which we send the email (i.e. in the `To:` of the email).
         */
        recipientAddresses?: string[] | null;
        /**
         * This is the SMTP account/email that is used to send the message.
         */
        senderAddress?: string | null;
        /**
         * The address of the SMTP server.
         */
        server?: string | null;
    }
    /**
     * Location of the source in a supported storage service.
     */
    export interface Schema$Source {
        /**
         * If provided, get the source from this location in a Cloud Source Repository.
         */
        repoSource?: Schema$RepoSource;
        /**
         * If provided, get the source from this location in Google Cloud Storage.
         */
        storageSource?: Schema$StorageSource;
        /**
         * If provided, get the source from this manifest in Google Cloud Storage. This feature is in Preview; see description [here](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/gcs-fetcher).
         */
        storageSourceManifest?: Schema$StorageSourceManifest;
    }
    /**
     * Provenance of the source. Ways to find the original source, or verify that some source was used for this build.
     */
    export interface Schema$SourceProvenance {
        /**
         * Output only. Hash(es) of the build source, which can be used to verify that the original source integrity was maintained in the build. Note that `FileHashes` will only be populated if `BuildOptions` has requested a `SourceProvenanceHash`. The keys to this map are file paths used as build source and the values contain the hash values for those files. If the build source came in a single package such as a gzipped tarfile (`.tar.gz`), the `FileHash` will be for the single path to that file.
         */
        fileHashes?: {
            [key: string]: Schema$FileHashes;
        } | null;
        /**
         * A copy of the build's `source.repo_source`, if exists, with any revisions resolved.
         */
        resolvedRepoSource?: Schema$RepoSource;
        /**
         * A copy of the build's `source.storage_source`, if exists, with any generations resolved.
         */
        resolvedStorageSource?: Schema$StorageSource;
        /**
         * A copy of the build's `source.storage_source_manifest`, if exists, with any revisions resolved. This feature is in Preview.
         */
        resolvedStorageSourceManifest?: Schema$StorageSourceManifest;
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
     * Location of the source in an archive file in Google Cloud Storage.
     */
    export interface Schema$StorageSource {
        /**
         * Google Cloud Storage bucket containing the source (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).
         */
        bucket?: string | null;
        /**
         * Google Cloud Storage generation for the object. If the generation is omitted, the latest generation will be used.
         */
        generation?: string | null;
        /**
         * Google Cloud Storage object containing the source. This object must be a zipped (`.zip`) or gzipped archive file (`.tar.gz`) containing source to build.
         */
        object?: string | null;
    }
    /**
     * Location of the source manifest in Google Cloud Storage. This feature is in Preview; see description [here](https://github.com/GoogleCloudPlatform/cloud-builders/tree/master/gcs-fetcher).
     */
    export interface Schema$StorageSourceManifest {
        /**
         * Google Cloud Storage bucket containing the source manifest (see [Bucket Name Requirements](https://cloud.google.com/storage/docs/bucket-naming#requirements)).
         */
        bucket?: string | null;
        /**
         * Google Cloud Storage generation for the object. If the generation is omitted, the latest generation will be used.
         */
        generation?: string | null;
        /**
         * Google Cloud Storage object containing the source manifest. This object must be a JSON file.
         */
        object?: string | null;
    }
    /**
     * Start and end times for a build execution phase.
     */
    export interface Schema$TimeSpan {
        /**
         * End of time span.
         */
        endTime?: string | null;
        /**
         * Start of time span.
         */
        startTime?: string | null;
    }
    /**
     * Metadata for `UpdateBitbucketServerConfig` operation.
     */
    export interface Schema$UpdateBitbucketServerConfigOperationMetadata {
        /**
         * The resource name of the BitbucketServerConfig to be updated. Format: `projects/{project\}/locations/{location\}/bitbucketServerConfigs/{id\}`.
         */
        bitbucketServerConfig?: string | null;
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
    }
    /**
     * Metadata for `UpdateGitHubEnterpriseConfig` operation.
     */
    export interface Schema$UpdateGitHubEnterpriseConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitHubEnterprise to be updated. Format: `projects/{project\}/locations/{location\}/githubEnterpriseConfigs/{id\}`.
         */
        githubEnterpriseConfig?: string | null;
    }
    /**
     * Metadata for `UpdateGitLabConfig` operation.
     */
    export interface Schema$UpdateGitLabConfigOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the GitLabConfig to be created. Format: `projects/{project\}/locations/{location\}/gitlabConfigs/{id\}`.
         */
        gitlabConfig?: string | null;
    }
    /**
     * Metadata for the `UpdateWorkerPool` operation.
     */
    export interface Schema$UpdateWorkerPoolOperationMetadata {
        /**
         * Time the operation was completed.
         */
        completeTime?: string | null;
        /**
         * Time the operation was created.
         */
        createTime?: string | null;
        /**
         * The resource name of the `WorkerPool` being updated. Format: `projects/{project\}/locations/{location\}/workerPools/{worker_pool\}`.
         */
        workerPool?: string | null;
    }
    /**
     * A Maven artifact uploaded using the MavenArtifact directive.
     */
    export interface Schema$UploadedMavenArtifact {
        /**
         * Hash types and values of the Maven Artifact.
         */
        fileHashes?: Schema$FileHashes;
        /**
         * Output only. Stores timing information for pushing the specified artifact.
         */
        pushTiming?: Schema$TimeSpan;
        /**
         * URI of the uploaded artifact.
         */
        uri?: string | null;
    }
    /**
     * Artifact uploaded using the PythonPackage directive.
     */
    export interface Schema$UploadedPythonPackage {
        /**
         * Hash types and values of the Python Artifact.
         */
        fileHashes?: Schema$FileHashes;
        /**
         * Output only. Stores timing information for pushing the specified artifact.
         */
        pushTiming?: Schema$TimeSpan;
        /**
         * URI of the uploaded artifact.
         */
        uri?: string | null;
    }
    /**
     * Volume describes a Docker container volume which is mounted into build steps in order to persist files across build step execution.
     */
    export interface Schema$Volume {
        /**
         * Name of the volume to mount. Volume names must be unique per build step and must be valid names for Docker volumes. Each named volume must be used by at least two build steps.
         */
        name?: string | null;
        /**
         * Path at which to mount the volume. Paths must be absolute and cannot conflict with other volume paths on the same build step or with certain reserved volume paths.
         */
        path?: string | null;
    }
    /**
     * A non-fatal problem encountered during the execution of the build.
     */
    export interface Schema$Warning {
        /**
         * The priority for this warning.
         */
        priority?: string | null;
        /**
         * Explanation of the warning generated.
         */
        text?: string | null;
    }
    /**
     * WorkerConfig defines the configuration to be used for a creating workers in the pool.
     */
    export interface Schema$WorkerConfig {
        /**
         * Size of the disk attached to the worker, in GB. See https://cloud.google.com/compute/docs/disks/ If `0` is specified, Cloud Build will use a standard disk size.
         */
        diskSizeGb?: string | null;
        /**
         * Machine Type of the worker, such as n1-standard-1. See https://cloud.google.com/compute/docs/machine-types. If left blank, Cloud Build will use a standard unspecified machine to create the worker pool.
         */
        machineType?: string | null;
    }
    /**
     * Configuration for a WorkerPool to run the builds. Workers are machines that Cloud Build uses to run your builds. By default, all workers run in a project owned by Cloud Build. To have full control over the workers that execute your builds -- such as enabling them to access private resources on your private network -- you can request Cloud Build to run the workers in your own project by creating a custom workers pool.
     */
    export interface Schema$WorkerPool {
        /**
         * Output only. Time at which the request to create the `WorkerPool` was received.
         */
        createTime?: string | null;
        /**
         * Output only. Time at which the request to delete the `WorkerPool` was received.
         */
        deleteTime?: string | null;
        /**
         * Output only. The resource name of the `WorkerPool`. Format of the name is `projects/{project_id\}/workerPools/{worker_pool_id\}`, where the value of {worker_pool_id\} is provided in the CreateWorkerPool request.
         */
        name?: string | null;
        /**
         * Network configuration for the `WorkerPool`.
         */
        networkConfig?: Schema$NetworkConfig;
        /**
         * Required. Immutable. The region where the `WorkerPool` runs. Only "us-central1" is currently supported. Note that `region` cannot be changed once the `WorkerPool` is created.
         */
        region?: string | null;
        /**
         * Output only. WorkerPool state.
         */
        state?: string | null;
        /**
         * Output only. Time at which the request to update the `WorkerPool` was received.
         */
        updateTime?: string | null;
        /**
         * Worker configuration for the `WorkerPool`.
         */
        workerConfig?: Schema$WorkerConfig;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        workerPools: Resource$Projects$Workerpools;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        operations: Resource$Projects$Locations$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.locations.operations.cancel({
         *     // The name of the operation resource to be cancelled.
         *     name: 'projects/my-project/locations/my-location/operations/my-operation',
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
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Projects$Locations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.locations.operations.get({
         *     // The name of the operation resource.
         *     name: 'projects/my-project/locations/my-location/operations/my-operation',
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
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Workerpools {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a `WorkerPool` to run the builds, and returns the new worker pool.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.workerPools.create({
         *     // Required. The parent resource where this book will be created. Format: projects/{project\}
         *     parent: 'projects/my-project',
         *     // Required. Immutable. The ID to use for the `WorkerPool`, which will become the final component of the resource name. This value should be 1-63 characters, and valid characters are /a-z-/.
         *     workerPoolId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "deleteTime": "my_deleteTime",
         *       //   "name": "my_name",
         *       //   "networkConfig": {},
         *       //   "region": "my_region",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "workerConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "name": "my_name",
         *   //   "networkConfig": {},
         *   //   "region": "my_region",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "workerConfig": {}
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
        create(params: Params$Resource$Projects$Workerpools$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Workerpools$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkerPool>>;
        create(params: Params$Resource$Projects$Workerpools$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Workerpools$Create, options: MethodOptions | BodyResponseCallback<Schema$WorkerPool>, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        create(params: Params$Resource$Projects$Workerpools$Create, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        create(callback: BodyResponseCallback<Schema$WorkerPool>): void;
        /**
         * Deletes a `WorkerPool`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.workerPools.delete({
         *     // Required. The name of the `WorkerPool` to delete. Format: projects/{project\}/workerPools/{workerPool\}
         *     name: 'projects/my-project/workerPools/my-workerPool',
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
        delete(params: Params$Resource$Projects$Workerpools$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Workerpools$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Workerpools$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Workerpools$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Workerpools$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns details of a `WorkerPool`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.workerPools.get({
         *     // Required. The name of the `WorkerPool` to retrieve. Format: projects/{project\}/workerPools/{workerPool\}
         *     name: 'projects/my-project/workerPools/my-workerPool',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "name": "my_name",
         *   //   "networkConfig": {},
         *   //   "region": "my_region",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "workerConfig": {}
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
        get(params: Params$Resource$Projects$Workerpools$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Workerpools$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkerPool>>;
        get(params: Params$Resource$Projects$Workerpools$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Workerpools$Get, options: MethodOptions | BodyResponseCallback<Schema$WorkerPool>, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        get(params: Params$Resource$Projects$Workerpools$Get, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        get(callback: BodyResponseCallback<Schema$WorkerPool>): void;
        /**
         * Lists `WorkerPool`s by project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.workerPools.list({
         *     // Required. The parent, which owns this collection of `WorkerPools`. Format: projects/{project\}
         *     parent: 'projects/my-project',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "workerPools": []
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
        list(params: Params$Resource$Projects$Workerpools$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Workerpools$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListWorkerPoolsResponse>>;
        list(params: Params$Resource$Projects$Workerpools$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Workerpools$List, options: MethodOptions | BodyResponseCallback<Schema$ListWorkerPoolsResponse>, callback: BodyResponseCallback<Schema$ListWorkerPoolsResponse>): void;
        list(params: Params$Resource$Projects$Workerpools$List, callback: BodyResponseCallback<Schema$ListWorkerPoolsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListWorkerPoolsResponse>): void;
        /**
         * Updates a `WorkerPool`.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudbuild.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudbuild = google.cloudbuild('v1alpha2');
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
         *   const res = await cloudbuild.projects.workerPools.patch({
         *     // Output only. The resource name of the `WorkerPool`. Format of the name is `projects/{project_id\}/workerPools/{worker_pool_id\}`, where the value of {worker_pool_id\} is provided in the CreateWorkerPool request.
         *     name: 'projects/my-project/workerPools/my-workerPool',
         *     // A mask specifying which fields in `WorkerPool` should be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "deleteTime": "my_deleteTime",
         *       //   "name": "my_name",
         *       //   "networkConfig": {},
         *       //   "region": "my_region",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "workerConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "name": "my_name",
         *   //   "networkConfig": {},
         *   //   "region": "my_region",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "workerConfig": {}
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
        patch(params: Params$Resource$Projects$Workerpools$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Workerpools$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WorkerPool>>;
        patch(params: Params$Resource$Projects$Workerpools$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Workerpools$Patch, options: MethodOptions | BodyResponseCallback<Schema$WorkerPool>, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        patch(params: Params$Resource$Projects$Workerpools$Patch, callback: BodyResponseCallback<Schema$WorkerPool>): void;
        patch(callback: BodyResponseCallback<Schema$WorkerPool>): void;
    }
    export interface Params$Resource$Projects$Workerpools$Create extends StandardParameters {
        /**
         * Required. The parent resource where this book will be created. Format: projects/{project\}
         */
        parent?: string;
        /**
         * Required. Immutable. The ID to use for the `WorkerPool`, which will become the final component of the resource name. This value should be 1-63 characters, and valid characters are /a-z-/.
         */
        workerPoolId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkerPool;
    }
    export interface Params$Resource$Projects$Workerpools$Delete extends StandardParameters {
        /**
         * Required. The name of the `WorkerPool` to delete. Format: projects/{project\}/workerPools/{workerPool\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Workerpools$Get extends StandardParameters {
        /**
         * Required. The name of the `WorkerPool` to retrieve. Format: projects/{project\}/workerPools/{workerPool\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Workerpools$List extends StandardParameters {
        /**
         * Required. The parent, which owns this collection of `WorkerPools`. Format: projects/{project\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Workerpools$Patch extends StandardParameters {
        /**
         * Output only. The resource name of the `WorkerPool`. Format of the name is `projects/{project_id\}/workerPools/{worker_pool_id\}`, where the value of {worker_pool_id\} is provided in the CreateWorkerPool request.
         */
        name?: string;
        /**
         * A mask specifying which fields in `WorkerPool` should be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WorkerPool;
    }
    export {};
}
