import { GoogleConfigurable, GlobalOptions, APIRequestContext } from 'googleapis-common';
export declare namespace doubleclickbidmanager_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    /**
     * DoubleClick Bid Manager API
     *
     * DoubleClick Bid Manager API allows users to manage and create campaigns and reports.
     *
     * @example
     * ```js
     * const {google} = require('googleapis');
     * const doubleclickbidmanager = google.doubleclickbidmanager('v1');
     * ```
     */
    class Doubleclickbidmanager {
        context: APIRequestContext;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
}
