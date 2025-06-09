/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { sqladmin_v1 } from './v1';
import { sqladmin_v1beta4 } from './v1beta4';
export declare const VERSIONS: {
    v1: typeof sqladmin_v1.Sqladmin;
    v1beta4: typeof sqladmin_v1beta4.Sqladmin;
};
export declare function sqladmin(version: 'v1'): sqladmin_v1.Sqladmin;
export declare function sqladmin(options: sqladmin_v1.Options): sqladmin_v1.Sqladmin;
export declare function sqladmin(version: 'v1beta4'): sqladmin_v1beta4.Sqladmin;
export declare function sqladmin(options: sqladmin_v1beta4.Options): sqladmin_v1beta4.Sqladmin;
declare const auth: AuthPlus;
export { auth };
export { sqladmin_v1 };
export { sqladmin_v1beta4 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
