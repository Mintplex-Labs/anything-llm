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
exports.AuthPlus = exports.adexchangebuyer_v1_4 = exports.adexchangebuyer_v1_3 = exports.adexchangebuyer_v1_2 = exports.auth = exports.VERSIONS = void 0;
exports.adexchangebuyer = adexchangebuyer;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1_2_1 = require("./v1.2");
Object.defineProperty(exports, "adexchangebuyer_v1_2", { enumerable: true, get: function () { return v1_2_1.adexchangebuyer_v1_2; } });
const v1_3_1 = require("./v1.3");
Object.defineProperty(exports, "adexchangebuyer_v1_3", { enumerable: true, get: function () { return v1_3_1.adexchangebuyer_v1_3; } });
const v1_4_1 = require("./v1.4");
Object.defineProperty(exports, "adexchangebuyer_v1_4", { enumerable: true, get: function () { return v1_4_1.adexchangebuyer_v1_4; } });
exports.VERSIONS = {
    'v1.2': v1_2_1.adexchangebuyer_v1_2.Adexchangebuyer,
    'v1.3': v1_3_1.adexchangebuyer_v1_3.Adexchangebuyer,
    'v1.4': v1_4_1.adexchangebuyer_v1_4.Adexchangebuyer,
};
function adexchangebuyer(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('adexchangebuyer', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
