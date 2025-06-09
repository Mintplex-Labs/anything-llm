import { writeFileSync } from 'fs';
export declare const libraryListUrl = "https://raw.githubusercontent.com/googleapis/google-cloud-node/main/libraries.json";
export interface LibraryMetadata {
    name: string;
    name_pretty: string;
    product_documentation: string;
    client_documentation: string;
    issue_tracker: string;
    release_level: string;
    language: string;
    repo: string;
    distribution_name: string;
    api_id: string;
    requires_billing: boolean;
}
export interface Disclaimer {
    api: string;
    package: string;
}
export declare const gfs: {
    writeFileSync: typeof writeFileSync;
};
/**
 * Reach out to google-cloud-node, and get a list of available client libraries
 * that are veneer or GAPIC.  Use that to populate a JSON file that will be
 * used during generation to call out improved clients in READMEs for a given
 * API.
 *
 * To use this, run `node build/src/generator/disclaimers`.
 */
export declare function main(): Promise<void>;
