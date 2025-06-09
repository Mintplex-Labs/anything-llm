/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebasehosting_v1 } from './v1';
import { firebasehosting_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof firebasehosting_v1.Firebasehosting;
    v1beta1: typeof firebasehosting_v1beta1.Firebasehosting;
};
export declare function firebasehosting(version: 'v1'): firebasehosting_v1.Firebasehosting;
export declare function firebasehosting(options: firebasehosting_v1.Options): firebasehosting_v1.Firebasehosting;
export declare function firebasehosting(version: 'v1beta1'): firebasehosting_v1beta1.Firebasehosting;
export declare function firebasehosting(options: firebasehosting_v1beta1.Options): firebasehosting_v1beta1.Firebasehosting;
declare const auth: AuthPlus;
export { auth };
export { firebasehosting_v1 };
export { firebasehosting_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
