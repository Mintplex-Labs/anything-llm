/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { networkservices_v1 } from './v1';
import { networkservices_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof networkservices_v1.Networkservices;
    v1beta1: typeof networkservices_v1beta1.Networkservices;
};
export declare function networkservices(version: 'v1'): networkservices_v1.Networkservices;
export declare function networkservices(options: networkservices_v1.Options): networkservices_v1.Networkservices;
export declare function networkservices(version: 'v1beta1'): networkservices_v1beta1.Networkservices;
export declare function networkservices(options: networkservices_v1beta1.Options): networkservices_v1beta1.Networkservices;
declare const auth: AuthPlus;
export { auth };
export { networkservices_v1 };
export { networkservices_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
