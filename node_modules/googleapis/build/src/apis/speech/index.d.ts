/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { speech_v1 } from './v1';
import { speech_v1p1beta1 } from './v1p1beta1';
import { speech_v2beta1 } from './v2beta1';
export declare const VERSIONS: {
    v1: typeof speech_v1.Speech;
    v1p1beta1: typeof speech_v1p1beta1.Speech;
    v2beta1: typeof speech_v2beta1.Speech;
};
export declare function speech(version: 'v1'): speech_v1.Speech;
export declare function speech(options: speech_v1.Options): speech_v1.Speech;
export declare function speech(version: 'v1p1beta1'): speech_v1p1beta1.Speech;
export declare function speech(options: speech_v1p1beta1.Options): speech_v1p1beta1.Speech;
export declare function speech(version: 'v2beta1'): speech_v2beta1.Speech;
export declare function speech(options: speech_v2beta1.Options): speech_v2beta1.Speech;
declare const auth: AuthPlus;
export { auth };
export { speech_v1 };
export { speech_v1p1beta1 };
export { speech_v2beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
