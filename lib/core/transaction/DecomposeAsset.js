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
var classes_1 = require("../classes");
var Transaction_1 = require("../Transaction");
var RLP = require("rlp");
var DecomposeAsset = /** @class */ (function (_super) {
    __extends(DecomposeAsset, _super);
    function DecomposeAsset(input) {
        var _this = _super.call(this, input.networkId) || this;
        _this._transaction = new AssetDecomposeTransaction(input);
        _this.approvals = input.approvals;
        return _this;
    }
    /**
     * Get the tracker of an AssetDecomposeTransaction.
     * @returns A transaction tracker.
     */
    DecomposeAsset.prototype.tracker = function () {
        return new classes_1.H256(utils_1.blake256(this._transaction.rlpBytes()));
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    DecomposeAsset.prototype.hashWithoutScript = function () {
        // Since there is only one input, the signature tag byte must be 0b00000011.
        return new classes_1.H256(utils_1.blake256WithKey(new AssetDecomposeTransaction({
            input: this._transaction.input.withoutScript(),
            outputs: this._transaction.outputs,
            networkId: this._transaction.networkId
        }).rlpBytes(), Buffer.from(utils_1.blake128(Buffer.from([3])), "hex")));
    };
    DecomposeAsset.prototype.input = function (_index) {
        return this._transaction.input;
    };
    /**
     * Add AssetTransferOutputs to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * containing quantity, asset type, and recipient.
     */
    DecomposeAsset.prototype.addOutputs = function (outputs) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(outputs)) {
            outputs = __spread([outputs], rest);
        }
        outputs.forEach(function (output) {
            if (output instanceof classes_1.AssetTransferOutput) {
                _this._transaction.outputs.push(output);
            }
            else {
                var assetType = output.assetType, shardId = output.shardId, quantity = output.quantity, recipient = output.recipient;
                _this._transaction.outputs.push(new classes_1.AssetTransferOutput({
                    recipient: classes_1.AssetTransferAddress.ensure(recipient),
                    quantity: classes_1.U64.ensure(quantity),
                    assetType: classes_1.H160.ensure(assetType),
                    shardId: shardId
                }));
            }
        });
    };
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    DecomposeAsset.prototype.getTransferredAsset = function (index) {
        if (index >= this._transaction.outputs.length) {
            throw Error("Invalid output index");
        }
        var output = this._transaction.outputs[index];
        var assetType = output.assetType, shardId = output.shardId, lockScriptHash = output.lockScriptHash, parameters = output.parameters, quantity = output.quantity;
        return new classes_1.Asset({
            assetType: assetType,
            shardId: shardId,
            lockScriptHash: lockScriptHash,
            parameters: parameters,
            quantity: quantity,
            tracker: this.tracker(),
            transactionOutputIndex: index
        });
    };
    /**
     * Get the outputs of this transaction.
     * @returns An array of an Asset.
     */
    DecomposeAsset.prototype.getTransferredAssets = function () {
        var _this = this;
        return _.range(this._transaction.outputs.length).map(function (i) {
            return _this.getTransferredAsset(i);
        });
    };
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    DecomposeAsset.prototype.getAssetAddress = function (index) {
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
        var shardId = this._transaction.outputs[index].shardId;
        var blake = utils_1.blake256WithKey(this.tracker().value, iv);
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "4100" + shardPrefix;
        return new classes_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    DecomposeAsset.prototype.type = function () {
        return "decomposeAsset";
    };
    DecomposeAsset.prototype.actionToEncodeObject = function () {
        var encoded = this._transaction.toEncodeObject();
        encoded.push(this.approvals);
        return encoded;
    };
    DecomposeAsset.prototype.actionToJSON = function () {
        var json = this._transaction.toJSON();
        json.approvals = this.approvals;
        return json;
    };
    return DecomposeAsset;
}(Transaction_1.Transaction));
exports.DecomposeAsset = DecomposeAsset;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
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
        this.input = params.input;
        this.outputs = params.outputs;
        this.networkId = params.networkId;
    }
    /**
     * Convert to an AssetDecomposeTransaction JSON object.
     * @returns An AssetDecomposeTransaction JSON object.
     */
    AssetDecomposeTransaction.prototype.toJSON = function () {
        var _a = this, input = _a.input, outputs = _a.outputs, networkId = _a.networkId;
        return {
            input: input.toJSON(),
            outputs: outputs.map(function (o) { return o.toJSON(); }),
            networkId: networkId
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetDecomposeTransaction.prototype.toEncodeObject = function () {
        return [
            0x17,
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
    return AssetDecomposeTransaction;
}());
