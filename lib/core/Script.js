"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var _ = require("lodash");
var Script = /** @class */ (function () {
    function Script(data) {
        this.data = buffer_1.Buffer.from(data);
    }
    /**
     * Creates empty script.
     * @returns Script
     */
    Script.empty = function () {
        return new Script(buffer_1.Buffer.from([]));
    };
    /**
     * Converts script to string tokens.
     * @returns Array of string. Each string is a Opcode name or hexadecimal
     *          string for a value
     * @throws When unknown opcode exists in the script
     * @throws When the parameter is expected but not exists
     */
    Script.prototype.toTokens = function () {
        var data = this.data;
        var tokens = [];
        var _a = Script.Opcode, NOP = _a.NOP, BURN = _a.BURN, NOT = _a.NOT, EQ = _a.EQ, JMP = _a.JMP, JNZ = _a.JNZ, JZ = _a.JZ, PUSH = _a.PUSH, POP = _a.POP, PUSHB = _a.PUSHB, DUP = _a.DUP, SWAP = _a.SWAP, COPY = _a.COPY, DROP = _a.DROP, CHKSIG = _a.CHKSIG, BLAKE256 = _a.BLAKE256, SHA256 = _a.SHA256, RIPEMD160 = _a.RIPEMD160, KECCAK256 = _a.KECCAK256, BLAKE160 = _a.BLAKE160;
        var cursor = 0;
        while (cursor < data.length) {
            var opcode = data.readUInt8(cursor++);
            var name = _.invert(Script.Opcode)[opcode];
            switch (opcode) {
                case NOP:
                case BURN:
                case NOT:
                case EQ:
                case POP:
                case DUP:
                case SWAP:
                case CHKSIG:
                case BLAKE256:
                case SHA256:
                case RIPEMD160:
                case KECCAK256:
                case BLAKE160:
                    tokens.push(name);
                    break;
                case PUSHB:
                    if (data.length < cursor + 1) {
                        throw Error("The parameter of " + name + " is expected but not exists");
                    }
                    var len = data.readUInt8(cursor++);
                    if (data.length < cursor + len) {
                        throw Error("The parameter of " + name + " is expected but not exists");
                    }
                    var blob = data.subarray(cursor, cursor + len);
                    cursor += len;
                    tokens.push(name);
                    tokens.push("0x" + buffer_1.Buffer.from(Array.from(blob))
                        .toString("hex")
                        .toUpperCase());
                    break;
                case PUSH:
                case JMP:
                case JNZ:
                case JZ:
                case COPY:
                case DROP:
                    var val = void 0;
                    try {
                        val = data.readUInt8(cursor++);
                    }
                    catch (_) {
                        throw Error("The parameter of " + name + " is expected but not exists");
                    }
                    tokens.push(name);
                    tokens.push("0x" + val.toString(16).toUpperCase());
                    break;
                default:
                    throw Error("Unknown opcode: 0x" + opcode.toString(16).toUpperCase());
            }
        }
        return tokens;
    };
    Script.Opcode = {
        NOP: 0x00,
        BURN: 0x01,
        NOT: 0x10,
        EQ: 0x11,
        JMP: 0x20,
        JNZ: 0x21,
        JZ: 0x22,
        PUSH: 0x30,
        POP: 0x31,
        PUSHB: 0x32,
        DUP: 0x33,
        SWAP: 0x34,
        COPY: 0x35,
        DROP: 0x36,
        CHKSIG: 0x80,
        BLAKE256: 0x90,
        SHA256: 0x91,
        RIPEMD160: 0x92,
        KECCAK256: 0x93,
        BLAKE160: 0x94,
        CHKTIMELOCK: 0xb0
    };
    return Script;
}());
exports.Script = Script;
