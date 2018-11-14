import { AssetComposeTransaction, AssetComposeTransactionJSON } from "./AssetComposeTransaction";
import { AssetDecomposeTransaction, AssetDecomposeTransactionJSON } from "./AssetDecomposeTransaction";
import { AssetMintTransaction, AssetMintTransactionJSON } from "./AssetMintTransaction";
import { AssetTransferTransaction, AssetTransferTransactionJSON } from "./AssetTransferTransaction";
import { AssetUnwrapCCCTransaction, AssetUnwrapCCCTransactionJSON } from "./AssetUnwrapCCCTransaction";
export declare type TransactionJSON = AssetMintTransactionJSON | AssetTransferTransactionJSON | AssetComposeTransactionJSON | AssetDecomposeTransactionJSON | AssetUnwrapCCCTransactionJSON;
export declare type Transaction = AssetMintTransaction | AssetTransferTransaction | AssetComposeTransaction | AssetDecomposeTransaction | AssetUnwrapCCCTransaction;
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param params Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
export declare const getTransactionFromJSON: (json: TransactionJSON) => Transaction;
