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
Object.defineProperty(exports, "__esModule", { value: true });
var Transaction_1 = require("../Transaction");
var Custom = /** @class */ (function (_super) {
    __extends(Custom, _super);
    function Custom(params, networkId) {
        var _this = _super.call(this, networkId) || this;
        _this.handlerId = params.handlerId;
        _this.bytes = params.bytes;
        return _this;
    }
    Custom.prototype.type = function () {
        return "custom";
    };
    Custom.prototype.actionToEncodeObject = function () {
        var _a = this, handlerId = _a.handlerId, bytes = _a.bytes;
        return [0xff, handlerId.toEncodeObject(), bytes];
    };
    Custom.prototype.actionToJSON = function () {
        var _a = this, handlerId = _a.handlerId, bytes = _a.bytes;
        return {
            handlerId: handlerId.toJSON(),
            buffer: bytes
        };
    };
    return Custom;
}(Transaction_1.Transaction));
exports.Custom = Custom;
