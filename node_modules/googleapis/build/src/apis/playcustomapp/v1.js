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
exports.playcustomapp_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var playcustomapp_v1;
(function (playcustomapp_v1) {
    /**
     * Google Play Custom App Publishing API
     *
     * API to create and publish custom Android apps
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const playcustomapp = google.playcustomapp('v1');
     * ```
     */
    class Playcustomapp {
        context;
        accounts;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.accounts = new Resource$Accounts(this.context);
        }
    }
    playcustomapp_v1.Playcustomapp = Playcustomapp;
    class Resource$Accounts {
        context;
        customApps;
        constructor(context) {
            this.context = context;
            this.customApps = new Resource$Accounts$Customapps(this.context);
        }
    }
    playcustomapp_v1.Resource$Accounts = Resource$Accounts;
    class Resource$Accounts$Customapps {
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
                params = {};
                options = {};
            }
            if (typeof optionsOrCallback === 'function') {
                callback = optionsOrCallback;
                options = {};
            }
            const rootUrl = options.rootUrl || 'https://playcustomapp.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/playcustomapp/v1/accounts/{account}/customApps').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'POST',
                    apiVersion: '',
                }, options),
                params,
                mediaUrl: (rootUrl + '/upload/playcustomapp/v1/accounts/{account}/customApps').replace(/([^:]\/)\/+/g, '$1'),
                requiredParams: ['account'],
                pathParams: ['account'],
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
    playcustomapp_v1.Resource$Accounts$Customapps = Resource$Accounts$Customapps;
})(playcustomapp_v1 || (exports.playcustomapp_v1 = playcustomapp_v1 = {}));
