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
exports.pollen_v1 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-irregular-whitespace */
const googleapis_common_1 = require("googleapis-common");
var pollen_v1;
(function (pollen_v1) {
    /**
     * Pollen API
     *
     * The Pollen API.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const pollen = google.pollen('v1');
     * ```
     */
    class Pollen {
        context;
        forecast;
        mapTypes;
        constructor(options, google) {
            this.context = {
                _options: options || {},
                google,
            };
            this.forecast = new Resource$Forecast(this.context);
            this.mapTypes = new Resource$Maptypes(this.context);
        }
    }
    pollen_v1.Pollen = Pollen;
    class Resource$Forecast {
        context;
        constructor(context) {
            this.context = context;
        }
        lookup(paramsOrCallback, optionsOrCallback, callback) {
            let params = (paramsOrCallback || {});
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
            const rootUrl = options.rootUrl || 'https://pollen.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/forecast:lookup').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: [],
                pathParams: [],
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
    pollen_v1.Resource$Forecast = Resource$Forecast;
    class Resource$Maptypes {
        context;
        heatmapTiles;
        constructor(context) {
            this.context = context;
            this.heatmapTiles = new Resource$Maptypes$Heatmaptiles(this.context);
        }
    }
    pollen_v1.Resource$Maptypes = Resource$Maptypes;
    class Resource$Maptypes$Heatmaptiles {
        context;
        constructor(context) {
            this.context = context;
        }
        lookupHeatmapTile(paramsOrCallback, optionsOrCallback, callback) {
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
            const rootUrl = options.rootUrl || 'https://pollen.googleapis.com/';
            const parameters = {
                options: Object.assign({
                    url: (rootUrl + '/v1/mapTypes/{mapType}/heatmapTiles/{zoom}/{x}/{y}').replace(/([^:]\/)\/+/g, '$1'),
                    method: 'GET',
                    apiVersion: '',
                }, options),
                params,
                requiredParams: ['mapType', 'zoom', 'x', 'y'],
                pathParams: ['mapType', 'x', 'y', 'zoom'],
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
    pollen_v1.Resource$Maptypes$Heatmaptiles = Resource$Maptypes$Heatmaptiles;
})(pollen_v1 || (exports.pollen_v1 = pollen_v1 = {}));
