/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { runtimeconfig_v1 } from './v1';
import { runtimeconfig_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof runtimeconfig_v1.Runtimeconfig;
    v1beta1: typeof runtimeconfig_v1beta1.Runtimeconfig;
};
export declare function runtimeconfig(version: 'v1'): runtimeconfig_v1.Runtimeconfig;
export declare function runtimeconfig(options: runtimeconfig_v1.Options): runtimeconfig_v1.Runtimeconfig;
export declare function runtimeconfig(version: 'v1beta1'): runtimeconfig_v1beta1.Runtimeconfig;
export declare function runtimeconfig(options: runtimeconfig_v1beta1.Options): runtimeconfig_v1beta1.Runtimeconfig;
declare const auth: AuthPlus;
export { auth };
export { runtimeconfig_v1 };
export { runtimeconfig_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
