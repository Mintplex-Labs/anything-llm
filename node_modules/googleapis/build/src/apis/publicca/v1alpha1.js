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
exports.publicca_v1alpha1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var publicca_v1alpha1;
(function (publicca_v1alpha1) {
    /**
     * Public Certificate Authority API
     *
     * The Public Certificate Authority API may be used to create and manage ACME external account binding keys associated with Google Trust Services&#39; publicly trusted certificate authority.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const publicca = google.publicca('v1alpha1');
     * ```
     */
    class Publicca {
        context;
        projects;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.projects = new Resource$Projects(this.context);
        }
    }
    publicca_v1alpha1.Publicca = Publicca;
    class Resource$Projects {
        context;
        locations;
        constructor(context) {
            this.context = context;
            this.locations = new Resource$Projects$Locations(this.context);
        }
    }
    publicca_v1alpha1.Resource$Projects = Resource$Projects;
    class Resource$Projects$Locations {
        context;
        externalAccountKeys;
        constructor(context) {
            this.context = context;
            this.externalAccountKeys =
                new Resource$Projects$Locations$Externalaccountkeys(this.context);
        }
    }
    publicca_v1alpha1.Resource$Projects$Locations = Resource$Projects$Locations;
    class Resource$Projects$Locations$Externalaccountkeys {
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
            const rootUrl = options.rootUrl || 'https://publicca.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1alpha1/{+parent}/externalAccountKeys').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
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
    publicca_v1alpha1.Resource$Projects$Locations$Externalaccountkeys = Resource$Projects$Locations$Externalaccountkeys;
})(publicca_v1alpha1 || (exports.publicca_v1alpha1 = publicca_v1alpha1 = {}));
