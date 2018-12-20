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
var utils_1 = require("../../utils");
var Asset_1 = require("../Asset");
var AssetScheme_1 = require("../AssetScheme");
var U64_1 = require("../U64");
var AssetMintOutput_1 = require("./AssetMintOutput");
var AssetTransferInput_1 = require("./AssetTransferInput");
var RLP = require("rlp");
/**
 * Compose assets.
 */
var AssetComposeTransaction = /** @class */ (function () {
    /**
     * @param params.networkId A network ID of the transaction.
     * @param params.shardId A shard ID of the transaction.
     * @param params.metadata A metadata of the asset.
     * @param params.approver A approver of the asset.
     * @param params.administrator A administrator of the asset.
     * @param params.inputs A list of inputs of the transaction.
     * @param params.output An output of the transaction.
     */
    function AssetComposeTransaction(params) {
        this.type = "assetCompose";
        var networkId = params.networkId, shardId = params.shardId, metadata = params.metadata, approver = params.approver, administrator = params.administrator, inputs = params.inputs, output = params.output;
        this.networkId = networkId;
        this.shardId = shardId;
        this.metadata = metadata;
        this.approver =
            approver === null ? null : lib_1.PlatformAddress.ensure(approver);
        this.administrator =
            administrator === null
                ? null
                : lib_1.PlatformAddress.ensure(administrator);
        this.inputs = inputs;
        this.output = new AssetMintOutput_1.AssetMintOutput(output);
    }
    /**
     * Create an AssetComposeTransaction from an AssetComposeTransaction JSON object.
     * @param obj An AssetComposeTransaction JSON object.
     * @returns An AssetComposeTransaction.
     */
    AssetComposeTransaction.fromJSON = function (obj) {
        var _a = obj.data, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, inputs = _a.inputs, output = _a.output, approver = _a.approver, administrator = _a.administrator;
        return new this({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            approver: approver === null ? null : lib_1.PlatformAddress.ensure(approver),
            administrator: administrator === null
                ? null
                : lib_1.PlatformAddress.ensure(administrator),
            inputs: inputs.map(function (input) { return AssetTransferInput_1.AssetTransferInput.fromJSON(input); }),
            output: AssetMintOutput_1.AssetMintOutput.fromJSON(output)
        });
    };
    /**
     * Convert to an AssetComposeTransaction JSON object.
     * @returns An AssetComposeTransaction JSON object.
     */
    AssetComposeTransaction.prototype.toJSON = function () {
        return {
            type: this.type,
            data: {
                networkId: this.networkId,
                shardId: this.shardId,
                metadata: this.metadata,
                approver: this.approver === null ? null : this.approver.toString(),
                administrator: this.administrator === null
                    ? null
                    : this.administrator.toString(),
                output: this.output.toJSON(),
                inputs: this.inputs.map(function (input) { return input.toJSON(); })
            }
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetComposeTransaction.prototype.toEncodeObject = function () {
        return [
            6,
            this.networkId,
            this.shardId,
            this.metadata,
            this.approver ? [this.approver.toString()] : [],
            this.administrator ? [this.administrator.toString()] : [],
            this.inputs.map(function (input) { return input.toEncodeObject(); }),
            this.output.lockScriptHash.toEncodeObject(),
            this.output.parameters.map(function (parameter) { return Buffer.from(parameter); }),
            this.output.amount != null
                ? [this.output.amount.toEncodeObject()]
                : []
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetComposeTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Get the hash of an AssetComposeTransaction.
     * @returns A transaction hash.
     */
    AssetComposeTransaction.prototype.hash = function () {
        return new lib_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    AssetComposeTransaction.prototype.hashWithoutScript = function (params) {
        var _a = params || {}, _b = _a.tag, tag = _b === void 0 ? { input: "all", output: "all" } : _b, _c = _a.index, index = _c === void 0 ? null : _c;
        var inputs;
        if (tag.input === "all") {
            inputs = this.inputs.map(function (input) { return input.withoutScript(); });
        }
        else if (tag.input === "single") {
            if (typeof index !== "number") {
                throw Error("Unexpected value of the index: " + index);
            }
            inputs = [this.inputs[index].withoutScript()];
        }
        else {
            throw Error("Unexpected value of the tag input: " + tag.input);
        }
        var output;
        if (tag.output === "all") {
            output = this.output;
        }
        else if (Array.isArray(tag.output) && tag.output.length === 0) {
            // NOTE: An empty array is allowed only
            output = new AssetMintOutput_1.AssetMintOutput({
                lockScriptHash: new lib_1.H160("0000000000000000000000000000000000000000"),
                parameters: [],
                amount: null
            });
        }
        else {
            throw Error("Unexpected value of the tag output: " + tag.output);
        }
        var _d = this, networkId = _d.networkId, shardId = _d.shardId, metadata = _d.metadata, approver = _d.approver, administrator = _d.administrator;
        return new lib_1.H256(utils_1.blake256WithKey(new AssetComposeTransaction({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            approver: approver,
            administrator: administrator,
            inputs: inputs,
            output: output
        }).rlpBytes(), Buffer.from(lib_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    };
    /**
     * Add an AssetTransferInput to spend.
     * @param inputs An array of either an AssetTransferInput or an Asset.
     * @returns The modified AssetComposeTransaction.
     */
    AssetComposeTransaction.prototype.addInputs = function (inputs) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(inputs)) {
            inputs = __spread([inputs], rest);
        }
        inputs.forEach(function (input, index) {
            if (input instanceof AssetTransferInput_1.AssetTransferInput) {
                _this.inputs.push(input);
            }
            else if (input instanceof Asset_1.Asset) {
                _this.inputs.push(input.createTransferInput());
            }
            else {
                throw Error("Expected an array of either AssetTransferInput or Asset but found " + input + " at " + index);
            }
        });
        return this;
    };
    /**
     * Get the output of this transaction.
     * @returns An Asset.
     */
    AssetComposeTransaction.prototype.getComposedAsset = function () {
        var _a = this.output, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, amount = _a.amount;
        if (amount === null) {
            throw Error("not implemented");
        }
        return new Asset_1.Asset({
            assetType: this.getAssetSchemeAddress(),
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            amount: amount == null ? U64_1.U64.ensure(U64_1.U64.MAX_VALUE) : amount,
            transactionHash: this.hash(),
            transactionOutputIndex: 0
        });
    };
    /**
     * Get the asset scheme of this transaction.
     * @return An AssetScheme.
     */
    AssetComposeTransaction.prototype.getAssetScheme = function () {
        var _a = this, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, inputs = _a.inputs, amount = _a.output.amount, approver = _a.approver, administrator = _a.administrator;
        if (amount == null) {
            throw Error("not implemented");
        }
        return new AssetScheme_1.AssetScheme({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            amount: amount,
            approver: approver,
            administrator: administrator,
            pool: _.toPairs(
            // NOTE: Get the sum of each asset type
            inputs.reduce(function (acc, input) {
                var _a = input.prevOut, assetType = _a.assetType, assetAmount = _a.amount;
                // FIXME: Check integer overflow
                acc[assetType.value] = U64_1.U64.plus(acc[assetType.value], assetAmount);
                return acc;
            }, {})).map(function (_a) {
                var _b = __read(_a, 2), assetType = _b[0], assetAmount = _b[1];
                return ({
                    assetType: lib_1.H256.ensure(assetType),
                    amount: U64_1.U64.ensure(assetAmount)
                });
            })
        });
    };
    /**
     * Get the address of the asset scheme. An asset scheme address equals to an
     * asset type value.
     * @returns An asset scheme address which is H256.
     */
    AssetComposeTransaction.prototype.getAssetSchemeAddress = function () {
        var shardId = this.shardId;
        var blake = utils_1.blake256WithKey(this.hash().value, new Uint8Array([
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff,
            0xff
        ]));
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "5300" + shardPrefix;
        return new lib_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    /**
     * Get the asset address of the output.
     * @returns An asset address which is H256.
     */
    AssetComposeTransaction.prototype.getAssetAddress = function () {
        var shardId = this.shardId;
        var blake = utils_1.blake256WithKey(this.hash().value, new Uint8Array([
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00,
            0x00
        ]));
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "4100" + shardPrefix;
        return new lib_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    return AssetComposeTransaction;
}());
exports.AssetComposeTransaction = AssetComposeTransaction;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
