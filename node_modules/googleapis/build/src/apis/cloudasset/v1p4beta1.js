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
exports.cloudasset_v1p4beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var cloudasset_v1p4beta1;
(function (cloudasset_v1p4beta1) {
    /**
     * Cloud Asset API
     *
     * The cloud asset API manages the history and inventory of cloud resources.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const cloudasset = google.cloudasset('v1p4beta1');
     * ```
     */
    class Cloudasset {
        context;
        v1p4beta1;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.v1p4beta1 = new Resource$V1p4beta1(this.context);
        }
    }
    cloudasset_v1p4beta1.Cloudasset = Cloudasset;
    class Resource$V1p4beta1 {
        context;
        constructor(context) {
            this.context = context;
        }
        analyzeIamPolicy(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://cloudasset.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1p4beta1/{+parent}:analyzeIamPolicy').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        exportIamPolicyAnalysis(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://cloudasset.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1p4beta1/{+parent}:exportIamPolicyAnalysis').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
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
    cloudasset_v1p4beta1.Resource$V1p4beta1 = Resource$V1p4beta1;
})(cloudasset_v1p4beta1 || (exports.cloudasset_v1p4beta1 = cloudasset_v1p4beta1 = {}));
