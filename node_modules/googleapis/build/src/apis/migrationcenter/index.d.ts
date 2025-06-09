/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { migrationcenter_v1 } from './v1';
import { migrationcenter_v1alpha1 } from './v1alpha1';
export declare const VERSIONS: {
    v1: typeof migrationcenter_v1.Migrationcenter;
    v1alpha1: typeof migrationcenter_v1alpha1.Migrationcenter;
};
export declare function migrationcenter(version: 'v1'): migrationcenter_v1.Migrationcenter;
export declare function migrationcenter(options: migrationcenter_v1.Options): migrationcenter_v1.Migrationcenter;
export declare function migrationcenter(version: 'v1alpha1'): migrationcenter_v1alpha1.Migrationcenter;
export declare function migrationcenter(options: migrationcenter_v1alpha1.Options): migrationcenter_v1alpha1.Migrationcenter;
declare const auth: AuthPlus;
export { auth };
export { migrationcenter_v1 };
export { migrationcenter_v1alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
