import { GoogleConfigurable, GlobalOptions, APIRequestContext } from 'googleapis-common';
export declare namespace androidpublisher_v1 {
    interface Options extends GlobalOptions {
        version: 'v1';
    }
    /**
     * Google Play Developer API
     *
     * Accesses Android application developers&#39; Google Play accounts.
     *
     * @example
     * const {google} = require('googleapis');
     * const androidpublisher = google.androidpublisher('v1');
     *
     * @namespace androidpublisher
     * @type {Function}
     * @version v1
     * @variation v1
     * @param {object=} options Options for Androidpublisher
     */
    class Androidpublisher {
        context: APIRequestContext;
        constructor(options: GlobalOptions, google?: GoogleConfigurable);
    }
}
