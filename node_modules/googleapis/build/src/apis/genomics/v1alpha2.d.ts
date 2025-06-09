import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace genomics_v1alpha2 {
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
     * Genomics API
     *
     * Uploads, processes, queries, and searches Genomics data in the cloud.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const genomics = google.genomics('v1alpha2');
     * ```
     */
    export class Genomics {
        context: APIRequestContext;
        operations: Resource$Operations;
        pipelines: Resource$Pipelines;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * The request message for Operations.CancelOperation.
     */
    export interface Schema$CancelOperationRequest {
    }
    /**
     * Describes a Compute Engine resource that is being managed by a running pipeline.
     */
    export interface Schema$ComputeEngine {
        /**
         * The names of the disks that were created for this pipeline.
         */
        diskNames?: string[] | null;
        /**
         * The instance on which the operation is running.
         */
        instanceName?: string | null;
        /**
         * The machine type of the instance.
         */
        machineType?: string | null;
        /**
         * The availability zone in which the instance resides.
         */
        zone?: string | null;
    }
    /**
     * An event generated when a container is forcibly terminated by the worker. Currently, this only occurs when the container outlives the timeout specified by the user.
     */
    export interface Schema$ContainerKilledEvent {
        /**
         * The numeric ID of the action that started the container.
         */
        actionId?: number | null;
    }
    /**
     * An event generated when a container starts.
     */
    export interface Schema$ContainerStartedEvent {
        /**
         * The numeric ID of the action that started this container.
         */
        actionId?: number | null;
        /**
         * The public IP address that can be used to connect to the container. This field is only populated when at least one port mapping is present. If the instance was created with a private address, this field will be empty even if port mappings exist.
         */
        ipAddress?: string | null;
        /**
         * The container-to-host port mappings installed for this container. This set will contain any ports exposed using the `PUBLISH_EXPOSED_PORTS` flag as well as any specified in the `Action` definition.
         */
        portMappings?: {
            [key: string]: number;
        } | null;
    }
    /**
     * An event generated when a container exits.
     */
    export interface Schema$ContainerStoppedEvent {
        /**
         * The numeric ID of the action that started this container.
         */
        actionId?: number | null;
        /**
         * The exit status of the container.
         */
        exitStatus?: number | null;
        /**
         * The tail end of any content written to standard error by the container. If the content emits large amounts of debugging noise or contains sensitive information, you can prevent the content from being printed by setting the `DISABLE_STANDARD_ERROR_CAPTURE` flag. Note that only a small amount of the end of the stream is captured here. The entire stream is stored in the `/google/logs` directory mounted into each action, and can be copied off the machine as described elsewhere.
         */
        stderr?: string | null;
    }
    /**
     * Stores the information that the controller will fetch from the server in order to run. Should only be used by VMs created by the Pipelines Service and not by end users.
     */
    export interface Schema$ControllerConfig {
        cmd?: string | null;
        disks?: {
            [key: string]: string;
        } | null;
        gcsLogPath?: string | null;
        gcsSinks?: {
            [key: string]: Schema$RepeatedString;
        } | null;
        gcsSources?: {
            [key: string]: Schema$RepeatedString;
        } | null;
        image?: string | null;
        machineType?: string | null;
        vars?: {
            [key: string]: string;
        } | null;
    }
    /**
     * An event generated whenever a resource limitation or transient error delays execution of a pipeline that was otherwise ready to run.
     */
    export interface Schema$DelayedEvent {
        /**
         * A textual description of the cause of the delay. The string can change without notice because it is often generated by another service (such as Compute Engine).
         */
        cause?: string | null;
        /**
         * If the delay was caused by a resource shortage, this field lists the Compute Engine metrics that are preventing this operation from running (for example, `CPUS` or `INSTANCES`). If the particular metric is not known, a single `UNKNOWN` metric will be present.
         */
        metrics?: string[] | null;
    }
    /**
     * A Google Compute Engine disk resource specification.
     */
    export interface Schema$Disk {
        /**
         * Deprecated. Disks created by the Pipelines API will be deleted at the end of the pipeline run, regardless of what this field is set to.
         */
        autoDelete?: boolean | null;
        /**
         * Required at create time and cannot be overridden at run time. Specifies the path in the docker container where files on this disk should be located. For example, if `mountPoint` is `/mnt/disk`, and the parameter has `localPath` `inputs/file.txt`, the docker container can access the data at `/mnt/disk/inputs/file.txt`.
         */
        mountPoint?: string | null;
        /**
         * Required. The name of the disk that can be used in the pipeline parameters. Must be 1 - 63 characters. The name "boot" is reserved for system use.
         */
        name?: string | null;
        /**
         * Specifies how a sourced-base persistent disk will be mounted. See https://cloud.google.com/compute/docs/disks/persistent-disks#use_multi_instances for more details. Can only be set at create time.
         */
        readOnly?: boolean | null;
        /**
         * The size of the disk. Defaults to 500 (GB). This field is not applicable for local SSD.
         */
        sizeGb?: number | null;
        /**
         * The full or partial URL of the persistent disk to attach. See https://cloud.google.com/compute/docs/reference/latest/instances#resource and https://cloud.google.com/compute/docs/disks/persistent-disks#snapshots for more details.
         */
        source?: string | null;
        /**
         * Required. The type of the disk to create.
         */
        type?: string | null;
    }
    /**
     * The Docker execuctor specification.
     */
    export interface Schema$DockerExecutor {
        /**
         * Required. The command or newline delimited script to run. The command string will be executed within a bash shell. If the command exits with a non-zero exit code, output parameter de-localization will be skipped and the pipeline operation's `error` field will be populated. Maximum command string length is 16384.
         */
        cmd?: string | null;
        /**
         * Required. Image name from either Docker Hub or Google Container Registry. Users that run pipelines must have READ access to the image.
         */
        imageName?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \} The JSON representation for `Empty` is empty JSON object `{\}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Carries information about events that occur during pipeline execution.
     */
    export interface Schema$Event {
        /**
         * A human-readable description of the event. Note that these strings can change at any time without notice. Any application logic must use the information in the `details` field.
         */
        description?: string | null;
        /**
         * Machine-readable details about the event.
         */
        details?: {
            [key: string]: any;
        } | null;
        /**
         * The time at which the event occurred.
         */
        timestamp?: string | null;
    }
    /**
     * An event generated when the execution of a pipeline has failed. Note that other events can continue to occur after this event.
     */
    export interface Schema$FailedEvent {
        /**
         * The human-readable description of the cause of the failure.
         */
        cause?: string | null;
        /**
         * The Google standard error code that best describes this failure.
         */
        code?: string | null;
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
     * The response of ListPipelines. Contains at most `pageSize` pipelines. If it contains `pageSize` pipelines, and more pipelines exist, then `nextPageToken` will be populated and should be used as the `pageToken` argument to a subsequent ListPipelines request.
     */
    export interface Schema$ListPipelinesResponse {
        /**
         * The token to use to get the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The matched pipelines.
         */
        pipelines?: Schema$Pipeline[];
    }
    /**
     * LocalCopy defines how a remote file should be copied to and from the VM.
     */
    export interface Schema$LocalCopy {
        /**
         * Required. The name of the disk where this parameter is located. Can be the name of one of the disks specified in the Resources field, or "boot", which represents the Docker instance's boot disk and has a mount point of `/`.
         */
        disk?: string | null;
        /**
         * Required. The path within the user's docker container where this input should be localized to and from, relative to the specified disk's mount point. For example: file.txt,
         */
        path?: string | null;
    }
    /**
     * The logging options for the pipeline run.
     */
    export interface Schema$LoggingOptions {
        /**
         * The location in Google Cloud Storage to which the pipeline logs will be copied. Can be specified as a fully qualified directory path, in which case logs will be output with a unique identifier as the filename in that directory, or as a fully specified path, which must end in `.log`, in which case that path will be used, and the user must ensure that logs are not overwritten. Stdout and stderr logs from the run are also generated and output as `-stdout.log` and `-stderr.log`.
         */
        gcsPath?: string | null;
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
         * An OperationMetadata or Metadata object. This will always be returned with the Operation.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * The server-assigned name, which is only unique within the same service that originally returns it. For example: `operations/CJHU7Oi_ChDrveSpBRjfuL-qzoWAgEw`
         */
        name?: string | null;
        /**
         * An Empty object.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * An event that occurred during an Operation.
     */
    export interface Schema$OperationEvent {
        /**
         * Required description of event.
         */
        description?: string | null;
        /**
         * Optional time of when event finished. An event can have a start time and no finish time. If an event has a finish time, there must be a start time.
         */
        endTime?: string | null;
        /**
         * Optional time of when event started.
         */
        startTime?: string | null;
    }
    /**
     * Metadata describing an Operation.
     */
    export interface Schema$OperationMetadata {
        /**
         * This field is deprecated. Use `labels` instead. Optionally provided by the caller when submitting the request that creates the operation.
         */
        clientId?: string | null;
        /**
         * The time at which the job was submitted to the Genomics service.
         */
        createTime?: string | null;
        /**
         * The time at which the job stopped running.
         */
        endTime?: string | null;
        /**
         * Optional event messages that were generated during the job's execution. This also contains any warnings that were generated during import or export.
         */
        events?: Schema$OperationEvent[];
        /**
         * Optionally provided by the caller when submitting the request that creates the operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The Google Cloud Project in which the job is scoped.
         */
        projectId?: string | null;
        /**
         * The original request that started the operation. Note that this will be in current version of the API. If the operation was started with v1beta2 API and a GetOperation is performed on v1 API, a v1 request will be returned.
         */
        request?: {
            [key: string]: any;
        } | null;
        /**
         * Runtime metadata on this Operation.
         */
        runtimeMetadata?: {
            [key: string]: any;
        } | null;
        /**
         * The time at which the job began to run.
         */
        startTime?: string | null;
    }
    /**
     * The pipeline object. Represents a transformation from a set of input parameters to a set of output parameters. The transformation is defined as a docker image and command to run within that image. Each pipeline is run on a Google Compute Engine VM. A pipeline can be created with the `create` method and then later run with the `run` method, or a pipeline can be defined and run all at once with the `run` method.
     */
    export interface Schema$Pipeline {
        /**
         * User-specified description.
         */
        description?: string | null;
        /**
         * Specifies the docker run information.
         */
        docker?: Schema$DockerExecutor;
        /**
         * Input parameters of the pipeline.
         */
        inputParameters?: Schema$PipelineParameter[];
        /**
         * Required. A user specified pipeline name that does not have to be unique. This name can be used for filtering Pipelines in ListPipelines.
         */
        name?: string | null;
        /**
         * Output parameters of the pipeline.
         */
        outputParameters?: Schema$PipelineParameter[];
        /**
         * Unique pipeline id that is generated by the service when CreatePipeline is called. Cannot be specified in the Pipeline used in the CreatePipelineRequest, and will be populated in the response to CreatePipeline and all subsequent Get and List calls. Indicates that the service has registered this pipeline.
         */
        pipelineId?: string | null;
        /**
         * Required. The project in which to create the pipeline. The caller must have WRITE access.
         */
        projectId?: string | null;
        /**
         * Required. Specifies resource requirements for the pipeline run. Required fields: * minimumCpuCores * minimumRamGb
         */
        resources?: Schema$PipelineResources;
    }
    /**
     * Parameters facilitate setting and delivering data into the pipeline's execution environment. They are defined at create time, with optional defaults, and can be overridden at run time. If `localCopy` is unset, then the parameter specifies a string that is passed as-is into the pipeline, as the value of the environment variable with the given name. A default value can be optionally specified at create time. The default can be overridden at run time using the inputs map. If no default is given, a value must be supplied at runtime. If `localCopy` is defined, then the parameter specifies a data source or sink, both in Google Cloud Storage and on the Docker container where the pipeline computation is run. The service account associated with the Pipeline (by default the project's Compute Engine service account) must have access to the Google Cloud Storage paths. At run time, the Google Cloud Storage paths can be overridden if a default was provided at create time, or must be set otherwise. The pipeline runner should add a key/value pair to either the inputs or outputs map. The indicated data copies will be carried out before/after pipeline execution, just as if the corresponding arguments were provided to `gsutil cp`. For example: Given the following `PipelineParameter`, specified in the `inputParameters` list: ``` {name: "input_file", localCopy: {path: "file.txt", disk: "pd1"\}\} ``` where `disk` is defined in the `PipelineResources` object as: ``` {name: "pd1", mountPoint: "/mnt/disk/"\} ``` We create a disk named `pd1`, mount it on the host VM, and map `/mnt/pd1` to `/mnt/disk` in the docker container. At runtime, an entry for `input_file` would be required in the inputs map, such as: ``` inputs["input_file"] = "gs://my-bucket/bar.txt" ``` This would generate the following gsutil call: ``` gsutil cp gs://my-bucket/bar.txt /mnt/pd1/file.txt ``` The file `/mnt/pd1/file.txt` maps to `/mnt/disk/file.txt` in the Docker container. Acceptable paths are: Google Cloud storage pathLocal path file file glob directory For outputs, the direction of the copy is reversed: ``` gsutil cp /mnt/disk/file.txt gs://my-bucket/bar.txt ``` Acceptable paths are: Local pathGoogle Cloud Storage path file file file directory - directory must already exist glob directory - directory will be created if it doesn't exist One restriction due to docker limitations, is that for outputs that are found on the boot disk, the local path cannot be a glob and must be a file.
     */
    export interface Schema$PipelineParameter {
        /**
         * The default value for this parameter. Can be overridden at runtime. If `localCopy` is present, then this must be a Google Cloud Storage path beginning with `gs://`.
         */
        defaultValue?: string | null;
        /**
         * Human-readable description.
         */
        description?: string | null;
        /**
         * If present, this parameter is marked for copying to and from the VM. `LocalCopy` indicates where on the VM the file should be. The value given to this parameter (either at runtime or using `defaultValue`) must be the remote path where the file should be.
         */
        localCopy?: Schema$LocalCopy;
        /**
         * Required. Name of the parameter - the pipeline runner uses this string as the key to the input and output maps in RunPipeline.
         */
        name?: string | null;
    }
    /**
     * The system resources for the pipeline run.
     */
    export interface Schema$PipelineResources {
        /**
         * Optional. The number of accelerators of the specified type to attach. By specifying this parameter, you will download and install the following third-party software onto your managed Compute Engine instances: NVIDIA® Tesla® drivers and NVIDIA® CUDA toolkit.
         */
        acceleratorCount?: string | null;
        /**
         * Optional. The Compute Engine defined accelerator type. By specifying this parameter, you will download and install the following third-party software onto your managed Compute Engine instances: NVIDIA® Tesla® drivers and NVIDIA® CUDA toolkit. Please see https://cloud.google.com/compute/docs/gpus/ for a list of available accelerator types.
         */
        acceleratorType?: string | null;
        /**
         * The size of the boot disk. Defaults to 10 (GB).
         */
        bootDiskSizeGb?: number | null;
        /**
         * Disks to attach.
         */
        disks?: Schema$Disk[];
        /**
         * The minimum number of cores to use. Defaults to 1.
         */
        minimumCpuCores?: number | null;
        /**
         * The minimum amount of RAM to use. Defaults to 3.75 (GB)
         */
        minimumRamGb?: number | null;
        /**
         * Whether to assign an external IP to the instance. This is an experimental feature that may go away. Defaults to false. Corresponds to `--no_address` flag for [gcloud compute instances create] (https://cloud.google.com/sdk/gcloud/reference/compute/instances/create). In order to use this, must be true for both create time and run time. Cannot be true at run time if false at create time. If you need to ssh into a private IP VM for debugging, you can ssh to a public VM and then ssh into the private VM's Internal IP. If noAddress is set, this pipeline run may only load docker images from Google Container Registry and not Docker Hub. Before using this, you must [configure access to Google services from internal IPs](https://cloud.google.com/compute/docs/configure-private-google-access#configuring_access_to_google_services_from_internal_ips).
         */
        noAddress?: boolean | null;
        /**
         * Whether to use preemptible VMs. Defaults to `false`. In order to use this, must be true for both create time and run time. Cannot be true at run time if false at create time.
         */
        preemptible?: boolean | null;
        /**
         * List of Google Compute Engine availability zones to which resource creation will restricted. If empty, any zone may be chosen.
         */
        zones?: string[] | null;
    }
    /**
     * An event generated when the worker starts pulling an image.
     */
    export interface Schema$PullStartedEvent {
        /**
         * The URI of the image that was pulled.
         */
        imageUri?: string | null;
    }
    /**
     * An event generated when the worker stops pulling an image.
     */
    export interface Schema$PullStoppedEvent {
        /**
         * The URI of the image that was pulled.
         */
        imageUri?: string | null;
    }
    export interface Schema$RepeatedString {
        values?: string[] | null;
    }
    /**
     * The pipeline run arguments.
     */
    export interface Schema$RunPipelineArgs {
        /**
         * This field is deprecated. Use `labels` instead. Client-specified pipeline operation identifier.
         */
        clientId?: string | null;
        /**
         * Pipeline input arguments; keys are defined in the pipeline documentation. All input parameters that do not have default values must be specified. If parameters with defaults are specified here, the defaults will be overridden.
         */
        inputs?: {
            [key: string]: string;
        } | null;
        /**
         * How long to keep the VM up after a failure (for example docker command failed, copying input or output files failed, etc). While the VM is up, one can ssh into the VM to debug. Default is 0; maximum allowed value is 1 day.
         */
        keepVmAliveOnFailureDuration?: string | null;
        /**
         * Labels to apply to this pipeline run. Labels will also be applied to compute resources (VM, disks) created by this pipeline run. When listing operations, operations can filtered by labels. Label keys may not be empty; label values may be empty. Non-empty labels must be 1-63 characters long, and comply with [RFC1035] (https://www.ietf.org/rfc/rfc1035.txt). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. Logging options. Used by the service to communicate results to the user.
         */
        logging?: Schema$LoggingOptions;
        /**
         * Pipeline output arguments; keys are defined in the pipeline documentation. All output parameters of without default values must be specified. If parameters with defaults are specified here, the defaults will be overridden.
         */
        outputs?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The project in which to run the pipeline. The caller must have WRITER access to all Google Cloud services and resources (e.g. Google Compute Engine) will be used.
         */
        projectId?: string | null;
        /**
         * Specifies resource requirements/overrides for the pipeline run.
         */
        resources?: Schema$PipelineResources;
        /**
         * The Google Cloud Service Account that will be used to access data and services. By default, the compute service account associated with `projectId` is used.
         */
        serviceAccount?: Schema$ServiceAccount;
    }
    /**
     * The request to run a pipeline. If `pipelineId` is specified, it refers to a saved pipeline created with CreatePipeline and set as the `pipelineId` of the returned Pipeline object. If `ephemeralPipeline` is specified, that pipeline is run once with the given args and not saved. It is an error to specify both `pipelineId` and `ephemeralPipeline`. `pipelineArgs` must be specified.
     */
    export interface Schema$RunPipelineRequest {
        /**
         * A new pipeline object to run once and then delete.
         */
        ephemeralPipeline?: Schema$Pipeline;
        /**
         * The arguments to use when running this pipeline.
         */
        pipelineArgs?: Schema$RunPipelineArgs;
        /**
         * The already created pipeline to run.
         */
        pipelineId?: string | null;
    }
    /**
     * The response to the RunPipeline method, returned in the operation's result field on success.
     */
    export interface Schema$RunPipelineResponse {
    }
    /**
     * Runtime metadata that will be populated in the runtimeMetadata field of the Operation associated with a RunPipeline execution.
     */
    export interface Schema$RuntimeMetadata {
        /**
         * Execution information specific to Google Compute Engine.
         */
        computeEngine?: Schema$ComputeEngine;
    }
    /**
     * A Google Cloud Service Account.
     */
    export interface Schema$ServiceAccount {
        /**
         * Email address of the service account. Defaults to `default`, which uses the compute service account associated with the project.
         */
        email?: string | null;
        /**
         * List of scopes to be enabled for this service account on the VM. The following scopes are automatically included: * https://www.googleapis.com/auth/compute * https://www.googleapis.com/auth/devstorage.full_control * https://www.googleapis.com/auth/genomics * https://www.googleapis.com/auth/logging.write * https://www.googleapis.com/auth/monitoring.write
         */
        scopes?: string[] | null;
    }
    /**
     * Request to set operation status. Should only be used by VMs created by the Pipelines Service and not by end users.
     */
    export interface Schema$SetOperationStatusRequest {
        errorCode?: string | null;
        errorMessage?: string | null;
        operationId?: string | null;
        timestampEvents?: Schema$TimestampEvent[];
        validationToken?: string | null;
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
     * Stores the list of events and times they occured for major events in job execution.
     */
    export interface Schema$TimestampEvent {
        /**
         * String indicating the type of event
         */
        description?: string | null;
        /**
         * The time this event occured.
         */
        timestamp?: string | null;
    }
    /**
     * An event generated when the execution of a container results in a non-zero exit status that was not otherwise ignored. Execution will continue, but only actions that are flagged as `ALWAYS_RUN` will be executed. Other actions will be skipped.
     */
    export interface Schema$UnexpectedExitStatusEvent {
        /**
         * The numeric ID of the action that started the container.
         */
        actionId?: number | null;
        /**
         * The exit status of the container.
         */
        exitStatus?: number | null;
    }
    /**
     * An event generated after a worker VM has been assigned to run the pipeline.
     */
    export interface Schema$WorkerAssignedEvent {
        /**
         * The worker's instance name.
         */
        instance?: string | null;
        /**
         * The machine type that was assigned for the worker.
         */
        machineType?: string | null;
        /**
         * The zone the worker is running in.
         */
        zone?: string | null;
    }
    /**
     * An event generated when the worker VM that was assigned to the pipeline has been released (deleted).
     */
    export interface Schema$WorkerReleasedEvent {
        /**
         * The worker's instance name.
         */
        instance?: string | null;
        /**
         * The zone the worker was running in.
         */
        zone?: string | null;
    }
    export class Resource$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. Clients may use Operations.GetOperation or Operations.ListOperations to check whether the cancellation succeeded or the operation completed despite cancellation. Authorization requires the following [Google IAM](https://cloud.google.com/iam) permission: * `genomics.operations.cancel`
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.operations.cancel({
         *     // The name of the operation resource to be cancelled.
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
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service. Authorization requires the following [Google IAM](https://cloud.google.com/iam) permission: * `genomics.operations.get`
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.operations.get({
         *     // The name of the operation resource.
         *     name: 'operations/.*',
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
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists operations that match the specified filter in the request. Authorization requires the following [Google IAM](https://cloud.google.com/iam) permission: * `genomics.operations.list`
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.operations.list({
         *     // A string for filtering Operations. In v2alpha1, the following filter fields are supported: * createTime: The time this job was created * events: The set of event (names) that have occurred while running the pipeline. The : operator can be used to determine if a particular event has occurred. * error: If the pipeline is running, this value is NULL. Once the pipeline finishes, the value is the standard Google error code. * labels.key or labels."key with space" where key is a label key. * done: If the pipeline is running, this value is false. Once the pipeline finishes, the value is true. In v1 and v1alpha2, the following filter fields are supported: * projectId: Required. Corresponds to OperationMetadata.projectId. * createTime: The time this job was created, in seconds from the [epoch](http://en.wikipedia.org/wiki/Unix_time). Can use `\>=` and/or `<=` operators. * status: Can be `RUNNING`, `SUCCESS`, `FAILURE`, or `CANCELED`. Only one status may be specified. * labels.key where key is a label key. Examples: * `projectId = my-project AND createTime \>= 1432140000` * `projectId = my-project AND createTime \>= 1432140000 AND createTime <= 1432150000 AND status = RUNNING` * `projectId = my-project AND labels.color = *` * `projectId = my-project AND labels.color = red`
         *     filter: 'placeholder-value',
         *     // The name of the operation's parent resource.
         *     name: 'operations',
         *     // The maximum number of results to return. The maximum value is 256.
         *     pageSize: 'placeholder-value',
         *     // The standard list page token.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "operations": []
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
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelOperationRequest;
    }
    export interface Params$Resource$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Operations$List extends StandardParameters {
        /**
         * A string for filtering Operations. In v2alpha1, the following filter fields are supported: * createTime: The time this job was created * events: The set of event (names) that have occurred while running the pipeline. The : operator can be used to determine if a particular event has occurred. * error: If the pipeline is running, this value is NULL. Once the pipeline finishes, the value is the standard Google error code. * labels.key or labels."key with space" where key is a label key. * done: If the pipeline is running, this value is false. Once the pipeline finishes, the value is true. In v1 and v1alpha2, the following filter fields are supported: * projectId: Required. Corresponds to OperationMetadata.projectId. * createTime: The time this job was created, in seconds from the [epoch](http://en.wikipedia.org/wiki/Unix_time). Can use `\>=` and/or `<=` operators. * status: Can be `RUNNING`, `SUCCESS`, `FAILURE`, or `CANCELED`. Only one status may be specified. * labels.key where key is a label key. Examples: * `projectId = my-project AND createTime \>= 1432140000` * `projectId = my-project AND createTime \>= 1432140000 AND createTime <= 1432150000 AND status = RUNNING` * `projectId = my-project AND labels.color = *` * `projectId = my-project AND labels.color = red`
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The maximum number of results to return. The maximum value is 256.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export class Resource$Pipelines {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a pipeline that can be run later. Create takes a Pipeline that has all fields other than `pipelineId` populated, and then returns the same pipeline with `pipelineId` populated. This id can be used to run the pipeline. Caller must have WRITE permission to the project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.create({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "docker": {},
         *       //   "inputParameters": [],
         *       //   "name": "my_name",
         *       //   "outputParameters": [],
         *       //   "pipelineId": "my_pipelineId",
         *       //   "projectId": "my_projectId",
         *       //   "resources": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "docker": {},
         *   //   "inputParameters": [],
         *   //   "name": "my_name",
         *   //   "outputParameters": [],
         *   //   "pipelineId": "my_pipelineId",
         *   //   "projectId": "my_projectId",
         *   //   "resources": {}
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
        create(params: Params$Resource$Pipelines$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Pipelines$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Pipeline>>;
        create(params: Params$Resource$Pipelines$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Pipelines$Create, options: MethodOptions | BodyResponseCallback<Schema$Pipeline>, callback: BodyResponseCallback<Schema$Pipeline>): void;
        create(params: Params$Resource$Pipelines$Create, callback: BodyResponseCallback<Schema$Pipeline>): void;
        create(callback: BodyResponseCallback<Schema$Pipeline>): void;
        /**
         * Deletes a pipeline based on ID. Caller must have WRITE permission to the project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.delete({
         *     // Caller must have WRITE access to the project in which this pipeline is defined.
         *     pipelineId: 'placeholder-value',
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
        delete(params: Params$Resource$Pipelines$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Pipelines$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Pipelines$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Pipelines$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Pipelines$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Retrieves a pipeline based on ID. Caller must have READ permission to the project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.get({
         *     // Caller must have READ access to the project in which this pipeline is defined.
         *     pipelineId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "docker": {},
         *   //   "inputParameters": [],
         *   //   "name": "my_name",
         *   //   "outputParameters": [],
         *   //   "pipelineId": "my_pipelineId",
         *   //   "projectId": "my_projectId",
         *   //   "resources": {}
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
        get(params: Params$Resource$Pipelines$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Pipelines$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Pipeline>>;
        get(params: Params$Resource$Pipelines$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Pipelines$Get, options: MethodOptions | BodyResponseCallback<Schema$Pipeline>, callback: BodyResponseCallback<Schema$Pipeline>): void;
        get(params: Params$Resource$Pipelines$Get, callback: BodyResponseCallback<Schema$Pipeline>): void;
        get(callback: BodyResponseCallback<Schema$Pipeline>): void;
        /**
         * Gets controller configuration information. Should only be called by VMs created by the Pipelines Service and not by end users.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.getControllerConfig({
         *     // The operation to retrieve controller configuration for.
         *     operationId: 'placeholder-value',
         *
         *     validationToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cmd": "my_cmd",
         *   //   "disks": {},
         *   //   "gcsLogPath": "my_gcsLogPath",
         *   //   "gcsSinks": {},
         *   //   "gcsSources": {},
         *   //   "image": "my_image",
         *   //   "machineType": "my_machineType",
         *   //   "vars": {}
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
        getControllerConfig(params: Params$Resource$Pipelines$Getcontrollerconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getControllerConfig(params?: Params$Resource$Pipelines$Getcontrollerconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ControllerConfig>>;
        getControllerConfig(params: Params$Resource$Pipelines$Getcontrollerconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getControllerConfig(params: Params$Resource$Pipelines$Getcontrollerconfig, options: MethodOptions | BodyResponseCallback<Schema$ControllerConfig>, callback: BodyResponseCallback<Schema$ControllerConfig>): void;
        getControllerConfig(params: Params$Resource$Pipelines$Getcontrollerconfig, callback: BodyResponseCallback<Schema$ControllerConfig>): void;
        getControllerConfig(callback: BodyResponseCallback<Schema$ControllerConfig>): void;
        /**
         * Lists pipelines. Caller must have READ permission to the project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.list({
         *     // Pipelines with names that match this prefix should be returned. If unspecified, all pipelines in the project, up to `pageSize`, will be returned.
         *     namePrefix: 'placeholder-value',
         *     // Number of pipelines to return at once. Defaults to 256, and max is 2048.
         *     pageSize: 'placeholder-value',
         *     // Token to use to indicate where to start getting results. If unspecified, returns the first page of results.
         *     pageToken: 'placeholder-value',
         *     // Required. The name of the project to search for pipelines. Caller must have READ access to this project.
         *     projectId: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "pipelines": []
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
        list(params: Params$Resource$Pipelines$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Pipelines$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPipelinesResponse>>;
        list(params: Params$Resource$Pipelines$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Pipelines$List, options: MethodOptions | BodyResponseCallback<Schema$ListPipelinesResponse>, callback: BodyResponseCallback<Schema$ListPipelinesResponse>): void;
        list(params: Params$Resource$Pipelines$List, callback: BodyResponseCallback<Schema$ListPipelinesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPipelinesResponse>): void;
        /**
         * Runs a pipeline. If `pipelineId` is specified in the request, then run a saved pipeline. If `ephemeralPipeline` is specified, then run that pipeline once without saving a copy. The caller must have READ permission to the project where the pipeline is stored and WRITE permission to the project where the pipeline will be run, as VMs will be created and storage will be used. If a pipeline operation is still running after 6 days, it will be canceled.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/compute',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.run({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "ephemeralPipeline": {},
         *       //   "pipelineArgs": {},
         *       //   "pipelineId": "my_pipelineId"
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
        run(params: Params$Resource$Pipelines$Run, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        run(params?: Params$Resource$Pipelines$Run, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        run(params: Params$Resource$Pipelines$Run, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        run(params: Params$Resource$Pipelines$Run, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        run(params: Params$Resource$Pipelines$Run, callback: BodyResponseCallback<Schema$Operation>): void;
        run(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Sets status of a given operation. Any new timestamps (as determined by description) are appended to TimestampEvents. Should only be called by VMs created by the Pipelines Service and not by end users.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/genomics.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const genomics = google.genomics('v1alpha2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/genomics',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await genomics.pipelines.setOperationStatus({
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "errorCode": "my_errorCode",
         *       //   "errorMessage": "my_errorMessage",
         *       //   "operationId": "my_operationId",
         *       //   "timestampEvents": [],
         *       //   "validationToken": "my_validationToken"
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
        setOperationStatus(params: Params$Resource$Pipelines$Setoperationstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setOperationStatus(params?: Params$Resource$Pipelines$Setoperationstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        setOperationStatus(params: Params$Resource$Pipelines$Setoperationstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setOperationStatus(params: Params$Resource$Pipelines$Setoperationstatus, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        setOperationStatus(params: Params$Resource$Pipelines$Setoperationstatus, callback: BodyResponseCallback<Schema$Empty>): void;
        setOperationStatus(callback: BodyResponseCallback<Schema$Empty>): void;
    }
    export interface Params$Resource$Pipelines$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$Pipeline;
    }
    export interface Params$Resource$Pipelines$Delete extends StandardParameters {
        /**
         * Caller must have WRITE access to the project in which this pipeline is defined.
         */
        pipelineId?: string;
    }
    export interface Params$Resource$Pipelines$Get extends StandardParameters {
        /**
         * Caller must have READ access to the project in which this pipeline is defined.
         */
        pipelineId?: string;
    }
    export interface Params$Resource$Pipelines$Getcontrollerconfig extends StandardParameters {
        /**
         * The operation to retrieve controller configuration for.
         */
        operationId?: string;
        /**
         *
         */
        validationToken?: string;
    }
    export interface Params$Resource$Pipelines$List extends StandardParameters {
        /**
         * Pipelines with names that match this prefix should be returned. If unspecified, all pipelines in the project, up to `pageSize`, will be returned.
         */
        namePrefix?: string;
        /**
         * Number of pipelines to return at once. Defaults to 256, and max is 2048.
         */
        pageSize?: number;
        /**
         * Token to use to indicate where to start getting results. If unspecified, returns the first page of results.
         */
        pageToken?: string;
        /**
         * Required. The name of the project to search for pipelines. Caller must have READ access to this project.
         */
        projectId?: string;
    }
    export interface Params$Resource$Pipelines$Run extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$RunPipelineRequest;
    }
    export interface Params$Resource$Pipelines$Setoperationstatus extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetOperationStatusRequest;
    }
    export {};
}
