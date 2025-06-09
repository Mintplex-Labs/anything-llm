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
exports.displayvideo_v1beta = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var displayvideo_v1beta;
(function (displayvideo_v1beta) {
    /**
     * Display &amp; Video 360 API
     *
     * Display &amp; Video 360 API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const displayvideo = google.displayvideo('v1beta');
     * ```
     */
    class Displayvideo {
        context;
        media;
        sdfdownloadtask;
        sdfdownloadtasks;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.media = new Resource$Media(this.context);
            this.sdfdownloadtask = new Resource$Sdfdownloadtask(this.context);
            this.sdfdownloadtasks = new Resource$Sdfdownloadtasks(this.context);
        }
    }
    displayvideo_v1beta.Displayvideo = Displayvideo;
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
    displayvideo_v1beta.Resource$Media = Resource$Media;
    class Resource$Sdfdownloadtask {
        context;
        operations;
        constructor(context) {
            this.context = context;
            this.operations = new Resource$Sdfdownloadtask$Operations(this.context);
        }
    }
    displayvideo_v1beta.Resource$Sdfdownloadtask = Resource$Sdfdownloadtask;
    class Resource$Sdfdownloadtask$Operations {
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
                    url: (rootUrl + '/v1beta/{+name}').replace(/([^:]\/)\/+/g, '$1'),
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
    displayvideo_v1beta.Resource$Sdfdownloadtask$Operations = Resource$Sdfdownloadtask$Operations;
    class Resource$Sdfdownloadtasks {
        context;
        operations;
        constructor(context) {
            this.context = context;
            this.operations = new Resource$Sdfdownloadtasks$Operations(this.context);
        }
    }
    displayvideo_v1beta.Resource$Sdfdownloadtasks = Resource$Sdfdownloadtasks;
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
                    url: (rootUrl + '/v1beta/{+name}').replace(/([^:]\/)\/+/g, '$1'),
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
    displayvideo_v1beta.Resource$Sdfdownloadtasks$Operations = Resource$Sdfdownloadtasks$Operations;
})(displayvideo_v1beta || (exports.displayvideo_v1beta = displayvideo_v1beta = {}));
