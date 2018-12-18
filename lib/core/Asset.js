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
var buffer_1 = require("buffer");
var codechain_primitives_1 = require("codechain-primitives");
var H256_1 = require("./H256");
var AssetOutPoint_1 = require("./transaction/AssetOutPoint");
var AssetTransferInput_1 = require("./transaction/AssetTransferInput");
var AssetTransferOutput_1 = require("./transaction/AssetTransferOutput");
var AssetTransferTransaction_1 = require("./transaction/AssetTransferTransaction");
var U64_1 = require("./U64");
/**
 * Object created as an AssetMintTransaction or AssetTransferTransaction.
 */
var Asset = /** @class */ (function () {
    function Asset(data) {
        var transactionHash = data.transactionHash, transactionOutputIndex = data.transactionOutputIndex, assetType = data.assetType, amount = data.amount, _a = data.orderHash, orderHash = _a === void 0 ? null : _a, lockScriptHash = data.lockScriptHash, parameters = data.parameters;
        this.assetType = data.assetType;
        this.lockScriptHash = data.lockScriptHash;
        this.parameters = data.parameters;
        this.amount = data.amount;
        this.orderHash = orderHash;
        this.outPoint = new AssetOutPoint_1.AssetOutPoint({
            transactionHash: transactionHash,
            index: transactionOutputIndex,
            assetType: assetType,
            amount: amount,
            lockScriptHash: lockScriptHash,
            parameters: parameters
        });
    }
    Asset.fromJSON = function (data) {
        var assetType = data.assetType, lockScriptHash = data.lockScriptHash, parameters = data.parameters, amount = data.amount, orderHash = data.orderHash, transactionHash = data.transactionHash, transactionOutputIndex = data.transactionOutputIndex;
        return new Asset({
            assetType: new H256_1.H256(assetType),
            lockScriptHash: new codechain_primitives_1.H160(lockScriptHash),
            parameters: parameters.map(function (p) {
                return buffer_1.Buffer.from(p);
            }),
            amount: U64_1.U64.ensure(amount),
            orderHash: orderHash === null ? orderHash : H256_1.H256.ensure(orderHash),
            transactionHash: new H256_1.H256(transactionHash),
            transactionOutputIndex: transactionOutputIndex
        });
    };
    Asset.prototype.toJSON = function () {
        var _a = this, assetType = _a.assetType, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, orderHash = _a.orderHash, amount = _a.amount, outPoint = _a.outPoint;
        var transactionHash = outPoint.transactionHash, index = outPoint.index;
        return {
            assetType: assetType.value,
            lockScriptHash: lockScriptHash.value,
            parameters: parameters.map(function (p) { return __spread(p); }),
            amount: "0x" + amount.toString(16),
            orderHash: orderHash === null ? null : orderHash.toString(),
            transactionHash: transactionHash.value,
            transactionOutputIndex: index
        };
    };
    Asset.prototype.createTransferInput = function (options) {
        var _a = (options || {}).timelock, timelock = _a === void 0 ? null : _a;
        return new AssetTransferInput_1.AssetTransferInput({
            prevOut: this.outPoint,
            timelock: timelock
        });
    };
    Asset.prototype.createTransferTransaction = function (params) {
        var _a = this, outPoint = _a.outPoint, assetType = _a.assetType;
        var _b = params.recipients, recipients = _b === void 0 ? [] : _b, _c = params.timelock, timelock = _c === void 0 ? null : _c, networkId = params.networkId;
        return new AssetTransferTransaction_1.AssetTransferTransaction({
            burns: [],
            inputs: [
                new AssetTransferInput_1.AssetTransferInput({
                    prevOut: outPoint,
                    timelock: timelock,
                    lockScript: buffer_1.Buffer.from([]),
                    unlockScript: buffer_1.Buffer.from([])
                })
            ],
            outputs: recipients.map(function (recipient) {
                return new AssetTransferOutput_1.AssetTransferOutput({
                    recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient.address),
                    assetType: assetType,
                    amount: recipient.amount
                });
            }),
            orders: [],
            networkId: networkId
        });
    };
    return Asset;
}());
exports.Asset = Asset;
