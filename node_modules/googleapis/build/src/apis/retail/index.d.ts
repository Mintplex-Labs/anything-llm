/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { retail_v2 } from './v2';
import { retail_v2alpha } from './v2alpha';
import { retail_v2beta } from './v2beta';
export declare const VERSIONS: {
    v2: typeof retail_v2.Retail;
    v2alpha: typeof retail_v2alpha.Retail;
    v2beta: typeof retail_v2beta.Retail;
};
export declare function retail(version: 'v2'): retail_v2.Retail;
export declare function retail(options: retail_v2.Options): retail_v2.Retail;
export declare function retail(version: 'v2alpha'): retail_v2alpha.Retail;
export declare function retail(options: retail_v2alpha.Options): retail_v2alpha.Retail;
export declare function retail(version: 'v2beta'): retail_v2beta.Retail;
export declare function retail(options: retail_v2beta.Options): retail_v2beta.Retail;
declare const auth: AuthPlus;
export { auth };
export { retail_v2 };
export { retail_v2alpha };
export { retail_v2beta };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
