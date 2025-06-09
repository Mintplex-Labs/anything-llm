"use strict";
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.gfs = exports.DISCOVERY_URL = void 0;
exports.downloadDiscoveryDocs = downloadDiscoveryDocs;
exports.shouldUpdate = shouldUpdate;
exports.sortKeys = sortKeys;
exports.getDiffs = getDiffs;
exports.flattenObject = flattenObject;
const minimist = require("yargs-parser");
const path = require("path");
const fs = require("fs");
const { mkdir } = require('fs').promises;
const p_queue_1 = require("p-queue");
const gaxios_1 = require("gaxios");
exports.DISCOVERY_URL = 'https://raw.githubusercontent.com/googleapis/discovery-artifact-manager/master/discoveries';
// exported for mocking purposes
exports.gfs = {
    mkdir: async (dir) => mkdir(dir, { recursive: true }),
    writeFile: (path, obj) => {
        fs.writeFileSync(path, JSON.stringify(obj, null, 2));
    },
    readFile: (path) => {
        return fs.readFileSync(path, 'utf8');
    },
};
/**
 * Download all discovery documents into the /discovery directory.
 * @param options
 */
async function downloadDiscoveryDocs(options) {
    await exports.gfs.mkdir(options.downloadPath);
    const headers = options.includePrivate
        ? new Headers()
        : new Headers({ 'X-User-Ip': '0.0.0.0' });
    headers.append('Content-Type', headers.get('Content-Type') ?? 'application/json');
    console.log(`sending request to ${options.discoveryUrl}`);
    const res = await (0, gaxios_1.request)({
        url: `${options.discoveryUrl}/index.json`,
        headers,
    });
    const discoveryDoc = JSON.parse(res.data);
    const apis = discoveryDoc.items;
    const indexPath = path.join(options.downloadPath, 'index.json');
    exports.gfs.writeFile(indexPath, discoveryDoc);
    const queue = new p_queue_1.default({ concurrency: 25 });
    console.log(`Downloading ${apis.length} APIs...`);
    const changes = await queue.addAll(apis.map(api => async () => {
        console.log(`Downloading ${api.id}...`);
        const apiPath = path.join(options.downloadPath, api.id.replace(':', '-') + '.json');
        const url = `${options.discoveryUrl}/${api.name}.${api.version}.json`;
        const changeSet = { api, changes: [] };
        try {
            const res = await (0, gaxios_1.request)({ url });
            // The keys in the downloaded JSON come back in an arbitrary order from
            // request to request. Sort them before storing.
            const newDoc = sortKeys(JSON.parse(res.data));
            let updateFile = true;
            try {
                const oldDoc = JSON.parse(await exports.gfs.readFile(apiPath));
                updateFile = shouldUpdate(newDoc, oldDoc);
                changeSet.changes = getDiffs(oldDoc, newDoc);
            }
            catch {
                // If the file doesn't exist, that's fine it's just new
            }
            if (updateFile) {
                exports.gfs.writeFile(apiPath, newDoc);
            }
        }
        catch (e) {
            console.error(`Error downloading: ${url}`);
        }
        return changeSet;
    }));
    cleanupLibrariesNotInIndexJSON(apis, options);
    return changes;
}
// These are libraries we should no longer support because
// they are not present in the index.json
// example: b/148605368
function cleanupLibrariesNotInIndexJSON(apis, options) {
    const srcPath = path.join(__dirname, '../../../src', 'apis');
    const discoveryDirectory = fs.readdirSync(options.downloadPath);
    const apisReplaced = apis.map(x => x.id.toString().replace(':', '-') + '.json');
    // So that we don't delete index.json
    apisReplaced.push('index.json');
    const discoveryDocsToDelete = discoveryDirectory.filter(x => !apisReplaced.includes(x));
    const clientFilesToDelete = discoveryDocsToDelete.map(x => {
        const apiName = x.split('-')[0];
        const versionName = apiName[1].split('.')[0];
        return path.join(srcPath, apiName, `${versionName}.ts`);
    });
    discoveryDocsToDelete.forEach(x => fs.unlinkSync(path.join(options.downloadPath, x)));
    clientFilesToDelete.forEach(x => fs.unlinkSync(x));
}
const ignoreLines = /^\s+"(?:etag|revision)": ".+"/;
/**
 * Determine if any of the changes in the discovery docs were interesting
 * @param newDoc New downloaded schema
 * @param oldDoc The existing schema from disk
 */
