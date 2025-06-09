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
exports.policyanalyzer_v1beta1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var policyanalyzer_v1beta1;
(function (policyanalyzer_v1beta1) {
    /**
     * Policy Analyzer API
     *
     *
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const policyanalyzer = google.policyanalyzer('v1beta1');
     * ```
     */
    class Policyanalyzer {
        context;
        folders;
        organizations;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.folders = new Resource$Folders(this.context);
            this.organizations = new Resource$Organizations(this.context);
            this.projects = new Resource$Projects(this.context);
        }
    }
    policyanalyzer_v1beta1.Policyanalyzer = Policyanalyzer;
    class Resource$Folders {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Folders$Locations(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Folders = Resource$Folders;
    class Resource$Folders$Locations {
        context;
        activityTypes;
        constructor(context) {
            this.context = context;
            this.activityTypes = new Resource$Folders$Locations$Activitytypes(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Folders$Locations = Resource$Folders$Locations;
    class Resource$Folders$Locations$Activitytypes {
        context;
        activities;
        constructor(context) {
            this.context = context;
            this.activities = new Resource$Folders$Locations$Activitytypes$Activities(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Folders$Locations$Activitytypes = Resource$Folders$Locations$Activitytypes;
    class Resource$Folders$Locations$Activitytypes$Activities {
        context;
        constructor(context) {
            this.context = context;
        }
        query(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://policyanalyzer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+parent}/activities:query').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
    policyanalyzer_v1beta1.Resource$Folders$Locations$Activitytypes$Activities = Resource$Folders$Locations$Activitytypes$Activities;
    class Resource$Organizations {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Organizations$Locations(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Organizations = Resource$Organizations;
    class Resource$Organizations$Locations {
        context;
        activityTypes;
        constructor(context) {
            this.context = context;
            this.activityTypes = new Resource$Organizations$Locations$Activitytypes(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Organizations$Locations = Resource$Organizations$Locations;
    class Resource$Organizations$Locations$Activitytypes {
        context;
        activities;
        constructor(context) {
            this.context = context;
            this.activities =
                new Resource$Organizations$Locations$Activitytypes$Activities(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Organizations$Locations$Activitytypes = Resource$Organizations$Locations$Activitytypes;
    class Resource$Organizations$Locations$Activitytypes$Activities {
        context;
        constructor(context) {
            this.context = context;
        }
        query(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://policyanalyzer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+parent}/activities:query').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
    policyanalyzer_v1beta1.Resource$Organizations$Locations$Activitytypes$Activities = Resource$Organizations$Locations$Activitytypes$Activities;
    class Resource$Projects {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        context;
        activityTypes;
        constructor(context) {
            this.context = context;
            this.activityTypes = new Resource$Projects$Locations$Activitytypes(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Locations$Activitytypes {
        context;
        activities;
        constructor(context) {
            this.context = context;
            this.activities =
                new Resource$Projects$Locations$Activitytypes$Activities(this.context);
        }
    }
    policyanalyzer_v1beta1.Resource$Projects$Locations$Activitytypes = Resource$Projects$Locations$Activitytypes;
    class Resource$Projects$Locations$Activitytypes$Activities {
        context;
        constructor(context) {
            this.context = context;
        }
        query(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://policyanalyzer.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1beta1/{+parent}/activities:query').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
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
    policyanalyzer_v1beta1.Resource$Projects$Locations$Activitytypes$Activities = Resource$Projects$Locations$Activitytypes$Activities;
})(policyanalyzer_v1beta1 || (exports.policyanalyzer_v1beta1 = policyanalyzer_v1beta1 = {}));
