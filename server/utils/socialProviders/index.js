const { OAuth2Client } = require("google-auth-library");

class SocialProviderAbstract {
  constructor() {
    if (this.constructor === SocialProviderAbstract) {
      throw new Error("Cannot instantiate abstract class");
    }
  }
  async login(data) {
    throw new Error("Method 'login' must be implemented");
  }
}

class GoogleProvider extends SocialProviderAbstract {
  constructor() {
    super();
    this.client = new OAuth2Client();
  }
  async login({ credential }) {
    const { email, name, picture, error } = await this._verify(credential);
    if (error) {
      throw new Error("Google Sign-In failed");
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

const providers = {
  google: new GoogleProvider(),
  // Add here new providers
};

class SocialProvider {
  constructor(provider) {
    this.instance = providers[provider];
  }

  async login(data) {
    return await this.instance.login(data);
  }
}

module.exports.SocialProvider = SocialProvider;
