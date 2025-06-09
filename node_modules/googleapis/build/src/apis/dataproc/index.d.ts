/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { dataproc_v1 } from './v1';
import { dataproc_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    v1: typeof dataproc_v1.Dataproc;
    v1beta2: typeof dataproc_v1beta2.Dataproc;
};
export declare function dataproc(version: 'v1'): dataproc_v1.Dataproc;
export declare function dataproc(options: dataproc_v1.Options): dataproc_v1.Dataproc;
export declare function dataproc(version: 'v1beta2'): dataproc_v1beta2.Dataproc;
export declare function dataproc(options: dataproc_v1beta2.Options): dataproc_v1beta2.Dataproc;
declare const auth: AuthPlus;
export { auth };
export { dataproc_v1 };
export { dataproc_v1beta2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
