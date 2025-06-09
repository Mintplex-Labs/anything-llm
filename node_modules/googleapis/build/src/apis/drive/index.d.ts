/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { drive_v2 } from './v2';
import { drive_v3 } from './v3';
export declare const VERSIONS: {
    v2: typeof drive_v2.Drive;
    v3: typeof drive_v3.Drive;
};
export declare function drive(version: 'v2'): drive_v2.Drive;
export declare function drive(options: drive_v2.Options): drive_v2.Drive;
export declare function drive(version: 'v3'): drive_v3.Drive;
export declare function drive(options: drive_v3.Options): drive_v3.Drive;
declare const auth: AuthPlus;
export { auth };
export { drive_v2 };
export { drive_v3 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
