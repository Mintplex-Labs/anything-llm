/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { networkmanagement_v1 } from './v1';
import { networkmanagement_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof networkmanagement_v1.Networkmanagement;
    v1beta1: typeof networkmanagement_v1beta1.Networkmanagement;
};
export declare function networkmanagement(version: 'v1'): networkmanagement_v1.Networkmanagement;
export declare function networkmanagement(options: networkmanagement_v1.Options): networkmanagement_v1.Networkmanagement;
export declare function networkmanagement(version: 'v1beta1'): networkmanagement_v1beta1.Networkmanagement;
export declare function networkmanagement(options: networkmanagement_v1beta1.Options): networkmanagement_v1beta1.Networkmanagement;
declare const auth: AuthPlus;
export { auth };
export { networkmanagement_v1 };
export { networkmanagement_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
