import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace securitycenter_v1p1alpha1 {
    export interface Options extends GlobalOptions {
        version: 'v1p1alpha1';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
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
     * Security Command Center API
     *
     * Security Command Center API provides access to temporal views of assets and findings within an organization.
     *
     * @example
     * const {google} = require('googleapis');
     * const securitycenter = google.securitycenter('v1p1alpha1');
     *
     * @namespace securitycenter
     * @type {Function}
     * @version v1p1alpha1
     * @variation v1p1alpha1
     * @param {object=} options Options for Securitycenter
     */
    export class Securitycenter {
        context: APIRequestContext;
        organizations: Resource$Organizations;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); } The JSON representation for `Empty` is empty JSON object `{}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Security Command Center finding. A finding is a record of assessment data like security, risk, health, or privacy, that is ingested into Security Command Center for presentation, notification, analysis, policy testing, and enforcement. For example, a cross-site scripting (XSS) vulnerability in an App Engine application is a finding.
     */
    export interface Schema$Finding {
        /**
         * The additional taxonomy group within findings from a given source. This field is immutable after creation time. Example: &quot;XSS_FLASH_INJECTION&quot;
         */
        category?: string | null;
        /**
         * The time at which the finding was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * The time at which the event took place. For example, if the finding represents an open firewall it would capture the time the detector believes the firewall became open. The accuracy is determined by the detector.
         */
        eventTime?: string | null;
        /**
         * The URI that, if available, points to a web page outside of Security Command Center where additional information about the finding can be found. This field is guaranteed to be either empty or a well formed URL.
         */
        externalUri?: string | null;
        /**
         * The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}&quot;
         */
        name?: string | null;
        /**
         * The relative resource name of the source the finding belongs to. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name This field is immutable after creation time. For example: &quot;organizations/{organization_id}/sources/{source_id}&quot;
         */
        parent?: string | null;
        /**
         * For findings on Google Cloud resources, the full resource name of the Google Cloud resource this finding is for. See: https://cloud.google.com/apis/design/resource_names#full_resource_name When the finding is for a non-Google Cloud resource, the resourceName can be a customer or partner defined string. This field is immutable after creation time.
         */
        resourceName?: string | null;
        /**
         * Output only. User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the finding.
         */
        securityMarks?: Schema$SecurityMarks;
        /**
         * Source specific properties. These properties are managed by the source that writes the finding. The key names in the source_properties map must be between 1 and 255 characters, and must start with a letter and contain alphanumeric characters or underscores only.
         */
        sourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * The state of the finding.
         */
        state?: string | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1beta1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
    }
    /**
     * Cloud SCC&#39;s Notification
     */
    export interface Schema$GoogleCloudSecuritycenterV1NotificationMessage {
        /**
         * If it&#39;s a Finding based notification config, this field will be populated.
         */
        finding?: Schema$Finding;
        /**
         * Name of the notification config that generated current notification.
         */
        notificationConfigName?: string | null;
        /**
         * The Cloud resource tied to this notification&#39;s Finding.
         */
        resource?: Schema$GoogleCloudSecuritycenterV1Resource;
    }
    /**
     * Security Command Center representation of a Google Cloud resource. The Asset is a Security Command Center resource that captures information about a single Google Cloud resource. All modifications to an Asset are only within the context of Security Command Center and don&#39;t affect the referenced Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Asset {
        /**
         * The time at which the asset was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * Cloud IAM Policy information associated with the Google Cloud resource described by the Security Command Center asset. This information is managed and defined by the Google Cloud resource and cannot be modified by the user.
         */
        iamPolicy?: Schema$GoogleCloudSecuritycenterV1p1beta1IamPolicy;
        /**
         * The relative resource name of this asset. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/assets/{asset_id}&quot;.
         */
        name?: string | null;
        /**
         * Resource managed properties. These properties are managed and defined by the Google Cloud resource and cannot be modified by the user.
         */
        resourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * Security Command Center managed properties. These properties are managed by Security Command Center and cannot be modified by the user.
         */
        securityCenterProperties?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityCenterProperties;
        /**
         * User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the asset.
         */
        securityMarks?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
        /**
         * The time at which the asset was last updated, added, or deleted in Cloud SCC.
         */
        updateTime?: string | null;
    }
    /**
     * Security Command Center finding. A finding is a record of assessment data (security, risk, health or privacy) ingested into Security Command Center for presentation, notification, analysis, policy testing, and enforcement. For example, an XSS vulnerability in an App Engine application is a finding.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Finding {
        /**
         * The additional taxonomy group within findings from a given source. This field is immutable after creation time. Example: &quot;XSS_FLASH_INJECTION&quot;
         */
        category?: string | null;
        /**
         * The time at which the finding was created in Security Command Center.
         */
        createTime?: string | null;
        /**
         * The time at which the event took place. For example, if the finding represents an open firewall it would capture the time the detector believes the firewall became open. The accuracy is determined by the detector.
         */
        eventTime?: string | null;
        /**
         * The URI that, if available, points to a web page outside of Security Command Center where additional information about the finding can be found. This field is guaranteed to be either empty or a well formed URL.
         */
        externalUri?: string | null;
        /**
         * The relative resource name of this finding. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Example: &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}&quot;
         */
        name?: string | null;
        /**
         * The relative resource name of the source the finding belongs to. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name This field is immutable after creation time. For example: &quot;organizations/{organization_id}/sources/{source_id}&quot;
         */
        parent?: string | null;
        /**
         * For findings on Google Cloud resources, the full resource name of the Google Cloud resource this finding is for. See: https://cloud.google.com/apis/design/resource_names#full_resource_name When the finding is for a non-Google Cloud resource, the resourceName can be a customer or partner defined string. This field is immutable after creation time.
         */
        resourceName?: string | null;
        /**
         * Output only. User specified security marks. These marks are entirely managed by the user and come from the SecurityMarks resource that belongs to the finding.
         */
        securityMarks?: Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks;
        /**
         * The severity of the finding.
         */
        severity?: string | null;
        /**
         * Source specific properties. These properties are managed by the source that writes the finding. The key names in the source_properties map must be between 1 and 255 characters, and must start with a letter and contain alphanumeric characters or underscores only.
         */
        sourceProperties?: {
            [key: string]: any;
        } | null;
        /**
         * The state of the finding.
         */
        state?: string | null;
    }
    /**
     * Cloud IAM Policy information associated with the Google Cloud resource described by the Security Command Center asset. This information is managed and defined by the Google Cloud resource and cannot be modified by the user.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1IamPolicy {
        /**
         * The JSON representation of the Policy associated with the asset. See https://cloud.google.com/iam/docs/reference/rest/v1/Policy for format details.
         */
        policyBlob?: string | null;
    }
    /**
     * Security Command Center&#39;s Notification
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1NotificationMessage {
        /**
         * If it&#39;s a Finding based notification config, this field will be populated.
         */
        finding?: Schema$GoogleCloudSecuritycenterV1p1beta1Finding;
        /**
         * Name of the notification config that generated current notification.
         */
        notificationConfigName?: string | null;
        /**
         * The Cloud resource tied to the notification.
         */
        resource?: Schema$GoogleCloudSecuritycenterV1p1beta1Resource;
        /**
         * If it&#39;s an asset based notification config, this field will be populated.
         */
        temporalAsset?: Schema$GoogleCloudSecuritycenterV1p1beta1TemporalAsset;
    }
    /**
     *  Information related to the Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1Resource {
        /**
         * The full resource name of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        name?: string | null;
        /**
         * The full resource name of resource&#39;s parent.
         */
        parent?: string | null;
        /**
         *  The human readable name of resource&#39;s parent.
         */
        parentDisplayName?: string | null;
        /**
         * The full resource name of project that the resource belongs to.
         */
        project?: string | null;
        /**
         *  The human readable name of project that the resource belongs to.
         */
        projectDisplayName?: string | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
    }
    /**
     * Security Command Center managed properties. These properties are managed by Security Command Center and cannot be modified by the user.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1SecurityCenterProperties {
        /**
         * The user defined display name for this resource.
         */
        resourceDisplayName?: string | null;
        /**
         * The full resource name of the Google Cloud resource this asset represents. This field is immutable after create time. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceName?: string | null;
        /**
         * Owners of the Google Cloud resource.
         */
        resourceOwners?: string[] | null;
        /**
         * The full resource name of the immediate parent of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceParent?: string | null;
        /**
         * The user defined display name for the parent of this resource.
         */
        resourceParentDisplayName?: string | null;
        /**
         * The full resource name of the project the resource belongs to. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        resourceProject?: string | null;
        /**
         * The user defined display name for the project of this resource.
         */
        resourceProjectDisplayName?: string | null;
        /**
         * The type of the Google Cloud resource. Examples include: APPLICATION, PROJECT, and ORGANIZATION. This is a case insensitive field defined by Security Command Center and/or the producer of the resource and is immutable after create time.
         */
        resourceType?: string | null;
    }
    /**
     * User specified security marks that are attached to the parent Security Command Center resource. Security marks are scoped within a Security Command Center organization -- they can be modified and viewed by all users who have proper permissions on the organization.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1SecurityMarks {
        /**
         * Mutable user specified security marks belonging to the parent resource. Constraints are as follows: * Keys and values are treated as case insensitive * Keys must be between 1 - 256 characters (inclusive) * Keys must be letters, numbers, underscores, or dashes * Values have leading and trailing whitespace trimmed, remaining characters must be between 1 - 4096 characters (inclusive)
         */
        marks?: {
            [key: string]: string;
        } | null;
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: &quot;organizations/{organization_id}/assets/{asset_id}/securityMarks&quot; &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks&quot;.
         */
        name?: string | null;
    }
    /**
     * Wrapper over asset object that also captures the state change for the asset e.g. if it was a newly created asset vs updated or deleted asset.
     */
    export interface Schema$GoogleCloudSecuritycenterV1p1beta1TemporalAsset {
        /**
         * Asset data that includes attributes, properties and marks about the asset.
         */
        asset?: Schema$GoogleCloudSecuritycenterV1p1beta1Asset;
        /**
         * Represents if the asset was created/updated/deleted.
         */
        changeType?: string | null;
    }
    /**
     *  Information related to the Google Cloud resource.
     */
    export interface Schema$GoogleCloudSecuritycenterV1Resource {
        /**
         * The full resource name of the resource. See: https://cloud.google.com/apis/design/resource_names#full_resource_name
         */
        name?: string | null;
        /**
         * The full resource name of resource&#39;s parent.
         */
        parent?: string | null;
        /**
         *  The human readable name of resource&#39;s parent.
         */
        parentDisplayName?: string | null;
        /**
         * The full resource name of project that the resource belongs to.
         */
        project?: string | null;
        /**
         *  The human readable name of project that the resource belongs to.
         */
        projectDisplayName?: string | null;
    }
    /**
     * Response of asset discovery run
     */
    export interface Schema$GoogleCloudSecuritycenterV1RunAssetDiscoveryResponse {
        /**
         * The duration between asset discovery run start and end
         */
        duration?: string | null;
        /**
         * The state of an asset discovery run.
         */
        state?: string | null;
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
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id}`.
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
     * User specified security marks that are attached to the parent Security Command Center resource. Security marks are scoped within a Security Command Center organization -- they can be modified and viewed by all users who have proper permissions on the organization.
     */
    export interface Schema$SecurityMarks {
        /**
         * Mutable user specified security marks belonging to the parent resource. Constraints are as follows: * Keys and values are treated as case insensitive * Keys must be between 1 - 256 characters (inclusive) * Keys must be letters, numbers, underscores, or dashes * Values have leading and trailing whitespace trimmed, remaining characters must be between 1 - 4096 characters (inclusive)
         */
        marks?: {
            [key: string]: string;
        } | null;
        /**
         * The relative resource name of the SecurityMarks. See: https://cloud.google.com/apis/design/resource_names#relative_resource_name Examples: &quot;organizations/{organization_id}/assets/{asset_id}/securityMarks&quot; &quot;organizations/{organization_id}/sources/{source_id}/findings/{finding_id}/securityMarks&quot;.
         */
        name?: string | null;
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
    export class Resource$Organizations {
        context: APIRequestContext;
        operations: Resource$Organizations$Operations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Organizations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * securitycenter.organizations.operations.cancel
         * @desc Starts asynchronous cancellation on a long-running operation. The server makes a best effort to cancel the operation, but success is not guaranteed. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`. Clients can use Operations.GetOperation or other methods to check whether the cancellation succeeded or whether the operation completed despite cancellation. On successful cancellation, the operation is not deleted; instead, it becomes an operation with an Operation.error value with a google.rpc.Status.code of 1, corresponding to `Code.CANCELLED`.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1alpha1');
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
         *   const res = await securitycenter.organizations.operations.cancel({
         *     // The name of the operation resource to be cancelled.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.cancel
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource to be cancelled.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Organizations$Operations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(params: Params$Resource$Organizations$Operations$Cancel, callback: BodyResponseCallback<Schema$Empty>): void;
        cancel(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * securitycenter.organizations.operations.delete
         * @desc Deletes a long-running operation. This method indicates that the client is no longer interested in the operation result. It does not cancel the operation. If the server doesn't support this method, it returns `google.rpc.Code.UNIMPLEMENTED`.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1alpha1');
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
         *   const res = await securitycenter.organizations.operations.delete({
         *     // The name of the operation resource to be deleted.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource to be deleted.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Organizations$Operations$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Organizations$Operations$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Organizations$Operations$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Organizations$Operations$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Organizations$Operations$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * securitycenter.organizations.operations.get
         * @desc Gets the latest state of a long-running operation. Clients can use this method to poll the operation result at intervals as recommended by the API service.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1alpha1');
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
         *   const res = await securitycenter.organizations.operations.get({
         *     // The name of the operation resource.
         *     name: 'organizations/my-organization/operations/my-operation',
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
         * @alias securitycenter.organizations.operations.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The name of the operation resource.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Organizations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Organizations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Organizations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * securitycenter.organizations.operations.list
         * @desc Lists operations that match the specified filter in the request. If the server doesn't support this method, it returns `UNIMPLEMENTED`. NOTE: the `name` binding allows API services to override the binding to use different resource name schemes, such as `users/x/operations`. To override the binding, API services can add a binding such as `"/v1/{name=users/x}/operations"` to their service configuration. For backwards compatibility, the default name includes the operations collection id, however overriding users must ensure the name binding is the parent resource, without the operations collection id.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/securitycenter.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const securitycenter = google.securitycenter('v1p1alpha1');
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
         *   const res = await securitycenter.organizations.operations.list({
         *     // The standard list filter.
         *     filter: 'placeholder-value',
         *     // The name of the operation's parent resource.
         *     name: 'organizations/my-organization/operations',
         *     // The standard list page size.
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
         * @alias securitycenter.organizations.operations.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter The standard list filter.
         * @param {string} params.name The name of the operation's parent resource.
         * @param {integer=} params.pageSize The standard list page size.
         * @param {string=} params.pageToken The standard list page token.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Operations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Operations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListOperationsResponse>>;
        list(params: Params$Resource$Organizations$Operations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Operations$List, options: MethodOptions | BodyResponseCallback<Schema$ListOperationsResponse>, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(params: Params$Resource$Organizations$Operations$List, callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListOperationsResponse>): void;
    }
    export interface Params$Resource$Organizations$Operations$Cancel extends StandardParameters {
        /**
         * The name of the operation resource to be cancelled.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$Delete extends StandardParameters {
        /**
         * The name of the operation resource to be deleted.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Operations$List extends StandardParameters {
        /**
         * The standard list filter.
         */
        filter?: string;
        /**
         * The name of the operation's parent resource.
         */
        name?: string;
        /**
         * The standard list page size.
         */
        pageSize?: number;
        /**
         * The standard list page token.
         */
        pageToken?: string;
    }
    export {};
}
