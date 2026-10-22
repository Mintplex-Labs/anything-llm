const lancedb = require("@lancedb/lancedb");
const { LanceDb } = require("../lance");

/**
 * LanceDB Cloud works nearly the same as the on-device LanceDB so we can just extend the
 * LanceDb class and override where the vectors live - an object store bucket (s3://, gs://, az://),
 * a LanceDB Cloud database (db://) or a shared filesystem volume.
 */
class LanceDbCloud extends LanceDb {
  /** @type {import('@lancedb/lancedb').Connection|null} */
  static #connection = null;
  /** @type {string|null} */
  static #connectionKey = null;

  constructor() {
    super();
  }

  get name() {
    return "LanceDbCloud";
  }

  get uri() {
    return process.env.LANCEDB_CLOUD_URI?.trim() || null;
  }

  /** @returns {Promise<{client: import('@lancedb/lancedb').Connection}>} */
  async connect() {
    if (!this.uri)
      throw new Error("LanceDbCloud::LANCEDB_CLOUD_URI is not set.");

    const options = {};
    const apiKey = process.env.LANCEDB_CLOUD_API_KEY?.trim();
    const region = process.env.LANCEDB_CLOUD_REGION?.trim();
    if (apiKey) options.apiKey = apiKey;
    if (region) options.region = region;

    const connectionKey = JSON.stringify([this.uri, options]);
    if (
      !LanceDbCloud.#connection ||
      LanceDbCloud.#connectionKey !== connectionKey
    ) {
      LanceDbCloud.#connection =
        Object.keys(options).length > 0
          ? await lancedb.connect(this.uri, options)
          : await lancedb.connect(this.uri);
      LanceDbCloud.#connectionKey = connectionKey;
    }
    return { client: LanceDbCloud.#connection };
  }

  /**
   * The on-device provider resets by removing its LanceDB folder from disk, which is either
   * meaningless or destructive for an external store, so drop every table instead.
   */
  async reset() {
    const { client } = await this.connect();
    for (const tableName of await client.tableNames())
      await client.dropTable(tableName);
    LanceDbCloud.#connection = null;
    LanceDbCloud.#connectionKey = null;
    return { reset: true };
  }
}

module.exports.LanceDbCloud = LanceDbCloud;
