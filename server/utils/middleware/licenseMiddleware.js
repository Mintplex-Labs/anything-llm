const fs = require("fs/promises");
const path = require("path");
const dns = require("dns").promises;
const { URL } = require("url");

// License validation state
let licenseValid = null; // null = not checked, true = valid, false = invalid
let lastLicenseCheck = null;
let lastLicenseError = null;
let licenseCheckInProgress = false;
let licenseForever = false; // true if license has "forever: true" - no periodic checks needed

// Check license every 3 hours
const LICENSE_CHECK_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

// Decode paths and URLs from base64 at runtime
const MACHINE_ID_PATH = Buffer.from("L2hvc3QvZXRjL21hY2hpbmUtaWQ=", 'base64').toString('utf8');
const LICENSE_SERVER_URL = Buffer.from("aHR0cHM6Ly9hdXRvbWF0ZS5wcm96ZXNzaHViLmV1L3dlYmhvb2svdmFsaWRhdGUtbGljZW5zZQ==", 'base64').toString('utf8');

/**
 * Securely read the machine fingerprint from the mounted host file
 * Validates the exact path to prevent tampering
 */
async function readMachineFingerprint() {
  try {
    // Ensure we're reading from the exact expected path
    const resolvedPath = path.resolve(MACHINE_ID_PATH);
    if (resolvedPath !== MACHINE_ID_PATH) {
      throw new Error("Invalid machine-id path detected");
    }

    // Check if file exists and is readable
    await fs.access(MACHINE_ID_PATH, fs.constants.R_OK);

    // Read the machine ID
    const fingerprint = await fs.readFile(MACHINE_ID_PATH, "utf8");
    const cleanFingerprint = fingerprint.trim();

    // Validate fingerprint format (should be a UUID-like string)
    if (!cleanFingerprint || cleanFingerprint.length < 10) {
      throw new Error("Invalid machine fingerprint format");
    }

    return cleanFingerprint;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error("Machine fingerprint file not found at /host/etc/machine-id");
    } else if (error.code === "EACCES") {
      throw new Error("Cannot read machine fingerprint file - permission denied");
    }
    throw error;
  }
}

/**
 * Resolve hostname to IPv4 address to prefer IPv4 over IPv6
 */
async function resolveToIPv4(hostname) {
  try {
    const addresses = await dns.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      return addresses[0]; // Return first IPv4 address
    }
    throw new Error(`No IPv4 addresses found for ${hostname}`);
  } catch (error) {
    console.warn(`IPv4 resolution failed for ${hostname}, falling back to hostname:`, error.message);
    return hostname; // Fallback to original hostname
  }
}

/**
 * Validate license with the remote license server (preferring IPv4)
 */
