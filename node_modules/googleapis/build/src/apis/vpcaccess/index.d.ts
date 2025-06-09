/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { vpcaccess_v1 } from './v1';
import { vpcaccess_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof vpcaccess_v1.Vpcaccess;
    v1beta1: typeof vpcaccess_v1beta1.Vpcaccess;
};
export declare function vpcaccess(version: 'v1'): vpcaccess_v1.Vpcaccess;
export declare function vpcaccess(options: vpcaccess_v1.Options): vpcaccess_v1.Vpcaccess;
export declare function vpcaccess(version: 'v1beta1'): vpcaccess_v1beta1.Vpcaccess;
export declare function vpcaccess(options: vpcaccess_v1beta1.Options): vpcaccess_v1beta1.Vpcaccess;
declare const auth: AuthPlus;
export { auth };
export { vpcaccess_v1 };
export { vpcaccess_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
