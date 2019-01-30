"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var U64_1 = require("../U64");
var Order_1 = require("./Order");
var RLP = require("rlp");
var OrderOnTransfer = /** @class */ (function () {
    /**
     * @param params.order An order to apply to the transfer transaction.
     * @param data.spentQuantity A spent quantity of the asset to give(from) while transferring.
     * @param data.inputIndices The indices of inputs affected by the order
     * @param data.outputIndices The indices of outputs affected by the order
     */
    function OrderOnTransfer(data) {
        var order = data.order, spentQuantity = data.spentQuantity, inputIndices = data.inputIndices, outputIndices = data.outputIndices;
        this.order = order;
        this.spentQuantity = spentQuantity;
        this.inputIndices = inputIndices;
        this.outputIndices = outputIndices;
    }
    /**
     * Create an Order from an OrderJSON object.
     * @param data An OrderJSON object.
     * @returns An Order.
     */
    OrderOnTransfer.fromJSON = function (data) {
        var order = data.order, spentQuantity = data.spentQuantity, inputIndices = data.inputIndices, outputIndices = data.outputIndices;
        return new this({
            order: Order_1.Order.fromJSON(order),
            spentQuantity: U64_1.U64.ensure(spentQuantity),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    OrderOnTransfer.prototype.toEncodeObject = function () {
        var _a = this, order = _a.order, spentQuantity = _a.spentQuantity, inputIndices = _a.inputIndices, outputIndices = _a.outputIndices;
        return [
            order.toEncodeObject(),
            spentQuantity.toEncodeObject(),
            inputIndices,
            outputIndices
        ];
    };
    /**
     * Convert to RLP bytes.
     */
    OrderOnTransfer.prototype.rlpBytes = function () {
        return RLP.encode(this.toEncodeObject());
    };
    /**
     * Convert to an OrderOnTransferJSON object.
     * @returns An OrderOnTransferJSON object.
     */
    OrderOnTransfer.prototype.toJSON = function () {
        var _a = this, order = _a.order, spentQuantity = _a.spentQuantity, inputIndices = _a.inputIndices, outputIndices = _a.outputIndices;
        return {
            order: order.toJSON(),
            spentQuantity: spentQuantity.toJSON(),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        };
    };
    /**
     * Return a consumed order as the spentQuantity.
     * @returns An Order object.
     */
    OrderOnTransfer.prototype.getConsumedOrder = function () {
        return this.order.consume(this.spentQuantity);
    };
    return OrderOnTransfer;
}());
exports.OrderOnTransfer = OrderOnTransfer;
