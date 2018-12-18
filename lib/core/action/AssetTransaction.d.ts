import { Transaction } from "../transaction/Transaction";
export declare class AssetTransaction {
    transaction: Transaction;
    approvals: string[];
    constructor(input: {
        transaction: Transaction;
        approvals: string[];
    });
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        transaction: import("../transaction/AssetTransferTransaction").AssetTransferTransactionJSON | import("../transaction/AssetMintTransaction").AssetMintTransactionJSON | import("../transaction/AssetComposeTransaction").AssetComposeTransactionJSON | import("../transaction/AssetDecomposeTransaction").AssetDecomposeTransactionJSON | import("../transaction/AssetSchemeChangeTransaction").AssetSchemeChangeTransactionJSON | {
            type: string;
            data: {
                networkId: string;
                burn: import("../transaction/AssetTransferInput").AssetTransferInputJSON;
            };
        };
        approvals: string[];
    };
}
