/// <reference types="node" />
import { U64 } from "../U64";
import { Order, OrderJSON } from "./Order";
export interface OrderOnTransferJSON {
    order: OrderJSON;
    spentAmount: string;
    inputIndices: number[];
    outputIndices: number[];
}
export interface OrderOnTransferData {
    order: Order;
    spentAmount: U64;
    inputIndices: number[];
    outputIndices: number[];
}
export declare class OrderOnTransfer {
    /**
     * Create an Order from an OrderJSON object.
     * @param data An OrderJSON object.
     * @returns An Order.
     */
    static fromJSON(data: OrderOnTransferJSON): OrderOnTransfer;
    readonly order: Order;
    readonly spentAmount: U64;
    inputIndices: number[];
    outputIndices: number[];
    /**
     * @param params.order An order to apply to the transfer transaction.
     * @param data.spentAmount A spent amount of the asset to give(from) while transferring.
     * @param data.inputIndices The indices of inputs affected by the order
     * @param data.outputIndices The indices of outputs affected by the order
     */
    constructor(data: OrderOnTransferData);
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): (string | number | (string | number | Buffer[] | (string | number)[][])[])[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Convert to an OrderOnTransferJSON object.
     * @returns An OrderOnTransferJSON object.
     */
    toJSON(): OrderOnTransferJSON;
    /**
     * Return a consumed order as the spentAmount.
     * @returns An Order object.
     */
    getConsumedOrder(): Order;
}
