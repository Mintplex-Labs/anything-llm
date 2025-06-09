/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { content_v2_1 } from './v2.1';
import { content_v2 } from './v2';
export declare const VERSIONS: {
    'v2.1': typeof content_v2_1.Content;
    v2: typeof content_v2.Content;
};
export declare function content(version: 'v2.1'): content_v2_1.Content;
export declare function content(options: content_v2_1.Options): content_v2_1.Content;
export declare function content(version: 'v2'): content_v2.Content;
export declare function content(options: content_v2.Options): content_v2.Content;
declare const auth: AuthPlus;
export { auth };
export { content_v2_1 };
export { content_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
