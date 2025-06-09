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
exports.safebrowsing_v4 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var safebrowsing_v4;
(function (safebrowsing_v4) {
    /**
     * Safe Browsing API
     *
     * Enables client applications to check web resources (most commonly URLs) against Google-generated lists of unsafe web resources. The Safe Browsing APIs are for non-commercial use only. If you need to use APIs to detect malicious URLs for commercial purposes – meaning “for sale or revenue-generating purposes” – please refer to the Web Risk API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const safebrowsing = google.safebrowsing('v4');
     * ```
     */
    class Safebrowsing {
        context;
        encodedFullHashes;
        encodedUpdates;
        fullHashes;
        threatHits;
        threatLists;
        threatListUpdates;
        threatMatches;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.encodedFullHashes = new Resource$Encodedfullhashes(this.context);
            this.encodedUpdates = new Resource$Encodedupdates(this.context);
            this.fullHashes = new Resource$Fullhashes(this.context);
            this.threatHits = new Resource$Threathits(this.context);
            this.threatLists = new Resource$Threatlists(this.context);
            this.threatListUpdates = new Resource$Threatlistupdates(this.context);
            this.threatMatches = new Resource$Threatmatches(this.context);
        }
    }
    safebrowsing_v4.Safebrowsing = Safebrowsing;
    class Resource$Encodedfullhashes {
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/encodedFullHashes/{encodedRequest}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['encodedRequest'],
                pathParams: ['encodedRequest'],
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
    safebrowsing_v4.Resource$Encodedfullhashes = Resource$Encodedfullhashes;
    class Resource$Encodedupdates {
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/encodedUpdates/{encodedRequest}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['encodedRequest'],
                pathParams: ['encodedRequest'],
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
    safebrowsing_v4.Resource$Encodedupdates = Resource$Encodedupdates;
    class Resource$Fullhashes {
        context;
        constructor(context) {
            this.context = context;
        }
        find(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/fullHashes:find').replace(/([^:]\/)\/+/g, '$1'),
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
    safebrowsing_v4.Resource$Fullhashes = Resource$Fullhashes;
    class Resource$Threathits {
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/threatHits').replace(/([^:]\/)\/+/g, '$1'),
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
    safebrowsing_v4.Resource$Threathits = Resource$Threathits;
    class Resource$Threatlists {
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
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/threatLists').replace(/([^:]\/)\/+/g, '$1'),
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
    safebrowsing_v4.Resource$Threatlists = Resource$Threatlists;
    class Resource$Threatlistupdates {
        context;
        constructor(context) {
            this.context = context;
        }
        fetch(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/threatListUpdates:fetch').replace(/([^:]\/)\/+/g, '$1'),
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
    safebrowsing_v4.Resource$Threatlistupdates = Resource$Threatlistupdates;
    class Resource$Threatmatches {
        context;
        constructor(context) {
            this.context = context;
        }
        find(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://safebrowsing.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v4/threatMatches:find').replace(/([^:]\/)\/+/g, '$1'),
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
    safebrowsing_v4.Resource$Threatmatches = Resource$Threatmatches;
})(safebrowsing_v4 || (exports.safebrowsing_v4 = safebrowsing_v4 = {}));
