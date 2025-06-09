import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace dataflow_v1b3 {
    export interface Options extends GlobalOptions {
        version: 'v1b3';
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
     * Dataflow API
     *
     * Manages Google Cloud Dataflow projects on Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const dataflow = google.dataflow('v1b3');
     * ```
     */
    export class Dataflow {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Obsolete in favor of ApproximateReportedProgress and ApproximateSplitRequest.
     */
    export interface Schema$ApproximateProgress {
        /**
         * Obsolete.
         */
        percentComplete?: number | null;
        /**
         * Obsolete.
         */
        position?: Schema$Position;
        /**
         * Obsolete.
         */
        remainingTime?: string | null;
    }
    /**
     * A progress measurement of a WorkItem by a worker.
     */
    export interface Schema$ApproximateReportedProgress {
        /**
         * Total amount of parallelism in the portion of input of this task that has already been consumed and is no longer active. In the first two examples above (see remaining_parallelism), the value should be 29 or 2 respectively. The sum of remaining_parallelism and consumed_parallelism should equal the total amount of parallelism in this work item. If specified, must be finite.
         */
        consumedParallelism?: Schema$ReportedParallelism;
        /**
         * Completion as fraction of the input consumed, from 0.0 (beginning, nothing consumed), to 1.0 (end of the input, entire input consumed).
         */
        fractionConsumed?: number | null;
        /**
         * A Position within the work to represent a progress.
         */
        position?: Schema$Position;
        /**
         * Total amount of parallelism in the input of this task that remains, (i.e. can be delegated to this task and any new tasks via dynamic splitting). Always at least 1 for non-finished work items and 0 for finished. "Amount of parallelism" refers to how many non-empty parts of the input can be read in parallel. This does not necessarily equal number of records. An input that can be read in parallel down to the individual records is called "perfectly splittable". An example of non-perfectly parallelizable input is a block-compressed file format where a block of records has to be read as a whole, but different blocks can be read in parallel. Examples: * If we are processing record #30 (starting at 1) out of 50 in a perfectly splittable 50-record input, this value should be 21 (20 remaining + 1 current). * If we are reading through block 3 in a block-compressed file consisting of 5 blocks, this value should be 3 (since blocks 4 and 5 can be processed in parallel by new tasks via dynamic splitting and the current task remains processing block 3). * If we are reading through the last block in a block-compressed file, or reading or processing the last record in a perfectly splittable input, this value should be 1, because apart from the current task, no additional remainder can be split off.
         */
        remainingParallelism?: Schema$ReportedParallelism;
    }
    /**
     * A suggestion by the service to the worker to dynamically split the WorkItem.
     */
    export interface Schema$ApproximateSplitRequest {
        /**
         * A fraction at which to split the work item, from 0.0 (beginning of the input) to 1.0 (end of the input).
         */
        fractionConsumed?: number | null;
        /**
         * The fraction of the remainder of work to split the work item at, from 0.0 (split at the current position) to 1.0 (end of the input).
         */
        fractionOfRemainder?: number | null;
        /**
         * A Position at which to split the work item.
         */
        position?: Schema$Position;
    }
    /**
     * A structured message reporting an autoscaling decision made by the Dataflow service.
     */
    export interface Schema$AutoscalingEvent {
        /**
         * The current number of workers the job has.
         */
        currentNumWorkers?: string | null;
        /**
         * A message describing why the system decided to adjust the current number of workers, why it failed, or why the system decided to not make any changes to the number of workers.
         */
        description?: Schema$StructuredMessage;
        /**
         * The type of autoscaling event to report.
         */
        eventType?: string | null;
        /**
         * The target number of workers the worker pool wants to resize to use.
         */
        targetNumWorkers?: string | null;
        /**
         * The time this event was emitted to indicate a new target or current num_workers value.
         */
        time?: string | null;
        /**
         * A short and friendly name for the worker pool this event refers to.
         */
        workerPool?: string | null;
    }
    /**
     * Settings for WorkerPool autoscaling.
     */
    export interface Schema$AutoscalingSettings {
        /**
         * The algorithm to use for autoscaling.
         */
        algorithm?: string | null;
        /**
         * The maximum number of workers to cap scaling at.
         */
        maxNumWorkers?: number | null;
    }
    /**
     * Exponential buckets where the growth factor between buckets is `2**(2**-scale)`. e.g. for `scale=1` growth factor is `2**(2**(-1))=sqrt(2)`. `n` buckets will have the following boundaries. - 0th: [0, gf) - i in [1, n-1]: [gf^(i), gf^(i+1))
     */
    export interface Schema$Base2Exponent {
        /**
         * Must be greater than 0.
         */
        numberOfBuckets?: number | null;
        /**
         * Must be between -3 and 3. This forces the growth factor of the bucket boundaries to be between `2^(1/8)` and `256`.
         */
        scale?: number | null;
    }
    /**
     * Metadata for a BigQuery connector used by the job.
     */
    export interface Schema$BigQueryIODetails {
        /**
         * Dataset accessed in the connection.
         */
        dataset?: string | null;
        /**
         * Project accessed in the connection.
         */
        projectId?: string | null;
        /**
         * Query used to access data in the connection.
         */
        query?: string | null;
        /**
         * Table accessed in the connection.
         */
        table?: string | null;
    }
    /**
     * Metadata for a Cloud Bigtable connector used by the job.
     */
    export interface Schema$BigTableIODetails {
        /**
         * InstanceId accessed in the connection.
         */
        instanceId?: string | null;
        /**
         * ProjectId accessed in the connection.
         */
        projectId?: string | null;
        /**
         * TableId accessed in the connection.
         */
        tableId?: string | null;
    }
    /**
     * The message type used for encoding metrics of type bounded trie.
     */
    export interface Schema$BoundedTrie {
        /**
         * The maximum number of elements to store before truncation.
         */
        bound?: number | null;
        /**
         * A compact representation of all the elements in this trie.
         */
        root?: Schema$BoundedTrieNode;
        /**
         * A more efficient representation for metrics consisting of a single value.
         */
        singleton?: string[] | null;
    }
    /**
     * A single node in a BoundedTrie.
     */
    export interface Schema$BoundedTrieNode {
        /**
         * Children of this node. Must be empty if truncated is true.
         */
        children?: {
            [key: string]: Schema$BoundedTrieNode;
        } | null;
        /**
         * Whether this node has been truncated. A truncated leaf represents possibly many children with the same prefix.
         */
        truncated?: boolean | null;
    }
    /**
     * `BucketOptions` describes the bucket boundaries used in the histogram.
     */
    export interface Schema$BucketOptions {
        /**
         * Bucket boundaries grow exponentially.
         */
        exponential?: Schema$Base2Exponent;
        /**
         * Bucket boundaries grow linearly.
         */
        linear?: Schema$Linear;
    }
    /**
     * Description of an interstitial value between transforms in an execution stage.
     */
    export interface Schema$ComponentSource {
        /**
         * Dataflow service generated name for this source.
         */
        name?: string | null;
        /**
         * User name for the original user transform or collection with which this source is most closely associated.
         */
        originalTransformOrCollection?: string | null;
        /**
         * Human-readable name for this transform; may be user or system generated.
         */
        userName?: string | null;
    }
    /**
     * Description of a transform executed as part of an execution stage.
     */
    export interface Schema$ComponentTransform {
        /**
         * Dataflow service generated name for this source.
         */
        name?: string | null;
        /**
         * User name for the original user transform with which this transform is most closely associated.
         */
        originalTransform?: string | null;
        /**
         * Human-readable name for this transform; may be user or system generated.
         */
        userName?: string | null;
    }
    /**
     * All configuration data for a particular Computation.
     */
    export interface Schema$ComputationTopology {
        /**
         * The ID of the computation.
         */
        computationId?: string | null;
        /**
         * The inputs to the computation.
         */
        inputs?: Schema$StreamLocation[];
        /**
         * The key ranges processed by the computation.
         */
        keyRanges?: Schema$KeyRangeLocation[];
        /**
         * The outputs from the computation.
         */
        outputs?: Schema$StreamLocation[];
        /**
         * The state family values.
         */
        stateFamilies?: Schema$StateFamilyConfig[];
        /**
         * The system stage name.
         */
        systemStageName?: string | null;
    }
    /**
     * A position that encapsulates an inner position and an index for the inner position. A ConcatPosition can be used by a reader of a source that encapsulates a set of other sources.
     */
    export interface Schema$ConcatPosition {
        /**
         * Index of the inner source.
         */
        index?: number | null;
        /**
         * Position within the inner source.
         */
        position?: Schema$Position;
    }
    /**
     * Container Spec.
     */
    export interface Schema$ContainerSpec {
        /**
         * Default runtime environment for the job.
         */
        defaultEnvironment?: Schema$FlexTemplateRuntimeEnvironment;
        /**
         * Name of the docker container image. E.g., gcr.io/project/some-image
         */
        image?: string | null;
        /**
         * Cloud Storage path to self-signed certificate of private registry.
         */
        imageRepositoryCertPath?: string | null;
        /**
         * Secret Manager secret id for password to authenticate to private registry.
         */
        imageRepositoryPasswordSecretId?: string | null;
        /**
         * Secret Manager secret id for username to authenticate to private registry.
         */
        imageRepositoryUsernameSecretId?: string | null;
        /**
         * Metadata describing a template including description and validation rules.
         */
        metadata?: Schema$TemplateMetadata;
        /**
         * Required. SDK info of the Flex Template.
         */
        sdkInfo?: Schema$SDKInfo;
    }
    /**
     * CounterMetadata includes all static non-name non-value counter attributes.
     */
    export interface Schema$CounterMetadata {
        /**
         * Human-readable description of the counter semantics.
         */
        description?: string | null;
        /**
         * Counter aggregation kind.
         */
        kind?: string | null;
        /**
         * A string referring to the unit type.
         */
        otherUnits?: string | null;
        /**
         * System defined Units, see above enum.
         */
        standardUnits?: string | null;
    }
    /**
     * Identifies a counter within a per-job namespace. Counters whose structured names are the same get merged into a single value for the job.
     */
    export interface Schema$CounterStructuredName {
        /**
         * Name of the optimized step being executed by the workers.
         */
        componentStepName?: string | null;
        /**
         * Name of the stage. An execution step contains multiple component steps.
         */
        executionStepName?: string | null;
        /**
         * Index of an input collection that's being read from/written to as a side input. The index identifies a step's side inputs starting by 1 (e.g. the first side input has input_index 1, the third has input_index 3). Side inputs are identified by a pair of (original_step_name, input_index). This field helps uniquely identify them.
         */
        inputIndex?: number | null;
        /**
         * Counter name. Not necessarily globally-unique, but unique within the context of the other fields. Required.
         */
        name?: string | null;
        /**
         * One of the standard Origins defined above.
         */
        origin?: string | null;
        /**
         * The step name requesting an operation, such as GBK. I.e. the ParDo causing a read/write from shuffle to occur, or a read from side inputs.
         */
        originalRequestingStepName?: string | null;
        /**
         * System generated name of the original step in the user's graph, before optimization.
         */
        originalStepName?: string | null;
        /**
         * A string containing a more specific namespace of the counter's origin.
         */
        originNamespace?: string | null;
        /**
         * Portion of this counter, either key or value.
         */
        portion?: string | null;
        /**
         * ID of a particular worker.
         */
        workerId?: string | null;
    }
    /**
     * A single message which encapsulates structured name and metadata for a given counter.
     */
    export interface Schema$CounterStructuredNameAndMetadata {
        /**
         * Metadata associated with a counter
         */
        metadata?: Schema$CounterMetadata;
        /**
         * Structured name of the counter.
         */
        name?: Schema$CounterStructuredName;
    }
    /**
     * An update to a Counter sent from a worker. Next ID: 17
     */
    export interface Schema$CounterUpdate {
        /**
         * Boolean value for And, Or.
         */
        boolean?: boolean | null;
        /**
         * Bounded trie data
         */
        boundedTrie?: Schema$BoundedTrie;
        /**
         * True if this counter is reported as the total cumulative aggregate value accumulated since the worker started working on this WorkItem. By default this is false, indicating that this counter is reported as a delta.
         */
        cumulative?: boolean | null;
        /**
         * Distribution data
         */
        distribution?: Schema$DistributionUpdate;
        /**
         * Floating point value for Sum, Max, Min.
         */
        floatingPoint?: number | null;
        /**
         * List of floating point numbers, for Set.
         */
        floatingPointList?: Schema$FloatingPointList;
        /**
         * Floating point mean aggregation value for Mean.
         */
        floatingPointMean?: Schema$FloatingPointMean;
        /**
         * Integer value for Sum, Max, Min.
         */
        integer?: Schema$SplitInt64;
        /**
         * Gauge data
         */
        integerGauge?: Schema$IntegerGauge;
        /**
         * List of integers, for Set.
         */
        integerList?: Schema$IntegerList;
        /**
         * Integer mean aggregation value for Mean.
         */
        integerMean?: Schema$IntegerMean;
        /**
         * Value for internally-defined counters used by the Dataflow service.
         */
        internal?: any | null;
        /**
         * Counter name and aggregation type.
         */
        nameAndKind?: Schema$NameAndKind;
        /**
         * The service-generated short identifier for this counter. The short_id -\> (name, metadata) mapping is constant for the lifetime of a job.
         */
        shortId?: string | null;
        /**
         * List of strings, for Set.
         */
        stringList?: Schema$StringList;
        /**
         * Counter structured name and metadata.
         */
        structuredNameAndMetadata?: Schema$CounterStructuredNameAndMetadata;
    }
    /**
     * Modeled after information exposed by /proc/stat.
     */
    export interface Schema$CPUTime {
        /**
         * Average CPU utilization rate (% non-idle cpu / second) since previous sample.
         */
        rate?: number | null;
        /**
         * Timestamp of the measurement.
         */
        timestamp?: string | null;
        /**
         * Total active CPU time across all cores (ie., non-idle) in milliseconds since start-up.
         */
        totalMs?: string | null;
    }
    /**
     * A request to create a Cloud Dataflow job from a template.
     */
    export interface Schema$CreateJobFromTemplateRequest {
        /**
         * The runtime environment for the job.
         */
        environment?: Schema$RuntimeEnvironment;
        /**
         * Required. A Cloud Storage path to the template from which to create the job. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        gcsPath?: string | null;
        /**
         * Required. The job name to use for the created job.
         */
        jobName?: string | null;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string | null;
        /**
         * The runtime parameters to pass to the job.
         */
        parameters?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Identifies the location of a custom souce.
     */
    export interface Schema$CustomSourceLocation {
        /**
         * Whether this source is stateful.
         */
        stateful?: boolean | null;
    }
    /**
     * Data disk assignment for a given VM instance.
     */
    export interface Schema$DataDiskAssignment {
        /**
         * Mounted data disks. The order is important a data disk's 0-based index in this list defines which persistent directory the disk is mounted to, for example the list of { "myproject-1014-104817-4c2-harness-0-disk-0" \}, { "myproject-1014-104817-4c2-harness-0-disk-1" \}.
         */
        dataDisks?: string[] | null;
        /**
         * VM instance name the data disks mounted to, for example "myproject-1014-104817-4c2-harness-0".
         */
        vmInstance?: string | null;
    }
    /**
     * The gauge value of a metric.
     */
    export interface Schema$DataflowGaugeValue {
        /**
         * The timestamp when the gauge was recorded.
         */
        measuredTime?: string | null;
        /**
         * The value of the gauge.
         */
        value?: string | null;
    }
    /**
     * Summary statistics for a population of values. HistogramValue contains a sequence of buckets and gives a count of values that fall into each bucket. Bucket boundares are defined by a formula and bucket widths are either fixed or exponentially increasing.
     */
    export interface Schema$DataflowHistogramValue {
        /**
         * Optional. The number of values in each bucket of the histogram, as described in `bucket_options`. `bucket_counts` should contain N values, where N is the number of buckets specified in `bucket_options`. If `bucket_counts` has fewer than N values, the remaining values are assumed to be 0.
         */
        bucketCounts?: string[] | null;
        /**
         * Describes the bucket boundaries used in the histogram.
         */
        bucketOptions?: Schema$BucketOptions;
        /**
         * Number of values recorded in this histogram.
         */
        count?: string | null;
        /**
         * Statistics on the values recorded in the histogram that fall out of the bucket boundaries.
         */
        outlierStats?: Schema$OutlierStats;
    }
    /**
     * Configuration options for sampling elements.
     */
    export interface Schema$DataSamplingConfig {
        /**
         * List of given sampling behaviors to enable. For example, specifying behaviors = [ALWAYS_ON] samples in-flight elements but does not sample exceptions. Can be used to specify multiple behaviors like, behaviors = [ALWAYS_ON, EXCEPTIONS] for specifying periodic sampling and exception sampling. If DISABLED is in the list, then sampling will be disabled and ignore the other given behaviors. Ordering does not matter.
         */
        behaviors?: string[] | null;
    }
    /**
     * Contains per-worker telemetry about the data sampling feature.
     */
    export interface Schema$DataSamplingReport {
        /**
         * Optional. Delta of bytes written to file from previous report.
         */
        bytesWrittenDelta?: string | null;
        /**
         * Optional. Delta of bytes sampled from previous report.
         */
        elementsSampledBytes?: string | null;
        /**
         * Optional. Delta of number of elements sampled from previous report.
         */
        elementsSampledCount?: string | null;
        /**
         * Optional. Delta of number of samples taken from user code exceptions from previous report.
         */
        exceptionsSampledCount?: string | null;
        /**
         * Optional. Delta of number of PCollections sampled from previous report.
         */
        pcollectionsSampledCount?: string | null;
        /**
         * Optional. Delta of errors counts from persisting the samples from previous report.
         */
        persistenceErrorsCount?: string | null;
        /**
         * Optional. Delta of errors counts from retrieving, or translating the samples from previous report.
         */
        translationErrorsCount?: string | null;
    }
    /**
     * Metadata for a Datastore connector used by the job.
     */
    export interface Schema$DatastoreIODetails {
        /**
         * Namespace used in the connection.
         */
        namespace?: string | null;
        /**
         * ProjectId accessed in the connection.
         */
        projectId?: string | null;
    }
    /**
     * Describes any options that have an effect on the debugging of pipelines.
     */
    export interface Schema$DebugOptions {
        /**
         * Configuration options for sampling elements from a running pipeline.
         */
        dataSampling?: Schema$DataSamplingConfig;
        /**
         * Optional. When true, enables the logging of the literal hot key to the user's Cloud Logging.
         */
        enableHotKeyLogging?: boolean | null;
    }
    /**
     * Response from deleting a snapshot.
     */
    export interface Schema$DeleteSnapshotResponse {
    }
    /**
     * Specification of one of the bundles produced as a result of splitting a Source (e.g. when executing a SourceSplitRequest, or when splitting an active task using WorkItemStatus.dynamic_source_split), relative to the source being split.
     */
    export interface Schema$DerivedSource {
        /**
         * What source to base the produced source on (if any).
         */
        derivationMode?: string | null;
        /**
         * Specification of the source.
         */
        source?: Schema$Source;
    }
    /**
     * Describes the data disk used by a workflow job.
     */
    export interface Schema$Disk {
        /**
         * Disk storage type, as defined by Google Compute Engine. This must be a disk type appropriate to the project and zone in which the workers will run. If unknown or unspecified, the service will attempt to choose a reasonable default. For example, the standard persistent disk type is a resource name typically ending in "pd-standard". If SSD persistent disks are available, the resource name typically ends with "pd-ssd". The actual valid values are defined the Google Compute Engine API, not by the Cloud Dataflow API; consult the Google Compute Engine documentation for more information about determining the set of available disk types for a particular project and zone. Google Compute Engine Disk types are local to a particular project in a particular zone, and so the resource name will typically look something like this: compute.googleapis.com/projects/project-id/zones/zone/diskTypes/pd-standard
         */
        diskType?: string | null;
        /**
         * Directory in a VM where disk is mounted.
         */
        mountPoint?: string | null;
        /**
         * Size of disk in GB. If zero or unspecified, the service will attempt to choose a reasonable default.
         */
        sizeGb?: number | null;
    }
    /**
     * Data provided with a pipeline or transform to provide descriptive info.
     */
    export interface Schema$DisplayData {
        /**
         * Contains value if the data is of a boolean type.
         */
        boolValue?: boolean | null;
        /**
         * Contains value if the data is of duration type.
         */
        durationValue?: string | null;
        /**
         * Contains value if the data is of float type.
         */
        floatValue?: number | null;
        /**
         * Contains value if the data is of int64 type.
         */
        int64Value?: string | null;
        /**
         * Contains value if the data is of java class type.
         */
        javaClassValue?: string | null;
        /**
         * The key identifying the display data. This is intended to be used as a label for the display data when viewed in a dax monitoring system.
         */
        key?: string | null;
        /**
         * An optional label to display in a dax UI for the element.
         */
        label?: string | null;
        /**
         * The namespace for the key. This is usually a class name or programming language namespace (i.e. python module) which defines the display data. This allows a dax monitoring system to specially handle the data and perform custom rendering.
         */
        namespace?: string | null;
        /**
         * A possible additional shorter value to display. For example a java_class_name_value of com.mypackage.MyDoFn will be stored with MyDoFn as the short_str_value and com.mypackage.MyDoFn as the java_class_name value. short_str_value can be displayed and java_class_name_value will be displayed as a tooltip.
         */
        shortStrValue?: string | null;
        /**
         * Contains value if the data is of string type.
         */
        strValue?: string | null;
        /**
         * Contains value if the data is of timestamp type.
         */
        timestampValue?: string | null;
        /**
         * An optional full URL.
         */
        url?: string | null;
    }
    /**
     * A metric value representing a distribution.
     */
    export interface Schema$DistributionUpdate {
        /**
         * The count of the number of elements present in the distribution.
         */
        count?: Schema$SplitInt64;
        /**
         * (Optional) Histogram of value counts for the distribution.
         */
        histogram?: Schema$Histogram;
        /**
         * The maximum value present in the distribution.
         */
        max?: Schema$SplitInt64;
        /**
         * The minimum value present in the distribution.
         */
        min?: Schema$SplitInt64;
        /**
         * Use an int64 since we'd prefer the added precision. If overflow is a common problem we can detect it and use an additional int64 or a double.
         */
        sum?: Schema$SplitInt64;
        /**
         * Use a double since the sum of squares is likely to overflow int64.
         */
        sumOfSquares?: number | null;
    }
    /**
     * When a task splits using WorkItemStatus.dynamic_source_split, this message describes the two parts of the split relative to the description of the current task's input.
     */
    export interface Schema$DynamicSourceSplit {
        /**
         * Primary part (continued to be processed by worker). Specified relative to the previously-current source. Becomes current.
         */
        primary?: Schema$DerivedSource;
        /**
         * Residual part (returned to the pool of work). Specified relative to the previously-current source.
         */
        residual?: Schema$DerivedSource;
    }
    /**
     * Describes the environment in which a Dataflow Job runs.
     */
    export interface Schema$Environment {
        /**
         * The type of cluster manager API to use. If unknown or unspecified, the service will attempt to choose a reasonable default. This should be in the form of the API service name, e.g. "compute.googleapis.com".
         */
        clusterManagerApiService?: string | null;
        /**
         * Optional. The dataset for the current project where various workflow related tables are stored. The supported resource type is: Google BigQuery: bigquery.googleapis.com/{dataset\}
         */
        dataset?: string | null;
        /**
         * Optional. Any debugging options to be supplied to the job.
         */
        debugOptions?: Schema$DebugOptions;
        /**
         * The list of experiments to enable. This field should be used for SDK related experiments and not for service related experiments. The proper field for service related experiments is service_options.
         */
        experiments?: string[] | null;
        /**
         * Optional. Which Flexible Resource Scheduling mode to run in.
         */
        flexResourceSchedulingGoal?: string | null;
        /**
         * Experimental settings.
         */
        internalExperiments?: {
            [key: string]: any;
        } | null;
        /**
         * The Cloud Dataflow SDK pipeline options specified by the user. These options are passed through the service and are used to recreate the SDK pipeline options on the worker in a language agnostic and platform independent way.
         */
        sdkPipelineOptions?: {
            [key: string]: any;
        } | null;
        /**
         * Optional. Identity to run virtual machines as. Defaults to the default account.
         */
        serviceAccountEmail?: string | null;
        /**
         * Optional. If set, contains the Cloud KMS key identifier used to encrypt data at rest, AKA a Customer Managed Encryption Key (CMEK). Format: projects/PROJECT_ID/locations/LOCATION/keyRings/KEY_RING/cryptoKeys/KEY
         */
        serviceKmsKeyName?: string | null;
        /**
         * Optional. The list of service options to enable. This field should be used for service related experiments only. These experiments, when graduating to GA, should be replaced by dedicated fields or become default (i.e. always on).
         */
        serviceOptions?: string[] | null;
        /**
         * Output only. The shuffle mode used for the job.
         */
        shuffleMode?: string | null;
        /**
         * Optional. Specifies the Streaming Engine message processing guarantees. Reduces cost and latency but might result in duplicate messages committed to storage. Designed to run simple mapping streaming ETL jobs at the lowest cost. For example, Change Data Capture (CDC) to BigQuery is a canonical use case. For more information, see [Set the pipeline streaming mode](https://cloud.google.com/dataflow/docs/guides/streaming-modes).
         */
        streamingMode?: string | null;
        /**
         * The prefix of the resources the system should use for temporary storage. The system will append the suffix "/temp-{JOBNAME\} to this resource prefix, where {JOBNAME\} is the value of the job_name field. The resulting bucket and object prefix is used as the prefix of the resources used to store temporary data needed during the job execution. NOTE: This will override the value in taskrunner_settings. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket\}/{object\} bucket.storage.googleapis.com/{object\}
         */
        tempStoragePrefix?: string | null;
        /**
         * Optional. True when any worker pool that uses public IPs is present.
         */
        usePublicIps?: boolean | null;
        /**
         * A description of the process that generated the request.
         */
        userAgent?: {
            [key: string]: any;
        } | null;
        /**
         * Output only. Whether the job uses the Streaming Engine resource-based billing model.
         */
        useStreamingEngineResourceBasedBilling?: boolean | null;
        /**
         * A structure describing which components and their versions of the service are required in order to run the job.
         */
        version?: {
            [key: string]: any;
        } | null;
        /**
         * The worker pools. At least one "harness" worker pool must be specified in order for the job to have workers.
         */
        workerPools?: Schema$WorkerPool[];
        /**
         * Optional. The Compute Engine region (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1". Mutually exclusive with worker_zone. If neither worker_region nor worker_zone is specified, default to the control plane's region.
         */
        workerRegion?: string | null;
        /**
         * Optional. The Compute Engine zone (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1-a". Mutually exclusive with worker_region. If neither worker_region nor worker_zone is specified, a zone in the control plane's region is chosen based on available capacity.
         */
        workerZone?: string | null;
    }
    /**
     * A message describing the state of a particular execution stage.
     */
    export interface Schema$ExecutionStageState {
        /**
         * The time at which the stage transitioned to this state.
         */
        currentStateTime?: string | null;
        /**
         * The name of the execution stage.
         */
        executionStageName?: string | null;
        /**
         * Executions stage states allow the same set of values as JobState.
         */
        executionStageState?: string | null;
    }
    /**
     * Description of the composing transforms, names/ids, and input/outputs of a stage of execution. Some composing transforms and sources may have been generated by the Dataflow service during execution planning.
     */
    export interface Schema$ExecutionStageSummary {
        /**
         * Collections produced and consumed by component transforms of this stage.
         */
        componentSource?: Schema$ComponentSource[];
        /**
         * Transforms that comprise this execution stage.
         */
        componentTransform?: Schema$ComponentTransform[];
        /**
         * Dataflow service generated id for this stage.
         */
        id?: string | null;
        /**
         * Input sources for this stage.
         */
        inputSource?: Schema$StageSource[];
        /**
         * Type of transform this stage is executing.
         */
        kind?: string | null;
        /**
         * Dataflow service generated name for this stage.
         */
        name?: string | null;
        /**
         * Output sources for this stage.
         */
        outputSource?: Schema$StageSource[];
        /**
         * Other stages that must complete before this stage can run.
         */
        prerequisiteStage?: string[] | null;
    }
    /**
     * Indicates which [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) failed to respond to a request for data.
     */
    export interface Schema$FailedLocation {
        /**
         * The name of the [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that failed to respond.
         */
        name?: string | null;
    }
    /**
     * Metadata for a File connector used by the job.
     */
    export interface Schema$FileIODetails {
        /**
         * File Pattern used to access files by the connector.
         */
        filePattern?: string | null;
    }
    /**
     * An instruction that copies its inputs (zero or more) to its (single) output.
     */
    export interface Schema$FlattenInstruction {
        /**
         * Describes the inputs to the flatten instruction.
         */
        inputs?: Schema$InstructionInput[];
    }
    /**
     * The environment values to be set at runtime for flex template.
     */
    export interface Schema$FlexTemplateRuntimeEnvironment {
        /**
         * Additional experiment flags for the job.
         */
        additionalExperiments?: string[] | null;
        /**
         * Optional. Additional pipeline option flags for the job.
         */
        additionalPipelineOptions?: string[] | null;
        /**
         * Additional user labels to be specified for the job. Keys and values must follow the restrictions specified in the [labeling restrictions](https://cloud.google.com/compute/docs/labeling-resources#restrictions) page. An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1kg", "count": "3" \}.
         */
        additionalUserLabels?: {
            [key: string]: string;
        } | null;
        /**
         * The algorithm to use for autoscaling
         */
        autoscalingAlgorithm?: string | null;
        /**
         * Worker disk size, in gigabytes.
         */
        diskSizeGb?: number | null;
        /**
         * If true, when processing time is spent almost entirely on garbage collection (GC), saves a heap dump before ending the thread or process. If false, ends the thread or process without saving a heap dump. Does not save a heap dump when the Java Virtual Machine (JVM) has an out of memory error during processing. The location of the heap file is either echoed back to the user, or the user is given the opportunity to download the heap file.
         */
        dumpHeapOnOom?: boolean | null;
        /**
         * If true serial port logging will be enabled for the launcher VM.
         */
        enableLauncherVmSerialPortLogging?: boolean | null;
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
         * The machine type to use for launching the job. The default is n1-standard-1.
         */
        launcherMachineType?: string | null;
        /**
         * The machine type to use for the job. Defaults to the value from the template if not specified.
         */
        machineType?: string | null;
        /**
         * The maximum number of Google Compute Engine instances to be made available to your pipeline during execution, from 1 to 1000.
         */
        maxWorkers?: number | null;
        /**
         * Network to which VMs will be assigned. If empty or unspecified, the service will use the network "default".
         */
        network?: string | null;
        /**
         * The initial number of Google Compute Engine instances for the job.
         */
        numWorkers?: number | null;
        /**
         * Cloud Storage bucket (directory) to upload heap dumps to. Enabling this field implies that `dump_heap_on_oom` is set to true.
         */
        saveHeapDumpsToGcsPath?: string | null;
        /**
         * Docker registry location of container image to use for the 'worker harness. Default is the container for the version of the SDK. Note this field is only valid for portable pipelines.
         */
        sdkContainerImage?: string | null;
        /**
         * The email address of the service account to run the job as.
         */
        serviceAccountEmail?: string | null;
        /**
         * The Cloud Storage path for staging local files. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        stagingLocation?: string | null;
        /**
         * Optional. Specifies the Streaming Engine message processing guarantees. Reduces cost and latency but might result in duplicate messages committed to storage. Designed to run simple mapping streaming ETL jobs at the lowest cost. For example, Change Data Capture (CDC) to BigQuery is a canonical use case. For more information, see [Set the pipeline streaming mode](https://cloud.google.com/dataflow/docs/guides/streaming-modes).
         */
        streamingMode?: string | null;
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
     * A metric value representing a list of floating point numbers.
     */
    export interface Schema$FloatingPointList {
        /**
         * Elements of the list.
         */
        elements?: number[] | null;
    }
    /**
     * A representation of a floating point mean metric contribution.
     */
    export interface Schema$FloatingPointMean {
        /**
         * The number of values being aggregated.
         */
        count?: Schema$SplitInt64;
        /**
         * The sum of all values being aggregated.
         */
        sum?: number | null;
    }
    /**
     * Request to get updated debug configuration for component.
     */
    export interface Schema$GetDebugConfigRequest {
        /**
         * The internal component id for which debug configuration is requested.
         */
        componentId?: string | null;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string | null;
        /**
         * The worker id, i.e., VM hostname.
         */
        workerId?: string | null;
    }
    /**
     * Response to a get debug configuration request.
     */
    export interface Schema$GetDebugConfigResponse {
        /**
         * The encoded debug configuration for the requested component.
         */
        config?: string | null;
    }
    /**
     * The response to a GetTemplate request.
     */
    export interface Schema$GetTemplateResponse {
        /**
         * The template metadata describing the template name, available parameters, etc.
         */
        metadata?: Schema$TemplateMetadata;
        /**
         * Describes the runtime metadata with SDKInfo and available parameters.
         */
        runtimeMetadata?: Schema$RuntimeMetadata;
        /**
         * The status of the get template request. Any problems with the request will be indicated in the error_details.
         */
        status?: Schema$Status;
        /**
         * Template Type.
         */
        templateType?: string | null;
    }
    /**
     * Information about the GPU usage on the worker.
     */
    export interface Schema$GPUUsage {
        /**
         * Required. Timestamp of the measurement.
         */
        timestamp?: string | null;
        /**
         * Required. Utilization info about the GPU.
         */
        utilization?: Schema$GPUUtilization;
    }
    /**
     * Utilization details about the GPU.
     */
    export interface Schema$GPUUtilization {
        /**
         * Required. GPU utilization rate of any kernel over the last sample period in the range of [0, 1].
         */
        rate?: number | null;
    }
    /**
     * Histogram of value counts for a distribution. Buckets have an inclusive lower bound and exclusive upper bound and use "1,2,5 bucketing": The first bucket range is from [0,1) and all subsequent bucket boundaries are powers of ten multiplied by 1, 2, or 5. Thus, bucket boundaries are 0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, ... Negative values are not supported.
     */
    export interface Schema$Histogram {
        /**
         * Counts of values in each bucket. For efficiency, prefix and trailing buckets with count = 0 are elided. Buckets can store the full range of values of an unsigned long, with ULLONG_MAX falling into the 59th bucket with range [1e19, 2e19).
         */
        bucketCounts?: string[] | null;
        /**
         * Starting index of first stored bucket. The non-inclusive upper-bound of the ith bucket is given by: pow(10,(i-first_bucket_offset)/3) * (1,2,5)[(i-first_bucket_offset)%3]
         */
        firstBucketOffset?: number | null;
    }
    /**
     * Information useful for debugging a hot key detection.
     */
    export interface Schema$HotKeyDebuggingInfo {
        /**
         * Debugging information for each detected hot key. Keyed by a hash of the key.
         */
        detectedHotKeys?: {
            [key: string]: Schema$HotKeyInfo;
        } | null;
    }
    /**
     * Proto describing a hot key detected on a given WorkItem.
     */
    export interface Schema$HotKeyDetection {
        /**
         * The age of the hot key measured from when it was first detected.
         */
        hotKeyAge?: string | null;
        /**
         * System-defined name of the step containing this hot key. Unique across the workflow.
         */
        systemName?: string | null;
        /**
         * User-provided name of the step that contains this hot key.
         */
        userStepName?: string | null;
    }
    /**
     * Information about a hot key.
     */
    export interface Schema$HotKeyInfo {
        /**
         * The age of the hot key measured from when it was first detected.
         */
        hotKeyAge?: string | null;
        /**
         * A detected hot key that is causing limited parallelism. This field will be populated only if the following flag is set to true: "--enable_hot_key_logging".
         */
        key?: string | null;
        /**
         * If true, then the above key is truncated and cannot be deserialized. This occurs if the key above is populated and the key size is \>5MB.
         */
        keyTruncated?: boolean | null;
    }
    /**
     * An input of an instruction, as a reference to an output of a producer instruction.
     */
    export interface Schema$InstructionInput {
        /**
         * The output index (origin zero) within the producer.
         */
        outputNum?: number | null;
        /**
         * The index (origin zero) of the parallel instruction that produces the output to be consumed by this input. This index is relative to the list of instructions in this input's instruction's containing MapTask.
         */
        producerInstructionIndex?: number | null;
    }
    /**
     * An output of an instruction.
     */
    export interface Schema$InstructionOutput {
        /**
         * The codec to use to encode data being written via this output.
         */
        codec?: {
            [key: string]: any;
        } | null;
        /**
         * The user-provided name of this output.
         */
        name?: string | null;
        /**
         * For system-generated byte and mean byte metrics, certain instructions should only report the key size.
         */
        onlyCountKeyBytes?: boolean | null;
        /**
         * For system-generated byte and mean byte metrics, certain instructions should only report the value size.
         */
        onlyCountValueBytes?: boolean | null;
        /**
         * System-defined name for this output in the original workflow graph. Outputs that do not contribute to an original instruction do not set this.
         */
        originalName?: string | null;
        /**
         * System-defined name of this output. Unique across the workflow.
         */
        systemName?: string | null;
    }
    /**
     * A metric value representing temporal values of a variable.
     */
    export interface Schema$IntegerGauge {
        /**
         * The time at which this value was measured. Measured as msecs from epoch.
         */
        timestamp?: string | null;
        /**
         * The value of the variable represented by this gauge.
         */
        value?: Schema$SplitInt64;
    }
    /**
     * A metric value representing a list of integers.
     */
    export interface Schema$IntegerList {
        /**
         * Elements of the list.
         */
        elements?: Schema$SplitInt64[];
    }
    /**
     * A representation of an integer mean metric contribution.
     */
    export interface Schema$IntegerMean {
        /**
         * The number of values being aggregated.
         */
        count?: Schema$SplitInt64;
        /**
         * The sum of all values being aggregated.
         */
        sum?: Schema$SplitInt64;
    }
    /**
     * Defines a job to be run by the Cloud Dataflow service. Do not enter confidential information when you supply string values using the API.
     */
    export interface Schema$Job {
        /**
         * The client's unique identifier of the job, re-used across retried attempts. If this field is set, the service will ensure its uniqueness. The request to create a job will fail if the service has knowledge of a previously submitted job with the same client's ID and job name. The caller may use this field to ensure idempotence of job creation across retried attempts to create a job. By default, the field is empty and, in that case, the service ignores it.
         */
        clientRequestId?: string | null;
        /**
         * If this is specified, the job's initial state is populated from the given snapshot.
         */
        createdFromSnapshotId?: string | null;
        /**
         * The timestamp when the job was initially created. Immutable and set by the Cloud Dataflow service.
         */
        createTime?: string | null;
        /**
         * The current state of the job. Jobs are created in the `JOB_STATE_STOPPED` state unless otherwise specified. A job in the `JOB_STATE_RUNNING` state may asynchronously enter a terminal state. After a job has reached a terminal state, no further state updates may be made. This field might be mutated by the Dataflow service; callers cannot mutate it.
         */
        currentState?: string | null;
        /**
         * The timestamp associated with the current state.
         */
        currentStateTime?: string | null;
        /**
         * Optional. The environment for the job.
         */
        environment?: Schema$Environment;
        /**
         * Deprecated.
         */
        executionInfo?: Schema$JobExecutionInfo;
        /**
         * The unique ID of this job. This field is set by the Dataflow service when the job is created, and is immutable for the life of the job.
         */
        id?: string | null;
        /**
         * This field is populated by the Dataflow service to support filtering jobs by the metadata values provided here. Populated for ListJobs and all GetJob views SUMMARY and higher.
         */
        jobMetadata?: Schema$JobMetadata;
        /**
         * User-defined labels for this job. The labels map can contain no more than 64 entries. Entries of the labels map are UTF8 strings that comply with the following restrictions: * Keys must conform to regexp: \p{Ll\}\p{Lo\}{0,62\} * Values must conform to regexp: [\p{Ll\}\p{Lo\}\p{N\}_-]{0,63\} * Both keys and values are additionally constrained to be <= 128 bytes in size.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string | null;
        /**
         * Optional. The user-specified Dataflow job name. Only one active job with a given name can exist in a project within one region at any given time. Jobs in different regions can have the same name. If a caller attempts to create a job with the same name as an active job that already exists, the attempt returns the existing job. The name must match the regular expression `[a-z]([-a-z0-9]{0,1022\}[a-z0-9])?`
         */
        name?: string | null;
        /**
         * Preliminary field: The format of this data may change at any time. A description of the user pipeline and stages through which it is executed. Created by Cloud Dataflow service. Only retrieved with JOB_VIEW_DESCRIPTION or JOB_VIEW_ALL.
         */
        pipelineDescription?: Schema$PipelineDescription;
        /**
         * The ID of the Google Cloud project that the job belongs to.
         */
        projectId?: string | null;
        /**
         * If another job is an update of this job (and thus, this job is in `JOB_STATE_UPDATED`), this field contains the ID of that job.
         */
        replacedByJobId?: string | null;
        /**
         * If this job is an update of an existing job, this field is the job ID of the job it replaced. When sending a `CreateJobRequest`, you can update a job by specifying it here. The job named here is stopped, and its intermediate state is transferred to this job.
         */
        replaceJobId?: string | null;
        /**
         * The job's requested state. Applies to `UpdateJob` requests. Set `requested_state` with `UpdateJob` requests to switch between the states `JOB_STATE_STOPPED` and `JOB_STATE_RUNNING`. You can also use `UpdateJob` requests to change a job's state from `JOB_STATE_RUNNING` to `JOB_STATE_CANCELLED`, `JOB_STATE_DONE`, or `JOB_STATE_DRAINED`. These states irrevocably terminate the job if it hasn't already reached a terminal state. This field has no effect on `CreateJob` requests.
         */
        requestedState?: string | null;
        /**
         * This field may ONLY be modified at runtime using the projects.jobs.update method to adjust job behavior. This field has no effect when specified at job creation.
         */
        runtimeUpdatableParams?: Schema$RuntimeUpdatableParams;
        /**
         * Output only. Reserved for future use. This field is set only in responses from the server; it is ignored if it is set in any requests.
         */
        satisfiesPzi?: boolean | null;
        /**
         * Reserved for future use. This field is set only in responses from the server; it is ignored if it is set in any requests.
         */
        satisfiesPzs?: boolean | null;
        /**
         * Output only. Resources used by the Dataflow Service to run the job.
         */
        serviceResources?: Schema$ServiceResources;
        /**
         * This field may be mutated by the Cloud Dataflow service; callers cannot mutate it.
         */
        stageStates?: Schema$ExecutionStageState[];
        /**
         * The timestamp when the job was started (transitioned to JOB_STATE_PENDING). Flexible resource scheduling jobs are started with some delay after job creation, so start_time is unset before start and is updated when the job is started by the Cloud Dataflow service. For other jobs, start_time always equals to create_time and is immutable and set by the Cloud Dataflow service.
         */
        startTime?: string | null;
        /**
         * Exactly one of step or steps_location should be specified. The top-level steps that constitute the entire job. Only retrieved with JOB_VIEW_ALL.
         */
        steps?: Schema$Step[];
        /**
         * The Cloud Storage location where the steps are stored.
         */
        stepsLocation?: string | null;
        /**
         * A set of files the system should be aware of that are used for temporary storage. These temporary files will be removed on job completion. No duplicates are allowed. No file patterns are supported. The supported files are: Google Cloud Storage: storage.googleapis.com/{bucket\}/{object\} bucket.storage.googleapis.com/{object\}
         */
        tempFiles?: string[] | null;
        /**
         * Optional. The map of transform name prefixes of the job to be replaced to the corresponding name prefixes of the new job.
         */
        transformNameMapping?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The type of Dataflow job.
         */
        type?: string | null;
    }
    /**
     * Information about the execution of a job.
     */
    export interface Schema$JobExecutionDetails {
        /**
         * If present, this response does not contain all requested tasks. To obtain the next page of results, repeat the request with page_token set to this value.
         */
        nextPageToken?: string | null;
        /**
         * The stages of the job execution.
         */
        stages?: Schema$StageSummary[];
    }
    /**
     * Additional information about how a Cloud Dataflow job will be executed that isn't contained in the submitted job.
     */
    export interface Schema$JobExecutionInfo {
        /**
         * A mapping from each stage to the information about that stage.
         */
        stages?: {
            [key: string]: Schema$JobExecutionStageInfo;
        } | null;
    }
    /**
     * Contains information about how a particular google.dataflow.v1beta3.Step will be executed.
     */
    export interface Schema$JobExecutionStageInfo {
        /**
         * The steps associated with the execution stage. Note that stages may have several steps, and that a given step might be run by more than one stage.
         */
        stepName?: string[] | null;
    }
    /**
     * A particular message pertaining to a Dataflow job.
     */
    export interface Schema$JobMessage {
        /**
         * Deprecated.
         */
        id?: string | null;
        /**
         * Importance level of the message.
         */
        messageImportance?: string | null;
        /**
         * The text of the message.
         */
        messageText?: string | null;
        /**
         * The timestamp of the message.
         */
        time?: string | null;
    }
    /**
     * Metadata available primarily for filtering jobs. Will be included in the ListJob response and Job SUMMARY view.
     */
    export interface Schema$JobMetadata {
        /**
         * Identification of a BigQuery source used in the Dataflow job.
         */
        bigqueryDetails?: Schema$BigQueryIODetails[];
        /**
         * Identification of a Cloud Bigtable source used in the Dataflow job.
         */
        bigTableDetails?: Schema$BigTableIODetails[];
        /**
         * Identification of a Datastore source used in the Dataflow job.
         */
        datastoreDetails?: Schema$DatastoreIODetails[];
        /**
         * Identification of a File source used in the Dataflow job.
         */
        fileDetails?: Schema$FileIODetails[];
        /**
         * Identification of a Pub/Sub source used in the Dataflow job.
         */
        pubsubDetails?: Schema$PubSubIODetails[];
        /**
         * The SDK version used to run the job.
         */
        sdkVersion?: Schema$SdkVersion;
        /**
         * Identification of a Spanner source used in the Dataflow job.
         */
        spannerDetails?: Schema$SpannerIODetails[];
        /**
         * List of display properties to help UI filter jobs.
         */
        userDisplayProperties?: {
            [key: string]: string;
        } | null;
    }
    /**
     * JobMetrics contains a collection of metrics describing the detailed progress of a Dataflow job. Metrics correspond to user-defined and system-defined metrics in the job. For more information, see [Dataflow job metrics] (https://cloud.google.com/dataflow/docs/guides/using-monitoring-intf). This resource captures only the most recent values of each metric; time-series data can be queried for them (under the same metric names) from Cloud Monitoring.
     */
    export interface Schema$JobMetrics {
        /**
         * All metrics for this job.
         */
        metrics?: Schema$MetricUpdate[];
        /**
         * Timestamp as of which metric values are current.
         */
        metricTime?: string | null;
    }
    /**
     * Data disk assignment information for a specific key-range of a sharded computation. Currently we only support UTF-8 character splits to simplify encoding into JSON.
     */
    export interface Schema$KeyRangeDataDiskAssignment {
        /**
         * The name of the data disk where data for this range is stored. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example "myproject-1014-104817-4c2-harness-0-disk-1".
         */
        dataDisk?: string | null;
        /**
         * The end (exclusive) of the key range.
         */
        end?: string | null;
        /**
         * The start (inclusive) of the key range.
         */
        start?: string | null;
    }
    /**
     * Location information for a specific key-range of a sharded computation. Currently we only support UTF-8 character splits to simplify encoding into JSON.
     */
    export interface Schema$KeyRangeLocation {
        /**
         * The name of the data disk where data for this range is stored. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example "myproject-1014-104817-4c2-harness-0-disk-1".
         */
        dataDisk?: string | null;
        /**
         * The physical location of this range assignment to be used for streaming computation cross-worker message delivery.
         */
        deliveryEndpoint?: string | null;
        /**
         * DEPRECATED. The location of the persistent state for this range, as a persistent directory in the worker local filesystem.
         */
        deprecatedPersistentDirectory?: string | null;
        /**
         * The end (exclusive) of the key range.
         */
        end?: string | null;
        /**
         * The start (inclusive) of the key range.
         */
        start?: string | null;
    }
    /**
     * Launch FlexTemplate Parameter.
     */
    export interface Schema$LaunchFlexTemplateParameter {
        /**
         * Spec about the container image to launch.
         */
        containerSpec?: Schema$ContainerSpec;
        /**
         * Cloud Storage path to a file with json serialized ContainerSpec as content.
         */
        containerSpecGcsPath?: string | null;
        /**
         * The runtime environment for the FlexTemplate job
         */
        environment?: Schema$FlexTemplateRuntimeEnvironment;
        /**
         * Required. The job name to use for the created job. For update job request, job name should be same as the existing running job.
         */
        jobName?: string | null;
        /**
         * Launch options for this flex template job. This is a common set of options across languages and templates. This should not be used to pass job parameters.
         */
        launchOptions?: {
            [key: string]: string;
        } | null;
        /**
         * The parameters for FlexTemplate. Ex. {"num_workers":"5"\}
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Use this to pass transform_name_mappings for streaming update jobs. Ex:{"oldTransformName":"newTransformName",...\}'
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
     * A request to launch a Cloud Dataflow job from a FlexTemplate.
     */
    export interface Schema$LaunchFlexTemplateRequest {
        /**
         * Required. Parameter to launch a job form Flex Template.
         */
        launchParameter?: Schema$LaunchFlexTemplateParameter;
        /**
         * If true, the request is validated but not actually executed. Defaults to false.
         */
        validateOnly?: boolean | null;
    }
    /**
     * Response to the request to launch a job from Flex Template.
     */
    export interface Schema$LaunchFlexTemplateResponse {
        /**
         * The job that was launched, if the request was not a dry run and the job was successfully launched.
         */
        job?: Schema$Job;
    }
    /**
     * Parameters to provide to the template being launched. Note that the [metadata in the pipeline code] (https://cloud.google.com/dataflow/docs/guides/templates/creating-templates#metadata) determines which runtime parameters are valid.
     */
    export interface Schema$LaunchTemplateParameters {
        /**
         * The runtime environment for the job.
         */
        environment?: Schema$RuntimeEnvironment;
        /**
         * Required. The job name to use for the created job. The name must match the regular expression `[a-z]([-a-z0-9]{0,1022\}[a-z0-9])?`
         */
        jobName?: string | null;
        /**
         * The runtime parameters to pass to the job.
         */
        parameters?: {
            [key: string]: string;
        } | null;
        /**
         * Only applicable when updating a pipeline. Map of transform name prefixes of the job to be replaced to the corresponding name prefixes of the new job.
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
     * Response to the request to launch a template.
     */
    export interface Schema$LaunchTemplateResponse {
        /**
         * The job that was launched, if the request was not a dry run and the job was successfully launched.
         */
        job?: Schema$Job;
    }
    /**
     * Request to lease WorkItems.
     */
    export interface Schema$LeaseWorkItemRequest {
        /**
         * The current timestamp at the worker.
         */
        currentWorkerTime?: string | null;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the WorkItem's job.
         */
        location?: string | null;
        /**
         * Optional. The project number of the project this worker belongs to.
         */
        projectNumber?: string | null;
        /**
         * The initial lease period.
         */
        requestedLeaseDuration?: string | null;
        /**
         * Untranslated bag-of-bytes WorkRequest from UnifiedWorker.
         */
        unifiedWorkerRequest?: {
            [key: string]: any;
        } | null;
        /**
         * Worker capabilities. WorkItems might be limited to workers with specific capabilities.
         */
        workerCapabilities?: string[] | null;
        /**
         * Identifies the worker leasing work -- typically the ID of the virtual machine running the worker.
         */
        workerId?: string | null;
        /**
         * Filter for WorkItem type.
         */
        workItemTypes?: string[] | null;
    }
    /**
     * Response to a request to lease WorkItems.
     */
    export interface Schema$LeaseWorkItemResponse {
        /**
         * Untranslated bag-of-bytes WorkResponse for UnifiedWorker.
         */
        unifiedWorkerResponse?: {
            [key: string]: any;
        } | null;
        /**
         * A list of the leased WorkItems.
         */
        workItems?: Schema$WorkItem[];
    }
    /**
     * Linear buckets with the following boundaries for indices in 0 to n-1. - i in [0, n-1]: [start + (i)*width, start + (i+1)*width)
     */
    export interface Schema$Linear {
        /**
         * Must be greater than 0.
         */
        numberOfBuckets?: number | null;
        /**
         * Lower bound of the first bucket.
         */
        start?: number | null;
        /**
         * Distance between bucket boundaries. Must be greater than 0.
         */
        width?: number | null;
    }
    /**
     * Response to a request to list job messages.
     */
    export interface Schema$ListJobMessagesResponse {
        /**
         * Autoscaling events in ascending timestamp order.
         */
        autoscalingEvents?: Schema$AutoscalingEvent[];
        /**
         * Messages in ascending timestamp order.
         */
        jobMessages?: Schema$JobMessage[];
        /**
         * The token to obtain the next page of results if there are more.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response to a request to list Cloud Dataflow jobs in a project. This might be a partial response, depending on the page size in the ListJobsRequest. However, if the project does not have any jobs, an instance of ListJobsResponse is not returned and the requests's response body is empty {\}.
     */
    export interface Schema$ListJobsResponse {
        /**
         * Zero or more messages describing the [regional endpoints] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that failed to respond.
         */
        failedLocation?: Schema$FailedLocation[];
        /**
         * A subset of the requested job information.
         */
        jobs?: Schema$Job[];
        /**
         * Set if there may be more results than fit in this response.
         */
        nextPageToken?: string | null;
    }
    /**
     * List of snapshots.
     */
    export interface Schema$ListSnapshotsResponse {
        /**
         * Returned snapshots.
         */
        snapshots?: Schema$Snapshot[];
    }
    /**
     * MapTask consists of an ordered set of instructions, each of which describes one particular low-level operation for the worker to perform in order to accomplish the MapTask's WorkItem. Each instruction must appear in the list before any instructions which depends on its output.
     */
    export interface Schema$MapTask {
        /**
         * Counter prefix that can be used to prefix counters. Not currently used in Dataflow.
         */
        counterPrefix?: string | null;
        /**
         * The instructions in the MapTask.
         */
        instructions?: Schema$ParallelInstruction[];
        /**
         * System-defined name of the stage containing this MapTask. Unique across the workflow.
         */
        stageName?: string | null;
        /**
         * System-defined name of this MapTask. Unique across the workflow.
         */
        systemName?: string | null;
    }
    /**
     * Information about the memory usage of a worker or a container within a worker.
     */
    export interface Schema$MemInfo {
        /**
         * Instantenous memory limit in bytes.
         */
        currentLimitBytes?: string | null;
        /**
         * Number of Out of Memory (OOM) events recorded since the previous measurement.
         */
        currentOoms?: string | null;
        /**
         * Instantenous memory (RSS) size in bytes.
         */
        currentRssBytes?: string | null;
        /**
         * Timestamp of the measurement.
         */
        timestamp?: string | null;
        /**
         * Total memory (RSS) usage since start up in GB * ms.
         */
        totalGbMs?: string | null;
    }
    /**
     * The metric short id is returned to the user alongside an offset into ReportWorkItemStatusRequest
     */
    export interface Schema$MetricShortId {
        /**
         * The index of the corresponding metric in the ReportWorkItemStatusRequest. Required.
         */
        metricIndex?: number | null;
        /**
         * The service-generated short identifier for the metric.
         */
        shortId?: string | null;
    }
    /**
     * Identifies a metric, by describing the source which generated the metric.
     */
    export interface Schema$MetricStructuredName {
        /**
         * Zero or more labeled fields which identify the part of the job this metric is associated with, such as the name of a step or collection. For example, built-in counters associated with steps will have context['step'] = . Counters associated with PCollections in the SDK will have context['pcollection'] = .
         */
        context?: {
            [key: string]: string;
        } | null;
        /**
         * Worker-defined metric name.
         */
        name?: string | null;
        /**
         * Origin (namespace) of metric name. May be blank for user-define metrics; will be "dataflow" for metrics defined by the Dataflow service or SDK.
         */
        origin?: string | null;
    }
    /**
     * Describes the state of a metric.
     */
    export interface Schema$MetricUpdate {
        /**
         * Worker-computed aggregate value for the "Trie" aggregation kind. The only possible value type is a BoundedTrieNode. Introduced this field to avoid breaking older SDKs when Dataflow service starts to populate the `bounded_trie` field.
         */
        boundedTrie?: any | null;
        /**
         * True if this metric is reported as the total cumulative aggregate value accumulated since the worker started working on this WorkItem. By default this is false, indicating that this metric is reported as a delta that is not associated with any WorkItem.
         */
        cumulative?: boolean | null;
        /**
         * A struct value describing properties of a distribution of numeric values.
         */
        distribution?: any | null;
        /**
         * A struct value describing properties of a Gauge. Metrics of gauge type show the value of a metric across time, and is aggregated based on the newest value.
         */
        gauge?: any | null;
        /**
         * Worker-computed aggregate value for internal use by the Dataflow service.
         */
        internal?: any | null;
        /**
         * Metric aggregation kind. The possible metric aggregation kinds are "Sum", "Max", "Min", "Mean", "Set", "And", "Or", and "Distribution". The specified aggregation kind is case-insensitive. If omitted, this is not an aggregated value but instead a single metric sample value.
         */
        kind?: string | null;
        /**
         * Worker-computed aggregate value for the "Mean" aggregation kind. This holds the count of the aggregated values and is used in combination with mean_sum above to obtain the actual mean aggregate value. The only possible value type is Long.
         */
        meanCount?: any | null;
        /**
         * Worker-computed aggregate value for the "Mean" aggregation kind. This holds the sum of the aggregated values and is used in combination with mean_count below to obtain the actual mean aggregate value. The only possible value types are Long and Double.
         */
        meanSum?: any | null;
        /**
         * Name of the metric.
         */
        name?: Schema$MetricStructuredName;
        /**
         * Worker-computed aggregate value for aggregation kinds "Sum", "Max", "Min", "And", and "Or". The possible value types are Long, Double, and Boolean.
         */
        scalar?: any | null;
        /**
         * Worker-computed aggregate value for the "Set" aggregation kind. The only possible value type is a list of Values whose type can be Long, Double, String, or BoundedTrie according to the metric's type. All Values in the list must be of the same type.
         */
        set?: any | null;
        /**
         * Worker-computed aggregate value for the "Trie" aggregation kind. The only possible value type is a BoundedTrieNode.
         */
        trie?: any | null;
        /**
         * Timestamp associated with the metric value. Optional when workers are reporting work progress; it will be filled in responses from the metrics API.
         */
        updateTime?: string | null;
    }
    /**
     * The value of a metric along with its name and labels.
     */
    export interface Schema$MetricValue {
        /**
         * Base name for this metric.
         */
        metric?: string | null;
        /**
         * Optional. Set of metric labels for this metric.
         */
        metricLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Non-cumulative int64 value of this metric.
         */
        valueGauge64?: Schema$DataflowGaugeValue;
        /**
         * Histogram value of this metric.
         */
        valueHistogram?: Schema$DataflowHistogramValue;
        /**
         * Integer value of this metric.
         */
        valueInt64?: string | null;
    }
    /**
     * Describes mounted data disk.
     */
    export interface Schema$MountedDataDisk {
        /**
         * The name of the data disk. This name is local to the Google Cloud Platform project and uniquely identifies the disk within that project, for example "myproject-1014-104817-4c2-harness-0-disk-1".
         */
        dataDisk?: string | null;
    }
    /**
     * Information about an output of a multi-output DoFn.
     */
    export interface Schema$MultiOutputInfo {
        /**
         * The id of the tag the user code will emit to this output by; this should correspond to the tag of some SideInputInfo.
         */
        tag?: string | null;
    }
    /**
     * Basic metadata about a counter.
     */
    export interface Schema$NameAndKind {
        /**
         * Counter aggregation kind.
         */
        kind?: string | null;
        /**
         * Name of the counter.
         */
        name?: string | null;
    }
    /**
     * Statistics for the underflow and overflow bucket.
     */
    export interface Schema$OutlierStats {
        /**
         * Number of values that are larger than the upper bound of the largest bucket.
         */
        overflowCount?: string | null;
        /**
         * Mean of values in the overflow bucket.
         */
        overflowMean?: number | null;
        /**
         * Number of values that are smaller than the lower bound of the smallest bucket.
         */
        underflowCount?: string | null;
        /**
         * Mean of values in the undeflow bucket.
         */
        underflowMean?: number | null;
    }
    /**
     * The packages that must be installed in order for a worker to run the steps of the Cloud Dataflow job that will be assigned to its worker pool. This is the mechanism by which the Cloud Dataflow SDK causes code to be loaded onto the workers. For example, the Cloud Dataflow Java SDK might use this to install jars containing the user's code and all of the various dependencies (libraries, data files, etc.) required in order for that code to run.
     */
    export interface Schema$Package {
        /**
         * The resource to read the package from. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket\} bucket.storage.googleapis.com/
         */
        location?: string | null;
        /**
         * The name of the package.
         */
        name?: string | null;
    }
    /**
     * Describes a particular operation comprising a MapTask.
     */
    export interface Schema$ParallelInstruction {
        /**
         * Additional information for Flatten instructions.
         */
        flatten?: Schema$FlattenInstruction;
        /**
         * User-provided name of this operation.
         */
        name?: string | null;
        /**
         * System-defined name for the operation in the original workflow graph.
         */
        originalName?: string | null;
        /**
         * Describes the outputs of the instruction.
         */
        outputs?: Schema$InstructionOutput[];
        /**
         * Additional information for ParDo instructions.
         */
        parDo?: Schema$ParDoInstruction;
        /**
         * Additional information for PartialGroupByKey instructions.
         */
        partialGroupByKey?: Schema$PartialGroupByKeyInstruction;
        /**
         * Additional information for Read instructions.
         */
        read?: Schema$ReadInstruction;
        /**
         * System-defined name of this operation. Unique across the workflow.
         */
        systemName?: string | null;
        /**
         * Additional information for Write instructions.
         */
        write?: Schema$WriteInstruction;
    }
    /**
     * Structured data associated with this message.
     */
    export interface Schema$Parameter {
        /**
         * Key or name for this parameter.
         */
        key?: string | null;
        /**
         * Value for this parameter.
         */
        value?: any | null;
    }
    /**
     * Metadata for a specific parameter.
     */
    export interface Schema$ParameterMetadata {
        /**
         * Optional. Additional metadata for describing this parameter.
         */
        customMetadata?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. The default values will pre-populate the parameter with the given value from the proto. If default_value is left empty, the parameter will be populated with a default of the relevant type, e.g. false for a boolean.
         */
        defaultValue?: string | null;
        /**
         * Optional. The options shown when ENUM ParameterType is specified.
         */
        enumOptions?: Schema$ParameterMetadataEnumOption[];
        /**
         * Optional. Specifies a group name for this parameter to be rendered under. Group header text will be rendered exactly as specified in this field. Only considered when parent_name is NOT provided.
         */
        groupName?: string | null;
        /**
         * Required. The help text to display for the parameter.
         */
        helpText?: string | null;
        /**
         * Optional. Whether the parameter should be hidden in the UI.
         */
        hiddenUi?: boolean | null;
        /**
         * Optional. Whether the parameter is optional. Defaults to false.
         */
        isOptional?: boolean | null;
        /**
         * Required. The label to display for the parameter.
         */
        label?: string | null;
        /**
         * Required. The name of the parameter.
         */
        name?: string | null;
        /**
         * Optional. The type of the parameter. Used for selecting input picker.
         */
        paramType?: string | null;
        /**
         * Optional. Specifies the name of the parent parameter. Used in conjunction with 'parent_trigger_values' to make this parameter conditional (will only be rendered conditionally). Should be mappable to a ParameterMetadata.name field.
         */
        parentName?: string | null;
        /**
         * Optional. The value(s) of the 'parent_name' parameter which will trigger this parameter to be shown. If left empty, ANY non-empty value in parent_name will trigger this parameter to be shown. Only considered when this parameter is conditional (when 'parent_name' has been provided).
         */
        parentTriggerValues?: string[] | null;
        /**
         * Optional. Regexes that the parameter must match.
         */
        regexes?: string[] | null;
    }
    /**
     * ParameterMetadataEnumOption specifies the option shown in the enum form.
     */
    export interface Schema$ParameterMetadataEnumOption {
        /**
         * Optional. The description to display for the enum option.
         */
        description?: string | null;
        /**
         * Optional. The label to display for the enum option.
         */
        label?: string | null;
        /**
         * Required. The value of the enum option.
         */
        value?: string | null;
    }
    /**
     * An instruction that does a ParDo operation. Takes one main input and zero or more side inputs, and produces zero or more outputs. Runs user code.
     */
    export interface Schema$ParDoInstruction {
        /**
         * The input.
         */
        input?: Schema$InstructionInput;
        /**
         * Information about each of the outputs, if user_fn is a MultiDoFn.
         */
        multiOutputInfos?: Schema$MultiOutputInfo[];
        /**
         * The number of outputs.
         */
        numOutputs?: number | null;
        /**
         * Zero or more side inputs.
         */
        sideInputs?: Schema$SideInputInfo[];
        /**
         * The user function to invoke.
         */
        userFn?: {
            [key: string]: any;
        } | null;
    }
    /**
     * An instruction that does a partial group-by-key. One input and one output.
     */
    export interface Schema$PartialGroupByKeyInstruction {
        /**
         * Describes the input to the partial group-by-key instruction.
         */
        input?: Schema$InstructionInput;
        /**
         * The codec to use for interpreting an element in the input PTable.
         */
        inputElementCodec?: {
            [key: string]: any;
        } | null;
        /**
         * If this instruction includes a combining function this is the name of the intermediate store between the GBK and the CombineValues.
         */
        originalCombineValuesInputStoreName?: string | null;
        /**
         * If this instruction includes a combining function, this is the name of the CombineValues instruction lifted into this instruction.
         */
        originalCombineValuesStepName?: string | null;
        /**
         * Zero or more side inputs.
         */
        sideInputs?: Schema$SideInputInfo[];
        /**
         * The value combining function to invoke.
         */
        valueCombiningFn?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Metrics for a particular unfused step and namespace. A metric is uniquely identified by the `metrics_namespace`, `original_step`, `metric name` and `metric_labels`.
     */
    export interface Schema$PerStepNamespaceMetrics {
        /**
         * The namespace of these metrics on the worker.
         */
        metricsNamespace?: string | null;
        /**
         * Optional. Metrics that are recorded for this namespace and unfused step.
         */
        metricValues?: Schema$MetricValue[];
        /**
         * The original system name of the unfused step that these metrics are reported from.
         */
        originalStep?: string | null;
    }
    /**
     * Per worker metrics.
     */
    export interface Schema$PerWorkerMetrics {
        /**
         * Optional. Metrics for a particular unfused step and namespace.
         */
        perStepNamespaceMetrics?: Schema$PerStepNamespaceMetrics[];
    }
    /**
     * A descriptive representation of submitted pipeline as well as the executed form. This data is provided by the Dataflow service for ease of visualizing the pipeline and interpreting Dataflow provided metrics.
     */
    export interface Schema$PipelineDescription {
        /**
         * Pipeline level display data.
         */
        displayData?: Schema$DisplayData[];
        /**
         * Description of each stage of execution of the pipeline.
         */
        executionPipelineStage?: Schema$ExecutionStageSummary[];
        /**
         * Description of each transform in the pipeline and collections between them.
         */
        originalPipelineTransform?: Schema$TransformSummary[];
        /**
         * A hash value of the submitted pipeline portable graph step names if exists.
         */
        stepNamesHash?: string | null;
    }
    /**
     * A point in the timeseries.
     */
    export interface Schema$Point {
        /**
         * The timestamp of the point.
         */
        time?: string | null;
        /**
         * The value of the point.
         */
        value?: number | null;
    }
    /**
     * Position defines a position within a collection of data. The value can be either the end position, a key (used with ordered collections), a byte offset, or a record index.
     */
    export interface Schema$Position {
        /**
         * Position is a byte offset.
         */
        byteOffset?: string | null;
        /**
         * CloudPosition is a concat position.
         */
        concatPosition?: Schema$ConcatPosition;
        /**
         * Position is past all other positions. Also useful for the end position of an unbounded range.
         */
        end?: boolean | null;
        /**
         * Position is a string key, ordered lexicographically.
         */
        key?: string | null;
        /**
         * Position is a record index.
         */
        recordIndex?: string | null;
        /**
         * CloudPosition is a base64 encoded BatchShufflePosition (with FIXED sharding).
         */
        shufflePosition?: string | null;
    }
    /**
     * Information about the progress of some component of job execution.
     */
    export interface Schema$ProgressTimeseries {
        /**
         * The current progress of the component, in the range [0,1].
         */
        currentProgress?: number | null;
        /**
         * History of progress for the component. Points are sorted by time.
         */
        dataPoints?: Schema$Point[];
    }
    /**
     * Metadata for a Pub/Sub connector used by the job.
     */
    export interface Schema$PubSubIODetails {
        /**
         * Subscription used in the connection.
         */
        subscription?: string | null;
        /**
         * Topic accessed in the connection.
         */
        topic?: string | null;
    }
    /**
     * Identifies a pubsub location to use for transferring data into or out of a streaming Dataflow job.
     */
    export interface Schema$PubsubLocation {
        /**
         * Indicates whether the pipeline allows late-arriving data.
         */
        dropLateData?: boolean | null;
        /**
         * If true, then this location represents dynamic topics.
         */
        dynamicDestinations?: boolean | null;
        /**
         * If set, contains a pubsub label from which to extract record ids. If left empty, record deduplication will be strictly best effort.
         */
        idLabel?: string | null;
        /**
         * A pubsub subscription, in the form of "pubsub.googleapis.com/subscriptions//"
         */
        subscription?: string | null;
        /**
         * If set, contains a pubsub label from which to extract record timestamps. If left empty, record timestamps will be generated upon arrival.
         */
        timestampLabel?: string | null;
        /**
         * A pubsub topic, in the form of "pubsub.googleapis.com/topics//"
         */
        topic?: string | null;
        /**
         * If set, specifies the pubsub subscription that will be used for tracking custom time timestamps for watermark estimation.
         */
        trackingSubscription?: string | null;
        /**
         * If true, then the client has requested to get pubsub attributes.
         */
        withAttributes?: boolean | null;
    }
    /**
     * Represents a Pubsub snapshot.
     */
    export interface Schema$PubsubSnapshotMetadata {
        /**
         * The expire time of the Pubsub snapshot.
         */
        expireTime?: string | null;
        /**
         * The name of the Pubsub snapshot.
         */
        snapshotName?: string | null;
        /**
         * The name of the Pubsub topic.
         */
        topicName?: string | null;
    }
    /**
     * An instruction that reads records. Takes no inputs, produces one output.
     */
    export interface Schema$ReadInstruction {
        /**
         * The source to read from.
         */
        source?: Schema$Source;
    }
    /**
     * Represents the level of parallelism in a WorkItem's input, reported by the worker.
     */
    export interface Schema$ReportedParallelism {
        /**
         * Specifies whether the parallelism is infinite. If true, "value" is ignored. Infinite parallelism means the service will assume that the work item can always be split into more non-empty work items by dynamic splitting. This is a work-around for lack of support for infinity by the current JSON-based Java RPC stack.
         */
        isInfinite?: boolean | null;
        /**
         * Specifies the level of parallelism in case it is finite.
         */
        value?: number | null;
    }
    /**
     * Request to report the status of WorkItems.
     */
    export interface Schema$ReportWorkItemStatusRequest {
        /**
         * The current timestamp at the worker.
         */
        currentWorkerTime?: string | null;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the WorkItem's job.
         */
        location?: string | null;
        /**
         * Optional. The project number of the project which owns the WorkItem's job.
         */
        projectNumber?: string | null;
        /**
         * Untranslated bag-of-bytes WorkProgressUpdateRequest from UnifiedWorker.
         */
        unifiedWorkerRequest?: {
            [key: string]: any;
        } | null;
        /**
         * The ID of the worker reporting the WorkItem status. If this does not match the ID of the worker which the Dataflow service believes currently has the lease on the WorkItem, the report will be dropped (with an error response).
         */
        workerId?: string | null;
        /**
         * The order is unimportant, except that the order of the WorkItemServiceState messages in the ReportWorkItemStatusResponse corresponds to the order of WorkItemStatus messages here.
         */
        workItemStatuses?: Schema$WorkItemStatus[];
    }
    /**
     * Response from a request to report the status of WorkItems.
     */
    export interface Schema$ReportWorkItemStatusResponse {
        /**
         * Untranslated bag-of-bytes WorkProgressUpdateResponse for UnifiedWorker.
         */
        unifiedWorkerResponse?: {
            [key: string]: any;
        } | null;
        /**
         * A set of messages indicating the service-side state for each WorkItem whose status was reported, in the same order as the WorkItemStatus messages in the ReportWorkItemStatusRequest which resulting in this response.
         */
        workItemServiceStates?: Schema$WorkItemServiceState[];
    }
    /**
     * Worker metrics exported from workers. This contains resource utilization metrics accumulated from a variety of sources. For more information, see go/df-resource-signals.
     */
    export interface Schema$ResourceUtilizationReport {
        /**
         * Per container information. Key: container name.
         */
        containers?: {
            [key: string]: Schema$ResourceUtilizationReport;
        } | null;
        /**
         * CPU utilization samples.
         */
        cpuTime?: Schema$CPUTime[];
        /**
         * Optional. GPU usage samples.
         */
        gpuUsage?: Schema$GPUUsage[];
        /**
         * Memory utilization samples.
         */
        memoryInfo?: Schema$MemInfo[];
    }
    /**
     * Service-side response to WorkerMessage reporting resource utilization.
     */
    export interface Schema$ResourceUtilizationReportResponse {
    }
    /**
     * The environment values to set at runtime.
     */
    export interface Schema$RuntimeEnvironment {
        /**
         * Optional. Additional experiment flags for the job, specified with the `--experiments` option.
         */
        additionalExperiments?: string[] | null;
        /**
         * Optional. Additional pipeline option flags for the job.
         */
        additionalPipelineOptions?: string[] | null;
        /**
         * Optional. Additional user labels to be specified for the job. Keys and values should follow the restrictions specified in the [labeling restrictions](https://cloud.google.com/compute/docs/labeling-resources#restrictions) page. An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1kg", "count": "3" \}.
         */
        additionalUserLabels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Whether to bypass the safety checks for the job's temporary directory. Use with caution.
         */
        bypassTempDirValidation?: boolean | null;
        /**
         * Optional. The disk size, in gigabytes, to use on each remote Compute Engine worker instance.
         */
        diskSizeGb?: number | null;
        /**
         * Optional. Whether to enable Streaming Engine for the job.
         */
        enableStreamingEngine?: boolean | null;
        /**
         * Optional. Configuration for VM IPs.
         */
        ipConfiguration?: string | null;
        /**
         * Optional. Name for the Cloud KMS key for the job. Key format is: projects//locations//keyRings//cryptoKeys/
         */
        kmsKeyName?: string | null;
        /**
         * Optional. The machine type to use for the job. Defaults to the value from the template if not specified.
         */
        machineType?: string | null;
        /**
         * Optional. The maximum number of Google Compute Engine instances to be made available to your pipeline during execution, from 1 to 1000. The default value is 1.
         */
        maxWorkers?: number | null;
        /**
         * Optional. Network to which VMs will be assigned. If empty or unspecified, the service will use the network "default".
         */
        network?: string | null;
        /**
         * Optional. The initial number of Google Compute Engine instances for the job. The default value is 11.
         */
        numWorkers?: number | null;
        /**
         * Optional. The email address of the service account to run the job as.
         */
        serviceAccountEmail?: string | null;
        /**
         * Optional. Specifies the Streaming Engine message processing guarantees. Reduces cost and latency but might result in duplicate messages committed to storage. Designed to run simple mapping streaming ETL jobs at the lowest cost. For example, Change Data Capture (CDC) to BigQuery is a canonical use case. For more information, see [Set the pipeline streaming mode](https://cloud.google.com/dataflow/docs/guides/streaming-modes).
         */
        streamingMode?: string | null;
        /**
         * Optional. Subnetwork to which VMs will be assigned, if desired. You can specify a subnetwork using either a complete URL or an abbreviated path. Expected to be of the form "https://www.googleapis.com/compute/v1/projects/HOST_PROJECT_ID/regions/REGION/subnetworks/SUBNETWORK" or "regions/REGION/subnetworks/SUBNETWORK". If the subnetwork is located in a Shared VPC network, you must use the complete URL.
         */
        subnetwork?: string | null;
        /**
         * Required. The Cloud Storage path to use for temporary files. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        tempLocation?: string | null;
        /**
         * Required. The Compute Engine region (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1". Mutually exclusive with worker_zone. If neither worker_region nor worker_zone is specified, default to the control plane's region.
         */
        workerRegion?: string | null;
        /**
         * Optional. The Compute Engine zone (https://cloud.google.com/compute/docs/regions-zones/regions-zones) in which worker processing should occur, e.g. "us-west1-a". Mutually exclusive with worker_region. If neither worker_region nor worker_zone is specified, a zone in the control plane's region is chosen based on available capacity. If both `worker_zone` and `zone` are set, `worker_zone` takes precedence.
         */
        workerZone?: string | null;
        /**
         * Optional. The Compute Engine [availability zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones) for launching worker instances to run your pipeline. In the future, worker_zone will take precedence.
         */
        zone?: string | null;
    }
    /**
     * RuntimeMetadata describing a runtime environment.
     */
    export interface Schema$RuntimeMetadata {
        /**
         * The parameters for the template.
         */
        parameters?: Schema$ParameterMetadata[];
        /**
         * SDK Info for the template.
         */
        sdkInfo?: Schema$SDKInfo;
    }
    /**
     * Additional job parameters that can only be updated during runtime using the projects.jobs.update method. These fields have no effect when specified during job creation.
     */
    export interface Schema$RuntimeUpdatableParams {
        /**
         * The maximum number of workers to cap autoscaling at. This field is currently only supported for Streaming Engine jobs.
         */
        maxNumWorkers?: number | null;
        /**
         * The minimum number of workers to scale down to. This field is currently only supported for Streaming Engine jobs.
         */
        minNumWorkers?: number | null;
        /**
         * Target worker utilization, compared against the aggregate utilization of the worker pool by autoscaler, to determine upscaling and downscaling when absent other constraints such as backlog. For more information, see [Update an existing pipeline](https://cloud.google.com/dataflow/docs/guides/updating-a-pipeline).
         */
        workerUtilizationHint?: number | null;
    }
    /**
     * A bug found in the Dataflow SDK.
     */
    export interface Schema$SdkBug {
        /**
         * Output only. How severe the SDK bug is.
         */
        severity?: string | null;
        /**
         * Output only. Describes the impact of this SDK bug.
         */
        type?: string | null;
        /**
         * Output only. Link to more information on the bug.
         */
        uri?: string | null;
    }
    /**
     * Defines an SDK harness container for executing Dataflow pipelines.
     */
    export interface Schema$SdkHarnessContainerImage {
        /**
         * The set of capabilities enumerated in the above Environment proto. See also [beam_runner_api.proto](https://github.com/apache/beam/blob/master/model/pipeline/src/main/proto/org/apache/beam/model/pipeline/v1/beam_runner_api.proto)
         */
        capabilities?: string[] | null;
        /**
         * A docker container image that resides in Google Container Registry.
         */
        containerImage?: string | null;
        /**
         * Environment ID for the Beam runner API proto Environment that corresponds to the current SDK Harness.
         */
        environmentId?: string | null;
        /**
         * If true, recommends the Dataflow service to use only one core per SDK container instance with this image. If false (or unset) recommends using more than one core per SDK container instance with this image for efficiency. Note that Dataflow service may choose to override this property if needed.
         */
        useSingleCorePerContainer?: boolean | null;
    }
    /**
     * SDK Information.
     */
    export interface Schema$SDKInfo {
        /**
         * Required. The SDK Language.
         */
        language?: string | null;
        /**
         * Optional. The SDK version.
         */
        version?: string | null;
    }
    /**
     * The version of the SDK used to run the job.
     */
    export interface Schema$SdkVersion {
        /**
         * Output only. Known bugs found in this SDK version.
         */
        bugs?: Schema$SdkBug[];
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
     * Request to send encoded debug information. Next ID: 8
     */
    export interface Schema$SendDebugCaptureRequest {
        /**
         * The internal component id for which debug information is sent.
         */
        componentId?: string | null;
        /**
         * The encoded debug information.
         */
        data?: string | null;
        /**
         * Format for the data field above (id=5).
         */
        dataFormat?: string | null;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string | null;
        /**
         * The worker id, i.e., VM hostname.
         */
        workerId?: string | null;
    }
    /**
     * Response to a send capture request. nothing
     */
    export interface Schema$SendDebugCaptureResponse {
    }
    /**
     * A request for sending worker messages to the service.
     */
    export interface Schema$SendWorkerMessagesRequest {
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job.
         */
        location?: string | null;
        /**
         * The WorkerMessages to send.
         */
        workerMessages?: Schema$WorkerMessage[];
    }
    /**
     * The response to the worker messages.
     */
    export interface Schema$SendWorkerMessagesResponse {
        /**
         * The servers response to the worker messages.
         */
        workerMessageResponses?: Schema$WorkerMessageResponse[];
    }
    /**
     * Describes a particular function to invoke.
     */
    export interface Schema$SeqMapTask {
        /**
         * Information about each of the inputs.
         */
        inputs?: Schema$SideInputInfo[];
        /**
         * The user-provided name of the SeqDo operation.
         */
        name?: string | null;
        /**
         * Information about each of the outputs.
         */
        outputInfos?: Schema$SeqMapTaskOutputInfo[];
        /**
         * System-defined name of the stage containing the SeqDo operation. Unique across the workflow.
         */
        stageName?: string | null;
        /**
         * System-defined name of the SeqDo operation. Unique across the workflow.
         */
        systemName?: string | null;
        /**
         * The user function to invoke.
         */
        userFn?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Information about an output of a SeqMapTask.
     */
    export interface Schema$SeqMapTaskOutputInfo {
        /**
         * The sink to write the output value to.
         */
        sink?: Schema$Sink;
        /**
         * The id of the TupleTag the user code will tag the output value by.
         */
        tag?: string | null;
    }
    /**
     * Resources used by the Dataflow Service to run the job.
     */
    export interface Schema$ServiceResources {
        /**
         * Output only. List of Cloud Zones being used by the Dataflow Service for this job. Example: us-central1-c
         */
        zones?: string[] | null;
    }
    /**
     * A task which consists of a shell command for the worker to execute.
     */
    export interface Schema$ShellTask {
        /**
         * The shell command to run.
         */
        command?: string | null;
        /**
         * Exit code for the task.
         */
        exitCode?: number | null;
    }
    /**
     * Information about a side input of a DoFn or an input of a SeqDoFn.
     */
    export interface Schema$SideInputInfo {
        /**
         * How to interpret the source element(s) as a side input value.
         */
        kind?: {
            [key: string]: any;
        } | null;
        /**
         * The source(s) to read element(s) from to get the value of this side input. If more than one source, then the elements are taken from the sources, in the specified order if order matters. At least one source is required.
         */
        sources?: Schema$Source[];
        /**
         * The id of the tag the user code will access this side input by; this should correspond to the tag of some MultiOutputInfo.
         */
        tag?: string | null;
    }
    /**
     * A sink that records can be encoded and written to.
     */
    export interface Schema$Sink {
        /**
         * The codec to use to encode data written to the sink.
         */
        codec?: {
            [key: string]: any;
        } | null;
        /**
         * The sink to write to, plus its parameters.
         */
        spec?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Represents a snapshot of a job.
     */
    export interface Schema$Snapshot {
        /**
         * The time this snapshot was created.
         */
        creationTime?: string | null;
        /**
         * User specified description of the snapshot. Maybe empty.
         */
        description?: string | null;
        /**
         * The disk byte size of the snapshot. Only available for snapshots in READY state.
         */
        diskSizeBytes?: string | null;
        /**
         * The unique ID of this snapshot.
         */
        id?: string | null;
        /**
         * The project this snapshot belongs to.
         */
        projectId?: string | null;
        /**
         * Pub/Sub snapshot metadata.
         */
        pubsubMetadata?: Schema$PubsubSnapshotMetadata[];
        /**
         * Cloud region where this snapshot lives in, e.g., "us-central1".
         */
        region?: string | null;
        /**
         * The job this snapshot was created from.
         */
        sourceJobId?: string | null;
        /**
         * State of the snapshot.
         */
        state?: string | null;
        /**
         * The time after which this snapshot will be automatically deleted.
         */
        ttl?: string | null;
    }
    /**
     * Request to create a snapshot of a job.
     */
    export interface Schema$SnapshotJobRequest {
        /**
         * User specified description of the snapshot. Maybe empty.
         */
        description?: string | null;
        /**
         * The location that contains this job.
         */
        location?: string | null;
        /**
         * If true, perform snapshots for sources which support this.
         */
        snapshotSources?: boolean | null;
        /**
         * TTL for the snapshot.
         */
        ttl?: string | null;
    }
    /**
     * A source that records can be read and decoded from.
     */
    export interface Schema$Source {
        /**
         * While splitting, sources may specify the produced bundles as differences against another source, in order to save backend-side memory and allow bigger jobs. For details, see SourceSplitRequest. To support this use case, the full set of parameters of the source is logically obtained by taking the latest explicitly specified value of each parameter in the order: base_specs (later items win), spec (overrides anything in base_specs).
         */
        baseSpecs?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * The codec to use to decode data read from the source.
         */
        codec?: {
            [key: string]: any;
        } | null;
        /**
         * Setting this value to true hints to the framework that the source doesn't need splitting, and using SourceSplitRequest on it would yield SOURCE_SPLIT_OUTCOME_USE_CURRENT. E.g. a file splitter may set this to true when splitting a single file into a set of byte ranges of appropriate size, and set this to false when splitting a filepattern into individual files. However, for efficiency, a file splitter may decide to produce file subranges directly from the filepattern to avoid a splitting round-trip. See SourceSplitRequest for an overview of the splitting process. This field is meaningful only in the Source objects populated by the user (e.g. when filling in a DerivedSource). Source objects supplied by the framework to the user don't have this field populated.
         */
        doesNotNeedSplitting?: boolean | null;
        /**
         * Optionally, metadata for this source can be supplied right away, avoiding a SourceGetMetadataOperation roundtrip (see SourceOperationRequest). This field is meaningful only in the Source objects populated by the user (e.g. when filling in a DerivedSource). Source objects supplied by the framework to the user don't have this field populated.
         */
        metadata?: Schema$SourceMetadata;
        /**
         * The source to read from, plus its parameters.
         */
        spec?: {
            [key: string]: any;
        } | null;
    }
    /**
     * DEPRECATED in favor of DynamicSourceSplit.
     */
    export interface Schema$SourceFork {
        /**
         * DEPRECATED
         */
        primary?: Schema$SourceSplitShard;
        /**
         * DEPRECATED
         */
        primarySource?: Schema$DerivedSource;
        /**
         * DEPRECATED
         */
        residual?: Schema$SourceSplitShard;
        /**
         * DEPRECATED
         */
        residualSource?: Schema$DerivedSource;
    }
    /**
     * A request to compute the SourceMetadata of a Source.
     */
    export interface Schema$SourceGetMetadataRequest {
        /**
         * Specification of the source whose metadata should be computed.
         */
        source?: Schema$Source;
    }
    /**
     * The result of a SourceGetMetadataOperation.
     */
    export interface Schema$SourceGetMetadataResponse {
        /**
         * The computed metadata.
         */
        metadata?: Schema$SourceMetadata;
    }
    /**
     * Metadata about a Source useful for automatically optimizing and tuning the pipeline, etc.
     */
    export interface Schema$SourceMetadata {
        /**
         * An estimate of the total size (in bytes) of the data that would be read from this source. This estimate is in terms of external storage size, before any decompression or other processing done by the reader.
         */
        estimatedSizeBytes?: string | null;
        /**
         * Specifies that the size of this source is known to be infinite (this is a streaming source).
         */
        infinite?: boolean | null;
        /**
         * Whether this source is known to produce key/value pairs with the (encoded) keys in lexicographically sorted order.
         */
        producesSortedKeys?: boolean | null;
    }
    /**
     * A work item that represents the different operations that can be performed on a user-defined Source specification.
     */
    export interface Schema$SourceOperationRequest {
        /**
         * Information about a request to get metadata about a source.
         */
        getMetadata?: Schema$SourceGetMetadataRequest;
        /**
         * User-provided name of the Read instruction for this source.
         */
        name?: string | null;
        /**
         * System-defined name for the Read instruction for this source in the original workflow graph.
         */
        originalName?: string | null;
        /**
         * Information about a request to split a source.
         */
        split?: Schema$SourceSplitRequest;
        /**
         * System-defined name of the stage containing the source operation. Unique across the workflow.
         */
        stageName?: string | null;
        /**
         * System-defined name of the Read instruction for this source. Unique across the workflow.
         */
        systemName?: string | null;
    }
    /**
     * The result of a SourceOperationRequest, specified in ReportWorkItemStatusRequest.source_operation when the work item is completed.
     */
    export interface Schema$SourceOperationResponse {
        /**
         * A response to a request to get metadata about a source.
         */
        getMetadata?: Schema$SourceGetMetadataResponse;
        /**
         * A response to a request to split a source.
         */
        split?: Schema$SourceSplitResponse;
    }
    /**
     * Hints for splitting a Source into bundles (parts for parallel processing) using SourceSplitRequest.
     */
    export interface Schema$SourceSplitOptions {
        /**
         * The source should be split into a set of bundles where the estimated size of each is approximately this many bytes.
         */
        desiredBundleSizeBytes?: string | null;
        /**
         * DEPRECATED in favor of desired_bundle_size_bytes.
         */
        desiredShardSizeBytes?: string | null;
    }
    /**
     * Represents the operation to split a high-level Source specification into bundles (parts for parallel processing). At a high level, splitting of a source into bundles happens as follows: SourceSplitRequest is applied to the source. If it returns SOURCE_SPLIT_OUTCOME_USE_CURRENT, no further splitting happens and the source is used "as is". Otherwise, splitting is applied recursively to each produced DerivedSource. As an optimization, for any Source, if its does_not_need_splitting is true, the framework assumes that splitting this source would return SOURCE_SPLIT_OUTCOME_USE_CURRENT, and doesn't initiate a SourceSplitRequest. This applies both to the initial source being split and to bundles produced from it.
     */
    export interface Schema$SourceSplitRequest {
        /**
         * Hints for tuning the splitting process.
         */
        options?: Schema$SourceSplitOptions;
        /**
         * Specification of the source to be split.
         */
        source?: Schema$Source;
    }
    /**
     * The response to a SourceSplitRequest.
     */
    export interface Schema$SourceSplitResponse {
        /**
         * If outcome is SPLITTING_HAPPENED, then this is a list of bundles into which the source was split. Otherwise this field is ignored. This list can be empty, which means the source represents an empty input.
         */
        bundles?: Schema$DerivedSource[];
        /**
         * Indicates whether splitting happened and produced a list of bundles. If this is USE_CURRENT_SOURCE_AS_IS, the current source should be processed "as is" without splitting. "bundles" is ignored in this case. If this is SPLITTING_HAPPENED, then "bundles" contains a list of bundles into which the source was split.
         */
        outcome?: string | null;
        /**
         * DEPRECATED in favor of bundles.
         */
        shards?: Schema$SourceSplitShard[];
    }
    /**
     * DEPRECATED in favor of DerivedSource.
     */
    export interface Schema$SourceSplitShard {
        /**
         * DEPRECATED
         */
        derivationMode?: string | null;
        /**
         * DEPRECATED
         */
        source?: Schema$Source;
    }
    /**
     * Metadata for a Spanner connector used by the job.
     */
    export interface Schema$SpannerIODetails {
        /**
         * DatabaseId accessed in the connection.
         */
        databaseId?: string | null;
        /**
         * InstanceId accessed in the connection.
         */
        instanceId?: string | null;
        /**
         * ProjectId accessed in the connection.
         */
        projectId?: string | null;
    }
    /**
     * A representation of an int64, n, that is immune to precision loss when encoded in JSON.
     */
    export interface Schema$SplitInt64 {
        /**
         * The high order bits, including the sign: n \>\> 32.
         */
        highBits?: number | null;
        /**
         * The low order bits: n & 0xffffffff.
         */
        lowBits?: number | null;
    }
    /**
     * Information about the workers and work items within a stage.
     */
    export interface Schema$StageExecutionDetails {
        /**
         * If present, this response does not contain all requested tasks. To obtain the next page of results, repeat the request with page_token set to this value.
         */
        nextPageToken?: string | null;
        /**
         * Workers that have done work on the stage.
         */
        workers?: Schema$WorkerDetails[];
    }
    /**
     * Description of an input or output of an execution stage.
     */
    export interface Schema$StageSource {
        /**
         * Dataflow service generated name for this source.
         */
        name?: string | null;
        /**
         * User name for the original user transform or collection with which this source is most closely associated.
         */
        originalTransformOrCollection?: string | null;
        /**
         * Size of the source, if measurable.
         */
        sizeBytes?: string | null;
        /**
         * Human-readable name for this source; may be user or system generated.
         */
        userName?: string | null;
    }
    /**
     * Information about a particular execution stage of a job.
     */
    export interface Schema$StageSummary {
        /**
         * End time of this stage. If the work item is completed, this is the actual end time of the stage. Otherwise, it is the predicted end time.
         */
        endTime?: string | null;
        /**
         * Metrics for this stage.
         */
        metrics?: Schema$MetricUpdate[];
        /**
         * Progress for this stage. Only applicable to Batch jobs.
         */
        progress?: Schema$ProgressTimeseries;
        /**
         * ID of this stage
         */
        stageId?: string | null;
        /**
         * Start time of this stage.
         */
        startTime?: string | null;
        /**
         * State of this stage.
         */
        state?: string | null;
        /**
         * Straggler summary for this stage.
         */
        stragglerSummary?: Schema$StragglerSummary;
    }
    /**
     * State family configuration.
     */
    export interface Schema$StateFamilyConfig {
        /**
         * If true, this family corresponds to a read operation.
         */
        isRead?: boolean | null;
        /**
         * The state family value.
         */
        stateFamily?: string | null;
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
     * Defines a particular step within a Cloud Dataflow job. A job consists of multiple steps, each of which performs some specific operation as part of the overall job. Data is typically passed from one step to another as part of the job. **Note:** The properties of this object are not stable and might change. Here's an example of a sequence of steps which together implement a Map-Reduce job: * Read a collection of data from some source, parsing the collection's elements. * Validate the elements. * Apply a user-defined function to map each element to some value and extract an element-specific key value. * Group elements with the same key into a single element with that key, transforming a multiply-keyed collection into a uniquely-keyed collection. * Write the elements out to some data sink. Note that the Cloud Dataflow service may be used to run many different types of jobs, not just Map-Reduce.
     */
    export interface Schema$Step {
        /**
         * The kind of step in the Cloud Dataflow job.
         */
        kind?: string | null;
        /**
         * The name that identifies the step. This must be unique for each step with respect to all other steps in the Cloud Dataflow job.
         */
        name?: string | null;
        /**
         * Named properties associated with the step. Each kind of predefined step has its own required set of properties. Must be provided on Create. Only retrieved with JOB_VIEW_ALL.
         */
        properties?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Information for a straggler.
     */
    export interface Schema$Straggler {
        /**
         * Batch straggler identification and debugging information.
         */
        batchStraggler?: Schema$StragglerInfo;
        /**
         * Streaming straggler identification and debugging information.
         */
        streamingStraggler?: Schema$StreamingStragglerInfo;
    }
    /**
     * Information useful for debugging a straggler. Each type will provide specialized debugging information relevant for a particular cause. The StragglerDebuggingInfo will be 1:1 mapping to the StragglerCause enum.
     */
    export interface Schema$StragglerDebuggingInfo {
        /**
         * Hot key debugging details.
         */
        hotKey?: Schema$HotKeyDebuggingInfo;
    }
    /**
     * Information useful for straggler identification and debugging.
     */
    export interface Schema$StragglerInfo {
        /**
         * The straggler causes, keyed by the string representation of the StragglerCause enum and contains specialized debugging information for each straggler cause.
         */
        causes?: {
            [key: string]: Schema$StragglerDebuggingInfo;
        } | null;
        /**
         * The time when the work item attempt became a straggler.
         */
        startTime?: string | null;
    }
    /**
     * Summarized straggler identification details.
     */
    export interface Schema$StragglerSummary {
        /**
         * The most recent stragglers.
         */
        recentStragglers?: Schema$Straggler[];
        /**
         * Aggregated counts of straggler causes, keyed by the string representation of the StragglerCause enum.
         */
        stragglerCauseCount?: {
            [key: string]: string;
        } | null;
        /**
         * The total count of stragglers.
         */
        totalStragglerCount?: string | null;
    }
    /**
     * Streaming appliance snapshot configuration.
     */
    export interface Schema$StreamingApplianceSnapshotConfig {
        /**
         * Indicates which endpoint is used to import appliance state.
         */
        importStateEndpoint?: string | null;
        /**
         * If set, indicates the snapshot id for the snapshot being performed.
         */
        snapshotId?: string | null;
    }
    /**
     * Configuration information for a single streaming computation.
     */
    export interface Schema$StreamingComputationConfig {
        /**
         * Unique identifier for this computation.
         */
        computationId?: string | null;
        /**
         * Instructions that comprise the computation.
         */
        instructions?: Schema$ParallelInstruction[];
        /**
         * Stage name of this computation.
         */
        stageName?: string | null;
        /**
         * System defined name for this computation.
         */
        systemName?: string | null;
        /**
         * Map from user name of stateful transforms in this stage to their state family.
         */
        transformUserNameToStateFamily?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Describes full or partial data disk assignment information of the computation ranges.
     */
    export interface Schema$StreamingComputationRanges {
        /**
         * The ID of the computation.
         */
        computationId?: string | null;
        /**
         * Data disk assignments for ranges from this computation.
         */
        rangeAssignments?: Schema$KeyRangeDataDiskAssignment[];
    }
    /**
     * A task which describes what action should be performed for the specified streaming computation ranges.
     */
    export interface Schema$StreamingComputationTask {
        /**
         * Contains ranges of a streaming computation this task should apply to.
         */
        computationRanges?: Schema$StreamingComputationRanges[];
        /**
         * Describes the set of data disks this task should apply to.
         */
        dataDisks?: Schema$MountedDataDisk[];
        /**
         * A type of streaming computation task.
         */
        taskType?: string | null;
    }
    /**
     * A task that carries configuration information for streaming computations.
     */
    export interface Schema$StreamingConfigTask {
        /**
         * Chunk size for commit streams from the harness to windmill.
         */
        commitStreamChunkSizeBytes?: string | null;
        /**
         * Chunk size for get data streams from the harness to windmill.
         */
        getDataStreamChunkSizeBytes?: string | null;
        /**
         * Maximum size for work item commit supported windmill storage layer.
         */
        maxWorkItemCommitBytes?: string | null;
        /**
         * Operational limits for the streaming job. Can be used by the worker to validate outputs sent to the backend.
         */
        operationalLimits?: Schema$StreamingOperationalLimits;
        /**
         * Set of computation configuration information.
         */
        streamingComputationConfigs?: Schema$StreamingComputationConfig[];
        /**
         * Map from user step names to state families.
         */
        userStepToStateFamilyNameMap?: {
            [key: string]: string;
        } | null;
        /**
         * Binary encoded proto to control runtime behavior of the java runner v1 user worker.
         */
        userWorkerRunnerV1Settings?: string | null;
        /**
         * Binary encoded proto to control runtime behavior of the runner v2 user worker.
         */
        userWorkerRunnerV2Settings?: string | null;
        /**
         * If present, the worker must use this endpoint to communicate with Windmill Service dispatchers, otherwise the worker must continue to use whatever endpoint it had been using.
         */
        windmillServiceEndpoint?: string | null;
        /**
         * If present, the worker must use this port to communicate with Windmill Service dispatchers. Only applicable when windmill_service_endpoint is specified.
         */
        windmillServicePort?: string | null;
    }
    /**
     * Operational limits imposed on streaming jobs by the backend.
     */
    export interface Schema$StreamingOperationalLimits {
        /**
         * The maximum size for an element in bag state.
         */
        maxBagElementBytes?: string | null;
        /**
         * The maximum size for an element in global data.
         */
        maxGlobalDataBytes?: string | null;
        /**
         * The maximum size allowed for a key.
         */
        maxKeyBytes?: string | null;
        /**
         * The maximum size for a single output element.
         */
        maxProductionOutputBytes?: string | null;
        /**
         * The maximum size for an element in sorted list state.
         */
        maxSortedListElementBytes?: string | null;
        /**
         * The maximum size for a source state update.
         */
        maxSourceStateBytes?: string | null;
        /**
         * The maximum size for a state tag.
         */
        maxTagBytes?: string | null;
        /**
         * The maximum size for a value state field.
         */
        maxValueBytes?: string | null;
    }
    /**
     * Contains per-user worker telemetry used in streaming autoscaling.
     */
    export interface Schema$StreamingScalingReport {
        activeBundleCount?: number | null;
        /**
         * Current acive thread count.
         */
        activeThreadCount?: number | null;
        /**
         * Maximum bundle count.
         */
        maximumBundleCount?: number | null;
        /**
         * Maximum bytes.
         */
        maximumBytes?: string | null;
        maximumBytesCount?: number | null;
        /**
         * Maximum thread count limit.
         */
        maximumThreadCount?: number | null;
        /**
         * Current outstanding bundle count.
         */
        outstandingBundleCount?: number | null;
        /**
         * Current outstanding bytes.
         */
        outstandingBytes?: string | null;
        outstandingBytesCount?: number | null;
    }
    /**
     * Contains per-user-worker streaming scaling recommendation from the backend.
     */
    export interface Schema$StreamingScalingReportResponse {
        /**
         * Maximum thread count limit;
         */
        maximumThreadCount?: number | null;
    }
    /**
     * A task which initializes part of a streaming Dataflow job.
     */
    export interface Schema$StreamingSetupTask {
        /**
         * The user has requested drain.
         */
        drain?: boolean | null;
        /**
         * The TCP port on which the worker should listen for messages from other streaming computation workers.
         */
        receiveWorkPort?: number | null;
        /**
         * Configures streaming appliance snapshot.
         */
        snapshotConfig?: Schema$StreamingApplianceSnapshotConfig;
        /**
         * The global topology of the streaming Dataflow job.
         */
        streamingComputationTopology?: Schema$TopologyConfig;
        /**
         * The TCP port used by the worker to communicate with the Dataflow worker harness.
         */
        workerHarnessPort?: number | null;
    }
    /**
     * Identifies the location of a streaming side input.
     */
    export interface Schema$StreamingSideInputLocation {
        /**
         * Identifies the state family where this side input is stored.
         */
        stateFamily?: string | null;
        /**
         * Identifies the particular side input within the streaming Dataflow job.
         */
        tag?: string | null;
    }
    /**
     * Identifies the location of a streaming computation stage, for stage-to-stage communication.
     */
    export interface Schema$StreamingStageLocation {
        /**
         * Identifies the particular stream within the streaming Dataflow job.
         */
        streamId?: string | null;
    }
    /**
     * Information useful for streaming straggler identification and debugging.
     */
    export interface Schema$StreamingStragglerInfo {
        /**
         * The event-time watermark lag at the time of the straggler detection.
         */
        dataWatermarkLag?: string | null;
        /**
         * End time of this straggler.
         */
        endTime?: string | null;
        /**
         * Start time of this straggler.
         */
        startTime?: string | null;
        /**
         * The system watermark lag at the time of the straggler detection.
         */
        systemWatermarkLag?: string | null;
        /**
         * Name of the worker where the straggler was detected.
         */
        workerName?: string | null;
    }
    /**
     * Describes a stream of data, either as input to be processed or as output of a streaming Dataflow job.
     */
    export interface Schema$StreamLocation {
        /**
         * The stream is a custom source.
         */
        customSourceLocation?: Schema$CustomSourceLocation;
        /**
         * The stream is a pubsub stream.
         */
        pubsubLocation?: Schema$PubsubLocation;
        /**
         * The stream is a streaming side input.
         */
        sideInputLocation?: Schema$StreamingSideInputLocation;
        /**
         * The stream is part of another computation within the current streaming Dataflow job.
         */
        streamingStageLocation?: Schema$StreamingStageLocation;
    }
    /**
     * A metric value representing a list of strings.
     */
    export interface Schema$StringList {
        /**
         * Elements of the list.
         */
        elements?: string[] | null;
    }
    /**
     * A rich message format, including a human readable string, a key for identifying the message, and structured data associated with the message for programmatic consumption.
     */
    export interface Schema$StructuredMessage {
        /**
         * Identifier for this message type. Used by external systems to internationalize or personalize message.
         */
        messageKey?: string | null;
        /**
         * Human-readable version of message.
         */
        messageText?: string | null;
        /**
         * The structured data associated with this message.
         */
        parameters?: Schema$Parameter[];
    }
    /**
     * Taskrunner configuration settings.
     */
    export interface Schema$TaskRunnerSettings {
        /**
         * Whether to also send taskrunner log info to stderr.
         */
        alsologtostderr?: boolean | null;
        /**
         * The location on the worker for task-specific subdirectories.
         */
        baseTaskDir?: string | null;
        /**
         * The base URL for the taskrunner to use when accessing Google Cloud APIs. When workers access Google Cloud APIs, they logically do so via relative URLs. If this field is specified, it supplies the base URL to use for resolving these relative URLs. The normative algorithm used is defined by RFC 1808, "Relative Uniform Resource Locators". If not specified, the default value is "http://www.googleapis.com/"
         */
        baseUrl?: string | null;
        /**
         * The file to store preprocessing commands in.
         */
        commandlinesFileName?: string | null;
        /**
         * Whether to continue taskrunner if an exception is hit.
         */
        continueOnException?: boolean | null;
        /**
         * The API version of endpoint, e.g. "v1b3"
         */
        dataflowApiVersion?: string | null;
        /**
         * The command to launch the worker harness.
         */
        harnessCommand?: string | null;
        /**
         * The suggested backend language.
         */
        languageHint?: string | null;
        /**
         * The directory on the VM to store logs.
         */
        logDir?: string | null;
        /**
         * Whether to send taskrunner log info to Google Compute Engine VM serial console.
         */
        logToSerialconsole?: boolean | null;
        /**
         * Indicates where to put logs. If this is not specified, the logs will not be uploaded. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket\}/{object\} bucket.storage.googleapis.com/{object\}
         */
        logUploadLocation?: string | null;
        /**
         * The OAuth2 scopes to be requested by the taskrunner in order to access the Cloud Dataflow API.
         */
        oauthScopes?: string[] | null;
        /**
         * The settings to pass to the parallel worker harness.
         */
        parallelWorkerSettings?: Schema$WorkerSettings;
        /**
         * The streaming worker main class name.
         */
        streamingWorkerMainClass?: string | null;
        /**
         * The UNIX group ID on the worker VM to use for tasks launched by taskrunner; e.g. "wheel".
         */
        taskGroup?: string | null;
        /**
         * The UNIX user ID on the worker VM to use for tasks launched by taskrunner; e.g. "root".
         */
        taskUser?: string | null;
        /**
         * The prefix of the resources the taskrunner should use for temporary storage. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket\}/{object\} bucket.storage.googleapis.com/{object\}
         */
        tempStoragePrefix?: string | null;
        /**
         * The ID string of the VM.
         */
        vmId?: string | null;
        /**
         * The file to store the workflow in.
         */
        workflowFileName?: string | null;
    }
    /**
     * Metadata describing a template.
     */
    export interface Schema$TemplateMetadata {
        /**
         * Optional. Indicates the default streaming mode for a streaming template. Only valid if both supports_at_least_once and supports_exactly_once are true. Possible values: UNSPECIFIED, EXACTLY_ONCE and AT_LEAST_ONCE
         */
        defaultStreamingMode?: string | null;
        /**
         * Optional. A description of the template.
         */
        description?: string | null;
        /**
         * Required. The name of the template.
         */
        name?: string | null;
        /**
         * The parameters for the template.
         */
        parameters?: Schema$ParameterMetadata[];
        /**
         * Optional. Indicates if the template is streaming or not.
         */
        streaming?: boolean | null;
        /**
         * Optional. Indicates if the streaming template supports at least once mode.
         */
        supportsAtLeastOnce?: boolean | null;
        /**
         * Optional. Indicates if the streaming template supports exactly once mode.
         */
        supportsExactlyOnce?: boolean | null;
        /**
         * Optional. For future use.
         */
        yamlDefinition?: string | null;
    }
    /**
     * Global topology of the streaming Dataflow job, including all computations and their sharded locations.
     */
    export interface Schema$TopologyConfig {
        /**
         * The computations associated with a streaming Dataflow job.
         */
        computations?: Schema$ComputationTopology[];
        /**
         * The disks assigned to a streaming Dataflow job.
         */
        dataDiskAssignments?: Schema$DataDiskAssignment[];
        /**
         * The size (in bits) of keys that will be assigned to source messages.
         */
        forwardingKeyBits?: number | null;
        /**
         * Version number for persistent state.
         */
        persistentStateVersion?: number | null;
        /**
         * Maps user stage names to stable computation names.
         */
        userStageToComputationNameMap?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Description of the type, names/ids, and input/outputs for a transform.
     */
    export interface Schema$TransformSummary {
        /**
         * Transform-specific display data.
         */
        displayData?: Schema$DisplayData[];
        /**
         * SDK generated id of this transform instance.
         */
        id?: string | null;
        /**
         * User names for all collection inputs to this transform.
         */
        inputCollectionName?: string[] | null;
        /**
         * Type of transform.
         */
        kind?: string | null;
        /**
         * User provided name for this transform instance.
         */
        name?: string | null;
        /**
         * User names for all collection outputs to this transform.
         */
        outputCollectionName?: string[] | null;
    }
    /**
     * Information about a worker
     */
    export interface Schema$WorkerDetails {
        /**
         * Name of this worker
         */
        workerName?: string | null;
        /**
         * Work items processed by this worker, sorted by time.
         */
        workItems?: Schema$WorkItemDetails[];
    }
    /**
     * WorkerHealthReport contains information about the health of a worker. The VM should be identified by the labels attached to the WorkerMessage that this health ping belongs to.
     */
    export interface Schema$WorkerHealthReport {
        /**
         * Message describing any unusual health reports.
         */
        msg?: string | null;
        /**
         * The pods running on the worker. See: http://kubernetes.io/v1.1/docs/api-reference/v1/definitions.html#_v1_pod This field is used by the worker to send the status of the indvidual containers running on each worker.
         */
        pods?: Array<{
            [key: string]: any;
        }> | null;
        /**
         * The interval at which the worker is sending health reports. The default value of 0 should be interpreted as the field is not being explicitly set by the worker.
         */
        reportInterval?: string | null;
        /**
         * Code to describe a specific reason, if known, that a VM has reported broken state.
         */
        vmBrokenCode?: string | null;
        /**
         * Whether the VM is in a permanently broken state. Broken VMs should be abandoned or deleted ASAP to avoid assigning or completing any work.
         */
        vmIsBroken?: boolean | null;
        /**
         * Whether the VM is currently healthy.
         */
        vmIsHealthy?: boolean | null;
        /**
         * The time the VM was booted.
         */
        vmStartupTime?: string | null;
    }
    /**
     * WorkerHealthReportResponse contains information returned to the worker in response to a health ping.
     */
    export interface Schema$WorkerHealthReportResponse {
        /**
         * A positive value indicates the worker should change its reporting interval to the specified value. The default value of zero means no change in report rate is requested by the server.
         */
        reportInterval?: string | null;
    }
    /**
     * A report of an event in a worker's lifecycle. The proto contains one event, because the worker is expected to asynchronously send each message immediately after the event. Due to this asynchrony, messages may arrive out of order (or missing), and it is up to the consumer to interpret. The timestamp of the event is in the enclosing WorkerMessage proto.
     */
    export interface Schema$WorkerLifecycleEvent {
        /**
         * The start time of this container. All events will report this so that events can be grouped together across container/VM restarts.
         */
        containerStartTime?: string | null;
        /**
         * The event being reported.
         */
        event?: string | null;
        /**
         * Other stats that can accompany an event. E.g. { "downloaded_bytes" : "123456" \}
         */
        metadata?: {
            [key: string]: string;
        } | null;
    }
    /**
     * WorkerMessage provides information to the backend about a worker.
     */
    export interface Schema$WorkerMessage {
        /**
         * Optional. Contains metrics related to go/dataflow-data-sampling-telemetry.
         */
        dataSamplingReport?: Schema$DataSamplingReport;
        /**
         * Labels are used to group WorkerMessages. For example, a worker_message about a particular container might have the labels: { "JOB_ID": "2015-04-22", "WORKER_ID": "wordcount-vm-2015…" "CONTAINER_TYPE": "worker", "CONTAINER_ID": "ac1234def"\} Label tags typically correspond to Label enum values. However, for ease of development other strings can be used as tags. LABEL_UNSPECIFIED should not be used here.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * System defined metrics for this worker.
         */
        perWorkerMetrics?: Schema$PerWorkerMetrics;
        /**
         * Contains per-user worker telemetry used in streaming autoscaling.
         */
        streamingScalingReport?: Schema$StreamingScalingReport;
        /**
         * The timestamp of the worker_message.
         */
        time?: string | null;
        /**
         * The health of a worker.
         */
        workerHealthReport?: Schema$WorkerHealthReport;
        /**
         * Record of worker lifecycle events.
         */
        workerLifecycleEvent?: Schema$WorkerLifecycleEvent;
        /**
         * A worker message code.
         */
        workerMessageCode?: Schema$WorkerMessageCode;
        /**
         * Resource metrics reported by workers.
         */
        workerMetrics?: Schema$ResourceUtilizationReport;
        /**
         * Shutdown notice by workers.
         */
        workerShutdownNotice?: Schema$WorkerShutdownNotice;
        /**
         * Thread scaling information reported by workers.
         */
        workerThreadScalingReport?: Schema$WorkerThreadScalingReport;
    }
    /**
     * A message code is used to report status and error messages to the service. The message codes are intended to be machine readable. The service will take care of translating these into user understandable messages if necessary. Example use cases: 1. Worker processes reporting successful startup. 2. Worker processes reporting specific errors (e.g. package staging failure).
     */
    export interface Schema$WorkerMessageCode {
        /**
         * The code is a string intended for consumption by a machine that identifies the type of message being sent. Examples: 1. "HARNESS_STARTED" might be used to indicate the worker harness has started. 2. "GCS_DOWNLOAD_ERROR" might be used to indicate an error downloading a Cloud Storage file as part of the boot process of one of the worker containers. This is a string and not an enum to make it easy to add new codes without waiting for an API change.
         */
        code?: string | null;
        /**
         * Parameters contains specific information about the code. This is a struct to allow parameters of different types. Examples: 1. For a "HARNESS_STARTED" message parameters might provide the name of the worker and additional data like timing information. 2. For a "GCS_DOWNLOAD_ERROR" parameters might contain fields listing the Cloud Storage objects being downloaded and fields containing errors. In general complex data structures should be avoided. If a worker needs to send a specific and complicated data structure then please consider defining a new proto and adding it to the data oneof in WorkerMessageResponse. Conventions: Parameters should only be used for information that isn't typically passed as a label. hostname and other worker identifiers should almost always be passed as labels since they will be included on most messages.
         */
        parameters?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A worker_message response allows the server to pass information to the sender.
     */
    export interface Schema$WorkerMessageResponse {
        /**
         * Service's streaming scaling response for workers.
         */
        streamingScalingReportResponse?: Schema$StreamingScalingReportResponse;
        /**
         * The service's response to a worker's health report.
         */
        workerHealthReportResponse?: Schema$WorkerHealthReportResponse;
        /**
         * Service's response to reporting worker metrics (currently empty).
         */
        workerMetricsResponse?: Schema$ResourceUtilizationReportResponse;
        /**
         * Service's response to shutdown notice (currently empty).
         */
        workerShutdownNoticeResponse?: Schema$WorkerShutdownNoticeResponse;
        /**
         * Service's thread scaling recommendation for workers.
         */
        workerThreadScalingReportResponse?: Schema$WorkerThreadScalingReportResponse;
    }
    /**
     * Describes one particular pool of Cloud Dataflow workers to be instantiated by the Cloud Dataflow service in order to perform the computations required by a job. Note that a workflow job may use multiple pools, in order to match the various computational requirements of the various stages of the job.
     */
    export interface Schema$WorkerPool {
        /**
         * Settings for autoscaling of this WorkerPool.
         */
        autoscalingSettings?: Schema$AutoscalingSettings;
        /**
         * Data disks that are used by a VM in this workflow.
         */
        dataDisks?: Schema$Disk[];
        /**
         * The default package set to install. This allows the service to select a default set of packages which are useful to worker harnesses written in a particular language.
         */
        defaultPackageSet?: string | null;
        /**
         * Size of root disk for VMs, in GB. If zero or unspecified, the service will attempt to choose a reasonable default.
         */
        diskSizeGb?: number | null;
        /**
         * Fully qualified source image for disks.
         */
        diskSourceImage?: string | null;
        /**
         * Type of root disk for VMs. If empty or unspecified, the service will attempt to choose a reasonable default.
         */
        diskType?: string | null;
        /**
         * Configuration for VM IPs.
         */
        ipConfiguration?: string | null;
        /**
         * The kind of the worker pool; currently only `harness` and `shuffle` are supported.
         */
        kind?: string | null;
        /**
         * Machine type (e.g. "n1-standard-1"). If empty or unspecified, the service will attempt to choose a reasonable default.
         */
        machineType?: string | null;
        /**
         * Metadata to set on the Google Compute Engine VMs.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * Network to which VMs will be assigned. If empty or unspecified, the service will use the network "default".
         */
        network?: string | null;
        /**
         * The number of threads per worker harness. If empty or unspecified, the service will choose a number of threads (according to the number of cores on the selected machine type for batch, or 1 by convention for streaming).
         */
        numThreadsPerWorker?: number | null;
        /**
         * Number of Google Compute Engine workers in this pool needed to execute the job. If zero or unspecified, the service will attempt to choose a reasonable default.
         */
        numWorkers?: number | null;
        /**
         * The action to take on host maintenance, as defined by the Google Compute Engine API.
         */
        onHostMaintenance?: string | null;
        /**
         * Packages to be installed on workers.
         */
        packages?: Schema$Package[];
        /**
         * Extra arguments for this worker pool.
         */
        poolArgs?: {
            [key: string]: any;
        } | null;
        /**
         * Set of SDK harness containers needed to execute this pipeline. This will only be set in the Fn API path. For non-cross-language pipelines this should have only one entry. Cross-language pipelines will have two or more entries.
         */
        sdkHarnessContainerImages?: Schema$SdkHarnessContainerImage[];
        /**
         * Subnetwork to which VMs will be assigned, if desired. Expected to be of the form "regions/REGION/subnetworks/SUBNETWORK".
         */
        subnetwork?: string | null;
        /**
         * Settings passed through to Google Compute Engine workers when using the standard Dataflow task runner. Users should ignore this field.
         */
        taskrunnerSettings?: Schema$TaskRunnerSettings;
        /**
         * Sets the policy for determining when to turndown worker pool. Allowed values are: `TEARDOWN_ALWAYS`, `TEARDOWN_ON_SUCCESS`, and `TEARDOWN_NEVER`. `TEARDOWN_ALWAYS` means workers are always torn down regardless of whether the job succeeds. `TEARDOWN_ON_SUCCESS` means workers are torn down if the job succeeds. `TEARDOWN_NEVER` means the workers are never torn down. If the workers are not torn down by the service, they will continue to run and use Google Compute Engine VM resources in the user's project until they are explicitly terminated by the user. Because of this, Google recommends using the `TEARDOWN_ALWAYS` policy except for small, manually supervised test jobs. If unknown or unspecified, the service will attempt to choose a reasonable default.
         */
        teardownPolicy?: string | null;
        /**
         * Required. Docker container image that executes the Cloud Dataflow worker harness, residing in Google Container Registry. Deprecated for the Fn API path. Use sdk_harness_container_images instead.
         */
        workerHarnessContainerImage?: string | null;
        /**
         * Zone to run the worker pools in. If empty or unspecified, the service will attempt to choose a reasonable default.
         */
        zone?: string | null;
    }
    /**
     * Provides data to pass through to the worker harness.
     */
    export interface Schema$WorkerSettings {
        /**
         * The base URL for accessing Google Cloud APIs. When workers access Google Cloud APIs, they logically do so via relative URLs. If this field is specified, it supplies the base URL to use for resolving these relative URLs. The normative algorithm used is defined by RFC 1808, "Relative Uniform Resource Locators". If not specified, the default value is "http://www.googleapis.com/"
         */
        baseUrl?: string | null;
        /**
         * Whether to send work progress updates to the service.
         */
        reportingEnabled?: boolean | null;
        /**
         * The Cloud Dataflow service path relative to the root URL, for example, "dataflow/v1b3/projects".
         */
        servicePath?: string | null;
        /**
         * The Shuffle service path relative to the root URL, for example, "shuffle/v1beta1".
         */
        shuffleServicePath?: string | null;
        /**
         * The prefix of the resources the system should use for temporary storage. The supported resource type is: Google Cloud Storage: storage.googleapis.com/{bucket\}/{object\} bucket.storage.googleapis.com/{object\}
         */
        tempStoragePrefix?: string | null;
        /**
         * The ID of the worker running this pipeline.
         */
        workerId?: string | null;
    }
    /**
     * Shutdown notification from workers. This is to be sent by the shutdown script of the worker VM so that the backend knows that the VM is being shut down.
     */
    export interface Schema$WorkerShutdownNotice {
        /**
         * The reason for the worker shutdown. Current possible values are: "UNKNOWN": shutdown reason is unknown. "PREEMPTION": shutdown reason is preemption. Other possible reasons may be added in the future.
         */
        reason?: string | null;
    }
    /**
     * Service-side response to WorkerMessage issuing shutdown notice.
     */
    export interface Schema$WorkerShutdownNoticeResponse {
    }
    /**
     * Contains information about the thread scaling information of a worker.
     */
    export interface Schema$WorkerThreadScalingReport {
        /**
         * Current number of active threads in a worker.
         */
        currentThreadCount?: number | null;
    }
    /**
     * Contains the thread scaling recommendation for a worker from the backend.
     */
    export interface Schema$WorkerThreadScalingReportResponse {
        /**
         * Recommended number of threads for a worker.
         */
        recommendedThreadCount?: number | null;
    }
    /**
     * WorkItem represents basic information about a WorkItem to be executed in the cloud.
     */
    export interface Schema$WorkItem {
        /**
         * Work item-specific configuration as an opaque blob.
         */
        configuration?: string | null;
        /**
         * Identifies this WorkItem.
         */
        id?: string | null;
        /**
         * The initial index to use when reporting the status of the WorkItem.
         */
        initialReportIndex?: string | null;
        /**
         * Identifies the workflow job this WorkItem belongs to.
         */
        jobId?: string | null;
        /**
         * Time when the lease on this Work will expire.
         */
        leaseExpireTime?: string | null;
        /**
         * Additional information for MapTask WorkItems.
         */
        mapTask?: Schema$MapTask;
        /**
         * Any required packages that need to be fetched in order to execute this WorkItem.
         */
        packages?: Schema$Package[];
        /**
         * Identifies the cloud project this WorkItem belongs to.
         */
        projectId?: string | null;
        /**
         * Recommended reporting interval.
         */
        reportStatusInterval?: string | null;
        /**
         * Additional information for SeqMapTask WorkItems.
         */
        seqMapTask?: Schema$SeqMapTask;
        /**
         * Additional information for ShellTask WorkItems.
         */
        shellTask?: Schema$ShellTask;
        /**
         * Additional information for source operation WorkItems.
         */
        sourceOperationTask?: Schema$SourceOperationRequest;
        /**
         * Additional information for StreamingComputationTask WorkItems.
         */
        streamingComputationTask?: Schema$StreamingComputationTask;
        /**
         * Additional information for StreamingConfigTask WorkItems.
         */
        streamingConfigTask?: Schema$StreamingConfigTask;
        /**
         * Additional information for StreamingSetupTask WorkItems.
         */
        streamingSetupTask?: Schema$StreamingSetupTask;
    }
    /**
     * Information about an individual work item execution.
     */
    export interface Schema$WorkItemDetails {
        /**
         * Attempt ID of this work item
         */
        attemptId?: string | null;
        /**
         * End time of this work item attempt. If the work item is completed, this is the actual end time of the work item. Otherwise, it is the predicted end time.
         */
        endTime?: string | null;
        /**
         * Metrics for this work item.
         */
        metrics?: Schema$MetricUpdate[];
        /**
         * Progress of this work item.
         */
        progress?: Schema$ProgressTimeseries;
        /**
         * Start time of this work item attempt.
         */
        startTime?: string | null;
        /**
         * State of this work item.
         */
        state?: string | null;
        /**
         * Information about straggler detections for this work item.
         */
        stragglerInfo?: Schema$StragglerInfo;
        /**
         * Name of this work item.
         */
        taskId?: string | null;
    }
    /**
     * The Dataflow service's idea of the current state of a WorkItem being processed by a worker.
     */
    export interface Schema$WorkItemServiceState {
        /**
         * If set, a request to complete the work item with the given status. This will not be set to OK, unless supported by the specific kind of WorkItem. It can be used for the backend to indicate a WorkItem must terminate, e.g., for aborting work.
         */
        completeWorkStatus?: Schema$Status;
        /**
         * Other data returned by the service, specific to the particular worker harness.
         */
        harnessData?: {
            [key: string]: any;
        } | null;
        /**
         * A hot key is a symptom of poor data distribution in which there are enough elements mapped to a single key to impact pipeline performance. When present, this field includes metadata associated with any hot key.
         */
        hotKeyDetection?: Schema$HotKeyDetection;
        /**
         * Time at which the current lease will expire.
         */
        leaseExpireTime?: string | null;
        /**
         * The short ids that workers should use in subsequent metric updates. Workers should strive to use short ids whenever possible, but it is ok to request the short_id again if a worker lost track of it (e.g. if the worker is recovering from a crash). NOTE: it is possible that the response may have short ids for a subset of the metrics.
         */
        metricShortId?: Schema$MetricShortId[];
        /**
         * The index value to use for the next report sent by the worker. Note: If the report call fails for whatever reason, the worker should reuse this index for subsequent report attempts.
         */
        nextReportIndex?: string | null;
        /**
         * New recommended reporting interval.
         */
        reportStatusInterval?: string | null;
        /**
         * The progress point in the WorkItem where the Dataflow service suggests that the worker truncate the task.
         */
        splitRequest?: Schema$ApproximateSplitRequest;
        /**
         * DEPRECATED in favor of split_request.
         */
        suggestedStopPoint?: Schema$ApproximateProgress;
        /**
         * Obsolete, always empty.
         */
        suggestedStopPosition?: Schema$Position;
    }
    /**
     * Conveys a worker's progress through the work described by a WorkItem.
     */
    export interface Schema$WorkItemStatus {
        /**
         * True if the WorkItem was completed (successfully or unsuccessfully).
         */
        completed?: boolean | null;
        /**
         * Worker output counters for this WorkItem.
         */
        counterUpdates?: Schema$CounterUpdate[];
        /**
         * See documentation of stop_position.
         */
        dynamicSourceSplit?: Schema$DynamicSourceSplit;
        /**
         * Specifies errors which occurred during processing. If errors are provided, and completed = true, then the WorkItem is considered to have failed.
         */
        errors?: Schema$Status[];
        /**
         * DEPRECATED in favor of counter_updates.
         */
        metricUpdates?: Schema$MetricUpdate[];
        /**
         * DEPRECATED in favor of reported_progress.
         */
        progress?: Schema$ApproximateProgress;
        /**
         * The worker's progress through this WorkItem.
         */
        reportedProgress?: Schema$ApproximateReportedProgress;
        /**
         * The report index. When a WorkItem is leased, the lease will contain an initial report index. When a WorkItem's status is reported to the system, the report should be sent with that report index, and the response will contain the index the worker should use for the next report. Reports received with unexpected index values will be rejected by the service. In order to preserve idempotency, the worker should not alter the contents of a report, even if the worker must submit the same report multiple times before getting back a response. The worker should not submit a subsequent report until the response for the previous report had been received from the service.
         */
        reportIndex?: string | null;
        /**
         * Amount of time the worker requests for its lease.
         */
        requestedLeaseDuration?: string | null;
        /**
         * DEPRECATED in favor of dynamic_source_split.
         */
        sourceFork?: Schema$SourceFork;
        /**
         * If the work item represented a SourceOperationRequest, and the work is completed, contains the result of the operation.
         */
        sourceOperationResponse?: Schema$SourceOperationResponse;
        /**
         * A worker may split an active map task in two parts, "primary" and "residual", continuing to process the primary part and returning the residual part into the pool of available work. This event is called a "dynamic split" and is critical to the dynamic work rebalancing feature. The two obtained sub-tasks are called "parts" of the split. The parts, if concatenated, must represent the same input as would be read by the current task if the split did not happen. The exact way in which the original task is decomposed into the two parts is specified either as a position demarcating them (stop_position), or explicitly as two DerivedSources, if this task consumes a user-defined source type (dynamic_source_split). The "current" task is adjusted as a result of the split: after a task with range [A, B) sends a stop_position update at C, its range is considered to be [A, C), e.g.: * Progress should be interpreted relative to the new range, e.g. "75% completed" means "75% of [A, C) completed" * The worker should interpret proposed_stop_position relative to the new range, e.g. "split at 68%" should be interpreted as "split at 68% of [A, C)". * If the worker chooses to split again using stop_position, only stop_positions in [A, C) will be accepted. * Etc. dynamic_source_split has similar semantics: e.g., if a task with source S splits using dynamic_source_split into {P, R\} (where P and R must be together equivalent to S), then subsequent progress and proposed_stop_position should be interpreted relative to P, and in a potential subsequent dynamic_source_split into {P', R'\}, P' and R' must be together equivalent to P, etc.
         */
        stopPosition?: Schema$Position;
        /**
         * Total time the worker spent being throttled by external systems.
         */
        totalThrottlerWaitTimeSeconds?: number | null;
        /**
         * Identifies the WorkItem.
         */
        workItemId?: string | null;
    }
    /**
     * An instruction that writes records. Takes one input, produces no outputs.
     */
    export interface Schema$WriteInstruction {
        /**
         * The input.
         */
        input?: Schema$InstructionInput;
        /**
         * The sink to write to.
         */
        sink?: Schema$Sink;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        jobs: Resource$Projects$Jobs;
        locations: Resource$Projects$Locations;
        snapshots: Resource$Projects$Snapshots;
        templates: Resource$Projects$Templates;
        constructor(context: APIRequestContext);
        /**
         * Deletes a snapshot.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        deleteSnapshots(params: Params$Resource$Projects$Deletesnapshots, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteSnapshots(params?: Params$Resource$Projects$Deletesnapshots, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeleteSnapshotResponse>>;
        deleteSnapshots(params: Params$Resource$Projects$Deletesnapshots, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteSnapshots(params: Params$Resource$Projects$Deletesnapshots, options: MethodOptions | BodyResponseCallback<Schema$DeleteSnapshotResponse>, callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        deleteSnapshots(params: Params$Resource$Projects$Deletesnapshots, callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        deleteSnapshots(callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        /**
         * Send a worker_message to the service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        workerMessages(params: Params$Resource$Projects$Workermessages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        workerMessages(params?: Params$Resource$Projects$Workermessages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SendWorkerMessagesResponse>>;
        workerMessages(params: Params$Resource$Projects$Workermessages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        workerMessages(params: Params$Resource$Projects$Workermessages, options: MethodOptions | BodyResponseCallback<Schema$SendWorkerMessagesResponse>, callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
        workerMessages(params: Params$Resource$Projects$Workermessages, callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
        workerMessages(callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
    }
    export interface Params$Resource$Projects$Deletesnapshots extends StandardParameters {
        /**
         * The location that contains this snapshot.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the snapshot belongs to.
         */
        projectId?: string;
        /**
         * The ID of the snapshot.
         */
        snapshotId?: string;
    }
    export interface Params$Resource$Projects$Workermessages extends StandardParameters {
        /**
         * The project to send the WorkerMessages to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendWorkerMessagesRequest;
    }
    export class Resource$Projects$Jobs {
        context: APIRequestContext;
        debug: Resource$Projects$Jobs$Debug;
        messages: Resource$Projects$Jobs$Messages;
        workItems: Resource$Projects$Jobs$Workitems;
        constructor(context: APIRequestContext);
        /**
         * List the jobs of a project across all regions. **Note:** This method doesn't support filtering the list of jobs by name.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        aggregated(params: Params$Resource$Projects$Jobs$Aggregated, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        aggregated(params?: Params$Resource$Projects$Jobs$Aggregated, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        aggregated(params: Params$Resource$Projects$Jobs$Aggregated, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        aggregated(params: Params$Resource$Projects$Jobs$Aggregated, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        aggregated(params: Params$Resource$Projects$Jobs$Aggregated, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        aggregated(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        /**
         * A Job is a multi-stage computation graph run by the Cloud Dataflow service. Creates a Cloud Dataflow job. To create a job, we recommend using `projects.locations.jobs.create` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.create` is not recommended, as your job will always start in `us-central1`. Do not enter confidential information when you supply string values using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Jobs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Jobs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Projects$Jobs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Jobs$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Projects$Jobs$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Gets the state of the specified Cloud Dataflow job. To get the state of a job, we recommend using `projects.locations.jobs.get` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.get` is not recommended, as you can only get the state of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Projects$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Projects$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Request the job status. To request the status of a job, we recommend using `projects.locations.jobs.getMetrics` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.getMetrics` is not recommended, as you can only request the status of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getMetrics(params: Params$Resource$Projects$Jobs$Getmetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMetrics(params?: Params$Resource$Projects$Jobs$Getmetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$JobMetrics>>;
        getMetrics(params: Params$Resource$Projects$Jobs$Getmetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMetrics(params: Params$Resource$Projects$Jobs$Getmetrics, options: MethodOptions | BodyResponseCallback<Schema$JobMetrics>, callback: BodyResponseCallback<Schema$JobMetrics>): void;
        getMetrics(params: Params$Resource$Projects$Jobs$Getmetrics, callback: BodyResponseCallback<Schema$JobMetrics>): void;
        getMetrics(callback: BodyResponseCallback<Schema$JobMetrics>): void;
        /**
         * List the jobs of a project. To list the jobs of a project in a region, we recommend using `projects.locations.jobs.list` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). To list the all jobs across all regions, use `projects.jobs.aggregated`. Using `projects.jobs.list` is not recommended, because you can only get the list of jobs that are running in `us-central1`. `projects.locations.jobs.list` and `projects.jobs.list` support filtering the list of jobs by name. Filtering by name isn't supported by `projects.jobs.aggregated`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Projects$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Projects$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        /**
         * Snapshot the state of a streaming job.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        snapshot(params: Params$Resource$Projects$Jobs$Snapshot, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        snapshot(params?: Params$Resource$Projects$Jobs$Snapshot, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Snapshot>>;
        snapshot(params: Params$Resource$Projects$Jobs$Snapshot, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        snapshot(params: Params$Resource$Projects$Jobs$Snapshot, options: MethodOptions | BodyResponseCallback<Schema$Snapshot>, callback: BodyResponseCallback<Schema$Snapshot>): void;
        snapshot(params: Params$Resource$Projects$Jobs$Snapshot, callback: BodyResponseCallback<Schema$Snapshot>): void;
        snapshot(callback: BodyResponseCallback<Schema$Snapshot>): void;
        /**
         * Updates the state of an existing Cloud Dataflow job. To update the state of an existing job, we recommend using `projects.locations.jobs.update` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.update` is not recommended, as you can only update the state of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Jobs$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Jobs$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        update(params: Params$Resource$Projects$Jobs$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Jobs$Update, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        update(params: Params$Resource$Projects$Jobs$Update, callback: BodyResponseCallback<Schema$Job>): void;
        update(callback: BodyResponseCallback<Schema$Job>): void;
    }
    export interface Params$Resource$Projects$Jobs$Aggregated extends StandardParameters {
        /**
         * The kind of filter to use.
         */
        filter?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * Optional. The job name.
         */
        name?: string;
        /**
         * If there are many jobs, limit response to at most this many. The actual number of jobs returned will be the lesser of max_responses and an unspecified server-defined limit.
         */
        pageSize?: number;
        /**
         * Set this to the 'next_page_token' field of a previous response to request additional results in a long list.
         */
        pageToken?: string;
        /**
         * The project which owns the jobs.
         */
        projectId?: string;
        /**
         * Deprecated. ListJobs always returns summaries now. Use GetJob for other JobViews.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Jobs$Create extends StandardParameters {
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Deprecated. This field is now in the Job message.
         */
        replaceJobId?: string;
        /**
         * The level of information requested in response.
         */
        view?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export interface Params$Resource$Projects$Jobs$Get extends StandardParameters {
        /**
         * The job ID.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The level of information requested in response.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Jobs$Getmetrics extends StandardParameters {
        /**
         * The job to get metrics for.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * A project id.
         */
        projectId?: string;
        /**
         * Return only metric data that has changed since this time. Default is to return all information about all metrics for the job.
         */
        startTime?: string;
    }
    export interface Params$Resource$Projects$Jobs$List extends StandardParameters {
        /**
         * The kind of filter to use.
         */
        filter?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * Optional. The job name.
         */
        name?: string;
        /**
         * If there are many jobs, limit response to at most this many. The actual number of jobs returned will be the lesser of max_responses and an unspecified server-defined limit.
         */
        pageSize?: number;
        /**
         * Set this to the 'next_page_token' field of a previous response to request additional results in a long list.
         */
        pageToken?: string;
        /**
         * The project which owns the jobs.
         */
        projectId?: string;
        /**
         * Deprecated. ListJobs always returns summaries now. Use GetJob for other JobViews.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Jobs$Snapshot extends StandardParameters {
        /**
         * The job to be snapshotted.
         */
        jobId?: string;
        /**
         * The project which owns the job to be snapshotted.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SnapshotJobRequest;
    }
    export interface Params$Resource$Projects$Jobs$Update extends StandardParameters {
        /**
         * The job ID.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The list of fields to update relative to Job. If empty, only RequestedJobState will be considered for update. If the FieldMask is not empty and RequestedJobState is none/empty, The fields specified in the update mask will be the only ones considered for update. If both RequestedJobState and update_mask are specified, an error will be returned as we cannot update both state and mask.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export class Resource$Projects$Jobs$Debug {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get encoded debug configuration for component. Not cacheable.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getConfig(params: Params$Resource$Projects$Jobs$Debug$Getconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getConfig(params?: Params$Resource$Projects$Jobs$Debug$Getconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetDebugConfigResponse>>;
        getConfig(params: Params$Resource$Projects$Jobs$Debug$Getconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getConfig(params: Params$Resource$Projects$Jobs$Debug$Getconfig, options: MethodOptions | BodyResponseCallback<Schema$GetDebugConfigResponse>, callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        getConfig(params: Params$Resource$Projects$Jobs$Debug$Getconfig, callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        getConfig(callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        /**
         * Send encoded debug capture data for component.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        sendCapture(params: Params$Resource$Projects$Jobs$Debug$Sendcapture, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        sendCapture(params?: Params$Resource$Projects$Jobs$Debug$Sendcapture, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SendDebugCaptureResponse>>;
        sendCapture(params: Params$Resource$Projects$Jobs$Debug$Sendcapture, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        sendCapture(params: Params$Resource$Projects$Jobs$Debug$Sendcapture, options: MethodOptions | BodyResponseCallback<Schema$SendDebugCaptureResponse>, callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
        sendCapture(params: Params$Resource$Projects$Jobs$Debug$Sendcapture, callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
        sendCapture(callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
    }
    export interface Params$Resource$Projects$Jobs$Debug$Getconfig extends StandardParameters {
        /**
         * The job id.
         */
        jobId?: string;
        /**
         * The project id.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetDebugConfigRequest;
    }
    export interface Params$Resource$Projects$Jobs$Debug$Sendcapture extends StandardParameters {
        /**
         * The job id.
         */
        jobId?: string;
        /**
         * The project id.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendDebugCaptureRequest;
    }
    export class Resource$Projects$Jobs$Messages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Request the job status. To request the status of a job, we recommend using `projects.locations.jobs.messages.list` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.messages.list` is not recommended, as you can only request the status of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Jobs$Messages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Jobs$Messages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobMessagesResponse>>;
        list(params: Params$Resource$Projects$Jobs$Messages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Jobs$Messages$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobMessagesResponse>, callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
        list(params: Params$Resource$Projects$Jobs$Messages$List, callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
    }
    export interface Params$Resource$Projects$Jobs$Messages$List extends StandardParameters {
        /**
         * Return only messages with timestamps < end_time. The default is now (i.e. return up to the latest messages available).
         */
        endTime?: string;
        /**
         * The job to get messages about.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * Filter to only get messages with importance \>= level
         */
        minimumImportance?: string;
        /**
         * If specified, determines the maximum number of messages to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
         */
        pageSize?: number;
        /**
         * If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
         */
        pageToken?: string;
        /**
         * A project id.
         */
        projectId?: string;
        /**
         * If specified, return only messages with timestamps \>= start_time. The default is the job creation time (i.e. beginning of messages).
         */
        startTime?: string;
    }
    export class Resource$Projects$Jobs$Workitems {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Leases a dataflow WorkItem to run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lease(params: Params$Resource$Projects$Jobs$Workitems$Lease, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lease(params?: Params$Resource$Projects$Jobs$Workitems$Lease, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LeaseWorkItemResponse>>;
        lease(params: Params$Resource$Projects$Jobs$Workitems$Lease, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lease(params: Params$Resource$Projects$Jobs$Workitems$Lease, options: MethodOptions | BodyResponseCallback<Schema$LeaseWorkItemResponse>, callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        lease(params: Params$Resource$Projects$Jobs$Workitems$Lease, callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        lease(callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        /**
         * Reports the status of dataflow WorkItems leased by a worker.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reportStatus(params: Params$Resource$Projects$Jobs$Workitems$Reportstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reportStatus(params?: Params$Resource$Projects$Jobs$Workitems$Reportstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReportWorkItemStatusResponse>>;
        reportStatus(params: Params$Resource$Projects$Jobs$Workitems$Reportstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reportStatus(params: Params$Resource$Projects$Jobs$Workitems$Reportstatus, options: MethodOptions | BodyResponseCallback<Schema$ReportWorkItemStatusResponse>, callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
        reportStatus(params: Params$Resource$Projects$Jobs$Workitems$Reportstatus, callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
        reportStatus(callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
    }
    export interface Params$Resource$Projects$Jobs$Workitems$Lease extends StandardParameters {
        /**
         * Identifies the workflow job this worker belongs to.
         */
        jobId?: string;
        /**
         * Identifies the project this worker belongs to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LeaseWorkItemRequest;
    }
    export interface Params$Resource$Projects$Jobs$Workitems$Reportstatus extends StandardParameters {
        /**
         * The job which the WorkItem is part of.
         */
        jobId?: string;
        /**
         * The project which owns the WorkItem's job.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReportWorkItemStatusRequest;
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        flexTemplates: Resource$Projects$Locations$Flextemplates;
        jobs: Resource$Projects$Locations$Jobs;
        snapshots: Resource$Projects$Locations$Snapshots;
        templates: Resource$Projects$Locations$Templates;
        constructor(context: APIRequestContext);
        /**
         * Send a worker_message to the service.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        workerMessages(params: Params$Resource$Projects$Locations$Workermessages, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        workerMessages(params?: Params$Resource$Projects$Locations$Workermessages, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SendWorkerMessagesResponse>>;
        workerMessages(params: Params$Resource$Projects$Locations$Workermessages, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        workerMessages(params: Params$Resource$Projects$Locations$Workermessages, options: MethodOptions | BodyResponseCallback<Schema$SendWorkerMessagesResponse>, callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
        workerMessages(params: Params$Resource$Projects$Locations$Workermessages, callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
        workerMessages(callback: BodyResponseCallback<Schema$SendWorkerMessagesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Workermessages extends StandardParameters {
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job.
         */
        location?: string;
        /**
         * The project to send the WorkerMessages to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendWorkerMessagesRequest;
    }
    export class Resource$Projects$Locations$Flextemplates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Launch a job with a FlexTemplate.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        launch(params: Params$Resource$Projects$Locations$Flextemplates$Launch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        launch(params?: Params$Resource$Projects$Locations$Flextemplates$Launch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LaunchFlexTemplateResponse>>;
        launch(params: Params$Resource$Projects$Locations$Flextemplates$Launch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        launch(params: Params$Resource$Projects$Locations$Flextemplates$Launch, options: MethodOptions | BodyResponseCallback<Schema$LaunchFlexTemplateResponse>, callback: BodyResponseCallback<Schema$LaunchFlexTemplateResponse>): void;
        launch(params: Params$Resource$Projects$Locations$Flextemplates$Launch, callback: BodyResponseCallback<Schema$LaunchFlexTemplateResponse>): void;
        launch(callback: BodyResponseCallback<Schema$LaunchFlexTemplateResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Flextemplates$Launch extends StandardParameters {
        /**
         * Required. The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request. E.g., us-central1, us-west1.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LaunchFlexTemplateRequest;
    }
    export class Resource$Projects$Locations$Jobs {
        context: APIRequestContext;
        debug: Resource$Projects$Locations$Jobs$Debug;
        messages: Resource$Projects$Locations$Jobs$Messages;
        snapshots: Resource$Projects$Locations$Jobs$Snapshots;
        stages: Resource$Projects$Locations$Jobs$Stages;
        workItems: Resource$Projects$Locations$Jobs$Workitems;
        constructor(context: APIRequestContext);
        /**
         * A Job is a multi-stage computation graph run by the Cloud Dataflow service. Creates a Cloud Dataflow job. To create a job, we recommend using `projects.locations.jobs.create` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.create` is not recommended, as your job will always start in `us-central1`. Do not enter confidential information when you supply string values using the API.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Jobs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Projects$Locations$Jobs$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Gets the state of the specified Cloud Dataflow job. To get the state of a job, we recommend using `projects.locations.jobs.get` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.get` is not recommended, as you can only get the state of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Projects$Locations$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Request detailed information about the execution status of the job. EXPERIMENTAL. This API is subject to change or removal without notice.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Getexecutiondetails, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getExecutionDetails(params?: Params$Resource$Projects$Locations$Jobs$Getexecutiondetails, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$JobExecutionDetails>>;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Getexecutiondetails, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Getexecutiondetails, options: MethodOptions | BodyResponseCallback<Schema$JobExecutionDetails>, callback: BodyResponseCallback<Schema$JobExecutionDetails>): void;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Getexecutiondetails, callback: BodyResponseCallback<Schema$JobExecutionDetails>): void;
        getExecutionDetails(callback: BodyResponseCallback<Schema$JobExecutionDetails>): void;
        /**
         * Request the job status. To request the status of a job, we recommend using `projects.locations.jobs.getMetrics` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.getMetrics` is not recommended, as you can only request the status of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getMetrics(params: Params$Resource$Projects$Locations$Jobs$Getmetrics, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMetrics(params?: Params$Resource$Projects$Locations$Jobs$Getmetrics, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$JobMetrics>>;
        getMetrics(params: Params$Resource$Projects$Locations$Jobs$Getmetrics, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMetrics(params: Params$Resource$Projects$Locations$Jobs$Getmetrics, options: MethodOptions | BodyResponseCallback<Schema$JobMetrics>, callback: BodyResponseCallback<Schema$JobMetrics>): void;
        getMetrics(params: Params$Resource$Projects$Locations$Jobs$Getmetrics, callback: BodyResponseCallback<Schema$JobMetrics>): void;
        getMetrics(callback: BodyResponseCallback<Schema$JobMetrics>): void;
        /**
         * List the jobs of a project. To list the jobs of a project in a region, we recommend using `projects.locations.jobs.list` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). To list the all jobs across all regions, use `projects.jobs.aggregated`. Using `projects.jobs.list` is not recommended, because you can only get the list of jobs that are running in `us-central1`. `projects.locations.jobs.list` and `projects.jobs.list` support filtering the list of jobs by name. Filtering by name isn't supported by `projects.jobs.aggregated`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        /**
         * Snapshot the state of a streaming job.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        snapshot(params: Params$Resource$Projects$Locations$Jobs$Snapshot, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        snapshot(params?: Params$Resource$Projects$Locations$Jobs$Snapshot, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Snapshot>>;
        snapshot(params: Params$Resource$Projects$Locations$Jobs$Snapshot, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        snapshot(params: Params$Resource$Projects$Locations$Jobs$Snapshot, options: MethodOptions | BodyResponseCallback<Schema$Snapshot>, callback: BodyResponseCallback<Schema$Snapshot>): void;
        snapshot(params: Params$Resource$Projects$Locations$Jobs$Snapshot, callback: BodyResponseCallback<Schema$Snapshot>): void;
        snapshot(callback: BodyResponseCallback<Schema$Snapshot>): void;
        /**
         * Updates the state of an existing Cloud Dataflow job. To update the state of an existing job, we recommend using `projects.locations.jobs.update` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.update` is not recommended, as you can only update the state of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Projects$Locations$Jobs$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Projects$Locations$Jobs$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        update(params: Params$Resource$Projects$Locations$Jobs$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Projects$Locations$Jobs$Update, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        update(params: Params$Resource$Projects$Locations$Jobs$Update, callback: BodyResponseCallback<Schema$Job>): void;
        update(callback: BodyResponseCallback<Schema$Job>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Create extends StandardParameters {
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Deprecated. This field is now in the Job message.
         */
        replaceJobId?: string;
        /**
         * The level of information requested in response.
         */
        view?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Get extends StandardParameters {
        /**
         * The job ID.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The level of information requested in response.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Getexecutiondetails extends StandardParameters {
        /**
         * The job to get execution details for.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * If specified, determines the maximum number of stages to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
         */
        pageSize?: number;
        /**
         * If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
         */
        pageToken?: string;
        /**
         * A project id.
         */
        projectId?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Getmetrics extends StandardParameters {
        /**
         * The job to get metrics for.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * A project id.
         */
        projectId?: string;
        /**
         * Return only metric data that has changed since this time. Default is to return all information about all metrics for the job.
         */
        startTime?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$List extends StandardParameters {
        /**
         * The kind of filter to use.
         */
        filter?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * Optional. The job name.
         */
        name?: string;
        /**
         * If there are many jobs, limit response to at most this many. The actual number of jobs returned will be the lesser of max_responses and an unspecified server-defined limit.
         */
        pageSize?: number;
        /**
         * Set this to the 'next_page_token' field of a previous response to request additional results in a long list.
         */
        pageToken?: string;
        /**
         * The project which owns the jobs.
         */
        projectId?: string;
        /**
         * Deprecated. ListJobs always returns summaries now. Use GetJob for other JobViews.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Snapshot extends StandardParameters {
        /**
         * The job to be snapshotted.
         */
        jobId?: string;
        /**
         * The location that contains this job.
         */
        location?: string;
        /**
         * The project which owns the job to be snapshotted.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SnapshotJobRequest;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Update extends StandardParameters {
        /**
         * The job ID.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains this job.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The list of fields to update relative to Job. If empty, only RequestedJobState will be considered for update. If the FieldMask is not empty and RequestedJobState is none/empty, The fields specified in the update mask will be the only ones considered for update. If both RequestedJobState and update_mask are specified, an error will be returned as we cannot update both state and mask.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export class Resource$Projects$Locations$Jobs$Debug {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get encoded debug configuration for component. Not cacheable.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getConfig(params: Params$Resource$Projects$Locations$Jobs$Debug$Getconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getConfig(params?: Params$Resource$Projects$Locations$Jobs$Debug$Getconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetDebugConfigResponse>>;
        getConfig(params: Params$Resource$Projects$Locations$Jobs$Debug$Getconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getConfig(params: Params$Resource$Projects$Locations$Jobs$Debug$Getconfig, options: MethodOptions | BodyResponseCallback<Schema$GetDebugConfigResponse>, callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        getConfig(params: Params$Resource$Projects$Locations$Jobs$Debug$Getconfig, callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        getConfig(callback: BodyResponseCallback<Schema$GetDebugConfigResponse>): void;
        /**
         * Send encoded debug capture data for component.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        sendCapture(params: Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        sendCapture(params?: Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SendDebugCaptureResponse>>;
        sendCapture(params: Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        sendCapture(params: Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture, options: MethodOptions | BodyResponseCallback<Schema$SendDebugCaptureResponse>, callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
        sendCapture(params: Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture, callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
        sendCapture(callback: BodyResponseCallback<Schema$SendDebugCaptureResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Debug$Getconfig extends StandardParameters {
        /**
         * The job id.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * The project id.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetDebugConfigRequest;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Debug$Sendcapture extends StandardParameters {
        /**
         * The job id.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * The project id.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendDebugCaptureRequest;
    }
    export class Resource$Projects$Locations$Jobs$Messages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Request the job status. To request the status of a job, we recommend using `projects.locations.jobs.messages.list` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.jobs.messages.list` is not recommended, as you can only request the status of jobs that are running in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Jobs$Messages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Jobs$Messages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobMessagesResponse>>;
        list(params: Params$Resource$Projects$Locations$Jobs$Messages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$Messages$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobMessagesResponse>, callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$Messages$List, callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobMessagesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Messages$List extends StandardParameters {
        /**
         * Return only messages with timestamps < end_time. The default is now (i.e. return up to the latest messages available).
         */
        endTime?: string;
        /**
         * The job to get messages about.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * Filter to only get messages with importance \>= level
         */
        minimumImportance?: string;
        /**
         * If specified, determines the maximum number of messages to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
         */
        pageSize?: number;
        /**
         * If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
         */
        pageToken?: string;
        /**
         * A project id.
         */
        projectId?: string;
        /**
         * If specified, return only messages with timestamps \>= start_time. The default is the job creation time (i.e. beginning of messages).
         */
        startTime?: string;
    }
    export class Resource$Projects$Locations$Jobs$Snapshots {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists snapshots.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Jobs$Snapshots$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Jobs$Snapshots$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSnapshotsResponse>>;
        list(params: Params$Resource$Projects$Locations$Jobs$Snapshots$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$Snapshots$List, options: MethodOptions | BodyResponseCallback<Schema$ListSnapshotsResponse>, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Jobs$Snapshots$List, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Snapshots$List extends StandardParameters {
        /**
         * If specified, list snapshots created from this job.
         */
        jobId?: string;
        /**
         * The location to list snapshots in.
         */
        location?: string;
        /**
         * The project ID to list snapshots for.
         */
        projectId?: string;
    }
    export class Resource$Projects$Locations$Jobs$Stages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Request detailed information about the execution status of a stage of the job. EXPERIMENTAL. This API is subject to change or removal without notice.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getExecutionDetails(params?: Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StageExecutionDetails>>;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails, options: MethodOptions | BodyResponseCallback<Schema$StageExecutionDetails>, callback: BodyResponseCallback<Schema$StageExecutionDetails>): void;
        getExecutionDetails(params: Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails, callback: BodyResponseCallback<Schema$StageExecutionDetails>): void;
        getExecutionDetails(callback: BodyResponseCallback<Schema$StageExecutionDetails>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Stages$Getexecutiondetails extends StandardParameters {
        /**
         * Upper time bound of work items to include, by start time.
         */
        endTime?: string;
        /**
         * The job to get execution details for.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the job specified by job_id.
         */
        location?: string;
        /**
         * If specified, determines the maximum number of work items to return. If unspecified, the service may choose an appropriate default, or may return an arbitrarily large number of results.
         */
        pageSize?: number;
        /**
         * If supplied, this should be the value of next_page_token returned by an earlier call. This will cause the next page of results to be returned.
         */
        pageToken?: string;
        /**
         * A project id.
         */
        projectId?: string;
        /**
         * The stage for which to fetch information.
         */
        stageId?: string;
        /**
         * Lower time bound of work items to include, by start time.
         */
        startTime?: string;
    }
    export class Resource$Projects$Locations$Jobs$Workitems {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Leases a dataflow WorkItem to run.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lease(params: Params$Resource$Projects$Locations$Jobs$Workitems$Lease, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lease(params?: Params$Resource$Projects$Locations$Jobs$Workitems$Lease, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LeaseWorkItemResponse>>;
        lease(params: Params$Resource$Projects$Locations$Jobs$Workitems$Lease, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lease(params: Params$Resource$Projects$Locations$Jobs$Workitems$Lease, options: MethodOptions | BodyResponseCallback<Schema$LeaseWorkItemResponse>, callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        lease(params: Params$Resource$Projects$Locations$Jobs$Workitems$Lease, callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        lease(callback: BodyResponseCallback<Schema$LeaseWorkItemResponse>): void;
        /**
         * Reports the status of dataflow WorkItems leased by a worker.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        reportStatus(params: Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reportStatus(params?: Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ReportWorkItemStatusResponse>>;
        reportStatus(params: Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reportStatus(params: Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus, options: MethodOptions | BodyResponseCallback<Schema$ReportWorkItemStatusResponse>, callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
        reportStatus(params: Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus, callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
        reportStatus(callback: BodyResponseCallback<Schema$ReportWorkItemStatusResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Workitems$Lease extends StandardParameters {
        /**
         * Identifies the workflow job this worker belongs to.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the WorkItem's job.
         */
        location?: string;
        /**
         * Identifies the project this worker belongs to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LeaseWorkItemRequest;
    }
    export interface Params$Resource$Projects$Locations$Jobs$Workitems$Reportstatus extends StandardParameters {
        /**
         * The job which the WorkItem is part of.
         */
        jobId?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) that contains the WorkItem's job.
         */
        location?: string;
        /**
         * The project which owns the WorkItem's job.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ReportWorkItemStatusRequest;
    }
    export class Resource$Projects$Locations$Snapshots {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a snapshot.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Projects$Locations$Snapshots$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Snapshots$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeleteSnapshotResponse>>;
        delete(params: Params$Resource$Projects$Locations$Snapshots$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Snapshots$Delete, options: MethodOptions | BodyResponseCallback<Schema$DeleteSnapshotResponse>, callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        delete(params: Params$Resource$Projects$Locations$Snapshots$Delete, callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        delete(callback: BodyResponseCallback<Schema$DeleteSnapshotResponse>): void;
        /**
         * Gets information about a snapshot.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Snapshots$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Snapshots$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Snapshot>>;
        get(params: Params$Resource$Projects$Locations$Snapshots$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Snapshots$Get, options: MethodOptions | BodyResponseCallback<Schema$Snapshot>, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(params: Params$Resource$Projects$Locations$Snapshots$Get, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(callback: BodyResponseCallback<Schema$Snapshot>): void;
        /**
         * Lists snapshots.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Locations$Snapshots$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Snapshots$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSnapshotsResponse>>;
        list(params: Params$Resource$Projects$Locations$Snapshots$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Snapshots$List, options: MethodOptions | BodyResponseCallback<Schema$ListSnapshotsResponse>, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Snapshots$List, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Snapshots$Delete extends StandardParameters {
        /**
         * The location that contains this snapshot.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the snapshot belongs to.
         */
        projectId?: string;
        /**
         * The ID of the snapshot.
         */
        snapshotId?: string;
    }
    export interface Params$Resource$Projects$Locations$Snapshots$Get extends StandardParameters {
        /**
         * The location that contains this snapshot.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the snapshot belongs to.
         */
        projectId?: string;
        /**
         * The ID of the snapshot.
         */
        snapshotId?: string;
    }
    export interface Params$Resource$Projects$Locations$Snapshots$List extends StandardParameters {
        /**
         * If specified, list snapshots created from this job.
         */
        jobId?: string;
        /**
         * The location to list snapshots in.
         */
        location?: string;
        /**
         * The project ID to list snapshots for.
         */
        projectId?: string;
    }
    export class Resource$Projects$Locations$Templates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Cloud Dataflow job from a template. Do not enter confidential information when you supply string values using the API. To create a job, we recommend using `projects.locations.templates.create` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.create` is not recommended, because your job will always start in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Locations$Templates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Templates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Projects$Locations$Templates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Templates$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Projects$Locations$Templates$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Get the template associated with a template. To get the template, we recommend using `projects.locations.templates.get` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.get` is not recommended, because only templates that are running in `us-central1` are retrieved.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Locations$Templates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Templates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetTemplateResponse>>;
        get(params: Params$Resource$Projects$Locations$Templates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Templates$Get, options: MethodOptions | BodyResponseCallback<Schema$GetTemplateResponse>, callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        get(params: Params$Resource$Projects$Locations$Templates$Get, callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        get(callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        /**
         * Launches a template. To launch a template, we recommend using `projects.locations.templates.launch` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.launch` is not recommended, because jobs launched from the template will always start in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        launch(params: Params$Resource$Projects$Locations$Templates$Launch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        launch(params?: Params$Resource$Projects$Locations$Templates$Launch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LaunchTemplateResponse>>;
        launch(params: Params$Resource$Projects$Locations$Templates$Launch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        launch(params: Params$Resource$Projects$Locations$Templates$Launch, options: MethodOptions | BodyResponseCallback<Schema$LaunchTemplateResponse>, callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
        launch(params: Params$Resource$Projects$Locations$Templates$Launch, callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
        launch(callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Templates$Create extends StandardParameters {
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateJobFromTemplateRequest;
    }
    export interface Params$Resource$Projects$Locations$Templates$Get extends StandardParameters {
        /**
         * Required. A Cloud Storage path to the template from which to create the job. Must be valid Cloud Storage URL, beginning with 'gs://'.
         */
        gcsPath?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The view to retrieve. Defaults to METADATA_ONLY.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Locations$Templates$Launch extends StandardParameters {
        /**
         * Path to the dynamic template specification file on Cloud Storage. The file must be a JSON serialized `DynamicTemplateFileSpec` object.
         */
        'dynamicTemplate.gcsPath'?: string;
        /**
         * Cloud Storage path for staging dependencies. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        'dynamicTemplate.stagingLocation'?: string;
        /**
         * A Cloud Storage path to the template to use to create the job. Must be valid Cloud Storage URL, beginning with `gs://`.
         */
        gcsPath?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * If true, the request is validated but not actually executed. Defaults to false.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LaunchTemplateParameters;
    }
    export class Resource$Projects$Snapshots {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a snapshot.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Snapshots$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Snapshots$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Snapshot>>;
        get(params: Params$Resource$Projects$Snapshots$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Snapshots$Get, options: MethodOptions | BodyResponseCallback<Schema$Snapshot>, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(params: Params$Resource$Projects$Snapshots$Get, callback: BodyResponseCallback<Schema$Snapshot>): void;
        get(callback: BodyResponseCallback<Schema$Snapshot>): void;
        /**
         * Lists snapshots.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Projects$Snapshots$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Snapshots$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSnapshotsResponse>>;
        list(params: Params$Resource$Projects$Snapshots$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Snapshots$List, options: MethodOptions | BodyResponseCallback<Schema$ListSnapshotsResponse>, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(params: Params$Resource$Projects$Snapshots$List, callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSnapshotsResponse>): void;
    }
    export interface Params$Resource$Projects$Snapshots$Get extends StandardParameters {
        /**
         * The location that contains this snapshot.
         */
        location?: string;
        /**
         * The ID of the Cloud Platform project that the snapshot belongs to.
         */
        projectId?: string;
        /**
         * The ID of the snapshot.
         */
        snapshotId?: string;
    }
    export interface Params$Resource$Projects$Snapshots$List extends StandardParameters {
        /**
         * If specified, list snapshots created from this job.
         */
        jobId?: string;
        /**
         * The location to list snapshots in.
         */
        location?: string;
        /**
         * The project ID to list snapshots for.
         */
        projectId?: string;
    }
    export class Resource$Projects$Templates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a Cloud Dataflow job from a template. Do not enter confidential information when you supply string values using the API. To create a job, we recommend using `projects.locations.templates.create` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.create` is not recommended, because your job will always start in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Projects$Templates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Templates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Projects$Templates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Templates$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Projects$Templates$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Get the template associated with a template. To get the template, we recommend using `projects.locations.templates.get` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.get` is not recommended, because only templates that are running in `us-central1` are retrieved.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Projects$Templates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Templates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GetTemplateResponse>>;
        get(params: Params$Resource$Projects$Templates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Templates$Get, options: MethodOptions | BodyResponseCallback<Schema$GetTemplateResponse>, callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        get(params: Params$Resource$Projects$Templates$Get, callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        get(callback: BodyResponseCallback<Schema$GetTemplateResponse>): void;
        /**
         * Launches a template. To launch a template, we recommend using `projects.locations.templates.launch` with a [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints). Using `projects.templates.launch` is not recommended, because jobs launched from the template will always start in `us-central1`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        launch(params: Params$Resource$Projects$Templates$Launch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        launch(params?: Params$Resource$Projects$Templates$Launch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LaunchTemplateResponse>>;
        launch(params: Params$Resource$Projects$Templates$Launch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        launch(params: Params$Resource$Projects$Templates$Launch, options: MethodOptions | BodyResponseCallback<Schema$LaunchTemplateResponse>, callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
        launch(params: Params$Resource$Projects$Templates$Launch, callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
        launch(callback: BodyResponseCallback<Schema$LaunchTemplateResponse>): void;
    }
    export interface Params$Resource$Projects$Templates$Create extends StandardParameters {
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CreateJobFromTemplateRequest;
    }
    export interface Params$Resource$Projects$Templates$Get extends StandardParameters {
        /**
         * Required. A Cloud Storage path to the template from which to create the job. Must be valid Cloud Storage URL, beginning with 'gs://'.
         */
        gcsPath?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * The view to retrieve. Defaults to METADATA_ONLY.
         */
        view?: string;
    }
    export interface Params$Resource$Projects$Templates$Launch extends StandardParameters {
        /**
         * Path to the dynamic template specification file on Cloud Storage. The file must be a JSON serialized `DynamicTemplateFileSpec` object.
         */
        'dynamicTemplate.gcsPath'?: string;
        /**
         * Cloud Storage path for staging dependencies. Must be a valid Cloud Storage URL, beginning with `gs://`.
         */
        'dynamicTemplate.stagingLocation'?: string;
        /**
         * A Cloud Storage path to the template to use to create the job. Must be valid Cloud Storage URL, beginning with `gs://`.
         */
        gcsPath?: string;
        /**
         * The [regional endpoint] (https://cloud.google.com/dataflow/docs/concepts/regional-endpoints) to which to direct the request.
         */
        location?: string;
        /**
         * Required. The ID of the Cloud Platform project that the job belongs to.
         */
        projectId?: string;
        /**
         * If true, the request is validated but not actually executed. Defaults to false.
         */
        validateOnly?: boolean;
        /**
         * Request body metadata
         */
        requestBody?: Schema$LaunchTemplateParameters;
    }
    export {};
}
