/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { dataportability_v1 } from './v1';
import { dataportability_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof dataportability_v1.Dataportability;
    v1beta: typeof dataportability_v1beta.Dataportability;
};
export declare function dataportability(version: 'v1'): dataportability_v1.Dataportability;
export declare function dataportability(options: dataportability_v1.Options): dataportability_v1.Dataportability;
export declare function dataportability(version: 'v1beta'): dataportability_v1beta.Dataportability;
export declare function dataportability(options: dataportability_v1beta.Options): dataportability_v1beta.Dataportability;
declare const auth: AuthPlus;
export { auth };
export { dataportability_v1 };
export { dataportability_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
