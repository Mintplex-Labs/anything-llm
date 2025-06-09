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
exports.abusiveexperiencereport_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var abusiveexperiencereport_v1;
(function (abusiveexperiencereport_v1) {
    /**
     * Abusive Experience Report API
     *
     * Views Abusive Experience Report data, and gets a list of sites that have a significant number of abusive experiences.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const abusiveexperiencereport = google.abusiveexperiencereport('v1');
     * ```
     */
    class Abusiveexperiencereport {
        context;
        sites;
        violatingSites;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.sites = new Resource$Sites(this.context);
            this.violatingSites = new Resource$Violatingsites(this.context);
        }
    }
    abusiveexperiencereport_v1.Abusiveexperiencereport = Abusiveexperiencereport;
    class Resource$Sites {
        context;
        constructor(context) {
            this.context = context;
        }
        get(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://abusiveexperiencereport.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
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
    abusiveexperiencereport_v1.Resource$Sites = Resource$Sites;
    class Resource$Violatingsites {
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
            const rootUrl = options.rootUrl || 'https://abusiveexperiencereport.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/violatingSites').replace(/([^:]\/)\/+/g, '$1'),
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
    abusiveexperiencereport_v1.Resource$Violatingsites = Resource$Violatingsites;
})(abusiveexperiencereport_v1 || (exports.abusiveexperiencereport_v1 = abusiveexperiencereport_v1 = {}));
