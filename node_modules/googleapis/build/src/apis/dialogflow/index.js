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
exports.AuthPlus = exports.dialogflow_v3beta1 = exports.dialogflow_v3 = exports.dialogflow_v2beta1 = exports.dialogflow_v2 = exports.auth = exports.VERSIONS = void 0;
exports.dialogflow = dialogflow;
/*! THIS FILE IS AUTO-GENERATED */
const googleapis_common_1 = require("googleapis-common");
const v2_1 = require("./v2");
Object.defineProperty(exports, "dialogflow_v2", { enumerable: true, get: function () { return v2_1.dialogflow_v2; } });
const v2beta1_1 = require("./v2beta1");
Object.defineProperty(exports, "dialogflow_v2beta1", { enumerable: true, get: function () { return v2beta1_1.dialogflow_v2beta1; } });
const v3_1 = require("./v3");
Object.defineProperty(exports, "dialogflow_v3", { enumerable: true, get: function () { return v3_1.dialogflow_v3; } });
const v3beta1_1 = require("./v3beta1");
Object.defineProperty(exports, "dialogflow_v3beta1", { enumerable: true, get: function () { return v3beta1_1.dialogflow_v3beta1; } });
exports.VERSIONS = {
    v2: v2_1.dialogflow_v2.Dialogflow,
    v2beta1: v2beta1_1.dialogflow_v2beta1.Dialogflow,
    v3: v3_1.dialogflow_v3.Dialogflow,
    v3beta1: v3beta1_1.dialogflow_v3beta1.Dialogflow,
};
function dialogflow(versionOrOptions) {
    return (0, googleapis_common_1.getAPI)('dialogflow', versionOrOptions, exports.VERSIONS, this);
}
const auth = new googleapis_common_1.AuthPlus();
exports.auth = auth;
var googleapis_common_2 = require("googleapis-common");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return googleapis_common_2.AuthPlus; } });
