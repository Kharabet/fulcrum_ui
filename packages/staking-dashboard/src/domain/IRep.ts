import { BigNumber } from "@0x/utils";

export interface IRep {
    index: number,
    wallet: string,
    BZRX: BigNumber,
    vBZRX: BigNumber,
    LPToken: BigNumber,
    name: string,
    imageSrc: string,
    isActive: boolean
}
