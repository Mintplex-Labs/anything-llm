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
exports.firebaseml_v2beta = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var firebaseml_v2beta;
(function (firebaseml_v2beta) {
    /**
     * Firebase ML API
     *
     * Access custom machine learning models hosted via Firebase ML.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const firebaseml = google.firebaseml('v2beta');
     * ```
     */
    class Firebaseml {
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
    firebaseml_v2beta.Firebaseml = Firebaseml;
    class Resource$Projects {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    firebaseml_v2beta.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        context;
        publishers;
        constructor(context) {
            this.context = context;
            this.publishers = new Resource$Projects$Locations$Publishers(this.context);
        }
    }
    firebaseml_v2beta.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Locations$Publishers {
        context;
        models;
        constructor(context) {
            this.context = context;
            this.models = new Resource$Projects$Locations$Publishers$Models(this.context);
        }
    }
    firebaseml_v2beta.Resource$Projects$Locations$Publishers = Resource$Projects$Locations$Publishers;
    class Resource$Projects$Locations$Publishers$Models {
        context;
        constructor(context) {
            this.context = context;
        }
        countTokens(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://firebaseml.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta/{+endpoint}:countTokens').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['endpoint'],
                pathParams: ['endpoint'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        generateContent(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://firebaseml.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta/{+model}:generateContent').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['model'],
                pathParams: ['model'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        streamGenerateContent(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://firebaseml.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta/{+model}:streamGenerateContent').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['model'],
                pathParams: ['model'],
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
    firebaseml_v2beta.Resource$Projects$Locations$Publishers$Models = Resource$Projects$Locations$Publishers$Models;
})(firebaseml_v2beta || (exports.firebaseml_v2beta = firebaseml_v2beta = {}));
