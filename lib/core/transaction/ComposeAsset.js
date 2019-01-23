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
var _ = require("lodash");
var utils_1 = require("../../utils");
var Asset_1 = require("../Asset");
var AssetScheme_1 = require("../AssetScheme");
var classes_1 = require("../classes");
var Transaction_1 = require("../Transaction");
var AssetMintOutput_1 = require("./AssetMintOutput");
var RLP = require("rlp");
var ComposeAsset = /** @class */ (function (_super) {
    __extends(ComposeAsset, _super);
    function ComposeAsset(input) {
        var _this = _super.call(this, input.networkId) || this;
        _this._transaction = new AssetComposeTransaction(input);
        _this.approvals = input.approvals;
        return _this;
    }
    /**
     * Get the tracker of an AssetComposeTransaction.
     * @returns A transaction hash.
     */
    ComposeAsset.prototype.tracker = function () {
        return new classes_1.H256(utils_1.blake256(this._transaction.rlpBytes()));
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    ComposeAsset.prototype.hashWithoutScript = function (params) {
        var _a = params || {}, _b = _a.tag, tag = _b === void 0 ? { input: "all", output: "all" } : _b, _c = _a.index, index = _c === void 0 ? null : _c;
        var inputs;
        if (tag.input === "all") {
            inputs = this._transaction.inputs.map(function (input) {
                return input.withoutScript();
            });
        }
        else if (tag.input === "single") {
            if (typeof index !== "number") {
                throw Error("Unexpected value of the index: " + index);
            }
            inputs = [this._transaction.inputs[index].withoutScript()];
        }
        else {
            throw Error("Unexpected value of the tag input: " + tag.input);
        }
        var output;
        if (tag.output === "all") {
            output = this._transaction.output;
        }
        else if (Array.isArray(tag.output) && tag.output.length === 0) {
            // NOTE: An empty array is allowed only
            output = new AssetMintOutput_1.AssetMintOutput({
                lockScriptHash: new classes_1.H160("0000000000000000000000000000000000000000"),
                parameters: [],
                supply: null
            });
        }
        else {
            throw Error("Unexpected value of the tag output: " + tag.output);
        }
        var _d = this._transaction, networkId = _d.networkId, shardId = _d.shardId, metadata = _d.metadata, approver = _d.approver, administrator = _d.administrator, allowedScriptHashes = _d.allowedScriptHashes;
        return new classes_1.H256(utils_1.blake256WithKey(new AssetComposeTransaction({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            approver: approver,
            administrator: administrator,
            allowedScriptHashes: allowedScriptHashes,
            inputs: inputs,
            output: output
        }).rlpBytes(), Buffer.from(utils_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    };
    /**
     * Add an AssetTransferInput to spend.
     * @param inputs An array of either an AssetTransferInput or an Asset.
     * @returns The modified ComposeAsset.
     */
    ComposeAsset.prototype.addInputs = function (inputs) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(inputs)) {
            inputs = __spread([inputs], rest);
        }
        inputs.forEach(function (input, index) {
            if (input instanceof classes_1.AssetTransferInput) {
                _this._transaction.inputs.push(input);
            }
            else if (input instanceof Asset_1.Asset) {
                _this._transaction.inputs.push(input.createTransferInput());
            }
            else {
                throw Error("Expected an array of either AssetTransferInput or Asset but found " + input + " at " + index);
            }
        });
        return this;
    };
    ComposeAsset.prototype.input = function (index) {
        if (this._transaction.inputs.length <= index) {
            return null;
        }
        return this._transaction.inputs[index];
    };
    /**
     * Get the output of this transaction.
     * @returns An Asset.
     */
    ComposeAsset.prototype.getComposedAsset = function () {
        var _a = this._transaction.output, lockScriptHash = _a.lockScriptHash, parameters = _a.parameters, supply = _a.supply;
        if (supply === null) {
            throw Error("not implemented");
        }
        return new Asset_1.Asset({
            assetType: this.getAssetType(),
            shardId: this._transaction.shardId,
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            quantity: supply == null ? classes_1.U64.ensure(classes_1.U64.MAX_VALUE) : supply,
            tracker: this.tracker(),
            transactionOutputIndex: 0
        });
    };
    /**
     * Get the asset scheme of this transaction.
     * @return An AssetScheme.
     */
    ComposeAsset.prototype.getAssetScheme = function () {
        var _a = this._transaction, networkId = _a.networkId, shardId = _a.shardId, metadata = _a.metadata, inputs = _a.inputs, supply = _a.output.supply, approver = _a.approver, administrator = _a.administrator, allowedScriptHashes = _a.allowedScriptHashes;
        if (supply == null) {
            throw Error("not implemented");
        }
        return new AssetScheme_1.AssetScheme({
            networkId: networkId,
            shardId: shardId,
            metadata: metadata,
            supply: supply,
            approver: approver,
            administrator: administrator,
            allowedScriptHashes: allowedScriptHashes,
            pool: _.toPairs(
            // NOTE: Get the sum of each asset type
            inputs.reduce(function (acc, input) {
                var _a = input.prevOut, assetType = _a.assetType, assetQuantity = _a.quantity;
                // FIXME: Check integer overflow
                acc[assetType.value] = classes_1.U64.plus(acc[assetType.value], assetQuantity);
                return acc;
            }, {})).map(function (_a) {
                var _b = __read(_a, 2), assetType = _b[0], assetQuantity = _b[1];
                return ({
                    assetType: classes_1.H160.ensure(assetType),
                    quantity: classes_1.U64.ensure(assetQuantity)
                });
            })
        });
    };
    /**
     * Get the asset type of the output.
     * @returns An asset type which is H160.
     */
    ComposeAsset.prototype.getAssetType = function () {
        var blake = utils_1.blake160(this.tracker().value);
        return new classes_1.H160(blake);
    };
    /**
     * Get the asset address of the output.
     * @returns An asset address which is H256.
     */
    ComposeAsset.prototype.getAssetAddress = function () {
        var shardId = this._transaction.shardId;
        var blake = utils_1.blake256WithKey(this.tracker().value, new Uint8Array([
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
        return new classes_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    ComposeAsset.prototype.type = function () {
        return "composeAsset";
    };
    ComposeAsset.prototype.actionToEncodeObject = function () {
        var encoded = this._transaction.toEncodeObject();
        encoded.push(this.approvals);
        return encoded;
    };
    ComposeAsset.prototype.actionToJSON = function () {
        var json = this._transaction.toJSON();
        json.approvals = this.approvals;
        return json;
    };
    return ComposeAsset;
}(Transaction_1.Transaction));
exports.ComposeAsset = ComposeAsset;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
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
     * @param params.allowedScriptHashes Allowed lock script hashes of the asset.
     * @param params.inputs A list of inputs of the transaction.
     * @param params.output An output of the transaction.
     */
    function AssetComposeTransaction(params) {
        var networkId = params.networkId, shardId = params.shardId, metadata = params.metadata, approver = params.approver, administrator = params.administrator, allowedScriptHashes = params.allowedScriptHashes, inputs = params.inputs, output = params.output;
        this.networkId = networkId;
        this.shardId = shardId;
        this.metadata = metadata;
        this.approver =
            approver === null ? null : classes_1.PlatformAddress.ensure(approver);
        this.administrator =
            administrator === null
                ? null
                : classes_1.PlatformAddress.ensure(administrator);
        this.allowedScriptHashes = allowedScriptHashes;
        this.inputs = inputs;
        this.output = new AssetMintOutput_1.AssetMintOutput(output);
    }
    /**
     * Convert to an AssetComposeTransaction JSON object.
     * @returns An AssetComposeTransaction JSON object.
     */
    AssetComposeTransaction.prototype.toJSON = function () {
        return {
            networkId: this.networkId,
            shardId: this.shardId,
            metadata: this.metadata,
            approver: this.approver === null ? null : this.approver.toString(),
            administrator: this.administrator === null
                ? null
                : this.administrator.toString(),
            allowedScriptHashes: this.allowedScriptHashes.map(function (hash) {
                return hash.toJSON();
            }),
            output: this.output.toJSON(),
            inputs: this.inputs.map(function (input) { return input.toJSON(); })
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetComposeTransaction.prototype.toEncodeObject = function () {
        return [
            0x16,
            this.networkId,
            this.shardId,
            this.metadata,
            this.approver ? [this.approver.toString()] : [],
            this.administrator ? [this.administrator.toString()] : [],
            this.allowedScriptHashes.map(function (hash) { return hash.toEncodeObject(); }),
            this.inputs.map(function (input) { return input.toEncodeObject(); }),
            this.output.lockScriptHash.toEncodeObject(),
            this.output.parameters.map(function (parameter) { return Buffer.from(parameter); }),
            this.output.supply != null
                ? [this.output.supply.toEncodeObject()]
                : []
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetComposeTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    return AssetComposeTransaction;
}());
