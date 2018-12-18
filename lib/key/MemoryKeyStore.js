"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var H256_1 = require("../core/H256");
var utils_1 = require("../utils");
/**
 * @hidden
 */
var KeyManager = /** @class */ (function () {
    function KeyManager(keyMaker) {
        this.privateKeyMap = {};
        this.passphraseMap = {};
        this.publicKeyMap = {};
        this.mappingKeyMaker = keyMaker;
    }
    KeyManager.prototype.getKeyList = function () {
        return Promise.resolve(_.keys(this.privateKeyMap));
    };
    KeyManager.prototype.createKey = function (params) {
        if (params === void 0) { params = {}; }
        var privateKey = utils_1.generatePrivateKey();
        var publicKey = utils_1.getPublicFromPrivate(privateKey);
        var key = this.mappingKeyMaker(publicKey);
        this.privateKeyMap[key] = privateKey;
        this.passphraseMap[key] = params.passphrase || "";
        this.publicKeyMap[key] = publicKey;
        return Promise.resolve(key);
    };
    KeyManager.prototype.removeKey = function (params) {
        var key = params.key;
        if (this.privateKeyMap[key]) {
            delete this.privateKeyMap[key];
            delete this.publicKeyMap[key];
            delete this.passphraseMap[key];
            return Promise.resolve(true);
        }
        else {
            return Promise.resolve(false);
        }
    };
    KeyManager.prototype.exportRawKey = function (params) {
        var _a = params.passphrase, passphrase = _a === void 0 ? "" : _a, key = params.key;
        if (passphrase !== this.passphraseMap[key]) {
            return Promise.reject("The passphrase does not match");
        }
        return Promise.resolve(this.privateKeyMap[key]);
    };
    KeyManager.prototype.getPublicKey = function (params) {
        var key = params.key;
        if (this.publicKeyMap[key]) {
            return Promise.resolve(this.publicKeyMap[key]);
        }
        else {
            return Promise.resolve(null);
        }
    };
    KeyManager.prototype.sign = function (params) {
        var key = params.key, message = params.message, _a = params.passphrase, passphrase = _a === void 0 ? "" : _a;
        if (passphrase !== this.passphraseMap[key]) {
            return Promise.reject("The passphrase does not match");
        }
        var _b = utils_1.signEcdsa(message, this.privateKeyMap[key]), r = _b.r, s = _b.s, v = _b.v;
        var sig = "" + _.padStart(r, 64, "0") + _.padStart(s, 64, "0") + _.padStart(v.toString(16), 2, "0");
        return Promise.resolve(sig);
    };
    return KeyManager;
}());
var MemoryKeyStore = /** @class */ (function () {
    function MemoryKeyStore() {
        this.platform = new KeyManager(utils_1.getAccountIdFromPublic);
        this.asset = new KeyManager(this.getHash);
    }
    MemoryKeyStore.prototype.getHash = function (publicKey) {
        return H256_1.H256.ensure(utils_1.blake256(publicKey)).value;
    };
    return MemoryKeyStore;
}());
exports.MemoryKeyStore = MemoryKeyStore;
