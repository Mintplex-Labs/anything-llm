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
exports.digitalassetlinks_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var digitalassetlinks_v1;
(function (digitalassetlinks_v1) {
    /**
     * Digital Asset Links API
     *
     * Discovers relationships between online assets such as websites or mobile apps.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const digitalassetlinks = google.digitalassetlinks('v1');
     * ```
     */
    class Digitalassetlinks {
        context;
        assetlinks;
        statements;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.assetlinks = new Resource$Assetlinks(this.context);
            this.statements = new Resource$Statements(this.context);
        }
    }
    digitalassetlinks_v1.Digitalassetlinks = Digitalassetlinks;
    class Resource$Assetlinks {
        context;
        constructor(context) {
            this.context = context;
        }
        bulkCheck(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://digitalassetlinks.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/assetlinks:bulkCheck').replace(/([^:]\/)\/+/g, '$1'),
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
        check(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://digitalassetlinks.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/assetlinks:check').replace(/([^:]\/)\/+/g, '$1'),
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
    digitalassetlinks_v1.Resource$Assetlinks = Resource$Assetlinks;
    class Resource$Statements {
        context;
        constructor(context) {
            this.context = context;
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://digitalassetlinks.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/statements:list').replace(/([^:]\/)\/+/g, '$1'),
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
    digitalassetlinks_v1.Resource$Statements = Resource$Statements;
})(digitalassetlinks_v1 || (exports.digitalassetlinks_v1 = digitalassetlinks_v1 = {}));
