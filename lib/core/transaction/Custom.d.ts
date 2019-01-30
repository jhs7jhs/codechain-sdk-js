/// <reference types="node" />
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
import { U64 } from "../U64";
export declare class Custom extends Transaction {
    private readonly handlerId;
    private readonly bytes;
    constructor(params: {
        handlerId: U64;
        bytes: Buffer;
    }, networkId: NetworkId);
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
