import { addressUtils, BigNumber } from '@0x/utils'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

/**
 * Checks if the amounts to be staked are valid.
 * @param userBalances The balances of unstaked tokens in user wallet
 * @param tokensToStake The amount of tokens to be staked
 */
function verifyStake(
  userBalances: { bzrx: BigNumber; vbzrx: BigNumber; ibzrx: BigNumber; bpt: BigNumber },
  tokensToStake: { bzrx: BigNumber; vbzrx: BigNumber; ibzrx: BigNumber; bpt: BigNumber }
) {
  const { bzrx, vbzrx, ibzrx, bpt } = tokensToStake

  // All zeros
  if (bzrx.eq(0) && vbzrx.eq(0) && ibzrx.eq(0) && bpt.eq(0)) {
    return false
  }
  // Some negative
  if (bzrx.isNegative() || vbzrx.isNegative() || ibzrx.isNegative() || bpt.isNegative()) {
    return false
  }
  // Some bigger than total balance
  if (
    bzrx.gt(userBalances.bzrx) ||
    vbzrx.gt(userBalances.vbzrx) ||
    ibzrx.gt(userBalances.ibzrx) ||
    bpt.gt(userBalances.bpt)
  ) {
    return false
  }
  return true
}

/**
 * A rep address is a valid ethereum address and can not be a zero address (0x000..)
 * @param address Address to check
 */
function isValidRepAddress(address: string) {
  return addressUtils.isAddress(address) && address !== ZERO_ADDRESS
}

export default {
  verifyStake,
  isValidRepAddress,
}
