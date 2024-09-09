const axios = require('axios');
const { SystemSettings } = require("../../models/systemSettings");

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
      const responseGroup = await axios.get('https://graph.microsoft.com//v1.0/me/memberOf', {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
      });
      const settings = await SystemSettings.currentSettings();
      const allowedGroups = settings.AzureADGroups;
      let isUserInAllowedGroup = false;
      for (const group of responseGroup.data.value) {
        if (allowedGroups.includes(group.id)) {
          isUserInAllowedGroup = true;
          break;
        }
      }

      if (isUserInAllowedGroup) {
        console.log("SUCCESSFUL GROUP VALIDATION ", "User in allowed group");
        return { username: response.data.mail, error: null };
      } else {
        console.error("FAILED GROUP VALIDATION ", "User not in allowed group");
        return { username: response.data.mail, error: "User not in allowed group" };
      }
    } catch (error) {
        return {username: null, error: error.response ? error.response.data : error.message};
    }
  }
}

module.exports.AzureAuthProviders = AzureAuthProviders;