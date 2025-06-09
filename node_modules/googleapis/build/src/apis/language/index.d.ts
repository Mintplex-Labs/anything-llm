/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { language_v1 } from './v1';
import { language_v1beta1 } from './v1beta1';
import { language_v1beta2 } from './v1beta2';
import { language_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof language_v1.Language;
    v1beta1: typeof language_v1beta1.Language;
    v1beta2: typeof language_v1beta2.Language;
    v2: typeof language_v2.Language;
};
export declare function language(version: 'v1'): language_v1.Language;
export declare function language(options: language_v1.Options): language_v1.Language;
export declare function language(version: 'v1beta1'): language_v1beta1.Language;
export declare function language(options: language_v1beta1.Options): language_v1beta1.Language;
export declare function language(version: 'v1beta2'): language_v1beta2.Language;
export declare function language(options: language_v1beta2.Options): language_v1beta2.Language;
export declare function language(version: 'v2'): language_v2.Language;
export declare function language(options: language_v2.Options): language_v2.Language;
declare const auth: AuthPlus;
export { auth };
export { language_v1 };
export { language_v1beta1 };
export { language_v1beta2 };
export { language_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
