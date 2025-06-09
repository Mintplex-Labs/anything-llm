"use strict";
// Copyright 2025 Google LLC
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
exports.headersToClassicHeaders = headersToClassicHeaders;
exports.marshallGaxiosResponse = marshallGaxiosResponse;
/**
 * A utility for converting potential {@link Headers `Headers`} objects to plain headers objects.
 *
 * @param headers any compatible `HeadersInit` (`Headers`, (string, string)[], {})
 * @returns the headers in `Record<string, string>` form.
 */
function headersToClassicHeaders(headers) {
    let classicHeaders = {};
    if (headers instanceof Headers) {
        headers.forEach((value, key) => {
            classicHeaders[key] = value;
        });
    }
    else if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
            classicHeaders[key] = value;
        }
    }
    else {
        classicHeaders = headers || {};
    }
    return classicHeaders;
}
/**
 * marshall a GaxiosResponse into a library-friendly type.
 *
 * @param res the Gaxios Response
 * @returns the GaxiosResponse with HTTP2-ready/compatible headers
 */
function marshallGaxiosResponse(res) {
    return Object.defineProperties(res || {}, {
        headers: {
            configurable: true,
            writable: true,
            enumerable: true,
            value: headersToClassicHeaders(res?.headers),
        },
    });
}
//# sourceMappingURL=util.js.map