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
exports.fcmdata_v1beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var fcmdata_v1beta1;
(function (fcmdata_v1beta1) {
    /**
     * Firebase Cloud Messaging Data API
     *
     * Provides additional information about Firebase Cloud Messaging (FCM) message sends and deliveries.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const fcmdata = google.fcmdata('v1beta1');
     * ```
     */
    class Fcmdata {
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
    fcmdata_v1beta1.Fcmdata = Fcmdata;
    class Resource$Projects {
        context;
        androidApps;
        constructor(context) {
            this.context = context;
            this.androidApps = new Resource$Projects$Androidapps(this.context);
        }
    }
    fcmdata_v1beta1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Androidapps {
        context;
        deliveryData;
        constructor(context) {
            this.context = context;
            this.deliveryData = new Resource$Projects$Androidapps$Deliverydata(this.context);
        }
    }
    fcmdata_v1beta1.Resource$Projects$Androidapps = Resource$Projects$Androidapps;
    class Resource$Projects$Androidapps$Deliverydata {
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://fcmdata.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+parent}/deliveryData').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
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
    fcmdata_v1beta1.Resource$Projects$Androidapps$Deliverydata = Resource$Projects$Androidapps$Deliverydata;
})(fcmdata_v1beta1 || (exports.fcmdata_v1beta1 = fcmdata_v1beta1 = {}));
