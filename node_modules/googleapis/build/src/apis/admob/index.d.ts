/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { admob_v1 } from './v1';
import { admob_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof admob_v1.Admob;
    v1beta: typeof admob_v1beta.Admob;
};
export declare function admob(version: 'v1'): admob_v1.Admob;
export declare function admob(options: admob_v1.Options): admob_v1.Admob;
export declare function admob(version: 'v1beta'): admob_v1beta.Admob;
export declare function admob(options: admob_v1beta.Options): admob_v1beta.Admob;
declare const auth: AuthPlus;
export { auth };
export { admob_v1 };
export { admob_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
