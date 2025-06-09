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
exports.acmedns_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var acmedns_v1;
(function (acmedns_v1) {
    /**
     * ACME DNS API
     *
     * Google Domains ACME DNS API that allows users to complete ACME DNS-01 challenges for a domain.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const acmedns = google.acmedns('v1');
     * ```
     */
    class Acmedns {
        context;
        acmeChallengeSets;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.acmeChallengeSets = new Resource$Acmechallengesets(this.context);
        }
    }
    acmedns_v1.Acmedns = Acmedns;
    class Resource$Acmechallengesets {
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
            const rootUrl = options.rootUrl || 'https://acmedns.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/acmeChallengeSets/{rootDomain}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['rootDomain'],
                pathParams: ['rootDomain'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        rotateChallenges(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://acmedns.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/acmeChallengeSets/{rootDomain}:rotateChallenges').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['rootDomain'],
                pathParams: ['rootDomain'],
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
    acmedns_v1.Resource$Acmechallengesets = Resource$Acmechallengesets;
})(acmedns_v1 || (exports.acmedns_v1 = acmedns_v1 = {}));
