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
exports.AuthPlus = exports.deploymentmanager_v2beta = exports.deploymentmanager_v2 = exports.deploymentmanager_alpha = exports.auth = exports.VERSIONS = void 0;
exports.deploymentmanager = deploymentmanager;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const alpha_1 = require("./alpha");
Object.defineProperty(exports, "deploymentmanager_alpha", { enumerable: true, get: function () { return alpha_1.deploymentmanager_alpha; } });
const v2_1 = require("./v2");
Object.defineProperty(exports, "deploymentmanager_v2", { enumerable: true, get: function () { return v2_1.deploymentmanager_v2; } });
const v2beta_1 = require("./v2beta");
Object.defineProperty(exports, "deploymentmanager_v2beta", { enumerable: true, get: function () { return v2beta_1.deploymentmanager_v2beta; } });
exports.VERSIONS = {
    alpha: alpha_1.deploymentmanager_alpha.Deploymentmanager,
    v2: v2_1.deploymentmanager_v2.Deploymentmanager,
    v2beta: v2beta_1.deploymentmanager_v2beta.Deploymentmanager,
};
function deploymentmanager(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('deploymentmanager', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
