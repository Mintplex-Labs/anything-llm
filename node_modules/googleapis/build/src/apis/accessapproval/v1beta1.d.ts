import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace accessapproval_v1beta1 {
    export interface Options extends GlobalOptions {
        version: 'v1beta1';
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
     * Access Approval API
     *
     * An API for controlling access to data by Google personnel.
     *
     * @example
     * const {google} = require('googleapis');
     * const accessapproval = google.accessapproval('v1beta1');
     *
     * @namespace accessapproval
     * @type {Function}
     * @version v1beta1
     * @variation v1beta1
     * @param {object=} options Options for Accessapproval
     */
    export class Accessapproval {
        context: APIRequestContext;
        folders: Resource$Folders;
        organizations: Resource$Organizations;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Settings on a Project/Folder/Organization related to Access Approval.
     */
    export interface Schema$AccessApprovalSettings {
        /**
         * Output only. This field is read only (not settable via UpdateAccessAccessApprovalSettings method). If the field is true, that indicates that at least one service is enrolled for Access Approval in one or more ancestors of the Project or Folder (this field will always be unset for the organization since organizations do not have ancestors).
         */
        enrolledAncestor?: boolean | null;
        /**
         * A list of Google Cloud Services for which the given resource has Access Approval enrolled. Access requests for the resource given by name against any of these services contained here will be required to have explicit approval. If name refers to an organization, enrollment can be done for individual services. If name refers to a folder or project, enrollment can only be done on an all or nothing basis.  If a cloud_product is repeated in this list, the first entry will be honored and all following entries will be discarded. A maximum of 10 enrolled services will be enforced, to be expanded as the set of supported services is expanded.
         */
        enrolledServices?: Schema$EnrolledService[];
        /**
         * The resource name of the settings. Format is one of: &lt;ol&gt;   &lt;li&gt;&quot;projects/{project_id}/accessApprovalSettings&quot;&lt;/li&gt;   &lt;li&gt;&quot;folders/{folder_id}/accessApprovalSettings&quot;&lt;/li&gt;   &lt;li&gt;&quot;organizations/{organization_id}/accessApprovalSettings&quot;&lt;/li&gt; &lt;ol&gt;
         */
        name?: string | null;
        /**
         * A list of email addresses to which notifications relating to approval requests should be sent. Notifications relating to a resource will be sent to all emails in the settings of ancestor resources of that resource. A maximum of 50 email addresses are allowed.
         */
        notificationEmails?: string[] | null;
    }
    /**
     * Home office and physical location of the principal.
     */
    export interface Schema$AccessLocations {
        /**
         * The &quot;home office&quot; location of the principal. A two-letter country code (ISO 3166-1 alpha-2), such as &quot;US&quot;, &quot;DE&quot; or &quot;GB&quot; or a region code. In some limited situations Google systems may refer refer to a region code instead of a country code. Possible Region Codes: &lt;ol&gt;   &lt;li&gt;ASI: Asia&lt;/li&gt;   &lt;li&gt;EUR: Europe&lt;/li&gt;   &lt;li&gt;OCE: Oceania&lt;/li&gt;   &lt;li&gt;AFR: Africa&lt;/li&gt;   &lt;li&gt;NAM: North America&lt;/li&gt;   &lt;li&gt;SAM: South America&lt;/li&gt;   &lt;li&gt;ANT: Antarctica&lt;/li&gt;   &lt;li&gt;ANY: Any location&lt;/li&gt; &lt;/ol&gt;
         */
        principalOfficeCountry?: string | null;
        /**
         * Physical location of the principal at the time of the access. A two-letter country code (ISO 3166-1 alpha-2), such as &quot;US&quot;, &quot;DE&quot; or &quot;GB&quot; or a region code. In some limited situations Google systems may refer refer to a region code instead of a country code. Possible Region Codes: &lt;ol&gt;   &lt;li&gt;ASI: Asia&lt;/li&gt;   &lt;li&gt;EUR: Europe&lt;/li&gt;   &lt;li&gt;OCE: Oceania&lt;/li&gt;   &lt;li&gt;AFR: Africa&lt;/li&gt;   &lt;li&gt;NAM: North America&lt;/li&gt;   &lt;li&gt;SAM: South America&lt;/li&gt;   &lt;li&gt;ANT: Antarctica&lt;/li&gt;   &lt;li&gt;ANY: Any location&lt;/li&gt; &lt;/ol&gt;
         */
        principalPhysicalLocationCountry?: string | null;
    }
    export interface Schema$AccessReason {
        /**
         * More detail about certain reason types. See comments for each type above.
         */
        detail?: string | null;
        /**
         * Type of access justification.
         */
        type?: string | null;
    }
    /**
     * A request for the customer to approve access to a resource.
     */
    export interface Schema$ApprovalRequest {
        /**
         * Access was approved.
         */
        approve?: Schema$ApproveDecision;
        /**
         * The request was dismissed.
         */
        dismiss?: Schema$DismissDecision;
        /**
         * The resource name of the request. Format is &quot;{projects|folders|organizations}/{id}/approvalRequests/{approval_request_id}&quot;.
         */
        name?: string | null;
        /**
         * The requested expiration for the approval. If the request is approved, access will be granted from the time of approval until the expiration time.
         */
        requestedExpiration?: string | null;
        /**
         * The locations for which approval is being requested.
         */
        requestedLocations?: Schema$AccessLocations;
        /**
         * The justification for which approval is being requested.
         */
        requestedReason?: Schema$AccessReason;
        /**
         * The resource for which approval is being requested. The format of the resource name is defined at https://cloud.google.com/apis/design/resource_names. The resource name here may either be a &quot;full&quot; resource name (e.g. &quot;//library.googleapis.com/shelves/shelf1/books/book2&quot;) or a &quot;relative&quot; resource name (e.g. &quot;shelves/shelf1/books/book2&quot;) as described in the resource name specification.
         */
        requestedResourceName?: string | null;
        /**
         * Properties related to the resource represented by requested_resource_name.
         */
        requestedResourceProperties?: Schema$ResourceProperties;
        /**
         * The time at which approval was requested.
         */
        requestTime?: string | null;
    }
    /**
     * Request to approve an ApprovalRequest.
     */
    export interface Schema$ApproveApprovalRequestMessage {
        /**
         * The expiration time of this approval.
         */
        expireTime?: string | null;
    }
    /**
     * A decision that has been made to approve access to a resource.
     */
    export interface Schema$ApproveDecision {
        /**
         * The time at which approval was granted.
         */
        approveTime?: string | null;
        /**
         * The time at which the approval expires.
         */
        expireTime?: string | null;
    }
    /**
     * Request to dismiss an approval request.
     */
    export interface Schema$DismissApprovalRequestMessage {
    }
    /**
     * A decision that has been made to dismiss an approval request.
     */
    export interface Schema$DismissDecision {
        /**
         * The time at which the approval request was dismissed.
         */
        dismissTime?: string | null;
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance:      service Foo {       rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty);     }  The JSON representation for `Empty` is empty JSON object `{}`.
     */
    export interface Schema$Empty {
    }
    /**
     * Represents the enrollment of a cloud resource into a specific service.
     */
    export interface Schema$EnrolledService {
        /**
         * The product for which Access Approval will be enrolled. Allowed values are listed below (case-sensitive): &lt;ol&gt;   &lt;li&gt;all&lt;/li&gt;   &lt;li&gt;appengine.googleapis.com&lt;/li&gt;   &lt;li&gt;bigquery.googleapis.com&lt;/li&gt;   &lt;li&gt;bigtable.googleapis.com&lt;/li&gt;   &lt;li&gt;cloudkms.googleapis.com&lt;/li&gt;   &lt;li&gt;compute.googleapis.com&lt;/li&gt;   &lt;li&gt;dataflow.googleapis.com&lt;/li&gt;   &lt;li&gt;iam.googleapis.com&lt;/li&gt;   &lt;li&gt;pubsub.googleapis.com&lt;/li&gt;   &lt;li&gt;storage.googleapis.com&lt;/li&gt; &lt;ol&gt;
         */
        cloudProduct?: string | null;
        /**
         * The enrollment level of the service.
         */
        enrollmentLevel?: string | null;
    }
    /**
     * Response to listing of ApprovalRequest objects.
     */
    export interface Schema$ListApprovalRequestsResponse {
        /**
         * Approval request details.
         */
        approvalRequests?: Schema$ApprovalRequest[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more.
         */
        nextPageToken?: string | null;
    }
    /**
     * The properties associated with the resource of the request.
     */
    export interface Schema$ResourceProperties {
        /**
         * Whether an approval will exclude the descendants of the resource being requested.
         */
        excludesDescendants?: boolean | null;
    }
    export class Resource$Folders {
        context: APIRequestContext;
        approvalRequests: Resource$Folders$Approvalrequests;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.folders.deleteAccessApprovalSettings
         * @desc Deletes the settings associated with a project, folder, or organization. This will have the effect of disabling Access Approval for the project, folder, or organization, but only if all ancestors also have Access Approval disabled. If Access Approval is enabled at a higher level of the hierarchy, then Access Approval will still be enabled at this level as the settings are inherited.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.deleteAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to delete.
         *     name: 'folders/my-folder/accessApprovalSettings',
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
         * @alias accessapproval.folders.deleteAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to delete.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        deleteAccessApprovalSettings(params: Params$Resource$Folders$Deleteaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteAccessApprovalSettings(params?: Params$Resource$Folders$Deleteaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        deleteAccessApprovalSettings(params: Params$Resource$Folders$Deleteaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Folders$Deleteaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Folders$Deleteaccessapprovalsettings, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * accessapproval.folders.getAccessApprovalSettings
         * @desc Gets the settings associated with a project, folder, or organization.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.getAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to retrieve.
         *     name: 'folders/my-folder/accessApprovalSettings',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.getAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getAccessApprovalSettings(params: Params$Resource$Folders$Getaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAccessApprovalSettings(params?: Params$Resource$Folders$Getaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        getAccessApprovalSettings(params: Params$Resource$Folders$Getaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAccessApprovalSettings(params: Params$Resource$Folders$Getaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(params: Params$Resource$Folders$Getaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        /**
         * accessapproval.folders.updateAccessApprovalSettings
         * @desc Updates the settings associated with a project, folder, or organization. Settings to update are determined by the value of field_mask.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.updateAccessApprovalSettings({
         *     // The resource name of the settings. Format is one of:
         *     // <ol>
         *     //   <li>"projects/{project_id}/accessApprovalSettings"</li>
         *     //   <li>"folders/{folder_id}/accessApprovalSettings"</li>
         *     //   <li>"organizations/{organization_id}/accessApprovalSettings"</li>
         *     // <ol>
         *     name: 'folders/my-folder/accessApprovalSettings',
         *     // For the `FieldMask` definition, see
         *     // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         *     // If this field is left unset, only the notification_emails field will be
         *     // updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "enrolledAncestor": false,
         *       //   "enrolledServices": [],
         *       //   "name": "my_name",
         *       //   "notificationEmails": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.updateAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         * @param {string=} params.updateMask For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         * @param {().AccessApprovalSettings} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateAccessApprovalSettings(params: Params$Resource$Folders$Updateaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAccessApprovalSettings(params?: Params$Resource$Folders$Updateaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        updateAccessApprovalSettings(params: Params$Resource$Folders$Updateaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAccessApprovalSettings(params: Params$Resource$Folders$Updateaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(params: Params$Resource$Folders$Updateaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
    }
    export interface Params$Resource$Folders$Deleteaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Getaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Updateaccessapprovalsettings extends StandardParameters {
        /**
         * The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         */
        name?: string;
        /**
         * For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessApprovalSettings;
    }
    export class Resource$Folders$Approvalrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.folders.approvalRequests.approve
         * @desc Approves a request and returns the updated ApprovalRequest.  Returns NOT_FOUND if the request does not exist. Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.approvalRequests.approve({
         *     // Name of the approval request to approve.
         *     name: 'folders/my-folder/approvalRequests/my-approvalRequest',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "expireTime": "my_expireTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.approvalRequests.approve
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to approve.
         * @param {().ApproveApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        approve(params: Params$Resource$Folders$Approvalrequests$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Folders$Approvalrequests$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        approve(params: Params$Resource$Folders$Approvalrequests$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Folders$Approvalrequests$Approve, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(params: Params$Resource$Folders$Approvalrequests$Approve, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.folders.approvalRequests.dismiss
         * @desc Dismisses a request. Returns the updated ApprovalRequest.  NOTE: This does not deny access to the resource if another request has been made and approved. It is equivalent in effect to ignoring the request altogether.  Returns NOT_FOUND if the request does not exist.  Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.approvalRequests.dismiss({
         *     // Name of the ApprovalRequest to dismiss.
         *     name: 'folders/my-folder/approvalRequests/my-approvalRequest',
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
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.approvalRequests.dismiss
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the ApprovalRequest to dismiss.
         * @param {().DismissApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        dismiss(params: Params$Resource$Folders$Approvalrequests$Dismiss, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        dismiss(params?: Params$Resource$Folders$Approvalrequests$Dismiss, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        dismiss(params: Params$Resource$Folders$Approvalrequests$Dismiss, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        dismiss(params: Params$Resource$Folders$Approvalrequests$Dismiss, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(params: Params$Resource$Folders$Approvalrequests$Dismiss, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.folders.approvalRequests.get
         * @desc Gets an approval request. Returns NOT_FOUND if the request does not exist.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.approvalRequests.get({
         *     // Name of the approval request to retrieve.
         *     name: 'folders/my-folder/approvalRequests/my-approvalRequest',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.approvalRequests.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Folders$Approvalrequests$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Folders$Approvalrequests$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        get(params: Params$Resource$Folders$Approvalrequests$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Folders$Approvalrequests$Get, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(params: Params$Resource$Folders$Approvalrequests$Get, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.folders.approvalRequests.list
         * @desc Lists approval requests associated with a project, folder, or organization. Approval requests can be filtered by state (pending, active, dismissed). The order is reverse chronological.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.folders.approvalRequests.list({
         *     // A filter on the type of approval requests to retrieve. Must be one of the
         *     // following values:
         *     // <ol>
         *     //   <li>[not set]: Requests that are pending or have active approvals.</li>
         *     //   <li>ALL: All requests.</li>
         *     //   <li>PENDING: Only pending requests.</li>
         *     //   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>
         *     //   <li>DISMISSED: Only dismissed (including expired) requests.</li>
         *     //   <li>HISTORY: Active and dismissed (including expired) requests.</li>
         *     // </ol>
         *     filter: 'placeholder-value',
         *     // Requested page size.
         *     pageSize: 'placeholder-value',
         *     // A token identifying the page of results to return.
         *     pageToken: 'placeholder-value',
         *     // The parent resource. This may be "projects/{project_id}",
         *     // "folders/{folder_id}", or "organizations/{organization_id}".
         *     parent: 'folders/my-folder',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approvalRequests": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.folders.approvalRequests.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         * @param {integer=} params.pageSize Requested page size.
         * @param {string=} params.pageToken A token identifying the page of results to return.
         * @param {string} params.parent The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Folders$Approvalrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Folders$Approvalrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListApprovalRequestsResponse>>;
        list(params: Params$Resource$Folders$Approvalrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Folders$Approvalrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListApprovalRequestsResponse>, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(params: Params$Resource$Folders$Approvalrequests$List, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
    }
    export interface Params$Resource$Folders$Approvalrequests$Approve extends StandardParameters {
        /**
         * Name of the approval request to approve.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ApproveApprovalRequestMessage;
    }
    export interface Params$Resource$Folders$Approvalrequests$Dismiss extends StandardParameters {
        /**
         * Name of the ApprovalRequest to dismiss.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DismissApprovalRequestMessage;
    }
    export interface Params$Resource$Folders$Approvalrequests$Get extends StandardParameters {
        /**
         * Name of the approval request to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Folders$Approvalrequests$List extends StandardParameters {
        /**
         * A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         */
        filter?: string;
        /**
         * Requested page size.
         */
        pageSize?: number;
        /**
         * A token identifying the page of results to return.
         */
        pageToken?: string;
        /**
         * The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         */
        parent?: string;
    }
    export class Resource$Organizations {
        context: APIRequestContext;
        approvalRequests: Resource$Organizations$Approvalrequests;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.organizations.deleteAccessApprovalSettings
         * @desc Deletes the settings associated with a project, folder, or organization. This will have the effect of disabling Access Approval for the project, folder, or organization, but only if all ancestors also have Access Approval disabled. If Access Approval is enabled at a higher level of the hierarchy, then Access Approval will still be enabled at this level as the settings are inherited.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.deleteAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to delete.
         *     name: 'organizations/my-organization/accessApprovalSettings',
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
         * @alias accessapproval.organizations.deleteAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to delete.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        deleteAccessApprovalSettings(params: Params$Resource$Organizations$Deleteaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteAccessApprovalSettings(params?: Params$Resource$Organizations$Deleteaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        deleteAccessApprovalSettings(params: Params$Resource$Organizations$Deleteaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Organizations$Deleteaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Organizations$Deleteaccessapprovalsettings, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * accessapproval.organizations.getAccessApprovalSettings
         * @desc Gets the settings associated with a project, folder, or organization.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.getAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to retrieve.
         *     name: 'organizations/my-organization/accessApprovalSettings',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.getAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getAccessApprovalSettings(params: Params$Resource$Organizations$Getaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAccessApprovalSettings(params?: Params$Resource$Organizations$Getaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        getAccessApprovalSettings(params: Params$Resource$Organizations$Getaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAccessApprovalSettings(params: Params$Resource$Organizations$Getaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(params: Params$Resource$Organizations$Getaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        /**
         * accessapproval.organizations.updateAccessApprovalSettings
         * @desc Updates the settings associated with a project, folder, or organization. Settings to update are determined by the value of field_mask.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.updateAccessApprovalSettings({
         *     // The resource name of the settings. Format is one of:
         *     // <ol>
         *     //   <li>"projects/{project_id}/accessApprovalSettings"</li>
         *     //   <li>"folders/{folder_id}/accessApprovalSettings"</li>
         *     //   <li>"organizations/{organization_id}/accessApprovalSettings"</li>
         *     // <ol>
         *     name: 'organizations/my-organization/accessApprovalSettings',
         *     // For the `FieldMask` definition, see
         *     // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         *     // If this field is left unset, only the notification_emails field will be
         *     // updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "enrolledAncestor": false,
         *       //   "enrolledServices": [],
         *       //   "name": "my_name",
         *       //   "notificationEmails": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.updateAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         * @param {string=} params.updateMask For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         * @param {().AccessApprovalSettings} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateAccessApprovalSettings(params: Params$Resource$Organizations$Updateaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAccessApprovalSettings(params?: Params$Resource$Organizations$Updateaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        updateAccessApprovalSettings(params: Params$Resource$Organizations$Updateaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAccessApprovalSettings(params: Params$Resource$Organizations$Updateaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(params: Params$Resource$Organizations$Updateaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
    }
    export interface Params$Resource$Organizations$Deleteaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Getaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Updateaccessapprovalsettings extends StandardParameters {
        /**
         * The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         */
        name?: string;
        /**
         * For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessApprovalSettings;
    }
    export class Resource$Organizations$Approvalrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.organizations.approvalRequests.approve
         * @desc Approves a request and returns the updated ApprovalRequest.  Returns NOT_FOUND if the request does not exist. Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.approvalRequests.approve({
         *     // Name of the approval request to approve.
         *     name: 'organizations/my-organization/approvalRequests/my-approvalRequest',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "expireTime": "my_expireTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.approvalRequests.approve
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to approve.
         * @param {().ApproveApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        approve(params: Params$Resource$Organizations$Approvalrequests$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Organizations$Approvalrequests$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        approve(params: Params$Resource$Organizations$Approvalrequests$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Organizations$Approvalrequests$Approve, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(params: Params$Resource$Organizations$Approvalrequests$Approve, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.organizations.approvalRequests.dismiss
         * @desc Dismisses a request. Returns the updated ApprovalRequest.  NOTE: This does not deny access to the resource if another request has been made and approved. It is equivalent in effect to ignoring the request altogether.  Returns NOT_FOUND if the request does not exist.  Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.approvalRequests.dismiss({
         *     // Name of the ApprovalRequest to dismiss.
         *     name: 'organizations/my-organization/approvalRequests/my-approvalRequest',
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
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.approvalRequests.dismiss
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the ApprovalRequest to dismiss.
         * @param {().DismissApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        dismiss(params: Params$Resource$Organizations$Approvalrequests$Dismiss, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        dismiss(params?: Params$Resource$Organizations$Approvalrequests$Dismiss, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        dismiss(params: Params$Resource$Organizations$Approvalrequests$Dismiss, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        dismiss(params: Params$Resource$Organizations$Approvalrequests$Dismiss, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(params: Params$Resource$Organizations$Approvalrequests$Dismiss, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.organizations.approvalRequests.get
         * @desc Gets an approval request. Returns NOT_FOUND if the request does not exist.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.approvalRequests.get({
         *     // Name of the approval request to retrieve.
         *     name: 'organizations/my-organization/approvalRequests/my-approvalRequest',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.approvalRequests.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Organizations$Approvalrequests$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Organizations$Approvalrequests$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        get(params: Params$Resource$Organizations$Approvalrequests$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Organizations$Approvalrequests$Get, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(params: Params$Resource$Organizations$Approvalrequests$Get, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.organizations.approvalRequests.list
         * @desc Lists approval requests associated with a project, folder, or organization. Approval requests can be filtered by state (pending, active, dismissed). The order is reverse chronological.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.organizations.approvalRequests.list({
         *     // A filter on the type of approval requests to retrieve. Must be one of the
         *     // following values:
         *     // <ol>
         *     //   <li>[not set]: Requests that are pending or have active approvals.</li>
         *     //   <li>ALL: All requests.</li>
         *     //   <li>PENDING: Only pending requests.</li>
         *     //   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>
         *     //   <li>DISMISSED: Only dismissed (including expired) requests.</li>
         *     //   <li>HISTORY: Active and dismissed (including expired) requests.</li>
         *     // </ol>
         *     filter: 'placeholder-value',
         *     // Requested page size.
         *     pageSize: 'placeholder-value',
         *     // A token identifying the page of results to return.
         *     pageToken: 'placeholder-value',
         *     // The parent resource. This may be "projects/{project_id}",
         *     // "folders/{folder_id}", or "organizations/{organization_id}".
         *     parent: 'organizations/my-organization',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approvalRequests": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.organizations.approvalRequests.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         * @param {integer=} params.pageSize Requested page size.
         * @param {string=} params.pageToken A token identifying the page of results to return.
         * @param {string} params.parent The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Organizations$Approvalrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Organizations$Approvalrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListApprovalRequestsResponse>>;
        list(params: Params$Resource$Organizations$Approvalrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Organizations$Approvalrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListApprovalRequestsResponse>, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(params: Params$Resource$Organizations$Approvalrequests$List, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
    }
    export interface Params$Resource$Organizations$Approvalrequests$Approve extends StandardParameters {
        /**
         * Name of the approval request to approve.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ApproveApprovalRequestMessage;
    }
    export interface Params$Resource$Organizations$Approvalrequests$Dismiss extends StandardParameters {
        /**
         * Name of the ApprovalRequest to dismiss.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DismissApprovalRequestMessage;
    }
    export interface Params$Resource$Organizations$Approvalrequests$Get extends StandardParameters {
        /**
         * Name of the approval request to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Organizations$Approvalrequests$List extends StandardParameters {
        /**
         * A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         */
        filter?: string;
        /**
         * Requested page size.
         */
        pageSize?: number;
        /**
         * A token identifying the page of results to return.
         */
        pageToken?: string;
        /**
         * The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         */
        parent?: string;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        approvalRequests: Resource$Projects$Approvalrequests;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.projects.deleteAccessApprovalSettings
         * @desc Deletes the settings associated with a project, folder, or organization. This will have the effect of disabling Access Approval for the project, folder, or organization, but only if all ancestors also have Access Approval disabled. If Access Approval is enabled at a higher level of the hierarchy, then Access Approval will still be enabled at this level as the settings are inherited.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.deleteAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to delete.
         *     name: 'projects/my-project/accessApprovalSettings',
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
         * @alias accessapproval.projects.deleteAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to delete.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        deleteAccessApprovalSettings(params: Params$Resource$Projects$Deleteaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        deleteAccessApprovalSettings(params?: Params$Resource$Projects$Deleteaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        deleteAccessApprovalSettings(params: Params$Resource$Projects$Deleteaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Projects$Deleteaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(params: Params$Resource$Projects$Deleteaccessapprovalsettings, callback: BodyResponseCallback<Schema$Empty>): void;
        deleteAccessApprovalSettings(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * accessapproval.projects.getAccessApprovalSettings
         * @desc Gets the settings associated with a project, folder, or organization.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.getAccessApprovalSettings({
         *     // Name of the AccessApprovalSettings to retrieve.
         *     name: 'projects/my-project/accessApprovalSettings',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.getAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the AccessApprovalSettings to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        getAccessApprovalSettings(params: Params$Resource$Projects$Getaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAccessApprovalSettings(params?: Params$Resource$Projects$Getaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        getAccessApprovalSettings(params: Params$Resource$Projects$Getaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAccessApprovalSettings(params: Params$Resource$Projects$Getaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(params: Params$Resource$Projects$Getaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        getAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        /**
         * accessapproval.projects.updateAccessApprovalSettings
         * @desc Updates the settings associated with a project, folder, or organization. Settings to update are determined by the value of field_mask.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.updateAccessApprovalSettings({
         *     // The resource name of the settings. Format is one of:
         *     // <ol>
         *     //   <li>"projects/{project_id}/accessApprovalSettings"</li>
         *     //   <li>"folders/{folder_id}/accessApprovalSettings"</li>
         *     //   <li>"organizations/{organization_id}/accessApprovalSettings"</li>
         *     // <ol>
         *     name: 'projects/my-project/accessApprovalSettings',
         *     // For the `FieldMask` definition, see
         *     // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
         *     // If this field is left unset, only the notification_emails field will be
         *     // updated.
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "enrolledAncestor": false,
         *       //   "enrolledServices": [],
         *       //   "name": "my_name",
         *       //   "notificationEmails": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "enrolledAncestor": false,
         *   //   "enrolledServices": [],
         *   //   "name": "my_name",
         *   //   "notificationEmails": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.updateAccessApprovalSettings
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         * @param {string=} params.updateMask For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         * @param {().AccessApprovalSettings} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        updateAccessApprovalSettings(params: Params$Resource$Projects$Updateaccessapprovalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateAccessApprovalSettings(params?: Params$Resource$Projects$Updateaccessapprovalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AccessApprovalSettings>>;
        updateAccessApprovalSettings(params: Params$Resource$Projects$Updateaccessapprovalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateAccessApprovalSettings(params: Params$Resource$Projects$Updateaccessapprovalsettings, options: MethodOptions | BodyResponseCallback<Schema$AccessApprovalSettings>, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(params: Params$Resource$Projects$Updateaccessapprovalsettings, callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
        updateAccessApprovalSettings(callback: BodyResponseCallback<Schema$AccessApprovalSettings>): void;
    }
    export interface Params$Resource$Projects$Deleteaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Getaccessapprovalsettings extends StandardParameters {
        /**
         * Name of the AccessApprovalSettings to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Updateaccessapprovalsettings extends StandardParameters {
        /**
         * The resource name of the settings. Format is one of: <ol>   <li>"projects/{project_id}/accessApprovalSettings"</li>   <li>"folders/{folder_id}/accessApprovalSettings"</li>   <li>"organizations/{organization_id}/accessApprovalSettings"</li> <ol>
         */
        name?: string;
        /**
         * For the `FieldMask` definition, see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask If this field is left unset, only the notification_emails field will be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AccessApprovalSettings;
    }
    export class Resource$Projects$Approvalrequests {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * accessapproval.projects.approvalRequests.approve
         * @desc Approves a request and returns the updated ApprovalRequest.  Returns NOT_FOUND if the request does not exist. Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.approvalRequests.approve({
         *     // Name of the approval request to approve.
         *     name: 'projects/my-project/approvalRequests/my-approvalRequest',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "expireTime": "my_expireTime"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.approvalRequests.approve
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to approve.
         * @param {().ApproveApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        approve(params: Params$Resource$Projects$Approvalrequests$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Projects$Approvalrequests$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        approve(params: Params$Resource$Projects$Approvalrequests$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Projects$Approvalrequests$Approve, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(params: Params$Resource$Projects$Approvalrequests$Approve, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        approve(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.projects.approvalRequests.dismiss
         * @desc Dismisses a request. Returns the updated ApprovalRequest.  NOTE: This does not deny access to the resource if another request has been made and approved. It is equivalent in effect to ignoring the request altogether.  Returns NOT_FOUND if the request does not exist.  Returns FAILED_PRECONDITION if the request exists but is not in a pending state.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.approvalRequests.dismiss({
         *     // Name of the ApprovalRequest to dismiss.
         *     name: 'projects/my-project/approvalRequests/my-approvalRequest',
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
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.approvalRequests.dismiss
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the ApprovalRequest to dismiss.
         * @param {().DismissApprovalRequestMessage} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        dismiss(params: Params$Resource$Projects$Approvalrequests$Dismiss, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        dismiss(params?: Params$Resource$Projects$Approvalrequests$Dismiss, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        dismiss(params: Params$Resource$Projects$Approvalrequests$Dismiss, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        dismiss(params: Params$Resource$Projects$Approvalrequests$Dismiss, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(params: Params$Resource$Projects$Approvalrequests$Dismiss, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        dismiss(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.projects.approvalRequests.get
         * @desc Gets an approval request. Returns NOT_FOUND if the request does not exist.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.approvalRequests.get({
         *     // Name of the approval request to retrieve.
         *     name: 'projects/my-project/approvalRequests/my-approvalRequest',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approve": {},
         *   //   "dismiss": {},
         *   //   "name": "my_name",
         *   //   "requestTime": "my_requestTime",
         *   //   "requestedExpiration": "my_requestedExpiration",
         *   //   "requestedLocations": {},
         *   //   "requestedReason": {},
         *   //   "requestedResourceName": "my_requestedResourceName",
         *   //   "requestedResourceProperties": {}
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.approvalRequests.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.name Name of the approval request to retrieve.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Projects$Approvalrequests$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Approvalrequests$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ApprovalRequest>>;
        get(params: Params$Resource$Projects$Approvalrequests$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Approvalrequests$Get, options: MethodOptions | BodyResponseCallback<Schema$ApprovalRequest>, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(params: Params$Resource$Projects$Approvalrequests$Get, callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        get(callback: BodyResponseCallback<Schema$ApprovalRequest>): void;
        /**
         * accessapproval.projects.approvalRequests.list
         * @desc Lists approval requests associated with a project, folder, or organization. Approval requests can be filtered by state (pending, active, dismissed). The order is reverse chronological.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/accessapproval.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const accessapproval = google.accessapproval('v1beta1');
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
         *   const res = await accessapproval.projects.approvalRequests.list({
         *     // A filter on the type of approval requests to retrieve. Must be one of the
         *     // following values:
         *     // <ol>
         *     //   <li>[not set]: Requests that are pending or have active approvals.</li>
         *     //   <li>ALL: All requests.</li>
         *     //   <li>PENDING: Only pending requests.</li>
         *     //   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>
         *     //   <li>DISMISSED: Only dismissed (including expired) requests.</li>
         *     //   <li>HISTORY: Active and dismissed (including expired) requests.</li>
         *     // </ol>
         *     filter: 'placeholder-value',
         *     // Requested page size.
         *     pageSize: 'placeholder-value',
         *     // A token identifying the page of results to return.
         *     pageToken: 'placeholder-value',
         *     // The parent resource. This may be "projects/{project_id}",
         *     // "folders/{folder_id}", or "organizations/{organization_id}".
         *     parent: 'projects/my-project',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "approvalRequests": [],
         *   //   "nextPageToken": "my_nextPageToken"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias accessapproval.projects.approvalRequests.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.filter A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         * @param {integer=} params.pageSize Requested page size.
         * @param {string=} params.pageToken A token identifying the page of results to return.
         * @param {string} params.parent The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Projects$Approvalrequests$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Approvalrequests$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListApprovalRequestsResponse>>;
        list(params: Params$Resource$Projects$Approvalrequests$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Approvalrequests$List, options: MethodOptions | BodyResponseCallback<Schema$ListApprovalRequestsResponse>, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(params: Params$Resource$Projects$Approvalrequests$List, callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListApprovalRequestsResponse>): void;
    }
    export interface Params$Resource$Projects$Approvalrequests$Approve extends StandardParameters {
        /**
         * Name of the approval request to approve.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ApproveApprovalRequestMessage;
    }
    export interface Params$Resource$Projects$Approvalrequests$Dismiss extends StandardParameters {
        /**
         * Name of the ApprovalRequest to dismiss.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DismissApprovalRequestMessage;
    }
    export interface Params$Resource$Projects$Approvalrequests$Get extends StandardParameters {
        /**
         * Name of the approval request to retrieve.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Approvalrequests$List extends StandardParameters {
        /**
         * A filter on the type of approval requests to retrieve. Must be one of the following values: <ol>   <li>[not set]: Requests that are pending or have active approvals.</li>   <li>ALL: All requests.</li>   <li>PENDING: Only pending requests.</li>   <li>ACTIVE: Only active (i.e. currently approved) requests.</li>   <li>DISMISSED: Only dismissed (including expired) requests.</li>   <li>HISTORY: Active and dismissed (including expired) requests.</li> </ol>
         */
        filter?: string;
        /**
         * Requested page size.
         */
        pageSize?: number;
        /**
         * A token identifying the page of results to return.
         */
        pageToken?: string;
        /**
         * The parent resource. This may be "projects/{project_id}", "folders/{folder_id}", or "organizations/{organization_id}".
         */
        parent?: string;
    }
    export {};
}
