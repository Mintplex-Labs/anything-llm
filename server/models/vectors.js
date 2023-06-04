const { Document } = require('./documents');

// TODO: Do we want to store entire vectorized chunks in here
// so that we can easily spin up temp-namespace clones for threading
//
const DocumentVectors = {
  tablename: 'document_vectors',
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  docId TEXT NOT NULL,
  vectorId TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  db: async function () {
    const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');

    const db = await open({
      filename: 'anythingllm.db',
      driver: sqlite3.Database
    })

    await db.exec(`CREATE TABLE IF NOT EXISTS ${this.tablename} (${this.colsInit})`);
    db.on('trace', (sql) => console.log(sql))
    return db
  },
  bulkInsert: async function (vectorRecords = []) {
    if (vectorRecords.length === 0) return;
    const db = await this.db();
    const stmt = await db.prepare(`INSERT INTO ${this.tablename} (docId, vectorId) VALUES (?, ?)`);
    for (const record of vectorRecords) {
      const { docId, vectorId } = record
      stmt.run([docId, vectorId])
    }

    stmt.finalize()
    db.close()
    return { documentsInserted: vectorRecords.length };
  },
  deleteForWorkspace: async function (workspaceId) {
    const documents = await Document.forWorkspace(workspaceId);
    const docIds = [...(new Set(documents.map((doc) => doc.docId)))];
    const ids = (await this.where(`docId IN (${docIds.map((id) => `'${id}'`).join(',')})`)).map((doc) => doc.id)
    await this.deleteIds(ids)
    return true;
  },
  where: async function (clause = '', limit = null) {
    const db = await this.db()
    const results = await db.all(`SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ''} ${!!limit ? `LIMIT ${limit}` : ''}`)

    db.close()
    return results
  },
  deleteIds: async function (ids = []) {
    const db = await this.db()
    await db.get(`DELETE FROM ${this.tablename} WHERE id IN (${ids.join(', ')}) `)
    db.close()
    return true
  }
}

module.exports = { DocumentVectors }