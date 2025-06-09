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
exports.chromeuxreport_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var chromeuxreport_v1;
(function (chromeuxreport_v1) {
    /**
     * Chrome UX Report API
     *
     * The Chrome UX Report API lets you view real user experience data for millions of websites.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const chromeuxreport = google.chromeuxreport('v1');
     * ```
     */
    class Chromeuxreport {
        context;
        records;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.records = new Resource$Records(this.context);
        }
    }
    chromeuxreport_v1.Chromeuxreport = Chromeuxreport;
    class Resource$Records {
        context;
        constructor(context) {
            this.context = context;
        }
        queryHistoryRecord(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://chromeuxreport.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/records:queryHistoryRecord').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
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
        queryRecord(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://chromeuxreport.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/records:queryRecord').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
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
    chromeuxreport_v1.Resource$Records = Resource$Records;
})(chromeuxreport_v1 || (exports.chromeuxreport_v1 = chromeuxreport_v1 = {}));
