/// <reference types="node" />
import { PlatformAddress } from "codechain-primitives";
import { Asset } from "./Asset";
import { H160 } from "./H160";
import { H256 } from "./H256";
import { H512 } from "./H512";
import { Transaction } from "./Transaction";
import { NetworkId } from "./types";
import { U256 } from "./U256";
/**
 * A [Transaction](tx.html) signed by a private key. It is possible to request
 * the CodeChain network to process this tx with the
 * [sendSignedTransaction](chainrpc.html#sendsignedtransaction) function.
 *
 * Transactions signed with a regular key has the same effect as those signed with
 * the original key. The original key is the key of the account that registered
 * the regular key.
 *
 * If any of the following is true, the Transaction will not be processed:
 * - The Transaction's processing fee is less than 10.
 * - A network ID is not identical.
 * - A seq is not identical to the signer's seq.
 */
export declare class SignedTransaction {
    /**
     * Convert r, s, v values of an ECDSA signature to a string.
     * @param params.r The r value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.s The s value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.v The recovery parameter of an ECDSA signature.
     * @returns A 65 byte hexadecimal string.
     */
    static convertRsvToSignatureString(params: {
        r: string;
        s: string;
        v: number;
    }): string;
    private static convertSignatureStringToRsv;
    unsigned: Transaction;
    v: number;
    r: U256;
    s: U256;
    blockNumber: number | null;
    blockHash: H256 | null;
    transactionIndex: number | null;
    /**
     * @param unsigned A Transaction.
     * @param sig An ECDSA signature which is a 65 byte hexadecimal string.
     * @param blockNumber The block number of the block that contains the tx.
     * @param blockHash The hash of the block that contains the tx.
     * @param transactionIndex The index(location) of the tx within the block.
     */
    constructor(unsigned: Transaction, sig: string, blockNumber?: number, blockHash?: H256, transactionIndex?: number);
    /**
     * Get the signature of a tx.
     */
    signature(): {
        v: number;
        r: U256;
        s: U256;
    };
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject(): any[];
    /**
     * Convert to RLP bytes.
     */
    rlpBytes(): Buffer;
    /**
     * Get the hash of a tx.
     * @returns A tx hash.
     */
    hash(): H256;
    getAsset(): Asset;
    /**
     * Get the account ID of a tx's signer.
     * @returns An account ID.
     * @deprecated
     */
    getSignerAccountId(): H160;
    /**
     * Get the platform address of a tx's signer.
     * @returns A PlatformAddress.
     * @deprecated
     */
    getSignerAddress(params: {
        networkId: NetworkId;
    }): PlatformAddress;
    /**
     * Get the public key of a tx's signer.
     * @returns A public key.
     */
    getSignerPublic(): H512;
    /**
     * Convert to a SignedTransaction JSON object.
     * @returns A SignedTransaction JSON object.
     */
    toJSON(): any;
}
