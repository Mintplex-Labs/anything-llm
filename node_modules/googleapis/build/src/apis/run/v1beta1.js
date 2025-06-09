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
exports.run_v1beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var run_v1beta1;
(function (run_v1beta1) {
    /**
     * Cloud Run Admin API
     *
     * Deploy and manage user provided container images that scale automatically based on HTTP traffic.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const run = google.run('v1beta1');
     * ```
     */
    class Run {
        context;
        customresourcedefinitions;
        namespaces;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.customresourcedefinitions = new Resource$Customresourcedefinitions(this.context);
            this.namespaces = new Resource$Namespaces(this.context);
            this.projects = new Resource$Projects(this.context);
        }
    }
    run_v1beta1.Run = Run;
    class Resource$Customresourcedefinitions {
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
            const rootUrl = options.rootUrl || 'https://run.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apis/apiextensions.k8s.io/v1beta1/customresourcedefinitions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
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
    run_v1beta1.Resource$Customresourcedefinitions = Resource$Customresourcedefinitions;
    class Resource$Namespaces {
        context;
        customresourcedefinitions;
        constructor(context) {
            this.context = context;
            this.customresourcedefinitions =
                new Resource$Namespaces$Customresourcedefinitions(this.context);
        }
    }
    run_v1beta1.Resource$Namespaces = Resource$Namespaces;
    class Resource$Namespaces$Customresourcedefinitions {
        context;
        constructor(context) {
            this.context = context;
        }
        get(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://run.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apis/apiextensions.k8s.io/v1beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
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
    }
    run_v1beta1.Resource$Namespaces$Customresourcedefinitions = Resource$Namespaces$Customresourcedefinitions;
    class Resource$Projects {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    run_v1beta1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        context;
        customresourcedefinitions;
        constructor(context) {
            this.context = context;
            this.customresourcedefinitions =
                new Resource$Projects$Locations$Customresourcedefinitions(this.context);
        }
    }
    run_v1beta1.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Locations$Customresourcedefinitions {
        context;
        constructor(context) {
            this.context = context;
        }
        get(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://run.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://run.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+parent}/customresourcedefinitions').replace(/([^:]\/)\/+/g, '$1'),
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
    run_v1beta1.Resource$Projects$Locations$Customresourcedefinitions = Resource$Projects$Locations$Customresourcedefinitions;
})(run_v1beta1 || (exports.run_v1beta1 = run_v1beta1 = {}));
