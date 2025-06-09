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
exports.fcm_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var fcm_v1;
(function (fcm_v1) {
    /**
     * Firebase Cloud Messaging API
     *
     * FCM send API that provides a cross-platform messaging solution to reliably deliver messages.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const fcm = google.fcm('v1');
     * ```
     */
    class Fcm {
        context;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.projects = new Resource$Projects(this.context);
        }
    }
    fcm_v1.Fcm = Fcm;
    class Resource$Projects {
        context;
        messages;
        constructor(context) {
            this.context = context;
            this.messages = new Resource$Projects$Messages(this.context);
        }
    }
    fcm_v1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Messages {
        context;
        constructor(context) {
            this.context = context;
        }
        send(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://fcm.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/{+parent}/messages:send').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
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
    fcm_v1.Resource$Projects$Messages = Resource$Projects$Messages;
})(fcm_v1 || (exports.fcm_v1 = fcm_v1 = {}));
