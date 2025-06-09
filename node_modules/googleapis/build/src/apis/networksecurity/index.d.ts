/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { networksecurity_v1 } from './v1';
import { networksecurity_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof networksecurity_v1.Networksecurity;
    v1beta1: typeof networksecurity_v1beta1.Networksecurity;
};
export declare function networksecurity(version: 'v1'): networksecurity_v1.Networksecurity;
export declare function networksecurity(options: networksecurity_v1.Options): networksecurity_v1.Networksecurity;
export declare function networksecurity(version: 'v1beta1'): networksecurity_v1beta1.Networksecurity;
export declare function networksecurity(options: networksecurity_v1beta1.Options): networksecurity_v1beta1.Networksecurity;
declare const auth: AuthPlus;
export { auth };
export { networksecurity_v1 };
export { networksecurity_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
