/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { datastream_v1 } from './v1';
import { datastream_v1alpha1 } from './v1alpha1';
export declare const VERSIONS: {
    v1: typeof datastream_v1.Datastream;
    v1alpha1: typeof datastream_v1alpha1.Datastream;
};
export declare function datastream(version: 'v1'): datastream_v1.Datastream;
export declare function datastream(options: datastream_v1.Options): datastream_v1.Datastream;
export declare function datastream(version: 'v1alpha1'): datastream_v1alpha1.Datastream;
export declare function datastream(options: datastream_v1alpha1.Options): datastream_v1alpha1.Datastream;
declare const auth: AuthPlus;
export { auth };
export { datastream_v1 };
export { datastream_v1alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
