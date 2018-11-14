import { Transaction } from "../transaction/Transaction";
export declare class AssetTransaction {
    transaction: Transaction;
    constructor(input: {
        transaction: Transaction;
    });
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        transaction: import("../transaction/AssetTransferTransaction").AssetTransferTransactionJSON | import("../transaction/AssetMintTransaction").AssetMintTransactionJSON | import("../transaction/AssetComposeTransaction").AssetComposeTransactionJSON | import("../transaction/AssetDecomposeTransaction").AssetDecomposeTransactionJSON | {
            type: string;
            data: {
                networkId: string;
                burn: import("../transaction/AssetTransferInput").AssetTransferInputJSON;
            };
        };
    };
}
