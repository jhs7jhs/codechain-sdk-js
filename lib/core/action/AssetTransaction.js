"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AssetTransaction = /** @class */ (function () {
    function AssetTransaction(input) {
        this.transaction = input.transaction;
        this.approvals = input.approvals;
    }
    AssetTransaction.prototype.toEncodeObject = function () {
        var transaction = this.transaction.toEncodeObject();
        var approvals = this.approvals;
        return [1, transaction, approvals];
    };
    AssetTransaction.prototype.toJSON = function () {
        return {
            action: "assetTransaction",
            transaction: this.transaction.toJSON(),
            approvals: this.approvals
        };
    };
    return AssetTransaction;
}());
exports.AssetTransaction = AssetTransaction;
