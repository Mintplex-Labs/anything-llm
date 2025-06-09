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
exports.clouddebugger_v2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var clouddebugger_v2;
(function (clouddebugger_v2) {
    /**
     * Cloud Debugger API (Deprecated)
     *
     * Examines the call stack and variables of a running application without stopping or slowing it down. (Deprecated)
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const clouddebugger = google.clouddebugger('v2');
     * ```
     */
    class Clouddebugger {
        context;
        controller;
        debugger;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.controller = new Resource$Controller(this.context);
            this.debugger = new Resource$Debugger(this.context);
        }
    }
    clouddebugger_v2.Clouddebugger = Clouddebugger;
    class Resource$Controller {
        context;
        debuggees;
        constructor(context) {
            this.context = context;
            this.debuggees = new Resource$Controller$Debuggees(this.context);
        }
    }
    clouddebugger_v2.Resource$Controller = Resource$Controller;
    class Resource$Controller$Debuggees {
        context;
        breakpoints;
        constructor(context) {
            this.context = context;
            this.breakpoints = new Resource$Controller$Debuggees$Breakpoints(this.context);
        }
        register(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/controller/debuggees/register').replace(/([^:]\/)\/+/g, '$1'),
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
    }
    clouddebugger_v2.Resource$Controller$Debuggees = Resource$Controller$Debuggees;
    class Resource$Controller$Debuggees$Breakpoints {
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/controller/debuggees/{debuggeeId}/breakpoints').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['debuggeeId'],
                pathParams: ['debuggeeId'],
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/controller/debuggees/{debuggeeId}/breakpoints/{id}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                }, options),
                params,
                requiredParams: ['debuggeeId', 'id'],
                pathParams: ['debuggeeId', 'id'],
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
    clouddebugger_v2.Resource$Controller$Debuggees$Breakpoints = Resource$Controller$Debuggees$Breakpoints;
    class Resource$Debugger {
        context;
        debuggees;
        constructor(context) {
            this.context = context;
            this.debuggees = new Resource$Debugger$Debuggees(this.context);
        }
    }
    clouddebugger_v2.Resource$Debugger = Resource$Debugger;
    class Resource$Debugger$Debuggees {
        context;
        breakpoints;
        constructor(context) {
            this.context = context;
            this.breakpoints = new Resource$Debugger$Debuggees$Breakpoints(this.context);
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/debugger/debuggees').replace(/([^:]\/)\/+/g, '$1'),
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
    clouddebugger_v2.Resource$Debugger$Debuggees = Resource$Debugger$Debuggees;
    class Resource$Debugger$Debuggees$Breakpoints {
        context;
        constructor(context) {
            this.context = context;
        }
        delete(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2/debugger/debuggees/{debuggeeId}/breakpoints/{breakpointId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                }, options),
                params,
                requiredParams: ['debuggeeId', 'breakpointId'],
                pathParams: ['breakpointId', 'debuggeeId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2/debugger/debuggees/{debuggeeId}/breakpoints/{breakpointId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['debuggeeId', 'breakpointId'],
                pathParams: ['breakpointId', 'debuggeeId'],
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/debugger/debuggees/{debuggeeId}/breakpoints').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['debuggeeId'],
                pathParams: ['debuggeeId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        set(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://clouddebugger.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/debugger/debuggees/{debuggeeId}/breakpoints/set').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['debuggeeId'],
                pathParams: ['debuggeeId'],
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
    clouddebugger_v2.Resource$Debugger$Debuggees$Breakpoints = Resource$Debugger$Debuggees$Breakpoints;
})(clouddebugger_v2 || (exports.clouddebugger_v2 = clouddebugger_v2 = {}));
