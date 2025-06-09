import { GeneratedAPIs } from './apis';
import { AuthPlus, APIEndpoint, Endpoint, GlobalOptions } from 'googleapis-common';
export { AuthPlus };
export declare class GoogleApis extends GeneratedAPIs {
    private _discovery;
    auth: AuthPlus;
    _options: GlobalOptions;
    [index: string]: APIEndpoint;
    /**
     * GoogleApis constructor.
     *
     * @example
     * ```js
     * const GoogleApis = require('googleapis').GoogleApis;
     * const google = new GoogleApis();
     * ```
     *
     * @param options - Configuration options.
     */
    constructor(options?: GlobalOptions);
    /**
     * Obtain a Map of supported APIs, along with included API versions.
     */
    getSupportedAPIs(): {
        [index: string]: string[];
    };
    /**
     * Set options.
     *
     * @param options - Configuration options.
     */
    options(options?: GlobalOptions): void;
    /**
     * Add APIs endpoints to googleapis object
     * E.g. googleapis.drive and googleapis.datastore
     *
     * @param apisToAdd - Apis to be added to this GoogleApis instance.
     */
    private addAPIs;
    /**
     * Dynamically generate an apis object that can provide Endpoint objects for
     * the discovered APIs.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const discoveryUrl = 'https://myapp.appspot.com/_ah/api/discovery/v1/apis/';
     * google.discover(discoveryUrl, function (err) {
     *   const someapi = google.someapi('v1');
     * });
     * ```
     *
     * @param url - Url to the discovery service for a set of APIs. e.g. https://www.googleapis.com/discovery/v1/apis
     * @param callback - Callback function.
     */
    discover(url: string): Promise<void>;
    discover(url: string, callback: (err?: Error) => void): void;
    private discoverAsync;
    /**
     * Dynamically generate an Endpoint object from a discovery doc.
     *
     * @param path - Url or file path to discover doc for a single API.
     * @param options - Options to configure the Endpoint object generated from the discovery doc.
     * @returns A promise that resolves with the configured endpoint.
     */
    discoverAPI<T = Endpoint>(apiPath: string, options?: {}): Promise<Readonly<T>>;
}
