/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { aiplatform_v1 } from './v1';
import { aiplatform_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof aiplatform_v1.Aiplatform;
    v1beta1: typeof aiplatform_v1beta1.Aiplatform;
};
export declare function aiplatform(version: 'v1'): aiplatform_v1.Aiplatform;
export declare function aiplatform(options: aiplatform_v1.Options): aiplatform_v1.Aiplatform;
export declare function aiplatform(version: 'v1beta1'): aiplatform_v1beta1.Aiplatform;
export declare function aiplatform(options: aiplatform_v1beta1.Options): aiplatform_v1beta1.Aiplatform;
declare const auth: AuthPlus;
export { auth };
export { aiplatform_v1 };
export { aiplatform_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
