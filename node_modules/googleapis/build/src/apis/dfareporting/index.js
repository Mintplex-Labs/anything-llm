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
exports.AuthPlus = exports.dfareporting_v4 = exports.dfareporting_v3_5 = exports.dfareporting_v3_4 = exports.dfareporting_v3_3 = exports.auth = exports.VERSIONS = void 0;
exports.dfareporting = dfareporting;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v3_3_1 = require("./v3.3");
Object.defineProperty(exports, "dfareporting_v3_3", { enumerable: true, get: function () { return v3_3_1.dfareporting_v3_3; } });
const v3_4_1 = require("./v3.4");
Object.defineProperty(exports, "dfareporting_v3_4", { enumerable: true, get: function () { return v3_4_1.dfareporting_v3_4; } });
const v3_5_1 = require("./v3.5");
Object.defineProperty(exports, "dfareporting_v3_5", { enumerable: true, get: function () { return v3_5_1.dfareporting_v3_5; } });
const v4_1 = require("./v4");
Object.defineProperty(exports, "dfareporting_v4", { enumerable: true, get: function () { return v4_1.dfareporting_v4; } });
exports.VERSIONS = {
    'v3.3': v3_3_1.dfareporting_v3_3.Dfareporting,
    'v3.4': v3_4_1.dfareporting_v3_4.Dfareporting,
    'v3.5': v3_5_1.dfareporting_v3_5.Dfareporting,
    v4: v4_1.dfareporting_v4.Dfareporting,
};
function dfareporting(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('dfareporting', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
