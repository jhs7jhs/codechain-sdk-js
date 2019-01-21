"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var P2PKH_1 = require("../../key/P2PKH");
var P2PKHBurn_1 = require("../../key/P2PKHBurn");
var Asset_1 = require("../Asset");
var classes_1 = require("../classes");
var Transaction_1 = require("../Transaction");
var WrapCCC = /** @class */ (function (_super) {
    __extends(WrapCCC, _super);
    function WrapCCC(data, networkId) {
        var _this = _super.call(this, networkId) || this;
        if ("recipient" in data) {
            // FIXME: Clean up by abstracting the standard scripts
            var _a = data.recipient, type = _a.type, payload = _a.payload;
            if ("pubkeys" in payload) {
                throw Error("Multisig payload is not supported yet");
            }
            switch (type) {
                case 0x00: // LOCK_SCRIPT_HASH ONLY
                    _this.lockScriptHash = payload;
                    _this.parameters = [];
                    break;
                case 0x01: // P2PKH
                    _this.lockScriptHash = P2PKH_1.P2PKH.getLockScriptHash();
                    _this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                case 0x02: // P2PKHBurn
                    _this.lockScriptHash = P2PKHBurn_1.P2PKHBurn.getLockScriptHash();
                    _this.parameters = [Buffer.from(payload.value, "hex")];
                    break;
                default:
                    throw Error("Unexpected type of AssetTransferAddress: " + type + ", " + data.recipient);
            }
        }
        else {
            var lockScriptHash = data.lockScriptHash, parameters = data.parameters;
            _this.lockScriptHash = lockScriptHash;
            _this.parameters = parameters;
        }
        var shardId = data.shardId, quantity = data.quantity;
        _this.shardId = shardId;
        _this.quantity = quantity;
        return _this;
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
        return new classes_1.H256(hash);
    };
    /**
     * Get the wrapped CCC asset output of this tx.
     * @returns An Asset.
     */
    WrapCCC.prototype.getAsset = function () {
        var _a = this, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, quantity = _a.quantity;
        return new Asset_1.Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            quantity: quantity,
            tracker: this.tracker(),
            transactionOutputIndex: 0
        });
    };
    WrapCCC.prototype.tracker = function () {
        return this.hash();
    };
    WrapCCC.prototype.type = function () {
        return "wrapCCC";
    };
    WrapCCC.prototype.actionToEncodeObject = function () {
        var _a = this, shardId = _a.shardId, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, quantity = _a.quantity;
        return [
            7,
            shardId,
            lockScriptHash.toEncodeObject(),
            parameters.map(function (parameter) { return Buffer.from(parameter); }),
            quantity.toEncodeObject()
        ];
    };
    WrapCCC.prototype.actionToJSON = function () {
        var _a = this, shardId = _a.shardId, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, quantity = _a.quantity;
        return {
            shardId: shardId,
            lockScriptHash: lockScriptHash.toJSON(),
            parameters: parameters.map(function (p) { return p.toString("hex"); }),
            quantity: quantity.toJSON()
        };
    };
    return WrapCCC;
}(Transaction_1.Transaction));
exports.WrapCCC = WrapCCC;
// FIXME: Need to move the function to the external file. Also used in AssetMintTransaction.
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