async function validateLicense(licenseKey, fingerprint) {
  const requestBody = {
    key: licenseKey,
    fingerprint: fingerprint
  };

  try {
    // Parse the license server URL to extract hostname
    const urlObj = new URL(LICENSE_SERVER_URL);
    const hostname = urlObj.hostname;
    
    // Resolve hostname to IPv4 address
    const ipv4Address = await resolveToIPv4(hostname);
    
    // Construct URL with IPv4 address if resolution was successful
    let targetUrl = LICENSE_SERVER_URL;
    if (ipv4Address !== hostname) {
      // Replace hostname with IPv4 address
      targetUrl = LICENSE_SERVER_URL.replace(hostname, ipv4Address);
      console.log(`Using IPv4 address ${ipv4Address} for license validation`);
    }

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        ...JSON.parse(Buffer.from("ewogICAgICAgICJDb250ZW50LVR5cGUiOiAiYXBwbGljYXRpb24vanNvbiIsCiAgICAgICAgIlVzZXItQWdlbnQiOiAiUmFnLVBsYXRmb3JtLUxpY2Vuc2UtVmFsaWRhdG9yLzEuMCIsCiAgICAgICAgIlgtTGljZW5zZS1TZXJ2ZXItQXV0aCI6ICJBQlFaV0NRWVdYUDhXVUhFMTlNUkUzRVRRRFJVWjhIMUZEMzNOMjlVQUVTUDFSTUJQWFoyVjZPMElaOUU1TDBPSklIQzA1N0JZRlc3UkU4TzVDQUJUWTNGQklQNEZNRlVUVlMiCiAgICAgIH0=", 'base64').toString('utf8')),
        // Add Host header to ensure proper SSL certificate validation
        ...(ipv4Address !== hostname && { 'Host': hostname })
      },
      body: JSON.stringify(requestBody),
      timeout: 10000,
    });

    if (!response.ok) {
      throw new Error(`License server returned ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    // Validate response format
    if (!result || typeof result.status !== "string") {
      throw new Error("Invalid response format from license server");
    }

    return result;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error connecting to license server");
    }
    throw error;
  }
}

/**
 * Check if license validation is needed (every 3 hours)
 */
function shouldCheckLicense() {
  if (!lastLicenseCheck) return true;
  const now = Date.now();
  return (now - lastLicenseCheck) >= LICENSE_CHECK_INTERVAL;
}

/**
 * Perform license validation check
 */
async function performLicenseCheck() {
  if (licenseCheckInProgress) return;

  licenseCheckInProgress = true;

  try {
    console.log("Performing license validation...");

    // Validate environment
    const licenseKey = process.env.LICENSE_KEY;
    if (!licenseKey) {
      throw new Error("LICENSE_KEY environment variable is not set");
    }

    // Read machine fingerprint
    const fingerprint = await readMachineFingerprint();
    console.log(`Machine fingerprint: ${fingerprint.substring(0, 8)}...`);

    // Validate with license server
    const result = await validateLicense(licenseKey, fingerprint);

    // Update license state
    licenseValid = result.status === "ok";
    lastLicenseCheck = Date.now();
    lastLicenseError = result.message || null;

    // Check if this is a "forever" license (no periodic checks needed)
    licenseForever = result.forever === true;

    if (licenseValid) {
      if (licenseForever) {
        console.log("License validation successful - Forever license detected, no periodic checks needed");
      } else {
        console.log("License validation successful");
      }
    } else {
      console.error("License validation failed:", result.message || "Unknown error");
      lastLicenseError = result.message || "License validation failed";
    }

    return { success: true, valid: licenseValid, forever: licenseForever, message: result.message };

  } catch (error) {
    console.error("License validation error:", error.message);

    // For system errors (missing files, env vars), mark as invalid
    if (error.message.includes("LICENSE_KEY") ||
      error.message.includes("machine fingerprint") ||
      error.message.includes("Invalid machine")) {
      licenseValid = false;
      lastLicenseError = error.message;
    }
    // For network errors, maintain last known state but log warning
    else {
      console.warn("Network error during license check - maintaining last known state");
    }

    return { success: false, error: error.message };

  } finally {
    licenseCheckInProgress = false;
  }
}

/**
 * Express middleware for license validation
 */
async function licenseMiddleware(request, response, next) {
  request[Buffer.from("bGljZW5zZUNoZWNrTWlkZGxld2FyZQ==", 'base64').toString('utf8')] = true;
  try {
    // If license is known to be invalid, block immediately
    if (licenseValid === false) {
      return response.status(403).json({
        error: "License validation failed",
        message: lastLicenseError || "Invalid or expired license"
      });
    }

    // If this is the first request or (3 hours have passed AND not a forever license), check license
    if (licenseValid === null || (shouldCheckLicense() && !licenseForever)) {
      if (!licenseCheckInProgress) {
        // For first-time validation, wait for result
        if (licenseValid === null) {
          console.log("Performing initial license validation...");
          const result = await performLicenseCheck();

          if (!result.success || !licenseValid) {
            return response.status(licenseValid === false ? 403 : 500).json({
              error: licenseValid === false ? "License validation failed" : "License validation error",
              message: lastLicenseError || result.error || "Unable to validate license"
            });
          }
        } else if (!licenseForever) {
          // For periodic checks, do it in background (non-blocking) - only if not forever license
          performLicenseCheck().catch(error => {
            console.error("Background license check failed:", error.message);
          });
        }
      }
    }

    // If we reach here and license is valid or being checked, allow request
    if (licenseValid === true) {
      return next();
    }

    // Fallback for edge cases
    return response.status(500).json({
      error: "License validation error",
      message: "Unable to determine license status"
    });

  } catch (error) {
    console.error("License middleware error:", error.message);
    return response.status(500).json({
      error: "Internal server error",
      message: "License validation system error"
    });
  }
}

/**
 * Get current license status (for debugging/monitoring)
 */
function getLicenseStatus() {
  return {
    valid: licenseValid,
    forever: licenseForever,
    lastCheck: lastLicenseCheck ? new Date(lastLicenseCheck).toISOString() : null,
    nextCheck: licenseForever ? null : (lastLicenseCheck ? new Date(lastLicenseCheck + LICENSE_CHECK_INTERVAL).toISOString() : null),
    error: lastLicenseError,
    checkInProgress: licenseCheckInProgress
  };
}

module.exports = {
  licenseMiddleware,
  getLicenseStatus,
  performLicenseCheck
};
