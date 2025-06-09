/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { books_v1 } from './v1';
export declare const VERSIONS: {
    v1: typeof books_v1.Books;
};
export declare function books(version: 'v1'): books_v1.Books;
export declare function books(options: books_v1.Options): books_v1.Books;
declare const auth: AuthPlus;
export { auth };
export { books_v1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
