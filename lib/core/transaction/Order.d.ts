/// <reference types="node" />
import { AssetTransferAddress } from "codechain-primitives";
import { H160 } from "../H160";
import { H256 } from "../H256";
import { U64 } from "../U64";
import { AssetOutPoint, AssetOutPointJSON } from "./AssetOutPoint";
export interface OrderJSON {
    assetTypeFrom: string;
    assetTypeTo: string;
    assetTypeFee: string;
    assetAmountFrom: string;
    assetAmountTo: string;
    assetAmountFee: string;
    originOutputs: AssetOutPointJSON[];
    expiration: string;
    lockScriptHash: string;
    parameters: number[][];
}
export interface OrderData {
    assetTypeFrom: H256;
    assetTypeTo: H256;
    assetTypeFee?: H256;
    assetAmountFrom: U64;
    assetAmountTo: U64;
    assetAmountFee?: U64;
    originOutputs: AssetOutPoint[];
    expiration: U64;
    lockScriptHash: H160;
    parameters: Buffer[];
}
export interface OrderAddressData {
    assetTypeFrom: H256;
    assetTypeTo: H256;
    assetTypeFee?: H256;
    assetAmountFrom: U64;
    assetAmountTo: U64;
    assetAmountFee?: U64;
    originOutputs: AssetOutPoint[];
    expiration: U64;
    recipient: AssetTransferAddress;
}
export declare class Order {
    /**
     * Create an Order from an OrderJSON object.
     * @param data An OrderJSON object.
     * @returns An Order.
     */
    static fromJSON(data: OrderJSON): Order;
    readonly assetTypeFrom: H256;
    readonly assetTypeTo: H256;
    readonly assetTypeFee: H256;
    readonly assetAmountFrom: U64;
    readonly assetAmountTo: U64;
    readonly assetAmountFee: U64;
    readonly originOutputs: AssetOutPoint[];
    readonly expiration: U64;
    readonly lockScriptHash: H160;
    readonly parameters: Buffer[];
    /**
     * @param data.assetTypeFrom The asset type of the asset to give.
     * @param data.assetTypeTo The asset type of the asset to get.
     * @param data.assetTypeFee The asset type of the asset for fee.
     * @param data.assetAmountFrom The amount of the asset to give.
     * @param data.assetAmountTo The amount of the asset to get.
     * @param data.assetAmountFee The amount of the asset for fee.
     * @param data.originOutputs The previous outputs to be consumed by the order.
     * @param data.expiration The expiration time of the order, by seconds.
     * @param data.lockScriptHash The lock script hash of the asset.
     * @param data.parameters The parameters of the asset.
     */
    constructor(data: OrderData | OrderAddressData);
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): (string | number | Buffer[] | (string | number)[][])[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Convert to an OrderJSON object.
     * @returns An OrderJSON object.
     */
    toJSON(): OrderJSON;
    /**
     * Get the hash of an order.
     * @returns An order hash.
     */
    hash(): H256;
    /**
     * Return the consumed order
     * @param params.amount the consumed amount of the asset to give
     */
    consume(amount: U64 | number | string): Order;
}
