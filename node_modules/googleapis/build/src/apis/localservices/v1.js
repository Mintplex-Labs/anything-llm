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
exports.localservices_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var localservices_v1;
(function (localservices_v1) {
    /**
     * Local Services API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const localservices = google.localservices('v1');
     * ```
     */
    class Localservices {
        context;
        accountReports;
        detailedLeadReports;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.accountReports = new Resource$Accountreports(this.context);
            this.detailedLeadReports = new Resource$Detailedleadreports(this.context);
        }
    }
    localservices_v1.Localservices = Localservices;
    class Resource$Accountreports {
        context;
        constructor(context) {
            this.context = context;
        }
        search(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://localservices.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/accountReports:search').replace(/([^:]\/)\/+/g, '$1'),
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
    localservices_v1.Resource$Accountreports = Resource$Accountreports;
    class Resource$Detailedleadreports {
        context;
        constructor(context) {
            this.context = context;
        }
        search(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://localservices.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/detailedLeadReports:search').replace(/([^:]\/)\/+/g, '$1'),
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
    localservices_v1.Resource$Detailedleadreports = Resource$Detailedleadreports;
})(localservices_v1 || (exports.localservices_v1 = localservices_v1 = {}));
