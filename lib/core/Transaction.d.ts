/// <reference types="node" />
import { H256 } from "./H256";
import { SignedTransaction } from "./SignedTransaction";
import { NetworkId } from "./types";
import { U64 } from "./U64";
export interface AssetTransaction {
    tracker(): H256;
}
/**
 * A unit that collects transaction and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the tx to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the tx is being sent to.
 * - Its seq must be identical to the seq of the account that will sign the tx.
 * - It contains the transaction to process. After signing the Transaction's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
export declare abstract class Transaction {
    private _seq;
    private _fee;
    private readonly _networkId;
    protected constructor(networkId: NetworkId);
    seq(): number | null;
    fee(): U64 | null;
    setSeq(seq: number): void;
    setFee(fee: U64 | string | number): void;
    networkId(): NetworkId;
    toEncodeObject(): any[];
    rlpBytes(): Buffer;
    hash(): H256;
    sign(params: {
        secret: H256 | string;
        seq: number;
        fee: U64 | string | number;
    }): SignedTransaction;
    toJSON(): any;
    abstract type(): string;
    protected abstract actionToJSON(): any;
    protected abstract actionToEncodeObject(): any[];
}
