import { APIRequestParams, BodyResponseCallback } from './api';
import { GaxiosResponseWithHTTP2 } from './http2';
/**
 * Create and send request to Google API
 * @param parameters Parameters used to form request
 * @param callback   Callback when request finished or error found
 */
export declare function createAPIRequest<T>(parameters: APIRequestParams): Promise<GaxiosResponseWithHTTP2<T>>;
export declare function createAPIRequest<T>(parameters: APIRequestParams, callback: BodyResponseCallback<T>): void;
