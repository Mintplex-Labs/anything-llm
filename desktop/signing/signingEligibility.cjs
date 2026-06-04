"use strict";

const { validateSigningEnvironment } = require("./signingEnvironment.cjs");

function assessSigningEligibility(options = {}) {
  const environment = validateSigningEnvironment(options);
  return {
    ...environment,
    eligibleForFutureSigning:
      environment.certificateAvailable &&
      environment.reason === "certificate_available_signing_not_performed",
  };
}

module.exports = {
  assessSigningEligibility,
};
