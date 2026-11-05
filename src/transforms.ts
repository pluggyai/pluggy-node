/**
 * Simple RegExp to detect a Date string value in the date time string format,
 * a simplified format based on ISO 8601, which is 24 characters long (YYYY-MM-DDTHH:mm:ss.sssZ).
 */
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

/**
 * Response fields that hold dates, such as `date`, `dueDate`, `createdAt` or `transactionDateTime`.
 * Any other field can hold free text, which must stay a string even if it looks like a date.
 */
const DATE_FIELD_REGEXP = /(^date|Date|Dates|DateTime|At)$/

function toDateIfValid(value: unknown): unknown {
  if (typeof value !== 'string' || !ISO_DATE_REGEXP.test(value)) {
    return value
  }
  const date = new Date(value)
  // `new Date` gives Invalid Date for month 13 and rolls February 30 over to March, which would
  // lose the original text. Only convert what reads back exactly the same.
  return !isNaN(date.getTime()) && date.toISOString() === value ? date : value
}

/**
 * Deserialize JSON string, using a custom reviver to transform ISO date strings in date fields to
 * Date instances.
 *
 * @param {string} jsonString
 * @returns {unknown} - parsed/deserialized JSON object
 */
export function deserializeJSONWithDates(jsonString: string): unknown {
  return JSON.parse(jsonString, (key, value) => {
    if (!DATE_FIELD_REGEXP.test(key)) {
      return value
    }
    return Array.isArray(value) ? value.map(toDateIfValid) : toDateIfValid(value)
  })
}