function shouldUpdate(newDoc, oldDoc) {
    const [newLines, oldLines] = [newDoc, oldDoc].map(doc => JSON.stringify(doc, null, 2)
        .split('\n')
        .filter(l => !ignoreLines.test(l))
        .join('\n'));
    return newLines !== oldLines;
}
/**
 * Given an arbitrary object, recursively sort the properties on the object
 * by the name of the key.  For example:
 * {
 *   b: 1,
 *   a: 2
 * }
 * becomes....
 * {
 *   a: 2,
 *   b: 1
 * }
 * @param obj Object to be sorted
 * @returns object with sorted keys
 */
function sortKeys(obj) {
    const sorted = {};
    let keys = Object.keys(obj);
    keys = keys.sort();
    for (const key of keys) {
        // typeof [] === 'object', which is maddening
        if (!Array.isArray(obj[key]) &&
            typeof obj[key] === 'object' &&
            typeof key === 'string') {
            sorted[key] = sortKeys(obj[key]);
        }
        else {
            sorted[key] = obj[key];
        }
    }
    return sorted;
}
/**
 * Get a diff between the two
 */
function getDiffs(oldDoc, newDoc) {
    const changes = new Array();
    const flatOld = flattenObject(oldDoc);
    const flatNew = flattenObject(newDoc);
    // find deleted nodes
    Object.keys(flatOld).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(flatNew, key)) {
            changes.push({
                action: 'DELETED',
                keyName: key,
            });
        }
    });
    // find added nodes
    Object.keys(flatNew).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(flatOld, key)) {
            changes.push({
                action: 'ADDED',
                keyName: key,
            });
        }
    });
    // find updated nodes
    Object.keys(flatOld).forEach(key => {
        let oldValue = flatOld[key];
        if (Array.isArray(oldValue)) {
            oldValue = oldValue.join(', ');
        }
        let newValue = flatNew[key];
        if (newValue) {
            if (Array.isArray(newValue)) {
                newValue = newValue.join(', ');
            }
            if (newValue !== oldValue && key !== 'revision' && key !== 'etag') {
                changes.push({
                    action: 'CHANGED',
                    keyName: key,
                });
            }
        }
    });
    return changes;
}
/**
 * Given a complex nested object, flatten the key paths so this:
 * {
 *   a: {
 *     b: 2
 *   },
 *   c: 3
 * }
 * becomes ...
 * {
 *   'a.b': 2
 *   c: 3
 * }
 */
function flattenObject(doc, flat = {}, prefix = '') {
    const keys = Object.keys(doc);
    const newPrefix = prefix ? `${prefix}.` : '';
    for (const key of keys) {
        const fullKey = newPrefix + key;
        const value = doc[key];
        if (!Array.isArray(value) && typeof value === 'object') {
            flattenObject(value, flat, fullKey);
        }
        else {
            flat[fullKey] = value;
        }
    }
    return flat;
}
/**
 * Allow this file to be directly run via `npm run download`, or imported
 * and used by `generator.ts`
 */
if (require.main === module) {
    const argv = minimist(process.argv.slice(2));
    const discoveryUrl = argv['discovery-url'] || exports.DISCOVERY_URL;
    const downloadPath = argv['download-path'] || path.join(__dirname, '../../../discovery');
    downloadDiscoveryDocs({ discoveryUrl, downloadPath }).catch(err => {
        throw err;
    });
}
