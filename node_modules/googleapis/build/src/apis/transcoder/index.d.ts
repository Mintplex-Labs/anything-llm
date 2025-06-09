/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { transcoder_v1 } from './v1';
import { transcoder_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof transcoder_v1.Transcoder;
    v1beta1: typeof transcoder_v1beta1.Transcoder;
};
export declare function transcoder(version: 'v1'): transcoder_v1.Transcoder;
export declare function transcoder(options: transcoder_v1.Options): transcoder_v1.Transcoder;
export declare function transcoder(version: 'v1beta1'): transcoder_v1beta1.Transcoder;
export declare function transcoder(options: transcoder_v1beta1.Options): transcoder_v1beta1.Transcoder;
declare const auth: AuthPlus;
export { auth };
export { transcoder_v1 };
export { transcoder_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
