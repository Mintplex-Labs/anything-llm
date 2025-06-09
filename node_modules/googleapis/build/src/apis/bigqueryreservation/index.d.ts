/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { bigqueryreservation_v1 } from './v1';
import { bigqueryreservation_v1alpha2 } from './v1alpha2';
import { bigqueryreservation_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof bigqueryreservation_v1.Bigqueryreservation;
    v1alpha2: typeof bigqueryreservation_v1alpha2.Bigqueryreservation;
    v1beta1: typeof bigqueryreservation_v1beta1.Bigqueryreservation;
};
export declare function bigqueryreservation(version: 'v1'): bigqueryreservation_v1.Bigqueryreservation;
export declare function bigqueryreservation(options: bigqueryreservation_v1.Options): bigqueryreservation_v1.Bigqueryreservation;
export declare function bigqueryreservation(version: 'v1alpha2'): bigqueryreservation_v1alpha2.Bigqueryreservation;
export declare function bigqueryreservation(options: bigqueryreservation_v1alpha2.Options): bigqueryreservation_v1alpha2.Bigqueryreservation;
export declare function bigqueryreservation(version: 'v1beta1'): bigqueryreservation_v1beta1.Bigqueryreservation;
export declare function bigqueryreservation(options: bigqueryreservation_v1beta1.Options): bigqueryreservation_v1beta1.Bigqueryreservation;
declare const auth: AuthPlus;
export { auth };
export { bigqueryreservation_v1 };
export { bigqueryreservation_v1alpha2 };
export { bigqueryreservation_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
