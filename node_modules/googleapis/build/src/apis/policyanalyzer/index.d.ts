/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { policyanalyzer_v1 } from './v1';
import { policyanalyzer_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof policyanalyzer_v1.Policyanalyzer;
    v1beta1: typeof policyanalyzer_v1beta1.Policyanalyzer;
};
export declare function policyanalyzer(version: 'v1'): policyanalyzer_v1.Policyanalyzer;
export declare function policyanalyzer(options: policyanalyzer_v1.Options): policyanalyzer_v1.Policyanalyzer;
export declare function policyanalyzer(version: 'v1beta1'): policyanalyzer_v1beta1.Policyanalyzer;
export declare function policyanalyzer(options: policyanalyzer_v1beta1.Options): policyanalyzer_v1beta1.Policyanalyzer;
declare const auth: AuthPlus;
export { auth };
export { policyanalyzer_v1 };
export { policyanalyzer_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
