/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { discoveryengine_v1 } from './v1';
import { discoveryengine_v1alpha } from './v1alpha';
import { discoveryengine_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof discoveryengine_v1.Discoveryengine;
    v1alpha: typeof discoveryengine_v1alpha.Discoveryengine;
    v1beta: typeof discoveryengine_v1beta.Discoveryengine;
};
export declare function discoveryengine(version: 'v1'): discoveryengine_v1.Discoveryengine;
export declare function discoveryengine(options: discoveryengine_v1.Options): discoveryengine_v1.Discoveryengine;
export declare function discoveryengine(version: 'v1alpha'): discoveryengine_v1alpha.Discoveryengine;
export declare function discoveryengine(options: discoveryengine_v1alpha.Options): discoveryengine_v1alpha.Discoveryengine;
export declare function discoveryengine(version: 'v1beta'): discoveryengine_v1beta.Discoveryengine;
export declare function discoveryengine(options: discoveryengine_v1beta.Options): discoveryengine_v1beta.Discoveryengine;
declare const auth: AuthPlus;
export { auth };
export { discoveryengine_v1 };
export { discoveryengine_v1alpha };
export { discoveryengine_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
