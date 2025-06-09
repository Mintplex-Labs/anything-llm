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
exports.AuthPlus = exports.genomics_v2alpha1 = exports.genomics_v1alpha2 = exports.genomics_v1 = exports.auth = exports.VERSIONS = void 0;
exports.genomics = genomics;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "genomics_v1", { enumerable: true, get: function () { return v1_1.genomics_v1; } });
const v1alpha2_1 = require("./v1alpha2");
Object.defineProperty(exports, "genomics_v1alpha2", { enumerable: true, get: function () { return v1alpha2_1.genomics_v1alpha2; } });
const v2alpha1_1 = require("./v2alpha1");
Object.defineProperty(exports, "genomics_v2alpha1", { enumerable: true, get: function () { return v2alpha1_1.genomics_v2alpha1; } });
exports.VERSIONS = {
    v1: v1_1.genomics_v1.Genomics,
    v1alpha2: v1alpha2_1.genomics_v1alpha2.Genomics,
    v2alpha1: v2alpha1_1.genomics_v2alpha1.Genomics,
};
function genomics(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('genomics', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
