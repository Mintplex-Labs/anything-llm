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
exports.acceleratedmobilepageurl_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var acceleratedmobilepageurl_v1;
(function (acceleratedmobilepageurl_v1) {
    /**
     * Accelerated Mobile Pages (AMP) URL API
     *
     * Retrieves the list of AMP URLs (and equivalent AMP Cache URLs) for a given list of public URL(s).
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const acceleratedmobilepageurl = google.acceleratedmobilepageurl('v1');
     * ```
     */
    class Acceleratedmobilepageurl {
        context;
        ampUrls;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.ampUrls = new Resource$Ampurls(this.context);
        }
    }
    acceleratedmobilepageurl_v1.Acceleratedmobilepageurl = Acceleratedmobilepageurl;
    class Resource$Ampurls {
        context;
        constructor(context) {
            this.context = context;
        }
        batchGet(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://acceleratedmobilepageurl.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/ampUrls:batchGet').replace(/([^:]\/)\/+/g, '$1'),
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
    acceleratedmobilepageurl_v1.Resource$Ampurls = Resource$Ampurls;
})(acceleratedmobilepageurl_v1 || (exports.acceleratedmobilepageurl_v1 = acceleratedmobilepageurl_v1 = {}));
