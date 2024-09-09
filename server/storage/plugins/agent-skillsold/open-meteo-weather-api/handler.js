// handler.js
// NOT RECOMMENDED: We're using an external module here for demonstration purposes
// this would be a module we bundled with our custom agent skill and would be located in the same folder as our handler.js file
// Do not require modules outside of the plugin folder. It is recommended to use require within a function scope instead of the global scope.
// const _ExternalApiCaller = require('./external-api-caller.js');

module.exports.runtime = {
    handler: async function ({ latitude, longitude }) {
      const callerId = `${this.config.name}-v${this.config.version}`;
      try {
        this.introspect(
          `${callerId} called with lat:${latitude} long:${longitude}...`
        );
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
        );
        const data = await response.json();
        const averageTemperature = this._getAverage(data, "temperature_2m");
        const averageHumidity = this._getAverage(data, "relativehumidity_2m");
        const averageWindSpeed = this._getAverage(data, "windspeed_10m");
        return JSON.stringify({
          averageTemperature,
          averageHumidity,
          averageWindSpeed,
        });
      } catch (e) {
        this.introspect(
          `${callerId} failed to invoke with lat:${latitude} long:${longitude}. Reason: ${e.message}`
        );
        this.logger(
          `${callerId} failed to invoke with lat:${latitude} long:${longitude}`,
          e.message
        );
        return `The tool failed to run for some reason. Here is all we know ${e.message}`;
      }
    },
    // Helper function to get the average of an array of numbers!
    _getAverage(data, property) {
      return (
        data.hourly[property].reduce((a, b) => a + b, 0) /
        data.hourly[property].length
      );
    },

    // Recommended: Use this method to call external APIs or services
    // by requiring the module in the function scope and only if the code execution reaches that line
    // this is to prevent any unforseen issues with the global scope and module loading/unloading.
    // This file should be placed in the same folder as your handler.js file.
    _doExternalApiCall(myProp) {
      const _ScopedExternalCaller = require("./external-api-caller.js");
      return _ScopedExternalCaller.doSomething(myProp);
    },
  };