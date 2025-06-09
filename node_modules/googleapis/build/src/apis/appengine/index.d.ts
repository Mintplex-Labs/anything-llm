/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { appengine_v1 } from './v1';
import { appengine_v1alpha } from './v1alpha';
import { appengine_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof appengine_v1.Appengine;
    v1alpha: typeof appengine_v1alpha.Appengine;
    v1beta: typeof appengine_v1beta.Appengine;
};
export declare function appengine(version: 'v1'): appengine_v1.Appengine;
export declare function appengine(options: appengine_v1.Options): appengine_v1.Appengine;
export declare function appengine(version: 'v1alpha'): appengine_v1alpha.Appengine;
export declare function appengine(options: appengine_v1alpha.Options): appengine_v1alpha.Appengine;
export declare function appengine(version: 'v1beta'): appengine_v1beta.Appengine;
export declare function appengine(options: appengine_v1beta.Options): appengine_v1beta.Appengine;
declare const auth: AuthPlus;
export { auth };
export { appengine_v1 };
export { appengine_v1alpha };
export { appengine_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
