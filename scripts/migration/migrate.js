import sqlite3 from 'sqlite3';
import pkg from 'pg';
const { Pool } = pkg;

const sqliteDb = new sqlite3.Database('../../server/storage/anythingllm.db', (err) => {
	if (err) {
		console.error('Error opening SQLite database:', err.message);
		process.exit(1);
	}
});

const pgPool = new Pool({
	user: '',
	host: '',
	database: '',
	password: '',
	port: 5432,
});

const tables = [
	'workspaces',
	'users',
	'embed_configs',
	'embed_chats',
	'workspace_documents',
	'document_sync_queues',
	'document_sync_executions',
	'workspace_threads',
	'workspace_suggested_messages',
	'workspace_chats',
	'workspace_agent_invocations',
	'workspace_users',
	'api_keys',
	'invites',
	'system_settings',
	'recovery_codes',
	'password_reset_tokens',
	'document_vectors',
	'welcome_messages',
	'event_logs',
	'slash_command_presets',
	'cache_data',
];

(async () => {
	for (const table of tables) {
		const startTime = new Date();
		console.log(`Migrating ${table} started at ${startTime.toISOString()}...`);

		try {
			await migrateTable(table);
			const endTime = new Date();
			console.log(`Migrating ${table} ended at ${endTime.toISOString()}. Time taken: ${endTime - startTime} ms`);
		} catch (error) {
			console.error(error);
		}
	}

	sqliteDb.close();
	await pgPool.end();
})();


async function migrateTable(tableName) {
	return new Promise((resolve, reject) => {
		sqliteDb.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
			if (err) {
				reject(`Error querying SQLite table ${tableName}: ${err.message}`);
				return;
			}

			if (rows.length === 0) {
				resolve();
				return;
			}

			const columns = Object.keys(rows[0]);
			const colNames = columns.map(col => `"${col}"`).join(', ');

			const client = await pgPool.connect();
			try {
				await client.query('BEGIN');

				const batchSize = 1000;
				for (let i = 0; i < rows.length; i += batchSize) {
					const batch = rows.slice(i, i + batchSize);

					const values = batch.map(row =>
						columns.map(col => {
							const value = row[col];
							if (typeof value === 'number' && value > 10000000000) {
								return new Date(value).toISOString();
							}
							return value;
						})
					);

					const placeholders = values.map((_, index) =>
						`(${columns.map((_, colIndex) => `$${index * columns.length + colIndex + 1}`).join(', ')})`
					).join(', ');

					const queryText = `INSERT INTO "${tableName}" (${colNames}) VALUES ${placeholders}`;
					const flatValues = values.flat();

					await client.query(queryText, flatValues);
				}

				await client.query('COMMIT');
				resolve();
			} catch (error) {
				await client.query('ROLLBACK');
				reject(`Error migrating table ${tableName}: ${error.message}`);
			} finally {
				client.release();
			}
		});
	});
}
