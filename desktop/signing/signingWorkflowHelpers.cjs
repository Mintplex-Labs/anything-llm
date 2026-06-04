"use strict";

const { assessSigningEligibility } = require("./signingEligibility.cjs");
const { SIGNING_STATUSES } = require("./signingConfigSchema.cjs");

function resolveSigningStatus({ env = process.env, fsImpl, signed = false } = {}) {
  if (signed) {
    return {
      status: SIGNING_STATUSES.SIGNED,
      certificateAvailable: true,
      certificatePathConfigured: true,
      signToolConfigured: true,
      reason: "artifact_signed",
      safeDetails: ["Desktop artifacts were signed by an external signing step."],
    };
  }
  return assessSigningEligibility({ env, fsImpl });
}

function printSigningStatus(result, logger = console) {
  logger.log(`[desktop:signing] status=${result.status} reason=${result.reason}`);
  for (const detail of result.safeDetails || []) {
    logger.log(`[desktop:signing] ${detail}`);
  }
}

module.exports = {
  printSigningStatus,
  resolveSigningStatus,
};
