/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { domains_v1 } from './v1';
import { domains_v1alpha2 } from './v1alpha2';
import { domains_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof domains_v1.Domains;
    v1alpha2: typeof domains_v1alpha2.Domains;
    v1beta1: typeof domains_v1beta1.Domains;
};
export declare function domains(version: 'v1'): domains_v1.Domains;
export declare function domains(options: domains_v1.Options): domains_v1.Domains;
export declare function domains(version: 'v1alpha2'): domains_v1alpha2.Domains;
export declare function domains(options: domains_v1alpha2.Options): domains_v1alpha2.Domains;
export declare function domains(version: 'v1beta1'): domains_v1beta1.Domains;
export declare function domains(options: domains_v1beta1.Options): domains_v1beta1.Domains;
declare const auth: AuthPlus;
export { auth };
export { domains_v1 };
export { domains_v1alpha2 };
export { domains_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
