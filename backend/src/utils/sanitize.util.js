/**
 * Utility functions for sanitizing user input
 */

/**
 * Escapes special characters in a string for use in a regular expression.
 * Prevents regex injection attacks.
 * 
 * @param {string} string - The string to escape
 * @returns {string} - Escaped string safe for new RegExp()
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
