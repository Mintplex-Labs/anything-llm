/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { spanner_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof spanner_v1.Spanner;
};
export declare function spanner(version: 'v1'): spanner_v1.Spanner;
export declare function spanner(options: spanner_v1.Options): spanner_v1.Spanner;
declare const auth: AuthPlus;
export { auth };
export { spanner_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
