/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { monitoring_v1 } from './v1';
import { monitoring_v3 } from './v3';
export declare const VERSIONS: {
    v1: typeof monitoring_v1.Monitoring;
    v3: typeof monitoring_v3.Monitoring;
};
export declare function monitoring(version: 'v1'): monitoring_v1.Monitoring;
export declare function monitoring(options: monitoring_v1.Options): monitoring_v1.Monitoring;
export declare function monitoring(version: 'v3'): monitoring_v3.Monitoring;
export declare function monitoring(options: monitoring_v3.Options): monitoring_v3.Monitoring;
declare const auth: AuthPlus;
export { auth };
export { monitoring_v1 };
export { monitoring_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
