import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
export declare class CreateShard extends Transaction {
    constructor(networkId: NetworkId);
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
