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
var lib_1 = require("codechain-primitives/lib");
var _ = require("lodash");
var Asset_1 = require("../Asset");
var U64_1 = require("../U64");
var AssetTransferInput_1 = require("./AssetTransferInput");
var AssetTransferOutput_1 = require("./AssetTransferOutput");
var RLP = require("rlp");
/**
 * Decompose assets. The sum of inputs must be whole supply of the asset.
 */
var AssetDecomposeTransaction = /** @class */ (function () {
    /**
     * @param params.inputs An array of AssetTransferInput to decompose.
     * @param params.outputs An array of AssetTransferOutput to create.
     * @param params.networkId A network ID of the transaction.
     */
    function AssetDecomposeTransaction(params) {
        this.type = "assetDecompose";
        this.input = params.input;
        this.outputs = params.outputs;
        this.networkId = params.networkId;
    }
    /**
     * Create an AssetDecomposeTransaction from an AssetDecomposeTransaction JSON object.
     * @param obj An AssetDecomposeTransaction JSON object.
     * @returns An AssetDecomposeTransaction.
     */
    AssetDecomposeTransaction.fromJSON = function (obj) {
        var _a = obj.data, input = _a.input, outputs = _a.outputs, networkId = _a.networkId;
        return new this({
            input: AssetTransferInput_1.AssetTransferInput.fromJSON(input),
            outputs: outputs.map(function (o) { return AssetTransferOutput_1.AssetTransferOutput.fromJSON(o); }),
            networkId: networkId
        });
    };
    /**
     * Convert to an AssetDecomposeTransaction JSON object.
     * @returns An AssetDecomposeTransaction JSON object.
     */
    AssetDecomposeTransaction.prototype.toJSON = function () {
        var _a = this, type = _a.type, input = _a.input, outputs = _a.outputs, networkId = _a.networkId;
        return {
            type: type,
            data: {
                input: input.toJSON(),
                outputs: outputs.map(function (o) { return o.toJSON(); }),
                networkId: networkId
            }
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetDecomposeTransaction.prototype.toEncodeObject = function () {
        return [
            7,
            this.networkId,
            this.input.toEncodeObject(),
            this.outputs.map(function (o) { return o.toEncodeObject(); })
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetDecomposeTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of an AssetDecomposeTransaction.
     * @returns A transaction hash.
     */
    AssetDecomposeTransaction.prototype.hash = function () {
        return new lib_1.H256(lib_1.blake256(this.rlpBytes()));
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    AssetDecomposeTransaction.prototype.hashWithoutScript = function () {
        // Since there is only one input, the signature tag byte must be 0b00000011.
        return new lib_1.H256(lib_1.blake256WithKey(new AssetDecomposeTransaction({
            input: this.input.withoutScript(),
            outputs: this.outputs,
            networkId: this.networkId
        }).rlpBytes(), Buffer.from(lib_1.blake128(Buffer.from([3])), "hex")));
    };
    /**
     * Add AssetTransferOutputs to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * containing amount, asset type, and recipient.
     */
    AssetDecomposeTransaction.prototype.addOutputs = function (outputs) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(outputs)) {
            outputs = __spread([outputs], rest);
        }
        outputs.forEach(function (output) {
            if (output instanceof AssetTransferOutput_1.AssetTransferOutput) {
                _this.outputs.push(output);
            }
            else {
                var assetType = output.assetType, amount = output.amount, recipient = output.recipient;
                _this.outputs.push(new AssetTransferOutput_1.AssetTransferOutput({
                    recipient: lib_1.AssetTransferAddress.ensure(recipient),
                    amount: U64_1.U64.ensure(amount),
                    assetType: lib_1.H256.ensure(assetType)
                }));
            }
        });
    };
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    AssetDecomposeTransaction.prototype.getTransferredAsset = function (index) {
        if (index >= this.outputs.length) {
            throw Error("Invalid output index");
        }
        var output = this.outputs[index];
        var assetType = output.assetType, lockScriptHash = output.lockScriptHash, parameters = output.parameters, amount = output.amount;
        return new Asset_1.Asset({
            assetType: assetType,
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            amount: amount,
            transactionHash: this.hash(),
            transactionOutputIndex: index
        });
    };
    /**
     * Get the outputs of this transaction.
     * @returns An array of an Asset.
     */
    AssetDecomposeTransaction.prototype.getTransferredAssets = function () {
        var _this = this;
        return _.range(this.outputs.length).map(function (i) {
            return _this.getTransferredAsset(i);
        });
    };
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    AssetDecomposeTransaction.prototype.getAssetAddress = function (index) {
        var iv = new Uint8Array([
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            (index >> 56) & 0xff,
            (index >> 48) & 0xff,
            (index >> 40) & 0xff,
            (index >> 32) & 0xff,
            (index >> 24) & 0xff,
            (index >> 16) & 0xff,
            (index >> 8) & 0xff,
            index & 0xff
        ]);
        var shardId = this.outputs[index].shardId();
        var blake = lib_1.blake256WithKey(this.hash().value, iv);
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "4100" + shardPrefix;
        return new lib_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    return AssetDecomposeTransaction;
}());
exports.AssetDecomposeTransaction = AssetDecomposeTransaction;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
