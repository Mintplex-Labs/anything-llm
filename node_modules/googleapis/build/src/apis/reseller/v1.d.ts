import { OAuth2Client, JWT, Compute, UserRefreshClient, BaseExternalAccountClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace reseller_v1 {
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
     * Google Workspace Reseller API
     *
     * Perform common functions that are available on the Channel Services console at scale, like placing orders and viewing customer information
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const reseller = google.reseller('v1');
     * ```
     */
    export class Reseller {
        context: APIRequestContext;
        customers: Resource$Customers;
        resellernotify: Resource$Resellernotify;
        subscriptions: Resource$Subscriptions;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * JSON template for address of a customer.
     */
    export interface Schema$Address {
        /**
         * A customer's physical address. An address can be composed of one to three lines. The `addressline2` and `addressLine3` are optional.
         */
        addressLine1?: string | null;
        /**
         * Line 2 of the address.
         */
        addressLine2?: string | null;
        /**
         * Line 3 of the address.
         */
        addressLine3?: string | null;
        /**
         * The customer contact's name. This is required.
         */
        contactName?: string | null;
        /**
         * For `countryCode` information, see the ISO 3166 country code elements. Verify that country is approved for resale of Google products. This property is required when creating a new customer.
         */
        countryCode?: string | null;
        /**
         * Identifies the resource as a customer address. Value: `customers#address`
         */
        kind?: string | null;
        /**
         * An example of a `locality` value is the city of `San Francisco`.
         */
        locality?: string | null;
        /**
         * The company or company division name. This is required.
         */
        organizationName?: string | null;
        /**
         * A `postalCode` example is a postal zip code such as `94043`. This property is required when creating a new customer.
         */
        postalCode?: string | null;
        /**
         * An example of a `region` value is `CA` for the state of California.
         */
        region?: string | null;
    }
    /**
     * JSON template for the ChangePlan rpc request.
     */
    export interface Schema$ChangePlanRequest {
        /**
         * Google-issued code (100 char max) for discounted pricing on subscription plans. Deal code must be included in `changePlan` request in order to receive discounted rate. This property is optional. If a deal code has already been added to a subscription, this property may be left empty and the existing discounted rate will still apply (if not empty, only provide the deal code that is already present on the subscription). If a deal code has never been added to a subscription and this property is left blank, regular pricing will apply.
         */
        dealCode?: string | null;
        /**
         * Identifies the resource as a subscription change plan request. Value: `subscriptions#changePlanRequest`
         */
        kind?: string | null;
        /**
         * The `planName` property is required. This is the name of the subscription's payment plan. For more information about the Google payment plans, see API concepts. Possible values are: - `ANNUAL_MONTHLY_PAY` - The annual commitment plan with monthly payments *Caution: *`ANNUAL_MONTHLY_PAY` is returned as `ANNUAL` in all API responses. - `ANNUAL_YEARLY_PAY` - The annual commitment plan with yearly payments - `FLEXIBLE` - The flexible plan - `TRIAL` - The 30-day free trial plan
         */
        planName?: string | null;
        /**
         * This is an optional property. This purchase order (PO) information is for resellers to use for their company tracking usage. If a `purchaseOrderId` value is given it appears in the API responses and shows up in the invoice. The property accepts up to 80 plain text characters.
         */
        purchaseOrderId?: string | null;
        /**
         * This is a required property. The seats property is the number of user seat licenses.
         */
        seats?: Schema$Seats;
    }
    /**
     * When a Google customer's account is registered with a reseller, the customer's subscriptions for Google services are managed by this reseller. A customer is described by a primary domain name and a physical address.
     */
    export interface Schema$Customer {
        /**
         * Like the "Customer email" in the reseller tools, this email is the secondary contact used if something happens to the customer's service such as service outage or a security issue. This property is required when creating a new "domain" customer and should not use the same domain as `customerDomain`. The `alternateEmail` field is not necessary to create a "team" customer.
         */
        alternateEmail?: string | null;
        /**
         * The customer's primary domain name string. `customerDomain` is required when creating a new customer. Do not include the `www` prefix in the domain when adding a customer.
         */
        customerDomain?: string | null;
        /**
         * Whether the customer's primary domain has been verified.
         */
        customerDomainVerified?: boolean | null;
        /**
         * This property will always be returned in a response as the unique identifier generated by Google. In a request, this property can be either the primary domain or the unique identifier generated by Google.
         */
        customerId?: string | null;
        /**
         * Identifies the type of the customer. Acceptable values include: * `domain`: Implies a domain-verified customer (default). * `team`: Implies an email-verified customer. For more information, see [managed teams](https://support.google.com/a/users/answer/9939479).
         */
        customerType?: string | null;
        /**
         * Identifies the resource as a customer. Value: `reseller#customer`
         */
        kind?: string | null;
        /**
         * Customer contact phone number. Must start with "+" followed by the country code. The rest of the number can be contiguous numbers or respect the phone local format conventions, but it must be a real phone number and not, for example, "123". This field is silently ignored if invalid.
         */
        phoneNumber?: string | null;
        /**
         * A customer's address information. Each field has a limit of 255 charcters.
         */
        postalAddress?: Schema$Address;
        /**
         * The first admin details of the customer, present in case of TEAM customer.
         */
        primaryAdmin?: Schema$PrimaryAdmin;
        /**
         * URL to customer's Admin console dashboard. The read-only URL is generated by the API service. This is used if your client application requires the customer to complete a task in the Admin console.
         */
        resourceUiUrl?: string | null;
    }
    /**
     * JSON template for primary admin in case of TEAM customers
     */
    export interface Schema$PrimaryAdmin {
        /**
         * The business email of the primary administrator of the customer. The email verification link is sent to this email address at the time of customer creation. Primary administrators have access to the customer's Admin Console, including the ability to invite and evict users and manage the administrative needs of the customer.
         */
        primaryEmail?: string | null;
    }
    /**
     * JSON template for a subscription renewal settings.
     */
    export interface Schema$RenewalSettings {
        /**
         * Identifies the resource as a subscription renewal setting. Value: `subscriptions#renewalSettings`
         */
        kind?: string | null;
        /**
         * Renewal settings for the annual commitment plan. For more detailed information, see renewal options in the administrator help center. When renewing a subscription, the `renewalType` is a required property.
         */
        renewalType?: string | null;
    }
    /**
     * JSON template for resellernotify getwatchdetails response.
     */
    export interface Schema$ResellernotifyGetwatchdetailsResponse {
        /**
         * List of registered service accounts.
         */
        serviceAccountEmailAddresses?: string[] | null;
        /**
         * Topic name of the PubSub
         */
        topicName?: string | null;
    }
    /**
     * JSON template for resellernotify response.
     */
    export interface Schema$ResellernotifyResource {
        /**
         * Topic name of the PubSub
         */
        topicName?: string | null;
    }
    /**
     * JSON template for subscription seats.
     */
    export interface Schema$Seats {
        /**
         * Identifies the resource as a subscription seat setting. Value: `subscriptions#seats`
         */
        kind?: string | null;
        /**
         * Read-only field containing the current number of users that are assigned a license for the product defined in `skuId`. This field's value is equivalent to the numerical count of users returned by the Enterprise License Manager API method: [`listForProductAndSku`](https://developers.google.com/workspace/admin/licensing/v1/reference/licenseAssignments/listForProductAndSku).
         */
        licensedNumberOfSeats?: number | null;
        /**
         * This is a required property and is exclusive to subscriptions with `FLEXIBLE` or `TRIAL` plans. This property sets the maximum number of licensed users allowed on a subscription. This quantity can be increased up to the maximum limit defined in the reseller's contract. The minimum quantity is the current number of users in the customer account. *Note: *G Suite subscriptions automatically assign a license to every user.
         */
        maximumNumberOfSeats?: number | null;
        /**
         * This is a required property and is exclusive to subscriptions with `ANNUAL_MONTHLY_PAY` and `ANNUAL_YEARLY_PAY` plans. This property sets the maximum number of licenses assignable to users on a subscription. The reseller can add more licenses, but once set, the `numberOfSeats` cannot be reduced until renewal. The reseller is invoiced based on the `numberOfSeats` value regardless of how many of these user licenses are assigned. *Note: *Google Workspace subscriptions automatically assign a license to every user.
         */
        numberOfSeats?: number | null;
    }
    /**
     * JSON template for a subscription.
     */
    export interface Schema$Subscription {
        /**
         * Read-only field that returns the current billing method for a subscription.
         */
        billingMethod?: string | null;
        /**
         * The `creationTime` property is the date when subscription was created. It is in milliseconds using the Epoch format. See an example Epoch converter.
         */
        creationTime?: string | null;
        /**
         * Primary domain name of the customer
         */
        customerDomain?: string | null;
        /**
         * This property will always be returned in a response as the unique identifier generated by Google. In a request, this property can be either the primary domain or the unique identifier generated by Google.
         */
        customerId?: string | null;
        /**
         * Google-issued code (100 char max) for discounted pricing on subscription plans. Deal code must be included in `insert` requests in order to receive discounted rate. This property is optional, regular pricing applies if left empty.
         */
        dealCode?: string | null;
        /**
         * Identifies the resource as a Subscription. Value: `reseller#subscription`
         */
        kind?: string | null;
        /**
         * The `plan` property is required. In this version of the API, the G Suite plans are the flexible plan, annual commitment plan, and the 30-day free trial plan. For more information about the API"s payment plans, see the API concepts.
         */
        plan?: {
            commitmentInterval?: {
                endTime?: string;
                startTime?: string;
            };
            isCommitmentPlan?: boolean;
            planName?: string;
        } | null;
        /**
         * This is an optional property. This purchase order (PO) information is for resellers to use for their company tracking usage. If a `purchaseOrderId` value is given it appears in the API responses and shows up in the invoice. The property accepts up to 80 plain text characters.
         */
        purchaseOrderId?: string | null;
        /**
         * Renewal settings for the annual commitment plan. For more detailed information, see renewal options in the administrator help center.
         */
        renewalSettings?: Schema$RenewalSettings;
        /**
         * URL to customer's Subscriptions page in the Admin console. The read-only URL is generated by the API service. This is used if your client application requires the customer to complete a task using the Subscriptions page in the Admin console.
         */
        resourceUiUrl?: string | null;
        /**
         * This is a required property. The number and limit of user seat licenses in the plan.
         */
        seats?: Schema$Seats;
        /**
         * A required property. The `skuId` is a unique system identifier for a product's SKU assigned to a customer in the subscription. For products and SKUs available in this version of the API, see Product and SKU IDs.
         */
        skuId?: string | null;
        /**
         * Read-only external display name for a product's SKU assigned to a customer in the subscription. SKU names are subject to change at Google's discretion. For products and SKUs available in this version of the API, see Product and SKU IDs.
         */
        skuName?: string | null;
        /**
         * This is an optional property.
         */
        status?: string | null;
        /**
         * The `subscriptionId` is the subscription identifier and is unique for each customer. This is a required property. Since a `subscriptionId` changes when a subscription is updated, we recommend not using this ID as a key for persistent data. Use the `subscriptionId` as described in retrieve all reseller subscriptions.
         */
        subscriptionId?: string | null;
        /**
         * Read-only field containing an enumerable of all the current suspension reasons for a subscription. It is possible for a subscription to have many concurrent, overlapping suspension reasons. A subscription's `STATUS` is `SUSPENDED` until all pending suspensions are removed. Possible options include: - `PENDING_TOS_ACCEPTANCE` - The customer has not logged in and accepted the G Suite Resold Terms of Services. - `RENEWAL_WITH_TYPE_CANCEL` - The customer's commitment ended and their service was cancelled at the end of their term. - `RESELLER_INITIATED` - A manual suspension invoked by a Reseller. - `TRIAL_ENDED` - The customer's trial expired without a plan selected. - `OTHER` - The customer is suspended for an internal Google reason (e.g. abuse or otherwise).
         */
        suspensionReasons?: string[] | null;
        /**
         * Read-only transfer related information for the subscription. For more information, see retrieve transferable subscriptions for a customer.
         */
        transferInfo?: {
            currentLegacySkuId?: string;
            minimumTransferableSeats?: number;
            transferabilityExpirationTime?: string;
        } | null;
        /**
         * The G Suite annual commitment and flexible payment plans can be in a 30-day free trial. For more information, see the API concepts.
         */
        trialSettings?: {
            isInTrial?: boolean;
            trialEndTime?: string;
        } | null;
    }
    /**
     * A subscription manages the relationship of a Google customer's payment plan with a product's SKU, user licenses, 30-day free trial status, and renewal options. A primary role of a reseller is to manage the Google customer's subscriptions.
     */
    export interface Schema$Subscriptions {
        /**
         * Identifies the resource as a collection of subscriptions. Value: reseller#subscriptions
         */
        kind?: string | null;
        /**
         * The continuation token, used to page through large result sets. Provide this value in a subsequent request to return the next page of results.
         */
        nextPageToken?: string | null;
        /**
         * The subscriptions in this page of results.
         */
        subscriptions?: Schema$Subscription[];
    }
    export class Resource$Customers {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Gets a customer account. Use this operation to see a customer account already in your reseller management, or to see the minimal account information for an existing customer that you do not manage. For more information about the API response for existing customers, see [retrieving a customer account](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_customers#get_customer).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Customers$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Customers$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Customer>>;
        get(params: Params$Resource$Customers$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Customers$Get, options: MethodOptions | BodyResponseCallback<Schema$Customer>, callback: BodyResponseCallback<Schema$Customer>): void;
        get(params: Params$Resource$Customers$Get, callback: BodyResponseCallback<Schema$Customer>): void;
        get(callback: BodyResponseCallback<Schema$Customer>): void;
        /**
         * Orders a new customer's account. Before ordering a new customer account, establish whether the customer account already exists using the [`customers.get`](https://developers.google.com/workspace/admin/reseller/v1/reference/customers/get) If the customer account exists as a direct Google account or as a resold customer account from another reseller, use the `customerAuthToken\` as described in [order a resold account for an existing customer](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_customers#create_existing_customer). For more information about ordering a new customer account, see [order a new customer account](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_customers#create_customer). After creating a new customer account, you must provision a user as an administrator. The customer's administrator is required to sign in to the Admin console and sign the G Suite via Reseller agreement to activate the account. Resellers are prohibited from signing the G Suite via Reseller agreement on the customer's behalf. For more information, see [order a new customer account](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_customers#tos).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Customers$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Customers$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Customer>>;
        insert(params: Params$Resource$Customers$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Customers$Insert, options: MethodOptions | BodyResponseCallback<Schema$Customer>, callback: BodyResponseCallback<Schema$Customer>): void;
        insert(params: Params$Resource$Customers$Insert, callback: BodyResponseCallback<Schema$Customer>): void;
        insert(callback: BodyResponseCallback<Schema$Customer>): void;
        /**
         * Updates a customer account's settings. This method supports patch semantics. You cannot update `customerType` via the Reseller API, but a `"team"` customer can verify their domain and become `customerType = "domain"`. For more information, see [Verify your domain to unlock Essentials features](https://support.google.com/a/answer/9122284).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        patch(params: Params$Resource$Customers$Patch, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        patch(params?: Params$Resource$Customers$Patch, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Customer>>;
        patch(params: Params$Resource$Customers$Patch, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        patch(params: Params$Resource$Customers$Patch, options: MethodOptions | BodyResponseCallback<Schema$Customer>, callback: BodyResponseCallback<Schema$Customer>): void;
        patch(params: Params$Resource$Customers$Patch, callback: BodyResponseCallback<Schema$Customer>): void;
        patch(callback: BodyResponseCallback<Schema$Customer>): void;
        /**
         * Updates a customer account's settings. You cannot update `customerType` via the Reseller API, but a `"team"` customer can verify their domain and become `customerType = "domain"`. For more information, see [update a customer's settings](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_customers#update_customer).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        update(params: Params$Resource$Customers$Update, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        update(params?: Params$Resource$Customers$Update, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Customer>>;
        update(params: Params$Resource$Customers$Update, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        update(params: Params$Resource$Customers$Update, options: MethodOptions | BodyResponseCallback<Schema$Customer>, callback: BodyResponseCallback<Schema$Customer>): void;
        update(params: Params$Resource$Customers$Update, callback: BodyResponseCallback<Schema$Customer>): void;
        update(callback: BodyResponseCallback<Schema$Customer>): void;
    }
    export interface Params$Resource$Customers$Get extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
    }
    export interface Params$Resource$Customers$Insert extends StandardParameters {
        /**
         * The `customerAuthToken` query string is required when creating a resold account that transfers a direct customer's subscription or transfers another reseller customer's subscription to your reseller management. This is a hexadecimal authentication token needed to complete the subscription transfer. For more information, see the administrator help center.
         */
        customerAuthToken?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Customer;
    }
    export interface Params$Resource$Customers$Patch extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Customer;
    }
    export interface Params$Resource$Customers$Update extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Customer;
    }
    export class Resource$Resellernotify {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Returns all the details of the watch corresponding to the reseller.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        getwatchdetails(params: Params$Resource$Resellernotify$Getwatchdetails, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        getwatchdetails(params?: Params$Resource$Resellernotify$Getwatchdetails, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResellernotifyGetwatchdetailsResponse>>;
        getwatchdetails(params: Params$Resource$Resellernotify$Getwatchdetails, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        getwatchdetails(params: Params$Resource$Resellernotify$Getwatchdetails, options: MethodOptions | BodyResponseCallback<Schema$ResellernotifyGetwatchdetailsResponse>, callback: BodyResponseCallback<Schema$ResellernotifyGetwatchdetailsResponse>): void;
        getwatchdetails(params: Params$Resource$Resellernotify$Getwatchdetails, callback: BodyResponseCallback<Schema$ResellernotifyGetwatchdetailsResponse>): void;
        getwatchdetails(callback: BodyResponseCallback<Schema$ResellernotifyGetwatchdetailsResponse>): void;
        /**
         * Registers a Reseller for receiving notifications.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        register(params: Params$Resource$Resellernotify$Register, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        register(params?: Params$Resource$Resellernotify$Register, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResellernotifyResource>>;
        register(params: Params$Resource$Resellernotify$Register, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        register(params: Params$Resource$Resellernotify$Register, options: MethodOptions | BodyResponseCallback<Schema$ResellernotifyResource>, callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
        register(params: Params$Resource$Resellernotify$Register, callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
        register(callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
        /**
         * Unregisters a Reseller for receiving notifications.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        unregister(params: Params$Resource$Resellernotify$Unregister, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        unregister(params?: Params$Resource$Resellernotify$Unregister, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ResellernotifyResource>>;
        unregister(params: Params$Resource$Resellernotify$Unregister, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        unregister(params: Params$Resource$Resellernotify$Unregister, options: MethodOptions | BodyResponseCallback<Schema$ResellernotifyResource>, callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
        unregister(params: Params$Resource$Resellernotify$Unregister, callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
        unregister(callback: BodyResponseCallback<Schema$ResellernotifyResource>): void;
    }
    export interface Params$Resource$Resellernotify$Getwatchdetails extends StandardParameters {
    }
    export interface Params$Resource$Resellernotify$Register extends StandardParameters {
        /**
         * The service account which will own the created Cloud-PubSub topic.
         */
        serviceAccountEmailAddress?: string;
    }
    export interface Params$Resource$Resellernotify$Unregister extends StandardParameters {
        /**
         * The service account which owns the Cloud-PubSub topic.
         */
        serviceAccountEmailAddress?: string;
    }
    export class Resource$Subscriptions {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * Activates a subscription previously suspended by the reseller. If you did not suspend the customer subscription and it is suspended for any other reason, such as for abuse or a pending ToS acceptance, this call will not reactivate the customer subscription.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        activate(params: Params$Resource$Subscriptions$Activate, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        activate(params?: Params$Resource$Subscriptions$Activate, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        activate(params: Params$Resource$Subscriptions$Activate, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        activate(params: Params$Resource$Subscriptions$Activate, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        activate(params: Params$Resource$Subscriptions$Activate, callback: BodyResponseCallback<Schema$Subscription>): void;
        activate(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Updates a subscription plan. Use this method to update a plan for a 30-day trial or a flexible plan subscription to an annual commitment plan with monthly or yearly payments. How a plan is updated differs depending on the plan and the products. For more information, see the description in [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#update_subscription_plan).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changePlan(params: Params$Resource$Subscriptions$Changeplan, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changePlan(params?: Params$Resource$Subscriptions$Changeplan, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        changePlan(params: Params$Resource$Subscriptions$Changeplan, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changePlan(params: Params$Resource$Subscriptions$Changeplan, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        changePlan(params: Params$Resource$Subscriptions$Changeplan, callback: BodyResponseCallback<Schema$Subscription>): void;
        changePlan(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Updates a user license's renewal settings. This is applicable for accounts with annual commitment plans only. For more information, see the description in [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#update_renewal).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changeRenewalSettings(params: Params$Resource$Subscriptions$Changerenewalsettings, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changeRenewalSettings(params?: Params$Resource$Subscriptions$Changerenewalsettings, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        changeRenewalSettings(params: Params$Resource$Subscriptions$Changerenewalsettings, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changeRenewalSettings(params: Params$Resource$Subscriptions$Changerenewalsettings, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        changeRenewalSettings(params: Params$Resource$Subscriptions$Changerenewalsettings, callback: BodyResponseCallback<Schema$Subscription>): void;
        changeRenewalSettings(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Updates a subscription's user license settings. For more information about updating an annual commitment plan or a flexible plan subscription’s licenses, see [Manage Subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#update_subscription_seat).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        changeSeats(params: Params$Resource$Subscriptions$Changeseats, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        changeSeats(params?: Params$Resource$Subscriptions$Changeseats, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        changeSeats(params: Params$Resource$Subscriptions$Changeseats, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        changeSeats(params: Params$Resource$Subscriptions$Changeseats, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        changeSeats(params: Params$Resource$Subscriptions$Changeseats, callback: BodyResponseCallback<Schema$Subscription>): void;
        changeSeats(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Cancels, suspends, or transfers a subscription to direct.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        delete(params: Params$Resource$Subscriptions$Delete, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        delete(params?: Params$Resource$Subscriptions$Delete, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<void>>;
        delete(params: Params$Resource$Subscriptions$Delete, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        delete(params: Params$Resource$Subscriptions$Delete, options: MethodOptions | BodyResponseCallback<void>, callback: BodyResponseCallback<void>): void;
        delete(params: Params$Resource$Subscriptions$Delete, callback: BodyResponseCallback<void>): void;
        delete(callback: BodyResponseCallback<void>): void;
        /**
         * Gets a specific subscription. The `subscriptionId` can be found using the [Retrieve all reseller subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#get_all_subscriptions) method. For more information about retrieving a specific subscription, see the information descrived in [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#get_subscription).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        get(params: Params$Resource$Subscriptions$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Subscriptions$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        get(params: Params$Resource$Subscriptions$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Subscriptions$Get, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        get(params: Params$Resource$Subscriptions$Get, callback: BodyResponseCallback<Schema$Subscription>): void;
        get(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Creates or transfer a subscription. Create a subscription for a customer's account that you ordered using the [Order a new customer account](https://developers.google.com/workspace/admin/reseller/v1/reference/customers/insert.html) method. For more information about creating a subscription for different payment plans, see [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#create_subscription).\ If you did not order the customer's account using the customer insert method, use the customer's `customerAuthToken` when creating a subscription for that customer. If transferring a G Suite subscription with an associated Google Drive or Google Vault subscription, use the [batch operation](https://developers.google.com/workspace/admin/reseller/v1/how-tos/batch.html) to transfer all of these subscriptions. For more information, see how to [transfer subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#transfer_a_subscription).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        insert(params: Params$Resource$Subscriptions$Insert, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        insert(params?: Params$Resource$Subscriptions$Insert, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        insert(params: Params$Resource$Subscriptions$Insert, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        insert(params: Params$Resource$Subscriptions$Insert, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        insert(params: Params$Resource$Subscriptions$Insert, callback: BodyResponseCallback<Schema$Subscription>): void;
        insert(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Lists of subscriptions managed by the reseller. The list can be all subscriptions, all of a customer's subscriptions, or all of a customer's transferable subscriptions. Optionally, this method can filter the response by a `customerNamePrefix`. For more information, see [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        list(params: Params$Resource$Subscriptions$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Subscriptions$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscriptions>>;
        list(params: Params$Resource$Subscriptions$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Subscriptions$List, options: MethodOptions | BodyResponseCallback<Schema$Subscriptions>, callback: BodyResponseCallback<Schema$Subscriptions>): void;
        list(params: Params$Resource$Subscriptions$List, callback: BodyResponseCallback<Schema$Subscriptions>): void;
        list(callback: BodyResponseCallback<Schema$Subscriptions>): void;
        /**
         * Immediately move a 30-day free trial subscription to a paid service subscription. This method is only applicable if a payment plan has already been set up for the 30-day trial subscription. For more information, see [manage subscriptions](https://developers.google.com/workspace/admin/reseller/v1/how-tos/manage_subscriptions#paid_service).
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        startPaidService(params: Params$Resource$Subscriptions$Startpaidservice, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        startPaidService(params?: Params$Resource$Subscriptions$Startpaidservice, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        startPaidService(params: Params$Resource$Subscriptions$Startpaidservice, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        startPaidService(params: Params$Resource$Subscriptions$Startpaidservice, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        startPaidService(params: Params$Resource$Subscriptions$Startpaidservice, callback: BodyResponseCallback<Schema$Subscription>): void;
        startPaidService(callback: BodyResponseCallback<Schema$Subscription>): void;
        /**
         * Suspends an active subscription. You can use this method to suspend a paid subscription that is currently in the `ACTIVE` state. * For `FLEXIBLE` subscriptions, billing is paused. * For `ANNUAL_MONTHLY_PAY` or `ANNUAL_YEARLY_PAY` subscriptions: * Suspending the subscription does not change the renewal date that was originally committed to. * A suspended subscription does not renew. If you activate the subscription after the original renewal date, a new annual subscription will be created, starting on the day of activation. We strongly encourage you to suspend subscriptions only for short periods of time as suspensions over 60 days may result in the subscription being cancelled.
         *
         * @param params - Parameters for request
         * @param options - Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param callback - Optional callback that handles the response.
         * @returns A promise if used with async/await, or void if used with a callback.
         */
        suspend(params: Params$Resource$Subscriptions$Suspend, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        suspend(params?: Params$Resource$Subscriptions$Suspend, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$Subscription>>;
        suspend(params: Params$Resource$Subscriptions$Suspend, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        suspend(params: Params$Resource$Subscriptions$Suspend, options: MethodOptions | BodyResponseCallback<Schema$Subscription>, callback: BodyResponseCallback<Schema$Subscription>): void;
        suspend(params: Params$Resource$Subscriptions$Suspend, callback: BodyResponseCallback<Schema$Subscription>): void;
        suspend(callback: BodyResponseCallback<Schema$Subscription>): void;
    }
    export interface Params$Resource$Subscriptions$Activate extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
    }
    export interface Params$Resource$Subscriptions$Changeplan extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$ChangePlanRequest;
    }
    export interface Params$Resource$Subscriptions$Changerenewalsettings extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$RenewalSettings;
    }
    export interface Params$Resource$Subscriptions$Changeseats extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Seats;
    }
    export interface Params$Resource$Subscriptions$Delete extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * The `deletionType` query string enables the cancellation, downgrade, or suspension of a subscription.
         */
        deletionType?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
    }
    export interface Params$Resource$Subscriptions$Get extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
    }
    export interface Params$Resource$Subscriptions$Insert extends StandardParameters {
        /**
         * The intented insert action. Advised to set this when the customer already has a subscription for a different SKU in the same product.
         */
        action?: string;
        /**
         * The `customerAuthToken` query string is required when creating a resold account that transfers a direct customer's subscription or transfers another reseller customer's subscription to your reseller management. This is a hexadecimal authentication token needed to complete the subscription transfer. For more information, see the administrator help center.
         */
        customerAuthToken?: string;
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * The sku_id of the existing subscription to be upgraded or downgraded. This is required when action is SWITCH.
         */
        sourceSkuId?: string;
        /**
         * Request body metadata
         */
        requestBody?: Schema$Subscription;
    }
    export interface Params$Resource$Subscriptions$List extends StandardParameters {
        /**
         * The `customerAuthToken` query string is required when creating a resold account that transfers a direct customer's subscription or transfers another reseller customer's subscription to your reseller management. This is a hexadecimal authentication token needed to complete the subscription transfer. For more information, see the administrator help center.
         */
        customerAuthToken?: string;
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * When retrieving all of your subscriptions and filtering for specific customers, you can enter a prefix for a customer name. Using an example customer group that includes `exam.com`, `example20.com` and `example.com`: - `exa` -- Returns all customer names that start with 'exa' which could include `exam.com`, `example20.com`, and `example.com`. A name prefix is similar to using a regular expression's asterisk, exa*. - `example` -- Returns `example20.com` and `example.com`.
         */
        customerNamePrefix?: string;
        /**
         * When retrieving a large list, the `maxResults` is the maximum number of results per page. The `nextPageToken` value takes you to the next page. The default is 20.
         */
        maxResults?: number;
        /**
         * Token to specify next page in the list
         */
        pageToken?: string;
    }
    export interface Params$Resource$Subscriptions$Startpaidservice extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
    }
    export interface Params$Resource$Subscriptions$Suspend extends StandardParameters {
        /**
         * This can be either the customer's primary domain name or the customer's unique identifier. If the domain name for a customer changes, the old domain name cannot be used to access the customer, but the customer's unique identifier (as returned by the API) can always be used. We recommend storing the unique identifier in your systems where applicable.
         */
        customerId?: string;
        /**
         * This is a required property. The `subscriptionId` is the subscription identifier and is unique for each customer. Since a `subscriptionId` changes when a subscription is updated, we recommend to not use this ID as a key for persistent data. And the `subscriptionId` can be found using the retrieve all reseller subscriptions method.
         */
        subscriptionId?: string;
    }
    export {};
}
