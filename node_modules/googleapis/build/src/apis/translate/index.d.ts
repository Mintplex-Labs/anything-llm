/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { translate_v2 } from './v2';
import { translate_v3 } from './v3';
import { translate_v3beta1 } from './v3beta1';
export declare const VERSIONS: {
    v2: typeof translate_v2.Translate;
    v3: typeof translate_v3.Translate;
    v3beta1: typeof translate_v3beta1.Translate;
};
export declare function translate(version: 'v2'): translate_v2.Translate;
export declare function translate(options: translate_v2.Options): translate_v2.Translate;
export declare function translate(version: 'v3'): translate_v3.Translate;
export declare function translate(options: translate_v3.Options): translate_v3.Translate;
export declare function translate(version: 'v3beta1'): translate_v3beta1.Translate;
export declare function translate(options: translate_v3beta1.Options): translate_v3beta1.Translate;
declare const auth: AuthPlus;
export { auth };
export { translate_v2 };
export { translate_v3 };
export { translate_v3beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
