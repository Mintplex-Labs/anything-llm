/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { networkconnectivity_v1 } from './v1';
import { networkconnectivity_v1alpha1 } from './v1alpha1';
export declare const VERSIONS: {
    v1: typeof networkconnectivity_v1.Networkconnectivity;
    v1alpha1: typeof networkconnectivity_v1alpha1.Networkconnectivity;
};
export declare function networkconnectivity(version: 'v1'): networkconnectivity_v1.Networkconnectivity;
export declare function networkconnectivity(options: networkconnectivity_v1.Options): networkconnectivity_v1.Networkconnectivity;
export declare function networkconnectivity(version: 'v1alpha1'): networkconnectivity_v1alpha1.Networkconnectivity;
export declare function networkconnectivity(options: networkconnectivity_v1alpha1.Options): networkconnectivity_v1alpha1.Networkconnectivity;
declare const auth: AuthPlus;
export { auth };
export { networkconnectivity_v1 };
export { networkconnectivity_v1alpha1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
