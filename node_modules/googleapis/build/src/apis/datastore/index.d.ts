/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { datastore_v1 } from './v1';
import { datastore_v1beta1 } from './v1beta1';
import { datastore_v1beta3 } from './v1beta3';
export declare const VERSIONS: {
    v1: typeof datastore_v1.Datastore;
    v1beta1: typeof datastore_v1beta1.Datastore;
    v1beta3: typeof datastore_v1beta3.Datastore;
};
export declare function datastore(version: 'v1'): datastore_v1.Datastore;
export declare function datastore(options: datastore_v1.Options): datastore_v1.Datastore;
export declare function datastore(version: 'v1beta1'): datastore_v1beta1.Datastore;
export declare function datastore(options: datastore_v1beta1.Options): datastore_v1beta1.Datastore;
export declare function datastore(version: 'v1beta3'): datastore_v1beta3.Datastore;
export declare function datastore(options: datastore_v1beta3.Options): datastore_v1beta3.Datastore;
declare const auth: AuthPlus;
export { auth };
export { datastore_v1 };
export { datastore_v1beta1 };
export { datastore_v1beta3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
