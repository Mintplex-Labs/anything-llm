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
exports.driveactivity_v2 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var driveactivity_v2;
(function (driveactivity_v2) {
    /**
     * Drive Activity API
     *
     * Provides a historical view of activity in Google Drive.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const driveactivity = google.driveactivity('v2');
     * ```
     */
    class Driveactivity {
        context;
        activity;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.activity = new Resource$Activity(this.context);
        }
    }
    driveactivity_v2.Driveactivity = Driveactivity;
    class Resource$Activity {
        context;
        constructor(context) {
            this.context = context;
        }
        query(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://driveactivity.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v2/activity:query').replace(/([^:]\/)\/+/g, '$1'),
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
    driveactivity_v2.Resource$Activity = Resource$Activity;
})(driveactivity_v2 || (exports.driveactivity_v2 = driveactivity_v2 = {}));
