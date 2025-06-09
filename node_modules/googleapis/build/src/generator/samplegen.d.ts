import { Schema, SchemaMethod, SchemaMethods, SchemaResources } from 'googleapis-common';
/**
 * Given a top level Schema, collect every method on all resource objects.
 * Generate a sample, format it, and attach to the `method.fragment` field.
 * @param schema Top level schema for the API.
 */
export declare function addFragments(schema: Schema): Promise<void>;
/**
 * Generate all samples, and write them into the samples folder on disk.
 * @param apiPath Location on disk where the API lives.
 * @param schema The top level Schema containing API information.
 */
export declare function generateSamples(apiPath: string, schema: Schema): Promise<void>;
interface MethodBag {
    methods?: SchemaMethods;
    resources?: SchemaResources;
}
/**
 * Iterate over items in the schema recursively, and return a flattened
 * list of all methods.
 * @param bag
 * @param methods
 */
export declare function getAllMethods(bag: MethodBag, methods?: SchemaMethod[]): SchemaMethod[];
export {};
