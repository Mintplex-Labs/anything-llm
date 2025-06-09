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
exports.ideahub_v1beta = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var ideahub_v1beta;
(function (ideahub_v1beta) {
    /**
     * Idea Hub API
     *
     * This is an invitation-only API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const ideahub = google.ideahub('v1beta');
     * ```
     */
    class Ideahub {
        context;
        platforms;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.platforms = new Resource$Platforms(this.context);
        }
    }
    ideahub_v1beta.Ideahub = Ideahub;
    class Resource$Platforms {
        context;
        properties;
        constructor(context) {
            this.context = context;
            this.properties = new Resource$Platforms$Properties(this.context);
        }
    }
    ideahub_v1beta.Resource$Platforms = Resource$Platforms;
    class Resource$Platforms$Properties {
        context;
        ideaActivities;
        ideas;
        ideaStates;
        locales;
        topicStates;
        constructor(context) {
            this.context = context;
            this.ideaActivities = new Resource$Platforms$Properties$Ideaactivities(this.context);
            this.ideas = new Resource$Platforms$Properties$Ideas(this.context);
            this.ideaStates = new Resource$Platforms$Properties$Ideastates(this.context);
            this.locales = new Resource$Platforms$Properties$Locales(this.context);
            this.topicStates = new Resource$Platforms$Properties$Topicstates(this.context);
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties = Resource$Platforms$Properties;
    class Resource$Platforms$Properties$Ideaactivities {
        context;
        constructor(context) {
            this.context = context;
        }
        create(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params =
                    {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://ideahub.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta/{+parent}/ideaActivities').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties$Ideaactivities = Resource$Platforms$Properties$Ideaactivities;
    class Resource$Platforms$Properties$Ideas {
        context;
        constructor(context) {
            this.context = context;
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://ideahub.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta/{+parent}/ideas').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties$Ideas = Resource$Platforms$Properties$Ideas;
    class Resource$Platforms$Properties$Ideastates {
        context;
        constructor(context) {
            this.context = context;
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://ideahub.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties$Ideastates = Resource$Platforms$Properties$Ideastates;
    class Resource$Platforms$Properties$Locales {
        context;
        constructor(context) {
            this.context = context;
        }
        list(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://ideahub.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta/{+parent}/locales').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                }, options),
                params,
                requiredParams: ['parent'],
                pathParams: ['parent'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties$Locales = Resource$Platforms$Properties$Locales;
    class Resource$Platforms$Properties$Topicstates {
        context;
        constructor(context) {
            this.context = context;
        }
        patch(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback ||
                {});
            let options = (optionsOrCallback || {});
            if (typeof paramsOrCallback === 'function') {
                callback = paramsOrCallback;
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://ideahub.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta/{+name}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'PATCH',
                }, options),
                params,
                requiredParams: ['name'],
                pathParams: ['name'],
                context: this.context,
            };
            if (callback) {
                (0, googleapis_common_1.createAPIRequest)(parameters, callback);
            }
            else {
                return (0, googleapis_common_1.createAPIRequest)(parameters);
            }
        }
    }
    ideahub_v1beta.Resource$Platforms$Properties$Topicstates = Resource$Platforms$Properties$Topicstates;
})(ideahub_v1beta || (exports.ideahub_v1beta = ideahub_v1beta = {}));
