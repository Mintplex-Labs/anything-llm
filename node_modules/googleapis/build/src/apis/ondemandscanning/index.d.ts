/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { ondemandscanning_v1 } from './v1';
import { ondemandscanning_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof ondemandscanning_v1.Ondemandscanning;
    v1beta1: typeof ondemandscanning_v1beta1.Ondemandscanning;
};
export declare function ondemandscanning(version: 'v1'): ondemandscanning_v1.Ondemandscanning;
export declare function ondemandscanning(options: ondemandscanning_v1.Options): ondemandscanning_v1.Ondemandscanning;
export declare function ondemandscanning(version: 'v1beta1'): ondemandscanning_v1beta1.Ondemandscanning;
export declare function ondemandscanning(options: ondemandscanning_v1beta1.Options): ondemandscanning_v1beta1.Ondemandscanning;
declare const auth: AuthPlus;
export { auth };
export { ondemandscanning_v1 };
export { ondemandscanning_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
