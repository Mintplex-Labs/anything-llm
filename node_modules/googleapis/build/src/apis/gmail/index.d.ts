/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { gmail_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof gmail_v1.Gmail;
};
export declare function gmail(version: 'v1'): gmail_v1.Gmail;
export declare function gmail(options: gmail_v1.Options): gmail_v1.Gmail;
declare const auth: AuthPlus;
export { auth };
export { gmail_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
