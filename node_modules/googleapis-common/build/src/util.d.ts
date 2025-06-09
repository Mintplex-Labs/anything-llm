import { GaxiosResponse } from 'gaxios';
import { GaxiosResponseWithHTTP2 } from './http2';
export type HeadersInit = ConstructorParameters<typeof Headers>[0];
/**
 * A utility for converting potential {@link Headers `Headers`} objects to plain headers objects.
 *
 * @param headers any compatible `HeadersInit` (`Headers`, (string, string)[], {})
 * @returns the headers in `Record<string, string>` form.
 */
export declare function headersToClassicHeaders<T extends Record<string, string>>(headers: HeadersInit): T;
/**
 * marshall a GaxiosResponse into a library-friendly type.
 *
 * @param res the Gaxios Response
 * @returns the GaxiosResponse with HTTP2-ready/compatible headers
 */
export declare function marshallGaxiosResponse<T extends GaxiosResponse>(res?: T): GaxiosResponseWithHTTP2;
