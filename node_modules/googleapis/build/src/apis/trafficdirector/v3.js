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
exports.trafficdirector_v3 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var trafficdirector_v3;
(function (trafficdirector_v3) {
    /**
     * Traffic Director API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const trafficdirector = google.trafficdirector('v3');
     * ```
     */
    class Trafficdirector {
        context;
        discovery;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.discovery = new Resource$Discovery(this.context);
        }
    }
    trafficdirector_v3.Trafficdirector = Trafficdirector;
    class Resource$Discovery {
        context;
        constructor(context) {
            this.context = context;
        }
        client_status(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://trafficdirector.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v3/discovery:client_status').replace(/([^:]\/)\/+/g, '$1'),
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
    trafficdirector_v3.Resource$Discovery = Resource$Discovery;
})(trafficdirector_v3 || (exports.trafficdirector_v3 = trafficdirector_v3 = {}));
