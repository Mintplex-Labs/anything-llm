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
exports.doubleclickbidmanager_v1_1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var doubleclickbidmanager_v1_1;
(function (doubleclickbidmanager_v1_1) {
    /**
     * DoubleClick Bid Manager API
     *
     * DoubleClick Bid Manager API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const doubleclickbidmanager = google.doubleclickbidmanager('v1.1');
     * ```
     */
    class Doubleclickbidmanager {
        context;
        queries;
        reports;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.queries = new Resource$Queries(this.context);
            this.reports = new Resource$Reports(this.context);
        }
    }
    doubleclickbidmanager_v1_1.Doubleclickbidmanager = Doubleclickbidmanager;
    class Resource$Queries {
        context;
        constructor(context) {
            this.context = context;
        }
        createquery(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/query').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
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
        deletequery(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/query/{queryId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                }, options),
                params,
                requiredParams: ['queryId'],
                pathParams: ['queryId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getquery(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/query/{queryId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['queryId'],
                pathParams: ['queryId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        listqueries(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/queries').replace(/([^:]\/)\/+/g, '$1'),
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
        runquery(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/query/{queryId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['queryId'],
                pathParams: ['queryId'],
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
    doubleclickbidmanager_v1_1.Resource$Queries = Resource$Queries;
    class Resource$Reports {
        context;
        constructor(context) {
            this.context = context;
        }
        listreports(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://doubleclickbidmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/doubleclickbidmanager/v1.1/queries/{queryId}/reports').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['queryId'],
                pathParams: ['queryId'],
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
    doubleclickbidmanager_v1_1.Resource$Reports = Resource$Reports;
})(doubleclickbidmanager_v1_1 || (exports.doubleclickbidmanager_v1_1 = doubleclickbidmanager_v1_1 = {}));
