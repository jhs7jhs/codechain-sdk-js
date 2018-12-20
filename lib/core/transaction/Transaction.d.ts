import { AssetComposeTransaction, AssetComposeTransactionJSON } from "./AssetComposeTransaction";
import { AssetDecomposeTransaction, AssetDecomposeTransactionJSON } from "./AssetDecomposeTransaction";
import { AssetMintTransaction, AssetMintTransactionJSON } from "./AssetMintTransaction";
import { AssetSchemeChangeTransaction, AssetSchemeChangeTransactionJSON } from "./AssetSchemeChangeTransaction";
import { AssetTransferTransaction, AssetTransferTransactionJSON } from "./AssetTransferTransaction";
import { AssetUnwrapCCCTransaction, AssetUnwrapCCCTransactionJSON } from "./AssetUnwrapCCCTransaction";
export declare type TransactionJSON = AssetMintTransactionJSON | AssetTransferTransactionJSON | AssetComposeTransactionJSON | AssetDecomposeTransactionJSON | AssetUnwrapCCCTransactionJSON | AssetSchemeChangeTransactionJSON;
export declare type Transaction = AssetMintTransaction | AssetTransferTransaction | AssetComposeTransaction | AssetDecomposeTransaction | AssetUnwrapCCCTransaction | AssetSchemeChangeTransaction;
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param json Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
export declare const getTransactionFromJSON: (json: TransactionJSON) => Transaction;
