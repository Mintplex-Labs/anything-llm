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
exports.sts_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var sts_v1;
(function (sts_v1) {
    /**
     * Security Token Service API
     *
     * The Security Token Service exchanges Google or third-party credentials for a short-lived access token to Google Cloud resources.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const sts = google.sts('v1');
     * ```
     */
    class Sts {
        context;
        v1;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.v1 = new Resource$V1(this.context);
        }
    }
    sts_v1.Sts = Sts;
    class Resource$V1 {
        context;
        constructor(context) {
            this.context = context;
        }
        token(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://sts.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/token').replace(/([^:]\/)\/+/g, '$1'),
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
    sts_v1.Resource$V1 = Resource$V1;
})(sts_v1 || (exports.sts_v1 = sts_v1 = {}));
