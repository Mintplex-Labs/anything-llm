const { OAuth2Client } = require("google-auth-library");

class AzureLoginProviderAbstract {
  constructor() {
    if (this.constructor === AzureLoginProviderAbstract) {
      throw new Error("Cannot instantiate abstract class");
    }
  }
  async login(data) {
    throw new Error("Method 'login' must be implemented");
  }
}

class AzureLoginProvider extends AzureLoginProviderAbstract {
  constructor() {
    super();
    this.client = new OAuth2Client();
  }
  async login({ credential }) {
    const { email, name, picture, error } = await this._verify(credential);
    if (error) {
      throw new Error("Azure Login failed");
    }
    return { username: email };
  }

  async _verify(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID,
      });
      const userData = ticket.getPayload();
      return { ...userData, error: null };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports.AzureLoginProvider = AzureLoginProvider;