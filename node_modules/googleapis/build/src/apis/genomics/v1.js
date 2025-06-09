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
exports.genomics_v1 = void 0;
var genomics_v1;
(function (genomics_v1) {
    /**
     * Genomics API
     *
     * Uploads, processes, queries, and searches Genomics data in the cloud.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const genomics = google.genomics('v1');
     * ```
     */
    class Genomics {
        context;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
        }
    }
    genomics_v1.Genomics = Genomics;
})(genomics_v1 || (exports.genomics_v1 = genomics_v1 = {}));
