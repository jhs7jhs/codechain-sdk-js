"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var _ = require("lodash");
var utils_1 = require("../utils");
var H160_1 = require("./H160");
var H256_1 = require("./H256");
var H512_1 = require("./H512");
var U256_1 = require("./U256");
var RLP = require("rlp");
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
var SignedTransaction = /** @class */ (function () {
    /**
     * @param unsigned A Transaction.
     * @param sig An ECDSA signature which is a 65 byte hexadecimal string.
     * @param blockNumber The block number of the block that contains the tx.
     * @param blockHash The hash of the block that contains the tx.
     * @param transactionIndex The index(location) of the tx within the block.
     */
    function SignedTransaction(unsigned, sig, blockNumber, blockHash, transactionIndex) {
        this.unsigned = unsigned;
        var _a = SignedTransaction.convertSignatureStringToRsv(sig), r = _a.r, s = _a.s, v = _a.v;
        this.v = v;
        this.r = new U256_1.U256(r);
        this.s = new U256_1.U256(s);
        this.blockNumber = blockNumber === undefined ? null : blockNumber;
        this.blockHash = blockHash || null;
        this.transactionIndex =
            transactionIndex === undefined ? null : transactionIndex;
    }
    /**
     * Convert r, s, v values of an ECDSA signature to a string.
     * @param params.r The r value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.s The s value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.v The recovery parameter of an ECDSA signature.
     * @returns A 65 byte hexadecimal string.
     */
    SignedTransaction.convertRsvToSignatureString = function (params) {
        var r = params.r, s = params.s, v = params.v;
        return "0x" + _.padStart(r, 64, "0") + _.padStart(s, 64, "0") + _.padStart(v.toString(16), 2, "0");
    };
    SignedTransaction.convertSignatureStringToRsv = function (signature) {
        if (signature.startsWith("0x")) {
            signature = signature.substr(2);
        }
        var r = "0x" + signature.substr(0, 64);
        var s = "0x" + signature.substr(64, 64);
        var v = Number.parseInt(signature.substr(128, 2), 16);
        return { r: r, s: s, v: v };
    };
    /**
     * Get the signature of a tx.
     */
    SignedTransaction.prototype.signature = function () {
        var _a = this, v = _a.v, r = _a.r, s = _a.s;
        return { v: v, r: r, s: s };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    SignedTransaction.prototype.toEncodeObject = function () {
        var _a = this, unsigned = _a.unsigned, v = _a.v, r = _a.r, s = _a.s;
        var sig = "0x" + _.padStart(r.value.toString(16), 64, "0") + _.padStart(s.value.toString(16), 64, "0") + _.padStart(v.toString(16), 2, "0");
        var result = unsigned.toEncodeObject();
        result.push(sig);
        return result;
    };
    /**
     * Convert to RLP bytes.
     */
    SignedTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of a tx.
     * @returns A tx hash.
     */
    SignedTransaction.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    SignedTransaction.prototype.getAsset = function () {
        // FIXME: Only UnwrapCCC has getAsset method
        return this.unsigned.getAsset();
    };
    /**
     * Get the account ID of a tx's signer.
     * @returns An account ID.
     * @deprecated
     */
    SignedTransaction.prototype.getSignerAccountId = function () {
        var _a = this, r = _a.r, s = _a.s, v = _a.v, unsigned = _a.unsigned;
        var publicKey = utils_1.recoverEcdsa(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        });
        return new H160_1.H160(utils_1.blake160(publicKey));
    };
    /**
     * Get the platform address of a tx's signer.
     * @returns A PlatformAddress.
     * @deprecated
     */
    SignedTransaction.prototype.getSignerAddress = function (params) {
        return codechain_primitives_1.PlatformAddress.fromAccountId(this.getSignerAccountId(), params);
    };
    /**
     * Get the public key of a tx's signer.
     * @returns A public key.
     */
    SignedTransaction.prototype.getSignerPublic = function () {
        var _a = this, r = _a.r, s = _a.s, v = _a.v, unsigned = _a.unsigned;
        return new H512_1.H512(utils_1.recoverEcdsa(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        }));
    };
    /**
     * Convert to a SignedTransaction JSON object.
     * @returns A SignedTransaction JSON object.
     */
    SignedTransaction.prototype.toJSON = function () {
        var _a = this, blockNumber = _a.blockNumber, blockHash = _a.blockHash, transactionIndex = _a.transactionIndex, unsigned = _a.unsigned, v = _a.v, r = _a.r, s = _a.s;
        var seq = unsigned.seq();
        var sig = SignedTransaction.convertRsvToSignatureString({
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        });
        if (seq == null) {
            throw Error("Signed tx must have the seq");
        }
        var result = unsigned.toJSON();
        result.blockNumber = blockNumber;
        result.blockHash = blockHash === null ? null : blockHash.toJSON();
        result.transactionIndex = transactionIndex;
        result.sig = sig;
        result.hash = this.hash().toJSON();
        return result;
    };
    return SignedTransaction;
}());
exports.SignedTransaction = SignedTransaction;
