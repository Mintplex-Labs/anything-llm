declare type Line = number;
declare type Column = number;
declare type Kind = number;
declare type Name = number;
declare type Var = number;
declare type SourcesIndex = number;
declare type ScopesIndex = number;
declare type Mix<A, B, O> = (A & O) | (B & O);
export declare type OriginalScope = Mix<[
    Line,
    Column,
    Line,
    Column,
    Kind
], [
    Line,
    Column,
    Line,
    Column,
    Kind,
    Name
], {
    vars: Var[];
}>;
export declare type GeneratedRange = Mix<[
    Line,
    Column,
    Line,
    Column
], [
    Line,
    Column,
    Line,
    Column,
    SourcesIndex,
    ScopesIndex
], {
    callsite: CallSite | null;
    bindings: Binding[];
    isScope: boolean;
}>;
export declare type CallSite = [SourcesIndex, Line, Column];
declare type Binding = BindingExpressionRange[];
export declare type BindingExpressionRange = [Name] | [Name, Line, Column];
export declare function decodeOriginalScopes(input: string): OriginalScope[];
export declare function encodeOriginalScopes(scopes: OriginalScope[]): string;
export declare function decodeGeneratedRanges(input: string): GeneratedRange[];
export declare function encodeGeneratedRanges(ranges: GeneratedRange[]): string;
export {};
