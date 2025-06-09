/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudshell_v1 } from './v1';
import { cloudshell_v1alpha1 } from './v1alpha1';
export declare const VERSIONS: {
    v1: typeof cloudshell_v1.Cloudshell;
    v1alpha1: typeof cloudshell_v1alpha1.Cloudshell;
};
export declare function cloudshell(version: 'v1'): cloudshell_v1.Cloudshell;
export declare function cloudshell(options: cloudshell_v1.Options): cloudshell_v1.Cloudshell;
export declare function cloudshell(version: 'v1alpha1'): cloudshell_v1alpha1.Cloudshell;
export declare function cloudshell(options: cloudshell_v1alpha1.Options): cloudshell_v1alpha1.Cloudshell;
declare const auth: AuthPlus;
export { auth };
export { cloudshell_v1 };
export { cloudshell_v1alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
