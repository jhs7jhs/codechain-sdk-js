"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SetRegularKey = /** @class */ (function () {
    function SetRegularKey(key) {
        this.key = key;
    }
    SetRegularKey.prototype.toEncodeObject = function () {
        return [3, this.key.toEncodeObject()];
    };
    SetRegularKey.prototype.toJSON = function () {
        return {
            action: "setRegularKey",
            key: this.key.value
        };
    };
    return SetRegularKey;
}());
exports.SetRegularKey = SetRegularKey;
