/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives";
import { H256 } from "./H256";
import { AssetOutPoint } from "./transaction/AssetOutPoint";
import { AssetTransferInput, Timelock } from "./transaction/AssetTransferInput";
import { TransferAsset } from "./transaction/TransferAsset";
import { NetworkId } from "./types";
import { U64 } from "./U64";
export interface AssetJSON {
    assetType: string;
    lockScriptHash: string;
    parameters: string[];
    quantity: string;
    orderHash: string | null;
    tracker: string;
    transactionOutputIndex: number;
}
export interface AssetData {
    assetType: H256;
    lockScriptHash: H160;
    parameters: Buffer[];
    quantity: U64;
    orderHash?: H256 | null;
    tracker: H256;
    transactionOutputIndex: number;
}
/**
 * Object created as an AssetMintTransaction or TransferAsset.
 */
export declare class Asset {
    static fromJSON(data: AssetJSON): Asset;
    readonly assetType: H256;
    readonly lockScriptHash: H160;
    readonly parameters: Buffer[];
    readonly quantity: U64;
    readonly outPoint: AssetOutPoint;
    readonly orderHash: H256 | null;
    constructor(data: AssetData);
    toJSON(): AssetJSON;
    createTransferInput(options?: {
        timelock: Timelock | null;
    }): AssetTransferInput;
    createTransferTransaction(params: {
        recipients?: Array<{
            address: AssetTransferAddress | string;
            quantity: U64;
        }>;
        timelock?: null | Timelock;
        networkId: NetworkId;
        metadata?: string;
        approvals?: string[];
    }): TransferAsset;
}
