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
exports.analyticsreporting_v4 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var analyticsreporting_v4;
(function (analyticsreporting_v4) {
    /**
     * Analytics Reporting API
     *
     * Accesses Analytics report data.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const analyticsreporting = google.analyticsreporting('v4');
     * ```
     */
    class Analyticsreporting {
        context;
        reports;
        userActivity;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.reports = new Resource$Reports(this.context);
            this.userActivity = new Resource$Useractivity(this.context);
        }
    }
    analyticsreporting_v4.Analyticsreporting = Analyticsreporting;
    class Resource$Reports {
        context;
        constructor(context) {
            this.context = context;
        }
        batchGet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analyticsreporting.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/reports:batchGet').replace(/([^:]\/)\/+/g, '$1'),
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
    analyticsreporting_v4.Resource$Reports = Resource$Reports;
    class Resource$Useractivity {
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
            const rootUrl = options.rootUrl || 'https://analyticsreporting.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/userActivity:search').replace(/([^:]\/)\/+/g, '$1'),
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
    analyticsreporting_v4.Resource$Useractivity = Resource$Useractivity;
})(analyticsreporting_v4 || (exports.analyticsreporting_v4 = analyticsreporting_v4 = {}));
