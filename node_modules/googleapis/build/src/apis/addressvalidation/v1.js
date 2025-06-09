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
exports.addressvalidation_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var addressvalidation_v1;
(function (addressvalidation_v1) {
    /**
     * Address Validation API
     *
     * The Address Validation API allows developers to verify the accuracy of addresses. Given an address, it returns information about the correctness of the components of the parsed address, a geocode, and a verdict on the deliverability of the parsed address.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const addressvalidation = google.addressvalidation('v1');
     * ```
     */
    class Addressvalidation {
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
    addressvalidation_v1.Addressvalidation = Addressvalidation;
    class Resource$V1 {
        context;
        constructor(context) {
            this.context = context;
        }
        provideValidationFeedback(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://addressvalidation.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1:provideValidationFeedback').replace(/([^:]\/)\/+/g, '$1'),
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
        validateAddress(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://addressvalidation.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1:validateAddress').replace(/([^:]\/)\/+/g, '$1'),
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
    addressvalidation_v1.Resource$V1 = Resource$V1;
})(addressvalidation_v1 || (exports.addressvalidation_v1 = addressvalidation_v1 = {}));
