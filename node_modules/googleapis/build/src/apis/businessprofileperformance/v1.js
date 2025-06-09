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
exports.businessprofileperformance_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var businessprofileperformance_v1;
(function (businessprofileperformance_v1) {
    /**
     * Business Profile Performance API
     *
     * The Business Profile Performance API allows merchants to fetch performance reports about their business profile on Google. Note - If you have a quota of 0 after enabling the API, please request for GBP API access.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const businessprofileperformance = google.businessprofileperformance('v1');
     * ```
     */
    class Businessprofileperformance {
        context;
        locations;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.locations = new Resource$Locations(this.context);
        }
    }
    businessprofileperformance_v1.Businessprofileperformance = Businessprofileperformance;
    class Resource$Locations {
        context;
        searchkeywords;
        constructor(context) {
            this.context = context;
            this.searchkeywords = new Resource$Locations$Searchkeywords(this.context);
        }
        fetchMultiDailyMetricsTimeSeries(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://businessprofileperformance.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+location}:fetchMultiDailyMetricsTimeSeries').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['location'],
                pathParams: ['location'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getDailyMetricsTimeSeries(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://businessprofileperformance.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}:getDailyMetricsTimeSeries').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
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
    businessprofileperformance_v1.Resource$Locations = Resource$Locations;
    class Resource$Locations$Searchkeywords {
        context;
        impressions;
        constructor(context) {
            this.context = context;
            this.impressions = new Resource$Locations$Searchkeywords$Impressions(this.context);
        }
    }
    businessprofileperformance_v1.Resource$Locations$Searchkeywords = Resource$Locations$Searchkeywords;
    class Resource$Locations$Searchkeywords$Impressions {
        context;
        monthly;
        constructor(context) {
            this.context = context;
            this.monthly = new Resource$Locations$Searchkeywords$Impressions$Monthly(this.context);
        }
    }
    businessprofileperformance_v1.Resource$Locations$Searchkeywords$Impressions = Resource$Locations$Searchkeywords$Impressions;
    class Resource$Locations$Searchkeywords$Impressions$Monthly {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://businessprofileperformance.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+parent}/searchkeywords/impressions/monthly').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
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
    businessprofileperformance_v1.Resource$Locations$Searchkeywords$Impressions$Monthly = Resource$Locations$Searchkeywords$Impressions$Monthly;
})(businessprofileperformance_v1 || (exports.businessprofileperformance_v1 = businessprofileperformance_v1 = {}));
