/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { sts_v1 } from './v1';
import { sts_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof sts_v1.Sts;
    v1beta: typeof sts_v1beta.Sts;
};
export declare function sts(version: 'v1'): sts_v1.Sts;
export declare function sts(options: sts_v1.Options): sts_v1.Sts;
export declare function sts(version: 'v1beta'): sts_v1beta.Sts;
export declare function sts(options: sts_v1beta.Options): sts_v1beta.Sts;
declare const auth: AuthPlus;
export { auth };
export { sts_v1 };
export { sts_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
