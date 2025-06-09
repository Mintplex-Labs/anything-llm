import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace run_v1alpha1 {
    export interface Options extends GlobalOptions {
        version: 'v1alpha1';
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
     * Cloud Run Admin API
     *
     * Deploy and manage user provided container images that scale automatically based on incoming requests. The Cloud Run Admin API v1 follows the Knative Serving API specification, while v2 is aligned with Google Cloud AIP-based API standards, as described in https://google.aip.dev/.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const run = google.run('v1alpha1');
     * ```
     */
    export class Run {
        context: APIRequestContext;
        namespaces: Resource$Namespaces;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Not supported by Cloud Run ConfigMapEnvSource selects a ConfigMap to populate the environment variables with. The contents of the target ConfigMap's Data field will represent the key-value pairs as environment variables.
     */
    export interface Schema$ConfigMapEnvSource {
        /**
         * This field should not be used directly as it is meant to be inlined directly into the message. Use the "name" field instead.
         */
        localObjectReference?: Schema$LocalObjectReference;
        /**
         * The ConfigMap to select from.
         */
        name?: string | null;
        /**
         * (Optional) Specify whether the ConfigMap must be defined
         */
        optional?: boolean | null;
    }
    /**
     * Not supported by Cloud Run Selects a key from a ConfigMap.
     */
    export interface Schema$ConfigMapKeySelector {
        /**
         * The key to select.
         */
        key?: string | null;
        /**
         * This field should not be used directly as it is meant to be inlined directly into the message. Use the "name" field instead.
         */
        localObjectReference?: Schema$LocalObjectReference;
        /**
         * The ConfigMap to select from.
         */
        name?: string | null;
        /**
         * (Optional) Specify whether the ConfigMap or its key must be defined
         */
        optional?: boolean | null;
    }
    /**
     * Not supported by Cloud Run Adapts a ConfigMap into a volume. The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths.
     */
    export interface Schema$ConfigMapVolumeSource {
        /**
         * (Optional) Integer representation of mode bits to use on created files by default. Must be a value between 01 and 0777 (octal). If 0 or not set, it will default to 0644. Directories within the path are not affected by this setting. Notes * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 777 (a=rwx), set to 0777 (octal) or 511 (base-10). For chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
         */
        defaultMode?: number | null;
        /**
         * (Optional) If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified that is not present in the Secret, the volume setup will error unless it is marked optional.
         */
        items?: Schema$KeyToPath[];
        /**
         * Name of the config.
         */
        name?: string | null;
        /**
         * (Optional) Specify whether the Secret or its keys must be defined.
         */
        optional?: boolean | null;
    }
    /**
     * A single application container. This specifies both the container to run, the command to run in the container and the arguments to supply to it. Note that additional arguments may be supplied by the system to the container at runtime.
     */
    export interface Schema$Container {
        /**
         * (Optional) Arguments to the entrypoint. The docker image's CMD is used if this is not provided. Variable references $(VAR_NAME) are expanded using the container's environment. If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME). Escaped references will never be expanded, regardless of whether the variable exists or not. More info: https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#running-a-command-in-a-shell
         */
        args?: string[] | null;
        command?: string[] | null;
        /**
         * (Optional) List of environment variables to set in the container.
         */
        env?: Schema$EnvVar[];
        /**
         * (Optional) List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
         */
        envFrom?: Schema$EnvFromSource[];
        /**
         * Only supports containers from Google Container Registry or Artifact Registry URL of the Container image. More info: https://kubernetes.io/docs/concepts/containers/images
         */
        image?: string | null;
        /**
         * (Optional) Image pull policy. One of Always, Never, IfNotPresent. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise. More info: https://kubernetes.io/docs/concepts/containers/images#updating-images
         */
        imagePullPolicy?: string | null;
        /**
         * (Optional) Periodic probe of container liveness. Container will be restarted if the probe fails. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
         */
        livenessProbe?: Schema$Probe;
        /**
         * (Optional) Name of the container specified as a DNS_LABEL. Currently unused in Cloud Run. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names
         */
        name?: string | null;
        /**
         * (Optional) List of ports to expose from the container. Only a single port can be specified. The specified ports must be listening on all interfaces (0.0.0.0) within the container to be accessible. If omitted, a port number will be chosen and passed to the container through the PORT environment variable for the container to listen on.
         */
        ports?: Schema$ContainerPort[];
        /**
         * (Optional) Periodic probe of container service readiness. Container will be removed from service endpoints if the probe fails. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
         */
        readinessProbe?: Schema$Probe;
        /**
         * (Optional) Compute Resources required by this container. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#resources
         */
        resources?: Schema$ResourceRequirements;
        /**
         * (Optional) Security options the pod should run with. More info: https://kubernetes.io/docs/concepts/policy/security-context/ More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
         */
        securityContext?: Schema$SecurityContext;
        /**
         * (Optional) Startup probe of application within the container. All other probes are disabled if a startup probe is provided, until it succeeds. Container will not be added to service endpoints if the probe fails. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
         */
        startupProbe?: Schema$Probe;
        /**
         * (Optional) Path at which the file to which the container's termination message will be written is mounted into the container's filesystem. Message written is intended to be brief final status, such as an assertion failure message. Will be truncated by the node if greater than 4096 bytes. The total message length across all containers will be limited to 12kb. Defaults to /dev/termination-log.
         */
        terminationMessagePath?: string | null;
        /**
         * (Optional) Indicate how the termination message should be populated. File will use the contents of terminationMessagePath to populate the container status message on both success and failure. FallbackToLogsOnError will use the last chunk of container log output if the termination message file is empty and the container exited with an error. The log output is limited to 2048 bytes or 80 lines, whichever is smaller. Defaults to File. Cannot be updated.
         */
        terminationMessagePolicy?: string | null;
        /**
         * (Optional) Volume to mount into the container's filesystem. Only supports SecretVolumeSources. Pod volumes to mount into the container's filesystem.
         */
        volumeMounts?: Schema$VolumeMount[];
        /**
         * (Optional) Container's working directory. If not specified, the container runtime's default will be used, which might be configured in the container image.
         */
        workingDir?: string | null;
    }
    /**
     * ContainerPort represents a network port in a single container.
     */
    export interface Schema$ContainerPort {
        /**
         * (Optional) Port number the container listens on. This must be a valid port number, 0 < x < 65536.
         */
        containerPort?: number | null;
        /**
         * (Optional) If specified, used to specify which protocol to use. Allowed values are "http1" and "h2c".
         */
        name?: string | null;
        /**
         * (Optional) Protocol for port. Must be "TCP". Defaults to "TCP".
         */
        protocol?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Not supported by Cloud Run EnvFromSource represents the source of a set of ConfigMaps
     */
    export interface Schema$EnvFromSource {
        /**
         * (Optional) The ConfigMap to select from
         */
        configMapRef?: Schema$ConfigMapEnvSource;
        /**
         * (Optional) An optional identifier to prepend to each key in the ConfigMap. Must be a C_IDENTIFIER.
         */
        prefix?: string | null;
        /**
         * (Optional) The Secret to select from
         */
        secretRef?: Schema$SecretEnvSource;
    }
    /**
     * EnvVar represents an environment variable present in a Container.
     */
    export interface Schema$EnvVar {
        /**
         * Name of the environment variable. Must be a C_IDENTIFIER.
         */
        name?: string | null;
        /**
         * (Optional) Variable references $(VAR_NAME) are expanded using the previous defined environment variables in the container and any route environment variables. If a variable cannot be resolved, the reference in the input string will be unchanged. The $(VAR_NAME) syntax can be escaped with a double $$, ie: $$(VAR_NAME). Escaped references will never be expanded, regardless of whether the variable exists or not. Defaults to "".
         */
        value?: string | null;
        /**
         * (Optional) Source for the environment variable's value. Only supports secret_key_ref. Source for the environment variable's value. Cannot be used if value is not empty.
         */
        valueFrom?: Schema$EnvVarSource;
    }
    /**
     * EnvVarSource represents a source for the value of an EnvVar.
     */
    export interface Schema$EnvVarSource {
        /**
         * (Optional) Not supported by Cloud Run Selects a key of a ConfigMap.
         */
        configMapKeyRef?: Schema$ConfigMapKeySelector;
        /**
         * (Optional) Selects a key (version) of a secret in Secret Manager.
         */
        secretKeyRef?: Schema$SecretKeySelector;
    }
    /**
     * Not supported by Cloud Run ExecAction describes a "run in container" action.
     */
    export interface Schema$ExecAction {
        /**
         * (Optional) Command is the command line to execute inside the container, the working directory for the command is root ('/') in the container's filesystem. The command is simply exec'd, it is not run inside a shell, so traditional shell instructions ('|', etc) won't work. To use a shell, you need to explicitly call out to that shell. Exit status of 0 is treated as live/healthy and non-zero is unhealthy.
         */
        command?: string[] | null;
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
     * Not supported by Cloud Run GRPCAction describes an action involving a GRPC port.
     */
    export interface Schema$GRPCAction {
        /**
         * Port number of the gRPC service. Number must be in the range 1 to 65535.
         */
        port?: number | null;
        /**
         * Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md). If this is not specified, the default behavior is defined by gRPC.
         */
        service?: string | null;
    }
    /**
     * Not supported by Cloud Run HTTPGetAction describes an action based on HTTP Get requests.
     */
    export interface Schema$HTTPGetAction {
        /**
         * (Optional) Host name to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.
         */
        host?: string | null;
        /**
         * (Optional) Custom headers to set in the request. HTTP allows repeated headers.
         */
        httpHeaders?: Schema$HTTPHeader[];
        /**
         * (Optional) Path to access on the HTTP server.
         */
        path?: string | null;
        /**
         * (Optional) Scheme to use for connecting to the host. Defaults to HTTP.
         */
        scheme?: string | null;
    }
    /**
     * Not supported by Cloud Run HTTPHeader describes a custom header to be used in HTTP probes
     */
    export interface Schema$HTTPHeader {
        /**
         * The header field name
         */
        name?: string | null;
        /**
         * The header field value
         */
        value?: string | null;
    }
    /**
     * Result of an instance attempt.
     */
    export interface Schema$InstanceAttemptResult {
        /**
         * Optional. The exit code of this attempt. This may be unset if the container was unable to exit cleanly with a code due to some other failure. See status field for possible failure details.
         */
        exitCode?: number | null;
        /**
         * Optional. The status of this attempt. If the status code is OK, then the attempt succeeded.
         */
        status?: Schema$GoogleRpcStatus;
    }
    /**
     * InstanceSpec is a description of an instance.
     */
    export interface Schema$InstanceSpec {
        /**
         * Optional. Optional duration in seconds the instance may be active relative to StartTime before the system will actively try to mark it failed and kill associated containers. If set to zero, the system will never attempt to kill an instance based on time. Otherwise, value must be a positive integer. +optional
         */
        activeDeadlineSeconds?: string | null;
        /**
         * Optional. List of containers belonging to the instance. We disallow a number of fields on this Container. Only a single container may be provided.
         */
        containers?: Schema$Container[];
        /**
         * Optional. Restart policy for all containers within the instance. Allowed values are: - OnFailure: Instances will always be restarted on failure if the backoffLimit has not been reached. - Never: Instances are never restarted and all failures are permanent. Cannot be used if backoffLimit is set. +optional
         */
        restartPolicy?: string | null;
        /**
         * Optional. Email address of the IAM service account associated with the instance of a Job. The service account represents the identity of the running instance, and determines what permissions the instance has. If not provided, the instance will use the project's default service account. +optional
         */
        serviceAccountName?: string | null;
        /**
         * Optional. Optional duration in seconds the instance needs to terminate gracefully. Value must be non-negative integer. The value zero indicates delete immediately. The grace period is the duration in seconds after the processes running in the instance are sent a termination signal and the time when the processes are forcibly halted with a kill signal. Set this value longer than the expected cleanup time for your process. +optional
         */
        terminationGracePeriodSeconds?: string | null;
        /**
         * Optional. List of volumes that can be mounted by containers belonging to the instance. More info: https://kubernetes.io/docs/concepts/storage/volumes +optional
         */
        volumes?: Schema$Volume[];
    }
    /**
     * Instance represents the status of an instance of a Job.
     */
    export interface Schema$InstanceStatus {
        /**
         * Optional. Represents time when the instance was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. +optional
         */
        completionTime?: string | null;
        /**
         * Optional. The number of times this instance exited with code \> 0; +optional
         */
        failed?: number | null;
        /**
         * Required. Index of the instance, unique per Job, and beginning at 0.
         */
        index?: number | null;
        /**
         * Optional. Result of the last attempt of this instance. +optional
         */
        lastAttemptResult?: Schema$InstanceAttemptResult;
        /**
         * Optional. Last exit code seen for this instance. +optional
         */
        lastExitCode?: number | null;
        /**
         * Optional. The number of times this instance was restarted. Instances are restarted according the restartPolicy configured in the Job template. +optional
         */
        restarted?: number | null;
        /**
         * Optional. Represents time when the instance was created by the job controller. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. +optional
         */
        startTime?: string | null;
        /**
         * Optional. The number of times this instance exited with code == 0. +optional
         */
        succeeded?: number | null;
    }
    /**
     * InstanceTemplateSpec describes the data an instance should have when created from a template.
     */
    export interface Schema$InstanceTemplateSpec {
        /**
         * Optional. Specification of the desired behavior of the instance. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status +optional
         */
        spec?: Schema$InstanceSpec;
    }
    /**
     * Job represents the configuration of a single job. A job an immutable resource that references a container image which is run to completion.
     */
    export interface Schema$Job {
        /**
         * Optional. APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources +optional
         */
        apiVersion?: string | null;
        /**
         * Optional. Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds +optional
         */
        kind?: string | null;
        /**
         * Optional. Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata +optional
         */
        metadata?: Schema$ObjectMeta;
        /**
         * Optional. Specification of the desired behavior of a job. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status +optional
         */
        spec?: Schema$JobSpec;
        /**
         * Optional. Current status of a job. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status +optional
         */
        status?: Schema$JobStatus;
    }
    /**
     * JobCondition defines a readiness condition for a Revision.
     */
    export interface Schema$JobCondition {
        /**
         * Optional. Last time the condition transitioned from one status to another.
         */
        lastTransitionTime?: string | null;
        /**
         * Optional. Human readable message indicating details about the current status.
         */
        message?: string | null;
        /**
         * Optional. One-word CamelCase reason for the condition's last transition.
         */
        reason?: string | null;
        /**
         * Optional. How to interpret failures of this condition, one of Error, Warning, Info
         */
        severity?: string | null;
        /**
         * Required. Status of the condition, one of True, False, Unknown.
         */
        status?: string | null;
        /**
         * Required. Type is used to communicate the status of the reconciliation process. See also: https://github.com/knative/serving/blob/main/docs/spec/errors.md#error-conditions-and-reporting Types include: * "Completed": True when the Job has successfully completed. * "Started": True when the Job has successfully started running. * "ResourcesAvailable": True when underlying resources have been provisioned.
         */
        type?: string | null;
    }
    /**
     * JobSpec describes how the job execution will look like.
     */
    export interface Schema$JobSpec {
        /**
         * Optional. Not supported. Specifies the duration in seconds relative to the startTime that the job may be active before the system tries to terminate it. If set to zero, the system will never attempt to terminate the job based on time. Otherwise, the value must be positive integer. +optional
         */
        activeDeadlineSeconds?: string | null;
        /**
         * Optional. Specifies the number of retries per instance, before marking this job failed. If set to zero, instances will never retry on failure. +optional
         */
        backoffLimit?: number | null;
        /**
         * Optional. Specifies the desired number of successfully finished instances the job should be run with. Setting to 1 means that parallelism is limited to 1 and the success of that instance signals the success of the job. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ +optional
         */
        completions?: number | null;
        /**
         * Optional. Specifies the maximum desired number of instances the job should run at any given time. Must be <= completions. The actual number of instances running in steady state will be less than this number when ((.spec.completions - .status.successful) < .spec.parallelism), i.e. when the work left to do is less than max parallelism. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ +optional
         */
        parallelism?: number | null;
        /**
         * Optional. Describes the instance that will be created when executing a job.
         */
        template?: Schema$InstanceTemplateSpec;
        /**
         * Optional. Not supported. ttlSecondsAfterFinished limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted. When the Job is being deleted, its lifecycle guarantees (e.g. finalizers) will be honored. If this field is set to zero, the Job won't be automatically deleted. +optional
         */
        ttlSecondsAfterFinished?: number | null;
    }
    /**
     * JobStatus represents the current state of a Job.
     */
    export interface Schema$JobStatus {
        /**
         * Optional. The number of actively running instances. +optional
         */
        active?: number | null;
        /**
         * Optional. Represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. +optional
         */
        completionTime?: string | null;
        /**
         * Optional. The latest available observations of a job's current state. More info: https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/ +optional
         */
        conditions?: Schema$JobCondition[];
        /**
         * Optional. The number of instances which reached phase Failed. +optional
         */
        failed?: number | null;
        /**
         * Optional. ImageDigest holds the resolved digest for the image specified within .Spec.Template.Spec.Container.Image. The digest is resolved during the creation of the Job. This field holds the digest value regardless of whether a tag or digest was originally specified in the Container object.
         */
        imageDigest?: string | null;
        /**
         * Optional. Status of completed, failed, and running instances. +optional
         */
        instances?: Schema$InstanceStatus[];
        /**
         * Optional. The 'generation' of the job that was last processed by the controller.
         */
        observedGeneration?: number | null;
        /**
         * Optional. Represents time when the job was acknowledged by the job controller. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC. +optional
         */
        startTime?: string | null;
        /**
         * Optional. The number of instances which reached phase Succeeded. +optional
         */
        succeeded?: number | null;
    }
    /**
     * Maps a string key to a path within a volume.
     */
    export interface Schema$KeyToPath {
        /**
         * The Cloud Secret Manager secret version. Can be 'latest' for the latest value or an integer for a specific version. The key to project.
         */
        key?: string | null;
        /**
         * (Optional) Mode bits to use on this file, must be a value between 01 and 0777 (octal). If 0 or not set, the Volume's default mode will be used. Notes * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 777 (a=rwx), set to 0777 (octal) or 511 (base-10). For chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
         */
        mode?: number | null;
        /**
         * The relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.
         */
        path?: string | null;
    }
    /**
     * ListJobsResponse is a list of Jobs resources.
     */
    export interface Schema$ListJobsResponse {
        /**
         * The API version for this call such as "run.googleapis.com/v1alpha1".
         */
        apiVersion?: string | null;
        /**
         * List of Jobs.
         */
        items?: Schema$Job[];
        /**
         * The kind of this resource, in this case "JobsList".
         */
        kind?: string | null;
        /**
         * Metadata associated with this jobs list.
         */
        metadata?: Schema$ListMeta;
        /**
         * This field is equivalent to the metadata.continue field and is provided as a convenience for compatibility with https://google.aip.dev/158. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a list may not be possible if the server configuration has changed or more than a few minutes have passed. The metadata.resourceVersion field returned when using this field will be identical to the value in the first response.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta\}.
     */
    export interface Schema$ListMeta {
        /**
         * continue may be set if the user set a limit on the number of items returned, and indicates that the server has more data available. The value is opaque and may be used to issue another request to the endpoint that served this list to retrieve the next set of available objects. Continuing a list may not be possible if the server configuration has changed or more than a few minutes have passed. The resourceVersion field returned when using this continue value will be identical to the value in the first response.
         */
        continue?: string | null;
        /**
         * String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#concurrency-control-and-consistency +optional
         */
        resourceVersion?: string | null;
        /**
         * SelfLink is a URL representing this object. Populated by the system. Read-only. +optional
         */
        selfLink?: string | null;
    }
    /**
     * Not supported by Cloud Run LocalObjectReference contains enough information to let you locate the referenced object inside the same namespace.
     */
    export interface Schema$LocalObjectReference {
        /**
         * (Optional) Name of the referent. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
         */
        name?: string | null;
    }
    /**
     * k8s.io.apimachinery.pkg.apis.meta.v1.ObjectMeta is metadata that all persisted resources must have, which includes all objects users must create.
     */
    export interface Schema$ObjectMeta {
        /**
         * (Optional) Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects. More info: https://kubernetes.io/docs/user-guide/annotations
         */
        annotations?: {
            [key: string]: string;
        } | null;
        /**
         * (Optional) Not supported by Cloud Run The name of the cluster which the object belongs to. This is used to distinguish resources with same name and namespace in different clusters. This field is not set anywhere right now and apiserver is going to ignore it if set in create or update request.
         */
        clusterName?: string | null;
        /**
         * (Optional) CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC. Populated by the system. Read-only. Null for lists. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
         */
        creationTimestamp?: string | null;
        /**
         * (Optional) Not supported by Cloud Run Number of seconds allowed for this object to gracefully terminate before it will be removed from the system. Only set when deletionTimestamp is also set. May only be shortened. Read-only.
         */
        deletionGracePeriodSeconds?: number | null;
        /**
         * (Optional) Not supported by Cloud Run DeletionTimestamp is RFC 3339 date and time at which this resource will be deleted. This field is set by the server when a graceful deletion is requested by the user, and is not directly settable by a client. The resource is expected to be deleted (no longer visible from resource lists, and not reachable by name) after the time in this field, once the finalizers list is empty. As long as the finalizers list contains items, deletion is blocked. Once the deletionTimestamp is set, this value may not be unset or be set further into the future, although it may be shortened or the resource may be deleted prior to this time. For example, a user may request that a pod is deleted in 30 seconds. The Kubelet will react by sending a graceful termination signal to the containers in the pod. After that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL) to the container and after cleanup, remove the pod from the API. In the presence of network partitions, this object may still exist after this timestamp, until an administrator or automated process can determine the resource is fully terminated. If not set, graceful deletion of the object has not been requested. Populated by the system when a graceful deletion is requested. Read-only. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#metadata
         */
        deletionTimestamp?: string | null;
        /**
         * (Optional) Not supported by Cloud Run Must be empty before the object is deleted from the registry. Each entry is an identifier for the responsible component that will remove the entry from the list. If the deletionTimestamp of the object is non-nil, entries in this list can only be removed. +patchStrategy=merge
         */
        finalizers?: string[] | null;
        /**
         * (Optional) Not supported by Cloud Run GenerateName is an optional prefix, used by the server, to generate a unique name ONLY IF the Name field has not been provided. If this field is used, the name returned to the client will be different than the name passed. This value will also be combined with a unique suffix. The provided value has the same validation rules as the Name field, and may be truncated by the length of the suffix required to make the value unique on the server. If this field is specified and the generated name exists, the server will NOT return a 409 - instead, it will either return 201 Created or 500 with Reason ServerTimeout indicating a unique name could not be found in the time allotted, and the client should retry (optionally after the time indicated in the Retry-After header). Applied only if Name is not specified. More info: https://git.k8s.io/community/contributors/devel/api-conventions.md#idempotency string generateName = 2;
         */
        generateName?: string | null;
        /**
         * (Optional) A sequence number representing a specific generation of the desired state. Populated by the system. Read-only.
         */
        generation?: number | null;
        /**
         * (Optional) Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and routes. More info: https://kubernetes.io/docs/user-guide/labels
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Name must be unique within a namespace, within a Cloud Run region. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated. More info: https://kubernetes.io/docs/user-guide/identifiers#names +optional
         */
        name?: string | null;
        /**
         * Namespace defines the space within each name must be unique, within a Cloud Run region. In Cloud Run the namespace must be equal to either the project ID or project number.
         */
        namespace?: string | null;
        /**
         * (Optional) Not supported by Cloud Run List of objects that own this object. If ALL objects in the list have been deleted, this object will be garbage collected.
         */
        ownerReferences?: Schema$OwnerReference[];
        /**
         * Optional. An opaque value that represents the internal version of this object that can be used by clients to determine when objects have changed. May be used for optimistic concurrency, change detection, and the watch operation on a resource or set of resources. Clients must treat these values as opaque and passed unmodified back to the server or omit the value to disable conflict-detection. They may only be valid for a particular resource or set of resources. Populated by the system. Read-only. Value must be treated as opaque by clients or omitted. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency
         */
        resourceVersion?: string | null;
        /**
         * (Optional) SelfLink is a URL representing this object. Populated by the system. Read-only. string selfLink = 4;
         */
        selfLink?: string | null;
        /**
         * (Optional) UID is the unique in time and space value for this object. It is typically generated by the server on successful creation of a resource and is not allowed to change on PUT operations. Populated by the system. Read-only. More info: https://kubernetes.io/docs/user-guide/identifiers#uids
         */
        uid?: string | null;
    }
    /**
     * OwnerReference contains enough information to let you identify an owning object. Currently, an owning object must be in the same namespace, so there is no namespace field.
     */
    export interface Schema$OwnerReference {
        /**
         * API version of the referent.
         */
        apiVersion?: string | null;
        /**
         * If true, AND if the owner has the "foregroundDeletion" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed. Defaults to false. To set this field, a user needs "delete" permission of the owner, otherwise 422 (Unprocessable Entity) will be returned. +optional
         */
        blockOwnerDeletion?: boolean | null;
        /**
         * If true, this reference points to the managing controller. +optional
         */
        controller?: boolean | null;
        /**
         * Kind of the referent. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
         */
        kind?: string | null;
        /**
         * Name of the referent. More info: https://kubernetes.io/docs/user-guide/identifiers#names
         */
        name?: string | null;
        /**
         * UID of the referent. More info: https://kubernetes.io/docs/user-guide/identifiers#uids
         */
        uid?: string | null;
    }
    /**
     * Not supported by Cloud Run Probe describes a health check to be performed against a container to determine whether it is alive or ready to receive traffic.
     */
    export interface Schema$Probe {
        /**
         * (Optional) Not supported by Cloud Run One and only one of the following should be specified. Exec specifies the action to take. A field inlined from the Handler message.
         */
        exec?: Schema$ExecAction;
        /**
         * (Optional) Minimum consecutive failures for the probe to be considered failed after having succeeded. Defaults to 3. Minimum value is 1.
         */
        failureThreshold?: number | null;
        /**
         * (Optional) GRPCAction specifies an action involving a GRPC port. A field inlined from the Handler message.
         */
        grpc?: Schema$GRPCAction;
        /**
         * (Optional) HTTPGet specifies the http request to perform. A field inlined from the Handler message.
         */
        httpGet?: Schema$HTTPGetAction;
        /**
         * (Optional) Number of seconds after the container has started before the probe is initiated. Defaults to 0 seconds. Minimum value is 0. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
         */
        initialDelaySeconds?: number | null;
        /**
         * (Optional) How often (in seconds) to perform the probe. Default to 10 seconds. Minimum value is 1. Maximum value for liveness probe is 3600. Maximum value for startup probe is 240. Must be greater or equal than timeout_seconds.
         */
        periodSeconds?: number | null;
        /**
         * (Optional) Minimum consecutive successes for the probe to be considered successful after having failed. Must be 1 if set.
         */
        successThreshold?: number | null;
        /**
         * (Optional) TCPSocket specifies an action involving a TCP port. TCP hooks not yet supported A field inlined from the Handler message.
         */
        tcpSocket?: Schema$TCPSocketAction;
        /**
         * (Optional) Number of seconds after which the probe times out. Defaults to 1 second. Minimum value is 1. Maximum value is 3600. Must be smaller than period_seconds. More info: https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
         */
        timeoutSeconds?: number | null;
    }
    /**
     * ResourceRequirements describes the compute resource requirements.
     */
    export interface Schema$ResourceRequirements {
        /**
         * (Optional) Only memory and CPU are supported. Limits describes the maximum amount of compute resources allowed. The values of the map is string form of the 'quantity' k8s type: https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apimachinery/pkg/api/resource/quantity.go
         */
        limits?: {
            [key: string]: string;
        } | null;
        /**
         * (Optional) Only memory and CPU are supported. Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. The values of the map is string form of the 'quantity' k8s type: https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apimachinery/pkg/api/resource/quantity.go
         */
        requests?: {
            [key: string]: string;
        } | null;
    }
    /**
     * Not supported by Cloud Run SecretEnvSource selects a Secret to populate the environment variables with. The contents of the target Secret's Data field will represent the key-value pairs as environment variables.
     */
    export interface Schema$SecretEnvSource {
        /**
         * This field should not be used directly as it is meant to be inlined directly into the message. Use the "name" field instead.
         */
        localObjectReference?: Schema$LocalObjectReference;
        /**
         * The Secret to select from.
         */
        name?: string | null;
        /**
         * (Optional) Specify whether the Secret must be defined
         */
        optional?: boolean | null;
    }
    /**
     * SecretKeySelector selects a key of a Secret.
     */
    export interface Schema$SecretKeySelector {
        /**
         * A Cloud Secret Manager secret version. Must be 'latest' for the latest version or an integer for a specific version. The key of the secret to select from. Must be a valid secret key.
         */
        key?: string | null;
        /**
         * This field should not be used directly as it is meant to be inlined directly into the message. Use the "name" field instead.
         */
        localObjectReference?: Schema$LocalObjectReference;
        /**
         * The name of the secret in Cloud Secret Manager. By default, the secret is assumed to be in the same project. If the secret is in another project, you must define an alias. An alias definition has the form: :projects//secrets/. If multiple alias definitions are needed, they must be separated by commas. The alias definitions must be set on the run.googleapis.com/secrets annotation. The name of the secret in the pod's namespace to select from.
         */
        name?: string | null;
        /**
         * (Optional) Specify whether the Secret or its key must be defined
         */
        optional?: boolean | null;
    }
    /**
     * The secret's value will be presented as the content of a file whose name is defined in the item path. If no items are defined, the name of the file is the secret_name. The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names.
     */
    export interface Schema$SecretVolumeSource {
        /**
         * Integer representation of mode bits to use on created files by default. Must be a value between 01 and 0777 (octal). If 0 or not set, it will default to 0644. Directories within the path are not affected by this setting. Notes * Internally, a umask of 0222 will be applied to any non-zero value. * This is an integer representation of the mode bits. So, the octal integer value should look exactly as the chmod numeric notation with a leading zero. Some examples: for chmod 777 (a=rwx), set to 0777 (octal) or 511 (base-10). For chmod 640 (u=rw,g=r), set to 0640 (octal) or 416 (base-10). For chmod 755 (u=rwx,g=rx,o=rx), set to 0755 (octal) or 493 (base-10). * This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
         */
        defaultMode?: number | null;
        /**
         * (Optional) If unspecified, the volume will expose a file whose name is the secret_name. If specified, the key will be used as the version to fetch from Cloud Secret Manager and the path will be the name of the file exposed in the volume. When items are defined, they must specify a key and a path. If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified that is not present in the Secret, the volume setup will error unless it is marked optional.
         */
        items?: Schema$KeyToPath[];
        /**
         * (Optional) Specify whether the Secret or its keys must be defined.
         */
        optional?: boolean | null;
        /**
         * The name of the secret in Cloud Secret Manager. By default, the secret is assumed to be in the same project. If the secret is in another project, you must define an alias. An alias definition has the form: :projects//secrets/. If multiple alias definitions are needed, they must be separated by commas. The alias definitions must be set on the run.googleapis.com/secrets annotation. Name of the secret in the container's namespace to use.
         */
        secretName?: string | null;
    }
    /**
     * Not supported by Cloud Run SecurityContext holds security configuration that will be applied to a container. Some fields are present in both SecurityContext and PodSecurityContext. When both are set, the values in SecurityContext take precedence.
     */
    export interface Schema$SecurityContext {
        /**
         * (Optional) The UID to run the entrypoint of the container process. Defaults to user specified in image metadata if unspecified. May also be set in PodSecurityContext. If set in both SecurityContext and PodSecurityContext, the value specified in SecurityContext takes precedence.
         */
        runAsUser?: number | null;
    }
    /**
     * Not supported by Cloud Run TCPSocketAction describes an action based on opening a socket
     */
    export interface Schema$TCPSocketAction {
        /**
         * (Optional) Optional: Host name to connect to, defaults to the pod IP.
         */
        host?: string | null;
        /**
         * Number or name of the port to access on the container. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. This field is currently limited to integer types only because of proto's inability to properly support the IntOrString golang type.
         */
        port?: number | null;
    }
    /**
     * Volume represents a named volume in a container.
     */
    export interface Schema$Volume {
        configMap?: Schema$ConfigMapVolumeSource;
        /**
         * Volume's name. In Cloud Run Fully Managed, the name 'cloudsql' is reserved.
         */
        name?: string | null;
        secret?: Schema$SecretVolumeSource;
    }
    /**
     * VolumeMount describes a mounting of a Volume within a container.
     */
    export interface Schema$VolumeMount {
        /**
         * Path within the container at which the volume should be mounted. Must not contain ':'.
         */
        mountPath?: string | null;
        /**
         * The name of the volume. There must be a corresponding Volume with the same name.
         */
        name?: string | null;
        /**
         * (Optional) Only true is accepted. Defaults to true.
         */
        readOnly?: boolean | null;
        /**
         * (Optional) Path within the volume from which the container's volume should be mounted. Defaults to "" (volume's root).
         */
        subPath?: string | null;
    }
    export class Resource$Namespaces {
        context: APIRequestContext;
        jobs: Resource$Namespaces$Jobs;
        constructor(context: APIRequestContext);
    }
    export class Resource$Namespaces$Jobs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a job.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1alpha1');
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
         *   const res = await run.namespaces.jobs.create({
         *     // Required. The namespace in which the job should be created. Replace {namespace_id\} with the project ID or number.
         *     parent: 'namespaces/my-namespace',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "apiVersion": "my_apiVersion",
         *       //   "kind": "my_kind",
         *       //   "metadata": {},
         *       //   "spec": {},
         *       //   "status": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "spec": {},
         *   //   "status": {}
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
        create(params: Params$Resource$Namespaces$Jobs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Namespaces$Jobs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        create(params: Params$Resource$Namespaces$Jobs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Namespaces$Jobs$Create, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        create(params: Params$Resource$Namespaces$Jobs$Create, callback: BodyResponseCallback<Schema$Job>): void;
        create(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * Delete a job.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1alpha1');
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
         *   const res = await run.namespaces.jobs.delete({
         *     // Optional. Cloud Run currently ignores this parameter.
         *     apiVersion: 'placeholder-value',
         *     // Optional. Cloud Run currently ignores this parameter.
         *     kind: 'placeholder-value',
         *     // Required. The name of the job to delete. For Cloud Run (fully managed), replace {namespace_id\} with the project ID or number.
         *     name: 'namespaces/my-namespace/jobs/my-job',
         *     // Optional. Specifies the propagation policy of delete. Cloud Run currently ignores this setting, and deletes in the background. Please see kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/ for more information.
         *     propagationPolicy: 'placeholder-value',
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
        delete(params: Params$Resource$Namespaces$Jobs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Namespaces$Jobs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Namespaces$Jobs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Namespaces$Jobs$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Namespaces$Jobs$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Get information about a job.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1alpha1');
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
         *   const res = await run.namespaces.jobs.get({
         *     // Required. The name of the job to retrieve. For Cloud Run (fully managed), replace {namespace_id\} with the project ID or number.
         *     name: 'namespaces/my-namespace/jobs/my-job',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "spec": {},
         *   //   "status": {}
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
        get(params: Params$Resource$Namespaces$Jobs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Namespaces$Jobs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Job>>;
        get(params: Params$Resource$Namespaces$Jobs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Namespaces$Jobs$Get, options: MethodOptions | BodyResponseCallback<Schema$Job>, callback: BodyResponseCallback<Schema$Job>): void;
        get(params: Params$Resource$Namespaces$Jobs$Get, callback: BodyResponseCallback<Schema$Job>): void;
        get(callback: BodyResponseCallback<Schema$Job>): void;
        /**
         * List jobs.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/run.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const run = google.run('v1alpha1');
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
         *   const res = await run.namespaces.jobs.list({
         *     // Optional. Optional encoded string to continue paging.
         *     continue: 'placeholder-value',
         *     // Optional. Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         *     fieldSelector: 'placeholder-value',
         *     // Optional. Not currently used by Cloud Run.
         *     includeUninitialized: 'placeholder-value',
         *     // Optional. Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         *     labelSelector: 'placeholder-value',
         *     // Optional. The maximum number of records that should be returned.
         *     limit: 'placeholder-value',
         *     // Required. The namespace from which the jobs should be listed. Replace {namespace_id\} with the project ID or number.
         *     parent: 'namespaces/my-namespace',
         *     // Optional. The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         *     resourceVersion: 'placeholder-value',
         *     // Optional. Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         *     watch: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "apiVersion": "my_apiVersion",
         *   //   "items": [],
         *   //   "kind": "my_kind",
         *   //   "metadata": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "unreachable": []
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
        list(params: Params$Resource$Namespaces$Jobs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Namespaces$Jobs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListJobsResponse>>;
        list(params: Params$Resource$Namespaces$Jobs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Namespaces$Jobs$List, options: MethodOptions | BodyResponseCallback<Schema$ListJobsResponse>, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(params: Params$Resource$Namespaces$Jobs$List, callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListJobsResponse>): void;
    }
    export interface Params$Resource$Namespaces$Jobs$Create extends StandardParameters {
        /**
         * Required. The namespace in which the job should be created. Replace {namespace_id\} with the project ID or number.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Job;
    }
    export interface Params$Resource$Namespaces$Jobs$Delete extends StandardParameters {
        /**
         * Optional. Cloud Run currently ignores this parameter.
         */
        apiVersion?: string;
        /**
         * Optional. Cloud Run currently ignores this parameter.
         */
        kind?: string;
        /**
         * Required. The name of the job to delete. For Cloud Run (fully managed), replace {namespace_id\} with the project ID or number.
         */
        name?: string;
        /**
         * Optional. Specifies the propagation policy of delete. Cloud Run currently ignores this setting, and deletes in the background. Please see kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/ for more information.
         */
        propagationPolicy?: string;
    }
    export interface Params$Resource$Namespaces$Jobs$Get extends StandardParameters {
        /**
         * Required. The name of the job to retrieve. For Cloud Run (fully managed), replace {namespace_id\} with the project ID or number.
         */
        name?: string;
    }
    export interface Params$Resource$Namespaces$Jobs$List extends StandardParameters {
        /**
         * Optional. Optional encoded string to continue paging.
         */
        continue?: string;
        /**
         * Optional. Allows to filter resources based on a specific value for a field name. Send this in a query string format. i.e. 'metadata.name%3Dlorem'. Not currently used by Cloud Run.
         */
        fieldSelector?: string;
        /**
         * Optional. Not currently used by Cloud Run.
         */
        includeUninitialized?: boolean;
        /**
         * Optional. Allows to filter resources based on a label. Supported operations are =, !=, exists, in, and notIn.
         */
        labelSelector?: string;
        /**
         * Optional. The maximum number of records that should be returned.
         */
        limit?: number;
        /**
         * Required. The namespace from which the jobs should be listed. Replace {namespace_id\} with the project ID or number.
         */
        parent?: string;
        /**
         * Optional. The baseline resource version from which the list or watch operation should start. Not currently used by Cloud Run.
         */
        resourceVersion?: string;
        /**
         * Optional. Flag that indicates that the client expects to watch this resource as well. Not currently used by Cloud Run.
         */
        watch?: boolean;
    }
    export {};
}
