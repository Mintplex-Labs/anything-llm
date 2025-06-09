/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { workstations_v1 } from './v1';
import { workstations_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof workstations_v1.Workstations;
    v1beta: typeof workstations_v1beta.Workstations;
};
export declare function workstations(version: 'v1'): workstations_v1.Workstations;
export declare function workstations(options: workstations_v1.Options): workstations_v1.Workstations;
export declare function workstations(version: 'v1beta'): workstations_v1beta.Workstations;
export declare function workstations(options: workstations_v1beta.Options): workstations_v1beta.Workstations;
declare const auth: AuthPlus;
export { auth };
export { workstations_v1 };
export { workstations_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
