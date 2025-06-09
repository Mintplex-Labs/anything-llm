import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace baremetalsolution_v1alpha1 {
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
     * Bare Metal Solution API
     *
     * Provides ways to manage Bare Metal Solution hardware installed in a regional extension located near a Google Cloud data center.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const baremetalsolution = google.baremetalsolution('v1alpha1');
     * ```
     */
    export class Baremetalsolution {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Configuration parameters for a new instance.
     */
    export interface Schema$InstanceConfig {
        /**
         * Client network address.
         */
        clientNetwork?: Schema$NetworkAddress;
        /**
         * Whether the instance should be provisioned with Hyperthreading enabled.
         */
        hyperthreading?: boolean | null;
        /**
         * A transient unique identifier to idenfity an instance within an ProvisioningConfig request.
         */
        id?: string | null;
        /**
         * Instance type.
         */
        instanceType?: string | null;
        /**
         * Location where to deploy the instance.
         */
        location?: string | null;
        /**
         * OS image to initialize the instance.
         */
        osImage?: string | null;
        /**
         * Private network address, if any.
         */
        privateNetwork?: Schema$NetworkAddress;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team (b/194021617).
         */
        userNote?: string | null;
    }
    /**
     * A resource budget.
     */
    export interface Schema$InstanceQuota {
        /**
         * Number of machines than can be created for the given location and instance_type.
         */
        availableMachineCount?: number | null;
        /**
         * Instance type.
         */
        instanceType?: string | null;
        /**
         * Location where the quota applies.
         */
        location?: string | null;
    }
    /**
     * Response for ListProvisioningQuotas.
     */
    export interface Schema$ListProvisioningQuotasResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The provisioning quotas registered in this project.
         */
        provisioningQuotas?: Schema$ProvisioningQuota[];
    }
    /**
     * A LUN range.
     */
    export interface Schema$LunRange {
        /**
         * Number of LUNs to create.
         */
        quantity?: number | null;
        /**
         * The requested size of each LUN, in GB.
         */
        sizeGb?: number | null;
    }
    /**
     * A network.
     */
    export interface Schema$NetworkAddress {
        /**
         * IP address to be assigned to the server.
         */
        address?: string | null;
        /**
         * Name of the existing network to use. Will be of the format at--vlan for pre-intake UI networks like for eg, at-123456-vlan001 or any user-defined name like for eg, my-network-name for networks provisioned using intake UI. The field is exclusively filled only in case of an already existing network. Mutually exclusive with network_id.
         */
        existingNetworkId?: string | null;
        /**
         * Name of the network to use, within the same ProvisioningConfig request. This represents a new network being provisioned in the same request. Can have any user-defined name like for eg, my-network-name. Mutually exclusive with existing_network_id.
         */
        networkId?: string | null;
    }
    /**
     * Configuration parameters for a new network.
     */
    export interface Schema$NetworkConfig {
        /**
         * Interconnect bandwidth. Set only when type is CLIENT.
         */
        bandwidth?: string | null;
        /**
         * CIDR range of the network.
         */
        cidr?: string | null;
        /**
         * A transient unique identifier to identify a volume within an ProvisioningConfig request.
         */
        id?: string | null;
        /**
         * Location where to deploy the network.
         */
        location?: string | null;
        /**
         * Service CIDR, if any.
         */
        serviceCidr?: string | null;
        /**
         * The type of this network.
         */
        type?: string | null;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team (b/194021617).
         */
        userNote?: string | null;
        /**
         * List of VLAN attachments. As of now there are always 2 attachments, but it is going to change in the future (multi vlan).
         */
        vlanAttachments?: Schema$VlanAttachment[];
    }
    /**
     * A NFS export entry.
     */
    export interface Schema$NfsExport {
        /**
         * Allow dev.
         */
        allowDev?: boolean | null;
        /**
         * Allow the setuid flag.
         */
        allowSuid?: boolean | null;
        /**
         * A CIDR range.
         */
        cidr?: string | null;
        /**
         * Either a single machine, identified by an ID, or a comma-separated list of machine IDs.
         */
        machineId?: string | null;
        /**
         * Network to use to publish the export.
         */
        networkId?: string | null;
        /**
         * Disable root squashing.
         */
        noRootSquash?: boolean | null;
        /**
         * Export permissions.
         */
        permissions?: string | null;
    }
    /**
     * An provisioning configuration.
     */
    export interface Schema$ProvisioningConfig {
        /**
         * Instances to be created.
         */
        instances?: Schema$InstanceConfig[];
        /**
         * Networks to be created.
         */
        networks?: Schema$NetworkConfig[];
        /**
         * A reference to track the request.
         */
        ticketId?: string | null;
        /**
         * Volumes to be created.
         */
        volumes?: Schema$VolumeConfig[];
    }
    /**
     * A provisioning quota for a given project.
     */
    export interface Schema$ProvisioningQuota {
        /**
         * Instance quota.
         */
        instanceQuota?: Schema$InstanceQuota;
    }
    /**
     * Request for SubmitProvisioningConfig.
     */
    export interface Schema$SubmitProvisioningConfigRequest {
        /**
         * Optional. Email provided to send a confirmation with provisioning config to.
         */
        email?: string | null;
        /**
         * Required. The ProvisioningConfig to submit.
         */
        provisioningConfig?: Schema$ProvisioningConfig;
    }
    /**
     * A GCP vlan attachment.
     */
    export interface Schema$VlanAttachment {
        /**
         * Identifier of the VLAN attachment.
         */
        id?: string | null;
        /**
         * Attachment pairing key.
         */
        pairingKey?: string | null;
    }
    /**
     * Configuration parameters for a new volume.
     */
    export interface Schema$VolumeConfig {
        /**
         * A transient unique identifier to identify a volume within an ProvisioningConfig request.
         */
        id?: string | null;
        /**
         * Location where to deploy the volume.
         */
        location?: string | null;
        /**
         * LUN ranges to be configured. Set only when protocol is PROTOCOL_FC.
         */
        lunRanges?: Schema$LunRange[];
        /**
         * Machine ids connected to this volume. Set only when protocol is PROTOCOL_FC.
         */
        machineIds?: string[] | null;
        /**
         * NFS exports. Set only when protocol is PROTOCOL_NFS.
         */
        nfsExports?: Schema$NfsExport[];
        /**
         * Volume protocol.
         */
        protocol?: string | null;
        /**
         * The requested size of this volume, in GB. This will be updated in a later iteration with a generic size field.
         */
        sizeGb?: number | null;
        /**
         * Whether snapshots should be enabled.
         */
        snapshotsEnabled?: boolean | null;
        /**
         * The type of this Volume.
         */
        type?: string | null;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team (b/194021617).
         */
        userNote?: string | null;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        provisioningQuotas: Resource$Projects$Provisioningquotas;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Submit a provisiong configuration for a given project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/baremetalsolution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const baremetalsolution = google.baremetalsolution('v1alpha1');
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
         *     await baremetalsolution.projects.locations.submitProvisioningConfig({
         *       // Required. The target location of the provisioning request.
         *       location: 'locations/my-location',
         *       // Required. The target project of the provisioning request.
         *       project: 'projects/my-project',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "email": "my_email",
         *         //   "provisioningConfig": {}
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "instances": [],
         *   //   "networks": [],
         *   //   "ticketId": "my_ticketId",
         *   //   "volumes": []
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
        submitProvisioningConfig(params: Params$Resource$Projects$Locations$Submitprovisioningconfig, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submitProvisioningConfig(params?: Params$Resource$Projects$Locations$Submitprovisioningconfig, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProvisioningConfig>>;
        submitProvisioningConfig(params: Params$Resource$Projects$Locations$Submitprovisioningconfig, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submitProvisioningConfig(params: Params$Resource$Projects$Locations$Submitprovisioningconfig, options: MethodOptions | BodyResponseCallback<Schema$ProvisioningConfig>, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        submitProvisioningConfig(params: Params$Resource$Projects$Locations$Submitprovisioningconfig, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        submitProvisioningConfig(callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
    }
    export interface Params$Resource$Projects$Locations$Submitprovisioningconfig extends StandardParameters {
        /**
         * Required. The target location of the provisioning request.
         */
        location?: string;
        /**
         * Required. The target project of the provisioning request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SubmitProvisioningConfigRequest;
    }
    export class Resource$Projects$Provisioningquotas {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * List the budget details to provision resources on a given project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/baremetalsolution.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const baremetalsolution = google.baremetalsolution('v1alpha1');
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
         *   const res = await baremetalsolution.projects.provisioningQuotas.list({
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The next_page_token value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // Required. The parent project containing the provisioning quotas.
         *     parent: 'projects/my-project',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "provisioningQuotas": []
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
        list(params: Params$Resource$Projects$Provisioningquotas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Provisioningquotas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProvisioningQuotasResponse>>;
        list(params: Params$Resource$Projects$Provisioningquotas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Provisioningquotas$List, options: MethodOptions | BodyResponseCallback<Schema$ListProvisioningQuotasResponse>, callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
        list(params: Params$Resource$Projects$Provisioningquotas$List, callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
    }
    export interface Params$Resource$Projects$Provisioningquotas$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent project containing the provisioning quotas.
         */
        parent?: string;
    }
    export {};
}
