/**
 * A service that provides an AI client to create a completion.
 */

class Provider {
  _client;
  constructor(client) {
    if (this.constructor == Provider) {
      throw new Error("Class is of abstract type and can't be instantiated");
    }
    this._client = client;
  }

  get client() {
    return this._client;
  }
}

module.exports = Provider;
