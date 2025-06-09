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
exports.mybusinessbusinesscalls_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var mybusinessbusinesscalls_v1;
(function (mybusinessbusinesscalls_v1) {
    /**
     * My Business Business Calls API
     *
     * The My Business Business Calls API manages business calls information of a location on Google and collect insights like the number of missed calls to their location. Additional information about Business calls can be found at https://support.google.com/business/answer/9688285?p=call_history. If the Google Business Profile links to a Google Ads account and call history is turned on, calls that last longer than a specific time, and that can be attributed to an ad interaction, will show in the linked Google Ads account under the &quot;Calls from Ads&quot; conversion. If smart bidding and call conversions are used in the optimization strategy, there could be a change in ad spend. Learn more about smart bidding. To view and perform actions on a location&#39;s calls, you need to be a `OWNER`, `CO_OWNER` or `MANAGER` of the location. Note - If you have a quota of 0 after enabling the API, please request for GBP API access.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const mybusinessbusinesscalls = google.mybusinessbusinesscalls('v1');
     * ```
     */
    class Mybusinessbusinesscalls {
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
    mybusinessbusinesscalls_v1.Mybusinessbusinesscalls = Mybusinessbusinesscalls;
    class Resource$Locations {
        context;
        businesscallsinsights;
        constructor(context) {
            this.context = context;
            this.businesscallsinsights = new Resource$Locations$Businesscallsinsights(this.context);
        }
        getBusinesscallssettings(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://mybusinessbusinesscalls.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
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
        updateBusinesscallssettings(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://mybusinessbusinesscalls.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
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
    mybusinessbusinesscalls_v1.Resource$Locations = Resource$Locations;
    class Resource$Locations$Businesscallsinsights {
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
            const rootUrl = options.rootUrl || 'https://mybusinessbusinesscalls.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+parent}/businesscallsinsights').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
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
    mybusinessbusinesscalls_v1.Resource$Locations$Businesscallsinsights = Resource$Locations$Businesscallsinsights;
})(mybusinessbusinesscalls_v1 || (exports.mybusinessbusinesscalls_v1 = mybusinessbusinesscalls_v1 = {}));
