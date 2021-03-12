/**
 * @param hash wallet / transaction hash
 * @param charsAtBeginning how many chars left at the beginning. default: 6
 * @param charsAtEnd how many chars left at the end. default: 4
 */
function shortHash(hash: string, charsAtBeginning: number = 6, charsAtEnd: number = 4) {
  if (hash === '') {
    return ''
  }
  let shortenedHash = hash.substring(0, charsAtBeginning)
  if (charsAtBeginning + charsAtEnd < hash.length) {
    shortenedHash = shortenedHash + '…' + hash.substring(hash.length - charsAtEnd)
  }
  return shortenedHash
}

export default {
  shortHash
}
