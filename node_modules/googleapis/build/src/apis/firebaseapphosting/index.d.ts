/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebaseapphosting_v1 } from './v1';
import { firebaseapphosting_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof firebaseapphosting_v1.Firebaseapphosting;
    v1beta: typeof firebaseapphosting_v1beta.Firebaseapphosting;
};
export declare function firebaseapphosting(version: 'v1'): firebaseapphosting_v1.Firebaseapphosting;
export declare function firebaseapphosting(options: firebaseapphosting_v1.Options): firebaseapphosting_v1.Firebaseapphosting;
export declare function firebaseapphosting(version: 'v1beta'): firebaseapphosting_v1beta.Firebaseapphosting;
export declare function firebaseapphosting(options: firebaseapphosting_v1beta.Options): firebaseapphosting_v1beta.Firebaseapphosting;
declare const auth: AuthPlus;
export { auth };
export { firebaseapphosting_v1 };
export { firebaseapphosting_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
