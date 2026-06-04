"use strict";

const fs = require("fs");
const path = require("path");
const {
  ALLOWED_CERTIFICATE_EXTENSIONS,
  DEFAULT_TIMESTAMP_URL,
  SIGNING_ENV,
  SIGNING_STATUSES,
  readBooleanFlag,
  sanitizePathForLog,
} = require("./signingConfigSchema.cjs");

function buildResult(overrides) {
  return {
    status: SIGNING_STATUSES.SIGNING_UNAVAILABLE,
    certificateAvailable: false,
    certificatePathConfigured: false,
    signToolConfigured: false,
    timestampUrl: DEFAULT_TIMESTAMP_URL,
    reason: "certificate_missing",
    safeDetails: [],
    ...overrides,
  };
}

function validateSigningEnvironment({ env = process.env, fsImpl = fs } = {}) {
  const enabledFlag = readBooleanFlag(env[SIGNING_ENV.ENABLED]);
  if (enabledFlag === false) {
    return buildResult({
      status: SIGNING_STATUSES.UNSIGNED,
      reason: "signing_disabled",
      safeDetails: ["Desktop signing is explicitly disabled."],
    });
  }

  const certPath = String(env[SIGNING_ENV.CERT_PATH] || "").trim();
  const signToolPath = String(env[SIGNING_ENV.SIGNTOOL_PATH] || "").trim();
  const timestampUrl =
    String(env[SIGNING_ENV.TIMESTAMP_URL] || "").trim() || DEFAULT_TIMESTAMP_URL;

  if (!certPath) {
    return buildResult({
      signToolConfigured: Boolean(signToolPath),
      timestampUrl,
      reason: "certificate_missing",
      safeDetails: ["No desktop signing certificate path is configured."],
    });
  }

  const extension = path.extname(certPath).toLowerCase();
  if (!ALLOWED_CERTIFICATE_EXTENSIONS.includes(extension)) {
    return buildResult({
      certificatePathConfigured: true,
      signToolConfigured: Boolean(signToolPath),
      timestampUrl,
      reason: "invalid_certificate_configuration",
      safeDetails: [
        `Configured certificate file ${sanitizePathForLog(
          certPath
        )} must use one of: ${ALLOWED_CERTIFICATE_EXTENSIONS.join(", ")}.`,
      ],
    });
  }

  if (!fsImpl.existsSync(certPath)) {
    return buildResult({
      certificatePathConfigured: true,
      signToolConfigured: Boolean(signToolPath),
      timestampUrl,
      reason: "certificate_missing",
      safeDetails: [
        `Configured certificate file ${sanitizePathForLog(certPath)} was not found.`,
      ],
    });
  }

  const stats = fsImpl.statSync(certPath);
  if (!stats.isFile() || stats.size <= 0) {
    return buildResult({
      certificatePathConfigured: true,
      signToolConfigured: Boolean(signToolPath),
      timestampUrl,
      reason: "invalid_certificate_configuration",
      safeDetails: [
        `Configured certificate file ${sanitizePathForLog(
          certPath
        )} is not a non-empty file.`,
      ],
    });
  }

  if (!String(env[SIGNING_ENV.CERT_PASSWORD] || "").trim()) {
    return buildResult({
      certificateAvailable: true,
      certificatePathConfigured: true,
      signToolConfigured: Boolean(signToolPath),
      timestampUrl,
      reason: "invalid_certificate_configuration",
      safeDetails: [
        "A certificate is present, but the certificate password environment variable is missing.",
      ],
    });
  }

  return buildResult({
    status: SIGNING_STATUSES.UNSIGNED,
    certificateAvailable: true,
    certificatePathConfigured: true,
    signToolConfigured: Boolean(signToolPath),
    timestampUrl,
    reason: "certificate_available_signing_not_performed",
    safeDetails: [
      "A certificate is configured, but this foundation does not perform production signing.",
    ],
  });
}

module.exports = {
  validateSigningEnvironment,
};
