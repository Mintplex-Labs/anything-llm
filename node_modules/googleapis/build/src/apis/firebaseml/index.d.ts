/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebaseml_v1 } from './v1';
import { firebaseml_v1beta2 } from './v1beta2';
import { firebaseml_v2beta } from './v2beta';
export declare const VERSIONS: {
    v1: typeof firebaseml_v1.Firebaseml;
    v1beta2: typeof firebaseml_v1beta2.Firebaseml;
    v2beta: typeof firebaseml_v2beta.Firebaseml;
};
export declare function firebaseml(version: 'v1'): firebaseml_v1.Firebaseml;
export declare function firebaseml(options: firebaseml_v1.Options): firebaseml_v1.Firebaseml;
export declare function firebaseml(version: 'v1beta2'): firebaseml_v1beta2.Firebaseml;
export declare function firebaseml(options: firebaseml_v1beta2.Options): firebaseml_v1beta2.Firebaseml;
export declare function firebaseml(version: 'v2beta'): firebaseml_v2beta.Firebaseml;
export declare function firebaseml(options: firebaseml_v2beta.Options): firebaseml_v2beta.Firebaseml;
declare const auth: AuthPlus;
export { auth };
export { firebaseml_v1 };
export { firebaseml_v1beta2 };
export { firebaseml_v2beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
