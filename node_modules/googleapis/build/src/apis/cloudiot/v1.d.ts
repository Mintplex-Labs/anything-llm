import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudiot_v1 {
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
     * Cloud IoT API
     *
     * Registers and manages IoT (Internet of Things) devices that connect to the Google Cloud Platform.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudiot = google.cloudiot('v1');
     * ```
     */
    export class Cloudiot {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Request for `BindDeviceToGateway`.
     */
    export interface Schema$BindDeviceToGatewayRequest {
        /**
         * Required. The device to associate with the specified gateway. The value of `device_id` can be either the device numeric ID or the user-defined device identifier.
         */
        deviceId?: string | null;
        /**
         * Required. The value of `gateway_id` can be either the device numeric ID or the user-defined device identifier.
         */
        gatewayId?: string | null;
    }
    /**
     * Response for `BindDeviceToGateway`.
     */
    export interface Schema$BindDeviceToGatewayResponse {
    }
    /**
     * Associates `members`, or principals, with a `role`.
     */
    export interface Schema$Binding {
        /**
         * The condition that is associated with this binding. If the condition evaluates to `true`, then this binding applies to the current request. If the condition evaluates to `false`, then this binding does not apply to the current request. However, a different role binding might grant the same role to one or more of the principals in this binding. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        condition?: Schema$Expr;
        /**
         * Specifies the principals requesting access for a Google Cloud resource. `members` can have the following values: * `allUsers`: A special identifier that represents anyone who is on the internet; with or without a Google account. * `allAuthenticatedUsers`: A special identifier that represents anyone who is authenticated with a Google account or a service account. Does not include identities that come from external identity providers (IdPs) through identity federation. * `user:{emailid\}`: An email address that represents a specific Google account. For example, `alice@example.com` . * `serviceAccount:{emailid\}`: An email address that represents a Google service account. For example, `my-other-app@appspot.gserviceaccount.com`. * `serviceAccount:{projectid\}.svc.id.goog[{namespace\}/{kubernetes-sa\}]`: An identifier for a [Kubernetes service account](https://cloud.google.com/kubernetes-engine/docs/how-to/kubernetes-service-accounts). For example, `my-project.svc.id.goog[my-namespace/my-kubernetes-sa]`. * `group:{emailid\}`: An email address that represents a Google group. For example, `admins@example.com`. * `domain:{domain\}`: The G Suite domain (primary) that represents all the users of that domain. For example, `google.com` or `example.com`. * `deleted:user:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a user that has been recently deleted. For example, `alice@example.com?uid=123456789012345678901`. If the user is recovered, this value reverts to `user:{emailid\}` and the recovered user retains the role in the binding. * `deleted:serviceAccount:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a service account that has been recently deleted. For example, `my-other-app@appspot.gserviceaccount.com?uid=123456789012345678901`. If the service account is undeleted, this value reverts to `serviceAccount:{emailid\}` and the undeleted service account retains the role in the binding. * `deleted:group:{emailid\}?uid={uniqueid\}`: An email address (plus unique identifier) representing a Google group that has been recently deleted. For example, `admins@example.com?uid=123456789012345678901`. If the group is recovered, this value reverts to `group:{emailid\}` and the recovered group retains the role in the binding.
         */
        members?: string[] | null;
        /**
         * Role that is assigned to the list of `members`, or principals. For example, `roles/viewer`, `roles/editor`, or `roles/owner`.
         */
        role?: string | null;
    }
    /**
     * The device resource.
     */
    export interface Schema$Device {
        /**
         * If a device is blocked, connections or requests from this device will fail. Can be used to temporarily prevent the device from connecting if, for example, the sensor is generating bad data and needs maintenance.
         */
        blocked?: boolean | null;
        /**
         * The most recent device configuration, which is eventually sent from Cloud IoT Core to the device. If not present on creation, the configuration will be initialized with an empty payload and version value of `1`. To update this field after creation, use the `DeviceManager.ModifyCloudToDeviceConfig` method.
         */
        config?: Schema$DeviceConfig;
        /**
         * The credentials used to authenticate this device. To allow credential rotation without interruption, multiple device credentials can be bound to this device. No more than 3 credentials can be bound to a single device at a time. When new credentials are added to a device, they are verified against the registry credentials. For details, see the description of the `DeviceRegistry.credentials` field.
         */
        credentials?: Schema$DeviceCredential[];
        /**
         * Gateway-related configuration and state.
         */
        gatewayConfig?: Schema$GatewayConfig;
        /**
         * The user-defined device identifier. The device ID must be unique within a device registry.
         */
        id?: string | null;
        /**
         * [Output only] The last time a cloud-to-device config version acknowledgment was received from the device. This field is only for configurations sent through MQTT.
         */
        lastConfigAckTime?: string | null;
        /**
         * [Output only] The last time a cloud-to-device config version was sent to the device.
         */
        lastConfigSendTime?: string | null;
        /**
         * [Output only] The error message of the most recent error, such as a failure to publish to Cloud Pub/Sub. 'last_error_time' is the timestamp of this field. If no errors have occurred, this field has an empty message and the status code 0 == OK. Otherwise, this field is expected to have a status code other than OK.
         */
        lastErrorStatus?: Schema$Status;
        /**
         * [Output only] The time the most recent error occurred, such as a failure to publish to Cloud Pub/Sub. This field is the timestamp of 'last_error_status'.
         */
        lastErrorTime?: string | null;
        /**
         * [Output only] The last time a telemetry event was received. Timestamps are periodically collected and written to storage; they may be stale by a few minutes.
         */
        lastEventTime?: string | null;
        /**
         * [Output only] The last time an MQTT `PINGREQ` was received. This field applies only to devices connecting through MQTT. MQTT clients usually only send `PINGREQ` messages if the connection is idle, and no other messages have been sent. Timestamps are periodically collected and written to storage; they may be stale by a few minutes.
         */
        lastHeartbeatTime?: string | null;
        /**
         * [Output only] The last time a state event was received. Timestamps are periodically collected and written to storage; they may be stale by a few minutes.
         */
        lastStateTime?: string | null;
        /**
         * **Beta Feature** The logging verbosity for device activity. If unspecified, DeviceRegistry.log_level will be used.
         */
        logLevel?: string | null;
        /**
         * The metadata key-value pairs assigned to the device. This metadata is not interpreted or indexed by Cloud IoT Core. It can be used to add contextual information for the device. Keys must conform to the regular expression a-zA-Z+ and be less than 128 bytes in length. Values are free-form strings. Each value must be less than or equal to 32 KB in size. The total size of all keys and values must be less than 256 KB, and the maximum number of key-value pairs is 500.
         */
        metadata?: {
            [key: string]: string;
        } | null;
        /**
         * The resource path name. For example, `projects/p1/locations/us-central1/registries/registry0/devices/dev0` or `projects/p1/locations/us-central1/registries/registry0/devices/{num_id\}`. When `name` is populated as a response from the service, it always ends in the device numeric ID.
         */
        name?: string | null;
        /**
         * [Output only] A server-defined unique numeric ID for the device. This is a more compact way to identify devices, and it is globally unique.
         */
        numId?: string | null;
        /**
         * [Output only] The state most recently received from the device. If no state has been reported, this field is not present.
         */
        state?: Schema$DeviceState;
    }
    /**
     * The device configuration. Eventually delivered to devices.
     */
    export interface Schema$DeviceConfig {
        /**
         * The device configuration data.
         */
        binaryData?: string | null;
        /**
         * [Output only] The time at which this configuration version was updated in Cloud IoT Core. This timestamp is set by the server.
         */
        cloudUpdateTime?: string | null;
        /**
         * [Output only] The time at which Cloud IoT Core received the acknowledgment from the device, indicating that the device has received this configuration version. If this field is not present, the device has not yet acknowledged that it received this version. Note that when the config was sent to the device, many config versions may have been available in Cloud IoT Core while the device was disconnected, and on connection, only the latest version is sent to the device. Some versions may never be sent to the device, and therefore are never acknowledged. This timestamp is set by Cloud IoT Core.
         */
        deviceAckTime?: string | null;
        /**
         * [Output only] The version of this update. The version number is assigned by the server, and is always greater than 0 after device creation. The version must be 0 on the `CreateDevice` request if a `config` is specified; the response of `CreateDevice` will always have a value of 1.
         */
        version?: string | null;
    }
    /**
     * A server-stored device credential used for authentication.
     */
    export interface Schema$DeviceCredential {
        /**
         * [Optional] The time at which this credential becomes invalid. This credential will be ignored for new client authentication requests after this timestamp; however, it will not be automatically deleted.
         */
        expirationTime?: string | null;
        /**
         * A public key used to verify the signature of JSON Web Tokens (JWTs). When adding a new device credential, either via device creation or via modifications, this public key credential may be required to be signed by one of the registry level certificates. More specifically, if the registry contains at least one certificate, any new device credential must be signed by one of the registry certificates. As a result, when the registry contains certificates, only X.509 certificates are accepted as device credentials. However, if the registry does not contain a certificate, self-signed certificates and public keys will be accepted. New device credentials must be different from every registry-level certificate.
         */
        publicKey?: Schema$PublicKeyCredential;
    }
    /**
     * A container for a group of devices.
     */
    export interface Schema$DeviceRegistry {
        /**
         * The credentials used to verify the device credentials. No more than 10 credentials can be bound to a single registry at a time. The verification process occurs at the time of device creation or update. If this field is empty, no verification is performed. Otherwise, the credentials of a newly created device or added credentials of an updated device should be signed with one of these registry credentials. Note, however, that existing devices will never be affected by modifications to this list of credentials: after a device has been successfully created in a registry, it should be able to connect even if its registry credentials are revoked, deleted, or modified.
         */
        credentials?: Schema$RegistryCredential[];
        /**
         * The configuration for notification of telemetry events received from the device. All telemetry events that were successfully published by the device and acknowledged by Cloud IoT Core are guaranteed to be delivered to Cloud Pub/Sub. If multiple configurations match a message, only the first matching configuration is used. If you try to publish a device telemetry event using MQTT without specifying a Cloud Pub/Sub topic for the device's registry, the connection closes automatically. If you try to do so using an HTTP connection, an error is returned. Up to 10 configurations may be provided.
         */
        eventNotificationConfigs?: Schema$EventNotificationConfig[];
        /**
         * The DeviceService (HTTP) configuration for this device registry.
         */
        httpConfig?: Schema$HttpConfig;
        /**
         * The identifier of this device registry. For example, `myRegistry`.
         */
        id?: string | null;
        /**
         * **Beta Feature** The default logging verbosity for activity from devices in this registry. The verbosity level can be overridden by Device.log_level.
         */
        logLevel?: string | null;
        /**
         * The MQTT configuration for this device registry.
         */
        mqttConfig?: Schema$MqttConfig;
        /**
         * The resource path name. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        name?: string | null;
        /**
         * The configuration for notification of new states received from the device. State updates are guaranteed to be stored in the state history, but notifications to Cloud Pub/Sub are not guaranteed. For example, if permissions are misconfigured or the specified topic doesn't exist, no notification will be published but the state will still be stored in Cloud IoT Core.
         */
        stateNotificationConfig?: Schema$StateNotificationConfig;
    }
    /**
     * The device state, as reported by the device.
     */
    export interface Schema$DeviceState {
        /**
         * The device state data.
         */
        binaryData?: string | null;
        /**
         * [Output only] The time at which this state version was updated in Cloud IoT Core.
         */
        updateTime?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * The configuration for forwarding telemetry events.
     */
    export interface Schema$EventNotificationConfig {
        /**
         * A Cloud Pub/Sub topic name. For example, `projects/myProject/topics/deviceEvents`.
         */
        pubsubTopicName?: string | null;
        /**
         * If the subfolder name matches this string exactly, this configuration will be used. The string must not include the leading '/' character. If empty, all strings are matched. This field is used only for telemetry events; subfolders are not supported for state changes.
         */
        subfolderMatches?: string | null;
    }
    /**
     * Represents a textual expression in the Common Expression Language (CEL) syntax. CEL is a C-like expression language. The syntax and semantics of CEL are documented at https://github.com/google/cel-spec. Example (Comparison): title: "Summary size limit" description: "Determines if a summary is less than 100 chars" expression: "document.summary.size() < 100" Example (Equality): title: "Requestor is owner" description: "Determines if requestor is the document owner" expression: "document.owner == request.auth.claims.email" Example (Logic): title: "Public documents" description: "Determine whether the document should be publicly visible" expression: "document.type != 'private' && document.type != 'internal'" Example (Data Manipulation): title: "Notification string" description: "Create a notification string with a timestamp." expression: "'New message received at ' + string(document.create_time)" The exact variables and functions that may be referenced within an expression are determined by the service that evaluates it. See the service documentation for additional information.
     */
    export interface Schema$Expr {
        /**
         * Optional. Description of the expression. This is a longer text which describes the expression, e.g. when hovered over it in a UI.
         */
        description?: string | null;
        /**
         * Textual representation of an expression in Common Expression Language syntax.
         */
        expression?: string | null;
        /**
         * Optional. String indicating the location of the expression for error reporting, e.g. a file name and a position in the file.
         */
        location?: string | null;
        /**
         * Optional. Title for the expression, i.e. a short string describing its purpose. This can be used e.g. in UIs which allow to enter the expression.
         */
        title?: string | null;
    }
    /**
     * Gateway-related configuration and state.
     */
    export interface Schema$GatewayConfig {
        /**
         * Indicates how to authorize and/or authenticate devices to access the gateway.
         */
        gatewayAuthMethod?: string | null;
        /**
         * Indicates whether the device is a gateway.
         */
        gatewayType?: string | null;
        /**
         * [Output only] The ID of the gateway the device accessed most recently.
         */
        lastAccessedGatewayId?: string | null;
        /**
         * [Output only] The most recent time at which the device accessed the gateway specified in `last_accessed_gateway`.
         */
        lastAccessedGatewayTime?: string | null;
    }
    /**
     * Request message for `GetIamPolicy` method.
     */
    export interface Schema$GetIamPolicyRequest {
        /**
         * OPTIONAL: A `GetPolicyOptions` object for specifying options to `GetIamPolicy`.
         */
        options?: Schema$GetPolicyOptions;
    }
    /**
     * Encapsulates settings provided to GetIamPolicy.
     */
    export interface Schema$GetPolicyOptions {
        /**
         * Optional. The maximum policy version that will be used to format the policy. Valid values are 0, 1, and 3. Requests specifying an invalid value will be rejected. Requests for policies with any conditional role bindings must specify version 3. Policies with no conditional role bindings may specify any valid value or leave the field unset. The policy in the response might use the policy version that you specified, or it might use a lower policy version. For example, if you specify version 3, but the policy has no conditional role bindings, the response uses version 1. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        requestedPolicyVersion?: number | null;
    }
    /**
     * The configuration of the HTTP bridge for a device registry.
     */
    export interface Schema$HttpConfig {
        /**
         * If enabled, allows devices to use DeviceService via the HTTP protocol. Otherwise, any requests to DeviceService will fail for this registry.
         */
        httpEnabledState?: string | null;
    }
    /**
     * Response for `ListDeviceConfigVersions`.
     */
    export interface Schema$ListDeviceConfigVersionsResponse {
        /**
         * The device configuration for the last few versions. Versions are listed in decreasing order, starting from the most recent one.
         */
        deviceConfigs?: Schema$DeviceConfig[];
    }
    /**
     * Response for `ListDeviceRegistries`.
     */
    export interface Schema$ListDeviceRegistriesResponse {
        /**
         * The registries that matched the query.
         */
        deviceRegistries?: Schema$DeviceRegistry[];
        /**
         * If not empty, indicates that there may be more registries that match the request; this value should be passed in a new `ListDeviceRegistriesRequest`.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for `ListDevices`.
     */
    export interface Schema$ListDevicesResponse {
        /**
         * The devices that match the request.
         */
        devices?: Schema$Device[];
        /**
         * If not empty, indicates that there may be more devices that match the request; this value should be passed in a new `ListDevicesRequest`.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response for `ListDeviceStates`.
     */
    export interface Schema$ListDeviceStatesResponse {
        /**
         * The last few device states. States are listed in descending order of server update time, starting from the most recent one.
         */
        deviceStates?: Schema$DeviceState[];
    }
    /**
     * Request for `ModifyCloudToDeviceConfig`.
     */
    export interface Schema$ModifyCloudToDeviceConfigRequest {
        /**
         * Required. The configuration data for the device.
         */
        binaryData?: string | null;
        /**
         * The version number to update. If this value is zero, it will not check the version number of the server and will always update the current version; otherwise, this update will fail if the version number found on the server does not match this version number. This is used to support multiple simultaneous updates without losing data.
         */
        versionToUpdate?: string | null;
    }
    /**
     * The configuration of MQTT for a device registry.
     */
    export interface Schema$MqttConfig {
        /**
         * If enabled, allows connections using the MQTT protocol. Otherwise, MQTT connections to this registry will fail.
         */
        mqttEnabledState?: string | null;
    }
    /**
     * An Identity and Access Management (IAM) policy, which specifies access controls for Google Cloud resources. A `Policy` is a collection of `bindings`. A `binding` binds one or more `members`, or principals, to a single `role`. Principals can be user accounts, service accounts, Google groups, and domains (such as G Suite). A `role` is a named list of permissions; each `role` can be an IAM predefined role or a user-created custom role. For some types of Google Cloud resources, a `binding` can also specify a `condition`, which is a logical expression that allows access to a resource only if the expression evaluates to `true`. A condition can add constraints based on attributes of the request, the resource, or both. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies). **JSON example:** { "bindings": [ { "role": "roles/resourcemanager.organizationAdmin", "members": [ "user:mike@example.com", "group:admins@example.com", "domain:google.com", "serviceAccount:my-project-id@appspot.gserviceaccount.com" ] \}, { "role": "roles/resourcemanager.organizationViewer", "members": [ "user:eve@example.com" ], "condition": { "title": "expirable access", "description": "Does not grant access after Sep 2020", "expression": "request.time < timestamp('2020-10-01T00:00:00.000Z')", \} \} ], "etag": "BwWWja0YfJA=", "version": 3 \} **YAML example:** bindings: - members: - user:mike@example.com - group:admins@example.com - domain:google.com - serviceAccount:my-project-id@appspot.gserviceaccount.com role: roles/resourcemanager.organizationAdmin - members: - user:eve@example.com role: roles/resourcemanager.organizationViewer condition: title: expirable access description: Does not grant access after Sep 2020 expression: request.time < timestamp('2020-10-01T00:00:00.000Z') etag: BwWWja0YfJA= version: 3 For a description of IAM and its features, see the [IAM documentation](https://cloud.google.com/iam/docs/).
     */
    export interface Schema$Policy {
        /**
         * Associates a list of `members`, or principals, with a `role`. Optionally, may specify a `condition` that determines how and when the `bindings` are applied. Each of the `bindings` must contain at least one principal. The `bindings` in a `Policy` can refer to up to 1,500 principals; up to 250 of these principals can be Google groups. Each occurrence of a principal counts towards these limits. For example, if the `bindings` grant 50 different roles to `user:alice@example.com`, and not to any other principal, then you can add another 1,450 principals to the `bindings` in the `Policy`.
         */
        bindings?: Schema$Binding[];
        /**
         * `etag` is used for optimistic concurrency control as a way to help prevent simultaneous updates of a policy from overwriting each other. It is strongly suggested that systems make use of the `etag` in the read-modify-write cycle to perform policy updates in order to avoid race conditions: An `etag` is returned in the response to `getIamPolicy`, and systems are expected to put that etag in the request to `setIamPolicy` to ensure that their change will be applied to the same version of the policy. **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost.
         */
        etag?: string | null;
        /**
         * Specifies the format of the policy. Valid values are `0`, `1`, and `3`. Requests that specify an invalid value are rejected. Any operation that affects conditional role bindings must specify version `3`. This requirement applies to the following operations: * Getting a policy that includes a conditional role binding * Adding a conditional role binding to a policy * Changing a conditional role binding in a policy * Removing any role binding, with or without a condition, from a policy that includes conditions **Important:** If you use IAM Conditions, you must include the `etag` field whenever you call `setIamPolicy`. If you omit this field, then IAM allows you to overwrite a version `3` policy with a version `1` policy, and all of the conditions in the version `3` policy are lost. If a policy does not include any conditions, operations on that policy may specify any valid version or leave the field unset. To learn which resources support conditions in their IAM policies, see the [IAM documentation](https://cloud.google.com/iam/help/conditions/resource-policies).
         */
        version?: number | null;
    }
    /**
     * A public key certificate format and data.
     */
    export interface Schema$PublicKeyCertificate {
        /**
         * The certificate data.
         */
        certificate?: string | null;
        /**
         * The certificate format.
         */
        format?: string | null;
        /**
         * [Output only] The certificate details. Used only for X.509 certificates.
         */
        x509Details?: Schema$X509CertificateDetails;
    }
    /**
     * A public key format and data.
     */
    export interface Schema$PublicKeyCredential {
        /**
         * The format of the key.
         */
        format?: string | null;
        /**
         * The key data.
         */
        key?: string | null;
    }
    /**
     * A server-stored registry credential used to validate device credentials.
     */
    export interface Schema$RegistryCredential {
        /**
         * A public key certificate used to verify the device credentials.
         */
        publicKeyCertificate?: Schema$PublicKeyCertificate;
    }
    /**
     * Request for `SendCommandToDevice`.
     */
    export interface Schema$SendCommandToDeviceRequest {
        /**
         * Required. The command data to send to the device.
         */
        binaryData?: string | null;
        /**
         * Optional subfolder for the command. If empty, the command will be delivered to the /devices/{device-id\}/commands topic, otherwise it will be delivered to the /devices/{device-id\}/commands/{subfolder\} topic. Multi-level subfolders are allowed. This field must not have more than 256 characters, and must not contain any MQTT wildcards ("+" or "#") or null characters.
         */
        subfolder?: string | null;
    }
    /**
     * Response for `SendCommandToDevice`.
     */
    export interface Schema$SendCommandToDeviceResponse {
    }
    /**
     * Request message for `SetIamPolicy` method.
     */
    export interface Schema$SetIamPolicyRequest {
        /**
         * REQUIRED: The complete policy to be applied to the `resource`. The size of the policy is limited to a few 10s of KB. An empty policy is a valid policy but certain Google Cloud services (such as Projects) might reject them.
         */
        policy?: Schema$Policy;
    }
    /**
     * The configuration for notification of new states received from the device.
     */
    export interface Schema$StateNotificationConfig {
        /**
         * A Cloud Pub/Sub topic name. For example, `projects/myProject/topics/deviceEvents`.
         */
        pubsubTopicName?: string | null;
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
     * Request message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsRequest {
        /**
         * The set of permissions to check for the `resource`. Permissions with wildcards (such as `*` or `storage.*`) are not allowed. For more information see [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
         */
        permissions?: string[] | null;
    }
    /**
     * Response message for `TestIamPermissions` method.
     */
    export interface Schema$TestIamPermissionsResponse {
        /**
         * A subset of `TestPermissionsRequest.permissions` that the caller is allowed.
         */
        permissions?: string[] | null;
    }
    /**
     * Request for `UnbindDeviceFromGateway`.
     */
    export interface Schema$UnbindDeviceFromGatewayRequest {
        /**
         * Required. The device to disassociate from the specified gateway. The value of `device_id` can be either the device numeric ID or the user-defined device identifier.
         */
        deviceId?: string | null;
        /**
         * Required. The value of `gateway_id` can be either the device numeric ID or the user-defined device identifier.
         */
        gatewayId?: string | null;
    }
    /**
     * Response for `UnbindDeviceFromGateway`.
     */
    export interface Schema$UnbindDeviceFromGatewayResponse {
    }
    /**
     * Details of an X.509 certificate. For informational purposes only.
     */
    export interface Schema$X509CertificateDetails {
        /**
         * The time the certificate becomes invalid.
         */
        expiryTime?: string | null;
        /**
         * The entity that signed the certificate.
         */
        issuer?: string | null;
        /**
         * The type of public key in the certificate.
         */
        publicKeyType?: string | null;
        /**
         * The algorithm used to sign the certificate.
         */
        signatureAlgorithm?: string | null;
        /**
         * The time the certificate becomes valid.
         */
        startTime?: string | null;
        /**
         * The entity the certificate and public key belong to.
         */
        subject?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        registries: Resource$Projects$Locations$Registries;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations$Registries {
        context: APIRequestContext;
        devices: Resource$Projects$Locations$Registries$Devices;
        groups: Resource$Projects$Locations$Registries$Groups;
        constructor(context: APIRequestContext);
        /**
         * Associates the device with the gateway.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.bindDeviceToGateway({
         *     // Required. The name of the registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *     parent: 'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "deviceId": "my_deviceId",
         *       //   "gatewayId": "my_gatewayId"
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
        bindDeviceToGateway(params: Params$Resource$Projects$Locations$Registries$Binddevicetogateway, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        bindDeviceToGateway(params?: Params$Resource$Projects$Locations$Registries$Binddevicetogateway, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$BindDeviceToGatewayResponse>>;
        bindDeviceToGateway(params: Params$Resource$Projects$Locations$Registries$Binddevicetogateway, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        bindDeviceToGateway(params: Params$Resource$Projects$Locations$Registries$Binddevicetogateway, options: MethodOptions | BodyResponseCallback<Schema$BindDeviceToGatewayResponse>, callback: BodyResponseCallback<Schema$BindDeviceToGatewayResponse>): void;
        bindDeviceToGateway(params: Params$Resource$Projects$Locations$Registries$Binddevicetogateway, callback: BodyResponseCallback<Schema$BindDeviceToGatewayResponse>): void;
        bindDeviceToGateway(callback: BodyResponseCallback<Schema$BindDeviceToGatewayResponse>): void;
        /**
         * Creates a device registry that contains devices.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.create({
         *     // Required. The project and cloud region where this device registry must be created. For example, `projects/example-project/locations/us-central1`.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "credentials": [],
         *       //   "eventNotificationConfigs": [],
         *       //   "httpConfig": {},
         *       //   "id": "my_id",
         *       //   "logLevel": "my_logLevel",
         *       //   "mqttConfig": {},
         *       //   "name": "my_name",
         *       //   "stateNotificationConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "credentials": [],
         *   //   "eventNotificationConfigs": [],
         *   //   "httpConfig": {},
         *   //   "id": "my_id",
         *   //   "logLevel": "my_logLevel",
         *   //   "mqttConfig": {},
         *   //   "name": "my_name",
         *   //   "stateNotificationConfig": {}
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
        create(params: Params$Resource$Projects$Locations$Registries$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Registries$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceRegistry>>;
        create(params: Params$Resource$Projects$Locations$Registries$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Registries$Create, options: MethodOptions | BodyResponseCallback<Schema$DeviceRegistry>, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        create(params: Params$Resource$Projects$Locations$Registries$Create, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        create(callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        /**
         * Deletes a device registry configuration.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.delete({
         *     // Required. The name of the device registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie',
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
        delete(params: Params$Resource$Projects$Locations$Registries$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Registries$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Registries$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Registries$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Registries$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets a device registry configuration.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.get({
         *     // Required. The name of the device registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "credentials": [],
         *   //   "eventNotificationConfigs": [],
         *   //   "httpConfig": {},
         *   //   "id": "my_id",
         *   //   "logLevel": "my_logLevel",
         *   //   "mqttConfig": {},
         *   //   "name": "my_name",
         *   //   "stateNotificationConfig": {}
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
        get(params: Params$Resource$Projects$Locations$Registries$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Registries$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceRegistry>>;
        get(params: Params$Resource$Projects$Locations$Registries$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Registries$Get, options: MethodOptions | BodyResponseCallback<Schema$DeviceRegistry>, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        get(params: Params$Resource$Projects$Locations$Registries$Get, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        get(callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.getIamPolicy({
         *     // REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *     resource:
         *       'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "options": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
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
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Registries$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Lists device registries.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.list({
         *     // The maximum number of registries to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListDeviceRegistriesResponse`; indicates that this is a continuation of a prior `ListDeviceRegistries` call and the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. The project and cloud region path. For example, `projects/example-project/locations/us-central1`.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deviceRegistries": [],
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
        list(params: Params$Resource$Projects$Locations$Registries$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Registries$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDeviceRegistriesResponse>>;
        list(params: Params$Resource$Projects$Locations$Registries$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Registries$List, options: MethodOptions | BodyResponseCallback<Schema$ListDeviceRegistriesResponse>, callback: BodyResponseCallback<Schema$ListDeviceRegistriesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Registries$List, callback: BodyResponseCallback<Schema$ListDeviceRegistriesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDeviceRegistriesResponse>): void;
        /**
         * Updates a device registry configuration.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.patch({
         *     // The resource path name. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie',
         *     // Required. Only updates the `device_registry` fields indicated by this mask. The field mask must not be empty, and it must not contain fields that are immutable or only set by the server. Mutable top-level fields: `event_notification_config`, `http_config`, `mqtt_config`, and `state_notification_config`.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "credentials": [],
         *       //   "eventNotificationConfigs": [],
         *       //   "httpConfig": {},
         *       //   "id": "my_id",
         *       //   "logLevel": "my_logLevel",
         *       //   "mqttConfig": {},
         *       //   "name": "my_name",
         *       //   "stateNotificationConfig": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "credentials": [],
         *   //   "eventNotificationConfigs": [],
         *   //   "httpConfig": {},
         *   //   "id": "my_id",
         *   //   "logLevel": "my_logLevel",
         *   //   "mqttConfig": {},
         *   //   "name": "my_name",
         *   //   "stateNotificationConfig": {}
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
        patch(params: Params$Resource$Projects$Locations$Registries$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Registries$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceRegistry>>;
        patch(params: Params$Resource$Projects$Locations$Registries$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Registries$Patch, options: MethodOptions | BodyResponseCallback<Schema$DeviceRegistry>, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        patch(params: Params$Resource$Projects$Locations$Registries$Patch, callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        patch(callback: BodyResponseCallback<Schema$DeviceRegistry>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.setIamPolicy({
         *     // REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *     resource:
         *       'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "policy": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
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
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Registries$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.testIamPermissions({
         *     // REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *     resource:
         *       'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "permissions": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "permissions": []
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
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Registries$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        /**
         * Deletes the association between the device and the gateway.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await cloudiot.projects.locations.registries.unbindDeviceFromGateway({
         *       // Required. The name of the registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *       parent:
         *         'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "deviceId": "my_deviceId",
         *         //   "gatewayId": "my_gatewayId"
         *         // }
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
        unbindDeviceFromGateway(params: Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unbindDeviceFromGateway(params?: Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UnbindDeviceFromGatewayResponse>>;
        unbindDeviceFromGateway(params: Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unbindDeviceFromGateway(params: Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway, options: MethodOptions | BodyResponseCallback<Schema$UnbindDeviceFromGatewayResponse>, callback: BodyResponseCallback<Schema$UnbindDeviceFromGatewayResponse>): void;
        unbindDeviceFromGateway(params: Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway, callback: BodyResponseCallback<Schema$UnbindDeviceFromGatewayResponse>): void;
        unbindDeviceFromGateway(callback: BodyResponseCallback<Schema$UnbindDeviceFromGatewayResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Binddevicetogateway extends StandardParameters {
        /**
         * Required. The name of the registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$BindDeviceToGatewayRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Create extends StandardParameters {
        /**
         * Required. The project and cloud region where this device registry must be created. For example, `projects/example-project/locations/us-central1`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeviceRegistry;
    }
    export interface Params$Resource$Projects$Locations$Registries$Delete extends StandardParameters {
        /**
         * Required. The name of the device registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Get extends StandardParameters {
        /**
         * Required. The name of the device registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$List extends StandardParameters {
        /**
         * The maximum number of registries to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListDeviceRegistriesResponse`; indicates that this is a continuation of a prior `ListDeviceRegistries` call and the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. The project and cloud region path. For example, `projects/example-project/locations/us-central1`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Patch extends StandardParameters {
        /**
         * The resource path name. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        name?: string;
        /**
         * Required. Only updates the `device_registry` fields indicated by this mask. The field mask must not be empty, and it must not contain fields that are immutable or only set by the server. Mutable top-level fields: `event_notification_config`, `http_config`, `mqtt_config`, and `state_notification_config`.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeviceRegistry;
    }
    export interface Params$Resource$Projects$Locations$Registries$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Unbinddevicefromgateway extends StandardParameters {
        /**
         * Required. The name of the registry. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$UnbindDeviceFromGatewayRequest;
    }
    export class Resource$Projects$Locations$Registries$Devices {
        context: APIRequestContext;
        configVersions: Resource$Projects$Locations$Registries$Devices$Configversions;
        states: Resource$Projects$Locations$Registries$Devices$States;
        constructor(context: APIRequestContext);
        /**
         * Creates a device in a device registry.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.create({
         *     // Required. The name of the device registry where this device should be created. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         *     parent: 'projects/my-project/locations/my-location/registries/my-registrie',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "blocked": false,
         *       //   "config": {},
         *       //   "credentials": [],
         *       //   "gatewayConfig": {},
         *       //   "id": "my_id",
         *       //   "lastConfigAckTime": "my_lastConfigAckTime",
         *       //   "lastConfigSendTime": "my_lastConfigSendTime",
         *       //   "lastErrorStatus": {},
         *       //   "lastErrorTime": "my_lastErrorTime",
         *       //   "lastEventTime": "my_lastEventTime",
         *       //   "lastHeartbeatTime": "my_lastHeartbeatTime",
         *       //   "lastStateTime": "my_lastStateTime",
         *       //   "logLevel": "my_logLevel",
         *       //   "metadata": {},
         *       //   "name": "my_name",
         *       //   "numId": "my_numId",
         *       //   "state": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "blocked": false,
         *   //   "config": {},
         *   //   "credentials": [],
         *   //   "gatewayConfig": {},
         *   //   "id": "my_id",
         *   //   "lastConfigAckTime": "my_lastConfigAckTime",
         *   //   "lastConfigSendTime": "my_lastConfigSendTime",
         *   //   "lastErrorStatus": {},
         *   //   "lastErrorTime": "my_lastErrorTime",
         *   //   "lastEventTime": "my_lastEventTime",
         *   //   "lastHeartbeatTime": "my_lastHeartbeatTime",
         *   //   "lastStateTime": "my_lastStateTime",
         *   //   "logLevel": "my_logLevel",
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "numId": "my_numId",
         *   //   "state": {}
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
        create(params: Params$Resource$Projects$Locations$Registries$Devices$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Registries$Devices$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Device>>;
        create(params: Params$Resource$Projects$Locations$Registries$Devices$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Registries$Devices$Create, options: MethodOptions | BodyResponseCallback<Schema$Device>, callback: BodyResponseCallback<Schema$Device>): void;
        create(params: Params$Resource$Projects$Locations$Registries$Devices$Create, callback: BodyResponseCallback<Schema$Device>): void;
        create(callback: BodyResponseCallback<Schema$Device>): void;
        /**
         * Deletes a device.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.delete({
         *     // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
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
        delete(params: Params$Resource$Projects$Locations$Registries$Devices$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Registries$Devices$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Registries$Devices$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Registries$Devices$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Registries$Devices$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Gets details about a device.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.get({
         *     // The fields of the `Device` resource to be returned in the response. If the field mask is unset or empty, all fields are returned. Fields have to be provided in snake_case format, for example: `last_heartbeat_time`.
         *     fieldMask: 'placeholder-value',
         *     // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "blocked": false,
         *   //   "config": {},
         *   //   "credentials": [],
         *   //   "gatewayConfig": {},
         *   //   "id": "my_id",
         *   //   "lastConfigAckTime": "my_lastConfigAckTime",
         *   //   "lastConfigSendTime": "my_lastConfigSendTime",
         *   //   "lastErrorStatus": {},
         *   //   "lastErrorTime": "my_lastErrorTime",
         *   //   "lastEventTime": "my_lastEventTime",
         *   //   "lastHeartbeatTime": "my_lastHeartbeatTime",
         *   //   "lastStateTime": "my_lastStateTime",
         *   //   "logLevel": "my_logLevel",
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "numId": "my_numId",
         *   //   "state": {}
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
        get(params: Params$Resource$Projects$Locations$Registries$Devices$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Registries$Devices$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Device>>;
        get(params: Params$Resource$Projects$Locations$Registries$Devices$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Registries$Devices$Get, options: MethodOptions | BodyResponseCallback<Schema$Device>, callback: BodyResponseCallback<Schema$Device>): void;
        get(params: Params$Resource$Projects$Locations$Registries$Devices$Get, callback: BodyResponseCallback<Schema$Device>): void;
        get(callback: BodyResponseCallback<Schema$Device>): void;
        /**
         * List devices in a device registry.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.list({
         *     // A list of device string IDs. For example, `['device0', 'device12']`. If empty, this field is ignored. Maximum IDs: 10,000
         *     deviceIds: 'placeholder-value',
         *     // A list of device numeric IDs. If empty, this field is ignored. Maximum IDs: 10,000.
         *     deviceNumIds: 'placeholder-value',
         *     // The fields of the `Device` resource to be returned in the response. The fields `id` and `num_id` are always returned, along with any other fields specified in snake_case format, for example: `last_heartbeat_time`.
         *     fieldMask: 'placeholder-value',
         *     // If set, returns only the gateways with which the specified device is associated. The device ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `456` is specified, returns only the gateways to which the device with `num_id` 456 is bound.
         *     'gatewayListOptions.associationsDeviceId': 'placeholder-value',
         *     // If set, only devices associated with the specified gateway are returned. The gateway ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `123` is specified, only devices bound to the gateway with `num_id` 123 are returned.
         *     'gatewayListOptions.associationsGatewayId': 'placeholder-value',
         *     // If `GATEWAY` is specified, only gateways are returned. If `NON_GATEWAY` is specified, only non-gateway devices are returned. If `GATEWAY_TYPE_UNSPECIFIED` is specified, all devices are returned.
         *     'gatewayListOptions.gatewayType': 'placeholder-value',
         *     // The maximum number of devices to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListDevicesResponse`; indicates that this is a continuation of a prior `ListDevices` call and the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. The device registry path. Required. For example, `projects/my-project/locations/us-central1/registries/my-registry`.
         *     parent: 'projects/my-project/locations/my-location/registries/my-registrie',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "devices": [],
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
        list(params: Params$Resource$Projects$Locations$Registries$Devices$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Registries$Devices$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDevicesResponse>>;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$List, options: MethodOptions | BodyResponseCallback<Schema$ListDevicesResponse>, callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$List, callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
        /**
         * Modifies the configuration for the device, which is eventually sent from the Cloud IoT Core servers. Returns the modified configuration version and its metadata.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await cloudiot.projects.locations.registries.devices.modifyCloudToDeviceConfig(
         *       {
         *         // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *         name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *
         *         // Request body metadata
         *         requestBody: {
         *           // request body parameters
         *           // {
         *           //   "binaryData": "my_binaryData",
         *           //   "versionToUpdate": "my_versionToUpdate"
         *           // }
         *         },
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "binaryData": "my_binaryData",
         *   //   "cloudUpdateTime": "my_cloudUpdateTime",
         *   //   "deviceAckTime": "my_deviceAckTime",
         *   //   "version": "my_version"
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
        modifyCloudToDeviceConfig(params: Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        modifyCloudToDeviceConfig(params?: Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceConfig>>;
        modifyCloudToDeviceConfig(params: Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        modifyCloudToDeviceConfig(params: Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig, options: MethodOptions | BodyResponseCallback<Schema$DeviceConfig>, callback: BodyResponseCallback<Schema$DeviceConfig>): void;
        modifyCloudToDeviceConfig(params: Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig, callback: BodyResponseCallback<Schema$DeviceConfig>): void;
        modifyCloudToDeviceConfig(callback: BodyResponseCallback<Schema$DeviceConfig>): void;
        /**
         * Updates a device.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.patch({
         *     // The resource path name. For example, `projects/p1/locations/us-central1/registries/registry0/devices/dev0` or `projects/p1/locations/us-central1/registries/registry0/devices/{num_id\}`. When `name` is populated as a response from the service, it always ends in the device numeric ID.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *     // Required. Only updates the `device` fields indicated by this mask. The field mask must not be empty, and it must not contain fields that are immutable or only set by the server. Mutable top-level fields: `credentials`, `blocked`, and `metadata`
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "blocked": false,
         *       //   "config": {},
         *       //   "credentials": [],
         *       //   "gatewayConfig": {},
         *       //   "id": "my_id",
         *       //   "lastConfigAckTime": "my_lastConfigAckTime",
         *       //   "lastConfigSendTime": "my_lastConfigSendTime",
         *       //   "lastErrorStatus": {},
         *       //   "lastErrorTime": "my_lastErrorTime",
         *       //   "lastEventTime": "my_lastEventTime",
         *       //   "lastHeartbeatTime": "my_lastHeartbeatTime",
         *       //   "lastStateTime": "my_lastStateTime",
         *       //   "logLevel": "my_logLevel",
         *       //   "metadata": {},
         *       //   "name": "my_name",
         *       //   "numId": "my_numId",
         *       //   "state": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "blocked": false,
         *   //   "config": {},
         *   //   "credentials": [],
         *   //   "gatewayConfig": {},
         *   //   "id": "my_id",
         *   //   "lastConfigAckTime": "my_lastConfigAckTime",
         *   //   "lastConfigSendTime": "my_lastConfigSendTime",
         *   //   "lastErrorStatus": {},
         *   //   "lastErrorTime": "my_lastErrorTime",
         *   //   "lastEventTime": "my_lastEventTime",
         *   //   "lastHeartbeatTime": "my_lastHeartbeatTime",
         *   //   "lastStateTime": "my_lastStateTime",
         *   //   "logLevel": "my_logLevel",
         *   //   "metadata": {},
         *   //   "name": "my_name",
         *   //   "numId": "my_numId",
         *   //   "state": {}
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
        patch(params: Params$Resource$Projects$Locations$Registries$Devices$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Registries$Devices$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Device>>;
        patch(params: Params$Resource$Projects$Locations$Registries$Devices$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Registries$Devices$Patch, options: MethodOptions | BodyResponseCallback<Schema$Device>, callback: BodyResponseCallback<Schema$Device>): void;
        patch(params: Params$Resource$Projects$Locations$Registries$Devices$Patch, callback: BodyResponseCallback<Schema$Device>): void;
        patch(callback: BodyResponseCallback<Schema$Device>): void;
        /**
         * Sends a command to the specified device. In order for a device to be able to receive commands, it must: 1) be connected to Cloud IoT Core using the MQTT protocol, and 2) be subscribed to the group of MQTT topics specified by /devices/{device-id\}/commands/#. This subscription will receive commands at the top-level topic /devices/{device-id\}/commands as well as commands for subfolders, like /devices/{device-id\}/commands/subfolder. Note that subscribing to specific subfolders is not supported. If the command could not be delivered to the device, this method will return an error; in particular, if the device is not subscribed, this method will return FAILED_PRECONDITION. Otherwise, this method will return OK. If the subscription is QoS 1, at least once delivery will be guaranteed; for QoS 0, no acknowledgment will be expected from the device.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await cloudiot.projects.locations.registries.devices.sendCommandToDevice({
         *       // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *       name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "binaryData": "my_binaryData",
         *         //   "subfolder": "my_subfolder"
         *         // }
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
        sendCommandToDevice(params: Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        sendCommandToDevice(params?: Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SendCommandToDeviceResponse>>;
        sendCommandToDevice(params: Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        sendCommandToDevice(params: Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice, options: MethodOptions | BodyResponseCallback<Schema$SendCommandToDeviceResponse>, callback: BodyResponseCallback<Schema$SendCommandToDeviceResponse>): void;
        sendCommandToDevice(params: Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice, callback: BodyResponseCallback<Schema$SendCommandToDeviceResponse>): void;
        sendCommandToDevice(callback: BodyResponseCallback<Schema$SendCommandToDeviceResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Create extends StandardParameters {
        /**
         * Required. The name of the device registry where this device should be created. For example, `projects/example-project/locations/us-central1/registries/my-registry`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Device;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Delete extends StandardParameters {
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Get extends StandardParameters {
        /**
         * The fields of the `Device` resource to be returned in the response. If the field mask is unset or empty, all fields are returned. Fields have to be provided in snake_case format, for example: `last_heartbeat_time`.
         */
        fieldMask?: string;
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$List extends StandardParameters {
        /**
         * A list of device string IDs. For example, `['device0', 'device12']`. If empty, this field is ignored. Maximum IDs: 10,000
         */
        deviceIds?: string[];
        /**
         * A list of device numeric IDs. If empty, this field is ignored. Maximum IDs: 10,000.
         */
        deviceNumIds?: string[];
        /**
         * The fields of the `Device` resource to be returned in the response. The fields `id` and `num_id` are always returned, along with any other fields specified in snake_case format, for example: `last_heartbeat_time`.
         */
        fieldMask?: string;
        /**
         * If set, returns only the gateways with which the specified device is associated. The device ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `456` is specified, returns only the gateways to which the device with `num_id` 456 is bound.
         */
        'gatewayListOptions.associationsDeviceId'?: string;
        /**
         * If set, only devices associated with the specified gateway are returned. The gateway ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `123` is specified, only devices bound to the gateway with `num_id` 123 are returned.
         */
        'gatewayListOptions.associationsGatewayId'?: string;
        /**
         * If `GATEWAY` is specified, only gateways are returned. If `NON_GATEWAY` is specified, only non-gateway devices are returned. If `GATEWAY_TYPE_UNSPECIFIED` is specified, all devices are returned.
         */
        'gatewayListOptions.gatewayType'?: string;
        /**
         * The maximum number of devices to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListDevicesResponse`; indicates that this is a continuation of a prior `ListDevices` call and the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. The device registry path. Required. For example, `projects/my-project/locations/us-central1/registries/my-registry`.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Modifycloudtodeviceconfig extends StandardParameters {
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ModifyCloudToDeviceConfigRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Patch extends StandardParameters {
        /**
         * The resource path name. For example, `projects/p1/locations/us-central1/registries/registry0/devices/dev0` or `projects/p1/locations/us-central1/registries/registry0/devices/{num_id\}`. When `name` is populated as a response from the service, it always ends in the device numeric ID.
         */
        name?: string;
        /**
         * Required. Only updates the `device` fields indicated by this mask. The field mask must not be empty, and it must not contain fields that are immutable or only set by the server. Mutable top-level fields: `credentials`, `blocked`, and `metadata`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Device;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Sendcommandtodevice extends StandardParameters {
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendCommandToDeviceRequest;
    }
    export class Resource$Projects$Locations$Registries$Devices$Configversions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the last few versions of the device configuration in descending order (i.e.: newest first).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await cloudiot.projects.locations.registries.devices.configVersions.list({
         *       // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *       name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *       // The number of versions to list. Versions are listed in decreasing order of the version number. The maximum number of versions retained is 10. If this value is zero, it will return all the versions available.
         *       numVersions: 'placeholder-value',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deviceConfigs": []
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
        list(params: Params$Resource$Projects$Locations$Registries$Devices$Configversions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Registries$Devices$Configversions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDeviceConfigVersionsResponse>>;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$Configversions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$Configversions$List, options: MethodOptions | BodyResponseCallback<Schema$ListDeviceConfigVersionsResponse>, callback: BodyResponseCallback<Schema$ListDeviceConfigVersionsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$Configversions$List, callback: BodyResponseCallback<Schema$ListDeviceConfigVersionsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDeviceConfigVersionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$Configversions$List extends StandardParameters {
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
        /**
         * The number of versions to list. Versions are listed in decreasing order of the version number. The maximum number of versions retained is 10. If this value is zero, it will return all the versions available.
         */
        numVersions?: number;
    }
    export class Resource$Projects$Locations$Registries$Devices$States {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists the last few versions of the device state in descending order (i.e.: newest first).
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.devices.states.list({
         *     // Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         *     name: 'projects/my-project/locations/my-location/registries/my-registrie/devices/my-device',
         *     // The number of states to list. States are listed in descending order of update time. The maximum number of states retained is 10. If this value is zero, it will return all the states available.
         *     numStates: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "deviceStates": []
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
        list(params: Params$Resource$Projects$Locations$Registries$Devices$States$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Registries$Devices$States$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDeviceStatesResponse>>;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$States$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$States$List, options: MethodOptions | BodyResponseCallback<Schema$ListDeviceStatesResponse>, callback: BodyResponseCallback<Schema$ListDeviceStatesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Devices$States$List, callback: BodyResponseCallback<Schema$ListDeviceStatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDeviceStatesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Devices$States$List extends StandardParameters {
        /**
         * Required. The name of the device. For example, `projects/p0/locations/us-central1/registries/registry0/devices/device0` or `projects/p0/locations/us-central1/registries/registry0/devices/{num_id\}`.
         */
        name?: string;
        /**
         * The number of states to list. States are listed in descending order of update time. The maximum number of states retained is 10. If this value is zero, it will return all the states available.
         */
        numStates?: number;
    }
    export class Resource$Projects$Locations$Registries$Groups {
        context: APIRequestContext;
        devices: Resource$Projects$Locations$Registries$Groups$Devices;
        constructor(context: APIRequestContext);
        /**
         * Gets the access control policy for a resource. Returns an empty policy if the resource exists and does not have a policy set.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.groups.getIamPolicy({
         *     // REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *     resource:
         *       'projects/my-project/locations/my-location/registries/my-registrie/groups/my-group',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "options": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
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
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getIamPolicy(params?: Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        getIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Sets the access control policy on the specified resource. Replaces any existing policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.groups.setIamPolicy({
         *     // REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *     resource:
         *       'projects/my-project/locations/my-location/registries/my-registrie/groups/my-group',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "policy": {}
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bindings": [],
         *   //   "etag": "my_etag",
         *   //   "version": 0
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
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setIamPolicy(params?: Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(params: Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy, callback: BodyResponseCallback<Schema$Policy>): void;
        setIamPolicy(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Returns permissions that a caller has on the specified resource. If the resource does not exist, this will return an empty set of permissions, not a NOT_FOUND error.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res =
         *     await cloudiot.projects.locations.registries.groups.testIamPermissions({
         *       // REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         *       resource:
         *         'projects/my-project/locations/my-location/registries/my-registrie/groups/my-group',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "permissions": []
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "permissions": []
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
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        testIamPermissions(params?: Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$TestIamPermissionsResponse>>;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions, options: MethodOptions | BodyResponseCallback<Schema$TestIamPermissionsResponse>, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(params: Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions, callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
        testIamPermissions(callback: BodyResponseCallback<Schema$TestIamPermissionsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Groups$Getiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Groups$Setiampolicy extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy is being specified. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SetIamPolicyRequest;
    }
    export interface Params$Resource$Projects$Locations$Registries$Groups$Testiampermissions extends StandardParameters {
        /**
         * REQUIRED: The resource for which the policy detail is being requested. See [Resource names](https://cloud.google.com/apis/design/resource_names) for the appropriate value for this field.
         */
        resource?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$TestIamPermissionsRequest;
    }
    export class Resource$Projects$Locations$Registries$Groups$Devices {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List devices in a device registry.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/cloudiot.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const cloudiot = google.cloudiot('v1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloudiot',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await cloudiot.projects.locations.registries.groups.devices.list({
         *     // A list of device string IDs. For example, `['device0', 'device12']`. If empty, this field is ignored. Maximum IDs: 10,000
         *     deviceIds: 'placeholder-value',
         *     // A list of device numeric IDs. If empty, this field is ignored. Maximum IDs: 10,000.
         *     deviceNumIds: 'placeholder-value',
         *     // The fields of the `Device` resource to be returned in the response. The fields `id` and `num_id` are always returned, along with any other fields specified in snake_case format, for example: `last_heartbeat_time`.
         *     fieldMask: 'placeholder-value',
         *     // If set, returns only the gateways with which the specified device is associated. The device ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `456` is specified, returns only the gateways to which the device with `num_id` 456 is bound.
         *     'gatewayListOptions.associationsDeviceId': 'placeholder-value',
         *     // If set, only devices associated with the specified gateway are returned. The gateway ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `123` is specified, only devices bound to the gateway with `num_id` 123 are returned.
         *     'gatewayListOptions.associationsGatewayId': 'placeholder-value',
         *     // If `GATEWAY` is specified, only gateways are returned. If `NON_GATEWAY` is specified, only non-gateway devices are returned. If `GATEWAY_TYPE_UNSPECIFIED` is specified, all devices are returned.
         *     'gatewayListOptions.gatewayType': 'placeholder-value',
         *     // The maximum number of devices to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         *     pageSize: 'placeholder-value',
         *     // The value returned by the last `ListDevicesResponse`; indicates that this is a continuation of a prior `ListDevices` call and the system should return the next page of data.
         *     pageToken: 'placeholder-value',
         *     // Required. The device registry path. Required. For example, `projects/my-project/locations/us-central1/registries/my-registry`.
         *     parent:
         *       'projects/my-project/locations/my-location/registries/my-registrie/groups/my-group',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "devices": [],
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
        list(params: Params$Resource$Projects$Locations$Registries$Groups$Devices$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Registries$Groups$Devices$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListDevicesResponse>>;
        list(params: Params$Resource$Projects$Locations$Registries$Groups$Devices$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Groups$Devices$List, options: MethodOptions | BodyResponseCallback<Schema$ListDevicesResponse>, callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Registries$Groups$Devices$List, callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListDevicesResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Registries$Groups$Devices$List extends StandardParameters {
        /**
         * A list of device string IDs. For example, `['device0', 'device12']`. If empty, this field is ignored. Maximum IDs: 10,000
         */
        deviceIds?: string[];
        /**
         * A list of device numeric IDs. If empty, this field is ignored. Maximum IDs: 10,000.
         */
        deviceNumIds?: string[];
        /**
         * The fields of the `Device` resource to be returned in the response. The fields `id` and `num_id` are always returned, along with any other fields specified in snake_case format, for example: `last_heartbeat_time`.
         */
        fieldMask?: string;
        /**
         * If set, returns only the gateways with which the specified device is associated. The device ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `456` is specified, returns only the gateways to which the device with `num_id` 456 is bound.
         */
        'gatewayListOptions.associationsDeviceId'?: string;
        /**
         * If set, only devices associated with the specified gateway are returned. The gateway ID can be numeric (`num_id`) or the user-defined string (`id`). For example, if `123` is specified, only devices bound to the gateway with `num_id` 123 are returned.
         */
        'gatewayListOptions.associationsGatewayId'?: string;
        /**
         * If `GATEWAY` is specified, only gateways are returned. If `NON_GATEWAY` is specified, only non-gateway devices are returned. If `GATEWAY_TYPE_UNSPECIFIED` is specified, all devices are returned.
         */
        'gatewayListOptions.gatewayType'?: string;
        /**
         * The maximum number of devices to return in the response. If this value is zero, the service will select a default size. A call may return fewer objects than requested. A non-empty `next_page_token` in the response indicates that more data is available.
         */
        pageSize?: number;
        /**
         * The value returned by the last `ListDevicesResponse`; indicates that this is a continuation of a prior `ListDevices` call and the system should return the next page of data.
         */
        pageToken?: string;
        /**
         * Required. The device registry path. Required. For example, `projects/my-project/locations/us-central1/registries/my-registry`.
         */
        parent?: string;
    }
    export {};
}
