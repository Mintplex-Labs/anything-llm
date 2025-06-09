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
exports.sessions = void 0;
exports.request = request;
exports.closeSession = closeSession;
const http2 = require("http2");
const zlib = require("zlib");
const url_1 = require("url");
const qs = require("qs");
const extend = require("extend");
const stream_1 = require("stream");
const util = require("util");
const process = require("process");
const util_1 = require("./util");
const { HTTP2_HEADER_CONTENT_ENCODING, HTTP2_HEADER_CONTENT_TYPE, HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, HTTP2_HEADER_STATUS, } = http2.constants;
const DEBUG = !!process.env.HTTP2_DEBUG;
/**
 * List of sessions current in use.
 * @private
 */
exports.sessions = {};
/**
 * Public method to make an http2 request.
 * @param config - Request options.
 */
async function request(config) {
    const opts = extend(true, {}, config);
    opts.validateStatus = opts.validateStatus || validateStatus;
    opts.responseType = opts.responseType || 'json';
    const url = new url_1.URL(opts.url);
    // Check for an existing session to this host, or go create a new one.
    const sessionData = _getClient(url.host);
    // Since we're using this session, clear the timeout handle to ensure
    // it stays in memory and connected for a while further.
    if (sessionData.timeoutHandle !== undefined) {
        clearTimeout(sessionData.timeoutHandle);
    }
    // Assemble the querystring based on config.params.  We're using the
    // `qs` module to make life a little easier.
    let pathWithQs = url.pathname;
    if (config.params && Object.keys(config.params).length > 0) {
        const serializer = config.paramsSerializer || qs.stringify;
        const q = serializer(opts.params);
        pathWithQs += `?${q}`;
    }
    // Assemble the headers based on basic HTTP2 primitives (path, method) and
    // custom headers sent from the consumer. Note: the native `Headers` type does
    // not support HTTP2 header names (e.g. ':status')
    const headers = (0, util_1.headersToClassicHeaders)(opts.headers);
    headers[HTTP2_HEADER_PATH] = pathWithQs;
    headers[HTTP2_HEADER_METHOD] = config.method || 'GET';
    opts.headers = headers;
    // NOTE: This is working around an upstream bug in `apirequest.ts`. The
    // request path assumes that the `content-type` header is going to be set in
    // the underlying HTTP Client. This hack provides bug for bug compatability
    // with this bug in gaxios:
    // https://github.com/googleapis/gaxios/blob/main/src/gaxios.ts#L202
    if (!headers[HTTP2_HEADER_CONTENT_TYPE]) {
        if (opts.responseType !== 'text') {
            headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/json';
        }
    }
    const res = {
        config,
        headers: {},
        status: 0,
        data: {},
        statusText: '',
    };
    const chunks = [];
    const session = sessionData.session;
    let req;
    return new Promise((resolve, reject) => {
        try {
            req = session
                .request(headers)
                .on('response', responseHeaders => {
                Object.assign(res, {
                    headers: responseHeaders,
                    status: responseHeaders[HTTP2_HEADER_STATUS],
                });
                let stream = req;
                if (responseHeaders[HTTP2_HEADER_CONTENT_ENCODING] === 'gzip') {
                    stream = req.pipe(zlib.createGunzip());
                }
                if (opts.responseType === 'stream') {
                    res.data = stream;
                    resolve(res);
                    return;
                }
                stream
                    .on('data', d => {
                    chunks.push(d);
                })
                    .on('error', err => {
                    reject(err);
                    return;
                })
                    .on('end', () => {
                    const buf = Buffer.concat(chunks);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let data = buf;
                    if (buf) {
                        if (opts.responseType === 'json') {
                            try {
                                data = JSON.parse(buf.toString('utf8'));
                            }
                            catch {
                                data = buf.toString('utf8');
                            }
                        }
                        else if (opts.responseType === 'text') {
                            data = buf.toString('utf8');
                        }
                        else if (opts.responseType === 'arraybuffer') {
                            data = buf.buffer;
                        }
                        res.data = data;
                    }
                    if (!opts.validateStatus(res.status)) {
                        let message = `Request failed with status code ${res.status}. `;
                        if (res.data && typeof res.data === 'object') {
                            const body = util.inspect(res.data, { depth: 5 });
                            message = `${message}\n'${body}`;
                        }
                        reject(new Error(message, { cause: res }));
                    }
                    resolve(res);
                    return;
                });
            })
                .on('error', e => {
                reject(e);
                return;
            });
        }
        catch (e) {
            closeSession(url)
                .then(() => reject(e))
                .catch(reject);
            return;
        }
        res.request = req;
        // If data was provided, write it to the request in the form of
        // a stream, string data, or a basic object.
        if (config.data) {
            if (config.data instanceof stream_1.Stream) {
                config.data.pipe(req);
            }
            else if (typeof config.data === 'string') {
                const data = Buffer.from(config.data);
                req.end(data);
            }
            else if (typeof config.data === 'object') {
                const data = JSON.stringify(config.data);
                req.end(data);
            }
        }
        // Create a timeout so the Http2Session will be cleaned up after
        // a period of non-use. 500 milliseconds was chosen because it's
        // a nice round number, and I don't know what would be a better
        // choice. Keeping this channel open will hold a file descriptor
        // which will prevent the process from exiting.
        sessionData.timeoutHandle = setTimeout(() => closeSession(url), 500);
    });
}
/**
 * By default, throw for any non-2xx status code
 * @param status - status code from the HTTP response
 */
function validateStatus(status) {
    return status >= 200 && status < 300;
}
/**
 * Obtain an existing h2 session or go create a new one.
 * @param host - The hostname to which the session belongs.
 */
function _getClient(host) {
    if (!exports.sessions[host]) {
        if (DEBUG) {
            console.log(`Creating client for ${host}`);
        }
        const session = http2.connect(`https://${host}`);
        session
            .on('error', e => {
            console.error(`*ERROR*: ${e}`);
            delete exports.sessions[host];
        })
            .on('goaway', (errorCode, lastStreamId) => {
            console.error(`*GOAWAY*: ${errorCode} : ${lastStreamId}`);
            delete exports.sessions[host];
        });
        exports.sessions[host] = { session };
    }
    else {
        if (DEBUG) {
            console.log(`Used cached client for ${host}`);
        }
    }
    return exports.sessions[host];
}
async function closeSession(url) {
    const sessionData = exports.sessions[url.host];
    if (!sessionData) {
        return;
    }
    const { session } = sessionData;
    delete exports.sessions[url.host];
    if (DEBUG) {
        console.error(`Closing ${url.host}`);
    }
    session.close(() => {
        if (DEBUG) {
            console.error(`Closed ${url.host}`);
        }
    });
    setTimeout(() => {
        if (session && !session.destroyed) {
            if (DEBUG) {
                console.log(`Forcing close ${url.host}`);
            }
            if (session) {
                session.destroy();
            }
        }
    }, 1000);
}
//# sourceMappingURL=http2.js.map