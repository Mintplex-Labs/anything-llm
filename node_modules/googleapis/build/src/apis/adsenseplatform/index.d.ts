/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { adsenseplatform_v1 } from './v1';
import { adsenseplatform_v1alpha } from './v1alpha';
export declare const VERSIONS: {
    v1: typeof adsenseplatform_v1.Adsenseplatform;
    v1alpha: typeof adsenseplatform_v1alpha.Adsenseplatform;
};
export declare function adsenseplatform(version: 'v1'): adsenseplatform_v1.Adsenseplatform;
export declare function adsenseplatform(options: adsenseplatform_v1.Options): adsenseplatform_v1.Adsenseplatform;
export declare function adsenseplatform(version: 'v1alpha'): adsenseplatform_v1alpha.Adsenseplatform;
export declare function adsenseplatform(options: adsenseplatform_v1alpha.Options): adsenseplatform_v1alpha.Adsenseplatform;
declare const auth: AuthPlus;
export { auth };
export { adsenseplatform_v1 };
export { adsenseplatform_v1alpha };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
