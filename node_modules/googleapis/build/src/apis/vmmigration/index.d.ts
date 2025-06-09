/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { vmmigration_v1 } from './v1';
import { vmmigration_v1alpha1 } from './v1alpha1';
export declare const VERSIONS: {
    v1: typeof vmmigration_v1.Vmmigration;
    v1alpha1: typeof vmmigration_v1alpha1.Vmmigration;
};
export declare function vmmigration(version: 'v1'): vmmigration_v1.Vmmigration;
export declare function vmmigration(options: vmmigration_v1.Options): vmmigration_v1.Vmmigration;
export declare function vmmigration(version: 'v1alpha1'): vmmigration_v1alpha1.Vmmigration;
export declare function vmmigration(options: vmmigration_v1alpha1.Options): vmmigration_v1alpha1.Vmmigration;
declare const auth: AuthPlus;
export { auth };
export { vmmigration_v1 };
export { vmmigration_v1alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
