/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { managedidentities_v1 } from './v1';
import { managedidentities_v1alpha1 } from './v1alpha1';
import { managedidentities_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof managedidentities_v1.Managedidentities;
    v1alpha1: typeof managedidentities_v1alpha1.Managedidentities;
    v1beta1: typeof managedidentities_v1beta1.Managedidentities;
};
export declare function managedidentities(version: 'v1'): managedidentities_v1.Managedidentities;
export declare function managedidentities(options: managedidentities_v1.Options): managedidentities_v1.Managedidentities;
export declare function managedidentities(version: 'v1alpha1'): managedidentities_v1alpha1.Managedidentities;
export declare function managedidentities(options: managedidentities_v1alpha1.Options): managedidentities_v1alpha1.Managedidentities;
export declare function managedidentities(version: 'v1beta1'): managedidentities_v1beta1.Managedidentities;
export declare function managedidentities(options: managedidentities_v1beta1.Options): managedidentities_v1beta1.Managedidentities;
declare const auth: AuthPlus;
export { auth };
export { managedidentities_v1 };
export { managedidentities_v1alpha1 };
export { managedidentities_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
