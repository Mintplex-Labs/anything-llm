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
exports.AuthPlus = exports.gamesConfiguration_v1configuration = exports.auth = exports.VERSIONS = void 0;
exports.gamesConfiguration = gamesConfiguration;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v1configuration_1 = require("./v1configuration");
Object.defineProperty(exports, "gamesConfiguration_v1configuration", { enumerable: true, get: function () { return v1configuration_1.gamesConfiguration_v1configuration; } });
exports.VERSIONS = {
    v1configuration: v1configuration_1.gamesConfiguration_v1configuration.Gamesconfiguration,
};
function gamesConfiguration(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('gamesConfiguration', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
