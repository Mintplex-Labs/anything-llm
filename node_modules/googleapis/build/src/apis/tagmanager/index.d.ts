/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { tagmanager_v1 } from './v1';
import { tagmanager_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof tagmanager_v1.Tagmanager;
    v2: typeof tagmanager_v2.Tagmanager;
};
export declare function tagmanager(version: 'v1'): tagmanager_v1.Tagmanager;
export declare function tagmanager(options: tagmanager_v1.Options): tagmanager_v1.Tagmanager;
export declare function tagmanager(version: 'v2'): tagmanager_v2.Tagmanager;
export declare function tagmanager(options: tagmanager_v2.Options): tagmanager_v2.Tagmanager;
declare const auth: AuthPlus;
export { auth };
export { tagmanager_v1 };
export { tagmanager_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
