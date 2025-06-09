/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { analyticsadmin_v1alpha } from './v1alpha';
import { analyticsadmin_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1alpha: typeof analyticsadmin_v1alpha.Analyticsadmin;
    v1beta: typeof analyticsadmin_v1beta.Analyticsadmin;
};
export declare function analyticsadmin(version: 'v1alpha'): analyticsadmin_v1alpha.Analyticsadmin;
export declare function analyticsadmin(options: analyticsadmin_v1alpha.Options): analyticsadmin_v1alpha.Analyticsadmin;
export declare function analyticsadmin(version: 'v1beta'): analyticsadmin_v1beta.Analyticsadmin;
export declare function analyticsadmin(options: analyticsadmin_v1beta.Options): analyticsadmin_v1beta.Analyticsadmin;
declare const auth: AuthPlus;
export { auth };
export { analyticsadmin_v1alpha };
export { analyticsadmin_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
