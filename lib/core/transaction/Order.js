"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var P2PKH_1 = require("../../key/P2PKH");
var P2PKHBurn_1 = require("../../key/P2PKHBurn");
var utils_1 = require("../../utils");
var H160_1 = require("../H160");
var H256_1 = require("../H256");
var U64_1 = require("../U64");
var AssetOutPoint_1 = require("./AssetOutPoint");
var RLP = require("rlp");
var Order = /** @class */ (function () {
    /**
     * @param data.assetTypeFrom The asset type of the asset to give.
     * @param data.assetTypeTo The asset type of the asset to get.
     * @param data.assetTypeFee The asset type of the asset for fee.
     * @param data.assetAmountFrom The amount of the asset to give.
     * @param data.assetAmountTo The amount of the asset to get.
     * @param data.assetAmountFee The amount of the asset for fee.
     * @param data.originOutputs The previous outputs to be consumed by the order.
     * @param data.expiration The expiration time of the order, by seconds.
     * @param data.lockScriptHash The lock script hash of the asset.
     * @param data.parameters The parameters of the asset.
     */
    function Order(data) {
        if ("recipient" in data) {
            // FIXME: Clean up by abstracting the standard scripts
            var _a = data.recipient, type = _a.type, payload = _a.payload;
            if ("pubkeys" in payload) {
                throw Error("Multisig payload is not supported yet");
            }
            switch (type) {
                case 0x00: // LOCK_SCRIPT_HASH ONLY
                    this.lockScriptHash = payload;
                    this.parameters = [];
                    break;
                case 0x01: // P2PKH
                    this.lockScriptHash = P2PKH_1.P2PKH.getLockScriptHash();
                    this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                case 0x02: // P2PKHBurn
                    this.lockScriptHash = P2PKHBurn_1.P2PKHBurn.getLockScriptHash();
                    this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                default:
                    throw Error("Unexpected type of AssetTransferAddress: " + type + ", " + data.recipient);
            }
        }
        else {
            var lockScriptHash = data.lockScriptHash, parameters = data.parameters;
            this.lockScriptHash = lockScriptHash;
            this.parameters = parameters;
        }
        var assetTypeFrom = data.assetTypeFrom, assetTypeTo = data.assetTypeTo, _b = data.assetTypeFee, assetTypeFee = _b === void 0 ? new H256_1.H256("0000000000000000000000000000000000000000000000000000000000000000") : _b, assetAmountFrom = data.assetAmountFrom, assetAmountTo = data.assetAmountTo, _c = data.assetAmountFee, assetAmountFee = _c === void 0 ? U64_1.U64.ensure(0) : _c, originOutputs = data.originOutputs, expiration = data.expiration;
        // Called too many times, so moving to variables
        var assetAmountFromIsZero = assetAmountFrom.value.isZero();
        var assetAmountToIsZero = assetAmountTo.value.isZero();
        var assetAmountFeeIsZero = assetAmountFee.value.isZero();
        if (assetTypeFrom.isEqualTo(assetTypeTo)) {
            throw Error("assetTypeFrom and assetTypeTo is same: " + assetTypeFrom);
        }
        else if (!assetAmountFeeIsZero &&
            (assetTypeFrom.isEqualTo(assetTypeFee) ||
                assetTypeTo.isEqualTo(assetTypeFee))) {
            throw Error("assetTypeFrom and assetTypeTo is same: " + assetTypeFrom);
        }
        if ((assetAmountFromIsZero && !assetAmountToIsZero) ||
            (!assetAmountFromIsZero && assetAmountToIsZero) ||
            (assetAmountFromIsZero && assetAmountFeeIsZero) ||
            (!assetAmountFromIsZero &&
                !assetAmountFee.value.mod(assetAmountFrom.value).isZero())) {
            throw Error("The given amount ratio is invalid: " + assetAmountFrom + ":" + assetAmountTo + ":" + assetAmountFee);
        }
        if (originOutputs.length === 0) {
            throw Error("originOutputs is empty");
        }
        this.assetTypeFrom = assetTypeFrom;
        this.assetTypeTo = assetTypeTo;
        this.assetTypeFee = assetTypeFee;
        this.assetAmountFrom = assetAmountFrom;
        this.assetAmountTo = assetAmountTo;
        this.assetAmountFee = assetAmountFee;
        this.originOutputs = originOutputs;
        this.expiration = expiration;
    }
    /**
     * Create an Order from an OrderJSON object.
     * @param data An OrderJSON object.
     * @returns An Order.
     */
    Order.fromJSON = function (data) {
        var assetTypeFrom = data.assetTypeFrom, assetTypeTo = data.assetTypeTo, assetTypeFee = data.assetTypeFee, assetAmountFrom = data.assetAmountFrom, assetAmountTo = data.assetAmountTo, assetAmountFee = data.assetAmountFee, originOutputs = data.originOutputs, expiration = data.expiration, lockScriptHash = data.lockScriptHash, parameters = data.parameters;
        return new this({
            assetTypeFrom: new H256_1.H256(assetTypeFrom),
            assetTypeTo: new H256_1.H256(assetTypeTo),
            assetTypeFee: new H256_1.H256(assetTypeFee),
            assetAmountFrom: U64_1.U64.ensure(assetAmountFrom),
            assetAmountTo: U64_1.U64.ensure(assetAmountTo),
            assetAmountFee: U64_1.U64.ensure(assetAmountFee),
            originOutputs: originOutputs.map(function (point) {
                return AssetOutPoint_1.AssetOutPoint.fromJSON(point);
            }),
            expiration: U64_1.U64.ensure(expiration),
            lockScriptHash: new H160_1.H160(lockScriptHash),
            parameters: parameters.map(function (p) { return Buffer.from(p); })
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    Order.prototype.toEncodeObject = function () {
        var _a = this, assetTypeFrom = _a.assetTypeFrom, assetTypeTo = _a.assetTypeTo, assetTypeFee = _a.assetTypeFee, assetAmountFrom = _a.assetAmountFrom, assetAmountTo = _a.assetAmountTo, assetAmountFee = _a.assetAmountFee, originOutputs = _a.originOutputs, expiration = _a.expiration, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters;
        return [
            assetTypeFrom.toEncodeObject(),
            assetTypeTo.toEncodeObject(),
            assetTypeFee.toEncodeObject(),
            assetAmountFrom.toEncodeObject(),
            assetAmountTo.toEncodeObject(),
            assetAmountFee.toEncodeObject(),
            originOutputs.map(function (output) { return output.toEncodeObject(); }),
            expiration.toEncodeObject(),
            lockScriptHash.toEncodeObject(),
            parameters.map(function (parameter) { return Buffer.from(parameter); })
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    Order.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Convert to an OrderJSON object.
     * @returns An OrderJSON object.
     */
    Order.prototype.toJSON = function () {
        var _a = this, assetTypeFrom = _a.assetTypeFrom, assetTypeTo = _a.assetTypeTo, assetTypeFee = _a.assetTypeFee, assetAmountFrom = _a.assetAmountFrom, assetAmountTo = _a.assetAmountTo, assetAmountFee = _a.assetAmountFee, originOutputs = _a.originOutputs, expiration = _a.expiration, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters;
        return {
            assetTypeFrom: assetTypeFrom.value,
            assetTypeTo: assetTypeTo.value,
            assetTypeFee: assetTypeFee.value,
            assetAmountFrom: "0x" + assetAmountFrom.toString(16),
            assetAmountTo: "0x" + assetAmountTo.toString(16),
            assetAmountFee: "0x" + assetAmountFee.toString(16),
            originOutputs: originOutputs.map(function (output) { return output.toJSON(); }),
            expiration: expiration.toString(),
            lockScriptHash: lockScriptHash.toEncodeObject(),
            parameters: parameters.map(function (parameter) { return __spread(parameter); })
        };
    };
    /**
     * Get the hash of an order.
     * @returns An order hash.
     */
    Order.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    /**
     * Return the consumed order
     * @param params.amount the consumed amount of the asset to give
     */
    Order.prototype.consume = function (amount) {
        var amountFrom = U64_1.U64.ensure(amount);
        if (amountFrom.gt(this.assetAmountFrom)) {
            throw Error("The given amount is too big: " + amountFrom + " > " + this.assetAmountFrom);
        }
        var remainAmountFrom = this.assetAmountFrom.value.minus(amountFrom.value);
        if (!remainAmountFrom
            .times(this.assetAmountTo.value)
            .mod(this.assetAmountFrom.value)
            .isZero()) {
            throw Error("The given amount does not fit to the ratio: " + this.assetAmountFrom + ":" + this.assetAmountTo);
        }
        var remainAmountTo = remainAmountFrom
            .times(this.assetAmountTo.value)
            .idiv(this.assetAmountFrom.value);
        var remainAmountFee = remainAmountFrom
            .times(this.assetAmountFee.value)
            .idiv(this.assetAmountFrom.value);
        return new Order({
            assetTypeFrom: this.assetTypeFrom,
            assetTypeTo: this.assetTypeTo,
            assetTypeFee: this.assetTypeFee,
            assetAmountFrom: U64_1.U64.ensure(remainAmountFrom),
            assetAmountTo: U64_1.U64.ensure(remainAmountTo),
            assetAmountFee: U64_1.U64.ensure(remainAmountFee),
            originOutputs: this.originOutputs,
            expiration: this.expiration,
            lockScriptHash: this.lockScriptHash,
            parameters: this.parameters
        });
    };
    return Order;
}());
exports.Order = Order;
