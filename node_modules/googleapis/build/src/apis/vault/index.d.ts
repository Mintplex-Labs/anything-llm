/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { vault_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof vault_v1.Vault;
};
export declare function vault(version: 'v1'): vault_v1.Vault;
export declare function vault(options: vault_v1.Options): vault_v1.Vault;
declare const auth: AuthPlus;
export { auth };
export { vault_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
