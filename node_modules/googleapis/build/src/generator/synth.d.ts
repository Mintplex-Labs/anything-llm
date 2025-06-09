import { ChangeSet } from './download';
export declare enum Semverity {
    PATCH = 1,
    MINOR = 2,
    MAJOR = 3
}
export interface Changelog {
    title: string;
    description: string;
    semverity: Semverity;
}
export interface SynthOptions {
    useCache?: boolean;
}
export declare function synth(options?: SynthOptions): Promise<void>;
/**
 * Given a set of changes, generate a changelog.
 */
export declare function createChangelog(changeSets: ChangeSet[]): {
    semverity: Semverity;
    changelog: string;
};
export declare function getPrefix(semverity: Semverity): "fix" | "feat";
/**
 * Given a set of changes, figure out if the total
 * changeset is semver patch, minor, or major.
 */
export declare function getSemverity(changeSets: ChangeSet[]): Semverity;
