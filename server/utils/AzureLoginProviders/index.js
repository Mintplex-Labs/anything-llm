class AzureLoginProvider {
  constructor() {}
  async login({ accessToken }) {
    console.log(accessToken);
    return { username: accessToken };
  }
}

module.exports.AzureLoginProvider = AzureLoginProvider;