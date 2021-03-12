import { BigNumber } from '@0x/utils'
import stakingUtils from './stakingUtils'

const userBalancesMock = {
  bzrx: new BigNumber(100),
  vbzrx: new BigNumber(100),
  ibzrx: new BigNumber(100),
  bpt: new BigNumber(100),
}

describe('stakingUtils', () => {
  describe('verifyStake()', () => {
    // These are some safeguards tests, they dont cover everything
    it('should return false if all amounts are 0', () => {
      const tokensToStake = {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(0),
        bpt: new BigNumber(0),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)
    })

    it('should return false if any amount is negative', () => {
      let tokensToStake = {
        bzrx: new BigNumber(-1),
        vbzrx: new BigNumber(0),
        bpt: new BigNumber(0),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)

      tokensToStake = {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(-1),
        bpt: new BigNumber(0),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)

      tokensToStake = {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(0),
        bpt: new BigNumber(-1),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)
    })

    it('should return false if any amount is bigger than user balance', () => {
      let tokensToStake = {
        bzrx: new BigNumber(101),
        vbzrx: new BigNumber(99),
        bpt: new BigNumber(99),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)

      tokensToStake = {
        bzrx: new BigNumber(99),
        vbzrx: new BigNumber(101),
        bpt: new BigNumber(99),
        ibzrx: new BigNumber(99),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)

      tokensToStake = {
        bzrx: new BigNumber(99),
        vbzrx: new BigNumber(99),
        bpt: new BigNumber(101),
        ibzrx: new BigNumber(99),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(false)
    })

    it('should return true if amounts are fine', () => {
      let tokensToStake = {
        bzrx: new BigNumber(100),
        vbzrx: new BigNumber(100),
        bpt: new BigNumber(100),
        ibzrx: new BigNumber(100),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(true)

      tokensToStake = {
        bzrx: new BigNumber(0),
        vbzrx: new BigNumber(0),
        bpt: new BigNumber(1),
        ibzrx: new BigNumber(0),
      }
      expect(stakingUtils.verifyStake(userBalancesMock, tokensToStake)).toBe(true)
    })
  })

  describe('isValidRepAddress', () => {
    it('should return false for the zero address', () => {
      const address = '0x0000000000000000000000000000000000000000'
      expect(stakingUtils.isValidRepAddress(address)).toBe(false)
    })

    it('should return false for invalid addresses', () => {
      expect(stakingUtils.isValidRepAddress('')).toBe(false)
      expect(stakingUtils.isValidRepAddress('0x12321')).toBe(false)
    })

    it('should return true for a valid address', () => {
      const address = '0x9B5dFE7965C4A30eAB764ff7abf81b3fa96847Fe'
      expect(stakingUtils.isValidRepAddress(address)).toBe(true)
    })
  })
})
