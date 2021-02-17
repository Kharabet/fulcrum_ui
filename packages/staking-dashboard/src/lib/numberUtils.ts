import { BigNumber } from '@0x/utils'

const formatWithSeparator = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3
}

const formatNoSeparator = {
  decimalSeparator: '.',
  groupSeparator: ''
}

/**
 * @param {number} num number you want to format
 * @param {number} decimalPlaces 2 by default
 * @param {boolean} trim Default true. Remove trailing decimal zeros.
 */
export function format(num: number | BigNumber, decimalPlaces = 2, trim = true) {
  const numbr = num instanceof BigNumber ? num : new BigNumber(num)
  const displayFormat =
    numbr.lt(10000) && numbr.gt(-10000) ? formatNoSeparator : formatWithSeparator
  let bg = numbr.toFormat(decimalPlaces, BigNumber.ROUND_HALF_DOWN, displayFormat)
  if (trim && bg.includes('.')) {
    bg = bg.replace(/0+$/, '')
    if (bg.endsWith('.')) {
      bg = bg.replace('.', '')
    }
  }
  return bg
}

/**
 * Same as format price but adds a '+' sign if number is positive
 * @param {number} num
 * @param {boolean} trim remove trailing decimal zeros. true by default
 */
export function formatPriceWithSign(num: number | BigNumber, dp = 2, trim = true) {
  const numbr = num instanceof BigNumber ? num : new BigNumber(num)
  return numbr.gt(0) ? '+' + format(numbr, dp, trim) : format(numbr, dp, trim)
}

/**
 * If price is in [-1, 1] range, use most significant decimal numbers.
 *  We have to override decimalPlaces for .precision because it does not allow zero.
 *  In our price list, we could have mixed values and asking for decimal 0, which is nice for
 *  big numbers but then throws an exception for that range, this work-around avoids the exception.
 * For bigger ranges, use max 2 decimals by default
 * @param {Number} num
 * @param {Number} decimalPlaces
 */
function round(num: number | BigNumber | string, decimalPlaces = 2) {
  let numbr = num instanceof BigNumber ? num : new BigNumber(num)

  if (numbr.isLessThan(0.0001) && numbr.isGreaterThan(-0.0001)) {
    const numbrString = numbr.toString().match(/0\.0+[1-9]{1,3}/)
    if (numbrString) {
      return Number(numbrString[0])
    }
    return 0
  } else if (numbr.isLessThan(1) && numbr.isGreaterThan(-1)) {
    numbr = numbr.precision(decimalPlaces || 2) // precision can not be zero @see above
  } else if (numbr.isLessThan(100) && numbr.isGreaterThan(-100)) {
    numbr = numbr.decimalPlaces(2)
  } else if (numbr.isLessThan(1000) && numbr.isGreaterThan(-1000)) {
    numbr = numbr.decimalPlaces(1)
  } else {
    numbr = numbr.integerValue()
  }
  return numbr.toNumber()
}

/**
 * @param {number} num
 * @param {number} decimalPlaces default 2
 */
function roundWithSign(num: number | BigNumber | string, decimalPlaces = 2) {
  const numbr = num instanceof BigNumber ? num : new BigNumber(num)
  return numbr.gt(0) ? '+' + round(numbr, decimalPlaces) : round(numbr, decimalPlaces)
}

export default {
  format,
  formatPriceWithSign,
  round,
  roundWithSign
}
