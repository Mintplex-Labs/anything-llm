/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { workflowexecutions_v1 } from './v1';
import { workflowexecutions_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof workflowexecutions_v1.Workflowexecutions;
    v1beta: typeof workflowexecutions_v1beta.Workflowexecutions;
};
export declare function workflowexecutions(version: 'v1'): workflowexecutions_v1.Workflowexecutions;
export declare function workflowexecutions(options: workflowexecutions_v1.Options): workflowexecutions_v1.Workflowexecutions;
export declare function workflowexecutions(version: 'v1beta'): workflowexecutions_v1beta.Workflowexecutions;
export declare function workflowexecutions(options: workflowexecutions_v1beta.Options): workflowexecutions_v1beta.Workflowexecutions;
declare const auth: AuthPlus;
export { auth };
export { workflowexecutions_v1 };
export { workflowexecutions_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
