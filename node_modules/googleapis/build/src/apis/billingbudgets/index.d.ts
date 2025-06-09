/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { billingbudgets_v1 } from './v1';
import { billingbudgets_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof billingbudgets_v1.Billingbudgets;
    v1beta1: typeof billingbudgets_v1beta1.Billingbudgets;
};
export declare function billingbudgets(version: 'v1'): billingbudgets_v1.Billingbudgets;
export declare function billingbudgets(options: billingbudgets_v1.Options): billingbudgets_v1.Billingbudgets;
export declare function billingbudgets(version: 'v1beta1'): billingbudgets_v1beta1.Billingbudgets;
export declare function billingbudgets(options: billingbudgets_v1beta1.Options): billingbudgets_v1beta1.Billingbudgets;
declare const auth: AuthPlus;
export { auth };
export { billingbudgets_v1 };
export { billingbudgets_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
