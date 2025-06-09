/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { safebrowsing_v4 } from './v4';
import { safebrowsing_v5 } from './v5';
export declare const VERSIONS: {
    v4: typeof safebrowsing_v4.Safebrowsing;
    v5: typeof safebrowsing_v5.Safebrowsing;
};
export declare function safebrowsing(version: 'v4'): safebrowsing_v4.Safebrowsing;
export declare function safebrowsing(options: safebrowsing_v4.Options): safebrowsing_v4.Safebrowsing;
export declare function safebrowsing(version: 'v5'): safebrowsing_v5.Safebrowsing;
export declare function safebrowsing(options: safebrowsing_v5.Options): safebrowsing_v5.Safebrowsing;
declare const auth: AuthPlus;
export { auth };
export { safebrowsing_v4 };
export { safebrowsing_v5 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
