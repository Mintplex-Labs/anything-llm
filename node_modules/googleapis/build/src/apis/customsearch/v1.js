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
exports.customsearch_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var customsearch_v1;
(function (customsearch_v1) {
    /**
     * Custom Search API
     *
     * Searches over a website or collection of websites
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const customsearch = google.customsearch('v1');
     * ```
     */
    class Customsearch {
        context;
        cse;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.cse = new Resource$Cse(this.context);
        }
    }
    customsearch_v1.Customsearch = Customsearch;
    class Resource$Cse {
        context;
        siterestrict;
        constructor(context) {
            this.context = context;
            this.siterestrict = new Resource$Cse$Siterestrict(this.context);
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://customsearch.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/customsearch/v1').replace(/([^:]\/)\/+/g, '$1'),
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
    customsearch_v1.Resource$Cse = Resource$Cse;
    class Resource$Cse$Siterestrict {
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
            const rootUrl = options.rootUrl || 'https://customsearch.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/customsearch/v1/siterestrict').replace(/([^:]\/)\/+/g, '$1'),
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
    customsearch_v1.Resource$Cse$Siterestrict = Resource$Cse$Siterestrict;
})(customsearch_v1 || (exports.customsearch_v1 = customsearch_v1 = {}));
