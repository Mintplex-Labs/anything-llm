import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace androidenterprise_v1 {
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
     * Google Play EMM API
     *
     * Manages the deployment of apps to Android Enterprise devices.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const androidenterprise = google.androidenterprise('v1');
     * ```
     */
    export class Androidenterprise {
        context: APIRequestContext;
        devices: Resource$Devices;
        enrollmentTokens: Resource$Enrollmenttokens;
        enterprises: Resource$Enterprises;
        entitlements: Resource$Entitlements;
        grouplicenses: Resource$Grouplicenses;
        grouplicenseusers: Resource$Grouplicenseusers;
        installs: Resource$Installs;
        managedconfigurationsfordevice: Resource$Managedconfigurationsfordevice;
        managedconfigurationsforuser: Resource$Managedconfigurationsforuser;
        managedconfigurationssettings: Resource$Managedconfigurationssettings;
        permissions: Resource$Permissions;
        products: Resource$Products;
        serviceaccountkeys: Resource$Serviceaccountkeys;
        storelayoutclusters: Resource$Storelayoutclusters;
        storelayoutpages: Resource$Storelayoutpages;
        users: Resource$Users;
        webapps: Resource$Webapps;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * This represents an enterprise admin who can manage the enterprise in the managed Google Play store.
     */
    export interface Schema$Administrator {
        /**
         * The admin's email address.
         */
        email?: string | null;
    }
    /**
     * A token authorizing an admin to access an iframe.
     */
    export interface Schema$AdministratorWebToken {
        /**
         * An opaque token to be passed to the Play front-end to generate an iframe.
         */
        token?: string | null;
    }
    /**
     * Specification for a token used to generate iframes. The token specifies what data the admin is allowed to modify and the URI the iframe is allowed to communiate with.
     */
    export interface Schema$AdministratorWebTokenSpec {
        /**
         * Options for displaying the Managed Configuration page.
         */
        managedConfigurations?: Schema$AdministratorWebTokenSpecManagedConfigurations;
        /**
         * The URI of the parent frame hosting the iframe. To prevent XSS, the iframe may not be hosted at other URIs. This URI must be https. Use whitespaces to separate multiple parent URIs.
         */
        parent?: string | null;
        /**
         * Deprecated. Use PlaySearch.approveApps.
         */
        permission?: string[] | null;
        /**
         * Options for displaying the managed Play Search apps page.
         */
        playSearch?: Schema$AdministratorWebTokenSpecPlaySearch;
        /**
         * Options for displaying the Private Apps page.
         */
        privateApps?: Schema$AdministratorWebTokenSpecPrivateApps;
        /**
         * Options for displaying the Organize apps page.
         */
        storeBuilder?: Schema$AdministratorWebTokenSpecStoreBuilder;
        /**
         * Options for displaying the Web Apps page.
         */
        webApps?: Schema$AdministratorWebTokenSpecWebApps;
        /**
         * Options for displaying the Zero Touch page.
         */
        zeroTouch?: Schema$AdministratorWebTokenSpecZeroTouch;
    }
    export interface Schema$AdministratorWebTokenSpecManagedConfigurations {
        /**
         * Whether the Managed Configuration page is displayed. Default is true.
         */
        enabled?: boolean | null;
    }
    export interface Schema$AdministratorWebTokenSpecPlaySearch {
        /**
         * Allow access to the iframe in approve mode. Default is false.
         */
        approveApps?: boolean | null;
        /**
         * Whether the managed Play Search apps page is displayed. Default is true.
         */
        enabled?: boolean | null;
    }
    export interface Schema$AdministratorWebTokenSpecPrivateApps {
        /**
         * Whether the Private Apps page is displayed. Default is true.
         */
        enabled?: boolean | null;
    }
    export interface Schema$AdministratorWebTokenSpecStoreBuilder {
        /**
         * Whether the Organize apps page is displayed. Default is true.
         */
        enabled?: boolean | null;
    }
    export interface Schema$AdministratorWebTokenSpecWebApps {
        /**
         * Whether the Web Apps page is displayed. Default is true.
         */
        enabled?: boolean | null;
    }
    export interface Schema$AdministratorWebTokenSpecZeroTouch {
        /**
         * Whether zero-touch embedded UI is usable with this token. If enabled, the admin can link zero-touch customers to this enterprise.
         */
        enabled?: boolean | null;
    }
    /**
     * Represents the list of app restrictions available to be pre-configured for the product.
     */
    export interface Schema$AppRestrictionsSchema {
        /**
         * Deprecated.
         */
        kind?: string | null;
        /**
         * The set of restrictions that make up this schema.
         */
        restrictions?: Schema$AppRestrictionsSchemaRestriction[];
    }
    /**
     * An event generated when a new app version is uploaded to Google Play and its app restrictions schema changed. To fetch the app restrictions schema for an app, use Products.getAppRestrictionsSchema on the EMM API.
     */
    export interface Schema$AppRestrictionsSchemaChangeEvent {
        /**
         * The id of the product (e.g. "app:com.google.android.gm") for which the app restriction schema changed. This field will always be present.
         */
        productId?: string | null;
    }
    /**
     * A restriction in the App Restriction Schema represents a piece of configuration that may be pre-applied.
     */
    export interface Schema$AppRestrictionsSchemaRestriction {
        /**
         * The default value of the restriction. bundle and bundleArray restrictions never have a default value.
         */
        defaultValue?: Schema$AppRestrictionsSchemaRestrictionRestrictionValue;
        /**
         * A longer description of the restriction, giving more detail of what it affects.
         */
        description?: string | null;
        /**
         * For choice or multiselect restrictions, the list of possible entries' human-readable names.
         */
        entry?: string[] | null;
        /**
         * For choice or multiselect restrictions, the list of possible entries' machine-readable values. These values should be used in the configuration, either as a single string value for a choice restriction or in a stringArray for a multiselect restriction.
         */
        entryValue?: string[] | null;
        /**
         * The unique key that the product uses to identify the restriction, e.g. "com.google.android.gm.fieldname".
         */
        key?: string | null;
        /**
         * For bundle or bundleArray restrictions, the list of nested restrictions. A bundle restriction is always nested within a bundleArray restriction, and a bundleArray restriction is at most two levels deep.
         */
        nestedRestriction?: Schema$AppRestrictionsSchemaRestriction[];
        /**
         * The type of the restriction.
         */
        restrictionType?: string | null;
        /**
         * The name of the restriction.
         */
        title?: string | null;
    }
    /**
     * A typed value for the restriction.
     */
    export interface Schema$AppRestrictionsSchemaRestrictionRestrictionValue {
        /**
         * The type of the value being provided.
         */
        type?: string | null;
        /**
         * The boolean value - this will only be present if type is bool.
         */
        valueBool?: boolean | null;
        /**
         * The integer value - this will only be present if type is integer.
         */
        valueInteger?: number | null;
        /**
         * The list of string values - this will only be present if type is multiselect.
         */
        valueMultiselect?: string[] | null;
        /**
         * The string value - this will be present for types string, choice and hidden.
         */
        valueString?: string | null;
    }
    /**
     * Information on an approval URL.
     */
    export interface Schema$ApprovalUrlInfo {
        /**
         * A URL that displays a product's permissions and that can also be used to approve the product with the Products.approve call.
         */
        approvalUrl?: string | null;
    }
    /**
     * List of states set by the app.
     */
    export interface Schema$AppState {
        /**
         * List of keyed app states. This field will always be present.
         */
        keyedAppState?: Schema$KeyedAppState[];
        /**
         * The package name of the app. This field will always be present.
         */
        packageName?: string | null;
    }
    /**
     * An event generated when a new version of an app is uploaded to Google Play. Notifications are sent for new public versions only: alpha, beta, or canary versions do not generate this event. To fetch up-to-date version history for an app, use Products.Get on the EMM API.
     */
    export interface Schema$AppUpdateEvent {
        /**
         * The id of the product (e.g. "app:com.google.android.gm") that was updated. This field will always be present.
         */
        productId?: string | null;
    }
    /**
     * This represents a single version of the app.
     */
    export interface Schema$AppVersion {
        /**
         * True if this version is a production APK.
         */
        isProduction?: boolean | null;
        /**
         * The SDK version this app targets, as specified in the manifest of the APK. See http://developer.android.com/guide/topics/manifest/uses-sdk-element.html
         */
        targetSdkVersion?: number | null;
        /**
         * Deprecated, use trackId instead.
         */
        track?: string | null;
        /**
         * Track ids that the app version is published in. Replaces the track field (deprecated), but doesn't include the production track (see isProduction instead).
         */
        trackId?: string[] | null;
        /**
         * Unique increasing identifier for the app version.
         */
        versionCode?: number | null;
        /**
         * The string used in the Play store by the app developer to identify the version. The string is not necessarily unique or localized (for example, the string could be "1.4").
         */
        versionString?: string | null;
    }
    /**
     * An AuthenticationToken is used by the EMM's device policy client on a device to provision the given EMM-managed user on that device.
     */
    export interface Schema$AuthenticationToken {
        /**
         * The authentication token to be passed to the device policy client on the device where it can be used to provision the account for which this token was generated.
         */
        token?: string | null;
    }
    /**
     * The auto-install constraint. Defines a set of restrictions for installation. At least one of the fields must be set.
     */
    export interface Schema$AutoInstallConstraint {
        /**
         * Charging state constraint.
         */
        chargingStateConstraint?: string | null;
        /**
         * Device idle state constraint.
         */
        deviceIdleStateConstraint?: string | null;
        /**
         * Network type constraint.
         */
        networkTypeConstraint?: string | null;
    }
    export interface Schema$AutoInstallPolicy {
        /**
         * The constraints for auto-installing the app. You can specify a maximum of one constraint.
         */
        autoInstallConstraint?: Schema$AutoInstallConstraint[];
        /**
         * The auto-install mode. If unset, defaults to "doNotAutoInstall". An app is automatically installed regardless of a set maintenance window.
         */
        autoInstallMode?: string | null;
        /**
         * The priority of the install, as an unsigned integer. A lower number means higher priority.
         */
        autoInstallPriority?: number | null;
        /**
         * The minimum version of the app. If a lower version of the app is installed, then the app will be auto-updated according to the auto-install constraints, instead of waiting for the regular auto-update. You can set a minimum version code for at most 20 apps per device.
         */
        minimumVersionCode?: number | null;
    }
    /**
     * A configuration variables resource contains the managed configuration settings ID to be applied to a single user, as well as the variable set that is attributed to the user. The variable set will be used to replace placeholders in the managed configuration settings.
     */
    export interface Schema$ConfigurationVariables {
        /**
         * The ID of the managed configurations settings.
         */
        mcmId?: string | null;
        /**
         * The variable set that is attributed to the user.
         */
        variableSet?: Schema$VariableSet[];
    }
    /**
     * A Devices resource represents a mobile device managed by the EMM and belonging to a specific enterprise user.
     */
    export interface Schema$Device {
        /**
         * The Google Play Services Android ID for the device encoded as a lowercase hex string. For example, "123456789abcdef0".
         */
        androidId?: string | null;
        /**
         * The internal hardware codename of the device. This comes from android.os.Build.DEVICE. (field named "device" per logs/wireless/android/android_checkin.proto)
         */
        device?: string | null;
        /**
         * The build fingerprint of the device if known.
         */
        latestBuildFingerprint?: string | null;
        /**
         * The manufacturer of the device. This comes from android.os.Build.MANUFACTURER.
         */
        maker?: string | null;
        /**
         * Identifies the extent to which the device is controlled by a managed Google Play EMM in various deployment configurations. Possible values include: - "managedDevice", a device that has the EMM's device policy controller (DPC) as the device owner. - "managedProfile", a device that has a profile managed by the DPC (DPC is profile owner) in addition to a separate, personal profile that is unavailable to the DPC. - "containerApp", no longer used (deprecated). - "unmanagedProfile", a device that has been allowed (by the domain's admin, using the Admin Console to enable the privilege) to use managed Google Play, but the profile is itself not owned by a DPC.
         */
        managementType?: string | null;
        /**
         * The model name of the device. This comes from android.os.Build.MODEL.
         */
        model?: string | null;
        /**
         * The policy enforced on the device.
         */
        policy?: Schema$Policy;
        /**
         * The product name of the device. This comes from android.os.Build.PRODUCT.
         */
        product?: string | null;
        /**
         * The device report updated with the latest app states.
         */
        report?: Schema$DeviceReport;
        /**
         * Retail brand for the device, if set. See android.os.Build.BRAND
         */
        retailBrand?: string | null;
        /**
         * API compatibility version.
         */
        sdkVersion?: number | null;
    }
    /**
     * Device report updated with the latest app states for managed apps on the device.
     */
    export interface Schema$DeviceReport {
        /**
         * List of app states set by managed apps on the device. App states are defined by the app's developers. This field will always be present.
         */
        appState?: Schema$AppState[];
        /**
         * The timestamp of the last report update in milliseconds since epoch. This field will always be present.
         */
        lastUpdatedTimestampMillis?: string | null;
    }
    /**
     * An event generated when an updated device report is available.
     */
    export interface Schema$DeviceReportUpdateEvent {
        /**
         * The Android ID of the device. This field will always be present.
         */
        deviceId?: string | null;
        /**
         * The device report updated with the latest app states. This field will always be present.
         */
        report?: Schema$DeviceReport;
        /**
         * The ID of the user. This field will always be present.
         */
        userId?: string | null;
    }
    export interface Schema$DevicesListResponse {
        /**
         * A managed device.
         */
        device?: Schema$Device[];
    }
    /**
     * The state of a user's device, as accessed by the getState and setState methods on device resources.
     */
    export interface Schema$DeviceState {
        /**
         * The state of the Google account on the device. "enabled" indicates that the Google account on the device can be used to access Google services (including Google Play), while "disabled" means that it cannot. A new device is initially in the "disabled" state.
         */
        accountState?: string | null;
    }
    /**
     * A token used to enroll a device.
     */
    export interface Schema$EnrollmentToken {
        /**
         * [Optional] The length of time the enrollment token is valid, ranging from 1 minute to [`Durations.MAX_VALUE`](https://developers.google.com/protocol-buffers/docs/reference/java/com/google/protobuf/util/Durations.html#MAX_VALUE), approximately 10,000 years. If not specified, the default duration is 1 hour.
         */
        duration?: string | null;
        /**
         * [Required] The type of the enrollment token.
         */
        enrollmentTokenType?: string | null;
        /**
         * The token value that's passed to the device and authorizes the device to enroll. This is a read-only field generated by the server.
         */
        token?: string | null;
    }
    /**
     * An Enterprises resource represents the binding between an EMM and a specific organization. That binding can be instantiated in one of two different ways using this API as follows: - For Google managed domain customers, the process involves using Enterprises.enroll and Enterprises.setAccount (in conjunction with artifacts obtained from the Admin console and the Google API Console) and submitted to the EMM through a more-or-less manual process. - For managed Google Play Accounts customers, the process involves using Enterprises.generateSignupUrl and Enterprises.completeSignup in conjunction with the managed Google Play sign-up UI (Google-provided mechanism) to create the binding without manual steps. As an EMM, you can support either or both approaches in your EMM console. See Create an Enterprise for details.
     */
    export interface Schema$Enterprise {
        /**
         * Admins of the enterprise. This is only supported for enterprises created via the EMM-initiated flow.
         */
        administrator?: Schema$Administrator[];
        /**
         * The type of the enterprise.
         */
        enterpriseType?: string | null;
        /**
         * Output only. Settings for Google-provided user authentication.
         */
        googleAuthenticationSettings?: Schema$GoogleAuthenticationSettings;
        /**
         * The unique ID for the enterprise.
         */
        id?: string | null;
        /**
         * The type of managed Google domain
         */
        managedGoogleDomainType?: string | null;
        /**
         * The name of the enterprise, for example, "Example, Inc".
         */
        name?: string | null;
        /**
         * The enterprise's primary domain, such as "example.com".
         */
        primaryDomain?: string | null;
    }
    /**
     * A service account that can be used to authenticate as the enterprise to API calls that require such authentication.
     */
    export interface Schema$EnterpriseAccount {
        /**
         * The email address of the service account.
         */
        accountEmail?: string | null;
    }
    /**
     * An authentication URL configuration for the authenticator app of an identity provider.
     */
    export interface Schema$EnterpriseAuthenticationAppLinkConfig {
        /**
         * An authentication url.
         */
        uri?: string | null;
    }
    export interface Schema$EnterprisesListResponse {
        /**
         * An enterprise.
         */
        enterprise?: Schema$Enterprise[];
    }
    export interface Schema$EnterprisesSendTestPushNotificationResponse {
        /**
         * The message ID of the test push notification that was sent.
         */
        messageId?: string | null;
        /**
         * The name of the Cloud Pub/Sub topic to which notifications for this enterprise's enrolled account will be sent.
         */
        topicName?: string | null;
    }
    /**
     * An event generated when an enterprise is upgraded.
     */
    export interface Schema$EnterpriseUpgradeEvent {
        /**
         * The upgrade state.
         */
        upgradeState?: string | null;
    }
    /**
     *  *Deprecated:* New integrations cannot use this method and can refer to our new recommendations.
     */
    export interface Schema$Entitlement {
        /**
         * The ID of the product that the entitlement is for. For example, "app:com.google.android.gm".
         */
        productId?: string | null;
        /**
         * The reason for the entitlement. For example, "free" for free apps. This property is temporary: it will be replaced by the acquisition kind field of group licenses.
         */
        reason?: string | null;
    }
    export interface Schema$EntitlementsListResponse {
        /**
         * An entitlement of a user to a product (e.g. an app). For example, a free app that they have installed, or a paid app that they have been allocated a license to.
         */
        entitlement?: Schema$Entitlement[];
    }
    /**
     * Response message for generating a URL to upgrade an existing managed Google Play Accounts enterprise to a managed Google domain. **Note:** This feature is not generally available.
     */
    export interface Schema$GenerateEnterpriseUpgradeUrlResponse {
        /**
         * A URL for an enterprise admin to upgrade their enterprise. The page can't be rendered in an iframe.
         */
        url?: string | null;
    }
    /**
     * Contains settings for Google-provided user authentication.
     */
    export interface Schema$GoogleAuthenticationSettings {
        /**
         * Whether dedicated devices are allowed.
         */
        dedicatedDevicesAllowed?: string | null;
        /**
         * Whether Google authentication is required.
         */
        googleAuthenticationRequired?: string | null;
    }
    /**
     *  *Deprecated:* New integrations cannot use this method and can refer to our new recommendations
     */
    export interface Schema$GroupLicense {
        /**
         * How this group license was acquired. "bulkPurchase" means that this Grouplicenses resource was created because the enterprise purchased licenses for this product; otherwise, the value is "free" (for free products).
         */
        acquisitionKind?: string | null;
        /**
         * Whether the product to which this group license relates is currently approved by the enterprise. Products are approved when a group license is first created, but this approval may be revoked by an enterprise admin via Google Play. Unapproved products will not be visible to end users in collections, and new entitlements to them should not normally be created.
         */
        approval?: string | null;
        /**
         * The total number of provisioned licenses for this product. Returned by read operations, but ignored in write operations.
         */
        numProvisioned?: number | null;
        /**
         * The number of purchased licenses (possibly in multiple purchases). If this field is omitted, then there is no limit on the number of licenses that can be provisioned (for example, if the acquisition kind is "free").
         */
        numPurchased?: number | null;
        /**
         * The permission approval status of the product. This field is only set if the product is approved. Possible states are: - "currentApproved", the current set of permissions is approved, but additional permissions will require the administrator to reapprove the product (If the product was approved without specifying the approved permissions setting, then this is the default behavior.), - "needsReapproval", the product has unapproved permissions. No additional product licenses can be assigned until the product is reapproved, - "allCurrentAndFutureApproved", the current permissions are approved and any future permission updates will be automatically approved without administrator review.
         */
        permissions?: string | null;
        /**
         * The ID of the product that the license is for. For example, "app:com.google.android.gm".
         */
        productId?: string | null;
    }
    export interface Schema$GroupLicensesListResponse {
        /**
         * A group license for a product approved for use in the enterprise.
         */
        groupLicense?: Schema$GroupLicense[];
    }
    export interface Schema$GroupLicenseUsersListResponse {
        /**
         * A user of an enterprise.
         */
        user?: Schema$User[];
    }
    /**
     * The existence of an Installs resource indicates that an app is installed on a particular device (or that an install is pending). The API can be used to create an install resource using the update method. This triggers the actual install of the app on the device. If the user does not already have an entitlement for the app, then an attempt is made to create one. If this fails (for example, because the app is not free and there is no available license), then the creation of the install fails. The API can also be used to update an installed app. If the update method is used on an existing install, then the app will be updated to the latest available version. Note that it is not possible to force the installation of a specific version of an app: the version code is read-only. If a user installs an app themselves (as permitted by the enterprise), then again an install resource and possibly an entitlement resource are automatically created. The API can also be used to delete an install resource, which triggers the removal of the app from the device. Note that deleting an install does not automatically remove the corresponding entitlement, even if there are no remaining installs. The install resource will also be deleted if the user uninstalls the app themselves.
     */
    export interface Schema$Install {
        /**
         * Install state. The state "installPending" means that an install request has recently been made and download to the device is in progress. The state "installed" means that the app has been installed. This field is read-only.
         */
        installState?: string | null;
        /**
         * The ID of the product that the install is for. For example, "app:com.google.android.gm".
         */
        productId?: string | null;
        /**
         * The version of the installed product. Guaranteed to be set only if the install state is "installed".
         */
        versionCode?: number | null;
    }
    /**
     * An event generated when an app installation failed on a device
     */
    export interface Schema$InstallFailureEvent {
        /**
         * The Android ID of the device. This field will always be present.
         */
        deviceId?: string | null;
        /**
         * Additional details on the failure if applicable.
         */
        failureDetails?: string | null;
        /**
         * The reason for the installation failure. This field will always be present.
         */
        failureReason?: string | null;
        /**
         * The id of the product (e.g. "app:com.google.android.gm") for which the install failure event occured. This field will always be present.
         */
        productId?: string | null;
        /**
         * The ID of the user. This field will always be present.
         */
        userId?: string | null;
    }
    export interface Schema$InstallsListResponse {
        /**
         * An installation of an app for a user on a specific device. The existence of an install implies that the user must have an entitlement to the app.
         */
        install?: Schema$Install[];
    }
    /**
     * Represents a keyed app state containing a key, timestamp, severity level, optional description, and optional data.
     */
    export interface Schema$KeyedAppState {
        /**
         * Additional field intended for machine-readable data. For example, a number or JSON object. To prevent XSS, we recommend removing any HTML from the data before displaying it.
         */
        data?: string | null;
        /**
         * Key indicating what the app is providing a state for. The content of the key is set by the app's developer. To prevent XSS, we recommend removing any HTML from the key before displaying it. This field will always be present.
         */
        key?: string | null;
        /**
         * Free-form, human-readable message describing the app state. For example, an error message. To prevent XSS, we recommend removing any HTML from the message before displaying it.
         */
        message?: string | null;
        /**
         * Severity of the app state. This field will always be present.
         */
        severity?: string | null;
        /**
         * Timestamp of when the app set the state in milliseconds since epoch. This field will always be present.
         */
        stateTimestampMillis?: string | null;
    }
    /**
     * A localized string with its locale.
     */
    export interface Schema$LocalizedText {
        /**
         * The BCP47 tag for a locale. (e.g. "en-US", "de").
         */
        locale?: string | null;
        /**
         * The text localized in the associated locale.
         */
        text?: string | null;
    }
    /**
     * Maintenance window for managed Google Play Accounts. This allows Play store to update the apps on the foreground in the designated window.
     */
    export interface Schema$MaintenanceWindow {
        /**
         * Duration of the maintenance window, in milliseconds. The duration must be between 30 minutes and 24 hours (inclusive).
         */
        durationMs?: string | null;
        /**
         * Start time of the maintenance window, in milliseconds after midnight on the device. Windows can span midnight.
         */
        startTimeAfterMidnightMs?: string | null;
    }
    /**
     *  *Deprecated:* New integrations cannot use this method and can refer to our new recommendations
     */
    export interface Schema$ManagedConfiguration {
        /**
         * Contains the ID of the managed configuration profile and the set of configuration variables (if any) defined for the user.
         */
        configurationVariables?: Schema$ConfigurationVariables;
        /**
         * Deprecated.
         */
        kind?: string | null;
        /**
         * The set of managed properties for this configuration.
         */
        managedProperty?: Schema$ManagedProperty[];
        /**
         * The ID of the product that the managed configuration is for, e.g. "app:com.google.android.gm".
         */
        productId?: string | null;
    }
    export interface Schema$ManagedConfigurationsForDeviceListResponse {
        /**
         * A managed configuration for an app on a specific device.
         */
        managedConfigurationForDevice?: Schema$ManagedConfiguration[];
    }
    export interface Schema$ManagedConfigurationsForUserListResponse {
        /**
         * A managed configuration for an app for a specific user.
         */
        managedConfigurationForUser?: Schema$ManagedConfiguration[];
    }
    /**
     * A managed configurations settings resource contains the set of managed properties that have been configured for an Android app to be applied to a set of users. The app's developer would have defined configurable properties in the managed configurations schema.
     */
    export interface Schema$ManagedConfigurationsSettings {
        /**
         * The last updated time of the managed configuration settings in milliseconds since 1970-01-01T00:00:00Z.
         */
        lastUpdatedTimestampMillis?: string | null;
        /**
         * The ID of the managed configurations settings.
         */
        mcmId?: string | null;
        /**
         * The name of the managed configurations settings.
         */
        name?: string | null;
    }
    export interface Schema$ManagedConfigurationsSettingsListResponse {
        /**
         * A managed configurations settings for an app that may be assigned to a group of users in an enterprise.
         */
        managedConfigurationsSettings?: Schema$ManagedConfigurationsSettings[];
    }
    /**
     * A managed property of a managed configuration. The property must match one of the properties in the app restrictions schema of the product. Exactly one of the value fields must be populated, and it must match the property's type in the app restrictions schema.
     */
    export interface Schema$ManagedProperty {
        /**
         * The unique key that identifies the property.
         */
        key?: string | null;
        /**
         * The boolean value - this will only be present if type of the property is bool.
         */
        valueBool?: boolean | null;
        /**
         * The bundle of managed properties - this will only be present if type of the property is bundle.
         */
        valueBundle?: Schema$ManagedPropertyBundle;
        /**
         * The list of bundles of properties - this will only be present if type of the property is bundle_array.
         */
        valueBundleArray?: Schema$ManagedPropertyBundle[];
        /**
         * The integer value - this will only be present if type of the property is integer.
         */
        valueInteger?: number | null;
        /**
         * The string value - this will only be present if type of the property is string, choice or hidden.
         */
        valueString?: string | null;
        /**
         * The list of string values - this will only be present if type of the property is multiselect.
         */
        valueStringArray?: string[] | null;
    }
    /**
     * A bundle of managed properties.
     */
    export interface Schema$ManagedPropertyBundle {
        /**
         * The list of managed properties.
         */
        managedProperty?: Schema$ManagedProperty[];
    }
    /**
     * An event generated when a new device is ready to be managed.
     */
    export interface Schema$NewDeviceEvent {
        /**
         * The Android ID of the device. This field will always be present.
         */
        deviceId?: string | null;
        /**
         * Policy app on the device.
         */
        dpcPackageName?: string | null;
        /**
         * Identifies the extent to which the device is controlled by an Android EMM in various deployment configurations. Possible values include: - "managedDevice", a device where the DPC is set as device owner, - "managedProfile", a device where the DPC is set as profile owner.
         */
        managementType?: string | null;
        /**
         * The ID of the user. This field will always be present.
         */
        userId?: string | null;
    }
    /**
     * An event generated when new permissions are added to an app.
     */
    export interface Schema$NewPermissionsEvent {
        /**
         * The set of permissions that the enterprise admin has already approved for this application. Use Permissions.Get on the EMM API to retrieve details about these permissions.
         */
        approvedPermissions?: string[] | null;
        /**
         * The id of the product (e.g. "app:com.google.android.gm") for which new permissions were added. This field will always be present.
         */
        productId?: string | null;
        /**
         * The set of permissions that the app is currently requesting. Use Permissions.Get on the EMM API to retrieve details about these permissions.
         */
        requestedPermissions?: string[] | null;
    }
    /**
     * A notification of one event relating to an enterprise.
     */
    export interface Schema$Notification {
        /**
         * Notifications about new app restrictions schema changes.
         */
        appRestrictionsSchemaChangeEvent?: Schema$AppRestrictionsSchemaChangeEvent;
        /**
         * Notifications about app updates.
         */
        appUpdateEvent?: Schema$AppUpdateEvent;
        /**
         * Notifications about device report updates.
         */
        deviceReportUpdateEvent?: Schema$DeviceReportUpdateEvent;
        /**
         * The ID of the enterprise for which the notification is sent. This will always be present.
         */
        enterpriseId?: string | null;
        /**
         * Notifications about enterprise upgrade.
         */
        enterpriseUpgradeEvent?: Schema$EnterpriseUpgradeEvent;
        /**
         * Notifications about an app installation failure.
         */
        installFailureEvent?: Schema$InstallFailureEvent;
        /**
         * Notifications about new devices.
         */
        newDeviceEvent?: Schema$NewDeviceEvent;
        /**
         * Notifications about new app permissions.
         */
        newPermissionsEvent?: Schema$NewPermissionsEvent;
        /**
         * Type of the notification.
         */
        notificationType?: string | null;
        /**
         * Notifications about changes to a product's approval status.
         */
        productApprovalEvent?: Schema$ProductApprovalEvent;
        /**
         * Notifications about product availability changes.
         */
        productAvailabilityChangeEvent?: Schema$ProductAvailabilityChangeEvent;
        /**
         * The time when the notification was published in milliseconds since 1970-01-01T00:00:00Z. This will always be present.
         */
        timestampMillis?: string | null;
    }
    /**
     * A resource returned by the PullNotificationSet API, which contains a collection of notifications for enterprises associated with the service account authenticated for the request.
     */
    export interface Schema$NotificationSet {
        /**
         * The notifications received, or empty if no notifications are present.
         */
        notification?: Schema$Notification[];
        /**
         * The notification set ID, required to mark the notification as received with the Enterprises.AcknowledgeNotification API. This will be omitted if no notifications are present.
         */
        notificationSetId?: string | null;
    }
    /**
     * Information about the current page. List operations that supports paging return only one "page" of results. This protocol buffer message describes the page that has been returned.
     */
    export interface Schema$PageInfo {
        /**
         * Maximum number of results returned in one page. ! The number of results included in the API response.
         */
        resultPerPage?: number | null;
        /**
         * Index of the first result returned in the current page.
         */
        startIndex?: number | null;
        /**
         * Total number of results available on the backend ! The total number of results in the result set.
         */
        totalResults?: number | null;
    }
    /**
     * A Permissions resource represents some extra capability, to be granted to an Android app, which requires explicit consent. An enterprise admin must consent to these permissions on behalf of their users before an entitlement for the app can be created. The permissions collection is read-only. The information provided for each permission (localized name and description) is intended to be used in the MDM user interface when obtaining consent from the enterprise.
     */
    export interface Schema$Permission {
        /**
         * A longer description of the Permissions resource, giving more details of what it affects.
         */
        description?: string | null;
        /**
         * The name of the permission.
         */
        name?: string | null;
        /**
         * An opaque string uniquely identifying the permission.
         */
        permissionId?: string | null;
    }
    /**
     * The device policy for a given managed device.
     */
    export interface Schema$Policy {
        /**
         * Controls when automatic app updates on the device can be applied. Recommended alternative: autoUpdateMode which is set per app, provides greater flexibility around update frequency. When autoUpdateMode is set to AUTO_UPDATE_POSTPONED or AUTO_UPDATE_HIGH_PRIORITY, autoUpdatePolicy has no effect. - choiceToTheUser allows the device's user to configure the app update policy. - always enables auto updates. - never disables auto updates. - wifiOnly enables auto updates only when the device is connected to wifi. *Important:* Changes to app update policies don't affect updates that are in progress. Any policy changes will apply to subsequent app updates.
         */
        autoUpdatePolicy?: string | null;
        /**
         * Whether the device reports app states to the EMM. The default value is "deviceReportDisabled".
         */
        deviceReportPolicy?: string | null;
        /**
         * The maintenance window defining when apps running in the foreground should be updated.
         */
        maintenanceWindow?: Schema$MaintenanceWindow;
        /**
         * An identifier for the policy that will be passed with the app install feedback sent from the Play Store.
         */
        policyId?: string | null;
        /**
         * The availability granted to the device for the specified products. "all" gives the device access to all products, regardless of approval status. "all" does not enable automatic visibility of "alpha" or "beta" tracks. "whitelist" grants the device access the products specified in productPolicy[]. Only products that are approved or products that were previously approved (products with revoked approval) by the enterprise can be whitelisted. If no value is provided, the availability set at the user level is applied by default.
         */
        productAvailabilityPolicy?: string | null;
        /**
         * The list of product policies. The productAvailabilityPolicy needs to be set to WHITELIST or ALL for the product policies to be applied.
         */
        productPolicy?: Schema$ProductPolicy[];
    }
    /**
     * A Products resource represents an app in the Google Play store that is available to at least some users in the enterprise. (Some apps are restricted to a single enterprise, and no information about them is made available outside that enterprise.) The information provided for each product (localized name, icon, link to the full Google Play details page) is intended to allow a basic representation of the product within an EMM user interface.
     */
    export interface Schema$Product {
        /**
         * The app restriction schema
         */
        appRestrictionsSchema?: Schema$AppRestrictionsSchema;
        /**
         * The tracks visible to the enterprise.
         */
        appTracks?: Schema$TrackInfo[];
        /**
         * App versions currently available for this product.
         */
        appVersion?: Schema$AppVersion[];
        /**
         * The name of the author of the product (for example, the app developer).
         */
        authorName?: string | null;
        /**
         * The countries which this app is available in.
         */
        availableCountries?: string[] | null;
        /**
         * Deprecated, use appTracks instead.
         */
        availableTracks?: string[] | null;
        /**
         * The app category (e.g. RACING, SOCIAL, etc.)
         */
        category?: string | null;
        /**
         * The content rating for this app.
         */
        contentRating?: string | null;
        /**
         * The localized promotional description, if available.
         */
        description?: string | null;
        /**
         * A link to the (consumer) Google Play details page for the product.
         */
        detailsUrl?: string | null;
        /**
         * How and to whom the package is made available. The value publicGoogleHosted means that the package is available through the Play store and not restricted to a specific enterprise. The value privateGoogleHosted means that the package is a private app (restricted to an enterprise) but hosted by Google. The value privateSelfHosted means that the package is a private app (restricted to an enterprise) and is privately hosted.
         */
        distributionChannel?: string | null;
        /**
         * Noteworthy features (if any) of this product.
         */
        features?: string[] | null;
        /**
         * The localized full app store description, if available.
         */
        fullDescription?: string | null;
        /**
         * A link to an image that can be used as an icon for the product. This image is suitable for use at up to 512px x 512px.
         */
        iconUrl?: string | null;
        /**
         * The approximate time (within 7 days) the app was last published, expressed in milliseconds since epoch.
         */
        lastUpdatedTimestampMillis?: string | null;
        /**
         * The minimum Android SDK necessary to run the app.
         */
        minAndroidSdkVersion?: number | null;
        /**
         * A list of permissions required by the app.
         */
        permissions?: Schema$ProductPermission[];
        /**
         * A string of the form *app:<package name\>*. For example, app:com.google.android.gm represents the Gmail app.
         */
        productId?: string | null;
        /**
         * Whether this product is free, free with in-app purchases, or paid. If the pricing is unknown, this means the product is not generally available anymore (even though it might still be available to people who own it).
         */
        productPricing?: string | null;
        /**
         * A description of the recent changes made to the app.
         */
        recentChanges?: string | null;
        /**
         * Deprecated.
         */
        requiresContainerApp?: boolean | null;
        /**
         * A list of screenshot links representing the app.
         */
        screenshotUrls?: string[] | null;
        /**
         * The certificate used to sign this product.
         */
        signingCertificate?: Schema$ProductSigningCertificate;
        /**
         * A link to a smaller image that can be used as an icon for the product. This image is suitable for use at up to 128px x 128px.
         */
        smallIconUrl?: string | null;
        /**
         * The name of the product.
         */
        title?: string | null;
        /**
         * A link to the managed Google Play details page for the product, for use by an Enterprise admin.
         */
        workDetailsUrl?: string | null;
    }
    /**
     * An event generated when a product's approval status is changed.
     */
    export interface Schema$ProductApprovalEvent {
        /**
         * Whether the product was approved or unapproved. This field will always be present.
         */
        approved?: string | null;
        /**
         * The id of the product (e.g. "app:com.google.android.gm") for which the approval status has changed. This field will always be present.
         */
        productId?: string | null;
    }
    /**
     * An event generated whenever a product's availability changes.
     */
    export interface Schema$ProductAvailabilityChangeEvent {
        /**
         * The new state of the product. This field will always be present.
         */
        availabilityStatus?: string | null;
        /**
         * The id of the product (e.g. "app:com.google.android.gm") for which the product availability changed. This field will always be present.
         */
        productId?: string | null;
    }
    /**
     * A product permissions resource represents the set of permissions required by a specific app and whether or not they have been accepted by an enterprise admin. The API can be used to read the set of permissions, and also to update the set to indicate that permissions have been accepted.
     */
    export interface Schema$ProductPermission {
        /**
         * An opaque string uniquely identifying the permission.
         */
        permissionId?: string | null;
        /**
         * Whether the permission has been accepted or not.
         */
        state?: string | null;
    }
    /**
     * Information about the permissions required by a specific app and whether they have been accepted by the enterprise.
     */
    export interface Schema$ProductPermissions {
        /**
         * The permissions required by the app.
         */
        permission?: Schema$ProductPermission[];
        /**
         * The ID of the app that the permissions relate to, e.g. "app:com.google.android.gm".
         */
        productId?: string | null;
    }
    /**
     * The policy for a product.
     */
    export interface Schema$ProductPolicy {
        /**
         * The auto-install policy for the product.
         */
        autoInstallPolicy?: Schema$AutoInstallPolicy;
        /**
         * The auto-update mode for the product. When autoUpdateMode is used, it always takes precedence over the user's choice. So when a user makes changes to the device settings manually, these changes are ignored.
         */
        autoUpdateMode?: string | null;
        /**
         * An authentication URL configuration for the authenticator app of an identity provider. This helps to launch the identity provider's authenticator app during the authentication happening in a private app using Android WebView. Authenticator app should already be the default handler for the authentication url on the device.
         */
        enterpriseAuthenticationAppLinkConfigs?: Schema$EnterpriseAuthenticationAppLinkConfig[];
        /**
         * The managed configuration for the product.
         */
        managedConfiguration?: Schema$ManagedConfiguration;
        /**
         * The ID of the product. For example, "app:com.google.android.gm".
         */
        productId?: string | null;
        /**
         * Grants the device visibility to the specified product release track(s), identified by trackIds. The list of release tracks of a product can be obtained by calling Products.Get.
         */
        trackIds?: string[] | null;
        /**
         * Deprecated. Use trackIds instead.
         */
        tracks?: string[] | null;
    }
    export interface Schema$ProductsApproveRequest {
        /**
         * The approval URL that was shown to the user. Only the permissions shown to the user with that URL will be accepted, which may not be the product's entire set of permissions. For example, the URL may only display new permissions from an update after the product was approved, or not include new permissions if the product was updated since the URL was generated.
         */
        approvalUrlInfo?: Schema$ApprovalUrlInfo;
        /**
         * Sets how new permission requests for the product are handled. "allPermissions" automatically approves all current and future permissions for the product. "currentPermissionsOnly" approves the current set of permissions for the product, but any future permissions added through updates will require manual reapproval. If not specified, only the current set of permissions will be approved.
         */
        approvedPermissions?: string | null;
    }
    /**
     * A set of products.
     */
    export interface Schema$ProductSet {
        /**
         * The list of product IDs making up the set of products.
         */
        productId?: string[] | null;
        /**
         * The interpretation of this product set. "unknown" should never be sent and is ignored if received. "whitelist" means that the user is entitled to access the product set. "includeAll" means that all products are accessible, including products that are approved, products with revoked approval, and products that have never been approved. "allApproved" means that the user is entitled to access all products that are approved for the enterprise. If the value is "allApproved" or "includeAll", the productId field is ignored. If no value is provided, it is interpreted as "whitelist" for backwards compatibility. Further "allApproved" or "includeAll" does not enable automatic visibility of "alpha" or "beta" tracks for Android app. Use ProductVisibility to enable "alpha" or "beta" tracks per user.
         */
        productSetBehavior?: string | null;
        /**
         * Additional list of product IDs making up the product set. Unlike the productID array, in this list It's possible to specify which tracks (alpha, beta, production) of a product are visible to the user. See ProductVisibility and its fields for more information. Specifying the same product ID both here and in the productId array is not allowed and it will result in an error.
         */
        productVisibility?: Schema$ProductVisibility[];
    }
    export interface Schema$ProductsGenerateApprovalUrlResponse {
        /**
         * A URL that can be rendered in an iframe to display the permissions (if any) of a product. This URL can be used to approve the product only once and only within 24 hours of being generated, using the Products.approve call. If the product is currently unapproved and has no permissions, this URL will point to an empty page. If the product is currently approved, a URL will only be generated if that product has added permissions since it was last approved, and the URL will only display those new permissions that have not yet been accepted.
         */
        url?: string | null;
    }
    export interface Schema$ProductSigningCertificate {
        /**
         * The base64 urlsafe encoded SHA1 hash of the certificate. (This field is deprecated in favor of SHA2-256. It should not be used and may be removed at any time.)
         */
        certificateHashSha1?: string | null;
        /**
         * The base64 urlsafe encoded SHA2-256 hash of the certificate.
         */
        certificateHashSha256?: string | null;
    }
    export interface Schema$ProductsListResponse {
        /**
         * General pagination information.
         */
        pageInfo?: Schema$PageInfo;
        /**
         * Information about a product (e.g. an app) in the Google Play store, for display to an enterprise admin.
         */
        product?: Schema$Product[];
        /**
         * Pagination information for token pagination.
         */
        tokenPagination?: Schema$TokenPagination;
    }
    /**
     * A product to be made visible to a user.
     */
    export interface Schema$ProductVisibility {
        /**
         * The product ID to make visible to the user. Required for each item in the productVisibility list.
         */
        productId?: string | null;
        /**
         * Grants the user visibility to the specified product track(s), identified by trackIds.
         */
        trackIds?: string[] | null;
        /**
         * Deprecated. Use trackIds instead.
         */
        tracks?: string[] | null;
    }
    /**
     * A service account identity, including the name and credentials that can be used to authenticate as the service account.
     */
    export interface Schema$ServiceAccount {
        /**
         * Credentials that can be used to authenticate as this ServiceAccount.
         */
        key?: Schema$ServiceAccountKey;
        /**
         * The account name of the service account, in the form of an email address. Assigned by the server.
         */
        name?: string | null;
    }
    /**
     *  *Deprecated:* New integrations cannot use this method and can refer to our new recommendations
     */
    export interface Schema$ServiceAccountKey {
        /**
         * The body of the private key credentials file, in string format. This is only populated when the ServiceAccountKey is created, and is not stored by Google.
         */
        data?: string | null;
        /**
         * An opaque, unique identifier for this ServiceAccountKey. Assigned by the server.
         */
        id?: string | null;
        /**
         * Public key data for the credentials file. This is an X.509 cert. If you are using the googleCredentials key type, this is identical to the cert that can be retrieved by using the X.509 cert url inside of the credentials file.
         */
        publicData?: string | null;
        /**
         * The file format of the generated key data.
         */
        type?: string | null;
    }
    export interface Schema$ServiceAccountKeysListResponse {
        /**
         * The service account credentials.
         */
        serviceAccountKey?: Schema$ServiceAccountKey[];
    }
    /**
     * A resource returned by the GenerateSignupUrl API, which contains the Signup URL and Completion Token.
     */
    export interface Schema$SignupInfo {
        /**
         * An opaque token that will be required, along with the Enterprise Token, for obtaining the enterprise resource from CompleteSignup.
         */
        completionToken?: string | null;
        /**
         * Deprecated.
         */
        kind?: string | null;
        /**
         * A URL under which the Admin can sign up for an enterprise. The page pointed to cannot be rendered in an iframe.
         */
        url?: string | null;
    }
    /**
     * Definition of a managed Google Play store cluster, a list of products displayed as part of a store page.
     */
    export interface Schema$StoreCluster {
        /**
         * Unique ID of this cluster. Assigned by the server. Immutable once assigned.
         */
        id?: string | null;
        /**
         * Ordered list of localized strings giving the name of this page. The text displayed is the one that best matches the user locale, or the first entry if there is no good match. There needs to be at least one entry.
         */
        name?: Schema$LocalizedText[];
        /**
         * String (US-ASCII only) used to determine order of this cluster within the parent page's elements. Page elements are sorted in lexicographic order of this field. Duplicated values are allowed, but ordering between elements with duplicate order is undefined. The value of this field is never visible to a user, it is used solely for the purpose of defining an ordering. Maximum length is 256 characters.
         */
        orderInPage?: string | null;
        /**
         * List of products in the order they are displayed in the cluster. There should not be duplicates within a cluster.
         */
        productId?: string[] | null;
    }
    /**
     * General setting for the managed Google Play store layout, currently only specifying the page to display the first time the store is opened.
     */
    export interface Schema$StoreLayout {
        /**
         * The ID of the store page to be used as the homepage. The homepage is the first page shown in the managed Google Play Store. Not specifying a homepage is equivalent to setting the store layout type to "basic".
         */
        homepageId?: string | null;
        /**
         * The store layout type. By default, this value is set to "basic" if the homepageId field is not set, and to "custom" otherwise. If set to "basic", the layout will consist of all approved apps that have been whitelisted for the user.
         */
        storeLayoutType?: string | null;
    }
    export interface Schema$StoreLayoutClustersListResponse {
        /**
         * A store cluster of an enterprise.
         */
        cluster?: Schema$StoreCluster[];
    }
    export interface Schema$StoreLayoutPagesListResponse {
        /**
         * A store page of an enterprise.
         */
        page?: Schema$StorePage[];
    }
    /**
     * Definition of a managed Google Play store page, made of a localized name and links to other pages. A page also contains clusters defined as a subcollection.
     */
    export interface Schema$StorePage {
        /**
         * Unique ID of this page. Assigned by the server. Immutable once assigned.
         */
        id?: string | null;
        /**
         * Ordered list of pages a user should be able to reach from this page. The list can't include this page. It is recommended that the basic pages are created first, before adding the links between pages. The API doesn't verify that the pages exist or the pages are reachable.
         */
        link?: string[] | null;
        /**
         * Ordered list of localized strings giving the name of this page. The text displayed is the one that best matches the user locale, or the first entry if there is no good match. There needs to be at least one entry.
         */
        name?: Schema$LocalizedText[];
    }
    /**
     * Pagination information returned by a List operation when token pagination is enabled. List operations that supports paging return only one "page" of results. This protocol buffer message describes the page that has been returned. When using token pagination, clients should use the next/previous token to get another page of the result. The presence or absence of next/previous token indicates whether a next/previous page is available and provides a mean of accessing this page. ListRequest.page_token should be set to either next_page_token or previous_page_token to access another page.
     */
    export interface Schema$TokenPagination {
        /**
         * Tokens to pass to the standard list field 'page_token'. Whenever available, tokens are preferred over manipulating start_index.
         */
        nextPageToken?: string | null;
        previousPageToken?: string | null;
    }
    /**
     * Id to name association of a track.
     */
    export interface Schema$TrackInfo {
        /**
         * A modifiable name for a track. This is the visible name in the play developer console.
         */
        trackAlias?: string | null;
        /**
         * Unmodifiable, unique track identifier. This identifier is the releaseTrackId in the url of the play developer console page that displays the track information.
         */
        trackId?: string | null;
    }
    /**
     * A Users resource represents an account associated with an enterprise. The account may be specific to a device or to an individual user (who can then use the account across multiple devices). The account may provide access to managed Google Play only, or to other Google services, depending on the identity model: - The Google managed domain identity model requires synchronization to Google account sources (via primaryEmail). - The managed Google Play Accounts identity model provides a dynamic means for enterprises to create user or device accounts as needed. These accounts provide access to managed Google Play.
     */
    export interface Schema$User {
        /**
         * A unique identifier you create for this user, such as "user342" or "asset#44418". Do not use personally identifiable information (PII) for this property. Must always be set for EMM-managed users. Not set for Google-managed users.
         */
        accountIdentifier?: string | null;
        /**
         * The type of account that this user represents. A userAccount can be installed on multiple devices, but a deviceAccount is specific to a single device. An EMM-managed user (emmManaged) can be either type (userAccount, deviceAccount), but a Google-managed user (googleManaged) is always a userAccount.
         */
        accountType?: string | null;
        /**
         * The name that will appear in user interfaces. Setting this property is optional when creating EMM-managed users. If you do set this property, use something generic about the organization (such as "Example, Inc.") or your name (as EMM). Not used for Google-managed user accounts. @mutable androidenterprise.users.update
         */
        displayName?: string | null;
        /**
         * The unique ID for the user.
         */
        id?: string | null;
        /**
         * The entity that manages the user. With googleManaged users, the source of truth is Google so EMMs have to make sure a Google Account exists for the user. With emmManaged users, the EMM is in charge.
         */
        managementType?: string | null;
        /**
         * The user's primary email address, for example, "jsmith@example.com". Will always be set for Google managed users and not set for EMM managed users.
         */
        primaryEmail?: string | null;
    }
    export interface Schema$UsersListResponse {
        /**
         * A user of an enterprise.
         */
        user?: Schema$User[];
    }
    /**
     * A variable set is a key-value pair of EMM-provided placeholders and its corresponding value, which is attributed to a user. For example, $FIRSTNAME could be a placeholder, and its value could be Alice. Placeholders should start with a '$' sign and should be alphanumeric only.
     */
    export interface Schema$VariableSet {
        /**
         * The placeholder string; defined by EMM.
         */
        placeholder?: string | null;
        /**
         * The value of the placeholder, specific to the user.
         */
        userValue?: string | null;
    }
    /**
     * A WebApps resource represents a web app created for an enterprise. Web apps are published to managed Google Play and can be distributed like other Android apps. On a user's device, a web app opens its specified URL.
     */
    export interface Schema$WebApp {
        /**
         * The display mode of the web app. Possible values include: - "minimalUi", the device's status bar, navigation bar, the app's URL, and a refresh button are visible when the app is open. For HTTP URLs, you can only select this option. - "standalone", the device's status bar and navigation bar are visible when the app is open. - "fullScreen", the app opens in full screen mode, hiding the device's status and navigation bars. All browser UI elements, page URL, system status bar and back button are not visible, and the web app takes up the entirety of the available display area.
         */
        displayMode?: string | null;
        /**
         * A list of icons representing this website. If absent, a default icon (for create) or the current icon (for update) will be used.
         */
        icons?: Schema$WebAppIcon[];
        /**
         * A flag whether the app has been published to the Play store yet.
         */
        isPublished?: boolean | null;
        /**
         * The start URL, i.e. the URL that should load when the user opens the application.
         */
        startUrl?: string | null;
        /**
         * The title of the web app as displayed to the user (e.g., amongst a list of other applications, or as a label for an icon).
         */
        title?: string | null;
        /**
         * The current version of the app. Note that the version can automatically increase during the lifetime of the web app, while Google does internal housekeeping to keep the web app up-to-date.
         */
        versionCode?: string | null;
        /**
         * The ID of the application. A string of the form "app:<package name\>" where the package name always starts with the prefix "com.google.enterprise.webapp." followed by a random id.
         */
        webAppId?: string | null;
    }
    /**
     * Icon for a web app.
     */
    export interface Schema$WebAppIcon {
        /**
         * The actual bytes of the image in a base64url encoded string (c.f. RFC4648, section 5 "Base 64 Encoding with URL and Filename Safe Alphabet"). - The image type can be png or jpg. - The image should ideally be square. - The image should ideally have a size of 512x512.
         */
        imageData?: string | null;
    }
    export interface Schema$WebAppsListResponse {
        /**
         * The manifest describing a web app.
         */
        webApp?: Schema$WebApp[];
    }
    export class Resource$Devices {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Uploads a report containing any changes in app states on the device since the last report was generated. You can call this method up to 3 times every 24 hours for a given device. If you exceed the quota, then the Google Play EMM API returns HTTP 429 Too Many Requests.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        forceReportUpload(params: Params$Resource$Devices$Forcereportupload, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        forceReportUpload(params?: Params$Resource$Devices$Forcereportupload, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        forceReportUpload(params: Params$Resource$Devices$Forcereportupload, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        forceReportUpload(params: Params$Resource$Devices$Forcereportupload, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        forceReportUpload(params: Params$Resource$Devices$Forcereportupload, callback: BodyResponseCallback<void>): void;
        forceReportUpload(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves the details of a device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Devices$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Devices$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Device>>;
        get(params: Params$Resource$Devices$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Devices$Get, options: MethodOptions | BodyResponseCallback<Schema$Device>, callback: BodyResponseCallback<Schema$Device>): void;
        get(params: Params$Resource$Devices$Get, callback: BodyResponseCallback<Schema$Device>): void;
        get(callback: BodyResponseCallback<Schema$Device>): void;
        /**
         * Retrieves whether a device's access to Google services is enabled or disabled. The device state takes effect only if enforcing EMM policies on Android devices is enabled in the Google Admin Console. Otherwise, the device state is ignored and all devices are allowed access to Google services. This is only supported for Google-managed users.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getState(params: Params$Resource$Devices$Getstate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getState(params?: Params$Resource$Devices$Getstate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceState>>;
        getState(params: Params$Resource$Devices$Getstate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getState(params: Params$Resource$Devices$Getstate, options: MethodOptions | BodyResponseCallback<Schema$DeviceState>, callback: BodyResponseCallback<Schema$DeviceState>): void;
        getState(params: Params$Resource$Devices$Getstate, callback: BodyResponseCallback<Schema$DeviceState>): void;
        getState(callback: BodyResponseCallback<Schema$DeviceState>): void;
        /**
         * Retrieves the IDs of all of a user's devices.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Devices$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Devices$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DevicesListResponse>>;
        list(params: Params$Resource$Devices$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Devices$List, options: MethodOptions | BodyResponseCallback<Schema$DevicesListResponse>, callback: BodyResponseCallback<Schema$DevicesListResponse>): void;
        list(params: Params$Resource$Devices$List, callback: BodyResponseCallback<Schema$DevicesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$DevicesListResponse>): void;
        /**
         * Sets whether a device's access to Google services is enabled or disabled. The device state takes effect only if enforcing EMM policies on Android devices is enabled in the Google Admin Console. Otherwise, the device state is ignored and all devices are allowed access to Google services. This is only supported for Google-managed users.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setState(params: Params$Resource$Devices$Setstate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setState(params?: Params$Resource$Devices$Setstate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$DeviceState>>;
        setState(params: Params$Resource$Devices$Setstate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setState(params: Params$Resource$Devices$Setstate, options: MethodOptions | BodyResponseCallback<Schema$DeviceState>, callback: BodyResponseCallback<Schema$DeviceState>): void;
        setState(params: Params$Resource$Devices$Setstate, callback: BodyResponseCallback<Schema$DeviceState>): void;
        setState(callback: BodyResponseCallback<Schema$DeviceState>): void;
        /**
         * Updates the device policy. To ensure the policy is properly enforced, you need to prevent unmanaged accounts from accessing Google Play by setting the allowed_accounts in the managed configuration for the Google Play package. See restrict accounts in Google Play. When provisioning a new device, you should set the device policy using this method before adding the managed Google Play Account to the device, otherwise the policy will not be applied for a short period of time after adding the account to the device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Devices$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Devices$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Device>>;
        update(params: Params$Resource$Devices$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Devices$Update, options: MethodOptions | BodyResponseCallback<Schema$Device>, callback: BodyResponseCallback<Schema$Device>): void;
        update(params: Params$Resource$Devices$Update, callback: BodyResponseCallback<Schema$Device>): void;
        update(callback: BodyResponseCallback<Schema$Device>): void;
    }
    export interface Params$Resource$Devices$Forcereportupload extends StandardParameters {
        /**
         * The ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Devices$Get extends StandardParameters {
        /**
         * The ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Devices$Getstate extends StandardParameters {
        /**
         * The ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Devices$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Devices$Setstate extends StandardParameters {
        /**
         * The ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$DeviceState;
    }
    export interface Params$Resource$Devices$Update extends StandardParameters {
        /**
         * The ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Mask that identifies which fields to update. If not set, all modifiable fields will be modified. When set in a query parameter, this field should be specified as updateMask=<field1\>,<field2\>,...
         */
        updateMask?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Device;
    }
    export class Resource$Enrollmenttokens {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns a token for device enrollment. The DPC can encode this token within the QR/NFC/zero-touch enrollment payload or fetch it before calling the on-device API to authenticate the user. The token can be generated for each device or reused across multiple devices.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        create(params: Params$Resource$Enrollmenttokens$Create, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        create(params?: Params$Resource$Enrollmenttokens$Create, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EnrollmentToken>>;
        create(params: Params$Resource$Enrollmenttokens$Create, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        create(params: Params$Resource$Enrollmenttokens$Create, options: MethodOptions | BodyResponseCallback<Schema$EnrollmentToken>, callback: BodyResponseCallback<Schema$EnrollmentToken>): void;
        create(params: Params$Resource$Enrollmenttokens$Create, callback: BodyResponseCallback<Schema$EnrollmentToken>): void;
        create(callback: BodyResponseCallback<Schema$EnrollmentToken>): void;
    }
    export interface Params$Resource$Enrollmenttokens$Create extends StandardParameters {
        /**
         * Required. The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnrollmentToken;
    }
    export class Resource$Enterprises {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Acknowledges notifications that were received from Enterprises.PullNotificationSet to prevent subsequent calls from returning the same notifications.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        acknowledgeNotificationSet(params: Params$Resource$Enterprises$Acknowledgenotificationset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        acknowledgeNotificationSet(params?: Params$Resource$Enterprises$Acknowledgenotificationset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        acknowledgeNotificationSet(params: Params$Resource$Enterprises$Acknowledgenotificationset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        acknowledgeNotificationSet(params: Params$Resource$Enterprises$Acknowledgenotificationset, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        acknowledgeNotificationSet(params: Params$Resource$Enterprises$Acknowledgenotificationset, callback: BodyResponseCallback<void>): void;
        acknowledgeNotificationSet(callback: BodyResponseCallback<void>): void;
        /**
         * Completes the signup flow, by specifying the Completion token and Enterprise token. This request must not be called multiple times for a given Enterprise Token.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        completeSignup(params: Params$Resource$Enterprises$Completesignup, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        completeSignup(params?: Params$Resource$Enterprises$Completesignup, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Enterprise>>;
        completeSignup(params: Params$Resource$Enterprises$Completesignup, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        completeSignup(params: Params$Resource$Enterprises$Completesignup, options: MethodOptions | BodyResponseCallback<Schema$Enterprise>, callback: BodyResponseCallback<Schema$Enterprise>): void;
        completeSignup(params: Params$Resource$Enterprises$Completesignup, callback: BodyResponseCallback<Schema$Enterprise>): void;
        completeSignup(callback: BodyResponseCallback<Schema$Enterprise>): void;
        /**
         * Returns a unique token to access an embeddable UI. To generate a web UI, pass the generated token into the managed Google Play javascript API. Each token may only be used to start one UI session. See the JavaScript API documentation for further information.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        createWebToken(params: Params$Resource$Enterprises$Createwebtoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        createWebToken(params?: Params$Resource$Enterprises$Createwebtoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AdministratorWebToken>>;
        createWebToken(params: Params$Resource$Enterprises$Createwebtoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        createWebToken(params: Params$Resource$Enterprises$Createwebtoken, options: MethodOptions | BodyResponseCallback<Schema$AdministratorWebToken>, callback: BodyResponseCallback<Schema$AdministratorWebToken>): void;
        createWebToken(params: Params$Resource$Enterprises$Createwebtoken, callback: BodyResponseCallback<Schema$AdministratorWebToken>): void;
        createWebToken(callback: BodyResponseCallback<Schema$AdministratorWebToken>): void;
        /**
         * Enrolls an enterprise with the calling EMM.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        enroll(params: Params$Resource$Enterprises$Enroll, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        enroll(params?: Params$Resource$Enterprises$Enroll, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Enterprise>>;
        enroll(params: Params$Resource$Enterprises$Enroll, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        enroll(params: Params$Resource$Enterprises$Enroll, options: MethodOptions | BodyResponseCallback<Schema$Enterprise>, callback: BodyResponseCallback<Schema$Enterprise>): void;
        enroll(params: Params$Resource$Enterprises$Enroll, callback: BodyResponseCallback<Schema$Enterprise>): void;
        enroll(callback: BodyResponseCallback<Schema$Enterprise>): void;
        /**
         * Generates an enterprise upgrade URL to upgrade an existing managed Google Play Accounts enterprise to a managed Google domain. **Note:** This feature is not generally available.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateEnterpriseUpgradeUrl(params: Params$Resource$Enterprises$Generateenterpriseupgradeurl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateEnterpriseUpgradeUrl(params?: Params$Resource$Enterprises$Generateenterpriseupgradeurl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GenerateEnterpriseUpgradeUrlResponse>>;
        generateEnterpriseUpgradeUrl(params: Params$Resource$Enterprises$Generateenterpriseupgradeurl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateEnterpriseUpgradeUrl(params: Params$Resource$Enterprises$Generateenterpriseupgradeurl, options: MethodOptions | BodyResponseCallback<Schema$GenerateEnterpriseUpgradeUrlResponse>, callback: BodyResponseCallback<Schema$GenerateEnterpriseUpgradeUrlResponse>): void;
        generateEnterpriseUpgradeUrl(params: Params$Resource$Enterprises$Generateenterpriseupgradeurl, callback: BodyResponseCallback<Schema$GenerateEnterpriseUpgradeUrlResponse>): void;
        generateEnterpriseUpgradeUrl(callback: BodyResponseCallback<Schema$GenerateEnterpriseUpgradeUrlResponse>): void;
        /**
         * Generates a sign-up URL.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateSignupUrl(params: Params$Resource$Enterprises$Generatesignupurl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateSignupUrl(params?: Params$Resource$Enterprises$Generatesignupurl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$SignupInfo>>;
        generateSignupUrl(params: Params$Resource$Enterprises$Generatesignupurl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateSignupUrl(params: Params$Resource$Enterprises$Generatesignupurl, options: MethodOptions | BodyResponseCallback<Schema$SignupInfo>, callback: BodyResponseCallback<Schema$SignupInfo>): void;
        generateSignupUrl(params: Params$Resource$Enterprises$Generatesignupurl, callback: BodyResponseCallback<Schema$SignupInfo>): void;
        generateSignupUrl(callback: BodyResponseCallback<Schema$SignupInfo>): void;
        /**
         * Retrieves the name and domain of an enterprise.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Enterprises$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Enterprises$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Enterprise>>;
        get(params: Params$Resource$Enterprises$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Enterprises$Get, options: MethodOptions | BodyResponseCallback<Schema$Enterprise>, callback: BodyResponseCallback<Schema$Enterprise>): void;
        get(params: Params$Resource$Enterprises$Get, callback: BodyResponseCallback<Schema$Enterprise>): void;
        get(callback: BodyResponseCallback<Schema$Enterprise>): void;
        /**
         * Returns a service account and credentials. The service account can be bound to the enterprise by calling setAccount. The service account is unique to this enterprise and EMM, and will be deleted if the enterprise is unbound. The credentials contain private key data and are not stored server-side. This method can only be called after calling Enterprises.Enroll or Enterprises.CompleteSignup, and before Enterprises.SetAccount; at other times it will return an error. Subsequent calls after the first will generate a new, unique set of credentials, and invalidate the previously generated credentials. Once the service account is bound to the enterprise, it can be managed using the serviceAccountKeys resource. *Note:* After you create a key, you might need to wait for 60 seconds or more before you perform another operation with the key. If you try to perform an operation with the key immediately after you create the key, and you receive an error, you can retry the request with exponential backoff .
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getServiceAccount(params: Params$Resource$Enterprises$Getserviceaccount, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getServiceAccount(params?: Params$Resource$Enterprises$Getserviceaccount, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccount>>;
        getServiceAccount(params: Params$Resource$Enterprises$Getserviceaccount, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getServiceAccount(params: Params$Resource$Enterprises$Getserviceaccount, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccount>, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        getServiceAccount(params: Params$Resource$Enterprises$Getserviceaccount, callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        getServiceAccount(callback: BodyResponseCallback<Schema$ServiceAccount>): void;
        /**
         * Returns the store layout for the enterprise. If the store layout has not been set, returns "basic" as the store layout type and no homepage.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getStoreLayout(params: Params$Resource$Enterprises$Getstorelayout, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getStoreLayout(params?: Params$Resource$Enterprises$Getstorelayout, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreLayout>>;
        getStoreLayout(params: Params$Resource$Enterprises$Getstorelayout, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getStoreLayout(params: Params$Resource$Enterprises$Getstorelayout, options: MethodOptions | BodyResponseCallback<Schema$StoreLayout>, callback: BodyResponseCallback<Schema$StoreLayout>): void;
        getStoreLayout(params: Params$Resource$Enterprises$Getstorelayout, callback: BodyResponseCallback<Schema$StoreLayout>): void;
        getStoreLayout(callback: BodyResponseCallback<Schema$StoreLayout>): void;
        /**
         * Looks up an enterprise by domain name. This is only supported for enterprises created via the Google-initiated creation flow. Lookup of the id is not needed for enterprises created via the EMM-initiated flow since the EMM learns the enterprise ID in the callback specified in the Enterprises.generateSignupUrl call.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Enterprises$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Enterprises$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EnterprisesListResponse>>;
        list(params: Params$Resource$Enterprises$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Enterprises$List, options: MethodOptions | BodyResponseCallback<Schema$EnterprisesListResponse>, callback: BodyResponseCallback<Schema$EnterprisesListResponse>): void;
        list(params: Params$Resource$Enterprises$List, callback: BodyResponseCallback<Schema$EnterprisesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$EnterprisesListResponse>): void;
        /**
         * Pulls and returns a notification set for the enterprises associated with the service account authenticated for the request. The notification set may be empty if no notification are pending. A notification set returned needs to be acknowledged within 20 seconds by calling Enterprises.AcknowledgeNotificationSet, unless the notification set is empty. Notifications that are not acknowledged within the 20 seconds will eventually be included again in the response to another PullNotificationSet request, and those that are never acknowledged will ultimately be deleted according to the Google Cloud Platform Pub/Sub system policy. Multiple requests might be performed concurrently to retrieve notifications, in which case the pending notifications (if any) will be split among each caller, if any are pending. If no notifications are present, an empty notification list is returned. Subsequent requests may return more notifications once they become available.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        pullNotificationSet(params: Params$Resource$Enterprises$Pullnotificationset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        pullNotificationSet(params?: Params$Resource$Enterprises$Pullnotificationset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$NotificationSet>>;
        pullNotificationSet(params: Params$Resource$Enterprises$Pullnotificationset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        pullNotificationSet(params: Params$Resource$Enterprises$Pullnotificationset, options: MethodOptions | BodyResponseCallback<Schema$NotificationSet>, callback: BodyResponseCallback<Schema$NotificationSet>): void;
        pullNotificationSet(params: Params$Resource$Enterprises$Pullnotificationset, callback: BodyResponseCallback<Schema$NotificationSet>): void;
        pullNotificationSet(callback: BodyResponseCallback<Schema$NotificationSet>): void;
        /**
         * Sends a test notification to validate the EMM integration with the Google Cloud Pub/Sub service for this enterprise.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        sendTestPushNotification(params: Params$Resource$Enterprises$Sendtestpushnotification, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        sendTestPushNotification(params?: Params$Resource$Enterprises$Sendtestpushnotification, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EnterprisesSendTestPushNotificationResponse>>;
        sendTestPushNotification(params: Params$Resource$Enterprises$Sendtestpushnotification, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        sendTestPushNotification(params: Params$Resource$Enterprises$Sendtestpushnotification, options: MethodOptions | BodyResponseCallback<Schema$EnterprisesSendTestPushNotificationResponse>, callback: BodyResponseCallback<Schema$EnterprisesSendTestPushNotificationResponse>): void;
        sendTestPushNotification(params: Params$Resource$Enterprises$Sendtestpushnotification, callback: BodyResponseCallback<Schema$EnterprisesSendTestPushNotificationResponse>): void;
        sendTestPushNotification(callback: BodyResponseCallback<Schema$EnterprisesSendTestPushNotificationResponse>): void;
        /**
         * Sets the account that will be used to authenticate to the API as the enterprise.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAccount(params: Params$Resource$Enterprises$Setaccount, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAccount(params?: Params$Resource$Enterprises$Setaccount, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EnterpriseAccount>>;
        setAccount(params: Params$Resource$Enterprises$Setaccount, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAccount(params: Params$Resource$Enterprises$Setaccount, options: MethodOptions | BodyResponseCallback<Schema$EnterpriseAccount>, callback: BodyResponseCallback<Schema$EnterpriseAccount>): void;
        setAccount(params: Params$Resource$Enterprises$Setaccount, callback: BodyResponseCallback<Schema$EnterpriseAccount>): void;
        setAccount(callback: BodyResponseCallback<Schema$EnterpriseAccount>): void;
        /**
         * Sets the store layout for the enterprise. By default, storeLayoutType is set to "basic" and the basic store layout is enabled. The basic layout only contains apps approved by the admin, and that have been added to the available product set for a user (using the setAvailableProductSet call). Apps on the page are sorted in order of their product ID value. If you create a custom store layout (by setting storeLayoutType = "custom" and setting a homepage), the basic store layout is disabled.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setStoreLayout(params: Params$Resource$Enterprises$Setstorelayout, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setStoreLayout(params?: Params$Resource$Enterprises$Setstorelayout, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreLayout>>;
        setStoreLayout(params: Params$Resource$Enterprises$Setstorelayout, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setStoreLayout(params: Params$Resource$Enterprises$Setstorelayout, options: MethodOptions | BodyResponseCallback<Schema$StoreLayout>, callback: BodyResponseCallback<Schema$StoreLayout>): void;
        setStoreLayout(params: Params$Resource$Enterprises$Setstorelayout, callback: BodyResponseCallback<Schema$StoreLayout>): void;
        setStoreLayout(callback: BodyResponseCallback<Schema$StoreLayout>): void;
        /**
         * Unenrolls an enterprise from the calling EMM.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unenroll(params: Params$Resource$Enterprises$Unenroll, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unenroll(params?: Params$Resource$Enterprises$Unenroll, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        unenroll(params: Params$Resource$Enterprises$Unenroll, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unenroll(params: Params$Resource$Enterprises$Unenroll, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        unenroll(params: Params$Resource$Enterprises$Unenroll, callback: BodyResponseCallback<void>): void;
        unenroll(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Enterprises$Acknowledgenotificationset extends StandardParameters {
        /**
         * The notification set ID as returned by Enterprises.PullNotificationSet. This must be provided.
         */
        notificationSetId?: string;
    }
    export interface Params$Resource$Enterprises$Completesignup extends StandardParameters {
        /**
         * The Completion token initially returned by GenerateSignupUrl.
         */
        completionToken?: string;
        /**
         * The Enterprise token appended to the Callback URL.
         */
        enterpriseToken?: string;
    }
    export interface Params$Resource$Enterprises$Createwebtoken extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$AdministratorWebTokenSpec;
    }
    export interface Params$Resource$Enterprises$Enroll extends StandardParameters {
        /**
         * Required. The token provided by the enterprise to register the EMM.
         */
        token?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Enterprise;
    }
    export interface Params$Resource$Enterprises$Generateenterpriseupgradeurl extends StandardParameters {
        /**
         * Optional. Email address used to prefill the admin field of the enterprise signup form as part of the upgrade process. This value is a hint only and can be altered by the user. Personal email addresses are not allowed. If `allowedDomains` is non-empty then this must belong to one of the `allowedDomains`.
         */
        adminEmail?: string;
        /**
         * Optional. A list of domains that are permitted for the admin email. The IT admin cannot enter an email address with a domain name that is not in this list. Subdomains of domains in this list are not allowed but can be allowed by adding a second entry which has `*.` prefixed to the domain name (e.g. *.example.com). If the field is not present or is an empty list then the IT admin is free to use any valid domain name. Personal email domains are not allowed.
         */
        allowedDomains?: string[];
        /**
         * Required. The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Enterprises$Generatesignupurl extends StandardParameters {
        /**
         * Optional. Email address used to prefill the admin field of the enterprise signup form. This value is a hint only and can be altered by the user. If `allowedDomains` is non-empty then this must belong to one of the `allowedDomains`.
         */
        adminEmail?: string;
        /**
         * Optional. A list of domains that are permitted for the admin email. The IT admin cannot enter an email address with a domain name that is not in this list. Subdomains of domains in this list are not allowed but can be allowed by adding a second entry which has `*.` prefixed to the domain name (e.g. *.example.com). If the field is not present or is an empty list then the IT admin is free to use any valid domain name. Personal email domains are always allowed, but will result in the creation of a managed Google Play Accounts enterprise.
         */
        allowedDomains?: string[];
        /**
         * The callback URL to which the Admin will be redirected after successfully creating an enterprise. Before redirecting there the system will add a single query parameter to this URL named "enterpriseToken" which will contain an opaque token to be used for the CompleteSignup request. Beware that this means that the URL will be parsed, the parameter added and then a new URL formatted, i.e. there may be some minor formatting changes and, more importantly, the URL must be well-formed so that it can be parsed.
         */
        callbackUrl?: string;
    }
    export interface Params$Resource$Enterprises$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Enterprises$Getserviceaccount extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The type of credential to return with the service account. Required.
         */
        keyType?: string;
    }
    export interface Params$Resource$Enterprises$Getstorelayout extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Enterprises$List extends StandardParameters {
        /**
         * Required. The exact primary domain name of the enterprise to look up.
         */
        domain?: string;
    }
    export interface Params$Resource$Enterprises$Pullnotificationset extends StandardParameters {
        /**
         * The request mode for pulling notifications. Specifying waitForNotifications will cause the request to block and wait until one or more notifications are present, or return an empty notification list if no notifications are present after some time. Specifying returnImmediately will cause the request to immediately return the pending notifications, or an empty list if no notifications are present. If omitted, defaults to waitForNotifications.
         */
        requestMode?: string;
    }
    export interface Params$Resource$Enterprises$Sendtestpushnotification extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Enterprises$Setaccount extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$EnterpriseAccount;
    }
    export interface Params$Resource$Enterprises$Setstorelayout extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StoreLayout;
    }
    export interface Params$Resource$Enterprises$Unenroll extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export class Resource$Entitlements {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Removes an entitlement to an app for a user. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Entitlements$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Entitlements$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Entitlements$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Entitlements$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Entitlements$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of an entitlement. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Entitlements$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Entitlements$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Entitlement>>;
        get(params: Params$Resource$Entitlements$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Entitlements$Get, options: MethodOptions | BodyResponseCallback<Schema$Entitlement>, callback: BodyResponseCallback<Schema$Entitlement>): void;
        get(params: Params$Resource$Entitlements$Get, callback: BodyResponseCallback<Schema$Entitlement>): void;
        get(callback: BodyResponseCallback<Schema$Entitlement>): void;
        /**
         * Lists all entitlements for the specified user. Only the ID is set. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Entitlements$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Entitlements$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$EntitlementsListResponse>>;
        list(params: Params$Resource$Entitlements$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Entitlements$List, options: MethodOptions | BodyResponseCallback<Schema$EntitlementsListResponse>, callback: BodyResponseCallback<Schema$EntitlementsListResponse>): void;
        list(params: Params$Resource$Entitlements$List, callback: BodyResponseCallback<Schema$EntitlementsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$EntitlementsListResponse>): void;
        /**
         * Adds or updates an entitlement to an app for a user. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Entitlements$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Entitlements$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Entitlement>>;
        update(params: Params$Resource$Entitlements$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Entitlements$Update, options: MethodOptions | BodyResponseCallback<Schema$Entitlement>, callback: BodyResponseCallback<Schema$Entitlement>): void;
        update(params: Params$Resource$Entitlements$Update, callback: BodyResponseCallback<Schema$Entitlement>): void;
        update(callback: BodyResponseCallback<Schema$Entitlement>): void;
    }
    export interface Params$Resource$Entitlements$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
         */
        entitlementId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Entitlements$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
         */
        entitlementId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Entitlements$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Entitlements$Update extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the entitlement (a product ID), e.g. "app:com.google.android.gm".
         */
        entitlementId?: string;
        /**
         * Set to true to also install the product on all the user's devices where possible. Failure to install on one or more devices will not prevent this operation from returning successfully, as long as the entitlement was successfully assigned to the user.
         */
        install?: boolean;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Entitlement;
    }
    export class Resource$Grouplicenses {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves details of an enterprise's group license for a product. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Grouplicenses$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Grouplicenses$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GroupLicense>>;
        get(params: Params$Resource$Grouplicenses$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Grouplicenses$Get, options: MethodOptions | BodyResponseCallback<Schema$GroupLicense>, callback: BodyResponseCallback<Schema$GroupLicense>): void;
        get(params: Params$Resource$Grouplicenses$Get, callback: BodyResponseCallback<Schema$GroupLicense>): void;
        get(callback: BodyResponseCallback<Schema$GroupLicense>): void;
        /**
         * Retrieves IDs of all products for which the enterprise has a group license. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Grouplicenses$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Grouplicenses$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GroupLicensesListResponse>>;
        list(params: Params$Resource$Grouplicenses$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Grouplicenses$List, options: MethodOptions | BodyResponseCallback<Schema$GroupLicensesListResponse>, callback: BodyResponseCallback<Schema$GroupLicensesListResponse>): void;
        list(params: Params$Resource$Grouplicenses$List, callback: BodyResponseCallback<Schema$GroupLicensesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$GroupLicensesListResponse>): void;
    }
    export interface Params$Resource$Grouplicenses$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product the group license is for, e.g. "app:com.google.android.gm".
         */
        groupLicenseId?: string;
    }
    export interface Params$Resource$Grouplicenses$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export class Resource$Grouplicenseusers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves the IDs of the users who have been granted entitlements under the license. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Grouplicenseusers$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Grouplicenseusers$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$GroupLicenseUsersListResponse>>;
        list(params: Params$Resource$Grouplicenseusers$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Grouplicenseusers$List, options: MethodOptions | BodyResponseCallback<Schema$GroupLicenseUsersListResponse>, callback: BodyResponseCallback<Schema$GroupLicenseUsersListResponse>): void;
        list(params: Params$Resource$Grouplicenseusers$List, callback: BodyResponseCallback<Schema$GroupLicenseUsersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$GroupLicenseUsersListResponse>): void;
    }
    export interface Params$Resource$Grouplicenseusers$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product the group license is for, e.g. "app:com.google.android.gm".
         */
        groupLicenseId?: string;
    }
    export class Resource$Installs {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Requests to remove an app from a device. A call to get or list will still show the app as installed on the device until it is actually removed. A successful response indicates that a removal request has been sent to the device. The call will be considered successful even if the app is not present on the device (e.g. it was never installed, or was removed by the user).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Installs$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Installs$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Installs$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Installs$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Installs$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of an installation of an app on a device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Installs$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Installs$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Install>>;
        get(params: Params$Resource$Installs$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Installs$Get, options: MethodOptions | BodyResponseCallback<Schema$Install>, callback: BodyResponseCallback<Schema$Install>): void;
        get(params: Params$Resource$Installs$Get, callback: BodyResponseCallback<Schema$Install>): void;
        get(callback: BodyResponseCallback<Schema$Install>): void;
        /**
         * Retrieves the details of all apps installed on the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Installs$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Installs$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InstallsListResponse>>;
        list(params: Params$Resource$Installs$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Installs$List, options: MethodOptions | BodyResponseCallback<Schema$InstallsListResponse>, callback: BodyResponseCallback<Schema$InstallsListResponse>): void;
        list(params: Params$Resource$Installs$List, callback: BodyResponseCallback<Schema$InstallsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$InstallsListResponse>): void;
        /**
         * Requests to install the latest version of an app to a device. If the app is already installed, then it is updated to the latest version if necessary.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Installs$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Installs$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Install>>;
        update(params: Params$Resource$Installs$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Installs$Update, options: MethodOptions | BodyResponseCallback<Schema$Install>, callback: BodyResponseCallback<Schema$Install>): void;
        update(params: Params$Resource$Installs$Update, callback: BodyResponseCallback<Schema$Install>): void;
        update(callback: BodyResponseCallback<Schema$Install>): void;
    }
    export interface Params$Resource$Installs$Delete extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product represented by the install, e.g. "app:com.google.android.gm".
         */
        installId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Installs$Get extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product represented by the install, e.g. "app:com.google.android.gm".
         */
        installId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Installs$List extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Installs$Update extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product represented by the install, e.g. "app:com.google.android.gm".
         */
        installId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Install;
    }
    export class Resource$Managedconfigurationsfordevice {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Removes a per-device managed configuration for an app for the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Managedconfigurationsfordevice$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Managedconfigurationsfordevice$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Managedconfigurationsfordevice$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Managedconfigurationsfordevice$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Managedconfigurationsfordevice$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of a per-device managed configuration.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Managedconfigurationsfordevice$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedconfigurationsfordevice$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfiguration>>;
        get(params: Params$Resource$Managedconfigurationsfordevice$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedconfigurationsfordevice$Get, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfiguration>, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        get(params: Params$Resource$Managedconfigurationsfordevice$Get, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        get(callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        /**
         * Lists all the per-device managed configurations for the specified device. Only the ID is set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Managedconfigurationsfordevice$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedconfigurationsfordevice$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfigurationsForDeviceListResponse>>;
        list(params: Params$Resource$Managedconfigurationsfordevice$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedconfigurationsfordevice$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfigurationsForDeviceListResponse>, callback: BodyResponseCallback<Schema$ManagedConfigurationsForDeviceListResponse>): void;
        list(params: Params$Resource$Managedconfigurationsfordevice$List, callback: BodyResponseCallback<Schema$ManagedConfigurationsForDeviceListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedConfigurationsForDeviceListResponse>): void;
        /**
         * Adds or updates a per-device managed configuration for an app for the specified device.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Managedconfigurationsfordevice$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Managedconfigurationsfordevice$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfiguration>>;
        update(params: Params$Resource$Managedconfigurationsfordevice$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Managedconfigurationsfordevice$Update, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfiguration>, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        update(params: Params$Resource$Managedconfigurationsfordevice$Update, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        update(callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
    }
    export interface Params$Resource$Managedconfigurationsfordevice$Delete extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForDeviceId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsfordevice$Get extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForDeviceId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsfordevice$List extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsfordevice$Update extends StandardParameters {
        /**
         * The Android ID of the device.
         */
        deviceId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForDeviceId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagedConfiguration;
    }
    export class Resource$Managedconfigurationsforuser {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Removes a per-user managed configuration for an app for the specified user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Managedconfigurationsforuser$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Managedconfigurationsforuser$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Managedconfigurationsforuser$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Managedconfigurationsforuser$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Managedconfigurationsforuser$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of a per-user managed configuration for an app for the specified user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Managedconfigurationsforuser$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Managedconfigurationsforuser$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfiguration>>;
        get(params: Params$Resource$Managedconfigurationsforuser$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Managedconfigurationsforuser$Get, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfiguration>, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        get(params: Params$Resource$Managedconfigurationsforuser$Get, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        get(callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        /**
         * Lists all the per-user managed configurations for the specified user. Only the ID is set.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Managedconfigurationsforuser$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedconfigurationsforuser$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfigurationsForUserListResponse>>;
        list(params: Params$Resource$Managedconfigurationsforuser$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedconfigurationsforuser$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfigurationsForUserListResponse>, callback: BodyResponseCallback<Schema$ManagedConfigurationsForUserListResponse>): void;
        list(params: Params$Resource$Managedconfigurationsforuser$List, callback: BodyResponseCallback<Schema$ManagedConfigurationsForUserListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedConfigurationsForUserListResponse>): void;
        /**
         * Adds or updates the managed configuration settings for an app for the specified user. If you support the Managed configurations iframe, you can apply managed configurations to a user by specifying an mcmId and its associated configuration variables (if any) in the request. Alternatively, all EMMs can apply managed configurations by passing a list of managed properties.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Managedconfigurationsforuser$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Managedconfigurationsforuser$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfiguration>>;
        update(params: Params$Resource$Managedconfigurationsforuser$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Managedconfigurationsforuser$Update, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfiguration>, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        update(params: Params$Resource$Managedconfigurationsforuser$Update, callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
        update(callback: BodyResponseCallback<Schema$ManagedConfiguration>): void;
    }
    export interface Params$Resource$Managedconfigurationsforuser$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForUserId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsforuser$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForUserId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsforuser$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Managedconfigurationsforuser$Update extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the managed configuration (a product ID), e.g. "app:com.google.android.gm".
         */
        managedConfigurationForUserId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ManagedConfiguration;
    }
    export class Resource$Managedconfigurationssettings {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Lists all the managed configurations settings for the specified app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Managedconfigurationssettings$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Managedconfigurationssettings$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ManagedConfigurationsSettingsListResponse>>;
        list(params: Params$Resource$Managedconfigurationssettings$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Managedconfigurationssettings$List, options: MethodOptions | BodyResponseCallback<Schema$ManagedConfigurationsSettingsListResponse>, callback: BodyResponseCallback<Schema$ManagedConfigurationsSettingsListResponse>): void;
        list(params: Params$Resource$Managedconfigurationssettings$List, callback: BodyResponseCallback<Schema$ManagedConfigurationsSettingsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ManagedConfigurationsSettingsListResponse>): void;
    }
    export interface Params$Resource$Managedconfigurationssettings$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product for which the managed configurations settings applies to.
         */
        productId?: string;
    }
    export class Resource$Permissions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Retrieves details of an Android app permission for display to an enterprise admin.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Permissions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Permissions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Permission>>;
        get(params: Params$Resource$Permissions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Permissions$Get, options: MethodOptions | BodyResponseCallback<Schema$Permission>, callback: BodyResponseCallback<Schema$Permission>): void;
        get(params: Params$Resource$Permissions$Get, callback: BodyResponseCallback<Schema$Permission>): void;
        get(callback: BodyResponseCallback<Schema$Permission>): void;
    }
    export interface Params$Resource$Permissions$Get extends StandardParameters {
        /**
         * The BCP47 tag for the user's preferred language (e.g. "en-US", "de")
         */
        language?: string;
        /**
         * The ID of the permission.
         */
        permissionId?: string;
    }
    export class Resource$Products {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         *  Approves the specified product and the relevant app permissions, if any. The maximum number of products that you can approve per enterprise customer is 1,000. To learn how to use managed Google Play to design and create a store layout to display approved products to your users, see Store Layout Design. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        approve(params: Params$Resource$Products$Approve, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        approve(params?: Params$Resource$Products$Approve, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        approve(params: Params$Resource$Products$Approve, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        approve(params: Params$Resource$Products$Approve, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        approve(params: Params$Resource$Products$Approve, callback: BodyResponseCallback<void>): void;
        approve(callback: BodyResponseCallback<void>): void;
        /**
         * Generates a URL that can be rendered in an iframe to display the permissions (if any) of a product. An enterprise admin must view these permissions and accept them on behalf of their organization in order to approve that product. Admins should accept the displayed permissions by interacting with a separate UI element in the EMM console, which in turn should trigger the use of this URL as the approvalUrlInfo.approvalUrl property in a Products.approve call to approve the product. This URL can only be used to display permissions for up to 1 day. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateApprovalUrl(params: Params$Resource$Products$Generateapprovalurl, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateApprovalUrl(params?: Params$Resource$Products$Generateapprovalurl, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductsGenerateApprovalUrlResponse>>;
        generateApprovalUrl(params: Params$Resource$Products$Generateapprovalurl, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateApprovalUrl(params: Params$Resource$Products$Generateapprovalurl, options: MethodOptions | BodyResponseCallback<Schema$ProductsGenerateApprovalUrlResponse>, callback: BodyResponseCallback<Schema$ProductsGenerateApprovalUrlResponse>): void;
        generateApprovalUrl(params: Params$Resource$Products$Generateapprovalurl, callback: BodyResponseCallback<Schema$ProductsGenerateApprovalUrlResponse>): void;
        generateApprovalUrl(callback: BodyResponseCallback<Schema$ProductsGenerateApprovalUrlResponse>): void;
        /**
         * Retrieves details of a product for display to an enterprise admin.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Products$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Products$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Product>>;
        get(params: Params$Resource$Products$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Products$Get, options: MethodOptions | BodyResponseCallback<Schema$Product>, callback: BodyResponseCallback<Schema$Product>): void;
        get(params: Params$Resource$Products$Get, callback: BodyResponseCallback<Schema$Product>): void;
        get(callback: BodyResponseCallback<Schema$Product>): void;
        /**
         * Retrieves the schema that defines the configurable properties for this product. All products have a schema, but this schema may be empty if no managed configurations have been defined. This schema can be used to populate a UI that allows an admin to configure the product. To apply a managed configuration based on the schema obtained using this API, see Managed Configurations through Play.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getAppRestrictionsSchema(params: Params$Resource$Products$Getapprestrictionsschema, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAppRestrictionsSchema(params?: Params$Resource$Products$Getapprestrictionsschema, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AppRestrictionsSchema>>;
        getAppRestrictionsSchema(params: Params$Resource$Products$Getapprestrictionsschema, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAppRestrictionsSchema(params: Params$Resource$Products$Getapprestrictionsschema, options: MethodOptions | BodyResponseCallback<Schema$AppRestrictionsSchema>, callback: BodyResponseCallback<Schema$AppRestrictionsSchema>): void;
        getAppRestrictionsSchema(params: Params$Resource$Products$Getapprestrictionsschema, callback: BodyResponseCallback<Schema$AppRestrictionsSchema>): void;
        getAppRestrictionsSchema(callback: BodyResponseCallback<Schema$AppRestrictionsSchema>): void;
        /**
         * Retrieves the Android app permissions required by this app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getPermissions(params: Params$Resource$Products$Getpermissions, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getPermissions(params?: Params$Resource$Products$Getpermissions, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductPermissions>>;
        getPermissions(params: Params$Resource$Products$Getpermissions, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getPermissions(params: Params$Resource$Products$Getpermissions, options: MethodOptions | BodyResponseCallback<Schema$ProductPermissions>, callback: BodyResponseCallback<Schema$ProductPermissions>): void;
        getPermissions(params: Params$Resource$Products$Getpermissions, callback: BodyResponseCallback<Schema$ProductPermissions>): void;
        getPermissions(callback: BodyResponseCallback<Schema$ProductPermissions>): void;
        /**
         * Finds approved products that match a query, or all approved products if there is no query. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Products$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Products$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductsListResponse>>;
        list(params: Params$Resource$Products$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Products$List, options: MethodOptions | BodyResponseCallback<Schema$ProductsListResponse>, callback: BodyResponseCallback<Schema$ProductsListResponse>): void;
        list(params: Params$Resource$Products$List, callback: BodyResponseCallback<Schema$ProductsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ProductsListResponse>): void;
        /**
         * Unapproves the specified product (and the relevant app permissions, if any) **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unapprove(params: Params$Resource$Products$Unapprove, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unapprove(params?: Params$Resource$Products$Unapprove, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        unapprove(params: Params$Resource$Products$Unapprove, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unapprove(params: Params$Resource$Products$Unapprove, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        unapprove(params: Params$Resource$Products$Unapprove, callback: BodyResponseCallback<void>): void;
        unapprove(callback: BodyResponseCallback<void>): void;
    }
    export interface Params$Resource$Products$Approve extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product.
         */
        productId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ProductsApproveRequest;
    }
    export interface Params$Resource$Products$Generateapprovalurl extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The BCP 47 language code used for permission names and descriptions in the returned iframe, for instance "en-US".
         */
        languageCode?: string;
        /**
         * The ID of the product.
         */
        productId?: string;
    }
    export interface Params$Resource$Products$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The BCP47 tag for the user's preferred language (e.g. "en-US", "de").
         */
        language?: string;
        /**
         * The ID of the product, e.g. "app:com.google.android.gm".
         */
        productId?: string;
    }
    export interface Params$Resource$Products$Getapprestrictionsschema extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The BCP47 tag for the user's preferred language (e.g. "en-US", "de").
         */
        language?: string;
        /**
         * The ID of the product.
         */
        productId?: string;
    }
    export interface Params$Resource$Products$Getpermissions extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product.
         */
        productId?: string;
    }
    export interface Params$Resource$Products$List extends StandardParameters {
        /**
         * Specifies whether to search among all products (false) or among only products that have been approved (true). Only "true" is supported, and should be specified.
         */
        approved?: boolean;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The BCP47 tag for the user's preferred language (e.g. "en-US", "de"). Results are returned in the language best matching the preferred language.
         */
        language?: string;
        /**
         * Defines how many results the list operation should return. The default number depends on the resource collection.
         */
        maxResults?: number;
        /**
         * The search query as typed in the Google Play store search box. If omitted, all approved apps will be returned (using the pagination parameters), including apps that are not available in the store (e.g. unpublished apps).
         */
        query?: string;
        /**
         * Defines the token of the page to return, usually taken from TokenPagination. This can only be used if token paging is enabled.
         */
        token?: string;
    }
    export interface Params$Resource$Products$Unapprove extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the product.
         */
        productId?: string;
    }
    export class Resource$Serviceaccountkeys {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Removes and invalidates the specified credentials for the service account associated with this enterprise. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Serviceaccountkeys$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Serviceaccountkeys$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Serviceaccountkeys$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Serviceaccountkeys$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Serviceaccountkeys$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Generates new credentials for the service account associated with this enterprise. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount. Only the type of the key should be populated in the resource to be inserted.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Serviceaccountkeys$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Serviceaccountkeys$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccountKey>>;
        insert(params: Params$Resource$Serviceaccountkeys$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Serviceaccountkeys$Insert, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccountKey>, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        insert(params: Params$Resource$Serviceaccountkeys$Insert, callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        insert(callback: BodyResponseCallback<Schema$ServiceAccountKey>): void;
        /**
         * Lists all active credentials for the service account associated with this enterprise. Only the ID and key type are returned. The calling service account must have been retrieved by calling Enterprises.GetServiceAccount and must have been set as the enterprise service account by calling Enterprises.SetAccount.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Serviceaccountkeys$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Serviceaccountkeys$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ServiceAccountKeysListResponse>>;
        list(params: Params$Resource$Serviceaccountkeys$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Serviceaccountkeys$List, options: MethodOptions | BodyResponseCallback<Schema$ServiceAccountKeysListResponse>, callback: BodyResponseCallback<Schema$ServiceAccountKeysListResponse>): void;
        list(params: Params$Resource$Serviceaccountkeys$List, callback: BodyResponseCallback<Schema$ServiceAccountKeysListResponse>): void;
        list(callback: BodyResponseCallback<Schema$ServiceAccountKeysListResponse>): void;
    }
    export interface Params$Resource$Serviceaccountkeys$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the key.
         */
        keyId?: string;
    }
    export interface Params$Resource$Serviceaccountkeys$Insert extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ServiceAccountKey;
    }
    export interface Params$Resource$Serviceaccountkeys$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export class Resource$Storelayoutclusters {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Storelayoutclusters$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Storelayoutclusters$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Storelayoutclusters$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Storelayoutclusters$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Storelayoutclusters$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Storelayoutclusters$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Storelayoutclusters$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreCluster>>;
        get(params: Params$Resource$Storelayoutclusters$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Storelayoutclusters$Get, options: MethodOptions | BodyResponseCallback<Schema$StoreCluster>, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        get(params: Params$Resource$Storelayoutclusters$Get, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        get(callback: BodyResponseCallback<Schema$StoreCluster>): void;
        /**
         * Inserts a new cluster in a page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Storelayoutclusters$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Storelayoutclusters$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreCluster>>;
        insert(params: Params$Resource$Storelayoutclusters$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Storelayoutclusters$Insert, options: MethodOptions | BodyResponseCallback<Schema$StoreCluster>, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        insert(params: Params$Resource$Storelayoutclusters$Insert, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        insert(callback: BodyResponseCallback<Schema$StoreCluster>): void;
        /**
         * Retrieves the details of all clusters on the specified page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Storelayoutclusters$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Storelayoutclusters$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreLayoutClustersListResponse>>;
        list(params: Params$Resource$Storelayoutclusters$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Storelayoutclusters$List, options: MethodOptions | BodyResponseCallback<Schema$StoreLayoutClustersListResponse>, callback: BodyResponseCallback<Schema$StoreLayoutClustersListResponse>): void;
        list(params: Params$Resource$Storelayoutclusters$List, callback: BodyResponseCallback<Schema$StoreLayoutClustersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$StoreLayoutClustersListResponse>): void;
        /**
         * Updates a cluster.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Storelayoutclusters$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Storelayoutclusters$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreCluster>>;
        update(params: Params$Resource$Storelayoutclusters$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Storelayoutclusters$Update, options: MethodOptions | BodyResponseCallback<Schema$StoreCluster>, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        update(params: Params$Resource$Storelayoutclusters$Update, callback: BodyResponseCallback<Schema$StoreCluster>): void;
        update(callback: BodyResponseCallback<Schema$StoreCluster>): void;
    }
    export interface Params$Resource$Storelayoutclusters$Delete extends StandardParameters {
        /**
         * The ID of the cluster.
         */
        clusterId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
    }
    export interface Params$Resource$Storelayoutclusters$Get extends StandardParameters {
        /**
         * The ID of the cluster.
         */
        clusterId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
    }
    export interface Params$Resource$Storelayoutclusters$Insert extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StoreCluster;
    }
    export interface Params$Resource$Storelayoutclusters$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
    }
    export interface Params$Resource$Storelayoutclusters$Update extends StandardParameters {
        /**
         * The ID of the cluster.
         */
        clusterId?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StoreCluster;
    }
    export class Resource$Storelayoutpages {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes a store page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Storelayoutpages$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Storelayoutpages$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Storelayoutpages$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Storelayoutpages$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Storelayoutpages$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Retrieves details of a store page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Storelayoutpages$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Storelayoutpages$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StorePage>>;
        get(params: Params$Resource$Storelayoutpages$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Storelayoutpages$Get, options: MethodOptions | BodyResponseCallback<Schema$StorePage>, callback: BodyResponseCallback<Schema$StorePage>): void;
        get(params: Params$Resource$Storelayoutpages$Get, callback: BodyResponseCallback<Schema$StorePage>): void;
        get(callback: BodyResponseCallback<Schema$StorePage>): void;
        /**
         * Inserts a new store page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Storelayoutpages$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Storelayoutpages$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StorePage>>;
        insert(params: Params$Resource$Storelayoutpages$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Storelayoutpages$Insert, options: MethodOptions | BodyResponseCallback<Schema$StorePage>, callback: BodyResponseCallback<Schema$StorePage>): void;
        insert(params: Params$Resource$Storelayoutpages$Insert, callback: BodyResponseCallback<Schema$StorePage>): void;
        insert(callback: BodyResponseCallback<Schema$StorePage>): void;
        /**
         * Retrieves the details of all pages in the store.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Storelayoutpages$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Storelayoutpages$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StoreLayoutPagesListResponse>>;
        list(params: Params$Resource$Storelayoutpages$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Storelayoutpages$List, options: MethodOptions | BodyResponseCallback<Schema$StoreLayoutPagesListResponse>, callback: BodyResponseCallback<Schema$StoreLayoutPagesListResponse>): void;
        list(params: Params$Resource$Storelayoutpages$List, callback: BodyResponseCallback<Schema$StoreLayoutPagesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$StoreLayoutPagesListResponse>): void;
        /**
         * Updates the content of a store page.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Storelayoutpages$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Storelayoutpages$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$StorePage>>;
        update(params: Params$Resource$Storelayoutpages$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Storelayoutpages$Update, options: MethodOptions | BodyResponseCallback<Schema$StorePage>, callback: BodyResponseCallback<Schema$StorePage>): void;
        update(params: Params$Resource$Storelayoutpages$Update, callback: BodyResponseCallback<Schema$StorePage>): void;
        update(callback: BodyResponseCallback<Schema$StorePage>): void;
    }
    export interface Params$Resource$Storelayoutpages$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
    }
    export interface Params$Resource$Storelayoutpages$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
    }
    export interface Params$Resource$Storelayoutpages$Insert extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StorePage;
    }
    export interface Params$Resource$Storelayoutpages$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Storelayoutpages$Update extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the page.
         */
        pageId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$StorePage;
    }
    export class Resource$Users {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deleted an EMM-managed user.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Users$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Users$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Users$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Users$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Generates an authentication token which the device policy client can use to provision the given EMM-managed user account on a device. The generated token is single-use and expires after a few minutes. You can provision a maximum of 10 devices per user. This call only works with EMM-managed accounts.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        generateAuthenticationToken(params: Params$Resource$Users$Generateauthenticationtoken, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        generateAuthenticationToken(params?: Params$Resource$Users$Generateauthenticationtoken, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$AuthenticationToken>>;
        generateAuthenticationToken(params: Params$Resource$Users$Generateauthenticationtoken, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        generateAuthenticationToken(params: Params$Resource$Users$Generateauthenticationtoken, options: MethodOptions | BodyResponseCallback<Schema$AuthenticationToken>, callback: BodyResponseCallback<Schema$AuthenticationToken>): void;
        generateAuthenticationToken(params: Params$Resource$Users$Generateauthenticationtoken, callback: BodyResponseCallback<Schema$AuthenticationToken>): void;
        generateAuthenticationToken(callback: BodyResponseCallback<Schema$AuthenticationToken>): void;
        /**
         * Retrieves a user's details.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Users$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        get(params: Params$Resource$Users$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Users$Get, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        get(params: Params$Resource$Users$Get, callback: BodyResponseCallback<Schema$User>): void;
        get(callback: BodyResponseCallback<Schema$User>): void;
        /**
         * Retrieves the set of products a user is entitled to access. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getAvailableProductSet(params: Params$Resource$Users$Getavailableproductset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getAvailableProductSet(params?: Params$Resource$Users$Getavailableproductset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductSet>>;
        getAvailableProductSet(params: Params$Resource$Users$Getavailableproductset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getAvailableProductSet(params: Params$Resource$Users$Getavailableproductset, options: MethodOptions | BodyResponseCallback<Schema$ProductSet>, callback: BodyResponseCallback<Schema$ProductSet>): void;
        getAvailableProductSet(params: Params$Resource$Users$Getavailableproductset, callback: BodyResponseCallback<Schema$ProductSet>): void;
        getAvailableProductSet(callback: BodyResponseCallback<Schema$ProductSet>): void;
        /**
         * Creates a new EMM-managed user. The Users resource passed in the body of the request should include an accountIdentifier and an accountType. If a corresponding user already exists with the same account identifier, the user will be updated with the resource. In this case only the displayName field can be changed.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Users$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        insert(params: Params$Resource$Users$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Users$Insert, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        insert(params: Params$Resource$Users$Insert, callback: BodyResponseCallback<Schema$User>): void;
        insert(callback: BodyResponseCallback<Schema$User>): void;
        /**
         * Looks up a user by primary email address. This is only supported for Google-managed users. Lookup of the id is not needed for EMM-managed users because the id is already returned in the result of the Users.insert call.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Users$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Users$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$UsersListResponse>>;
        list(params: Params$Resource$Users$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Users$List, options: MethodOptions | BodyResponseCallback<Schema$UsersListResponse>, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(params: Params$Resource$Users$List, callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        list(callback: BodyResponseCallback<Schema$UsersListResponse>): void;
        /**
         * Revokes access to all devices currently provisioned to the user. The user will no longer be able to use the managed Play store on any of their managed devices. This call only works with EMM-managed accounts.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        revokeDeviceAccess(params: Params$Resource$Users$Revokedeviceaccess, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        revokeDeviceAccess(params?: Params$Resource$Users$Revokedeviceaccess, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        revokeDeviceAccess(params: Params$Resource$Users$Revokedeviceaccess, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        revokeDeviceAccess(params: Params$Resource$Users$Revokedeviceaccess, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        revokeDeviceAccess(params: Params$Resource$Users$Revokedeviceaccess, callback: BodyResponseCallback<void>): void;
        revokeDeviceAccess(callback: BodyResponseCallback<void>): void;
        /**
         * Modifies the set of products that a user is entitled to access (referred to as *whitelisted* products). Only products that are approved or products that were previously approved (products with revoked approval) can be whitelisted. **Note:** This item has been deprecated. New integrations cannot use this method and can refer to our new recommendations.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        setAvailableProductSet(params: Params$Resource$Users$Setavailableproductset, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        setAvailableProductSet(params?: Params$Resource$Users$Setavailableproductset, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductSet>>;
        setAvailableProductSet(params: Params$Resource$Users$Setavailableproductset, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        setAvailableProductSet(params: Params$Resource$Users$Setavailableproductset, options: MethodOptions | BodyResponseCallback<Schema$ProductSet>, callback: BodyResponseCallback<Schema$ProductSet>): void;
        setAvailableProductSet(params: Params$Resource$Users$Setavailableproductset, callback: BodyResponseCallback<Schema$ProductSet>): void;
        setAvailableProductSet(callback: BodyResponseCallback<Schema$ProductSet>): void;
        /**
         * Updates the details of an EMM-managed user. Can be used with EMM-managed users only (not Google managed users). Pass the new details in the Users resource in the request body. Only the displayName field can be changed. Other fields must either be unset or have the currently active value.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Users$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Users$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$User>>;
        update(params: Params$Resource$Users$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Users$Update, options: MethodOptions | BodyResponseCallback<Schema$User>, callback: BodyResponseCallback<Schema$User>): void;
        update(params: Params$Resource$Users$Update, callback: BodyResponseCallback<Schema$User>): void;
        update(callback: BodyResponseCallback<Schema$User>): void;
    }
    export interface Params$Resource$Users$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Generateauthenticationtoken extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Getavailableproductset extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Insert extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export interface Params$Resource$Users$List extends StandardParameters {
        /**
         * Required. The exact primary email address of the user to look up.
         */
        email?: string;
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Users$Revokedeviceaccess extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
    }
    export interface Params$Resource$Users$Setavailableproductset extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ProductSet;
    }
    export interface Params$Resource$Users$Update extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the user.
         */
        userId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$User;
    }
    export class Resource$Webapps {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Deletes an existing web app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Webapps$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Webapps$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Webapps$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Webapps$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Webapps$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Gets an existing web app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Webapps$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Webapps$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WebApp>>;
        get(params: Params$Resource$Webapps$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Webapps$Get, options: MethodOptions | BodyResponseCallback<Schema$WebApp>, callback: BodyResponseCallback<Schema$WebApp>): void;
        get(params: Params$Resource$Webapps$Get, callback: BodyResponseCallback<Schema$WebApp>): void;
        get(callback: BodyResponseCallback<Schema$WebApp>): void;
        /**
         * Creates a new web app for the enterprise.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Webapps$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Webapps$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WebApp>>;
        insert(params: Params$Resource$Webapps$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Webapps$Insert, options: MethodOptions | BodyResponseCallback<Schema$WebApp>, callback: BodyResponseCallback<Schema$WebApp>): void;
        insert(params: Params$Resource$Webapps$Insert, callback: BodyResponseCallback<Schema$WebApp>): void;
        insert(callback: BodyResponseCallback<Schema$WebApp>): void;
        /**
         * Retrieves the details of all web apps for a given enterprise.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Webapps$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Webapps$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WebAppsListResponse>>;
        list(params: Params$Resource$Webapps$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Webapps$List, options: MethodOptions | BodyResponseCallback<Schema$WebAppsListResponse>, callback: BodyResponseCallback<Schema$WebAppsListResponse>): void;
        list(params: Params$Resource$Webapps$List, callback: BodyResponseCallback<Schema$WebAppsListResponse>): void;
        list(callback: BodyResponseCallback<Schema$WebAppsListResponse>): void;
        /**
         * Updates an existing web app.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Webapps$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Webapps$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$WebApp>>;
        update(params: Params$Resource$Webapps$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Webapps$Update, options: MethodOptions | BodyResponseCallback<Schema$WebApp>, callback: BodyResponseCallback<Schema$WebApp>): void;
        update(params: Params$Resource$Webapps$Update, callback: BodyResponseCallback<Schema$WebApp>): void;
        update(callback: BodyResponseCallback<Schema$WebApp>): void;
    }
    export interface Params$Resource$Webapps$Delete extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the web app.
         */
        webAppId?: string;
    }
    export interface Params$Resource$Webapps$Get extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the web app.
         */
        webAppId?: string;
    }
    export interface Params$Resource$Webapps$Insert extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WebApp;
    }
    export interface Params$Resource$Webapps$List extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
    }
    export interface Params$Resource$Webapps$Update extends StandardParameters {
        /**
         * The ID of the enterprise.
         */
        enterpriseId?: string;
        /**
         * The ID of the web app.
         */
        webAppId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$WebApp;
    }
    export {};
}
