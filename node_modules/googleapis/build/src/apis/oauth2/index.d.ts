/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { oauth2_v2 } from './v2';
export declare const VERSIONS: {
    v2: typeof oauth2_v2.Oauth2;
};
export declare function oauth2(version: 'v2'): oauth2_v2.Oauth2;
export declare function oauth2(options: oauth2_v2.Options): oauth2_v2.Oauth2;
declare const auth: AuthPlus;
export { auth };
export { oauth2_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
