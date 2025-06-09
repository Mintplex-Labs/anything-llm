import * as http2 from 'http2';
import { URL } from 'url';
import { GaxiosResponse, GaxiosOptions } from 'gaxios';
/**
 * Reference to the ClientHttp2Session and a timeout handler.
 * @private
 */
export interface SessionData {
    session: http2.ClientHttp2Session;
    timeoutHandle?: NodeJS.Timeout;
}
/**
 * List of sessions current in use.
 * @private
 */
export declare const sessions: {
    [index: string]: SessionData;
};
/**
 * @experimental
 */
export interface GaxiosResponseWithHTTP2<T = ReturnType<JSON['parse']>> extends Omit<GaxiosResponse<T>, 'headers'> {
    request?: http2.ClientHttp2Stream;
    headers: http2.IncomingHttpHeaders & http2.IncomingHttpStatusHeader;
}
/**
 * Public method to make an http2 request.
 * @param config - Request options.
 */
export declare function request<T>(config: GaxiosOptions): Promise<GaxiosResponseWithHTTP2<T>>;
export declare function closeSession(url: URL): Promise<void>;
