/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { playdeveloperreporting_v1alpha1 } from './v1alpha1';
import { playdeveloperreporting_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1alpha1: typeof playdeveloperreporting_v1alpha1.Playdeveloperreporting;
    v1beta1: typeof playdeveloperreporting_v1beta1.Playdeveloperreporting;
};
export declare function playdeveloperreporting(version: 'v1alpha1'): playdeveloperreporting_v1alpha1.Playdeveloperreporting;
export declare function playdeveloperreporting(options: playdeveloperreporting_v1alpha1.Options): playdeveloperreporting_v1alpha1.Playdeveloperreporting;
export declare function playdeveloperreporting(version: 'v1beta1'): playdeveloperreporting_v1beta1.Playdeveloperreporting;
export declare function playdeveloperreporting(options: playdeveloperreporting_v1beta1.Options): playdeveloperreporting_v1beta1.Playdeveloperreporting;
declare const auth: AuthPlus;
export { auth };
export { playdeveloperreporting_v1alpha1 };
export { playdeveloperreporting_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
