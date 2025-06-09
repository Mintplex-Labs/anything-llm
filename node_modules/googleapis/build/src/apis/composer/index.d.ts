/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { composer_v1 } from './v1';
import { composer_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof composer_v1.Composer;
    v1beta1: typeof composer_v1beta1.Composer;
};
export declare function composer(version: 'v1'): composer_v1.Composer;
export declare function composer(options: composer_v1.Options): composer_v1.Composer;
export declare function composer(version: 'v1beta1'): composer_v1beta1.Composer;
export declare function composer(options: composer_v1beta1.Options): composer_v1beta1.Composer;
declare const auth: AuthPlus;
export { auth };
export { composer_v1 };
export { composer_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
