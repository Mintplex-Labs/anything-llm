/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { genomics_v1 } from './v1';
import { genomics_v1alpha2 } from './v1alpha2';
import { genomics_v2alpha1 } from './v2alpha1';
export declare const VERSIONS: {
    v1: typeof genomics_v1.Genomics;
    v1alpha2: typeof genomics_v1alpha2.Genomics;
    v2alpha1: typeof genomics_v2alpha1.Genomics;
};
export declare function genomics(version: 'v1'): genomics_v1.Genomics;
export declare function genomics(options: genomics_v1.Options): genomics_v1.Genomics;
export declare function genomics(version: 'v1alpha2'): genomics_v1alpha2.Genomics;
export declare function genomics(options: genomics_v1alpha2.Options): genomics_v1alpha2.Genomics;
export declare function genomics(version: 'v2alpha1'): genomics_v2alpha1.Genomics;
export declare function genomics(options: genomics_v2alpha1.Options): genomics_v2alpha1.Genomics;
declare const auth: AuthPlus;
export { auth };
export { genomics_v1 };
export { genomics_v1alpha2 };
export { genomics_v2alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
