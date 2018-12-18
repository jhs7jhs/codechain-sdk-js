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
var P2PKH_1 = require("../../key/P2PKH");
var P2PKHBurn_1 = require("../../key/P2PKHBurn");
var H256_1 = require("../H256");
var U64_1 = require("../U64");
/**
 * An AssetTransferOutput consists of:
 *  - A lock script hash and parameters, which mark ownership of the asset.
 *  - An asset type and amount, which indicate the asset's type and quantity.
 */
var AssetTransferOutput = /** @class */ (function () {
    /**
     * @param data.lockScriptHash A lock script hash of the output.
     * @param data.parameters Parameters of the output.
     * @param data.assetType An asset type of the output.
     * @param data.amount An asset amount of the output.
     */
    function AssetTransferOutput(data) {
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
                    this.parameters = [buffer_1.Buffer.from(payload.value, "hex")];
                    break;
                case 0x02: // P2PKHBurn
                    this.lockScriptHash = P2PKHBurn_1.P2PKHBurn.getLockScriptHash();
                    this.parameters = [buffer_1.Buffer.from(payload.value, "hex")];
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
        var assetType = data.assetType, amount = data.amount;
        this.assetType = assetType;
        this.amount = amount;
    }
    /**
     * Create an AssetTransferOutput from an AssetTransferOutput JSON object.
     * @param data An AssetTransferOutput JSON object.
     * @returns An AssetTransferOutput.
     */
    AssetTransferOutput.fromJSON = function (data) {
        var lockScriptHash = data.lockScriptHash, parameters = data.parameters, assetType = data.assetType, amount = data.amount;
        return new this({
            lockScriptHash: codechain_primitives_1.H160.ensure(lockScriptHash),
            parameters: parameters.map(function (p) {
                return buffer_1.Buffer.from(p);
            }),
            assetType: H256_1.H256.ensure(assetType),
            amount: U64_1.U64.ensure(amount)
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetTransferOutput.prototype.toEncodeObject = function () {
        var _a = this, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, assetType = _a.assetType, amount = _a.amount;
        return [
            lockScriptHash.toEncodeObject(),
            parameters.map(function (parameter) { return buffer_1.Buffer.from(parameter); }),
            assetType.toEncodeObject(),
            amount.toEncodeObject()
        ];
    };
    /**
     * Convert to an AssetTransferOutput JSON object.
     * @returns An AssetTransferOutput JSON object.
     */
    AssetTransferOutput.prototype.toJSON = function () {
        var _a = this, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, assetType = _a.assetType, amount = _a.amount;
        return {
            lockScriptHash: lockScriptHash.value,
            parameters: parameters.map(function (parameter) { return __spread(parameter); }),
            assetType: assetType.value,
            amount: "0x" + amount.toString(16)
        };
    };
    /**
     * Get the shard ID.
     * @returns A shard ID.
     */
    AssetTransferOutput.prototype.shardId = function () {
        var assetType = this.assetType;
        return parseInt(assetType.value.slice(4, 8), 16);
    };
    return AssetTransferOutput;
}());
exports.AssetTransferOutput = AssetTransferOutput;
