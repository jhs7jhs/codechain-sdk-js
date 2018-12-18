"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var H256_1 = require("../H256");
var AssetTransferInput_1 = require("./AssetTransferInput");
var RLP = require("rlp");
/**
 * Spend a wrapped CCC asset and change it to CCC.
 *
 * An AssetUnwrapCCCTransaction consists of:
 *  - An AssetTransferInput of which asset type is wrapped CCC.
 *  - A network ID. This must be identical to the network ID of which the
 *  transaction is being sent to.
 *
 * All inputs must be valid for the transaction to be valid. When each asset
 * types' amount have been summed, the sum of inputs and the sum of outputs
 * must be identical.
 */
var AssetUnwrapCCCTransaction = /** @class */ (function () {
    /**
     * @param params.burn An AssetTransferInput of which asset type is wrapped CCC.
     * @param params.networkId A network ID of the transaction.
     */
    function AssetUnwrapCCCTransaction(params) {
        this.type = "assetUnwrapCCC";
        var burn = params.burn, networkId = params.networkId;
        this.burn = burn;
        this.networkId = networkId;
    }
    /** Create an AssetUnwrapCCCTransaction from an AssetUnwrapCCCTransactionJSON object.
     * @param obj An AssetUnwrapCCCTransactionJSON object.
     * @returns An AssetUnwrapCCCTransaction.
     */
    AssetUnwrapCCCTransaction.fromJSON = function (obj) {
        var _a = obj.data, networkId = _a.networkId, burn = _a.burn;
        return new this({
            burn: AssetTransferInput_1.AssetTransferInput.fromJSON(burn),
            networkId: networkId
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetUnwrapCCCTransaction.prototype.toEncodeObject = function () {
        return [1, this.networkId, this.burn.toEncodeObject()];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetUnwrapCCCTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of an AssetUnwrapCCCTransaction.
     * @returns A transaction hash.
     */
    AssetUnwrapCCCTransaction.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    AssetUnwrapCCCTransaction.prototype.hashWithoutScript = function (params) {
        var networkId = this.networkId;
        var _a = (params || {}).tag, tag = _a === void 0 ? { input: "all", output: "all" } : _a;
        if (tag.input !== "all" || tag.output !== "all") {
            throw Error("Invalid tag input: " + tag);
        }
        return new H256_1.H256(utils_1.blake256WithKey(new AssetUnwrapCCCTransaction({
            burn: this.burn.withoutScript(),
            networkId: networkId
        }).rlpBytes(), Buffer.from(utils_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    };
    /**
     * Convert to an AssetUnwrapCCCTransactionJSON object.
     * @returns An AssetUnwrapCCCTransactionJSON object.
     */
    AssetUnwrapCCCTransaction.prototype.toJSON = function () {
        var _a = this, networkId = _a.networkId, burn = _a.burn;
        return {
            type: this.type,
            data: {
                networkId: networkId,
                burn: burn.toJSON()
            }
        };
    };
    return AssetUnwrapCCCTransaction;
}());
exports.AssetUnwrapCCCTransaction = AssetUnwrapCCCTransaction;
