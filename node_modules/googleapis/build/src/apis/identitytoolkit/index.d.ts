/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { identitytoolkit_v2 } from './v2';
import { identitytoolkit_v3 } from './v3';
export declare const VERSIONS: {
    v2: typeof identitytoolkit_v2.Identitytoolkit;
    v3: typeof identitytoolkit_v3.Identitytoolkit;
};
export declare function identitytoolkit(version: 'v2'): identitytoolkit_v2.Identitytoolkit;
export declare function identitytoolkit(options: identitytoolkit_v2.Options): identitytoolkit_v2.Identitytoolkit;
export declare function identitytoolkit(version: 'v3'): identitytoolkit_v3.Identitytoolkit;
export declare function identitytoolkit(options: identitytoolkit_v3.Options): identitytoolkit_v3.Identitytoolkit;
declare const auth: AuthPlus;
export { auth };
export { identitytoolkit_v2 };
export { identitytoolkit_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
