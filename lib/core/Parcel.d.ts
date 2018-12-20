/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { Action } from "./action/Action";
import { Asset } from "./Asset";
import { H256 } from "./H256";
import { SignedParcel } from "./SignedParcel";
import { Transaction } from "./transaction/Transaction";
import { NetworkId } from "./types";
import { U64 } from "./U64";
/**
 * A unit that collects transaction and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the parcel to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the parcel is being sent to.
 * - Its seq must be identical to the seq of the account that will sign the parcel.
 * - It contains the transaction to process. After signing the Parcel's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
export declare class Parcel {
    /**
     * @deprecated
     */
    static transaction(networkId: NetworkId, transaction: Transaction, approvals?: string[]): Parcel;
    /**
     * @deprecated
     */
    static payment(networkId: NetworkId, receiver: PlatformAddress, value: U64): Parcel;
    static fromJSON(result: any): Parcel;
    seq?: number | null;
    fee: U64 | null;
    readonly networkId: NetworkId;
    readonly action: Action;
    constructor(networkId: NetworkId, action: Action);
    setSeq(seq: number): void;
    setFee(fee: U64 | string | number): void;
    toEncodeObject(): any[];
    rlpBytes(): Buffer;
    hash(): H256;
    getAsset(): Asset;
    sign(params: {
        secret: H256 | string;
        seq: number;
        fee: U64 | string | number;
    }): SignedParcel;
    toJSON(): any;
}
