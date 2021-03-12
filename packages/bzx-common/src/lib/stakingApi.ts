import IRep from 'bzx-common/src/domain/staking/IRep'
import hashUtils from 'bzx-common/src/lib/hashUtils'

/**
 * @param {string} hash address or transaction id
 * @param {number} count
 */
function getShortHash(hash: string, count: number) {
  return hash.substring(0, 6) + '...' + hash.substring(hash.length - count)
}

/**
 * Get profile of multiple representatives
 * @param repsBaseInfoList
 */
async function getRepsInfo(repsBaseInfoList: IRep[]): Promise<IRep[]> {
  // TODO: track CORS issue https://github.com/3box/3box-js/issues/649
  const profiles = await (await fetch(
    'https://cors-anywhere.herokuapp.com/https://ipfs.3box.io/profileList',
    {
      body: JSON.stringify({ addressList: repsBaseInfoList.map((e) => e.wallet), didList: [] }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
  )).json()
  const repsList = repsBaseInfoList.map((repBaseInfo) => {
    repBaseInfo.name =
      profiles[repBaseInfo.wallet] && profiles[repBaseInfo.wallet].name
        ? profiles[repBaseInfo.wallet].name
        : getShortHash(repBaseInfo.wallet, 4)
    repBaseInfo.imageSrc =
      profiles[repBaseInfo.wallet] && profiles[repBaseInfo.wallet].image
        ? `https://ipfs.infura.io/ipfs/${profiles[repBaseInfo.wallet].image[0].contentUrl['/']}`
        : repBaseInfo.imageSrc
    return repBaseInfo
  })
  return repsList
}

/**
 * Get profile of a representative
 * @param rep
 */
async function getRepInfo(rep: IRep): Promise<IRep> {
  // Note: getProfile returns an empty object when profile does not exist
  const profile = await fetch(
    `https://cors-anywhere.herokuapp.com/https://ipfs.3box.io/profile?address=${rep.wallet}`
  ).then((resp) => resp.json())
  const name = profile.name || rep.name
  const imageSrc = profile.image
    ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
    : rep.imageSrc

  return { ...rep, name, imageSrc }
}

/**
 * Get profile of a representative
 * @param {string} address user's wallet address
 */
async function getUserFrom3Box(address: string): Promise<{address: string, name: string, imageSrc?: string}> {
  // Note: getProfile returns an empty object when profile does not exist
  const profile = await fetch(
    `https://cors-proxy.bzx.network/https://ipfs.3box.io/profile?address=${address}`
  ).then((resp) => resp.json()).catch(e => ({name: undefined, image: undefined}))
  const name = profile.name || hashUtils.shortHash(address)
  const imageSrc = profile.image
    ? `https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`
    : undefined

  return { address, name, imageSrc }
}

export default {
  getRepInfo,
  getRepsInfo,
  getUserFrom3Box
}
