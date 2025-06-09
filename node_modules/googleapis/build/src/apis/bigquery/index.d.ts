/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { bigquery_v2 } from './v2';
export declare const VERSIONS: {
    v2: typeof bigquery_v2.Bigquery;
};
export declare function bigquery(version: 'v2'): bigquery_v2.Bigquery;
export declare function bigquery(options: bigquery_v2.Options): bigquery_v2.Bigquery;
declare const auth: AuthPlus;
export { auth };
export { bigquery_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
