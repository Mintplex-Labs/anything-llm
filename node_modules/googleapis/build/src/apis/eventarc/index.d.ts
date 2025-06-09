/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { eventarc_v1 } from './v1';
import { eventarc_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof eventarc_v1.Eventarc;
    v1beta1: typeof eventarc_v1beta1.Eventarc;
};
export declare function eventarc(version: 'v1'): eventarc_v1.Eventarc;
export declare function eventarc(options: eventarc_v1.Options): eventarc_v1.Eventarc;
export declare function eventarc(version: 'v1beta1'): eventarc_v1beta1.Eventarc;
export declare function eventarc(options: eventarc_v1beta1.Options): eventarc_v1beta1.Eventarc;
declare const auth: AuthPlus;
export { auth };
export { eventarc_v1 };
export { eventarc_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
