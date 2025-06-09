/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { workflows_v1 } from './v1';
import { workflows_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof workflows_v1.Workflows;
    v1beta: typeof workflows_v1beta.Workflows;
};
export declare function workflows(version: 'v1'): workflows_v1.Workflows;
export declare function workflows(options: workflows_v1.Options): workflows_v1.Workflows;
export declare function workflows(version: 'v1beta'): workflows_v1beta.Workflows;
export declare function workflows(options: workflows_v1beta.Options): workflows_v1beta.Workflows;
declare const auth: AuthPlus;
export { auth };
export { workflows_v1 };
export { workflows_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
