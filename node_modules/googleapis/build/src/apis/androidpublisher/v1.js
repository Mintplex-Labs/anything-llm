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
exports.androidpublisher_v1 = void 0;
var androidpublisher_v1;
(function (androidpublisher_v1) {
    /**
     * Google Play Developer API
     *
     * Accesses Android application developers&#39; Google Play accounts.
     *
     * @example
     * const {google} = require('googleapis');
     * const androidpublisher = google.androidpublisher('v1');
     *
     * @namespace androidpublisher
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Androidpublisher
     */
    class Androidpublisher {
        context;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
        }
    }
    androidpublisher_v1.Androidpublisher = Androidpublisher;
})(androidpublisher_v1 || (exports.androidpublisher_v1 = androidpublisher_v1 = {}));
