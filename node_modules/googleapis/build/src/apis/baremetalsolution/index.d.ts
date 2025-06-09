/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { baremetalsolution_v1 } from './v1';
import { baremetalsolution_v1alpha1 } from './v1alpha1';
import { baremetalsolution_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof baremetalsolution_v1.Baremetalsolution;
    v1alpha1: typeof baremetalsolution_v1alpha1.Baremetalsolution;
    v2: typeof baremetalsolution_v2.Baremetalsolution;
};
export declare function baremetalsolution(version: 'v1'): baremetalsolution_v1.Baremetalsolution;
export declare function baremetalsolution(options: baremetalsolution_v1.Options): baremetalsolution_v1.Baremetalsolution;
export declare function baremetalsolution(version: 'v1alpha1'): baremetalsolution_v1alpha1.Baremetalsolution;
export declare function baremetalsolution(options: baremetalsolution_v1alpha1.Options): baremetalsolution_v1alpha1.Baremetalsolution;
export declare function baremetalsolution(version: 'v2'): baremetalsolution_v2.Baremetalsolution;
export declare function baremetalsolution(options: baremetalsolution_v2.Options): baremetalsolution_v2.Baremetalsolution;
declare const auth: AuthPlus;
export { auth };
export { baremetalsolution_v1 };
export { baremetalsolution_v1alpha1 };
export { baremetalsolution_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
