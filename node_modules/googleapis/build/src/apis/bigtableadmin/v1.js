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
exports.bigtableadmin_v1 = void 0;
var bigtableadmin_v1;
(function (bigtableadmin_v1) {
    /**
     * Cloud Bigtable Admin API
     *
     * Administer your Cloud Bigtable tables and instances.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const bigtableadmin = google.bigtableadmin('v1');
     * ```
     */
    class Bigtableadmin {
        context;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
        }
    }
    bigtableadmin_v1.Bigtableadmin = Bigtableadmin;
})(bigtableadmin_v1 || (exports.bigtableadmin_v1 = bigtableadmin_v1 = {}));
