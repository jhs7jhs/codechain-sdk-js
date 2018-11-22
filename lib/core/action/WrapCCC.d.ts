/// <reference types="node" />
import { AssetTransferAddress, H160, H256, U64 } from "codechain-primitives";
import { Asset } from "../Asset";
export interface WrapCCCData {
    shardId: number;
    lockScriptHash: H160;
    parameters: Buffer[];
    amount: U64;
}
export interface WrapCCCAddressData {
    shardId: number;
    recipient: AssetTransferAddress;
    amount: U64;
}
export declare class WrapCCC {
    readonly shardId: number;
    readonly lockScriptHash: H160;
    readonly parameters: Buffer[];
    readonly amount: U64;
    constructor(data: WrapCCCData | WrapCCCAddressData);
    /**
     * Get the address of the asset scheme of the wrapped CCC asset. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    getAssetSchemeAddress(): H256;
    /**
     * Get the wrapped CCC asset output of this parcel.
     * @param parcelHash A hash value of containing parcel
     * @returns An Asset.
     */
    getAsset(parcelHash: H256): Asset;
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        shardId: number;
        lockScriptHash: string;
        parameters: number[][];
        amount: string | number;
    };
}
