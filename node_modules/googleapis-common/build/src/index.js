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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = exports.Discovery = exports.AuthPlus = exports.createAPIRequest = exports.getAPI = exports.GaxiosError = exports.Gaxios = exports.AwsClient = exports.IdentityPoolClient = exports.BaseExternalAccountClient = exports.ExternalAccountClient = exports.GoogleAuth = exports.UserRefreshClient = exports.Compute = exports.JWT = exports.OAuth2Client = exports.gaxios = exports.googleAuthLibrary = void 0;
// re-exporting key dependencies
exports.googleAuthLibrary = require("google-auth-library");
exports.gaxios = require("gaxios");
var google_auth_library_1 = require("google-auth-library");
Object.defineProperty(exports, "OAuth2Client", { enumerable: true, get: function () { return google_auth_library_1.OAuth2Client; } });
Object.defineProperty(exports, "JWT", { enumerable: true, get: function () { return google_auth_library_1.JWT; } });
Object.defineProperty(exports, "Compute", { enumerable: true, get: function () { return google_auth_library_1.Compute; } });
Object.defineProperty(exports, "UserRefreshClient", { enumerable: true, get: function () { return google_auth_library_1.UserRefreshClient; } });
Object.defineProperty(exports, "GoogleAuth", { enumerable: true, get: function () { return google_auth_library_1.GoogleAuth; } });
Object.defineProperty(exports, "ExternalAccountClient", { enumerable: true, get: function () { return google_auth_library_1.ExternalAccountClient; } });
Object.defineProperty(exports, "BaseExternalAccountClient", { enumerable: true, get: function () { return google_auth_library_1.BaseExternalAccountClient; } });
Object.defineProperty(exports, "IdentityPoolClient", { enumerable: true, get: function () { return google_auth_library_1.IdentityPoolClient; } });
Object.defineProperty(exports, "AwsClient", { enumerable: true, get: function () { return google_auth_library_1.AwsClient; } });
var gaxios_1 = require("gaxios");
Object.defineProperty(exports, "Gaxios", { enumerable: true, get: function () { return gaxios_1.Gaxios; } });
Object.defineProperty(exports, "GaxiosError", { enumerable: true, get: function () { return gaxios_1.GaxiosError; } });
var apiIndex_1 = require("./apiIndex");
Object.defineProperty(exports, "getAPI", { enumerable: true, get: function () { return apiIndex_1.getAPI; } });
var apirequest_1 = require("./apirequest");
Object.defineProperty(exports, "createAPIRequest", { enumerable: true, get: function () { return apirequest_1.createAPIRequest; } });
var authplus_1 = require("./authplus");
Object.defineProperty(exports, "AuthPlus", { enumerable: true, get: function () { return authplus_1.AuthPlus; } });
var discovery_1 = require("./discovery");
Object.defineProperty(exports, "Discovery", { enumerable: true, get: function () { return discovery_1.Discovery; } });
var endpoint_1 = require("./endpoint");
Object.defineProperty(exports, "Endpoint", { enumerable: true, get: function () { return endpoint_1.Endpoint; } });
__exportStar(require("./util"), exports);
//# sourceMappingURL=index.js.map