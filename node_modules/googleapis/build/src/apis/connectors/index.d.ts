/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { connectors_v1 } from './v1';
import { connectors_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof connectors_v1.Connectors;
    v2: typeof connectors_v2.Connectors;
};
export declare function connectors(version: 'v1'): connectors_v1.Connectors;
export declare function connectors(options: connectors_v1.Options): connectors_v1.Connectors;
export declare function connectors(version: 'v2'): connectors_v2.Connectors;
export declare function connectors(options: connectors_v2.Options): connectors_v2.Connectors;
declare const auth: AuthPlus;
export { auth };
export { connectors_v1 };
export { connectors_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
