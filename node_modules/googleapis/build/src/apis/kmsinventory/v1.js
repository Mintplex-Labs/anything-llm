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
exports.kmsinventory_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var kmsinventory_v1;
(function (kmsinventory_v1) {
    /**
     * KMS Inventory API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const kmsinventory = google.kmsinventory('v1');
     * ```
     */
    class Kmsinventory {
        context;
        organizations;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.organizations = new Resource$Organizations(this.context);
            this.projects = new Resource$Projects(this.context);
        }
    }
    kmsinventory_v1.Kmsinventory = Kmsinventory;
    class Resource$Organizations {
        context;
        protectedResources;
        constructor(context) {
            this.context = context;
            this.protectedResources = new Resource$Organizations$Protectedresources(this.context);
        }
    }
    kmsinventory_v1.Resource$Organizations = Resource$Organizations;
    class Resource$Organizations$Protectedresources {
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
            const rootUrl = options.rootUrl || 'https://kmsinventory.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+scope}/protectedResources:search').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['scope'],
                pathParams: ['scope'],
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
    kmsinventory_v1.Resource$Organizations$Protectedresources = Resource$Organizations$Protectedresources;
    class Resource$Projects {
        context;
        cryptoKeys;
        locations;
        constructor(context) {
            this.context = context;
            this.cryptoKeys = new Resource$Projects$Cryptokeys(this.context);
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    kmsinventory_v1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Cryptokeys {
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
            const rootUrl = options.rootUrl || 'https://kmsinventory.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+parent}/cryptoKeys').replace(/([^:]\/)\/+/g, '$1'),
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
    kmsinventory_v1.Resource$Projects$Cryptokeys = Resource$Projects$Cryptokeys;
    class Resource$Projects$Locations {
        context;
        keyRings;
        constructor(context) {
            this.context = context;
            this.keyRings = new Resource$Projects$Locations$Keyrings(this.context);
        }
    }
    kmsinventory_v1.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Locations$Keyrings {
        context;
        cryptoKeys;
        constructor(context) {
            this.context = context;
            this.cryptoKeys = new Resource$Projects$Locations$Keyrings$Cryptokeys(this.context);
        }
    }
    kmsinventory_v1.Resource$Projects$Locations$Keyrings = Resource$Projects$Locations$Keyrings;
    class Resource$Projects$Locations$Keyrings$Cryptokeys {
        context;
        constructor(context) {
            this.context = context;
        }
        getProtectedResourcesSummary(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://kmsinventory.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+name}/protectedResourcesSummary').replace(/([^:]\/)\/+/g, '$1'),
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
    kmsinventory_v1.Resource$Projects$Locations$Keyrings$Cryptokeys = Resource$Projects$Locations$Keyrings$Cryptokeys;
})(kmsinventory_v1 || (exports.kmsinventory_v1 = kmsinventory_v1 = {}));
