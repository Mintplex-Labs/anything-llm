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
exports.analytics_v3 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var analytics_v3;
(function (analytics_v3) {
    /**
     * Google Analytics API
     *
     * Views and manages your Google Analytics data.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const analytics = google.analytics('v3');
     * ```
     */
    class Analytics {
        context;
        data;
        management;
        metadata;
        provisioning;
        userDeletion;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.data = new Resource$Data(this.context);
            this.management = new Resource$Management(this.context);
            this.metadata = new Resource$Metadata(this.context);
            this.provisioning = new Resource$Provisioning(this.context);
            this.userDeletion = new Resource$Userdeletion(this.context);
        }
    }
    analytics_v3.Analytics = Analytics;
    class Resource$Data {
        context;
        ga;
        mcf;
        realtime;
        constructor(context) {
            this.context = context;
            this.ga = new Resource$Data$Ga(this.context);
            this.mcf = new Resource$Data$Mcf(this.context);
            this.realtime = new Resource$Data$Realtime(this.context);
        }
    }
    analytics_v3.Resource$Data = Resource$Data;
    class Resource$Data$Ga {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/data/ga').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ids', 'start-date', 'end-date', 'metrics'],
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
    analytics_v3.Resource$Data$Ga = Resource$Data$Ga;
    class Resource$Data$Mcf {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/data/mcf').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ids', 'start-date', 'end-date', 'metrics'],
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
    analytics_v3.Resource$Data$Mcf = Resource$Data$Mcf;
    class Resource$Data$Realtime {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/data/realtime').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ids', 'metrics'],
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
    analytics_v3.Resource$Data$Realtime = Resource$Data$Realtime;
    class Resource$Management {
        context;
        accounts;
        accountSummaries;
        accountUserLinks;
        clientId;
        customDataSources;
        customDimensions;
        customMetrics;
        experiments;
        filters;
        goals;
        profileFilterLinks;
        profiles;
        profileUserLinks;
        remarketingAudience;
        segments;
        unsampledReports;
        uploads;
        webproperties;
        webPropertyAdWordsLinks;
        webpropertyUserLinks;
        constructor(context) {
            this.context = context;
            this.accounts = new Resource$Management$Accounts(this.context);
            this.accountSummaries = new Resource$Management$Accountsummaries(this.context);
            this.accountUserLinks = new Resource$Management$Accountuserlinks(this.context);
            this.clientId = new Resource$Management$Clientid(this.context);
            this.customDataSources = new Resource$Management$Customdatasources(this.context);
            this.customDimensions = new Resource$Management$Customdimensions(this.context);
            this.customMetrics = new Resource$Management$Custommetrics(this.context);
            this.experiments = new Resource$Management$Experiments(this.context);
            this.filters = new Resource$Management$Filters(this.context);
            this.goals = new Resource$Management$Goals(this.context);
            this.profileFilterLinks = new Resource$Management$Profilefilterlinks(this.context);
            this.profiles = new Resource$Management$Profiles(this.context);
            this.profileUserLinks = new Resource$Management$Profileuserlinks(this.context);
            this.remarketingAudience = new Resource$Management$Remarketingaudience(this.context);
            this.segments = new Resource$Management$Segments(this.context);
            this.unsampledReports = new Resource$Management$Unsampledreports(this.context);
            this.uploads = new Resource$Management$Uploads(this.context);
            this.webproperties = new Resource$Management$Webproperties(this.context);
            this.webPropertyAdWordsLinks =
                new Resource$Management$Webpropertyadwordslinks(this.context);
            this.webpropertyUserLinks = new Resource$Management$Webpropertyuserlinks(this.context);
        }
    }
    analytics_v3.Resource$Management = Resource$Management;
    class Resource$Management$Accounts {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/accounts').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Management$Accounts = Resource$Management$Accounts;
    class Resource$Management$Accountsummaries {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/accountSummaries').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Management$Accountsummaries = Resource$Management$Accountsummaries;
    class Resource$Management$Accountuserlinks {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'linkId'],
                pathParams: ['accountId', 'linkId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'linkId'],
                pathParams: ['accountId', 'linkId'],
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
    analytics_v3.Resource$Management$Accountuserlinks = Resource$Management$Accountuserlinks;
    class Resource$Management$Clientid {
        context;
        constructor(context) {
            this.context = context;
        }
        hashClientId(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/clientId:hashClientId').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Management$Clientid = Resource$Management$Clientid;
    class Resource$Management$Customdatasources {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Customdatasources = Resource$Management$Customdatasources;
    class Resource$Management$Customdimensions {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
                pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
                pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDimensions/{customDimensionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customDimensionId'],
                pathParams: ['accountId', 'customDimensionId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Customdimensions = Resource$Management$Customdimensions;
    class Resource$Management$Custommetrics {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
                pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
                pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customMetrics/{customMetricId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customMetricId'],
                pathParams: ['accountId', 'customMetricId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Custommetrics = Resource$Management$Custommetrics;
    class Resource$Management$Experiments {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'experimentId',
                ],
                pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'experimentId',
                ],
                pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'experimentId',
                ],
                pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/experiments/{experimentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'experimentId',
                ],
                pathParams: ['accountId', 'experimentId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Experiments = Resource$Management$Experiments;
    class Resource$Management$Filters {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/filters/{filterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'filterId'],
                pathParams: ['accountId', 'filterId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/filters/{filterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'filterId'],
                pathParams: ['accountId', 'filterId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/accounts/{accountId}/filters').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/accounts/{accountId}/filters').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/filters/{filterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'filterId'],
                pathParams: ['accountId', 'filterId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/filters/{filterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'filterId'],
                pathParams: ['accountId', 'filterId'],
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
    analytics_v3.Resource$Management$Filters = Resource$Management$Filters;
    class Resource$Management$Goals {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
                pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
                pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals/{goalId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'goalId'],
                pathParams: ['accountId', 'goalId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Goals = Resource$Management$Goals;
    class Resource$Management$Profilefilterlinks {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/profileFilterLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Profilefilterlinks = Resource$Management$Profilefilterlinks;
    class Resource$Management$Profiles {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Profiles = Resource$Management$Profiles;
    class Resource$Management$Profileuserlinks {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Profileuserlinks = Resource$Management$Profileuserlinks;
    class Resource$Management$Remarketingaudience {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
                pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
                pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
                pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/remarketingAudiences/{remarketingAudienceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'remarketingAudienceId'],
                pathParams: ['accountId', 'remarketingAudienceId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Remarketingaudience = Resource$Management$Remarketingaudience;
    class Resource$Management$Segments {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/management/segments').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Management$Segments = Resource$Management$Segments;
    class Resource$Management$Unsampledreports {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports/{unsampledReportId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'unsampledReportId',
                ],
                pathParams: [
                    'accountId',
                    'profileId',
                    'unsampledReportId',
                    'webPropertyId',
                ],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports/{unsampledReportId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'profileId',
                    'unsampledReportId',
                ],
                pathParams: [
                    'accountId',
                    'profileId',
                    'unsampledReportId',
                    'webPropertyId',
                ],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/unsampledReports').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'profileId'],
                pathParams: ['accountId', 'profileId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Unsampledreports = Resource$Management$Unsampledreports;
    class Resource$Management$Uploads {
        context;
        constructor(context) {
            this.context = context;
        }
        deleteUploadData(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/deleteUploadData').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
                pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads/{uploadId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'customDataSourceId',
                    'uploadId',
                ],
                pathParams: [
                    'accountId',
                    'customDataSourceId',
                    'uploadId',
                    'webPropertyId',
                ],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
                pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        uploadData(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                mediaUrl: (rootUrl +
                    '/upload/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/customDataSources/{customDataSourceId}/uploads').replace(/([^:]\/)\/+/g, '$1'),
                requiredParams: ['accountId', 'webPropertyId', 'customDataSourceId'],
                pathParams: ['accountId', 'customDataSourceId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Uploads = Resource$Management$Uploads;
    class Resource$Management$Webproperties {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId'],
                pathParams: ['accountId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Webproperties = Resource$Management$Webproperties;
    class Resource$Management$Webpropertyadwordslinks {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'webPropertyAdWordsLinkId',
                ],
                pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'webPropertyAdWordsLinkId',
                ],
                pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'webPropertyAdWordsLinkId',
                ],
                pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityAdWordsLinks/{webPropertyAdWordsLinkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'accountId',
                    'webPropertyId',
                    'webPropertyAdWordsLinkId',
                ],
                pathParams: ['accountId', 'webPropertyAdWordsLinkId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Webpropertyadwordslinks = Resource$Management$Webpropertyadwordslinks;
    class Resource$Management$Webpropertyuserlinks {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'webPropertyId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        insert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId'],
                pathParams: ['accountId', 'webPropertyId'],
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/analytics/v3/management/accounts/{accountId}/webproperties/{webPropertyId}/entityUserLinks/{linkId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'webPropertyId', 'linkId'],
                pathParams: ['accountId', 'linkId', 'webPropertyId'],
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
    analytics_v3.Resource$Management$Webpropertyuserlinks = Resource$Management$Webpropertyuserlinks;
    class Resource$Metadata {
        context;
        columns;
        constructor(context) {
            this.context = context;
            this.columns = new Resource$Metadata$Columns(this.context);
        }
    }
    analytics_v3.Resource$Metadata = Resource$Metadata;
    class Resource$Metadata$Columns {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/metadata/{reportType}/columns').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['reportType'],
                pathParams: ['reportType'],
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
    analytics_v3.Resource$Metadata$Columns = Resource$Metadata$Columns;
    class Resource$Provisioning {
        context;
        constructor(context) {
            this.context = context;
        }
        createAccountTicket(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/provisioning/createAccountTicket').replace(/([^:]\/)\/+/g, '$1'),
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
        createAccountTree(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/provisioning/createAccountTree').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Provisioning = Resource$Provisioning;
    class Resource$Userdeletion {
        context;
        userDeletionRequest;
        constructor(context) {
            this.context = context;
            this.userDeletionRequest = new Resource$Userdeletion$Userdeletionrequest(this.context);
        }
    }
    analytics_v3.Resource$Userdeletion = Resource$Userdeletion;
    class Resource$Userdeletion$Userdeletionrequest {
        context;
        constructor(context) {
            this.context = context;
        }
        upsert(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://analytics.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/analytics/v3/userDeletion/userDeletionRequests:upsert').replace(/([^:]\/)\/+/g, '$1'),
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
    analytics_v3.Resource$Userdeletion$Userdeletionrequest = Resource$Userdeletion$Userdeletionrequest;
})(analytics_v3 || (exports.analytics_v3 = analytics_v3 = {}));
