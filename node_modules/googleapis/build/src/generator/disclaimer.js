"use strict";
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.gfs = exports.libraryListUrl = void 0;
exports.main = main;
const gaxios_1 = require("gaxios");
const fs_1 = require("fs");
exports.libraryListUrl = 'https://raw.githubusercontent.com/googleapis/google-cloud-node/main/libraries.json';
// exported for mocking purposes
exports.gfs = {
    writeFileSync: fs_1.writeFileSync,
};
/**
 * Reach out to google-cloud-node, and get a list of available client libraries
 * that are veneer or GAPIC.  Use that to populate a JSON file that will be
 * used during generation to call out improved clients in READMEs for a given
 * API.
 *
 * To use this, run `node build/src/generator/disclaimers`.
 */
async function main() {
    const res = await (0, gaxios_1.request)({ url: exports.libraryListUrl });
    const disclaimers = res.data.map(lib => {
        return {
            api: lib.api_id.split('.')[0],
            package: lib.distribution_name,
        };
    });
    exports.gfs.writeFileSync('./disclaimers.json', JSON.stringify(disclaimers, null, 2));
}
if (require.main === module) {
    main().catch(err => {
        throw err;
    });
}
