export { decodeOriginalScopes, encodeOriginalScopes, decodeGeneratedRanges, encodeGeneratedRanges, } from './scopes';
export type { OriginalScope, GeneratedRange, CallSite, BindingExpressionRange } from './scopes';
export declare type SourceMapSegment = [number] | [number, number, number, number] | [number, number, number, number, number];
export declare type SourceMapLine = SourceMapSegment[];
export declare type SourceMapMappings = SourceMapLine[];
export declare function decode(mappings: string): SourceMapMappings;
export declare function encode(decoded: SourceMapMappings): string;
export declare function encode(decoded: Readonly<SourceMapMappings>): string;
