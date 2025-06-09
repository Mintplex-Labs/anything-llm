/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { documentai_v1 } from './v1';
import { documentai_v1beta2 } from './v1beta2';
import { documentai_v1beta3 } from './v1beta3';
export declare const VERSIONS: {
    v1: typeof documentai_v1.Documentai;
    v1beta2: typeof documentai_v1beta2.Documentai;
    v1beta3: typeof documentai_v1beta3.Documentai;
};
export declare function documentai(version: 'v1'): documentai_v1.Documentai;
export declare function documentai(options: documentai_v1.Options): documentai_v1.Documentai;
export declare function documentai(version: 'v1beta2'): documentai_v1beta2.Documentai;
export declare function documentai(options: documentai_v1beta2.Options): documentai_v1beta2.Documentai;
export declare function documentai(version: 'v1beta3'): documentai_v1beta3.Documentai;
export declare function documentai(options: documentai_v1beta3.Options): documentai_v1beta3.Documentai;
declare const auth: AuthPlus;
export { auth };
export { documentai_v1 };
export { documentai_v1beta2 };
export { documentai_v1beta3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
