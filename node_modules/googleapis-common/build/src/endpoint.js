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
exports.Endpoint = void 0;
const apirequest_1 = require("./apirequest");
class Endpoint {
    _options;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google;
    constructor(options) {
        this._options = options || {};
    }
    /**
     * Given a schema, add methods and resources to a target.
     *
     * @param {object} target The target to which to apply the schema.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods and
     * resources.
     * @param {object} context The context to add to each method.
     */
    applySchema(target, rootSchema, schema, context) {
        this.applyMethodsFromSchema(target, rootSchema, schema, context);
        if (schema.resources) {
            for (const resourceName in schema.resources) {
                if (Object.prototype.hasOwnProperty.call(schema.resources, resourceName)) {
                    const resource = schema.resources[resourceName];
                    if (!target[resourceName]) {
                        target[resourceName] = {};
                    }
                    this.applySchema(target[resourceName], rootSchema, resource, context);
                }
            }
        }
    }
    /**
     * Given a schema, add methods to a target.
     *
     * @param {object} target The target to which to apply the methods.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods.
     * @param {object} context The context to add to each method.
     */
    applyMethodsFromSchema(target, rootSchema, schema, context) {
        if (schema.methods) {
            for (const name in schema.methods) {
                if (Object.prototype.hasOwnProperty.call(schema.methods, name)) {
                    const method = schema.methods[name];
                    target[name] = this.makeMethod(rootSchema, method, context);
                }
            }
        }
    }
    /**
     * Given a method schema, add a method to a target.
     *
     * @param target The target to which to add the method.
     * @param schema The top-level schema that contains the rootUrl, etc.
     * @param method The method schema from which to generate the method.
     * @param context The context to add to the method.
     */
    makeMethod(schema, method, context) {
        return (paramsOrCallback, callback) => {
            const params = typeof paramsOrCallback === 'function' ? {} : paramsOrCallback;
            callback =
                typeof paramsOrCallback === 'function'
                    ? paramsOrCallback
                    : callback;
            const schemaUrl = buildurl(schema.rootUrl + schema.servicePath + method.path);
            const parameters = {
                options: {
                    url: schemaUrl.substring(1, schemaUrl.length - 1),
                    method: method.httpMethod,
                    apiVersion: method.apiVersion,
                },
                params,
                requiredParams: method.parameterOrder || [],
                pathParams: this.getPathParams(method.parameters),
                context,
            };
            if (method.mediaUpload &&
                method.mediaUpload.protocols &&
                method.mediaUpload.protocols.simple &&
                method.mediaUpload.protocols.simple.path) {
                const mediaUrl = buildurl(schema.rootUrl + method.mediaUpload.protocols.simple.path);
                parameters.mediaUrl = mediaUrl.substring(1, mediaUrl.length - 1);
            }
            if (!callback) {
                return (0, apirequest_1.createAPIRequest)(parameters);
            }
            (0, apirequest_1.createAPIRequest)(parameters, callback);
            return;
        };
    }
    getPathParams(params) {
        const pathParams = new Array();
        if (typeof params !== 'object') {
            params = {};
        }
        Object.keys(params).forEach(key => {
            if (params[key].location === 'path') {
                pathParams.push(key);
            }
        });
        return pathParams;
    }
}
exports.Endpoint = Endpoint;
/**
 * Build a string used to create a URL from the discovery doc provided URL.
 * replace double slashes with single slash (except in https://)
 * @private
 * @param  input URL to build from
 * @return Resulting built URL
 */
function buildurl(input) {
    return input ? `'${input}'`.replace(/([^:]\/)\/+/g, '$1') : '';
}
//# sourceMappingURL=endpoint.js.map