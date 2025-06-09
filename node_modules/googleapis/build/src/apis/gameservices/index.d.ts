/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { gameservices_v1 } from './v1';
import { gameservices_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof gameservices_v1.Gameservices;
    v1beta: typeof gameservices_v1beta.Gameservices;
};
export declare function gameservices(version: 'v1'): gameservices_v1.Gameservices;
export declare function gameservices(options: gameservices_v1.Options): gameservices_v1.Gameservices;
export declare function gameservices(version: 'v1beta'): gameservices_v1beta.Gameservices;
export declare function gameservices(options: gameservices_v1beta.Options): gameservices_v1beta.Gameservices;
declare const auth: AuthPlus;
export { auth };
export { gameservices_v1 };
export { gameservices_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
