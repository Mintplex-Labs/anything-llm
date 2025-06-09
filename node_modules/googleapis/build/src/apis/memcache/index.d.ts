/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { memcache_v1 } from './v1';
import { memcache_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    v1: typeof memcache_v1.Memcache;
    v1beta2: typeof memcache_v1beta2.Memcache;
};
export declare function memcache(version: 'v1'): memcache_v1.Memcache;
export declare function memcache(options: memcache_v1.Options): memcache_v1.Memcache;
export declare function memcache(version: 'v1beta2'): memcache_v1beta2.Memcache;
export declare function memcache(options: memcache_v1beta2.Options): memcache_v1beta2.Memcache;
declare const auth: AuthPlus;
export { auth };
export { memcache_v1 };
export { memcache_v1beta2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
