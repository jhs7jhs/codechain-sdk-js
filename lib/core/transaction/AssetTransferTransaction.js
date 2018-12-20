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
var codechain_primitives_1 = require("codechain-primitives");
var _ = require("lodash");
var utils_1 = require("../../utils");
var Asset_1 = require("../Asset");
var H256_1 = require("../H256");
var U64_1 = require("../U64");
var AssetTransferInput_1 = require("./AssetTransferInput");
var AssetTransferOutput_1 = require("./AssetTransferOutput");
var OrderOnTransfer_1 = require("./OrderOnTransfer");
var RLP = require("rlp");
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
 * types' amount have been summed, the sum of inputs and the sum of outputs
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
        this.type = "assetTransfer";
        var burns = params.burns, inputs = params.inputs, outputs = params.outputs, orders = params.orders, networkId = params.networkId;
        this.burns = burns;
        this.inputs = inputs;
        this.outputs = outputs;
        this.orders = orders;
        this.networkId = networkId;
    }
    /** Create an AssetTransferTransaction from an AssetTransferTransaction JSON object.
     * @param obj An AssetTransferTransaction JSON object.
     * @returns An AssetTransferTransaction.
     */
    AssetTransferTransaction.fromJSON = function (obj) {
        var _a = obj.data, networkId = _a.networkId, burns = _a.burns, inputs = _a.inputs, outputs = _a.outputs, orders = _a.orders;
        return new this({
            burns: burns.map(function (input) { return AssetTransferInput_1.AssetTransferInput.fromJSON(input); }),
            inputs: inputs.map(function (input) { return AssetTransferInput_1.AssetTransferInput.fromJSON(input); }),
            outputs: outputs.map(function (output) {
                return AssetTransferOutput_1.AssetTransferOutput.fromJSON(output);
            }),
            orders: orders.map(function (order) { return OrderOnTransfer_1.OrderOnTransfer.fromJSON(order); }),
            networkId: networkId
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    AssetTransferTransaction.prototype.toEncodeObject = function () {
        return [
            4,
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
    /**
     * Get the hash of an AssetTransferTransaction.
     * @returns A transaction hash.
     */
    AssetTransferTransaction.prototype.hash = function () {
        return new H256_1.H256(utils_1.blake256(this.rlpBytes()));
    };
    /**
     * Add an AssetTransferInput to burn.
     * @param burns An array of either an AssetTransferInput or an Asset.
     * @returns The AssetTransferTransaction, which is modified by adding them.
     */
    AssetTransferTransaction.prototype.addBurns = function (burns) {
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
                _this.burns.push(burn);
            }
            else if (burn instanceof Asset_1.Asset) {
                _this.burns.push(burn.createTransferInput());
            }
            else {
                throw Error("Expected burn param to be either AssetTransferInput or Asset but found " + burn + " at " + index);
            }
        });
        return this;
    };
    /**
     * Add an AssetTransferInput to spend.
     * @param inputs An array of either an AssetTransferInput or an Asset.
     * @returns The AssetTransferTransaction, which is modified by adding them.
     */
    AssetTransferTransaction.prototype.addInputs = function (inputs) {
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
                throw Error("Expected input param to be either AssetTransferInput or Asset but found " + input + " at " + index);
            }
        });
        return this;
    };
    /**
     * Add an AssetTransferOutput to create.
     * @param outputs An array of either an AssetTransferOutput or an object
     * that has amount, assetType and recipient values.
     * @param output.amount Asset amount of the output.
     * @param output.assetType An asset type of the output.
     * @param output.recipient A recipient of the output.
     */
    AssetTransferTransaction.prototype.addOutputs = function (outputs) {
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
                    recipient: codechain_primitives_1.AssetTransferAddress.ensure(recipient),
                    amount: U64_1.U64.ensure(amount),
                    assetType: H256_1.H256.ensure(assetType)
                }));
            }
        });
        return this;
    };
    /**
     * Add an Order to create.
     * @param params.order An order to apply to the transfer transaction.
     * @param params.spentAmount A spent amount of the asset to give(from) while transferring.
     * @param params.inputIndices The indices of inputs affected by the order
     * @param params.outputIndices The indices of outputs affected by the order
     */
    AssetTransferTransaction.prototype.addOrder = function (params) {
        var e_1, _a;
        var order = params.order, spentAmount = params.spentAmount, inputIndices = params.inputIndices, outputIndices = params.outputIndices;
        if (inputIndices.length === 0 || outputIndices.length === 0) {
            throw Error("inputIndices and outputIndices should not be empty");
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
            for (var _b = __values(this.orders), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        this.orders.push(new OrderOnTransfer_1.OrderOnTransfer({
            order: order,
            spentAmount: U64_1.U64.ensure(spentAmount),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        }));
        return this;
    };
    /**
     * Get the output of the given index, of this transaction.
     * @param index An index indicating an output.
     * @returns An Asset.
     */
    AssetTransferTransaction.prototype.getTransferredAsset = function (index) {
        if (index >= this.outputs.length) {
            throw Error("invalid output index");
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
    AssetTransferTransaction.prototype.getTransferredAssets = function () {
        var _this = this;
        return _.range(this.outputs.length).map(function (i) {
            return _this.getTransferredAsset(i);
        });
    };
    /**
     * Get a hash of the transaction that doesn't contain the scripts. The hash
     * is used as a message to create a signature for a transaction.
     * @returns A hash.
     */
    AssetTransferTransaction.prototype.hashWithoutScript = function (params) {
        var _this = this;
        var networkId = this.networkId;
        var _a = params || {}, _b = _a.tag, tag = _b === void 0 ? { input: "all", output: "all" } : _b, _c = _a.type, type = _c === void 0 ? null : _c, _d = _a.index, index = _d === void 0 ? null : _d;
        var burns;
        var inputs;
        var outputs;
        if (this.orders.length > 0 &&
            (tag.input !== "all" || tag.output !== "all")) {
            throw Error("Partial signing is unavailable with orders");
        }
        if (tag.input === "all") {
            inputs = this.inputs.map(function (input) { return input.withoutScript(); });
            burns = this.burns.map(function (input) { return input.withoutScript(); });
        }
        else if (tag.input === "single") {
            if (typeof index !== "number") {
                throw Error("Unexpected value of the index param: " + index);
            }
            if (type === "input") {
                inputs = [this.inputs[index].withoutScript()];
                burns = [];
            }
            else if (type === "burn") {
                inputs = [];
                burns = [this.burns[index].withoutScript()];
            }
            else {
                throw Error("Unexpected value of the type param: " + type);
            }
        }
        else {
            throw Error("Unexpected value of the tag input: " + tag.input);
        }
        if (tag.output === "all") {
            outputs = this.outputs;
        }
        else if (Array.isArray(tag.output)) {
            // NOTE: Remove duplicates by using Set
            outputs = Array.from(new Set(tag.output))
                .sort(function (a, b) { return a - b; })
                .map(function (i) { return _this.outputs[i]; });
        }
        else {
            throw Error("Unexpected value of the tag output: " + tag.output);
        }
        return new H256_1.H256(utils_1.blake256WithKey(new AssetTransferTransaction({
            burns: burns,
            inputs: inputs,
            outputs: outputs,
            orders: this.orders,
            networkId: networkId
        }).rlpBytes(), Buffer.from(utils_1.blake128(utils_1.encodeSignatureTag(tag)), "hex")));
    };
    /**
     * Get the asset address of an output.
     * @param index An index indicating the output.
     * @returns An asset address which is H256.
     */
    AssetTransferTransaction.prototype.getAssetAddress = function (index) {
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
        var blake = utils_1.blake256WithKey(this.hash().value, iv);
        var shardPrefix = convertU16toHex(shardId);
        var prefix = "4100" + shardPrefix;
        return new H256_1.H256(blake.replace(new RegExp("^.{" + prefix.length + "}"), prefix));
    };
    /**
     * Convert to an AssetTransferTransaction JSON object.
     * @returns An AssetTransferTransaction JSON object.
     */
    AssetTransferTransaction.prototype.toJSON = function () {
        var _a = this, networkId = _a.networkId, burns = _a.burns, inputs = _a.inputs, outputs = _a.outputs, orders = _a.orders;
        return {
            type: this.type,
            data: {
                networkId: networkId,
                burns: burns.map(function (input) { return input.toJSON(); }),
                inputs: inputs.map(function (input) { return input.toJSON(); }),
                outputs: outputs.map(function (output) { return output.toJSON(); }),
                orders: orders.map(function (order) { return order.toJSON(); })
            }
        };
    };
    return AssetTransferTransaction;
}());
exports.AssetTransferTransaction = AssetTransferTransaction;
function convertU16toHex(id) {
    var hi = ("0" + ((id >> 8) & 0xff).toString(16)).slice(-2);
    var lo = ("0" + (id & 0xff).toString(16)).slice(-2);
    return hi + lo;
}
