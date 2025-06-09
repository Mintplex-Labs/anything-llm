/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { discovery_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof discovery_v1.Discovery;
};
export declare function discovery(version: 'v1'): discovery_v1.Discovery;
export declare function discovery(options: discovery_v1.Options): discovery_v1.Discovery;
declare const auth: AuthPlus;
export { auth };
export { discovery_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
