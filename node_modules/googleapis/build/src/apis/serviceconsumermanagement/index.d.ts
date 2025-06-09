/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { serviceconsumermanagement_v1 } from './v1';
import { serviceconsumermanagement_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof serviceconsumermanagement_v1.Serviceconsumermanagement;
    v1beta1: typeof serviceconsumermanagement_v1beta1.Serviceconsumermanagement;
};
export declare function serviceconsumermanagement(version: 'v1'): serviceconsumermanagement_v1.Serviceconsumermanagement;
export declare function serviceconsumermanagement(options: serviceconsumermanagement_v1.Options): serviceconsumermanagement_v1.Serviceconsumermanagement;
export declare function serviceconsumermanagement(version: 'v1beta1'): serviceconsumermanagement_v1beta1.Serviceconsumermanagement;
export declare function serviceconsumermanagement(options: serviceconsumermanagement_v1beta1.Options): serviceconsumermanagement_v1beta1.Serviceconsumermanagement;
declare const auth: AuthPlus;
export { auth };
export { serviceconsumermanagement_v1 };
export { serviceconsumermanagement_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
