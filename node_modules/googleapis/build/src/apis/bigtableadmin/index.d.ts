/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { bigtableadmin_v1 } from './v1';
import { bigtableadmin_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof bigtableadmin_v1.Bigtableadmin;
    v2: typeof bigtableadmin_v2.Bigtableadmin;
};
export declare function bigtableadmin(version: 'v1'): bigtableadmin_v1.Bigtableadmin;
export declare function bigtableadmin(options: bigtableadmin_v1.Options): bigtableadmin_v1.Bigtableadmin;
export declare function bigtableadmin(version: 'v2'): bigtableadmin_v2.Bigtableadmin;
export declare function bigtableadmin(options: bigtableadmin_v2.Options): bigtableadmin_v2.Bigtableadmin;
declare const auth: AuthPlus;
export { auth };
export { bigtableadmin_v1 };
export { bigtableadmin_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
