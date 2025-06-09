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
exports.androidpublisher_v1_1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var androidpublisher_v1_1;
(function (androidpublisher_v1_1) {
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
    class Androidpublisher {
        context;
        inapppurchases;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.inapppurchases = new Resource$Inapppurchases(this.context);
        }
    }
    androidpublisher_v1_1.Androidpublisher = Androidpublisher;
    class Resource$Inapppurchases {
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
                        '/androidpublisher/v1.1/applications/{packageName}/inapp/{productId}/purchases/{token}').replace(/([^:]\/)\/+/g, '$1'),
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
    androidpublisher_v1_1.Resource$Inapppurchases = Resource$Inapppurchases;
})(androidpublisher_v1_1 || (exports.androidpublisher_v1_1 = androidpublisher_v1_1 = {}));
