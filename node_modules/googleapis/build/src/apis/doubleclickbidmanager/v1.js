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
exports.doubleclickbidmanager_v1 = void 0;
var doubleclickbidmanager_v1;
(function (doubleclickbidmanager_v1) {
    /**
     * DoubleClick Bid Manager API
     *
     * DoubleClick Bid Manager API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const doubleclickbidmanager = google.doubleclickbidmanager('v1');
     * ```
     */
    class Doubleclickbidmanager {
        context;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
        }
    }
    doubleclickbidmanager_v1.Doubleclickbidmanager = Doubleclickbidmanager;
})(doubleclickbidmanager_v1 || (exports.doubleclickbidmanager_v1 = doubleclickbidmanager_v1 = {}));
