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
exports.tagmanager_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var tagmanager_v1;
(function (tagmanager_v1) {
    /**
     * Tag Manager API
     *
     * This API allows clients to access and modify container and tag configuration.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const tagmanager = google.tagmanager('v1');
     * ```
     */
    class Tagmanager {
        context;
        accounts;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.accounts = new Resource$Accounts(this.context);
        }
    }
    tagmanager_v1.Tagmanager = Tagmanager;
    class Resource$Accounts {
        context;
        containers;
        permissions;
        constructor(context) {
            this.context = context;
            this.containers = new Resource$Accounts$Containers(this.context);
            this.permissions = new Resource$Accounts$Permissions(this.context);
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
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
    tagmanager_v1.Resource$Accounts = Resource$Accounts;
    class Resource$Accounts$Containers {
        context;
        environments;
        folders;
        move_folders;
        reauthorize_environments;
        tags;
        triggers;
        variables;
        versions;
        constructor(context) {
            this.context = context;
            this.environments = new Resource$Accounts$Containers$Environments(this.context);
            this.folders = new Resource$Accounts$Containers$Folders(this.context);
            this.move_folders = new Resource$Accounts$Containers$Move_folders(this.context);
            this.reauthorize_environments =
                new Resource$Accounts$Containers$Reauthorize_environments(this.context);
            this.tags = new Resource$Accounts$Containers$Tags(this.context);
            this.triggers = new Resource$Accounts$Containers$Triggers(this.context);
            this.variables = new Resource$Accounts$Containers$Variables(this.context);
            this.versions = new Resource$Accounts$Containers$Versions(this.context);
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}/containers').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}/containers').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
    tagmanager_v1.Resource$Accounts$Containers = Resource$Accounts$Containers;
    class Resource$Accounts$Containers$Environments {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'environmentId'],
                pathParams: ['accountId', 'containerId', 'environmentId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'environmentId'],
                pathParams: ['accountId', 'containerId', 'environmentId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/environments/{environmentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'environmentId'],
                pathParams: ['accountId', 'containerId', 'environmentId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Environments = Resource$Accounts$Containers$Environments;
    class Resource$Accounts$Containers$Folders {
        context;
        entities;
        constructor(context) {
            this.context = context;
            this.entities = new Resource$Accounts$Containers$Folders$Entities(this.context);
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'folderId'],
                pathParams: ['accountId', 'containerId', 'folderId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'folderId'],
                pathParams: ['accountId', 'containerId', 'folderId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'folderId'],
                pathParams: ['accountId', 'containerId', 'folderId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Folders = Resource$Accounts$Containers$Folders;
    class Resource$Accounts$Containers$Folders$Entities {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/folders/{folderId}/entities').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'folderId'],
                pathParams: ['accountId', 'containerId', 'folderId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Folders$Entities = Resource$Accounts$Containers$Folders$Entities;
    class Resource$Accounts$Containers$Move_folders {
        context;
        constructor(context) {
            this.context = context;
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/move_folders/{folderId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'folderId'],
                pathParams: ['accountId', 'containerId', 'folderId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Move_folders = Resource$Accounts$Containers$Move_folders;
    class Resource$Accounts$Containers$Reauthorize_environments {
        context;
        constructor(context) {
            this.context = context;
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/reauthorize_environments/{environmentId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'environmentId'],
                pathParams: ['accountId', 'containerId', 'environmentId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Reauthorize_environments = Resource$Accounts$Containers$Reauthorize_environments;
    class Resource$Accounts$Containers$Tags {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'tagId'],
                pathParams: ['accountId', 'containerId', 'tagId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'tagId'],
                pathParams: ['accountId', 'containerId', 'tagId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/tags/{tagId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'tagId'],
                pathParams: ['accountId', 'containerId', 'tagId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Tags = Resource$Accounts$Containers$Tags;
    class Resource$Accounts$Containers$Triggers {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'triggerId'],
                pathParams: ['accountId', 'containerId', 'triggerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'triggerId'],
                pathParams: ['accountId', 'containerId', 'triggerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/triggers/{triggerId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'triggerId'],
                pathParams: ['accountId', 'containerId', 'triggerId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Triggers = Resource$Accounts$Containers$Triggers;
    class Resource$Accounts$Containers$Variables {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'variableId'],
                pathParams: ['accountId', 'containerId', 'variableId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'variableId'],
                pathParams: ['accountId', 'containerId', 'variableId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/variables/{variableId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'variableId'],
                pathParams: ['accountId', 'containerId', 'variableId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Variables = Resource$Accounts$Containers$Variables;
    class Resource$Accounts$Containers$Versions {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId'],
                pathParams: ['accountId', 'containerId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        publish(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/publish').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        restore(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/restore').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        undelete(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}/undelete').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/containers/{containerId}/versions/{containerVersionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'containerId', 'containerVersionId'],
                pathParams: ['accountId', 'containerId', 'containerVersionId'],
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
    tagmanager_v1.Resource$Accounts$Containers$Versions = Resource$Accounts$Containers$Versions;
    class Resource$Accounts$Permissions {
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}/permissions').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'DELETE',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'permissionId'],
                pathParams: ['accountId', 'permissionId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'permissionId'],
                pathParams: ['accountId', 'permissionId'],
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/tagmanager/v1/accounts/{accountId}/permissions').replace(/([^:]\/)\/+/g, '$1'),
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
            const rootUrl = options.rootUrl || 'https://tagmanager.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/tagmanager/v1/accounts/{accountId}/permissions/{permissionId}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PUT',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['accountId', 'permissionId'],
                pathParams: ['accountId', 'permissionId'],
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
    tagmanager_v1.Resource$Accounts$Permissions = Resource$Accounts$Permissions;
})(tagmanager_v1 || (exports.tagmanager_v1 = tagmanager_v1 = {}));
