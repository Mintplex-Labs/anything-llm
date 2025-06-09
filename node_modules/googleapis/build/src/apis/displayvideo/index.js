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
exports.AuthPlus = exports.displayvideo_v4 = exports.displayvideo_v3 = exports.displayvideo_v2 = exports.displayvideo_v1dev = exports.displayvideo_v1beta2 = exports.displayvideo_v1beta = exports.displayvideo_v1 = exports.auth = exports.VERSIONS = void 0;
exports.displayvideo = displayvideo;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_1 = require("./v1");
Object.defineProperty(exports, "displayvideo_v1", { enumerable: true, get: function () { return v1_1.displayvideo_v1; } });
const v1beta_1 = require("./v1beta");
Object.defineProperty(exports, "displayvideo_v1beta", { enumerable: true, get: function () { return v1beta_1.displayvideo_v1beta; } });
const v1beta2_1 = require("./v1beta2");
Object.defineProperty(exports, "displayvideo_v1beta2", { enumerable: true, get: function () { return v1beta2_1.displayvideo_v1beta2; } });
const v1dev_1 = require("./v1dev");
Object.defineProperty(exports, "displayvideo_v1dev", { enumerable: true, get: function () { return v1dev_1.displayvideo_v1dev; } });
const v2_1 = require("./v2");
Object.defineProperty(exports, "displayvideo_v2", { enumerable: true, get: function () { return v2_1.displayvideo_v2; } });
const v3_1 = require("./v3");
Object.defineProperty(exports, "displayvideo_v3", { enumerable: true, get: function () { return v3_1.displayvideo_v3; } });
const v4_1 = require("./v4");
Object.defineProperty(exports, "displayvideo_v4", { enumerable: true, get: function () { return v4_1.displayvideo_v4; } });
exports.VERSIONS = {
    v1: v1_1.displayvideo_v1.Displayvideo,
    v1beta: v1beta_1.displayvideo_v1beta.Displayvideo,
    v1beta2: v1beta2_1.displayvideo_v1beta2.Displayvideo,
    v1dev: v1dev_1.displayvideo_v1dev.Displayvideo,
    v2: v2_1.displayvideo_v2.Displayvideo,
    v3: v3_1.displayvideo_v3.Displayvideo,
    v4: v4_1.displayvideo_v4.Displayvideo,
};
function displayvideo(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('displayvideo', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
