"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const H256_1 = require("../H256");
const AssetTransferInput_1 = require("./AssetTransferInput");
const RLP = require("rlp");
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
class AssetUnwrapCCCTransaction {
    /**
     * @param params.burn An AssetTransferInput of which asset type is wrapped CCC.
     * @param params.networkId A network ID of the transaction.
     */
    constructor(params) {
        this.type = "assetUnwrapCCC";
        const { burn, networkId } = params;
        this.burn = burn;
        this.networkId = networkId;
    }
    /** Create an AssetUnwrapCCCTransaction from an AssetUnwrapCCCTransactionJSON object.
     * @param obj An AssetUnwrapCCCTransactionJSON object.
     * @returns An AssetUnwrapCCCTransaction.
     */
    static fromJSON(obj) {
        const { data: { networkId, burn } } = obj;
        return new this({
            burn: AssetTransferInput_1.AssetTransferInput.fromJSON(burn),
            networkId
        });
    }
    /**
     * Convert to an object for RLP encoding.
     */
    toEncodeObject() {
        return [1, this.networkId, this.burn.toEncodeObject()];
    }
    /**
     * Convert to RLP bytes.
     */
    rlpBytes() {
        return RLP.encode(this.toEncodeObject());
    }
    /**
     * Get the hash of an AssetUnwrapCCCTransaction.
     * @returns A transaction hash.
     */
    hash() {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    }
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    hashWithoutScript(params) {
        const { networkId } = this;
        const { tag = { input: "all", output: "all" } } = params || {};
        if (tag.input !== "all" || tag.output !== "all") {
            throw Error(`Invalid tag input: ${tag}`);
        }
        return new H256_1.H256(utils_1.blake256WithKey(new AssetUnwrapCCCTransaction({
            burn: this.burn.withoutScript(),
            networkId
        }).rlpBytes(), Buffer.from(utils_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    }
    /**
     * Convert to an AssetUnwrapCCCTransactionJSON object.
     * @returns An AssetUnwrapCCCTransactionJSON object.
     */
    toJSON() {
        const { networkId, burn } = this;
        return {
            type: this.type,
            data: {
                networkId,
                burn: burn.toJSON()
            }
        };
    }
}
exports.AssetUnwrapCCCTransaction = AssetUnwrapCCCTransaction;
