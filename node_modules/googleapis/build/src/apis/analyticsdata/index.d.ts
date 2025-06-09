/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { analyticsdata_v1alpha } from './v1alpha';
import { analyticsdata_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1alpha: typeof analyticsdata_v1alpha.Analyticsdata;
    v1beta: typeof analyticsdata_v1beta.Analyticsdata;
};
export declare function analyticsdata(version: 'v1alpha'): analyticsdata_v1alpha.Analyticsdata;
export declare function analyticsdata(options: analyticsdata_v1alpha.Options): analyticsdata_v1alpha.Analyticsdata;
export declare function analyticsdata(version: 'v1beta'): analyticsdata_v1beta.Analyticsdata;
export declare function analyticsdata(options: analyticsdata_v1beta.Options): analyticsdata_v1beta.Analyticsdata;
declare const auth: AuthPlus;
export { auth };
export { analyticsdata_v1alpha };
export { analyticsdata_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
