/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { binaryauthorization_v1 } from './v1';
import { binaryauthorization_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof binaryauthorization_v1.Binaryauthorization;
    v1beta1: typeof binaryauthorization_v1beta1.Binaryauthorization;
};
export declare function binaryauthorization(version: 'v1'): binaryauthorization_v1.Binaryauthorization;
export declare function binaryauthorization(options: binaryauthorization_v1.Options): binaryauthorization_v1.Binaryauthorization;
export declare function binaryauthorization(version: 'v1beta1'): binaryauthorization_v1beta1.Binaryauthorization;
export declare function binaryauthorization(options: binaryauthorization_v1beta1.Options): binaryauthorization_v1beta1.Binaryauthorization;
declare const auth: AuthPlus;
export { auth };
export { binaryauthorization_v1 };
export { binaryauthorization_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
