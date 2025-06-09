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
exports.servicecontrol_v2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var servicecontrol_v2;
(function (servicecontrol_v2) {
    /**
     * Service Control API
     *
     * Provides admission control and telemetry reporting for services integrated with Service Infrastructure.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const servicecontrol = google.servicecontrol('v2');
     * ```
     */
    class Servicecontrol {
        context;
        services;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.services = new Resource$Services(this.context);
        }
    }
    servicecontrol_v2.Servicecontrol = Servicecontrol;
    class Resource$Services {
        context;
        constructor(context) {
            this.context = context;
        }
        check(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://servicecontrol.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/services/{serviceName}:check').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['serviceName'],
                pathParams: ['serviceName'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
        report(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://servicecontrol.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/services/{serviceName}:report').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['serviceName'],
                pathParams: ['serviceName'],
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
    servicecontrol_v2.Resource$Services = Resource$Services;
})(servicecontrol_v2 || (exports.servicecontrol_v2 = servicecontrol_v2 = {}));
