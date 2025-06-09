/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { apigateway_v1 } from './v1';
import { apigateway_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof apigateway_v1.Apigateway;
    v1beta: typeof apigateway_v1beta.Apigateway;
};
export declare function apigateway(version: 'v1'): apigateway_v1.Apigateway;
export declare function apigateway(options: apigateway_v1.Options): apigateway_v1.Apigateway;
export declare function apigateway(version: 'v1beta'): apigateway_v1beta.Apigateway;
export declare function apigateway(options: apigateway_v1beta.Options): apigateway_v1beta.Apigateway;
declare const auth: AuthPlus;
export { auth };
export { apigateway_v1 };
export { apigateway_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
