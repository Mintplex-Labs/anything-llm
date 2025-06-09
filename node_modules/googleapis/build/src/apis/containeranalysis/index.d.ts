/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { containeranalysis_v1 } from './v1';
import { containeranalysis_v1alpha1 } from './v1alpha1';
import { containeranalysis_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof containeranalysis_v1.Containeranalysis;
    v1alpha1: typeof containeranalysis_v1alpha1.Containeranalysis;
    v1beta1: typeof containeranalysis_v1beta1.Containeranalysis;
};
export declare function containeranalysis(version: 'v1'): containeranalysis_v1.Containeranalysis;
export declare function containeranalysis(options: containeranalysis_v1.Options): containeranalysis_v1.Containeranalysis;
export declare function containeranalysis(version: 'v1alpha1'): containeranalysis_v1alpha1.Containeranalysis;
export declare function containeranalysis(options: containeranalysis_v1alpha1.Options): containeranalysis_v1alpha1.Containeranalysis;
export declare function containeranalysis(version: 'v1beta1'): containeranalysis_v1beta1.Containeranalysis;
export declare function containeranalysis(options: containeranalysis_v1beta1.Options): containeranalysis_v1beta1.Containeranalysis;
declare const auth: AuthPlus;
export { auth };
export { containeranalysis_v1 };
export { containeranalysis_v1alpha1 };
export { containeranalysis_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
