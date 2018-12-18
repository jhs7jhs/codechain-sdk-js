"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var H256_1 = require("../H256");
var U64_1 = require("../U64");
/**
 * AssetOutPoint consists of transactionHash and index, asset type, and amount.
 *
 * - The transaction that it points to must be either AssetMint or AssetTransfer.
 * - Index is what decides which Asset to point to amongst the Asset list that transaction creates.
 * - The asset type and amount must be identical to the Asset that it points to.
 */
var AssetOutPoint = /** @class */ (function () {
    /**
     * @param data.transactionHash A transaction hash where the Asset is created.
     * @param data.index The index in the output of the transaction.
     * @param data.assetType The asset type of the asset that it points to.
     * @param data.amount The asset amount of the asset that it points to.
     * @param data.lockScriptHash The lock script hash of the asset.
     * @param data.parameters The parameters of the asset.
     */
    function AssetOutPoint(data) {
        var transactionHash = data.transactionHash, index = data.index, assetType = data.assetType, amount = data.amount, lockScriptHash = data.lockScriptHash, parameters = data.parameters;
        this.transactionHash = transactionHash;
        this.index = index;
        this.assetType = assetType;
        this.amount = amount;
        this.lockScriptHash = lockScriptHash;
        this.parameters = parameters;
    }
    /**
     * Create an AssetOutPoint from an AssetOutPoint JSON object.
     * @param data An AssetOutPoint JSON object.
     * @returns An AssetOutPoint.
     */
    AssetOutPoint.fromJSON = function (data) {
        var transactionHash = data.transactionHash, index = data.index, assetType = data.assetType, amount = data.amount;
        return new this({
            transactionHash: new H256_1.H256(transactionHash),
            index: index,
            assetType: new H256_1.H256(assetType),
            amount: U64_1.U64.ensure(amount)
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetOutPoint.prototype.toEncodeObject = function () {
        var _a = this, transactionHash = _a.transactionHash, index = _a.index, assetType = _a.assetType, amount = _a.amount;
        return [
            transactionHash.toEncodeObject(),
            index,
            assetType.toEncodeObject(),
            amount.toEncodeObject()
        ];
    };
    /**
     * Convert to an AssetOutPoint JSON object.
     * @returns An AssetOutPoint JSON object.
     */
    AssetOutPoint.prototype.toJSON = function () {
        var _a = this, transactionHash = _a.transactionHash, index = _a.index, assetType = _a.assetType, amount = _a.amount;
        return {
            transactionHash: transactionHash.value,
            index: index,
            assetType: assetType.value,
            amount: "0x" + amount.toString(16)
        };
    };
    return AssetOutPoint;
}());
exports.AssetOutPoint = AssetOutPoint;
