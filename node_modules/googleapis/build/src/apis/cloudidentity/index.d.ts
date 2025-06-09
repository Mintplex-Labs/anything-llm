/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudidentity_v1 } from './v1';
import { cloudidentity_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof cloudidentity_v1.Cloudidentity;
    v1beta1: typeof cloudidentity_v1beta1.Cloudidentity;
};
export declare function cloudidentity(version: 'v1'): cloudidentity_v1.Cloudidentity;
export declare function cloudidentity(options: cloudidentity_v1.Options): cloudidentity_v1.Cloudidentity;
export declare function cloudidentity(version: 'v1beta1'): cloudidentity_v1beta1.Cloudidentity;
export declare function cloudidentity(options: cloudidentity_v1beta1.Options): cloudidentity_v1beta1.Cloudidentity;
declare const auth: AuthPlus;
export { auth };
export { cloudidentity_v1 };
export { cloudidentity_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
