/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { datacatalog_v1 } from './v1';
import { datacatalog_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof datacatalog_v1.Datacatalog;
    v1beta1: typeof datacatalog_v1beta1.Datacatalog;
};
export declare function datacatalog(version: 'v1'): datacatalog_v1.Datacatalog;
export declare function datacatalog(options: datacatalog_v1.Options): datacatalog_v1.Datacatalog;
export declare function datacatalog(version: 'v1beta1'): datacatalog_v1beta1.Datacatalog;
export declare function datacatalog(options: datacatalog_v1beta1.Options): datacatalog_v1beta1.Datacatalog;
declare const auth: AuthPlus;
export { auth };
export { datacatalog_v1 };
export { datacatalog_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
