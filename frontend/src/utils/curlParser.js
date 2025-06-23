/**
 * Parse a cURL command and convert it to an API call configuration object
 * @param {string} curlCommand - The cURL command to parse
 * @returns {Object} Parsed configuration object
 */
export function parseCurlCommand(curlCommand) {
  if (!curlCommand || typeof curlCommand !== "string") {
    throw new Error("Invalid cURL command provided");
  }

  // Remove leading/trailing whitespace and normalize
  const command = curlCommand.trim();

  // Basic validation - should start with curl
  if (!command.toLowerCase().startsWith("curl")) {
    throw new Error('Command must start with "curl"');
  }

  const config = {
    url: "",
    method: "GET",
    headers: [],
    body: "",
    bodyType: "json",
    formData: [],
  };

  // Split the command into parts, handling quoted strings and line continuations
  const parts = parseCommandParts(command);

  // Remove 'curl'
  const args = parts.slice(1);

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case "-X":
      case "--request":
        if (nextArg) {
          config.method = nextArg.toUpperCase();
          i += 2;
        } else {
          throw new Error("Missing method after -X/--request");
        }
        break;

      case "-H":
      case "--header":
        if (nextArg) {
          const headerMatch = nextArg.match(/^([^:]+):\s*(.+)$/);
          if (headerMatch) {
            config.headers.push({
              key: headerMatch[1].trim(),
              value: headerMatch[2].trim(),
            });
          }
          i += 2;
        } else {
          throw new Error("Missing header value after -H/--header");
        }
        break;

      case "-d":
      case "--data":
      case "--data-raw":
        if (nextArg) {
          config.body = nextArg;
          if (config.method === "GET") {
            config.method = "POST";
          }
          i += 2;
        } else {
          throw new Error("Missing data value after -d/--data");
        }
        break;

      case "--data-urlencode":
        if (nextArg) {
          config.body = nextArg;
          if (config.method === "GET") {
            config.method = "POST";
          }
          i += 2;
        } else {
          throw new Error("Missing data value after --data-urlencode");
        }
        break;

      case "--form":
      case "-F":
        if (nextArg) {
          const formMatch = nextArg.match(/^([^=]+)=(.*)$/);
          if (formMatch) {
            config.formData.push({
              key: formMatch[1].trim(),
              value: formMatch[2].trim(),
            });
          }
          if (config.method === "GET") {
            config.method = "POST";
          }
          config.bodyType = "form";
          i += 2;
        } else {
          throw new Error("Missing form data after --form/-F");
        }
        break;

      case "--json":
        if (nextArg) {
          config.body = nextArg;
          config.bodyType = "json";
          if (config.method === "GET") {
            config.method = "POST";
          }
          i += 2;
        } else {
          throw new Error("Missing JSON data after --json");
        }
        break;

      case "--url":
        if (nextArg) {
          config.url = nextArg;
          i += 2;
        } else {
          throw new Error("Missing URL after --url");
        }
        break;

      case "-k":
      case "--insecure":
      case "-v":
      case "--verbose":
      case "-s":
      case "--silent":
      case "--compressed":
      case "--location":
      case "--max-time":
      case "--connect-timeout":
        // Skip these options as they're not relevant for API configuration
        i++;
        break;

      default:
        // If it's not a recognized option, it might be the URL
        if (!config.url && !arg.startsWith("-")) {
          config.url = arg;
        }
        i++;
        break;
    }
  }

  // Validate that we have a URL
  if (!config.url) {
    throw new Error("No URL found in cURL command");
  }

  // Clean up the URL (remove quotes if present)
  config.url = config.url.replace(/^["']|["']$/g, "");

  // Try to parse JSON body if it looks like JSON
  if (config.body && config.bodyType === "json") {
    try {
      const parsed = JSON.parse(config.body);
      config.body = JSON.stringify(parsed, null, 2);
    } catch (e) {
      // If it's not valid JSON, keep it as text
      config.bodyType = "text";
    }
  }

  return config;
}

/**
 * Parse command parts while respecting quoted strings and line continuations
 * @param {string} command - The command string to parse
 * @returns {string[]} Array of command parts
 */
function parseCommandParts(command) {
  // First, handle line continuations by removing backslashes and joining lines
  const normalizedCommand = command
    .replace(/\\\s*\n\s*/g, " ") // Replace backslash + newline + whitespace with space
    .replace(/\\\s*\r?\n\s*/g, " ") // Also handle \r\n line endings
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .trim();

  const parts = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";
  let i = 0;

  while (i < normalizedCommand.length) {
    const char = normalizedCommand[i];

    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
      i++;
      continue;
    }

    if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = "";
      i++;
      continue;
    }

    if (char === " " && !inQuotes) {
      if (current.trim()) {
        parts.push(current.trim());
        current = "";
      }
    } else {
      current += char;
    }

    i++;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

/**
 * Validate if a string looks like a cURL command
 * @param {string} command - The command to validate
 * @returns {boolean} True if it looks like a cURL command
 */
export function isValidCurlCommand(command) {
  if (!command || typeof command !== "string") return false;

  const trimmed = command.trim();
  return trimmed.toLowerCase().startsWith("curl");
}
