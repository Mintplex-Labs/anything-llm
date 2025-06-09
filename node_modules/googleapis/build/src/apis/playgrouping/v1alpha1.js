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
exports.playgrouping_v1alpha1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var playgrouping_v1alpha1;
(function (playgrouping_v1alpha1) {
    /**
     * Google Play Grouping API
     *
     * playgrouping.googleapis.com API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const playgrouping = google.playgrouping('v1alpha1');
     * ```
     */
    class Playgrouping {
        context;
        apps;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.apps = new Resource$Apps(this.context);
        }
    }
    playgrouping_v1alpha1.Playgrouping = Playgrouping;
    class Resource$Apps {
        context;
        tokens;
        constructor(context) {
            this.context = context;
            this.tokens = new Resource$Apps$Tokens(this.context);
        }
    }
    playgrouping_v1alpha1.Resource$Apps = Resource$Apps;
    class Resource$Apps$Tokens {
        context;
        tags;
        constructor(context) {
            this.context = context;
            this.tags = new Resource$Apps$Tokens$Tags(this.context);
        }
        verify(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://playgrouping.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1alpha1/{+appPackage}/{+token}:verify').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['appPackage', 'token'],
                pathParams: ['appPackage', 'token'],
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
    playgrouping_v1alpha1.Resource$Apps$Tokens = Resource$Apps$Tokens;
    class Resource$Apps$Tokens$Tags {
        context;
        constructor(context) {
            this.context = context;
        }
        createOrUpdate(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://playgrouping.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1alpha1/{+appPackage}/{+token}/tags:createOrUpdate').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['appPackage', 'token'],
                pathParams: ['appPackage', 'token'],
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
    playgrouping_v1alpha1.Resource$Apps$Tokens$Tags = Resource$Apps$Tokens$Tags;
})(playgrouping_v1alpha1 || (exports.playgrouping_v1alpha1 = playgrouping_v1alpha1 = {}));
