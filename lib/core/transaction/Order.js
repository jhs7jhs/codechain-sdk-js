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
        if ("recipientFrom" in data) {
            var _a = decomposeRecipient(data.recipientFrom), lockScriptHash = _a.lockScriptHash, parameters = _a.parameters;
            this.lockScriptHashFrom = lockScriptHash;
            this.parametersFrom = parameters;
        }
        else {
            var lockScriptHashFrom = data.lockScriptHashFrom, parametersFrom = data.parametersFrom;
            this.lockScriptHashFrom = lockScriptHashFrom;
            this.parametersFrom = parametersFrom;
        }
        if ("recipientFee" in data) {
            var _b = decomposeRecipient(data.recipientFee), lockScriptHash = _b.lockScriptHash, parameters = _b.parameters;
            this.lockScriptHashFee = lockScriptHash;
            this.parametersFee = parameters;
        }
        else {
            var lockScriptHashFee = data.lockScriptHashFee, parametersFee = data.parametersFee;
            this.lockScriptHashFee = lockScriptHashFee;
            this.parametersFee = parametersFee;
        }
        var assetTypeFrom = data.assetTypeFrom, assetTypeTo = data.assetTypeTo, _c = data.assetTypeFee, assetTypeFee = _c === void 0 ? new H256_1.H256("0000000000000000000000000000000000000000000000000000000000000000") : _c, assetAmountFrom = data.assetAmountFrom, assetAmountTo = data.assetAmountTo, _d = data.assetAmountFee, assetAmountFee = _d === void 0 ? U64_1.U64.ensure(0) : _d, originOutputs = data.originOutputs, expiration = data.expiration;
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
        var assetTypeFrom = data.assetTypeFrom, assetTypeTo = data.assetTypeTo, assetTypeFee = data.assetTypeFee, assetAmountFrom = data.assetAmountFrom, assetAmountTo = data.assetAmountTo, assetAmountFee = data.assetAmountFee, originOutputs = data.originOutputs, expiration = data.expiration, lockScriptHashFrom = data.lockScriptHashFrom, parametersFrom = data.parametersFrom, lockScriptHashFee = data.lockScriptHashFee, parametersFee = data.parametersFee;
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
            lockScriptHashFrom: new H160_1.H160(lockScriptHashFrom),
            parametersFrom: parametersFrom.map(function (p) {
                return Buffer.from(p);
            }),
            lockScriptHashFee: new H160_1.H160(lockScriptHashFee),
            parametersFee: parametersFee.map(function (p) {
                return Buffer.from(p);
            })
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    Order.prototype.toEncodeObject = function () {
        var _a = this, assetTypeFrom = _a.assetTypeFrom, assetTypeTo = _a.assetTypeTo, assetTypeFee = _a.assetTypeFee, assetAmountFrom = _a.assetAmountFrom, assetAmountTo = _a.assetAmountTo, assetAmountFee = _a.assetAmountFee, originOutputs = _a.originOutputs, expiration = _a.expiration, lockScriptHashFrom = _a.lockScriptHashFrom, parametersFrom = _a.parametersFrom, lockScriptHashFee = _a.lockScriptHashFee, parametersFee = _a.parametersFee;
        return [
            assetTypeFrom.toEncodeObject(),
            assetTypeTo.toEncodeObject(),
            assetTypeFee.toEncodeObject(),
            assetAmountFrom.toEncodeObject(),
            assetAmountTo.toEncodeObject(),
            assetAmountFee.toEncodeObject(),
            originOutputs.map(function (output) { return output.toEncodeObject(); }),
            expiration.toEncodeObject(),
            lockScriptHashFrom.toEncodeObject(),
            parametersFrom.map(function (p) { return Buffer.from(p); }),
            lockScriptHashFee.toEncodeObject(),
            parametersFee.map(function (p) { return Buffer.from(p); })
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
        var _a = this, assetTypeFrom = _a.assetTypeFrom, assetTypeTo = _a.assetTypeTo, assetTypeFee = _a.assetTypeFee, assetAmountFrom = _a.assetAmountFrom, assetAmountTo = _a.assetAmountTo, assetAmountFee = _a.assetAmountFee, originOutputs = _a.originOutputs, expiration = _a.expiration, lockScriptHashFrom = _a.lockScriptHashFrom, parametersFrom = _a.parametersFrom, lockScriptHashFee = _a.lockScriptHashFee, parametersFee = _a.parametersFee;
        return {
            assetTypeFrom: assetTypeFrom.value,
            assetTypeTo: assetTypeTo.value,
            assetTypeFee: assetTypeFee.value,
            assetAmountFrom: "0x" + assetAmountFrom.toString(16),
            assetAmountTo: "0x" + assetAmountTo.toString(16),
            assetAmountFee: "0x" + assetAmountFee.toString(16),
            originOutputs: originOutputs.map(function (output) { return output.toJSON(); }),
            expiration: expiration.toString(),
            lockScriptHashFrom: lockScriptHashFrom.toEncodeObject(),
            parametersFrom: parametersFrom.map(function (parameter) { return __spread(parameter); }),
            lockScriptHashFee: lockScriptHashFee.toEncodeObject(),
            parametersFee: parametersFee.map(function (parameter) { return __spread(parameter); })
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
        var _a = this, assetTypeFrom = _a.assetTypeFrom, assetTypeTo = _a.assetTypeTo, assetTypeFee = _a.assetTypeFee, assetAmountFrom = _a.assetAmountFrom, assetAmountTo = _a.assetAmountTo, assetAmountFee = _a.assetAmountFee, originOutputs = _a.originOutputs, expiration = _a.expiration, lockScriptHashFrom = _a.lockScriptHashFrom, parametersFrom = _a.parametersFrom, lockScriptHashFee = _a.lockScriptHashFee, parametersFee = _a.parametersFee;
        var amountFrom = U64_1.U64.ensure(amount);
        if (amountFrom.gt(assetAmountFrom)) {
            throw Error("The given amount is too big: " + amountFrom + " > " + assetAmountFrom);
        }
        var remainAmountFrom = this.assetAmountFrom.value.minus(amountFrom.value);
        if (!remainAmountFrom
            .times(assetAmountTo.value)
            .mod(assetAmountFrom.value)
            .isZero()) {
            throw Error("The given amount does not fit to the ratio: " + assetAmountFrom + ":" + assetAmountTo);
        }
        var remainAmountTo = remainAmountFrom
            .times(assetAmountTo.value)
            .idiv(assetAmountFrom.value);
        var remainAmountFee = remainAmountFrom
            .times(assetAmountFee.value)
            .idiv(assetAmountFrom.value);
        return new Order({
            assetTypeFrom: assetTypeFrom,
            assetTypeTo: assetTypeTo,
            assetTypeFee: assetTypeFee,
            assetAmountFrom: U64_1.U64.ensure(remainAmountFrom),
            assetAmountTo: U64_1.U64.ensure(remainAmountTo),
            assetAmountFee: U64_1.U64.ensure(remainAmountFee),
            originOutputs: originOutputs,
            expiration: expiration,
            lockScriptHashFrom: lockScriptHashFrom,
            parametersFrom: parametersFrom,
            lockScriptHashFee: lockScriptHashFee,
            parametersFee: parametersFee
        });
    };
    return Order;
}());
exports.Order = Order;
function decomposeRecipient(recipient) {
    // FIXME: Clean up by abstracting the standard scripts
    var type = recipient.type, payload = recipient.payload;
    if ("pubkeys" in payload) {
        throw Error("Multisig payload is not supported yet");
    }
    switch (type) {
        case 0x00: // LOCK_SCRIPT_HASH ONLY
            return {
                lockScriptHash: payload,
                parameters: []
            };
        case 0x01: // P2PKH
            return {
                lockScriptHash: P2PKH_1.P2PKH.getLockScriptHash(),
                parameters: [Buffer.from(payload.value, "hex")]
            };
        case 0x02: // P2PKHBurn
            return {
                lockScriptHash: P2PKHBurn_1.P2PKHBurn.getLockScriptHash(),
                parameters: [Buffer.from(payload.value, "hex")]
            };
        default:
            throw Error("Unexpected type of AssetTransferAddress: " + type + ", " + recipient);
    }
}
