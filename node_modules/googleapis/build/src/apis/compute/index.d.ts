/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { compute_alpha } from './alpha';
import { compute_beta } from './beta';
import { compute_v1 } from './v1';
export declare const VERSIONS: {
    alpha: typeof compute_alpha.Compute;
    beta: typeof compute_beta.Compute;
    v1: typeof compute_v1.Compute;
};
export declare function compute(version: 'alpha'): compute_alpha.Compute;
export declare function compute(options: compute_alpha.Options): compute_alpha.Compute;
export declare function compute(version: 'beta'): compute_beta.Compute;
export declare function compute(options: compute_beta.Options): compute_beta.Compute;
export declare function compute(version: 'v1'): compute_v1.Compute;
export declare function compute(options: compute_v1.Options): compute_v1.Compute;
declare const auth: AuthPlus;
export { auth };
export { compute_alpha };
export { compute_beta };
export { compute_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
