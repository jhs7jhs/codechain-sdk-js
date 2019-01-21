import { SignedTransaction, Transaction } from "../classes";
export declare function fromJSONToTransaction(result: any): Transaction;
/**
 * Create a SignedTransaction from a SignedTransaction JSON object.
 * @param data A SignedTransaction JSON object.
 * @returns A SignedTransaction.
 */
export declare function fromJSONToSignedTransaction(data: any): SignedTransaction;
