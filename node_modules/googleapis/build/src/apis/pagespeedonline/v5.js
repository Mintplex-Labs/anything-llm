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
exports.pagespeedonline_v5 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var pagespeedonline_v5;
(function (pagespeedonline_v5) {
    /**
     * PageSpeed Insights API
     *
     * The PageSpeed Insights API lets you analyze the performance of your website with a simple API. It offers tailored suggestions for how you can optimize your site, and lets you easily integrate PageSpeed Insights analysis into your development tools and workflow.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const pagespeedonline = google.pagespeedonline('v5');
     * ```
     */
    class Pagespeedonline {
        context;
        pagespeedapi;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.pagespeedapi = new Resource$Pagespeedapi(this.context);
        }
    }
    pagespeedonline_v5.Pagespeedonline = Pagespeedonline;
    class Resource$Pagespeedapi {
        context;
        constructor(context) {
            this.context = context;
        }
        runpagespeed(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://pagespeedonline.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/pagespeedonline/v5/runPagespeed').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['url'],
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
    pagespeedonline_v5.Resource$Pagespeedapi = Resource$Pagespeedapi;
})(pagespeedonline_v5 || (exports.pagespeedonline_v5 = pagespeedonline_v5 = {}));
