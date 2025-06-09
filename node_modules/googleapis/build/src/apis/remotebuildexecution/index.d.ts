/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { remotebuildexecution_v1 } from './v1';
import { remotebuildexecution_v1alpha } from './v1alpha';
import { remotebuildexecution_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof remotebuildexecution_v1.Remotebuildexecution;
    v1alpha: typeof remotebuildexecution_v1alpha.Remotebuildexecution;
    v2: typeof remotebuildexecution_v2.Remotebuildexecution;
};
export declare function remotebuildexecution(version: 'v1'): remotebuildexecution_v1.Remotebuildexecution;
export declare function remotebuildexecution(options: remotebuildexecution_v1.Options): remotebuildexecution_v1.Remotebuildexecution;
export declare function remotebuildexecution(version: 'v1alpha'): remotebuildexecution_v1alpha.Remotebuildexecution;
export declare function remotebuildexecution(options: remotebuildexecution_v1alpha.Options): remotebuildexecution_v1alpha.Remotebuildexecution;
export declare function remotebuildexecution(version: 'v2'): remotebuildexecution_v2.Remotebuildexecution;
export declare function remotebuildexecution(options: remotebuildexecution_v2.Options): remotebuildexecution_v2.Remotebuildexecution;
declare const auth: AuthPlus;
export { auth };
export { remotebuildexecution_v1 };
export { remotebuildexecution_v1alpha };
export { remotebuildexecution_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
