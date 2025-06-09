/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { websecurityscanner_v1 } from './v1';
import { websecurityscanner_v1alpha } from './v1alpha';
import { websecurityscanner_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof websecurityscanner_v1.Websecurityscanner;
    v1alpha: typeof websecurityscanner_v1alpha.Websecurityscanner;
    v1beta: typeof websecurityscanner_v1beta.Websecurityscanner;
};
export declare function websecurityscanner(version: 'v1'): websecurityscanner_v1.Websecurityscanner;
export declare function websecurityscanner(options: websecurityscanner_v1.Options): websecurityscanner_v1.Websecurityscanner;
export declare function websecurityscanner(version: 'v1alpha'): websecurityscanner_v1alpha.Websecurityscanner;
export declare function websecurityscanner(options: websecurityscanner_v1alpha.Options): websecurityscanner_v1alpha.Websecurityscanner;
export declare function websecurityscanner(version: 'v1beta'): websecurityscanner_v1beta.Websecurityscanner;
export declare function websecurityscanner(options: websecurityscanner_v1beta.Options): websecurityscanner_v1beta.Websecurityscanner;
declare const auth: AuthPlus;
export { auth };
export { websecurityscanner_v1 };
export { websecurityscanner_v1alpha };
export { websecurityscanner_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
