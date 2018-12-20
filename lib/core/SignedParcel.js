"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var _ = require("lodash");
var utils_1 = require("../utils");
var H160_1 = require("./H160");
var H256_1 = require("./H256");
var H512_1 = require("./H512");
var Parcel_1 = require("./Parcel");
var U256_1 = require("./U256");
var RLP = require("rlp");
/**
 * A [Parcel](parcel.html) signed by a private key. It is possible to request
 * the CodeChain network to process this parcel with the
 * [sendSignedParcel](chainrpc.html#sendsignedparcel) function.
 *
 * Parcels signed with a regular key has the same effect as those signed with
 * the original key. The original key is the key of the account that registered
 * the regular key.
 *
 * If any of the following is true, the Parcel will not be processed:
 * - The Parcel's processing fee is less than 10.
 * - A network ID is not identical.
 * - A seq is not identical to the signer's seq.
 */
var SignedParcel = /** @class */ (function () {
    /**
     * @param unsigned A Parcel.
     * @param sig An ECDSA signature which is a 65 byte hexadecimal string.
     * @param blockNumber The block number of the block that contains the parcel.
     * @param blockHash The hash of the block that contains the parcel.
     * @param parcelIndex The index(location) of the parcel within the block.
     */
    function SignedParcel(unsigned, sig, blockNumber, blockHash, parcelIndex) {
        this.unsigned = unsigned;
        var _a = SignedParcel.convertSignatureStringToRsv(sig), r = _a.r, s = _a.s, v = _a.v;
        this.v = v;
        this.r = new U256_1.U256(r);
        this.s = new U256_1.U256(s);
        this.blockNumber = blockNumber === undefined ? null : blockNumber;
        this.blockHash = blockHash || null;
        this.parcelIndex = parcelIndex === undefined ? null : parcelIndex;
    }
    // FIXME: any
    /**
     * Create a SignedParcel from a SignedParcel JSON object.
     * @param data A SignedParcel JSON object.
     * @returns A SignedParcel.
     */
    SignedParcel.fromJSON = function (data) {
        var sig = data.sig, blockNumber = data.blockNumber, blockHash = data.blockHash, parcelIndex = data.parcelIndex;
        if (typeof sig !== "string") {
            throw Error("Unexpected type of sig");
        }
        if (blockNumber) {
            return new SignedParcel(Parcel_1.Parcel.fromJSON(data), sig, blockNumber, new H256_1.H256(blockHash), parcelIndex);
        }
        else {
            return new SignedParcel(Parcel_1.Parcel.fromJSON(data), sig);
        }
    };
    /**
     * Convert r, s, v values of an ECDSA signature to a string.
     * @param params.r The r value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.s The s value of an ECDSA signature, which is up to 32 bytes of hexadecimal string.
     * @param params.v The recovery parameter of an ECDSA signature.
     * @returns A 65 byte hexadecimal string.
     */
    SignedParcel.convertRsvToSignatureString = function (params) {
        var r = params.r, s = params.s, v = params.v;
        return "0x" + _.padStart(r, 64, "0") + _.padStart(s, 64, "0") + _.padStart(v.toString(16), 2, "0");
    };
    SignedParcel.convertSignatureStringToRsv = function (signature) {
        if (signature.startsWith("0x")) {
            signature = signature.substr(2);
        }
        var r = "0x" + signature.substr(0, 64);
        var s = "0x" + signature.substr(64, 64);
        var v = Number.parseInt(signature.substr(128, 2), 16);
        return { r: r, s: s, v: v };
    };
    /**
     * Get the signature of a parcel.
     */
    SignedParcel.prototype.signature = function () {
        var _a = this, v = _a.v, r = _a.r, s = _a.s;
        return { v: v, r: r, s: s };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    SignedParcel.prototype.toEncodeObject = function () {
        var _a = this, _b = _a.unsigned, seq = _b.seq, fee = _b.fee, action = _b.action, networkId = _b.networkId, v = _a.v, r = _a.r, s = _a.s;
        var sig = "0x" + _.padStart(r.value.toString(16), 64, "0") + _.padStart(s.value.toString(16), 64, "0") + _.padStart(v.toString(16), 2, "0");
        if (seq == null || !fee) {
            throw Error("Seq and fee in the parcel must be present");
        }
        return [
            seq,
            fee.toEncodeObject(),
            networkId,
            action.toEncodeObject(),
            sig
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    SignedParcel.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of a parcel.
     * @returns A parcel hash.
     */
    SignedParcel.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    SignedParcel.prototype.getAsset = function () {
        return this.unsigned.getAsset();
    };
    /**
     * Get the account ID of a parcel's signer.
     * @returns An account ID.
     * @deprecated
     */
    SignedParcel.prototype.getSignerAccountId = function () {
        var _a = this, r = _a.r, s = _a.s, v = _a.v, unsigned = _a.unsigned;
        var publicKey = utils_1.recoverEcdsa(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        });
        return new H160_1.H160(utils_1.blake160(publicKey));
    };
    /**
     * Get the platform address of a parcel's signer.
     * @returns A PlatformAddress.
     * @deprecated
     */
    SignedParcel.prototype.getSignerAddress = function (params) {
        return codechain_primitives_1.PlatformAddress.fromAccountId(this.getSignerAccountId(), params);
    };
    /**
     * Get the public key of a parcel's signer.
     * @returns A public key.
     */
    SignedParcel.prototype.getSignerPublic = function () {
        var _a = this, r = _a.r, s = _a.s, v = _a.v, unsigned = _a.unsigned;
        return new H512_1.H512(utils_1.recoverEcdsa(unsigned.hash().value, {
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        }));
    };
    /**
     * Convert to a SignedParcel JSON object.
     * @returns A SignedParcel JSON object.
     */
    SignedParcel.prototype.toJSON = function () {
        var _a = this, blockNumber = _a.blockNumber, blockHash = _a.blockHash, parcelIndex = _a.parcelIndex, _b = _a.unsigned, seq = _b.seq, fee = _b.fee, networkId = _b.networkId, action = _b.action, v = _a.v, r = _a.r, s = _a.s;
        var sig = SignedParcel.convertRsvToSignatureString({
            r: r.value.toString(16),
            s: s.value.toString(16),
            v: v
        });
        if (!seq || !fee) {
            throw Error("Seq and fee in the parcel must be present");
        }
        return {
            blockNumber: blockNumber,
            blockHash: blockHash === null ? null : blockHash.value,
            parcelIndex: parcelIndex,
            seq: seq,
            fee: fee.value.toString(),
            networkId: networkId,
            action: action.toJSON(),
            sig: sig,
            hash: this.hash().value
        };
    };
    return SignedParcel;
}());
exports.SignedParcel = SignedParcel;
