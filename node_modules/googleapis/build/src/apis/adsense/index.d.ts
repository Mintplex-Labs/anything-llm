/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { adsense_v1_4 } from './v1.4';
import { adsense_v2 } from './v2';
export declare const VERSIONS: {
    'v1.4': typeof adsense_v1_4.Adsense;
    v2: typeof adsense_v2.Adsense;
};
export declare function adsense(version: 'v1.4'): adsense_v1_4.Adsense;
export declare function adsense(options: adsense_v1_4.Options): adsense_v1_4.Adsense;
export declare function adsense(version: 'v2'): adsense_v2.Adsense;
export declare function adsense(options: adsense_v2.Options): adsense_v2.Adsense;
declare const auth: AuthPlus;
export { auth };
export { adsense_v1_4 };
export { adsense_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
