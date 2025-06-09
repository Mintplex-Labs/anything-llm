/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { privateca_v1 } from './v1';
import { privateca_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof privateca_v1.Privateca;
    v1beta1: typeof privateca_v1beta1.Privateca;
};
export declare function privateca(version: 'v1'): privateca_v1.Privateca;
export declare function privateca(options: privateca_v1.Options): privateca_v1.Privateca;
export declare function privateca(version: 'v1beta1'): privateca_v1beta1.Privateca;
export declare function privateca(options: privateca_v1beta1.Options): privateca_v1beta1.Privateca;
declare const auth: AuthPlus;
export { auth };
export { privateca_v1 };
export { privateca_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
