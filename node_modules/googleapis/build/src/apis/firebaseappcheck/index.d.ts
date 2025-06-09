/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebaseappcheck_v1 } from './v1';
import { firebaseappcheck_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof firebaseappcheck_v1.Firebaseappcheck;
    v1beta: typeof firebaseappcheck_v1beta.Firebaseappcheck;
};
export declare function firebaseappcheck(version: 'v1'): firebaseappcheck_v1.Firebaseappcheck;
export declare function firebaseappcheck(options: firebaseappcheck_v1.Options): firebaseappcheck_v1.Firebaseappcheck;
export declare function firebaseappcheck(version: 'v1beta'): firebaseappcheck_v1beta.Firebaseappcheck;
export declare function firebaseappcheck(options: firebaseappcheck_v1beta.Options): firebaseappcheck_v1beta.Firebaseappcheck;
declare const auth: AuthPlus;
export { auth };
export { firebaseappcheck_v1 };
export { firebaseappcheck_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
