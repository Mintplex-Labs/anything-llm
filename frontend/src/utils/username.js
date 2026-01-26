/**
 * Unix-style username validation utilities
 *
 * Requirements:
 * - 2-32 characters long
 * - Must start with a lowercase letter
 * - Can contain lowercase letters, digits, underscores, hyphens, @ signs, and periods
 */

export const USERNAME_REGEX = /^[a-z][a-z0-9._@-]*$/;
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 32;

/**
 * HTML5 pattern attribute for username inputs (without ^ and $)
 */
export const USERNAME_PATTERN = "[a-z][a-z0-9._@-]*";
