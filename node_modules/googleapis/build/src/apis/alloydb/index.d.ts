/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { alloydb_v1 } from './v1';
import { alloydb_v1alpha } from './v1alpha';
import { alloydb_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof alloydb_v1.Alloydb;
    v1alpha: typeof alloydb_v1alpha.Alloydb;
    v1beta: typeof alloydb_v1beta.Alloydb;
};
export declare function alloydb(version: 'v1'): alloydb_v1.Alloydb;
export declare function alloydb(options: alloydb_v1.Options): alloydb_v1.Alloydb;
export declare function alloydb(version: 'v1alpha'): alloydb_v1alpha.Alloydb;
export declare function alloydb(options: alloydb_v1alpha.Options): alloydb_v1alpha.Alloydb;
export declare function alloydb(version: 'v1beta'): alloydb_v1beta.Alloydb;
export declare function alloydb(options: alloydb_v1beta.Options): alloydb_v1beta.Alloydb;
declare const auth: AuthPlus;
export { auth };
export { alloydb_v1 };
export { alloydb_v1alpha };
export { alloydb_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
