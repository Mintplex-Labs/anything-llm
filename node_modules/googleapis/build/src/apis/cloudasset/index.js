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
exports.AuthPlus = exports.cloudasset_v1p7beta1 = exports.cloudasset_v1p5beta1 = exports.cloudasset_v1p4beta1 = exports.cloudasset_v1p1beta1 = exports.cloudasset_v1beta1 = exports.cloudasset_v1 = exports.auth = exports.VERSIONS = void 0;
exports.cloudasset = cloudasset;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "cloudasset_v1", { enumerable: true, get: function () { return v1_1.cloudasset_v1; } });
const v1beta1_1 = require("./v1beta1");
Object.defineProperty(exports, "cloudasset_v1beta1", { enumerable: true, get: function () { return v1beta1_1.cloudasset_v1beta1; } });
const v1p1beta1_1 = require("./v1p1beta1");
Object.defineProperty(exports, "cloudasset_v1p1beta1", { enumerable: true, get: function () { return v1p1beta1_1.cloudasset_v1p1beta1; } });
const v1p4beta1_1 = require("./v1p4beta1");
Object.defineProperty(exports, "cloudasset_v1p4beta1", { enumerable: true, get: function () { return v1p4beta1_1.cloudasset_v1p4beta1; } });
const v1p5beta1_1 = require("./v1p5beta1");
Object.defineProperty(exports, "cloudasset_v1p5beta1", { enumerable: true, get: function () { return v1p5beta1_1.cloudasset_v1p5beta1; } });
const v1p7beta1_1 = require("./v1p7beta1");
Object.defineProperty(exports, "cloudasset_v1p7beta1", { enumerable: true, get: function () { return v1p7beta1_1.cloudasset_v1p7beta1; } });
exports.VERSIONS = {
    v1: v1_1.cloudasset_v1.Cloudasset,
    v1beta1: v1beta1_1.cloudasset_v1beta1.Cloudasset,
    v1p1beta1: v1p1beta1_1.cloudasset_v1p1beta1.Cloudasset,
    v1p4beta1: v1p4beta1_1.cloudasset_v1p4beta1.Cloudasset,
    v1p5beta1: v1p5beta1_1.cloudasset_v1p5beta1.Cloudasset,
    v1p7beta1: v1p7beta1_1.cloudasset_v1p7beta1.Cloudasset,
};
function cloudasset(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('cloudasset', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
