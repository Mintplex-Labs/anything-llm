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
exports.remotebuildexecution_v2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var remotebuildexecution_v2;
(function (remotebuildexecution_v2) {
    /**
     * Remote Build Execution API
     *
     * Supplies a Remote Execution API service for tools such as bazel.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const remotebuildexecution = google.remotebuildexecution('v2');
     * ```
     */
    class Remotebuildexecution {
        context;
        actionResults;
        actions;
        blobs;
        operations;
        v2;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.actionResults = new Resource$Actionresults(this.context);
            this.actions = new Resource$Actions(this.context);
            this.blobs = new Resource$Blobs(this.context);
            this.operations = new Resource$Operations(this.context);
            this.v2 = new Resource$V2(this.context);
        }
    }
    remotebuildexecution_v2.Remotebuildexecution = Remotebuildexecution;
    class Resource$Actionresults {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/actionResults/{hash}/{sizeBytes}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['instanceName', 'hash', 'sizeBytes'],
                pathParams: ['hash', 'instanceName', 'sizeBytes'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        update(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/actionResults/{hash}/{sizeBytes}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                }, options),
                params,
                requiredParams: ['instanceName', 'hash', 'sizeBytes'],
                pathParams: ['hash', 'instanceName', 'sizeBytes'],
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
    remotebuildexecution_v2.Resource$Actionresults = Resource$Actionresults;
    class Resource$Actions {
        context;
        constructor(context) {
            this.context = context;
        }
        execute(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/actions:execute').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['instanceName'],
                pathParams: ['instanceName'],
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
    remotebuildexecution_v2.Resource$Actions = Resource$Actions;
    class Resource$Blobs {
        context;
        constructor(context) {
            this.context = context;
        }
        batchRead(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/blobs:batchRead').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['instanceName'],
                pathParams: ['instanceName'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        batchUpdate(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/blobs:batchUpdate').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['instanceName'],
                pathParams: ['instanceName'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        findMissing(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/blobs:findMissing').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['instanceName'],
                pathParams: ['instanceName'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getTree(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/blobs/{hash}/{sizeBytes}:getTree').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['instanceName', 'hash', 'sizeBytes'],
                pathParams: ['hash', 'instanceName', 'sizeBytes'],
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
    remotebuildexecution_v2.Resource$Blobs = Resource$Blobs;
    class Resource$Operations {
        context;
        constructor(context) {
            this.context = context;
        }
        waitExecution(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+name}:waitExecution').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
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
    remotebuildexecution_v2.Resource$Operations = Resource$Operations;
    class Resource$V2 {
        context;
        constructor(context) {
            this.context = context;
        }
        getCapabilities(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://remotebuildexecution.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/{+instanceName}/capabilities').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['instanceName'],
                pathParams: ['instanceName'],
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
    remotebuildexecution_v2.Resource$V2 = Resource$V2;
})(remotebuildexecution_v2 || (exports.remotebuildexecution_v2 = remotebuildexecution_v2 = {}));
