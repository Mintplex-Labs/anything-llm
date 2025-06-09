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
exports.Discovery = void 0;
const fs = require("fs");
const gaxios_1 = require("gaxios");
const resolve = require("url");
const util = require("util");
const apirequest_1 = require("./apirequest");
const endpoint_1 = require("./endpoint");
const readFile = util.promisify(fs.readFile);
class Discovery {
    transporter = new gaxios_1.Gaxios();
    options;
    /**
     * Discovery for discovering API endpoints
     *
     * @param options Options for discovery
     */
    constructor(options) {
        this.options = options || {};
    }
    /**
     * Generate and Endpoint from an endpoint schema object.
     *
     * @param schema The schema from which to generate the Endpoint.
     * @return A function that creates an endpoint.
     */
    makeEndpoint(schema) {
        return (options) => {
            const ep = new endpoint_1.Endpoint(options);
            ep.applySchema(ep, schema, schema, ep);
            return ep;
        };
    }
    /**
     * Log output of generator. Works just like console.log
     */
    log(...args) {
        if (this.options && this.options.debug) {
            console.log(...args);
        }
    }
    /**
     * Generate all APIs and return as in-memory object.
     * @param discoveryUrl
     */
    async discoverAllAPIs(discoveryUrl) {
        const headers = new Headers(this.options.includePrivate ? {} : { 'X-User-Ip': '0.0.0.0' });
        const res = await this.transporter.request({
            url: discoveryUrl,
            headers,
        });
        const items = res.data.items;
        const apis = await Promise.all(items.map(async (api) => {
            const endpointCreator = await this.discoverAPI(api.discoveryRestUrl);
            return { api, endpointCreator };
        }));
        const versionIndex = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const apisIndex = {};
        for (const set of apis) {
            if (!apisIndex[set.api.name]) {
                versionIndex[set.api.name] = {};
                apisIndex[set.api.name] = (options) => {
                    const type = typeof options;
                    let version;
                    if (type === 'string') {
                        version = options;
                        options = {};
                    }
                    else if (type === 'object') {
                        version = options.version;
                        delete options.version;
                    }
                    else {
                        throw new Error('Argument error: Accepts only string or object');
                    }
                    try {
                        const ep = set.endpointCreator(options, this);
                        return Object.freeze(ep); // create new & freeze
                    }
                    catch (e) {
                        throw new Error(util.format('Unable to load endpoint %s("%s"): %s', set.api.name, version, e.message));
                    }
                };
            }
            versionIndex[set.api.name][set.api.version] = set.endpointCreator;
        }
        return apisIndex;
    }
    /**
     * Generate API file given discovery URL
     *
     * @param apiDiscoveryUrl URL or filename of discovery doc for API
     * @returns A promise that resolves with a function that creates the endpoint
     */
    async discoverAPI(apiDiscoveryUrl) {
        if (typeof apiDiscoveryUrl === 'string') {
            const parts = resolve.parse(apiDiscoveryUrl);
            if (apiDiscoveryUrl && !parts.protocol) {
                this.log('Reading from file ' + apiDiscoveryUrl);
                const file = await readFile(apiDiscoveryUrl, { encoding: 'utf8' });
                return this.makeEndpoint(JSON.parse(file));
            }
            else {
                this.log('Requesting ' + apiDiscoveryUrl);
                const res = await this.transporter.request({
                    url: apiDiscoveryUrl,
                });
                return this.makeEndpoint(res.data);
            }
        }
        else {
            const options = apiDiscoveryUrl;
            this.log('Requesting ' + options.url);
            const url = options.url;
            delete options.url;
            const parameters = {
                options: { url, method: 'GET' },
                requiredParams: [],
                pathParams: [],
                params: options,
                context: { google: { _options: {} }, _options: {} },
            };
            const res = await (0, apirequest_1.createAPIRequest)(parameters);
            return this.makeEndpoint(res.data);
        }
    }
}
exports.Discovery = Discovery;
//# sourceMappingURL=discovery.js.map