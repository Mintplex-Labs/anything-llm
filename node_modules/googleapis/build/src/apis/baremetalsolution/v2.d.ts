import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace baremetalsolution_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
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
     * const baremetalsolution = google.baremetalsolution('v2');
     * ```
     */
    export class Baremetalsolution {
        context: APIRequestContext;
        projects: Resource$Projects;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * Represents an 'access point' for the share.
     */
    export interface Schema$AllowedClient {
        /**
         * Allow dev flag. Which controls whether to allow creation of devices.
         */
        allowDev?: boolean | null;
        /**
         * The subnet of IP addresses permitted to access the share.
         */
        allowedClientsCidr?: string | null;
        /**
         * Allow the setuid flag.
         */
        allowSuid?: boolean | null;
        /**
         * Mount permissions.
         */
        mountPermissions?: string | null;
        /**
         * The network the access point sits on.
         */
        network?: string | null;
        /**
         * Output only. The path to access NFS, in format shareIP:/InstanceID InstanceID is the generated ID instead of customer provided name. example like "10.0.0.0:/g123456789-nfs001"
         */
        nfsPath?: string | null;
        /**
         * Disable root squashing, which is a feature of NFS. Root squash is a special mapping of the remote superuser (root) identity when using identity authentication.
         */
        noRootSquash?: boolean | null;
        /**
         * Output only. The IP address of the share on this network. Assigned automatically during provisioning based on the network's services_cidr.
         */
        shareIp?: string | null;
    }
    /**
     * Message for detach specific LUN from an Instance.
     */
    export interface Schema$DetachLunRequest {
        /**
         * Required. Name of the Lun to detach.
         */
        lun?: string | null;
        /**
         * If true, performs lun unmapping without instance reboot.
         */
        skipReboot?: boolean | null;
    }
    /**
     * Message for disabling the interactive serial console on an instance.
     */
    export interface Schema$DisableInteractiveSerialConsoleRequest {
    }
    /**
     * A generic empty message that you can re-use to avoid defining duplicated empty messages in your APIs. A typical example is to use it as the request or the response type of an API method. For instance: service Foo { rpc Bar(google.protobuf.Empty) returns (google.protobuf.Empty); \}
     */
    export interface Schema$Empty {
    }
    /**
     * Message for enabling the interactive serial console on an instance.
     */
    export interface Schema$EnableInteractiveSerialConsoleRequest {
    }
    /**
     * Request for skip lun cooloff and delete it.
     */
    export interface Schema$EvictLunRequest {
    }
    /**
     * Request for skip volume cooloff and delete it.
     */
    export interface Schema$EvictVolumeRequest {
    }
    /**
     * Response with all provisioning settings.
     */
    export interface Schema$FetchInstanceProvisioningSettingsResponse {
        /**
         * The OS images available.
         */
        images?: Schema$OSImage[];
    }
    /**
     * Each logical interface represents a logical abstraction of the underlying physical interface (for eg. bond, nic) of the instance. Each logical interface can effectively map to multiple network-IP pairs and still be mapped to one underlying physical interface.
     */
    export interface Schema$GoogleCloudBaremetalsolutionV2LogicalInterface {
        /**
         * The index of the logical interface mapping to the index of the hardware bond or nic on the chosen network template. This field is deprecated.
         */
        interfaceIndex?: number | null;
        /**
         * List of logical network interfaces within a logical interface.
         */
        logicalNetworkInterfaces?: Schema$LogicalNetworkInterface[];
        /**
         * Interface name. This is of syntax or and forms part of the network template name.
         */
        name?: string | null;
    }
    /**
     * Logical interface.
     */
    export interface Schema$GoogleCloudBaremetalsolutionV2ServerNetworkTemplateLogicalInterface {
        /**
         * Interface name. This is not a globally unique identifier. Name is unique only inside the ServerNetworkTemplate. This is of syntax or and forms part of the network template name.
         */
        name?: string | null;
        /**
         * If true, interface must have network connected.
         */
        required?: boolean | null;
        /**
         * Interface type.
         */
        type?: string | null;
    }
    /**
     * A server.
     */
    export interface Schema$Instance {
        /**
         * Output only. Create a time stamp.
         */
        createTime?: string | null;
        /**
         * True if you enable hyperthreading for the server, otherwise false. The default value is false.
         */
        hyperthreadingEnabled?: boolean | null;
        /**
         * Output only. An identifier for the `Instance`, generated by the backend.
         */
        id?: string | null;
        /**
         * Output only. True if the interactive serial console feature is enabled for the instance, false otherwise. The default value is false.
         */
        interactiveSerialConsoleEnabled?: boolean | null;
        /**
         * Labels as key value pairs.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * List of logical interfaces for the instance. The number of logical interfaces will be the same as number of hardware bond/nic on the chosen network template. For the non-multivlan configurations (for eg, existing servers) that use existing default network template (bondaa-bondaa), both the Instance.networks field and the Instance.logical_interfaces fields will be filled to ensure backward compatibility. For the others, only Instance.logical_interfaces will be filled.
         */
        logicalInterfaces?: Schema$GoogleCloudBaremetalsolutionV2LogicalInterface[];
        /**
         * Output only. Text field about info for logging in.
         */
        loginInfo?: string | null;
        /**
         * Immutable. List of LUNs associated with this server.
         */
        luns?: Schema$Lun[];
        /**
         * Immutable. The server type. [Available server types](https://cloud.google.com/bare-metal/docs/bms-planning#server_configurations)
         */
        machineType?: string | null;
        /**
         * Immutable. The resource name of this `Instance`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/instances/{instance\}`
         */
        name?: string | null;
        /**
         * Output only. List of networks associated with this server.
         */
        networks?: Schema$Network[];
        /**
         * Instance network template name. For eg, bondaa-bondaa, bondab-nic, etc. Generally, the template name follows the syntax of "bond" or "nic".
         */
        networkTemplate?: string | null;
        /**
         * The OS image currently installed on the server.
         */
        osImage?: string | null;
        /**
         * Immutable. Pod name. Pod is an independent part of infrastructure. Instance can be connected to the assets (networks, volumes) allocated in the same pod only.
         */
        pod?: string | null;
        /**
         * Output only. The state of the server.
         */
        state?: string | null;
        /**
         * Output only. Update a time stamp.
         */
        updateTime?: string | null;
        /**
         * Input only. List of Volumes to attach to this Instance on creation. This field won't be populated in Get/List responses.
         */
        volumes?: Schema$Volume[];
        /**
         * The workload profile for the instance.
         */
        workloadProfile?: string | null;
    }
    /**
     * Configuration parameters for a new instance.
     */
    export interface Schema$InstanceConfig {
        /**
         * If true networks can be from different projects of the same vendor account.
         */
        accountNetworksEnabled?: boolean | null;
        /**
         * Client network address. Filled if InstanceConfig.multivlan_config is false.
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
         * Instance type. [Available types](https://cloud.google.com/bare-metal/docs/bms-planning#server_configurations)
         */
        instanceType?: string | null;
        /**
         * List of logical interfaces for the instance. The number of logical interfaces will be the same as number of hardware bond/nic on the chosen network template. Filled if InstanceConfig.multivlan_config is true.
         */
        logicalInterfaces?: Schema$GoogleCloudBaremetalsolutionV2LogicalInterface[];
        /**
         * Output only. The name of the instance config.
         */
        name?: string | null;
        /**
         * The type of network configuration on the instance.
         */
        networkConfig?: string | null;
        /**
         * Server network template name. Filled if InstanceConfig.multivlan_config is true.
         */
        networkTemplate?: string | null;
        /**
         * OS image to initialize the instance. [Available images](https://cloud.google.com/bare-metal/docs/bms-planning#server_configurations)
         */
        osImage?: string | null;
        /**
         * Private network address, if any. Filled if InstanceConfig.multivlan_config is false.
         */
        privateNetwork?: Schema$NetworkAddress;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team .
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
         * The gcp service of the provisioning quota.
         */
        gcpService?: string | null;
        /**
         * Instance type. Deprecated: use gcp_service.
         */
        instanceType?: string | null;
        /**
         * Location where the quota applies.
         */
        location?: string | null;
        /**
         * Output only. The name of the instance quota.
         */
        name?: string | null;
    }
    /**
     * A GCP vlan attachment.
     */
    export interface Schema$IntakeVlanAttachment {
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
     * Response message for the list of servers.
     */
    export interface Schema$ListInstancesResponse {
        /**
         * The list of servers.
         */
        instances?: Schema$Instance[];
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * The response message for Locations.ListLocations.
     */
    export interface Schema$ListLocationsResponse {
        /**
         * A list of locations that matches the specified filter in the request.
         */
        locations?: Schema$Location[];
        /**
         * The standard List next-page token.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message containing the list of storage volume luns.
     */
    export interface Schema$ListLunsResponse {
        /**
         * The list of luns.
         */
        luns?: Schema$Lun[];
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message containing the list of networks.
     */
    export interface Schema$ListNetworksResponse {
        /**
         * The list of networks.
         */
        networks?: Schema$Network[];
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response with Networks with IPs
     */
    export interface Schema$ListNetworkUsageResponse {
        /**
         * Networks with IPs.
         */
        networks?: Schema$NetworkUsage[];
    }
    /**
     * Response message containing the list of NFS shares.
     */
    export interface Schema$ListNfsSharesResponse {
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * The list of NFS shares.
         */
        nfsShares?: Schema$NfsShare[];
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
    }
    /**
     * Response message for the list of provisioning quotas.
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
     * Message for response of ListSSHKeys.
     */
    export interface Schema$ListSSHKeysResponse {
        /**
         * Token to retrieve the next page of results, or empty if there are no more results in the list.
         */
        nextPageToken?: string | null;
        /**
         * The SSH keys registered in the project.
         */
        sshKeys?: Schema$SSHKey[];
    }
    /**
     * Response message containing the list of volume snapshots.
     */
    export interface Schema$ListVolumeSnapshotsResponse {
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
        /**
         * The list of snapshots.
         */
        volumeSnapshots?: Schema$VolumeSnapshot[];
    }
    /**
     * Response message containing the list of storage volumes.
     */
    export interface Schema$ListVolumesResponse {
        /**
         * A token identifying a page of results from the server.
         */
        nextPageToken?: string | null;
        /**
         * Locations that could not be reached.
         */
        unreachable?: string[] | null;
        /**
         * The list of storage volumes.
         */
        volumes?: Schema$Volume[];
    }
    /**
     * A resource that represents Google Cloud Platform location.
     */
    export interface Schema$Location {
        /**
         * The friendly name for this location, typically a nearby city name. For example, "Tokyo".
         */
        displayName?: string | null;
        /**
         * Cross-service attributes for the location. For example {"cloud.googleapis.com/region": "us-east1"\}
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The canonical id for this location. For example: `"us-east1"`.
         */
        locationId?: string | null;
        /**
         * Service-specific metadata. For example the available capacity at the given location.
         */
        metadata?: {
            [key: string]: any;
        } | null;
        /**
         * Resource name for the location, which may vary between implementations. For example: `"projects/example-project/locations/us-east1"`
         */
        name?: string | null;
    }
    /**
     * Each logical network interface is effectively a network and IP pair.
     */
    export interface Schema$LogicalNetworkInterface {
        /**
         * Whether this interface is the default gateway for the instance. Only one interface can be the default gateway for the instance.
         */
        defaultGateway?: boolean | null;
        /**
         * An identifier for the `Network`, generated by the backend.
         */
        id?: string | null;
        /**
         * IP address in the network
         */
        ipAddress?: string | null;
        /**
         * Name of the network
         */
        network?: string | null;
        /**
         * Type of network.
         */
        networkType?: string | null;
    }
    /**
     * A storage volume logical unit number (LUN).
     */
    export interface Schema$Lun {
        /**
         * Display if this LUN is a boot LUN.
         */
        bootLun?: boolean | null;
        /**
         * Output only. Time after which LUN will be fully deleted. It is filled only for LUNs in COOL_OFF state.
         */
        expireTime?: string | null;
        /**
         * An identifier for the LUN, generated by the backend.
         */
        id?: string | null;
        /**
         * The LUN multiprotocol type ensures the characteristics of the LUN are optimized for each operating system.
         */
        multiprotocolType?: string | null;
        /**
         * Output only. The name of the LUN.
         */
        name?: string | null;
        /**
         * Display if this LUN can be shared between multiple physical servers.
         */
        shareable?: boolean | null;
        /**
         * The size of this LUN, in gigabytes.
         */
        sizeGb?: string | null;
        /**
         * The state of this storage volume.
         */
        state?: string | null;
        /**
         * The storage type for this LUN.
         */
        storageType?: string | null;
        /**
         * Display the storage volume for this LUN.
         */
        storageVolume?: string | null;
        /**
         * The WWID for this LUN.
         */
        wwid?: string | null;
    }
    /**
     * A LUN(Logical Unit Number) range.
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
     * A Network.
     */
    export interface Schema$Network {
        /**
         * The cidr of the Network.
         */
        cidr?: string | null;
        /**
         * Output only. Gateway ip address.
         */
        gatewayIp?: string | null;
        /**
         * An identifier for the `Network`, generated by the backend.
         */
        id?: string | null;
        /**
         * IP address configured.
         */
        ipAddress?: string | null;
        /**
         * Whether network uses standard frames or jumbo ones.
         */
        jumboFramesEnabled?: boolean | null;
        /**
         * Labels as key value pairs.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * List of physical interfaces.
         */
        macAddress?: string[] | null;
        /**
         * Input only. List of mount points to attach the network to.
         */
        mountPoints?: Schema$NetworkMountPoint[];
        /**
         * Output only. The resource name of this `Network`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/networks/{network\}`
         */
        name?: string | null;
        /**
         * Output only. Pod name.
         */
        pod?: string | null;
        /**
         * List of IP address reservations in this network. When updating this field, an error will be generated if a reservation conflicts with an IP address already allocated to a physical server.
         */
        reservations?: Schema$NetworkAddressReservation[];
        /**
         * IP range for reserved for services (e.g. NFS).
         */
        servicesCidr?: string | null;
        /**
         * The Network state.
         */
        state?: string | null;
        /**
         * The type of this network.
         */
        type?: string | null;
        /**
         * The vlan id of the Network.
         */
        vlanId?: string | null;
        /**
         * The vrf for the Network.
         */
        vrf?: Schema$VRF;
    }
    /**
     * A network.
     */
    export interface Schema$NetworkAddress {
        /**
         * IPv4 address to be assigned to the server.
         */
        address?: string | null;
        /**
         * Name of the existing network to use.
         */
        existingNetworkId?: string | null;
        /**
         * Id of the network to use, within the same ProvisioningConfig request.
         */
        networkId?: string | null;
    }
    /**
     * A reservation of one or more addresses in a network.
     */
    export interface Schema$NetworkAddressReservation {
        /**
         * The last address of this reservation block, inclusive. I.e., for cases when reservations are only single addresses, end_address and start_address will be the same. Must be specified as a single IPv4 address, e.g. 10.1.2.2.
         */
        endAddress?: string | null;
        /**
         * A note about this reservation, intended for human consumption.
         */
        note?: string | null;
        /**
         * The first address of this reservation block. Must be specified as a single IPv4 address, e.g. 10.1.2.2.
         */
        startAddress?: string | null;
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
         * The GCP service of the network. Available gcp_service are in https://cloud.google.com/bare-metal/docs/bms-planning.
         */
        gcpService?: string | null;
        /**
         * A transient unique identifier to identify a volume within an ProvisioningConfig request.
         */
        id?: string | null;
        /**
         * The JumboFramesEnabled option for customer to set.
         */
        jumboFramesEnabled?: boolean | null;
        /**
         * Output only. The name of the network config.
         */
        name?: string | null;
        /**
         * Service CIDR, if any.
         */
        serviceCidr?: string | null;
        /**
         * The type of this network, either Client or Private.
         */
        type?: string | null;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team .
         */
        userNote?: string | null;
        /**
         * List of VLAN attachments. As of now there are always 2 attachments, but it is going to change in the future (multi vlan).
         */
        vlanAttachments?: Schema$IntakeVlanAttachment[];
        /**
         * Whether the VLAN attachment pair is located in the same project.
         */
        vlanSameProject?: boolean | null;
    }
    /**
     * Mount point for a network.
     */
    export interface Schema$NetworkMountPoint {
        /**
         * Network should be a default gateway.
         */
        defaultGateway?: boolean | null;
        /**
         * Instance to attach network to.
         */
        instance?: string | null;
        /**
         * Ip address of the server.
         */
        ipAddress?: string | null;
        /**
         * Logical interface to detach from.
         */
        logicalInterface?: string | null;
    }
    /**
     * Network with all used IP addresses.
     */
    export interface Schema$NetworkUsage {
        /**
         * Network.
         */
        network?: Schema$Network;
        /**
         * All used IP addresses in this network.
         */
        usedIps?: string[] | null;
    }
    /**
     * A NFS export entry.
     */
    export interface Schema$NfsExport {
        /**
         * Allow dev flag in NfsShare AllowedClientsRequest.
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
         * Disable root squashing, which is a feature of NFS. Root squash is a special mapping of the remote superuser (root) identity when using identity authentication.
         */
        noRootSquash?: boolean | null;
        /**
         * Export permissions.
         */
        permissions?: string | null;
    }
    /**
     * An NFS share.
     */
    export interface Schema$NfsShare {
        /**
         * List of allowed access points.
         */
        allowedClients?: Schema$AllowedClient[];
        /**
         * Output only. An identifier for the NFS share, generated by the backend. This is the same value as nfs_share_id and will replace it in the future.
         */
        id?: string | null;
        /**
         * Labels as key value pairs.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Immutable. The name of the NFS share.
         */
        name?: string | null;
        /**
         * Output only. An identifier for the NFS share, generated by the backend. This field will be deprecated in the future, use `id` instead.
         */
        nfsShareId?: string | null;
        /**
         * The requested size, in GiB.
         */
        requestedSizeGib?: string | null;
        /**
         * Output only. The state of the NFS share.
         */
        state?: string | null;
        /**
         * Immutable. The storage type of the underlying volume.
         */
        storageType?: string | null;
        /**
         * Output only. The underlying volume of the share. Created automatically during provisioning.
         */
        volume?: string | null;
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
         * The server-assigned name, which is only unique within the same service that originally returns it. If you use the default HTTP mapping, the `name` should be a resource name ending with `operations/{unique_id\}`.
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
     * Operation System image.
     */
    export interface Schema$OSImage {
        /**
         * Instance types this image is applicable to. [Available types](https://cloud.google.com/bare-metal/docs/bms-planning#server_configurations)
         */
        applicableInstanceTypes?: string[] | null;
        /**
         * OS Image code.
         */
        code?: string | null;
        /**
         * OS Image description.
         */
        description?: string | null;
        /**
         * Output only. OS Image's unique name.
         */
        name?: string | null;
        /**
         * Network templates that can be used with this OS Image.
         */
        supportedNetworkTemplates?: Schema$ServerNetworkTemplate[];
    }
    /**
     * A provisioning configuration.
     */
    export interface Schema$ProvisioningConfig {
        /**
         * Output only. URI to Cloud Console UI view of this provisioning config.
         */
        cloudConsoleUri?: string | null;
        /**
         * Optional. The user-defined identifier of the provisioning config.
         */
        customId?: string | null;
        /**
         * Email provided to send a confirmation with provisioning config to. Deprecated in favour of email field in request messages.
         */
        email?: string | null;
        /**
         * A service account to enable customers to access instance credentials upon handover.
         */
        handoverServiceAccount?: string | null;
        /**
         * Instances to be created.
         */
        instances?: Schema$InstanceConfig[];
        /**
         * Optional. Location name of this ProvisioningConfig. It is optional only for Intake UI transition period.
         */
        location?: string | null;
        /**
         * Output only. The system-generated name of the provisioning config. This follows the UUID format.
         */
        name?: string | null;
        /**
         * Networks to be created.
         */
        networks?: Schema$NetworkConfig[];
        /**
         * Output only. State of ProvisioningConfig.
         */
        state?: string | null;
        /**
         * Optional status messages associated with the FAILED state.
         */
        statusMessage?: string | null;
        /**
         * A generated ticket id to track provisioning request.
         */
        ticketId?: string | null;
        /**
         * Output only. Last update timestamp.
         */
        updateTime?: string | null;
        /**
         * Volumes to be created.
         */
        volumes?: Schema$VolumeConfig[];
        /**
         * If true, VPC SC is enabled for the cluster.
         */
        vpcScEnabled?: boolean | null;
    }
    /**
     * A provisioning quota for a given project.
     */
    export interface Schema$ProvisioningQuota {
        /**
         * The asset type of this provisioning quota.
         */
        assetType?: string | null;
        /**
         * The available count of the provisioning quota.
         */
        availableCount?: number | null;
        /**
         * The gcp service of the provisioning quota.
         */
        gcpService?: string | null;
        /**
         * Instance quota.
         */
        instanceQuota?: Schema$InstanceQuota;
        /**
         * The specific location of the provisioining quota.
         */
        location?: string | null;
        /**
         * Output only. The name of the provisioning quota.
         */
        name?: string | null;
        /**
         * Network bandwidth, Gbps
         */
        networkBandwidth?: string | null;
        /**
         * Server count.
         */
        serverCount?: string | null;
        /**
         * Storage size (GB).
         */
        storageGib?: string | null;
    }
    /**
     * QOS policy parameters.
     */
    export interface Schema$QosPolicy {
        /**
         * The bandwidth permitted by the QOS policy, in gbps.
         */
        bandwidthGbps?: number | null;
    }
    /**
     * Message requesting rename of a server.
     */
    export interface Schema$RenameInstanceRequest {
        /**
         * Required. The new `name` of the instance. Format: {instancename\}
         */
        newName?: string | null;
    }
    /**
     * Message requesting to reset a server.
     */
    export interface Schema$ResetInstanceRequest {
    }
    /**
     * Request for emergency resize Volume.
     */
    export interface Schema$ResizeVolumeRequest {
        /**
         * New Volume size, in GiB.
         */
        sizeGib?: string | null;
    }
    /**
     * Message for restoring a volume snapshot.
     */
    export interface Schema$RestoreVolumeSnapshotRequest {
    }
    /**
     * Network template.
     */
    export interface Schema$ServerNetworkTemplate {
        /**
         * Instance types this template is applicable to.
         */
        applicableInstanceTypes?: string[] | null;
        /**
         * Logical interfaces.
         */
        logicalInterfaces?: Schema$GoogleCloudBaremetalsolutionV2ServerNetworkTemplateLogicalInterface[];
        /**
         * Output only. Template's unique name. The full resource name follows the pattern: `projects/{project\}/locations/{location\}/serverNetworkTemplate/{server_network_template\}` Generally, the {server_network_template\} follows the syntax of "bond" or "nic".
         */
        name?: string | null;
    }
    /**
     * Details about snapshot space reservation and usage on the storage volume.
     */
    export interface Schema$SnapshotReservationDetail {
        /**
         * The space on this storage volume reserved for snapshots, shown in GiB.
         */
        reservedSpaceGib?: string | null;
        /**
         * Percent of the total Volume size reserved for snapshot copies. Enabling snapshots requires reserving 20% or more of the storage volume space for snapshots. Maximum reserved space for snapshots is 40%. Setting this field will effectively set snapshot_enabled to true.
         */
        reservedSpacePercent?: number | null;
        /**
         * The amount, in GiB, of available space in this storage volume's reserved snapshot space.
         */
        reservedSpaceRemainingGib?: string | null;
        /**
         * The percent of snapshot space on this storage volume actually being used by the snapshot copies. This value might be higher than 100% if the snapshot copies have overflowed into the data portion of the storage volume.
         */
        reservedSpaceUsedPercent?: number | null;
    }
    /**
     * An SSH key, used for authorizing with the interactive serial console feature.
     */
    export interface Schema$SSHKey {
        /**
         * Output only. The name of this SSH key. Currently, the only valid value for the location is "global".
         */
        name?: string | null;
        /**
         * The public SSH key. This must be in OpenSSH .authorized_keys format.
         */
        publicKey?: string | null;
    }
    /**
     * Message requesting to start a server.
     */
    export interface Schema$StartInstanceRequest {
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
     * Message requesting to stop a server.
     */
    export interface Schema$StopInstanceRequest {
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
         * Required. The ProvisioningConfig to create.
         */
        provisioningConfig?: Schema$ProvisioningConfig;
    }
    /**
     * Response for SubmitProvisioningConfig.
     */
    export interface Schema$SubmitProvisioningConfigResponse {
        /**
         * The submitted provisioning config.
         */
        provisioningConfig?: Schema$ProvisioningConfig;
    }
    /**
     * VLAN attachment details.
     */
    export interface Schema$VlanAttachment {
        /**
         * Immutable. The identifier of the attachment within vrf.
         */
        id?: string | null;
        /**
         * Input only. Pairing key.
         */
        pairingKey?: string | null;
        /**
         * The peer IP of the attachment.
         */
        peerIp?: string | null;
        /**
         * The peer vlan ID of the attachment.
         */
        peerVlanId?: string | null;
        /**
         * The QOS policy applied to this VLAN attachment. This value should be preferred to using qos at vrf level.
         */
        qosPolicy?: Schema$QosPolicy;
        /**
         * The router IP of the attachment.
         */
        routerIp?: string | null;
    }
    /**
     * A storage volume.
     */
    export interface Schema$Volume {
        /**
         * The size, in GiB, that this storage volume has expanded as a result of an auto grow policy. In the absence of auto-grow, the value is 0.
         */
        autoGrownSizeGib?: string | null;
        /**
         * Output only. Whether this volume is a boot volume. A boot volume is one which contains a boot LUN.
         */
        bootVolume?: boolean | null;
        /**
         * The current size of this storage volume, in GiB, including space reserved for snapshots. This size might be different than the requested size if the storage volume has been configured with auto grow or auto shrink.
         */
        currentSizeGib?: string | null;
        /**
         * Additional emergency size that was requested for this Volume, in GiB. current_size_gib includes this value.
         */
        emergencySizeGib?: string | null;
        /**
         * Output only. Time after which volume will be fully deleted. It is filled only for volumes in COOLOFF state.
         */
        expireTime?: string | null;
        /**
         * An identifier for the `Volume`, generated by the backend.
         */
        id?: string | null;
        /**
         * Labels as key value pairs.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Maximum size volume can be expanded to in case of evergency, in GiB.
         */
        maxSizeGib?: string | null;
        /**
         * Output only. The resource name of this `Volume`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/volumes/{volume\}`
         */
        name?: string | null;
        /**
         * Input only. User-specified notes for new Volume. Used to provision Volumes that require manual intervention.
         */
        notes?: string | null;
        /**
         * Originally requested size, in GiB.
         */
        originallyRequestedSizeGib?: string | null;
        /**
         * Immutable. Performance tier of the Volume. Default is SHARED.
         */
        performanceTier?: string | null;
        /**
         * Immutable. Pod name.
         */
        pod?: string | null;
        /**
         * Output only. Storage protocol for the Volume.
         */
        protocol?: string | null;
        /**
         * The space remaining in the storage volume for new LUNs, in GiB, excluding space reserved for snapshots.
         */
        remainingSpaceGib?: string | null;
        /**
         * The requested size of this storage volume, in GiB.
         */
        requestedSizeGib?: string | null;
        /**
         * The behavior to use when snapshot reserved space is full.
         */
        snapshotAutoDeleteBehavior?: string | null;
        /**
         * Whether snapshots are enabled.
         */
        snapshotEnabled?: boolean | null;
        /**
         * Details about snapshot space reservation and usage on the storage volume.
         */
        snapshotReservationDetail?: Schema$SnapshotReservationDetail;
        /**
         * The name of the snapshot schedule policy in use for this volume, if any.
         */
        snapshotSchedulePolicy?: string | null;
        /**
         * The state of this storage volume.
         */
        state?: string | null;
        /**
         * Input only. Name of the storage aggregate pool to allocate the volume in. Can be used only for VOLUME_PERFORMANCE_TIER_ASSIGNED volumes.
         */
        storageAggregatePool?: string | null;
        /**
         * The storage type for this volume.
         */
        storageType?: string | null;
        /**
         * The workload profile for the volume.
         */
        workloadProfile?: string | null;
    }
    /**
     * Configuration parameters for a new volume.
     */
    export interface Schema$VolumeConfig {
        /**
         * The GCP service of the storage volume. Available gcp_service are in https://cloud.google.com/bare-metal/docs/bms-planning.
         */
        gcpService?: string | null;
        /**
         * A transient unique identifier to identify a volume within an ProvisioningConfig request.
         */
        id?: string | null;
        /**
         * LUN ranges to be configured. Set only when protocol is PROTOCOL_FC.
         */
        lunRanges?: Schema$LunRange[];
        /**
         * Machine ids connected to this volume. Set only when protocol is PROTOCOL_FC.
         */
        machineIds?: string[] | null;
        /**
         * Output only. The name of the volume config.
         */
        name?: string | null;
        /**
         * NFS exports. Set only when protocol is PROTOCOL_NFS.
         */
        nfsExports?: Schema$NfsExport[];
        /**
         * Performance tier of the Volume. Default is SHARED.
         */
        performanceTier?: string | null;
        /**
         * Volume protocol.
         */
        protocol?: string | null;
        /**
         * The requested size of this volume, in GB.
         */
        sizeGb?: number | null;
        /**
         * Whether snapshots should be enabled.
         */
        snapshotsEnabled?: boolean | null;
        /**
         * Input only. Name of the storage aggregate pool to allocate the volume in. Can be used only for VOLUME_PERFORMANCE_TIER_ASSIGNED volumes.
         */
        storageAggregatePool?: string | null;
        /**
         * The type of this Volume.
         */
        type?: string | null;
        /**
         * User note field, it can be used by customers to add additional information for the BMS Ops team .
         */
        userNote?: string | null;
    }
    /**
     * A snapshot of a volume. Only boot volumes can have snapshots.
     */
    export interface Schema$VolumeSnapshot {
        /**
         * Output only. The creation time of the snapshot.
         */
        createTime?: string | null;
        /**
         * The description of the snapshot.
         */
        description?: string | null;
        /**
         * Output only. An identifier for the snapshot, generated by the backend.
         */
        id?: string | null;
        /**
         * The name of the snapshot.
         */
        name?: string | null;
        /**
         * Output only. The name of the volume which this snapshot belongs to.
         */
        storageVolume?: string | null;
        /**
         * Output only. The type of the snapshot which indicates whether it was scheduled or manual/ad-hoc.
         */
        type?: string | null;
    }
    /**
     * A network VRF.
     */
    export interface Schema$VRF {
        /**
         * The name of the VRF.
         */
        name?: string | null;
        /**
         * The QOS policy applied to this VRF. The value is only meaningful when all the vlan attachments have the same QoS. This field should not be used for new integrations, use vlan attachment level qos instead. The field is left for backward-compatibility.
         */
        qosPolicy?: Schema$QosPolicy;
        /**
         * The possible state of VRF.
         */
        state?: string | null;
        /**
         * The list of VLAN attachments for the VRF.
         */
        vlanAttachments?: Schema$VlanAttachment[];
    }
    export class Resource$Projects {
        context: APIRequestContext;
        locations: Resource$Projects$Locations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Projects$Locations {
        context: APIRequestContext;
        instanceProvisioningSettings: Resource$Projects$Locations$Instanceprovisioningsettings;
        instances: Resource$Projects$Locations$Instances;
        networks: Resource$Projects$Locations$Networks;
        nfsShares: Resource$Projects$Locations$Nfsshares;
        operations: Resource$Projects$Locations$Operations;
        provisioningConfigs: Resource$Projects$Locations$Provisioningconfigs;
        provisioningQuotas: Resource$Projects$Locations$Provisioningquotas;
        sshKeys: Resource$Projects$Locations$Sshkeys;
        volumes: Resource$Projects$Locations$Volumes;
        constructor(context: APIRequestContext);
        /**
         * Gets information about a location.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.get({
         *     // Resource name for the location.
         *     name: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "displayName": "my_displayName",
         *   //   "labels": {},
         *   //   "locationId": "my_locationId",
         *   //   "metadata": {},
         *   //   "name": "my_name"
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
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Location>>;
        get(params: Params$Resource$Projects$Locations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Get, options: MethodOptions | BodyResponseCallback<Schema$Location>, callback: BodyResponseCallback<Schema$Location>): void;
        get(params: Params$Resource$Projects$Locations$Get, callback: BodyResponseCallback<Schema$Location>): void;
        get(callback: BodyResponseCallback<Schema$Location>): void;
        /**
         * Lists information about the supported locations for this service.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.list({
         *     // A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         *     filter: 'placeholder-value',
         *     // The resource that owns the locations collection, if applicable.
         *     name: 'projects/my-project',
         *     // The maximum number of results to return. If not set, the service selects a default.
         *     pageSize: 'placeholder-value',
         *     // A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         *     pageToken: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "locations": [],
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
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLocationsResponse>>;
        list(params: Params$Resource$Projects$Locations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$List, options: MethodOptions | BodyResponseCallback<Schema$ListLocationsResponse>, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(params: Params$Resource$Projects$Locations$List, callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLocationsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Get extends StandardParameters {
        /**
         * Resource name for the location.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$List extends StandardParameters {
        /**
         * A filter to narrow down results to a preferred subset. The filtering language accepts strings like `"displayName=tokyo"`, and is documented in more detail in [AIP-160](https://google.aip.dev/160).
         */
        filter?: string;
        /**
         * The resource that owns the locations collection, if applicable.
         */
        name?: string;
        /**
         * The maximum number of results to return. If not set, the service selects a default.
         */
        pageSize?: number;
        /**
         * A page token received from the `next_page_token` field in the response. Send that page token to receive the subsequent page.
         */
        pageToken?: string;
    }
    export class Resource$Projects$Locations$Instanceprovisioningsettings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get instance provisioning settings for a given project. This is hidden method used by UI only.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.instanceProvisioningSettings.fetch(
         *       {
         *         // Required. The parent project and location containing the ProvisioningSettings.
         *         location: 'projects/my-project/locations/my-location',
         *       }
         *     );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "images": []
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
        fetch(params: Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        fetch(params?: Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$FetchInstanceProvisioningSettingsResponse>>;
        fetch(params: Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        fetch(params: Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch, options: MethodOptions | BodyResponseCallback<Schema$FetchInstanceProvisioningSettingsResponse>, callback: BodyResponseCallback<Schema$FetchInstanceProvisioningSettingsResponse>): void;
        fetch(params: Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch, callback: BodyResponseCallback<Schema$FetchInstanceProvisioningSettingsResponse>): void;
        fetch(callback: BodyResponseCallback<Schema$FetchInstanceProvisioningSettingsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Instanceprovisioningsettings$Fetch extends StandardParameters {
        /**
         * Required. The parent project and location containing the ProvisioningSettings.
         */
        location?: string;
    }
    export class Resource$Projects$Locations$Instances {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an Instance.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.create({
         *     // Required. The parent project and location.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "hyperthreadingEnabled": false,
         *       //   "id": "my_id",
         *       //   "interactiveSerialConsoleEnabled": false,
         *       //   "labels": {},
         *       //   "logicalInterfaces": [],
         *       //   "loginInfo": "my_loginInfo",
         *       //   "luns": [],
         *       //   "machineType": "my_machineType",
         *       //   "name": "my_name",
         *       //   "networkTemplate": "my_networkTemplate",
         *       //   "networks": [],
         *       //   "osImage": "my_osImage",
         *       //   "pod": "my_pod",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "volumes": [],
         *       //   "workloadProfile": "my_workloadProfile"
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
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Instances$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Instances$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Detach LUN from Instance.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.detachLun({
         *     // Required. Name of the instance.
         *     instance: 'projects/my-project/locations/my-location/instances/my-instance',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "lun": "my_lun",
         *       //   "skipReboot": false
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
        detachLun(params: Params$Resource$Projects$Locations$Instances$Detachlun, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        detachLun(params?: Params$Resource$Projects$Locations$Instances$Detachlun, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        detachLun(params: Params$Resource$Projects$Locations$Instances$Detachlun, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        detachLun(params: Params$Resource$Projects$Locations$Instances$Detachlun, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        detachLun(params: Params$Resource$Projects$Locations$Instances$Detachlun, callback: BodyResponseCallback<Schema$Operation>): void;
        detachLun(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Disable the interactive serial console feature on an instance.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.instances.disableInteractiveSerialConsole(
         *       {
         *         // Required. Name of the resource.
         *         name: 'projects/my-project/locations/my-location/instances/my-instance',
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
        disableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        disableInteractiveSerialConsole(params?: Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        disableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        disableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        disableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole, callback: BodyResponseCallback<Schema$Operation>): void;
        disableInteractiveSerialConsole(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Enable the interactive serial console feature on an instance.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.instances.enableInteractiveSerialConsole(
         *       {
         *         // Required. Name of the resource.
         *         name: 'projects/my-project/locations/my-location/instances/my-instance',
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
        enableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enableInteractiveSerialConsole(params?: Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        enableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        enableInteractiveSerialConsole(params: Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole, callback: BodyResponseCallback<Schema$Operation>): void;
        enableInteractiveSerialConsole(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get details about a single server.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.get({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "hyperthreadingEnabled": false,
         *   //   "id": "my_id",
         *   //   "interactiveSerialConsoleEnabled": false,
         *   //   "labels": {},
         *   //   "logicalInterfaces": [],
         *   //   "loginInfo": "my_loginInfo",
         *   //   "luns": [],
         *   //   "machineType": "my_machineType",
         *   //   "name": "my_name",
         *   //   "networkTemplate": "my_networkTemplate",
         *   //   "networks": [],
         *   //   "osImage": "my_osImage",
         *   //   "pod": "my_pod",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "volumes": [],
         *   //   "workloadProfile": "my_workloadProfile"
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
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Instances$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Instance>>;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, options: MethodOptions | BodyResponseCallback<Schema$Instance>, callback: BodyResponseCallback<Schema$Instance>): void;
        get(params: Params$Resource$Projects$Locations$Instances$Get, callback: BodyResponseCallback<Schema$Instance>): void;
        get(callback: BodyResponseCallback<Schema$Instance>): void;
        /**
         * List servers in a given project and location.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.list({
         *     // List filter.
         *     filter: 'placeholder-value',
         *     // Requested page size. Server may return fewer items than requested. If unspecified, the server will pick an appropriate default.
         *     pageSize: 'placeholder-value',
         *     // A token identifying a page of results from the server.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent value for ListInstancesRequest.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "instances": [],
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
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Instances$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInstancesResponse>>;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, options: MethodOptions | BodyResponseCallback<Schema$ListInstancesResponse>, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Instances$List, callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInstancesResponse>): void;
        /**
         * Update details of a single server.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.patch({
         *     // Immutable. The resource name of this `Instance`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/instances/{instance\}`
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
         *     // The list of fields to update. The currently supported fields are: `labels` `hyperthreading_enabled` `os_image`
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "createTime": "my_createTime",
         *       //   "hyperthreadingEnabled": false,
         *       //   "id": "my_id",
         *       //   "interactiveSerialConsoleEnabled": false,
         *       //   "labels": {},
         *       //   "logicalInterfaces": [],
         *       //   "loginInfo": "my_loginInfo",
         *       //   "luns": [],
         *       //   "machineType": "my_machineType",
         *       //   "name": "my_name",
         *       //   "networkTemplate": "my_networkTemplate",
         *       //   "networks": [],
         *       //   "osImage": "my_osImage",
         *       //   "pod": "my_pod",
         *       //   "state": "my_state",
         *       //   "updateTime": "my_updateTime",
         *       //   "volumes": [],
         *       //   "workloadProfile": "my_workloadProfile"
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
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Instances$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Instances$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * RenameInstance sets a new name for an instance.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.rename({
         *     // Required. The `name` field is used to identify the instance. Format: projects/{project\}/locations/{location\}/instances/{instance\}
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "newName": "my_newName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "hyperthreadingEnabled": false,
         *   //   "id": "my_id",
         *   //   "interactiveSerialConsoleEnabled": false,
         *   //   "labels": {},
         *   //   "logicalInterfaces": [],
         *   //   "loginInfo": "my_loginInfo",
         *   //   "luns": [],
         *   //   "machineType": "my_machineType",
         *   //   "name": "my_name",
         *   //   "networkTemplate": "my_networkTemplate",
         *   //   "networks": [],
         *   //   "osImage": "my_osImage",
         *   //   "pod": "my_pod",
         *   //   "state": "my_state",
         *   //   "updateTime": "my_updateTime",
         *   //   "volumes": [],
         *   //   "workloadProfile": "my_workloadProfile"
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
        rename(params: Params$Resource$Projects$Locations$Instances$Rename, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        rename(params?: Params$Resource$Projects$Locations$Instances$Rename, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Instance>>;
        rename(params: Params$Resource$Projects$Locations$Instances$Rename, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        rename(params: Params$Resource$Projects$Locations$Instances$Rename, options: MethodOptions | BodyResponseCallback<Schema$Instance>, callback: BodyResponseCallback<Schema$Instance>): void;
        rename(params: Params$Resource$Projects$Locations$Instances$Rename, callback: BodyResponseCallback<Schema$Instance>): void;
        rename(callback: BodyResponseCallback<Schema$Instance>): void;
        /**
         * Perform an ungraceful, hard reset on a server. Equivalent to shutting the power off and then turning it back on.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.reset({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
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
        reset(params: Params$Resource$Projects$Locations$Instances$Reset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        reset(params?: Params$Resource$Projects$Locations$Instances$Reset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        reset(params: Params$Resource$Projects$Locations$Instances$Reset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        reset(params: Params$Resource$Projects$Locations$Instances$Reset, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        reset(params: Params$Resource$Projects$Locations$Instances$Reset, callback: BodyResponseCallback<Schema$Operation>): void;
        reset(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Starts a server that was shutdown.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.start({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
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
        start(params: Params$Resource$Projects$Locations$Instances$Start, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        start(params?: Params$Resource$Projects$Locations$Instances$Start, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        start(params: Params$Resource$Projects$Locations$Instances$Start, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        start(params: Params$Resource$Projects$Locations$Instances$Start, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        start(params: Params$Resource$Projects$Locations$Instances$Start, callback: BodyResponseCallback<Schema$Operation>): void;
        start(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Stop a running server.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.instances.stop({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/instances/my-instance',
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
        stop(params: Params$Resource$Projects$Locations$Instances$Stop, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        stop(params?: Params$Resource$Projects$Locations$Instances$Stop, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        stop(params: Params$Resource$Projects$Locations$Instances$Stop, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        stop(params: Params$Resource$Projects$Locations$Instances$Stop, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        stop(params: Params$Resource$Projects$Locations$Instances$Stop, callback: BodyResponseCallback<Schema$Operation>): void;
        stop(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Instances$Create extends StandardParameters {
        /**
         * Required. The parent project and location.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Detachlun extends StandardParameters {
        /**
         * Required. Name of the instance.
         */
        instance?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DetachLunRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Disableinteractiveserialconsole extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DisableInteractiveSerialConsoleRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Enableinteractiveserialconsole extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnableInteractiveSerialConsoleRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Get extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$List extends StandardParameters {
        /**
         * List filter.
         */
        filter?: string;
        /**
         * Requested page size. Server may return fewer items than requested. If unspecified, the server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListInstancesRequest.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Instances$Patch extends StandardParameters {
        /**
         * Immutable. The resource name of this `Instance`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/instances/{instance\}`
         */
        name?: string;
        /**
         * The list of fields to update. The currently supported fields are: `labels` `hyperthreading_enabled` `os_image`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Instance;
    }
    export interface Params$Resource$Projects$Locations$Instances$Rename extends StandardParameters {
        /**
         * Required. The `name` field is used to identify the instance. Format: projects/{project\}/locations/{location\}/instances/{instance\}
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RenameInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Reset extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResetInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Start extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StartInstanceRequest;
    }
    export interface Params$Resource$Projects$Locations$Instances$Stop extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StopInstanceRequest;
    }
    export class Resource$Projects$Locations$Networks {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get details of a single network.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.networks.get({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/networks/my-network',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cidr": "my_cidr",
         *   //   "gatewayIp": "my_gatewayIp",
         *   //   "id": "my_id",
         *   //   "ipAddress": "my_ipAddress",
         *   //   "jumboFramesEnabled": false,
         *   //   "labels": {},
         *   //   "macAddress": [],
         *   //   "mountPoints": [],
         *   //   "name": "my_name",
         *   //   "pod": "my_pod",
         *   //   "reservations": [],
         *   //   "servicesCidr": "my_servicesCidr",
         *   //   "state": "my_state",
         *   //   "type": "my_type",
         *   //   "vlanId": "my_vlanId",
         *   //   "vrf": {}
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
        get(params: Params$Resource$Projects$Locations$Networks$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Networks$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Network>>;
        get(params: Params$Resource$Projects$Locations$Networks$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Networks$Get, options: MethodOptions | BodyResponseCallback<Schema$Network>, callback: BodyResponseCallback<Schema$Network>): void;
        get(params: Params$Resource$Projects$Locations$Networks$Get, callback: BodyResponseCallback<Schema$Network>): void;
        get(callback: BodyResponseCallback<Schema$Network>): void;
        /**
         * List network in a given project and location.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.networks.list({
         *     // List filter.
         *     filter: 'placeholder-value',
         *     // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         *     pageSize: 'placeholder-value',
         *     // A token identifying a page of results from the server.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent value for ListNetworksRequest.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "networks": [],
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
        list(params: Params$Resource$Projects$Locations$Networks$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Networks$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNetworksResponse>>;
        list(params: Params$Resource$Projects$Locations$Networks$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Networks$List, options: MethodOptions | BodyResponseCallback<Schema$ListNetworksResponse>, callback: BodyResponseCallback<Schema$ListNetworksResponse>): void;
        list(params: Params$Resource$Projects$Locations$Networks$List, callback: BodyResponseCallback<Schema$ListNetworksResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNetworksResponse>): void;
        /**
         * List all Networks (and used IPs for each Network) in the vendor account associated with the specified project.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.networks.listNetworkUsage({
         *       // Required. Parent value (project and location).
         *       location: 'projects/my-project/locations/my-location',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "networks": []
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
        listNetworkUsage(params: Params$Resource$Projects$Locations$Networks$Listnetworkusage, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        listNetworkUsage(params?: Params$Resource$Projects$Locations$Networks$Listnetworkusage, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNetworkUsageResponse>>;
        listNetworkUsage(params: Params$Resource$Projects$Locations$Networks$Listnetworkusage, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        listNetworkUsage(params: Params$Resource$Projects$Locations$Networks$Listnetworkusage, options: MethodOptions | BodyResponseCallback<Schema$ListNetworkUsageResponse>, callback: BodyResponseCallback<Schema$ListNetworkUsageResponse>): void;
        listNetworkUsage(params: Params$Resource$Projects$Locations$Networks$Listnetworkusage, callback: BodyResponseCallback<Schema$ListNetworkUsageResponse>): void;
        listNetworkUsage(callback: BodyResponseCallback<Schema$ListNetworkUsageResponse>): void;
        /**
         * Update details of a single network.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.networks.patch({
         *     // Output only. The resource name of this `Network`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/networks/{network\}`
         *     name: 'projects/my-project/locations/my-location/networks/my-network',
         *     // The list of fields to update. The only currently supported fields are: `labels`, `reservations`, `vrf.vlan_attachments`
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cidr": "my_cidr",
         *       //   "gatewayIp": "my_gatewayIp",
         *       //   "id": "my_id",
         *       //   "ipAddress": "my_ipAddress",
         *       //   "jumboFramesEnabled": false,
         *       //   "labels": {},
         *       //   "macAddress": [],
         *       //   "mountPoints": [],
         *       //   "name": "my_name",
         *       //   "pod": "my_pod",
         *       //   "reservations": [],
         *       //   "servicesCidr": "my_servicesCidr",
         *       //   "state": "my_state",
         *       //   "type": "my_type",
         *       //   "vlanId": "my_vlanId",
         *       //   "vrf": {}
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
        patch(params: Params$Resource$Projects$Locations$Networks$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Networks$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Networks$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Networks$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Networks$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Networks$Get extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Networks$List extends StandardParameters {
        /**
         * List filter.
         */
        filter?: string;
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListNetworksRequest.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Networks$Listnetworkusage extends StandardParameters {
        /**
         * Required. Parent value (project and location).
         */
        location?: string;
    }
    export interface Params$Resource$Projects$Locations$Networks$Patch extends StandardParameters {
        /**
         * Output only. The resource name of this `Network`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/networks/{network\}`
         */
        name?: string;
        /**
         * The list of fields to update. The only currently supported fields are: `labels`, `reservations`, `vrf.vlan_attachments`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Network;
    }
    export class Resource$Projects$Locations$Nfsshares {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create an NFS share.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.nfsShares.create({
         *     // Required. The parent project and location.
         *     parent: 'projects/my-project/locations/my-location',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "allowedClients": [],
         *       //   "id": "my_id",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "nfsShareId": "my_nfsShareId",
         *       //   "requestedSizeGib": "my_requestedSizeGib",
         *       //   "state": "my_state",
         *       //   "storageType": "my_storageType",
         *       //   "volume": "my_volume"
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
        create(params: Params$Resource$Projects$Locations$Nfsshares$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Nfsshares$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Projects$Locations$Nfsshares$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Nfsshares$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Projects$Locations$Nfsshares$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Delete an NFS share. The underlying volume is automatically deleted.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.nfsShares.delete({
         *     // Required. The name of the NFS share to delete.
         *     name: 'projects/my-project/locations/my-location/nfsShares/my-nfsShare',
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
        delete(params: Params$Resource$Projects$Locations$Nfsshares$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Nfsshares$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Projects$Locations$Nfsshares$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Nfsshares$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Projects$Locations$Nfsshares$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get details of a single NFS share.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.nfsShares.get({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/nfsShares/my-nfsShare',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "allowedClients": [],
         *   //   "id": "my_id",
         *   //   "labels": {},
         *   //   "name": "my_name",
         *   //   "nfsShareId": "my_nfsShareId",
         *   //   "requestedSizeGib": "my_requestedSizeGib",
         *   //   "state": "my_state",
         *   //   "storageType": "my_storageType",
         *   //   "volume": "my_volume"
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
        get(params: Params$Resource$Projects$Locations$Nfsshares$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Nfsshares$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NfsShare>>;
        get(params: Params$Resource$Projects$Locations$Nfsshares$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Nfsshares$Get, options: MethodOptions | BodyResponseCallback<Schema$NfsShare>, callback: BodyResponseCallback<Schema$NfsShare>): void;
        get(params: Params$Resource$Projects$Locations$Nfsshares$Get, callback: BodyResponseCallback<Schema$NfsShare>): void;
        get(callback: BodyResponseCallback<Schema$NfsShare>): void;
        /**
         * List NFS shares.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.nfsShares.list({
         *     // List filter.
         *     filter: 'placeholder-value',
         *     // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         *     pageSize: 'placeholder-value',
         *     // A token identifying a page of results from the server.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent value for ListNfsSharesRequest.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "nfsShares": [],
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
        list(params: Params$Resource$Projects$Locations$Nfsshares$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Nfsshares$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListNfsSharesResponse>>;
        list(params: Params$Resource$Projects$Locations$Nfsshares$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Nfsshares$List, options: MethodOptions | BodyResponseCallback<Schema$ListNfsSharesResponse>, callback: BodyResponseCallback<Schema$ListNfsSharesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Nfsshares$List, callback: BodyResponseCallback<Schema$ListNfsSharesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListNfsSharesResponse>): void;
        /**
         * Update details of a single NFS share.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.nfsShares.patch({
         *     // Immutable. The name of the NFS share.
         *     name: 'projects/my-project/locations/my-location/nfsShares/my-nfsShare',
         *     // The list of fields to update. The only currently supported fields are: `labels` `allowed_clients`
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "allowedClients": [],
         *       //   "id": "my_id",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "nfsShareId": "my_nfsShareId",
         *       //   "requestedSizeGib": "my_requestedSizeGib",
         *       //   "state": "my_state",
         *       //   "storageType": "my_storageType",
         *       //   "volume": "my_volume"
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
        patch(params: Params$Resource$Projects$Locations$Nfsshares$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Nfsshares$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Nfsshares$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Nfsshares$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Nfsshares$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Nfsshares$Create extends StandardParameters {
        /**
         * Required. The parent project and location.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NfsShare;
    }
    export interface Params$Resource$Projects$Locations$Nfsshares$Delete extends StandardParameters {
        /**
         * Required. The name of the NFS share to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Nfsshares$Get extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Nfsshares$List extends StandardParameters {
        /**
         * List filter.
         */
        filter?: string;
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListNfsSharesRequest.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Nfsshares$Patch extends StandardParameters {
        /**
         * Immutable. The name of the NFS share.
         */
        name?: string;
        /**
         * The list of fields to update. The only currently supported fields are: `labels` `allowed_clients`
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$NfsShare;
    }
    export class Resource$Projects$Locations$Operations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get details about an operation. This method used only to work around CCFE lack of passthrough LRO support (b/221498758).
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.operations.get({
         *     // The name of the operation resource.
         *     name: 'projects/my-project/locations/my-location/operations/.*',
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
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Operations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Projects$Locations$Operations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Operations$Get extends StandardParameters {
        /**
         * The name of the operation resource.
         */
        name?: string;
    }
    export class Resource$Projects$Locations$Provisioningconfigs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Create new ProvisioningConfig.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.provisioningConfigs.create({
         *       // Optional. Email provided to send a confirmation with provisioning config to.
         *       email: 'placeholder-value',
         *       // Required. The parent project and location containing the ProvisioningConfig.
         *       parent: 'projects/my-project/locations/my-location',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "cloudConsoleUri": "my_cloudConsoleUri",
         *         //   "customId": "my_customId",
         *         //   "email": "my_email",
         *         //   "handoverServiceAccount": "my_handoverServiceAccount",
         *         //   "instances": [],
         *         //   "location": "my_location",
         *         //   "name": "my_name",
         *         //   "networks": [],
         *         //   "state": "my_state",
         *         //   "statusMessage": "my_statusMessage",
         *         //   "ticketId": "my_ticketId",
         *         //   "updateTime": "my_updateTime",
         *         //   "volumes": [],
         *         //   "vpcScEnabled": false
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cloudConsoleUri": "my_cloudConsoleUri",
         *   //   "customId": "my_customId",
         *   //   "email": "my_email",
         *   //   "handoverServiceAccount": "my_handoverServiceAccount",
         *   //   "instances": [],
         *   //   "location": "my_location",
         *   //   "name": "my_name",
         *   //   "networks": [],
         *   //   "state": "my_state",
         *   //   "statusMessage": "my_statusMessage",
         *   //   "ticketId": "my_ticketId",
         *   //   "updateTime": "my_updateTime",
         *   //   "volumes": [],
         *   //   "vpcScEnabled": false
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
        create(params: Params$Resource$Projects$Locations$Provisioningconfigs$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Provisioningconfigs$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProvisioningConfig>>;
        create(params: Params$Resource$Projects$Locations$Provisioningconfigs$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Provisioningconfigs$Create, options: MethodOptions | BodyResponseCallback<Schema$ProvisioningConfig>, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        create(params: Params$Resource$Projects$Locations$Provisioningconfigs$Create, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        create(callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        /**
         * Get ProvisioningConfig by name.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.provisioningConfigs.get({
         *       // Required. Name of the ProvisioningConfig.
         *       name: 'projects/my-project/locations/my-location/provisioningConfigs/my-provisioningConfig',
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cloudConsoleUri": "my_cloudConsoleUri",
         *   //   "customId": "my_customId",
         *   //   "email": "my_email",
         *   //   "handoverServiceAccount": "my_handoverServiceAccount",
         *   //   "instances": [],
         *   //   "location": "my_location",
         *   //   "name": "my_name",
         *   //   "networks": [],
         *   //   "state": "my_state",
         *   //   "statusMessage": "my_statusMessage",
         *   //   "ticketId": "my_ticketId",
         *   //   "updateTime": "my_updateTime",
         *   //   "volumes": [],
         *   //   "vpcScEnabled": false
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
        get(params: Params$Resource$Projects$Locations$Provisioningconfigs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Provisioningconfigs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProvisioningConfig>>;
        get(params: Params$Resource$Projects$Locations$Provisioningconfigs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Provisioningconfigs$Get, options: MethodOptions | BodyResponseCallback<Schema$ProvisioningConfig>, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        get(params: Params$Resource$Projects$Locations$Provisioningconfigs$Get, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        get(callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        /**
         * Update existing ProvisioningConfig.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.provisioningConfigs.patch({
         *       // Optional. Email provided to send a confirmation with provisioning config to.
         *       email: 'placeholder-value',
         *       // Output only. The system-generated name of the provisioning config. This follows the UUID format.
         *       name: 'projects/my-project/locations/my-location/provisioningConfigs/my-provisioningConfig',
         *       // Required. The list of fields to update.
         *       updateMask: 'placeholder-value',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "cloudConsoleUri": "my_cloudConsoleUri",
         *         //   "customId": "my_customId",
         *         //   "email": "my_email",
         *         //   "handoverServiceAccount": "my_handoverServiceAccount",
         *         //   "instances": [],
         *         //   "location": "my_location",
         *         //   "name": "my_name",
         *         //   "networks": [],
         *         //   "state": "my_state",
         *         //   "statusMessage": "my_statusMessage",
         *         //   "ticketId": "my_ticketId",
         *         //   "updateTime": "my_updateTime",
         *         //   "volumes": [],
         *         //   "vpcScEnabled": false
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cloudConsoleUri": "my_cloudConsoleUri",
         *   //   "customId": "my_customId",
         *   //   "email": "my_email",
         *   //   "handoverServiceAccount": "my_handoverServiceAccount",
         *   //   "instances": [],
         *   //   "location": "my_location",
         *   //   "name": "my_name",
         *   //   "networks": [],
         *   //   "state": "my_state",
         *   //   "statusMessage": "my_statusMessage",
         *   //   "ticketId": "my_ticketId",
         *   //   "updateTime": "my_updateTime",
         *   //   "volumes": [],
         *   //   "vpcScEnabled": false
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
        patch(params: Params$Resource$Projects$Locations$Provisioningconfigs$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Provisioningconfigs$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProvisioningConfig>>;
        patch(params: Params$Resource$Projects$Locations$Provisioningconfigs$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Provisioningconfigs$Patch, options: MethodOptions | BodyResponseCallback<Schema$ProvisioningConfig>, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        patch(params: Params$Resource$Projects$Locations$Provisioningconfigs$Patch, callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
        patch(callback: BodyResponseCallback<Schema$ProvisioningConfig>): void;
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.provisioningConfigs.submit({
         *       // Required. The parent project and location containing the ProvisioningConfig.
         *       parent: 'projects/my-project/locations/my-location',
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
         *   //   "provisioningConfig": {}
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
        submit(params: Params$Resource$Projects$Locations$Provisioningconfigs$Submit, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        submit(params?: Params$Resource$Projects$Locations$Provisioningconfigs$Submit, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SubmitProvisioningConfigResponse>>;
        submit(params: Params$Resource$Projects$Locations$Provisioningconfigs$Submit, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        submit(params: Params$Resource$Projects$Locations$Provisioningconfigs$Submit, options: MethodOptions | BodyResponseCallback<Schema$SubmitProvisioningConfigResponse>, callback: BodyResponseCallback<Schema$SubmitProvisioningConfigResponse>): void;
        submit(params: Params$Resource$Projects$Locations$Provisioningconfigs$Submit, callback: BodyResponseCallback<Schema$SubmitProvisioningConfigResponse>): void;
        submit(callback: BodyResponseCallback<Schema$SubmitProvisioningConfigResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Provisioningconfigs$Create extends StandardParameters {
        /**
         * Optional. Email provided to send a confirmation with provisioning config to.
         */
        email?: string;
        /**
         * Required. The parent project and location containing the ProvisioningConfig.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ProvisioningConfig;
    }
    export interface Params$Resource$Projects$Locations$Provisioningconfigs$Get extends StandardParameters {
        /**
         * Required. Name of the ProvisioningConfig.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Provisioningconfigs$Patch extends StandardParameters {
        /**
         * Optional. Email provided to send a confirmation with provisioning config to.
         */
        email?: string;
        /**
         * Output only. The system-generated name of the provisioning config. This follows the UUID format.
         */
        name?: string;
        /**
         * Required. The list of fields to update.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ProvisioningConfig;
    }
    export interface Params$Resource$Projects$Locations$Provisioningconfigs$Submit extends StandardParameters {
        /**
         * Required. The parent project and location containing the ProvisioningConfig.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SubmitProvisioningConfigRequest;
    }
    export class Resource$Projects$Locations$Provisioningquotas {
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.provisioningQuotas.list({
         *       // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default. Notice that page_size field is not supported and won't be respected in the API request for now, will be updated when pagination is supported.
         *       pageSize: 'placeholder-value',
         *       // A token identifying a page of results from the server.
         *       pageToken: 'placeholder-value',
         *       // Required. Parent value for ListProvisioningQuotasRequest.
         *       parent: 'projects/my-project/locations/my-location',
         *     });
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
        list(params: Params$Resource$Projects$Locations$Provisioningquotas$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Provisioningquotas$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListProvisioningQuotasResponse>>;
        list(params: Params$Resource$Projects$Locations$Provisioningquotas$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Provisioningquotas$List, options: MethodOptions | BodyResponseCallback<Schema$ListProvisioningQuotasResponse>, callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
        list(params: Params$Resource$Projects$Locations$Provisioningquotas$List, callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListProvisioningQuotasResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Provisioningquotas$List extends StandardParameters {
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default. Notice that page_size field is not supported and won't be respected in the API request for now, will be updated when pagination is supported.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListProvisioningQuotasRequest.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Sshkeys {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Register a public SSH key in the specified project for use with the interactive serial console feature.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.sshKeys.create({
         *     // Required. The parent containing the SSH keys.
         *     parent: 'projects/my-project/locations/my-location',
         *     // Required. The ID to use for the key, which will become the final component of the key's resource name. This value must match the regex: [a-zA-Z0-9@.\-_]{1,64\}
         *     sshKeyId: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "name": "my_name",
         *       //   "publicKey": "my_publicKey"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "name": "my_name",
         *   //   "publicKey": "my_publicKey"
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
        create(params: Params$Resource$Projects$Locations$Sshkeys$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Sshkeys$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SSHKey>>;
        create(params: Params$Resource$Projects$Locations$Sshkeys$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Sshkeys$Create, options: MethodOptions | BodyResponseCallback<Schema$SSHKey>, callback: BodyResponseCallback<Schema$SSHKey>): void;
        create(params: Params$Resource$Projects$Locations$Sshkeys$Create, callback: BodyResponseCallback<Schema$SSHKey>): void;
        create(callback: BodyResponseCallback<Schema$SSHKey>): void;
        /**
         * Deletes a public SSH key registered in the specified project.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.sshKeys.delete({
         *     // Required. The name of the SSH key to delete. Currently, the only valid value for the location is "global".
         *     name: 'projects/my-project/locations/my-location/sshKeys/my-sshKey',
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
        delete(params: Params$Resource$Projects$Locations$Sshkeys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Sshkeys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Sshkeys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Sshkeys$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Sshkeys$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Lists the public SSH keys registered for the specified project. These SSH keys are used only for the interactive serial console feature.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.sshKeys.list({
         *     // The maximum number of items to return.
         *     pageSize: 'placeholder-value',
         *     // The next_page_token value returned from a previous List request, if any.
         *     pageToken: 'placeholder-value',
         *     // Required. The parent containing the SSH keys. Currently, the only valid value for the location is "global".
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "sshKeys": []
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
        list(params: Params$Resource$Projects$Locations$Sshkeys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Sshkeys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListSSHKeysResponse>>;
        list(params: Params$Resource$Projects$Locations$Sshkeys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Sshkeys$List, options: MethodOptions | BodyResponseCallback<Schema$ListSSHKeysResponse>, callback: BodyResponseCallback<Schema$ListSSHKeysResponse>): void;
        list(params: Params$Resource$Projects$Locations$Sshkeys$List, callback: BodyResponseCallback<Schema$ListSSHKeysResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListSSHKeysResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Sshkeys$Create extends StandardParameters {
        /**
         * Required. The parent containing the SSH keys.
         */
        parent?: string;
        /**
         * Required. The ID to use for the key, which will become the final component of the key's resource name. This value must match the regex: [a-zA-Z0-9@.\-_]{1,64\}
         */
        sshKeyId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SSHKey;
    }
    export interface Params$Resource$Projects$Locations$Sshkeys$Delete extends StandardParameters {
        /**
         * Required. The name of the SSH key to delete. Currently, the only valid value for the location is "global".
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Sshkeys$List extends StandardParameters {
        /**
         * The maximum number of items to return.
         */
        pageSize?: number;
        /**
         * The next_page_token value returned from a previous List request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent containing the SSH keys. Currently, the only valid value for the location is "global".
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Volumes {
        context: APIRequestContext;
        luns: Resource$Projects$Locations$Volumes$Luns;
        snapshots: Resource$Projects$Locations$Volumes$Snapshots;
        constructor(context: APIRequestContext);
        /**
         * Skips volume's cooloff and deletes it now. Volume must be in cooloff state.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.evict({
         *     // Required. The name of the Volume.
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume',
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
        evict(params: Params$Resource$Projects$Locations$Volumes$Evict, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        evict(params?: Params$Resource$Projects$Locations$Volumes$Evict, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        evict(params: Params$Resource$Projects$Locations$Volumes$Evict, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        evict(params: Params$Resource$Projects$Locations$Volumes$Evict, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        evict(params: Params$Resource$Projects$Locations$Volumes$Evict, callback: BodyResponseCallback<Schema$Operation>): void;
        evict(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get details of a single storage volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.get({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "autoGrownSizeGib": "my_autoGrownSizeGib",
         *   //   "bootVolume": false,
         *   //   "currentSizeGib": "my_currentSizeGib",
         *   //   "emergencySizeGib": "my_emergencySizeGib",
         *   //   "expireTime": "my_expireTime",
         *   //   "id": "my_id",
         *   //   "labels": {},
         *   //   "maxSizeGib": "my_maxSizeGib",
         *   //   "name": "my_name",
         *   //   "notes": "my_notes",
         *   //   "originallyRequestedSizeGib": "my_originallyRequestedSizeGib",
         *   //   "performanceTier": "my_performanceTier",
         *   //   "pod": "my_pod",
         *   //   "protocol": "my_protocol",
         *   //   "remainingSpaceGib": "my_remainingSpaceGib",
         *   //   "requestedSizeGib": "my_requestedSizeGib",
         *   //   "snapshotAutoDeleteBehavior": "my_snapshotAutoDeleteBehavior",
         *   //   "snapshotEnabled": false,
         *   //   "snapshotReservationDetail": {},
         *   //   "snapshotSchedulePolicy": "my_snapshotSchedulePolicy",
         *   //   "state": "my_state",
         *   //   "storageAggregatePool": "my_storageAggregatePool",
         *   //   "storageType": "my_storageType",
         *   //   "workloadProfile": "my_workloadProfile"
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
        get(params: Params$Resource$Projects$Locations$Volumes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Volumes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Volume>>;
        get(params: Params$Resource$Projects$Locations$Volumes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Get, options: MethodOptions | BodyResponseCallback<Schema$Volume>, callback: BodyResponseCallback<Schema$Volume>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Get, callback: BodyResponseCallback<Schema$Volume>): void;
        get(callback: BodyResponseCallback<Schema$Volume>): void;
        /**
         * List storage volumes in a given project and location.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.list({
         *     // List filter.
         *     filter: 'placeholder-value',
         *     // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         *     pageSize: 'placeholder-value',
         *     // A token identifying a page of results from the server.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent value for ListVolumesRequest.
         *     parent: 'projects/my-project/locations/my-location',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "unreachable": [],
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
        list(params: Params$Resource$Projects$Locations$Volumes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Volumes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListVolumesResponse>>;
        list(params: Params$Resource$Projects$Locations$Volumes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$List, options: MethodOptions | BodyResponseCallback<Schema$ListVolumesResponse>, callback: BodyResponseCallback<Schema$ListVolumesResponse>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$List, callback: BodyResponseCallback<Schema$ListVolumesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListVolumesResponse>): void;
        /**
         * Update details of a single storage volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.patch({
         *     // Output only. The resource name of this `Volume`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/volumes/{volume\}`
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume',
         *     // The list of fields to update. The only currently supported fields are: 'labels'
         *     updateMask: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "autoGrownSizeGib": "my_autoGrownSizeGib",
         *       //   "bootVolume": false,
         *       //   "currentSizeGib": "my_currentSizeGib",
         *       //   "emergencySizeGib": "my_emergencySizeGib",
         *       //   "expireTime": "my_expireTime",
         *       //   "id": "my_id",
         *       //   "labels": {},
         *       //   "maxSizeGib": "my_maxSizeGib",
         *       //   "name": "my_name",
         *       //   "notes": "my_notes",
         *       //   "originallyRequestedSizeGib": "my_originallyRequestedSizeGib",
         *       //   "performanceTier": "my_performanceTier",
         *       //   "pod": "my_pod",
         *       //   "protocol": "my_protocol",
         *       //   "remainingSpaceGib": "my_remainingSpaceGib",
         *       //   "requestedSizeGib": "my_requestedSizeGib",
         *       //   "snapshotAutoDeleteBehavior": "my_snapshotAutoDeleteBehavior",
         *       //   "snapshotEnabled": false,
         *       //   "snapshotReservationDetail": {},
         *       //   "snapshotSchedulePolicy": "my_snapshotSchedulePolicy",
         *       //   "state": "my_state",
         *       //   "storageAggregatePool": "my_storageAggregatePool",
         *       //   "storageType": "my_storageType",
         *       //   "workloadProfile": "my_workloadProfile"
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
        patch(params: Params$Resource$Projects$Locations$Volumes$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Projects$Locations$Volumes$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Projects$Locations$Volumes$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Projects$Locations$Volumes$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Projects$Locations$Volumes$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Emergency Volume resize.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.resize({
         *     // Required. Volume to resize.
         *     volume: 'projects/my-project/locations/my-location/volumes/my-volume',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "sizeGib": "my_sizeGib"
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
        resize(params: Params$Resource$Projects$Locations$Volumes$Resize, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        resize(params?: Params$Resource$Projects$Locations$Volumes$Resize, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        resize(params: Params$Resource$Projects$Locations$Volumes$Resize, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        resize(params: Params$Resource$Projects$Locations$Volumes$Resize, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        resize(params: Params$Resource$Projects$Locations$Volumes$Resize, callback: BodyResponseCallback<Schema$Operation>): void;
        resize(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Evict extends StandardParameters {
        /**
         * Required. The name of the Volume.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EvictVolumeRequest;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Get extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$List extends StandardParameters {
        /**
         * List filter.
         */
        filter?: string;
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListVolumesRequest.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Patch extends StandardParameters {
        /**
         * Output only. The resource name of this `Volume`. Resource names are schemeless URIs that follow the conventions in https://cloud.google.com/apis/design/resource_names. Format: `projects/{project\}/locations/{location\}/volumes/{volume\}`
         */
        name?: string;
        /**
         * The list of fields to update. The only currently supported fields are: 'labels'
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Volume;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Resize extends StandardParameters {
        /**
         * Required. Volume to resize.
         */
        volume?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResizeVolumeRequest;
    }
    export class Resource$Projects$Locations$Volumes$Luns {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Skips lun's cooloff and deletes it now. Lun must be in cooloff state.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.luns.evict({
         *     // Required. The name of the lun.
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume/luns/my-lun',
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
        evict(params: Params$Resource$Projects$Locations$Volumes$Luns$Evict, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        evict(params?: Params$Resource$Projects$Locations$Volumes$Luns$Evict, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        evict(params: Params$Resource$Projects$Locations$Volumes$Luns$Evict, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        evict(params: Params$Resource$Projects$Locations$Volumes$Luns$Evict, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        evict(params: Params$Resource$Projects$Locations$Volumes$Luns$Evict, callback: BodyResponseCallback<Schema$Operation>): void;
        evict(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Get details of a single storage logical unit number(LUN).
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.luns.get({
         *     // Required. Name of the resource.
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume/luns/my-lun',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "bootLun": false,
         *   //   "expireTime": "my_expireTime",
         *   //   "id": "my_id",
         *   //   "multiprotocolType": "my_multiprotocolType",
         *   //   "name": "my_name",
         *   //   "shareable": false,
         *   //   "sizeGb": "my_sizeGb",
         *   //   "state": "my_state",
         *   //   "storageType": "my_storageType",
         *   //   "storageVolume": "my_storageVolume",
         *   //   "wwid": "my_wwid"
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
        get(params: Params$Resource$Projects$Locations$Volumes$Luns$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Volumes$Luns$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Lun>>;
        get(params: Params$Resource$Projects$Locations$Volumes$Luns$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Luns$Get, options: MethodOptions | BodyResponseCallback<Schema$Lun>, callback: BodyResponseCallback<Schema$Lun>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Luns$Get, callback: BodyResponseCallback<Schema$Lun>): void;
        get(callback: BodyResponseCallback<Schema$Lun>): void;
        /**
         * List storage volume luns for given storage volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.luns.list({
         *     // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         *     pageSize: 'placeholder-value',
         *     // A token identifying a page of results from the server.
         *     pageToken: 'placeholder-value',
         *     // Required. Parent value for ListLunsRequest.
         *     parent: 'projects/my-project/locations/my-location/volumes/my-volume',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "luns": [],
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
        list(params: Params$Resource$Projects$Locations$Volumes$Luns$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Volumes$Luns$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListLunsResponse>>;
        list(params: Params$Resource$Projects$Locations$Volumes$Luns$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$Luns$List, options: MethodOptions | BodyResponseCallback<Schema$ListLunsResponse>, callback: BodyResponseCallback<Schema$ListLunsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$Luns$List, callback: BodyResponseCallback<Schema$ListLunsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListLunsResponse>): void;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Luns$Evict extends StandardParameters {
        /**
         * Required. The name of the lun.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EvictLunRequest;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Luns$Get extends StandardParameters {
        /**
         * Required. Name of the resource.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Luns$List extends StandardParameters {
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListLunsRequest.
         */
        parent?: string;
    }
    export class Resource$Projects$Locations$Volumes$Snapshots {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Takes a snapshot of a boot volume. Returns INVALID_ARGUMENT if called for a non-boot volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.volumes.snapshots.create({
         *       // Required. The volume to snapshot.
         *       parent: 'projects/my-project/locations/my-location/volumes/my-volume',
         *
         *       // Request body metadata
         *       requestBody: {
         *         // request body parameters
         *         // {
         *         //   "createTime": "my_createTime",
         *         //   "description": "my_description",
         *         //   "id": "my_id",
         *         //   "name": "my_name",
         *         //   "storageVolume": "my_storageVolume",
         *         //   "type": "my_type"
         *         // }
         *       },
         *     });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "description": "my_description",
         *   //   "id": "my_id",
         *   //   "name": "my_name",
         *   //   "storageVolume": "my_storageVolume",
         *   //   "type": "my_type"
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
        create(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Projects$Locations$Volumes$Snapshots$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$VolumeSnapshot>>;
        create(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Create, options: MethodOptions | BodyResponseCallback<Schema$VolumeSnapshot>, callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        create(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Create, callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        create(callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        /**
         * Deletes a volume snapshot. Returns INVALID_ARGUMENT if called for a non-boot volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.volumes.snapshots.delete({
         *       // Required. The name of the snapshot to delete.
         *       name: 'projects/my-project/locations/my-location/volumes/my-volume/snapshots/my-snapshot',
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
        delete(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Projects$Locations$Volumes$Snapshots$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Empty>>;
        delete(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Delete, options: MethodOptions | BodyResponseCallback<Schema$Empty>, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Delete, callback: BodyResponseCallback<Schema$Empty>): void;
        delete(callback: BodyResponseCallback<Schema$Empty>): void;
        /**
         * Returns the specified snapshot resource. Returns INVALID_ARGUMENT if called for a non-boot volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.snapshots.get({
         *     // Required. The name of the snapshot.
         *     name: 'projects/my-project/locations/my-location/volumes/my-volume/snapshots/my-snapshot',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "createTime": "my_createTime",
         *   //   "description": "my_description",
         *   //   "id": "my_id",
         *   //   "name": "my_name",
         *   //   "storageVolume": "my_storageVolume",
         *   //   "type": "my_type"
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
        get(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Locations$Volumes$Snapshots$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$VolumeSnapshot>>;
        get(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Get, options: MethodOptions | BodyResponseCallback<Schema$VolumeSnapshot>, callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        get(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Get, callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        get(callback: BodyResponseCallback<Schema$VolumeSnapshot>): void;
        /**
         * Retrieves the list of snapshots for the specified volume. Returns a response with an empty list of snapshots if called for a non-boot volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *   const res = await baremetalsolution.projects.locations.volumes.snapshots.list(
         *     {
         *       // Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         *       pageSize: 'placeholder-value',
         *       // A token identifying a page of results from the server.
         *       pageToken: 'placeholder-value',
         *       // Required. Parent value for ListVolumesRequest.
         *       parent: 'projects/my-project/locations/my-location/volumes/my-volume',
         *     }
         *   );
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "unreachable": [],
         *   //   "volumeSnapshots": []
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
        list(params: Params$Resource$Projects$Locations$Volumes$Snapshots$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Projects$Locations$Volumes$Snapshots$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListVolumeSnapshotsResponse>>;
        list(params: Params$Resource$Projects$Locations$Volumes$Snapshots$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$Snapshots$List, options: MethodOptions | BodyResponseCallback<Schema$ListVolumeSnapshotsResponse>, callback: BodyResponseCallback<Schema$ListVolumeSnapshotsResponse>): void;
        list(params: Params$Resource$Projects$Locations$Volumes$Snapshots$List, callback: BodyResponseCallback<Schema$ListVolumeSnapshotsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListVolumeSnapshotsResponse>): void;
        /**
         * Uses the specified snapshot to restore its parent volume. Returns INVALID_ARGUMENT if called for a non-boot volume.
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
         * const baremetalsolution = google.baremetalsolution('v2');
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
         *     await baremetalsolution.projects.locations.volumes.snapshots.restoreVolumeSnapshot(
         *       {
         *         // Required. Name of the snapshot which will be used to restore its parent volume.
         *         volumeSnapshot:
         *           'projects/my-project/locations/my-location/volumes/my-volume/snapshots/my-snapshot',
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
        restoreVolumeSnapshot(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        restoreVolumeSnapshot(params?: Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        restoreVolumeSnapshot(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        restoreVolumeSnapshot(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreVolumeSnapshot(params: Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot, callback: BodyResponseCallback<Schema$Operation>): void;
        restoreVolumeSnapshot(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Snapshots$Create extends StandardParameters {
        /**
         * Required. The volume to snapshot.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$VolumeSnapshot;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Snapshots$Delete extends StandardParameters {
        /**
         * Required. The name of the snapshot to delete.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Snapshots$Get extends StandardParameters {
        /**
         * Required. The name of the snapshot.
         */
        name?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Snapshots$List extends StandardParameters {
        /**
         * Requested page size. The server might return fewer items than requested. If unspecified, server will pick an appropriate default.
         */
        pageSize?: number;
        /**
         * A token identifying a page of results from the server.
         */
        pageToken?: string;
        /**
         * Required. Parent value for ListVolumesRequest.
         */
        parent?: string;
    }
    export interface Params$Resource$Projects$Locations$Volumes$Snapshots$Restorevolumesnapshot extends StandardParameters {
        /**
         * Required. Name of the snapshot which will be used to restore its parent volume.
         */
        volumeSnapshot?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RestoreVolumeSnapshotRequest;
    }
    export {};
}
