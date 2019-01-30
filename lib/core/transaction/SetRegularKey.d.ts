import { H512 } from "../classes";
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
export declare class SetRegularKey extends Transaction {
    private readonly key;
    constructor(key: H512, networkId: NetworkId);
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
