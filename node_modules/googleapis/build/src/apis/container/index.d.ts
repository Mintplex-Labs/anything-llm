/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { container_v1 } from './v1';
import { container_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof container_v1.Container;
    v1beta1: typeof container_v1beta1.Container;
};
export declare function container(version: 'v1'): container_v1.Container;
export declare function container(options: container_v1.Options): container_v1.Container;
export declare function container(version: 'v1beta1'): container_v1beta1.Container;
export declare function container(options: container_v1beta1.Options): container_v1beta1.Container;
declare const auth: AuthPlus;
export { auth };
export { container_v1 };
export { container_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
