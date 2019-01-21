import { PlatformAddress } from "../classes";
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
export declare class SetShardUsers extends Transaction {
    private readonly shardId;
    private readonly users;
    constructor(params: {
        shardId: number;
        users: PlatformAddress[];
    }, networkId: NetworkId);
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
