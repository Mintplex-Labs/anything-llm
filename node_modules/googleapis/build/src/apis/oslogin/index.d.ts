/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { oslogin_v1 } from './v1';
import { oslogin_v1alpha } from './v1alpha';
import { oslogin_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof oslogin_v1.Oslogin;
    v1alpha: typeof oslogin_v1alpha.Oslogin;
    v1beta: typeof oslogin_v1beta.Oslogin;
};
export declare function oslogin(version: 'v1'): oslogin_v1.Oslogin;
export declare function oslogin(options: oslogin_v1.Options): oslogin_v1.Oslogin;
export declare function oslogin(version: 'v1alpha'): oslogin_v1alpha.Oslogin;
export declare function oslogin(options: oslogin_v1alpha.Options): oslogin_v1alpha.Oslogin;
export declare function oslogin(version: 'v1beta'): oslogin_v1beta.Oslogin;
export declare function oslogin(options: oslogin_v1beta.Options): oslogin_v1beta.Oslogin;
declare const auth: AuthPlus;
export { auth };
export { oslogin_v1 };
export { oslogin_v1alpha };
export { oslogin_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
