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
exports.AuthPlus = exports.cloudbuild_v2 = exports.cloudbuild_v1beta1 = exports.cloudbuild_v1alpha2 = exports.cloudbuild_v1alpha1 = exports.cloudbuild_v1 = exports.auth = exports.VERSIONS = void 0;
exports.cloudbuild = cloudbuild;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "cloudbuild_v1", { enumerable: true, get: function () { return v1_1.cloudbuild_v1; } });
const v1alpha1_1 = require("./v1alpha1");
Object.defineProperty(exports, "cloudbuild_v1alpha1", { enumerable: true, get: function () { return v1alpha1_1.cloudbuild_v1alpha1; } });
const v1alpha2_1 = require("./v1alpha2");
Object.defineProperty(exports, "cloudbuild_v1alpha2", { enumerable: true, get: function () { return v1alpha2_1.cloudbuild_v1alpha2; } });
const v1beta1_1 = require("./v1beta1");
Object.defineProperty(exports, "cloudbuild_v1beta1", { enumerable: true, get: function () { return v1beta1_1.cloudbuild_v1beta1; } });
const v2_1 = require("./v2");
Object.defineProperty(exports, "cloudbuild_v2", { enumerable: true, get: function () { return v2_1.cloudbuild_v2; } });
exports.VERSIONS = {
    v1: v1_1.cloudbuild_v1.Cloudbuild,
    v1alpha1: v1alpha1_1.cloudbuild_v1alpha1.Cloudbuild,
    v1alpha2: v1alpha2_1.cloudbuild_v1alpha2.Cloudbuild,
    v1beta1: v1beta1_1.cloudbuild_v1beta1.Cloudbuild,
    v2: v2_1.cloudbuild_v2.Cloudbuild,
};
function cloudbuild(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('cloudbuild', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
