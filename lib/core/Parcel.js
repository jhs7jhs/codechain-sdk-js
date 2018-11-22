"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Action_1 = require("./action/Action");
const AssetTransaction_1 = require("./action/AssetTransaction");
const Payment_1 = require("./action/Payment");
const WrapCCC_1 = require("./action/WrapCCC");
const H256_1 = require("./H256");
const SignedParcel_1 = require("./SignedParcel");
const U64_1 = require("./U64");
const RLP = require("rlp");
/**
 * A unit that collects transaction and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the parcel to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the parcel is being sent to.
 * - Its seq must be identical to the seq of the account that will sign the parcel.
 * - It contains the transaction to process. After signing the Parcel's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
class Parcel {
    /**
     * @deprecated
     */
    static transaction(networkId, transaction) {
        const action = new AssetTransaction_1.AssetTransaction({ transaction });
        return new Parcel(networkId, action);
    }
    /**
     * @deprecated
     */
    static payment(networkId, receiver, value) {
        const action = new Payment_1.Payment(receiver, value);
        return new Parcel(networkId, action);
    }
    static fromJSON(result) {
        const { seq, fee, networkId, action } = result;
        const parcel = new Parcel(networkId, Action_1.getActionFromJSON(action));
        parcel.setSeq(seq);
        parcel.setFee(fee);
        return parcel;
    }
    constructor(networkId, action) {
        this.seq = null;
        this.fee = null;
        this.networkId = networkId;
        this.action = action;
    }
    setSeq(seq) {
        this.seq = seq;
    }
    setFee(fee) {
        this.fee = U64_1.U64.ensure(fee);
    }
    toEncodeObject() {
        const { seq, fee, action, networkId } = this;
        if (seq == null || !fee) {
            throw Error("Seq and fee in the parcel must be present");
        }
        return [seq, fee.toEncodeObject(), networkId, action.toEncodeObject()];
    }
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
    getAsset() {
        const { action } = this;
        if (!(action instanceof WrapCCC_1.WrapCCC)) {
            throw Error("Getting asset is only available with WrapCCC action");
        }
        return action.getAsset(this.hash());
    }
    sign(params) {
        const { secret, seq, fee } = params;
        if (this.seq !== null) {
            throw Error("The parcel seq is already set");
        }
        this.seq = seq;
        if (this.fee !== null) {
            throw Error("The parcel fee is already set");
        }
        this.fee = U64_1.U64.ensure(fee);
        const { r, s, v } = utils_1.signEcdsa(this.hash().value, H256_1.H256.ensure(secret).value);
        const sig = SignedParcel_1.SignedParcel.convertRsvToSignatureString({ r, s, v });
        return new SignedParcel_1.SignedParcel(this, sig);
    }
    toJSON() {
        const { seq, fee, networkId, action } = this;
        if (!fee) {
            throw Error("Fee in the parcel must be present");
        }
        const result = {
            fee: fee.toEncodeObject(),
            networkId,
            action: action.toJSON()
        };
        if (seq != null) {
            result.seq = seq;
        }
        return result;
    }
}
exports.Parcel = Parcel;
