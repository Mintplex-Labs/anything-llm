/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { verifiedaccess_v1 } from './v1';
import { verifiedaccess_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof verifiedaccess_v1.Verifiedaccess;
    v2: typeof verifiedaccess_v2.Verifiedaccess;
};
export declare function verifiedaccess(version: 'v1'): verifiedaccess_v1.Verifiedaccess;
export declare function verifiedaccess(options: verifiedaccess_v1.Options): verifiedaccess_v1.Verifiedaccess;
export declare function verifiedaccess(version: 'v2'): verifiedaccess_v2.Verifiedaccess;
export declare function verifiedaccess(options: verifiedaccess_v2.Options): verifiedaccess_v2.Verifiedaccess;
declare const auth: AuthPlus;
export { auth };
export { verifiedaccess_v1 };
export { verifiedaccess_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
