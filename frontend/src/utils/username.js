/**
 * Unix-style username validation utilities
 *
 * Requirements:
 * - 2-32 characters long
 * - Must start with a lowercase letter or underscore
 * - Can contain lowercase letters, digits, underscores, hyphens, and periods
 */

export const USERNAME_REGEX = /^[a-z_][a-z0-9._-]*$/;
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 32;

/**
 * HTML5 pattern attribute for username inputs (without ^ and $)
 */
export const USERNAME_PATTERN = "[a-z_][a-z0-9._-]*";

/**
 * Validates a username string
 * @param {string} username - The username to validate
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      valid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Username cannot be longer than ${USERNAME_MAX_LENGTH} characters`,
    };
  }

  if (!USERNAME_REGEX.test(username)) {
    return {
      valid: false,
      error:
        "Username must start with a lowercase letter or underscore, and only contain lowercase letters, numbers, underscores, hyphens, and periods",
    };
  }

  return { valid: true, error: null };
}

