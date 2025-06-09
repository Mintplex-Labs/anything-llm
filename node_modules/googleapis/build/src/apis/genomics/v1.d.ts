import { GoogleConfigurable, GlobalOptions, APIRequestContext } from 'googleapis-common';
export declare namespace genomics_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    /**
     * Genomics API
     *
     * Uploads, processes, queries, and searches Genomics data in the cloud.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const genomics = google.genomics('v1');
     * ```
     */
    class Genomics {
        context: APIRequestContext;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Carries information about an accelerator that can be attached to a VM.
     */
    interface Schema$Accelerator {
        /**
         * How many accelerators of this type to attach.
         */
        count?: string | null;
        /**
         * The accelerator type string (for example, "nvidia-tesla-k80"). Only NVIDIA GPU accelerators are currently supported. If an NVIDIA GPU is attached, the required runtime libraries will be made available to all containers under `/usr/local/nvidia`. The driver version to install must be specified using the NVIDIA driver version parameter on the virtual machine specification. Note that attaching a GPU increases the worker VM startup time by a few minutes.
         */
        type?: string | null;
    }
    /**
     * Specifies a single action that runs a Docker container.
     */
    interface Schema$Action {
        /**
         * If specified, overrides the `CMD` specified in the container. If the container also has an `ENTRYPOINT` the values are used as entrypoint arguments. Otherwise, they are used as a command and arguments to run inside the container.
         */
        commands?: string[] | null;
        /**
         * If the specified image is hosted on a private registry other than Google Container Registry, the credentials required to pull the image must be specified here as an encrypted secret. The secret must decrypt to a JSON-encoded dictionary containing both `username` and `password` keys.
         */
        credentials?: Schema$Secret;
        /**
         * The encrypted environment to pass into the container. This environment is merged with values specified in the google.genomics.v2alpha1.Pipeline message, overwriting any duplicate values. The secret must decrypt to a JSON-encoded dictionary where key-value pairs serve as environment variable names and their values. The decoded environment variables can overwrite the values specified by the `environment` field.
         */
        encryptedEnvironment?: Schema$Secret;
        /**
         * If specified, overrides the `ENTRYPOINT` specified in the container.
         */
        entrypoint?: string | null;
        /**
         * The environment to pass into the container. This environment is merged with values specified in the google.genomics.v2alpha1.Pipeline message, overwriting any duplicate values. In addition to the values passed here, a few other values are automatically injected into the environment. These cannot be hidden or overwritten. `GOOGLE_PIPELINE_FAILED` will be set to "1" if the pipeline failed because an action has exited with a non-zero status (and did not have the `IGNORE_EXIT_STATUS` flag set). This can be used to determine if additional debug or logging actions should execute. `GOOGLE_LAST_EXIT_STATUS` will be set to the exit status of the last non-background action that executed. This can be used by workflow engine authors to determine whether an individual action has succeeded or failed.
         */
        environment?: {
            [key: string]: string;
        } | null;
        /**
         * The set of flags to apply to this action.
         */
        flags?: string[] | null;
        /**
         * Required. The URI to pull the container image from. Note that all images referenced by actions in the pipeline are pulled before the first action runs. If multiple actions reference the same image, it is only pulled once, ensuring that the same image is used for all actions in a single pipeline. The image URI can be either a complete host and image specification (e.g., quay.io/biocontainers/samtools), a library and image name (e.g., google/cloud-sdk) or a bare image name ('bash') to pull from the default library. No schema is required in any of these cases. If the specified image is not public, the service account specified for the Virtual Machine must have access to pull the images from GCR, or appropriate credentials must be specified in the google.genomics.v2alpha1.Action.credentials field.
         */
        imageUri?: string | null;
        /**
         * Labels to associate with the action. This field is provided to assist workflow engine authors in identifying actions (for example, to indicate what sort of action they perform, such as localization or debugging). They are returned in the operation metadata, but are otherwise ignored.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * A list of mounts to make available to the action. In addition to the values specified here, every action has a special virtual disk mounted under `/google` that contains log files and other operational components. - /google/logs All logs written during the pipeline execution. - /google/logs/output The combined standard output and standard error of all actions run as part of the pipeline execution. - /google/logs/action/x/stdout The complete contents of each individual action's standard output. - /google/logs/action/x/stderr The complete contents of each individual action's standard error output.
         */
        mounts?: Schema$Mount[];
        /**
         * An optional name for the container. The container hostname will be set to this name, making it useful for inter-container communication. The name must contain only upper and lowercase alphanumeric characters and hyphens and cannot start with a hyphen.
         */
        name?: string | null;
        /**
         * An optional identifier for a PID namespace to run the action inside. Multiple actions should use the same string to share a namespace. If unspecified, a separate isolated namespace is used.
         */
        pidNamespace?: string | null;
        /**
         * A map of containers to host port mappings for this container. If the container already specifies exposed ports, use the `PUBLISH_EXPOSED_PORTS` flag instead. The host port number must be less than 65536. If it is zero, an unused random port is assigned. To determine the resulting port number, consult the `ContainerStartedEvent` in the operation metadata.
         */
        portMappings?: {
            [key: string]: number;
        } | null;
        /**
         * The maximum amount of time to give the action to complete. If the action fails to complete before the timeout, it will be terminated and the exit status will be non-zero. The pipeline will continue or terminate based on the rules defined by the `ALWAYS_RUN` and `IGNORE_EXIT_STATUS` flags.
         */
        timeout?: string | null;
    }
    /**
     * An event generated when a container is forcibly terminated by the worker. Currently, this only occurs when the container outlives the timeout specified by the user.
     */
    interface Schema$ContainerKilledEvent {
        /**
         * The numeric ID of the action that started the container.
         */
        actionId?: number | null;
    }
    /**
     * An event generated when a container starts.
     */
    interface Schema$ContainerStartedEvent {
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
    interface Schema$ContainerStoppedEvent {
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
     * An event generated whenever a resource limitation or transient error delays execution of a pipeline that was otherwise ready to run.
     */
    interface Schema$DelayedEvent {
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
     * Carries information about a disk that can be attached to a VM. See https://cloud.google.com/compute/docs/disks/performance for more information about disk type, size, and performance considerations. Specify either `Volume` or `Disk`, but not both.
     */
    interface Schema$Disk {
        /**
         * A user-supplied name for the disk. Used when mounting the disk into actions. The name must contain only upper and lowercase alphanumeric characters and hyphens and cannot start with a hyphen.
         */
        name?: string | null;
        /**
         * The size, in GB, of the disk to attach. If the size is not specified, a default is chosen to ensure reasonable I/O performance. If the disk type is specified as `local-ssd`, multiple local drives are automatically combined to provide the requested size. Note, however, that each physical SSD is 375GB in size, and no more than 8 drives can be attached to a single instance.
         */
        sizeGb?: number | null;
        /**
         * An optional image to put on the disk before attaching it to the VM.
         */
        sourceImage?: string | null;
        /**
         * The Compute Engine disk type. If unspecified, `pd-standard` is used.
         */
        type?: string | null;
    }
    /**
     * Carries information about events that occur during pipeline execution.
     */
    interface Schema$Event {
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
     * Configuration for an existing disk to be attached to the VM.
     */
    interface Schema$ExistingDisk {
        /**
         * If `disk` contains slashes, the Cloud Life Sciences API assumes that it is a complete URL for the disk. If `disk` does not contain slashes, the Cloud Life Sciences API assumes that the disk is a zonal disk and a URL will be generated of the form `zones//disks/`, where `` is the zone in which the instance is allocated. The disk must be ext4 formatted. If all `Mount` references to this disk have the `read_only` flag set to true, the disk will be attached in `read-only` mode and can be shared with other instances. Otherwise, the disk will be available for writing but cannot be shared.
         */
        disk?: string | null;
    }
    /**
     * An event generated when the execution of a pipeline has failed. Note that other events can continue to occur after this event.
     */
    interface Schema$FailedEvent {
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
     * Carries information about the pipeline execution that is returned in the long running operation's metadata field.
     */
    interface Schema$Metadata {
        /**
         * The time at which the operation was created by the API.
         */
        createTime?: string | null;
        /**
         * The time at which execution was completed and resources were cleaned up.
         */
        endTime?: string | null;
        /**
         * The list of events that have happened so far during the execution of this operation.
         */
        events?: Schema$Event[];
        /**
         * The user-defined labels associated with this operation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The pipeline this operation represents.
         */
        pipeline?: Schema$Pipeline;
        /**
         * The first time at which resources were allocated to execute the pipeline.
         */
        startTime?: string | null;
    }
    /**
     * Carries information about a particular disk mount inside a container.
     */
    interface Schema$Mount {
        /**
         * The name of the disk to mount, as specified in the resources section.
         */
        disk?: string | null;
        /**
         * The path to mount the disk inside the container.
         */
        path?: string | null;
        /**
         * If true, the disk is mounted read-only inside the container.
         */
        readOnly?: boolean | null;
    }
    /**
     * VM networking options.
     */
    interface Schema$Network {
        /**
         * The network name to attach the VM's network interface to. The value will be prefixed with `global/networks/` unless it contains a `/`, in which case it is assumed to be a fully specified network resource URL. If unspecified, the global default network is used.
         */
        name?: string | null;
        /**
         * If the specified network is configured for custom subnet creation, the name of the subnetwork to attach the instance to must be specified here. The value is prefixed with `regions/x/subnetworks/` unless it contains a `/`, in which case it is assumed to be a fully specified subnetwork resource URL. If the `*` character appears in the value, it is replaced with the region that the virtual machine has been allocated in.
         */
        subnetwork?: string | null;
        /**
         * If set to true, do not attach a public IP address to the VM. Note that without a public IP address, additional configuration is required to allow the VM to access Google services. See https://cloud.google.com/vpc/docs/configure-private-google-access for more information.
         */
        usePrivateAddress?: boolean | null;
    }
    /**
     * Configuration for an `NFSMount` to be attached to the VM.
     */
    interface Schema$NFSMount {
        /**
         * A target NFS mount. The target must be specified as `address:/mount".
         */
        target?: string | null;
    }
    /**
     * Configuration for a persistent disk to be attached to the VM. See https://cloud.google.com/compute/docs/disks/performance for more information about disk type, size, and performance considerations.
     */
    interface Schema$PersistentDisk {
        /**
         * The size, in GB, of the disk to attach. If the size is not specified, a default is chosen to ensure reasonable I/O performance. If the disk type is specified as `local-ssd`, multiple local drives are automatically combined to provide the requested size. Note, however, that each physical SSD is 375GB in size, and no more than 8 drives can be attached to a single instance.
         */
        sizeGb?: number | null;
        /**
         * An image to put on the disk before attaching it to the VM.
         */
        sourceImage?: string | null;
        /**
         * The Compute Engine disk type. If unspecified, `pd-standard` is used.
         */
        type?: string | null;
    }
    /**
     * Specifies a series of actions to execute, expressed as Docker containers.
     */
    interface Schema$Pipeline {
        /**
         * The list of actions to execute, in the order they are specified.
         */
        actions?: Schema$Action[];
        /**
         * The encrypted environment to pass into every action. Each action can also specify its own encrypted environment. The secret must decrypt to a JSON-encoded dictionary where key-value pairs serve as environment variable names and their values. The decoded environment variables can overwrite the values specified by the `environment` field.
         */
        encryptedEnvironment?: Schema$Secret;
        /**
         * The environment to pass into every action. Each action can also specify additional environment variables but cannot delete an entry from this map (though they can overwrite it with a different value).
         */
        environment?: {
            [key: string]: string;
        } | null;
        /**
         * The resources required for execution.
         */
        resources?: Schema$Resources;
        /**
         * The maximum amount of time to give the pipeline to complete. This includes the time spent waiting for a worker to be allocated. If the pipeline fails to complete before the timeout, it will be cancelled and the error code will be set to DEADLINE_EXCEEDED. If unspecified, it will default to 7 days.
         */
        timeout?: string | null;
    }
    /**
     * An event generated when the worker starts pulling an image.
     */
    interface Schema$PullStartedEvent {
        /**
         * The URI of the image that was pulled.
         */
        imageUri?: string | null;
    }
    /**
     * An event generated when the worker stops pulling an image.
     */
    interface Schema$PullStoppedEvent {
        /**
         * The URI of the image that was pulled.
         */
        imageUri?: string | null;
    }
    /**
     * The system resources for the pipeline run. At least one zone or region must be specified or the pipeline run will fail.
     */
    interface Schema$Resources {
        /**
         * The project ID to allocate resources in.
         */
        projectId?: string | null;
        /**
         * The list of regions allowed for VM allocation. If set, the `zones` field must not be set.
         */
        regions?: string[] | null;
        /**
         * The virtual machine specification.
         */
        virtualMachine?: Schema$VirtualMachine;
        /**
         * The list of zones allowed for VM allocation. If set, the `regions` field must not be set.
         */
        zones?: string[] | null;
    }
    /**
     * The response to the RunPipeline method, returned in the operation's result field on success.
     */
    interface Schema$RunPipelineResponse {
    }
    /**
     * Holds encrypted information that is only decrypted and stored in RAM by the worker VM when running the pipeline.
     */
    interface Schema$Secret {
        /**
         * The value of the cipherText response from the `encrypt` method. This field is intentionally unaudited.
         */
        cipherText?: string | null;
        /**
         * The name of the Cloud KMS key that will be used to decrypt the secret value. The VM service account must have the required permissions and authentication scopes to invoke the `decrypt` method on the specified key.
         */
        keyName?: string | null;
    }
    /**
     * Carries information about a Google Cloud service account.
     */
    interface Schema$ServiceAccount {
        /**
         * Email address of the service account. If not specified, the default Compute Engine service account for the project will be used.
         */
        email?: string | null;
        /**
         * List of scopes to be enabled for this service account on the VM, in addition to the cloud-platform API scope that will be added by default.
         */
        scopes?: string[] | null;
    }
    /**
     * An event generated when the execution of a container results in a non-zero exit status that was not otherwise ignored. Execution will continue, but only actions that are flagged as `ALWAYS_RUN` will be executed. Other actions will be skipped.
     */
    interface Schema$UnexpectedExitStatusEvent {
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
     * Carries information about a Compute Engine VM resource.
     */
    interface Schema$VirtualMachine {
        /**
         * The list of accelerators to attach to the VM.
         */
        accelerators?: Schema$Accelerator[];
        /**
         * The size of the boot disk, in GB. The boot disk must be large enough to accommodate all of the Docker images from each action in the pipeline at the same time. If not specified, a small but reasonable default value is used.
         */
        bootDiskSizeGb?: number | null;
        /**
         * The host operating system image to use. Currently, only Container-Optimized OS images can be used. The default value is `projects/cos-cloud/global/images/family/cos-stable`, which selects the latest stable release of Container-Optimized OS. This option is provided to allow testing against the beta release of the operating system to ensure that the new version does not interact negatively with production pipelines. To test a pipeline against the beta release of Container-Optimized OS, use the value `projects/cos-cloud/global/images/family/cos-beta`.
         */
        bootImage?: string | null;
        /**
         * The CPU platform to request. An instance based on a newer platform can be allocated, but never one with fewer capabilities. The value of this parameter must be a valid Compute Engine CPU platform name (such as "Intel Skylake"). This parameter is only useful for carefully optimized work loads where the CPU platform has a significant impact. For more information about the effect of this parameter, see https://cloud.google.com/compute/docs/instances/specify-min-cpu-platform.
         */
        cpuPlatform?: string | null;
        /**
         * The list of disks to create and attach to the VM. Specify either the `volumes[]` field or the `disks[]` field, but not both.
         */
        disks?: Schema$Disk[];
        /**
         * The Compute Engine Disk Images to use as a Docker cache. The disks will be mounted into the Docker folder in a way that the images present in the cache will not need to be pulled. The digests of the cached images must match those of the tags used or the latest version will still be pulled. The root directory of the ext4 image must contain `image` and `overlay2` directories copied from the Docker directory of a VM where the desired Docker images have already been pulled. Any images pulled that are not cached will be stored on the first cache disk instead of the boot disk. Only a single image is supported.
         */
        dockerCacheImages?: string[] | null;
        /**
         * Whether Stackdriver monitoring should be enabled on the VM.
         */
        enableStackdriverMonitoring?: boolean | null;
        /**
         * Optional set of labels to apply to the VM and any attached disk resources. These labels must adhere to the [name and value restrictions](https://cloud.google.com/compute/docs/labeling-resources) on VM labels imposed by Compute Engine. Labels keys with the prefix 'google-' are reserved for use by Google. Labels applied at creation time to the VM. Applied on a best-effort basis to attached disk resources shortly after VM creation.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Required. The machine type of the virtual machine to create. Must be the short name of a standard machine type (such as "n1-standard-1") or a custom machine type (such as "custom-1-4096", where "1" indicates the number of vCPUs and "4096" indicates the memory in MB). See [Creating an instance with a custom machine type](https://cloud.google.com/compute/docs/instances/creating-instance-with-custom-machine-type#create) for more specifications on creating a custom machine type.
         */
        machineType?: string | null;
        /**
         * The VM network configuration.
         */
        network?: Schema$Network;
        /**
         * The NVIDIA driver version to use when attaching an NVIDIA GPU accelerator. The version specified here must be compatible with the GPU libraries contained in the container being executed, and must be one of the drivers hosted in the `nvidia-drivers-us-public` bucket on Google Cloud Storage.
         */
        nvidiaDriverVersion?: string | null;
        /**
         * If true, allocate a preemptible VM.
         */
        preemptible?: boolean | null;
        /**
         * The service account to install on the VM. This account does not need any permissions other than those required by the pipeline.
         */
        serviceAccount?: Schema$ServiceAccount;
        /**
         * The list of disks and other storage to create or attach to the VM. Specify either the `volumes[]` field or the `disks[]` field, but not both.
         */
        volumes?: Schema$Volume[];
    }
    /**
     * Carries information about storage that can be attached to a VM. Specify either `Volume` or `Disk`, but not both.
     */
    interface Schema$Volume {
        /**
         * Configuration for a existing disk.
         */
        existingDisk?: Schema$ExistingDisk;
        /**
         * Configuration for an NFS mount.
         */
        nfsMount?: Schema$NFSMount;
        /**
         * Configuration for a persistent disk.
         */
        persistentDisk?: Schema$PersistentDisk;
        /**
         * A user-supplied name for the volume. Used when mounting the volume into `Actions`. The name must contain only upper and lowercase alphanumeric characters and hyphens and cannot start with a hyphen.
         */
        volume?: string | null;
    }
    /**
     * An event generated after a worker VM has been assigned to run the pipeline.
     */
    interface Schema$WorkerAssignedEvent {
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
    interface Schema$WorkerReleasedEvent {
        /**
         * The worker's instance name.
         */
        instance?: string | null;
        /**
         * The zone the worker was running in.
         */
        zone?: string | null;
    }
}
