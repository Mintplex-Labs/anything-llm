/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudscheduler_v1 } from './v1';
import { cloudscheduler_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof cloudscheduler_v1.Cloudscheduler;
    v1beta1: typeof cloudscheduler_v1beta1.Cloudscheduler;
};
export declare function cloudscheduler(version: 'v1'): cloudscheduler_v1.Cloudscheduler;
export declare function cloudscheduler(options: cloudscheduler_v1.Options): cloudscheduler_v1.Cloudscheduler;
export declare function cloudscheduler(version: 'v1beta1'): cloudscheduler_v1beta1.Cloudscheduler;
export declare function cloudscheduler(options: cloudscheduler_v1beta1.Options): cloudscheduler_v1beta1.Cloudscheduler;
declare const auth: AuthPlus;
export { auth };
export { cloudscheduler_v1 };
export { cloudscheduler_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
