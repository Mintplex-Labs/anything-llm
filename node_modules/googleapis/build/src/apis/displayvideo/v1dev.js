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
exports.displayvideo_v1dev = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var displayvideo_v1dev;
(function (displayvideo_v1dev) {
    /**
     * Display &amp; Video 360 API
     *
     * Display &amp; Video 360 API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const displayvideo = google.displayvideo('v1dev');
     * ```
     */
    class Displayvideo {
        context;
        media;
        sdfdownloadtasks;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.media = new Resource$Media(this.context);
            this.sdfdownloadtasks = new Resource$Sdfdownloadtasks(this.context);
        }
    }
    displayvideo_v1dev.Displayvideo = Displayvideo;
    class Resource$Media {
        context;
        constructor(context) {
            this.context = context;
        }
        download(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://displayvideo.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/download/{+resourceName}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['resourceName'],
                pathParams: ['resourceName'],
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
    displayvideo_v1dev.Resource$Media = Resource$Media;
    class Resource$Sdfdownloadtasks {
        context;
        operations;
        constructor(context) {
            this.context = context;
            this.operations = new Resource$Sdfdownloadtasks$Operations(this.context);
        }
    }
    displayvideo_v1dev.Resource$Sdfdownloadtasks = Resource$Sdfdownloadtasks;
    class Resource$Sdfdownloadtasks$Operations {
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
            const rootUrl = options.rootUrl || 'https://displayvideo.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1dev/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
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
    displayvideo_v1dev.Resource$Sdfdownloadtasks$Operations = Resource$Sdfdownloadtasks$Operations;
})(displayvideo_v1dev || (exports.displayvideo_v1dev = displayvideo_v1dev = {}));
