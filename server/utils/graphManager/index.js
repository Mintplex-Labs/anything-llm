const Level = require('level');
const levelgraph = require('levelgraph');
const fs = require('fs');
const path = require('path');

const knowledgeGraphFolder = `${!!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "./storage/"
  }knowledge-graphs`

class GraphManager {
  constructor({ filename = null, reset = false }) {
    if (!filename) throw new Error('Cannot create graph for empty filename');
    if (!fs.existsSync(knowledgeGraphFolder)) fs.mkdirSync(knowledgeGraphFolder)

    const filepath = path.join(knowledgeGraphFolder, filename);
    if (reset) this.resetDB(filepath);

    this.leveldb = new Level(filepath)
    this.db = levelgraph(this.leveldb);
  }

  resetDB(filepath) {
    console.log(`Knowledge Graph at ${filepath} was reset.`);
    fs.rmSync(filepath, { recursive: true, force: true })
  }

  async put(_args, additionalData = {}) {
    const args = Array.isArray(_args) ? _args.map((d) => ({ ...d, ...additionalData })) : { ...args, ...additionalData }
    return new Promise((resolve, reject) => {
      this.db.put(args, function (err) {
        if (!!err) {
          reject(err)
          return;
        }

        console.log(`Successful async put of ${!args?.length ? 'a triplet.' : `${args?.length} triplets.`}`)
        resolve(true)
      })
    })
  }

  async query(triplets, { limit = null }) {
    const queries = [];

    for (const triplet of triplets) {
      queries.push(() => {
        return new Promise((resolve, reject) => {
          this.db.get({ ...triplet, limit }, function (err, list) {
            if (!!err) {
              reject(err)
              return;
            }
            resolve(list)
          })
        })
      })
    }

    const data = await Promise.all(queries.map((f) => f())).then((res) => res.flat());
    this.db.close();
    return data;
  }

  async delete(args) {
    return new Promise((resolve, reject) => {
      this.db.del(args, function (err, results) {
        if (!!err) {
          reject(err)
          return;
        }

        console.log(`Successful async delete of `, args)
        resolve(true)
      })
    })
  }
}

module.exports.GraphManager = GraphManager;