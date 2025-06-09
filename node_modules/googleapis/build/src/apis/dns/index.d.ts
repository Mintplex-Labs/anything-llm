/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { dns_v1 } from './v1';
import { dns_v1beta2 } from './v1beta2';
import { dns_v2 } from './v2';
import { dns_v2beta1 } from './v2beta1';
export declare const VERSIONS: {
    v1: typeof dns_v1.Dns;
    v1beta2: typeof dns_v1beta2.Dns;
    v2: typeof dns_v2.Dns;
    v2beta1: typeof dns_v2beta1.Dns;
};
export declare function dns(version: 'v1'): dns_v1.Dns;
export declare function dns(options: dns_v1.Options): dns_v1.Dns;
export declare function dns(version: 'v1beta2'): dns_v1beta2.Dns;
export declare function dns(options: dns_v1beta2.Options): dns_v1beta2.Dns;
export declare function dns(version: 'v2'): dns_v2.Dns;
export declare function dns(options: dns_v2.Options): dns_v2.Dns;
export declare function dns(version: 'v2beta1'): dns_v2beta1.Dns;
export declare function dns(options: dns_v2beta1.Options): dns_v2beta1.Dns;
declare const auth: AuthPlus;
export { auth };
export { dns_v1 };
export { dns_v1beta2 };
export { dns_v2 };
export { dns_v2beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
