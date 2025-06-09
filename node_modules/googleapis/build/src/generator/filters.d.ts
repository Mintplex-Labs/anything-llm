import { SchemaItem, SchemaMethod, SchemaParameters } from 'googleapis-common';
export declare function getObjectType(item: SchemaItem): string;
export declare function isSimpleType(type: string): boolean;
export declare function cleanPropertyName(prop: string): string;
export declare function camelify(name: string): string;
export declare function getType(item: SchemaItem): string;
/**
 * Clean a string of comment tags.
 * @param str - String to process
 * @return Single line string processed
 */
export declare function cleanComments(str?: string): string;
export declare function getPathParams(params: SchemaParameters): string[];
export declare function getSafeParamName(param: string): string;
export declare function hasResourceParam(method: SchemaMethod): boolean;
/**
 * Build a string used to create a URL from the discovery doc provided URL.
 * replace double slashes with single slash (except in https://)
 * @private
 * @param  input URL to build from
 * @return Resulting built URL
 */
export declare function buildurl(input?: string): string;
/**
 * Attempt to turn a regex into a more human readable form.
 * @param regex pattern for the given parameter
 */
export declare function unRegex(regex: string): string;
