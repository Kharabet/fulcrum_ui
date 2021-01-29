import hashUtils from './hashUtils'

const mockAddress = '0x3e486F1e4d411F68e3dd5f2FFcA3C9EF60A78cB2'

describe('hashUtils', () => {
  describe('shortHash()', () => {
    it('should shorten using 6 chars at the beginning and 4 at the end by default', () => {
      expect(hashUtils.shortHash(mockAddress)).toBe('0x3e48…8cB2')
    })

    it('should shorten using the beginning and end chars parameter', () => {
      expect(hashUtils.shortHash(mockAddress, 5, 5)).toBe('0x3e4…78cB2')
    })

    it('should shorten the empty string properly', () => {
      expect(hashUtils.shortHash('')).toBe('')
      expect(hashUtils.shortHash('', 5, 5)).toBe('')
    })

    it('should handle strings shorter than the char count parameters', () => {
      expect(hashUtils.shortHash('0x3e486F1', 10, 10)).toBe('0x3e486F1')
      expect(hashUtils.shortHash('0x3e486F1e4d411F68e', 10, 10)).toBe('0x3e486F1e')
    })
  })
})
