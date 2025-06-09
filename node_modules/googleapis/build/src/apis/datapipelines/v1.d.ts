import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace datapipelines_v1 {
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
     * Data pipelines API
     *
     * Data Pipelines provides an interface for creating, updating, and managing recurring Data Analytics jobs.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const datapipelines = google.datapipelines('v1');
     * ```
     */
    export class Datapipelines {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Pipeline job details specific to the Dataflow API. This is encapsulated here to allow for more executors to store their specific details separately.
     */
    export interface Schema$GoogleCloudDatapipelinesV1DataflowJobDetails {
        /**
         * Output only. The current number of workers used to run the jobs. Only set to a value if the job is still running.
         */
        currentWorkers?: number | null;
        /**
         * Cached version of all the metrics of interest for the job. This value gets stored here when the job is terminated. As long as the job is running, this field is populated from the Dataflow API.
         */
        resourceInfo?: {
            [key: string]: number;
        } | null;
        /**
         * Output only. The SDK version used to run the job.
         */
        sdkVersion?: Schema$GoogleCloudDatapipelinesV1SdkVersion;
    }
    /**
     * The environment values to be set at runtime for a Flex Template.
     */
    export interface Schema$GoogleCloudDatapipelinesV1FlexTemplateRuntimeEnvironment {
        /**
         * Additional experiment flags for the job.
         */
        additionalExperiments?: string[] | null;
        /**
         * Additional user labels to be specified for the job. Keys and values must follow the restrictions specified in the [labeling restrictions](https://cloud.google.com/compute/docs/labeling-resources#restrictions). An object containing a list of key/value pairs. Example: `{ "name": "wrench", "mass": "1kg", "count": "3" \}`.
         */
        additionalUserLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Whether to enable Streaming Engine for the job.
         */
        enableStreamingEngine?: boolean | null;
        /**
         * Set FlexRS goal for the job. https://cloud.google.com/dataflow/docs/guides/flexrs
         */
        flexrsGoal?: string | null;
        /**
         * Configuration for VM IPs.
         */
        ipConfiguration?: string | null;
        /**
         * Name for the Cloud KMS key for the job. Key format is: projects//locations//keyRings//cryptoKeys/
         */
        kmsKeyName?: string | null;
        /**
         * The machine type to use for the job. Defaults to the value from the template if not specified.
         */
        machineType?: string | null;
        /**
         * The maximum number of Compute Engine instances to be made available to your pipeline during execution, from 1 to 1000.
         */
        maxWorkers?: number | null;
        /**
         * Network to which VMs will be assigned. If empty or unspecified, the service will use the network "default".
         */
        network?: string | null;
        /**
         * The initial number of Compute Engine instances for the job.
         */
        numWorkers?: number | null;
        /**
         * The email address of the service account to run the job as.
         */
        serviceAccountEmail?: string | null;
        /**
         * Subnetwork to which VMs will be assigned, if desired. You can specify a subnetwork using either a complete URL or an abbreviated path. Expected to be of the form "https://www.googleapis.com/compute/v1/projects/HOST_PROJECT_ID/regions/REGION/subnetworks/SUBNETWORK" or "regions/REGION/subnetworks/SUBNETWORK". If the subnetwork is located in a Shared VPC network, you must use the complete URL.
         */
        subnetwork?: string | null;
        /**
         * The Cloud Storage path to use for temporary files. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        tempLocation?: string | null;
        /**
         * The Compute Engine region (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1". Mutually exclusive with worker_zone. If neither worker_region nor worker_zone is specified, defaults to the control plane region.
         */
        workerRegion?: string | null;
        /**
         * The Compute Engine zone (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1-a". Mutually exclusive with worker_region. If neither worker_region nor worker_zone is specified, a zone in the control plane region is chosen based on available capacity. If both `worker_zone` and `zone` are set, `worker_zone` takes precedence.
         */
        workerZone?: string | null;
        /**
         * The Compute Engine [availability zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones) for launching worker instances to run your pipeline. In the future, worker_zone will take precedence.
         */
        zone?: string | null;
    }
    /**
     * Definition of the job information maintained by the pipeline. Fields in this entity are retrieved from the executor API (e.g. Dataflow API).
     */
    export interface Schema$GoogleCloudDatapipelinesV1Job {
        /**
         * Output only. The time of job creation.
         */
        createTime?: string | null;
        /**
         * All the details that are specific to a Dataflow job.
         */
        dataflowJobDetails?: Schema$GoogleCloudDatapipelinesV1DataflowJobDetails;
        /**
         * Output only. The time of job termination. This is absent if the job is still running.
         */
        endTime?: string | null;
        /**
         * Output only. The internal ID for the job.
         */
        id?: string | null;
        /**
         * Required. The fully qualified resource name for the job.
         */
        name?: string | null;
        /**
         * The current state of the job.
         */
        state?: string | null;
        /**
         * Status capturing any error code or message related to job creation or execution.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * Launch Flex Template parameter.
     */
    export interface Schema$GoogleCloudDatapipelinesV1LaunchFlexTemplateParameter {
        /**
         * Cloud Storage path to a file with a JSON-serialized ContainerSpec as content.
         */
        containerSpecGcsPath?: string | null;
        /**
         * The runtime environment for the Flex Template job.
         */
        environment?: Schema$GoogleCloudDatapipelinesV1FlexTemplateRuntimeEnvironment;
        /**
         * Required. The job name to use for the created job. For an update job request, the job name should be the same as the existing running job.
         */
        jobName?: string | null;
        /**
         * Launch options for this Flex Template job. This is a common set of options across languages and templates. This should not be used to pass job parameters.
         */
        launchOptions?: {
            [key: string]: string;
        } | null;
        /**
         * The parameters for the Flex Template. Example: `{"num_workers":"5"\}`
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Use this to pass transform name mappings for streaming update jobs. Example: `{"oldTransformName":"newTransformName",...\}`
         */
        transformNameMappings?: {
            [key: string]: string;
        } | null;
        /**
         * Set this to true if you are sending a request to update a running streaming job. When set, the job name should be the same as the running job.
         */
        update?: boolean | null;
    }
    /**
     * A request to launch a Dataflow job from a Flex Template.
     */
    export interface Schema$GoogleCloudDatapipelinesV1LaunchFlexTemplateRequest {
        /**
         * Required. Parameter to launch a job from a Flex Template.
         */
        launchParameter?: Schema$GoogleCloudDatapipelinesV1LaunchFlexTemplateParameter;
        /**
         * Required. The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request. For example, `us-central1`, `us-west1`.
         */
        location?: string | null;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string | null;
        /**
         * If true, the request is validated but not actually executed. Defaults to false.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Parameters to provide to the template being launched.
     */
    export interface Schema$GoogleCloudDatapipelinesV1LaunchTemplateParameters {
        /**
         * The runtime environment for the job.
         */
        environment?: Schema$GoogleCloudDatapipelinesV1RuntimeEnvironment;
        /**
         * Required. The job name to use for the created job.
         */
        jobName?: string | null;
        /**
         * The runtime parameters to pass to the job.
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Map of transform name prefixes of the job to be replaced to the corresponding name prefixes of the new job. Only applicable when updating a pipeline.
         */
        transformNameMapping?: {
            [key: string]: string;
        } | null;
        /**
         * If set, replace the existing pipeline with the name specified by jobName with this pipeline, preserving state.
         */
        update?: boolean | null;
    }
    /**
     * A request to launch a template.
     */
    export interface Schema$GoogleCloudDatapipelinesV1LaunchTemplateRequest {
        /**
         * A Cloud Storage path to the template from which to create the job. Must be a valid Cloud Storage URL, beginning with 'gs://'.
         */
        gcsPath?: string | null;
        /**
         * The parameters of the template to launch. This should be part of the body of the POST request.
         */
        launchParameters?: Schema$GoogleCloudDatapipelinesV1LaunchTemplateParameters;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string | null;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string | null;
        /**
         * If true, the request is validated but not actually executed. Defaults to false.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Response message for ListJobs
     */
    export interface Schema$GoogleCloudDatapipelinesV1ListJobsResponse {
        /**
         * Results that were accessible to the caller. Results are always in descending order of job creation date.
         */
        jobs?: Schema$GoogleCloudDatapipelinesV1Job[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message for ListPipelines.
     */
    export interface Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse {
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Results that matched the filter criteria and were accessible to the caller. Results are always in descending order of pipeline creation date.
         */
        pipelines?: Schema$GoogleCloudDatapipelinesV1Pipeline[];
    }
    /**
     * The main pipeline entity and all the necessary metadata for launching and managing linked jobs.
     */
    export interface Schema$GoogleCloudDatapipelinesV1Pipeline {
        /**
         * Output only. Immutable. The timestamp when the pipeline was initially created. Set by the Data Pipelines service.
         */
        createTime?: string | null;
        /**
         * Required. The display name of the pipeline. It can contain only letters ([A-Za-z]), numbers ([0-9]), hyphens (-), and underscores (_).
         */
        displayName?: string | null;
        /**
         * Output only. Number of jobs.
         */
        jobCount?: number | null;
        /**
         * Output only. Immutable. The timestamp when the pipeline was last modified. Set by the Data Pipelines service.
         */
        lastUpdateTime?: string | null;
        /**
         * The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`. * `PROJECT_ID` can contain letters ([A-Za-z]), numbers ([0-9]), hyphens (-), colons (:), and periods (.). For more information, see [Identifying projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects). * `LOCATION_ID` is the canonical ID for the pipeline's location. The list of available locations can be obtained by calling `google.cloud.location.Locations.ListLocations`. Note that the Data Pipelines service is not available in all regions. It depends on Cloud Scheduler, an App Engine application, so it's only available in [App Engine regions](https://cloud.google.com/about/locations#region). * `PIPELINE_ID` is the ID of the pipeline. Must be unique for the selected project and location.
         */
        name?: string | null;
        /**
         * Immutable. The sources of the pipeline (for example, Dataplex). The keys and values are set by the corresponding sources during pipeline creation.
         */
        pipelineSources?: {
            [key: string]: string;
        } | null;
        /**
         * Internal scheduling information for a pipeline. If this information is provided, periodic jobs will be created per the schedule. If not, users are responsible for creating jobs externally.
         */
        scheduleInfo?: Schema$GoogleCloudDatapipelinesV1ScheduleSpec;
        /**
         * Optional. A service account email to be used with the Cloud Scheduler job. If not specified, the default compute engine service account will be used.
         */
        schedulerServiceAccountEmail?: string | null;
        /**
         * Required. The state of the pipeline. When the pipeline is created, the state is set to 'PIPELINE_STATE_ACTIVE' by default. State changes can be requested by setting the state to stopping, paused, or resuming. State cannot be changed through UpdatePipeline requests.
         */
        state?: string | null;
        /**
         * Required. The type of the pipeline. This field affects the scheduling of the pipeline and the type of metrics to show for the pipeline.
         */
        type?: string | null;
        /**
         * Workload information for creating new jobs.
         */
        workload?: Schema$GoogleCloudDatapipelinesV1Workload;
    }
    /**
     * Request message for RunPipeline
     */
    export interface Schema$GoogleCloudDatapipelinesV1RunPipelineRequest {
    }
    /**
     * Response message for RunPipeline
     */
    export interface Schema$GoogleCloudDatapipelinesV1RunPipelineResponse {
        /**
         * Job that was created as part of RunPipeline operation.
         */
        job?: Schema$GoogleCloudDatapipelinesV1Job;
    }
    /**
     * The environment values to set at runtime.
     */
    export interface Schema$GoogleCloudDatapipelinesV1RuntimeEnvironment {
        /**
         * Additional experiment flags for the job.
         */
        additionalExperiments?: string[] | null;
        /**
         * Additional user labels to be specified for the job. Keys and values should follow the restrictions specified in the [labeling restrictions](https://cloud.google.com/compute/docs/labeling-resources#restrictions) page. An object containing a list of key/value pairs. Example: { "name": "wrench", "mass": "1kg", "count": "3" \}.
         */
        additionalUserLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Whether to bypass the safety checks for the job's temporary directory. Use with caution.
         */
        bypassTempDirValidation?: boolean | null;
        /**
         * Whether to enable Streaming Engine for the job.
         */
        enableStreamingEngine?: boolean | null;
        /**
         * Configuration for VM IPs.
         */
        ipConfiguration?: string | null;
        /**
         * Name for the Cloud KMS key for the job. The key format is: projects//locations//keyRings//cryptoKeys/
         */
        kmsKeyName?: string | null;
        /**
         * The machine type to use for the job. Defaults to the value from the template if not specified.
         */
        machineType?: string | null;
        /**
         * The maximum number of Compute Engine instances to be made available to your pipeline during execution, from 1 to 1000.
         */
        maxWorkers?: number | null;
        /**
         * Network to which VMs will be assigned. If empty or unspecified, the service will use the network "default".
         */
        network?: string | null;
        /**
         * The initial number of Compute Engine instances for the job.
         */
        numWorkers?: number | null;
        /**
         * The email address of the service account to run the job as.
         */
        serviceAccountEmail?: string | null;
        /**
         * Subnetwork to which VMs will be assigned, if desired. You can specify a subnetwork using either a complete URL or an abbreviated path. Expected to be of the form "https://www.googleapis.com/compute/v1/projects/HOST_PROJECT_ID/regions/REGION/subnetworks/SUBNETWORK" or "regions/REGION/subnetworks/SUBNETWORK". If the subnetwork is located in a Shared VPC network, you must use the complete URL.
         */
        subnetwork?: string | null;
        /**
         * The Cloud Storage path to use for temporary files. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        tempLocation?: string | null;
        /**
         * The Compute Engine region (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1". Mutually exclusive with worker_zone. If neither worker_region nor worker_zone is specified, default to the control plane's region.
         */
        workerRegion?: string | null;
        /**
         * The Compute Engine zone (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1-a". Mutually exclusive with worker_region. If neither worker_region nor worker_zone is specified, a zone in the control plane's region is chosen based on available capacity. If both `worker_zone` and `zone` are set, `worker_zone` takes precedence.
         */
        workerZone?: string | null;
        /**
         * The Compute Engine [availability zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones) for launching worker instances to run your pipeline. In the future, worker_zone will take precedence.
         */
        zone?: string | null;
    }
    /**
     * Details of the schedule the pipeline runs on.
     */
    export interface Schema$GoogleCloudDatapipelinesV1ScheduleSpec {
        /**
         * Output only. When the next Scheduler job is going to run.
         */
        nextJobTime?: string | null;
        /**
         * Unix-cron format of the schedule. This information is retrieved from the linked Cloud Scheduler.
         */
        schedule?: string | null;
        /**
         * Timezone ID. This matches the timezone IDs used by the Cloud Scheduler API. If empty, UTC time is assumed.
         */
        timeZone?: string | null;
    }
    /**
     * The version of the SDK used to run the job.
     */
    export interface Schema$GoogleCloudDatapipelinesV1SdkVersion {
        /**
         * The support status for this SDK version.
         */
        sdkSupportStatus?: string | null;
        /**
         * The version of the SDK used to run the job.
         */
        version?: string | null;
        /**
         * A readable string describing the version of the SDK.
         */
        versionDisplayName?: string | null;
    }
    /**
     * Request message for StopPipeline.
     */
    export interface Schema$GoogleCloudDatapipelinesV1StopPipelineRequest {
    }
    /**
     * Workload details for creating the pipeline jobs.
     */
    export interface Schema$GoogleCloudDatapipelinesV1Workload {
        /**
         * Template information and additional parameters needed to launch a Dataflow job using the flex launch API.
         */
        dataflowFlexTemplateRequest?: Schema$GoogleCloudDatapipelinesV1LaunchFlexTemplateRequest;
        /**
         * Template information and additional parameters needed to launch a Dataflow job using the standard launch API.
         */
        dataflowLaunchTemplateRequest?: Schema$GoogleCloudDatapipelinesV1LaunchTemplateRequest;
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
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        pipelines: Resource$Projects$Locations$Pipelines;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Pipelines {
        context: APIRequestContext;
        jobs: Resource$Projects$Locations$Pipelines$Jobs;
        constructor(context: APIRequestContext);
        /**
         * Creates a pipeline. For a batch pipeline, you can pass scheduler information. Data Pipelines uses the scheduler information to create an internal scheduler that runs jobs periodically. If the internal scheduler is not configured, you can use RunPipeline to run jobs.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Pipelines$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Pipelines$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1Pipeline>>;
        create(params: Params$Resource$Projects$Locations$Pipelines$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Pipelines$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        create(params: Params$Resource$Projects$Locations$Pipelines$Create, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        /**
         * Deletes a pipeline. If a scheduler job is attached to the pipeline, it will be deleted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Pipelines$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Pipelines$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Pipelines$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Pipelines$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Pipelines$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Looks up a single pipeline. Returns a "NOT_FOUND" error if no such pipeline exists. Returns a "FORBIDDEN" error if the caller doesn't have permission to access it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Pipelines$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Pipelines$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1Pipeline>>;
        get(params: Params$Resource$Projects$Locations$Pipelines$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Pipelines$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        get(params: Params$Resource$Projects$Locations$Pipelines$Get, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        /**
         * Lists pipelines. Returns a "FORBIDDEN" error if the caller doesn't have permission to access it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Pipelines$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Pipelines$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse>>;
        list(params: Params$Resource$Projects$Locations$Pipelines$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Pipelines$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Pipelines$List, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListPipelinesResponse>): void;
        /**
         * Updates a pipeline. If successful, the updated Pipeline is returned. Returns `NOT_FOUND` if the pipeline doesn't exist. If UpdatePipeline does not return successfully, you can retry the UpdatePipeline request until you receive a successful response.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Projects$Locations$Pipelines$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Pipelines$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1Pipeline>>;
        patch(params: Params$Resource$Projects$Locations$Pipelines$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Pipelines$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        patch(params: Params$Resource$Projects$Locations$Pipelines$Patch, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        /**
         * Creates a job for the specified pipeline directly. You can use this method when the internal scheduler is not configured and you want to trigger the job directly or through an external system. Returns a "NOT_FOUND" error if the pipeline doesn't exist. Returns a "FORBIDDEN" error if the user doesn't have permission to access the pipeline or run jobs for the pipeline.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        run(params: Params$Resource$Projects$Locations$Pipelines$Run, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        run(params?: Params$Resource$Projects$Locations$Pipelines$Run, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1RunPipelineResponse>>;
        run(params: Params$Resource$Projects$Locations$Pipelines$Run, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        run(params: Params$Resource$Projects$Locations$Pipelines$Run, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1RunPipelineResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1RunPipelineResponse>): void;
        run(params: Params$Resource$Projects$Locations$Pipelines$Run, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1RunPipelineResponse>): void;
        run(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1RunPipelineResponse>): void;
        /**
         * Freezes pipeline execution permanently. If there's a corresponding scheduler entry, it's deleted, and the pipeline state is changed to "ARCHIVED". However, pipeline metadata is retained.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        stop(params: Params$Resource$Projects$Locations$Pipelines$Stop, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stop(params?: Params$Resource$Projects$Locations$Pipelines$Stop, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1Pipeline>>;
        stop(params: Params$Resource$Projects$Locations$Pipelines$Stop, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stop(params: Params$Resource$Projects$Locations$Pipelines$Stop, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        stop(params: Params$Resource$Projects$Locations$Pipelines$Stop, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
        stop(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1Pipeline>): void;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Create extends StandardParameters {
        /**
         * Required. The location name. For example: `projects/PROJECT_ID/locations/LOCATION_ID`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatapipelinesV1Pipeline;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Delete extends StandardParameters {
        /**
         * Required. The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Get extends StandardParameters {
        /**
         * Required. The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$List extends StandardParameters {
        /**
         * An expression for filtering the results of the request. If unspecified, all pipelines will be returned. Multiple filters can be applied and must be comma separated. Fields eligible for filtering are: + `type`: The type of the pipeline (streaming or batch). Allowed values are `ALL`, `BATCH`, and `STREAMING`. + `status`: The activity status of the pipeline. Allowed values are `ALL`, `ACTIVE`, `ARCHIVED`, and `PAUSED`. For example, to limit results to active batch processing pipelines: type:BATCH,status:ACTIVE
         */
        filter?: string;
        /**
         * The maximum number of entities to return. The service may return fewer than this value, even if there are additional pages. If unspecified, the max limit is yet to be determined by the backend implementation.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListPipelines` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListPipelines` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The location name. For example: `projects/PROJECT_ID/locations/LOCATION_ID`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Patch extends StandardParameters {
        /**
         * The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`. * `PROJECT_ID` can contain letters ([A-Za-z]), numbers ([0-9]), hyphens (-), colons (:), and periods (.). For more information, see [Identifying projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects). * `LOCATION_ID` is the canonical ID for the pipeline's location. The list of available locations can be obtained by calling `google.cloud.location.Locations.ListLocations`. Note that the Data Pipelines service is not available in all regions. It depends on Cloud Scheduler, an App Engine application, so it's only available in [App Engine regions](https://cloud.google.com/about/locations#region). * `PIPELINE_ID` is the ID of the pipeline. Must be unique for the selected project and location.
         */
        name?: string;
        /**
         * The list of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatapipelinesV1Pipeline;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Run extends StandardParameters {
        /**
         * Required. The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatapipelinesV1RunPipelineRequest;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Stop extends StandardParameters {
        /**
         * Required. The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudDatapipelinesV1StopPipelineRequest;
    }
    export class Resource$Projects$Locations$Pipelines$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists jobs for a given pipeline. Throws a "FORBIDDEN" error if the caller doesn't have permission to access it.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Pipelines$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Pipelines$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudDatapipelinesV1ListJobsResponse>>;
        list(params: Params$Resource$Projects$Locations$Pipelines$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Pipelines$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListJobsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListJobsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Pipelines$Jobs$List, callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudDatapipelinesV1ListJobsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Pipelines$Jobs$List extends StandardParameters {
        /**
         * The maximum number of entities to return. The service may return fewer than this value, even if there are additional pages. If unspecified, the max limit will be determined by the backend implementation.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListJobs` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListJobs` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The pipeline name. For example: `projects/PROJECT_ID/locations/LOCATION_ID/pipelines/PIPELINE_ID`.
         */
        parent?: string;
    }
    export {};
}
