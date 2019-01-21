/// <reference types="node" />
import { Asset } from "../Asset";
import { AssetTransferAddress, H160, H256, U64 } from "../classes";
import { AssetTransaction, Transaction } from "../Transaction";
import { NetworkId } from "../types";
export interface WrapCCCData {
    shardId: number;
    lockScriptHash: H160;
    parameters: Buffer[];
    quantity: U64;
}
export interface WrapCCCAddressData {
    shardId: number;
    recipient: AssetTransferAddress;
    quantity: U64;
}
export declare class WrapCCC extends Transaction implements AssetTransaction {
    private readonly shardId;
    private readonly lockScriptHash;
    private readonly parameters;
    private readonly quantity;
    constructor(data: WrapCCCData | WrapCCCAddressData, networkId: NetworkId);
    /**
     * Get the address of the asset scheme of the wrapped CCC asset. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    getAssetSchemeAddress(): H256;
    /**
     * Get the wrapped CCC asset output of this tx.
     * @returns An Asset.
     */
    getAsset(): Asset;
    tracker(): H256;
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
