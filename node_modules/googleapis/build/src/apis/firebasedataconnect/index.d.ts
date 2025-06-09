/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebasedataconnect_v1 } from './v1';
import { firebasedataconnect_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof firebasedataconnect_v1.Firebasedataconnect;
    v1beta: typeof firebasedataconnect_v1beta.Firebasedataconnect;
};
export declare function firebasedataconnect(version: 'v1'): firebasedataconnect_v1.Firebasedataconnect;
export declare function firebasedataconnect(options: firebasedataconnect_v1.Options): firebasedataconnect_v1.Firebasedataconnect;
export declare function firebasedataconnect(version: 'v1beta'): firebasedataconnect_v1beta.Firebasedataconnect;
export declare function firebasedataconnect(options: firebasedataconnect_v1beta.Options): firebasedataconnect_v1beta.Firebasedataconnect;
declare const auth: AuthPlus;
export { auth };
export { firebasedataconnect_v1 };
export { firebasedataconnect_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
