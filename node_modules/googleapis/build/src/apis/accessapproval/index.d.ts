/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { accessapproval_v1 } from './v1';
import { accessapproval_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof accessapproval_v1.Accessapproval;
    v1beta1: typeof accessapproval_v1beta1.Accessapproval;
};
export declare function accessapproval(version: 'v1'): accessapproval_v1.Accessapproval;
export declare function accessapproval(options: accessapproval_v1.Options): accessapproval_v1.Accessapproval;
export declare function accessapproval(version: 'v1beta1'): accessapproval_v1beta1.Accessapproval;
export declare function accessapproval(options: accessapproval_v1beta1.Options): accessapproval_v1beta1.Accessapproval;
declare const auth: AuthPlus;
export { auth };
export { accessapproval_v1 };
export { accessapproval_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
