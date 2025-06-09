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
exports.videointelligence_v1p1beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var videointelligence_v1p1beta1;
(function (videointelligence_v1p1beta1) {
    /**
     * Cloud Video Intelligence API
     *
     * Detects objects, explicit content, and scene changes in videos. It also specifies the region for annotation and transcribes speech to text. Supports both asynchronous API and streaming API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const videointelligence = google.videointelligence('v1p1beta1');
     * ```
     */
    class Videointelligence {
        context;
        videos;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.videos = new Resource$Videos(this.context);
        }
    }
    videointelligence_v1p1beta1.Videointelligence = Videointelligence;
    class Resource$Videos {
        context;
        constructor(context) {
            this.context = context;
        }
        annotate(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://videointelligence.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1p1beta1/videos:annotate').replace(/([^:]\/)\/+/g, '$1'),
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
    videointelligence_v1p1beta1.Resource$Videos = Resource$Videos;
})(videointelligence_v1p1beta1 || (exports.videointelligence_v1p1beta1 = videointelligence_v1p1beta1 = {}));
