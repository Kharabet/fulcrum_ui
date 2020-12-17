/**
 * Escape characters that could cause trouble when string is converted in regular expression.
 */
function escapeString(str: string) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

/**
 * Create a regular expression from a list of strings.
 * This can be used for whitelisting.
 * The regex returned is not global. Methods like test() can be called multiple times.
 * @param strings eg: ['example.com', 'anotherdomain.com']
 * @returns A regular expression like /example\.com|anotherdomain\.com/mi
 */
function regexFromStrings (strings: string[]) {
  return new RegExp(strings.map(escapeString).join('|'), 'mi')
}

/**
 * Get a function that can check if a word is present in a particular list
 * Takes into account special characters and is case insensitive.
 * @param strings List of words
 */
function getWordListCheck (strings: string[]) {
  const regex = regexFromStrings(strings)
  return function checkWord (word: string) {
    return regex.test(word)
  }
}

export default {
  escapeString,
  regexFromStrings,
  getWordListCheck
}
