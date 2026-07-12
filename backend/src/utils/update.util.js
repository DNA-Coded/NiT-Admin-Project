/**
 * Safely prepares an update payload for Mongoose documents by filtering out
 * properties whose value is strictly undefined.
 * 
 * Preserves null values (which may intentionally clear a field).
 * Preserves false, 0, and empty strings.
 * 
 * @param {Object} data - The raw data payload (e.g., from req.body)
 * @param {Array<string>} [allowedFields] - Optional list of fields to extract. If omitted, all defined keys in data are extracted.
 * @returns {Object} A clean object ready to be passed into document.set()
 */
export const buildUpdatePayload = (data, allowedFields = null) => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const updates = {};
  const fieldsToProcess = allowedFields && Array.isArray(allowedFields) 
    ? allowedFields 
    : Object.keys(data);

  for (const field of fieldsToProcess) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  return updates;
};
