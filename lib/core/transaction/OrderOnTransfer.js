"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var U64_1 = require("../U64");
var Order_1 = require("./Order");
var RLP = require("rlp");
var OrderOnTransfer = /** @class */ (function () {
    /**
     * @param params.order An order to apply to the transfer transaction.
     * @param data.spentAmount A spent amount of the asset to give(from) while transferring.
     * @param data.inputIndices The indices of inputs affected by the order
     * @param data.outputIndices The indices of outputs affected by the order
     */
    function OrderOnTransfer(data) {
        var order = data.order, spentAmount = data.spentAmount, inputIndices = data.inputIndices, outputIndices = data.outputIndices;
        this.order = order;
        this.spentAmount = spentAmount;
        this.inputIndices = inputIndices;
        this.outputIndices = outputIndices;
    }
    /**
     * Create an Order from an OrderJSON object.
     * @param data An OrderJSON object.
     * @returns An Order.
     */
    OrderOnTransfer.fromJSON = function (data) {
        var order = data.order, spentAmount = data.spentAmount, inputIndices = data.inputIndices, outputIndices = data.outputIndices;
        return new this({
            order: Order_1.Order.fromJSON(order),
            spentAmount: U64_1.U64.ensure(spentAmount),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        });
    };
    /**
     * Convert to an object for RLP encoding.
     */
    OrderOnTransfer.prototype.toEncodeObject = function () {
        var _a = this, order = _a.order, spentAmount = _a.spentAmount, inputIndices = _a.inputIndices, outputIndices = _a.outputIndices;
        return [
            order.toEncodeObject(),
            spentAmount.toEncodeObject(),
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
        var _a = this, order = _a.order, spentAmount = _a.spentAmount, inputIndices = _a.inputIndices, outputIndices = _a.outputIndices;
        return {
            order: order.toJSON(),
            spentAmount: spentAmount.toString(),
            inputIndices: inputIndices,
            outputIndices: outputIndices
        };
    };
    /**
     * Return a consumed order as the spentAmount.
     * @returns An Order object.
     */
    OrderOnTransfer.prototype.getConsumedOrder = function () {
        return this.order.consume(this.spentAmount);
    };
    return OrderOnTransfer;
}());
exports.OrderOnTransfer = OrderOnTransfer;
