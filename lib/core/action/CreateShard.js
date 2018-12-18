"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateShard = /** @class */ (function () {
    function CreateShard() {
    }
    CreateShard.prototype.toEncodeObject = function () {
        return [4];
    };
    CreateShard.prototype.toJSON = function () {
        return {
            action: "createShard"
        };
    };
    return CreateShard;
}());
exports.CreateShard = CreateShard;
