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
exports.safebrowsing_v5 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var safebrowsing_v5;
(function (safebrowsing_v5) {
    /**
     * Safe Browsing API
     *
     * Enables client applications to check web resources (most commonly URLs) against Google-generated lists of unsafe web resources. The Safe Browsing APIs are for non-commercial use only. If you need to use APIs to detect malicious URLs for commercial purposes – meaning “for sale or revenue-generating purposes” – please refer to the Web Risk API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const safebrowsing = google.safebrowsing('v5');
     * ```
     */
    class Safebrowsing {
        context;
        hashes;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.hashes = new Resource$Hashes(this.context);
        }
    }
    safebrowsing_v5.Safebrowsing = Safebrowsing;
    class Resource$Hashes {
        context;
        constructor(context) {
            this.context = context;
        }
        search(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback || {});
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v5/hashes:search').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [],
                pathParams: [],
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
    safebrowsing_v5.Resource$Hashes = Resource$Hashes;
})(safebrowsing_v5 || (exports.safebrowsing_v5 = safebrowsing_v5 = {}));
