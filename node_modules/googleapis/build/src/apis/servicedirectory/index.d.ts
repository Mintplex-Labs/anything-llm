/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { servicedirectory_v1 } from './v1';
import { servicedirectory_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof servicedirectory_v1.Servicedirectory;
    v1beta1: typeof servicedirectory_v1beta1.Servicedirectory;
};
export declare function servicedirectory(version: 'v1'): servicedirectory_v1.Servicedirectory;
export declare function servicedirectory(options: servicedirectory_v1.Options): servicedirectory_v1.Servicedirectory;
export declare function servicedirectory(version: 'v1beta1'): servicedirectory_v1beta1.Servicedirectory;
export declare function servicedirectory(options: servicedirectory_v1beta1.Options): servicedirectory_v1beta1.Servicedirectory;
declare const auth: AuthPlus;
export { auth };
export { servicedirectory_v1 };
export { servicedirectory_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
