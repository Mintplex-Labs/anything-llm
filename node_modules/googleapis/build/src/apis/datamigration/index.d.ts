/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { datamigration_v1 } from './v1';
import { datamigration_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof datamigration_v1.Datamigration;
    v1beta1: typeof datamigration_v1beta1.Datamigration;
};
export declare function datamigration(version: 'v1'): datamigration_v1.Datamigration;
export declare function datamigration(options: datamigration_v1.Options): datamigration_v1.Datamigration;
export declare function datamigration(version: 'v1beta1'): datamigration_v1beta1.Datamigration;
export declare function datamigration(options: datamigration_v1beta1.Options): datamigration_v1beta1.Datamigration;
declare const auth: AuthPlus;
export { auth };
export { datamigration_v1 };
export { datamigration_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
