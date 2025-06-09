/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudtrace_v1 } from './v1';
import { cloudtrace_v2 } from './v2';
import { cloudtrace_v2beta1 } from './v2beta1';
export declare const VERSIONS: {
    v1: typeof cloudtrace_v1.Cloudtrace;
    v2: typeof cloudtrace_v2.Cloudtrace;
    v2beta1: typeof cloudtrace_v2beta1.Cloudtrace;
};
export declare function cloudtrace(version: 'v1'): cloudtrace_v1.Cloudtrace;
export declare function cloudtrace(options: cloudtrace_v1.Options): cloudtrace_v1.Cloudtrace;
export declare function cloudtrace(version: 'v2'): cloudtrace_v2.Cloudtrace;
export declare function cloudtrace(options: cloudtrace_v2.Options): cloudtrace_v2.Cloudtrace;
export declare function cloudtrace(version: 'v2beta1'): cloudtrace_v2beta1.Cloudtrace;
export declare function cloudtrace(options: cloudtrace_v2beta1.Options): cloudtrace_v2beta1.Cloudtrace;
declare const auth: AuthPlus;
export { auth };
export { cloudtrace_v1 };
export { cloudtrace_v2 };
export { cloudtrace_v2beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
