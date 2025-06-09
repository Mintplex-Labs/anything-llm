/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { parallelstore_v1 } from './v1';
import { parallelstore_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof parallelstore_v1.Parallelstore;
    v1beta: typeof parallelstore_v1beta.Parallelstore;
};
export declare function parallelstore(version: 'v1'): parallelstore_v1.Parallelstore;
export declare function parallelstore(options: parallelstore_v1.Options): parallelstore_v1.Parallelstore;
export declare function parallelstore(version: 'v1beta'): parallelstore_v1beta.Parallelstore;
export declare function parallelstore(options: parallelstore_v1beta.Options): parallelstore_v1beta.Parallelstore;
declare const auth: AuthPlus;
export { auth };
export { parallelstore_v1 };
export { parallelstore_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
