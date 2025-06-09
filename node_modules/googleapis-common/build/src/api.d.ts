import { GaxiosOptions } from 'gaxios';
import { OAuth2Client, GoogleAuth, BaseExternalAccountClient } from 'google-auth-library';
import { Endpoint } from './endpoint';
import { GaxiosResponseWithHTTP2 } from './http2';
export interface APIRequestParams<T = any> {
    options: MethodOptions;
    params: T;
    requiredParams: string[];
    pathParams: string[];
    context: APIRequestContext;
    mediaUrl?: string | null;
}
export interface GoogleConfigurable {
    _options: GlobalOptions;
}
export interface APIRequestContext {
    google?: GoogleConfigurable;
    _options: GlobalOptions;
}
/**
 * This interface is a mix of the AxiosRequestConfig options
 * and our `auth` options.
 */
export interface GlobalOptions extends MethodOptions {
    auth?: GoogleAuth | OAuth2Client | BaseExternalAccountClient | string;
    universeDomain?: string;
    universe_domain?: string;
}
export interface MethodOptions extends GaxiosOptions {
    apiVersion?: string;
    rootUrl?: string;
    http2?: boolean;
    userAgentDirectives?: UserAgentDirective[];
}
export interface StreamMethodOptions extends MethodOptions {
    responseType: 'stream';
}
/**
 * An additional directive to add to the user agent header.
 * Directives come in the form of:
 * User-Agent: <product> / <product-version> <comment>
 *
 * For more information, see:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
export interface UserAgentDirective {
    product: string;
    version: string;
    comment?: string;
}
export interface ServiceOptions extends GlobalOptions {
    version?: string;
}
export type BodyResponseCallback<T> = (err: Error | null, res?: GaxiosResponseWithHTTP2<T> | null) => void;
export type APIEndpoint = Readonly<Endpoint & any>;
