/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { artifactregistry_v1 } from './v1';
import { artifactregistry_v1beta1 } from './v1beta1';
import { artifactregistry_v1beta2 } from './v1beta2';
export declare const VERSIONS: {
    v1: typeof artifactregistry_v1.Artifactregistry;
    v1beta1: typeof artifactregistry_v1beta1.Artifactregistry;
    v1beta2: typeof artifactregistry_v1beta2.Artifactregistry;
};
export declare function artifactregistry(version: 'v1'): artifactregistry_v1.Artifactregistry;
export declare function artifactregistry(options: artifactregistry_v1.Options): artifactregistry_v1.Artifactregistry;
export declare function artifactregistry(version: 'v1beta1'): artifactregistry_v1beta1.Artifactregistry;
export declare function artifactregistry(options: artifactregistry_v1beta1.Options): artifactregistry_v1beta1.Artifactregistry;
export declare function artifactregistry(version: 'v1beta2'): artifactregistry_v1beta2.Artifactregistry;
export declare function artifactregistry(options: artifactregistry_v1beta2.Options): artifactregistry_v1beta2.Artifactregistry;
declare const auth: AuthPlus;
export { auth };
export { artifactregistry_v1 };
export { artifactregistry_v1beta1 };
export { artifactregistry_v1beta2 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
