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
exports.getAPI = getAPI;
function getAPI(api, options, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
versions, context) {
    let version;
    if (typeof options === 'string') {
        version = options;
        options = {};
    }
    else if (typeof options === 'object') {
        version = options.version;
        delete options.version;
    }
    else {
        throw new Error('Argument error: Accepts only string or object');
    }
    try {
        const ctr = versions[version];
        const ep = new ctr(options, context);
        return Object.freeze(ep);
    }
    catch (e) {
        throw new Error(`Unable to load endpoint ${api}("${version}"): ${e.message}`);
    }
}
//# sourceMappingURL=apiIndex.js.map