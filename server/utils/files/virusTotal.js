const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/**
 * VirusTotal API Scanner
 *
 * Scans uploaded files against VirusTotal's database before processing.
 * Supports hash-based lookups (fast) and file uploads for unknown files.
 *
 * Environment Variables:
 * - VIRUSTOTAL_API_KEY: Your VirusTotal API key (required to enable scanning)
 * - VIRUSTOTAL_FAIL_CLOSED: If "true", block uploads when scan fails (default: false)
 *
 * @see https://developers.virustotal.com/reference/overview
 */
class VirusTotalScanner {
  static VIRUSTOTAL_API_BASE = "https://www.virustotal.com/api/v3";

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY;
    this.enabled = !!this.apiKey;
    this.failClosed = process.env.VIRUSTOTAL_FAIL_CLOSED === "true";
  }

  /**
   * Check if VirusTotal scanning is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Calculate SHA256 hash of a file
   * @param {string} filePath - Absolute path to the file
   * @returns {Promise<string>} - Hexadecimal hash string
   */
  async getFileHash(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      const stream = fs.createReadStream(filePath);

      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
      stream.on("error", (err) => reject(err));
    });
  }

  /**
   * Query VirusTotal for an existing file report by hash
   * @param {string} hash - SHA256 hash of the file
   * @returns {Promise<Object|null>} - Report data or null if not found
   */
  async getReportByHash(hash) {
    const url = `${VirusTotalScanner.VIRUSTOTAL_API_BASE}/files/${hash}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apikey": this.apiKey,
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null; // File not in VirusTotal database
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `VirusTotal API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }

  /**
   * Upload a file to VirusTotal for scanning
   * @param {string} filePath - Absolute path to the file
   * @returns {Promise<Object>} - Upload response with analysis ID
   */
  async uploadFile(filePath) {
    const url = `${VirusTotalScanner.VIRUSTOTAL_API_BASE}/files`;
    const fileStream = fs.createReadStream(filePath);
    const fileName = path.basename(filePath);

    // Dynamically import form-data for multipart uploads
    const FormData = (await import("form-data")).default;
    const form = new FormData();
    form.append("file", fileStream, fileName);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-apikey": this.apiKey,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`VirusTotal upload failed (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Analyze scan results to determine if file is safe
   * @param {Object} report - VirusTotal report data
   * @returns {Object} - Analysis result with safety determination
   */
  analyzeReport(report) {
    const stats = report?.data?.attributes?.last_analysis_stats;

    if (!stats) {
      return {
        safe: true,
        reason: "No analysis stats available",
        stats: null,
      };
    }

    const { malicious = 0, suspicious = 0 } = stats;
    const isThreat = malicious > 0 || suspicious > 0;

    return {
      safe: !isThreat,
      reason: isThreat
        ? `Detected by ${malicious} malicious and ${suspicious} suspicious engines`
        : "No threats detected",
      stats: {
        malicious,
        suspicious,
        harmless: stats.harmless || 0,
        undetected: stats.undetected || 0,
      },
    };
  }

  /**
   * Main method: Scan a file for viruses/malware
   *
   * Flow:
   * 1. Calculate file hash
   * 2. Check if hash exists in VirusTotal database
   * 3. If found, analyze existing report
   * 4. If not found, upload for analysis (returns pending status)
   *
   * @param {string} filePath - Absolute path to the file to scan
   * @returns {Promise<Object>} - Scan result object
   */
  async scanFile(filePath) {
    // Skip if not enabled
    if (!this.enabled) {
      return {
        safe: true,
        scanned: false,
        reason: "VirusTotal scanning not configured (VIRUSTOTAL_API_KEY not set)",
      };
    }

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      return {
        safe: false,
        scanned: false,
        error: "File not found",
      };
    }

    try {
      // Step 1: Calculate file hash
      const hash = await this.getFileHash(filePath);

      // Step 2: Check for existing report
      const existingReport = await this.getReportByHash(hash);

      if (existingReport) {
        // Step 3a: Analyze existing report
        const analysis = this.analyzeReport(existingReport);
        return {
          ...analysis,
          scanned: true,
          hash,
          source: "virustotal_cache",
        };
      }

      // Step 3b: File not in database - upload for analysis
      const uploadResult = await this.uploadFile(filePath);

      return {
        safe: true, // Allow while pending (configurable behavior)
        scanned: true,
        hash,
        source: "virustotal_upload",
        pending: true,
        analysisId: uploadResult?.data?.id,
        reason: "File uploaded to VirusTotal for analysis (pending)",
      };
    } catch (error) {
      console.error("[VirusTotal] Scan error:", error.message);

      // Fail closed or open based on configuration
      return {
        safe: !this.failClosed,
        scanned: false,
        error: error.message,
        reason: this.failClosed
          ? "Scan failed - blocking upload (VIRUSTOTAL_FAIL_CLOSED=true)"
          : "Scan failed - allowing upload (VIRUSTOTAL_FAIL_CLOSED=false)",
      };
    }
  }
}

/**
 * Middleware factory: Create virus scan middleware for Express
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.deleteOnThreat - Delete file if threat detected (default: true)
 * @returns {Function} Express middleware function
 */
function createVirusScanMiddleware(options = {}) {
  const { deleteOnThreat = true } = options;

  return async function virusScanMiddleware(req, res, next) {
    // Skip if no file uploaded
    if (!req.file) {
      return next();
    }

    const scanner = new VirusTotalScanner();
    const result = await scanner.scanFile(req.file.path);

    // Attach scan result to request for downstream use
    req.virusScanResult = result;

    if (!result.safe) {
      // Delete the malicious file
      if (deleteOnThreat && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error("[VirusTotal] Failed to delete threat file:", deleteError.message);
        }
      }

      return res.status(400).json({
        success: false,
        error: "File upload rejected: security threat detected",
        details: {
          reason: result.reason,
          stats: result.stats,
        },
      });
    }

    next();
  };
}

module.exports = {
  VirusTotalScanner,
  createVirusScanMiddleware,
};
