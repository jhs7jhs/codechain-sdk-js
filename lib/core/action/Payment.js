"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Payment = /** @class */ (function () {
    function Payment(receiver, amount) {
        this.receiver = receiver;
        this.amount = amount;
    }
    Payment.prototype.toEncodeObject = function () {
        return [
            2,
            this.receiver.getAccountId().toEncodeObject(),
            this.amount.toEncodeObject()
        ];
    };
    Payment.prototype.toJSON = function () {
        return {
            action: "payment",
            receiver: this.receiver.value,
            amount: this.amount.toEncodeObject()
        };
    };
    return Payment;
}());
exports.Payment = Payment;
