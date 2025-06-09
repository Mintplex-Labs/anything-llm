import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace dns_v2beta1 {
    export interface Options extends GlobalOptions {
        version: 'v2beta1';
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
     * Cloud DNS API
     *
     *
     *
     * @example
     * const {google} = require('googleapis');
     * const dns = google.dns('v2beta1');
     *
     * @namespace dns
     * @type {Function}
     * @version v2beta1
     * @variation v2beta1
     * @param {object=} options Options for Dns
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
         * Status of the operation (output only). A status of &quot;done&quot; means that the request to update the authoritative servers has been sent but the servers might not be updated yet.
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a &quot;snapshot&quot; of collections larger than the maximum page size.
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
         * A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the resource&#39;s function.
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
         * Active keys will be used to sign subsequent changes to the ManagedZone. Inactive keys will still be present as DNSKEY Resource Records for the use of resolvers validating existing signatures.
         */
        isActive?: boolean | null;
        /**
         * Length of the key in bits. Specified at creation time then immutable.
         */
        keyLength?: number | null;
        /**
         * The key tag is a non-cryptographic hash of the a DNSKEY resource record associated with this DnsKey. The key tag can be used to identify a DNSKEY more quickly (but it is not a unique identifier). In particular, the key tag is used in a parent zone&#39;s DS record to point at the DNSKEY in this child ManagedZone. The key tag is a number in the range [0, 65535] and the algorithm to calculate it is specified in RFC4034 Appendix B. Output only.
         */
        keyTag?: number | null;
        kind?: string | null;
        /**
         * Base64 encoded public half of this key. Output only.
         */
        publicKey?: string | null;
        /**
         * One of &quot;KEY_SIGNING&quot; or &quot;ZONE_SIGNING&quot;. Keys of type KEY_SIGNING have the Secure Entry Point flag set and, when active, will be used to sign only resource record sets of type DNSKEY. Otherwise, the Secure Entry Point flag will be cleared and this key will be used to sign only resource record sets of other types. Immutable after creation time.
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a &quot;snapshot&quot; of collections larger than the maximum page size.
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
         * Specifies whether this is a key signing key (KSK) or a zone signing key (ZSK). Key signing keys have the Secure Entry Point flag set and, when active, will only be used to sign resource record sets of type DNSKEY. Zone signing keys do not have the Secure Entry Point flag set and will be used to sign all other types of resource record sets.
         */
        keyType?: string | null;
        kind?: string | null;
    }
    /**
     * A zone is a subtree of the DNS namespace under one administrative responsibility. A ManagedZone is a resource that represents a DNS zone hosted by the Cloud DNS service.
     */
    export interface Schema$ManagedZone {
        /**
         * The time that this resource was created on the server. This is in RFC3339 text format. Output only.
         */
        creationTime?: string | null;
        /**
         * A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the managed zone&#39;s function.
         */
        description?: string | null;
        /**
         * The DNS name of this managed zone, for instance &quot;example.com.&quot;.
         */
        dnsName?: string | null;
        /**
         * DNSSEC configuration.
         */
        dnssecConfig?: Schema$ManagedZoneDnsSecConfig;
        /**
         * The presence for this field indicates that outbound forwarding is enabled for this zone.  The value of this field contains the set of destinations to forward to.
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
         * Optionally specifies the NameServerSet for this ManagedZone. A NameServerSet is a set of DNS name servers that all host the same ManagedZones. Most users will leave this field unset.
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
         * The presence of this field indicates that this is a managed reverse lookup zone and Cloud DNS will resolve reverse lookup queries using automatically configured records for VPC resources. This only applies to networks listed under private_visibility_config.
         */
        reverseLookupConfig?: Schema$ManagedZoneReverseLookupConfig;
        /**
         * The zone&#39;s visibility: public zones are exposed to the Internet, while private zones are visible only to Virtual Private Cloud resources.
         */
        visibility?: string | null;
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
         * List of target name servers to forward to. Cloud DNS will select the best available name server if more than one target is given.
         */
        targetNameServers?: Schema$ManagedZoneForwardingConfigNameServerTarget[];
    }
    export interface Schema$ManagedZoneForwardingConfigNameServerTarget {
        /**
         * Forwarding path for this NameServerTarget. If unset or set to DEFAULT, Cloud DNS will make forwarding decision based on address ranges, i.e. RFC1918 addresses go to the VPC, non-RFC1918 addresses go to the Internet. When set to PRIVATE, Cloud DNS will always send queries through VPC for this target.
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
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
         * The fully qualified URL of the VPC network to forward queries to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}
         */
        networkUrl?: string | null;
    }
    export interface Schema$ManagedZonePrivateVisibilityConfig {
        kind?: string | null;
        /**
         * The list of VPC networks that can see this zone.
         */
        networks?: Schema$ManagedZonePrivateVisibilityConfigNetwork[];
    }
    export interface Schema$ManagedZonePrivateVisibilityConfigNetwork {
        kind?: string | null;
        /**
         * The fully qualified URL of the VPC network to bind to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}
         */
        networkUrl?: string | null;
    }
    export interface Schema$ManagedZoneReverseLookupConfig {
        kind?: string | null;
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
         */
        nextPageToken?: string | null;
    }
    /**
     * An operation represents a successful mutation performed on a Cloud DNS resource. Operations provide: - An audit log of server resource mutations. - A way to recover/retry API calls in the case where the response is never   received by the caller. Use the caller specified client_operation_id.
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
         * Status of the operation. Can be one of the following: &quot;PENDING&quot; or &quot;DONE&quot; (output only). A status of &quot;DONE&quot; means that the request to update the authoritative servers has been sent, but the servers might not be updated yet.
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your page token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
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
         * A mutable string of at most 1024 characters associated with this resource for the user&#39;s convenience. Has no effect on the policy&#39;s function.
         */
        description?: string | null;
        /**
         * Allows networks bound to this policy to receive DNS queries sent by VMs or applications over VPN connections. When enabled, a virtual IP address will be allocated from each of the sub-networks that are bound to this policy.
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
         * User assigned name for this policy.
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
         * Forwarding path for this TargetNameServer. If unset or set to DEFAULT, Cloud DNS will make forwarding decision based on address ranges, i.e. RFC1918 addresses go to the VPC, non-RFC1918 addresses go to the Internet. When set to PRIVATE, Cloud DNS will always send queries through VPC for this target.
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
         * The fully qualified URL of the VPC network to bind to. This should be formatted like https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}
         */
        networkUrl?: string | null;
    }
    /**
     * A project resource. The project is a top level container for resources including Cloud DNS ManagedZones. Projects can be created only in the APIs console.
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
     * A unit of data that will be returned by the DNS servers.
     */
    export interface Schema$ResourceRecordSet {
        kind?: string | null;
        /**
         * For example, www.example.com.
         */
        name?: string | null;
        /**
         * As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see &lt;a href=&quot;/dns/records/json-record&quot;&gt;examples&lt;/a&gt;.
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
         * The identifier of a supported record type. See the list of &lt;a href=&quot;/dns/docs/overview#supported_dns_record_types&quot;&gt;Supported DNS record types&lt;/a&gt;.
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
         * The presence of this field indicates that there exist more results following your last page of results in pagination order. To fetch them, make another list request using this value as your pagination token.  In this way you can retrieve the complete contents of even very large collections one page at a time. However, if the contents of the collection change between the first and last paginated list request, the set of all elements returned will be an inconsistent view of the collection. There is no way to retrieve a consistent snapshot of a collection larger than the maximum page size.
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
    export class Resource$Changes {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * dns.changes.create
         * @desc Atomically update the ResourceRecordSet collection.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
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
         * @alias dns.changes.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().Change} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Changes$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Changes$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Change>>;
        create(params: Params$Resource$Changes$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Changes$Create, options: MethodOptions | BodyResponseCallback<Schema$Change>, callback: BodyResponseCallback<Schema$Change>): void;
        create(params: Params$Resource$Changes$Create, callback: BodyResponseCallback<Schema$Change>): void;
        create(callback: BodyResponseCallback<Schema$Change>): void;
        /**
         * dns.changes.get
         * @desc Fetch the representation of an existing Change.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // The identifier of the requested change, from a previous
         *     // ResourceRecordSetsChangeResponse.
         *     changeId: 'placeholder-value',
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
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
         * @alias dns.changes.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.changeId The identifier of the requested change, from a previous ResourceRecordSetsChangeResponse.
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Changes$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Changes$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Change>>;
        get(params: Params$Resource$Changes$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Changes$Get, options: MethodOptions | BodyResponseCallback<Schema$Change>, callback: BodyResponseCallback<Schema$Change>): void;
        get(params: Params$Resource$Changes$Get, callback: BodyResponseCallback<Schema$Change>): void;
        get(callback: BodyResponseCallback<Schema$Change>): void;
        /**
         * dns.changes.list
         * @desc Enumerate Changes to a ResourceRecordSet collection.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
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
         * @alias dns.changes.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {string=} params.sortBy Sorting criterion. The only supported value is change sequence.
         * @param {string=} params.sortOrder Sorting order direction: 'ascending' or 'descending'.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Changes$List extends StandardParameters {
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
         * dns.dnsKeys.get
         * @desc Fetch the representation of an existing DnsKey.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // An optional comma-separated list of digest types to compute and display
         *     // for key signing keys. If omitted, the recommended digest type will be
         *     // computed and displayed.
         *     digestType: 'placeholder-value',
         *     // The identifier of the requested DnsKey.
         *     dnsKeyId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
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
         * @alias dns.dnsKeys.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string=} params.digestType An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
         * @param {string} params.dnsKeyId The identifier of the requested DnsKey.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Dnskeys$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Dnskeys$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DnsKey>>;
        get(params: Params$Resource$Dnskeys$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Dnskeys$Get, options: MethodOptions | BodyResponseCallback<Schema$DnsKey>, callback: BodyResponseCallback<Schema$DnsKey>): void;
        get(params: Params$Resource$Dnskeys$Get, callback: BodyResponseCallback<Schema$DnsKey>): void;
        get(callback: BodyResponseCallback<Schema$DnsKey>): void;
        /**
         * dns.dnsKeys.list
         * @desc Enumerate DnsKeys to a ResourceRecordSet collection.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // An optional comma-separated list of digest types to compute and display
         *     // for key signing keys. If omitted, the recommended digest type will be
         *     // computed and displayed.
         *     digestType: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
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
         * @alias dns.dnsKeys.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.digestType An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
         */
        digestType?: string;
        /**
         * The identifier of the requested DnsKey.
         */
        dnsKeyId?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         */
        managedZone?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Dnskeys$List extends StandardParameters {
        /**
         * An optional comma-separated list of digest types to compute and display for key signing keys. If omitted, the recommended digest type will be computed and displayed.
         */
        digestType?: string;
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
         * dns.managedZoneOperations.get
         * @desc Fetch the representation of an existing Operation.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request.
         *     managedZone: 'placeholder-value',
         *     // Identifies the operation addressed by this request.
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
         * @alias dns.managedZoneOperations.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request.
         * @param {string} params.operation Identifies the operation addressed by this request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Managedzoneoperations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedzoneoperations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        get(params: Params$Resource$Managedzoneoperations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedzoneoperations$Get, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        get(params: Params$Resource$Managedzoneoperations$Get, callback: BodyResponseCallback<Schema$Operation>): void;
        get(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * dns.managedZoneOperations.list
         * @desc Enumerate Operations for the given ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // Identifies the managed zone addressed by this request.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
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
         * @alias dns.managedZoneOperations.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.managedZone Identifies the managed zone addressed by this request.
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {string=} params.sortBy Sorting criterion. The only supported values are START_TIME and ID.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * Identifies the managed zone addressed by this request.
         */
        managedZone?: string;
        /**
         * Identifies the operation addressed by this request.
         */
        operation?: string;
        /**
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export interface Params$Resource$Managedzoneoperations$List extends StandardParameters {
        /**
         * Identifies the managed zone addressed by this request.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
         * dns.managedZones.create
         * @desc Create a new ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
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
         *       //   "visibility": "my_visibility"
         *       // }
         *     },
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
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
         *   //   "visibility": "my_visibility"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias dns.managedZones.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().ManagedZone} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Managedzones$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Managedzones$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZone>>;
        create(params: Params$Resource$Managedzones$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Managedzones$Create, options: MethodOptions | BodyResponseCallback<Schema$ManagedZone>, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        create(params: Params$Resource$Managedzones$Create, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        create(callback: BodyResponseCallback<Schema$ManagedZone>): void;
        /**
         * dns.managedZones.delete
         * @desc Delete a previously created ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
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
         * @alias dns.managedZones.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Managedzones$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Managedzones$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Managedzones$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Managedzones$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Managedzones$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * dns.managedZones.get
         * @desc Fetch the representation of an existing ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
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
         *   //   "visibility": "my_visibility"
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias dns.managedZones.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Managedzones$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedzones$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZone>>;
        get(params: Params$Resource$Managedzones$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedzones$Get, options: MethodOptions | BodyResponseCallback<Schema$ManagedZone>, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        get(params: Params$Resource$Managedzones$Get, callback: BodyResponseCallback<Schema$ManagedZone>): void;
        get(callback: BodyResponseCallback<Schema$ManagedZone>): void;
        /**
         * dns.managedZones.list
         * @desc Enumerate ManagedZones that have been created but not yet deleted.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
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
         * @alias dns.managedZones.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.dnsName Restricts the list to return only zones with this domain name.
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Managedzones$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedzones$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedZonesListResponse>>;
        list(params: Params$Resource$Managedzones$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedzones$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedZonesListResponse>, callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        list(params: Params$Resource$Managedzones$List, callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedZonesListResponse>): void;
        /**
         * dns.managedZones.patch
         * @desc Apply a partial update to an existing ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
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
         * @alias dns.managedZones.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().ManagedZone} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Managedzones$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Managedzones$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Managedzones$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Managedzones$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Managedzones$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * dns.managedZones.update
         * @desc Update an existing ManagedZone.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *
         *     // Request body metadata
         *     requestBody: {
         *       // request body parameters
         *       // {
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
         * @alias dns.managedZones.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().ManagedZone} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
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
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
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
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
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
         * dns.policies.create
         * @desc Create a new Policy
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.create({
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.policies.create
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().Policy} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        create(params: Params$Resource$Policies$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Policies$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        create(params: Params$Resource$Policies$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Policies$Create, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        create(params: Params$Resource$Policies$Create, callback: BodyResponseCallback<Schema$Policy>): void;
        create(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * dns.policies.delete
         * @desc Delete a previously created Policy. Will fail if the policy is still being referenced by a network.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.delete({
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.policies.delete
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.policy User given friendly name of the policy addressed by this request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        delete(params: Params$Resource$Policies$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Policies$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Policies$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Policies$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Policies$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * dns.policies.get
         * @desc Fetch the representation of an existing Policy.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.get({
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.policies.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.policy User given friendly name of the policy addressed by this request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Policies$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Policies$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Policy>>;
        get(params: Params$Resource$Policies$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Policies$Get, options: MethodOptions | BodyResponseCallback<Schema$Policy>, callback: BodyResponseCallback<Schema$Policy>): void;
        get(params: Params$Resource$Policies$Get, callback: BodyResponseCallback<Schema$Policy>): void;
        get(callback: BodyResponseCallback<Schema$Policy>): void;
        /**
         * dns.policies.list
         * @desc Enumerate all Policies associated with a project.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.list({
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
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
         * @alias dns.policies.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PoliciesListResponse>>;
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$PoliciesListResponse>, callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        list(params: Params$Resource$Policies$List, callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$PoliciesListResponse>): void;
        /**
         * dns.policies.patch
         * @desc Apply a partial update to an existing Policy.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.patch({
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.policies.patch
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.policy User given friendly name of the policy addressed by this request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().Policy} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        patch(params: Params$Resource$Policies$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Policies$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$PoliciesPatchResponse>>;
        patch(params: Params$Resource$Policies$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Policies$Patch, options: MethodOptions | BodyResponseCallback<Schema$PoliciesPatchResponse>, callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        patch(params: Params$Resource$Policies$Patch, callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        patch(callback: BodyResponseCallback<Schema$PoliciesPatchResponse>): void;
        /**
         * dns.policies.update
         * @desc Update an existing Policy.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: [],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await dns.policies.update({
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.policies.update
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.policy User given friendly name of the policy addressed by this request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {().Policy} params.requestBody Request body data
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
         * dns.projects.get
         * @desc Fetch the representation of an existing Project.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // For mutating operation requests only. An optional identifier
         *     // specified by the client. Must be unique for operation resources in the
         *     // Operations collection.
         *     clientOperationId: 'placeholder-value',
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
         * @alias dns.projects.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.clientOperationId For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
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
         * Identifies the project addressed by this request.
         */
        project?: string;
    }
    export class Resource$Resourcerecordsets {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * dns.resourceRecordSets.list
         * @desc Enumerate ResourceRecordSets that have been created but not yet deleted.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/dns.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const dns = google.dns('v2beta1');
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
         *     // Identifies the managed zone addressed by this request. Can be the managed
         *     // zone name or id.
         *     managedZone: 'placeholder-value',
         *     // Optional. Maximum number of results to be returned. If unspecified, the
         *     // server will decide how many results to return.
         *     maxResults: 'placeholder-value',
         *     // Restricts the list to return only records with this fully qualified domain
         *     // name.
         *     name: 'placeholder-value',
         *     // Optional. A tag returned by a previous list request that was truncated.
         *     // Use this parameter to continue a previous list request.
         *     pageToken: 'placeholder-value',
         *     // Identifies the project addressed by this request.
         *     project: 'placeholder-value',
         *     // Restricts the list to return only records of this type. If present, the
         *     // "name" parameter must also be present.
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
         * @alias dns.resourceRecordSets.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.managedZone Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         * @param {integer=} params.maxResults Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
         * @param {string=} params.name Restricts the list to return only records with this fully qualified domain name.
         * @param {string=} params.pageToken Optional. A tag returned by a previous list request that was truncated. Use this parameter to continue a previous list request.
         * @param {string} params.project Identifies the project addressed by this request.
         * @param {string=} params.type Restricts the list to return only records of this type. If present, the "name" parameter must also be present.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Resourcerecordsets$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Resourcerecordsets$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResourceRecordSetsListResponse>>;
        list(params: Params$Resource$Resourcerecordsets$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Resourcerecordsets$List, options: MethodOptions | BodyResponseCallback<Schema$ResourceRecordSetsListResponse>, callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
        list(params: Params$Resource$Resourcerecordsets$List, callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ResourceRecordSetsListResponse>): void;
    }
    export interface Params$Resource$Resourcerecordsets$List extends StandardParameters {
        /**
         * Identifies the managed zone addressed by this request. Can be the managed zone name or id.
         */
        managedZone?: string;
        /**
         * Optional. Maximum number of results to be returned. If unspecified, the server will decide how many results to return.
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
    export {};
}
