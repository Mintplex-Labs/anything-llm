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
exports.adexchangebuyer2_v2beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var adexchangebuyer2_v2beta1;
(function (adexchangebuyer2_v2beta1) {
    /**
     * Ad Exchange Buyer API II
     *
     * Accesses the latest features for managing Authorized Buyers accounts, Real-Time Bidding configurations and auction metrics, and Marketplace programmatic deals.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const adexchangebuyer2 = google.adexchangebuyer2('v2beta1');
     * ```
     */
    class Adexchangebuyer2 {
        context;
        accounts;
        bidders;
        buyers;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.accounts = new Resource$Accounts(this.context);
            this.bidders = new Resource$Bidders(this.context);
            this.buyers = new Resource$Buyers(this.context);
        }
    }
    adexchangebuyer2_v2beta1.Adexchangebuyer2 = Adexchangebuyer2;
    class Resource$Accounts {
        context;
        clients;
        creatives;
        finalizedProposals;
        products;
        proposals;
        publisherProfiles;
        constructor(context) {
            this.context = context;
            this.clients = new Resource$Accounts$Clients(this.context);
            this.creatives = new Resource$Accounts$Creatives(this.context);
            this.finalizedProposals = new Resource$Accounts$Finalizedproposals(this.context);
            this.products = new Resource$Accounts$Products(this.context);
            this.proposals = new Resource$Accounts$Proposals(this.context);
            this.publisherProfiles = new Resource$Accounts$Publisherprofiles(this.context);
        }
    }
    adexchangebuyer2_v2beta1.Resource$Accounts = Resource$Accounts;
    class Resource$Accounts$Clients {
        context;
        invitations;
        users;
        constructor(context) {
            this.context = context;
            this.invitations = new Resource$Accounts$Clients$Invitations(this.context);
            this.users = new Resource$Accounts$Clients$Users(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/clients').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId'],
                pathParams: ['accountId', 'clientAccountId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/clients').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId'],
                pathParams: ['accountId', 'clientAccountId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Clients = Resource$Accounts$Clients;
    class Resource$Accounts$Clients$Invitations {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId'],
                pathParams: ['accountId', 'clientAccountId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations/{invitationId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId', 'invitationId'],
                pathParams: ['accountId', 'clientAccountId', 'invitationId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/invitations').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId'],
                pathParams: ['accountId', 'clientAccountId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Clients$Invitations = Resource$Accounts$Clients$Invitations;
    class Resource$Accounts$Clients$Users {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users/{userId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId', 'userId'],
                pathParams: ['accountId', 'clientAccountId', 'userId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId'],
                pathParams: ['accountId', 'clientAccountId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/clients/{clientAccountId}/users/{userId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'clientAccountId', 'userId'],
                pathParams: ['accountId', 'clientAccountId', 'userId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Clients$Users = Resource$Accounts$Clients$Users;
    class Resource$Accounts$Creatives {
        context;
        dealAssociations;
        constructor(context) {
            this.context = context;
            this.dealAssociations = new Resource$Accounts$Creatives$Dealassociations(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/creatives').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/creatives/{creativeId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/creatives').replace(/([^:]\/)\/+/g, '$1'),
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
        stopWatching(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/creatives/{creativeId}:stopWatching').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/creatives/{creativeId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/creatives/{creativeId}:watch').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Creatives = Resource$Accounts$Creatives;
    class Resource$Accounts$Creatives$Dealassociations {
        context;
        constructor(context) {
            this.context = context;
        }
        add(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/creatives/{creativeId}/dealAssociations:add').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/creatives/{creativeId}/dealAssociations').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        remove(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/creatives/{creativeId}/dealAssociations:remove').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'creativeId'],
                pathParams: ['accountId', 'creativeId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Creatives$Dealassociations = Resource$Accounts$Creatives$Dealassociations;
    class Resource$Accounts$Finalizedproposals {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/finalizedProposals').replace(/([^:]\/)\/+/g, '$1'),
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
        pause(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/finalizedProposals/{proposalId}:pause').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        resume(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/finalizedProposals/{proposalId}:resume').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Finalizedproposals = Resource$Accounts$Finalizedproposals;
    class Resource$Accounts$Products {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/products/{productId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'productId'],
                pathParams: ['accountId', 'productId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/products').replace(/([^:]\/)\/+/g, '$1'),
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
    }
    adexchangebuyer2_v2beta1.Resource$Accounts$Products = Resource$Accounts$Products;
    class Resource$Accounts$Proposals {
        context;
        constructor(context) {
            this.context = context;
        }
        accept(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:accept').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        addNote(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:addNote').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        cancelNegotiation(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:cancelNegotiation').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        completeSetup(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:completeSetup').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/proposals').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/proposals/{proposalId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/proposals').replace(/([^:]\/)\/+/g, '$1'),
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
        pause(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:pause').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        resume(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/proposals/{proposalId}:resume').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/proposals/{proposalId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'proposalId'],
                pathParams: ['accountId', 'proposalId'],
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
    adexchangebuyer2_v2beta1.Resource$Accounts$Proposals = Resource$Accounts$Proposals;
    class Resource$Accounts$Publisherprofiles {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/accounts/{accountId}/publisherProfiles/{publisherProfileId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'publisherProfileId'],
                pathParams: ['accountId', 'publisherProfileId'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/accounts/{accountId}/publisherProfiles').replace(/([^:]\/)\/+/g, '$1'),
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
    }
    adexchangebuyer2_v2beta1.Resource$Accounts$Publisherprofiles = Resource$Accounts$Publisherprofiles;
    class Resource$Bidders {
        context;
        accounts;
        filterSets;
        constructor(context) {
            this.context = context;
            this.accounts = new Resource$Bidders$Accounts(this.context);
            this.filterSets = new Resource$Bidders$Filtersets(this.context);
        }
    }
    adexchangebuyer2_v2beta1.Resource$Bidders = Resource$Bidders;
    class Resource$Bidders$Accounts {
        context;
        filterSets;
        constructor(context) {
            this.context = context;
            this.filterSets = new Resource$Bidders$Accounts$Filtersets(this.context);
        }
    }
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts = Resource$Bidders$Accounts;
    class Resource$Bidders$Accounts$Filtersets {
        context;
        bidMetrics;
        bidResponseErrors;
        bidResponsesWithoutBids;
        filteredBidRequests;
        filteredBids;
        impressionMetrics;
        losingBids;
        nonBillableWinningBids;
        constructor(context) {
            this.context = context;
            this.bidMetrics = new Resource$Bidders$Accounts$Filtersets$Bidmetrics(this.context);
            this.bidResponseErrors =
                new Resource$Bidders$Accounts$Filtersets$Bidresponseerrors(this.context);
            this.bidResponsesWithoutBids =
                new Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids(this.context);
            this.filteredBidRequests =
                new Resource$Bidders$Accounts$Filtersets$Filteredbidrequests(this.context);
            this.filteredBids = new Resource$Bidders$Accounts$Filtersets$Filteredbids(this.context);
            this.impressionMetrics =
                new Resource$Bidders$Accounts$Filtersets$Impressionmetrics(this.context);
            this.losingBids = new Resource$Bidders$Accounts$Filtersets$Losingbids(this.context);
            this.nonBillableWinningBids =
                new Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets = Resource$Bidders$Accounts$Filtersets;
    class Resource$Bidders$Accounts$Filtersets$Bidmetrics {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Bidmetrics = Resource$Bidders$Accounts$Filtersets$Bidmetrics;
    class Resource$Bidders$Accounts$Filtersets$Bidresponseerrors {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponseErrors').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Bidresponseerrors = Resource$Bidders$Accounts$Filtersets$Bidresponseerrors;
    class Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponsesWithoutBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids = Resource$Bidders$Accounts$Filtersets$Bidresponseswithoutbids;
    class Resource$Bidders$Accounts$Filtersets$Filteredbidrequests {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBidRequests').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Filteredbidrequests = Resource$Bidders$Accounts$Filtersets$Filteredbidrequests;
    class Resource$Bidders$Accounts$Filtersets$Filteredbids {
        context;
        creatives;
        details;
        constructor(context) {
            this.context = context;
            this.creatives =
                new Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives(this.context);
            this.details =
                new Resource$Bidders$Accounts$Filtersets$Filteredbids$Details(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Filteredbids = Resource$Bidders$Accounts$Filtersets$Filteredbids;
    class Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/creatives').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives = Resource$Bidders$Accounts$Filtersets$Filteredbids$Creatives;
    class Resource$Bidders$Accounts$Filtersets$Filteredbids$Details {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/details').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Filteredbids$Details = Resource$Bidders$Accounts$Filtersets$Filteredbids$Details;
    class Resource$Bidders$Accounts$Filtersets$Impressionmetrics {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/impressionMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Impressionmetrics = Resource$Bidders$Accounts$Filtersets$Impressionmetrics;
    class Resource$Bidders$Accounts$Filtersets$Losingbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/losingBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Losingbids = Resource$Bidders$Accounts$Filtersets$Losingbids;
    class Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/nonBillableWinningBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids = Resource$Bidders$Accounts$Filtersets$Nonbillablewinningbids;
    class Resource$Bidders$Filtersets {
        context;
        bidMetrics;
        bidResponseErrors;
        bidResponsesWithoutBids;
        filteredBidRequests;
        filteredBids;
        impressionMetrics;
        losingBids;
        nonBillableWinningBids;
        constructor(context) {
            this.context = context;
            this.bidMetrics = new Resource$Bidders$Filtersets$Bidmetrics(this.context);
            this.bidResponseErrors =
                new Resource$Bidders$Filtersets$Bidresponseerrors(this.context);
            this.bidResponsesWithoutBids =
                new Resource$Bidders$Filtersets$Bidresponseswithoutbids(this.context);
            this.filteredBidRequests =
                new Resource$Bidders$Filtersets$Filteredbidrequests(this.context);
            this.filteredBids = new Resource$Bidders$Filtersets$Filteredbids(this.context);
            this.impressionMetrics =
                new Resource$Bidders$Filtersets$Impressionmetrics(this.context);
            this.losingBids = new Resource$Bidders$Filtersets$Losingbids(this.context);
            this.nonBillableWinningBids =
                new Resource$Bidders$Filtersets$Nonbillablewinningbids(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets = Resource$Bidders$Filtersets;
    class Resource$Bidders$Filtersets$Bidmetrics {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Bidmetrics = Resource$Bidders$Filtersets$Bidmetrics;
    class Resource$Bidders$Filtersets$Bidresponseerrors {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponseErrors').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Bidresponseerrors = Resource$Bidders$Filtersets$Bidresponseerrors;
    class Resource$Bidders$Filtersets$Bidresponseswithoutbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponsesWithoutBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Bidresponseswithoutbids = Resource$Bidders$Filtersets$Bidresponseswithoutbids;
    class Resource$Bidders$Filtersets$Filteredbidrequests {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBidRequests').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Filteredbidrequests = Resource$Bidders$Filtersets$Filteredbidrequests;
    class Resource$Bidders$Filtersets$Filteredbids {
        context;
        creatives;
        details;
        constructor(context) {
            this.context = context;
            this.creatives = new Resource$Bidders$Filtersets$Filteredbids$Creatives(this.context);
            this.details = new Resource$Bidders$Filtersets$Filteredbids$Details(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Filteredbids = Resource$Bidders$Filtersets$Filteredbids;
    class Resource$Bidders$Filtersets$Filteredbids$Creatives {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/creatives').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Filteredbids$Creatives = Resource$Bidders$Filtersets$Filteredbids$Creatives;
    class Resource$Bidders$Filtersets$Filteredbids$Details {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/details').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Filteredbids$Details = Resource$Bidders$Filtersets$Filteredbids$Details;
    class Resource$Bidders$Filtersets$Impressionmetrics {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/impressionMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Impressionmetrics = Resource$Bidders$Filtersets$Impressionmetrics;
    class Resource$Bidders$Filtersets$Losingbids {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/losingBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Losingbids = Resource$Bidders$Filtersets$Losingbids;
    class Resource$Bidders$Filtersets$Nonbillablewinningbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/nonBillableWinningBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Bidders$Filtersets$Nonbillablewinningbids = Resource$Bidders$Filtersets$Nonbillablewinningbids;
    class Resource$Buyers {
        context;
        filterSets;
        constructor(context) {
            this.context = context;
            this.filterSets = new Resource$Buyers$Filtersets(this.context);
        }
    }
    adexchangebuyer2_v2beta1.Resource$Buyers = Resource$Buyers;
    class Resource$Buyers$Filtersets {
        context;
        bidMetrics;
        bidResponseErrors;
        bidResponsesWithoutBids;
        filteredBidRequests;
        filteredBids;
        impressionMetrics;
        losingBids;
        nonBillableWinningBids;
        constructor(context) {
            this.context = context;
            this.bidMetrics = new Resource$Buyers$Filtersets$Bidmetrics(this.context);
            this.bidResponseErrors = new Resource$Buyers$Filtersets$Bidresponseerrors(this.context);
            this.bidResponsesWithoutBids =
                new Resource$Buyers$Filtersets$Bidresponseswithoutbids(this.context);
            this.filteredBidRequests =
                new Resource$Buyers$Filtersets$Filteredbidrequests(this.context);
            this.filteredBids = new Resource$Buyers$Filtersets$Filteredbids(this.context);
            this.impressionMetrics = new Resource$Buyers$Filtersets$Impressionmetrics(this.context);
            this.losingBids = new Resource$Buyers$Filtersets$Losingbids(this.context);
            this.nonBillableWinningBids =
                new Resource$Buyers$Filtersets$Nonbillablewinningbids(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+ownerName}/filterSets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['ownerName'],
                pathParams: ['ownerName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets = Resource$Buyers$Filtersets;
    class Resource$Buyers$Filtersets$Bidmetrics {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Bidmetrics = Resource$Buyers$Filtersets$Bidmetrics;
    class Resource$Buyers$Filtersets$Bidresponseerrors {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponseErrors').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Bidresponseerrors = Resource$Buyers$Filtersets$Bidresponseerrors;
    class Resource$Buyers$Filtersets$Bidresponseswithoutbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/bidResponsesWithoutBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Bidresponseswithoutbids = Resource$Buyers$Filtersets$Bidresponseswithoutbids;
    class Resource$Buyers$Filtersets$Filteredbidrequests {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBidRequests').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Filteredbidrequests = Resource$Buyers$Filtersets$Filteredbidrequests;
    class Resource$Buyers$Filtersets$Filteredbids {
        context;
        creatives;
        details;
        constructor(context) {
            this.context = context;
            this.creatives = new Resource$Buyers$Filtersets$Filteredbids$Creatives(this.context);
            this.details = new Resource$Buyers$Filtersets$Filteredbids$Details(this.context);
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/filteredBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Filteredbids = Resource$Buyers$Filtersets$Filteredbids;
    class Resource$Buyers$Filtersets$Filteredbids$Creatives {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/creatives').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Filteredbids$Creatives = Resource$Buyers$Filtersets$Filteredbids$Creatives;
    class Resource$Buyers$Filtersets$Filteredbids$Details {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/v2beta1/{+filterSetName}/filteredBids/{creativeStatusId}/details').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName', 'creativeStatusId'],
                pathParams: ['creativeStatusId', 'filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Filteredbids$Details = Resource$Buyers$Filtersets$Filteredbids$Details;
    class Resource$Buyers$Filtersets$Impressionmetrics {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/impressionMetrics').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Impressionmetrics = Resource$Buyers$Filtersets$Impressionmetrics;
    class Resource$Buyers$Filtersets$Losingbids {
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
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/losingBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Losingbids = Resource$Buyers$Filtersets$Losingbids;
    class Resource$Buyers$Filtersets$Nonbillablewinningbids {
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
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://adexchangebuyer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2beta1/{+filterSetName}/nonBillableWinningBids').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['filterSetName'],
                pathParams: ['filterSetName'],
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
    adexchangebuyer2_v2beta1.Resource$Buyers$Filtersets$Nonbillablewinningbids = Resource$Buyers$Filtersets$Nonbillablewinningbids;
})(adexchangebuyer2_v2beta1 || (exports.adexchangebuyer2_v2beta1 = adexchangebuyer2_v2beta1 = {}));
