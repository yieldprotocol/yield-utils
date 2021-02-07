/// <reference types="node" />
import { BigNumberish } from 'ethers';
export declare const privateKey0: Buffer;
export declare const privateKey1: Buffer;
export declare const signPacked: (digest: any, privateKey: any) => string;
export declare const sign: (digest: any, privateKey: any) => import("ethereumjs-util").ECDSASignature;
export declare const SIGNATURE_TYPEHASH: string;
export declare const PERMIT_TYPEHASH: string;
export declare const DAI_TYPEHASH = "0xea2aa0a1be11a07ed86d755c93467f4f82362b452371d1ba94d1715123511acb";
export declare const CHAI_SEPARATOR = "0x0b50407de9fa158c2cba01a99633329490dfd22989a150c20e8c7b4c1fb0fcc3";
export declare function getSignatureDigest(name: string, address: string, chainId: number, signature: {
    user: string;
    delegate: string;
}, signatureCount: BigNumberish, deadline: BigNumberish): string;
export declare function getPermitDigest(name: string, address: string, version: string, chainId: number, approve: {
    owner: string;
    spender: string;
    value: BigNumberish;
}, nonce: BigNumberish, deadline: BigNumberish): string;
export declare function getDaiDigest(name: string, address: string, chainId: number, approve: {
    owner: string;
    spender: string;
    can: boolean;
}, nonce: BigNumberish, deadline: BigNumberish): string;
export declare function getDomainSeparator(name: string, contractAddress: string, version: string, chainId: number): string;
export declare function getChaiDigest(approve: {
    owner: string;
    spender: string;
    can: boolean;
}, nonce: BigNumberish, deadline: BigNumberish): string;
