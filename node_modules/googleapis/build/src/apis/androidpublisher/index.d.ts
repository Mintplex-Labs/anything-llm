/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { androidpublisher_v1_1 } from './v1.1';
import { androidpublisher_v1 } from './v1';
import { androidpublisher_v2 } from './v2';
import { androidpublisher_v3 } from './v3';
export declare const VERSIONS: {
    'v1.1': typeof androidpublisher_v1_1.Androidpublisher;
    v1: typeof androidpublisher_v1.Androidpublisher;
    v2: typeof androidpublisher_v2.Androidpublisher;
    v3: typeof androidpublisher_v3.Androidpublisher;
};
export declare function androidpublisher(version: 'v1.1'): androidpublisher_v1_1.Androidpublisher;
export declare function androidpublisher(options: androidpublisher_v1_1.Options): androidpublisher_v1_1.Androidpublisher;
export declare function androidpublisher(version: 'v1'): androidpublisher_v1.Androidpublisher;
export declare function androidpublisher(options: androidpublisher_v1.Options): androidpublisher_v1.Androidpublisher;
export declare function androidpublisher(version: 'v2'): androidpublisher_v2.Androidpublisher;
export declare function androidpublisher(options: androidpublisher_v2.Options): androidpublisher_v2.Androidpublisher;
export declare function androidpublisher(version: 'v3'): androidpublisher_v3.Androidpublisher;
export declare function androidpublisher(options: androidpublisher_v3.Options): androidpublisher_v3.Androidpublisher;
declare const auth: AuthPlus;
export { auth };
export { androidpublisher_v1_1 };
export { androidpublisher_v1 };
export { androidpublisher_v2 };
export { androidpublisher_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
