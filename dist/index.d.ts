import { BigNumber, BigNumberish } from "ethers";
export declare const wad: (value: BigNumberish) => BigNumber;
export declare const ray: (value: BigNumberish) => BigNumber;
export declare const rad: (value: BigNumberish) => BigNumber;
export declare const id: (signature: string) => string;
export * as signatures from "./signatures";
