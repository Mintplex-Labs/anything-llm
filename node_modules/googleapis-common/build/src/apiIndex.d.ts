import { GoogleConfigurable, ServiceOptions } from '.';
export declare function getAPI<T>(api: string, options: ServiceOptions | string, versions: {
    [index: string]: any;
}, context?: GoogleConfigurable): T;
