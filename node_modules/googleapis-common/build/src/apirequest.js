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
exports.createAPIRequest = createAPIRequest;
const gaxios_1 = require("gaxios");
const qs = require("qs");
const stream = require("stream");
const urlTemplate = require("url-template");
const extend = require("extend");
const isbrowser_1 = require("./isbrowser");
const h2 = require("./http2");
const util_1 = require("./util");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json');
const randomUUID = () => globalThis.crypto?.randomUUID() || require('crypto').randomUUID();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isReadableStream(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        typeof obj.pipe === 'function' &&
        obj.readable !== false &&
        typeof obj._read === 'function' &&
        typeof obj._readableState === 'object');
}
function getMissingParams(params, required) {
    const missing = new Array();
    required.forEach(param => {
        // Is the required param in the params object?
        if (params[param] === undefined) {
            missing.push(param);
        }
    });
    // If there are any required params missing, return their names in array,
    // otherwise return null
    return missing.length > 0 ? missing : null;
}
function createAPIRequest(parameters, callback) {
    if (callback) {
        createAPIRequestAsync(parameters).then(r => callback(null, r), callback);
    }
    else {
        return createAPIRequestAsync(parameters);
    }
}
async function createAPIRequestAsync(parameters) {
    // Combine the GaxiosOptions options passed with this specific
    // API call with the global options configured at the API Context
    // level, or at the global level.
    const options = extend(true, {}, // Ensure we don't leak settings upstream
    parameters.context.google?._options || {}, // Google level options
    parameters.context._options || {}, // Per-API options
    parameters.options);
    const params = extend(true, {}, // New base object
    options.params, // Combined global/per-api params
    parameters.params);
    options.userAgentDirectives = options.userAgentDirectives || [];
    const media = params.media || {};
    /**
     * In a previous version of this API, the request body was stuffed in a field
     * named `resource`.  This caused lots of problems, because it's not uncommon
     * to have an actual named parameter required which is also named `resource`.
     * This meant that users would have to use `resource_` in those cases, which
     * pretty much nobody figures out on their own. The request body is now
     * documented as being in the `requestBody` property, but we also need to keep
     * using `resource` for reasons of back-compat. Cases that need to be covered
     * here:
     * - user provides just a `resource` with a request body
     * - user provides both a `resource` and a `resource_`
     * - user provides just a `requestBody`
     * - user provides both a `requestBody` and a `resource`
     */
    let resource = params.requestBody;
    if (!params.requestBody &&
        params.resource &&
        (!parameters.requiredParams.includes('resource') ||
            typeof params.resource !== 'string')) {
        resource = params.resource;
        delete params.resource;
    }
    delete params.requestBody;
    let authClient = params.auth || options.auth;
    const defaultMime = typeof media.body === 'string' ? 'text/plain' : 'application/octet-stream';
    delete params.media;
    delete params.auth;
    // Grab headers from user provided options
    const headers = (0, util_1.headersToClassicHeaders)(params.headers || {});
    populateAPIHeader(headers, options.apiVersion);
    delete params.headers;
    // Un-alias parameters that were modified due to conflicts with reserved names
    Object.keys(params).forEach(key => {
        if (key.slice(-1) === '_') {
            const newKey = key.slice(0, -1);
            params[newKey] = params[key];
            delete params[key];
        }
    });
    // Check for missing required parameters in the API request
    const missingParams = getMissingParams(params, parameters.requiredParams);
    if (missingParams) {
        // Some params are missing - stop further operations and inform the
        // developer which required params are not included in the request
        throw new Error('Missing required parameters: ' + missingParams.join(', '));
    }
    // Parse urls
    if (options.url) {
        let url = options.url;
        if (typeof url === 'object') {
            url = url.toString();
        }
        options.url = urlTemplate.parse(url).expand(params);
    }
    if (parameters.mediaUrl) {
        parameters.mediaUrl = urlTemplate.parse(parameters.mediaUrl).expand(params);
    }
    // Rewrite url if rootUrl is globally set
    if (parameters.context._options.rootUrl !== undefined &&
        options.url !== undefined) {
        const originalUrl = new URL(options.url);
        const path = originalUrl.href.substr(originalUrl.origin.length);
        options.url = new URL(path, parameters.context._options.rootUrl).href;
    }
    // When forming the querystring, override the serializer so that array
    // values are serialized like this:
    // myParams: ['one', 'two'] ---> 'myParams=one&myParams=two'
    // This serializer also encodes spaces in the querystring as `%20`,
    // whereas the default serializer in gaxios encodes to a `+`.
    options.paramsSerializer = params => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
    };
    // delete path params from the params object so they do not end up in query
    parameters.pathParams.forEach(param => delete params[param]);
    // if authClient is actually a string, use it as an API KEY
    if (typeof authClient === 'string') {
        params.key = params.key || authClient;
        authClient = undefined;
    }
    function multipartUpload(multipart) {
        const boundary = randomUUID();
        const finale = `--${boundary}--`;
        const rStream = new stream.PassThrough({
            flush(callback) {
                this.push('\r\n');
                this.push(finale);
                callback();
            },
        });
        const pStream = new ProgressStream();
        const isStream = isReadableStream(multipart[1].body);
        headers['content-type'] = `multipart/related; boundary=${boundary}`;
        for (const part of multipart) {
            const preamble = `--${boundary}\r\ncontent-type: ${part['content-type']}\r\n\r\n`;
            rStream.push(preamble);
            if (typeof part.body === 'string') {
                rStream.push(part.body);
                rStream.push('\r\n');
            }
            else {
                // Gaxios does not natively support onUploadProgress in node.js.
                // Pipe through the pStream first to read the number of bytes read
                // for the purpose of tracking progress.
                pStream.on('progress', bytesRead => {
                    if (options.onUploadProgress) {
                        options.onUploadProgress({ bytesRead });
                    }
                });
                part.body.pipe(pStream).pipe(rStream);
            }
        }
        if (!isStream) {
            rStream.push(finale);
            rStream.push(null);
        }
        options.data = rStream;
    }
    function browserMultipartUpload(multipart) {
        const boundary = randomUUID();
        const finale = `--${boundary}--`;
        headers['content-type'] = `multipart/related; boundary=${boundary}`;
        let content = '';
        for (const part of multipart) {
            const preamble = `--${boundary}\r\ncontent-type: ${part['content-type']}\r\n\r\n`;
            content += preamble;
            if (typeof part.body === 'string') {
                content += part.body;
                content += '\r\n';
            }
        }
        content += finale;
        options.data = content;
    }
    if (parameters.mediaUrl && media.body) {
        options.url = parameters.mediaUrl;
        if (resource) {
            params.uploadType = 'multipart';
            const multipart = [
                { 'content-type': 'application/json', body: JSON.stringify(resource) },
                {
                    'content-type': media.mimeType || (resource && resource.mimeType) || defaultMime,
                    body: media.body,
                },
            ];
            if (!(0, isbrowser_1.isBrowser)()) {
                // gaxios doesn't support multipart/related uploads, so it has to
                // be implemented here.
                multipartUpload(multipart);
            }
            else {
                browserMultipartUpload(multipart);
            }
        }
        else {
            params.uploadType = 'media';
            Object.assign(headers, { 'content-type': media.mimeType || defaultMime });
            options.data = media.body;
        }
    }
    else {
        options.data = resource || undefined;
    }
    options.headers = gaxios_1.Gaxios.mergeHeaders(options.headers || {}, headers);
    options.params = params;
    if (!(0, isbrowser_1.isBrowser)()) {
        options.headers.set('Accept-Encoding', 'gzip');
        options.userAgentDirectives.push({
            product: 'google-api-nodejs-client',
            version: pkg.version,
            comment: 'gzip',
        });
        const userAgent = options.userAgentDirectives
            .map(d => {
            let line = `${d.product}/${d.version}`;
            if (d.comment) {
                line += ` (${d.comment})`;
            }
            return line;
        })
            .join(' ');
        options.headers.set('User-Agent', userAgent);
    }
    // By default gaxios treats any 2xx as valid, and all non 2xx status
    // codes as errors.  This is a problem for HTTP 304s when used along
    // with an eTag.
    if (!options.validateStatus) {
        options.validateStatus = status => {
            return (status >= 200 && status < 300) || status === 304;
        };
    }
    // Retry by default
    options.retry = options.retry === undefined ? true : options.retry;
    delete options.auth; // is overridden by our auth code
    // Determine TPC universe
    if (options.universeDomain &&
        options.universe_domain &&
        options.universeDomain !== options.universe_domain) {
        throw new Error('Please set either universe_domain or universeDomain, but not both.');
    }
    const universeDomainEnvVar = typeof process === 'object' && typeof process.env === 'object'
        ? process.env['GOOGLE_CLOUD_UNIVERSE_DOMAIN']
        : undefined;
    const universeDomain = options.universeDomain ??
        options.universe_domain ??
        universeDomainEnvVar ??
        'googleapis.com';
    // Update URL to point to the given TPC universe
    if (universeDomain !== 'googleapis.com' && options.url) {
        const url = new URL(options.url);
        if (url.hostname.endsWith('.googleapis.com')) {
            url.hostname = url.hostname.replace(/googleapis\.com$/, universeDomain);
            options.url = url.toString();
        }
    }
    // An empty params would add a querystring on a spec-compliant serializer
    if (!Object.keys(options.params).length) {
        delete options.params;
        delete options.paramsSerializer;
    }
    // Perform the HTTP request.  NOTE: this function used to return a
    // mikeal/request object. Since the transition to Axios, the method is
    // now void.  This may be a source of confusion for users upgrading from
    // version 24.0 -> 25.0 or up.
    if (authClient && typeof authClient === 'object') {
        // Validate TPC universe
        const universeFromAuth = typeof authClient.getUniverseDomain === 'function'
            ? await authClient.getUniverseDomain()
            : undefined;
        if (universeFromAuth && universeDomain !== universeFromAuth) {
            throw new Error(`The configured universe domain (${universeDomain}) does not match the universe domain found in the credentials (${universeFromAuth}). ` +
                "If you haven't configured the universe domain explicitly, googleapis.com is the default.");
        }
        if (options.http2) {
            const authHeaders = await authClient.getRequestHeaders(options.url);
            const mooOpts = Object.assign({}, options);
            mooOpts.headers = gaxios_1.Gaxios.mergeHeaders(mooOpts.headers, authHeaders);
            return h2.request(mooOpts);
        }
        else {
            const res = await authClient.request(options);
            return (0, util_1.marshallGaxiosResponse)(res);
        }
    }
    else {
        return new gaxios_1.Gaxios()
            .request(options)
            .then(res => (0, util_1.marshallGaxiosResponse)(res));
    }
}
/**
 * Basic Passthrough Stream that records the number of bytes read
 * every time the cursor is moved.
 */
class ProgressStream extends stream.Transform {
    bytesRead = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _transform(chunk, encoding, callback) {
        this.bytesRead += chunk.length;
        this.emit('progress', this.bytesRead);
        this.push(chunk);
        callback();
    }
}
function populateAPIHeader(headers, apiVersion) {
    // TODO: we should eventually think about adding browser support for this
    // populating the gl-web header (web support should also be added to
    // google-auth-library-nodejs).
    if (!(0, isbrowser_1.isBrowser)()) {
        headers['x-goog-api-client'] =
            `gdcl/${pkg.version} gl-node/${process.versions.node}`;
    }
    if (apiVersion) {
        headers['x-goog-api-version'] = apiVersion;
    }
}
//# sourceMappingURL=apirequest.js.map