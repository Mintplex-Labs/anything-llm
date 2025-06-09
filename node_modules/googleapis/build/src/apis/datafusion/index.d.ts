/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { datafusion_v1 } from './v1';
import { datafusion_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof datafusion_v1.Datafusion;
    v1beta1: typeof datafusion_v1beta1.Datafusion;
};
export declare function datafusion(version: 'v1'): datafusion_v1.Datafusion;
export declare function datafusion(options: datafusion_v1.Options): datafusion_v1.Datafusion;
export declare function datafusion(version: 'v1beta1'): datafusion_v1beta1.Datafusion;
export declare function datafusion(options: datafusion_v1beta1.Options): datafusion_v1beta1.Datafusion;
declare const auth: AuthPlus;
export { auth };
export { datafusion_v1 };
export { datafusion_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
