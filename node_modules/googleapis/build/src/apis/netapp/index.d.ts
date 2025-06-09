/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { netapp_v1 } from './v1';
import { netapp_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof netapp_v1.Netapp;
    v1beta1: typeof netapp_v1beta1.Netapp;
};
export declare function netapp(version: 'v1'): netapp_v1.Netapp;
export declare function netapp(options: netapp_v1.Options): netapp_v1.Netapp;
export declare function netapp(version: 'v1beta1'): netapp_v1beta1.Netapp;
export declare function netapp(options: netapp_v1beta1.Options): netapp_v1beta1.Netapp;
declare const auth: AuthPlus;
export { auth };
export { netapp_v1 };
export { netapp_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
