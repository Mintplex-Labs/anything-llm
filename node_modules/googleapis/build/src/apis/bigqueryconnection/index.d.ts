/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { bigqueryconnection_v1 } from './v1';
import { bigqueryconnection_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof bigqueryconnection_v1.Bigqueryconnection;
    v1beta1: typeof bigqueryconnection_v1beta1.Bigqueryconnection;
};
export declare function bigqueryconnection(version: 'v1'): bigqueryconnection_v1.Bigqueryconnection;
export declare function bigqueryconnection(options: bigqueryconnection_v1.Options): bigqueryconnection_v1.Bigqueryconnection;
export declare function bigqueryconnection(version: 'v1beta1'): bigqueryconnection_v1beta1.Bigqueryconnection;
export declare function bigqueryconnection(options: bigqueryconnection_v1beta1.Options): bigqueryconnection_v1beta1.Bigqueryconnection;
declare const auth: AuthPlus;
export { auth };
export { bigqueryconnection_v1 };
export { bigqueryconnection_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
