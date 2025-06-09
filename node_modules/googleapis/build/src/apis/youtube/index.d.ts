/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { youtube_v3 } from './v3';
export declare const VERSIONS: {
    v3: typeof youtube_v3.Youtube;
};
export declare function youtube(version: 'v3'): youtube_v3.Youtube;
export declare function youtube(options: youtube_v3.Options): youtube_v3.Youtube;
declare const auth: AuthPlus;
export { auth };
export { youtube_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
