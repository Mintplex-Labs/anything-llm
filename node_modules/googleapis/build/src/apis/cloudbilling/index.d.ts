/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudbilling_v1 } from './v1';
import { cloudbilling_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof cloudbilling_v1.Cloudbilling;
    v1beta: typeof cloudbilling_v1beta.Cloudbilling;
};
export declare function cloudbilling(version: 'v1'): cloudbilling_v1.Cloudbilling;
export declare function cloudbilling(options: cloudbilling_v1.Options): cloudbilling_v1.Cloudbilling;
export declare function cloudbilling(version: 'v1beta'): cloudbilling_v1beta.Cloudbilling;
export declare function cloudbilling(options: cloudbilling_v1beta.Options): cloudbilling_v1beta.Cloudbilling;
declare const auth: AuthPlus;
export { auth };
export { cloudbilling_v1 };
export { cloudbilling_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
