/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { accesscontextmanager_v1 } from './v1';
import { accesscontextmanager_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof accesscontextmanager_v1.Accesscontextmanager;
    v1beta: typeof accesscontextmanager_v1beta.Accesscontextmanager;
};
export declare function accesscontextmanager(version: 'v1'): accesscontextmanager_v1.Accesscontextmanager;
export declare function accesscontextmanager(options: accesscontextmanager_v1.Options): accesscontextmanager_v1.Accesscontextmanager;
export declare function accesscontextmanager(version: 'v1beta'): accesscontextmanager_v1beta.Accesscontextmanager;
export declare function accesscontextmanager(options: accesscontextmanager_v1beta.Options): accesscontextmanager_v1beta.Accesscontextmanager;
declare const auth: AuthPlus;
export { auth };
export { accesscontextmanager_v1 };
export { accesscontextmanager_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
