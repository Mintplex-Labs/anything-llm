import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace androidpublisher_v2 {
    export interface Options extends GlobalOptions {
        version: 'v2';
    }
    interface StandardParameters {
        /**
         * Auth client or API Key for the request
         */
        auth?: string | OAuth2Client | JWT | Compute | UserRefreshClient | GoogleAuth;
        /**
         * Data format for the response.
         */
        alt?: string;
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
         * An opaque string that represents a user for quota purposes. Must not exceed 40 characters.
         */
        quotaUser?: string;
        /**
         * Deprecated. Please use quotaUser instead.
         */
        userIp?: string;
    }
    /**
     * Google Play Developer API
     *
     * Accesses Android application developers&#39; Google Play accounts.
     *
     * @example
     * const {google} = require('googleapis');
     * const androidpublisher = google.androidpublisher('v2');
     *
     * @namespace androidpublisher
     * @type {Function}
     * @version v2
     * @variation v2
     * @param {object=} options Options for Androidpublisher
     */
    export class Androidpublisher {
        context: APIRequestContext;
        purchases: Resource$Purchases;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    export interface Schema$PageInfo {
        resultPerPage?: number | null;
        startIndex?: number | null;
        totalResults?: number | null;
    }
    /**
     * A ProductPurchase resource indicates the status of a user&#39;s inapp product purchase.
     */
    export interface Schema$ProductPurchase {
        /**
         * The consumption state of the inapp product. Possible values are:   - Yet to be consumed  - Consumed
         */
        consumptionState?: number | null;
        /**
         * A developer-specified string that contains supplemental information about an order.
         */
        developerPayload?: string | null;
        /**
         * This kind represents an inappPurchase object in the androidpublisher service.
         */
        kind?: string | null;
        /**
         * The order id associated with the purchase of the inapp product.
         */
        orderId?: string | null;
        /**
         * The purchase state of the order. Possible values are:   - Purchased  - Canceled  - Pending
         */
        purchaseState?: number | null;
        /**
         * The time the product was purchased, in milliseconds since the epoch (Jan 1, 1970).
         */
        purchaseTimeMillis?: string | null;
        /**
         * The type of purchase of the inapp product. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are:   - Test (i.e. purchased from a license testing account)  - Promo (i.e. purchased using a promo code)  - Rewarded (i.e. from watching a video ad instead of paying)
         */
        purchaseType?: number | null;
    }
    export interface Schema$TokenPagination {
        nextPageToken?: string | null;
        previousPageToken?: string | null;
    }
    /**
     * A VoidedPurchase resource indicates a purchase that was either canceled/refunded/charged-back.
     */
    export interface Schema$VoidedPurchase {
        /**
         * This kind represents a voided purchase object in the androidpublisher service.
         */
        kind?: string | null;
        /**
         * The time at which the purchase was made, in milliseconds since the epoch (Jan 1, 1970).
         */
        purchaseTimeMillis?: string | null;
        /**
         * The token which uniquely identifies a one-time purchase or subscription. To uniquely identify subscription renewals use order_id (available starting from version 3 of the API).
         */
        purchaseToken?: string | null;
        /**
         * The time at which the purchase was canceled/refunded/charged-back, in milliseconds since the epoch (Jan 1, 1970).
         */
        voidedTimeMillis?: string | null;
    }
    export interface Schema$VoidedPurchasesListResponse {
        pageInfo?: Schema$PageInfo;
        tokenPagination?: Schema$TokenPagination;
        voidedPurchases?: Schema$VoidedPurchase[];
    }
    export class Resource$Purchases {
        context: APIRequestContext;
        products: Resource$Purchases$Products;
        voidedpurchases: Resource$Purchases$Voidedpurchases;
        constructor(context: APIRequestContext);
    }
    export class Resource$Purchases$Products {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * androidpublisher.purchases.products.get
         * @desc Checks the purchase and consumption status of an inapp item.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/androidpublisher.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const androidpublisher = google.androidpublisher('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/androidpublisher'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await androidpublisher.purchases.products.get({
         *     // The package name of the application the inapp product was sold in (for example, 'com.some.thing').
         *     packageName: 'placeholder-value',
         *     // The inapp product SKU (for example, 'com.some.thing.inapp1').
         *     productId: 'placeholder-value',
         *     // The token provided to the user's device when the inapp product was purchased.
         *     token: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "consumptionState": 0,
         *   //   "developerPayload": "my_developerPayload",
         *   //   "kind": "my_kind",
         *   //   "orderId": "my_orderId",
         *   //   "purchaseState": 0,
         *   //   "purchaseTimeMillis": "my_purchaseTimeMillis",
         *   //   "purchaseType": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias androidpublisher.purchases.products.get
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string} params.packageName The package name of the application the inapp product was sold in (for example, 'com.some.thing').
         * @param {string} params.productId The inapp product SKU (for example, 'com.some.thing.inapp1').
         * @param {string} params.token The token provided to the user's device when the inapp product was purchased.
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        get(params: Params$Resource$Purchases$Products$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Purchases$Products$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$ProductPurchase>>;
        get(params: Params$Resource$Purchases$Products$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Purchases$Products$Get, options: MethodOptions | BodyResponseCallback<Schema$ProductPurchase>, callback: BodyResponseCallback<Schema$ProductPurchase>): void;
        get(params: Params$Resource$Purchases$Products$Get, callback: BodyResponseCallback<Schema$ProductPurchase>): void;
        get(callback: BodyResponseCallback<Schema$ProductPurchase>): void;
    }
    export interface Params$Resource$Purchases$Products$Get extends StandardParameters {
        /**
         * The package name of the application the inapp product was sold in (for example, 'com.some.thing').
         */
        packageName?: string;
        /**
         * The inapp product SKU (for example, 'com.some.thing.inapp1').
         */
        productId?: string;
        /**
         * The token provided to the user's device when the inapp product was purchased.
         */
        token?: string;
    }
    export class Resource$Purchases$Voidedpurchases {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * androidpublisher.purchases.voidedpurchases.list
         * @desc Lists the purchases that were canceled, refunded or charged-back.
         * @example
         * // Before running the sample:
         * // - Enable the API at:
         * //   https://console.developers.google.com/apis/api/androidpublisher.googleapis.com
         * // - Login into gcloud by running:
         * //   `$ gcloud auth application-default login`
         * // - Install the npm module by running:
         * //   `$ npm install googleapis`
         *
         * const {google} = require('googleapis');
         * const androidpublisher = google.androidpublisher('v2');
         *
         * async function main() {
         *   const auth = new google.auth.GoogleAuth({
         *     // Scopes can be specified either as an array or as a single, space-delimited string.
         *     scopes: ['https://www.googleapis.com/auth/androidpublisher'],
         *   });
         *
         *   // Acquire an auth client, and bind it to all future calls
         *   const authClient = await auth.getClient();
         *   google.options({auth: authClient});
         *
         *   // Do the magic
         *   const res = await androidpublisher.purchases.voidedpurchases.list({
         *     // The time, in milliseconds since the Epoch, of the newest voided purchase that you want to see in the response. The value of this parameter cannot be greater than the current time and is ignored if a pagination token is set. Default value is current time. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         *     endTime: 'placeholder-value',
         *
         *     maxResults: 'placeholder-value',
         *     // The package name of the application for which voided purchases need to be returned (for example, 'com.some.thing').
         *     packageName: 'placeholder-value',
         *
         *     startIndex: 'placeholder-value',
         *     // The time, in milliseconds since the Epoch, of the oldest voided purchase that you want to see in the response. The value of this parameter cannot be older than 30 days and is ignored if a pagination token is set. Default value is current time minus 30 days. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         *     startTime: 'placeholder-value',
         *
         *     token: 'placeholder-value',
         *   });
         *   console.log(res.data);
         *
         *   // Example response
         *   // {
         *   //   "pageInfo": {},
         *   //   "tokenPagination": {},
         *   //   "voidedPurchases": []
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias androidpublisher.purchases.voidedpurchases.list
         * @memberOf! ()
         *
         * @param {object} params Parameters for request
         * @param {string=} params.endTime The time, in milliseconds since the Epoch, of the newest voided purchase that you want to see in the response. The value of this parameter cannot be greater than the current time and is ignored if a pagination token is set. Default value is current time. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         * @param {integer=} params.maxResults
         * @param {string} params.packageName The package name of the application for which voided purchases need to be returned (for example, 'com.some.thing').
         * @param {integer=} params.startIndex
         * @param {string=} params.startTime The time, in milliseconds since the Epoch, of the oldest voided purchase that you want to see in the response. The value of this parameter cannot be older than 30 days and is ignored if a pagination token is set. Default value is current time minus 30 days. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         * @param {string=} params.token
         * @param {object} [options] Optionally override request options, such as `url`, `method`, and `encoding`.
         * @param {callback} callback The callback that handles the response.
         * @return {object} Request object
         */
        list(params: Params$Resource$Purchases$Voidedpurchases$List, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        list(params?: Params$Resource$Purchases$Voidedpurchases$List, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$VoidedPurchasesListResponse>>;
        list(params: Params$Resource$Purchases$Voidedpurchases$List, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        list(params: Params$Resource$Purchases$Voidedpurchases$List, options: MethodOptions | BodyResponseCallback<Schema$VoidedPurchasesListResponse>, callback: BodyResponseCallback<Schema$VoidedPurchasesListResponse>): void;
        list(params: Params$Resource$Purchases$Voidedpurchases$List, callback: BodyResponseCallback<Schema$VoidedPurchasesListResponse>): void;
        list(callback: BodyResponseCallback<Schema$VoidedPurchasesListResponse>): void;
    }
    export interface Params$Resource$Purchases$Voidedpurchases$List extends StandardParameters {
        /**
         * The time, in milliseconds since the Epoch, of the newest voided purchase that you want to see in the response. The value of this parameter cannot be greater than the current time and is ignored if a pagination token is set. Default value is current time. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         */
        endTime?: string;
        /**
         *
         */
        maxResults?: number;
        /**
         * The package name of the application for which voided purchases need to be returned (for example, 'com.some.thing').
         */
        packageName?: string;
        /**
         *
         */
        startIndex?: number;
        /**
         * The time, in milliseconds since the Epoch, of the oldest voided purchase that you want to see in the response. The value of this parameter cannot be older than 30 days and is ignored if a pagination token is set. Default value is current time minus 30 days. Note: This filter is applied on the time at which the record is seen as voided by our systems and not the actual voided time returned in the response.
         */
        startTime?: string;
        /**
         *
         */
        token?: string;
    }
    export {};
}
