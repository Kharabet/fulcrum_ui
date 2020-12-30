import regexUtils from './regexUtils'
const { regexFromStrings } = regexUtils

describe('regexUtils', () => {
  describe('regexFromStrings', () => {
    const wordList = ['example.com', 'mydomain.net', 'specialChars-[]/{}()*+?.\\^$|']
    let regex: RegExp

    beforeEach(() => {
      regex = regexFromStrings(wordList)
    })

    it('should create a regex from the strings', () => {
      expect(regex).toBeInstanceOf(RegExp)
    })

    it('should create a regex that matches all strings individually', () => {
      wordList.forEach((word) => expect(regex.test(word)).toBe(true))
    })

    it('should create a regex that ignores white spaces and case', () => {
      expect(regex.test('  MyDomain.net    ')).toBe(true)
    })
  })

  describe('getWordListCheck', () => {
    let wordList: string[] = []

    beforeEach(() => {
      wordList = ['example.com', 'mydomain.net', 'specialChars-[]/{}()*+?.\\^$|']
    })

    it('should return a function that checks if a word is present in a list', () => {
      const checkFilter = regexUtils.getWordListCheck(wordList)
      expect(checkFilter('example.com')).toBe(true)
      expect(checkFilter('notInlist')).toBe(false)
    })
  })
})
