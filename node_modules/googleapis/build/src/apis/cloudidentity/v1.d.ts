import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace cloudidentity_v1 {
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
     * Cloud Identity API
     *
     * API for provisioning and managing identity resources.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudidentity = google.cloudidentity('v1');
     * ```
     */
    export class Cloudidentity {
        context: APIRequestContext;
        customers: Resource$Customers;
        devices: Resource$Devices;
        groups: Resource$Groups;
        inboundSamlSsoProfiles: Resource$Inboundsamlssoprofiles;
        inboundSsoAssignments: Resource$Inboundssoassignments;
        policies: Resource$Policies;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * LRO response metadata for InboundSamlSsoProfilesService.AddIdpCredential.
     */
    export interface Schema$AddIdpCredentialOperationMetadata {
        /**
         * State of this Operation Will be "awaiting-multi-party-approval" when the operation is deferred due to the target customer having enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448).
         */
        state?: string | null;
    }
    /**
     * The request for creating an IdpCredential with its associated payload. An InboundSamlSsoProfile can own up to 2 credentials.
     */
    export interface Schema$AddIdpCredentialRequest {
        /**
         * PEM encoded x509 certificate containing the public key for verifying IdP signatures.
         */
        pemData?: string | null;
    }
    /**
     * Request to cancel sent invitation for target email in UserInvitation.
     */
    export interface Schema$CancelUserInvitationRequest {
    }
    /**
     * The response message for MembershipsService.CheckTransitiveMembership.
     */
    export interface Schema$CheckTransitiveMembershipResponse {
        /**
         * Response does not include the possible roles of a member since the behavior of this rpc is not all-or-nothing unlike the other rpcs. So, it may not be possible to list all the roles definitively, due to possible lack of authorization in some of the paths.
         */
        hasMembership?: boolean | null;
    }
    /**
     * Metadata for CreateGroup LRO.
     */
    export interface Schema$CreateGroupMetadata {
    }
    /**
     * LRO response metadata for InboundSamlSsoProfilesService.CreateInboundSamlSsoProfile.
     */
    export interface Schema$CreateInboundSamlSsoProfileOperationMetadata {
        /**
         * State of this Operation Will be "awaiting-multi-party-approval" when the operation is deferred due to the target customer having enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448).
         */
        state?: string | null;
    }
    /**
     * LRO response metadata for InboundSsoAssignmentsService.CreateInboundSsoAssignment.
     */
    export interface Schema$CreateInboundSsoAssignmentOperationMetadata {
    }
    /**
     * Metadata for CreateMembership LRO.
     */
    export interface Schema$CreateMembershipMetadata {
    }
    /**
     * Metadata for DeleteGroup LRO.
     */
    export interface Schema$DeleteGroupMetadata {
    }
    /**
     * LRO response metadata for InboundSamlSsoProfilesService.DeleteIdpCredential.
     */
    export interface Schema$DeleteIdpCredentialOperationMetadata {
    }
    /**
     * LRO response metadata for InboundSamlSsoProfilesService.DeleteInboundSamlSsoProfile.
     */
    export interface Schema$DeleteInboundSamlSsoProfileOperationMetadata {
    }
    /**
     * LRO response metadata for InboundSsoAssignmentsService.DeleteInboundSsoAssignment.
     */
    export interface Schema$DeleteInboundSsoAssignmentOperationMetadata {
    }
    /**
     * Metadata for DeleteMembership LRO.
     */
    export interface Schema$DeleteMembershipMetadata {
    }
    /**
     * Information of a DSA public key.
     */
    export interface Schema$DsaPublicKeyInfo {
        /**
         * Key size in bits (size of parameter P).
         */
        keySize?: number | null;
    }
    /**
     * Dynamic group metadata like queries and status.
     */
    export interface Schema$DynamicGroupMetadata {
        /**
         * Memberships will be the union of all queries. Only one entry with USER resource is currently supported. Customers can create up to 500 dynamic groups.
         */
        queries?: Schema$DynamicGroupQuery[];
        /**
         * Output only. Status of the dynamic group.
         */
        status?: Schema$DynamicGroupStatus;
    }
    /**
     * Defines a query on a resource.
     */
    export interface Schema$DynamicGroupQuery {
        /**
         * Query that determines the memberships of the dynamic group. Examples: All users with at least one `organizations.department` of engineering. `user.organizations.exists(org, org.department=='engineering')` All users with at least one location that has `area` of `foo` and `building_id` of `bar`. `user.locations.exists(loc, loc.area=='foo' && loc.building_id=='bar')` All users with any variation of the name John Doe (case-insensitive queries add `equalsIgnoreCase()` to the value being queried). `user.name.value.equalsIgnoreCase('jOhn DoE')`
         */
        query?: string | null;
        /**
         * Resource type for the Dynamic Group Query
         */
        resourceType?: string | null;
    }
    /**
     * The current status of a dynamic group along with timestamp.
     */
    export interface Schema$DynamicGroupStatus {
        /**
         * Status of the dynamic group.
         */
        status?: string | null;
        /**
         * The latest time at which the dynamic group is guaranteed to be in the given status. If status is `UP_TO_DATE`, the latest time at which the dynamic group was confirmed to be up-to-date. If status is `UPDATING_MEMBERSHIPS`, the time at which dynamic group was created.
         */
        statusTime?: string | null;
    }
    /**
     * A unique identifier for an entity in the Cloud Identity Groups API. An entity can represent either a group with an optional `namespace` or a user without a `namespace`. The combination of `id` and `namespace` must be unique; however, the same `id` can be used with different `namespace`s.
     */
    export interface Schema$EntityKey {
        /**
         * The ID of the entity. For Google-managed entities, the `id` should be the email address of an existing group or user. Email addresses need to adhere to [name guidelines for users and groups](https://support.google.com/a/answer/9193374). For external-identity-mapped entities, the `id` must be a string conforming to the Identity Source's requirements. Must be unique within a `namespace`.
         */
        id?: string | null;
        /**
         * The namespace in which the entity exists. If not specified, the `EntityKey` represents a Google-managed entity such as a Google user or a Google Group. If specified, the `EntityKey` represents an external-identity-mapped group. The namespace must correspond to an identity source created in Admin Console and must be in the form of `identitysources/{identity_source\}`.
         */
        namespace?: string | null;
    }
    /**
     * The `MembershipRole` expiry details.
     */
    export interface Schema$ExpiryDetail {
        /**
         * The time at which the `MembershipRole` will expire.
         */
        expireTime?: string | null;
    }
    /**
     * Metadata of GetMembershipGraphResponse LRO. This is currently empty to permit future extensibility.
     */
    export interface Schema$GetMembershipGraphMetadata {
    }
    /**
     * The response message for MembershipsService.GetMembershipGraph.
     */
    export interface Schema$GetMembershipGraphResponse {
        /**
         * The membership graph's path information represented as an adjacency list.
         */
        adjacencyList?: Schema$MembershipAdjacencyList[];
        /**
         * The resources representing each group in the adjacency list. Each group in this list can be correlated to a 'group' of the MembershipAdjacencyList using the 'name' of the Group resource.
         */
        groups?: Schema$Group[];
    }
    /**
     * Resource representing the Android specific attributes of a Device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1AndroidAttributes {
        /**
         * Whether the device passes Android CTS compliance.
         */
        ctsProfileMatch?: boolean | null;
        /**
         * Whether applications from unknown sources can be installed on device.
         */
        enabledUnknownSources?: boolean | null;
        /**
         * Whether any potentially harmful apps were detected on the device.
         */
        hasPotentiallyHarmfulApps?: boolean | null;
        /**
         * Whether this account is on an owner/primary profile. For phones, only true for owner profiles. Android 4+ devices can have secondary or restricted user profiles.
         */
        ownerProfileAccount?: boolean | null;
        /**
         * Ownership privileges on device.
         */
        ownershipPrivilege?: string | null;
        /**
         * Whether device supports Android work profiles. If false, this service will not block access to corp data even if an administrator turns on the "Enforce Work Profile" policy.
         */
        supportsWorkProfile?: boolean | null;
        /**
         * Whether Android verified boot status is GREEN.
         */
        verifiedBoot?: boolean | null;
        /**
         * Whether Google Play Protect Verify Apps is enabled.
         */
        verifyAppsEnabled?: boolean | null;
    }
    /**
     * Metadata for ApproveDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ApproveDeviceUserMetadata {
    }
    /**
     * Request message for approving the device to access user data.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ApproveDeviceUserRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
    }
    /**
     * Response message for approving the device to access user data.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ApproveDeviceUserResponse {
        /**
         * Resultant DeviceUser object for the action.
         */
        deviceUser?: Schema$GoogleAppsCloudidentityDevicesV1DeviceUser;
    }
    /**
     * Metadata for BlockDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1BlockDeviceUserMetadata {
    }
    /**
     * Request message for blocking account on device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1BlockDeviceUserRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
    }
    /**
     * Response message for blocking the device from accessing user data.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1BlockDeviceUserResponse {
        /**
         * Resultant DeviceUser object for the action.
         */
        deviceUser?: Schema$GoogleAppsCloudidentityDevicesV1DeviceUser;
    }
    /**
     * Contains information about browser profiles reported by the [Endpoint Verification extension](https://chromewebstore.google.com/detail/endpoint-verification/callobklhcbilhphinckomhgkigmfocg?pli=1).
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1BrowserAttributes {
        /**
         * Represents the current state of the [Chrome browser attributes](https://cloud.google.com/access-context-manager/docs/browser-attributes) sent by the [Endpoint Verification extension](https://chromewebstore.google.com/detail/endpoint-verification/callobklhcbilhphinckomhgkigmfocg?pli=1).
         */
        chromeBrowserInfo?: Schema$GoogleAppsCloudidentityDevicesV1BrowserInfo;
        /**
         * Chrome profile ID that is exposed by the Chrome API. It is unique for each device.
         */
        chromeProfileId?: string | null;
        /**
         * Timestamp in milliseconds since the Unix epoch when the profile/gcm id was last synced.
         */
        lastProfileSyncTime?: string | null;
    }
    /**
     * Browser-specific fields reported by the [Endpoint Verification extension](https://chromewebstore.google.com/detail/endpoint-verification/callobklhcbilhphinckomhgkigmfocg?pli=1).
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1BrowserInfo {
        /**
         * Output only. Browser's management state.
         */
        browserManagementState?: string | null;
        /**
         * Version of the request initiating browser. E.g. `91.0.4442.4`.
         */
        browserVersion?: string | null;
        /**
         * Current state of [built-in DNS client](https://chromeenterprise.google/policies/#BuiltInDnsClientEnabled).
         */
        isBuiltInDnsClientEnabled?: boolean | null;
        /**
         * Current state of [bulk data analysis](https://chromeenterprise.google/policies/#OnBulkDataEntryEnterpriseConnector). Set to true if provider list from Chrome is non-empty.
         */
        isBulkDataEntryAnalysisEnabled?: boolean | null;
        /**
         * Current state of [Chrome Cleanup](https://chromeenterprise.google/policies/#ChromeCleanupEnabled).
         */
        isChromeCleanupEnabled?: boolean | null;
        /**
         * Current state of [Chrome Remote Desktop app](https://chromeenterprise.google/policies/#URLBlocklist).
         */
        isChromeRemoteDesktopAppBlocked?: boolean | null;
        /**
         * Current state of [file download analysis](https://chromeenterprise.google/policies/#OnFileDownloadedEnterpriseConnector). Set to true if provider list from Chrome is non-empty.
         */
        isFileDownloadAnalysisEnabled?: boolean | null;
        /**
         * Current state of [file upload analysis](https://chromeenterprise.google/policies/#OnFileAttachedEnterpriseConnector). Set to true if provider list from Chrome is non-empty.
         */
        isFileUploadAnalysisEnabled?: boolean | null;
        /**
         * Current state of [real-time URL check](https://chromeenterprise.google/policies/#EnterpriseRealTimeUrlCheckMode). Set to true if provider list from Chrome is non-empty.
         */
        isRealtimeUrlCheckEnabled?: boolean | null;
        /**
         * Current state of [security event analysis](https://chromeenterprise.google/policies/#OnSecurityEventEnterpriseConnector). Set to true if provider list from Chrome is non-empty.
         */
        isSecurityEventAnalysisEnabled?: boolean | null;
        /**
         * Current state of [site isolation](https://chromeenterprise.google/policies/?policy=IsolateOrigins).
         */
        isSiteIsolationEnabled?: boolean | null;
        /**
         * Current state of [third-party blocking](https://chromeenterprise.google/policies/#ThirdPartyBlockingEnabled).
         */
        isThirdPartyBlockingEnabled?: boolean | null;
        /**
         * Current state of [password protection trigger](https://chromeenterprise.google/policies/#PasswordProtectionWarningTrigger).
         */
        passwordProtectionWarningTrigger?: string | null;
        /**
         * Current state of [Safe Browsing protection level](https://chromeenterprise.google/policies/#SafeBrowsingProtectionLevel).
         */
        safeBrowsingProtectionLevel?: string | null;
    }
    /**
     * Metadata for CancelWipeDevice LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceMetadata {
    }
    /**
     * Request message for cancelling an unfinished device wipe.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
    }
    /**
     * Response message for cancelling an unfinished device wipe.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceResponse {
        /**
         * Resultant Device object for the action. Note that asset tags will not be returned in the device object.
         */
        device?: Schema$GoogleAppsCloudidentityDevicesV1Device;
    }
    /**
     * Metadata for CancelWipeDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceUserMetadata {
    }
    /**
     * Request message for cancelling an unfinished user account wipe.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceUserRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
    }
    /**
     * Response message for cancelling an unfinished user account wipe.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceUserResponse {
        /**
         * Resultant DeviceUser object for the action.
         */
        deviceUser?: Schema$GoogleAppsCloudidentityDevicesV1DeviceUser;
    }
    /**
     * Stores information about a certificate.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CertificateAttributes {
        /**
         * The X.509 extension for CertificateTemplate.
         */
        certificateTemplate?: Schema$GoogleAppsCloudidentityDevicesV1CertificateTemplate;
        /**
         * The encoded certificate fingerprint.
         */
        fingerprint?: string | null;
        /**
         * The name of the issuer of this certificate.
         */
        issuer?: string | null;
        /**
         * Serial number of the certificate, Example: "123456789".
         */
        serialNumber?: string | null;
        /**
         * The subject name of this certificate.
         */
        subject?: string | null;
        /**
         * The certificate thumbprint.
         */
        thumbprint?: string | null;
        /**
         * Output only. Validation state of this certificate.
         */
        validationState?: string | null;
        /**
         * Certificate not valid at or after this timestamp.
         */
        validityExpirationTime?: string | null;
        /**
         * Certificate not valid before this timestamp.
         */
        validityStartTime?: string | null;
    }
    /**
     * CertificateTemplate (v3 Extension in X.509).
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CertificateTemplate {
        /**
         * The template id of the template. Example: "1.3.6.1.4.1.311.21.8.15608621.11768144.5720724.16068415.6889630.81.2472537.7784047".
         */
        id?: string | null;
        /**
         * The Major version of the template. Example: 100.
         */
        majorVersion?: number | null;
        /**
         * The minor version of the template. Example: 12.
         */
        minorVersion?: number | null;
    }
    /**
     * Represents the state associated with an API client calling the Devices API. Resource representing ClientState and supports updates from API users
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ClientState {
        /**
         * The caller can specify asset tags for this resource
         */
        assetTags?: string[] | null;
        /**
         * The compliance state of the resource as specified by the API client.
         */
        complianceState?: string | null;
        /**
         * Output only. The time the client state data was created.
         */
        createTime?: string | null;
        /**
         * This field may be used to store a unique identifier for the API resource within which these CustomAttributes are a field.
         */
        customId?: string | null;
        /**
         * The token that needs to be passed back for concurrency control in updates. Token needs to be passed back in UpdateRequest
         */
        etag?: string | null;
        /**
         * The Health score of the resource. The Health score is the callers specification of the condition of the device from a usability point of view. For example, a third-party device management provider may specify a health score based on its compliance with organizational policies.
         */
        healthScore?: string | null;
        /**
         * The map of key-value attributes stored by callers specific to a device. The total serialized length of this map may not exceed 10KB. No limit is placed on the number of attributes in a map.
         */
        keyValuePairs?: {
            [key: string]: Schema$GoogleAppsCloudidentityDevicesV1CustomAttributeValue;
        } | null;
        /**
         * Output only. The time the client state data was last updated.
         */
        lastUpdateTime?: string | null;
        /**
         * The management state of the resource as specified by the API client.
         */
        managed?: string | null;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the ClientState in format: `devices/{device\}/deviceUsers/{device_user\}/clientState/{partner\}`, where partner corresponds to the partner storing the data. For partners belonging to the "BeyondCorp Alliance", this is the partner ID specified to you by Google. For all other callers, this is a string of the form: `{customer\}-suffix`, where `customer` is your customer ID. The *suffix* is any string the caller specifies. This string will be displayed verbatim in the administration console. This suffix is used in setting up Custom Access Levels in Context-Aware Access. Your organization's customer ID can be obtained from the URL: `GET https://www.googleapis.com/admin/directory/v1/customers/my_customer` The `id` field in the response contains the customer ID starting with the letter 'C'. The customer ID to be used in this API is the string after the letter 'C' (not including 'C')
         */
        name?: string | null;
        /**
         * Output only. The owner of the ClientState
         */
        ownerType?: string | null;
        /**
         * A descriptive cause of the health score.
         */
        scoreReason?: string | null;
    }
    /**
     * Metadata for CreateDevice LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CreateDeviceMetadata {
    }
    /**
     * Additional custom attribute values may be one of these types
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1CustomAttributeValue {
        /**
         * Represents a boolean value.
         */
        boolValue?: boolean | null;
        /**
         * Represents a double value.
         */
        numberValue?: number | null;
        /**
         * Represents a string value.
         */
        stringValue?: string | null;
    }
    /**
     * Metadata for DeleteDevice LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1DeleteDeviceMetadata {
    }
    /**
     * Metadata for DeleteDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1DeleteDeviceUserMetadata {
    }
    /**
     *  A Device within the Cloud Identity Devices API. Represents a Device known to Google Cloud, independent of the device ownership, type, and whether it is assigned or in use by a user.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1Device {
        /**
         * Output only. Attributes specific to Android devices.
         */
        androidSpecificAttributes?: Schema$GoogleAppsCloudidentityDevicesV1AndroidAttributes;
        /**
         * Asset tag of the device.
         */
        assetTag?: string | null;
        /**
         * Output only. Baseband version of the device.
         */
        basebandVersion?: string | null;
        /**
         * Output only. Device bootloader version. Example: 0.6.7.
         */
        bootloaderVersion?: string | null;
        /**
         * Output only. Device brand. Example: Samsung.
         */
        brand?: string | null;
        /**
         * Output only. Build number of the device.
         */
        buildNumber?: string | null;
        /**
         * Output only. Represents whether the Device is compromised.
         */
        compromisedState?: string | null;
        /**
         * Output only. When the Company-Owned device was imported. This field is empty for BYOD devices.
         */
        createTime?: string | null;
        /**
         * Unique identifier for the device.
         */
        deviceId?: string | null;
        /**
         * Output only. Type of device.
         */
        deviceType?: string | null;
        /**
         * Output only. Whether developer options is enabled on device.
         */
        enabledDeveloperOptions?: boolean | null;
        /**
         * Output only. Whether USB debugging is enabled on device.
         */
        enabledUsbDebugging?: boolean | null;
        /**
         * Output only. Device encryption state.
         */
        encryptionState?: string | null;
        /**
         * Output only. Attributes specific to [Endpoint Verification](https://cloud.google.com/endpoint-verification/docs/overview) devices.
         */
        endpointVerificationSpecificAttributes?: Schema$GoogleAppsCloudidentityDevicesV1EndpointVerificationSpecificAttributes;
        /**
         * Host name of the device.
         */
        hostname?: string | null;
        /**
         * Output only. IMEI number of device if GSM device; empty otherwise.
         */
        imei?: string | null;
        /**
         * Output only. Kernel version of the device.
         */
        kernelVersion?: string | null;
        /**
         * Most recent time when device synced with this service.
         */
        lastSyncTime?: string | null;
        /**
         * Output only. Management state of the device
         */
        managementState?: string | null;
        /**
         * Output only. Device manufacturer. Example: Motorola.
         */
        manufacturer?: string | null;
        /**
         * Output only. MEID number of device if CDMA device; empty otherwise.
         */
        meid?: string | null;
        /**
         * Output only. Model name of device. Example: Pixel 3.
         */
        model?: string | null;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}`, where device is the unique id assigned to the Device. Important: Device API scopes require that you use domain-wide delegation to access the API. For more information, see [Set up the Devices API](https://cloud.google.com/identity/docs/how-to/setup-devices).
         */
        name?: string | null;
        /**
         * Output only. Mobile or network operator of device, if available.
         */
        networkOperator?: string | null;
        /**
         * Output only. OS version of the device. Example: Android 8.1.0.
         */
        osVersion?: string | null;
        /**
         * Output only. Domain name for Google accounts on device. Type for other accounts on device. On Android, will only be populated if |ownership_privilege| is |PROFILE_OWNER| or |DEVICE_OWNER|. Does not include the account signed in to the device policy app if that account's domain has only one account. Examples: "com.example", "xyz.com".
         */
        otherAccounts?: string[] | null;
        /**
         * Output only. Whether the device is owned by the company or an individual
         */
        ownerType?: string | null;
        /**
         * Output only. OS release version. Example: 6.0.
         */
        releaseVersion?: string | null;
        /**
         * Output only. OS security patch update time on device.
         */
        securityPatchTime?: string | null;
        /**
         * Serial Number of device. Example: HT82V1A01076.
         */
        serialNumber?: string | null;
        /**
         * Output only. Unified device id of the device.
         */
        unifiedDeviceId?: string | null;
        /**
         * WiFi MAC addresses of device.
         */
        wifiMacAddresses?: string[] | null;
    }
    /**
     * Represents a user's use of a Device in the Cloud Identity Devices API. A DeviceUser is a resource representing a user's use of a Device
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1DeviceUser {
        /**
         * Compromised State of the DeviceUser object
         */
        compromisedState?: string | null;
        /**
         * When the user first signed in to the device
         */
        createTime?: string | null;
        /**
         * Output only. Most recent time when user registered with this service.
         */
        firstSyncTime?: string | null;
        /**
         * Output only. Default locale used on device, in IETF BCP-47 format.
         */
        languageCode?: string | null;
        /**
         * Output only. Last time when user synced with policies.
         */
        lastSyncTime?: string | null;
        /**
         * Output only. Management state of the user on the device.
         */
        managementState?: string | null;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the DeviceUser in format: `devices/{device\}/deviceUsers/{device_user\}`, where `device_user` uniquely identifies a user's use of a device.
         */
        name?: string | null;
        /**
         * Password state of the DeviceUser object
         */
        passwordState?: string | null;
        /**
         * Output only. User agent on the device for this specific user
         */
        userAgent?: string | null;
        /**
         * Email address of the user registered on the device.
         */
        userEmail?: string | null;
    }
    /**
     * Resource representing the [Endpoint Verification-specific attributes](https://cloud.google.com/endpoint-verification/docs/device-information) of a device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1EndpointVerificationSpecificAttributes {
        /**
         * [Additional signals](https://cloud.google.com/endpoint-verification/docs/device-information) reported by Endpoint Verification. It includes the following attributes: * Non-configurable attributes: hotfixes, av_installed, av_enabled, windows_domain_name, is_os_native_firewall_enabled, and is_secure_boot_enabled. * [Configurable attributes](https://cloud.google.com/endpoint-verification/docs/collect-config-attributes): file, folder, and binary attributes; registry entries; and properties in a plist.
         */
        additionalSignals?: {
            [key: string]: any;
        } | null;
        /**
         * Details of browser profiles reported by Endpoint Verification.
         */
        browserAttributes?: Schema$GoogleAppsCloudidentityDevicesV1BrowserAttributes[];
        /**
         * Details of certificates.
         */
        certificateAttributes?: Schema$GoogleAppsCloudidentityDevicesV1CertificateAttributes[];
    }
    /**
     * Response message that is returned in ListClientStates.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse {
        /**
         * Client states meeting the list restrictions.
         */
        clientStates?: Schema$GoogleAppsCloudidentityDevicesV1ClientState[];
        /**
         * Token to retrieve the next page of results. Empty if there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message that is returned from the ListDevices method.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse {
        /**
         * Devices meeting the list restrictions.
         */
        devices?: Schema$GoogleAppsCloudidentityDevicesV1Device[];
        /**
         * Token to retrieve the next page of results. Empty if there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response message that is returned from the ListDeviceUsers method.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse {
        /**
         * Devices meeting the list restrictions.
         */
        deviceUsers?: Schema$GoogleAppsCloudidentityDevicesV1DeviceUser[];
        /**
         * Token to retrieve the next page of results. Empty if there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Metadata for ListEndpointApps LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1ListEndpointAppsMetadata {
    }
    /**
     * Response containing resource names of the DeviceUsers associated with the caller's credentials.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse {
        /**
         * The customer resource name that may be passed back to other Devices API methods such as List, Get, etc.
         */
        customer?: string | null;
        /**
         * [Resource names](https://cloud.google.com/apis/design/resource_names) of the DeviceUsers in the format: `devices/{device\}/deviceUsers/{user_resource\}`, where device is the unique ID assigned to a Device and user_resource is the unique user ID
         */
        names?: string[] | null;
        /**
         * Token to retrieve the next page of results. Empty if there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * Metadata for SignoutDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1SignoutDeviceUserMetadata {
    }
    /**
     * Metadata for UpdateClientState LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1UpdateClientStateMetadata {
    }
    /**
     * Metadata for UpdateDevice LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1UpdateDeviceMetadata {
    }
    /**
     * Metadata for WipeDevice LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceMetadata {
    }
    /**
     * Request message for wiping all data on the device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
        /**
         * Optional. Specifies if a user is able to factory reset a device after a Device Wipe. On iOS, this is called "Activation Lock", while on Android, this is known as "Factory Reset Protection". If true, this protection will be removed from the device, so that a user can successfully factory reset. If false, the setting is untouched on the device.
         */
        removeResetLock?: boolean | null;
    }
    /**
     * Response message for wiping all data on the device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceResponse {
        /**
         * Resultant Device object for the action. Note that asset tags will not be returned in the device object.
         */
        device?: Schema$GoogleAppsCloudidentityDevicesV1Device;
    }
    /**
     * Metadata for WipeDeviceUser LRO.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceUserMetadata {
    }
    /**
     * Request message for starting an account wipe on device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceUserRequest {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string | null;
    }
    /**
     * Response message for wiping the user's account from the device.
     */
    export interface Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceUserResponse {
        /**
         * Resultant DeviceUser object for the action.
         */
        deviceUser?: Schema$GoogleAppsCloudidentityDevicesV1DeviceUser;
    }
    /**
     * A group within the Cloud Identity Groups API. A `Group` is a collection of entities, where each entity is either a user, another group, or a service account.
     */
    export interface Schema$Group {
        /**
         * Output only. Additional group keys associated with the Group.
         */
        additionalGroupKeys?: Schema$EntityKey[];
        /**
         * Output only. The time when the `Group` was created.
         */
        createTime?: string | null;
        /**
         * An extended description to help users determine the purpose of a `Group`. Must not be longer than 4,096 characters.
         */
        description?: string | null;
        /**
         * The display name of the `Group`.
         */
        displayName?: string | null;
        /**
         * Optional. Dynamic group metadata like queries and status.
         */
        dynamicGroupMetadata?: Schema$DynamicGroupMetadata;
        /**
         * Required. The `EntityKey` of the `Group`.
         */
        groupKey?: Schema$EntityKey;
        /**
         * Required. One or more label entries that apply to the Group. Currently supported labels contain a key with an empty value. Google Groups are the default type of group and have a label with a key of `cloudidentity.googleapis.com/groups.discussion_forum` and an empty value. Existing Google Groups can have an additional label with a key of `cloudidentity.googleapis.com/groups.security` and an empty value added to them. **This is an immutable change and the security label cannot be removed once added.** Dynamic groups have a label with a key of `cloudidentity.googleapis.com/groups.dynamic`. Identity-mapped groups for Cloud Search have a label with a key of `system/groups/external` and an empty value.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * Output only. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Group`. Shall be of the form `groups/{group\}`.
         */
        name?: string | null;
        /**
         * Required. Immutable. The resource name of the entity under which this `Group` resides in the Cloud Identity resource hierarchy. Must be of the form `identitysources/{identity_source\}` for external [identity-mapped groups](https://support.google.com/a/answer/9039510) or `customers/{customer_id\}` for Google Groups. The `customer_id` must begin with "C" (for example, 'C046psxkn'). [Find your customer ID.] (https://support.google.com/cloudidentity/answer/10070793)
         */
        parent?: string | null;
        /**
         * Output only. The time when the `Group` was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Message representing a transitive group of a user or a group.
     */
    export interface Schema$GroupRelation {
        /**
         * Display name for this group.
         */
        displayName?: string | null;
        /**
         * Resource name for this group.
         */
        group?: string | null;
        /**
         * Entity key has an id and a namespace. In case of discussion forums, the id will be an email address without a namespace.
         */
        groupKey?: Schema$EntityKey;
        /**
         * Labels for Group resource.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The relation between the member and the transitive group.
         */
        relationType?: string | null;
        /**
         * Membership roles of the member for the group.
         */
        roles?: Schema$TransitiveMembershipRole[];
    }
    /**
     * Credential for verifying signatures produced by the Identity Provider.
     */
    export interface Schema$IdpCredential {
        /**
         * Output only. Information of a DSA public key.
         */
        dsaKeyInfo?: Schema$DsaPublicKeyInfo;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the credential.
         */
        name?: string | null;
        /**
         * Output only. Information of a RSA public key.
         */
        rsaKeyInfo?: Schema$RsaPublicKeyInfo;
        /**
         * Output only. Time when the `IdpCredential` was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * A [SAML 2.0](https://www.oasis-open.org/standards#samlv2.0) federation between a Google enterprise customer and a SAML identity provider.
     */
    export interface Schema$InboundSamlSsoProfile {
        /**
         * Immutable. The customer. For example: `customers/C0123abc`.
         */
        customer?: string | null;
        /**
         * Human-readable name of the SAML SSO profile.
         */
        displayName?: string | null;
        /**
         * SAML identity provider configuration.
         */
        idpConfig?: Schema$SamlIdpConfig;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the SAML SSO profile.
         */
        name?: string | null;
        /**
         * SAML service provider configuration for this SAML SSO profile. These are the service provider details provided by Google that should be configured on the corresponding identity provider.
         */
        spConfig?: Schema$SamlSpConfig;
    }
    /**
     * Targets with "set" SSO assignments and their respective assignments.
     */
    export interface Schema$InboundSsoAssignment {
        /**
         * Immutable. The customer. For example: `customers/C0123abc`.
         */
        customer?: string | null;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Inbound SSO Assignment.
         */
        name?: string | null;
        /**
         * Must be zero (which is the default value so it can be omitted) for assignments with `target_org_unit` set and must be greater-than-or-equal-to one for assignments with `target_group` set.
         */
        rank?: number | null;
        /**
         * SAML SSO details. Must be set if and only if `sso_mode` is set to `SAML_SSO`.
         */
        samlSsoInfo?: Schema$SamlSsoInfo;
        /**
         * Assertions about users assigned to an IdP will always be accepted from that IdP. This controls whether/when Google should redirect a user to the IdP. Unset (defaults) is the recommended configuration.
         */
        signInBehavior?: Schema$SignInBehavior;
        /**
         * Inbound SSO behavior.
         */
        ssoMode?: string | null;
        /**
         * Immutable. Must be of the form `groups/{group\}`.
         */
        targetGroup?: string | null;
        /**
         * Immutable. Must be of the form `orgUnits/{org_unit\}`.
         */
        targetOrgUnit?: string | null;
    }
    /**
     * Response for IsInvitableUser RPC.
     */
    export interface Schema$IsInvitableUserResponse {
        /**
         * Returns true if the email address is invitable.
         */
        isInvitableUser?: boolean | null;
    }
    /**
     * Response message for ListGroups operation.
     */
    export interface Schema$ListGroupsResponse {
        /**
         * Groups returned in response to list request. The results are not sorted.
         */
        groups?: Schema$Group[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results available for listing.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response of the InboundSamlSsoProfilesService.ListIdpCredentials method.
     */
    export interface Schema$ListIdpCredentialsResponse {
        /**
         * The IdpCredentials from the specified InboundSamlSsoProfile.
         */
        idpCredentials?: Schema$IdpCredential[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response of the InboundSamlSsoProfilesService.ListInboundSamlSsoProfiles method.
     */
    export interface Schema$ListInboundSamlSsoProfilesResponse {
        /**
         * List of InboundSamlSsoProfiles.
         */
        inboundSamlSsoProfiles?: Schema$InboundSamlSsoProfile[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * Response of the InboundSsoAssignmentsService.ListInboundSsoAssignments method.
     */
    export interface Schema$ListInboundSsoAssignmentsResponse {
        /**
         * The assignments.
         */
        inboundSsoAssignments?: Schema$InboundSsoAssignment[];
        /**
         * A token, which can be sent as `page_token` to retrieve the next page. If this field is omitted, there are no subsequent pages.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for MembershipsService.ListMemberships.
     */
    export interface Schema$ListMembershipsResponse {
        /**
         * The `Membership`s under the specified `parent`.
         */
        memberships?: Schema$Membership[];
        /**
         * A continuation token to retrieve the next page of results, or empty if there are no more results available.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for PoliciesService.ListPolicies.
     */
    export interface Schema$ListPoliciesResponse {
        /**
         * The pagination token to retrieve the next page of results. If this field is empty, there are no subsequent pages.
         */
        nextPageToken?: string | null;
        /**
         * The results
         */
        policies?: Schema$Policy[];
    }
    /**
     * Response message for UserInvitation listing request.
     */
    export interface Schema$ListUserInvitationsResponse {
        /**
         * The token for the next page. If not empty, indicates that there may be more `UserInvitation` resources that match the listing request; this value can be used in a subsequent ListUserInvitationsRequest to get continued results with the current list call.
         */
        nextPageToken?: string | null;
        /**
         * The list of UserInvitation resources.
         */
        userInvitations?: Schema$UserInvitation[];
    }
    /**
     * The response message for GroupsService.LookupGroupName.
     */
    export interface Schema$LookupGroupNameResponse {
        /**
         * The [resource name](https://cloud.google.com/apis/design/resource_names) of the looked-up `Group`.
         */
        name?: string | null;
    }
    /**
     * The response message for MembershipsService.LookupMembershipName.
     */
    export interface Schema$LookupMembershipNameResponse {
        /**
         * The [resource name](https://cloud.google.com/apis/design/resource_names) of the looked-up `Membership`. Must be of the form `groups/{group\}/memberships/{membership\}`.
         */
        name?: string | null;
    }
    /**
     * Message representing a transitive membership of a group.
     */
    export interface Schema$MemberRelation {
        /**
         * Resource name for this member.
         */
        member?: string | null;
        /**
         * Entity key has an id and a namespace. In case of discussion forums, the id will be an email address without a namespace.
         */
        preferredMemberKey?: Schema$EntityKey[];
        /**
         * The relation between the group and the transitive member.
         */
        relationType?: string | null;
        /**
         * The membership role details (i.e name of role and expiry time).
         */
        roles?: Schema$TransitiveMembershipRole[];
    }
    /**
     * The definition of MemberRestriction
     */
    export interface Schema$MemberRestriction {
        /**
         * The evaluated state of this restriction on a group.
         */
        evaluation?: Schema$RestrictionEvaluation;
        /**
         * Member Restriction as defined by CEL expression. Supported restrictions are: `member.customer_id` and `member.type`. Valid values for `member.type` are `1`, `2` and `3`. They correspond to USER, SERVICE_ACCOUNT, and GROUP respectively. The value for `member.customer_id` only supports `groupCustomerId()` currently which means the customer id of the group will be used for restriction. Supported operators are `&&`, `||` and `==`, corresponding to AND, OR, and EQUAL. Examples: Allow only service accounts of given customer to be members. `member.type == 2 && member.customer_id == groupCustomerId()` Allow only users or groups to be members. `member.type == 1 || member.type == 3`
         */
        query?: string | null;
    }
    /**
     * A membership within the Cloud Identity Groups API. A `Membership` defines a relationship between a `Group` and an entity belonging to that `Group`, referred to as a "member".
     */
    export interface Schema$Membership {
        /**
         * Output only. The time when the `Membership` was created.
         */
        createTime?: string | null;
        /**
         * Output only. Delivery setting associated with the membership.
         */
        deliverySetting?: string | null;
        /**
         * Output only. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Membership`. Shall be of the form `groups/{group\}/memberships/{membership\}`.
         */
        name?: string | null;
        /**
         * Required. Immutable. The `EntityKey` of the member.
         */
        preferredMemberKey?: Schema$EntityKey;
        /**
         * The `MembershipRole`s that apply to the `Membership`. If unspecified, defaults to a single `MembershipRole` with `name` `MEMBER`. Must not contain duplicate `MembershipRole`s with the same `name`.
         */
        roles?: Schema$MembershipRole[];
        /**
         * Output only. The type of the membership.
         */
        type?: string | null;
        /**
         * Output only. The time when the `Membership` was last updated.
         */
        updateTime?: string | null;
    }
    /**
     * Membership graph's path information as an adjacency list.
     */
    export interface Schema$MembershipAdjacencyList {
        /**
         * Each edge contains information about the member that belongs to this group. Note: Fields returned here will help identify the specific Membership resource (e.g `name`, `preferred_member_key` and `role`), but may not be a comprehensive list of all fields.
         */
        edges?: Schema$Membership[];
        /**
         * Resource name of the group that the members belong to.
         */
        group?: string | null;
    }
    /**
     * Message containing membership relation.
     */
    export interface Schema$MembershipRelation {
        /**
         * An extended description to help users determine the purpose of a `Group`.
         */
        description?: string | null;
        /**
         * The display name of the `Group`.
         */
        displayName?: string | null;
        /**
         * The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Group`. Shall be of the form `groups/{group_id\}`.
         */
        group?: string | null;
        /**
         * The `EntityKey` of the `Group`.
         */
        groupKey?: Schema$EntityKey;
        /**
         * One or more label entries that apply to the Group. Currently supported labels contain a key with an empty value.
         */
        labels?: {
            [key: string]: string;
        } | null;
        /**
         * The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Membership`. Shall be of the form `groups/{group_id\}/memberships/{membership_id\}`.
         */
        membership?: string | null;
        /**
         * The `MembershipRole`s that apply to the `Membership`.
         */
        roles?: Schema$MembershipRole[];
    }
    /**
     * A membership role within the Cloud Identity Groups API. A `MembershipRole` defines the privileges granted to a `Membership`.
     */
    export interface Schema$MembershipRole {
        /**
         * The expiry details of the `MembershipRole`. Expiry details are only supported for `MEMBER` `MembershipRoles`. May be set if `name` is `MEMBER`. Must not be set if `name` is any other value.
         */
        expiryDetail?: Schema$ExpiryDetail;
        /**
         * The name of the `MembershipRole`. Must be one of `OWNER`, `MANAGER`, `MEMBER`.
         */
        name?: string | null;
        /**
         * Evaluations of restrictions applied to parent group on this membership.
         */
        restrictionEvaluations?: Schema$RestrictionEvaluations;
    }
    /**
     * The evaluated state of this restriction.
     */
    export interface Schema$MembershipRoleRestrictionEvaluation {
        /**
         * Output only. The current state of the restriction
         */
        state?: string | null;
    }
    /**
     * The request message for MembershipsService.ModifyMembershipRoles.
     */
    export interface Schema$ModifyMembershipRolesRequest {
        /**
         * The `MembershipRole`s to be added. Adding or removing roles in the same request as updating roles is not supported. Must not be set if `update_roles_params` is set.
         */
        addRoles?: Schema$MembershipRole[];
        /**
         * The `name`s of the `MembershipRole`s to be removed. Adding or removing roles in the same request as updating roles is not supported. It is not possible to remove the `MEMBER` `MembershipRole`. If you wish to delete a `Membership`, call MembershipsService.DeleteMembership instead. Must not contain `MEMBER`. Must not be set if `update_roles_params` is set.
         */
        removeRoles?: string[] | null;
        /**
         * The `MembershipRole`s to be updated. Updating roles in the same request as adding or removing roles is not supported. Must not be set if either `add_roles` or `remove_roles` is set.
         */
        updateRolesParams?: Schema$UpdateMembershipRolesParams[];
    }
    /**
     * The response message for MembershipsService.ModifyMembershipRoles.
     */
    export interface Schema$ModifyMembershipRolesResponse {
        /**
         * The `Membership` resource after modifying its `MembershipRole`s.
         */
        membership?: Schema$Membership;
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
         * The normal, successful response of the operation. If the original method returns no data on success, such as `Delete`, the response is `google.protobuf.Empty`. If the original method is standard `Get`/`Create`/`Update`, the response should be the resource. For other methods, the response should have the type `XxxResponse`, where `Xxx` is the original method name. For example, if the original method name is `TakeSnapshot()`, the inferred response type is `TakeSnapshotResponse`.
         */
        response?: {
            [key: string]: any;
        } | null;
    }
    /**
     * A Policy resource binds an instance of a single Setting with the scope of a PolicyQuery. The Setting instance will be applied to all entities that satisfy the query.
     */
    export interface Schema$Policy {
        /**
         * Immutable. Customer that the Policy belongs to. The value is in the format 'customers/{customerId\}'. The `customerId` must begin with "C" To find your customer ID in Admin Console see https://support.google.com/a/answer/10070793.
         */
        customer?: string | null;
        /**
         * Output only. Identifier. The [resource name](https://cloud.google.com/apis/design/resource_names) of the Policy. Format: policies/{policy\}.
         */
        name?: string | null;
        /**
         * Required. The PolicyQuery the Setting applies to.
         */
        policyQuery?: Schema$PolicyQuery;
        /**
         * Required. The Setting configured by this Policy.
         */
        setting?: Schema$Setting;
        /**
         * Output only. The type of the policy.
         */
        type?: string | null;
    }
    /**
     * PolicyQuery
     */
    export interface Schema$PolicyQuery {
        /**
         * Immutable. The group that the query applies to. This field is only set if there is a single value for group that satisfies all clauses of the query. If no group applies, this will be the empty string.
         */
        group?: string | null;
        /**
         * Required. Immutable. Non-empty default. The OrgUnit the query applies to. This field is only set if there is a single value for org_unit that satisfies all clauses of the query.
         */
        orgUnit?: string | null;
        /**
         * Immutable. The CEL query that defines which entities the Policy applies to (ex. a User entity). For details about CEL see https://opensource.google.com/projects/cel. The OrgUnits the Policy applies to are represented by a clause like so: entity.org_units.exists(org_unit, org_unit.org_unit_id == orgUnitId('{orgUnitId\}')) The Group the Policy applies to are represented by a clause like so: entity.groups.exists(group, group.group_id == groupId('{groupId\}')) The Licenses the Policy applies to are represented by a clause like so: entity.licenses.exists(license, license in ['/product/{productId\}/sku/{skuId\}']) The above clauses can be present in any combination, and used in conjunction with the &&, || and ! operators. The org_unit and group fields below are helper fields that contain the corresponding value(s) as the query to make the query easier to use.
         */
        query?: string | null;
        /**
         * Output only. The decimal sort order of this PolicyQuery. The value is relative to all other policies with the same setting type for the customer. (There are no duplicates within this set).
         */
        sortOrder?: number | null;
    }
    /**
     * The evaluated state of this restriction.
     */
    export interface Schema$RestrictionEvaluation {
        /**
         * Output only. The current state of the restriction
         */
        state?: string | null;
    }
    /**
     * Evaluations of restrictions applied to parent group on this membership.
     */
    export interface Schema$RestrictionEvaluations {
        /**
         * Evaluation of the member restriction applied to this membership. Empty if the user lacks permission to view the restriction evaluation.
         */
        memberRestrictionEvaluation?: Schema$MembershipRoleRestrictionEvaluation;
    }
    /**
     * Information of a RSA public key.
     */
    export interface Schema$RsaPublicKeyInfo {
        /**
         * Key size in bits (size of the modulus).
         */
        keySize?: number | null;
    }
    /**
     * SAML IDP (identity provider) configuration.
     */
    export interface Schema$SamlIdpConfig {
        /**
         * The **Change Password URL** of the identity provider. Users will be sent to this URL when changing their passwords at `myaccount.google.com`. This takes precedence over the change password URL configured at customer-level. Must use `HTTPS`.
         */
        changePasswordUri?: string | null;
        /**
         * Required. The SAML **Entity ID** of the identity provider.
         */
        entityId?: string | null;
        /**
         * The **Logout Redirect URL** (sign-out page URL) of the identity provider. When a user clicks the sign-out link on a Google page, they will be redirected to this URL. This is a pure redirect with no attached SAML `LogoutRequest` i.e. SAML single logout is not supported. Must use `HTTPS`.
         */
        logoutRedirectUri?: string | null;
        /**
         * Required. The `SingleSignOnService` endpoint location (sign-in page URL) of the identity provider. This is the URL where the `AuthnRequest` will be sent. Must use `HTTPS`. Assumed to accept the `HTTP-Redirect` binding.
         */
        singleSignOnServiceUri?: string | null;
    }
    /**
     * SAML SP (service provider) configuration.
     */
    export interface Schema$SamlSpConfig {
        /**
         * Output only. The SAML **Assertion Consumer Service (ACS) URL** to be used for the IDP-initiated login. Assumed to accept response messages via the `HTTP-POST` binding.
         */
        assertionConsumerServiceUri?: string | null;
        /**
         * Output only. The SAML **Entity ID** for this service provider.
         */
        entityId?: string | null;
    }
    /**
     * Details that are applicable when `sso_mode` == `SAML_SSO`.
     */
    export interface Schema$SamlSsoInfo {
        /**
         * Required. Name of the `InboundSamlSsoProfile` to use. Must be of the form `inboundSamlSsoProfiles/{inbound_saml_sso_profile\}`.
         */
        inboundSamlSsoProfile?: string | null;
    }
    /**
     * The response message for MembershipsService.SearchDirectGroups.
     */
    export interface Schema$SearchDirectGroupsResponse {
        /**
         * List of direct groups satisfying the query.
         */
        memberships?: Schema$MembershipRelation[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results available for listing.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for GroupsService.SearchGroups.
     */
    export interface Schema$SearchGroupsResponse {
        /**
         * The `Group` resources that match the search query.
         */
        groups?: Schema$Group[];
        /**
         * A continuation token to retrieve the next page of results, or empty if there are no more results available.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for MembershipsService.SearchTransitiveGroups.
     */
    export interface Schema$SearchTransitiveGroupsResponse {
        /**
         * List of transitive groups satisfying the query.
         */
        memberships?: Schema$GroupRelation[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results available for listing.
         */
        nextPageToken?: string | null;
    }
    /**
     * The response message for MembershipsService.SearchTransitiveMemberships.
     */
    export interface Schema$SearchTransitiveMembershipsResponse {
        /**
         * List of transitive members satisfying the query.
         */
        memberships?: Schema$MemberRelation[];
        /**
         * Token to retrieve the next page of results, or empty if there are no more results.
         */
        nextPageToken?: string | null;
    }
    /**
     * The definition of security settings.
     */
    export interface Schema$SecuritySettings {
        /**
         * The Member Restriction value
         */
        memberRestriction?: Schema$MemberRestriction;
        /**
         * Output only. The resource name of the security settings. Shall be of the form `groups/{group_id\}/securitySettings`.
         */
        name?: string | null;
    }
    /**
     * A request to send email for inviting target user corresponding to the UserInvitation.
     */
    export interface Schema$SendUserInvitationRequest {
    }
    /**
     * Setting
     */
    export interface Schema$Setting {
        /**
         * Required. Immutable. The type of the Setting. .
         */
        type?: string | null;
        /**
         * Required. The value of the Setting.
         */
        value?: {
            [key: string]: any;
        } | null;
    }
    /**
     * Controls sign-in behavior.
     */
    export interface Schema$SignInBehavior {
        /**
         * When to redirect sign-ins to the IdP.
         */
        redirectCondition?: string | null;
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
     * Message representing the role of a TransitiveMembership.
     */
    export interface Schema$TransitiveMembershipRole {
        /**
         * TransitiveMembershipRole in string format. Currently supported TransitiveMembershipRoles: `"MEMBER"`, `"OWNER"`, and `"MANAGER"`.
         */
        role?: string | null;
    }
    /**
     * Metadata for UpdateGroup LRO.
     */
    export interface Schema$UpdateGroupMetadata {
    }
    /**
     * LRO response metadata for InboundSamlSsoProfilesService.UpdateInboundSamlSsoProfile.
     */
    export interface Schema$UpdateInboundSamlSsoProfileOperationMetadata {
        /**
         * State of this Operation Will be "awaiting-multi-party-approval" when the operation is deferred due to the target customer having enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448).
         */
        state?: string | null;
    }
    /**
     * LRO response metadata for InboundSsoAssignmentsService.UpdateInboundSsoAssignment.
     */
    export interface Schema$UpdateInboundSsoAssignmentOperationMetadata {
    }
    /**
     * Metadata for UpdateMembership LRO.
     */
    export interface Schema$UpdateMembershipMetadata {
    }
    /**
     * The details of an update to a `MembershipRole`.
     */
    export interface Schema$UpdateMembershipRolesParams {
        /**
         * The fully-qualified names of fields to update. May only contain the field `expiry_detail.expire_time`.
         */
        fieldMask?: string | null;
        /**
         * The `MembershipRole`s to be updated. Only `MEMBER` `MembershipRole` can currently be updated.
         */
        membershipRole?: Schema$MembershipRole;
    }
    /**
     * The `UserInvitation` resource represents an email that can be sent to an unmanaged user account inviting them to join the customer's Google Workspace or Cloud Identity account. An unmanaged account shares an email address domain with the Google Workspace or Cloud Identity account but is not managed by it yet. If the user accepts the `UserInvitation`, the user account will become managed.
     */
    export interface Schema$UserInvitation {
        /**
         * Number of invitation emails sent to the user.
         */
        mailsSentCount?: string | null;
        /**
         * Shall be of the form `customers/{customer\}/userinvitations/{user_email_address\}`.
         */
        name?: string | null;
        /**
         * State of the `UserInvitation`.
         */
        state?: string | null;
        /**
         * Time when the `UserInvitation` was last updated.
         */
        updateTime?: string | null;
    }
    export class Resource$Customers {
        context: APIRequestContext;
        userinvitations: Resource$Customers$Userinvitations;
        constructor(context: APIRequestContext);
    }
    export class Resource$Customers$Userinvitations {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Cancels a UserInvitation that was already sent.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancel(params: Params$Resource$Customers$Userinvitations$Cancel, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancel(params?: Params$Resource$Customers$Userinvitations$Cancel, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        cancel(params: Params$Resource$Customers$Userinvitations$Cancel, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancel(params: Params$Resource$Customers$Userinvitations$Cancel, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        cancel(params: Params$Resource$Customers$Userinvitations$Cancel, callback: BodyResponseCallback<Schema$Operation>): void;
        cancel(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a UserInvitation resource. **Note:** New consumer accounts with the customer's verified domain created within the previous 48 hours will not appear in the result. This delay also applies to newly-verified domains.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Customers$Userinvitations$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Customers$Userinvitations$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UserInvitation>>;
        get(params: Params$Resource$Customers$Userinvitations$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Customers$Userinvitations$Get, options: MethodOptions | BodyResponseCallback<Schema$UserInvitation>, callback: BodyResponseCallback<Schema$UserInvitation>): void;
        get(params: Params$Resource$Customers$Userinvitations$Get, callback: BodyResponseCallback<Schema$UserInvitation>): void;
        get(callback: BodyResponseCallback<Schema$UserInvitation>): void;
        /**
         * Verifies whether a user account is eligible to receive a UserInvitation (is an unmanaged account). Eligibility is based on the following criteria: * the email address is a consumer account and it's the primary email address of the account, and * the domain of the email address matches an existing verified Google Workspace or Cloud Identity domain If both conditions are met, the user is eligible. **Note:** This method is not supported for Workspace Essentials customers.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        isInvitableUser(params: Params$Resource$Customers$Userinvitations$Isinvitableuser, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        isInvitableUser(params?: Params$Resource$Customers$Userinvitations$Isinvitableuser, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$IsInvitableUserResponse>>;
        isInvitableUser(params: Params$Resource$Customers$Userinvitations$Isinvitableuser, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        isInvitableUser(params: Params$Resource$Customers$Userinvitations$Isinvitableuser, options: MethodOptions | BodyResponseCallback<Schema$IsInvitableUserResponse>, callback: BodyResponseCallback<Schema$IsInvitableUserResponse>): void;
        isInvitableUser(params: Params$Resource$Customers$Userinvitations$Isinvitableuser, callback: BodyResponseCallback<Schema$IsInvitableUserResponse>): void;
        isInvitableUser(callback: BodyResponseCallback<Schema$IsInvitableUserResponse>): void;
        /**
         * Retrieves a list of UserInvitation resources. **Note:** New consumer accounts with the customer's verified domain created within the previous 48 hours will not appear in the result. This delay also applies to newly-verified domains.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Customers$Userinvitations$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Customers$Userinvitations$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListUserInvitationsResponse>>;
        list(params: Params$Resource$Customers$Userinvitations$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Customers$Userinvitations$List, options: MethodOptions | BodyResponseCallback<Schema$ListUserInvitationsResponse>, callback: BodyResponseCallback<Schema$ListUserInvitationsResponse>): void;
        list(params: Params$Resource$Customers$Userinvitations$List, callback: BodyResponseCallback<Schema$ListUserInvitationsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListUserInvitationsResponse>): void;
        /**
         * Sends a UserInvitation to email. If the `UserInvitation` does not exist for this request and it is a valid request, the request creates a `UserInvitation`. **Note:** The `get` and `list` methods have a 48-hour delay where newly-created consumer accounts will not appear in the results. You can still send a `UserInvitation` to those accounts if you know the unmanaged email address and IsInvitableUser==True.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        send(params: Params$Resource$Customers$Userinvitations$Send, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        send(params?: Params$Resource$Customers$Userinvitations$Send, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        send(params: Params$Resource$Customers$Userinvitations$Send, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        send(params: Params$Resource$Customers$Userinvitations$Send, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        send(params: Params$Resource$Customers$Userinvitations$Send, callback: BodyResponseCallback<Schema$Operation>): void;
        send(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Customers$Userinvitations$Cancel extends StandardParameters {
        /**
         * Required. `UserInvitation` name in the format `customers/{customer\}/userinvitations/{user_email_address\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$CancelUserInvitationRequest;
    }
    export interface Params$Resource$Customers$Userinvitations$Get extends StandardParameters {
        /**
         * Required. `UserInvitation` name in the format `customers/{customer\}/userinvitations/{user_email_address\}`
         */
        name?: string;
    }
    export interface Params$Resource$Customers$Userinvitations$Isinvitableuser extends StandardParameters {
        /**
         * Required. `UserInvitation` name in the format `customers/{customer\}/userinvitations/{user_email_address\}`
         */
        name?: string;
    }
    export interface Params$Resource$Customers$Userinvitations$List extends StandardParameters {
        /**
         * Optional. A query string for filtering `UserInvitation` results by their current state, in the format: `"state=='invited'"`.
         */
        filter?: string;
        /**
         * Optional. The sort order of the list results. You can sort the results in descending order based on either email or last update timestamp but not both, using `order_by="email desc"`. Currently, sorting is supported for `update_time asc`, `update_time desc`, `email asc`, and `email desc`. If not specified, results will be returned based on `email asc` order.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of UserInvitation resources to return. If unspecified, at most 100 resources will be returned. The maximum value is 200; values above 200 will be set to 200.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListUserInvitations` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBooks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The customer ID of the Google Workspace or Cloud Identity account the UserInvitation resources are associated with.
         */
        parent?: string;
    }
    export interface Params$Resource$Customers$Userinvitations$Send extends StandardParameters {
        /**
         * Required. `UserInvitation` name in the format `customers/{customer\}/userinvitations/{user_email_address\}`
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SendUserInvitationRequest;
    }
    export class Resource$Devices {
        context: APIRequestContext;
        deviceUsers: Resource$Devices$Deviceusers;
        constructor(context: APIRequestContext);
        /**
         * Cancels an unfinished device wipe. This operation can be used to cancel device wipe in the gap between the wipe operation returning success and the device being wiped. This operation is possible when the device is in a "pending wipe" state. The device enters the "pending wipe" state when a wipe device command is issued, but has not yet been sent to the device. The cancel wipe will fail if the wipe command has already been issued to the device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancelWipe(params: Params$Resource$Devices$Cancelwipe, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancelWipe(params?: Params$Resource$Devices$Cancelwipe, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        cancelWipe(params: Params$Resource$Devices$Cancelwipe, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancelWipe(params: Params$Resource$Devices$Cancelwipe, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        cancelWipe(params: Params$Resource$Devices$Cancelwipe, callback: BodyResponseCallback<Schema$Operation>): void;
        cancelWipe(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Creates a device. Only company-owned device may be created. **Note**: This method is available only to customers who have one of the following SKUs: Enterprise Standard, Enterprise Plus, Enterprise for Education, and Cloud Identity Premium
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Devices$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Devices$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Devices$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Devices$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Devices$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Devices$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Devices$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Devices$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Devices$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Devices$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Devices$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Devices$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1Device>>;
        get(params: Params$Resource$Devices$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Devices$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1Device>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1Device>): void;
        get(params: Params$Resource$Devices$Get, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1Device>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1Device>): void;
        /**
         * Lists/Searches devices.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Devices$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Devices$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse>>;
        list(params: Params$Resource$Devices$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Devices$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse>): void;
        list(params: Params$Resource$Devices$List, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDevicesResponse>): void;
        /**
         * Wipes all data on the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        wipe(params: Params$Resource$Devices$Wipe, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        wipe(params?: Params$Resource$Devices$Wipe, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        wipe(params: Params$Resource$Devices$Wipe, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        wipe(params: Params$Resource$Devices$Wipe, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        wipe(params: Params$Resource$Devices$Wipe, callback: BodyResponseCallback<Schema$Operation>): void;
        wipe(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Devices$Cancelwipe extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}`, where device is the unique ID assigned to the Device.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceRequest;
    }
    export interface Params$Resource$Devices$Create extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1Device;
    }
    export interface Params$Resource$Devices$Delete extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}`, where device is the unique ID assigned to the Device.
         */
        name?: string;
    }
    export interface Params$Resource$Devices$Get extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Customer in the format: `customers/{customer\}`, where customer is the customer to whom the device belongs. If you're using this API for your own organization, use `customers/my_customer`. If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in the format: `devices/{device\}`, where device is the unique ID assigned to the Device.
         */
        name?: string;
    }
    export interface Params$Resource$Devices$List extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer in the format: `customers/{customer\}`, where customer is the customer to whom the device belongs. If you're using this API for your own organization, use `customers/my_customer`. If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Optional. Additional restrictions when fetching list of devices. For a list of search fields, refer to [Mobile device search fields](https://developers.google.com/admin-sdk/directory/v1/search-operators). Multiple search fields are separated by the space character.
         */
        filter?: string;
        /**
         * Optional. Order specification for devices in the response. Only one of the following field names may be used to specify the order: `create_time`, `last_sync_time`, `model`, `os_version`, `device_type` and `serial_number`. `desc` may be specified optionally at the end to specify results to be sorted in descending order. Default order is ascending.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of Devices to return. If unspecified, at most 20 Devices will be returned. The maximum value is 100; values above 100 will be coerced to 100.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListDevices` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListDevices` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Optional. The view to use for the List request.
         */
        view?: string;
    }
    export interface Params$Resource$Devices$Wipe extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceRequest;
    }
    export class Resource$Devices$Deviceusers {
        context: APIRequestContext;
        clientStates: Resource$Devices$Deviceusers$Clientstates;
        constructor(context: APIRequestContext);
        /**
         * Approves device to access user data.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        approve(params: Params$Resource$Devices$Deviceusers$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Devices$Deviceusers$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        approve(params: Params$Resource$Devices$Deviceusers$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Devices$Deviceusers$Approve, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        approve(params: Params$Resource$Devices$Deviceusers$Approve, callback: BodyResponseCallback<Schema$Operation>): void;
        approve(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Blocks device from accessing user data
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        block(params: Params$Resource$Devices$Deviceusers$Block, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        block(params?: Params$Resource$Devices$Deviceusers$Block, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        block(params: Params$Resource$Devices$Deviceusers$Block, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        block(params: Params$Resource$Devices$Deviceusers$Block, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        block(params: Params$Resource$Devices$Deviceusers$Block, callback: BodyResponseCallback<Schema$Operation>): void;
        block(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Cancels an unfinished user account wipe. This operation can be used to cancel device wipe in the gap between the wipe operation returning success and the device being wiped.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        cancelWipe(params: Params$Resource$Devices$Deviceusers$Cancelwipe, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        cancelWipe(params?: Params$Resource$Devices$Deviceusers$Cancelwipe, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        cancelWipe(params: Params$Resource$Devices$Deviceusers$Cancelwipe, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        cancelWipe(params: Params$Resource$Devices$Deviceusers$Cancelwipe, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        cancelWipe(params: Params$Resource$Devices$Deviceusers$Cancelwipe, callback: BodyResponseCallback<Schema$Operation>): void;
        cancelWipe(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes the specified DeviceUser. This also revokes the user's access to device data.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Devices$Deviceusers$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Devices$Deviceusers$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Devices$Deviceusers$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Devices$Deviceusers$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Devices$Deviceusers$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves the specified DeviceUser
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Devices$Deviceusers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Devices$Deviceusers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1DeviceUser>>;
        get(params: Params$Resource$Devices$Deviceusers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Devices$Deviceusers$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1DeviceUser>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1DeviceUser>): void;
        get(params: Params$Resource$Devices$Deviceusers$Get, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1DeviceUser>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1DeviceUser>): void;
        /**
         * Lists/Searches DeviceUsers.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Devices$Deviceusers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Devices$Deviceusers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse>>;
        list(params: Params$Resource$Devices$Deviceusers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Devices$Deviceusers$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse>): void;
        list(params: Params$Resource$Devices$Deviceusers$List, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListDeviceUsersResponse>): void;
        /**
         * Looks up resource names of the DeviceUsers associated with the caller's credentials, as well as the properties provided in the request. This method must be called with end-user credentials with the scope: https://www.googleapis.com/auth/cloud-identity.devices.lookup If multiple properties are provided, only DeviceUsers having all of these properties are considered as matches - i.e. the query behaves like an AND. Different platforms require different amounts of information from the caller to ensure that the DeviceUser is uniquely identified. - iOS: No properties need to be passed, the caller's credentials are sufficient to identify the corresponding DeviceUser. - Android: Specifying the 'android_id' field is required. - Desktop: Specifying the 'raw_resource_id' field is required.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Devices$Deviceusers$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Devices$Deviceusers$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse>>;
        lookup(params: Params$Resource$Devices$Deviceusers$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Devices$Deviceusers$Lookup, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse>): void;
        lookup(params: Params$Resource$Devices$Deviceusers$Lookup, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse>): void;
        lookup(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1LookupSelfDeviceUsersResponse>): void;
        /**
         * Wipes the user's account on a device. Other data on the device that is not associated with the user's work account is not affected. For example, if a Gmail app is installed on a device that is used for personal and work purposes, and the user is logged in to the Gmail app with their personal account as well as their work account, wiping the "deviceUser" by their work administrator will not affect their personal account within Gmail or other apps such as Photos.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        wipe(params: Params$Resource$Devices$Deviceusers$Wipe, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        wipe(params?: Params$Resource$Devices$Deviceusers$Wipe, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        wipe(params: Params$Resource$Devices$Deviceusers$Wipe, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        wipe(params: Params$Resource$Devices$Deviceusers$Wipe, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        wipe(params: Params$Resource$Devices$Deviceusers$Wipe, callback: BodyResponseCallback<Schema$Operation>): void;
        wipe(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Devices$Deviceusers$Approve extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1ApproveDeviceUserRequest;
    }
    export interface Params$Resource$Devices$Deviceusers$Block extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1BlockDeviceUserRequest;
    }
    export interface Params$Resource$Devices$Deviceusers$Cancelwipe extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1CancelWipeDeviceUserRequest;
    }
    export interface Params$Resource$Devices$Deviceusers$Delete extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$Get extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$List extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Optional. Additional restrictions when fetching list of devices. For a list of search fields, refer to [Mobile device search fields](https://developers.google.com/admin-sdk/directory/v1/search-operators). Multiple search fields are separated by the space character.
         */
        filter?: string;
        /**
         * Optional. Order specification for devices in the response.
         */
        orderBy?: string;
        /**
         * Optional. The maximum number of DeviceUsers to return. If unspecified, at most 5 DeviceUsers will be returned. The maximum value is 20; values above 20 will be coerced to 20.
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListDeviceUsers` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListBooks` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. To list all DeviceUsers, set this to "devices/-". To list all DeviceUsers owned by a device, set this to the resource name of the device. Format: devices/{device\}
         */
        parent?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$Lookup extends StandardParameters {
        /**
         * Android Id returned by [Settings.Secure#ANDROID_ID](https://developer.android.com/reference/android/provider/Settings.Secure.html#ANDROID_ID).
         */
        androidId?: string;
        /**
         * The maximum number of DeviceUsers to return. If unspecified, at most 20 DeviceUsers will be returned. The maximum value is 20; values above 20 will be coerced to 20.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `LookupDeviceUsers` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `LookupDeviceUsers` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Must be set to "devices/-/deviceUsers" to search across all DeviceUser belonging to the user.
         */
        parent?: string;
        /**
         * Raw Resource Id used by Google Endpoint Verification. If the user is enrolled into Google Endpoint Verification, this id will be saved as the 'device_resource_id' field in the following platform dependent files. * macOS: ~/.secureConnect/context_aware_config.json * Windows: %USERPROFILE%\AppData\Local\Google\Endpoint Verification\accounts.json * Linux: ~/.secureConnect/context_aware_config.json
         */
        rawResourceId?: string;
        /**
         * The user whose DeviceUser's resource name will be fetched. Must be set to 'me' to fetch the DeviceUser's resource name for the calling user.
         */
        userId?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$Wipe extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Device in format: `devices/{device\}/deviceUsers/{device_user\}`, where device is the unique ID assigned to the Device, and device_user is the unique ID assigned to the User.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1WipeDeviceUserRequest;
    }
    export class Resource$Devices$Deviceusers$Clientstates {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets the client state for the device user
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Devices$Deviceusers$Clientstates$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Devices$Deviceusers$Clientstates$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1ClientState>>;
        get(params: Params$Resource$Devices$Deviceusers$Clientstates$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Devices$Deviceusers$Clientstates$Get, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ClientState>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ClientState>): void;
        get(params: Params$Resource$Devices$Deviceusers$Clientstates$Get, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ClientState>): void;
        get(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ClientState>): void;
        /**
         * Lists the client states for the given search query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Devices$Deviceusers$Clientstates$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Devices$Deviceusers$Clientstates$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse>>;
        list(params: Params$Resource$Devices$Deviceusers$Clientstates$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Devices$Deviceusers$Clientstates$List, options: MethodOptions | BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse>, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse>): void;
        list(params: Params$Resource$Devices$Deviceusers$Clientstates$List, callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse>): void;
        list(callback: BodyResponseCallback<Schema$GoogleAppsCloudidentityDevicesV1ListClientStatesResponse>): void;
        /**
         * Updates the client state for the device user **Note**: This method is available only to customers who have one of the following SKUs: Enterprise Standard, Enterprise Plus, Enterprise for Education, and Cloud Identity Premium
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Devices$Deviceusers$Clientstates$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Devices$Deviceusers$Clientstates$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Devices$Deviceusers$Clientstates$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Devices$Deviceusers$Clientstates$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Devices$Deviceusers$Clientstates$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Devices$Deviceusers$Clientstates$Get extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the ClientState in format: `devices/{device\}/deviceUsers/{device_user\}/clientStates/{partner\}`, where `device` is the unique ID assigned to the Device, `device_user` is the unique ID assigned to the User and `partner` identifies the partner storing the data. To get the client state for devices belonging to your own organization, the `partnerId` is in the format: `customerId-*anystring*`. Where the `customerId` is your organization's customer ID and `anystring` is any suffix. This suffix is used in setting up Custom Access Levels in Context-Aware Access. You may use `my_customer` instead of the customer ID for devices managed by your own organization. You may specify `-` in place of the `{device\}`, so the ClientState resource name can be: `devices/-/deviceUsers/{device_user_resource\}/clientStates/{partner\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$Clientstates$List extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Optional. Additional restrictions when fetching list of client states.
         */
        filter?: string;
        /**
         * Optional. Order specification for client states in the response.
         */
        orderBy?: string;
        /**
         * Optional. A page token, received from a previous `ListClientStates` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListClientStates` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. To list all ClientStates, set this to "devices/-/deviceUsers/-". To list all ClientStates owned by a DeviceUser, set this to the resource name of the DeviceUser. Format: devices/{device\}/deviceUsers/{deviceUser\}
         */
        parent?: string;
    }
    export interface Params$Resource$Devices$Deviceusers$Clientstates$Patch extends StandardParameters {
        /**
         * Optional. [Resource name](https://cloud.google.com/apis/design/resource_names) of the customer. If you're using this API for your own organization, use `customers/my_customer` If you're using this API to manage another organization, use `customers/{customer\}`, where customer is the customer to whom the device belongs.
         */
        customer?: string;
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the ClientState in format: `devices/{device\}/deviceUsers/{device_user\}/clientState/{partner\}`, where partner corresponds to the partner storing the data. For partners belonging to the "BeyondCorp Alliance", this is the partner ID specified to you by Google. For all other callers, this is a string of the form: `{customer\}-suffix`, where `customer` is your customer ID. The *suffix* is any string the caller specifies. This string will be displayed verbatim in the administration console. This suffix is used in setting up Custom Access Levels in Context-Aware Access. Your organization's customer ID can be obtained from the URL: `GET https://www.googleapis.com/admin/directory/v1/customers/my_customer` The `id` field in the response contains the customer ID starting with the letter 'C'. The customer ID to be used in this API is the string after the letter 'C' (not including 'C')
         */
        name?: string;
        /**
         * Optional. Comma-separated list of fully qualified names of fields to be updated. If not specified, all updatable fields in ClientState are updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$GoogleAppsCloudidentityDevicesV1ClientState;
    }
    export class Resource$Groups {
        context: APIRequestContext;
        memberships: Resource$Groups$Memberships;
        constructor(context: APIRequestContext);
        /**
         * Creates a Group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Groups$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Groups$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Groups$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Groups$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Groups$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a `Group`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Groups$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Groups$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Groups$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Groups$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Groups$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a `Group`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Groups$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Groups$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Group>>;
        get(params: Params$Resource$Groups$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Groups$Get, options: MethodOptions | BodyResponseCallback<Schema$Group>, callback: BodyResponseCallback<Schema$Group>): void;
        get(params: Params$Resource$Groups$Get, callback: BodyResponseCallback<Schema$Group>): void;
        get(callback: BodyResponseCallback<Schema$Group>): void;
        /**
         * Get Security Settings
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getSecuritySettings(params: Params$Resource$Groups$Getsecuritysettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getSecuritySettings(params?: Params$Resource$Groups$Getsecuritysettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SecuritySettings>>;
        getSecuritySettings(params: Params$Resource$Groups$Getsecuritysettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getSecuritySettings(params: Params$Resource$Groups$Getsecuritysettings, options: MethodOptions | BodyResponseCallback<Schema$SecuritySettings>, callback: BodyResponseCallback<Schema$SecuritySettings>): void;
        getSecuritySettings(params: Params$Resource$Groups$Getsecuritysettings, callback: BodyResponseCallback<Schema$SecuritySettings>): void;
        getSecuritySettings(callback: BodyResponseCallback<Schema$SecuritySettings>): void;
        /**
         * Lists the `Group` resources under a customer or namespace.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Groups$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Groups$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListGroupsResponse>>;
        list(params: Params$Resource$Groups$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Groups$List, options: MethodOptions | BodyResponseCallback<Schema$ListGroupsResponse>, callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        list(params: Params$Resource$Groups$List, callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListGroupsResponse>): void;
        /**
         * Looks up the [resource name](https://cloud.google.com/apis/design/resource_names) of a `Group` by its `EntityKey`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Groups$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Groups$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LookupGroupNameResponse>>;
        lookup(params: Params$Resource$Groups$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Groups$Lookup, options: MethodOptions | BodyResponseCallback<Schema$LookupGroupNameResponse>, callback: BodyResponseCallback<Schema$LookupGroupNameResponse>): void;
        lookup(params: Params$Resource$Groups$Lookup, callback: BodyResponseCallback<Schema$LookupGroupNameResponse>): void;
        lookup(callback: BodyResponseCallback<Schema$LookupGroupNameResponse>): void;
        /**
         * Updates a `Group`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Groups$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Groups$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Groups$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Groups$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Groups$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Searches for `Group` resources matching a specified query.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        search(params: Params$Resource$Groups$Search, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        search(params?: Params$Resource$Groups$Search, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchGroupsResponse>>;
        search(params: Params$Resource$Groups$Search, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        search(params: Params$Resource$Groups$Search, options: MethodOptions | BodyResponseCallback<Schema$SearchGroupsResponse>, callback: BodyResponseCallback<Schema$SearchGroupsResponse>): void;
        search(params: Params$Resource$Groups$Search, callback: BodyResponseCallback<Schema$SearchGroupsResponse>): void;
        search(callback: BodyResponseCallback<Schema$SearchGroupsResponse>): void;
        /**
         * Update Security Settings
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        updateSecuritySettings(params: Params$Resource$Groups$Updatesecuritysettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        updateSecuritySettings(params?: Params$Resource$Groups$Updatesecuritysettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        updateSecuritySettings(params: Params$Resource$Groups$Updatesecuritysettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        updateSecuritySettings(params: Params$Resource$Groups$Updatesecuritysettings, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        updateSecuritySettings(params: Params$Resource$Groups$Updatesecuritysettings, callback: BodyResponseCallback<Schema$Operation>): void;
        updateSecuritySettings(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Groups$Create extends StandardParameters {
        /**
         * Optional. The initial configuration option for the `Group`.
         */
        initialGroupConfig?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Group;
    }
    export interface Params$Resource$Groups$Delete extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Group` to retrieve. Must be of the form `groups/{group\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Groups$Get extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Group` to retrieve. Must be of the form `groups/{group\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Groups$Getsecuritysettings extends StandardParameters {
        /**
         * Required. The security settings to retrieve. Format: `groups/{group_id\}/securitySettings`
         */
        name?: string;
        /**
         * Field-level read mask of which fields to return. "*" returns all fields. If not specified, all fields will be returned. May only contain the following field: `member_restriction`.
         */
        readMask?: string;
    }
    export interface Params$Resource$Groups$List extends StandardParameters {
        /**
         * The maximum number of results to return. Note that the number of results returned may be less than this value even if there are more available results. To fetch all results, clients must continue calling this method repeatedly until the response no longer contains a `next_page_token`. If unspecified, defaults to 200 for `View.BASIC` and to 50 for `View.FULL`. Must not be greater than 1000 for `View.BASIC` or 500 for `View.FULL`.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent resource under which to list all `Group` resources. Must be of the form `identitysources/{identity_source\}` for external- identity-mapped groups or `customers/{customer_id\}` for Google Groups. The `customer_id` must begin with "C" (for example, 'C046psxkn'). [Find your customer ID.] (https://support.google.com/cloudidentity/answer/10070793)
         */
        parent?: string;
        /**
         * The level of detail to be returned. If unspecified, defaults to `View.BASIC`.
         */
        view?: string;
    }
    export interface Params$Resource$Groups$Lookup extends StandardParameters {
        /**
         * The ID of the entity. For Google-managed entities, the `id` should be the email address of an existing group or user. Email addresses need to adhere to [name guidelines for users and groups](https://support.google.com/a/answer/9193374). For external-identity-mapped entities, the `id` must be a string conforming to the Identity Source's requirements. Must be unique within a `namespace`.
         */
        'groupKey.id'?: string;
        /**
         * The namespace in which the entity exists. If not specified, the `EntityKey` represents a Google-managed entity such as a Google user or a Google Group. If specified, the `EntityKey` represents an external-identity-mapped group. The namespace must correspond to an identity source created in Admin Console and must be in the form of `identitysources/{identity_source\}`.
         */
        'groupKey.namespace'?: string;
    }
    export interface Params$Resource$Groups$Patch extends StandardParameters {
        /**
         * Output only. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Group`. Shall be of the form `groups/{group\}`.
         */
        name?: string;
        /**
         * Required. The names of fields to update. May only contain the following field names: `display_name`, `description`, `labels`.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Group;
    }
    export interface Params$Resource$Groups$Search extends StandardParameters {
        /**
         * The maximum number of results to return. Note that the number of results returned may be less than this value even if there are more available results. To fetch all results, clients must continue calling this method repeatedly until the response no longer contains a `next_page_token`. If unspecified, defaults to 200 for `GroupView.BASIC` and 50 for `GroupView.FULL`. Must not be greater than 1000 for `GroupView.BASIC` or 500 for `GroupView.FULL`.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous search request, if any.
         */
        pageToken?: string;
        /**
         * Required. The search query. * Must be specified in [Common Expression Language](https://opensource.google/projects/cel). * Must contain equality operators on the parent, e.g. `parent == 'customers/{customer_id\}'`. The `customer_id` must begin with "C" (for example, 'C046psxkn'). [Find your customer ID.] (https://support.google.com/cloudidentity/answer/10070793) * Can contain optional inclusion operators on `labels` such as `'cloudidentity.googleapis.com/groups.discussion_forum' in labels`). * Can contain an optional equality operator on `domain_name`. e.g. `domain_name == 'examplepetstore.com'` * Can contain optional `startsWith/contains/equality` operators on `group_key`, e.g. `group_key.startsWith('dev')`, `group_key.contains('dev'), group_key == 'dev@examplepetstore.com'` * Can contain optional `startsWith/contains/equality` operators on `display_name`, such as `display_name.startsWith('dev')` , `display_name.contains('dev')`, `display_name == 'dev'`
         */
        query?: string;
        /**
         * The level of detail to be returned. If unspecified, defaults to `View.BASIC`.
         */
        view?: string;
    }
    export interface Params$Resource$Groups$Updatesecuritysettings extends StandardParameters {
        /**
         * Output only. The resource name of the security settings. Shall be of the form `groups/{group_id\}/securitySettings`.
         */
        name?: string;
        /**
         * Required. The fully-qualified names of fields to update. May only contain the following field: `member_restriction.query`.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$SecuritySettings;
    }
    export class Resource$Groups$Memberships {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Check a potential member for membership in a group. **Note:** This feature is only available to Google Workspace Enterprise Standard, Enterprise Plus, and Enterprise for Education; and Cloud Identity Premium accounts. If the account of the member is not one of these, a 403 (PERMISSION_DENIED) HTTP status code will be returned. A member has membership to a group as long as there is a single viewable transitive membership between the group and the member. The actor must have view permissions to at least one transitive membership between the member and group.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        checkTransitiveMembership(params: Params$Resource$Groups$Memberships$Checktransitivemembership, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        checkTransitiveMembership(params?: Params$Resource$Groups$Memberships$Checktransitivemembership, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$CheckTransitiveMembershipResponse>>;
        checkTransitiveMembership(params: Params$Resource$Groups$Memberships$Checktransitivemembership, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        checkTransitiveMembership(params: Params$Resource$Groups$Memberships$Checktransitivemembership, options: MethodOptions | BodyResponseCallback<Schema$CheckTransitiveMembershipResponse>, callback: BodyResponseCallback<Schema$CheckTransitiveMembershipResponse>): void;
        checkTransitiveMembership(params: Params$Resource$Groups$Memberships$Checktransitivemembership, callback: BodyResponseCallback<Schema$CheckTransitiveMembershipResponse>): void;
        checkTransitiveMembership(callback: BodyResponseCallback<Schema$CheckTransitiveMembershipResponse>): void;
        /**
         * Creates a `Membership`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Groups$Memberships$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Groups$Memberships$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Groups$Memberships$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Groups$Memberships$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Groups$Memberships$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes a `Membership`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Groups$Memberships$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Groups$Memberships$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Groups$Memberships$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Groups$Memberships$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Groups$Memberships$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Retrieves a `Membership`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Groups$Memberships$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Groups$Memberships$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Membership>>;
        get(params: Params$Resource$Groups$Memberships$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Groups$Memberships$Get, options: MethodOptions | BodyResponseCallback<Schema$Membership>, callback: BodyResponseCallback<Schema$Membership>): void;
        get(params: Params$Resource$Groups$Memberships$Get, callback: BodyResponseCallback<Schema$Membership>): void;
        get(callback: BodyResponseCallback<Schema$Membership>): void;
        /**
         * Get a membership graph of just a member or both a member and a group. **Note:** This feature is only available to Google Workspace Enterprise Standard, Enterprise Plus, and Enterprise for Education; and Cloud Identity Premium accounts. If the account of the member is not one of these, a 403 (PERMISSION_DENIED) HTTP status code will be returned. Given a member, the response will contain all membership paths from the member. Given both a group and a member, the response will contain all membership paths between the group and the member.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getMembershipGraph(params: Params$Resource$Groups$Memberships$Getmembershipgraph, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getMembershipGraph(params?: Params$Resource$Groups$Memberships$Getmembershipgraph, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        getMembershipGraph(params: Params$Resource$Groups$Memberships$Getmembershipgraph, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getMembershipGraph(params: Params$Resource$Groups$Memberships$Getmembershipgraph, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        getMembershipGraph(params: Params$Resource$Groups$Memberships$Getmembershipgraph, callback: BodyResponseCallback<Schema$Operation>): void;
        getMembershipGraph(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Lists the `Membership`s within a `Group`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Groups$Memberships$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Groups$Memberships$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListMembershipsResponse>>;
        list(params: Params$Resource$Groups$Memberships$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Groups$Memberships$List, options: MethodOptions | BodyResponseCallback<Schema$ListMembershipsResponse>, callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        list(params: Params$Resource$Groups$Memberships$List, callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListMembershipsResponse>): void;
        /**
         * Looks up the [resource name](https://cloud.google.com/apis/design/resource_names) of a `Membership` by its `EntityKey`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        lookup(params: Params$Resource$Groups$Memberships$Lookup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        lookup(params?: Params$Resource$Groups$Memberships$Lookup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$LookupMembershipNameResponse>>;
        lookup(params: Params$Resource$Groups$Memberships$Lookup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        lookup(params: Params$Resource$Groups$Memberships$Lookup, options: MethodOptions | BodyResponseCallback<Schema$LookupMembershipNameResponse>, callback: BodyResponseCallback<Schema$LookupMembershipNameResponse>): void;
        lookup(params: Params$Resource$Groups$Memberships$Lookup, callback: BodyResponseCallback<Schema$LookupMembershipNameResponse>): void;
        lookup(callback: BodyResponseCallback<Schema$LookupMembershipNameResponse>): void;
        /**
         * Modifies the `MembershipRole`s of a `Membership`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        modifyMembershipRoles(params: Params$Resource$Groups$Memberships$Modifymembershiproles, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        modifyMembershipRoles(params?: Params$Resource$Groups$Memberships$Modifymembershiproles, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ModifyMembershipRolesResponse>>;
        modifyMembershipRoles(params: Params$Resource$Groups$Memberships$Modifymembershiproles, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        modifyMembershipRoles(params: Params$Resource$Groups$Memberships$Modifymembershiproles, options: MethodOptions | BodyResponseCallback<Schema$ModifyMembershipRolesResponse>, callback: BodyResponseCallback<Schema$ModifyMembershipRolesResponse>): void;
        modifyMembershipRoles(params: Params$Resource$Groups$Memberships$Modifymembershiproles, callback: BodyResponseCallback<Schema$ModifyMembershipRolesResponse>): void;
        modifyMembershipRoles(callback: BodyResponseCallback<Schema$ModifyMembershipRolesResponse>): void;
        /**
         * Searches direct groups of a member.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchDirectGroups(params: Params$Resource$Groups$Memberships$Searchdirectgroups, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchDirectGroups(params?: Params$Resource$Groups$Memberships$Searchdirectgroups, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchDirectGroupsResponse>>;
        searchDirectGroups(params: Params$Resource$Groups$Memberships$Searchdirectgroups, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchDirectGroups(params: Params$Resource$Groups$Memberships$Searchdirectgroups, options: MethodOptions | BodyResponseCallback<Schema$SearchDirectGroupsResponse>, callback: BodyResponseCallback<Schema$SearchDirectGroupsResponse>): void;
        searchDirectGroups(params: Params$Resource$Groups$Memberships$Searchdirectgroups, callback: BodyResponseCallback<Schema$SearchDirectGroupsResponse>): void;
        searchDirectGroups(callback: BodyResponseCallback<Schema$SearchDirectGroupsResponse>): void;
        /**
         * Search transitive groups of a member. **Note:** This feature is only available to Google Workspace Enterprise Standard, Enterprise Plus, and Enterprise for Education; and Cloud Identity Premium accounts. If the account of the member is not one of these, a 403 (PERMISSION_DENIED) HTTP status code will be returned. A transitive group is any group that has a direct or indirect membership to the member. Actor must have view permissions all transitive groups.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchTransitiveGroups(params: Params$Resource$Groups$Memberships$Searchtransitivegroups, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchTransitiveGroups(params?: Params$Resource$Groups$Memberships$Searchtransitivegroups, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchTransitiveGroupsResponse>>;
        searchTransitiveGroups(params: Params$Resource$Groups$Memberships$Searchtransitivegroups, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchTransitiveGroups(params: Params$Resource$Groups$Memberships$Searchtransitivegroups, options: MethodOptions | BodyResponseCallback<Schema$SearchTransitiveGroupsResponse>, callback: BodyResponseCallback<Schema$SearchTransitiveGroupsResponse>): void;
        searchTransitiveGroups(params: Params$Resource$Groups$Memberships$Searchtransitivegroups, callback: BodyResponseCallback<Schema$SearchTransitiveGroupsResponse>): void;
        searchTransitiveGroups(callback: BodyResponseCallback<Schema$SearchTransitiveGroupsResponse>): void;
        /**
         * Search transitive memberships of a group. **Note:** This feature is only available to Google Workspace Enterprise Standard, Enterprise Plus, and Enterprise for Education; and Cloud Identity Premium accounts. If the account of the group is not one of these, a 403 (PERMISSION_DENIED) HTTP status code will be returned. A transitive membership is any direct or indirect membership of a group. Actor must have view permissions to all transitive memberships.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        searchTransitiveMemberships(params: Params$Resource$Groups$Memberships$Searchtransitivememberships, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        searchTransitiveMemberships(params?: Params$Resource$Groups$Memberships$Searchtransitivememberships, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SearchTransitiveMembershipsResponse>>;
        searchTransitiveMemberships(params: Params$Resource$Groups$Memberships$Searchtransitivememberships, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        searchTransitiveMemberships(params: Params$Resource$Groups$Memberships$Searchtransitivememberships, options: MethodOptions | BodyResponseCallback<Schema$SearchTransitiveMembershipsResponse>, callback: BodyResponseCallback<Schema$SearchTransitiveMembershipsResponse>): void;
        searchTransitiveMemberships(params: Params$Resource$Groups$Memberships$Searchtransitivememberships, callback: BodyResponseCallback<Schema$SearchTransitiveMembershipsResponse>): void;
        searchTransitiveMemberships(callback: BodyResponseCallback<Schema$SearchTransitiveMembershipsResponse>): void;
    }
    export interface Params$Resource$Groups$Memberships$Checktransitivemembership extends StandardParameters {
        /**
         * [Resource name](https://cloud.google.com/apis/design/resource_names) of the group to check the transitive membership in. Format: `groups/{group\}`, where `group` is the unique id assigned to the Group to which the Membership belongs to.
         */
        parent?: string;
        /**
         * Required. A CEL expression that MUST include member specification. This is a `required` field. Certain groups are uniquely identified by both a 'member_key_id' and a 'member_key_namespace', which requires an additional query input: 'member_key_namespace'. Example query: `member_key_id == 'member_key_id_value'`
         */
        query?: string;
    }
    export interface Params$Resource$Groups$Memberships$Create extends StandardParameters {
        /**
         * Required. The parent `Group` resource under which to create the `Membership`. Must be of the form `groups/{group\}`.
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Membership;
    }
    export interface Params$Resource$Groups$Memberships$Delete extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Membership` to delete. Must be of the form `groups/{group\}/memberships/{membership\}`
         */
        name?: string;
    }
    export interface Params$Resource$Groups$Memberships$Get extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Membership` to retrieve. Must be of the form `groups/{group\}/memberships/{membership\}`.
         */
        name?: string;
    }
    export interface Params$Resource$Groups$Memberships$Getmembershipgraph extends StandardParameters {
        /**
         * Required. [Resource name](https://cloud.google.com/apis/design/resource_names) of the group to search transitive memberships in. Format: `groups/{group\}`, where `group` is the unique ID assigned to the Group to which the Membership belongs to. group can be a wildcard collection id "-". When a group is specified, the membership graph will be constrained to paths between the member (defined in the query) and the parent. If a wildcard collection is provided, all membership paths connected to the member will be returned.
         */
        parent?: string;
        /**
         * Required. A CEL expression that MUST include member specification AND label(s). Certain groups are uniquely identified by both a 'member_key_id' and a 'member_key_namespace', which requires an additional query input: 'member_key_namespace'. Example query: `member_key_id == 'member_key_id_value' && in labels`
         */
        query?: string;
    }
    export interface Params$Resource$Groups$Memberships$List extends StandardParameters {
        /**
         * The maximum number of results to return. Note that the number of results returned may be less than this value even if there are more available results. To fetch all results, clients must continue calling this method repeatedly until the response no longer contains a `next_page_token`. If unspecified, defaults to 200 for `GroupView.BASIC` and to 50 for `GroupView.FULL`. Must not be greater than 1000 for `GroupView.BASIC` or 500 for `GroupView.FULL`.
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous search request, if any.
         */
        pageToken?: string;
        /**
         * Required. The parent `Group` resource under which to lookup the `Membership` name. Must be of the form `groups/{group\}`.
         */
        parent?: string;
        /**
         * The level of detail to be returned. If unspecified, defaults to `View.BASIC`.
         */
        view?: string;
    }
    export interface Params$Resource$Groups$Memberships$Lookup extends StandardParameters {
        /**
         * The ID of the entity. For Google-managed entities, the `id` should be the email address of an existing group or user. Email addresses need to adhere to [name guidelines for users and groups](https://support.google.com/a/answer/9193374). For external-identity-mapped entities, the `id` must be a string conforming to the Identity Source's requirements. Must be unique within a `namespace`.
         */
        'memberKey.id'?: string;
        /**
         * The namespace in which the entity exists. If not specified, the `EntityKey` represents a Google-managed entity such as a Google user or a Google Group. If specified, the `EntityKey` represents an external-identity-mapped group. The namespace must correspond to an identity source created in Admin Console and must be in the form of `identitysources/{identity_source\}`.
         */
        'memberKey.namespace'?: string;
        /**
         * Required. The parent `Group` resource under which to lookup the `Membership` name. Must be of the form `groups/{group\}`.
         */
        parent?: string;
    }
    export interface Params$Resource$Groups$Memberships$Modifymembershiproles extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the `Membership` whose roles are to be modified. Must be of the form `groups/{group\}/memberships/{membership\}`.
         */
        name?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ModifyMembershipRolesRequest;
    }
    export interface Params$Resource$Groups$Memberships$Searchdirectgroups extends StandardParameters {
        /**
         * The ordering of membership relation for the display name or email in the response. The syntax for this field can be found at https://cloud.google.com/apis/design/design_patterns#sorting_order. Example: Sort by the ascending display name: order_by="group_name" or order_by="group_name asc". Sort by the descending display name: order_by="group_name desc". Sort by the ascending group key: order_by="group_key" or order_by="group_key asc". Sort by the descending group key: order_by="group_key desc".
         */
        orderBy?: string;
        /**
         * The default page size is 200 (max 1000).
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous list request, if any
         */
        pageToken?: string;
        /**
         * [Resource name](https://cloud.google.com/apis/design/resource_names) of the group to search transitive memberships in. Format: groups/{group_id\}, where group_id is always '-' as this API will search across all groups for a given member.
         */
        parent?: string;
        /**
         * Required. A CEL expression that MUST include member specification AND label(s). Users can search on label attributes of groups. CONTAINS match ('in') is supported on labels. Identity-mapped groups are uniquely identified by both a `member_key_id` and a `member_key_namespace`, which requires an additional query input: `member_key_namespace`. Example query: `member_key_id == 'member_key_id_value' && 'label_value' in labels`
         */
        query?: string;
    }
    export interface Params$Resource$Groups$Memberships$Searchtransitivegroups extends StandardParameters {
        /**
         * The default page size is 200 (max 1000).
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * [Resource name](https://cloud.google.com/apis/design/resource_names) of the group to search transitive memberships in. Format: `groups/{group\}`, where `group` is always '-' as this API will search across all groups for a given member.
         */
        parent?: string;
        /**
         * Required. A CEL expression that MUST include member specification AND label(s). This is a `required` field. Users can search on label attributes of groups. CONTAINS match ('in') is supported on labels. Identity-mapped groups are uniquely identified by both a `member_key_id` and a `member_key_namespace`, which requires an additional query input: `member_key_namespace`. Example query: `member_key_id == 'member_key_id_value' && in labels` Query may optionally contain equality operators on the parent of the group restricting the search within a particular customer, e.g. `parent == 'customers/{customer_id\}'`. The `customer_id` must begin with "C" (for example, 'C046psxkn'). This filtering is only supported for Admins with groups read permissions on the input customer. Example query: `member_key_id == 'member_key_id_value' && in labels && parent == 'customers/C046psxkn'`
         */
        query?: string;
    }
    export interface Params$Resource$Groups$Memberships$Searchtransitivememberships extends StandardParameters {
        /**
         * The default page size is 200 (max 1000).
         */
        pageSize?: number;
        /**
         * The `next_page_token` value returned from a previous list request, if any.
         */
        pageToken?: string;
        /**
         * [Resource name](https://cloud.google.com/apis/design/resource_names) of the group to search transitive memberships in. Format: `groups/{group\}`, where `group` is the unique ID assigned to the Group.
         */
        parent?: string;
    }
    export class Resource$Inboundsamlssoprofiles {
        context: APIRequestContext;
        idpCredentials: Resource$Inboundsamlssoprofiles$Idpcredentials;
        constructor(context: APIRequestContext);
        /**
         * Creates an InboundSamlSsoProfile for a customer. When the target customer has enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448), the `Operation` in the response will have `"done": false`, it will not have a response, and the metadata will have `"state": "awaiting-multi-party-approval"`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Inboundsamlssoprofiles$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Inboundsamlssoprofiles$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Inboundsamlssoprofiles$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Inboundsamlssoprofiles$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Inboundsamlssoprofiles$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes an InboundSamlSsoProfile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Inboundsamlssoprofiles$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Inboundsamlssoprofiles$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an InboundSamlSsoProfile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Inboundsamlssoprofiles$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inboundsamlssoprofiles$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InboundSamlSsoProfile>>;
        get(params: Params$Resource$Inboundsamlssoprofiles$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inboundsamlssoprofiles$Get, options: MethodOptions | BodyResponseCallback<Schema$InboundSamlSsoProfile>, callback: BodyResponseCallback<Schema$InboundSamlSsoProfile>): void;
        get(params: Params$Resource$Inboundsamlssoprofiles$Get, callback: BodyResponseCallback<Schema$InboundSamlSsoProfile>): void;
        get(callback: BodyResponseCallback<Schema$InboundSamlSsoProfile>): void;
        /**
         * Lists InboundSamlSsoProfiles for a customer.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inboundsamlssoprofiles$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inboundsamlssoprofiles$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInboundSamlSsoProfilesResponse>>;
        list(params: Params$Resource$Inboundsamlssoprofiles$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inboundsamlssoprofiles$List, options: MethodOptions | BodyResponseCallback<Schema$ListInboundSamlSsoProfilesResponse>, callback: BodyResponseCallback<Schema$ListInboundSamlSsoProfilesResponse>): void;
        list(params: Params$Resource$Inboundsamlssoprofiles$List, callback: BodyResponseCallback<Schema$ListInboundSamlSsoProfilesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInboundSamlSsoProfilesResponse>): void;
        /**
         * Updates an InboundSamlSsoProfile. When the target customer has enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448), the `Operation` in the response will have `"done": false`, it will not have a response, and the metadata will have `"state": "awaiting-multi-party-approval"`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Inboundsamlssoprofiles$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Inboundsamlssoprofiles$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Inboundsamlssoprofiles$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Inboundsamlssoprofiles$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Inboundsamlssoprofiles$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$InboundSamlSsoProfile;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Delete extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the InboundSamlSsoProfile to delete. Format: `inboundSamlSsoProfiles/{sso_profile_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Get extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the InboundSamlSsoProfile to get. Format: `inboundSamlSsoProfiles/{sso_profile_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$List extends StandardParameters {
        /**
         * A [Common Expression Language](https://github.com/google/cel-spec) expression to filter the results. The only supported filter is filtering by customer. For example: `customer=="customers/C0123abc"`. Omitting the filter or specifying a filter of `customer=="customers/my_customer"` will return the profiles for the customer that the caller (authenticated user) belongs to.
         */
        filter?: string;
        /**
         * The maximum number of InboundSamlSsoProfiles to return. The service may return fewer than this value. If omitted (or defaulted to zero) the server will use a sensible default. This default may change over time. The maximum allowed value is 100. Requests with page_size greater than that will be silently interpreted as having this maximum value.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListInboundSamlSsoProfiles` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListInboundSamlSsoProfiles` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Patch extends StandardParameters {
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the SAML SSO profile.
         */
        name?: string;
        /**
         * Required. The list of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InboundSamlSsoProfile;
    }
    export class Resource$Inboundsamlssoprofiles$Idpcredentials {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Adds an IdpCredential. Up to 2 credentials are allowed. When the target customer has enabled [Multi-party approval for sensitive actions](https://support.google.com/a/answer/13790448), the `Operation` in the response will have `"done": false`, it will not have a response, and the metadata will have `"state": "awaiting-multi-party-approval"`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        add(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        add(params?: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        add(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        add(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        add(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add, callback: BodyResponseCallback<Schema$Operation>): void;
        add(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes an IdpCredential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an IdpCredential.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$IdpCredential>>;
        get(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get, options: MethodOptions | BodyResponseCallback<Schema$IdpCredential>, callback: BodyResponseCallback<Schema$IdpCredential>): void;
        get(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get, callback: BodyResponseCallback<Schema$IdpCredential>): void;
        get(callback: BodyResponseCallback<Schema$IdpCredential>): void;
        /**
         * Returns a list of IdpCredentials in an InboundSamlSsoProfile.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListIdpCredentialsResponse>>;
        list(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List, options: MethodOptions | BodyResponseCallback<Schema$ListIdpCredentialsResponse>, callback: BodyResponseCallback<Schema$ListIdpCredentialsResponse>): void;
        list(params: Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List, callback: BodyResponseCallback<Schema$ListIdpCredentialsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListIdpCredentialsResponse>): void;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Add extends StandardParameters {
        /**
         * Required. The InboundSamlSsoProfile that owns the IdpCredential. Format: `inboundSamlSsoProfiles/{sso_profile_id\}`
         */
        parent?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AddIdpCredentialRequest;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Delete extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the IdpCredential to delete. Format: `inboundSamlSsoProfiles/{sso_profile_id\}/idpCredentials/{idp_credential_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Idpcredentials$Get extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the IdpCredential to retrieve. Format: `inboundSamlSsoProfiles/{sso_profile_id\}/idpCredentials/{idp_credential_id\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundsamlssoprofiles$Idpcredentials$List extends StandardParameters {
        /**
         * The maximum number of `IdpCredential`s to return. The service may return fewer than this value.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListIdpCredentials` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListIdpCredentials` must match the call that provided the page token.
         */
        pageToken?: string;
        /**
         * Required. The parent, which owns this collection of `IdpCredential`s. Format: `inboundSamlSsoProfiles/{sso_profile_id\}`
         */
        parent?: string;
    }
    export class Resource$Inboundssoassignments {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Creates an InboundSsoAssignment for users and devices in a `Customer` under a given `Group` or `OrgUnit`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Inboundssoassignments$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Inboundssoassignments$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        create(params: Params$Resource$Inboundssoassignments$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Inboundssoassignments$Create, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        create(params: Params$Resource$Inboundssoassignments$Create, callback: BodyResponseCallback<Schema$Operation>): void;
        create(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Deletes an InboundSsoAssignment. To disable SSO, Create (or Update) an assignment that has `sso_mode` == `SSO_OFF`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Inboundssoassignments$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Inboundssoassignments$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        delete(params: Params$Resource$Inboundssoassignments$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Inboundssoassignments$Delete, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(params: Params$Resource$Inboundssoassignments$Delete, callback: BodyResponseCallback<Schema$Operation>): void;
        delete(callback: BodyResponseCallback<Schema$Operation>): void;
        /**
         * Gets an InboundSsoAssignment.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Inboundssoassignments$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inboundssoassignments$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InboundSsoAssignment>>;
        get(params: Params$Resource$Inboundssoassignments$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inboundssoassignments$Get, options: MethodOptions | BodyResponseCallback<Schema$InboundSsoAssignment>, callback: BodyResponseCallback<Schema$InboundSsoAssignment>): void;
        get(params: Params$Resource$Inboundssoassignments$Get, callback: BodyResponseCallback<Schema$InboundSsoAssignment>): void;
        get(callback: BodyResponseCallback<Schema$InboundSsoAssignment>): void;
        /**
         * Lists the InboundSsoAssignments for a `Customer`.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Inboundssoassignments$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Inboundssoassignments$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListInboundSsoAssignmentsResponse>>;
        list(params: Params$Resource$Inboundssoassignments$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Inboundssoassignments$List, options: MethodOptions | BodyResponseCallback<Schema$ListInboundSsoAssignmentsResponse>, callback: BodyResponseCallback<Schema$ListInboundSsoAssignmentsResponse>): void;
        list(params: Params$Resource$Inboundssoassignments$List, callback: BodyResponseCallback<Schema$ListInboundSsoAssignmentsResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListInboundSsoAssignmentsResponse>): void;
        /**
         * Updates an InboundSsoAssignment. The body of this request is the `inbound_sso_assignment` field and the `update_mask` is relative to that. For example: a PATCH to `/v1/inboundSsoAssignments/0abcdefg1234567&update_mask=rank` with a body of `{ "rank": 1 \}` moves that (presumably group-targeted) SSO assignment to the highest priority and shifts any other group-targeted assignments down in priority.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Inboundssoassignments$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Inboundssoassignments$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Operation>>;
        patch(params: Params$Resource$Inboundssoassignments$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Inboundssoassignments$Patch, options: MethodOptions | BodyResponseCallback<Schema$Operation>, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(params: Params$Resource$Inboundssoassignments$Patch, callback: BodyResponseCallback<Schema$Operation>): void;
        patch(callback: BodyResponseCallback<Schema$Operation>): void;
    }
    export interface Params$Resource$Inboundssoassignments$Create extends StandardParameters {
        /**
         * Request body metadata
         */
        requestBody?: Schema$InboundSsoAssignment;
    }
    export interface Params$Resource$Inboundssoassignments$Delete extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the InboundSsoAssignment to delete. Format: `inboundSsoAssignments/{assignment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundssoassignments$Get extends StandardParameters {
        /**
         * Required. The [resource name](https://cloud.google.com/apis/design/resource_names) of the InboundSsoAssignment to fetch. Format: `inboundSsoAssignments/{assignment\}`
         */
        name?: string;
    }
    export interface Params$Resource$Inboundssoassignments$List extends StandardParameters {
        /**
         * A CEL expression to filter the results. The only supported filter is filtering by customer. For example: `customer==customers/C0123abc`. Omitting the filter or specifying a filter of `customer==customers/my_customer` will return the assignments for the customer that the caller (authenticated user) belongs to.
         */
        filter?: string;
        /**
         * The maximum number of assignments to return. The service may return fewer than this value. If omitted (or defaulted to zero) the server will use a sensible default. This default may change over time. The maximum allowed value is 100, though requests with page_size greater than that will be silently interpreted as having this maximum value. This may increase in the futue.
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListInboundSsoAssignments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListInboundSsoAssignments` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export interface Params$Resource$Inboundssoassignments$Patch extends StandardParameters {
        /**
         * Output only. [Resource name](https://cloud.google.com/apis/design/resource_names) of the Inbound SSO Assignment.
         */
        name?: string;
        /**
         * Required. The list of fields to be updated.
         */
        updateMask?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$InboundSsoAssignment;
    }
    export class Resource$Policies {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Get a Policy
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
         * List Policies
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Policies$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ListPoliciesResponse>>;
        list(params: Params$Resource$Policies$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Policies$List, options: MethodOptions | BodyResponseCallback<Schema$ListPoliciesResponse>, callback: BodyResponseCallback<Schema$ListPoliciesResponse>): void;
        list(params: Params$Resource$Policies$List, callback: BodyResponseCallback<Schema$ListPoliciesResponse>): void;
        list(callback: BodyResponseCallback<Schema$ListPoliciesResponse>): void;
    }
    export interface Params$Resource$Policies$Get extends StandardParameters {
        /**
         * Required. The name of the policy to retrieve. Format: "policies/{policy\}".
         */
        name?: string;
    }
    export interface Params$Resource$Policies$List extends StandardParameters {
        /**
         * Optional. A CEL expression for filtering the results. Policies can be filtered by application with this expression: setting.type.matches('^settings/gmail\\..*$') Policies can be filtered by setting type with this expression: setting.type.matches('^.*\\.service_status$') A maximum of one of the above setting.type clauses can be used. Policies can be filtered by customer with this expression: customer == "customers/{customer\}" Where `customer` is the `id` from the [Admin SDK `Customer` resource](https://developers.google.com/admin-sdk/directory/reference/rest/v1/customers). You may use `customers/my_customer` to specify your own organization. When no customer is mentioned it will be default to customers/my_customer. A maximum of one customer clause can be used. The above clauses can only be combined together in a single filter expression with the `&&` operator.
         */
        filter?: string;
        /**
         * Optional. The maximum number of results to return. The service can return fewer than this number. If omitted or set to 0, the default is 50 results per page. The maximum allowed value is 100. `page_size` values greater than 100 default to 100.
         */
        pageSize?: number;
        /**
         * Optional. The pagination token received from a prior call to PoliciesService.ListPolicies to retrieve the next page of results. When paginating, all other parameters provided to `ListPoliciesRequest` must match the call that provided the page token.
         */
        pageToken?: string;
    }
    export {};
}
