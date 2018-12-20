"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var _ = require("lodash");
var utils_1 = require("../../utils");
var Text_1 = require("../Text");
var RLP = require("rlp");
var Store = /** @class */ (function () {
    function Store(params) {
        if ("secret" in params) {
            var content = params.content, secret = params.secret, networkId = params.networkId;
            this.content = content;
            this.certifier = codechain_primitives_1.PlatformAddress.fromPublic(utils_1.getPublicFromPrivate(secret.value), { networkId: networkId });
            var _a = utils_1.signEcdsa(utils_1.blake256(RLP.encode(content)), secret.value), r = _a.r, s = _a.s, v = _a.v;
            this.signature = "" + _.padStart(r, 64, "0") + _.padStart(s, 64, "0") + _.padStart(v.toString(16), 2, "0");
        }
        else {
            var content = params.content, certifier = params.certifier;
            var signature = params.signature;
            if (signature.startsWith("0x")) {
                signature = signature.substr(2);
            }
            this.content = content;
            this.certifier = certifier;
            this.signature = signature;
        }
    }
    Store.prototype.toEncodeObject = function () {
        var _a = this, content = _a.content, certifier = _a.certifier, signature = _a.signature;
        return [
            8,
            content,
            certifier.getAccountId().toEncodeObject(),
            "0x" + signature
        ];
    };
    Store.prototype.toJSON = function () {
        var _a = this, content = _a.content, certifier = _a.certifier, signature = _a.signature;
        return {
            action: "store",
            content: content,
            certifier: certifier.value,
            signature: "0x" + signature
        };
    };
    Store.prototype.getText = function () {
        var _a = this, content = _a.content, certifier = _a.certifier;
        return new Text_1.Text({
            content: content,
            certifier: certifier
        });
    };
    return Store;
}());
exports.Store = Store;
