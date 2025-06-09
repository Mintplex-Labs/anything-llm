"use strict";
// Copyright 2014 Google LLC
//
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
exports.Generator = void 0;
const fs = require("fs");
const { mkdir } = require('fs').promises;
const nunjucks = require("nunjucks");
const path = require("path");
const util = require("util");
const p_queue_1 = require("p-queue");
const prettier = require("prettier");
const minimist = require("yargs-parser");
const gaxios_1 = require("gaxios");
const download_1 = require("./download");
const download_2 = require("./download");
const filters = require("./filters");
const samplegen_1 = require("./samplegen");
const writeFile = util.promisify(fs.writeFile);
const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const srcPath = path.join(__dirname, '../../../src');
const TEMPLATES_DIR = path.join(srcPath, 'generator/templates');
const API_TEMPLATE = path.join(TEMPLATES_DIR, 'api-endpoint.njk');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const disclaimers = require('../../../disclaimers.json');
class Generator {
    env;
    options;
    state = new Map();
    /**
     * Generator for generating API endpoints
     * @param options Options for generation
     */
    constructor(options = {}) {
        this.options = options;
        this.env = new nunjucks.Environment(new nunjucks.FileSystemLoader(TEMPLATES_DIR), { trimBlocks: true });
        this.env.addFilter('buildurl', filters.buildurl);
        this.env.addFilter('getType', filters.getType);
        this.env.addFilter('cleanPropertyName', filters.cleanPropertyName);
        this.env.addFilter('cleanComments', filters.cleanComments);
        this.env.addFilter('camelify', filters.camelify);
        this.env.addFilter('getPathParams', filters.getPathParams);
        this.env.addFilter('getSafeParamName', filters.getSafeParamName);
        this.env.addFilter('hasResourceParam', filters.hasResourceParam);
    }
    /**
     * Log output of generator. Works just like console.log.
     */
    log(...args) {
        if (this.options && this.options.debug) {
            console.log(...args);
        }
    }
    /**
     * Write to the state log, which is used for debugging.
     * @param id DiscoveryRestUrl of the endpoint to log
     * @param message
     */
    logResult(id, message) {
        if (!this.state.has(id)) {
            this.state.set(id, new Array());
        }
        this.state.get(id).push(message);
    }
    /**
     * Generate all APIs and write to files.
     */
    async generateAllAPIs(discoveryUrl, useCache) {
        const ignore = require('../../../ignore.json').ignore;
        const discoveryPath = path.join(__dirname, '../../../discovery');
        let changes = new Array();
        if (useCache) {
            console.log('Reading from cache...');
        }
        else {
            changes = await (0, download_2.downloadDiscoveryDocs)({
                includePrivate: this.options.includePrivate,
                discoveryUrl,
                downloadPath: discoveryPath,
            });
        }
        const indexPath = path.join(discoveryPath, 'index.json');
        const file = await readFile(indexPath, 'utf8');
        const apis = JSON.parse(file).items;
        const queue = new p_queue_1.default({ concurrency: 50 });
        console.log(`Generating ${apis.length} APIs...`);
        await queue.addAll(apis.map(api => async () => {
            // look at ignore.json to find a list of APIs to ignore
            if (ignore.includes(api.id)) {
                this.log(`Skipping API ${api.id}`);
                return;
            }
            this.log(`Generating API for ${api.id}...`);
            this.logResult(api.discoveryRestUrl, 'Attempting first generateAPI call...');
            try {
                const apiPath = path.join(discoveryPath, api.id.replace(':', '-') + '.json');
                await this.generateAPI(apiPath);
                this.logResult(api.discoveryRestUrl, 'GenerateAPI call success!');
            }
            catch (e) {
                this.logResult(api.discoveryRestUrl, `GenerateAPI call failed with error: ${e}, moving on.`);
                console.error(`Failed to generate API: ${api.id}`);
                console.error(e);
                console.log(api.id +
                    '\n-----------\n' +
                    util.inspect(this.state.get(api.discoveryRestUrl), {
                        maxArrayLength: null,
                    }) +
                    '\n');
            }
        }));
        await this.generateIndex(apis);
        return changes;
    }
    async generateIndex(metadata, directory) {
        const apis = {};
        const apisPath = path.join(srcPath, 'apis');
        const indexPath = path.join(apisPath, 'index.ts');
        const rootIndexPath = path.join(apisPath, '../', 'index.ts');
        // Dynamically discover available APIs
        const files = await readDir(apisPath);
        for (const file of files) {
            const filePath = path.join(apisPath, file);
            if (!(await stat(filePath)).isDirectory()) {
                continue;
            }
            if (directory && file !== directory) {
                continue;
            }
            apis[file] = {};
            const files = await readDir(path.join(apisPath, file));
            for (const version of files) {
                const parts = path.parse(version);
                if (!version.endsWith('.d.ts') &&
                    parts.ext === '.ts' &&
                    version !== 'index.ts') {
                    apis[file][version] = parts.name;
                    const desc = metadata.find(x => x.name === file)?.description;
                    // generate the index.ts
                    const apiIdxPath = path.join(apisPath, file, 'index.ts');
                    const apiIndexData = { name: file, api: apis[file] };
                    await this.render('api-index.njk', apiIndexData, apiIdxPath);
                    // generate the package.json
                    const [pkgPath, pkgData] = await this.getPkgPathAndData(apisPath, file, desc || '');
                    await this.render('package.json', pkgData, pkgPath);
                    // generate the README.md
                    const rdPath = path.join(apisPath, file, 'README.md');
                    const disclaimer = disclaimers.find(disclaimer => {
                        return disclaimer.api === file;
                    });
                    await this.render('README.md.njk', { name: file, desc, disclaimer }, rdPath);
                    // generate the tsconfig.json
                    const tsPath = path.join(apisPath, file, 'tsconfig.json');
                    await this.render('tsconfig.json.njk', {}, tsPath);
                    // generate the webpack.config.js
                    const wpPath = path.join(apisPath, file, 'webpack.config.js');
                    await this.render('webpack.config.js.njk', { name: file }, wpPath);
                }
            }
        }
        if (directory) {
            return;
        }
        await this.render('index.njk', { apis }, indexPath);
        await this.render('root-index.njk', { apis }, rootIndexPath);
    }
    async getPkgPathAndData(apisPath, file, desc, defaultVersion = '0.1.0') {
        const pkgPath = path.join(apisPath, file, 'package.json');
        const packageData = { name: file, desc, version: defaultVersion };
        // Use the version from the existing package.json, if possible:
        try {
            const pkgRaw = await readFile(pkgPath, 'utf8');
            const pkg = JSON.parse(pkgRaw);
            packageData.version = pkg.version;
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                console.info(`${pkgPath} not found`);
            }
            else {
                throw err;
            }
        }
        return [pkgPath, packageData];
    }
    /**
     * Generate API file given discovery URL
     * @param apiDiscoveryUri URL or filename of discovery doc for API
     */
    async generateAPI(apiDiscoveryUrl) {
        const isUrl = apiDiscoveryUrl.startsWith('https://');
        let filePath;
        if (!isUrl) {
            this.log(`Reading from file ${path.relative('.', apiDiscoveryUrl)}`);
            const file = await readFile(apiDiscoveryUrl, 'utf-8');
            filePath = await this.generate(apiDiscoveryUrl, JSON.parse(file));
        }
        else {
            this.log(`Reading from url ${apiDiscoveryUrl}`);
            const res = await (0, gaxios_1.request)({ url: apiDiscoveryUrl });
            filePath = await this.generate(apiDiscoveryUrl, res.data);
        }
        return filePath;
    }
    async generate(apiDiscoveryUrl, schema) {
        this.logResult(apiDiscoveryUrl, 'Generating APIs...');
        const apiPath = path.join(srcPath, 'apis', schema.name);
        const exportFilename = path.join(apiPath, schema.version + '.ts');
        await mkdir(path.dirname(exportFilename), { recursive: true });
        // populate the `method.fragment` property with samples
        await (0, samplegen_1.addFragments)(schema);
        // generate the API (ex: src/apis/youtube/v3.ts)
        await this.render(API_TEMPLATE, { api: schema }, exportFilename);
        // generate samples on disk at:
        // src/apis/<service>/samples/<version>/<method>
        // generateSamples(apiPath, schema);
        this.logResult(apiDiscoveryUrl, 'Template generation complete.');
        return exportFilename;
    }
    /**
     * Render a nunjucks template, format it, and write to disk
     */
    async render(templatePath, data, outputPath) {
        let output = this.env.render(templatePath, data);
        const ext = path.extname(outputPath);
        if (ext === '.js' || ext === '.ts') {
            output = await prettier.format(output, {
                bracketSpacing: false,
                singleQuote: true,
                trailingComma: 'es5',
                arrowParens: 'avoid',
                parser: 'typescript',
            });
        }
        await writeFile(outputPath, output, { encoding: 'utf8' });
    }
    async generateReleasePleaseConfig() {
        /*
        1. pull in disclaimers (files we're not going to generate)
        2. list all folders inside apis directory
        3. find the delta from 2 - 1
        4. fill out bootstrap sha
        */
        const disclaimers = require('../../../disclaimers.json');
        const excludedAPIs = disclaimers.map(x => x.api);
        const apis = fs.readdirSync(path.join(srcPath, 'apis'), {
            withFileTypes: true,
        });
        const releasableAPIs = apis
            .filter(e => e.isDirectory() && !excludedAPIs.includes(e.name))
            .map(x => x.name);
        const rootPath = path.join(__dirname, '../../../');
        // Bootstrap sha is used the first time the releaser runs when it grabs the initial commits
        // Afterwards, it uses the most recent release as a starting point
        const releasePleaseConfig = {
            'bootstrap-sha': '6e61af34c0bfdfc3d6f973bffcd6a7e2420590d2',
            packages: {},
        };
        const releasePleaseManifest = {};
        for (const api of releasableAPIs) {
            releasePleaseConfig.packages[`src/apis/${api}`] = {};
            releasePleaseManifest[`src/apis/${api}`] = require(`../../../src/apis/${api}/package.json`).version;
        }
        // Include the root library in the config:
        releasePleaseManifest['.'] = require('../../../package.json').version;
        releasePleaseConfig.packages['.'] = {};
        fs.writeFileSync(path.resolve(rootPath, './release-please-config.json'), JSON.stringify(releasePleaseConfig, null, 2), 'utf8');
        fs.writeFileSync(path.resolve(rootPath, './.release-please-manifest.json'), JSON.stringify(releasePleaseManifest, null, 2), 'utf8');
    }
}
exports.Generator = Generator;
async function main() {
    const argv = minimist(process.argv.slice(2));
    const discoveryUrl = argv['discovery-url'];
    const useCache = argv['use-cache'];
    const includePrivate = argv['include-private'];
    console.log(`useCache: ${useCache}`);
    console.log(`includePrivate: ${includePrivate}`);
    const gen = new Generator({ debug: true, includePrivate });
    if (!discoveryUrl && argv._.length > 0) {
        argv._.forEach(async (url) => {
            console.log(`Generating API for ${url}`);
            const filePath = await gen.generateAPI('' + url);
            const filePathParts = filePath.split('/');
            await gen.generateIndex([], filePathParts[filePathParts.length - 2]);
            console.log('Generated API for ' + url);
        });
    }
    else {
        console.log('Generating APIs...');
        await gen.generateAllAPIs(discoveryUrl || download_1.DISCOVERY_URL, useCache);
        // Re-generates release-please manifest and config files
        console.log('Generating .release-please-manifest.json and release-please-config.json');
        await gen.generateReleasePleaseConfig();
        console.log('Finished generating APIs!');
    }
}
if (require.main === module) {
    main().catch(console.error);
}
