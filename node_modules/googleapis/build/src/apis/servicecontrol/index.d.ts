/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { servicecontrol_v1 } from './v1';
import { servicecontrol_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof servicecontrol_v1.Servicecontrol;
    v2: typeof servicecontrol_v2.Servicecontrol;
};
export declare function servicecontrol(version: 'v1'): servicecontrol_v1.Servicecontrol;
export declare function servicecontrol(options: servicecontrol_v1.Options): servicecontrol_v1.Servicecontrol;
export declare function servicecontrol(version: 'v2'): servicecontrol_v2.Servicecontrol;
export declare function servicecontrol(options: servicecontrol_v2.Options): servicecontrol_v2.Servicecontrol;
declare const auth: AuthPlus;
export { auth };
export { servicecontrol_v1 };
export { servicecontrol_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
