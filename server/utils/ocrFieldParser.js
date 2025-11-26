/**
 * OCR Field Parser Utility
 *
 * Parses external OCR field arrays (from Google OCR or other providers)
 * and extracts structured OCR data for document enrichment.
 */

/**
 * Parse external OCR fields array and extract OCR text
 *
 * @param {Array} ocrFields - Array of OCR field objects with structure:
 *   {
 *     fieldKey: string,
 *     fieldValue: string,
 *     fieldType: string,
 *     confidence: number
 *   }
 * @returns {Object} - Structured OCR data:
 *   {
 *     google_raw: string,  // Combined text from all fields
 *     fields: Object,       // Structured fields by fieldKey
 *     rawFields: Array     // Original field array
 *   }
 */
function parseExternalOcrFields(ocrFields) {
  if (!Array.isArray(ocrFields) || ocrFields.length === 0) {
    return {
      google_raw: null,
      fields: {},
      rawFields: [],
    };
  }

  // Extract all field values and combine into raw text
  const fieldTexts = [];
  const fields = {};
  const fieldGroups = {};

  for (const field of ocrFields) {
    // Validate field structure
    if (
      !field ||
      typeof field !== "object" ||
      !field.fieldKey ||
      field.fieldValue === undefined
    ) {
      continue;
    }

    const { fieldKey, fieldValue, fieldType, confidence } = field;

    // Add to combined raw text
    if (fieldValue && typeof fieldValue === "string" && fieldValue.trim()) {
      fieldTexts.push(fieldValue.trim());
    }

    // Group fields by fieldKey (some keys may repeat)
    if (!fieldGroups[fieldKey]) {
      fieldGroups[fieldKey] = [];
    }
    fieldGroups[fieldKey].push({
      value: fieldValue,
      type: fieldType || "string",
      confidence: confidence || 0,
    });

    // Store in structured format (if multiple values, store as array)
    if (!fields[fieldKey]) {
      fields[fieldKey] = fieldGroups[fieldKey].length === 1
        ? fieldValue
        : fieldGroups[fieldKey].map((f) => f.value);
    } else if (Array.isArray(fields[fieldKey])) {
      fields[fieldKey].push(fieldValue);
    } else {
      // Convert to array if we have multiple values
      fields[fieldKey] = [fields[fieldKey], fieldValue];
    }
  }

  // Combine all field values into raw OCR text
  // Join with newlines to preserve structure
  const google_raw = fieldTexts.length > 0 ? fieldTexts.join("\n") : null;

  return {
    google_raw,
    fields,
    rawFields: ocrFields,
  };
}

/**
 * Build OCR object for document JSON from external OCR fields
 *
 * @param {Array|string} externalOcrFields - JSON array string or array of OCR fields
 * @param {Object} existingOcr - Existing OCR data to merge with (optional)
 * @returns {Object} - OCR object for document:
 *   {
 *     google_raw: string,
 *     anything_raw: string (if exists),
 *     user_corrected: string (if exists),
 *     fields: Object,
 *     rawFields: Array
 *   }
 */
function buildOcrFromExternalFields(externalOcrFields, existingOcr = {}) {
  // Parse if string
  let ocrFieldsArray = externalOcrFields;
  if (typeof externalOcrFields === "string") {
    try {
      ocrFieldsArray = JSON.parse(externalOcrFields);
    } catch (e) {
      console.warn(
        "[OCR Parser] Failed to parse externalOCRFields as JSON:",
        e.message
      );
      return existingOcr;
    }
  }

  // Parse the fields
  const parsed = parseExternalOcrFields(ocrFieldsArray);

  // Merge with existing OCR data
  return {
    ...existingOcr,
    google_raw: parsed.google_raw || existingOcr.google_raw || null,
    // Preserve existing fields
    anything_raw: existingOcr.anything_raw || null,
    user_corrected: existingOcr.user_corrected || null,
    // Add structured fields
    fields: parsed.fields,
    rawFields: parsed.rawFields,
  };
}

module.exports = {
  parseExternalOcrFields,
  buildOcrFromExternalFields,
};

