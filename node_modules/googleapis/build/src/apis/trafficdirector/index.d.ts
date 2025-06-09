/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { trafficdirector_v2 } from './v2';
import { trafficdirector_v3 } from './v3';
export declare const VERSIONS: {
    v2: typeof trafficdirector_v2.Trafficdirector;
    v3: typeof trafficdirector_v3.Trafficdirector;
};
export declare function trafficdirector(version: 'v2'): trafficdirector_v2.Trafficdirector;
export declare function trafficdirector(options: trafficdirector_v2.Options): trafficdirector_v2.Trafficdirector;
export declare function trafficdirector(version: 'v3'): trafficdirector_v3.Trafficdirector;
export declare function trafficdirector(options: trafficdirector_v3.Options): trafficdirector_v3.Trafficdirector;
declare const auth: AuthPlus;
export { auth };
export { trafficdirector_v2 };
export { trafficdirector_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
