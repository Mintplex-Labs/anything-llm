/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { texttospeech_v1 } from './v1';
import { texttospeech_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof texttospeech_v1.Texttospeech;
    v1beta1: typeof texttospeech_v1beta1.Texttospeech;
};
export declare function texttospeech(version: 'v1'): texttospeech_v1.Texttospeech;
export declare function texttospeech(options: texttospeech_v1.Options): texttospeech_v1.Texttospeech;
export declare function texttospeech(version: 'v1beta1'): texttospeech_v1beta1.Texttospeech;
export declare function texttospeech(options: texttospeech_v1beta1.Options): texttospeech_v1beta1.Texttospeech;
declare const auth: AuthPlus;
export { auth };
export { texttospeech_v1 };
export { texttospeech_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
