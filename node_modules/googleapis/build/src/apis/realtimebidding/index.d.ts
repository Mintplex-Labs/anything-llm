/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { realtimebidding_v1 } from './v1';
import { realtimebidding_v1alpha } from './v1alpha';
export declare const VERSIONS: {
    v1: typeof realtimebidding_v1.Realtimebidding;
    v1alpha: typeof realtimebidding_v1alpha.Realtimebidding;
};
export declare function realtimebidding(version: 'v1'): realtimebidding_v1.Realtimebidding;
export declare function realtimebidding(options: realtimebidding_v1.Options): realtimebidding_v1.Realtimebidding;
export declare function realtimebidding(version: 'v1alpha'): realtimebidding_v1alpha.Realtimebidding;
export declare function realtimebidding(options: realtimebidding_v1alpha.Options): realtimebidding_v1alpha.Realtimebidding;
declare const auth: AuthPlus;
export { auth };
export { realtimebidding_v1 };
export { realtimebidding_v1alpha };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
