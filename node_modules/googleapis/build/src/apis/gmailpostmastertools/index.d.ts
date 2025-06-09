/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { gmailpostmastertools_v1 } from './v1';
import { gmailpostmastertools_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof gmailpostmastertools_v1.Gmailpostmastertools;
    v1beta1: typeof gmailpostmastertools_v1beta1.Gmailpostmastertools;
};
export declare function gmailpostmastertools(version: 'v1'): gmailpostmastertools_v1.Gmailpostmastertools;
export declare function gmailpostmastertools(options: gmailpostmastertools_v1.Options): gmailpostmastertools_v1.Gmailpostmastertools;
export declare function gmailpostmastertools(version: 'v1beta1'): gmailpostmastertools_v1beta1.Gmailpostmastertools;
export declare function gmailpostmastertools(options: gmailpostmastertools_v1beta1.Options): gmailpostmastertools_v1beta1.Gmailpostmastertools;
declare const auth: AuthPlus;
export { auth };
export { gmailpostmastertools_v1 };
export { gmailpostmastertools_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
