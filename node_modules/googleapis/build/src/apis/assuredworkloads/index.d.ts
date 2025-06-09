/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { assuredworkloads_v1 } from './v1';
import { assuredworkloads_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof assuredworkloads_v1.Assuredworkloads;
    v1beta1: typeof assuredworkloads_v1beta1.Assuredworkloads;
};
export declare function assuredworkloads(version: 'v1'): assuredworkloads_v1.Assuredworkloads;
export declare function assuredworkloads(options: assuredworkloads_v1.Options): assuredworkloads_v1.Assuredworkloads;
export declare function assuredworkloads(version: 'v1beta1'): assuredworkloads_v1beta1.Assuredworkloads;
export declare function assuredworkloads(options: assuredworkloads_v1beta1.Options): assuredworkloads_v1beta1.Assuredworkloads;
declare const auth: AuthPlus;
export { auth };
export { assuredworkloads_v1 };
export { assuredworkloads_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
