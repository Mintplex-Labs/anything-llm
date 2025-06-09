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
exports.reseller_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var reseller_v1;
(function (reseller_v1) {
    /**
     * Google Workspace Reseller API
     *
     * Perform common functions that are available on the Channel Services console at scale, like placing orders and viewing customer information
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const reseller = google.reseller('v1');
     * ```
     */
    class Reseller {
        context;
        customers;
        resellernotify;
        subscriptions;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.customers = new Resource$Customers(this.context);
            this.resellernotify = new Resource$Resellernotify(this.context);
            this.subscriptions = new Resource$Subscriptions(this.context);
        }
    }
    reseller_v1.Reseller = Reseller;
    class Resource$Customers {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/customers/{customerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId'],
                pathParams: ['customerId'],
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/customers').replace(/([^:]\/)\/+/g, '$1'),
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
        patch(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/customers/{customerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId'],
                pathParams: ['customerId'],
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/customers/{customerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId'],
                pathParams: ['customerId'],
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
    reseller_v1.Resource$Customers = Resource$Customers;
    class Resource$Resellernotify {
        context;
        constructor(context) {
            this.context = context;
        }
        getwatchdetails(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/resellernotify/getwatchdetails').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/resellernotify/register').replace(/([^:]\/)\/+/g, '$1'),
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
        unregister(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/resellernotify/unregister').replace(/([^:]\/)\/+/g, '$1'),
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
    reseller_v1.Resource$Resellernotify = Resource$Resellernotify;
    class Resource$Subscriptions {
        context;
        constructor(context) {
            this.context = context;
        }
        activate(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/activate').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        changePlan(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changePlan').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        changeRenewalSettings(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changeRenewalSettings').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        changeSeats(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/changeSeats').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId', 'deletionType'],
                pathParams: ['customerId', 'subscriptionId'],
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/customers/{customerId}/subscriptions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId'],
                pathParams: ['customerId'],
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/apps/reseller/v1/subscriptions').replace(/([^:]\/)\/+/g, '$1'),
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
        startPaidService(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/startPaidService').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        suspend(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://reseller.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/apps/reseller/v1/customers/{customerId}/subscriptions/{subscriptionId}/suspend').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['customerId', 'subscriptionId'],
                pathParams: ['customerId', 'subscriptionId'],
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
    reseller_v1.Resource$Subscriptions = Resource$Subscriptions;
})(reseller_v1 || (exports.reseller_v1 = reseller_v1 = {}));
