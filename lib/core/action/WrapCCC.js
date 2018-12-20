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
var codechain_primitives_1 = require("codechain-primitives");
var P2PKH_1 = require("../../key/P2PKH");
var P2PKHBurn_1 = require("../../key/P2PKHBurn");
var Asset_1 = require("../Asset");
var WrapCCC = /** @class */ (function () {
    function WrapCCC(data) {
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
        var shardId = data.shardId, amount = data.amount;
        this.shardId = shardId;
        this.amount = amount;
    }
    /**
     * Get the address of the asset scheme of the wrapped CCC asset. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    WrapCCC.prototype.getAssetSchemeAddress = function () {
        var shardPrefix = convertU16toHex(this.shardId);
        var prefix = "5300" + shardPrefix;
        var hash = prefix.concat("0".repeat(56));
        return new codechain_primitives_1.H256(hash);
    };
    /**
     * Get the wrapped CCC asset output of this parcel.
     * @param parcelHash A hash value of containing parcel
     * @returns An Asset.
     */
    WrapCCC.prototype.getAsset = function (parcelHash) {
        var _a = this, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, amount = _a.amount;
        return new Asset_1.Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            amount: amount,
            transactionHash: parcelHash,
            transactionOutputIndex: 0
        });
    };
    WrapCCC.prototype.toEncodeObject = function () {
        var _a = this, shardId = _a.shardId, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, amount = _a.amount;
        return [
            7,
            shardId,
            lockScriptHash.toEncodeObject(),
            parameters.map(function (parameter) { return Buffer.from(parameter); }),
            amount.toEncodeObject()
        ];
    };
    WrapCCC.prototype.toJSON = function () {
        var _a = this, shardId = _a.shardId, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, amount = _a.amount;
        return {
            action: "wrapCCC",
            shardId: shardId,
            lockScriptHash: lockScriptHash.value,
            parameters: parameters.map(function (parameter) { return __spread(parameter); }),
            amount: amount.toEncodeObject()
        };
    };
    return WrapCCC;
}());
exports.WrapCCC = WrapCCC;
// FIXME: Need to move the function to the external file. Also used in AssetMintTransaction.
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
