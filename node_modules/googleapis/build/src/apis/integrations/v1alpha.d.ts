import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace integrations_v1alpha {
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
     * Application Integration API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const integrations = google.integrations('v1alpha');
     * ```
     */
    export class Integrations {
        context: APIRequestContext;
        callback: Resource$Callback;
        connectorPlatformRegions: Resource$Connectorplatformregions;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Registered ids for errors, as "oneof" enums. Each task or logical grouping of tasks may share the same enum.
     */
    export interface Schema$CrmlogErrorCode {
        commonErrorCode?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusAuthconfigAuthConfigTaskParam {
        /**
         * Defines the credential types to be supported as Task may restrict specific types to use, e.g. Cloud SQL Task will use username/password type only.
         */
        allowedCredentialTypes?: string[] | null;
        allowedServiceAccountInContext?: boolean | null;
        /**
         * UUID of the AuthConfig.
         */
        authConfigId?: string | null;
        /**
         * A space-delimited list of requested scope permissions.
         */
        scope?: string | null;
        useServiceAccountInContext?: boolean | null;
    }
    /**
     * Email address along with optional name and tokens. These tokens will be substituted for the variables in the form of [{var_name\}], where var_name could be any string of no more than 32 bytes.
     */
    export interface Schema$EnterpriseCrmEventbusProtoAddress {
        /**
         * Required.
         */
        email?: string | null;
        name?: string | null;
        tokens?: Schema$EnterpriseCrmEventbusProtoToken[];
    }
    /**
     * Attributes are additional options that can be associated with each event property. For more information, see
     */
    export interface Schema$EnterpriseCrmEventbusProtoAttributes {
        /**
         * Things like URL, Email, Currency, Timestamp (rather than string, int64...)
         */
        dataType?: string | null;
        /**
         * Used to define defaults.
         */
        defaultValue?: Schema$EnterpriseCrmEventbusProtoValueType;
        /**
         * Required for event execution. The validation will be done by the event bus when the event is triggered.
         */
        isRequired?: boolean | null;
        /**
         * Used to indicate if a ParameterEntry should be converted to ParamIndexes for ST-Spanner full-text search. DEPRECATED: use searchable.
         */
        isSearchable?: boolean | null;
        /**
         * See
         */
        logSettings?: Schema$EnterpriseCrmEventbusProtoLogSettings;
        searchable?: string | null;
        /**
         * List of tasks that can view this property, if empty then all.
         */
        taskVisibility?: string[] | null;
    }
    /**
     * List of error enums for alerts.
     */
    export interface Schema$EnterpriseCrmEventbusProtoBaseAlertConfigErrorEnumList {
        enumStrings?: string[] | null;
        filterType?: string | null;
    }
    /**
     * The threshold value of the metric, above or below which the alert should be triggered. See EventAlertConfig or TaskAlertConfig for the different alert metric types in each case. For the *RATE metrics, one or both of these fields may be set. Zero is the default value and can be left at that. For *PERCENTILE_DURATION metrics, one or both of these fields may be set, and also, the duration threshold value should be specified in the threshold_duration_ms member below. For *AVERAGE_DURATION metrics, these fields should not be set at all. A different member, threshold_duration_ms, must be set in the EventAlertConfig or the TaskAlertConfig.
     */
    export interface Schema$EnterpriseCrmEventbusProtoBaseAlertConfigThresholdValue {
        absolute?: string | null;
        percentage?: number | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBaseFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBaseValue {
        /**
         * Start with a function that does not build on existing values. Eg. CurrentTime, Min, Max, Exists, etc.
         */
        baseFunction?: Schema$EnterpriseCrmEventbusProtoFunction;
        /**
         * Start with a literal value.
         */
        literalValue?: Schema$EnterpriseCrmEventbusProtoParameterValueType;
        /**
         * Start with a reference value to dereference.
         */
        referenceValue?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBooleanArrayFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBooleanFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBooleanParameterArray {
        booleanValues?: boolean[] | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoBuganizerNotification {
        /**
         * Whom to assign the new bug. Optional.
         */
        assigneeEmailAddress?: string | null;
        /**
         * ID of the buganizer component within which to create a new issue. Required.
         */
        componentId?: string | null;
        /**
         * ID of the buganizer template to use. Optional.
         */
        templateId?: string | null;
        /**
         * Title of the issue to be created. Required.
         */
        title?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoCloudKmsConfig {
        /**
         * Optional. The id of GCP project where the KMS key is stored. If not provided, assume the key is stored in the same GCP project defined in Client (tag 14).
         */
        gcpProjectId?: string | null;
        /**
         * A Cloud KMS key is a named object containing one or more key versions, along with metadata for the key. A key exists on exactly one key ring tied to a specific location.
         */
        keyName?: string | null;
        /**
         * A key ring organizes keys in a specific Google Cloud location and allows you to manage access control on groups of keys. A key ring's name does not need to be unique across a Google Cloud project, but must be unique within a given location.
         */
        keyRingName?: string | null;
        /**
         * Optional. Each version of a key contains key material used for encryption or signing. A key's version is represented by an integer, starting at 1. To decrypt data or verify a signature, you must use the same key version that was used to encrypt or sign the data.
         */
        keyVersionName?: string | null;
        /**
         * Location name of the key ring, e.g. "us-west1".
         */
        locationName?: string | null;
    }
    /**
     * Cloud Scheduler Trigger configuration
     */
    export interface Schema$EnterpriseCrmEventbusProtoCloudSchedulerConfig {
        /**
         * Required. The cron tab of cloud scheduler trigger.
         */
        cronTab?: string | null;
        /**
         * Optional. When the job was deleted from Pantheon UI, error_message will be populated when Get/List integrations
         */
        errorMessage?: string | null;
        /**
         * Required. The location where associated cloud scheduler job will be created
         */
        location?: string | null;
        /**
         * Required. Service account used by Cloud Scheduler to trigger the integration at scheduled time
         */
        serviceAccountEmail?: string | null;
    }
    /**
     * This message recursively combines constituent conditions using logical AND.
     */
    export interface Schema$EnterpriseCrmEventbusProtoCombinedCondition {
        /**
         * A set of individual constituent conditions.
         */
        conditions?: Schema$EnterpriseCrmEventbusProtoCondition[];
    }
    /**
     * Condition that uses `operator` to evaluate the key against the value.
     */
    export interface Schema$EnterpriseCrmEventbusProtoCondition {
        /**
         * Key that's evaluated against the `value`. Please note the data type of the runtime value associated with the key should match the data type of `value`, else an IllegalArgumentException is thrown.
         */
        eventPropertyKey?: string | null;
        /**
         * Operator used to evaluate the condition. Please note that an operator with an inappropriate key/value operand will result in IllegalArgumentException, e.g. CONTAINS with boolean key/value pair.
         */
        operator?: string | null;
        /**
         * Value that's checked for the key.
         */
        value?: Schema$EnterpriseCrmEventbusProtoValueType;
    }
    /**
     * Contains the combined condition calculation results.
     */
    export interface Schema$EnterpriseCrmEventbusProtoConditionResult {
        /**
         * the current task number.
         */
        currentTaskNumber?: string | null;
        /**
         * the next task number.
         */
        nextTaskNumber?: string | null;
        /**
         * the result comes out after evaluate the combined condition. True if there's no combined condition specified.
         */
        result?: boolean | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoConnectorsConnection {
        /**
         * Connection name Format: projects/{project\}/locations/{location\}/connections/{connection\}
         */
        connectionName?: string | null;
        /**
         * Connector version Format: projects/{project\}/locations/{location\}/providers/{provider\}/connectors/{connector\}/versions/{version\}
         */
        connectorVersion?: string | null;
        /**
         * Service name Format: projects/{project\}/locations/{location\}/namespaces/{namespace\}/services/{service\}
         */
        serviceName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoConnectorsGenericConnectorTaskConfig {
        /**
         * User-selected connection.
         */
        connection?: Schema$EnterpriseCrmEventbusProtoConnectorsConnection;
        /**
         * Operation to perform using the configured connection.
         */
        operation?: string | null;
    }
    /**
     * Represents two-dimensional positions.
     */
    export interface Schema$EnterpriseCrmEventbusProtoCoordinate {
        x?: number | null;
        y?: number | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoCustomSuspensionRequest {
        /**
         * Request to fire an event containing the SuspensionInfo message.
         */
        postToQueueWithTriggerIdRequest?: Schema$GoogleInternalCloudCrmEventbusV3PostToQueueWithTriggerIdRequest;
        /**
         * In the fired event, set the SuspensionInfo message as the value for this key.
         */
        suspensionInfoEventParameterKey?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoDoubleArray {
        values?: number[] | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoDoubleArrayFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoDoubleFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoDoubleParameterArray {
        doubleValues?: number[] | null;
    }
    /**
     * An error, warning, or information message associated with a workflow.
     */
    export interface Schema$EnterpriseCrmEventbusProtoErrorDetail {
        /**
         * The associated error-code, which can be a common or internal code.
         */
        errorCode?: Schema$CrmlogErrorCode;
        /**
         * The full text of the error message, including any parameters that were thrown along with the exception.
         */
        errorMessage?: string | null;
        /**
         * The severity of the error: ERROR|WARN|INFO.
         */
        severity?: string | null;
        /**
         * The task try-number, in which, the error occurred. If zero, the error happened at the event level.
         */
        taskNumber?: number | null;
    }
    /**
     * LINT.IfChange This message is used for storing key value pair properties for each Event / Task in the EventBus.
     */
    export interface Schema$EnterpriseCrmEventbusProtoEventBusProperties {
        /**
         * An unordered list of property entries.
         */
        properties?: Schema$EnterpriseCrmEventbusProtoPropertyEntry[];
    }
    /**
     * Contains the details of the execution info of this event: this includes the tasks execution details plus the event execution statistics. Next available id: 10
     */
    export interface Schema$EnterpriseCrmEventbusProtoEventExecutionDetails {
        eventAttemptStats?: Schema$EnterpriseCrmEventbusProtoEventExecutionDetailsEventAttemptStats[];
        eventExecutionSnapshot?: Schema$EnterpriseCrmEventbusProtoEventExecutionSnapshot[];
        eventExecutionState?: string | null;
        /**
         * Indicates the number of times the execution has restarted from the beginning.
         */
        eventRetriesFromBeginningCount?: number | null;
        /**
         * The log file path (aka. cns address) for this event.
         */
        logFilePath?: string | null;
        /**
         * The network address (aka. bns address) that indicates where the event executor is running.
         */
        networkAddress?: string | null;
        /**
         * Next scheduled execution time in case the execution status was RETRY_ON_HOLD.
         */
        nextExecutionTime?: string | null;
        /**
         * Used internally and shouldn't be exposed to users. A counter for the cron job to record how many times this event is in in_process state but don't have a lock consecutively/
         */
        ryeLockUnheldCount?: number | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoEventExecutionDetailsEventAttemptStats {
        /**
         * The end time of the event execution for current attempt.
         */
        endTime?: string | null;
        /**
         * The start time of the event execution for current attempt. This could be in the future if it's been scheduled.
         */
        startTime?: string | null;
    }
    /**
     * Contains the snapshot of the event execution for a given checkpoint. Next available id: 13
     */
    export interface Schema$EnterpriseCrmEventbusProtoEventExecutionSnapshot {
        /**
         * Indicates "right after which checkpoint task's execution" this snapshot is taken.
         */
        checkpointTaskNumber?: string | null;
        /**
         * All of the computed conditions that been calculated.
         */
        conditionResults?: Schema$EnterpriseCrmEventbusProtoConditionResult[];
        /**
         * The parameters in Event object that differs from last snapshot.
         */
        diffParams?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        /**
         * Points to the event execution info this snapshot belongs to.
         */
        eventExecutionInfoId?: string | null;
        /**
         * Auto-generated. Used as primary key for EventExecutionSnapshots table.
         */
        eventExecutionSnapshotId?: string | null;
        eventExecutionSnapshotMetadata?: Schema$EnterpriseCrmEventbusProtoEventExecutionSnapshotEventExecutionSnapshotMetadata;
        /**
         * The parameters in Event object.
         */
        eventParams?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        /**
         * indicate whether snapshot exceeded maximum size before clean up
         */
        exceedMaxSize?: boolean | null;
        /**
         * Indicates when this snapshot is taken.
         */
        snapshotTime?: string | null;
        /**
         * All of the task execution details at the given point of time.
         */
        taskExecutionDetails?: Schema$EnterpriseCrmEventbusProtoTaskExecutionDetails[];
        /**
         * The task name associated with this snapshot. Could be empty.
         */
        taskName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoEventExecutionSnapshotEventExecutionSnapshotMetadata {
        /**
         * the event attempt number this snapshot belongs to.
         */
        eventAttemptNum?: number | null;
        /**
         * the task attempt number this snapshot belongs to. Could be empty.
         */
        taskAttemptNum?: number | null;
        /**
         * the task label associated with this snapshot. Could be empty.
         */
        taskLabel?: string | null;
        /**
         * the task name associated with this snapshot. Could be empty.
         */
        taskName?: string | null;
        /**
         * The task number associated with this snapshot. Could be empty.
         */
        taskNumber?: string | null;
    }
    /**
     * LINT.IfChange This message is used for processing and persisting (when applicable) key value pair parameters for each event in the event bus. Please see
     */
    export interface Schema$EnterpriseCrmEventbusProtoEventParameters {
        /**
         * Parameters are a part of Event and can be used to communicate between different tasks that are part of the same integration execution.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoParameterEntry[];
    }
    /**
     * Message that helps aggregate all sub-executions triggered by one execution and keeps track of child-parent relationships.
     */
    export interface Schema$EnterpriseCrmEventbusProtoExecutionTraceInfo {
        /**
         * Parent event execution info id that triggers the current execution through SubWorkflowExecutorTask.
         */
        parentEventExecutionInfoId?: string | null;
        /**
         * Used to aggregate ExecutionTraceInfo.
         */
        traceId?: string | null;
    }
    /**
     * Represents external traffic type and id.
     */
    export interface Schema$EnterpriseCrmEventbusProtoExternalTraffic {
        /**
         * User’s GCP project id the traffic is referring to.
         */
        gcpProjectId?: string | null;
        /**
         * User’s GCP project number the traffic is referring to.
         */
        gcpProjectNumber?: string | null;
        /**
         * Location for the user's request.
         */
        location?: string | null;
        /**
         * LINT.ThenChange(//depot/google3/enterprise/crm/eventbus/proto/product.proto:product, //depot/google3/java/com/google/enterprise/crm/integrationplatform/api/utils/ConverterUtils.java:source_to_product)
         */
        source?: string | null;
    }
    /**
     * Policy that defines the task retry logic and failure type. If no FailurePolicy is defined for a task, all its dependent tasks will not be executed (i.e, a `retry_strategy` of NONE will be applied).
     */
    export interface Schema$EnterpriseCrmEventbusProtoFailurePolicy {
        /**
         * Required if retry_strategy is FIXED_INTERVAL or LINEAR/EXPONENTIAL_BACKOFF/RESTART_WORKFLOW_WITH_BACKOFF. Defines the initial interval for backoff.
         */
        intervalInSeconds?: string | null;
        /**
         * Required if retry_strategy is FIXED_INTERVAL or LINEAR/EXPONENTIAL_BACKOFF/RESTART_WORKFLOW_WITH_BACKOFF. Defines the number of times the task will be retried if failed.
         */
        maxNumRetries?: number | null;
        /**
         * Defines what happens to the task upon failure.
         */
        retryStrategy?: string | null;
    }
    /**
     * Information about the value and type of the field.
     */
    export interface Schema$EnterpriseCrmEventbusProtoField {
        /**
         * By default, if the cardinality is unspecified the field is considered required while mapping.
         */
        cardinality?: string | null;
        /**
         * This holds the default values for the fields. This value is supplied by user so may or may not contain PII or SPII data.
         */
        defaultValue?: Schema$EnterpriseCrmEventbusProtoParameterValueType;
        /**
         * Specifies the data type of the field.
         */
        fieldType?: string | null;
        /**
         * Optional. The fully qualified proto name (e.g. enterprise.crm.storage.Account). Required for output field of type PROTO_VALUE or PROTO_ARRAY. For e.g., if input field_type is BYTES and output field_type is PROTO_VALUE, then fully qualified proto type url should be provided to parse the input bytes. If field_type is *_ARRAY, then all the converted protos are of the same type.
         */
        protoDefPath?: string | null;
        /**
         * This holds the reference key of the workflow or task parameter. 1. Any workflow parameter, for e.g. $workflowParam1$. 2. Any task input or output parameter, for e.g. $task1_param1$. 3. Any workflow or task parameters with subfield references, for e.g., $task1_param1.employee.id$
         */
        referenceKey?: string | null;
        /**
         * This is the transform expression to fetch the input field value. for e.g. $param1$.CONCAT('test'). Keep points - 1. Only input field can have a transform expression. 2. If a transform expression is provided, reference_key will be ignored. 3. If no value is returned after evaluation of transform expression, default_value can be mapped if provided. 4. The field_type should be the type of the final object returned after the transform expression is evaluated. Scrubs the transform expression before logging as value provided by user so may or may not contain PII or SPII data.
         */
        transformExpression?: Schema$EnterpriseCrmEventbusProtoTransformExpression;
    }
    /**
     * Field Mapping Config to map multiple output fields values from input fields values.
     */
    export interface Schema$EnterpriseCrmEventbusProtoFieldMappingConfig {
        mappedFields?: Schema$EnterpriseCrmEventbusProtoMappedField[];
    }
    export interface Schema$EnterpriseCrmEventbusProtoFunction {
        /**
         * The name of the function to perform.
         */
        functionType?: Schema$EnterpriseCrmEventbusProtoFunctionType;
        /**
         * List of parameters required for the transformation.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoTransformExpression[];
    }
    export interface Schema$EnterpriseCrmEventbusProtoFunctionType {
        /**
         * LINT.IfChange
         */
        baseFunction?: Schema$EnterpriseCrmEventbusProtoBaseFunction;
        booleanArrayFunction?: Schema$EnterpriseCrmEventbusProtoBooleanArrayFunction;
        booleanFunction?: Schema$EnterpriseCrmEventbusProtoBooleanFunction;
        doubleArrayFunction?: Schema$EnterpriseCrmEventbusProtoDoubleArrayFunction;
        doubleFunction?: Schema$EnterpriseCrmEventbusProtoDoubleFunction;
        intArrayFunction?: Schema$EnterpriseCrmEventbusProtoIntArrayFunction;
        intFunction?: Schema$EnterpriseCrmEventbusProtoIntFunction;
        /**
         * LINT.ThenChange(//depot/google3/alkali/apps/integrationplatform/client/workflow_editor/utils/transform_function.ts)
         */
        jsonFunction?: Schema$EnterpriseCrmEventbusProtoJsonFunction;
        protoArrayFunction?: Schema$EnterpriseCrmEventbusProtoProtoArrayFunction;
        protoFunction?: Schema$EnterpriseCrmEventbusProtoProtoFunction;
        stringArrayFunction?: Schema$EnterpriseCrmEventbusProtoStringArrayFunction;
        stringFunction?: Schema$EnterpriseCrmEventbusProtoStringFunction;
    }
    export interface Schema$EnterpriseCrmEventbusProtoIntArray {
        values?: string[] | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoIntArrayFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoIntFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoIntParameterArray {
        intValues?: string[] | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoJsonFunction {
        functionName?: string | null;
    }
    /**
     * The LogSettings define the logging attributes for an event property. These attributes are used to map the property to the parameter in the log proto. Also used to define scrubbing/truncation behavior and PII information.
     */
    export interface Schema$EnterpriseCrmEventbusProtoLogSettings {
        /**
         * The name of corresponding logging field of the event property. If omitted, assumes the same name as the event property key.
         */
        logFieldName?: string | null;
        /**
         * Contains the scrubbing options, such as whether to scrub, obfuscate, etc.
         */
        sanitizeOptions?: Schema$EnterpriseCrmLoggingGwsSanitizeOptions;
        seedPeriod?: string | null;
        seedScope?: string | null;
        /**
         * Contains the field limits for shortening, such as max string length and max array length.
         */
        shorteningLimits?: Schema$EnterpriseCrmLoggingGwsFieldLimits;
    }
    export interface Schema$EnterpriseCrmEventbusProtoLoopMetadata {
        /**
         * Starting from 1, not 0.
         */
        currentIterationCount?: string | null;
        /**
         * Needs to be set by the loop impl class before each iteration. The abstract loop class will append the request and response to it. Eg. The foreach Loop will clean up and set it as the current iteration element at the start of each loop. The post request and response will be appended to the value once they are available.
         */
        currentIterationDetail?: string | null;
        /**
         * Add the error message when loops fail.
         */
        errorMsg?: string | null;
        /**
         * Indicates where in the loop logic did it error out.
         */
        failureLocation?: string | null;
    }
    /**
     * Mapped field is a pair of input field and output field.
     */
    export interface Schema$EnterpriseCrmEventbusProtoMappedField {
        /**
         * The input field being mapped from.
         */
        inputField?: Schema$EnterpriseCrmEventbusProtoField;
        /**
         * The output field being mapped to.
         */
        outputField?: Schema$EnterpriseCrmEventbusProtoField;
    }
    /**
     * The task that is next in line to be executed, if the condition specified evaluated to true.
     */
    export interface Schema$EnterpriseCrmEventbusProtoNextTask {
        /**
         * Combined condition for this task to become an eligible next task. Each of these combined_conditions are joined with logical OR. DEPRECATED: use `condition`
         */
        combinedConditions?: Schema$EnterpriseCrmEventbusProtoCombinedCondition[];
        /**
         * Standard filter expression for this task to become an eligible next task.
         */
        condition?: string | null;
        /**
         * User-provided description intended to give more business context about the next task edge or condition.
         */
        description?: string | null;
        /**
         * User-provided label that is attached to this edge in the UI.
         */
        label?: string | null;
        /**
         * ID of the next task.
         */
        taskConfigId?: string | null;
        /**
         * Task number of the next task.
         */
        taskNumber?: string | null;
    }
    /**
     * The teardown task that is next in line to be executed. We support only sequential execution of teardown tasks (i.e. no branching).
     */
    export interface Schema$EnterpriseCrmEventbusProtoNextTeardownTask {
        /**
         * Required. Name of the next teardown task.
         */
        name?: string | null;
    }
    /**
     * Represents a node identifier (type + id). Next highest id: 3
     */
    export interface Schema$EnterpriseCrmEventbusProtoNodeIdentifier {
        /**
         * Configuration of the edge.
         */
        elementIdentifier?: string | null;
        /**
         * Destination node where the edge ends. It can only be a task config.
         */
        elementType?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoNotification {
        buganizerNotification?: Schema$EnterpriseCrmEventbusProtoBuganizerNotification;
        emailAddress?: Schema$EnterpriseCrmEventbusProtoAddress;
        escalatorQueue?: string | null;
        pubsubTopic?: string | null;
        /**
         * If the out-of-the-box email/pubsub notifications are not suitable and custom logic is required, fire a workflow containing all info needed to notify users to resume execution.
         */
        request?: Schema$EnterpriseCrmEventbusProtoCustomSuspensionRequest;
    }
    /**
     * Key-value pair of EventBus parameters.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParameterEntry {
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given fired event. These parameters must be predefined in the integration definition.
         */
        key?: string | null;
        /**
         * Values for the defined keys. Each value can either be string, int, double or any proto message.
         */
        value?: Schema$EnterpriseCrmEventbusProtoParameterValueType;
    }
    /**
     * A generic multi-map that holds key value pairs. They keys and values can be of any type, unless specified.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParameterMap {
        entries?: Schema$EnterpriseCrmEventbusProtoParameterMapEntry[];
        /**
         * Option to specify key value type for all entries of the map. If provided then field types for all entries must conform to this.
         */
        keyType?: string | null;
        valueType?: string | null;
    }
    /**
     * Entry is a pair of key and value.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParameterMapEntry {
        key?: Schema$EnterpriseCrmEventbusProtoParameterMapField;
        value?: Schema$EnterpriseCrmEventbusProtoParameterMapField;
    }
    /**
     * Field represents either the key or value in an entry.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParameterMapField {
        /**
         * Passing a literal value.
         */
        literalValue?: Schema$EnterpriseCrmEventbusProtoParameterValueType;
        /**
         * Referencing one of the WF variables.
         */
        referenceKey?: string | null;
    }
    /**
     * LINT.IfChange To support various types of parameter values. Next available id: 14
     */
    export interface Schema$EnterpriseCrmEventbusProtoParameterValueType {
        booleanArray?: Schema$EnterpriseCrmEventbusProtoBooleanParameterArray;
        booleanValue?: boolean | null;
        doubleArray?: Schema$EnterpriseCrmEventbusProtoDoubleParameterArray;
        doubleValue?: number | null;
        intArray?: Schema$EnterpriseCrmEventbusProtoIntParameterArray;
        intValue?: string | null;
        protoArray?: Schema$EnterpriseCrmEventbusProtoProtoParameterArray;
        protoValue?: {
            [key: string]: any;
        } | null;
        serializedObjectValue?: Schema$EnterpriseCrmEventbusProtoSerializedObjectParameter;
        stringArray?: Schema$EnterpriseCrmEventbusProtoStringParameterArray;
        stringValue?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryConfig {
        /**
         * A short phrase to describe what this parameter contains.
         */
        descriptivePhrase?: string | null;
        /**
         * Detailed help text for this parameter containing information not provided elsewhere. For example, instructions on how to migrate from a deprecated parameter.
         */
        helpText?: string | null;
        /**
         * Whether the default value is hidden in the UI.
         */
        hideDefaultValue?: boolean | null;
        inputDisplayOption?: string | null;
        /**
         * Whether this field is hidden in the UI.
         */
        isHidden?: boolean | null;
        /**
         * A user-friendly label for the parameter.
         */
        label?: string | null;
        parameterNameOption?: string | null;
        /**
         * A user-friendly label for subSection under which the parameter will be displayed.
         */
        subSectionLabel?: string | null;
        /**
         * Placeholder text which will appear in the UI input form for this parameter.
         */
        uiPlaceholderText?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryProtoDefinition {
        /**
         * The fully-qualified proto name. This message, for example, would be "enterprise.crm.eventbus.proto.ParamSpecEntry.ProtoDefinition".
         */
        fullName?: string | null;
        /**
         * Path to the proto file that contains the message type's definition.
         */
        path?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRule {
        doubleRange?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleDoubleRange;
        intRange?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleIntRange;
        stringRegex?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleStringRegex;
    }
    /**
     * Range used to validate doubles and floats.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleDoubleRange {
        /**
         * The inclusive maximum of the acceptable range.
         */
        max?: number | null;
        /**
         * The inclusive minimum of the acceptable range.
         */
        min?: number | null;
    }
    /**
     * Range used to validate longs and ints.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleIntRange {
        /**
         * The inclusive maximum of the acceptable range.
         */
        max?: string | null;
        /**
         * The inclusive minimum of the acceptable range.
         */
        min?: string | null;
    }
    /**
     * Rule used to validate strings.
     */
    export interface Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRuleStringRegex {
        /**
         * Whether the regex matcher is applied exclusively (if true, matching values will be rejected).
         */
        exclusive?: boolean | null;
        /**
         * The regex applied to the input value(s).
         */
        regex?: string | null;
    }
    /**
     * Key-value pair of EventBus property.
     */
    export interface Schema$EnterpriseCrmEventbusProtoPropertyEntry {
        /**
         * Key is used to retrieve the corresponding property value. This should be unique for a given fired event. The Tasks should be aware of the keys used while firing the events for them to be able to retrieve the values.
         */
        key?: string | null;
        /**
         * Values for the defined keys. Each value can either be string, int, double or any proto message.
         */
        value?: Schema$EnterpriseCrmEventbusProtoValueType;
    }
    export interface Schema$EnterpriseCrmEventbusProtoProtoArrayFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoProtoFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoProtoParameterArray {
        protoValues?: Array<{
            [key: string]: any;
        }> | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoScatterResponse {
        /**
         * The error message of the failure if applicable.
         */
        errorMsg?: string | null;
        /**
         * The execution ids of each Subworkflow fired by this scatter.
         */
        executionIds?: string[] | null;
        /**
         * If execution is sync, this is true if the execution passed and false if it failed. If the execution is async, this is true if the WF was fired off successfully, and false if it failed to execute. The success or failure of the subworkflows executed are not captured.
         */
        isSuccessful?: boolean | null;
        /**
         * A list of all the response parameters in the aggregtorMap stored with the remapped key.
         */
        responseParams?: Schema$EnterpriseCrmEventbusProtoParameterEntry[];
        /**
         * The element that was scattered for this execution.
         */
        scatterElement?: Schema$EnterpriseCrmEventbusProtoParameterValueType;
    }
    export interface Schema$EnterpriseCrmEventbusProtoSerializedObjectParameter {
        objectValue?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoStringArray {
        values?: string[] | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoStringArrayFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoStringFunction {
        functionName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoStringParameterArray {
        stringValues?: string[] | null;
    }
    /**
     * Policy that dictates the behavior for the task after it completes successfully.
     */
    export interface Schema$EnterpriseCrmEventbusProtoSuccessPolicy {
        /**
         * State to which the execution snapshot status will be set if the task succeeds.
         */
        finalState?: string | null;
    }
    /**
     * LINT.IfChange
     */
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionAuthPermissions {
        /**
         * Represents a Gaia identity for a person or service account.
         */
        gaiaIdentity?: Schema$EnterpriseCrmEventbusProtoSuspensionAuthPermissionsGaiaIdentity;
        googleGroup?: Schema$EnterpriseCrmEventbusProtoSuspensionAuthPermissionsGaiaIdentity;
        loasRole?: string | null;
        mdbGroup?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionAuthPermissionsGaiaIdentity {
        emailAddress?: string | null;
        gaiaId?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionConfig {
        /**
         * Optional information to provide recipients of the suspension in addition to the resolution URL, typically containing relevant parameter values from the originating workflow.
         */
        customMessage?: string | null;
        notifications?: Schema$EnterpriseCrmEventbusProtoNotification[];
        /**
         * Indicates the next steps when no external actions happen on the suspension.
         */
        suspensionExpiration?: Schema$EnterpriseCrmEventbusProtoSuspensionExpiration;
        /**
         * Identities able to resolve this suspension.
         */
        whoMayResolve?: Schema$EnterpriseCrmEventbusProtoSuspensionAuthPermissions[];
    }
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionExpiration {
        /**
         * Milliseconds after which the suspension expires, if no action taken.
         */
        expireAfterMs?: number | null;
        /**
         * Whether the suspension will be REJECTED or LIFTED upon expiration. REJECTED is the default behavior.
         */
        liftWhenExpired?: boolean | null;
        /**
         * Milliseconds after which the previous suspension action reminder, if any, is sent using the selected notification option, for a suspension which is still PENDING_UNSPECIFIED.
         */
        remindAfterMs?: number | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionResolutionInfo {
        audit?: Schema$EnterpriseCrmEventbusProtoSuspensionResolutionInfoAudit;
        /**
         * The event data user sends as request.
         */
        clientId?: string | null;
        /**
         * KMS info, used by cmek/gmek integration
         */
        cloudKmsConfig?: Schema$EnterpriseCrmEventbusProtoCloudKmsConfig;
        /**
         * Auto-generated.
         */
        createdTimestamp?: string | null;
        /**
         * Encrypted SuspensionResolutionInfo
         */
        encryptedSuspensionResolutionInfo?: string | null;
        /**
         * Required. ID of the associated execution.
         */
        eventExecutionInfoId?: string | null;
        /**
         * The origin of the suspension for periodic notifications.
         */
        externalTraffic?: Schema$EnterpriseCrmEventbusProtoExternalTraffic;
        /**
         * Auto-generated.
         */
        lastModifiedTimestamp?: string | null;
        /**
         * Which Google product the suspension belongs to. If not set, the suspension belongs to Integration Platform by default.
         */
        product?: string | null;
        status?: string | null;
        suspensionConfig?: Schema$EnterpriseCrmEventbusProtoSuspensionConfig;
        /**
         * Primary key for the SuspensionResolutionInfoTable.
         */
        suspensionId?: string | null;
        /**
         * Required. Task number of the associated SuspensionTask.
         */
        taskNumber?: string | null;
        /**
         * Required. The name of the originating workflow.
         */
        workflowName?: string | null;
        /**
         * Wrapped dek
         */
        wrappedDek?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoSuspensionResolutionInfoAudit {
        resolvedBy?: string | null;
        resolvedByCpi?: string | null;
        timestamp?: string | null;
    }
    /**
     * Message to be used to configure alerting in the {@code TaskConfig\} protos for tasks in an event.
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskAlertConfig {
        /**
         * The period over which the metric value should be aggregated and evaluated. Format is , where integer should be a positive integer and unit should be one of (s,m,h,d,w) meaning (second, minute, hour, day, week).
         */
        aggregationPeriod?: string | null;
        /**
         * Set to false by default. When set to true, the metrics are not aggregated or pushed to Monarch for this workflow alert.
         */
        alertDisabled?: boolean | null;
        /**
         * A name to identify this alert. This will be displayed in the alert subject. If set, this name should be unique in within the scope of the containing workflow.
         */
        alertName?: string | null;
        /**
         * Client associated with this alert configuration. Must be a client enabled in one of the containing workflow's triggers.
         */
        clientId?: string | null;
        /**
         * Should be specified only for TASK_AVERAGE_DURATION and TASK_PERCENTILE_DURATION metrics. This member should be used to specify what duration value the metrics should exceed for the alert to trigger.
         */
        durationThresholdMs?: string | null;
        errorEnumList?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigErrorEnumList;
        metricType?: string | null;
        /**
         * For how many contiguous aggregation periods should the expected min or max be violated for the alert to be fired.
         */
        numAggregationPeriods?: number | null;
        /**
         * Only count final task attempts, not retries.
         */
        onlyFinalAttempt?: boolean | null;
        /**
         * Link to a playbook for resolving the issue that triggered this alert.
         */
        playbookUrl?: string | null;
        /**
         * The threshold type for which this alert is being configured. If value falls below expected_min or exceeds expected_max, an alert will be fired.
         */
        thresholdType?: string | null;
        /**
         * The metric value, above or below which the alert should be triggered.
         */
        thresholdValue?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigThresholdValue;
        warningEnumList?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigErrorEnumList;
    }
    /**
     * Contains the details of the execution of this task. Next available id: 11
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskExecutionDetails {
        taskAttemptStats?: Schema$EnterpriseCrmEventbusProtoTaskExecutionDetailsTaskAttemptStats[];
        taskExecutionState?: string | null;
        /**
         * Pointer to the task config it used for execution.
         */
        taskNumber?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoTaskExecutionDetailsTaskAttemptStats {
        /**
         * The end time of the task execution for current attempt.
         */
        endTime?: string | null;
        /**
         * The start time of the task execution for current attempt. This could be in the future if it's been scheduled.
         */
        startTime?: string | null;
    }
    /**
     * TaskMetadata are attributes that are associated to every common Task we have.
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskMetadata {
        /**
         * The new task name to replace the current task if it is deprecated. Otherwise, it is the same as the current task name.
         */
        activeTaskName?: string | null;
        admins?: Schema$EnterpriseCrmEventbusProtoTaskMetadataAdmin[];
        category?: string | null;
        /**
         * The Code Search link to the Task Java file.
         */
        codeSearchLink?: string | null;
        /**
         * Controls whether JSON workflow parameters are validated against provided schemas before and/or after this task's execution.
         */
        defaultJsonValidationOption?: string | null;
        /**
         * Contains the initial configuration of the task with default values set. For now, The string should be compatible to an ASCII-proto format.
         */
        defaultSpec?: string | null;
        /**
         * In a few sentences, describe the purpose and usage of the task.
         */
        description?: string | null;
        /**
         * The string name to show on the task list on the Workflow editor screen. This should be a very short, one to two words name for the task. (e.g. "Send Mail")
         */
        descriptiveName?: string | null;
        /**
         * Snippet of markdown documentation to embed in the RHP for this task.
         */
        docMarkdown?: string | null;
        externalCategory?: string | null;
        /**
         * Sequence with which the task in specific category to be displayed in task discovery panel for external users.
         */
        externalCategorySequence?: number | null;
        /**
         * External-facing documention embedded in the RHP for this task.
         */
        externalDocHtml?: string | null;
        /**
         * Doc link for external-facing documentation (separate from g3doc).
         */
        externalDocLink?: string | null;
        /**
         * DEPRECATED: Use external_doc_html.
         */
        externalDocMarkdown?: string | null;
        /**
         * URL to the associated G3 Doc for the task if available
         */
        g3DocLink?: string | null;
        /**
         * URL to gstatic image icon for this task. This icon shows up on the task list panel along with the task name in the Workflow Editor screen. Use the 24p, 2x, gray color icon image format.
         */
        iconLink?: string | null;
        /**
         * The deprecation status of the current task. Default value is false;
         */
        isDeprecated?: boolean | null;
        /**
         * The actual class name or the annotated name of the task. Task Author should initialize this field with value from the getName() method of the Task class.
         */
        name?: string | null;
        /**
         * External-facing documention for standalone IP in pantheon embedded in the RHP for this task. Non null only if different from external_doc_html
         */
        standaloneExternalDocHtml?: string | null;
        /**
         * Allows author to indicate if the task is ready to use or not. If not set, then it will default to INACTIVE.
         */
        status?: string | null;
        system?: string | null;
        /**
         * A set of tags that pertain to a particular task. This can be used to improve the searchability of tasks with several names ("REST Caller" vs. "Call REST Endpoint") or to help users find tasks based on related words.
         */
        tags?: string[] | null;
    }
    /**
     * Admins are owners of a Task, and have all permissions on a particular task identified by the task name. By default, Eventbus periodically scans all task metadata and syncs (adds) any new admins defined here to Zanzibar.
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskMetadataAdmin {
        googleGroupEmail?: string | null;
        userEmail?: string | null;
    }
    /**
     * Task authors would use this type to configure the UI for a particular task by specifying what UI config modules should be included to compose the UI. Learn more about config module framework:
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskUiConfig {
        /**
         * Configurations of included config modules.
         */
        taskUiModuleConfigs?: Schema$EnterpriseCrmEventbusProtoTaskUiModuleConfig[];
    }
    /**
     * Task author would use this type to configure a config module.
     */
    export interface Schema$EnterpriseCrmEventbusProtoTaskUiModuleConfig {
        /**
         * ID of the config module.
         */
        moduleId?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoTeardown {
        /**
         * Required.
         */
        teardownTaskConfigs?: Schema$EnterpriseCrmEventbusProtoTeardownTaskConfig[];
    }
    export interface Schema$EnterpriseCrmEventbusProtoTeardownTaskConfig {
        /**
         * The creator's email address.
         */
        creatorEmail?: string | null;
        /**
         * Required. Unique identifier of the teardown task within this Config. We use this field as the identifier to find next teardown tasks.
         */
        name?: string | null;
        nextTeardownTask?: Schema$EnterpriseCrmEventbusProtoNextTeardownTask;
        /**
         * The parameters the user can pass to this task.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        properties?: Schema$EnterpriseCrmEventbusProtoEventBusProperties;
        /**
         * Required. Implementation class name.
         */
        teardownTaskImplementationClassName?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoToken {
        name?: string | null;
        value?: string | null;
    }
    export interface Schema$EnterpriseCrmEventbusProtoTransformExpression {
        /**
         * Initial value upon which to perform transformations.
         */
        initialValue?: Schema$EnterpriseCrmEventbusProtoBaseValue;
        /**
         * Transformations to be applied sequentially.
         */
        transformationFunctions?: Schema$EnterpriseCrmEventbusProtoFunction[];
    }
    export interface Schema$EnterpriseCrmEventbusProtoTriggerCriteria {
        /**
         * Required. Standard filter expression, when true the workflow will be executed. If there's no trigger_criteria_task_implementation_class_name specified, the condition will be validated directly.
         */
        condition?: string | null;
        /**
         * Optional. To be used in TaskConfig for the implementation class.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        /**
         * Optional. Implementation class name. The class should implement the “TypedTask” interface.
         */
        triggerCriteriaTaskImplementationClassName?: string | null;
    }
    /**
     * Used for define type for values. Currently supported value types include int, string, double, array, and any proto message.
     */
    export interface Schema$EnterpriseCrmEventbusProtoValueType {
        booleanValue?: boolean | null;
        doubleArray?: Schema$EnterpriseCrmEventbusProtoDoubleArray;
        doubleValue?: number | null;
        intArray?: Schema$EnterpriseCrmEventbusProtoIntArray;
        intValue?: string | null;
        protoValue?: {
            [key: string]: any;
        } | null;
        stringArray?: Schema$EnterpriseCrmEventbusProtoStringArray;
        stringValue?: string | null;
    }
    /**
     * Message to be used to configure custom alerting in the {@code EventConfig\} protos for an event.
     */
    export interface Schema$EnterpriseCrmEventbusProtoWorkflowAlertConfig {
        /**
         * For an EXPECTED_MIN threshold, this aggregation_period must be lesser than 24 hours.
         */
        aggregationPeriod?: string | null;
        /**
         * Set to false by default. When set to true, the metrics are not aggregated or pushed to Monarch for this workflow alert.
         */
        alertDisabled?: boolean | null;
        /**
         * A name to identify this alert. This will be displayed in the alert subject. If set, this name should be unique within the scope of the workflow.
         */
        alertName?: string | null;
        /**
         * Client associated with this alert configuration.
         */
        clientId?: string | null;
        /**
         * Should be specified only for *AVERAGE_DURATION and *PERCENTILE_DURATION metrics. This member should be used to specify what duration value the metrics should exceed for the alert to trigger.
         */
        durationThresholdMs?: string | null;
        errorEnumList?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigErrorEnumList;
        metricType?: string | null;
        /**
         * For how many contiguous aggregation periods should the expected min or max be violated for the alert to be fired.
         */
        numAggregationPeriods?: number | null;
        /**
         * For either events or tasks, depending on the type of alert, count only final attempts, not retries.
         */
        onlyFinalAttempt?: boolean | null;
        /**
         * Link to a playbook for resolving the issue that triggered this alert.
         */
        playbookUrl?: string | null;
        /**
         * The threshold type, whether lower(expected_min) or upper(expected_max), for which this alert is being configured. If value falls below expected_min or exceeds expected_max, an alert will be fired.
         */
        thresholdType?: string | null;
        /**
         * The metric value, above or below which the alert should be triggered.
         */
        thresholdValue?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigThresholdValue;
        warningEnumList?: Schema$EnterpriseCrmEventbusProtoBaseAlertConfigErrorEnumList;
    }
    /**
     * Stats for the requested dimensions: QPS, duration, and error/warning rate
     */
    export interface Schema$EnterpriseCrmEventbusStats {
        /**
         * Dimensions that these stats have been aggregated on.
         */
        dimensions?: Schema$EnterpriseCrmEventbusStatsDimensions;
        /**
         * Average duration in seconds.
         */
        durationInSeconds?: number | null;
        /**
         * Average error rate.
         */
        errorRate?: number | null;
        /**
         * Queries per second.
         */
        qps?: number | null;
        /**
         * Average warning rate.
         */
        warningRate?: number | null;
    }
    export interface Schema$EnterpriseCrmEventbusStatsDimensions {
        clientId?: string | null;
        /**
         * Whether to include or exclude the enums matching the regex.
         */
        enumFilterType?: string | null;
        errorEnumString?: string | null;
        retryAttempt?: string | null;
        taskName?: string | null;
        taskNumber?: string | null;
        /**
         * Stats have been or will be aggregated on set fields for any semantically-meaningful combination.
         */
        triggerId?: string | null;
        warningEnumString?: string | null;
        workflowId?: string | null;
        workflowName?: string | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoBooleanParameterArray {
        booleanValues?: boolean[] | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoDoubleParameterArray {
        doubleValues?: number[] | null;
    }
    /**
     * Contains the details of the execution info of this event: this includes the tasks execution details plus the event execution statistics. Next available id: 10
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionDetails {
        eventAttemptStats?: Schema$EnterpriseCrmEventbusProtoEventExecutionDetailsEventAttemptStats[];
        /**
         * After snapshot migration, this field will no longer be populated, but old execution snapshots will still be accessible.
         */
        eventExecutionSnapshot?: Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionSnapshot[];
        /**
         * The execution state of this event.
         */
        eventExecutionState?: string | null;
        /**
         * Indicates the number of times the execution has restarted from the beginning.
         */
        eventRetriesFromBeginningCount?: number | null;
        /**
         * The log file path (aka. cns address) for this event.
         */
        logFilePath?: string | null;
        /**
         * The network address (aka. bns address) that indicates where the event executor is running.
         */
        networkAddress?: string | null;
        /**
         * Next scheduled execution time in case the execution status was RETRY_ON_HOLD.
         */
        nextExecutionTime?: string | null;
        /**
         * Used internally and shouldn't be exposed to users. A counter for the cron job to record how many times this event is in in_process state but don't have a lock consecutively/
         */
        ryeLockUnheldCount?: number | null;
    }
    /**
     * Contains all the execution details for a workflow instance. Next available id: 24
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionInfo {
        /**
         * The event data user sends as request.
         */
        clientId?: string | null;
        /**
         * Auto-generated.
         */
        createTime?: string | null;
        /**
         * Final error-code if event failed.
         */
        errorCode?: Schema$CrmlogErrorCode;
        /**
         * Errors, warnings, and informationals associated with the workflow/task. The order in which the errors were added by the workflow/task is maintained.
         */
        errors?: Schema$EnterpriseCrmEventbusProtoErrorDetail[];
        /**
         * The execution info about this event.
         */
        eventExecutionDetails?: Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionDetails;
        /**
         * Auto-generated primary key.
         */
        eventExecutionInfoId?: string | null;
        /**
         * Execution trace info to aggregate parent-child executions.
         */
        executionTraceInfo?: Schema$EnterpriseCrmEventbusProtoExecutionTraceInfo;
        /**
         * Auto-generated.
         */
        lastModifiedTime?: string | null;
        /**
         * The ways user posts this event.
         */
        postMethod?: string | null;
        /**
         * Which Google product the execution_info belongs to. If not set, the execution_info belongs to Integration Platform by default.
         */
        product?: string | null;
        /**
         * Optional. This is used to de-dup incoming request.
         */
        requestId?: string | null;
        /**
         * Event parameters come in as part of the request.
         */
        requestParams?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Event parameters come out as part of the response.
         */
        responseParams?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Workflow snapshot number.
         */
        snapshotNumber?: string | null;
        /**
         * Tenant this event is created. Used to reschedule the event to correct tenant.
         */
        tenant?: string | null;
        /**
         * The trigger id of the workflow trigger config. If both trigger_id and client_id is present, the workflow is executed from the start tasks provided by the matching trigger config otherwise it is executed from the default start tasks.
         */
        triggerId?: string | null;
        /**
         * Required. Pointer to the workflow it is executing.
         */
        workflowId?: string | null;
        /**
         * Name of the workflow.
         */
        workflowName?: string | null;
        /**
         * Time interval in seconds to schedule retry of workflow in manifold when workflow is already running
         */
        workflowRetryBackoffIntervalSeconds?: string | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionSnapshot {
        /**
         * Indicates "right after which checkpoint task's execution" this snapshot is taken.
         */
        checkpointTaskNumber?: string | null;
        /**
         * All of the computed conditions that been calculated.
         */
        conditionResults?: Schema$EnterpriseCrmEventbusProtoConditionResult[];
        /**
         * The parameters in Event object that differs from last snapshot.
         */
        diffParams?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Points to the event execution info this snapshot belongs to.
         */
        eventExecutionInfoId?: string | null;
        /**
         * Auto-generated. Used as primary key for EventExecutionSnapshots table.
         */
        eventExecutionSnapshotId?: string | null;
        eventExecutionSnapshotMetadata?: Schema$EnterpriseCrmEventbusProtoEventExecutionSnapshotEventExecutionSnapshotMetadata;
        /**
         * The parameters in Event object.
         */
        eventParams?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Indicates when this snapshot is taken.
         */
        snapshotTime?: string | null;
        /**
         * All of the task execution details at the given point of time.
         */
        taskExecutionDetails?: Schema$EnterpriseCrmEventbusProtoTaskExecutionDetails[];
        /**
         * The task name associated with this snapshot. Could be empty.
         */
        taskName?: string | null;
    }
    /**
     * LINT.IfChange This message is used for processing and persisting (when applicable) key value pair parameters for each event in the event bus. Please see
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters {
        /**
         * Parameters are a part of Event and can be used to communicate between different tasks that are part of the same workflow execution.
         */
        parameters?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoIntParameterArray {
        intValues?: string[] | null;
    }
    /**
     * Key-value pair of EventBus parameters.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry {
        /**
         * Explicitly getting the type of the parameter.
         */
        dataType?: string | null;
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given fired event. These parameters must be predefined in the workflow definition.
         */
        key?: string | null;
        /**
         * Values for the defined keys. Each value can either be string, int, double or any proto message.
         */
        value?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterValueType;
    }
    /**
     * A generic multi-map that holds key value pairs. They keys and values can be of any type, unless specified.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParameterMap {
        entries?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterMapEntry[];
        /**
         * Option to specify key value type for all entries of the map. If provided then field types for all entries must conform to this.
         */
        keyType?: string | null;
        valueType?: string | null;
    }
    /**
     * Entry is a pair of key and value.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParameterMapEntry {
        key?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterMapField;
        value?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterMapField;
    }
    /**
     * Field represents either the key or value in an entry.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParameterMapField {
        /**
         * Passing a literal value.
         */
        literalValue?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterValueType;
        /**
         * Referencing one of the WF variables.
         */
        referenceKey?: string | null;
    }
    /**
     * To support various types of parameter values. Next available id: 14
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParameterValueType {
        booleanArray?: Schema$EnterpriseCrmFrontendsEventbusProtoBooleanParameterArray;
        booleanValue?: boolean | null;
        doubleArray?: Schema$EnterpriseCrmFrontendsEventbusProtoDoubleParameterArray;
        doubleValue?: number | null;
        intArray?: Schema$EnterpriseCrmFrontendsEventbusProtoIntParameterArray;
        intValue?: string | null;
        jsonValue?: string | null;
        protoArray?: Schema$EnterpriseCrmFrontendsEventbusProtoProtoParameterArray;
        protoValue?: {
            [key: string]: any;
        } | null;
        serializedObjectValue?: Schema$EnterpriseCrmFrontendsEventbusProtoSerializedObjectParameter;
        stringArray?: Schema$EnterpriseCrmFrontendsEventbusProtoStringParameterArray;
        stringValue?: string | null;
    }
    /**
     * Key-value pair of EventBus task parameters. Next id: 13
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParamSpecEntry {
        /**
         * The FQCN of the Java object this represents. A string, for example, would be "java.lang.String". If this is "java.lang.Object", the parameter can be of any type.
         */
        className?: string | null;
        /**
         * If it is a collection of objects, this would be the FCQN of every individual element in the collection. If this is "java.lang.Object", the parameter is a collection of any type.
         */
        collectionElementClassName?: string | null;
        /**
         * Optional fields, such as help text and other useful info.
         */
        config?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryConfig;
        /**
         * The data type of the parameter.
         */
        dataType?: string | null;
        /**
         * Default values for the defined keys. Each value can either be string, int, double or any proto message or a serialized object.
         */
        defaultValue?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterValueType;
        /**
         * If set, this entry is deprecated, so further use of this parameter should be prohibited.
         */
        isDeprecated?: boolean | null;
        isOutput?: boolean | null;
        /**
         * If the data_type is JSON_VALUE, then this will define its schema.
         */
        jsonSchema?: string | null;
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given task. These parameters must be predefined in the workflow definition.
         */
        key?: string | null;
        /**
         * Populated if this represents a proto or proto array.
         */
        protoDef?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryProtoDefinition;
        /**
         * If set, the user must provide an input value for this parameter.
         */
        required?: boolean | null;
        /**
         * Rule used to validate inputs (individual values and collection elements) for this parameter.
         */
        validationRule?: Schema$EnterpriseCrmEventbusProtoParamSpecEntryValidationRule;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoParamSpecsMessage {
        parameters?: Schema$EnterpriseCrmFrontendsEventbusProtoParamSpecEntry[];
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoProtoParameterArray {
        protoValues?: Array<{
            [key: string]: any;
        }> | null;
    }
    /**
     * Next available id: 4
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoRollbackStrategy {
        /**
         * Optional. The customized parameters the user can pass to this task.
         */
        parameters?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Required. This is the name of the task that needs to be executed upon rollback of this task.
         */
        rollbackTaskImplementationClassName?: string | null;
        /**
         * Required. These are the tasks numbers of the tasks whose `rollback_strategy.rollback_task_implementation_class_name` needs to be executed upon failure of this task.
         */
        taskNumbersToRollback?: string[] | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoSerializedObjectParameter {
        objectValue?: string | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoStringParameterArray {
        stringValues?: string[] | null;
    }
    /**
     * The task configuration details. This is not the implementation of Task. There might be multiple TaskConfigs for the same Task.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoTaskConfig {
        /**
         * Alert configurations on error rate, warning rate, number of runs, durations, etc.
         */
        alertConfigs?: Schema$EnterpriseCrmEventbusProtoTaskAlertConfig[];
        /**
         * Auto-generated.
         */
        createTime?: string | null;
        /**
         * The creator's email address. Auto-generated from the user's email.
         */
        creatorEmail?: string | null;
        /**
         * User-provided description intended to give more business context about the task.
         */
        description?: string | null;
        /**
         * If this config contains a TypedTask, allow validation to succeed if an input is read from the output of another TypedTask whose output type is declared as a superclass of the requested input type. For instance, if the previous task declares an output of type Message, any task with this flag enabled will pass validation when attempting to read any proto Message type from the resultant Event parameter.
         */
        disableStrictTypeValidation?: boolean | null;
        /**
         * Optional Error catcher id of the error catch flow which will be executed when execution error happens in the task
         */
        errorCatcherId?: string | null;
        externalTaskType?: string | null;
        /**
         * Optional. Determines the number of times the task will be retried on failure and with what retry strategy. This is applicable for asynchronous calls to Eventbus alone (Post To Queue, Schedule etc.).
         */
        failurePolicy?: Schema$EnterpriseCrmEventbusProtoFailurePolicy;
        /**
         * The number of edges leading into this TaskConfig.
         */
        incomingEdgeCount?: number | null;
        /**
         * If set, overrides the option configured in the Task implementation class.
         */
        jsonValidationOption?: string | null;
        /**
         * User-provided label that is attached to this TaskConfig in the UI.
         */
        label?: string | null;
        /**
         * Auto-generated.
         */
        lastModifiedTime?: string | null;
        /**
         * The set of tasks that are next in line to be executed as per the execution graph defined for the parent event, specified by `event_config_id`. Each of these next tasks are executed only if the condition associated with them evaluates to true.
         */
        nextTasks?: Schema$EnterpriseCrmEventbusProtoNextTask[];
        /**
         * The policy dictating the execution of the next set of tasks for the current task.
         */
        nextTasksExecutionPolicy?: string | null;
        /**
         * The customized parameters the user can pass to this task.
         */
        parameters?: {
            [key: string]: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry;
        } | null;
        /**
         * Optional. Informs the front-end application where to draw this task config on the UI.
         */
        position?: Schema$EnterpriseCrmEventbusProtoCoordinate;
        /**
         * Optional. Standard filter expression evaluated before execution. Independent of other conditions and tasks. Can be used to enable rollout. e.g. "rollout(5)" will only allow 5% of incoming traffic to task.
         */
        precondition?: string | null;
        /**
         * Optional. User-provided label that is attached to precondition in the UI.
         */
        preconditionLabel?: string | null;
        /**
         * Optional. Contains information about what needs to be done upon failure (either a permanent error or after it has been retried too many times).
         */
        rollbackStrategy?: Schema$EnterpriseCrmFrontendsEventbusProtoRollbackStrategy;
        /**
         * Determines what action to take upon successful task completion.
         */
        successPolicy?: Schema$EnterpriseCrmEventbusProtoSuccessPolicy;
        /**
         * Optional. Determines the number of times the task will be retried on failure and with what retry strategy. This is applicable for synchronous calls to Eventbus alone (Post).
         */
        synchronousCallFailurePolicy?: Schema$EnterpriseCrmEventbusProtoFailurePolicy;
        /**
         * Copy of the task entity that this task config is an instance of.
         */
        taskEntity?: Schema$EnterpriseCrmFrontendsEventbusProtoTaskEntity;
        /**
         * The policy dictating the execution strategy of this task.
         */
        taskExecutionStrategy?: string | null;
        /**
         * The name for the task.
         */
        taskName?: string | null;
        /**
         * REQUIRED: the identifier of this task within its parent event config, specified by the client. This should be unique among all the tasks belong to the same event config. We use this field as the identifier to find next tasks (via field `next_tasks.task_number`).
         */
        taskNumber?: string | null;
        /**
         * A string template that allows user to configure task parameters (with either literal default values or tokens which will be resolved at execution time) for the task. It will eventually replace the old "parameters" field.
         */
        taskSpec?: string | null;
        /**
         * Used to define task-template name if task is of type task-template
         */
        taskTemplateName?: string | null;
        /**
         * Defines the type of the task
         */
        taskType?: string | null;
    }
    /**
     * Contains a task's metadata and associated information. Next available id: 7
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoTaskEntity {
        /**
         * True if the task has conflict with vpcsc
         */
        disabledForVpcSc?: boolean | null;
        /**
         * Metadata inclueds the task name, author and so on.
         */
        metadata?: Schema$EnterpriseCrmEventbusProtoTaskMetadata;
        /**
         * Declarations for inputs/outputs for a TypedTask. This is also associated with the METADATA mask.
         */
        paramSpecs?: Schema$EnterpriseCrmFrontendsEventbusProtoParamSpecsMessage;
        /**
         * Deprecated - statistics from the Monarch query.
         */
        stats?: Schema$EnterpriseCrmEventbusStats;
        /**
         * Defines the type of the task
         */
        taskType?: string | null;
        /**
         * UI configuration for this task Also associated with the METADATA mask.
         */
        uiConfig?: Schema$EnterpriseCrmEventbusProtoTaskUiConfig;
    }
    /**
     * Configuration detail of a trigger. Next available id: 19
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoTriggerConfig {
        /**
         * An alert threshold configuration for the [trigger + client + workflow] tuple. If these values are not specified in the trigger config, default values will be populated by the system. Note that there must be exactly one alert threshold configured per [client + trigger + workflow] when published.
         */
        alertConfig?: Schema$EnterpriseCrmEventbusProtoWorkflowAlertConfig[];
        cloudSchedulerConfig?: Schema$EnterpriseCrmEventbusProtoCloudSchedulerConfig;
        /**
         * User-provided description intended to give more business context about the task.
         */
        description?: string | null;
        /**
         * Required. The list of client ids which are enabled to execute the workflow using this trigger. In other words, these clients have the workflow execution privledges for this trigger. For API trigger, the client id in the incoming request is validated against the list of enabled clients. For non-API triggers, one workflow execution is triggered on behalf of each enabled client.
         */
        enabledClients?: string[] | null;
        /**
         * Optional Error catcher id of the error catch flow which will be executed when execution error happens in the task
         */
        errorCatcherId?: string | null;
        /**
         * The user created label for a particular trigger.
         */
        label?: string | null;
        /**
         * Dictates how next tasks will be executed.
         */
        nextTasksExecutionPolicy?: string | null;
        /**
         * Optional. If set to true, any upcoming requests for this trigger config will be paused and the executions will be resumed later when the flag is reset. The workflow to which this trigger config belongs has to be in ACTIVE status for the executions to be paused or resumed.
         */
        pauseWorkflowExecutions?: boolean | null;
        /**
         * Optional. Informs the front-end application where to draw this trigger config on the UI.
         */
        position?: Schema$EnterpriseCrmEventbusProtoCoordinate;
        /**
         * Configurable properties of the trigger, not to be confused with workflow parameters. E.g. "name" is a property for API triggers and "subscription" is a property for Cloud Pubsub triggers.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Set of tasks numbers from where the workflow execution is started by this trigger. If this is empty, then workflow is executed with default start tasks. In the list of start tasks, none of two tasks can have direct ancestor-descendant relationships (i.e. in a same workflow execution graph).
         */
        startTasks?: Schema$EnterpriseCrmEventbusProtoNextTask[];
        /**
         * Optional. When set, Eventbus will run the task specified in the trigger_criteria and validate the result using the trigger_criteria.condition, and only execute the workflow when result is true.
         */
        triggerCriteria?: Schema$EnterpriseCrmEventbusProtoTriggerCriteria;
        /**
         * The backend trigger ID.
         */
        triggerId?: string | null;
        /**
         * Required. A number to uniquely identify each trigger config within the workflow on UI.
         */
        triggerNumber?: string | null;
        triggerType?: string | null;
    }
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameterEntry {
        /**
         * Metadata information about the parameters.
         */
        attributes?: Schema$EnterpriseCrmEventbusProtoAttributes;
        /**
         * Child parameters nested within this parameter. This field only applies to protobuf parameters
         */
        children?: Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameterEntry[];
        /**
         * The data type of the parameter.
         */
        dataType?: string | null;
        /**
         * Default values for the defined keys. Each value can either be string, int, double or any proto message or a serialized object.
         */
        defaultValue?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterValueType;
        /**
         * Specifies the input/output type for the parameter.
         */
        inOutType?: string | null;
        /**
         * Whether this parameter is a transient parameter.
         */
        isTransient?: boolean | null;
        /**
         * This schema will be used to validate runtime JSON-typed values of this parameter.
         */
        jsonSchema?: string | null;
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given fired event. These parameters must be predefined in the workflow definition.
         */
        key?: string | null;
        /**
         * The name (without prefix) to be displayed in the UI for this parameter. E.g. if the key is "foo.bar.myName", then the name would be "myName".
         */
        name?: string | null;
        /**
         * The identifier of the node (TaskConfig/TriggerConfig) this parameter was produced by, if it is a transient param or a copy of an input param.
         */
        producedBy?: Schema$EnterpriseCrmEventbusProtoNodeIdentifier;
        producer?: string | null;
        /**
         * The name of the protobuf type if the parameter has a protobuf data type.
         */
        protoDefName?: string | null;
        /**
         * If the data type is of type proto or proto array, this field needs to be populated with the fully qualified proto name. This message, for example, would be "enterprise.crm.frontends.eventbus.proto.WorkflowParameterEntry".
         */
        protoDefPath?: string | null;
    }
    /**
     * LINT.IfChange This is the frontend version of WorkflowParameters. It's exactly like the backend version except that instead of flattening protobuf parameters and treating every field and subfield of a protobuf parameter as a separate parameter, the fields/subfields of a protobuf parameter will be nested as "children" (see 'children' field below) parameters of the parent parameter. Please refer to enterprise/crm/eventbus/proto/workflow_parameters.proto for more information about WorkflowParameters.
     */
    export interface Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameters {
        /**
         * Parameters are a part of Event and can be used to communiticate between different tasks that are part of the same workflow execution.
         */
        parameters?: Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameterEntry[];
    }
    /**
     * Describes string and array limits when writing to logs. When a limit is exceeded the *shortener_type* describes how to shorten the field. next_id: 6
     */
    export interface Schema$EnterpriseCrmLoggingGwsFieldLimits {
        logAction?: string | null;
        /**
         * To which type(s) of logs the limits apply.
         */
        logType?: string[] | null;
        /**
         * maximum array size. If the array exceds this size, the field (list) is truncated.
         */
        maxArraySize?: number | null;
        /**
         * maximum string length. If the field exceeds this amount the field is shortened.
         */
        maxStringLength?: number | null;
        shortenerType?: string | null;
    }
    /**
     * Identifies whether a field contains, or may contain, PII or sensitive data, and how to sanitize the field if it does. If a field's privacy type cannot be determined then it is sanitized (e.g., scrubbed). The specific sanitizer implementation is determined by run-time configuration and environment options (e.g., prod vs. qa). next_id: 5
     */
    export interface Schema$EnterpriseCrmLoggingGwsSanitizeOptions {
        /**
         * If true, the value has already been sanitized and needs no further sanitization. For instance, a D3 customer id is already an obfuscated entity and *might not* need further sanitization.
         */
        isAlreadySanitized?: boolean | null;
        /**
         * To which type(s) of logs the sanitize options apply.
         */
        logType?: string[] | null;
        privacy?: string | null;
        sanitizeType?: string | null;
    }
    /**
     * AuthConfig defines details of a authentication type.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfig {
        /**
         * List containing additional auth configs.
         */
        additionalVariables?: Schema$GoogleCloudConnectorsV1ConfigVariable[];
        /**
         * The type of authentication configured.
         */
        authType?: string | null;
        /**
         * Oauth2AuthCodeFlow.
         */
        oauth2AuthCodeFlow?: Schema$GoogleCloudConnectorsV1AuthConfigOauth2AuthCodeFlow;
        /**
         * Oauth2ClientCredentials.
         */
        oauth2ClientCredentials?: Schema$GoogleCloudConnectorsV1AuthConfigOauth2ClientCredentials;
        /**
         * Oauth2JwtBearer.
         */
        oauth2JwtBearer?: Schema$GoogleCloudConnectorsV1AuthConfigOauth2JwtBearer;
        /**
         * SSH Public Key.
         */
        sshPublicKey?: Schema$GoogleCloudConnectorsV1AuthConfigSshPublicKey;
        /**
         * UserPassword.
         */
        userPassword?: Schema$GoogleCloudConnectorsV1AuthConfigUserPassword;
    }
    /**
     * Parameters to support Oauth 2.0 Auth Code Grant Authentication. See https://www.rfc-editor.org/rfc/rfc6749#section-1.3.1 for more details.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigOauth2AuthCodeFlow {
        /**
         * Authorization code to be exchanged for access and refresh tokens.
         */
        authCode?: string | null;
        /**
         * Client ID for user-provided OAuth app.
         */
        clientId?: string | null;
        /**
         * Client secret for user-provided OAuth app.
         */
        clientSecret?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Whether to enable PKCE when the user performs the auth code flow.
         */
        enablePkce?: boolean | null;
        /**
         * PKCE verifier to be used during the auth code exchange.
         */
        pkceVerifier?: string | null;
        /**
         * Redirect URI to be provided during the auth code exchange.
         */
        redirectUri?: string | null;
        /**
         * Scopes the connection will request when the user performs the auth code flow.
         */
        scopes?: string[] | null;
    }
    /**
     * Parameters to support Oauth 2.0 Client Credentials Grant Authentication. See https://tools.ietf.org/html/rfc6749#section-1.3.4 for more details.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigOauth2ClientCredentials {
        /**
         * The client identifier.
         */
        clientId?: string | null;
        /**
         * Secret version reference containing the client secret.
         */
        clientSecret?: Schema$GoogleCloudConnectorsV1Secret;
    }
    /**
     * Parameters to support JSON Web Token (JWT) Profile for Oauth 2.0 Authorization Grant based authentication. See https://tools.ietf.org/html/rfc7523 for more details.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigOauth2JwtBearer {
        /**
         * Secret version reference containing a PKCS#8 PEM-encoded private key associated with the Client Certificate. This private key will be used to sign JWTs used for the jwt-bearer authorization grant. Specified in the form as: `projects/x/secrets/x/versions/x`.
         */
        clientKey?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * JwtClaims providers fields to generate the token.
         */
        jwtClaims?: Schema$GoogleCloudConnectorsV1AuthConfigOauth2JwtBearerJwtClaims;
    }
    /**
     * JWT claims used for the jwt-bearer authorization grant.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigOauth2JwtBearerJwtClaims {
        /**
         * Value for the "aud" claim.
         */
        audience?: string | null;
        /**
         * Value for the "iss" claim.
         */
        issuer?: string | null;
        /**
         * Value for the "sub" claim.
         */
        subject?: string | null;
    }
    /**
     * Parameters to support Ssh public key Authentication.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigSshPublicKey {
        /**
         * Format of SSH Client cert.
         */
        certType?: string | null;
        /**
         * SSH Client Cert. It should contain both public and private key.
         */
        sshClientCert?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Password (passphrase) for ssh client certificate if it has one.
         */
        sshClientCertPass?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * The user account used to authenticate.
         */
        username?: string | null;
    }
    /**
     * Parameters to support Username and Password Authentication.
     */
    export interface Schema$GoogleCloudConnectorsV1AuthConfigUserPassword {
        /**
         * Secret version reference containing the password.
         */
        password?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Username.
         */
        username?: string | null;
    }
    /**
     * ConfigVariable represents a configuration variable present in a Connection. or AuthConfig.
     */
    export interface Schema$GoogleCloudConnectorsV1ConfigVariable {
        /**
         * Value is a bool.
         */
        boolValue?: boolean | null;
        /**
         * Value is an integer
         */
        intValue?: string | null;
        /**
         * Key of the config variable.
         */
        key?: string | null;
        /**
         * Value is a secret.
         */
        secretValue?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Value is a string.
         */
        stringValue?: string | null;
    }
    /**
     * Connection represents an instance of connector.
     */
    export interface Schema$GoogleCloudConnectorsV1Connection {
        /**
         * Optional. Configuration for establishing the connection's authentication with an external system.
         */
        authConfig?: Schema$GoogleCloudConnectorsV1AuthConfig;
        /**
         * Optional. Configuration for configuring the connection with an external system.
         */
        configVariables?: Schema$GoogleCloudConnectorsV1ConfigVariable[];
        /**
         * Required. Connector version on which the connection is created. The format is: projects/x/locations/x/providers/x/connectors/x/versions/x Only global location is supported for ConnectorVersion resource.
         */
        connectorVersion?: string | null;
        /**
         * Output only. Created time.
         */
        createTime?: string | null;
        /**
         * Optional. Description of the resource.
         */
        description?: string | null;
        /**
         * Optional. Configuration of the Connector's destination. Only accepted for Connectors that accepts user defined destination(s).
         */
        destinationConfigs?: Schema$GoogleCloudConnectorsV1DestinationConfig[];
        /**
         * Output only. GCR location where the envoy image is stored. formatted like: gcr.io/{bucketName\}/{imageName\}
         */
        envoyImageLocation?: string | null;
        /**
         * Output only. GCR location where the runtime image is stored. formatted like: gcr.io/{bucketName\}/{imageName\}
         */
        imageLocation?: string | null;
        /**
         * Optional. Resource labels to represent user-provided metadata. Refer to cloud documentation on labels for more details. https://cloud.google.com/compute/docs/labeling-resources
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Configuration that indicates whether or not the Connection can be edited.
         */
        lockConfig?: Schema$GoogleCloudConnectorsV1LockConfig;
        /**
         * Optional. Log configuration for the connection.
         */
        logConfig?: Schema$GoogleCloudConnectorsV1LogConfig;
        /**
         * Output only. Resource name of the Connection. Format: projects/{project\}/locations/{location\}/connections/{connection\}
         */
        name?: string | null;
        /**
         * Optional. Node configuration for the connection.
         */
        nodeConfig?: Schema$GoogleCloudConnectorsV1NodeConfig;
        /**
         * Optional. Service account needed for runtime plane to access GCP resources.
         */
        serviceAccount?: string | null;
        /**
         * Output only. The name of the Service Directory service name. Used for Private Harpoon to resolve the ILB address. e.g. "projects/cloud-connectors-e2e-testing/locations/us-central1/namespaces/istio-system/services/istio-ingressgateway-connectors"
         */
        serviceDirectory?: string | null;
        /**
         * Optional. Ssl config of a connection
         */
        sslConfig?: Schema$GoogleCloudConnectorsV1SslConfig;
        /**
         * Output only. Current status of the connection.
         */
        status?: Schema$GoogleCloudConnectorsV1ConnectionStatus;
        /**
         * Optional. Suspended indicates if a user has suspended a connection or not.
         */
        suspended?: boolean | null;
        /**
         * Output only. Updated time.
         */
        updateTime?: string | null;
    }
    /**
     * ConnectionStatus indicates the state of the connection.
     */
    export interface Schema$GoogleCloudConnectorsV1ConnectionStatus {
        /**
         * Description.
         */
        description?: string | null;
        /**
         * State.
         */
        state?: string | null;
        /**
         * Status provides detailed information for the state.
         */
        status?: string | null;
    }
    export interface Schema$GoogleCloudConnectorsV1Destination {
        /**
         * For publicly routable host.
         */
        host?: string | null;
        /**
         * The port is the target port number that is accepted by the destination.
         */
        port?: number | null;
        /**
         * PSC service attachments. Format: projects/x/regions/x/serviceAttachments/x
         */
        serviceAttachment?: string | null;
    }
    /**
     * Define the Connectors target endpoint.
     */
    export interface Schema$GoogleCloudConnectorsV1DestinationConfig {
        /**
         * The destinations for the key.
         */
        destinations?: Schema$GoogleCloudConnectorsV1Destination[];
        /**
         * The key is the destination identifier that is supported by the Connector.
         */
        key?: string | null;
    }
    /**
     * Determines whether or no a connection is locked. If locked, a reason must be specified.
     */
    export interface Schema$GoogleCloudConnectorsV1LockConfig {
        /**
         * Indicates whether or not the connection is locked.
         */
        locked?: boolean | null;
        /**
         * Describes why a connection is locked.
         */
        reason?: string | null;
    }
    /**
     * Log configuration for the connection.
     */
    export interface Schema$GoogleCloudConnectorsV1LogConfig {
        /**
         * Enabled represents whether logging is enabled or not for a connection.
         */
        enabled?: boolean | null;
    }
    /**
     * Node configuration for the connection.
     */
    export interface Schema$GoogleCloudConnectorsV1NodeConfig {
        /**
         * Maximum number of nodes in the runtime nodes.
         */
        maxNodeCount?: number | null;
        /**
         * Minimum number of nodes in the runtime nodes.
         */
        minNodeCount?: number | null;
    }
    /**
     * Secret provides a reference to entries in Secret Manager.
     */
    export interface Schema$GoogleCloudConnectorsV1Secret {
        /**
         * The resource name of the secret version in the format, format as: `projects/x/secrets/x/versions/x`.
         */
        secretVersion?: string | null;
    }
    /**
     * SSL Configuration of a connection
     */
    export interface Schema$GoogleCloudConnectorsV1SslConfig {
        /**
         * Additional SSL related field values
         */
        additionalVariables?: Schema$GoogleCloudConnectorsV1ConfigVariable[];
        /**
         * Client Certificate
         */
        clientCertificate?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Type of Client Cert (PEM/JKS/.. etc.)
         */
        clientCertType?: string | null;
        /**
         * Client Private Key
         */
        clientPrivateKey?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Secret containing the passphrase protecting the Client Private Key
         */
        clientPrivateKeyPass?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Private Server Certificate. Needs to be specified if trust model is `PRIVATE`.
         */
        privateServerCertificate?: Schema$GoogleCloudConnectorsV1Secret;
        /**
         * Type of Server Cert (PEM/JKS/.. etc.)
         */
        serverCertType?: string | null;
        /**
         * Trust Model of the SSL connection
         */
        trustModel?: string | null;
        /**
         * Controls the ssl type for the given connector version.
         */
        type?: string | null;
        /**
         * Bool for enabling SSL
         */
        useSsl?: boolean | null;
    }
    /**
     * The access token represents the authorization of a specific application to access specific parts of a user’s data.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaAccessToken {
        /**
         * The access token encapsulating the security identity of a process or thread.
         */
        accessToken?: string | null;
        /**
         * Required. The approximate time until the access token retrieved is valid.
         */
        accessTokenExpireTime?: string | null;
        /**
         * If the access token will expire, use the refresh token to obtain another access token.
         */
        refreshToken?: string | null;
        /**
         * The approximate time until the refresh token retrieved is valid.
         */
        refreshTokenExpireTime?: string | null;
        /**
         * Only support "bearer" token in v1 as bearer token is the predominant type used with OAuth 2.0.
         */
        tokenType?: string | null;
    }
    /**
     * Status for the execution attempt.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaAttemptStats {
        /**
         * The end time of the event execution for current attempt.
         */
        endTime?: string | null;
        /**
         * The start time of the event execution for current attempt. This could be in the future if it's been scheduled.
         */
        startTime?: string | null;
    }
    /**
     * The AuthConfig resource use to hold channels and connection config data.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaAuthConfig {
        /**
         * Certificate id for client certificate
         */
        certificateId?: string | null;
        /**
         * Output only. The timestamp when the auth config is created.
         */
        createTime?: string | null;
        /**
         * The creator's email address. Generated based on the End User Credentials/LOAS role of the user making the call.
         */
        creatorEmail?: string | null;
        /**
         * Credential type of the encrypted credential.
         */
        credentialType?: string | null;
        /**
         * Raw auth credentials.
         */
        decryptedCredential?: Schema$GoogleCloudIntegrationsV1alphaCredential;
        /**
         * A description of the auth config.
         */
        description?: string | null;
        /**
         * The name of the auth config.
         */
        displayName?: string | null;
        /**
         * Auth credential encrypted by Cloud KMS. Can be decrypted as Credential with proper KMS key.
         */
        encryptedCredential?: string | null;
        /**
         * User can define the time to receive notification after which the auth config becomes invalid. Support up to 30 days. Support granularity in hours.
         */
        expiryNotificationDuration?: string[] | null;
        /**
         * The last modifier's email address. Generated based on the End User Credentials/LOAS role of the user making the call.
         */
        lastModifierEmail?: string | null;
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/authConfigs/{authConfig\}.
         */
        name?: string | null;
        /**
         * User provided expiry time to override. For the example of Salesforce, username/password credentials can be valid for 6 months depending on the instance settings.
         */
        overrideValidTime?: string | null;
        /**
         * The reason / details of the current status.
         */
        reason?: string | null;
        /**
         * The status of the auth config.
         */
        state?: string | null;
        /**
         * Output only. The timestamp when the auth config is modified.
         */
        updateTime?: string | null;
        /**
         * The time until the auth config is valid. Empty or max value is considered the auth config won't expire.
         */
        validTime?: string | null;
        /**
         * The visibility of the auth config.
         */
        visibility?: string | null;
    }
    /**
     * The credentials to authenticate a user agent with a server that is put in HTTP Authorization request header.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaAuthToken {
        /**
         * The token for the auth type.
         */
        token?: string | null;
        /**
         * Authentication type, e.g. "Basic", "Bearer", etc.
         */
        type?: string | null;
    }
    /**
     * This message only contains a field of boolean array.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaBooleanParameterArray {
        /**
         * Boolean array.
         */
        booleanValues?: boolean[] | null;
    }
    /**
     * Request for cancelling an execution.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCancelExecutionRequest {
    }
    /**
     * Response for cancelling an execution.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse {
        /**
         * True if cancellation performed successfully
         */
        isCanceled?: boolean | null;
    }
    /**
     * The certificate definition
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCertificate {
        /**
         * Status of the certificate
         */
        certificateStatus?: string | null;
        /**
         * Immutable. Credential id that will be used to register with trawler INTERNAL_ONLY
         */
        credentialId?: string | null;
        /**
         * Description of the certificate
         */
        description?: string | null;
        /**
         * Name of the certificate
         */
        displayName?: string | null;
        /**
         * Output only. Auto generated primary key
         */
        name?: string | null;
        /**
         * Input only. Raw client certificate which would be registered with trawler
         */
        rawCertificate?: Schema$GoogleCloudIntegrationsV1alphaClientCertificate;
        /**
         * Immutable. Requestor ID to be used to register certificate with trawler
         */
        requestorId?: string | null;
        /**
         * Output only. The timestamp after which certificate will expire
         */
        validEndTime?: string | null;
        /**
         * Output only. The timestamp after which certificate will be valid
         */
        validStartTime?: string | null;
    }
    /**
     * Contains client certificate information
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaClientCertificate {
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        encryptedPrivateKey?: string | null;
        /**
         * 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         */
        passphrase?: string | null;
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        sslCertificate?: string | null;
    }
    /**
     * Cloud Scheduler Trigger configuration
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCloudSchedulerConfig {
        /**
         * Required. The cron tab of cloud scheduler trigger.
         */
        cronTab?: string | null;
        /**
         * Optional. When the job was deleted from Pantheon UI, error_message will be populated when Get/List integrations
         */
        errorMessage?: string | null;
        /**
         * Required. The location where associated cloud scheduler job will be created
         */
        location?: string | null;
        /**
         * Required. Service account used by Cloud Scheduler to trigger the integration at scheduled time
         */
        serviceAccountEmail?: string | null;
    }
    /**
     * Metadata of runtime connection schema.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata {
        /**
         * List of actions.
         */
        actions?: string[] | null;
        /**
         * List of entity names.
         */
        entities?: string[] | null;
    }
    /**
     * Configuration detail of coordinate, it used for UI
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCoordinate {
        /**
         * Required. X axis of the coordinate
         */
        x?: number | null;
        /**
         * Required. Y axis of the coordinate
         */
        y?: number | null;
    }
    /**
     * Request for CreateAppsScriptProject rpc call.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectRequest {
        /**
         * The name of the Apps Script project to be created.
         */
        appsScriptProject?: string | null;
        /**
         * The auth config id necessary to fetch the necessary credentials to create the project for external clients
         */
        authConfigId?: string | null;
    }
    /**
     * Response for CreateAppsScriptProject rpc call.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse {
        /**
         * The created AppsScriptProject ID.
         */
        projectId?: string | null;
    }
    /**
     * Defines parameters for a single, canonical credential.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaCredential {
        /**
         * Auth token credential
         */
        authToken?: Schema$GoogleCloudIntegrationsV1alphaAuthToken;
        /**
         * Credential type associated with auth config.
         */
        credentialType?: string | null;
        /**
         * JWT credential
         */
        jwt?: Schema$GoogleCloudIntegrationsV1alphaJwt;
        /**
         * The api_key and oauth2_implicit are not covered in v1 and will be picked up once v1 is implemented. ApiKey api_key = 3; OAuth2 authorization code credential
         */
        oauth2AuthorizationCode?: Schema$GoogleCloudIntegrationsV1alphaOAuth2AuthorizationCode;
        /**
         * OAuth2Implicit oauth2_implicit = 5; OAuth2 client credentials
         */
        oauth2ClientCredentials?: Schema$GoogleCloudIntegrationsV1alphaOAuth2ClientCredentials;
        /**
         * OAuth2 resource owner credentials
         */
        oauth2ResourceOwnerCredentials?: Schema$GoogleCloudIntegrationsV1alphaOAuth2ResourceOwnerCredentials;
        /**
         * Google OIDC ID Token
         */
        oidcToken?: Schema$GoogleCloudIntegrationsV1alphaOidcToken;
        /**
         * Service account credential
         */
        serviceAccountCredentials?: Schema$GoogleCloudIntegrationsV1alphaServiceAccountCredentials;
        /**
         * Username and password credential
         */
        usernameAndPassword?: Schema$GoogleCloudIntegrationsV1alphaUsernameAndPassword;
    }
    /**
     * This message only contains a field of double number array.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaDoubleParameterArray {
        /**
         * Double number array.
         */
        doubleValues?: number[] | null;
    }
    /**
     * Response for DownloadIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse {
        /**
         * String representation of the integration version.
         */
        content?: string | null;
    }
    /**
     * Response containing all provisioned regions for Connector Platform.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse {
        /**
         * All regions where Connector Platform is provisioned.
         */
        regions?: string[] | null;
    }
    /**
     * Configuration detail of a error catch task
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaErrorCatcherConfig {
        /**
         * Optional. User-provided description intended to give more business context about the error catcher config.
         */
        description?: string | null;
        /**
         * Required. An error catcher id is string representation for the error catcher config. Within a workflow, error_catcher_id uniquely identifies an error catcher config among all error catcher configs for the workflow
         */
        errorCatcherId?: string | null;
        /**
         * Required. A number to uniquely identify each error catcher config within the workflow on UI.
         */
        errorCatcherNumber?: string | null;
        /**
         * Optional. The user created label for a particular error catcher. Optional.
         */
        label?: string | null;
        /**
         * Optional. Informs the front-end application where to draw this error catcher config on the UI.
         */
        position?: Schema$GoogleCloudIntegrationsV1alphaCoordinate;
        /**
         * Required. The set of start tasks that are to be executed for the error catch flow
         */
        startErrorTasks?: Schema$GoogleCloudIntegrationsV1alphaNextTask[];
    }
    /**
     * This message is used for processing and persisting (when applicable) key value pair parameters for each event in the event bus.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaEventParameter {
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given fired event. These parameters must be predefined in the integration definition.
         */
        key?: string | null;
        /**
         * Values for the defined keys. Each value can either be string, int, double or any proto message.
         */
        value?: Schema$GoogleCloudIntegrationsV1alphaValueType;
    }
    /**
     * The request for executing an integration.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsRequest {
        /**
         * Optional. Flag to determine how to should propagate errors. If this flag is set to be true, it will not throw an exception. Instead, it will return a {@link ExecuteIntegrationsResponse\} with an execution id and error messages as PostWithTriggerIdExecutionException in {@link EventParameters\}. The flag is set to be false by default.
         */
        doNotPropagateError?: boolean | null;
        /**
         * Optional. The id of the ON_HOLD execution to be resumed.
         */
        executionId?: string | null;
        /**
         * Optional. Input parameters used by integration execution.
         */
        inputParameters?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaValueType;
        } | null;
        /**
         * Optional. Parameters are a part of Event and can be used to communicate between different tasks that are part of the same integration execution.
         */
        parameterEntries?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
        /**
         * Optional. Passed in as parameters to each integration execution. Redacted
         */
        parameters?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Optional. This is used to de-dup incoming request: if the duplicate request was detected, the response from the previous execution is returned.
         */
        requestId?: string | null;
        /**
         * Required. Matched against all {@link TriggerConfig\}s across all integrations. i.e. TriggerConfig.trigger_id.equals(trigger_id). The trigger_id is in the format of `api_trigger/TRIGGER_NAME`.
         */
        triggerId?: string | null;
    }
    /**
     * The response for executing an integration.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse {
        /**
         * Details for the integration that were executed.
         */
        eventParameters?: Schema$EnterpriseCrmFrontendsEventbusProtoEventParameters;
        /**
         * Is true if any execution in the integration failed. False otherwise.
         */
        executionFailed?: boolean | null;
        /**
         * The id of the execution corresponding to this run of integration.
         */
        executionId?: string | null;
        /**
         * OUTPUT parameters in format of Map. Where Key is the name of the parameter. Note: Name of the system generated parameters are wrapped by backtick(`) to distinguish them from the user defined parameters.
         */
        outputParameters?: {
            [key: string]: any;
        } | null;
        /**
         * Parameters are a part of Event and can be used to communicate between different tasks that are part of the same integration execution.
         */
        parameterEntries?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
    }
    /**
     * The Execution resource contains detailed information of an individual integration execution.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecution {
        /**
         * Output only. Created time of the execution.
         */
        createTime?: string | null;
        /**
         * Direct sub executions of the following Execution.
         */
        directSubExecutions?: Schema$GoogleCloudIntegrationsV1alphaExecution[];
        /**
         * The execution info about this event.
         */
        eventExecutionDetails?: Schema$EnterpriseCrmEventbusProtoEventExecutionDetails;
        /**
         * Detailed info of this execution.
         */
        executionDetails?: Schema$GoogleCloudIntegrationsV1alphaExecutionDetails;
        /**
         * The ways user posts this event.
         */
        executionMethod?: string | null;
        /**
         * Auto-generated primary key.
         */
        name?: string | null;
        /**
         * Event parameters come in as part of the request.
         */
        requestParameters?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaValueType;
        } | null;
        /**
         * Event parameters come in as part of the request.
         */
        requestParams?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
        /**
         * Event parameters returned as part of the response.
         */
        responseParameters?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaValueType;
        } | null;
        /**
         * Event parameters come out as part of the response.
         */
        responseParams?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
        /**
         * The trigger id of the integration trigger config. If both trigger_id and client_id is present, the integration is executed from the start tasks provided by the matching trigger config otherwise it is executed from the default start tasks.
         */
        triggerId?: string | null;
        /**
         * Output only. Last modified time of the execution.
         */
        updateTime?: string | null;
    }
    /**
     * Contains the details of the execution info: this includes the tasks execution details plus the event execution statistics.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecutionDetails {
        /**
         * List of Start and end time of the execution attempts.
         */
        attemptStats?: Schema$GoogleCloudIntegrationsV1alphaAttemptStats[];
        /**
         * List of snapshots taken during the execution.
         */
        executionSnapshots?: Schema$GoogleCloudIntegrationsV1alphaExecutionSnapshot[];
        /**
         * Status of the execution.
         */
        state?: string | null;
    }
    /**
     * Contains the snapshot of the execution for a given checkpoint.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecutionSnapshot {
        /**
         * Indicates "after which checkpoint task's execution" this snapshot is taken.
         */
        checkpointTaskNumber?: string | null;
        /**
         * Metadata of the execution snapshot.
         */
        executionSnapshotMetadata?: Schema$GoogleCloudIntegrationsV1alphaExecutionSnapshotExecutionSnapshotMetadata;
        /**
         * Parameters used during the execution.
         */
        params?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaValueType;
        } | null;
        /**
         * All of the task execution details at the given point of time.
         */
        taskExecutionDetails?: Schema$GoogleCloudIntegrationsV1alphaTaskExecutionDetails[];
    }
    /**
     * Metadata of the execution snapshot.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaExecutionSnapshotExecutionSnapshotMetadata {
        /**
         * the execution attempt number this snapshot belongs to.
         */
        executionAttempt?: number | null;
        /**
         * the task name associated with this snapshot.
         */
        task?: string | null;
        /**
         * the task attempt number this snapshot belongs to.
         */
        taskAttempt?: number | null;
        /**
         * the task label associated with this snapshot. Could be empty.
         */
        taskLabel?: string | null;
        /**
         * The task number associated with this snapshot.
         */
        taskNumber?: string | null;
    }
    /**
     * Policy that defines the task retry logic and failure type. If no FailurePolicy is defined for a task, all its dependent tasks will not be executed (i.e, a `retry_strategy` of NONE will be applied).
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaFailurePolicy {
        /**
         * Required if retry_strategy is FIXED_INTERVAL or LINEAR/EXPONENTIAL_BACKOFF/RESTART_INTEGRATION_WITH_BACKOFF. Defines the initial interval in seconds for backoff.
         */
        intervalTime?: string | null;
        /**
         * Required if retry_strategy is FIXED_INTERVAL or LINEAR/EXPONENTIAL_BACKOFF/RESTART_INTEGRATION_WITH_BACKOFF. Defines the number of times the task will be retried if failed.
         */
        maxRetries?: number | null;
        /**
         * Defines what happens to the task upon failure.
         */
        retryStrategy?: string | null;
    }
    /**
     * Returns success or error message
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse {
        /**
         * The message that notifies the user if the request succeeded or not.
         */
        message?: string | null;
    }
    /**
     * The integration definition.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegration {
        /**
         * Required. If any integration version is published.
         */
        active?: boolean | null;
        /**
         * Optional.
         */
        description?: string | null;
        /**
         * Required. The resource name of the integration.
         */
        name?: string | null;
        /**
         * Output only. Auto-generated.
         */
        updateTime?: string | null;
    }
    /**
     * Message to be used to configure custom alerting in the {@code EventConfig\} protos for an event.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegrationAlertConfig {
        /**
         * The period over which the metric value should be aggregated and evaluated. Format is , where integer should be a positive integer and unit should be one of (s,m,h,d,w) meaning (second, minute, hour, day, week). For an EXPECTED_MIN threshold, this aggregation_period must be lesser than 24 hours.
         */
        aggregationPeriod?: string | null;
        /**
         * For how many contiguous aggregation periods should the expected min or max be violated for the alert to be fired.
         */
        alertThreshold?: number | null;
        /**
         * Set to false by default. When set to true, the metrics are not aggregated or pushed to Monarch for this integration alert.
         */
        disableAlert?: boolean | null;
        /**
         * Name of the alert. This will be displayed in the alert subject. If set, this name should be unique within the scope of the integration.
         */
        displayName?: string | null;
        /**
         * Should be specified only for *AVERAGE_DURATION and *PERCENTILE_DURATION metrics. This member should be used to specify what duration value the metrics should exceed for the alert to trigger.
         */
        durationThreshold?: string | null;
        /**
         * The type of metric.
         */
        metricType?: string | null;
        /**
         * For either events or tasks, depending on the type of alert, count only final attempts, not retries.
         */
        onlyFinalAttempt?: boolean | null;
        /**
         * The threshold type, whether lower(expected_min) or upper(expected_max), for which this alert is being configured. If value falls below expected_min or exceeds expected_max, an alert will be fired.
         */
        thresholdType?: string | null;
        /**
         * The metric value, above or below which the alert should be triggered.
         */
        thresholdValue?: Schema$GoogleCloudIntegrationsV1alphaIntegrationAlertConfigThresholdValue;
    }
    /**
     * The threshold value of the metric, above or below which the alert should be triggered. See EventAlertConfig or TaskAlertConfig for the different alert metric types in each case. For the *RATE metrics, one or both of these fields may be set. Zero is the default value and can be left at that. For *PERCENTILE_DURATION metrics, one or both of these fields may be set, and also, the duration threshold value should be specified in the threshold_duration_ms member below. For *AVERAGE_DURATION metrics, these fields should not be set at all. A different member, threshold_duration_ms, must be set in the EventAlertConfig or the TaskAlertConfig.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegrationAlertConfigThresholdValue {
        /**
         * Absolute value threshold.
         */
        absolute?: string | null;
        /**
         * Percentage threshold.
         */
        percentage?: number | null;
    }
    /**
     * Integration Parameter is defined in the integration config and are used to provide information about data types of the expected parameters and provide any default values if needed. They can also be used to add custom attributes. These are static in nature and should not be used for dynamic event definition.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegrationParameter {
        /**
         * Type of the parameter.
         */
        dataType?: string | null;
        /**
         * Default values for the defined keys. Each value can either be string, int, double or any proto message or a serialized object.
         */
        defaultValue?: Schema$GoogleCloudIntegrationsV1alphaValueType;
        /**
         * The name (without prefix) to be displayed in the UI for this parameter. E.g. if the key is "foo.bar.myName", then the name would be "myName".
         */
        displayName?: string | null;
        /**
         * Specifies the input/output type for the parameter.
         */
        inputOutputType?: string | null;
        /**
         * Whether this parameter is a transient parameter.
         */
        isTransient?: boolean | null;
        /**
         * This schema will be used to validate runtime JSON-typed values of this parameter.
         */
        jsonSchema?: string | null;
        /**
         * Key is used to retrieve the corresponding parameter value. This should be unique for a given fired event. These parameters must be predefined in the integration definition.
         */
        key?: string | null;
        /**
         * The identifier of the node (TaskConfig/TriggerConfig) this parameter was produced by, if it is a transient param or a copy of an input param.
         */
        producer?: string | null;
        /**
         * Searchable in the execution log or not.
         */
        searchable?: boolean | null;
    }
    /**
     * IntegrationTemplateVersion definition. An IntegrationTemplateVersion provides configurations required to construct an IntegrationVersion. It cannot be executed directly like an Integration. Users can create IntegrationTemplateVersions using Integrations. These Templates can be shared by users across GCP projects.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion {
        /**
         * Output only. Auto-generated.
         */
        createTime?: string | null;
        /**
         * Optional. Flag to disable database persistence for execution data, including event execution info, execution export info, execution metadata index and execution param index.
         */
        databasePersistencePolicy?: string | null;
        /**
         * Optional. The templateversion description. Permitted format is alphanumeric with underscores and no spaces.
         */
        description?: string | null;
        /**
         * Optional. Error Catch Task configuration for the IntegrationTemplateVersion. It's optional.
         */
        errorCatcherConfigs?: Schema$GoogleCloudIntegrationsV1alphaErrorCatcherConfig[];
        /**
         * Optional. The last modifier's email address. Generated based on the End User Credentials/LOAS role of the user making the call.
         */
        lastModifierEmail?: string | null;
        /**
         * Output only. Auto-generated primary key. Format: projects/{project\}/locations/{location\}/products/{product\}/integrationtemplates/{integrationtemplate\}/versions/{version\}
         */
        name?: string | null;
        /**
         * Optional. ID of the IntegrationVersion that was used to create this IntegrationTemplateVersion
         */
        parentIntegrationVersionId?: string | null;
        /**
         * Output only. An increasing sequence that is set when a new snapshot is created.
         */
        snapshotNumber?: string | null;
        /**
         * Optional. Generated by eventbus. User should not set it as an input.
         */
        status?: string | null;
        /**
         * Optional. Task configuration for the IntegrationTemplateVersion. It's optional, but the IntegrationTemplateVersion doesn't do anything without task_configs.
         */
        taskConfigs?: Schema$EnterpriseCrmFrontendsEventbusProtoTaskConfig[];
        /**
         * Optional. Contains a graph of tasks that will be executed before putting the event in a terminal state (SUCCEEDED/FAILED/FATAL), regardless of success or failure, similar to "finally" in code.
         */
        teardown?: Schema$EnterpriseCrmEventbusProtoTeardown;
        /**
         * Optional. Parameters that are expected to be passed to the IntegrationTemplateVersion when an event is triggered. This consists of all the parameters that are expected in the IntegrationTemplateVersion execution. This gives the user the ability to provide default values, add information like PII and also provide data types of each parameter.
         */
        templateParameters?: Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameters;
        /**
         * Optional. Trigger configurations.
         */
        triggerConfigs?: Schema$EnterpriseCrmFrontendsEventbusProtoTriggerConfig[];
        /**
         * Output only. Auto-generated.
         */
        updateTime?: string | null;
        /**
         * Optional. A user-defined label that annotates an integration version. Typically, this is only set when the integration version is created.
         */
        userLabel?: string | null;
    }
    /**
     * The integration version definition.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion {
        /**
         * Output only. Auto-generated.
         */
        createTime?: string | null;
        /**
         * Optional. Flag to disable database persistence for execution data, including event execution info, execution export info, execution metadata index and execution param index.
         */
        databasePersistencePolicy?: string | null;
        /**
         * Optional. The integration description.
         */
        description?: string | null;
        /**
         * Optional. Error Catch Task configuration for the integration. It's optional.
         */
        errorCatcherConfigs?: Schema$GoogleCloudIntegrationsV1alphaErrorCatcherConfig[];
        /**
         * Optional. Parameters that are expected to be passed to the integration when an event is triggered. This consists of all the parameters that are expected in the integration execution. This gives the user the ability to provide default values, add information like PII and also provide data types of each parameter.
         */
        integrationParameters?: Schema$GoogleCloudIntegrationsV1alphaIntegrationParameter[];
        /**
         * Optional. Parameters that are expected to be passed to the integration when an event is triggered. This consists of all the parameters that are expected in the integration execution. This gives the user the ability to provide default values, add information like PII and also provide data types of each parameter.
         */
        integrationParametersInternal?: Schema$EnterpriseCrmFrontendsEventbusProtoWorkflowParameters;
        /**
         * Optional. The last modifier's email address. Generated based on the End User Credentials/LOAS role of the user making the call.
         */
        lastModifierEmail?: string | null;
        /**
         * Optional. The edit lock holder's email address. Generated based on the End User Credentials/LOAS role of the user making the call.
         */
        lockHolder?: string | null;
        /**
         * Output only. Auto-generated primary key.
         */
        name?: string | null;
        /**
         * Optional. The origin that indicates where this integration is coming from.
         */
        origin?: string | null;
        /**
         * Optional. The id of the template which was used to create this integration_version.
         */
        parentTemplateId?: string | null;
        /**
         * Optional. The run-as service account email, if set and auth config is not configured, that will be used to generate auth token to be used in Connector task, Rest caller task and Cloud function task.
         */
        runAsServiceAccount?: string | null;
        /**
         * Optional. An increasing sequence that is set when a new snapshot is created. The last created snapshot can be identified by [workflow_name, org_id latest(snapshot_number)]. However, last created snapshot need not be same as the HEAD. So users should always use "HEAD" tag to identify the head.
         */
        snapshotNumber?: string | null;
        /**
         * Output only. User should not set it as an input.
         */
        state?: string | null;
        /**
         * Output only. Generated by eventbus. User should not set it as an input.
         */
        status?: string | null;
        /**
         * Optional. Task configuration for the integration. It's optional, but the integration doesn't do anything without task_configs.
         */
        taskConfigs?: Schema$GoogleCloudIntegrationsV1alphaTaskConfig[];
        /**
         * Optional. Task configuration for the integration. It's optional, but the integration doesn't do anything without task_configs.
         */
        taskConfigsInternal?: Schema$EnterpriseCrmFrontendsEventbusProtoTaskConfig[];
        /**
         * Optional. Contains a graph of tasks that will be executed before putting the event in a terminal state (SUCCEEDED/FAILED/FATAL), regardless of success or failure, similar to "finally" in code.
         */
        teardown?: Schema$EnterpriseCrmEventbusProtoTeardown;
        /**
         * Optional. Trigger configurations.
         */
        triggerConfigs?: Schema$GoogleCloudIntegrationsV1alphaTriggerConfig[];
        /**
         * Optional. Trigger configurations.
         */
        triggerConfigsInternal?: Schema$EnterpriseCrmFrontendsEventbusProtoTriggerConfig[];
        /**
         * Output only. Auto-generated.
         */
        updateTime?: string | null;
        /**
         * Optional. A user-defined label that annotates an integration version. Typically, this is only set when the integration version is created.
         */
        userLabel?: string | null;
    }
    /**
     * This message only contains a field of integer array.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaIntParameterArray {
        /**
         * Integer array.
         */
        intValues?: string[] | null;
    }
    /**
     * Represents JSON web token(JWT), which is a compact, URL-safe means of representing claims to be transferred between two parties, enabling the claims to be digitally signed or integrity protected.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaJwt {
        /**
         * The token calculated by the header, payload and signature.
         */
        jwt?: string | null;
        /**
         * Identifies which algorithm is used to generate the signature.
         */
        jwtHeader?: string | null;
        /**
         * Contains a set of claims. The JWT specification defines seven Registered Claim Names which are the standard fields commonly included in tokens. Custom claims are usually also included, depending on the purpose of the token.
         */
        jwtPayload?: string | null;
        /**
         * User's pre-shared secret to sign the token.
         */
        secret?: string | null;
    }
    /**
     * Request for lift Suspension
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionRequest {
        /**
         * User passed in suspension result and will be used to control workflow execution branching behavior by setting up corresponnding edge condition with suspension result. For example, if you want to lift the suspension, you can pass "Approved", or if you want to reject the suspension and terminate workfloe execution, you can pass "Rejected" and terminate the workflow execution with configuring the edge condition.
         */
        suspensionResult?: string | null;
    }
    /**
     * Response of lift Suspense
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse {
        /**
         * Execution Id that will be returned
         */
        eventExecutionInfoId?: string | null;
    }
    /**
     * Request for LinkAppsScriptProject rpc call.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectRequest {
        /**
         * The id of the Apps Script project to be linked.
         */
        scriptId?: string | null;
    }
    /**
     * Response for LinkAppsScriptProject rpc call.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse {
        /**
         * The id of the linked Apps Script project.
         */
        scriptId?: string | null;
    }
    /**
     * Response to list AuthConfigs.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse {
        /**
         * The list of AuthConfigs retrieved.
         */
        authConfigs?: Schema$GoogleCloudIntegrationsV1alphaAuthConfig[];
        /**
         * The token used to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response to list Certificates.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse {
        /**
         * The list of Certificates retrieved.
         */
        certificates?: Schema$GoogleCloudIntegrationsV1alphaCertificate[];
        /**
         * The token used to retrieve the next page of results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response containing Connections listed by region.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse {
        /**
         * Connections.
         */
        connections?: Schema$GoogleCloudConnectorsV1Connection[];
        /**
         * Next page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for listing the integration execution data.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse {
        /**
         * Required. The detailed information of requested executions.
         */
        executionInfos?: Schema$EnterpriseCrmFrontendsEventbusProtoEventExecutionInfo[];
        /**
         * The detailed information of requested executions
         */
        executions?: Schema$GoogleCloudIntegrationsV1alphaExecution[];
        /**
         * The token used to retrieve the next page results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for ListIntegrations.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse {
        /**
         * The integrations which match the request.
         */
        integrations?: Schema$GoogleCloudIntegrationsV1alphaIntegration[];
        /**
         * The next page token for the response.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for IntegrationTemplateVersions.ListIntegrationTemplateVersions.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse {
        /**
         * The IntegrationTemplateVersions which match the request.
         */
        integrationTemplateVersions?: Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for ListIntegrationVersions.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse {
        /**
         * The integrations which match the request.
         */
        integrationVersions?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * Whether the user has no permission on the version or not.
         */
        noPermission?: boolean | null;
    }
    /**
     * Response for listing RuntimeActionSchemas for a specific Connection.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse {
        /**
         * Next page token.
         */
        nextPageToken?: string | null;
        /**
         * Runtime action schemas.
         */
        runtimeActionSchemas?: Schema$GoogleCloudIntegrationsV1alphaRuntimeActionSchema[];
    }
    /**
     * Response for listing RuntimeEntitySchemas for a specific Connection.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse {
        /**
         * Next page token.
         */
        nextPageToken?: string | null;
        /**
         * Runtime entity schemas.
         */
        runtimeEntitySchemas?: Schema$GoogleCloudIntegrationsV1alphaRuntimeEntitySchema[];
    }
    /**
     * Response to list SfdcChannels.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse {
        /**
         * The token used to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of SfdcChannels retrieved.
         */
        sfdcChannels?: Schema$GoogleCloudIntegrationsV1alphaSfdcChannel[];
    }
    /**
     * Response to list SfdcInstances.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse {
        /**
         * The token used to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The list of SfdcInstances retrieved.
         */
        sfdcInstances?: Schema$GoogleCloudIntegrationsV1alphaSfdcInstance[];
    }
    /**
     * Response for Suspensions.ListSuspensions.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse {
        /**
         * Token to retrieve the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The suspensions for the relevant execution which the caller has permissions to view and resolve.
         */
        suspensions?: Schema$GoogleCloudIntegrationsV1alphaSuspension[];
    }
    /**
     * The task that is next in line to be executed, if the condition specified evaluated to true.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaNextTask {
        /**
         * Standard filter expression for this task to become an eligible next task.
         */
        condition?: string | null;
        /**
         * User-provided description intended to give additional business context about the task.
         */
        description?: string | null;
        /**
         * User-provided label that is attached to this edge in the UI.
         */
        displayName?: string | null;
        /**
         * ID of the next task.
         */
        taskConfigId?: string | null;
        /**
         * Task number of the next task.
         */
        taskId?: string | null;
    }
    /**
     * The OAuth Type where the client sends request with the client id and requested scopes to auth endpoint. User sees a consent screen and auth code is received at specified redirect url afterwards. The auth code is then combined with the client id and secret and sent to the token endpoint in exchange for the access and refresh token. The refresh token can be used to fetch new access tokens.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaOAuth2AuthorizationCode {
        /**
         * The access token received from the token endpoint.
         */
        accessToken?: Schema$GoogleCloudIntegrationsV1alphaAccessToken;
        /**
         * Indicates if the user has opted in Google Reauth Policy. If opted in, the refresh token will be valid for 20 hours, after which time users must re-authenticate in order to obtain a new one.
         */
        applyReauthPolicy?: boolean | null;
        /**
         * The Auth Code that is used to initially retrieve the access token.
         */
        authCode?: string | null;
        /**
         * The auth url endpoint to send the auth code request to.
         */
        authEndpoint?: string | null;
        /**
         * The auth parameters sent along with the auth code request.
         */
        authParams?: Schema$GoogleCloudIntegrationsV1alphaParameterMap;
        /**
         * The client's id.
         */
        clientId?: string | null;
        /**
         * The client's secret.
         */
        clientSecret?: string | null;
        /**
         * Represent how to pass parameters to fetch access token
         */
        requestType?: string | null;
        /**
         * A space-delimited list of requested scope permissions.
         */
        scope?: string | null;
        /**
         * The token url endpoint to send the token request to.
         */
        tokenEndpoint?: string | null;
        /**
         * The token parameters sent along with the token request.
         */
        tokenParams?: Schema$GoogleCloudIntegrationsV1alphaParameterMap;
    }
    /**
     * For client credentials grant, the client sends a POST request with grant_type as 'client_credentials' to the authorization server. The authorization server will respond with a JSON object containing the access token.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaOAuth2ClientCredentials {
        /**
         * Access token fetched from the authorization server.
         */
        accessToken?: Schema$GoogleCloudIntegrationsV1alphaAccessToken;
        /**
         * The client's ID.
         */
        clientId?: string | null;
        /**
         * The client's secret.
         */
        clientSecret?: string | null;
        /**
         * Represent how to pass parameters to fetch access token
         */
        requestType?: string | null;
        /**
         * A space-delimited list of requested scope permissions.
         */
        scope?: string | null;
        /**
         * The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.
         */
        tokenEndpoint?: string | null;
        /**
         * Token parameters for the auth request.
         */
        tokenParams?: Schema$GoogleCloudIntegrationsV1alphaParameterMap;
    }
    /**
     * For resource owner credentials grant, the client will ask the user for their authorization credentials (ususally a username and password) and send a POST request to the authorization server. The authorization server will respond with a JSON object containing the access token.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaOAuth2ResourceOwnerCredentials {
        /**
         * Access token fetched from the authorization server.
         */
        accessToken?: Schema$GoogleCloudIntegrationsV1alphaAccessToken;
        /**
         * The client's ID.
         */
        clientId?: string | null;
        /**
         * The client's secret.
         */
        clientSecret?: string | null;
        /**
         * The user's password.
         */
        password?: string | null;
        /**
         * Represent how to pass parameters to fetch access token
         */
        requestType?: string | null;
        /**
         * A space-delimited list of requested scope permissions.
         */
        scope?: string | null;
        /**
         * The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.
         */
        tokenEndpoint?: string | null;
        /**
         * Token parameters for the auth request.
         */
        tokenParams?: Schema$GoogleCloudIntegrationsV1alphaParameterMap;
        /**
         * The user's username.
         */
        username?: string | null;
    }
    /**
     * OIDC Token
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaOidcToken {
        /**
         * Audience to be used when generating OIDC token. The audience claim identifies the recipients that the JWT is intended for.
         */
        audience?: string | null;
        /**
         * The service account email to be used as the identity for the token.
         */
        serviceAccountEmail?: string | null;
        /**
         * ID token obtained for the service account
         */
        token?: string | null;
        /**
         * The approximate time until the token retrieved is valid.
         */
        tokenExpireTime?: string | null;
    }
    /**
     * A generic multi-map that holds key value pairs. They keys and values can be of any type, unless specified.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaParameterMap {
        /**
         * A list of parameter map entries.
         */
        entries?: Schema$GoogleCloudIntegrationsV1alphaParameterMapEntry[];
        /**
         * Option to specify key type for all entries of the map. If provided then field types for all entries must conform to this.
         */
        keyType?: string | null;
        /**
         * Option to specify value type for all entries of the map. If provided then field types for all entries must conform to this.
         */
        valueType?: string | null;
    }
    /**
     * Entry is a pair of key and value.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaParameterMapEntry {
        /**
         * Key of the map entry.
         */
        key?: Schema$GoogleCloudIntegrationsV1alphaParameterMapField;
        /**
         * Value of the map entry.
         */
        value?: Schema$GoogleCloudIntegrationsV1alphaParameterMapField;
    }
    /**
     * Field represents either the key or value in an entry.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaParameterMapField {
        /**
         * Passing a literal value.
         */
        literalValue?: Schema$GoogleCloudIntegrationsV1alphaValueType;
        /**
         * Referencing one of the Integration variables.
         */
        referenceKey?: string | null;
    }
    /**
     * Request for PublishIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionRequest {
    }
    /**
     * Response for PublishIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse {
    }
    /**
     * Request for [Suspensions.ResolveSuspensions].
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionRequest {
        /**
         * Suspension, containing the event_execution_info_id, task_id, and state to set on the corresponding suspension record.
         */
        suspension?: Schema$GoogleCloudIntegrationsV1alphaSuspension;
    }
    /**
     * Response for Suspensions.ResolveSuspensions.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse {
    }
    /**
     * Metadata of an action, including schemas for its inputs and outputs.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaRuntimeActionSchema {
        /**
         * Name of the action.
         */
        action?: string | null;
        /**
         * Input parameter schema for the action.
         */
        inputSchema?: string | null;
        /**
         * Output parameter schema for the action.
         */
        outputSchema?: string | null;
    }
    /**
     * Metadata of an entity, including a schema for its properties.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaRuntimeEntitySchema {
        /**
         * The above schema, but for an array of the associated entity.
         */
        arrayFieldSchema?: string | null;
        /**
         * Name of the entity.
         */
        entity?: string | null;
        /**
         * List of fields in the entity.
         */
        fieldSchema?: string | null;
    }
    /**
     * The request for scheduling an integration.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsRequest {
        /**
         * Optional. Input parameters used by integration execution.
         */
        inputParameters?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaValueType;
        } | null;
        /**
         * Parameters are a part of Event and can be used to communicate between different tasks that are part of the same integration execution.
         */
        parameterEntries?: Schema$EnterpriseCrmFrontendsEventbusProtoParameterEntry[];
        /**
         * Passed in as parameters to each integration execution.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        /**
         * This is used to de-dup incoming request: if the duplicate request was detected, the response from the previous execution is returned.
         */
        requestId?: string | null;
        /**
         * The time that the integration should be executed. If the time is less or equal to the current time, the integration is executed immediately.
         */
        scheduleTime?: string | null;
        /**
         * Matched against all {@link TriggerConfig\}s across all integrations. i.e. TriggerConfig.trigger_id.equals(trigger_id)
         */
        triggerId?: string | null;
    }
    /**
     * The response for executing an integration.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse {
        /**
         * The execution info id for the executed integrations.
         */
        executionInfoIds?: string[] | null;
    }
    /**
     * Represents the service account which can be used to generate access token for authenticating the service call.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaServiceAccountCredentials {
        /**
         * A space-delimited list of requested scope permissions.
         */
        scope?: string | null;
        /**
         * Name of the service account that has the permission to make the request.
         */
        serviceAccount?: string | null;
    }
    /**
     * The SfdcChannel that points to a CDC or Platform Event Channel.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSfdcChannel {
        /**
         * The Channel topic defined by salesforce once an channel is opened
         */
        channelTopic?: string | null;
        /**
         * Output only. Time when the channel is created
         */
        createTime?: string | null;
        /**
         * Output only. Time when the channel was deleted. Empty if not deleted.
         */
        deleteTime?: string | null;
        /**
         * The description for this channel
         */
        description?: string | null;
        /**
         * Client level unique name/alias to easily reference a channel.
         */
        displayName?: string | null;
        /**
         * Indicated if a channel has any active integrations referencing it. Set to false when the channel is created, and set to true if there is any integration published with the channel configured in it.
         */
        isActive?: boolean | null;
        /**
         * Last sfdc messsage replay id for channel
         */
        lastReplayId?: string | null;
        /**
         * Resource name of the SFDC channel projects/{project\}/locations/{location\}/sfdcInstances/{sfdc_instance\}/sfdcChannels/{sfdc_channel\}.
         */
        name?: string | null;
        /**
         * Output only. Time when the channel was last updated
         */
        updateTime?: string | null;
    }
    /**
     * The SfdcInstance resource use to hold channels and connection config data.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSfdcInstance {
        /**
         * A list of AuthConfigs that can be tried to open the channel to SFDC
         */
        authConfigId?: string[] | null;
        /**
         * Output only. Time when the instance is created
         */
        createTime?: string | null;
        /**
         * Output only. Time when the instance was deleted. Empty if not deleted.
         */
        deleteTime?: string | null;
        /**
         * A description of the sfdc instance.
         */
        description?: string | null;
        /**
         * User selected unique name/alias to easily reference an instance.
         */
        displayName?: string | null;
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/sfdcInstances/{sfdcInstance\}.
         */
        name?: string | null;
        /**
         * URL used for API calls after authentication (the login authority is configured within the referenced AuthConfig).
         */
        serviceAuthority?: string | null;
        /**
         * The SFDC Org Id. This is defined in salesforce.
         */
        sfdcOrgId?: string | null;
        /**
         * Output only. Time when the instance was last updated
         */
        updateTime?: string | null;
    }
    /**
     * This message only contains a field of string array.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaStringParameterArray {
        /**
         * String array.
         */
        stringValues?: string[] | null;
    }
    /**
     * Policy that dictates the behavior for the task after it completes successfully.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSuccessPolicy {
        /**
         * State to which the execution snapshot status will be set if the task succeeds.
         */
        finalState?: string | null;
    }
    /**
     * A record representing a suspension.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSuspension {
        /**
         * Controls the notifications and approval permissions for this suspension.
         */
        approvalConfig?: Schema$GoogleCloudIntegrationsV1alphaSuspensionApprovalConfig;
        /**
         * Metadata pertaining to the resolution of this suspension.
         */
        audit?: Schema$GoogleCloudIntegrationsV1alphaSuspensionAudit;
        /**
         * Output only. Auto-generated.
         */
        createTime?: string | null;
        /**
         * Required. ID of the associated execution.
         */
        eventExecutionInfoId?: string | null;
        /**
         * Required. The name of the originating integration.
         */
        integration?: string | null;
        /**
         * Output only. Auto-generated.
         */
        lastModifyTime?: string | null;
        /**
         * Resource name for suspensions suspension/{suspension_id\}
         */
        name?: string | null;
        /**
         * Required. State of this suspension, indicating what action a resolver has taken.
         */
        state?: string | null;
        /**
         * Controls the notifications and resolver permissions for this suspension.
         */
        suspensionConfig?: Schema$EnterpriseCrmEventbusProtoSuspensionConfig;
        /**
         * Required. Task id of the associated SuspensionTask.
         */
        taskId?: string | null;
    }
    /**
     * Configurations for approving the Suspension.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSuspensionApprovalConfig {
        /**
         * Information to provide for recipients.
         */
        customMessage?: string | null;
        /**
         * Email addresses to send approval request to.
         */
        emailAddresses?: string[] | null;
        /**
         * Indicates the next steps when no external actions happen on the suspension.
         */
        expiration?: Schema$GoogleCloudIntegrationsV1alphaSuspensionApprovalExpiration;
    }
    /**
     * Expiration configs for the approval request.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSuspensionApprovalExpiration {
        /**
         * Output only. Time after which the suspension expires, if no action taken.
         */
        expireTime?: string | null;
        /**
         * Whether the suspension will be REJECTED or LIFTED upon expiration. REJECTED is the default behavior.
         */
        liftWhenExpired?: boolean | null;
        /**
         * Time after the previous suspension action reminder, if any, is sent using the selected notification option, for a suspension which is still PENDING_UNSPECIFIED.
         */
        remindTime?: string | null;
    }
    /**
     * Contains when and by whom the suspension was resolved.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaSuspensionAudit {
        /**
         * Email address of the person who resolved this suspension.
         */
        resolver?: string | null;
        /**
         * Time at which this suspension was resolved.
         */
        resolveTime?: string | null;
    }
    /**
     * Request for TakeoverEditLock.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockRequest {
    }
    /**
     * Response for TakeoverEditLock.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse {
        /**
         * Version after the lock is acquired by the new user.
         */
        integrationVersion?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    /**
     * The task configuration details. This is not the implementation of Task. There might be multiple TaskConfigs for the same Task.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaTaskConfig {
        /**
         * Optional. User-provided description intended to give additional business context about the task.
         */
        description?: string | null;
        /**
         * Optional. User-provided label that is attached to this TaskConfig in the UI.
         */
        displayName?: string | null;
        /**
         * Optional. Optional Error catcher id of the error catch flow which will be executed when execution error happens in the task
         */
        errorCatcherId?: string | null;
        /**
         * Optional. External task type of the task
         */
        externalTaskType?: string | null;
        /**
         * Optional. Determines the number of times the task will be retried on failure and with what retry strategy. This is applicable for asynchronous calls to Eventbus alone (Post To Queue, Schedule etc.).
         */
        failurePolicy?: Schema$GoogleCloudIntegrationsV1alphaFailurePolicy;
        /**
         * Optional. If set, overrides the option configured in the Task implementation class.
         */
        jsonValidationOption?: string | null;
        /**
         * Optional. The set of tasks that are next in line to be executed as per the execution graph defined for the parent event, specified by `event_config_id`. Each of these next tasks are executed only if the condition associated with them evaluates to true.
         */
        nextTasks?: Schema$GoogleCloudIntegrationsV1alphaNextTask[];
        /**
         * Optional. The policy dictating the execution of the next set of tasks for the current task.
         */
        nextTasksExecutionPolicy?: string | null;
        /**
         * Optional. The customized parameters the user can pass to this task.
         */
        parameters?: {
            [key: string]: Schema$GoogleCloudIntegrationsV1alphaEventParameter;
        } | null;
        /**
         * Optional. Informs the front-end application where to draw this error catcher config on the UI.
         */
        position?: Schema$GoogleCloudIntegrationsV1alphaCoordinate;
        /**
         * Optional. Determines what action to take upon successful task completion.
         */
        successPolicy?: Schema$GoogleCloudIntegrationsV1alphaSuccessPolicy;
        /**
         * Optional. Determines the number of times the task will be retried on failure and with what retry strategy. This is applicable for synchronous calls to Eventbus alone (Post).
         */
        synchronousCallFailurePolicy?: Schema$GoogleCloudIntegrationsV1alphaFailurePolicy;
        /**
         * Optional. The name for the task.
         */
        task?: string | null;
        /**
         * Optional. The policy dictating the execution strategy of this task.
         */
        taskExecutionStrategy?: string | null;
        /**
         * Required. The identifier of this task within its parent event config, specified by the client. This should be unique among all the tasks belong to the same event config. We use this field as the identifier to find next tasks (via field `next_tasks.task_id`).
         */
        taskId?: string | null;
        /**
         * Optional. Used to define task-template name if task is of type task-template
         */
        taskTemplate?: string | null;
    }
    /**
     * Contains the details of the execution of this task.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaTaskExecutionDetails {
        /**
         * Status for the current task execution attempt.
         */
        taskAttemptStats?: Schema$GoogleCloudIntegrationsV1alphaAttemptStats[];
        /**
         * The execution state of this task.
         */
        taskExecutionState?: string | null;
        /**
         * Pointer to the task config it used for execution.
         */
        taskNumber?: string | null;
    }
    /**
     * Configuration detail of a trigger.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaTriggerConfig {
        /**
         * Optional. An alert threshold configuration for the [trigger + client + integration] tuple. If these values are not specified in the trigger config, default values will be populated by the system. Note that there must be exactly one alert threshold configured per [client + trigger + integration] when published.
         */
        alertConfig?: Schema$GoogleCloudIntegrationsV1alphaIntegrationAlertConfig[];
        /**
         * Optional. Cloud Scheduler Trigger related metadata
         */
        cloudSchedulerConfig?: Schema$GoogleCloudIntegrationsV1alphaCloudSchedulerConfig;
        /**
         * Optional. User-provided description intended to give additional business context about the task.
         */
        description?: string | null;
        /**
         * Optional. Optional Error catcher id of the error catch flow which will be executed when execution error happens in the task
         */
        errorCatcherId?: string | null;
        /**
         * Optional. The user created label for a particular trigger.
         */
        label?: string | null;
        /**
         * Optional. Dictates how next tasks will be executed.
         */
        nextTasksExecutionPolicy?: string | null;
        /**
         * Optional. Informs the front-end application where to draw this error catcher config on the UI.
         */
        position?: Schema$GoogleCloudIntegrationsV1alphaCoordinate;
        /**
         * Optional. Configurable properties of the trigger, not to be confused with integration parameters. E.g. "name" is a property for API triggers and "subscription" is a property for Pub/sub triggers.
         */
        properties?: {
            [key: string]: string;
        } | null;
        /**
         * Optional. Set of tasks numbers from where the integration execution is started by this trigger. If this is empty, then integration is executed with default start tasks. In the list of start tasks, none of two tasks can have direct ancestor-descendant relationships (i.e. in a same integration execution graph).
         */
        startTasks?: Schema$GoogleCloudIntegrationsV1alphaNextTask[];
        /**
         * Optional. The backend trigger ID.
         */
        triggerId?: string | null;
        /**
         * Required. A number to uniquely identify each trigger config within the integration on UI.
         */
        triggerNumber?: string | null;
        /**
         * Optional. Type of trigger
         */
        triggerType?: string | null;
    }
    /**
     * Request for UnpublishIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaUnpublishIntegrationVersionRequest {
    }
    /**
     * Request for UploadIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionRequest {
        /**
         * The textproto of the integration_version.
         */
        content?: string | null;
        /**
         * File format for upload request.
         */
        fileFormat?: string | null;
    }
    /**
     * Response for UploadIntegrationVersion.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse {
        /**
         * The uploaded integration.
         */
        integrationVersion?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    /**
     * Username and password pair.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaUsernameAndPassword {
        /**
         * Password to be used
         */
        password?: string | null;
        /**
         * Username to be used
         */
        username?: string | null;
    }
    /**
     * The type of the parameter.
     */
    export interface Schema$GoogleCloudIntegrationsV1alphaValueType {
        /**
         * Boolean Array.
         */
        booleanArray?: Schema$GoogleCloudIntegrationsV1alphaBooleanParameterArray;
        /**
         * Boolean.
         */
        booleanValue?: boolean | null;
        /**
         * Double Number Array.
         */
        doubleArray?: Schema$GoogleCloudIntegrationsV1alphaDoubleParameterArray;
        /**
         * Double Number.
         */
        doubleValue?: number | null;
        /**
         * Integer Array.
         */
        intArray?: Schema$GoogleCloudIntegrationsV1alphaIntParameterArray;
        /**
         * Integer.
         */
        intValue?: string | null;
        /**
         * Json.
         */
        jsonValue?: string | null;
        /**
         * String Array.
         */
        stringArray?: Schema$GoogleCloudIntegrationsV1alphaStringParameterArray;
        /**
         * String.
         */
        stringValue?: string | null;
    }
    /**
     * Use this request to post all workflows associated with a given trigger id. Next available id: 10
     */
    export interface Schema$GoogleInternalCloudCrmEventbusV3PostToQueueWithTriggerIdRequest {
        /**
         * Optional. If the client id is provided, then the combination of trigger id and client id is matched across all the workflows. If the client id is not provided, then workflows with matching trigger id are executed for each client id in the {@link TriggerConfig\}. For Api Trigger, the client id is required and will be validated against the allowed clients.
         */
        clientId?: string | null;
        /**
         * Optional. Flag to determine whether clients would suppress a warning when no ACTIVE workflows are not found. If this flag is set to be true, an error will not be thrown if the requested trigger_id or client_id is not found in any ACTIVE workflow. Otherwise, the error is always thrown. The flag is set to be false by default.
         */
        ignoreErrorIfNoActiveWorkflow?: boolean | null;
        /**
         * Passed in as parameters to each workflow execution. Optional.
         */
        parameters?: Schema$EnterpriseCrmEventbusProtoEventParameters;
        /**
         * The request priority this request should be processed at. For internal users:
         */
        priority?: string | null;
        /**
         * Optional. This is used to de-dup incoming request: if the duplicate request was detected, the response from the previous execution is returned. Must have no more than 36 characters and contain only alphanumeric characters and hyphens.
         */
        requestId?: string | null;
        /**
         * Optional. Time in milliseconds since epoch when the given event would be scheduled.
         */
        scheduledTime?: string | null;
        /**
         * Optional. Sets test mode in {@link enterprise/crm/eventbus/event_message.proto\}.
         */
        testMode?: boolean | null;
        /**
         * Matched against all {@link TriggerConfig\}s across all workflows. i.e. TriggerConfig.trigger_id.equals(trigger_id) Required.
         */
        triggerId?: string | null;
        /**
         * Optional. If provided, the workflow_name is used to filter all the matched workflows having same trigger_id+client_id. A combination of trigger_id, client_id and workflow_name identifies a unique workflow.
         */
        workflowName?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$GoogleProtobufEmpty {
    }
    export class Resource$Callback {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Receives the auth code and auth config id to combine that with the client id and secret to retrieve access tokens from the token endpoint. Returns either a success or error message when it's done.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.callback.generateToken({
         *     // The auth code for the given request
         *     code: 'placeholder-value',
         *     // The gcp project id of the request
         *     gcpProjectId: 'placeholder-value',
         *     // Which product sends the request
         *     product: 'placeholder-value',
         *     // Redirect uri of the auth code request
         *     redirectUri: 'placeholder-value',
         *     // The auth config id for the given request
         *     state: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "message": "my_message"
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
        generateToken(params: Params$Resource$Callback$Generatetoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateToken(params?: Params$Resource$Callback$Generatetoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse>>;
        generateToken(params: Params$Resource$Callback$Generatetoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateToken(params: Params$Resource$Callback$Generatetoken, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse>): void;
        generateToken(params: Params$Resource$Callback$Generatetoken, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse>): void;
        generateToken(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaGenerateTokenResponse>): void;
    }
    export interface Params$Resource$Callback$Generatetoken extends StandardParameters {
        /**
         * The auth code for the given request
         */
        code?: string;
        /**
         * The gcp project id of the request
         */
        gcpProjectId?: string;
        /**
         * Which product sends the request
         */
        product?: string;
        /**
         * Redirect uri of the auth code request
         */
        redirectUri?: string;
        /**
         * The auth config id for the given request
         */
        state?: string;
    }
    export class Resource$Connectorplatformregions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Enumerates the regions for which Connector Platform is provisioned.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.connectorPlatformRegions.enumerate({});
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "regions": []
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
        enumerate(params: Params$Resource$Connectorplatformregions$Enumerate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enumerate(params?: Params$Resource$Connectorplatformregions$Enumerate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse>>;
        enumerate(params: Params$Resource$Connectorplatformregions$Enumerate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enumerate(params: Params$Resource$Connectorplatformregions$Enumerate, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse>): void;
        enumerate(params: Params$Resource$Connectorplatformregions$Enumerate, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse>): void;
        enumerate(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaEnumerateConnectorPlatformRegionsResponse>): void;
    }
    export interface Params$Resource$Connectorplatformregions$Enumerate extends StandardParameters {
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        appsScriptProjects: Resource$Projects$Locations$Appsscriptprojects;
        authConfigs: Resource$Projects$Locations$Authconfigs;
        certificates: Resource$Projects$Locations$Certificates;
        connections: Resource$Projects$Locations$Connections;
        integrations: Resource$Projects$Locations$Integrations;
        products: Resource$Projects$Locations$Products;
        sfdcInstances: Resource$Projects$Locations$Sfdcinstances;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Appsscriptprojects {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an Apps Script project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.appsScriptProjects.create({
         *     // Required. The project that the executed integration belongs to.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "appsScriptProject": "my_appsScriptProject",
         *       //   "authConfigId": "my_authConfigId"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "projectId": "my_projectId"
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
        create(params: Params$Resource$Projects$Locations$Appsscriptprojects$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Appsscriptprojects$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse>>;
        create(params: Params$Resource$Projects$Locations$Appsscriptprojects$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Appsscriptprojects$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse>): void;
        create(params: Params$Resource$Projects$Locations$Appsscriptprojects$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectResponse>): void;
        /**
         * Links a existing Apps Script project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.appsScriptProjects.link({
         *     // Required. The project that the executed integration belongs to.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "scriptId": "my_scriptId"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "scriptId": "my_scriptId"
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
        link(params: Params$Resource$Projects$Locations$Appsscriptprojects$Link, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        link(params?: Params$Resource$Projects$Locations$Appsscriptprojects$Link, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse>>;
        link(params: Params$Resource$Projects$Locations$Appsscriptprojects$Link, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        link(params: Params$Resource$Projects$Locations$Appsscriptprojects$Link, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse>): void;
        link(params: Params$Resource$Projects$Locations$Appsscriptprojects$Link, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse>): void;
        link(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Appsscriptprojects$Create extends StandardParameters {
        /**
         * Required. The project that the executed integration belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaCreateAppsScriptProjectRequest;
    }
    export interface Params$Resource$Projects$Locations$Appsscriptprojects$Link extends StandardParameters {
        /**
         * Required. The project that the executed integration belongs to.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaLinkAppsScriptProjectRequest;
    }
    export class Resource$Projects$Locations$Authconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an auth config record. Fetch corresponding credentials for specific auth types, e.g. access token for OAuth 2.0, JWT token for JWT. Encrypt the auth config with Cloud KMS and store the encrypted credentials in Spanner. Returns the encrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.authConfigs.create({
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.encryptedPrivateKey': 'placeholder-value',
         *     // 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         *     'clientCertificate.passphrase': 'placeholder-value',
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.sslCertificate': 'placeholder-value',
         *     // Required. "projects/{project\}/locations/{location\}" format.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "certificateId": "my_certificateId",
         *       //   "createTime": "my_createTime",
         *       //   "creatorEmail": "my_creatorEmail",
         *       //   "credentialType": "my_credentialType",
         *       //   "decryptedCredential": {},
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "encryptedCredential": "my_encryptedCredential",
         *       //   "expiryNotificationDuration": [],
         *       //   "lastModifierEmail": "my_lastModifierEmail",
         *       //   "name": "my_name",
         *       //   "overrideValidTime": "my_overrideValidTime",
         *       //   "reason": "my_reason",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "validTime": "my_validTime",
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        create(params: Params$Resource$Projects$Locations$Authconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Authconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        create(params: Params$Resource$Projects$Locations$Authconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Authconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        create(params: Params$Resource$Projects$Locations$Authconfigs$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        /**
         * Deletes an auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.authConfigs.delete({
         *     // Required. The name that is associated with the AuthConfig.
         *     name: 'projects/my-project/locations/my-location/authConfigs/my-authConfig',
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
        delete(params: Params$Resource$Projects$Locations$Authconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Authconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Authconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Authconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Authconfigs$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a complete auth config. If the auth config doesn't exist, Code.NOT_FOUND exception will be thrown. Returns the decrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.authConfigs.get({
         *     // Required. The name that is associated with the AuthConfig.
         *     name: 'projects/my-project/locations/my-location/authConfigs/my-authConfig',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        get(params: Params$Resource$Projects$Locations$Authconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Authconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        get(params: Params$Resource$Projects$Locations$Authconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Authconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        get(params: Params$Resource$Projects$Locations$Authconfigs$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        /**
         * Lists all auth configs that match the filter. Restrict to auth configs belong to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.authConfigs.list({
         *     // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *     filter: 'placeholder-value',
         *     // The size of entries in the response. If unspecified, defaults to 100.
         *     pageSize: 'placeholder-value',
         *     // The token returned in the previous response.
         *     pageToken: 'placeholder-value',
         *     // Required. The client, which owns this collection of AuthConfigs.
         *     parent: 'projects/my-project/locations/my-location',
         *     // The mask which specifies fields that need to be returned in the AuthConfig's response.
         *     readMask: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigs": [],
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
        list(params: Params$Resource$Projects$Locations$Authconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Authconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>>;
        list(params: Params$Resource$Projects$Locations$Authconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Authconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Authconfigs$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        /**
         * Updates an auth config. If credential is updated, fetch the encrypted auth config from Spanner, decrypt with Cloud KMS key, update the credential fields, re-encrypt with Cloud KMS key and update the Spanner record. For other fields, directly update the Spanner record. Returns the encrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.authConfigs.patch({
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.encryptedPrivateKey': 'placeholder-value',
         *     // 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         *     'clientCertificate.passphrase': 'placeholder-value',
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.sslCertificate': 'placeholder-value',
         *     // Resource name of the SFDC instance projects/{project\}/locations/{location\}/authConfigs/{authConfig\}.
         *     name: 'projects/my-project/locations/my-location/authConfigs/my-authConfig',
         *     // Field mask specifying the fields in the above AuthConfig that have been modified and need to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "certificateId": "my_certificateId",
         *       //   "createTime": "my_createTime",
         *       //   "creatorEmail": "my_creatorEmail",
         *       //   "credentialType": "my_credentialType",
         *       //   "decryptedCredential": {},
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "encryptedCredential": "my_encryptedCredential",
         *       //   "expiryNotificationDuration": [],
         *       //   "lastModifierEmail": "my_lastModifierEmail",
         *       //   "name": "my_name",
         *       //   "overrideValidTime": "my_overrideValidTime",
         *       //   "reason": "my_reason",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "validTime": "my_validTime",
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        patch(params: Params$Resource$Projects$Locations$Authconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Authconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        patch(params: Params$Resource$Projects$Locations$Authconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Authconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        patch(params: Params$Resource$Projects$Locations$Authconfigs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
    }
    export interface Params$Resource$Projects$Locations$Authconfigs$Create extends StandardParameters {
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.encryptedPrivateKey'?: string;
        /**
         * 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         */
        'clientCertificate.passphrase'?: string;
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.sslCertificate'?: string;
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaAuthConfig;
    }
    export interface Params$Resource$Projects$Locations$Authconfigs$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the AuthConfig.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Authconfigs$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the AuthConfig.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Authconfigs$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of AuthConfigs.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the AuthConfig's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Authconfigs$Patch extends StandardParameters {
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.encryptedPrivateKey'?: string;
        /**
         * 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         */
        'clientCertificate.passphrase'?: string;
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.sslCertificate'?: string;
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/authConfigs/{authConfig\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above AuthConfig that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaAuthConfig;
    }
    export class Resource$Projects$Locations$Certificates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get a certificates in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.certificates.get({
         *     // Required. The certificate to retrieve. Format: projects/{project\}/locations/{location\}/certificates/{certificate\}
         *     name: 'projects/my-project/locations/my-location/certificates/my-certificate',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateStatus": "my_certificateStatus",
         *   //   "credentialId": "my_credentialId",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "rawCertificate": {},
         *   //   "requestorId": "my_requestorId",
         *   //   "validEndTime": "my_validEndTime",
         *   //   "validStartTime": "my_validStartTime"
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
        get(params: Params$Resource$Projects$Locations$Certificates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Certificates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCertificate>>;
        get(params: Params$Resource$Projects$Locations$Certificates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Certificates$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        get(params: Params$Resource$Projects$Locations$Certificates$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
    }
    export interface Params$Resource$Projects$Locations$Certificates$Get extends StandardParameters {
        /**
         * Required. The certificate to retrieve. Format: projects/{project\}/locations/{location\}/certificates/{certificate\}
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Connections {
        context: APIRequestContext;
        runtimeActionSchemas: Resource$Projects$Locations$Connections$Runtimeactionschemas;
        runtimeEntitySchemas: Resource$Projects$Locations$Connections$Runtimeentityschemas;
        constructor(context: APIRequestContext);
        /**
         * Lists the available entities and actions associated with a Connection.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.connections.getConnectionSchemaMetadata(
         *       {
         *         // Required. ConnectionSchemaMetadata name. Format: projects/{project\}/locations/{location\}/connections/{connection\}/connectionSchemaMetadata
         *         name: 'projects/my-project/locations/my-location/connections/my-connection/connectionSchemaMetadata',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "actions": [],
         *   //   "entities": []
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
        getConnectionSchemaMetadata(params: Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getConnectionSchemaMetadata(params?: Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata>>;
        getConnectionSchemaMetadata(params: Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getConnectionSchemaMetadata(params: Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata>): void;
        getConnectionSchemaMetadata(params: Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata>): void;
        getConnectionSchemaMetadata(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaConnectionSchemaMetadata>): void;
        /**
         * Lists Connections in a given project and location.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.connections.list({
         *     // Filter.
         *     filter: 'placeholder-value',
         *     // Order by parameters.
         *     orderBy: 'placeholder-value',
         *     // Page size.
         *     pageSize: 'placeholder-value',
         *     // Page token.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent resource of the Connection, of the form: `projects/x/locations/x`
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "connections": [],
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
        list(params: Params$Resource$Projects$Locations$Connections$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Connections$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Connections$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Connections$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Connections$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListConnectionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Connections$Getconnectionschemametadata extends StandardParameters {
        /**
         * Required. ConnectionSchemaMetadata name. Format: projects/{project\}/locations/{location\}/connections/{connection\}/connectionSchemaMetadata
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Connections$List extends StandardParameters {
        /**
         * Filter.
         */
        filter?: string;
        /**
         * Order by parameters.
         */
        orderBy?: string;
        /**
         * Page size.
         */
        pageSize?: number;
        /**
         * Page token.
         */
        pageToken?: string;
        /**
         * Required. Parent resource of the Connection, of the form: `projects/x/locations/x`
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Connections$Runtimeactionschemas {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the JSON schemas for the inputs and outputs of actions, filtered by action name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.connections.runtimeActionSchemas.list(
         *       {
         *         // Filter. Only the action field with literal equality operator is supported.
         *         filter: 'placeholder-value',
         *         // Page size.
         *         pageSize: 'placeholder-value',
         *         // Page token.
         *         pageToken: 'placeholder-value',
         *         // Required. Parent resource of RuntimeActionSchema. Format: projects/{project\}/locations/{location\}/connections/{connection\}
         *         parent:
         *           'projects/my-project/locations/my-location/connections/my-connection',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "runtimeActionSchemas": []
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
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse>>;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse>): void;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeActionSchemasResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Connections$Runtimeactionschemas$List extends StandardParameters {
        /**
         * Filter. Only the action field with literal equality operator is supported.
         */
        filter?: string;
        /**
         * Page size.
         */
        pageSize?: number;
        /**
         * Page token.
         */
        pageToken?: string;
        /**
         * Required. Parent resource of RuntimeActionSchema. Format: projects/{project\}/locations/{location\}/connections/{connection\}
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Connections$Runtimeentityschemas {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the JSON schemas for the properties of runtime entities, filtered by entity name.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.connections.runtimeEntitySchemas.list(
         *       {
         *         // Filter. Only the entity field with literal equality operator is supported.
         *         filter: 'placeholder-value',
         *         // Page size.
         *         pageSize: 'placeholder-value',
         *         // Page token.
         *         pageToken: 'placeholder-value',
         *         // Required. Parent resource of RuntimeEntitySchema. Format: projects/{project\}/locations/{location\}/connections/{connection\}
         *         parent:
         *           'projects/my-project/locations/my-location/connections/my-connection',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "runtimeEntitySchemas": []
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
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse>>;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse>): void;
        list(params: Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListRuntimeEntitySchemasResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Connections$Runtimeentityschemas$List extends StandardParameters {
        /**
         * Filter. Only the entity field with literal equality operator is supported.
         */
        filter?: string;
        /**
         * Page size.
         */
        pageSize?: number;
        /**
         * Page token.
         */
        pageToken?: string;
        /**
         * Required. Parent resource of RuntimeEntitySchema. Format: projects/{project\}/locations/{location\}/connections/{connection\}
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Integrations {
        context: APIRequestContext;
        executions: Resource$Projects$Locations$Integrations$Executions;
        versions: Resource$Projects$Locations$Integrations$Versions;
        constructor(context: APIRequestContext);
        /**
         * Delete the selected integration and all versions inside
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.delete({
         *     // Required. The location resource of the request.
         *     name: 'projects/my-project/locations/my-location/integrations/my-integration',
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
        delete(params: Params$Resource$Projects$Locations$Integrations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Integrations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Integrations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Integrations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Integrations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Executes integrations synchronously by passing the trigger id in the request body. The request is not returned until the requested executions are either fulfilled or experienced an error. If the integration name is not specified (passing `-`), all of the associated integration under the given trigger_id will be executed. Otherwise only the specified integration for the given `trigger_id` is executed. This is helpful for execution the integration from UI.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.execute({
         *     // Required. The integration resource name.
         *     name: 'projects/my-project/locations/my-location/integrations/my-integration',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "doNotPropagateError": false,
         *       //   "executionId": "my_executionId",
         *       //   "inputParameters": {},
         *       //   "parameterEntries": [],
         *       //   "parameters": {},
         *       //   "requestId": "my_requestId",
         *       //   "triggerId": "my_triggerId"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "eventParameters": {},
         *   //   "executionFailed": false,
         *   //   "executionId": "my_executionId",
         *   //   "outputParameters": {},
         *   //   "parameterEntries": []
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
        execute(params: Params$Resource$Projects$Locations$Integrations$Execute, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        execute(params?: Params$Resource$Projects$Locations$Integrations$Execute, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>>;
        execute(params: Params$Resource$Projects$Locations$Integrations$Execute, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        execute(params: Params$Resource$Projects$Locations$Integrations$Execute, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        execute(params: Params$Resource$Projects$Locations$Integrations$Execute, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        execute(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        /**
         * Returns the list of all integrations in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.list({
         *     // Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         *     filter: 'placeholder-value',
         *     // The results would be returned in order you specified here. Supported sort keys are: Descending sort order by "last_modified_time", "created_time", "snapshot_number". Ascending sort order by the integration name.
         *     orderBy: 'placeholder-value',
         *     // The page size for the resquest.
         *     pageSize: 'placeholder-value',
         *     // The page token for the resquest.
         *     pageToken: 'placeholder-value',
         *     // Required. Project and location from which the integrations should be listed. Format: projects/{project\}
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrations": [],
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
        list(params: Params$Resource$Projects$Locations$Integrations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Integrations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Integrations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        /**
         * Schedules an integration for execution by passing the trigger id and the scheduled time in the request body.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.schedule({
         *     // The integration resource name.
         *     name: 'projects/my-project/locations/my-location/integrations/my-integration',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "inputParameters": {},
         *       //   "parameterEntries": [],
         *       //   "parameters": {},
         *       //   "requestId": "my_requestId",
         *       //   "scheduleTime": "my_scheduleTime",
         *       //   "triggerId": "my_triggerId"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionInfoIds": []
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
        schedule(params: Params$Resource$Projects$Locations$Integrations$Schedule, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        schedule(params?: Params$Resource$Projects$Locations$Integrations$Schedule, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>>;
        schedule(params: Params$Resource$Projects$Locations$Integrations$Schedule, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        schedule(params: Params$Resource$Projects$Locations$Integrations$Schedule, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
        schedule(params: Params$Resource$Projects$Locations$Integrations$Schedule, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
        schedule(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Delete extends StandardParameters {
        /**
         * Required. The location resource of the request.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Execute extends StandardParameters {
        /**
         * Required. The integration resource name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsRequest;
    }
    export interface Params$Resource$Projects$Locations$Integrations$List extends StandardParameters {
        /**
         * Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         */
        filter?: string;
        /**
         * The results would be returned in order you specified here. Supported sort keys are: Descending sort order by "last_modified_time", "created_time", "snapshot_number". Ascending sort order by the integration name.
         */
        orderBy?: string;
        /**
         * The page size for the resquest.
         */
        pageSize?: number;
        /**
         * The page token for the resquest.
         */
        pageToken?: string;
        /**
         * Required. Project and location from which the integrations should be listed. Format: projects/{project\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Schedule extends StandardParameters {
        /**
         * The integration resource name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsRequest;
    }
    export class Resource$Projects$Locations$Integrations$Executions {
        context: APIRequestContext;
        suspensions: Resource$Projects$Locations$Integrations$Executions$Suspensions;
        constructor(context: APIRequestContext);
        /**
         * Lists the results of all the integration executions. The response includes the same information as the [execution log](https://cloud.google.com/application-integration/docs/viewing-logs) in the Integration UI.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.executions.list({
         *       // Optional. Standard filter field, we support filtering on following fields: workflow_name: the name of the integration. CreateTimestamp: the execution created time. event_execution_state: the state of the executions. execution_id: the id of the execution. trigger_id: the id of the trigger. parameter_type: the type of the parameters involved in the execution. All fields support for EQUALS, in additional: CreateTimestamp support for LESS_THAN, GREATER_THAN ParameterType support for HAS For example: "parameter_type" HAS \"string\" Also supports operators like AND, OR, NOT For example, trigger_id=\"id1\" AND workflow_name=\"testWorkflow\"
         *       filter: 'placeholder-value',
         *       // Optional user-provided custom filter.
         *       'filterParams.customFilter': 'placeholder-value',
         *       // End timestamp.
         *       'filterParams.endTime': 'placeholder-value',
         *       // List of possible event statuses.
         *       'filterParams.eventStatuses': 'placeholder-value',
         *       // Execution id.
         *       'filterParams.executionId': 'placeholder-value',
         *       // Param key. DEPRECATED. User parameter_pair_key instead.
         *       'filterParams.parameterKey': 'placeholder-value',
         *       // Param key in the key value pair filter.
         *       'filterParams.parameterPairKey': 'placeholder-value',
         *       // Param value in the key value pair filter.
         *       'filterParams.parameterPairValue': 'placeholder-value',
         *       // Param type.
         *       'filterParams.parameterType': 'placeholder-value',
         *       // Param value. DEPRECATED. User parameter_pair_value instead.
         *       'filterParams.parameterValue': 'placeholder-value',
         *       // Start timestamp.
         *       'filterParams.startTime': 'placeholder-value',
         *       // List of possible task statuses.
         *       'filterParams.taskStatuses': 'placeholder-value',
         *       // Workflow name.
         *       'filterParams.workflowName': 'placeholder-value',
         *       // Optional. The results would be returned in order you specified here. Currently supporting "last_modified_time" and "create_time".
         *       orderBy: 'placeholder-value',
         *       // Optional. The size of entries in the response.
         *       pageSize: 'placeholder-value',
         *       // Optional. The token returned in the previous response.
         *       pageToken: 'placeholder-value',
         *       // Required. The parent resource name of the integration execution.
         *       parent:
         *         'projects/my-project/locations/my-location/integrations/my-integration',
         *       // Optional. View mask for the response data. If set, only the field specified will be returned as part of the result. If not set, all fields in event execution info will be filled and returned.
         *       readMask: 'placeholder-value',
         *       // Optional. If true, the service will use the most recent acl information to list event execution infos and renew the acl cache. Note that fetching the most recent acl is synchronous, so it will increase RPC call latency.
         *       refreshAcl: 'placeholder-value',
         *       // Optional. If true, the service will truncate the params to only keep the first 1000 characters of string params and empty the executions in order to make response smaller. Only works for UI and when the params fields are not filtered out.
         *       truncateParams: 'placeholder-value',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionInfos": [],
         *   //   "executions": [],
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
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Integrations$Executions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Executions$List extends StandardParameters {
        /**
         * Optional. Standard filter field, we support filtering on following fields: workflow_name: the name of the integration. CreateTimestamp: the execution created time. event_execution_state: the state of the executions. execution_id: the id of the execution. trigger_id: the id of the trigger. parameter_type: the type of the parameters involved in the execution. All fields support for EQUALS, in additional: CreateTimestamp support for LESS_THAN, GREATER_THAN ParameterType support for HAS For example: "parameter_type" HAS \"string\" Also supports operators like AND, OR, NOT For example, trigger_id=\"id1\" AND workflow_name=\"testWorkflow\"
         */
        filter?: string;
        /**
         * Optional user-provided custom filter.
         */
        'filterParams.customFilter'?: string;
        /**
         * End timestamp.
         */
        'filterParams.endTime'?: string;
        /**
         * List of possible event statuses.
         */
        'filterParams.eventStatuses'?: string[];
        /**
         * Execution id.
         */
        'filterParams.executionId'?: string;
        /**
         * Param key. DEPRECATED. User parameter_pair_key instead.
         */
        'filterParams.parameterKey'?: string;
        /**
         * Param key in the key value pair filter.
         */
        'filterParams.parameterPairKey'?: string;
        /**
         * Param value in the key value pair filter.
         */
        'filterParams.parameterPairValue'?: string;
        /**
         * Param type.
         */
        'filterParams.parameterType'?: string;
        /**
         * Param value. DEPRECATED. User parameter_pair_value instead.
         */
        'filterParams.parameterValue'?: string;
        /**
         * Start timestamp.
         */
        'filterParams.startTime'?: string;
        /**
         * List of possible task statuses.
         */
        'filterParams.taskStatuses'?: string[];
        /**
         * Workflow name.
         */
        'filterParams.workflowName'?: string;
        /**
         * Optional. The results would be returned in order you specified here. Currently supporting "last_modified_time" and "create_time".
         */
        orderBy?: string;
        /**
         * Optional. The size of entries in the response.
         */
        pageSize?: number;
        /**
         * Optional. The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name of the integration execution.
         */
        parent?: string;
        /**
         * Optional. View mask for the response data. If set, only the field specified will be returned as part of the result. If not set, all fields in event execution info will be filled and returned.
         */
        readMask?: string;
        /**
         * Optional. If true, the service will use the most recent acl information to list event execution infos and renew the acl cache. Note that fetching the most recent acl is synchronous, so it will increase RPC call latency.
         */
        refreshAcl?: boolean;
        /**
         * Optional. If true, the service will truncate the params to only keep the first 1000 characters of string params and empty the executions in order to make response smaller. Only works for UI and when the params fields are not filtered out.
         */
        truncateParams?: boolean;
    }
    export class Resource$Projects$Locations$Integrations$Executions$Suspensions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * * Lifts suspension for advanced suspension task. Fetch corresponding suspension with provided suspension Id, resolve suspension, and set up suspension result for the Suspension Task.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.executions.suspensions.lift(
         *       {
         *         // Required. The resource that the suspension belongs to. "projects/{project\}/locations/{location\}/products/{product\}/integrations/{integration\}/executions/{execution\}/suspensions/{suspenion\}" format.
         *         name: 'projects/my-project/locations/my-location/integrations/my-integration/executions/my-execution/suspensions/my-suspension',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "suspensionResult": "my_suspensionResult"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "eventExecutionInfoId": "my_eventExecutionInfoId"
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
        lift(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lift(params?: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>>;
        lift(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lift(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        lift(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        lift(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        /**
         * * Lists suspensions associated with a specific execution. Only those with permissions to resolve the relevant suspensions will be able to view them.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.executions.suspensions.list(
         *       {
         *         // Standard filter field.
         *         filter: 'placeholder-value',
         *         // Field name to order by.
         *         orderBy: 'placeholder-value',
         *         // Maximum number of entries in the response.
         *         pageSize: 'placeholder-value',
         *         // Token to retrieve a specific page.
         *         pageToken: 'placeholder-value',
         *         // Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}
         *         parent:
         *           'projects/my-project/locations/my-location/integrations/my-integration/executions/my-execution',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "suspensions": []
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
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        /**
         * * Resolves (lifts/rejects) any number of suspensions. If the integration is already running, only the status of the suspension is updated. Otherwise, the suspended integration will begin execution again.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.executions.suspensions.resolve(
         *       {
         *         // Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}/suspensions/{suspension_id\}
         *         name: 'projects/my-project/locations/my-location/integrations/my-integration/executions/my-execution/suspensions/my-suspension',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "suspension": {}
         *           // }
         *         },
         *       }
         *     );
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
        resolve(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resolve(params?: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>>;
        resolve(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resolve(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
        resolve(params: Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
        resolve(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Lift extends StandardParameters {
        /**
         * Required. The resource that the suspension belongs to. "projects/{project\}/locations/{location\}/products/{product\}/integrations/{integration\}/executions/{execution\}/suspensions/{suspenion\}" format.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionRequest;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$List extends StandardParameters {
        /**
         * Standard filter field.
         */
        filter?: string;
        /**
         * Field name to order by.
         */
        orderBy?: string;
        /**
         * Maximum number of entries in the response.
         */
        pageSize?: number;
        /**
         * Token to retrieve a specific page.
         */
        pageToken?: string;
        /**
         * Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Executions$Suspensions$Resolve extends StandardParameters {
        /**
         * Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}/suspensions/{suspension_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionRequest;
    }
    export class Resource$Projects$Locations$Integrations$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a integration with a draft version in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.create({
         *       // Set this flag to true, if draft version is to be created for a brand new integration. False, if the request is for an existing integration. For backward compatibility reasons, even if this flag is set to `false` and no existing integration is found, a new draft integration will still be created.
         *       newIntegration: 'placeholder-value',
         *       // Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         *       parent:
         *         'projects/my-project/locations/my-location/integrations/my-integration',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "createTime": "my_createTime",
         *         //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *         //   "description": "my_description",
         *         //   "errorCatcherConfigs": [],
         *         //   "integrationParameters": [],
         *         //   "integrationParametersInternal": {},
         *         //   "lastModifierEmail": "my_lastModifierEmail",
         *         //   "lockHolder": "my_lockHolder",
         *         //   "name": "my_name",
         *         //   "origin": "my_origin",
         *         //   "parentTemplateId": "my_parentTemplateId",
         *         //   "runAsServiceAccount": "my_runAsServiceAccount",
         *         //   "snapshotNumber": "my_snapshotNumber",
         *         //   "state": "my_state",
         *         //   "status": "my_status",
         *         //   "taskConfigs": [],
         *         //   "taskConfigsInternal": [],
         *         //   "teardown": {},
         *         //   "triggerConfigs": [],
         *         //   "triggerConfigsInternal": [],
         *         //   "updateTime": "my_updateTime",
         *         //   "userLabel": "my_userLabel"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        create(params: Params$Resource$Projects$Locations$Integrations$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Integrations$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        create(params: Params$Resource$Projects$Locations$Integrations$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Integrations$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        create(params: Params$Resource$Projects$Locations$Integrations$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * Soft-deletes the integration. Changes the status of the integration to ARCHIVED. If the integration being ARCHIVED is tagged as "HEAD", the tag is removed from this snapshot and set to the previous non-ARCHIVED snapshot. The PUBLISH_REQUESTED, DUE_FOR_DELETION tags are removed too. This RPC throws an exception if the version being deleted is DRAFT, and if the `locked_by` user is not the same as the user performing the Delete. Audit fields updated include last_modified_timestamp, last_modified_by. Any existing lock is released when Deleting a integration. Currently, there is no undelete mechanism.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.delete({
         *       // Required. The version to delete. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *       name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Integrations$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Integrations$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Integrations$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Integrations$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Integrations$Versions$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Downloads an integration. Retrieves the `IntegrationVersion` for a given `integration_id` and returns the response as a string.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.download({
         *       // File format for download request.
         *       fileFormat: 'placeholder-value',
         *       // Required. The version to download. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *       name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "content": "my_content"
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
        download(params: Params$Resource$Projects$Locations$Integrations$Versions$Download, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        download(params?: Params$Resource$Projects$Locations$Integrations$Versions$Download, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>>;
        download(params: Params$Resource$Projects$Locations$Integrations$Versions$Download, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        download(params: Params$Resource$Projects$Locations$Integrations$Versions$Download, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        download(params: Params$Resource$Projects$Locations$Integrations$Versions$Download, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        download(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        /**
         * Get a integration in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.versions.get({
         *     // Required. The version to retrieve. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *     name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        get(params: Params$Resource$Projects$Locations$Integrations$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Integrations$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        get(params: Params$Resource$Projects$Locations$Integrations$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Integrations$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        get(params: Params$Resource$Projects$Locations$Integrations$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * Returns the list of all integration versions in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.versions.list({
         *     // The field mask which specifies the particular data to be returned.
         *     fieldMask: 'placeholder-value',
         *     // Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         *     filter: 'placeholder-value',
         *     // The results would be returned in order you specified here. Currently supported sort keys are: Descending sort order for "last_modified_time", "created_time", "snapshot_number" Ascending sort order for "name".
         *     orderBy: 'placeholder-value',
         *     // The maximum number of versions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         *     pageSize: 'placeholder-value',
         *     // A page token, received from a previous `ListIntegrationVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationVersions` must match the call that provided the page token.
         *     pageToken: 'placeholder-value',
         *     // Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\} Specifically, when parent equals: 1. projects//locations//integrations/, Meaning: "List versions (with filter) for a particular integration". 2. projects//locations//integrations/- Meaning: "List versions (with filter) for a client within a particular region". 3. projects//locations/-/integrations/- Meaning: "List versions (with filter) for a client".
         *     parent:
         *       'projects/my-project/locations/my-location/integrations/my-integration',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersions": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "noPermission": false
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
        list(params: Params$Resource$Projects$Locations$Integrations$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Integrations$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Integrations$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Integrations$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        /**
         * Update a integration with a draft version in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.integrations.versions.patch(
         *     {
         *       // Output only. Auto-generated primary key.
         *       name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *       // Field mask specifying the fields in the above integration that have been modified and need to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "createTime": "my_createTime",
         *         //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *         //   "description": "my_description",
         *         //   "errorCatcherConfigs": [],
         *         //   "integrationParameters": [],
         *         //   "integrationParametersInternal": {},
         *         //   "lastModifierEmail": "my_lastModifierEmail",
         *         //   "lockHolder": "my_lockHolder",
         *         //   "name": "my_name",
         *         //   "origin": "my_origin",
         *         //   "parentTemplateId": "my_parentTemplateId",
         *         //   "runAsServiceAccount": "my_runAsServiceAccount",
         *         //   "snapshotNumber": "my_snapshotNumber",
         *         //   "state": "my_state",
         *         //   "status": "my_status",
         *         //   "taskConfigs": [],
         *         //   "taskConfigsInternal": [],
         *         //   "teardown": {},
         *         //   "triggerConfigs": [],
         *         //   "triggerConfigsInternal": [],
         *         //   "updateTime": "my_updateTime",
         *         //   "userLabel": "my_userLabel"
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        patch(params: Params$Resource$Projects$Locations$Integrations$Versions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Integrations$Versions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        patch(params: Params$Resource$Projects$Locations$Integrations$Versions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Integrations$Versions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        patch(params: Params$Resource$Projects$Locations$Integrations$Versions$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * This RPC throws an exception if the integration is in ARCHIVED or ACTIVE state. This RPC throws an exception if the version being published is DRAFT, and if the `locked_by` user is not the same as the user performing the Publish. Audit fields updated include last_published_timestamp, last_published_by, last_modified_timestamp, last_modified_by. Any existing lock is on this integration is released.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.publish({
         *       // Required. The version to publish. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *       name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {}
         *       },
         *     });
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
        publish(params: Params$Resource$Projects$Locations$Integrations$Versions$Publish, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        publish(params?: Params$Resource$Projects$Locations$Integrations$Versions$Publish, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>>;
        publish(params: Params$Resource$Projects$Locations$Integrations$Versions$Publish, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        publish(params: Params$Resource$Projects$Locations$Integrations$Versions$Publish, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        publish(params: Params$Resource$Projects$Locations$Integrations$Versions$Publish, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        publish(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        /**
         * Clears the `locked_by` and `locked_at_timestamp`in the DRAFT version of this integration. It then performs the same action as the CreateDraftIntegrationVersion (i.e., copies the DRAFT version of the integration as a SNAPSHOT and then creates a new DRAFT version with the `locked_by` set to the `user_taking_over` and the `locked_at_timestamp` set to the current timestamp). Both the `locked_by` and `user_taking_over` are notified via email about the takeover. This RPC throws an exception if the integration is not in DRAFT status or if the `locked_by` and `locked_at_timestamp` fields are not set.The TakeoverEdit lock is treated the same as an edit of the integration, and hence shares ACLs with edit. Audit fields updated include last_modified_timestamp, last_modified_by.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.takeoverEditLock(
         *       {
         *         // Required. The version to take over edit lock. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         integrationVersion:
         *           'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {}
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersion": {}
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
        takeoverEditLock(params: Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        takeoverEditLock(params?: Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>>;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        takeoverEditLock(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        /**
         * Sets the status of the ACTIVE integration to SNAPSHOT with a new tag "PREVIOUSLY_PUBLISHED" after validating it. The "HEAD" and "PUBLISH_REQUESTED" tags do not change. This RPC throws an exception if the version being snapshot is not ACTIVE. Audit fields added include action, action_by, action_timestamp.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.unpublish({
         *       // Required. The version to deactivate. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *       name: 'projects/my-project/locations/my-location/integrations/my-integration/versions/my-version',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {}
         *       },
         *     });
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
        unpublish(params: Params$Resource$Projects$Locations$Integrations$Versions$Unpublish, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unpublish(params?: Params$Resource$Projects$Locations$Integrations$Versions$Unpublish, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        unpublish(params: Params$Resource$Projects$Locations$Integrations$Versions$Unpublish, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unpublish(params: Params$Resource$Projects$Locations$Integrations$Versions$Unpublish, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        unpublish(params: Params$Resource$Projects$Locations$Integrations$Versions$Unpublish, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        unpublish(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Uploads an integration. The content can be a previously downloaded integration. Performs the same function as CreateDraftIntegrationVersion, but accepts input in a string format, which holds the complete representation of the IntegrationVersion content.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.integrations.versions.upload({
         *       // Required. The version to upload. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         *       parent:
         *         'projects/my-project/locations/my-location/integrations/my-integration',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "content": "my_content",
         *         //   "fileFormat": "my_fileFormat"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersion": {}
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
        upload(params: Params$Resource$Projects$Locations$Integrations$Versions$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Projects$Locations$Integrations$Versions$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>>;
        upload(params: Params$Resource$Projects$Locations$Integrations$Versions$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Projects$Locations$Integrations$Versions$Upload, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
        upload(params: Params$Resource$Projects$Locations$Integrations$Versions$Upload, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
        upload(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Create extends StandardParameters {
        /**
         * Set this flag to true, if draft version is to be created for a brand new integration. False, if the request is for an existing integration. For backward compatibility reasons, even if this flag is set to `false` and no existing integration is found, a new draft integration will still be created.
         */
        newIntegration?: boolean;
        /**
         * Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Delete extends StandardParameters {
        /**
         * Required. The version to delete. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Download extends StandardParameters {
        /**
         * File format for download request.
         */
        fileFormat?: string;
        /**
         * Required. The version to download. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Get extends StandardParameters {
        /**
         * Required. The version to retrieve. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$List extends StandardParameters {
        /**
         * The field mask which specifies the particular data to be returned.
         */
        fieldMask?: string;
        /**
         * Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         */
        filter?: string;
        /**
         * The results would be returned in order you specified here. Currently supported sort keys are: Descending sort order for "last_modified_time", "created_time", "snapshot_number" Ascending sort order for "name".
         */
        orderBy?: string;
        /**
         * The maximum number of versions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListIntegrationVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationVersions` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\} Specifically, when parent equals: 1. projects//locations//integrations/, Meaning: "List versions (with filter) for a particular integration". 2. projects//locations//integrations/- Meaning: "List versions (with filter) for a client within a particular region". 3. projects//locations/-/integrations/- Meaning: "List versions (with filter) for a client".
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Patch extends StandardParameters {
        /**
         * Output only. Auto-generated primary key.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above integration that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Publish extends StandardParameters {
        /**
         * Required. The version to publish. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionRequest;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Takeovereditlock extends StandardParameters {
        /**
         * Required. The version to take over edit lock. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        integrationVersion?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockRequest;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Unpublish extends StandardParameters {
        /**
         * Required. The version to deactivate. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaUnpublishIntegrationVersionRequest;
    }
    export interface Params$Resource$Projects$Locations$Integrations$Versions$Upload extends StandardParameters {
        /**
         * Required. The version to upload. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionRequest;
    }
    export class Resource$Projects$Locations$Products {
        context: APIRequestContext;
        authConfigs: Resource$Projects$Locations$Products$Authconfigs;
        certificates: Resource$Projects$Locations$Products$Certificates;
        integrations: Resource$Projects$Locations$Products$Integrations;
        integrationtemplates: Resource$Projects$Locations$Products$Integrationtemplates;
        sfdcInstances: Resource$Projects$Locations$Products$Sfdcinstances;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Products$Authconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an auth config record. Fetch corresponding credentials for specific auth types, e.g. access token for OAuth 2.0, JWT token for JWT. Encrypt the auth config with Cloud KMS and store the encrypted credentials in Spanner. Returns the encrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.authConfigs.create(
         *     {
         *       // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *       'clientCertificate.encryptedPrivateKey': 'placeholder-value',
         *       // 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         *       'clientCertificate.passphrase': 'placeholder-value',
         *       // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *       'clientCertificate.sslCertificate': 'placeholder-value',
         *       // Required. "projects/{project\}/locations/{location\}" format.
         *       parent: 'projects/my-project/locations/my-location/products/my-product',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "certificateId": "my_certificateId",
         *         //   "createTime": "my_createTime",
         *         //   "creatorEmail": "my_creatorEmail",
         *         //   "credentialType": "my_credentialType",
         *         //   "decryptedCredential": {},
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "encryptedCredential": "my_encryptedCredential",
         *         //   "expiryNotificationDuration": [],
         *         //   "lastModifierEmail": "my_lastModifierEmail",
         *         //   "name": "my_name",
         *         //   "overrideValidTime": "my_overrideValidTime",
         *         //   "reason": "my_reason",
         *         //   "state": "my_state",
         *         //   "updateTime": "my_updateTime",
         *         //   "validTime": "my_validTime",
         *         //   "visibility": "my_visibility"
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        create(params: Params$Resource$Projects$Locations$Products$Authconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Authconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        create(params: Params$Resource$Projects$Locations$Products$Authconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Authconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        create(params: Params$Resource$Projects$Locations$Products$Authconfigs$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        /**
         * Deletes an auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.authConfigs.delete(
         *     {
         *       // Required. The name that is associated with the AuthConfig.
         *       name: 'projects/my-project/locations/my-location/products/my-product/authConfigs/my-authConfig',
         *     }
         *   );
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
        delete(params: Params$Resource$Projects$Locations$Products$Authconfigs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Authconfigs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Authconfigs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Authconfigs$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Authconfigs$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets a complete auth config. If the auth config doesn't exist, Code.NOT_FOUND exception will be thrown. Returns the decrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.authConfigs.get({
         *     // Required. The name that is associated with the AuthConfig.
         *     name: 'projects/my-project/locations/my-location/products/my-product/authConfigs/my-authConfig',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        get(params: Params$Resource$Projects$Locations$Products$Authconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Authconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        get(params: Params$Resource$Projects$Locations$Products$Authconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Authconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        get(params: Params$Resource$Projects$Locations$Products$Authconfigs$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        /**
         * Lists all auth configs that match the filter. Restrict to auth configs belong to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.authConfigs.list({
         *     // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *     filter: 'placeholder-value',
         *     // The size of entries in the response. If unspecified, defaults to 100.
         *     pageSize: 'placeholder-value',
         *     // The token returned in the previous response.
         *     pageToken: 'placeholder-value',
         *     // Required. The client, which owns this collection of AuthConfigs.
         *     parent: 'projects/my-project/locations/my-location/products/my-product',
         *     // The mask which specifies fields that need to be returned in the AuthConfig's response.
         *     readMask: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigs": [],
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
        list(params: Params$Resource$Projects$Locations$Products$Authconfigs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Authconfigs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Authconfigs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Authconfigs$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Authconfigs$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListAuthConfigsResponse>): void;
        /**
         * Updates an auth config. If credential is updated, fetch the encrypted auth config from Spanner, decrypt with Cloud KMS key, update the credential fields, re-encrypt with Cloud KMS key and update the Spanner record. For other fields, directly update the Spanner record. Returns the encrypted auth config.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.authConfigs.patch({
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.encryptedPrivateKey': 'placeholder-value',
         *     // 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         *     'clientCertificate.passphrase': 'placeholder-value',
         *     // The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         *     'clientCertificate.sslCertificate': 'placeholder-value',
         *     // Resource name of the SFDC instance projects/{project\}/locations/{location\}/authConfigs/{authConfig\}.
         *     name: 'projects/my-project/locations/my-location/products/my-product/authConfigs/my-authConfig',
         *     // Field mask specifying the fields in the above AuthConfig that have been modified and need to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "certificateId": "my_certificateId",
         *       //   "createTime": "my_createTime",
         *       //   "creatorEmail": "my_creatorEmail",
         *       //   "credentialType": "my_credentialType",
         *       //   "decryptedCredential": {},
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "encryptedCredential": "my_encryptedCredential",
         *       //   "expiryNotificationDuration": [],
         *       //   "lastModifierEmail": "my_lastModifierEmail",
         *       //   "name": "my_name",
         *       //   "overrideValidTime": "my_overrideValidTime",
         *       //   "reason": "my_reason",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "validTime": "my_validTime",
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateId": "my_certificateId",
         *   //   "createTime": "my_createTime",
         *   //   "creatorEmail": "my_creatorEmail",
         *   //   "credentialType": "my_credentialType",
         *   //   "decryptedCredential": {},
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "encryptedCredential": "my_encryptedCredential",
         *   //   "expiryNotificationDuration": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "overrideValidTime": "my_overrideValidTime",
         *   //   "reason": "my_reason",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "validTime": "my_validTime",
         *   //   "visibility": "my_visibility"
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
        patch(params: Params$Resource$Projects$Locations$Products$Authconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Products$Authconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>>;
        patch(params: Params$Resource$Projects$Locations$Products$Authconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Authconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Authconfigs$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaAuthConfig>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Authconfigs$Create extends StandardParameters {
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.encryptedPrivateKey'?: string;
        /**
         * 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         */
        'clientCertificate.passphrase'?: string;
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.sslCertificate'?: string;
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaAuthConfig;
    }
    export interface Params$Resource$Projects$Locations$Products$Authconfigs$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the AuthConfig.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Authconfigs$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the AuthConfig.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Authconfigs$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of AuthConfigs.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the AuthConfig's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Authconfigs$Patch extends StandardParameters {
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.encryptedPrivateKey'?: string;
        /**
         * 'passphrase' should be left unset if private key is not encrypted. Note that 'passphrase' is not the password for web server, but an extra layer of security to protected private key.
         */
        'clientCertificate.passphrase'?: string;
        /**
         * The ssl certificate encoded in PEM format. This string must include the begin header and end footer lines. For example, -----BEGIN CERTIFICATE----- MIICTTCCAbagAwIBAgIJAPT0tSKNxan/MA0GCSqGSIb3DQEBCwUAMCoxFzAVBgNV BAoTDkdvb2dsZSBURVNUSU5HMQ8wDQYDVQQDEwZ0ZXN0Q0EwHhcNMTUwMTAxMDAw MDAwWhcNMjUwMTAxMDAwMDAwWjAuMRcwFQYDVQQKEw5Hb29nbGUgVEVTVElORzET MBEGA1UEAwwKam9lQGJhbmFuYTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA vDYFgMgxi5W488d9J7UpCInl0NXmZQpJDEHE4hvkaRlH7pnC71H0DLt0/3zATRP1 JzY2+eqBmbGl4/sgZKYv8UrLnNyQNUTsNx1iZAfPUflf5FwgVsai8BM0pUciq1NB xD429VFcrGZNucvFLh72RuRFIKH8WUpiK/iZNFkWhZ0CAwEAAaN3MHUwDgYDVR0P AQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAMBgNVHRMB Af8EAjAAMBkGA1UdDgQSBBCVgnFBCWgL/iwCqnGrhTPQMBsGA1UdIwQUMBKAEKey Um2o4k2WiEVA0ldQvNYwDQYJKoZIhvcNAQELBQADgYEAYK986R4E3L1v+Q6esBtW JrUwA9UmJRSQr0N5w3o9XzarU37/bkjOP0Fw0k/A6Vv1n3vlciYfBFaBIam1qRHr 5dMsYf4CZS6w50r7hyzqyrwDoyNxkLnd2PdcHT/sym1QmflsjEs7pejtnohO6N2H wQW6M0H7Zt8claGRla4fKkg= -----END CERTIFICATE-----
         */
        'clientCertificate.sslCertificate'?: string;
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/authConfigs/{authConfig\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above AuthConfig that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaAuthConfig;
    }
    export class Resource$Projects$Locations$Products$Certificates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new certificate. The certificate will be registered to the trawler service and will be encrypted using cloud KMS and stored in Spanner Returns the certificate.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.certificates.create({
         *       // Required. "projects/{project\}/locations/{location\}" format.
         *       parent: 'projects/my-project/locations/my-location/products/my-product',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "certificateStatus": "my_certificateStatus",
         *         //   "credentialId": "my_credentialId",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "name": "my_name",
         *         //   "rawCertificate": {},
         *         //   "requestorId": "my_requestorId",
         *         //   "validEndTime": "my_validEndTime",
         *         //   "validStartTime": "my_validStartTime"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateStatus": "my_certificateStatus",
         *   //   "credentialId": "my_credentialId",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "rawCertificate": {},
         *   //   "requestorId": "my_requestorId",
         *   //   "validEndTime": "my_validEndTime",
         *   //   "validStartTime": "my_validStartTime"
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
        create(params: Params$Resource$Projects$Locations$Products$Certificates$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Certificates$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCertificate>>;
        create(params: Params$Resource$Projects$Locations$Products$Certificates$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Certificates$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        create(params: Params$Resource$Projects$Locations$Products$Certificates$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        /**
         * Delete a certificate
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.certificates.delete({
         *       // Required. The name that is associated with the Certificate.
         *       name: 'projects/my-project/locations/my-location/products/my-product/certificates/my-certificate',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Products$Certificates$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Certificates$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Certificates$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Certificates$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Certificates$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Get a certificates in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.certificates.get({
         *     // Required. The certificate to retrieve. Format: projects/{project\}/locations/{location\}/certificates/{certificate\}
         *     name: 'projects/my-project/locations/my-location/products/my-product/certificates/my-certificate',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateStatus": "my_certificateStatus",
         *   //   "credentialId": "my_credentialId",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "rawCertificate": {},
         *   //   "requestorId": "my_requestorId",
         *   //   "validEndTime": "my_validEndTime",
         *   //   "validStartTime": "my_validStartTime"
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
        get(params: Params$Resource$Projects$Locations$Products$Certificates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Certificates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCertificate>>;
        get(params: Params$Resource$Projects$Locations$Products$Certificates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Certificates$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        get(params: Params$Resource$Projects$Locations$Products$Certificates$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        /**
         * List all the certificates that match the filter. Restrict to certificate of current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.certificates.list({
         *     // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *     filter: 'placeholder-value',
         *     // The size of entries in the response. If unspecified, defaults to 100.
         *     pageSize: 'placeholder-value',
         *     // The token returned in the previous response.
         *     pageToken: 'placeholder-value',
         *     // Required. The client, which owns this collection of Certificates.
         *     parent: 'projects/my-project/locations/my-location/products/my-product',
         *     // The mask which specifies fields that need to be returned in the Certificate's response.
         *     readMask: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificates": [],
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
        list(params: Params$Resource$Projects$Locations$Products$Certificates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Certificates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Certificates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Certificates$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Certificates$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListCertificatesResponse>): void;
        /**
         * Updates the certificate by id. If new certificate file is updated, it will register with the trawler service, re-encrypt with cloud KMS and update the Spanner record. Other fields will directly update the Spanner record. Returns the Certificate.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.certificates.patch(
         *     {
         *       // Output only. Auto generated primary key
         *       name: 'projects/my-project/locations/my-location/products/my-product/certificates/my-certificate',
         *       // Field mask specifying the fields in the above Certificate that have been modified and need to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "certificateStatus": "my_certificateStatus",
         *         //   "credentialId": "my_credentialId",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "name": "my_name",
         *         //   "rawCertificate": {},
         *         //   "requestorId": "my_requestorId",
         *         //   "validEndTime": "my_validEndTime",
         *         //   "validStartTime": "my_validStartTime"
         *         // }
         *       },
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "certificateStatus": "my_certificateStatus",
         *   //   "credentialId": "my_credentialId",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "rawCertificate": {},
         *   //   "requestorId": "my_requestorId",
         *   //   "validEndTime": "my_validEndTime",
         *   //   "validStartTime": "my_validStartTime"
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
        patch(params: Params$Resource$Projects$Locations$Products$Certificates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Products$Certificates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCertificate>>;
        patch(params: Params$Resource$Projects$Locations$Products$Certificates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Certificates$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Certificates$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCertificate>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Certificates$Create extends StandardParameters {
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaCertificate;
    }
    export interface Params$Resource$Projects$Locations$Products$Certificates$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the Certificate.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Certificates$Get extends StandardParameters {
        /**
         * Required. The certificate to retrieve. Format: projects/{project\}/locations/{location\}/certificates/{certificate\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Certificates$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of Certificates.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the Certificate's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Certificates$Patch extends StandardParameters {
        /**
         * Output only. Auto generated primary key
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above Certificate that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaCertificate;
    }
    export class Resource$Projects$Locations$Products$Integrations {
        context: APIRequestContext;
        executions: Resource$Projects$Locations$Products$Integrations$Executions;
        versions: Resource$Projects$Locations$Products$Integrations$Versions;
        constructor(context: APIRequestContext);
        /**
         * Delete the selected integration and all versions inside
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.delete({
         *       // Required. The location resource of the request.
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Integrations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Executes integrations synchronously by passing the trigger id in the request body. The request is not returned until the requested executions are either fulfilled or experienced an error. If the integration name is not specified (passing `-`), all of the associated integration under the given trigger_id will be executed. Otherwise only the specified integration for the given `trigger_id` is executed. This is helpful for execution the integration from UI.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.execute({
         *       // Required. The integration resource name.
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "doNotPropagateError": false,
         *         //   "executionId": "my_executionId",
         *         //   "inputParameters": {},
         *         //   "parameterEntries": [],
         *         //   "parameters": {},
         *         //   "requestId": "my_requestId",
         *         //   "triggerId": "my_triggerId"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "eventParameters": {},
         *   //   "executionFailed": false,
         *   //   "executionId": "my_executionId",
         *   //   "outputParameters": {},
         *   //   "parameterEntries": []
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
        execute(params: Params$Resource$Projects$Locations$Products$Integrations$Execute, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        execute(params?: Params$Resource$Projects$Locations$Products$Integrations$Execute, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>>;
        execute(params: Params$Resource$Projects$Locations$Products$Integrations$Execute, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        execute(params: Params$Resource$Projects$Locations$Products$Integrations$Execute, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        execute(params: Params$Resource$Projects$Locations$Products$Integrations$Execute, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        execute(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsResponse>): void;
        /**
         * Returns the list of all integrations in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.integrations.list({
         *     // Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         *     filter: 'placeholder-value',
         *     // The results would be returned in order you specified here. Supported sort keys are: Descending sort order by "last_modified_time", "created_time", "snapshot_number". Ascending sort order by the integration name.
         *     orderBy: 'placeholder-value',
         *     // The page size for the resquest.
         *     pageSize: 'placeholder-value',
         *     // The page token for the resquest.
         *     pageToken: 'placeholder-value',
         *     // Required. Project and location from which the integrations should be listed. Format: projects/{project\}
         *     parent: 'projects/my-project/locations/my-location/products/my-product',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrations": [],
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
        list(params: Params$Resource$Projects$Locations$Products$Integrations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Integrations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationsResponse>): void;
        /**
         * Schedules an integration for execution by passing the trigger id and the scheduled time in the request body.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.schedule({
         *       // The integration resource name.
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "inputParameters": {},
         *         //   "parameterEntries": [],
         *         //   "parameters": {},
         *         //   "requestId": "my_requestId",
         *         //   "scheduleTime": "my_scheduleTime",
         *         //   "triggerId": "my_triggerId"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionInfoIds": []
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
        schedule(params: Params$Resource$Projects$Locations$Products$Integrations$Schedule, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        schedule(params?: Params$Resource$Projects$Locations$Products$Integrations$Schedule, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>>;
        schedule(params: Params$Resource$Projects$Locations$Products$Integrations$Schedule, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        schedule(params: Params$Resource$Projects$Locations$Products$Integrations$Schedule, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
        schedule(params: Params$Resource$Projects$Locations$Products$Integrations$Schedule, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
        schedule(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Delete extends StandardParameters {
        /**
         * Required. The location resource of the request.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Execute extends StandardParameters {
        /**
         * Required. The integration resource name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaExecuteIntegrationsRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$List extends StandardParameters {
        /**
         * Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         */
        filter?: string;
        /**
         * The results would be returned in order you specified here. Supported sort keys are: Descending sort order by "last_modified_time", "created_time", "snapshot_number". Ascending sort order by the integration name.
         */
        orderBy?: string;
        /**
         * The page size for the resquest.
         */
        pageSize?: number;
        /**
         * The page token for the resquest.
         */
        pageToken?: string;
        /**
         * Required. Project and location from which the integrations should be listed. Format: projects/{project\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Schedule extends StandardParameters {
        /**
         * The integration resource name.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaScheduleIntegrationsRequest;
    }
    export class Resource$Projects$Locations$Products$Integrations$Executions {
        context: APIRequestContext;
        suspensions: Resource$Projects$Locations$Products$Integrations$Executions$Suspensions;
        constructor(context: APIRequestContext);
        /**
         * Cancellation of an execution
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.cancel(
         *       {
         *         // Required. The execution resource name. Format: projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_id\}/executions/{execution_id\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/executions/my-execution',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {}
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "isCanceled": false
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
        cancel(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse>>;
        cancel(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse>): void;
        cancel(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse>): void;
        cancel(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaCancelExecutionResponse>): void;
        /**
         * Get an execution in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.get({
         *       // Required. The execution resource name. Format: projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_id\}/executions/{execution_id\}
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/executions/my-execution',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "directSubExecutions": [],
         *   //   "eventExecutionDetails": {},
         *   //   "executionDetails": {},
         *   //   "executionMethod": "my_executionMethod",
         *   //   "name": "my_name",
         *   //   "requestParameters": {},
         *   //   "requestParams": [],
         *   //   "responseParameters": {},
         *   //   "responseParams": [],
         *   //   "triggerId": "my_triggerId",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaExecution>>;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecution>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecution>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecution>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaExecution>): void;
        /**
         * Lists the results of all the integration executions. The response includes the same information as the [execution log](https://cloud.google.com/application-integration/docs/viewing-logs) in the Integration UI.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.list(
         *       {
         *         // Optional. Standard filter field, we support filtering on following fields: workflow_name: the name of the integration. CreateTimestamp: the execution created time. event_execution_state: the state of the executions. execution_id: the id of the execution. trigger_id: the id of the trigger. parameter_type: the type of the parameters involved in the execution. All fields support for EQUALS, in additional: CreateTimestamp support for LESS_THAN, GREATER_THAN ParameterType support for HAS For example: "parameter_type" HAS \"string\" Also supports operators like AND, OR, NOT For example, trigger_id=\"id1\" AND workflow_name=\"testWorkflow\"
         *         filter: 'placeholder-value',
         *         // Optional user-provided custom filter.
         *         'filterParams.customFilter': 'placeholder-value',
         *         // End timestamp.
         *         'filterParams.endTime': 'placeholder-value',
         *         // List of possible event statuses.
         *         'filterParams.eventStatuses': 'placeholder-value',
         *         // Execution id.
         *         'filterParams.executionId': 'placeholder-value',
         *         // Param key. DEPRECATED. User parameter_pair_key instead.
         *         'filterParams.parameterKey': 'placeholder-value',
         *         // Param key in the key value pair filter.
         *         'filterParams.parameterPairKey': 'placeholder-value',
         *         // Param value in the key value pair filter.
         *         'filterParams.parameterPairValue': 'placeholder-value',
         *         // Param type.
         *         'filterParams.parameterType': 'placeholder-value',
         *         // Param value. DEPRECATED. User parameter_pair_value instead.
         *         'filterParams.parameterValue': 'placeholder-value',
         *         // Start timestamp.
         *         'filterParams.startTime': 'placeholder-value',
         *         // List of possible task statuses.
         *         'filterParams.taskStatuses': 'placeholder-value',
         *         // Workflow name.
         *         'filterParams.workflowName': 'placeholder-value',
         *         // Optional. The results would be returned in order you specified here. Currently supporting "last_modified_time" and "create_time".
         *         orderBy: 'placeholder-value',
         *         // Optional. The size of entries in the response.
         *         pageSize: 'placeholder-value',
         *         // Optional. The token returned in the previous response.
         *         pageToken: 'placeholder-value',
         *         // Required. The parent resource name of the integration execution.
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *         // Optional. View mask for the response data. If set, only the field specified will be returned as part of the result. If not set, all fields in event execution info will be filled and returned.
         *         readMask: 'placeholder-value',
         *         // Optional. If true, the service will use the most recent acl information to list event execution infos and renew the acl cache. Note that fetching the most recent acl is synchronous, so it will increase RPC call latency.
         *         refreshAcl: 'placeholder-value',
         *         // Optional. If true, the service will truncate the params to only keep the first 1000 characters of string params and empty the executions in order to make response smaller. Only works for UI and when the params fields are not filtered out.
         *         truncateParams: 'placeholder-value',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "executionInfos": [],
         *   //   "executions": [],
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
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListExecutionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$Cancel extends StandardParameters {
        /**
         * Required. The execution resource name. Format: projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_id\}/executions/{execution_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaCancelExecutionRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$Get extends StandardParameters {
        /**
         * Required. The execution resource name. Format: projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_id\}/executions/{execution_id\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$List extends StandardParameters {
        /**
         * Optional. Standard filter field, we support filtering on following fields: workflow_name: the name of the integration. CreateTimestamp: the execution created time. event_execution_state: the state of the executions. execution_id: the id of the execution. trigger_id: the id of the trigger. parameter_type: the type of the parameters involved in the execution. All fields support for EQUALS, in additional: CreateTimestamp support for LESS_THAN, GREATER_THAN ParameterType support for HAS For example: "parameter_type" HAS \"string\" Also supports operators like AND, OR, NOT For example, trigger_id=\"id1\" AND workflow_name=\"testWorkflow\"
         */
        filter?: string;
        /**
         * Optional user-provided custom filter.
         */
        'filterParams.customFilter'?: string;
        /**
         * End timestamp.
         */
        'filterParams.endTime'?: string;
        /**
         * List of possible event statuses.
         */
        'filterParams.eventStatuses'?: string[];
        /**
         * Execution id.
         */
        'filterParams.executionId'?: string;
        /**
         * Param key. DEPRECATED. User parameter_pair_key instead.
         */
        'filterParams.parameterKey'?: string;
        /**
         * Param key in the key value pair filter.
         */
        'filterParams.parameterPairKey'?: string;
        /**
         * Param value in the key value pair filter.
         */
        'filterParams.parameterPairValue'?: string;
        /**
         * Param type.
         */
        'filterParams.parameterType'?: string;
        /**
         * Param value. DEPRECATED. User parameter_pair_value instead.
         */
        'filterParams.parameterValue'?: string;
        /**
         * Start timestamp.
         */
        'filterParams.startTime'?: string;
        /**
         * List of possible task statuses.
         */
        'filterParams.taskStatuses'?: string[];
        /**
         * Workflow name.
         */
        'filterParams.workflowName'?: string;
        /**
         * Optional. The results would be returned in order you specified here. Currently supporting "last_modified_time" and "create_time".
         */
        orderBy?: string;
        /**
         * Optional. The size of entries in the response.
         */
        pageSize?: number;
        /**
         * Optional. The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The parent resource name of the integration execution.
         */
        parent?: string;
        /**
         * Optional. View mask for the response data. If set, only the field specified will be returned as part of the result. If not set, all fields in event execution info will be filled and returned.
         */
        readMask?: string;
        /**
         * Optional. If true, the service will use the most recent acl information to list event execution infos and renew the acl cache. Note that fetching the most recent acl is synchronous, so it will increase RPC call latency.
         */
        refreshAcl?: boolean;
        /**
         * Optional. If true, the service will truncate the params to only keep the first 1000 characters of string params and empty the executions in order to make response smaller. Only works for UI and when the params fields are not filtered out.
         */
        truncateParams?: boolean;
    }
    export class Resource$Projects$Locations$Products$Integrations$Executions$Suspensions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * * Lifts suspension for advanced suspension task. Fetch corresponding suspension with provided suspension Id, resolve suspension, and set up suspension result for the Suspension Task.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.suspensions.lift(
         *       {
         *         // Required. The resource that the suspension belongs to. "projects/{project\}/locations/{location\}/products/{product\}/integrations/{integration\}/executions/{execution\}/suspensions/{suspenion\}" format.
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/executions/my-execution/suspensions/my-suspension',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "suspensionResult": "my_suspensionResult"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "eventExecutionInfoId": "my_eventExecutionInfoId"
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
        lift(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lift(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>>;
        lift(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lift(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        lift(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        lift(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionResponse>): void;
        /**
         * * Lists suspensions associated with a specific execution. Only those with permissions to resolve the relevant suspensions will be able to view them.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.suspensions.list(
         *       {
         *         // Standard filter field.
         *         filter: 'placeholder-value',
         *         // Field name to order by.
         *         orderBy: 'placeholder-value',
         *         // Maximum number of entries in the response.
         *         pageSize: 'placeholder-value',
         *         // Token to retrieve a specific page.
         *         pageToken: 'placeholder-value',
         *         // Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/executions/my-execution',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "suspensions": []
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
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSuspensionsResponse>): void;
        /**
         * * Resolves (lifts/rejects) any number of suspensions. If the integration is already running, only the status of the suspension is updated. Otherwise, the suspended integration will begin execution again.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.executions.suspensions.resolve(
         *       {
         *         // Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}/suspensions/{suspension_id\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/executions/my-execution/suspensions/my-suspension',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "suspension": {}
         *           // }
         *         },
         *       }
         *     );
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
        resolve(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resolve(params?: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>>;
        resolve(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resolve(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
        resolve(params: Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
        resolve(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Lift extends StandardParameters {
        /**
         * Required. The resource that the suspension belongs to. "projects/{project\}/locations/{location\}/products/{product\}/integrations/{integration\}/executions/{execution\}/suspensions/{suspenion\}" format.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaLiftSuspensionRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$List extends StandardParameters {
        /**
         * Standard filter field.
         */
        filter?: string;
        /**
         * Field name to order by.
         */
        orderBy?: string;
        /**
         * Maximum number of entries in the response.
         */
        pageSize?: number;
        /**
         * Token to retrieve a specific page.
         */
        pageToken?: string;
        /**
         * Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Executions$Suspensions$Resolve extends StandardParameters {
        /**
         * Required. projects/{gcp_project_id\}/locations/{location\}/products/{product\}/integrations/{integration_name\}/executions/{execution_name\}/suspensions/{suspension_id\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaResolveSuspensionRequest;
    }
    export class Resource$Projects$Locations$Products$Integrations$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create a integration with a draft version in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.create(
         *       {
         *         // Set this flag to true, if draft version is to be created for a brand new integration. False, if the request is for an existing integration. For backward compatibility reasons, even if this flag is set to `false` and no existing integration is found, a new draft integration will still be created.
         *         newIntegration: 'placeholder-value',
         *         // Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "createTime": "my_createTime",
         *           //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *           //   "description": "my_description",
         *           //   "errorCatcherConfigs": [],
         *           //   "integrationParameters": [],
         *           //   "integrationParametersInternal": {},
         *           //   "lastModifierEmail": "my_lastModifierEmail",
         *           //   "lockHolder": "my_lockHolder",
         *           //   "name": "my_name",
         *           //   "origin": "my_origin",
         *           //   "parentTemplateId": "my_parentTemplateId",
         *           //   "runAsServiceAccount": "my_runAsServiceAccount",
         *           //   "snapshotNumber": "my_snapshotNumber",
         *           //   "state": "my_state",
         *           //   "status": "my_status",
         *           //   "taskConfigs": [],
         *           //   "taskConfigsInternal": [],
         *           //   "teardown": {},
         *           //   "triggerConfigs": [],
         *           //   "triggerConfigsInternal": [],
         *           //   "updateTime": "my_updateTime",
         *           //   "userLabel": "my_userLabel"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        create(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        create(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        create(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * Soft-deletes the integration. Changes the status of the integration to ARCHIVED. If the integration being ARCHIVED is tagged as "HEAD", the tag is removed from this snapshot and set to the previous non-ARCHIVED snapshot. The PUBLISH_REQUESTED, DUE_FOR_DELETION tags are removed too. This RPC throws an exception if the version being deleted is DRAFT, and if the `locked_by` user is not the same as the user performing the Delete. Audit fields updated include last_modified_timestamp, last_modified_by. Any existing lock is released when Deleting a integration. Currently, there is no undelete mechanism.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.delete(
         *       {
         *         // Required. The version to delete. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *       }
         *     );
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
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Downloads an integration. Retrieves the `IntegrationVersion` for a given `integration_id` and returns the response as a string.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.download(
         *       {
         *         // File format for download request.
         *         fileFormat: 'placeholder-value',
         *         // Required. The version to download. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "content": "my_content"
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
        download(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Download, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        download(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Download, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>>;
        download(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Download, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        download(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Download, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        download(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Download, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        download(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaDownloadIntegrationVersionResponse>): void;
        /**
         * Get a integration in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.get({
         *       // Required. The version to retrieve. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * Returns the list of all integration versions in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.list({
         *       // The field mask which specifies the particular data to be returned.
         *       fieldMask: 'placeholder-value',
         *       // Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         *       filter: 'placeholder-value',
         *       // The results would be returned in order you specified here. Currently supported sort keys are: Descending sort order for "last_modified_time", "created_time", "snapshot_number" Ascending sort order for "name".
         *       orderBy: 'placeholder-value',
         *       // The maximum number of versions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         *       pageSize: 'placeholder-value',
         *       // A page token, received from a previous `ListIntegrationVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationVersions` must match the call that provided the page token.
         *       pageToken: 'placeholder-value',
         *       // Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\} Specifically, when parent equals: 1. projects//locations//integrations/, Meaning: "List versions (with filter) for a particular integration". 2. projects//locations//integrations/- Meaning: "List versions (with filter) for a client within a particular region". 3. projects//locations/-/integrations/- Meaning: "List versions (with filter) for a client".
         *       parent:
         *         'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersions": [],
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "noPermission": false
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
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationVersionsResponse>): void;
        /**
         * Update a integration with a draft version in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.patch({
         *       // Output only. Auto-generated primary key.
         *       name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *       // Field mask specifying the fields in the above integration that have been modified and need to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "createTime": "my_createTime",
         *         //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *         //   "description": "my_description",
         *         //   "errorCatcherConfigs": [],
         *         //   "integrationParameters": [],
         *         //   "integrationParametersInternal": {},
         *         //   "lastModifierEmail": "my_lastModifierEmail",
         *         //   "lockHolder": "my_lockHolder",
         *         //   "name": "my_name",
         *         //   "origin": "my_origin",
         *         //   "parentTemplateId": "my_parentTemplateId",
         *         //   "runAsServiceAccount": "my_runAsServiceAccount",
         *         //   "snapshotNumber": "my_snapshotNumber",
         *         //   "state": "my_state",
         *         //   "status": "my_status",
         *         //   "taskConfigs": [],
         *         //   "taskConfigsInternal": [],
         *         //   "teardown": {},
         *         //   "triggerConfigs": [],
         *         //   "triggerConfigsInternal": [],
         *         //   "updateTime": "my_updateTime",
         *         //   "userLabel": "my_userLabel"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "integrationParameters": [],
         *   //   "integrationParametersInternal": {},
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "lockHolder": "my_lockHolder",
         *   //   "name": "my_name",
         *   //   "origin": "my_origin",
         *   //   "parentTemplateId": "my_parentTemplateId",
         *   //   "runAsServiceAccount": "my_runAsServiceAccount",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "state": "my_state",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "taskConfigsInternal": [],
         *   //   "teardown": {},
         *   //   "triggerConfigs": [],
         *   //   "triggerConfigsInternal": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        patch(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>>;
        patch(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion>): void;
        /**
         * This RPC throws an exception if the integration is in ARCHIVED or ACTIVE state. This RPC throws an exception if the version being published is DRAFT, and if the `locked_by` user is not the same as the user performing the Publish. Audit fields updated include last_published_timestamp, last_published_by, last_modified_timestamp, last_modified_by. Any existing lock is on this integration is released.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.publish(
         *       {
         *         // Required. The version to publish. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {}
         *         },
         *       }
         *     );
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
        publish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        publish(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>>;
        publish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        publish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        publish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        publish(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionResponse>): void;
        /**
         * Clears the `locked_by` and `locked_at_timestamp`in the DRAFT version of this integration. It then performs the same action as the CreateDraftIntegrationVersion (i.e., copies the DRAFT version of the integration as a SNAPSHOT and then creates a new DRAFT version with the `locked_by` set to the `user_taking_over` and the `locked_at_timestamp` set to the current timestamp). Both the `locked_by` and `user_taking_over` are notified via email about the takeover. This RPC throws an exception if the integration is not in DRAFT status or if the `locked_by` and `locked_at_timestamp` fields are not set.The TakeoverEdit lock is treated the same as an edit of the integration, and hence shares ACLs with edit. Audit fields updated include last_modified_timestamp, last_modified_by.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.takeoverEditLock(
         *       {
         *         // Required. The version to take over edit lock. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         integrationVersion:
         *           'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {}
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersion": {}
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
        takeoverEditLock(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        takeoverEditLock(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>>;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        takeoverEditLock(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        takeoverEditLock(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockResponse>): void;
        /**
         * Sets the status of the ACTIVE integration to SNAPSHOT with a new tag "PREVIOUSLY_PUBLISHED" after validating it. The "HEAD" and "PUBLISH_REQUESTED" tags do not change. This RPC throws an exception if the version being snapshot is not ACTIVE. Audit fields added include action, action_by, action_timestamp.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.unpublish(
         *       {
         *         // Required. The version to deactivate. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrations/my-integration/versions/my-version',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {}
         *         },
         *       }
         *     );
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
        unpublish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unpublish(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        unpublish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unpublish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        unpublish(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        unpublish(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Uploads an integration. The content can be a previously downloaded integration. Performs the same function as CreateDraftIntegrationVersion, but accepts input in a string format, which holds the complete representation of the IntegrationVersion content.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrations.versions.upload(
         *       {
         *         // Required. The version to upload. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrations/my-integration',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "content": "my_content",
         *           //   "fileFormat": "my_fileFormat"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationVersion": {}
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
        upload(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        upload(params?: Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>>;
        upload(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        upload(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
        upload(params: Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
        upload(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Create extends StandardParameters {
        /**
         * Set this flag to true, if draft version is to be created for a brand new integration. False, if the request is for an existing integration. For backward compatibility reasons, even if this flag is set to `false` and no existing integration is found, a new draft integration will still be created.
         */
        newIntegration?: boolean;
        /**
         * Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Delete extends StandardParameters {
        /**
         * Required. The version to delete. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Download extends StandardParameters {
        /**
         * File format for download request.
         */
        fileFormat?: string;
        /**
         * Required. The version to download. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Get extends StandardParameters {
        /**
         * Required. The version to retrieve. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$List extends StandardParameters {
        /**
         * The field mask which specifies the particular data to be returned.
         */
        fieldMask?: string;
        /**
         * Filter on fields of IntegrationVersion. Fields can be compared with literal values by use of ":" (containment), "=" (equality), "\>" (greater), "<" (less than), \>=" (greater than or equal to), "<=" (less than or equal to), and "!=" (inequality) operators. Negation, conjunction, and disjunction are written using NOT, AND, and OR keywords. For example, organization_id=\"1\" AND state=ACTIVE AND description:"test". Filtering cannot be performed on repeated fields like `task_config`.
         */
        filter?: string;
        /**
         * The results would be returned in order you specified here. Currently supported sort keys are: Descending sort order for "last_modified_time", "created_time", "snapshot_number" Ascending sort order for "name".
         */
        orderBy?: string;
        /**
         * The maximum number of versions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListIntegrationVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationVersions` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent resource where this version will be created. Format: projects/{project\}/locations/{location\}/integrations/{integration\} Specifically, when parent equals: 1. projects//locations//integrations/, Meaning: "List versions (with filter) for a particular integration". 2. projects//locations//integrations/- Meaning: "List versions (with filter) for a client within a particular region". 3. projects//locations/-/integrations/- Meaning: "List versions (with filter) for a client".
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Patch extends StandardParameters {
        /**
         * Output only. Auto-generated primary key.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above integration that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaIntegrationVersion;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Publish extends StandardParameters {
        /**
         * Required. The version to publish. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaPublishIntegrationVersionRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Takeovereditlock extends StandardParameters {
        /**
         * Required. The version to take over edit lock. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        integrationVersion?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaTakeoverEditLockRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Unpublish extends StandardParameters {
        /**
         * Required. The version to deactivate. Format: projects/{project\}/locations/{location\}/integrations/{integration\}/versions/{version\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaUnpublishIntegrationVersionRequest;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrations$Versions$Upload extends StandardParameters {
        /**
         * Required. The version to upload. Format: projects/{project\}/locations/{location\}/integrations/{integration\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaUploadIntegrationVersionRequest;
    }
    export class Resource$Projects$Locations$Products$Integrationtemplates {
        context: APIRequestContext;
        versions: Resource$Projects$Locations$Products$Integrationtemplates$Versions;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Products$Integrationtemplates$Versions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an IntegrationTemplateVersion.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrationtemplates.versions.create(
         *       {
         *         // Required. The parent resource where this TemplateVersion will be created. Format: projects/{project\}/location/{location\}/product/{product\}/integrationtemplates/{integrationtemplate\}
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrationtemplates/my-integrationtemplate',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "createTime": "my_createTime",
         *           //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *           //   "description": "my_description",
         *           //   "errorCatcherConfigs": [],
         *           //   "lastModifierEmail": "my_lastModifierEmail",
         *           //   "name": "my_name",
         *           //   "parentIntegrationVersionId": "my_parentIntegrationVersionId",
         *           //   "snapshotNumber": "my_snapshotNumber",
         *           //   "status": "my_status",
         *           //   "taskConfigs": [],
         *           //   "teardown": {},
         *           //   "templateParameters": {},
         *           //   "triggerConfigs": [],
         *           //   "updateTime": "my_updateTime",
         *           //   "userLabel": "my_userLabel"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "parentIntegrationVersionId": "my_parentIntegrationVersionId",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "teardown": {},
         *   //   "templateParameters": {},
         *   //   "triggerConfigs": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        create(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>>;
        create(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        create(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        /**
         * Returns an IntegrationTemplateVersion in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrationtemplates.versions.get(
         *       {
         *         // Required. The TemplateVersion to retrieve. Format: projects/{project\}/locations/{location\}/products/{product\}/integrationtemplates/{integrationtemplate\}/versions/{version\}
         *         name: 'projects/my-project/locations/my-location/products/my-product/integrationtemplates/my-integrationtemplate/versions/my-version',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "databasePersistencePolicy": "my_databasePersistencePolicy",
         *   //   "description": "my_description",
         *   //   "errorCatcherConfigs": [],
         *   //   "lastModifierEmail": "my_lastModifierEmail",
         *   //   "name": "my_name",
         *   //   "parentIntegrationVersionId": "my_parentIntegrationVersionId",
         *   //   "snapshotNumber": "my_snapshotNumber",
         *   //   "status": "my_status",
         *   //   "taskConfigs": [],
         *   //   "teardown": {},
         *   //   "templateParameters": {},
         *   //   "triggerConfigs": [],
         *   //   "updateTime": "my_updateTime",
         *   //   "userLabel": "my_userLabel"
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
        get(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>>;
        get(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        get(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion>): void;
        /**
         * Returns the list of all IntegrationTemplateVersions in the specified project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.integrationtemplates.versions.list(
         *       {
         *         // Filter syntax: defined in the EBNF grammar.
         *         filter: 'placeholder-value',
         *         // The maximum number of IntegrationTemplateVersions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         *         pageSize: 'placeholder-value',
         *         // A page token, received from a previous `ListIntegrationTemplateVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationTemplateVersions` must match the call that provided the page token.
         *         pageToken: 'placeholder-value',
         *         // Required. Format: projects/{project\}/location/{location\}/product/{product\}/integrationtemplates/{integrationtemplate\}
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/integrationtemplates/my-integrationtemplate',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "integrationTemplateVersions": [],
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
        list(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListIntegrationTemplateVersionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Create extends StandardParameters {
        /**
         * Required. The parent resource where this TemplateVersion will be created. Format: projects/{project\}/location/{location\}/product/{product\}/integrationtemplates/{integrationtemplate\}
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaIntegrationTemplateVersion;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$Get extends StandardParameters {
        /**
         * Required. The TemplateVersion to retrieve. Format: projects/{project\}/locations/{location\}/products/{product\}/integrationtemplates/{integrationtemplate\}/versions/{version\}
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Integrationtemplates$Versions$List extends StandardParameters {
        /**
         * Filter syntax: defined in the EBNF grammar.
         */
        filter?: string;
        /**
         * The maximum number of IntegrationTemplateVersions to return. The service may return fewer than this value. If unspecified, at most 50 versions will be returned. The maximum value is 1000; values above 1000 will be coerced to 1000.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListIntegrationTemplateVersions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIntegrationTemplateVersions` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. Format: projects/{project\}/location/{location\}/product/{product\}/integrationtemplates/{integrationtemplate\}
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Products$Sfdcinstances {
        context: APIRequestContext;
        sfdcChannels: Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels;
        constructor(context: APIRequestContext);
        /**
         * Creates an sfdc instance record. Store the sfdc instance in Spanner. Returns the sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.create({
         *       // Required. "projects/{project\}/locations/{location\}" format.
         *       parent: 'projects/my-project/locations/my-location/products/my-product',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "authConfigId": [],
         *         //   "createTime": "my_createTime",
         *         //   "deleteTime": "my_deleteTime",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "name": "my_name",
         *         //   "serviceAuthority": "my_serviceAuthority",
         *         //   "sfdcOrgId": "my_sfdcOrgId",
         *         //   "updateTime": "my_updateTime"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        /**
         * Deletes an sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.delete({
         *       // Required. The name that is associated with the SfdcInstance.
         *       name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets an sfdc instance. If the instance doesn't exist, Code.NOT_FOUND exception will be thrown.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.sfdcInstances.get({
         *     // Required. The name that is associated with the SfdcInstance.
         *     name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        /**
         * Lists all sfdc instances that match the filter. Restrict to sfdc instances belonging to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.products.sfdcInstances.list(
         *     {
         *       // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *       filter: 'placeholder-value',
         *       // The size of entries in the response. If unspecified, defaults to 100.
         *       pageSize: 'placeholder-value',
         *       // The token returned in the previous response.
         *       pageToken: 'placeholder-value',
         *       // Required. The client, which owns this collection of SfdcInstances.
         *       parent: 'projects/my-project/locations/my-location/products/my-product',
         *       // The mask which specifies fields that need to be returned in the SfdcInstance's response.
         *       readMask: 'placeholder-value',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sfdcInstances": []
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
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        /**
         * Updates an sfdc instance. Updates the sfdc instance in spanner. Returns the sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.patch({
         *       // Resource name of the SFDC instance projects/{project\}/locations/{location\}/sfdcInstances/{sfdcInstance\}.
         *       name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance',
         *       // Field mask specifying the fields in the above SfdcInstance that have been modified and need to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "authConfigId": [],
         *         //   "createTime": "my_createTime",
         *         //   "deleteTime": "my_deleteTime",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "name": "my_name",
         *         //   "serviceAuthority": "my_serviceAuthority",
         *         //   "sfdcOrgId": "my_sfdcOrgId",
         *         //   "updateTime": "my_updateTime"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Create extends StandardParameters {
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcInstance;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcInstance.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcInstance.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of SfdcInstances.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the SfdcInstance's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Patch extends StandardParameters {
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/sfdcInstances/{sfdcInstance\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above SfdcInstance that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcInstance;
    }
    export class Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an sfdc channel record. Store the sfdc channel in Spanner. Returns the sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.sfdcChannels.create(
         *       {
         *         // Required. "projects/{project\}/locations/{location\}" format.
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "channelTopic": "my_channelTopic",
         *           //   "createTime": "my_createTime",
         *           //   "deleteTime": "my_deleteTime",
         *           //   "description": "my_description",
         *           //   "displayName": "my_displayName",
         *           //   "isActive": false,
         *           //   "lastReplayId": "my_lastReplayId",
         *           //   "name": "my_name",
         *           //   "updateTime": "my_updateTime"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        create(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        /**
         * Deletes an sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.sfdcChannels.delete(
         *       {
         *         // Required. The name that is associated with the SfdcChannel.
         *         name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *       }
         *     );
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
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets an sfdc channel. If the channel doesn't exist, Code.NOT_FOUND exception will be thrown.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.sfdcChannels.get(
         *       {
         *         // Required. The name that is associated with the SfdcChannel.
         *         name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        get(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        /**
         * Lists all sfdc channels that match the filter. Restrict to sfdc channels belonging to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.sfdcChannels.list(
         *       {
         *         // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *         filter: 'placeholder-value',
         *         // The size of entries in the response. If unspecified, defaults to 100.
         *         pageSize: 'placeholder-value',
         *         // The token returned in the previous response.
         *         pageToken: 'placeholder-value',
         *         // Required. The client, which owns this collection of SfdcChannels.
         *         parent:
         *           'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance',
         *         // The mask which specifies fields that need to be returned in the SfdcChannel's response.
         *         readMask: 'placeholder-value',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sfdcChannels": []
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
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>>;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        /**
         * Updates an sfdc channel. Updates the sfdc channel in spanner. Returns the sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.products.sfdcInstances.sfdcChannels.patch(
         *       {
         *         // Resource name of the SFDC channel projects/{project\}/locations/{location\}/sfdcInstances/{sfdc_instance\}/sfdcChannels/{sfdc_channel\}.
         *         name: 'projects/my-project/locations/my-location/products/my-product/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *         // Field mask specifying the fields in the above SfdcChannel that have been modified and need to be updated.
         *         updateMask: 'placeholder-value',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "channelTopic": "my_channelTopic",
         *           //   "createTime": "my_createTime",
         *           //   "deleteTime": "my_deleteTime",
         *           //   "description": "my_description",
         *           //   "displayName": "my_displayName",
         *           //   "isActive": false,
         *           //   "lastReplayId": "my_lastReplayId",
         *           //   "name": "my_name",
         *           //   "updateTime": "my_updateTime"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        patch(params: Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Create extends StandardParameters {
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcChannel;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcChannel.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcChannel.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of SfdcChannels.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the SfdcChannel's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Products$Sfdcinstances$Sfdcchannels$Patch extends StandardParameters {
        /**
         * Resource name of the SFDC channel projects/{project\}/locations/{location\}/sfdcInstances/{sfdc_instance\}/sfdcChannels/{sfdc_channel\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above SfdcChannel that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcChannel;
    }
    export class Resource$Projects$Locations$Sfdcinstances {
        context: APIRequestContext;
        sfdcChannels: Resource$Projects$Locations$Sfdcinstances$Sfdcchannels;
        constructor(context: APIRequestContext);
        /**
         * Creates an sfdc instance record. Store the sfdc instance in Spanner. Returns the sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.sfdcInstances.create({
         *     // Required. "projects/{project\}/locations/{location\}" format.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "authConfigId": [],
         *       //   "createTime": "my_createTime",
         *       //   "deleteTime": "my_deleteTime",
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "name": "my_name",
         *       //   "serviceAuthority": "my_serviceAuthority",
         *       //   "sfdcOrgId": "my_sfdcOrgId",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Sfdcinstances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        /**
         * Deletes an sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.sfdcInstances.delete({
         *     // Required. The name that is associated with the SfdcInstance.
         *     name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance',
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
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Sfdcinstances$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets an sfdc instance. If the instance doesn't exist, Code.NOT_FOUND exception will be thrown.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.sfdcInstances.get({
         *     // Required. The name that is associated with the SfdcInstance.
         *     name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Sfdcinstances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        /**
         * Lists all sfdc instances that match the filter. Restrict to sfdc instances belonging to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.sfdcInstances.list({
         *     // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *     filter: 'placeholder-value',
         *     // The size of entries in the response. If unspecified, defaults to 100.
         *     pageSize: 'placeholder-value',
         *     // The token returned in the previous response.
         *     pageToken: 'placeholder-value',
         *     // Required. The client, which owns this collection of SfdcInstances.
         *     parent: 'projects/my-project/locations/my-location',
         *     // The mask which specifies fields that need to be returned in the SfdcInstance's response.
         *     readMask: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sfdcInstances": []
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
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Sfdcinstances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcInstancesResponse>): void;
        /**
         * Updates an sfdc instance. Updates the sfdc instance in spanner. Returns the sfdc instance.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res = await integrations.projects.locations.sfdcInstances.patch({
         *     // Resource name of the SFDC instance projects/{project\}/locations/{location\}/sfdcInstances/{sfdcInstance\}.
         *     name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance',
         *     // Field mask specifying the fields in the above SfdcInstance that have been modified and need to be updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "authConfigId": [],
         *       //   "createTime": "my_createTime",
         *       //   "deleteTime": "my_deleteTime",
         *       //   "description": "my_description",
         *       //   "displayName": "my_displayName",
         *       //   "name": "my_name",
         *       //   "serviceAuthority": "my_serviceAuthority",
         *       //   "sfdcOrgId": "my_sfdcOrgId",
         *       //   "updateTime": "my_updateTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "authConfigId": [],
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "name": "my_name",
         *   //   "serviceAuthority": "my_serviceAuthority",
         *   //   "sfdcOrgId": "my_sfdcOrgId",
         *   //   "updateTime": "my_updateTime"
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
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Sfdcinstances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>>;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcInstance>): void;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Create extends StandardParameters {
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcInstance;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcInstance.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcInstance.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of SfdcInstances.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the SfdcInstance's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Patch extends StandardParameters {
        /**
         * Resource name of the SFDC instance projects/{project\}/locations/{location\}/sfdcInstances/{sfdcInstance\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above SfdcInstance that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcInstance;
    }
    export class Resource$Projects$Locations$Sfdcinstances$Sfdcchannels {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an sfdc channel record. Store the sfdc channel in Spanner. Returns the sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.sfdcInstances.sfdcChannels.create({
         *       // Required. "projects/{project\}/locations/{location\}" format.
         *       parent:
         *         'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "channelTopic": "my_channelTopic",
         *         //   "createTime": "my_createTime",
         *         //   "deleteTime": "my_deleteTime",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "isActive": false,
         *         //   "lastReplayId": "my_lastReplayId",
         *         //   "name": "my_name",
         *         //   "updateTime": "my_updateTime"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        create(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        create(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        /**
         * Deletes an sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.sfdcInstances.sfdcChannels.delete({
         *       // Required. The name that is associated with the SfdcChannel.
         *       name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *     });
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
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleProtobufEmpty>>;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete, options: MethodOptions | BodyResponseCallback<Schema$GoogleProtobufEmpty>, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete, callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        delete(callback: BodyResponseCallback<Schema$GoogleProtobufEmpty>): void;
        /**
         * Gets an sfdc channel. If the channel doesn't exist, Code.NOT_FOUND exception will be thrown.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.sfdcInstances.sfdcChannels.get({
         *       // Required. The name that is associated with the SfdcChannel.
         *       name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        get(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        get(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        /**
         * Lists all sfdc channels that match the filter. Restrict to sfdc channels belonging to the current client only.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.sfdcInstances.sfdcChannels.list({
         *       // Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         *       filter: 'placeholder-value',
         *       // The size of entries in the response. If unspecified, defaults to 100.
         *       pageSize: 'placeholder-value',
         *       // The token returned in the previous response.
         *       pageToken: 'placeholder-value',
         *       // Required. The client, which owns this collection of SfdcChannels.
         *       parent:
         *         'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance',
         *       // The mask which specifies fields that need to be returned in the SfdcChannel's response.
         *       readMask: 'placeholder-value',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sfdcChannels": []
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
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>>;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaListSfdcChannelsResponse>): void;
        /**
         * Updates an sfdc channel. Updates the sfdc channel in spanner. Returns the sfdc channel.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/integrations.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const integrations = google.integrations('v1alpha');
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
         *   const res =
         *     await integrations.projects.locations.sfdcInstances.sfdcChannels.patch({
         *       // Resource name of the SFDC channel projects/{project\}/locations/{location\}/sfdcInstances/{sfdc_instance\}/sfdcChannels/{sfdc_channel\}.
         *       name: 'projects/my-project/locations/my-location/sfdcInstances/my-sfdcInstance/sfdcChannels/my-sfdcChannel',
         *       // Field mask specifying the fields in the above SfdcChannel that have been modified and need to be updated.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "channelTopic": "my_channelTopic",
         *         //   "createTime": "my_createTime",
         *         //   "deleteTime": "my_deleteTime",
         *         //   "description": "my_description",
         *         //   "displayName": "my_displayName",
         *         //   "isActive": false,
         *         //   "lastReplayId": "my_lastReplayId",
         *         //   "name": "my_name",
         *         //   "updateTime": "my_updateTime"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "channelTopic": "my_channelTopic",
         *   //   "createTime": "my_createTime",
         *   //   "deleteTime": "my_deleteTime",
         *   //   "description": "my_description",
         *   //   "displayName": "my_displayName",
         *   //   "isActive": false,
         *   //   "lastReplayId": "my_lastReplayId",
         *   //   "name": "my_name",
         *   //   "updateTime": "my_updateTime"
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
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>>;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch, options: MethodOptions | BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        patch(params: Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch, callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
        patch(callback: BodyResponseCallback<Schema$GoogleCloudIntegrationsV1alphaSfdcChannel>): void;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Create extends StandardParameters {
        /**
         * Required. "projects/{project\}/locations/{location\}" format.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcChannel;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Delete extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcChannel.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Get extends StandardParameters {
        /**
         * Required. The name that is associated with the SfdcChannel.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$List extends StandardParameters {
        /**
         * Filtering as supported in https://developers.google.com/authorized-buyers/apis/guides/v2/list-filters.
         */
        filter?: string;
        /**
         * The size of entries in the response. If unspecified, defaults to 100.
         */
        pageSize?: number;
        /**
         * The token returned in the previous response.
         */
        pageToken?: string;
        /**
         * Required. The client, which owns this collection of SfdcChannels.
         */
        parent?: string;
        /**
         * The mask which specifies fields that need to be returned in the SfdcChannel's response.
         */
        readMask?: string;
    }
    export interface Params$Resource$Projects$Locations$Sfdcinstances$Sfdcchannels$Patch extends StandardParameters {
        /**
         * Resource name of the SFDC channel projects/{project\}/locations/{location\}/sfdcInstances/{sfdc_instance\}/sfdcChannels/{sfdc_channel\}.
         */
        name?: string;
        /**
         * Field mask specifying the fields in the above SfdcChannel that have been modified and need to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleCloudIntegrationsV1alphaSfdcChannel;
    }
    export {};
}
