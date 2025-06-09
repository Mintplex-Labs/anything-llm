"use strict";
// Copyright 2020 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.androidpublisher_v2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var androidpublisher_v2;
(function (androidpublisher_v2) {
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
    class Androidpublisher {
        context;
        purchases;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.purchases = new Resource$Purchases(this.context);
        }
    }
    androidpublisher_v2.Androidpublisher = Androidpublisher;
    class Resource$Purchases {
        context;
        products;
        voidedpurchases;
        constructor(context) {
            this.context = context;
            this.products = new Resource$Purchases$Products(this.context);
            this.voidedpurchases = new Resource$Purchases$Voidedpurchases(this.context);
        }
    }
    androidpublisher_v2.Resource$Purchases = Resource$Purchases;
    class Resource$Purchases$Products {
        context;
        constructor(context) {
            this.context = context;
        }
        get(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://www.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidpublisher/v2/applications/{packageName}/purchases/products/{productId}/tokens/{token}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['packageName', 'productId', 'token'],
                pathParams: ['packageName', 'productId', 'token'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    androidpublisher_v2.Resource$Purchases$Products = Resource$Purchases$Products;
    class Resource$Purchases$Voidedpurchases {
        context;
        constructor(context) {
            this.context = context;
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://www.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidpublisher/v2/applications/{packageName}/purchases/voidedpurchases').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['packageName'],
                pathParams: ['packageName'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    androidpublisher_v2.Resource$Purchases$Voidedpurchases = Resource$Purchases$Voidedpurchases;
})(androidpublisher_v2 || (exports.androidpublisher_v2 = androidpublisher_v2 = {}));
