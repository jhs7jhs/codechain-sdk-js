/// <reference types="node" />
import { H256, PlatformAddress } from "codechain-primitives/lib";
import { NetworkId } from "../types";
export interface AssetSchemeChangeTransactionJSON {
    type: "assetSchemeChange";
    data: {
        networkId: NetworkId;
        assetType: string;
        metadata: string;
        approver?: string | null;
        administrator?: string | null;
    };
}
/**
 * Change asset scheme
 */
export declare class AssetSchemeChangeTransaction {
    static fromJSON(obj: AssetSchemeChangeTransactionJSON): AssetSchemeChangeTransaction;
    readonly networkId: NetworkId;
    readonly assetType: H256;
    readonly metadata: string;
    readonly approver: PlatformAddress | null;
    readonly administrator: PlatformAddress | null;
    readonly type = "assetSchemeChange";
    /**
     * @param params.networkId A network ID of the transaction.
     * @param params.assetType A asset type that this transaction changes.
     * @param params.metadata A changed metadata of the asset.
     * @param params.approver A changed approver of the asset.
     * @param params.administrator A changed administrator of the asset.
     */
    constructor(params: {
        networkId: NetworkId;
        assetType: H256;
        metadata: string;
        approver: PlatformAddress | null;
        administrator: PlatformAddress | null;
    });
    /**
     * Convert to an AssetSchemeChangeTransaction JSON object.
     * @returns An AssetSchemeChangeTransaction JSON object.
     */
    toJSON(): AssetSchemeChangeTransactionJSON;
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): (string | number | string[] | H256)[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Get the hash of an AssetMintTransaction.
     * @returns A transaction hash.
     */
    hash(): H256;
}
