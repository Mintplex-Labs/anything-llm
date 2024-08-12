class AzureAuthProviders {
  constructor() {}
  async login({ accessToken }) {
    console.log(accessToken);
    return { username: accessToken };
  }
}

module.exports.AzureAuthProviders = AzureAuthProviders;