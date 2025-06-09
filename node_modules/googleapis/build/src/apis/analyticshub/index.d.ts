/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { analyticshub_v1 } from './v1';
import { analyticshub_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof analyticshub_v1.Analyticshub;
    v1beta1: typeof analyticshub_v1beta1.Analyticshub;
};
export declare function analyticshub(version: 'v1'): analyticshub_v1.Analyticshub;
export declare function analyticshub(options: analyticshub_v1.Options): analyticshub_v1.Analyticshub;
export declare function analyticshub(version: 'v1beta1'): analyticshub_v1beta1.Analyticshub;
export declare function analyticshub(options: analyticshub_v1beta1.Options): analyticshub_v1beta1.Analyticshub;
declare const auth: AuthPlus;
export { auth };
export { analyticshub_v1 };
export { analyticshub_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
