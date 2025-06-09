/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { storage_v1 } from './v1';
import { storage_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    v1: typeof storage_v1.Storage;
    v1beta2: typeof storage_v1beta2.Storage;
};
export declare function storage(version: 'v1'): storage_v1.Storage;
export declare function storage(options: storage_v1.Options): storage_v1.Storage;
export declare function storage(version: 'v1beta2'): storage_v1beta2.Storage;
export declare function storage(options: storage_v1beta2.Options): storage_v1beta2.Storage;
declare const auth: AuthPlus;
export { auth };
export { storage_v1 };
export { storage_v1beta2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
