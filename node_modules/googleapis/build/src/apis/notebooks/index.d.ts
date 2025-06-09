/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { notebooks_v1 } from './v1';
import { notebooks_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof notebooks_v1.Notebooks;
    v2: typeof notebooks_v2.Notebooks;
};
export declare function notebooks(version: 'v1'): notebooks_v1.Notebooks;
export declare function notebooks(options: notebooks_v1.Options): notebooks_v1.Notebooks;
export declare function notebooks(version: 'v2'): notebooks_v2.Notebooks;
export declare function notebooks(options: notebooks_v2.Options): notebooks_v2.Notebooks;
declare const auth: AuthPlus;
export { auth };
export { notebooks_v1 };
export { notebooks_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
