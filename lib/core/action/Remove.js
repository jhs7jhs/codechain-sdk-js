"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var utils_1 = require("../../utils");
var Remove = /** @class */ (function () {
    function Remove(params) {
        if ("secret" in params) {
            var hash = params.hash, secret = params.secret;
            this.hash = hash;
            var _a = utils_1.signEcdsa(hash.value, secret.value), r = _a.r, s = _a.s, v = _a.v;
            this.signature = "" + _.padStart(r, 64, "0") + _.padStart(s, 64, "0") + _.padStart(v.toString(16), 2, "0");
        }
        else {
            var signature = params.signature;
            if (signature.startsWith("0x")) {
                signature = signature.substr(2);
            }
            this.hash = params.hash;
            this.signature = signature;
        }
    }
    Remove.prototype.toEncodeObject = function () {
        var _a = this, hash = _a.hash, signature = _a.signature;
        return [9, hash.toEncodeObject(), "0x" + signature];
    };
    Remove.prototype.toJSON = function () {
        var _a = this, hash = _a.hash, signature = _a.signature;
        return {
            action: "remove",
            hash: hash.toEncodeObject(),
            signature: "0x" + signature
        };
    };
    return Remove;
}());
exports.Remove = Remove;
