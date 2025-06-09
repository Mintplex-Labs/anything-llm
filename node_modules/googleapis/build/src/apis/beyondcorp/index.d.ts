/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { beyondcorp_v1 } from './v1';
import { beyondcorp_v1alpha } from './v1alpha';
export declare const VERSIONS: {
    v1: typeof beyondcorp_v1.Beyondcorp;
    v1alpha: typeof beyondcorp_v1alpha.Beyondcorp;
};
export declare function beyondcorp(version: 'v1'): beyondcorp_v1.Beyondcorp;
export declare function beyondcorp(options: beyondcorp_v1.Options): beyondcorp_v1.Beyondcorp;
export declare function beyondcorp(version: 'v1alpha'): beyondcorp_v1alpha.Beyondcorp;
export declare function beyondcorp(options: beyondcorp_v1alpha.Options): beyondcorp_v1alpha.Beyondcorp;
declare const auth: AuthPlus;
export { auth };
export { beyondcorp_v1 };
export { beyondcorp_v1alpha };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
