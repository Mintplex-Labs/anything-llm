/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { servicenetworking_v1 } from './v1';
import { servicenetworking_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof servicenetworking_v1.Servicenetworking;
    v1beta: typeof servicenetworking_v1beta.Servicenetworking;
};
export declare function servicenetworking(version: 'v1'): servicenetworking_v1.Servicenetworking;
export declare function servicenetworking(options: servicenetworking_v1.Options): servicenetworking_v1.Servicenetworking;
export declare function servicenetworking(version: 'v1beta'): servicenetworking_v1beta.Servicenetworking;
export declare function servicenetworking(options: servicenetworking_v1beta.Options): servicenetworking_v1beta.Servicenetworking;
declare const auth: AuthPlus;
export { auth };
export { servicenetworking_v1 };
export { servicenetworking_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
