/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { redis_v1 } from './v1';
import { redis_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof redis_v1.Redis;
    v1beta1: typeof redis_v1beta1.Redis;
};
export declare function redis(version: 'v1'): redis_v1.Redis;
export declare function redis(options: redis_v1.Options): redis_v1.Redis;
export declare function redis(version: 'v1beta1'): redis_v1beta1.Redis;
export declare function redis(options: redis_v1beta1.Options): redis_v1beta1.Redis;
declare const auth: AuthPlus;
export { auth };
export { redis_v1 };
export { redis_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
