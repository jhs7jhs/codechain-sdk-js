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
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var lib_1 = require("codechain-primitives/lib");
var P2PKH_1 = require("../../key/P2PKH");
var P2PKHBurn_1 = require("../../key/P2PKHBurn");
var U64_1 = require("../U64");
var AssetMintOutput = /** @class */ (function () {
    /**
     * @param data.lockScriptHash A lock script hash of the output.
     * @param data.parameters Parameters of the output.
     * @param data.amount Asset amount of the output.
     */
    function AssetMintOutput(data) {
        if ("recipient" in data) {
            // FIXME: Clean up by abstracting the standard scripts
            var _a = data.recipient, type = _a.type, payload = _a.payload;
            if ("pubkeys" in payload) {
                throw Error("Multisig payload is not supported yet");
            }
            switch (type) {
                case 0x00: // LOCK_SCRIPT_HASH ONLY
                    this.lockScriptHash = payload;
                    this.parameters = [];
                    break;
                case 0x01: // P2PKH
                    this.lockScriptHash = P2PKH_1.P2PKH.getLockScriptHash();
                    this.parameters = [buffer_1.Buffer.from(payload.value, "hex")];
                    break;
                case 0x02: // P2PKHBurn
                    this.lockScriptHash = P2PKHBurn_1.P2PKHBurn.getLockScriptHash();
                    this.parameters = [buffer_1.Buffer.from(payload.value, "hex")];
                    break;
                default:
                    throw Error("Unexpected type of AssetTransferAddress: " + type + ", " + data.recipient);
            }
        }
        else {
            var lockScriptHash = data.lockScriptHash, parameters = data.parameters;
            this.lockScriptHash = lockScriptHash;
            this.parameters = parameters;
        }
        this.amount = data.amount;
    }
    /**
     * Create an AssetMintOutput from an AssetMintOutput JSON object.
     * @param data An AssetMintOutput JSON object.
     * @returns An AssetMintOutput.
     */
    AssetMintOutput.fromJSON = function (data) {
        var lockScriptHash = data.lockScriptHash, parameters = data.parameters, amount = data.amount;
        return new this({
            lockScriptHash: lib_1.H160.ensure(lockScriptHash),
            parameters: parameters.map(function (p) { return buffer_1.Buffer.from(p); }),
            amount: amount == null ? null : U64_1.U64.ensure(amount)
        });
    };
    /**
     * Convert to an AssetMintOutput JSON object.
     * @returns An AssetMintOutput JSON object.
     */
    AssetMintOutput.prototype.toJSON = function () {
        return {
            lockScriptHash: this.lockScriptHash.value,
            parameters: this.parameters.map(function (p) { return __spread(p); }),
            amount: this.amount == null
                ? undefined
                : "0x" + this.amount.toString(16)
        };
    };
    return AssetMintOutput;
}());
exports.AssetMintOutput = AssetMintOutput;
