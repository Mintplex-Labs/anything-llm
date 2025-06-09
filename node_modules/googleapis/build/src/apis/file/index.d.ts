/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { file_v1 } from './v1';
import { file_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof file_v1.File;
    v1beta1: typeof file_v1beta1.File;
};
export declare function file(version: 'v1'): file_v1.File;
export declare function file(options: file_v1.Options): file_v1.File;
export declare function file(version: 'v1beta1'): file_v1beta1.File;
export declare function file(options: file_v1beta1.Options): file_v1beta1.File;
declare const auth: AuthPlus;
export { auth };
export { file_v1 };
export { file_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
