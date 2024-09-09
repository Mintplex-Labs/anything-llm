const axios = require('axios');

class AzureAuthProviders {
  constructor() {}
  async login({ accessToken }) {
    try {
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
      });
      console.log('response:', response.data);
      const responseGroup = await axios.get('https://graph.microsoft.com//v1.0/me/memberOf', {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
      });
      console.log('response:', responseGroup.data);
      return {username: response.data.mail};
    } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
        throw error;
    }
  }
}

module.exports.AzureAuthProviders = AzureAuthProviders;