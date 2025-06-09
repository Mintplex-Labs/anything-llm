/**
 * The `node:sqlite` module facilitates working with SQLite databases.
 * To access it:
 *
 * ```js
 * import sqlite from 'node:sqlite';
 * ```
 *
 * This module is only available under the `node:` scheme. The following will not
 * work:
 *
 * ```js
 * import sqlite from 'sqlite';
 * ```
 *
 * The following example shows the basic usage of the `node:sqlite` module to open
 * an in-memory database, write data to the database, and then read the data back.
 *
 * ```js
 * import { DatabaseSync } from 'node:sqlite';
 * const database = new DatabaseSync(':memory:');
 *
 * // Execute SQL statements from strings.
 * database.exec(`
 *   CREATE TABLE data(
 *     key INTEGER PRIMARY KEY,
 *     value TEXT
 *   ) STRICT
 * `);
 * // Create a prepared statement to insert data into the database.
 * const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
 * // Execute the prepared statement with bound values.
 * insert.run(1, 'hello');
 * insert.run(2, 'world');
 * // Create a prepared statement to read data from the database.
 * const query = database.prepare('SELECT * FROM data ORDER BY key');
 * // Execute the prepared statement and log the result set.
 * console.log(query.all());
 * // Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
 * ```
 * @since v22.5.0
 * @experimental
 * @see [source](https://github.com/nodejs/node/blob/v22.x/lib/sqlite.js)
 */
