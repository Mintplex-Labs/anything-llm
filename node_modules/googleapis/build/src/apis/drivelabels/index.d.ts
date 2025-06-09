/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { drivelabels_v2 } from './v2';
import { drivelabels_v2beta } from './v2beta';
export declare const VERSIONS: {
    v2: typeof drivelabels_v2.Drivelabels;
    v2beta: typeof drivelabels_v2beta.Drivelabels;
};
export declare function drivelabels(version: 'v2'): drivelabels_v2.Drivelabels;
export declare function drivelabels(options: drivelabels_v2.Options): drivelabels_v2.Drivelabels;
export declare function drivelabels(version: 'v2beta'): drivelabels_v2beta.Drivelabels;
export declare function drivelabels(options: drivelabels_v2beta.Options): drivelabels_v2beta.Drivelabels;
declare const auth: AuthPlus;
export { auth };
export { drivelabels_v2 };
export { drivelabels_v2beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
