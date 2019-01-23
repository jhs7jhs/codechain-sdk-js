/// <reference types="node" />
import { Asset } from "../Asset";
import { AssetTransferAddress, H160, U64 } from "../classes";
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
     * Get the asset type of the output.
     * @returns An asset type which is H160.
     */
    getAssetType(): H160;
    /**
     * Get the wrapped CCC asset output of this tx.
     * @returns An Asset.
     */
    getAsset(): Asset;
    tracker(): import("codechain-primitives/lib/value/H256").H256;
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
