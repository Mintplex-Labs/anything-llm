import { OAuth2Client, JWT, Compute, UserRefreshClient, GaxiosResponseWithHTTP2, GoogleConfigurable, MethodOptions, StreamMethodOptions, GlobalOptions, GoogleAuth, BodyResponseCallback, APIRequestContext } from 'googleapis-common';
import { Readable } from 'stream';
export declare namespace androidpublisher_v1_1 {
    export interface Options extends GlobalOptions {
        version: 'v1.1';
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
     * const androidpublisher = google.androidpublisher('v1.1');
     *
     * @namespace androidpublisher
     * @type {Function}
     * @version v1.1
     * @variation v1.1
     * @param {object=} options Options for Androidpublisher
     */
    export class Androidpublisher {
        context: APIRequestContext;
        inapppurchases: Resource$Inapppurchases;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
    /**
     * An InappPurchase resource indicates the status of a user&#39;s inapp product purchase.
     */
    export interface Schema$InappPurchase {
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
        purchaseTime?: string | null;
        /**
         * The type of purchase of the inapp product. This field is only set if this purchase was not made using the standard in-app billing flow. Possible values are:   - Test (i.e. purchased from a license testing account)  - Promo (i.e. purchased using a promo code)  - Rewarded (i.e. from watching a video ad instead of paying)
         */
        purchaseType?: number | null;
    }
    export class Resource$Inapppurchases {
        context: APIRequestContext;
        constructor(context: APIRequestContext);
        /**
         * androidpublisher.inapppurchases.get
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
         * const androidpublisher = google.androidpublisher('v1.1');
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
         *   const res = await androidpublisher.inapppurchases.get({
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
         *   //   "purchaseTime": "my_purchaseTime",
         *   //   "purchaseType": 0
         *   // }
         * }
         *
         * main().catch(e => {
         *   console.error(e);
         *   throw e;
         * });
         *
         * @alias androidpublisher.inapppurchases.get
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
        get(params: Params$Resource$Inapppurchases$Get, options: StreamMethodOptions): Promise<GaxiosResponseWithHTTP2<Readable>>;
        get(params?: Params$Resource$Inapppurchases$Get, options?: MethodOptions): Promise<GaxiosResponseWithHTTP2<Schema$InappPurchase>>;
        get(params: Params$Resource$Inapppurchases$Get, options: StreamMethodOptions | BodyResponseCallback<Readable>, callback: BodyResponseCallback<Readable>): void;
        get(params: Params$Resource$Inapppurchases$Get, options: MethodOptions | BodyResponseCallback<Schema$InappPurchase>, callback: BodyResponseCallback<Schema$InappPurchase>): void;
        get(params: Params$Resource$Inapppurchases$Get, callback: BodyResponseCallback<Schema$InappPurchase>): void;
        get(callback: BodyResponseCallback<Schema$InappPurchase>): void;
    }
    export interface Params$Resource$Inapppurchases$Get extends StandardParameters {
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
    export {};
}
