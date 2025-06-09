import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace dns_v2 {
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
     * Cloud DNS API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const dns = google.dns('v2');
     * ```
     */
    export class Dns {
        context: APIRequestContext;
        changes: Resource$Changes;
        dnsKeys: Resource$Dnskeys;
        managedZoneOperations: Resource$Managedzoneoperations;
        managedZones: Resource$Managedzones;
        policies: Resource$Policies;
        projects: Resource$Projects;
        resourceRecordSets: Resource$Resourcerecordsets;
        responsePolicies: Resource$Responsepolicies;
        responsePolicyRules: Resource$Responsepolicyrules;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * A Change represents a set of ResourceRecordSet additions and deletions applied atomically to a ManagedZone. ResourceRecordSets within a ManagedZone are modified by creating a new Change element in the Changes collection. In turn the Changes collection also records the past modifications to the ResourceRecordSets in a ManagedZone. The current state of the ManagedZone is the sum effect of applying all Change elements in the Changes collection in sequence.
     */
    export interface Schema$Change {
        /**
         * Which ResourceRecordSets to add?
         */
        additions?: Schema$ResourceRecordSet[];
        /**
         * Which ResourceRecordSets to remove? Must match existing data exactly.
         */
        deletions?: Schema$ResourceRecordSet[];
        /**
         * Unique identifier for the resource; defined by the server (output only).
         */
        id?: string | null;
        /**
         * If the DNS queries for the zone will be served.
         */
        isServing?: boolean | null;
        kind?: string | null;
        /**
         * The time that this operation was started by the server (output only). This is in RFC3339 text format.
         */
        startTime?: string | null;
        /**
         * Status of the operation (output only). A status of "done" means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.
         */
        status?: string | null;
    }
    /**
     * The response to a request to enumerate Changes to a ResourceRecordSets collection.
     */
    export interface Schema$ChangesListResponse {
        /**
         * The requested changes.
         */
        changes?: Schema$Change[];
        header?: Schema$ResponseHeader;
        /**
         * Type of resource.
         */
        kind?: string | null;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token. This lets you retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a "snapshot" of collections larger than the maximum page size.
         */
        nextPageToken?: string | null;
    }
    /**
     * A DNSSEC key pair.
     */
    export interface Schema$DnsKey {
        /**
         * String mnemonic specifying the DNSSEC algorithm of this key. Immutable after creation time.
         */
        algorithm?: string | null;
        /**
         * The time that this resource was created in the control plane. This is in RFC3339 text format. Output only.
         */
        creationTime?: string | null;
        /**
         * A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the resource's function.
         */
        description?: string | null;
        /**
         * Cryptographic hashes of the DNSKEY resource record associated with this DnsKey. These digests are needed to construct a DS record that points at this DNS key. Output only.
         */
        digests?: Schema$DnsKeyDigest[];
        /**
         * Unique identifier for the resource; defined by the server (output only).
         */
        id?: string | null;
        /**
         * Active keys are used to sign subsequent changes to the ManagedZone. Inactive keys are still present as DNSKEY Resource Records for the use of resolvers validating existing signatures.
         */
        isActive?: boolean | null;
        /**
         * Length of the key in bits. Specified at creation time, and then immutable.
         */
        keyLength?: number | null;
        /**
         * The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone's DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.
         */
        keyTag?: number | null;
        kind?: string | null;
        /**
         * Base64 encoded public half of this key. Output only.
         */
        publicKey?: string | null;
        /**
         * One of "KEY_SIGNING" or "ZONE_SIGNING". Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, are used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag is cleared, and this key is used to sign only resource record sets of other types. Immutable after creation time.
         */
        type?: string | null;
    }
    export interface Schema$DnsKeyDigest {
        /**
         * The base-16 encoded bytes of this digest. Suitable for use in a DS resource record.
         */
        digest?: string | null;
        /**
         * Specifies the algorithm used to calculate this digest.
         */
        type?: string | null;
    }
    /**
     * The response to a request to enumerate DnsKeys in a ManagedZone.
     */
    export interface Schema$DnsKeysListResponse {
        /**
         * The requested resources.
         */
        dnsKeys?: Schema$DnsKey[];
        header?: Schema$ResponseHeader;
        /**
         * Type of resource.
         */
        kind?: string | null;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token. In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. There is no way to retrieve a "snapshot" of collections larger than the maximum page size.
         */
        nextPageToken?: string | null;
    }
    /**
     * Parameters for DnsKey key generation. Used for generating initial keys for a new ManagedZone and as default when adding a new DnsKey.
     */
    export interface Schema$DnsKeySpec {
        /**
         * String mnemonic specifying the DNSSEC algorithm of this key.
         */
        algorithm?: string | null;
        /**
         * Length of the keys in bits.
         */
        keyLength?: number | null;
        /**
         * Specifies whether this is a key signing key (KSK) or a zone signing key (ZSK). Key signing keys have the Secure Entry Point flag set and, when active, are only used to sign resource record sets of type DNSKEY. Zone signing keys do not have the Secure Entry Point flag set and are used to sign all other types of resource record sets.
         */
        keyType?: string | null;
        kind?: string | null;
    }
    /**
     * A zone is a subtree of the DNS namespace under one administrative responsibility. A ManagedZone is a resource that represents a DNS zone hosted by the Cloud DNS service.
     */
    export interface Schema$ManagedZone {
        cloudLoggingConfig?: Schema$ManagedZoneCloudLoggingConfig;
        /**
         * The time that this resource was created on the server. This is in RFC3339 text format. Output only.
         */
        creationTime?: string | null;
        /**
         * A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the managed zone's function.
         */
        description?: string | null;
        /**
         * The DNS name of this managed zone, for instance "example.com.".
         */
        dnsName?: string | null;
        /**
         * DNSSEC configuration.
         */
        dnssecConfig?: Schema$ManagedZoneDnsSecConfig;
        /**
         * The presence for this field indicates that outbound forwarding is enabled for this zone. The value of this field contains the set of destinations to forward to.
         */
        forwardingConfig?: Schema$ManagedZoneForwardingConfig;
        /**
         * Unique identifier for the resource; defined by the server (output only)
         */
        id?: string | null;
        kind?: string | null;
        /**
         * User labels.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * User assigned name for this resource. Must be unique within the project. The name must be 1-63 characters long, must begin with a letter, end with a letter or digit, and only contain lowercase letters, digits or dashes.
         */
        name?: string | null;
        /**
         * Delegate your managed_zone to these virtual name servers; defined by the server (output only)
         */
        nameServers?: string[] | null;
        /**
         * Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users leave this field unset. If you need to use this field, contact your account team.
         */
        nameServerSet?: string | null;
        /**
         * The presence of this field indicates that DNS Peering is enabled for this zone. The value of this field contains the network to peer with.
         */
        peeringConfig?: Schema$ManagedZonePeeringConfig;
        /**
         * For privately visible zones, the set of Virtual Private Cloud resources that the zone is visible from.
         */
        privateVisibilityConfig?: Schema$ManagedZonePrivateVisibilityConfig;
        /**
         * The presence of this field indicates that this is a managed reverse lookup zone and Cloud DNS resolves reverse lookup queries using automatically configured records for VPC resources. This only applies to networks listed under private_visibility_config.
         */
        reverseLookupConfig?: Schema$ManagedZoneReverseLookupConfig;
        /**
         * This field links to the associated service directory namespace. Do not set this field for public zones or forwarding zones.
         */
        serviceDirectoryConfig?: Schema$ManagedZoneServiceDirectoryConfig;
        /**
         * The zone's visibility: public zones are exposed to the Internet, while private zones are visible only to Virtual Private Cloud resources.
         */
        visibility?: string | null;
    }
    /**
     * Cloud Logging configurations for publicly visible zones.
     */
    export interface Schema$ManagedZoneCloudLoggingConfig {
        /**
         * If set, enable query logging for this ManagedZone. False by default, making logging opt-in.
         */
        enableLogging?: boolean | null;
        kind?: string | null;
    }
    export interface Schema$ManagedZoneDnsSecConfig {
        /**
         * Specifies parameters for generating initial DnsKeys for this ManagedZone. Can only be changed while the state is OFF.
         */
        defaultKeySpecs?: Schema$DnsKeySpec[];
        kind?: string | null;
        /**
         * Specifies the mechanism for authenticated denial-of-existence responses. Can only be changed while the state is OFF.
         */
        nonExistence?: string | null;
        /**
         * Specifies whether DNSSEC is enabled, and what mode it is in.
         */
        state?: string | null;
    }
    export interface Schema$ManagedZoneForwardingConfig {
        kind?: string | null;
        /**
         * List of target name servers to forward to. Cloud DNS selects the best available name server if more than one target is given.
         */
        targetNameServers?: Schema$ManagedZoneForwardingConfigNameServerTarget[];
    }
    export interface Schema$ManagedZoneForwardingConfigNameServerTarget {
        /**
         * Forwarding path for this NameServerTarget. If unset or set to DEFAULT, Cloud DNS makes forwarding decisions based on IP address ranges; that is, RFC1918 addresses go to the VPC network, non-RFC1918 addresses go to the internet. When set to PRIVATE, Cloud DNS always sends queries through the VPC network for this target.
         */
        forwardingPath?: string | null;
        /**
         * IPv4 address of a target name server.
         */
        ipv4Address?: string | null;
        kind?: string | null;
    }
    export interface Schema$ManagedZoneOperationsListResponse {
        header?: Schema$ResponseHeader;
        kind?: string | null;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token. This lets you retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
        /**
         * The operation resources.
         */
        operations?: Schema$Operation[];
    }
    export interface Schema$ManagedZonePeeringConfig {
        kind?: string | null;
        /**
         * The network with which to peer.
         */
        targetNetwork?: Schema$ManagedZonePeeringConfigTargetNetwork;
    }
    export interface Schema$ManagedZonePeeringConfigTargetNetwork {
        /**
         * The time at which the zone was deactivated, in RFC 3339 date-time format. An empty string indicates that the peering connection is active. The producer network can deactivate a zone. The zone is automatically deactivated if the producer network that the zone targeted is deleted. Output only.
         */
        deactivateTime?: string | null;
        kind?: string | null;
        /**
         * The fully qualified URL of the VPC network to forward queries to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project\}/global/networks/{network\}
         */
        networkUrl?: string | null;
    }
    export interface Schema$ManagedZonePrivateVisibilityConfig {
        /**
         * The list of Google Kubernetes Engine clusters that can see this zone.
         */
        gkeClusters?: Schema$ManagedZonePrivateVisibilityConfigGKECluster[];
        kind?: string | null;
        /**
         * The list of VPC networks that can see this zone.
         */
        networks?: Schema$ManagedZonePrivateVisibilityConfigNetwork[];
    }
    export interface Schema$ManagedZonePrivateVisibilityConfigGKECluster {
        /**
         * The resource name of the cluster to bind this ManagedZone to. This should be specified in the format like: projects/x/locations/x/clusters/x. This is referenced from GKE projects.locations.clusters.get API: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters/get
         */
        gkeClusterName?: string | null;
        kind?: string | null;
    }
    export interface Schema$ManagedZonePrivateVisibilityConfigNetwork {
        kind?: string | null;
        /**
         * The fully qualified URL of the VPC network to bind to. Format this URL like https://www.googleapis.com/compute/v1/projects/{project\}/global/networks/{network\}
         */
        networkUrl?: string | null;
    }
    export interface Schema$ManagedZoneReverseLookupConfig {
        kind?: string | null;
    }
    /**
     * Contains information about Service Directory-backed zones.
     */
    export interface Schema$ManagedZoneServiceDirectoryConfig {
        kind?: string | null;
        /**
         * Contains information about the namespace associated with the zone.
         */
        namespace?: Schema$ManagedZoneServiceDirectoryConfigNamespace;
    }
    export interface Schema$ManagedZoneServiceDirectoryConfigNamespace {
        /**
         * The time that the namespace backing this zone was deleted; an empty string if it still exists. This is in RFC3339 text format. Output only.
         */
        deletionTime?: string | null;
        kind?: string | null;
        /**
         * The fully qualified URL of the namespace associated with the zone. Format must be https://servicedirectory.googleapis.com/v1/projects/{project\}/locations/{location\}/namespaces/{namespace\}
         */
        namespaceUrl?: string | null;
    }
    export interface Schema$ManagedZonesListResponse {
        header?: Schema$ResponseHeader;
        /**
         * Type of resource.
         */
        kind?: string | null;
        /**
         * The managed zone resources.
         */
        managedZones?: Schema$ManagedZone[];
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token. This lets you the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
    }
    /**
     * An operation represents a successful mutation performed on a Cloud DNS resource. Operations provide: - An audit log of server resource mutations. - A way to recover/retry API calls in the case where the response is never received by the caller. Use the caller specified client_operation_id.
     */
    export interface Schema$Operation {
        /**
         * Only populated if the operation targeted a DnsKey (output only).
         */
        dnsKeyContext?: Schema$OperationDnsKeyContext;
        /**
         * Unique identifier for the resource. This is the client_operation_id if the client specified it when the mutation was initiated, otherwise, it is generated by the server. The name must be 1-63 characters long and match the regular expression [-a-z0-9]? (output only)
         */
        id?: string | null;
        kind?: string | null;
        /**
         * The time that this operation was started by the server. This is in RFC3339 text format (output only).
         */
        startTime?: string | null;
        /**
         * Status of the operation. Can be one of the following: "PENDING" or "DONE" (output only). A status of "DONE" means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.
         */
        status?: string | null;
        /**
         * Type of the operation. Operations include insert, update, and delete (output only).
         */
        type?: string | null;
        /**
         * User who requested the operation, for example: user@example.com. cloud-dns-system for operations automatically done by the system. (output only)
         */
        user?: string | null;
        /**
         * Only populated if the operation targeted a ManagedZone (output only).
         */
        zoneContext?: Schema$OperationManagedZoneContext;
    }
    export interface Schema$OperationDnsKeyContext {
        /**
         * The post-operation DnsKey resource.
         */
        newValue?: Schema$DnsKey;
        /**
         * The pre-operation DnsKey resource.
         */
        oldValue?: Schema$DnsKey;
    }
    export interface Schema$OperationManagedZoneContext {
        /**
         * The post-operation ManagedZone resource.
         */
        newValue?: Schema$ManagedZone;
        /**
         * The pre-operation ManagedZone resource.
         */
        oldValue?: Schema$ManagedZone;
    }
    export interface Schema$PoliciesListResponse {
        header?: Schema$ResponseHeader;
        /**
         * Type of resource.
         */
        kind?: string | null;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token. This lets you the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
        /**
         * The policy resources.
         */
        policies?: Schema$Policy[];
    }
    export interface Schema$PoliciesPatchResponse {
        header?: Schema$ResponseHeader;
        policy?: Schema$Policy;
    }
    export interface Schema$PoliciesUpdateResponse {
        header?: Schema$ResponseHeader;
        policy?: Schema$Policy;
    }
    /**
     * A policy is a collection of DNS rules applied to one or more Virtual Private Cloud resources.
     */
    export interface Schema$Policy {
        /**
         * Sets an alternative name server for the associated networks. When specified, all DNS queries are forwarded to a name server that you choose. Names such as .internal are not available when an alternative name server is specified.
         */
        alternativeNameServerConfig?: Schema$PolicyAlternativeNameServerConfig;
        /**
         * A mutable string of at most 1024 characters associated with this resource for the user's convenience. Has no effect on the policy's function.
         */
        description?: string | null;
        /**
         * Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections. When enabled, a virtual IP address is allocated from each of the subnetworks that are bound to this policy.
         */
        enableInboundForwarding?: boolean | null;
        /**
         * Controls whether logging is enabled for the networks bound to this policy. Defaults to no logging if not set.
         */
        enableLogging?: boolean | null;
        /**
         * Unique identifier for the resource; defined by the server (output only).
         */
        id?: string | null;
        kind?: string | null;
        /**
         * User-assigned name for this policy.
         */
        name?: string | null;
        /**
         * List of network names specifying networks to which this policy is applied.
         */
        networks?: Schema$PolicyNetwork[];
    }
    export interface Schema$PolicyAlternativeNameServerConfig {
        kind?: string | null;
        /**
         * Sets an alternative name server for the associated networks. When specified, all DNS queries are forwarded to a name server that you choose. Names such as .internal are not available when an alternative name server is specified.
         */
        targetNameServers?: Schema$PolicyAlternativeNameServerConfigTargetNameServer[];
    }
    export interface Schema$PolicyAlternativeNameServerConfigTargetNameServer {
        /**
         * Forwarding path for this TargetNameServer. If unset or set to DEFAULT, Cloud DNS makes forwarding decisions based on address ranges; that is, RFC1918 addresses go to the VPC network, non-RFC1918 addresses go to the internet. When set to PRIVATE, Cloud DNS always sends queries through the VPC network for this target.
         */
        forwardingPath?: string | null;
        /**
         * IPv4 address to forward to.
         */
        ipv4Address?: string | null;
        kind?: string | null;
    }
    export interface Schema$PolicyNetwork {
        kind?: string | null;
        /**
         * The fully qualified URL of the VPC network to bind to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project\}/global/networks/{network\}
         */
        networkUrl?: string | null;
    }
    /**
     * A project resource. The project is a top level container for resources including Cloud DNS ManagedZones. Projects can be created only in the APIs console. Next tag: 7.
     */
    export interface Schema$Project {
        /**
         * User assigned unique identifier for the resource (output only).
         */
        id?: string | null;
        kind?: string | null;
        /**
         * Unique numeric identifier for the resource; defined by the server (output only).
         */
        number?: string | null;
        /**
         * Quotas assigned to this project (output only).
         */
        quota?: Schema$Quota;
    }
    /**
     * Limits associated with a Project.
     */
    export interface Schema$Quota {
        /**
         * Maximum allowed number of DnsKeys per ManagedZone.
         */
        dnsKeysPerManagedZone?: number | null;
        /**
         * Maximum allowed number of items per routing policy.
         */
        itemsPerRoutingPolicy?: number | null;
        kind?: string | null;
        /**
         * Maximum allowed number of managed zones in the project.
         */
        managedZones?: number | null;
        /**
         * Maximum allowed number of managed zones which can be attached to a network.
         */
        managedZonesPerNetwork?: number | null;
        /**
         * Maximum allowed number of networks to which a privately scoped zone can be attached.
         */
        networksPerManagedZone?: number | null;
        /**
         * Maximum allowed number of networks per policy.
         */
        networksPerPolicy?: number | null;
        /**
         * Maximum allowed number of consumer peering zones per target network owned by this producer project
         */
        peeringZonesPerTargetNetwork?: number | null;
        /**
         * Maximum allowed number of policies per project.
         */
        policies?: number | null;
        /**
         * Maximum allowed number of ResourceRecords per ResourceRecordSet.
         */
        resourceRecordsPerRrset?: number | null;
        /**
         * Maximum allowed number of ResourceRecordSets to add per ChangesCreateRequest.
         */
        rrsetAdditionsPerChange?: number | null;
        /**
         * Maximum allowed number of ResourceRecordSets to delete per ChangesCreateRequest.
         */
        rrsetDeletionsPerChange?: number | null;
        /**
         * Maximum allowed number of ResourceRecordSets per zone in the project.
         */
        rrsetsPerManagedZone?: number | null;
        /**
         * Maximum allowed number of target name servers per managed forwarding zone.
         */
        targetNameServersPerManagedZone?: number | null;
        /**
         * Maximum allowed number of alternative target name servers per policy.
         */
        targetNameServersPerPolicy?: number | null;
        /**
         * Maximum allowed size for total rrdata in one ChangesCreateRequest in bytes.
         */
        totalRrdataSizePerChange?: number | null;
        /**
         * DNSSEC algorithm and key length types that can be used for DnsKeys.
         */
        whitelistedKeySpecs?: Schema$DnsKeySpec[];
    }
    /**
     * A unit of data that is returned by the DNS servers.
     */
    export interface Schema$ResourceRecordSet {
        kind?: string | null;
        /**
         * For example, www.example.com.
         */
        name?: string | null;
        /**
         * Configures dynamic query responses based on geo location of querying user or a weighted round robin based routing policy. A ResourceRecordSet should only have either rrdata (static) or routing_policy (dynamic). An error is returned otherwise.
         */
        routingPolicy?: Schema$RRSetRoutingPolicy;
        /**
         * As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.
         */
        rrdatas?: string[] | null;
        /**
         * As defined in RFC 4034 (section 3.2).
         */
        signatureRrdatas?: string[] | null;
        /**
         * Number of seconds that this ResourceRecordSet can be cached by resolvers.
         */
        ttl?: number | null;
        /**
         * The identifier of a supported record type. See the list of Supported DNS record types.
         */
        type?: string | null;
    }
    export interface Schema$ResourceRecordSetsListResponse {
        header?: Schema$ResponseHeader;
        /**
         * Type of resource.
         */
        kind?: string | null;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token. This lets you retrieve complete contents of even larger collections, one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
        /**
         * The resource record set resources.
         */
        rrsets?: Schema$ResourceRecordSet[];
    }
    /**
     * Elements common to every response.
     */
    export interface Schema$ResponseHeader {
        /**
         * For mutating operation requests that completed successfully. This is the client_operation_id if the client specified it, otherwise it is generated by the server (output only).
         */
        operationId?: string | null;
    }
    export interface Schema$ResponsePoliciesListResponse {
        header?: Schema$ResponseHeader;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token. This lets you the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
        /**
         * The Response Policy resources.
         */
        responsePolicies?: Schema$ResponsePolicy[];
    }
    export interface Schema$ResponsePoliciesPatchResponse {
        header?: Schema$ResponseHeader;
        responsePolicy?: Schema$ResponsePolicy;
    }
    export interface Schema$ResponsePoliciesUpdateResponse {
        header?: Schema$ResponseHeader;
        responsePolicy?: Schema$ResponsePolicy;
    }
    /**
     * A Response Policy is a collection of selectors that apply to queries made against one or more Virtual Private Cloud networks.
     */
    export interface Schema$ResponsePolicy {
        /**
         * User-provided description for this Response Policy.
         */
        description?: string | null;
        /**
         * The list of Google Kubernetes Engine clusters to which this response policy is applied.
         */
        gkeClusters?: Schema$ResponsePolicyGKECluster[];
        /**
         * Unique identifier for the resource; defined by the server (output only).
         */
        id?: string | null;
        kind?: string | null;
        /**
         * List of network names specifying networks to which this policy is applied.
         */
        networks?: Schema$ResponsePolicyNetwork[];
        /**
         * User assigned name for this Response Policy.
         */
        responsePolicyName?: string | null;
    }
    export interface Schema$ResponsePolicyGKECluster {
        /**
         * The resource name of the cluster to bind this response policy to. This should be specified in the format like: projects/x/locations/x/clusters/x. This is referenced from GKE projects.locations.clusters.get API: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters/get
         */
        gkeClusterName?: string | null;
        kind?: string | null;
    }
    export interface Schema$ResponsePolicyNetwork {
        kind?: string | null;
        /**
         * The fully qualified URL of the VPC network to bind to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project\}/global/networks/{network\}
         */
        networkUrl?: string | null;
    }
    /**
     * A Response Policy Rule is a selector that applies its behavior to queries that match the selector. Selectors are DNS names, which may be wildcards or exact matches. Each DNS query subject to a Response Policy matches at most one ResponsePolicyRule, as identified by the dns_name field with the longest matching suffix.
     */
    export interface Schema$ResponsePolicyRule {
        /**
         * Answer this query with a behavior rather than DNS data.
         */
        behavior?: string | null;
        /**
         * The DNS name (wildcard or exact) to apply this rule to. Must be unique within the Response Policy Rule.
         */
        dnsName?: string | null;
        kind?: string | null;
        /**
         * Answer this query directly with DNS data. These ResourceRecordSets override any other DNS behavior for the matched name; in particular they override private zones, the public internet, and GCP internal DNS. No SOA nor NS types are allowed.
         */
        localData?: Schema$ResponsePolicyRuleLocalData;
        /**
         * An identifier for this rule. Must be unique with the ResponsePolicy.
         */
        ruleName?: string | null;
    }
    export interface Schema$ResponsePolicyRuleLocalData {
        /**
         * All resource record sets for this selector, one per resource record type. The name must match the dns_name.
         */
        localDatas?: Schema$ResourceRecordSet[];
    }
    export interface Schema$ResponsePolicyRulesListResponse {
        header?: Schema$ResponseHeader;
        /**
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token. This lets you the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned are an inconsistent view of the collection. You cannot retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
        /**
         * The Response Policy Rule resources.
         */
        responsePolicyRules?: Schema$ResponsePolicyRule[];
    }
    export interface Schema$ResponsePolicyRulesPatchResponse {
        header?: Schema$ResponseHeader;
        responsePolicyRule?: Schema$ResponsePolicyRule;
    }
    export interface Schema$ResponsePolicyRulesUpdateResponse {
        header?: Schema$ResponseHeader;
        responsePolicyRule?: Schema$ResponsePolicyRule;
    }
    /**
     * A RRSetRoutingPolicy represents ResourceRecordSet data that is returned dynamically with the response varying based on configured properties such as geolocation or by weighted random selection.
     */
    export interface Schema$RRSetRoutingPolicy {
        geo?: Schema$RRSetRoutingPolicyGeoPolicy;
        kind?: string | null;
        wrr?: Schema$RRSetRoutingPolicyWrrPolicy;
    }
    /**
     * Configures a RRSetRoutingPolicy that routes based on the geo location of the querying user.
     */
    export interface Schema$RRSetRoutingPolicyGeoPolicy {
        /**
         * The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.
         */
        items?: Schema$RRSetRoutingPolicyGeoPolicyGeoPolicyItem[];
        kind?: string | null;
    }
    /**
     * ResourceRecordSet data for one geo location.
     */
    export interface Schema$RRSetRoutingPolicyGeoPolicyGeoPolicyItem {
        kind?: string | null;
        /**
         * The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.
         */
        location?: string | null;
        rrdatas?: string[] | null;
        /**
         * DNSSEC generated signatures for all the rrdata within this item. Note that if health checked targets are provided for DNSSEC enabled zones, there's a restriction of 1 ip per item. .
         */
        signatureRrdatas?: string[] | null;
    }
    /**
     * Configures a RRSetRoutingPolicy that routes in a weighted round robin fashion.
     */
    export interface Schema$RRSetRoutingPolicyWrrPolicy {
        items?: Schema$RRSetRoutingPolicyWrrPolicyWrrPolicyItem[];
        kind?: string | null;
    }
    /**
     * A routing block which contains the routing information for one WRR item.
     */
    export interface Schema$RRSetRoutingPolicyWrrPolicyWrrPolicyItem {
        kind?: string | null;
        rrdatas?: string[] | null;
        /**
         * DNSSEC generated signatures for all the rrdata within this item. Note that if health checked targets are provided for DNSSEC enabled zones, there's a restriction of 1 ip per item. .
         */
        signatureRrdatas?: string[] | null;
        /**
         * The weight corresponding to this subset of rrdata. When multiple WeightedRoundRobinPolicyItems are configured, the probability of returning an rrset is proportional to its weight relative to the sum of weights configured for all items. This weight should be non-negative.
         */
        weight?: number | null;
    }
    export class Resource$Changes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Atomically updates the ResourceRecordSet collection.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.changes.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "additions": [],
         *       //   "deletions": [],
         *       //   "id": "my_id",
         *       //   "isServing": false,
         *       //   "kind": "my_kind",
         *       //   "startTime": "my_startTime",
         *       //   "status": "my_status"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "additions": [],
         *   //   "deletions": [],
         *   //   "id": "my_id",
         *   //   "isServing": false,
         *   //   "kind": "my_kind",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status"
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
        create(params: Params$Resource$Changes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Changes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Change>>;
        create(params: Params$Resource$Changes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Changes$Create, options: MethodOptions | BodyResponseCallback<Schema$Change>, callback: BodyResponseCallback<Schema$Change>): void;
        create(params: Params$Resource$Changes$Create, callback: BodyResponseCallback<Schema$Change>): void;
        create(callback: BodyResponseCallback<Schema$Change>): void;
        /**
         * Fetches the representation of an existing Change.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.changes.get({
         *     // The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
         *     changeId: 'placeholder-value',
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "additions": [],
         *   //   "deletions": [],
         *   //   "id": "my_id",
         *   //   "isServing": false,
         *   //   "kind": "my_kind",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status"
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
        get(params: Params$Resource$Changes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Changes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Change>>;
        get(params: Params$Resource$Changes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Changes$Get, options: MethodOptions | BodyResponseCallback<Schema$Change>, callback: BodyResponseCallback<Schema$Change>): void;
        get(params: Params$Resource$Changes$Get, callback: BodyResponseCallback<Schema$Change>): void;
        get(callback: BodyResponseCallback<Schema$Change>): void;
        /**
         * Enumerates Changes to a ResourceRecordSet collection.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.changes.list({
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // Sorting criterion. The only supported value is change sequence.
         *     sortBy: 'placeholder-value',
         *     // Sorting order direction: 'ascending' or 'descending'.
         *     sortOrder: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "changes": [],
         *   //   "header": {},
         *   //   "kind": "my_kind",
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
        list(params: Params$Resource$Changes$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Changes$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ChangesListResponse>>;
        list(params: Params$Resource$Changes$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Changes$List, options: MethodOptions | BodyResponseCallback<Schema$ChangesListResponse>, callback: BodyResponseCallback<Schema$ChangesListResponse>): void;
        list(params: Params$Resource$Changes$List, callback: BodyResponseCallback<Schema$ChangesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ChangesListResponse>): void;
    }
    export interface Params$Resource$Changes$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         *
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Change;
    }
    export interface Params$Resource$Changes$Get extends StandardParameters {
        /**
         * The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
         */
        changeId?: string;
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         *
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Changes$List extends StandardParameters {
        /**
         *
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Sorting criterion. The only supported value is change sequence.
         */
        sortBy?: string;
        /**
         * Sorting order direction: 'ascending' or 'descending'.
         */
        sortOrder?: string;
    }
    export class Resource$Dnskeys {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Fetches the representation of an existing DnsKey.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.dnsKeys.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type is computed and displayed.
         *     digestType: 'placeholder-value',
         *     // The identifier of the requested DnsKey.
         *     dnsKeyId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "algorithm": "my_algorithm",
         *   //   "creationTime": "my_creationTime",
         *   //   "description": "my_description",
         *   //   "digests": [],
         *   //   "id": "my_id",
         *   //   "isActive": false,
         *   //   "keyLength": 0,
         *   //   "keyTag": 0,
         *   //   "kind": "my_kind",
         *   //   "publicKey": "my_publicKey",
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
        get(params: Params$Resource$Dnskeys$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Dnskeys$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DnsKey>>;
        get(params: Params$Resource$Dnskeys$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Dnskeys$Get, options: MethodOptions | BodyResponseCallback<Schema$DnsKey>, callback: BodyResponseCallback<Schema$DnsKey>): void;
        get(params: Params$Resource$Dnskeys$Get, callback: BodyResponseCallback<Schema$DnsKey>): void;
        get(callback: BodyResponseCallback<Schema$DnsKey>): void;
        /**
         * Enumerates DnsKeys to a ResourceRecordSet collection.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.dnsKeys.list({
         *     // An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type is computed and displayed.
         *     digestType: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dnsKeys": [],
         *   //   "header": {},
         *   //   "kind": "my_kind",
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
        list(params: Params$Resource$Dnskeys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Dnskeys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DnsKeysListResponse>>;
        list(params: Params$Resource$Dnskeys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Dnskeys$List, options: MethodOptions | BodyResponseCallback<Schema$DnsKeysListResponse>, callback: BodyResponseCallback<Schema$DnsKeysListResponse>): void;
        list(params: Params$Resource$Dnskeys$List, callback: BodyResponseCallback<Schema$DnsKeysListResponse>): void;
        list(callback: BodyResponseCallback<Schema$DnsKeysListResponse>): void;
    }
    export interface Params$Resource$Dnskeys$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type is computed and displayed.
         */
        digestType?: string;
        /**
         * The identifier of the requested DnsKey.
         */
        dnsKeyId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Dnskeys$List extends StandardParameters {
        /**
         * An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type is computed and displayed.
         */
        digestType?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export class Resource$Managedzoneoperations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Fetches the representation of an existing Operation.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZoneOperations.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request.
         *     managedZone: 'placeholder-value',
         *     // Identifies the operation addressed by this request (ID of the operation).
         *     operation: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dnsKeyContext": {},
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "type": "my_type",
         *   //   "user": "my_user",
         *   //   "zoneContext": {}
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
        get(params: Params$Resource$Managedzoneoperations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedzoneoperations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Managedzoneoperations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedzoneoperations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Managedzoneoperations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Enumerates Operations for the given ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZoneOperations.list({
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // Sorting criterion. The only supported values are START_TIME and ID.
         *     sortBy: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "kind": "my_kind",
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
         * ```
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Managedzoneoperations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedzoneoperations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZoneOperationsListResponse>>;
        list(params: Params$Resource$Managedzoneoperations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedzoneoperations$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedZoneOperationsListResponse>, callback: BodyResponseCallback<Schema$ManagedZoneOperationsListResponse>): void;
        list(params: Params$Resource$Managedzoneoperations$List, callback: BodyResponseCallback<Schema$ManagedZoneOperationsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedZoneOperationsListResponse>): void;
    }
    export interface Params$Resource$Managedzoneoperations$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request.
         */
        managedZone?: string;
        /**
         * Identifies the operation addressed by this request (ID of the operation).
         */
        operation?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Managedzoneoperations$List extends StandardParameters {
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Sorting criterion. The only supported values are START_TIME and ID.
         */
        sortBy?: string;
    }
    export class Resource$Managedzones {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cloudLoggingConfig": {},
         *       //   "creationTime": "my_creationTime",
         *       //   "description": "my_description",
         *       //   "dnsName": "my_dnsName",
         *       //   "dnssecConfig": {},
         *       //   "forwardingConfig": {},
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "nameServerSet": "my_nameServerSet",
         *       //   "nameServers": [],
         *       //   "peeringConfig": {},
         *       //   "privateVisibilityConfig": {},
         *       //   "reverseLookupConfig": {},
         *       //   "serviceDirectoryConfig": {},
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cloudLoggingConfig": {},
         *   //   "creationTime": "my_creationTime",
         *   //   "description": "my_description",
         *   //   "dnsName": "my_dnsName",
         *   //   "dnssecConfig": {},
         *   //   "forwardingConfig": {},
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "labels": {},
         *   //   "name": "my_name",
         *   //   "nameServerSet": "my_nameServerSet",
         *   //   "nameServers": [],
         *   //   "peeringConfig": {},
         *   //   "privateVisibilityConfig": {},
         *   //   "reverseLookupConfig": {},
         *   //   "serviceDirectoryConfig": {},
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
        create(params: Params$Resource$Managedzones$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Managedzones$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZone>>;
        create(params: Params$Resource$Managedzones$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Managedzones$Create, options: MethodOptions | BodyResponseCallback<Schema$ManagedZone>, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        create(params: Params$Resource$Managedzones$Create, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        create(callback: BodyResponseCallback<Schema$ManagedZone>): void;
        /**
         * Deletes a previously created ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.delete({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Managedzones$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Managedzones$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Managedzones$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Managedzones$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Managedzones$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Fetches the representation of an existing ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "cloudLoggingConfig": {},
         *   //   "creationTime": "my_creationTime",
         *   //   "description": "my_description",
         *   //   "dnsName": "my_dnsName",
         *   //   "dnssecConfig": {},
         *   //   "forwardingConfig": {},
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "labels": {},
         *   //   "name": "my_name",
         *   //   "nameServerSet": "my_nameServerSet",
         *   //   "nameServers": [],
         *   //   "peeringConfig": {},
         *   //   "privateVisibilityConfig": {},
         *   //   "reverseLookupConfig": {},
         *   //   "serviceDirectoryConfig": {},
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
        get(params: Params$Resource$Managedzones$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedzones$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZone>>;
        get(params: Params$Resource$Managedzones$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedzones$Get, options: MethodOptions | BodyResponseCallback<Schema$ManagedZone>, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        get(params: Params$Resource$Managedzones$Get, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        get(callback: BodyResponseCallback<Schema$ManagedZone>): void;
        /**
         * Enumerates ManagedZones that have been created but not yet deleted.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.list({
         *     // Restricts the list to return only zones with this domain name.
         *     dnsName: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "kind": "my_kind",
         *   //   "managedZones": [],
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
        list(params: Params$Resource$Managedzones$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedzones$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZonesListResponse>>;
        list(params: Params$Resource$Managedzones$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedzones$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedZonesListResponse>, callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        list(params: Params$Resource$Managedzones$List, callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        /**
         * Applies a partial update to an existing ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.patch({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cloudLoggingConfig": {},
         *       //   "creationTime": "my_creationTime",
         *       //   "description": "my_description",
         *       //   "dnsName": "my_dnsName",
         *       //   "dnssecConfig": {},
         *       //   "forwardingConfig": {},
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "nameServerSet": "my_nameServerSet",
         *       //   "nameServers": [],
         *       //   "peeringConfig": {},
         *       //   "privateVisibilityConfig": {},
         *       //   "reverseLookupConfig": {},
         *       //   "serviceDirectoryConfig": {},
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dnsKeyContext": {},
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "type": "my_type",
         *   //   "user": "my_user",
         *   //   "zoneContext": {}
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
        patch(params: Params$Resource$Managedzones$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Managedzones$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Managedzones$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Managedzones$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Managedzones$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Updates an existing ManagedZone.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.managedZones.update({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "cloudLoggingConfig": {},
         *       //   "creationTime": "my_creationTime",
         *       //   "description": "my_description",
         *       //   "dnsName": "my_dnsName",
         *       //   "dnssecConfig": {},
         *       //   "forwardingConfig": {},
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "labels": {},
         *       //   "name": "my_name",
         *       //   "nameServerSet": "my_nameServerSet",
         *       //   "nameServers": [],
         *       //   "peeringConfig": {},
         *       //   "privateVisibilityConfig": {},
         *       //   "reverseLookupConfig": {},
         *       //   "serviceDirectoryConfig": {},
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "dnsKeyContext": {},
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "startTime": "my_startTime",
         *   //   "status": "my_status",
         *   //   "type": "my_type",
         *   //   "user": "my_user",
         *   //   "zoneContext": {}
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
        update(params: Params$Resource$Managedzones$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Managedzones$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        update(params: Params$Resource$Managedzones$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Managedzones$Update, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        update(params: Params$Resource$Managedzones$Update, callback: BodyResponseCallback<Schema$Operation>): void;
        update(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Managedzones$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagedZone;
    }
    export interface Params$Resource$Managedzones$Delete extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Managedzones$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Managedzones$List extends StandardParameters {
        /**
         * Restricts the list to return only zones with this domain name.
         */
        dnsName?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Managedzones$Patch extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagedZone;
    }
    export interface Params$Resource$Managedzones$Update extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagedZone;
    }
    export class Resource$Policies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "alternativeNameServerConfig": {},
         *       //   "description": "my_description",
         *       //   "enableInboundForwarding": false,
         *       //   "enableLogging": false,
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "networks": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "alternativeNameServerConfig": {},
         *   //   "description": "my_description",
         *   //   "enableInboundForwarding": false,
         *   //   "enableLogging": false,
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
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
        create(params: Params$Resource$Policies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Policies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        create(params: Params$Resource$Policies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Policies$Create, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        create(params: Params$Resource$Policies$Create, callback: BodyResponseCallback<Schema$Policy>): void;
        create(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Deletes a previously created Policy. Fails if the policy is still being referenced by a network.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.delete({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // User given friendly name of the policy addressed by this request.
         *     policy: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Policies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Policies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Policies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Policies$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Policies$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Fetches the representation of an existing Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // User given friendly name of the policy addressed by this request.
         *     policy: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "alternativeNameServerConfig": {},
         *   //   "description": "my_description",
         *   //   "enableInboundForwarding": false,
         *   //   "enableLogging": false,
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
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
        get(params: Params$Resource$Policies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Policies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        get(params: Params$Resource$Policies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Policies$Get, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        get(params: Params$Resource$Policies$Get, callback: BodyResponseCallback<Schema$Policy>): void;
        get(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * Enumerates all Policies associated with a project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.list({
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "policies": []
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
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PoliciesListResponse>>;
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$PoliciesListResponse>, callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        list(params: Params$Resource$Policies$List, callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        /**
         * Applies a partial update to an existing Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.patch({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // User given friendly name of the policy addressed by this request.
         *     policy: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "alternativeNameServerConfig": {},
         *       //   "description": "my_description",
         *       //   "enableInboundForwarding": false,
         *       //   "enableLogging": false,
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "networks": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "policy": {}
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
        patch(params: Params$Resource$Policies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Policies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PoliciesPatchResponse>>;
        patch(params: Params$Resource$Policies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Policies$Patch, options: MethodOptions | BodyResponseCallback<Schema$PoliciesPatchResponse>, callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        patch(params: Params$Resource$Policies$Patch, callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        patch(callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        /**
         * Updates an existing Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.update({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // User given friendly name of the policy addressed by this request.
         *     policy: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "alternativeNameServerConfig": {},
         *       //   "description": "my_description",
         *       //   "enableInboundForwarding": false,
         *       //   "enableLogging": false,
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "networks": []
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "policy": {}
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
        update(params: Params$Resource$Policies$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Policies$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PoliciesUpdateResponse>>;
        update(params: Params$Resource$Policies$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Policies$Update, options: MethodOptions | BodyResponseCallback<Schema$PoliciesUpdateResponse>, callback: BodyResponseCallback<Schema$PoliciesUpdateResponse>): void;
        update(params: Params$Resource$Policies$Update, callback: BodyResponseCallback<Schema$PoliciesUpdateResponse>): void;
        update(callback: BodyResponseCallback<Schema$PoliciesUpdateResponse>): void;
    }
    export interface Params$Resource$Policies$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Policy;
    }
    export interface Params$Resource$Policies$Delete extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * User given friendly name of the policy addressed by this request.
         */
        policy?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Policies$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * User given friendly name of the policy addressed by this request.
         */
        policy?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Policies$List extends StandardParameters {
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Policies$Patch extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * User given friendly name of the policy addressed by this request.
         */
        policy?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Policy;
    }
    export interface Params$Resource$Policies$Update extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * User given friendly name of the policy addressed by this request.
         */
        policy?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Policy;
    }
    export class Resource$Projects {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Fetches the representation of an existing Project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.projects.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "number": "my_number",
         *   //   "quota": {}
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
        get(params: Params$Resource$Projects$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Projects$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Project>>;
        get(params: Params$Resource$Projects$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Projects$Get, options: MethodOptions | BodyResponseCallback<Schema$Project>, callback: BodyResponseCallback<Schema$Project>): void;
        get(params: Params$Resource$Projects$Get, callback: BodyResponseCallback<Schema$Project>): void;
        get(callback: BodyResponseCallback<Schema$Project>): void;
    }
    export interface Params$Resource$Projects$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         *
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export class Resource$Resourcerecordsets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new ResourceRecordSet.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.resourceRecordSets.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "routingPolicy": {},
         *       //   "rrdatas": [],
         *       //   "signatureRrdatas": [],
         *       //   "ttl": 0,
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "routingPolicy": {},
         *   //   "rrdatas": [],
         *   //   "signatureRrdatas": [],
         *   //   "ttl": 0,
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
        create(params: Params$Resource$Resourcerecordsets$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Resourcerecordsets$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResourceRecordSet>>;
        create(params: Params$Resource$Resourcerecordsets$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Resourcerecordsets$Create, options: MethodOptions | BodyResponseCallback<Schema$ResourceRecordSet>, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        create(params: Params$Resource$Resourcerecordsets$Create, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        create(callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        /**
         * Deletes a previously created ResourceRecordSet.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.resourceRecordSets.delete({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Fully qualified domain name.
         *     name: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // RRSet type.
         *     type: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Resourcerecordsets$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Resourcerecordsets$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Resourcerecordsets$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Resourcerecordsets$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Resourcerecordsets$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Fetches the representation of an existing ResourceRecordSet.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.resourceRecordSets.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Fully qualified domain name.
         *     name: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // RRSet type.
         *     type: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "routingPolicy": {},
         *   //   "rrdatas": [],
         *   //   "signatureRrdatas": [],
         *   //   "ttl": 0,
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
        get(params: Params$Resource$Resourcerecordsets$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Resourcerecordsets$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResourceRecordSet>>;
        get(params: Params$Resource$Resourcerecordsets$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Resourcerecordsets$Get, options: MethodOptions | BodyResponseCallback<Schema$ResourceRecordSet>, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        get(params: Params$Resource$Resourcerecordsets$Get, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        get(callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        /**
         * Enumerates ResourceRecordSets that you have created but not yet deleted.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.resourceRecordSets.list({
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Restricts the list to return only records with this fully qualified domain name.
         *     name: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // Restricts the list to return only records of this type. If present, the "name" parameter must also be present.
         *     type: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "kind": "my_kind",
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "rrsets": []
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
        list(params: Params$Resource$Resourcerecordsets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Resourcerecordsets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResourceRecordSetsListResponse>>;
        list(params: Params$Resource$Resourcerecordsets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Resourcerecordsets$List, options: MethodOptions | BodyResponseCallback<Schema$ResourceRecordSetsListResponse>, callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
        list(params: Params$Resource$Resourcerecordsets$List, callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
        /**
         * Applies a partial update to an existing ResourceRecordSet.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.resourceRecordSets.patch({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         *     managedZone: 'placeholder-value',
         *     // Fully qualified domain name.
         *     name: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // RRSet type.
         *     type: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "kind": "my_kind",
         *       //   "name": "my_name",
         *       //   "routingPolicy": {},
         *       //   "rrdatas": [],
         *       //   "signatureRrdatas": [],
         *       //   "ttl": 0,
         *       //   "type": "my_type"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "kind": "my_kind",
         *   //   "name": "my_name",
         *   //   "routingPolicy": {},
         *   //   "rrdatas": [],
         *   //   "signatureRrdatas": [],
         *   //   "ttl": 0,
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
        patch(params: Params$Resource$Resourcerecordsets$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Resourcerecordsets$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResourceRecordSet>>;
        patch(params: Params$Resource$Resourcerecordsets$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Resourcerecordsets$Patch, options: MethodOptions | BodyResponseCallback<Schema$ResourceRecordSet>, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        patch(params: Params$Resource$Resourcerecordsets$Patch, callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
        patch(callback: BodyResponseCallback<Schema$ResourceRecordSet>): void;
    }
    export interface Params$Resource$Resourcerecordsets$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResourceRecordSet;
    }
    export interface Params$Resource$Resourcerecordsets$Delete extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Fully qualified domain name.
         */
        name?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * RRSet type.
         */
        type?: string;
    }
    export interface Params$Resource$Resourcerecordsets$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Fully qualified domain name.
         */
        name?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * RRSet type.
         */
        type?: string;
    }
    export interface Params$Resource$Resourcerecordsets$List extends StandardParameters {
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Restricts the list to return only records with this fully qualified domain name.
         */
        name?: string;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Restricts the list to return only records of this type. If present, the "name" parameter must also be present.
         */
        type?: string;
    }
    export interface Params$Resource$Resourcerecordsets$Patch extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or ID.
         */
        managedZone?: string;
        /**
         * Fully qualified domain name.
         */
        name?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * RRSet type.
         */
        type?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResourceRecordSet;
    }
    export class Resource$Responsepolicies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Response Policy
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource, only applicable in the v APIs. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "gkeClusters": [],
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "networks": [],
         *       //   "responsePolicyName": "my_responsePolicyName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "gkeClusters": [],
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "networks": [],
         *   //   "responsePolicyName": "my_responsePolicyName"
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
        create(params: Params$Resource$Responsepolicies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Responsepolicies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicy>>;
        create(params: Params$Resource$Responsepolicies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Responsepolicies$Create, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicy>, callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        create(params: Params$Resource$Responsepolicies$Create, callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        create(callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        /**
         * Deletes a previously created Response Policy. Fails if the response policy is non-empty or still being referenced by a network.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.delete({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy addressed by this request.
         *     responsePolicy: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Responsepolicies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Responsepolicies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Responsepolicies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Responsepolicies$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Responsepolicies$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Fetches the representation of an existing Response Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy addressed by this request.
         *     responsePolicy: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "description": "my_description",
         *   //   "gkeClusters": [],
         *   //   "id": "my_id",
         *   //   "kind": "my_kind",
         *   //   "networks": [],
         *   //   "responsePolicyName": "my_responsePolicyName"
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
        get(params: Params$Resource$Responsepolicies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Responsepolicies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicy>>;
        get(params: Params$Resource$Responsepolicies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Responsepolicies$Get, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicy>, callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        get(params: Params$Resource$Responsepolicies$Get, callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        get(callback: BodyResponseCallback<Schema$ResponsePolicy>): void;
        /**
         * Enumerates all Response Policies associated with a project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.list({
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "responsePolicies": []
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
        list(params: Params$Resource$Responsepolicies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Responsepolicies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePoliciesListResponse>>;
        list(params: Params$Resource$Responsepolicies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Responsepolicies$List, options: MethodOptions | BodyResponseCallback<Schema$ResponsePoliciesListResponse>, callback: BodyResponseCallback<Schema$ResponsePoliciesListResponse>): void;
        list(params: Params$Resource$Responsepolicies$List, callback: BodyResponseCallback<Schema$ResponsePoliciesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ResponsePoliciesListResponse>): void;
        /**
         * Applies a partial update to an existing Response Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.patch({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Respones Policy addressed by this request.
         *     responsePolicy: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "gkeClusters": [],
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "networks": [],
         *       //   "responsePolicyName": "my_responsePolicyName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "responsePolicy": {}
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
        patch(params: Params$Resource$Responsepolicies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Responsepolicies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePoliciesPatchResponse>>;
        patch(params: Params$Resource$Responsepolicies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Responsepolicies$Patch, options: MethodOptions | BodyResponseCallback<Schema$ResponsePoliciesPatchResponse>, callback: BodyResponseCallback<Schema$ResponsePoliciesPatchResponse>): void;
        patch(params: Params$Resource$Responsepolicies$Patch, callback: BodyResponseCallback<Schema$ResponsePoliciesPatchResponse>): void;
        patch(callback: BodyResponseCallback<Schema$ResponsePoliciesPatchResponse>): void;
        /**
         * Updates an existing Response Policy.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicies.update({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy addressed by this request.
         *     responsePolicy: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "description": "my_description",
         *       //   "gkeClusters": [],
         *       //   "id": "my_id",
         *       //   "kind": "my_kind",
         *       //   "networks": [],
         *       //   "responsePolicyName": "my_responsePolicyName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "responsePolicy": {}
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
        update(params: Params$Resource$Responsepolicies$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Responsepolicies$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePoliciesUpdateResponse>>;
        update(params: Params$Resource$Responsepolicies$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Responsepolicies$Update, options: MethodOptions | BodyResponseCallback<Schema$ResponsePoliciesUpdateResponse>, callback: BodyResponseCallback<Schema$ResponsePoliciesUpdateResponse>): void;
        update(params: Params$Resource$Responsepolicies$Update, callback: BodyResponseCallback<Schema$ResponsePoliciesUpdateResponse>): void;
        update(callback: BodyResponseCallback<Schema$ResponsePoliciesUpdateResponse>): void;
    }
    export interface Params$Resource$Responsepolicies$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource, only applicable in the v APIs. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicy;
    }
    export interface Params$Resource$Responsepolicies$Delete extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy addressed by this request.
         */
        responsePolicy?: string;
    }
    export interface Params$Resource$Responsepolicies$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy addressed by this request.
         */
        responsePolicy?: string;
    }
    export interface Params$Resource$Responsepolicies$List extends StandardParameters {
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Responsepolicies$Patch extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Respones Policy addressed by this request.
         */
        responsePolicy?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicy;
    }
    export interface Params$Resource$Responsepolicies$Update extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy addressed by this request.
         */
        responsePolicy?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicy;
    }
    export class Resource$Responsepolicyrules {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates a new Response Policy Rule.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.create({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy containing the Response Policy Rule.
         *     responsePolicy: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "behavior": "my_behavior",
         *       //   "dnsName": "my_dnsName",
         *       //   "kind": "my_kind",
         *       //   "localData": {},
         *       //   "ruleName": "my_ruleName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "behavior": "my_behavior",
         *   //   "dnsName": "my_dnsName",
         *   //   "kind": "my_kind",
         *   //   "localData": {},
         *   //   "ruleName": "my_ruleName"
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
        create(params: Params$Resource$Responsepolicyrules$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Responsepolicyrules$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicyRule>>;
        create(params: Params$Resource$Responsepolicyrules$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Responsepolicyrules$Create, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicyRule>, callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        create(params: Params$Resource$Responsepolicyrules$Create, callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        create(callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        /**
         * Deletes a previously created Response Policy Rule.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.delete({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy containing the Response Policy Rule.
         *     responsePolicy: 'placeholder-value',
         *     // User assigned name of the Response Policy Rule addressed by this request.
         *     responsePolicyRule: 'placeholder-value',
         *   });
         *   console.log(res.data);
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
        delete(params: Params$Resource$Responsepolicyrules$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Responsepolicyrules$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Responsepolicyrules$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Responsepolicyrules$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Responsepolicyrules$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Fetches the representation of an existing Response Policy Rule.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.get({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy containing the Response Policy Rule.
         *     responsePolicy: 'placeholder-value',
         *     // User assigned name of the Response Policy Rule addressed by this request.
         *     responsePolicyRule: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "behavior": "my_behavior",
         *   //   "dnsName": "my_dnsName",
         *   //   "kind": "my_kind",
         *   //   "localData": {},
         *   //   "ruleName": "my_ruleName"
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
        get(params: Params$Resource$Responsepolicyrules$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Responsepolicyrules$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicyRule>>;
        get(params: Params$Resource$Responsepolicyrules$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Responsepolicyrules$Get, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicyRule>, callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        get(params: Params$Resource$Responsepolicyrules$Get, callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        get(callback: BodyResponseCallback<Schema$ResponsePolicyRule>): void;
        /**
         * Enumerates all Response Policy Rules associated with a project.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/cloud-platform.read-only',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readonly',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.list({
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy to list.
         *     responsePolicy: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "nextPageToken": "my_nextPageToken",
         *   //   "responsePolicyRules": []
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
        list(params: Params$Resource$Responsepolicyrules$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Responsepolicyrules$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicyRulesListResponse>>;
        list(params: Params$Resource$Responsepolicyrules$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Responsepolicyrules$List, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicyRulesListResponse>, callback: BodyResponseCallback<Schema$ResponsePolicyRulesListResponse>): void;
        list(params: Params$Resource$Responsepolicyrules$List, callback: BodyResponseCallback<Schema$ResponsePolicyRulesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ResponsePolicyRulesListResponse>): void;
        /**
         * Applies a partial update to an existing Response Policy Rule.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.patch({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy containing the Response Policy Rule.
         *     responsePolicy: 'placeholder-value',
         *     // User assigned name of the Response Policy Rule addressed by this request.
         *     responsePolicyRule: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "behavior": "my_behavior",
         *       //   "dnsName": "my_dnsName",
         *       //   "kind": "my_kind",
         *       //   "localData": {},
         *       //   "ruleName": "my_ruleName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "responsePolicyRule": {}
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
        patch(params: Params$Resource$Responsepolicyrules$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Responsepolicyrules$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicyRulesPatchResponse>>;
        patch(params: Params$Resource$Responsepolicyrules$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Responsepolicyrules$Patch, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicyRulesPatchResponse>, callback: BodyResponseCallback<Schema$ResponsePolicyRulesPatchResponse>): void;
        patch(params: Params$Resource$Responsepolicyrules$Patch, callback: BodyResponseCallback<Schema$ResponsePolicyRulesPatchResponse>): void;
        patch(callback: BodyResponseCallback<Schema$ResponsePolicyRulesPatchResponse>): void;
        /**
         * Updates an existing Response Policy Rule.
         * @example
         * ```js
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [
         *       'https://www.googleapis.com/auth/cloud-platform',
         *       'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
         *     ],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.responsePolicyRules.update({
         *     // For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         *     location: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // User assigned name of the Response Policy containing the Response Policy Rule.
         *     responsePolicy: 'placeholder-value',
         *     // User assigned name of the Response Policy Rule addressed by this request.
         *     responsePolicyRule: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
         *       //   "behavior": "my_behavior",
         *       //   "dnsName": "my_dnsName",
         *       //   "kind": "my_kind",
         *       //   "localData": {},
         *       //   "ruleName": "my_ruleName"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "header": {},
         *   //   "responsePolicyRule": {}
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
        update(params: Params$Resource$Responsepolicyrules$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Responsepolicyrules$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResponsePolicyRulesUpdateResponse>>;
        update(params: Params$Resource$Responsepolicyrules$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Responsepolicyrules$Update, options: MethodOptions | BodyResponseCallback<Schema$ResponsePolicyRulesUpdateResponse>, callback: BodyResponseCallback<Schema$ResponsePolicyRulesUpdateResponse>): void;
        update(params: Params$Resource$Responsepolicyrules$Update, callback: BodyResponseCallback<Schema$ResponsePolicyRulesUpdateResponse>): void;
        update(callback: BodyResponseCallback<Schema$ResponsePolicyRulesUpdateResponse>): void;
    }
    export interface Params$Resource$Responsepolicyrules$Create extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy containing the Response Policy Rule.
         */
        responsePolicy?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicyRule;
    }
    export interface Params$Resource$Responsepolicyrules$Delete extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy containing the Response Policy Rule.
         */
        responsePolicy?: string;
        /**
         * User assigned name of the Response Policy Rule addressed by this request.
         */
        responsePolicyRule?: string;
    }
    export interface Params$Resource$Responsepolicyrules$Get extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy containing the Response Policy Rule.
         */
        responsePolicy?: string;
        /**
         * User assigned name of the Response Policy Rule addressed by this request.
         */
        responsePolicyRule?: string;
    }
    export interface Params$Resource$Responsepolicyrules$List extends StandardParameters {
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.
         */
        maxResults?: number;
        /**
         * Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         */
        pageToken?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy to list.
         */
        responsePolicy?: string;
    }
    export interface Params$Resource$Responsepolicyrules$Patch extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy containing the Response Policy Rule.
         */
        responsePolicy?: string;
        /**
         * User assigned name of the Response Policy Rule addressed by this request.
         */
        responsePolicyRule?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicyRule;
    }
    export interface Params$Resource$Responsepolicyrules$Update extends StandardParameters {
        /**
         * For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         */
        clientOperationId?: string;
        /**
         * Specifies the location of the resource. This information will be used for routing and will be part of the resource name.
         */
        location?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
        /**
         * User assigned name of the Response Policy containing the Response Policy Rule.
         */
        responsePolicy?: string;
        /**
         * User assigned name of the Response Policy Rule addressed by this request.
         */
        responsePolicyRule?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ResponsePolicyRule;
    }
    export {};
}
