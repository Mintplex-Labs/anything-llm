/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { cloudtasks_v2 } from './v2';
import { cloudtasks_v2beta2 } from './v2beta2';
import { cloudtasks_v2beta3 } from './v2beta3';
export declare const VERSIONS: {
    v2: typeof cloudtasks_v2.Cloudtasks;
    v2beta2: typeof cloudtasks_v2beta2.Cloudtasks;
    v2beta3: typeof cloudtasks_v2beta3.Cloudtasks;
};
export declare function cloudtasks(version: 'v2'): cloudtasks_v2.Cloudtasks;
export declare function cloudtasks(options: cloudtasks_v2.Options): cloudtasks_v2.Cloudtasks;
export declare function cloudtasks(version: 'v2beta2'): cloudtasks_v2beta2.Cloudtasks;
export declare function cloudtasks(options: cloudtasks_v2beta2.Options): cloudtasks_v2beta2.Cloudtasks;
export declare function cloudtasks(version: 'v2beta3'): cloudtasks_v2beta3.Cloudtasks;
export declare function cloudtasks(options: cloudtasks_v2beta3.Options): cloudtasks_v2beta3.Cloudtasks;
declare const auth: AuthPlus;
export { auth };
export { cloudtasks_v2 };
export { cloudtasks_v2beta2 };
export { cloudtasks_v2beta3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
