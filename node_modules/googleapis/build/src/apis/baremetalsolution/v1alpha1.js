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
exports.baremetalsolution_v1alpha1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var baremetalsolution_v1alpha1;
(function (baremetalsolution_v1alpha1) {
    /**
     * Bare Metal Solution API
     *
     * Provides ways to manage Bare Metal Solution hardware installed in a regional extension located near a Google Cloud data center.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const baremetalsolution = google.baremetalsolution('v1alpha1');
     * ```
     */
    class Baremetalsolution {
        context;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.projects = new Resource$Projects(this.context);
        }
    }
    baremetalsolution_v1alpha1.Baremetalsolution = Baremetalsolution;
    class Resource$Projects {
        context;
        locations;
        provisioningQuotas;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
            this.provisioningQuotas = new Resource$Projects$Provisioningquotas(this.context);
        }
    }
    baremetalsolution_v1alpha1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        context;
        constructor(context) {
            this.context = context;
        }
        submitProvisioningConfig(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://baremetalsolution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v1alpha1/{+project}/{+location}:submitProvisioningConfig').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['project', 'location'],
                pathParams: ['location', 'project'],
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
    baremetalsolution_v1alpha1.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Provisioningquotas {
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
            const rootUrl = options.rootUrl || 'https://baremetalsolution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1alpha1/{+parent}/provisioningQuotas').replace(/([^:]\/)\/+/g, '$1'),
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
    baremetalsolution_v1alpha1.Resource$Projects$Provisioningquotas = Resource$Projects$Provisioningquotas;
})(baremetalsolution_v1alpha1 || (exports.baremetalsolution_v1alpha1 = baremetalsolution_v1alpha1 = {}));
