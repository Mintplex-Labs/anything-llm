/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { apphub_v1 } from './v1';
import { apphub_v1alpha } from './v1alpha';
export declare const VERSIONS: {
    v1: typeof apphub_v1.Apphub;
    v1alpha: typeof apphub_v1alpha.Apphub;
};
export declare function apphub(version: 'v1'): apphub_v1.Apphub;
export declare function apphub(options: apphub_v1.Options): apphub_v1.Apphub;
export declare function apphub(version: 'v1alpha'): apphub_v1alpha.Apphub;
export declare function apphub(options: apphub_v1alpha.Options): apphub_v1alpha.Apphub;
declare const auth: AuthPlus;
export { auth };
export { apphub_v1 };
export { apphub_v1alpha };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
