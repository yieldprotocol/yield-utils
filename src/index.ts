import { BigNumber, BigNumberish } from "ethers"
import { keccak256, toUtf8Bytes, parseEther } from 'ethers/lib/utils'

// 10**18 precision
export const wad = (value: BigNumberish) => parseEther(value.toString())

// 10**27 precision
const rayExp = BigNumber.from(10).pow(27)
export const ray = (value: BigNumberish) => BigNumber.from(value).mul(rayExp)

// 10**45 precision
const radExp = BigNumber.from(10).pow(45)
export const rad = (value: BigNumberish) => BigNumber.from(value).mul(radExp)

export const id = (signature: string) => {
  return keccak256(toUtf8Bytes(signature)).slice(0, 10)
}
