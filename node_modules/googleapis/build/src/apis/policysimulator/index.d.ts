/*! THIS FILE IS AUTO-GENERATED */
import { AuthPlus } from 'googleapis-common';
import { policysimulator_v1 } from './v1';
import { policysimulator_v1alpha } from './v1alpha';
import { policysimulator_v1beta } from './v1beta';
import { policysimulator_v1beta1 } from './v1beta1';
export declare const VERSIONS: {
    v1: typeof policysimulator_v1.Policysimulator;
    v1alpha: typeof policysimulator_v1alpha.Policysimulator;
    v1beta: typeof policysimulator_v1beta.Policysimulator;
    v1beta1: typeof policysimulator_v1beta1.Policysimulator;
};
export declare function policysimulator(version: 'v1'): policysimulator_v1.Policysimulator;
export declare function policysimulator(options: policysimulator_v1.Options): policysimulator_v1.Policysimulator;
export declare function policysimulator(version: 'v1alpha'): policysimulator_v1alpha.Policysimulator;
export declare function policysimulator(options: policysimulator_v1alpha.Options): policysimulator_v1alpha.Policysimulator;
export declare function policysimulator(version: 'v1beta'): policysimulator_v1beta.Policysimulator;
export declare function policysimulator(options: policysimulator_v1beta.Options): policysimulator_v1beta.Policysimulator;
export declare function policysimulator(version: 'v1beta1'): policysimulator_v1beta1.Policysimulator;
export declare function policysimulator(options: policysimulator_v1beta1.Options): policysimulator_v1beta1.Policysimulator;
declare const auth: AuthPlus;
export { auth };
export { policysimulator_v1 };
export { policysimulator_v1alpha };
export { policysimulator_v1beta };
export { policysimulator_v1beta1 };
export { AuthPlus, GlobalOptions, APIRequestContext, GoogleConfigurable, StreamMethodOptions, MethodOptions, BodyResponseCallback, } from 'googleapis-common';
