/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { healthcare_v1 } from './v1';
import { healthcare_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof healthcare_v1.Healthcare;
    v1beta1: typeof healthcare_v1beta1.Healthcare;
};
export declare function healthcare(version: 'v1'): healthcare_v1.Healthcare;
export declare function healthcare(options: healthcare_v1.Options): healthcare_v1.Healthcare;
export declare function healthcare(version: 'v1beta1'): healthcare_v1beta1.Healthcare;
export declare function healthcare(options: healthcare_v1beta1.Options): healthcare_v1beta1.Healthcare;
declare const auth: AuthPlus;
export { auth };
export { healthcare_v1 };
export { healthcare_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
