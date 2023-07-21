/**
 * Simple RegExp to detect a Date string value in the date time string format,
 * a simplified format based on ISO 8601, which is 24 characters long (YYYY-MM-DDTHH:mm:ss.sssZ).
 */
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

/**
 * Deserialize JSON string, using a custom reviver to transform all ISO date strings to Date instances.
 *
 * @param {string} jsonString
 * @returns {unknown} - parsed/deserialized JSON object
 */
export function deserializeJSONWithDates(jsonString: string): unknown {
  return JSON.parse(jsonString, (_key, value) => {
    if (typeof value === 'string' && ISO_DATE_REGEXP.test(value)) {
      return new Date(value)
    }
    return value
  })
}
