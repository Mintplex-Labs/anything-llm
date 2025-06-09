/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { iap_v1 } from './v1';
import { iap_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof iap_v1.Iap;
    v1beta1: typeof iap_v1beta1.Iap;
};
export declare function iap(version: 'v1'): iap_v1.Iap;
export declare function iap(options: iap_v1.Options): iap_v1.Iap;
export declare function iap(version: 'v1beta1'): iap_v1beta1.Iap;
export declare function iap(options: iap_v1beta1.Options): iap_v1beta1.Iap;
declare const auth: AuthPlus;
export { auth };
export { iap_v1 };
export { iap_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
