"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var Action_1 = require("./action/Action");
var AssetTransaction_1 = require("./action/AssetTransaction");
var Payment_1 = require("./action/Payment");
var WrapCCC_1 = require("./action/WrapCCC");
var H256_1 = require("./H256");
var SignedParcel_1 = require("./SignedParcel");
var U64_1 = require("./U64");
var RLP = require("rlp");
/**
 * A unit that collects transaction and requests processing to the network. A parsel signer pays for CCC processing fees.
 *
 * - The fee must be at least 10. The higher the fee, the higher the priority for the parcel to be processed.
 * - It contains the network ID. This must be identical to the network ID to which the parcel is being sent to.
 * - Its seq must be identical to the seq of the account that will sign the parcel.
 * - It contains the transaction to process. After signing the Parcel's size must not exceed 1 MB.
 * - After signing with the sign() function, it can be sent to the network.
 */
var Parcel = /** @class */ (function () {
    function Parcel(networkId, action) {
        this.seq = null;
        this.fee = null;
        this.networkId = networkId;
        this.action = action;
    }
    /**
     * @deprecated
     */
    Parcel.transaction = function (networkId, transaction, approvals) {
        if (approvals === void 0) { approvals = []; }
        var action = new AssetTransaction_1.AssetTransaction({ transaction: transaction, approvals: approvals });
        return new Parcel(networkId, action);
    };
    /**
     * @deprecated
     */
    Parcel.payment = function (networkId, receiver, value) {
        var action = new Payment_1.Payment(receiver, value);
        return new Parcel(networkId, action);
    };
    Parcel.fromJSON = function (result) {
        var seq = result.seq, fee = result.fee, networkId = result.networkId, action = result.action;
        var parcel = new Parcel(networkId, Action_1.getActionFromJSON(action));
        parcel.setSeq(seq);
        parcel.setFee(fee);
        return parcel;
    };
    Parcel.prototype.setSeq = function (seq) {
        this.seq = seq;
    };
    Parcel.prototype.setFee = function (fee) {
        this.fee = U64_1.U64.ensure(fee);
    };
    Parcel.prototype.toEncodeObject = function () {
        var _a = this, seq = _a.seq, fee = _a.fee, action = _a.action, networkId = _a.networkId;
        if (seq == null || !fee) {
            throw Error("Seq and fee in the parcel must be present");
        }
        return [seq, fee.toEncodeObject(), networkId, action.toEncodeObject()];
    };
    Parcel.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    Parcel.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    Parcel.prototype.getAsset = function () {
        var action = this.action;
        if (!(action instanceof WrapCCC_1.WrapCCC)) {
            throw Error("Getting asset is only available with WrapCCC action");
        }
        return action.getAsset(this.hash());
    };
    Parcel.prototype.sign = function (params) {
        var secret = params.secret, seq = params.seq, fee = params.fee;
        if (this.seq !== null) {
            throw Error("The parcel seq is already set");
        }
        this.seq = seq;
        if (this.fee !== null) {
            throw Error("The parcel fee is already set");
        }
        this.fee = U64_1.U64.ensure(fee);
        var _a = utils_1.signEcdsa(this.hash().value, H256_1.H256.ensure(secret).value), r = _a.r, s = _a.s, v = _a.v;
        var sig = SignedParcel_1.SignedParcel.convertRsvToSignatureString({ r: r, s: s, v: v });
        return new SignedParcel_1.SignedParcel(this, sig);
    };
    Parcel.prototype.toJSON = function () {
        var _a = this, seq = _a.seq, fee = _a.fee, networkId = _a.networkId, action = _a.action;
        if (!fee) {
            throw Error("Fee in the parcel must be present");
        }
        var result = {
            fee: fee.toEncodeObject(),
            networkId: networkId,
            action: action.toJSON()
        };
        if (seq != null) {
            result.seq = seq;
        }
        return result;
    };
    return Parcel;
}());
exports.Parcel = Parcel;
