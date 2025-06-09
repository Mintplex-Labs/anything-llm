/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudsupport_v2 } from './v2';
import { cloudsupport_v2beta } from './v2beta';
export declare const VERSIONS: {
    v2: typeof cloudsupport_v2.Cloudsupport;
    v2beta: typeof cloudsupport_v2beta.Cloudsupport;
};
export declare function cloudsupport(version: 'v2'): cloudsupport_v2.Cloudsupport;
export declare function cloudsupport(options: cloudsupport_v2.Options): cloudsupport_v2.Cloudsupport;
export declare function cloudsupport(version: 'v2beta'): cloudsupport_v2beta.Cloudsupport;
export declare function cloudsupport(options: cloudsupport_v2beta.Options): cloudsupport_v2beta.Cloudsupport;
declare const auth: AuthPlus;
export { auth };
export { cloudsupport_v2 };
export { cloudsupport_v2beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
