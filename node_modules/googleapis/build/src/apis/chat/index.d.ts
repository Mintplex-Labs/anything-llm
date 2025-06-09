/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { chat_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof chat_v1.Chat;
};
export declare function chat(version: 'v1'): chat_v1.Chat;
export declare function chat(options: chat_v1.Options): chat_v1.Chat;
declare const auth: AuthPlus;
export { auth };
export { chat_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
