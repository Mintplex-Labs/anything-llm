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
exports.admin_reports_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var admin_reports_v1;
(function (admin_reports_v1) {
    /**
     * Admin SDK API
     *
     * Admin SDK lets administrators of enterprise domains to view and manage resources like user, groups etc. It also provides audit and usage reports of domain.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const admin = google.admin('reports_v1');
     * ```
     */
    class Admin {
        context;
        activities;
        channels;
        customerUsageReports;
        entityUsageReports;
        userUsageReport;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.activities = new Resource$Activities(this.context);
            this.channels = new Resource$Channels(this.context);
            this.customerUsageReports = new Resource$Customerusagereports(this.context);
            this.entityUsageReports = new Resource$Entityusagereports(this.context);
            this.userUsageReport = new Resource$Userusagereport(this.context);
        }
    }
    admin_reports_v1.Admin = Admin;
    class Resource$Activities {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/admin/reports/v1/activity/users/{userKey}/applications/{applicationName}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['userKey', 'applicationName'],
                pathParams: ['applicationName', 'userKey'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        watch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/admin/reports/v1/activity/users/{userKey}/applications/{applicationName}/watch').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['userKey', 'applicationName'],
                pathParams: ['applicationName', 'userKey'],
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
    admin_reports_v1.Resource$Activities = Resource$Activities;
    class Resource$Channels {
        context;
        constructor(context) {
            this.context = context;
        }
        stop(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/admin/reports_v1/channels/stop').replace(/([^:]\/)\/+/g, '$1'),
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
    }
    admin_reports_v1.Resource$Channels = Resource$Channels;
    class Resource$Customerusagereports {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/admin/reports/v1/usage/dates/{date}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['date'],
                pathParams: ['date'],
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
    admin_reports_v1.Resource$Customerusagereports = Resource$Customerusagereports;
    class Resource$Entityusagereports {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/admin/reports/v1/usage/{entityType}/{entityKey}/dates/{date}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['entityType', 'entityKey', 'date'],
                pathParams: ['date', 'entityKey', 'entityType'],
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
    admin_reports_v1.Resource$Entityusagereports = Resource$Entityusagereports;
    class Resource$Userusagereport {
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
            const rootUrl = options.rootUrl || 'https://admin.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/admin/reports/v1/usage/users/{userKey}/dates/{date}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['userKey', 'date'],
                pathParams: ['date', 'userKey'],
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
    admin_reports_v1.Resource$Userusagereport = Resource$Userusagereport;
})(admin_reports_v1 || (exports.admin_reports_v1 = admin_reports_v1 = {}));
