import * as execa from 'execa';
import * as fs from 'fs';
export declare const gfs: {
    mkdir: typeof fs.mkdirSync;
    exists: typeof fs.existsSync;
    writeFile: typeof fs.writeFile.__promisify__;
    readdir: typeof fs.readdir.__promisify__;
    execa: {
        (file: string, arguments?: readonly string[], options?: execa.Options): execa.ExecaChildProcess;
        (file: string, arguments?: readonly string[], options?: execa.Options<null>): execa.ExecaChildProcess<Buffer>;
        (file: string, options?: execa.Options): execa.ExecaChildProcess;
        (file: string, options?: execa.Options<null>): execa.ExecaChildProcess<Buffer>;
        sync(file: string, arguments?: readonly string[], options?: execa.SyncOptions): execa.ExecaSyncReturnValue;
        sync(file: string, arguments?: readonly string[], options?: execa.SyncOptions<null>): execa.ExecaSyncReturnValue<Buffer>;
        sync(file: string, options?: execa.SyncOptions): execa.ExecaSyncReturnValue;
        sync(file: string, options?: execa.SyncOptions<null>): execa.ExecaSyncReturnValue<Buffer>;
        command(command: string, options?: execa.Options): execa.ExecaChildProcess;
        command(command: string, options?: execa.Options<null>): execa.ExecaChildProcess<Buffer>;
        commandSync(command: string, options?: execa.SyncOptions): execa.ExecaSyncReturnValue;
        commandSync(command: string, options?: execa.SyncOptions<null>): execa.ExecaSyncReturnValue<Buffer>;
        node(scriptPath: string, arguments?: readonly string[], options?: execa.NodeOptions): execa.ExecaChildProcess;
        node(scriptPath: string, arguments?: readonly string[], options?: execa.Options<null>): execa.ExecaChildProcess<Buffer>;
        node(scriptPath: string, options?: execa.Options): execa.ExecaChildProcess;
        node(scriptPath: string, options?: execa.Options<null>): execa.ExecaChildProcess<Buffer>;
    };
};
/**
 * Iterate over each API directory, and use the `compodoc` tool to generate
 * reference API documentation in the `docs` folder. This folder is ignored
 * in git, so a publish must be done with `npm run publish-docs`.
 *
 * To use this, run `npm run generate-docs`.
 */
export declare function main(): Promise<void>;
