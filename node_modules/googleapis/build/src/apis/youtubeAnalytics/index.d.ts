/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { youtubeAnalytics_v1 } from './v1';
import { youtubeAnalytics_v2 } from './v2';
export declare const VERSIONS: {
    v1: typeof youtubeAnalytics_v1.Youtubeanalytics;
    v2: typeof youtubeAnalytics_v2.Youtubeanalytics;
};
export declare function youtubeAnalytics(version: 'v1'): youtubeAnalytics_v1.Youtubeanalytics;
export declare function youtubeAnalytics(options: youtubeAnalytics_v1.Options): youtubeAnalytics_v1.Youtubeanalytics;
export declare function youtubeAnalytics(version: 'v2'): youtubeAnalytics_v2.Youtubeanalytics;
export declare function youtubeAnalytics(options: youtubeAnalytics_v2.Options): youtubeAnalytics_v2.Youtubeanalytics;
declare const auth: AuthPlus;
export { auth };
export { youtubeAnalytics_v1 };
export { youtubeAnalytics_v2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
