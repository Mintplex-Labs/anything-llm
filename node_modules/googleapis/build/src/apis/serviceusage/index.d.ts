/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { serviceusage_v1 } from './v1';
import { serviceusage_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof serviceusage_v1.Serviceusage;
    v1beta1: typeof serviceusage_v1beta1.Serviceusage;
};
export declare function serviceusage(version: 'v1'): serviceusage_v1.Serviceusage;
export declare function serviceusage(options: serviceusage_v1.Options): serviceusage_v1.Serviceusage;
export declare function serviceusage(version: 'v1beta1'): serviceusage_v1beta1.Serviceusage;
export declare function serviceusage(options: serviceusage_v1beta1.Options): serviceusage_v1beta1.Serviceusage;
declare const auth: AuthPlus;
export { auth };
export { serviceusage_v1 };
export { serviceusage_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
