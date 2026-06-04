"use strict";

const path = require("path");

const SIGNING_STATUSES = Object.freeze({
  SIGNED: "signed",
  UNSIGNED: "unsigned",
  SIGNING_UNAVAILABLE: "signing_unavailable",
});

const SIGNING_ENV = Object.freeze({
  ENABLED: "SWARMSY_DESKTOP_SIGNING_ENABLED",
  CERT_PATH: "SWARMSY_DESKTOP_SIGNING_CERT_PATH",
  CERT_PASSWORD: "SWARMSY_DESKTOP_SIGNING_CERT_PASSWORD",
  SIGNTOOL_PATH: "SWARMSY_DESKTOP_SIGNTOOL_PATH",
  TIMESTAMP_URL: "SWARMSY_DESKTOP_SIGNING_TIMESTAMP_URL",
});

const ALLOWED_CERTIFICATE_EXTENSIONS = Object.freeze([".pfx", ".p12"]);
const DEFAULT_TIMESTAMP_URL = "http://timestamp.digicert.com";

const signingConfigSchema = Object.freeze({
  schemaVersion: 1,
  required: ["status", "certificateAvailable", "reason"],
  statuses: Object.values(SIGNING_STATUSES),
  environment: SIGNING_ENV,
  allowedCertificateExtensions: ALLOWED_CERTIFICATE_EXTENSIONS,
  secretEnvironmentVariables: [SIGNING_ENV.CERT_PASSWORD],
});

function readBooleanFlag(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }
  return String(value).trim().toLowerCase() === "true";
}

function sanitizePathForLog(value) {
  if (!value) return "";
  return path.basename(String(value));
}

module.exports = {
  ALLOWED_CERTIFICATE_EXTENSIONS,
  DEFAULT_TIMESTAMP_URL,
  SIGNING_ENV,
  SIGNING_STATUSES,
  readBooleanFlag,
  sanitizePathForLog,
  signingConfigSchema,
};
