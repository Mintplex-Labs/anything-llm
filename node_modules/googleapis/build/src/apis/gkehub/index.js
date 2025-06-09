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
exports.AuthPlus = exports.gkehub_v2beta = exports.gkehub_v2alpha = exports.gkehub_v2 = exports.gkehub_v1beta1 = exports.gkehub_v1beta = exports.gkehub_v1alpha2 = exports.gkehub_v1alpha = exports.gkehub_v1 = exports.auth = exports.VERSIONS = void 0;
exports.gkehub = gkehub;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "gkehub_v1", { enumerable: true, get: function () { return v1_1.gkehub_v1; } });
const v1alpha_1 = require("./v1alpha");
Object.defineProperty(exports, "gkehub_v1alpha", { enumerable: true, get: function () { return v1alpha_1.gkehub_v1alpha; } });
const v1alpha2_1 = require("./v1alpha2");
Object.defineProperty(exports, "gkehub_v1alpha2", { enumerable: true, get: function () { return v1alpha2_1.gkehub_v1alpha2; } });
const v1beta_1 = require("./v1beta");
Object.defineProperty(exports, "gkehub_v1beta", { enumerable: true, get: function () { return v1beta_1.gkehub_v1beta; } });
const v1beta1_1 = require("./v1beta1");
Object.defineProperty(exports, "gkehub_v1beta1", { enumerable: true, get: function () { return v1beta1_1.gkehub_v1beta1; } });
const v2_1 = require("./v2");
Object.defineProperty(exports, "gkehub_v2", { enumerable: true, get: function () { return v2_1.gkehub_v2; } });
const v2alpha_1 = require("./v2alpha");
Object.defineProperty(exports, "gkehub_v2alpha", { enumerable: true, get: function () { return v2alpha_1.gkehub_v2alpha; } });
const v2beta_1 = require("./v2beta");
Object.defineProperty(exports, "gkehub_v2beta", { enumerable: true, get: function () { return v2beta_1.gkehub_v2beta; } });
exports.VERSIONS = {
    v1: v1_1.gkehub_v1.Gkehub,
    v1alpha: v1alpha_1.gkehub_v1alpha.Gkehub,
    v1alpha2: v1alpha2_1.gkehub_v1alpha2.Gkehub,
    v1beta: v1beta_1.gkehub_v1beta.Gkehub,
    v1beta1: v1beta1_1.gkehub_v1beta1.Gkehub,
    v2: v2_1.gkehub_v2.Gkehub,
    v2alpha: v2alpha_1.gkehub_v2alpha.Gkehub,
    v2beta: v2beta_1.gkehub_v2beta.Gkehub,
};
function gkehub(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('gkehub', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
