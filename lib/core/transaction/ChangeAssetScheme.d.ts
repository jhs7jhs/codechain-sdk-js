import { H160, PlatformAddress } from "../classes";
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
export declare class ChangeAssetScheme extends Transaction {
    private readonly _transaction;
    private readonly approvals;
    constructor(input: {
        networkId: NetworkId;
        assetType: H160;
        shardId: number;
        metadata: string;
        approver: PlatformAddress | null;
        administrator: PlatformAddress | null;
        allowedScriptHashes: H160[];
        approvals: string[];
    });
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
