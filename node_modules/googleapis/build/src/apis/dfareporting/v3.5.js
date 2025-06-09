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
exports.dfareporting_v3_5 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var dfareporting_v3_5;
(function (dfareporting_v3_5) {
    /**
     * Campaign Manager 360 API
     *
     * Build applications to efficiently manage large or complex trafficking, reporting, and attribution workflows for Campaign Manager 360.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const dfareporting = google.dfareporting('v3.5');
     * ```
     */
    class Dfareporting {
        context;
        media;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.media = new Resource$Media(this.context);
        }
    }
    dfareporting_v3_5.Dfareporting = Dfareporting;
    class Resource$Media {
        context;
        constructor(context) {
            this.context = context;
        }
        upload(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://dfareporting.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl +
                        '/dfareporting/v3.5/userprofiles/{+profileId}/creativeAssets/{+advertiserId}/creativeAssets').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                mediaUrl: (rootUrl +
                    '/upload/dfareporting/v3.5/userprofiles/{+profileId}/creativeAssets/{+advertiserId}/creativeAssets').replace(/([^:]\/)\/+/g, '$1'),
                requiredParams: ['profileId', 'advertiserId'],
                pathParams: ['advertiserId', 'profileId'],
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
    dfareporting_v3_5.Resource$Media = Resource$Media;
})(dfareporting_v3_5 || (exports.dfareporting_v3_5 = dfareporting_v3_5 = {}));
