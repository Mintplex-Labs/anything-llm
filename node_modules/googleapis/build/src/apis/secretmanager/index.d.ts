/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { secretmanager_v1 } from './v1';
import { secretmanager_v1beta1 } from './v1beta1';
import { secretmanager_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    v1: typeof secretmanager_v1.Secretmanager;
    v1beta1: typeof secretmanager_v1beta1.Secretmanager;
    v1beta2: typeof secretmanager_v1beta2.Secretmanager;
};
export declare function secretmanager(version: 'v1'): secretmanager_v1.Secretmanager;
export declare function secretmanager(options: secretmanager_v1.Options): secretmanager_v1.Secretmanager;
export declare function secretmanager(version: 'v1beta1'): secretmanager_v1beta1.Secretmanager;
export declare function secretmanager(options: secretmanager_v1beta1.Options): secretmanager_v1beta1.Secretmanager;
export declare function secretmanager(version: 'v1beta2'): secretmanager_v1beta2.Secretmanager;
export declare function secretmanager(options: secretmanager_v1beta2.Options): secretmanager_v1beta2.Secretmanager;
declare const auth: AuthPlus;
export { auth };
export { secretmanager_v1 };
export { secretmanager_v1beta1 };
export { secretmanager_v1beta2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
