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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = require("../../utils");
var Asset_1 = require("../Asset");
var classes_1 = require("../classes");
var Transaction_1 = require("../Transaction");
var AssetTransferInput_1 = require("./AssetTransferInput");
var AssetTransferOutput_1 = require("./AssetTransferOutput");
var RLP = require("rlp");
var TransferAsset = /** @class */ (function (_super) {
    __extends(TransferAsset, _super);
    function TransferAsset(input) {
        var _this = _super.call(this, input.networkId) || this;
        _this._transaction = new AssetTransferTransaction(input);
        _this.metadata = input.metadata;
        _this.approvals = input.approvals;
        return _this;
    }
    /**
     * Get the tracker of an AssetDecomposeTransaction.
     * @returns A transaction tracker.
     */
    TransferAsset.prototype.tracker = function () {
        return new classes_1.H256(utils_1.blake256(this._transaction.rlpBytes()));
    };
    /**
     * Add an AssetTransferInput to burn.
     * @param burns An array of either an AssetTransferInput or an Asset.
     * @returns The TransferAsset, which is modified by adding them.
     */
    TransferAsset.prototype.addBurns = function (burns) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(burns)) {
            burns = __spread([burns], rest);
        }
        burns.forEach(function (burn, index) {
            if (burn instanceof AssetTransferInput_1.AssetTransferInput) {
                _this._transaction.burns.push(burn);
            }
            else if (burn instanceof Asset_1.Asset) {
                _this._transaction.burns.push(burn.createTransferInput());
            }
            else {
                throw Error("Expected burn param to be either AssetTransferInput or Asset but found " + burn + " at " + index);
            }
        });
        return this;
    };
    TransferAsset.prototype.burn = function (index) {
        if (this._transaction.burns.length <= index) {
            return null;
        }
        return this._transaction.burns[index];
    };
    /**
     * Add an AssetTransferInput to spend.
     * @param inputs An array of either an AssetTransferInput or an Asset.
     * @returns The TransferAsset, which is modified by adding them.
     */
    TransferAsset.prototype.addInputs = function (inputs) {
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
                _this._transaction.inputs.push(input);
            }
            else if (input instanceof Asset_1.Asset) {
                _this._transaction.inputs.push(input.createTransferInput());
            }
            else {
                throw Error("Expected input param to be either AssetTransferInput or Asset but found " + input + " at " + index);
            }
        });
        return this;
    };
    TransferAsset.prototype.input = function (index) {
        if (this._transaction.inputs.length <= index) {
            return null;
        }
        return this._transaction.inputs[index];
    };
    /**
     * Add an AssetTransferOutput to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * that has quantity, assetType and recipient values.
     * @param output.quantity Asset quantity of the output.
     * @param output.assetType An asset type of the output.
     * @param output.recipient A recipient of the output.
     */
    TransferAsset.prototype.addOutputs = function (outputs) {
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
                _this._transaction.outputs.push(output);
            }
            else {
                var assetType = output.assetType, shardId = output.shardId, quantity = output.quantity, recipient = output.recipient;
                _this._transaction.outputs.push(new AssetTransferOutput_1.AssetTransferOutput({
                    recipient: classes_1.AssetTransferAddress.ensure(recipient),
                    quantity: classes_1.U64.ensure(quantity),
                    assetType: classes_1.H160.ensure(assetType),
                    shardId: shardId
                }));
            }
        });
        return this;
    };
    /**
     * Add an Order to create.
     * @param params.order An order to apply to the transfer transaction.
     * @param params.spentQuantity A spent quantity of the asset to give(from) while transferring.
     * @param params.inputIndices The indices of inputs affected by the order
     * @param params.outputIndices The indices of outputs affected by the order
     */
    TransferAsset.prototype.addOrder = function (params) {
        var e_1, _a;
        var order = params.order, spentQuantity = params.spentQuantity, inputIndices = params.inputIndices, outputIndices = params.outputIndices;
        if (inputIndices.length === 0) {
            throw Error("inputIndices should not be empty");
        }
        var _loop_1 = function (orderOnTx) {
            var setInputs = new Set(orderOnTx.inputIndices);
            var setOutputs = new Set(orderOnTx.outputIndices);
            var inputIntersection = __spread(new Set(inputIndices)).filter(function (x) {
                return setInputs.has(x);
            });
            var outputIntersection = __spread(new Set(outputIndices)).filter(function (x) {
                return setOutputs.has(x);
            });
            if (inputIntersection.length > 0 || outputIntersection.length > 0) {
                throw Error("inputIndices and outputIndices should not intersect with other orders: " + orderOnTx);
            }
        };
        try {
            for (var _b = __values(this._transaction.orders), _c = _b.next(); !_c.done; _c = _b.next()) {
                var orderOnTx = _c.value;
                _loop_1(orderOnTx);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._transaction.orders.push(new classes_1.OrderOnTransfer({
            order: order,
            spentQuantity: classes_1.U64.ensure(spentQuantity),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        }));
        return this;
    };
    TransferAsset.prototype.orders = function () {
        return this._transaction.orders;
    };
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    TransferAsset.prototype.getTransferredAsset = function (index) {
        if (index >= this._transaction.outputs.length) {
            throw Error("invalid output index");
        }
        var output = this._transaction.outputs[index];
        var assetType = output.assetType, shardId = output.shardId, lockScriptHash = output.lockScriptHash, parameters = output.parameters, quantity = output.quantity;
        return new Asset_1.Asset({
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
    TransferAsset.prototype.getTransferredAssets = function () {
        var _this = this;
        return _.range(this._transaction.outputs.length).map(function (i) {
            return _this.getTransferredAsset(i);
        });
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    TransferAsset.prototype.hashWithoutScript = function (params) {
        var _this = this;
        var networkId = this._transaction.networkId;
        var _a = params || {}, _b = _a.tag, tag = _b === void 0 ? { input: "all", output: "all" } : _b, _c = _a.type, type = _c === void 0 ? null : _c, _d = _a.index, index = _d === void 0 ? null : _d;
        var burns;
        var inputs;
        var outputs;
        if (this._transaction.orders.length > 0 &&
            (tag.input !== "all" || tag.output !== "all")) {
            throw Error("Partial signing is unavailable with orders");
        }
        if (tag.input === "all") {
            inputs = this._transaction.inputs.map(function (input) {
                return input.withoutScript();
            });
            burns = this._transaction.burns.map(function (input) { return input.withoutScript(); });
        }
        else if (tag.input === "single") {
            if (typeof index !== "number") {
                throw Error("Unexpected value of the index param: " + index);
            }
            if (type === "input") {
                inputs = [this._transaction.inputs[index].withoutScript()];
                burns = [];
            }
            else if (type === "burn") {
                inputs = [];
                burns = [this._transaction.burns[index].withoutScript()];
            }
            else {
                throw Error("Unexpected value of the type param: " + type);
            }
        }
        else {
            throw Error("Unexpected value of the tag input: " + tag.input);
        }
        if (tag.output === "all") {
            outputs = this._transaction.outputs;
        }
        else if (Array.isArray(tag.output)) {
            // NOTE: Remove duplicates by using Set
            outputs = Array.from(new Set(tag.output))
                .sort(function (a, b) { return a - b; })
                .map(function (i) { return _this._transaction.outputs[i]; });
        }
        else {
            throw Error("Unexpected value of the tag output: " + tag.output);
        }
        return new classes_1.H256(utils_1.blake256WithKey(new AssetTransferTransaction({
            burns: burns,
            inputs: inputs,
            outputs: outputs,
            orders: this._transaction.orders,
            networkId: networkId
        }).rlpBytes(), Buffer.from(utils_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    };
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    TransferAsset.prototype.getAssetAddress = function (index) {
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
    TransferAsset.prototype.type = function () {
        return "transferAsset";
    };
    TransferAsset.prototype.actionToEncodeObject = function () {
        var encoded = this._transaction.toEncodeObject();
        encoded.push(this.metadata);
        encoded.push(this.approvals);
        return encoded;
    };
    TransferAsset.prototype.actionToJSON = function () {
        var json = this._transaction.toJSON();
        json.metadata = this.metadata;
        json.approvals = this.approvals;
        return json;
    };
    return TransferAsset;
}(Transaction_1.Transaction));
exports.TransferAsset = TransferAsset;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
/**
 * Spends the existing asset and creates a new asset. Ownership can be transferred during this process.
 *
 * An AssetTransferTransaction consists of:
 *  - A list of AssetTransferInput to burn.
 *  - A list of AssetTransferInput to spend.
 *  - A list of AssetTransferOutput to create.
 *  - A network ID. This must be identical to the network ID of which the
 *  transaction is being sent to.
 *
 * All inputs must be valid for the transaction to be valid. When each asset
 * types' quantity have been summed, the sum of inputs and the sum of outputs
 * must be identical.
 */
var AssetTransferTransaction = /** @class */ (function () {
    /**
     * @param params.burns An array of AssetTransferInput to burn.
     * @param params.inputs An array of AssetTransferInput to spend.
     * @param params.outputs An array of AssetTransferOutput to create.
     * @param params.networkId A network ID of the transaction.
     */
    function AssetTransferTransaction(params) {
        var burns = params.burns, inputs = params.inputs, outputs = params.outputs, orders = params.orders, networkId = params.networkId;
        this.burns = burns;
        this.inputs = inputs;
        this.outputs = outputs;
        this.orders = orders;
        this.networkId = networkId;
    }
    /**
     * Convert to an AssetTransferTransaction JSON object.
     * @returns An AssetTransferTransaction JSON object.
     */
    AssetTransferTransaction.prototype.toJSON = function () {
        var _a = this, networkId = _a.networkId, burns = _a.burns, inputs = _a.inputs, outputs = _a.outputs, orders = _a.orders;
        return {
            networkId: networkId,
            burns: burns.map(function (input) { return input.toJSON(); }),
            inputs: inputs.map(function (input) { return input.toJSON(); }),
            outputs: outputs.map(function (output) { return output.toJSON(); }),
            orders: orders.map(function (order) { return order.toJSON(); })
        };
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetTransferTransaction.prototype.toEncodeObject = function () {
        return [
            0x14,
            this.networkId,
            this.burns.map(function (input) { return input.toEncodeObject(); }),
            this.inputs.map(function (input) { return input.toEncodeObject(); }),
            this.outputs.map(function (output) { return output.toEncodeObject(); }),
            this.orders.map(function (order) { return order.toEncodeObject(); })
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    AssetTransferTransaction.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    return AssetTransferTransaction;
}());