declare module "node:sqlite" {
    type SQLInputValue = null | number | bigint | string | NodeJS.ArrayBufferView;
    type SQLOutputValue = null | number | bigint | string | Uint8Array;
    /** @deprecated Use `SQLInputValue` or `SQLOutputValue` instead. */
    type SupportedValueType = SQLOutputValue;
    interface DatabaseSyncOptions {
        /**
         * If `true`, the database is opened by the constructor. When
         * this value is `false`, the database must be opened via the `open()` method.
         * @since v22.5.0
         * @default true
         */
        open?: boolean | undefined;
        /**
         * If `true`, foreign key constraints
         * are enabled. This is recommended but can be disabled for compatibility with
         * legacy database schemas. The enforcement of foreign key constraints can be
         * enabled and disabled after opening the database using
         * [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma.html#pragma_foreign_keys).
         * @since v22.10.0
         * @default true
         */
        enableForeignKeyConstraints?: boolean | undefined;
        /**
         * If `true`, SQLite will accept
         * [double-quoted string literals](https://www.sqlite.org/quirks.html#dblquote).
         * This is not recommended but can be
         * enabled for compatibility with legacy database schemas.
         * @since v22.10.0
         * @default false
         */
        enableDoubleQuotedStringLiterals?: boolean | undefined;
        /**
         * If `true`, the database is opened in read-only mode.
         * If the database does not exist, opening it will fail.
         * @since v22.12.0
         * @default false
         */
        readOnly?: boolean | undefined;
        /**
         * If `true`, the `loadExtension` SQL function
         * and the `loadExtension()` method are enabled.
         * You can call `enableLoadExtension(false)` later to disable this feature.
         * @since v22.13.0
         * @default false
         */
        allowExtension?: boolean | undefined;
    }
    interface CreateSessionOptions {
        /**
         * A specific table to track changes for. By default, changes to all tables are tracked.
         * @since v22.12.0
         */
        table?: string | undefined;
        /**
         * Name of the database to track. This is useful when multiple databases have been added using
         * [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach.html).
         * @since v22.12.0
         * @default 'main'
         */
        db?: string | undefined;
    }
    interface ApplyChangesetOptions {
        /**
         * Skip changes that, when targeted table name is supplied to this function, return a truthy value.
         * By default, all changes are attempted.
         * @since v22.12.0
         */
        filter?: ((tableName: string) => boolean) | undefined;
        /**
         * A function that determines how to handle conflicts. The function receives one argument,
         * which can be one of the following values:
         *
         * * `SQLITE_CHANGESET_DATA`: A `DELETE` or `UPDATE` change does not contain the expected "before" values.
         * * `SQLITE_CHANGESET_NOTFOUND`: A row matching the primary key of the `DELETE` or `UPDATE` change does not exist.
         * * `SQLITE_CHANGESET_CONFLICT`: An `INSERT` change results in a duplicate primary key.
         * * `SQLITE_CHANGESET_FOREIGN_KEY`: Applying a change would result in a foreign key violation.
         * * `SQLITE_CHANGESET_CONSTRAINT`: Applying a change results in a `UNIQUE`, `CHECK`, or `NOT NULL` constraint
         * violation.
         *
         * The function should return one of the following values:
         *
         * * `SQLITE_CHANGESET_OMIT`: Omit conflicting changes.
         * * `SQLITE_CHANGESET_REPLACE`: Replace existing values with conflicting changes (only valid with
             `SQLITE_CHANGESET_DATA` or `SQLITE_CHANGESET_CONFLICT` conflicts).
         * * `SQLITE_CHANGESET_ABORT`: Abort on conflict and roll back the database.
         *
         * When an error is thrown in the conflict handler or when any other value is returned from the handler,
         * applying the changeset is aborted and the database is rolled back.
         *
         * **Default**: A function that returns `SQLITE_CHANGESET_ABORT`.
         * @since v22.12.0
         */
        onConflict?: ((conflictType: number) => number) | undefined;
    }
    interface FunctionOptions {
        /**
         * If `true`, the [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic.html) flag is
         * set on the created function.
         * @default false
         */
        deterministic?: boolean | undefined;
        /**
         * If `true`, the [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_directonly.html) flag is set on
         * the created function.
         * @default false
         */
        directOnly?: boolean | undefined;
        /**
         * If `true`, integer arguments to `function`
         * are converted to `BigInt`s. If `false`, integer arguments are passed as
         * JavaScript numbers.
         * @default false
         */
        useBigIntArguments?: boolean | undefined;
        /**
         * If `true`, `function` may be invoked with any number of
         * arguments (between zero and
         * [`SQLITE_MAX_FUNCTION_ARG`](https://www.sqlite.org/limits.html#max_function_arg)). If `false`,
         * `function` must be invoked with exactly `function.length` arguments.
         * @default false
         */
        varargs?: boolean | undefined;
    }
    /**
     * This class represents a single [connection](https://www.sqlite.org/c3ref/sqlite3.html) to a SQLite database. All APIs
     * exposed by this class execute synchronously.
     * @since v22.5.0
     */
    class DatabaseSync implements Disposable {
        /**
         * Constructs a new `DatabaseSync` instance.
         * @param path The path of the database.
         * A SQLite database can be stored in a file or completely [in memory](https://www.sqlite.org/inmemorydb.html).
         * To use a file-backed database, the path should be a file path.
         * To use an in-memory database, the path should be the special name `':memory:'`.
         * @param options Configuration options for the database connection.
         */
        constructor(path: string | Buffer | URL, options?: DatabaseSyncOptions);
        /**
         * Closes the database connection. An exception is thrown if the database is not
         * open. This method is a wrapper around [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close.html).
         * @since v22.5.0
         */
        close(): void;
        /**
         * Loads a shared library into the database connection. This method is a wrapper
         * around [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension.html). It is required to enable the
         * `allowExtension` option when constructing the `DatabaseSync` instance.
         * @since v22.13.0
         * @param path The path to the shared library to load.
         */
        loadExtension(path: string): void;
        /**
         * Enables or disables the `loadExtension` SQL function, and the `loadExtension()`
         * method. When `allowExtension` is `false` when constructing, you cannot enable
         * loading extensions for security reasons.
         * @since v22.13.0
         * @param allow Whether to allow loading extensions.
         */
        enableLoadExtension(allow: boolean): void;
        /**
         * This method allows one or more SQL statements to be executed without returning
         * any results. This method is useful when executing SQL statements read from a
         * file. This method is a wrapper around [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec.html).
         * @since v22.5.0
         * @param sql A SQL string to execute.
         */
        exec(sql: string): void;
        /**
         * This method is used to create SQLite user-defined functions. This method is a
         * wrapper around [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function.html).
         * @since v22.13.0
         * @param name The name of the SQLite function to create.
         * @param options Optional configuration settings for the function.
         * @param func The JavaScript function to call when the SQLite
         * function is invoked. The return value of this function should be a valid
         * SQLite data type: see
         * [Type conversion between JavaScript and SQLite](https://nodejs.org/docs/latest-v22.x/api/sqlite.html#type-conversion-between-javascript-and-sqlite).
         * The result defaults to `NULL` if the return value is `undefined`.
         */
        function(
            name: string,
            options: FunctionOptions,
            func: (...args: SQLOutputValue[]) => SQLInputValue,
        ): void;
        function(name: string, func: (...args: SQLOutputValue[]) => SQLInputValue): void;
        /**
         * Whether the database is currently open or not.
         * @since v22.15.0
         */
        readonly isOpen: boolean;
        /**
         * Opens the database specified in the `path` argument of the `DatabaseSync`constructor. This method should only be used when the database is not opened via
         * the constructor. An exception is thrown if the database is already open.
         * @since v22.5.0
         */
        open(): void;
        /**
         * Compiles a SQL statement into a [prepared statement](https://www.sqlite.org/c3ref/stmt.html). This method is a wrapper
         * around [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare.html).
         * @since v22.5.0
         * @param sql A SQL string to compile to a prepared statement.
         * @return The prepared statement.
         */
        prepare(sql: string): StatementSync;
        /**
         * Creates and attaches a session to the database. This method is a wrapper around
         * [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create.html) and
         * [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach.html).
         * @param options The configuration options for the session.
         * @returns A session handle.
         * @since v22.12.0
         */
        createSession(options?: CreateSessionOptions): Session;
        /**
         * An exception is thrown if the database is not
         * open. This method is a wrapper around
         * [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply.html).
         *
         * ```js
         * const sourceDb = new DatabaseSync(':memory:');
         * const targetDb = new DatabaseSync(':memory:');
         *
         * sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
         * targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
         *
         * const session = sourceDb.createSession();
         *
         * const insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
         * insert.run(1, 'hello');
         * insert.run(2, 'world');
         *
         * const changeset = session.changeset();
         * targetDb.applyChangeset(changeset);
         * // Now that the changeset has been applied, targetDb contains the same data as sourceDb.
         * ```
         * @param changeset A binary changeset or patchset.
         * @param options The configuration options for how the changes will be applied.
         * @returns Whether the changeset was applied successfully without being aborted.
         * @since v22.12.0
         */
        applyChangeset(changeset: Uint8Array, options?: ApplyChangesetOptions): boolean;
        /**
         * Closes the database connection. If the database connection is already closed
         * then this is a no-op.
         * @since v22.15.0
         * @experimental
         */
        [Symbol.dispose](): void;
    }
    /**
     * @since v22.12.0
     */
    interface Session {
        /**
         * Retrieves a changeset containing all changes since the changeset was created. Can be called multiple times.
         * An exception is thrown if the database or the session is not open. This method is a wrapper around
         * [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset.html).
         * @returns Binary changeset that can be applied to other databases.
         * @since v22.12.0
         */
        changeset(): Uint8Array;
        /**
         * Similar to the method above, but generates a more compact patchset. See
         * [Changesets and Patchsets](https://www.sqlite.org/sessionintro.html#changesets_and_patchsets)
         * in the documentation of SQLite. An exception is thrown if the database or the session is not open. This method is a
         * wrapper around
         * [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset.html).
         * @returns Binary patchset that can be applied to other databases.
         * @since v22.12.0
         */
        patchset(): Uint8Array;
        /**
         * Closes the session. An exception is thrown if the database or the session is not open. This method is a
         * wrapper around
         * [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete.html).
         */
        close(): void;
    }
    interface StatementResultingChanges {
        /**
         * The number of rows modified, inserted, or deleted by the most recently completed `INSERT`, `UPDATE`, or `DELETE` statement.
         * This field is either a number or a `BigInt` depending on the prepared statement's configuration.
         * This property is the result of [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes.html).
         */
        changes: number | bigint;
        /**
         * The most recently inserted rowid.
         * This field is either a number or a `BigInt` depending on the prepared statement's configuration.
         * This property is the result of [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid.html).
         */
        lastInsertRowid: number | bigint;
    }
    /**
     * This class represents a single [prepared statement](https://www.sqlite.org/c3ref/stmt.html). This class cannot be
     * instantiated via its constructor. Instead, instances are created via the`database.prepare()` method. All APIs exposed by this class execute
     * synchronously.
     *
     * A prepared statement is an efficient binary representation of the SQL used to
     * create it. Prepared statements are parameterizable, and can be invoked multiple
     * times with different bound values. Parameters also offer protection against [SQL injection](https://en.wikipedia.org/wiki/SQL_injection) attacks. For these reasons, prepared statements are
     * preferred
     * over hand-crafted SQL strings when handling user input.
     * @since v22.5.0
     */
    class StatementSync {
        private constructor();
        /**
         * This method executes a prepared statement and returns all results as an array of
         * objects. If the prepared statement does not return any results, this method
         * returns an empty array. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using
         * the values in `namedParameters` and `anonymousParameters`.
         * @since v22.5.0
         * @param namedParameters An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
         * @param anonymousParameters Zero or more values to bind to anonymous parameters.
         * @return An array of objects. Each object corresponds to a row returned by executing the prepared statement. The keys and values of each object correspond to the column names and values of
         * the row.
         */
        all(...anonymousParameters: SQLInputValue[]): Record<string, SQLOutputValue>[];
        all(
            namedParameters: Record<string, SQLInputValue>,
            ...anonymousParameters: SQLInputValue[]
        ): Record<string, SQLOutputValue>[];
        /**
         * The source SQL text of the prepared statement with parameter
         * placeholders replaced by the values that were used during the most recent
         * execution of this prepared statement. This property is a wrapper around
         * [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql.html).
         * @since v22.5.0
         */
        readonly expandedSQL: string;
        /**
         * This method executes a prepared statement and returns the first result as an
         * object. If the prepared statement does not return any results, this method
         * returns `undefined`. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using the
         * values in `namedParameters` and `anonymousParameters`.
         * @since v22.5.0
         * @param namedParameters An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
         * @param anonymousParameters Zero or more values to bind to anonymous parameters.
         * @return An object corresponding to the first row returned by executing the prepared statement. The keys and values of the object correspond to the column names and values of the row. If no
         * rows were returned from the database then this method returns `undefined`.
         */
        get(...anonymousParameters: SQLInputValue[]): Record<string, SQLOutputValue> | undefined;
        get(
            namedParameters: Record<string, SQLInputValue>,
            ...anonymousParameters: SQLInputValue[]
        ): Record<string, SQLOutputValue> | undefined;
        /**
         * This method executes a prepared statement and returns an iterator of
         * objects. If the prepared statement does not return any results, this method
         * returns an empty iterator. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using
         * the values in `namedParameters` and `anonymousParameters`.
         * @since v22.13.0
         * @param namedParameters An optional object used to bind named parameters.
         * The keys of this object are used to configure the mapping.
         * @param anonymousParameters Zero or more values to bind to anonymous parameters.
         * @returns An iterable iterator of objects. Each object corresponds to a row
         * returned by executing the prepared statement. The keys and values of each
         * object correspond to the column names and values of the row.
         */
        iterate(...anonymousParameters: SQLInputValue[]): NodeJS.Iterator<Record<string, SQLOutputValue>>;
        iterate(
            namedParameters: Record<string, SQLInputValue>,
            ...anonymousParameters: SQLInputValue[]
        ): NodeJS.Iterator<Record<string, SQLOutputValue>>;
        /**
         * This method executes a prepared statement and returns an object summarizing the
         * resulting changes. The prepared statement [parameters are bound](https://www.sqlite.org/c3ref/bind_blob.html) using the
         * values in `namedParameters` and `anonymousParameters`.
         * @since v22.5.0
         * @param namedParameters An optional object used to bind named parameters. The keys of this object are used to configure the mapping.
         * @param anonymousParameters Zero or more values to bind to anonymous parameters.
         */
        run(...anonymousParameters: SQLInputValue[]): StatementResultingChanges;
        run(
            namedParameters: Record<string, SQLInputValue>,
            ...anonymousParameters: SQLInputValue[]
        ): StatementResultingChanges;
        /**
         * The names of SQLite parameters begin with a prefix character. By default,`node:sqlite` requires that this prefix character is present when binding
         * parameters. However, with the exception of dollar sign character, these
         * prefix characters also require extra quoting when used in object keys.
         *
         * To improve ergonomics, this method can be used to also allow bare named
         * parameters, which do not require the prefix character in JavaScript code. There
         * are several caveats to be aware of when enabling bare named parameters:
         *
         * * The prefix character is still required in SQL.
         * * The prefix character is still allowed in JavaScript. In fact, prefixed names
         * will have slightly better binding performance.
         * * Using ambiguous named parameters, such as `$k` and `@k`, in the same prepared
         * statement will result in an exception as it cannot be determined how to bind
         * a bare name.
         * @since v22.5.0
         * @param enabled Enables or disables support for binding named parameters without the prefix character.
         */
        setAllowBareNamedParameters(enabled: boolean): void;
        /**
         * By default, if an unknown name is encountered while binding parameters, an
         * exception is thrown. This method allows unknown named parameters to be ignored.
         * @since v22.15.0
         * @param enabled Enables or disables support for unknown named parameters.
         */
        setAllowUnknownNamedParameters(enabled: boolean): void;
        /**
         * When reading from the database, SQLite `INTEGER`s are mapped to JavaScript
         * numbers by default. However, SQLite `INTEGER`s can store values larger than
         * JavaScript numbers are capable of representing. In such cases, this method can
         * be used to read `INTEGER` data using JavaScript `BigInt`s. This method has no
         * impact on database write operations where numbers and `BigInt`s are both
         * supported at all times.
         * @since v22.5.0
         * @param enabled Enables or disables the use of `BigInt`s when reading `INTEGER` fields from the database.
         */
        setReadBigInts(enabled: boolean): void;
        /**
         * The source SQL text of the prepared statement. This property is a
         * wrapper around [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql.html).
         * @since v22.5.0
         */
        readonly sourceSQL: string;
    }
    /**
     * @since v22.13.0
     */
    namespace constants {
        /**
         * The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is present in the database, but one or more other (non primary-key) fields modified by the update do not contain the expected "before" values.
         * @since v22.14.0
         */
        const SQLITE_CHANGESET_DATA: number;
        /**
         * The conflict handler is invoked with this constant when processing a DELETE or UPDATE change if a row with the required PRIMARY KEY fields is not present in the database.
         * @since v22.14.0
         */
        const SQLITE_CHANGESET_NOTFOUND: number;
        /**
         * This constant is passed to the conflict handler while processing an INSERT change if the operation would result in duplicate primary key values.
         * @since v22.14.0
         */
        const SQLITE_CHANGESET_CONFLICT: number;
        /**
         * If foreign key handling is enabled, and applying a changeset leaves the database in a state containing foreign key violations, the conflict handler is invoked with this constant exactly once before the changeset is committed. If the conflict handler returns `SQLITE_CHANGESET_OMIT`, the changes, including those that caused the foreign key constraint violation, are committed. Or, if it returns `SQLITE_CHANGESET_ABORT`, the changeset is rolled back.
         * @since v22.14.0
         */
        const SQLITE_CHANGESET_FOREIGN_KEY: number;
        /**
         * Conflicting changes are omitted.
         * @since v22.12.0
         */
        const SQLITE_CHANGESET_OMIT: number;
        /**
         * Conflicting changes replace existing values. Note that this value can only be returned when the type of conflict is either `SQLITE_CHANGESET_DATA` or `SQLITE_CHANGESET_CONFLICT`.
         * @since v22.12.0
         */
        const SQLITE_CHANGESET_REPLACE: number;
        /**
         * Abort when a change encounters a conflict and roll back database.
         * @since v22.12.0
         */
        const SQLITE_CHANGESET_ABORT: number;
    }
}
