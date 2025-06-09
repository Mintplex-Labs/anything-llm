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
exports.AuthPlus = exports.cloudfunctions_v2beta = exports.cloudfunctions_v2alpha = exports.cloudfunctions_v2 = exports.cloudfunctions_v1beta2 = exports.cloudfunctions_v1 = exports.auth = exports.VERSIONS = void 0;
exports.cloudfunctions = cloudfunctions;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "cloudfunctions_v1", { enumerable: true, get: function () { return v1_1.cloudfunctions_v1; } });
const v1beta2_1 = require("./v1beta2");
Object.defineProperty(exports, "cloudfunctions_v1beta2", { enumerable: true, get: function () { return v1beta2_1.cloudfunctions_v1beta2; } });
const v2_1 = require("./v2");
Object.defineProperty(exports, "cloudfunctions_v2", { enumerable: true, get: function () { return v2_1.cloudfunctions_v2; } });
const v2alpha_1 = require("./v2alpha");
Object.defineProperty(exports, "cloudfunctions_v2alpha", { enumerable: true, get: function () { return v2alpha_1.cloudfunctions_v2alpha; } });
const v2beta_1 = require("./v2beta");
Object.defineProperty(exports, "cloudfunctions_v2beta", { enumerable: true, get: function () { return v2beta_1.cloudfunctions_v2beta; } });
exports.VERSIONS = {
    v1: v1_1.cloudfunctions_v1.Cloudfunctions,
    v1beta2: v1beta2_1.cloudfunctions_v1beta2.Cloudfunctions,
    v2: v2_1.cloudfunctions_v2.Cloudfunctions,
    v2alpha: v2alpha_1.cloudfunctions_v2alpha.Cloudfunctions,
    v2beta: v2beta_1.cloudfunctions_v2beta.Cloudfunctions,
};
function cloudfunctions(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('cloudfunctions', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
