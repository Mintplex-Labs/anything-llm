/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudcontrolspartner_v1 } from './v1';
import { cloudcontrolspartner_v1beta } from './v1beta';
export declare const VERSIONS: {
    v1: typeof cloudcontrolspartner_v1.Cloudcontrolspartner;
    v1beta: typeof cloudcontrolspartner_v1beta.Cloudcontrolspartner;
};
export declare function cloudcontrolspartner(version: 'v1'): cloudcontrolspartner_v1.Cloudcontrolspartner;
export declare function cloudcontrolspartner(options: cloudcontrolspartner_v1.Options): cloudcontrolspartner_v1.Cloudcontrolspartner;
export declare function cloudcontrolspartner(version: 'v1beta'): cloudcontrolspartner_v1beta.Cloudcontrolspartner;
export declare function cloudcontrolspartner(options: cloudcontrolspartner_v1beta.Options): cloudcontrolspartner_v1beta.Cloudcontrolspartner;
declare const auth: AuthPlus;
export { auth };
export { cloudcontrolspartner_v1 };
export { cloudcontrolspartner_v1beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
