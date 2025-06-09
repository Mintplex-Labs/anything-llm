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
exports.androidenterprise_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var androidenterprise_v1;
(function (androidenterprise_v1) {
    /**
     * Google Play EMM API
     *
     * Manages the deployment of apps to Android Enterprise devices.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const androidenterprise = google.androidenterprise('v1');
     * ```
     */
    class Androidenterprise {
        context;
        devices;
        enrollmentTokens;
        enterprises;
        entitlements;
        grouplicenses;
        grouplicenseusers;
        installs;
        managedconfigurationsfordevice;
        managedconfigurationsforuser;
        managedconfigurationssettings;
        permissions;
        products;
        serviceaccountkeys;
        storelayoutclusters;
        storelayoutpages;
        users;
        webapps;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.devices = new Resource$Devices(this.context);
            this.enrollmentTokens = new Resource$Enrollmenttokens(this.context);
            this.enterprises = new Resource$Enterprises(this.context);
            this.entitlements = new Resource$Entitlements(this.context);
            this.grouplicenses = new Resource$Grouplicenses(this.context);
            this.grouplicenseusers = new Resource$Grouplicenseusers(this.context);
            this.installs = new Resource$Installs(this.context);
            this.managedconfigurationsfordevice =
                new Resource$Managedconfigurationsfordevice(this.context);
            this.managedconfigurationsforuser =
                new Resource$Managedconfigurationsforuser(this.context);
            this.managedconfigurationssettings =
                new Resource$Managedconfigurationssettings(this.context);
            this.permissions = new Resource$Permissions(this.context);
            this.products = new Resource$Products(this.context);
            this.serviceaccountkeys = new Resource$Serviceaccountkeys(this.context);
            this.storelayoutclusters = new Resource$Storelayoutclusters(this.context);
            this.storelayoutpages = new Resource$Storelayoutpages(this.context);
            this.users = new Resource$Users(this.context);
            this.webapps = new Resource$Webapps(this.context);
        }
    }
    androidenterprise_v1.Androidenterprise = Androidenterprise;
    class Resource$Devices {
        context;
        constructor(context) {
            this.context = context;
        }
        forceReportUpload(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/forceReportUpload').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getState(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/state').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        setState(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/state').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
    androidenterprise_v1.Resource$Devices = Resource$Devices;
    class Resource$Enrollmenttokens {
        context;
        constructor(context) {
            this.context = context;
        }
        create(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/enrollmentTokens').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
    androidenterprise_v1.Resource$Enrollmenttokens = Resource$Enrollmenttokens;
    class Resource$Enterprises {
        context;
        constructor(context) {
            this.context = context;
        }
        acknowledgeNotificationSet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/acknowledgeNotificationSet').replace(/([^:]\/)\/+/g, '$1'),
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
        completeSignup(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/completeSignup').replace(/([^:]\/)\/+/g, '$1'),
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
        createWebToken(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/createWebToken').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        enroll(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/enroll').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['token'],
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
        generateEnterpriseUpgradeUrl(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/generateEnterpriseUpgradeUrl').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        generateSignupUrl(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/signupUrl').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/{enterpriseId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getServiceAccount(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccount').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getStoreLayout(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['domain'],
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
        pullNotificationSet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/pullNotificationSet').replace(/([^:]\/)\/+/g, '$1'),
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
        sendTestPushNotification(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/sendTestPushNotification').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        setAccount(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/account').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        setStoreLayout(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        unenroll(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/unenroll').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
    androidenterprise_v1.Resource$Enterprises = Resource$Enterprises;
    class Resource$Entitlements {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
                pathParams: ['enterpriseId', 'entitlementId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
                pathParams: ['enterpriseId', 'entitlementId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/entitlements/{entitlementId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'entitlementId'],
                pathParams: ['enterpriseId', 'entitlementId', 'userId'],
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
    androidenterprise_v1.Resource$Entitlements = Resource$Entitlements;
    class Resource$Grouplicenses {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses/{groupLicenseId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'groupLicenseId'],
                pathParams: ['enterpriseId', 'groupLicenseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
    androidenterprise_v1.Resource$Grouplicenses = Resource$Grouplicenses;
    class Resource$Grouplicenseusers {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/groupLicenses/{groupLicenseId}/users').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'groupLicenseId'],
                pathParams: ['enterpriseId', 'groupLicenseId'],
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
    androidenterprise_v1.Resource$Grouplicenseusers = Resource$Grouplicenseusers;
    class Resource$Installs {
        context;
        constructor(context) {
            this.context = context;
        }
        delete(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
                pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
                pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/installs/{installId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId', 'installId'],
                pathParams: ['deviceId', 'enterpriseId', 'installId', 'userId'],
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
    androidenterprise_v1.Resource$Installs = Resource$Installs;
    class Resource$Managedconfigurationsfordevice {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'deviceId',
                    'managedConfigurationForDeviceId',
                ],
                pathParams: [
                    'deviceId',
                    'enterpriseId',
                    'managedConfigurationForDeviceId',
                    'userId',
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'deviceId',
                    'managedConfigurationForDeviceId',
                ],
                pathParams: [
                    'deviceId',
                    'enterpriseId',
                    'managedConfigurationForDeviceId',
                    'userId',
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId', 'deviceId'],
                pathParams: ['deviceId', 'enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/devices/{deviceId}/managedConfigurationsForDevice/{managedConfigurationForDeviceId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'deviceId',
                    'managedConfigurationForDeviceId',
                ],
                pathParams: [
                    'deviceId',
                    'enterpriseId',
                    'managedConfigurationForDeviceId',
                    'userId',
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
    }
    androidenterprise_v1.Resource$Managedconfigurationsfordevice = Resource$Managedconfigurationsfordevice;
    class Resource$Managedconfigurationsforuser {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'managedConfigurationForUserId',
                ],
                pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'managedConfigurationForUserId',
                ],
                pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/managedConfigurationsForUser/{managedConfigurationForUserId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [
                    'enterpriseId',
                    'userId',
                    'managedConfigurationForUserId',
                ],
                pathParams: ['enterpriseId', 'managedConfigurationForUserId', 'userId'],
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
    androidenterprise_v1.Resource$Managedconfigurationsforuser = Resource$Managedconfigurationsforuser;
    class Resource$Managedconfigurationssettings {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/managedConfigurationsSettings').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
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
    androidenterprise_v1.Resource$Managedconfigurationssettings = Resource$Managedconfigurationssettings;
    class Resource$Permissions {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/permissions/{permissionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['permissionId'],
                pathParams: ['permissionId'],
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
    androidenterprise_v1.Resource$Permissions = Resource$Permissions;
    class Resource$Products {
        context;
        constructor(context) {
            this.context = context;
        }
        approve(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/approve').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        generateApprovalUrl(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/generateApprovalUrl').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getAppRestrictionsSchema(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/appRestrictionsSchema').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getPermissions(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/permissions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        unapprove(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/products/{productId}/unapprove').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'productId'],
                pathParams: ['enterpriseId', 'productId'],
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
    androidenterprise_v1.Resource$Products = Resource$Products;
    class Resource$Serviceaccountkeys {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys/{keyId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'keyId'],
                pathParams: ['enterpriseId', 'keyId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/serviceAccountKeys').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
    androidenterprise_v1.Resource$Serviceaccountkeys = Resource$Serviceaccountkeys;
    class Resource$Storelayoutclusters {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
                pathParams: ['clusterId', 'enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
                pathParams: ['clusterId', 'enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId'],
                pathParams: ['enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId'],
                pathParams: ['enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}/clusters/{clusterId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId', 'clusterId'],
                pathParams: ['clusterId', 'enterpriseId', 'pageId'],
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
    androidenterprise_v1.Resource$Storelayoutclusters = Resource$Storelayoutclusters;
    class Resource$Storelayoutpages {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId'],
                pathParams: ['enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId'],
                pathParams: ['enterpriseId', 'pageId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/storeLayout/pages/{pageId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'pageId'],
                pathParams: ['enterpriseId', 'pageId'],
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
    androidenterprise_v1.Resource$Storelayoutpages = Resource$Storelayoutpages;
    class Resource$Users {
        context;
        constructor(context) {
            this.context = context;
        }
        delete(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        generateAuthenticationToken(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/authenticationToken').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        getAvailableProductSet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/availableProductSet').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/{enterpriseId}/users').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/androidenterprise/v1/enterprises/{enterpriseId}/users').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'email'],
                pathParams: ['enterpriseId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        revokeDeviceAccess(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/deviceAccess').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        setAvailableProductSet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}/availableProductSet').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/users/{userId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'userId'],
                pathParams: ['enterpriseId', 'userId'],
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
    androidenterprise_v1.Resource$Users = Resource$Users;
    class Resource$Webapps {
        context;
        constructor(context) {
            this.context = context;
        }
        delete(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/webApps/{webAppId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'webAppId'],
                pathParams: ['enterpriseId', 'webAppId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/webApps/{webAppId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'webAppId'],
                pathParams: ['enterpriseId', 'webAppId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/webApps').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/webApps').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId'],
                pathParams: ['enterpriseId'],
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
            const rootUrl = options.rootUrl || 'https://androidenterprise.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/androidenterprise/v1/enterprises/{enterpriseId}/webApps/{webAppId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['enterpriseId', 'webAppId'],
                pathParams: ['enterpriseId', 'webAppId'],
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
    androidenterprise_v1.Resource$Webapps = Resource$Webapps;
})(androidenterprise_v1 || (exports.androidenterprise_v1 = androidenterprise_v1 = {}));
