/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { ideahub_v1alpha } from './v1alpha';
import { ideahub_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1alpha: typeof ideahub_v1alpha.Ideahub;
    v1beta: typeof ideahub_v1beta.Ideahub;
};
export declare function ideahub(version: 'v1alpha'): ideahub_v1alpha.Ideahub;
export declare function ideahub(options: ideahub_v1alpha.Options): ideahub_v1alpha.Ideahub;
export declare function ideahub(version: 'v1beta'): ideahub_v1beta.Ideahub;
export declare function ideahub(options: ideahub_v1beta.Options): ideahub_v1beta.Ideahub;
declare const auth: AuthPlus;
export { auth };
export { ideahub_v1alpha };
export { ideahub_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
