import { APIRequestContext, GlobalOptions } from './api';
import { Schema, SchemaResource } from './schema';
export interface Target {
    [index: string]: {};
}
export declare class Endpoint implements Target, APIRequestContext {
    _options: GlobalOptions;
    google: any;
    [index: string]: {};
    constructor(options: {});
    /**
     * Given a schema, add methods and resources to a target.
     *
     * @param {object} target The target to which to apply the schema.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods and
     * resources.
     * @param {object} context The context to add to each method.
     */
    applySchema(target: Target, rootSchema: Schema, schema: SchemaResource, context: APIRequestContext): void;
    /**
     * Given a schema, add methods to a target.
     *
     * @param {object} target The target to which to apply the methods.
     * @param {object} rootSchema The top-level schema, so we don't lose track of it
     * during recursion.
     * @param {object} schema The current schema from which to extract methods.
     * @param {object} context The context to add to each method.
     */
    private applyMethodsFromSchema;
    /**
     * Given a method schema, add a method to a target.
     *
     * @param target The target to which to add the method.
     * @param schema The top-level schema that contains the rootUrl, etc.
     * @param method The method schema from which to generate the method.
     * @param context The context to add to the method.
     */
    private makeMethod;
    private getPathParams;
}
