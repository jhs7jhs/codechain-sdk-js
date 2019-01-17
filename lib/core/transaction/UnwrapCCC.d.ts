import { SignatureTag } from "../../utils";
import { AssetTransferInput, H256 } from "../classes";
import { AssetTransaction, Transaction } from "../Transaction";
import { NetworkId } from "../types";
export declare class UnwrapCCC extends Transaction implements AssetTransaction {
    private readonly _transaction;
    private readonly approvals;
    constructor(input: {
        burn: AssetTransferInput;
        networkId: NetworkId;
        approvals: string[];
    });
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    hashWithoutScript(params?: {
        tag: SignatureTag;
        type: "input" | "burn";
        index: number;
    }): H256;
    burn(index: number): AssetTransferInput | null;
    tracker(): H256;
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
