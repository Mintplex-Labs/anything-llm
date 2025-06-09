/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { firebaseappdistribution_v1 } from './v1';
import { firebaseappdistribution_v1alpha } from './v1alpha';
export declare const VERSIONS: {
    v1: typeof firebaseappdistribution_v1.Firebaseappdistribution;
    v1alpha: typeof firebaseappdistribution_v1alpha.Firebaseappdistribution;
};
export declare function firebaseappdistribution(version: 'v1'): firebaseappdistribution_v1.Firebaseappdistribution;
export declare function firebaseappdistribution(options: firebaseappdistribution_v1.Options): firebaseappdistribution_v1.Firebaseappdistribution;
export declare function firebaseappdistribution(version: 'v1alpha'): firebaseappdistribution_v1alpha.Firebaseappdistribution;
export declare function firebaseappdistribution(options: firebaseappdistribution_v1alpha.Options): firebaseappdistribution_v1alpha.Firebaseappdistribution;
declare const auth: AuthPlus;
export { auth };
export { firebaseappdistribution_v1 };
export { firebaseappdistribution_v1alpha };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
