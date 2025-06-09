/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { recommender_v1 } from './v1';
import { recommender_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof recommender_v1.Recommender;
    v1beta1: typeof recommender_v1beta1.Recommender;
};
export declare function recommender(version: 'v1'): recommender_v1.Recommender;
export declare function recommender(options: recommender_v1.Options): recommender_v1.Recommender;
export declare function recommender(version: 'v1beta1'): recommender_v1beta1.Recommender;
export declare function recommender(options: recommender_v1beta1.Options): recommender_v1beta1.Recommender;
declare const auth: AuthPlus;
export { auth };
export { recommender_v1 };
export { recommender_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
